import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCategories } from "@/data/mockTags";

const mockSellers = [
  "ООО «Магазин»",
  "ИП Петров",
  "TechStore",
  "FashionHouse",
  "SportLife",
];

export interface ProductFiltersState {
  search: string;
  category: string;
  seller: string;
  priceMin: string;
  priceMax: string;
  productIdSearch: string;
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const update = (key: keyof ProductFiltersState, value: string) => {
    onChange({ ...filters, [key]: value });
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

        {/* Seller */}
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
