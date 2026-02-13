import { useState } from "react";
import { X, User, Store, Zap, Plus, Search } from "lucide-react";
import { Product, ProductTag, TagSource } from "@/data/mockProducts";
import { mockTags } from "@/data/mockTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ProductTagsPanelProps {
  product: Product;
  onRemoveTag: (productId: string, tagId: string) => void;
  onAddTag: (productId: string, tagId: string) => void;
  onClose: () => void;
}

const sourceIcon: Record<TagSource, React.ReactNode> = {
  marketer: <User className="h-3.5 w-3.5" />,
  seller: <Store className="h-3.5 w-3.5" />,
  rule: <Zap className="h-3.5 w-3.5" />,
};

const sourceLabel: Record<TagSource, string> = {
  marketer: "Маркетолог",
  seller: "Продавец",
  rule: "Правило",
};

const sourceBg: Record<TagSource, string> = {
  marketer: "bg-badge-global/15 text-badge-global",
  seller: "bg-badge-seller/15 text-badge-seller",
  rule: "bg-badge-service/15 text-badge-service",
};

export function ProductTagsPanel({
  product,
  onRemoveTag,
  onAddTag,
  onClose,
}: ProductTagsPanelProps) {
  const [tagSearch, setTagSearch] = useState("");

  const activeTags = mockTags.filter((t) => t.status === "active");
  const assignedTagIds = new Set(product.tags.map((t) => t.tagId));
  const availableTags = activeTags.filter(
    (t) =>
      !assignedTagIds.has(t.id) &&
      (tagSearch === "" || t.name.toLowerCase().includes(tagSearch.toLowerCase()))
  );

  return (
    <div className="w-80 shrink-0 border-l bg-card overflow-y-auto admin-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">Теги товара</h3>
          <p className="text-xs text-muted-foreground truncate">{product.name}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-5">
        {/* Sync info */}
        {product.type === "SKU" && product.parentSpuId && (
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Этот SKU связан с SPU. Назначение тега на SKU автоматически назначит его на SPU.
          </div>
        )}
        {product.type === "SPU" && (
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Назначение тега на SPU применится ко всем связанным SKU.
          </div>
        )}

        {/* Assigned tags */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Назначенные теги
          </h4>
          {product.tags.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Нет назначенных тегов</p>
          ) : (
            <div className="space-y-1.5">
              {product.tags.map((tag) => (
                <div
                  key={tag.tagId}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("flex items-center justify-center rounded p-1", sourceBg[tag.source])} title={sourceLabel[tag.source]}>
                      {sourceIcon[tag.source]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{tag.tagName}</p>
                      <p className="text-[10px] text-muted-foreground">{sourceLabel[tag.source]}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveTag(product.id, tag.tagId)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add tag */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Добавить тег
          </h4>
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск тега..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 admin-scrollbar">
            {availableTags.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 text-center">
                {tagSearch ? "Ничего не найдено" : "Все теги назначены"}
              </p>
            ) : (
              availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onAddTag(product.id, tag.id)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent text-left"
                >
                  <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{tag.name}</span>
                  <span
                    className={cn(
                      "ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px]",
                      tag.visibility === "public"
                        ? "bg-badge-public/15 text-badge-public"
                        : "bg-badge-service/15 text-badge-service"
                    )}
                  >
                    {tag.visibility === "public" ? "Публичный" : "Служебный"}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
