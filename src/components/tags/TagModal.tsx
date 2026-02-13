import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronRight } from "lucide-react";
import { Tag, TagVisibility, mockCategoryTree } from "@/data/mockTags";
import { cn } from "@/lib/utils";

interface TagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
  onSave: (data: TagFormData) => void;
}

export interface TagFormData {
  name: string;
  description: string;
  visibility: TagVisibility;
  categories: string[];
  priceMin: string;
  priceMax: string;
}

const emptyForm: TagFormData = {
  name: "",
  description: "",
  visibility: "service",
  categories: [],
  priceMin: "",
  priceMax: "",
};

export function TagModal({ open, onOpenChange, tag, onSave }: TagModalProps) {
  const [form, setForm] = useState<TagFormData>(emptyForm);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (tag) {
      setForm({
        name: tag.name,
        description: tag.description || "",
        visibility: tag.visibility,
        categories: tag.restrictions.categories || [],
        priceMin: tag.restrictions.priceMin?.toString() || "",
        priceMax: tag.restrictions.priceMax?.toString() || "",
      });
    } else {
      setForm(emptyForm);
    }
    setExpandedCategories([]);
  }, [tag, open]);

  const updateField = <K extends keyof TagFormData>(key: K, value: TagFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (cat: string) => {
    if (form.categories.length >= 10 && !form.categories.includes(cat)) return;
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const toggleExpanded = (catName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const isValid = form.name.trim() !== "";

  const handleSave = () => {
    if (isValid) {
      onSave(form);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-popover">
        <DialogHeader>
          <DialogTitle>{tag ? "Редактировать тег" : "Создать тег"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Section: Main info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Основная информация</h3>

            <div className="space-y-2">
              <Label htmlFor="tag-name">Название *</Label>
              <Input
                id="tag-name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Например: Новинки"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-desc">Описание</Label>
              <Textarea
                id="tag-desc"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Необязательное описание тега"
                rows={2}
              />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label>Видимость</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={form.visibility === "service" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateField("visibility", "service")}
                >
                  Служебный
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  className="opacity-50"
                  title="Публичный тип пока недоступен"
                >
                  Публичный
                </Button>
              </div>
            </div>
          </div>

          {/* Section: Restrictions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Ограничения</h3>

            {/* Categories with subcategories */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Категории</Label>
                <span className="text-xs text-muted-foreground">{form.categories.length}/10</span>
              </div>

              {/* Selected categories */}
              {form.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.categories.map((cat) => (
                    <Badge key={cat} variant="default" className="cursor-pointer select-none" onClick={() => toggleCategory(cat)}>
                      {cat}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Category tree */}
              <div className="rounded-md border max-h-[240px] overflow-y-auto">
                {mockCategoryTree.map((cat) => {
                  const isExpanded = expandedCategories.includes(cat.name);
                  const isParentSelected = form.categories.includes(cat.name);
                  const selectedSubs = cat.subcategories.filter((s) => form.categories.includes(s));
                  
                  return (
                    <div key={cat.name} className="border-b last:border-0">
                      <div className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(cat.name)}
                          className="shrink-0"
                        >
                          <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                        </button>
                        <Checkbox
                          checked={isParentSelected}
                          onCheckedChange={() => toggleCategory(cat.name)}
                          disabled={form.categories.length >= 10 && !isParentSelected}
                        />
                        <span className="text-sm flex-1 cursor-pointer" onClick={() => toggleExpanded(cat.name)}>
                          {cat.name}
                        </span>
                        {selectedSubs.length > 0 && (
                          <span className="text-xs text-muted-foreground">{selectedSubs.length} выбр.</span>
                        )}
                      </div>
                      {isExpanded && (
                        <div className="pl-10 pb-1">
                          {cat.subcategories.map((sub) => {
                            const fullName = sub;
                            const isSelected = form.categories.includes(fullName);
                            return (
                              <div key={sub} className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 transition-colors">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleCategory(fullName)}
                                  disabled={form.categories.length >= 10 && !isSelected}
                                />
                                <span className="text-sm">{sub}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price-min">Цена мин</Label>
                <Input
                  id="price-min"
                  type="number"
                  value={form.priceMin}
                  onChange={(e) => updateField("priceMin", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price-max">Цена макс</Label>
                <Input
                  id="price-max"
                  type="number"
                  value={form.priceMax}
                  onChange={(e) => updateField("priceMax", e.target.value)}
                  placeholder="∞"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
