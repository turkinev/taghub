import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/layouts/AdminLayout";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualProductPicker } from "@/components/collection-editor/ManualProductPicker";
import {
  TagConditionBuilder,
  TagConditions,
} from "@/components/collection-editor/TagConditionBuilder";
import { ProductPreviewList } from "@/components/collection-editor/ProductPreviewList";
import { mockProducts, Product } from "@/data/mockProducts";
import { mockTags } from "@/data/mockTags";
import { toast } from "sonner";

type CollectionMode = "manual" | "by_tags";
type CollectionVisibility = "public" | "service";

const defaultConditions: TagConditions = {
  groups: [],
  logic: "AND",
  priceMin: "",
  priceMax: "",
  sort: "popularity",
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

export default function CollectionEditorPage() {
  const navigate = useNavigate();

  // Basic info
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<CollectionVisibility>("public");
  const [mode, setMode] = useState<CollectionMode>("manual");

  // Manual mode
  const [manualProducts, setManualProducts] = useState<Product[]>([]);

  // Tag mode
  const [conditions, setConditions] = useState<TagConditions>(defaultConditions);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) setSlug(toSlug(val));
  };

  const handleSlugChange = (val: string) => {
    setAutoSlug(false);
    setSlug(val);
  };

  // Manual product operations
  const addManualProduct = useCallback((product: Product) => {
    setManualProducts((prev) => [...prev, product]);
  }, []);

  const removeManualProduct = useCallback((productId: string) => {
    setManualProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const reorderManualProducts = useCallback((from: number, to: number) => {
    setManualProducts((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  // Tag-based preview computation
  const tagPreviewProducts = useMemo(() => {
    if (mode !== "by_tags" || conditions.groups.length === 0) return [];

    const groupResults = conditions.groups.map((group) => {
      if (group.tagIds.length === 0) return new Set<string>();

      return new Set(
        mockProducts
          .filter((p) => {
            const productTagIds = p.tags.map((t) => t.tagId);
            if (group.type === "MUST") {
              return group.tagIds.every((tid) => productTagIds.includes(tid));
            } else {
              return group.tagIds.some((tid) => productTagIds.includes(tid));
            }
          })
          .map((p) => p.id)
      );
    });

    // Combine groups with logic
    let resultIds: Set<string>;
    if (conditions.logic === "AND") {
      resultIds = groupResults.reduce((acc, set) => {
        if (set.size === 0) return acc;
        return new Set([...acc].filter((id) => set.has(id)));
      });
    } else {
      resultIds = new Set<string>();
      groupResults.forEach((set) => set.forEach((id) => resultIds.add(id)));
    }

    let result = mockProducts.filter((p) => resultIds.has(p.id));

    // Price filter
    if (conditions.priceMin) {
      const min = Number(conditions.priceMin);
      result = result.filter((p) => p.price >= min);
    }
    if (conditions.priceMax) {
      const max = Number(conditions.priceMax);
      result = result.filter((p) => p.price <= max);
    }

    // Sort
    switch (conditions.sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        result.sort((a, b) => b.tags.length - a.tags.length);
        break;
    }

    return result;
  }, [mode, conditions]);

  const previewProducts = mode === "manual" ? manualProducts : tagPreviewProducts;

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Укажите название подборки");
      return;
    }
    if (mode === "by_tags" && conditions.groups.some((g) => g.tagIds.length === 0)) {
      toast.error("Все группы условий должны содержать теги");
      return;
    }
    toast.success(`Подборка «${name}» сохранена`);
    navigate("/collections");
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/collections")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Редактор подборки
            </h1>
            <p className="text-sm text-muted-foreground">
              Настройте логику и состав подборки товаров
            </p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-[1fr_380px] gap-6 items-start">
          {/* Left column — settings */}
          <div className="space-y-6">
            {/* Basic info card */}
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <h2 className="text-sm font-semibold">Основная информация</h2>

              <div className="space-y-2">
                <Label htmlFor="col-name">Название</Label>
                <Input
                  id="col-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Название подборки"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="col-slug">URL / slug</Label>
                <Input
                  id="col-slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="url-slug"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="col-desc">Описание</Label>
                <Textarea
                  id="col-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Описание подборки"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Видимость</Label>
                <Select
                  value={visibility}
                  onValueChange={(v) => setVisibility(v as CollectionVisibility)}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Публичная</SelectItem>
                    <SelectItem value="service">Служебная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Collection mode */}
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <h2 className="text-sm font-semibold">Тип подборки</h2>

              <Tabs
                value={mode}
                onValueChange={(v) => setMode(v as CollectionMode)}
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="manual">Ручная</TabsTrigger>
                  <TabsTrigger value="by_tags">По тегам</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="mt-4">
                  <div className="h-[400px]">
                    <ManualProductPicker
                      selectedProducts={manualProducts}
                      onAdd={addManualProduct}
                      onRemove={removeManualProduct}
                      onReorder={reorderManualProducts}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="by_tags" className="mt-4">
                  <TagConditionBuilder
                    conditions={conditions}
                    onChange={setConditions}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right column — preview */}
          <div className="sticky top-20 space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <ProductPreviewList
                products={previewProducts}
                totalCount={previewProducts.length}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/collections")}
              >
                Отмена
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
