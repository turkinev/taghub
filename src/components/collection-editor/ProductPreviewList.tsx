import { Product } from "@/data/mockProducts";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProductPreviewListProps {
  products: Product[];
  totalCount: number;
}

const PAGE_SIZE = 5;

export function ProductPreviewList({ products, totalCount }: ProductPreviewListProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pageProducts = products.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-8 w-8 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Подборка пока пуста</p>
        <p className="text-xs text-muted-foreground mt-1">
          Добавьте товары вручную или настройте условия
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Превью товаров
        </p>
        <span className="text-xs text-muted-foreground">
          Найдено: <span className="font-semibold text-foreground">{totalCount}</span>
        </span>
      </div>

      <div className="space-y-1">
        {pageProducts.map((product, i) => (
          <div
            key={product.id}
            className="flex items-center gap-3 rounded-md border px-3 py-2"
          >
            <span className="text-[10px] text-muted-foreground w-4 text-right shrink-0">
              {page * PAGE_SIZE + i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {product.productId} · {product.seller}
              </p>
            </div>
            <span className="text-sm font-medium tabular-nums shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
