import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
  categories: string[];
  subcategories: string[];
  seller: string;
  priceMin: string;
  priceMax: string;
  ratingMin: string;
  ratingMax: string;
  productIdSearch: string;
  template: string;
  tag: string;
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
  onApply: () => void;
  mode: "marketer" | "seller";
}

function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  const toggle = (val: string) => {
    onChange(
      selected.includes(val) ? selected.filter((s) => s !== val) : [...selected, val]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 h-9 px-3 rounded-md border bg-card text-sm min-w-[150px] max-w-[220px] hover:bg-accent/50 transition-colors">
          <span className="truncate text-left flex-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{label}</span>
            ) : (
              <span className="flex items-center gap-1">
                {label}
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                  {selected.length}
                </Badge>
              </span>
            )}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            ref={inputRef}
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto p-1">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">Ничего не найдено</p>
          )}
          {filtered.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer text-sm"
            >
              <Checkbox
                checked={selected.includes(option)}
                onCheckedChange={() => toggle(option)}
              />
              <span className="truncate">{option}</span>
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="border-t p-1.5">
            <button
              className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
              onClick={() => onChange([])}
            >
              Сбросить
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function ProductFilters({ filters, onChange, onApply, mode }: ProductFiltersProps) {
  const update = (key: keyof ProductFiltersState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const activeTags = mockTags.filter((t) => t.status === "active");

  // Collect available subcategories based on selected categories
  const availableSubcategories = filters.categories && filters.categories.length > 0
    ? mockCategoryTree
        .filter((c) => filters.categories.includes(c.name))
        .flatMap((c) => c.subcategories)
    : [];

  const handleCategoriesChange = (cats: string[]) => {
    const validSubs = cats.length > 0
      ? (filters.subcategories || []).filter((sub) =>
          mockCategoryTree.some((c) => cats.includes(c.name) && c.subcategories.includes(sub))
        )
      : [];
    onChange({ ...filters, categories: cats, subcategories: validSubs });
  };

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

        {/* Categories multi-select */}
        <MultiSelectFilter
          label="Категория"
          options={mockCategories}
          selected={filters.categories || []}
          onChange={handleCategoriesChange}
        />

        {/* Subcategories multi-select */}
        {availableSubcategories.length > 0 && (
          <MultiSelectFilter
            label="Подкатегория"
            options={availableSubcategories}
            selected={filters.subcategories || []}
            onChange={(subs) => onChange({ ...filters, subcategories: subs })}
          />
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

        {/* Rating range */}
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            placeholder="Рейтинг от"
            value={filters.ratingMin}
            onChange={(e) => update("ratingMin", e.target.value)}
            className="w-[110px] h-9 bg-card"
            min="0"
            max="5"
            step="0.1"
          />
          <span className="text-muted-foreground text-xs">—</span>
          <Input
            type="number"
            placeholder="до"
            value={filters.ratingMax}
            onChange={(e) => update("ratingMax", e.target.value)}
            className="w-[80px] h-9 bg-card"
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* Apply button */}
        <Button size="sm" className="h-9 px-5" onClick={onApply}>
          Показать
        </Button>
      </div>
    </div>
  );
}
