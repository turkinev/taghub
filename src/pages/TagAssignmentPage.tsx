import { useMemo, useState, useCallback } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProductFilters, ProductFiltersState } from "@/components/tag-assignment/ProductFilters";
import { ProductsTable } from "@/components/tag-assignment/ProductsTable";
import { BulkActionsToolbar } from "@/components/tag-assignment/BulkActionsToolbar";
import { ProductTagsPanel } from "@/components/tag-assignment/ProductTagsPanel";
import { mockProducts, Product, ProductTag } from "@/data/mockProducts";
import { mockTags } from "@/data/mockTags";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PageMode = "marketer" | "seller";

const defaultFilters: ProductFiltersState = {
  search: "",
  category: "all",
  subcategory: "all",
  seller: "all",
  priceMin: "",
  priceMax: "",
  productIdSearch: "",
  template: "all",
  tag: "all",
};

const SELLER_PAGE_SIZE = 30;

export default function TagAssignmentPage() {
  const [mode, setMode] = useState<PageMode>("marketer");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState<ProductFiltersState>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (filters.productIdSearch) {
      const q = filters.productIdSearch.toLowerCase();
      result = result.filter((p) => p.productId.toLowerCase().includes(q));
    }

    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.seller !== "all") {
      result = result.filter((p) => p.seller === filters.seller);
    }

    if (filters.priceMin) {
      const min = Number(filters.priceMin);
      result = result.filter((p) => p.price >= min);
    }

    if (filters.priceMax) {
      const max = Number(filters.priceMax);
      result = result.filter((p) => p.price <= max);
    }

    // Seller-mode filters
    if (mode === "seller" && filters.tag !== "all") {
      result = result.filter((p) => p.tags.some((t) => t.tagId === filters.tag));
    }

    return result;
  }, [products, filters, mode]);

  // Pagination for seller mode
  const totalPages = mode === "seller" ? Math.max(1, Math.ceil(filteredProducts.length / SELLER_PAGE_SIZE)) : 1;
  const displayProducts = mode === "seller"
    ? filteredProducts.slice((currentPage - 1) * SELLER_PAGE_SIZE, currentPage * SELLER_PAGE_SIZE)
    : filteredProducts;

  // Reset page when filters change
  const handleFiltersChange = (newFilters: ProductFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Sync helper
  const syncTagOperation = useCallback(
    (
      currentProducts: Product[],
      targetId: string,
      operation: "add" | "remove",
      tagId: string,
      tagName?: string
    ): Product[] => {
      const target = currentProducts.find((p) => p.id === targetId);
      if (!target) return currentProducts;

      const idsToUpdate = new Set<string>([targetId]);

      if (target.type === "SPU") {
        currentProducts
          .filter((p) => p.parentSpuId === target.id)
          .forEach((p) => idsToUpdate.add(p.id));
      }
      if (target.type === "SKU" && target.parentSpuId) {
        idsToUpdate.add(target.parentSpuId);
        currentProducts
          .filter((p) => p.parentSpuId === target.parentSpuId)
          .forEach((p) => idsToUpdate.add(p.id));
      }

      return currentProducts.map((p) => {
        if (!idsToUpdate.has(p.id)) return p;

        if (operation === "add") {
          if (p.tags.some((t) => t.tagId === tagId)) return p;
          const newTag: ProductTag = {
            tagId,
            tagName: tagName || "",
            source: mode === "seller" ? "seller" : "marketer",
          };
          return { ...p, tags: [...p.tags, newTag] };
        } else {
          return { ...p, tags: p.tags.filter((t) => t.tagId !== tagId) };
        }
      });
    },
    [mode]
  );

  const handleBulkAssign = (tagId: string) => {
    const tag = mockTags.find((t) => t.id === tagId);
    if (!tag) return;

    setProducts((prev) => {
      let result = prev;
      selectedIds.forEach((id) => {
        result = syncTagOperation(result, id, "add", tagId, tag.name);
      });
      return result;
    });
    toast.success(`Тег «${tag.name}» назначен ${selectedIds.size} товарам`);
  };

  const handleBulkRemove = (tagId: string) => {
    const tag = mockTags.find((t) => t.id === tagId);
    if (!tag) return;

    setProducts((prev) => {
      let result = prev;
      selectedIds.forEach((id) => {
        result = syncTagOperation(result, id, "remove", tagId);
      });
      return result;
    });
    toast.success(`Тег «${tag.name}» снят с ${selectedIds.size} товаров`);
  };

  const handleAddTagToProduct = (productId: string, tagId: string) => {
    const tag = mockTags.find((t) => t.id === tagId);
    if (!tag) return;

    setProducts((prev) => {
      const updated = syncTagOperation(prev, productId, "add", tagId, tag.name);
      const updatedActive = updated.find((p) => p.id === productId);
      if (updatedActive) setActiveProduct(updatedActive);
      return updated;
    });
    toast.success(`Тег «${tag.name}» назначен`);
  };

  const handleRemoveTagFromProduct = (productId: string, tagId: string) => {
    setProducts((prev) => {
      const updated = syncTagOperation(prev, productId, "remove", tagId);
      const updatedActive = updated.find((p) => p.id === productId);
      if (updatedActive) setActiveProduct(updatedActive);
      return updated;
    });
    toast.success("Тег снят");
  };

  const handleProductClick = (product: Product) => {
    setActiveProduct((prev) => (prev?.id === product.id ? null : product));
  };

  const currentActiveProduct = activeProduct
    ? products.find((p) => p.id === activeProduct.id) || null
    : null;

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Назначение тегов</h1>
              <p className="text-sm text-muted-foreground">
                Назначайте теги товарам вручную или массово
                {mode === "seller" && (
                  <span className="ml-1 font-semibold text-destructive"> — не более 5 000 товаров</span>
                )}
              </p>
            </div>
            {/* Mode switcher */}
            <div className="flex items-center gap-2 rounded-md border bg-muted p-1 text-xs">
              <button
                className={cn(
                  "rounded px-2.5 py-1 transition-colors",
                  mode === "marketer" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setMode("marketer")}
              >
                Маркетолог
              </button>
              <button
                className={cn(
                  "rounded px-2.5 py-1 transition-colors",
                  mode === "seller" ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setMode("seller")}
              >
                Продавец
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters filters={filters} onChange={handleFiltersChange} mode={mode} />

        {/* Content area */}
        <div className="flex flex-1 gap-0 pt-4 min-h-0">
          <div className="flex-1 min-w-0 flex flex-col">
            {displayProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-12 px-6">
                <p className="text-sm text-muted-foreground">Товары не найдены</p>
              </div>
            ) : (
              <ProductsTable
                products={displayProducts}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onProductClick={handleProductClick}
                activeProductId={currentActiveProduct?.id}
                mode={mode}
              />
            )}

            {/* Pagination for seller mode */}
            {mode === "seller" && totalPages > 1 && (
              <div className="flex items-center justify-between px-2 py-3">
                <p className="text-xs text-muted-foreground">
                  Показано {(currentPage - 1) * SELLER_PAGE_SIZE + 1}–{Math.min(currentPage * SELLER_PAGE_SIZE, filteredProducts.length)} из {filteredProducts.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          {currentActiveProduct && (
            <ProductTagsPanel
              product={currentActiveProduct}
              onRemoveTag={handleRemoveTagFromProduct}
              onAddTag={handleAddTagToProduct}
              onClose={() => setActiveProduct(null)}
            />
          )}
        </div>

        {/* Bulk actions toolbar */}
        {selectedIds.size > 0 && (
          <BulkActionsToolbar
            selectedCount={selectedIds.size}
            onAssignTag={handleBulkAssign}
            onRemoveTag={handleBulkRemove}
            onClearSelection={() => setSelectedIds(new Set())}
          />
        )}
      </div>
    </AdminLayout>
  );
}
