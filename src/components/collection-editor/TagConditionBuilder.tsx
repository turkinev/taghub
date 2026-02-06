import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
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
  sort: string;
}

interface TagConditionBuilderProps {
  conditions: TagConditions;
  onChange: (conditions: TagConditions) => void;
}

const activeTags = mockTags.filter((t) => t.status === "active");

export function TagConditionBuilder({ conditions, onChange }: TagConditionBuilderProps) {
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
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
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
                    <SelectItem value="MUST">MUST (все)</SelectItem>
                    <SelectItem value="ANY">ANY (любой)</SelectItem>
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

      {/* Price filter */}
      <div className="space-y-2 pt-2 border-t">
        <Label className="text-xs font-semibold">Фильтр по цене</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Мин"
            value={conditions.priceMin}
            onChange={(e) => onChange({ ...conditions, priceMin: e.target.value })}
            className="h-8 text-sm"
          />
          <span className="text-muted-foreground text-xs">—</span>
          <Input
            type="number"
            placeholder="Макс"
            value={conditions.priceMax}
            onChange={(e) => onChange({ ...conditions, priceMax: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
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
  );
}
