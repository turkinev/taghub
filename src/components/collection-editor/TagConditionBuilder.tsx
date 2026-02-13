import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTags } from "@/data/mockTags";
import { cn } from "@/lib/utils";

export type ConditionGroupType = "MUST" | "ANY";
export type GroupLogic = "AND" | "OR";

export interface ConditionGroup {
  id: string;
  type: ConditionGroupType;
  tagIds: string[];
}

export interface TagConditions {
  groups: ConditionGroup[];
  logic: GroupLogic;
  priceMin: string;
  priceMax: string;
  rating: string[];
  template: string;
  sort: string;
}

interface TagConditionBuilderProps {
  conditions: TagConditions;
  onChange: (conditions: TagConditions) => void;
}

const activeTags = mockTags.filter((t) => t.status === "active");

export function TagConditionBuilder({ conditions: rawConditions, onChange }: TagConditionBuilderProps) {
  const conditions = {
    ...rawConditions,
    rating: Array.isArray(rawConditions.rating) ? rawConditions.rating : [],
  };
  const addGroup = () => {
    const newGroup: ConditionGroup = {
      id: `g-${Date.now()}`,
      type: "MUST",
      tagIds: [],
    };
    onChange({ ...conditions, groups: [...conditions.groups, newGroup] });
  };

  const removeGroup = (groupId: string) => {
    onChange({
      ...conditions,
      groups: conditions.groups.filter((g) => g.id !== groupId),
    });
  };

  const updateGroupType = (groupId: string, type: ConditionGroupType) => {
    onChange({
      ...conditions,
      groups: conditions.groups.map((g) =>
        g.id === groupId ? { ...g, type } : g
      ),
    });
  };

  const toggleTagInGroup = (groupId: string, tagId: string) => {
    onChange({
      ...conditions,
      groups: conditions.groups.map((g) => {
        if (g.id !== groupId) return g;
        const has = g.tagIds.includes(tagId);
        return {
          ...g,
          tagIds: has
            ? g.tagIds.filter((t) => t !== tagId)
            : [...g.tagIds, tagId],
        };
      }),
    });
  };

  const hasError = conditions.groups.length > 0 && conditions.groups.some((g) => g.tagIds.length === 0);

  return (
    <div className="space-y-4">
      {/* Groups */}
      {conditions.groups.map((group, index) => (
        <div key={group.id}>
          {/* Logic connector between groups */}
          {index > 0 && (
            <div className="flex items-center justify-center py-2">
              <div className="h-px flex-1 bg-border" />
              <Select
                value={conditions.logic}
                onValueChange={(v) =>
                  onChange({ ...conditions, logic: v as GroupLogic })
                }
              >
                <SelectTrigger className="w-20 h-7 mx-2 text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">И</SelectItem>
                  <SelectItem value="OR">ИЛИ</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}

          <div className="rounded-lg border bg-card p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
                <Select
                  value={group.type}
                  onValueChange={(v) => updateGroupType(group.id, v as ConditionGroupType)}
                >
                  <SelectTrigger className="w-28 h-7 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MUST">И (все)</SelectItem>
                    <SelectItem value="ANY">ИЛИ (любой)</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">
                  {group.type === "MUST"
                    ? "Товар должен иметь все выбранные теги"
                    : "Товар должен иметь хотя бы один тег"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removeGroup(group.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Tag selection */}
            <div className="flex flex-wrap gap-1.5">
              {activeTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={group.tagIds.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer select-none text-xs"
                  onClick={() => toggleTagInGroup(group.id, tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            {group.tagIds.length === 0 && (
              <p className="text-xs text-destructive">
                Выберите хотя бы один тег для этой группы
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Add group button */}
      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={addGroup}>
        <Plus className="h-3.5 w-3.5" />
        Добавить группу условий
      </Button>

      {/* Error hint */}
      {hasError && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Все группы условий должны содержать хотя бы один тег
        </div>
      )}

      {/* Filters grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Цена от</Label>
          <Input
            type="number"
            placeholder="Мин"
            value={conditions.priceMin}
            onChange={(e) => onChange({ ...conditions, priceMin: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Цена до</Label>
          <Input
            type="number"
            placeholder="Макс"
            value={conditions.priceMax}
            onChange={(e) => onChange({ ...conditions, priceMax: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Рейтинг</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 w-full justify-between text-sm font-normal">
                <span className="truncate">
                  {conditions.rating.length === 0
                    ? "Любой"
                    : conditions.rating.join(", ")}
                </span>
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-36 p-2 space-y-1" align="start">
              {["-1", "0", "1", "2", "3"].map((r) => {
                const checked = conditions.rating.includes(r);
                return (
                  <label key={r} className="flex items-center gap-2 cursor-pointer rounded px-2 py-1 hover:bg-accent text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => {
                        const next = checked
                          ? conditions.rating.filter((v) => v !== r)
                          : [...conditions.rating, r];
                        onChange({ ...conditions, rating: next });
                      }}
                    />
                    {r}
                  </label>
                );
              })}
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Шаблон</Label>
          <Input
            value={conditions.template}
            onChange={(e) => onChange({ ...conditions, template: e.target.value })}
            placeholder="Название шаблона"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Сортировка</Label>
          <Select
            value={conditions.sort}
            onValueChange={(v) => onChange({ ...conditions, sort: v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Ручная</SelectItem>
              <SelectItem value="popularity">По популярности</SelectItem>
              <SelectItem value="price_asc">По цене ↑</SelectItem>
              <SelectItem value="price_desc">По цене ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
