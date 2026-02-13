import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCategories, mockCategoryTree, mockTags } from "@/data/mockTags";

const mockSellers = [
  "ООО «Магазин»",
  "ИП Петров",
  "TechStore",
  "FashionHouse",
  "SportLife",
];

const mockTemplates = [
  "Шаблон 1",
  "Шаблон 2",
  "Шаблон 3",
];

export interface ProductFiltersState {
  search: string;
  category: string;
  subcategory: string;
  seller: string;
  priceMin: string;
  priceMax: string;
  productIdSearch: string;
  template: string;
  tag: string;
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
  mode: "marketer" | "seller";
}

export function ProductFilters({ filters, onChange, mode }: ProductFiltersProps) {
  const update = (key: keyof ProductFiltersState, value: string) => {
    const next = { ...filters, [key]: value };
    // Reset subcategory when category changes
    if (key === "category") {
      next.subcategory = "all";
    }
    onChange(next);
  };

  const activeTags = mockTags.filter((t) => t.status === "active");
  const selectedCategoryTree = filters.category !== "all"
    ? mockCategoryTree.find((c) => c.name === filters.category)
    : null;

  return (
    <div className="sticky top-14 z-20 -mx-4 bg-background/95 backdrop-blur-sm border-b px-4 py-3 lg:-mx-6 lg:px-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Product name search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию товара"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="pl-9 h-9 bg-card"
          />
        </div>

        {/* Product ID / SKU search */}
        <div className="relative min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="product_id / sku"
            value={filters.productIdSearch}
            onChange={(e) => update("productIdSearch", e.target.value)}
            className="pl-9 h-9 bg-card"
          />
        </div>

        {mode === "seller" && (
          <>
            {/* Template */}
            <Select value={filters.template} onValueChange={(v) => update("template", v)}>
              <SelectTrigger className="w-[150px] h-9 bg-card">
                <SelectValue placeholder="Шаблон" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все шаблоны</SelectItem>
                {mockTemplates.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tag filter */}
            <Select value={filters.tag} onValueChange={(v) => update("tag", v)}>
              <SelectTrigger className="w-[150px] h-9 bg-card">
                <SelectValue placeholder="Тег" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все теги</SelectItem>
                {activeTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {/* Category */}
        <Select value={filters.category} onValueChange={(v) => update("category", v)}>
          <SelectTrigger className="w-[150px] h-9 bg-card">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {mockCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subcategory - only when a category is selected and in seller mode */}
        {mode === "seller" && selectedCategoryTree && (
          <Select value={filters.subcategory} onValueChange={(v) => update("subcategory", v)}>
            <SelectTrigger className="w-[160px] h-9 bg-card">
              <SelectValue placeholder="Подкатегория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все подкатегории</SelectItem>
              {selectedCategoryTree.subcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Seller - marketer only */}
        {mode === "marketer" && (
          <Select value={filters.seller} onValueChange={(v) => update("seller", v)}>
            <SelectTrigger className="w-[150px] h-9 bg-card">
              <SelectValue placeholder="Продавец" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все продавцы</SelectItem>
              {mockSellers.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Price range */}
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            placeholder="Цена от"
            value={filters.priceMin}
            onChange={(e) => update("priceMin", e.target.value)}
            className="w-[100px] h-9 bg-card"
          />
          <span className="text-muted-foreground text-xs">—</span>
          <Input
            type="number"
            placeholder="до"
            value={filters.priceMax}
            onChange={(e) => update("priceMax", e.target.value)}
            className="w-[100px] h-9 bg-card"
          />
        </div>
      </div>
    </div>
  );
}
