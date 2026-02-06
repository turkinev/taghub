import { useState } from "react";
import { Search, X, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProducts, Product } from "@/data/mockProducts";
import { mockCategories } from "@/data/mockTags";
import { cn } from "@/lib/utils";

interface ManualProductPickerProps {
  selectedProducts: Product[];
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function ManualProductPicker({
  selectedProducts,
  onAdd,
  onRemove,
  onReorder,
}: ManualProductPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const selectedIds = new Set(selectedProducts.map((p) => p.id));

  const availableProducts = mockProducts.filter((p) => {
    if (selectedIds.has(p.id)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "all" && p.category !== category) return false;
    if (priceMin && p.price < Number(priceMin)) return false;
    if (priceMax && p.price > Number(priceMax)) return false;
    return true;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    onReorder(dragIndex, index);
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Left — search & add */}
      <div className="flex flex-col border rounded-lg bg-card overflow-hidden">
        <div className="p-3 border-b space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск товаров"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                {mockCategories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="От"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="h-7 w-16 text-xs"
            />
            <Input
              type="number"
              placeholder="До"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="h-7 w-16 text-xs"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto admin-scrollbar">
          {availableProducts.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground text-center">Ничего не найдено</p>
          ) : (
            availableProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onAdd(product)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent transition-colors border-b last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-xs">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {product.productId} · {formatPrice(product.price)}
                  </p>
                </div>
                <span className="text-[10px] text-primary font-medium shrink-0">+ Добавить</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right — selected products with drag */}
      <div className="flex flex-col border rounded-lg bg-card overflow-hidden">
        <div className="px-3 py-2 border-b">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Товары в подборке ({selectedProducts.length})
          </p>
        </div>
        <div className="flex-1 overflow-y-auto admin-scrollbar">
          {selectedProducts.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground text-center italic">
              Подборка пока пуста
            </p>
          ) : (
            selectedProducts.map((product, index) => (
              <div
                key={product.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 border-b last:border-0 group transition-colors",
                  dragIndex === index && "bg-accent"
                )}
              >
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab shrink-0" />
                <span className="text-[10px] text-muted-foreground w-5 text-right shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatPrice(product.price)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(product.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
