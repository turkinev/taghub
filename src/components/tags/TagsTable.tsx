import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Archive,
  ArchiveRestore,
  FolderTree,
  Store,
  DollarSign,
} from "lucide-react";
import { Tag } from "@/data/mockTags";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TagsTableProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDuplicate: (tag: Tag) => void;
  onToggleArchive: (tag: Tag) => void;
}

export function TagsTable({ tags, onEdit, onDuplicate, onToggleArchive }: TagsTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-table-header px-4 py-2.5 border-b">
        <div className="grid grid-cols-[1fr_100px_110px_100px_130px_140px_50px] gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Название</span>
          <span>Владелец</span>
          <span>Видимость</span>
          <span>Ограничения</span>
          <span>Использование</span>
          <span>Обновлён</span>
          <span />
        </div>
      </div>

      {/* Rows */}
      {tags.map((tag) => {
        const isArchived = tag.status === "archived";
        return (
          <div
            key={tag.id}
            className={cn(
              "grid grid-cols-[1fr_100px_110px_100px_130px_140px_50px] gap-4 items-center px-4 py-3 border-b last:border-0 transition-colors hover:bg-table-row-hover",
              isArchived && "bg-table-row-archived opacity-60"
            )}
          >
            {/* Name + slug */}
            <div className="min-w-0">
              <p className={cn("text-sm font-medium truncate", isArchived && "line-through text-muted-foreground")}>
                {tag.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{tag.slug}</p>
            </div>

            {/* Owner type */}
            <div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  tag.ownerType === "global"
                    ? "bg-badge-global/15 text-badge-global"
                    : "bg-badge-seller/15 text-badge-seller"
                )}
              >
                {tag.ownerType === "global" ? "Global" : "Seller"}
              </span>
            </div>

            {/* Visibility */}
            <div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  tag.visibility === "public"
                    ? "bg-badge-public/15 text-badge-public"
                    : "bg-badge-service/15 text-badge-service"
                )}
              >
                {tag.visibility === "public" ? "Публичный" : "Служебный"}
              </span>
            </div>

            {/* Restrictions icons */}
            <div className="flex items-center gap-1.5">
              {tag.restrictions.categories && tag.restrictions.categories.length > 0 && (
                <span title={`Категории: ${tag.restrictions.categories.join(", ")}`}>
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                </span>
              )}
              {tag.restrictions.sellers && tag.restrictions.sellers.length > 0 && (
                <span title={`Продавцы: ${tag.restrictions.sellers.join(", ")}`}>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </span>
              )}
              {(tag.restrictions.priceMin != null || tag.restrictions.priceMax != null) && (
                <span
                  title={`Цена: ${tag.restrictions.priceMin ?? "—"} — ${tag.restrictions.priceMax ?? "—"}`}
                >
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </span>
              )}
            </div>

            {/* Usage */}
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p>{tag.productsCount} товаров</p>
              <p>{tag.collectionsCount} подборок</p>
            </div>

            {/* Updated */}
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p>{format(new Date(tag.updatedAt), "dd MMM yyyy", { locale: ru })}</p>
              <p className="truncate">{tag.updatedBy}</p>
            </div>

            {/* Actions */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 bg-popover z-50">
                  <DropdownMenuItem onClick={() => onEdit(tag)} className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(tag)} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Дублировать
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onToggleArchive(tag)}
                    className="gap-2"
                  >
                    {isArchived ? (
                      <>
                        <ArchiveRestore className="h-4 w-4" />
                        Восстановить
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4" />
                        Архивировать
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}
