import { useMemo, useState, useCallback } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProductFilters, ProductFiltersState } from "@/components/tag-assignment/ProductFilters";
import { ProductsTable } from "@/components/tag-assignment/ProductsTable";
import { BulkActionsToolbar } from "@/components/tag-assignment/BulkActionsToolbar";
import { ProductTagsPanel } from "@/components/tag-assignment/ProductTagsPanel";
import { mockProducts, Product, ProductTag } from "@/data/mockProducts";
import { mockTags } from "@/data/mockTags";
import { toast } from "sonner";

const defaultFilters: ProductFiltersState = {
  search: "",
  category: "all",
  seller: "all",
  priceMin: "",
  priceMax: "",
  productIdSearch: "",
};

export default function TagAssignmentPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState<ProductFiltersState>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

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

    return result;
  }, [products, filters]);

  // Sync helper: when tagging an SKU, also tag the parent SPU; when tagging SPU, tag all child SKUs
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

      // SPU → all child SKUs
      if (target.type === "SPU") {
        currentProducts
          .filter((p) => p.parentSpuId === target.id)
          .forEach((p) => idsToUpdate.add(p.id));
      }
      // SKU → parent SPU
      if (target.type === "SKU" && target.parentSpuId) {
        idsToUpdate.add(target.parentSpuId);
        // Also all sibling SKUs of that SPU
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
            source: "marketer",
          };
          return { ...p, tags: [...p.tags, newTag] };
        } else {
          return { ...p, tags: p.tags.filter((t) => t.tagId !== tagId) };
        }
      });
    },
    []
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
      // Update active product ref
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

  // Keep activeProduct in sync with products state
  const currentActiveProduct = activeProduct
    ? products.find((p) => p.id === activeProduct.id) || null
    : null;

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Назначение тегов</h1>
          <p className="text-sm text-muted-foreground">
            Назначайте теги товарам вручную или массово
          </p>
        </div>

        {/* Filters */}
        <ProductFilters filters={filters} onChange={setFilters} />

        {/* Content area: table + optional side panel */}
        <div className="flex flex-1 gap-0 pt-4 min-h-0">
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-12 px-6">
                <p className="text-sm text-muted-foreground">Товары не найдены</p>
              </div>
            ) : (
              <ProductsTable
                products={filteredProducts}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onProductClick={handleProductClick}
                activeProductId={currentActiveProduct?.id}
              />
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
