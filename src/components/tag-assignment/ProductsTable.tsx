import { Product } from "@/data/mockProducts";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { User, Store, Zap } from "lucide-react";
import type { TagSource } from "@/data/mockProducts";

interface ProductsTableProps {
  products: Product[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onProductClick: (product: Product) => void;
  activeProductId?: string;
  mode: "marketer" | "seller";
}

const sourceIcon: Record<TagSource, React.ReactNode> = {
  marketer: <User className="h-3 w-3" />,
  seller: <Store className="h-3 w-3" />,
  rule: <Zap className="h-3 w-3" />,
};

const sourceTitle: Record<TagSource, string> = {
  marketer: "Маркетолог",
  seller: "Продавец",
  rule: "Правило",
};

export function ProductsTable({
  products,
  selectedIds,
  onSelectionChange,
  onProductClick,
  activeProductId,
  mode,
}: ProductsTableProps) {
  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const someSelected = products.some((p) => selectedIds.has(p.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(products.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const showType = mode === "marketer";
  const showSeller = mode === "seller";
  
  // marketer: checkbox, name, price, tags-col1, tags-col2, type
  // seller: checkbox, name, seller, price, tags-col1, tags-col2
  const gridTemplate = showType
    ? "40px 1fr 100px 130px 1fr 70px"
    : showSeller
      ? "40px 1fr 100px 100px 130px 1fr"
      : "40px 1fr 100px 130px 1fr";

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-table-header px-4 py-2.5 border-b">
        <div className="grid gap-3 items-center text-xs font-medium uppercase tracking-wider text-muted-foreground" style={{ gridTemplateColumns: gridTemplate }}>
          <div className="flex justify-center">
            <Checkbox
              checked={allSelected}
              ref={(el) => {
                if (el) {
                  const input = el.querySelector("button");
                  if (input) input.dataset.indeterminate = someSelected ? "true" : "false";
                }
              }}
              onCheckedChange={toggleAll}
            />
          </div>
          <span>Товар</span>
          {showSeller && <span>Продавец</span>}
          <span>Цена</span>
          <span>Теги</span>
          <span />
          {showType && <span>Тип</span>}
        </div>
      </div>

      {/* Rows */}
      {products.map((product) => {
        const isSelected = selectedIds.has(product.id);
        const isActive = activeProductId === product.id;

        return (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className={cn(
              "grid gap-3 items-center px-4 py-3 border-b last:border-0 cursor-pointer transition-colors",
              isActive
                ? "bg-primary/5 border-l-2 border-l-primary"
                : "hover:bg-table-row-hover",
              isSelected && !isActive && "bg-primary/[0.03]"
            )}
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {/* Checkbox */}
            <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleOne(product.id)}
              />
            </div>

            {/* Product name + ID */}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">
                {product.productId}
              </p>
            </div>

            {/* Seller */}
            {showSeller && (
              <div className="text-xs text-muted-foreground truncate">{product.seller}</div>
            )}

            {/* Price */}
            <div className="text-sm font-medium tabular-nums">{formatPrice(product.price)}</div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 col-span-2">
              {product.tags.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">Нет тегов</span>
              ) : (
                product.tags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                    title={`Источник: ${sourceTitle[tag.source]}`}
                  >
                    {sourceIcon[tag.source]}
                    {tag.tagName}
                  </span>
                ))
              )}
            </div>

            {/* Type - marketer only */}
            {showType && (
              <div>
                <span
                  className={cn(
                    "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    product.type === "SPU"
                      ? "bg-badge-global/15 text-badge-global"
                      : "bg-accent text-muted-foreground"
                  )}
                >
                  {product.type}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
