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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Tag, TagOwnerType, TagVisibility, mockCategories, mockSellers } from "@/data/mockTags";

interface TagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
  onSave: (data: TagFormData) => void;
}

export interface TagFormData {
  name: string;
  slug: string;
  description: string;
  visibility: TagVisibility;
  ownerType: TagOwnerType;
  categories: string[];
  sellers: string[];
  priceMin: string;
  priceMax: string;
}

const emptyForm: TagFormData = {
  name: "",
  slug: "",
  description: "",
  visibility: "public",
  ownerType: "global",
  categories: [],
  sellers: [],
  priceMin: "",
  priceMax: "",
};

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[а-яё]/gi, (ch) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
        з: "z", и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o",
        п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
        ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      };
      return map[ch.toLowerCase()] || ch;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TagModal({ open, onOpenChange, tag, onSave }: TagModalProps) {
  const [form, setForm] = useState<TagFormData>(emptyForm);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (tag) {
      setForm({
        name: tag.name,
        slug: tag.slug,
        description: tag.description || "",
        visibility: tag.visibility,
        ownerType: tag.ownerType,
        categories: tag.restrictions.categories || [],
        sellers: tag.restrictions.sellers || [],
        priceMin: tag.restrictions.priceMin?.toString() || "",
        priceMax: tag.restrictions.priceMax?.toString() || "",
      });
      setAutoSlug(false);
    } else {
      setForm(emptyForm);
      setAutoSlug(true);
    }
  }, [tag, open]);

  const updateField = <K extends keyof TagFormData>(key: K, value: TagFormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && autoSlug) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const toggleSeller = (seller: string) => {
    setForm((prev) => ({
      ...prev,
      sellers: prev.sellers.includes(seller)
        ? prev.sellers.filter((s) => s !== seller)
        : [...prev.sellers, seller],
    }));
  };

  const isValid = form.name.trim() !== "" && form.slug.trim() !== "";

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
              <Label htmlFor="tag-slug">Слаг / код *</Label>
              <Input
                id="tag-slug"
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  updateField("slug", e.target.value);
                }}
                placeholder="novinki"
                className="font-mono text-sm"
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
              <Select
                value={form.visibility}
                onValueChange={(v) => updateField("visibility", v as TagVisibility)}
              >
                <SelectTrigger className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Публичный</SelectItem>
                  <SelectItem value="service">Служебный</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Owner type */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Глобальный тег</p>
                <p className="text-xs text-muted-foreground">
                  {form.ownerType === "global"
                    ? "Доступен для всех продавцов"
                    : "Принадлежит конкретному продавцу"}
                </p>
              </div>
              <Switch
                checked={form.ownerType === "global"}
                onCheckedChange={(checked) =>
                  updateField("ownerType", checked ? "global" : "seller")
                }
              />
            </div>
          </div>

          {/* Section: Restrictions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Ограничения</h3>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Категории</Label>
              <div className="flex flex-wrap gap-1.5">
                {mockCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={form.categories.includes(cat) ? "default" : "outline"}
                    className="cursor-pointer select-none"
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                    {form.categories.includes(cat) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sellers (only for global/marketer) */}
            {form.ownerType === "global" && (
              <div className="space-y-2">
                <Label>Продавцы</Label>
                <div className="flex flex-wrap gap-1.5">
                  {mockSellers.map((seller) => (
                    <Badge
                      key={seller}
                      variant={form.sellers.includes(seller) ? "default" : "outline"}
                      className="cursor-pointer select-none"
                      onClick={() => toggleSeller(seller)}
                    >
                      {seller}
                      {form.sellers.includes(seller) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

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
