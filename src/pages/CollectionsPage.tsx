import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  ShoppingBag,
  Hand,
  Tags,
} from "lucide-react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockCollections, Collection } from "@/data/mockCollections";

interface Filters {
  search: string;
  type: string;
}

const defaultFilters: Filters = {
  search: "",
  type: "all",
};

export default function CollectionsPage() {
  const navigate = useNavigate();
  const [collections] = useState<Collection[]>(mockCollections);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const update = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const filtered = useMemo(() => {
    let result = [...collections];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (filters.type !== "all") {
      result = result.filter((c) => c.type === filters.type);
    }

    return result;
  }, [collections, filters]);

  return (
    <AdminLayout>
      <div className="space-y-0">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Подборки товаров
            </h1>
            <p className="text-sm text-muted-foreground">
              Создавайте и управляйте подборками товаров
            </p>
          </div>
          <Button className="gap-2 self-start sm:self-auto" onClick={() => navigate("/collections/new")}>
            <Plus className="h-4 w-4" />
            Создать подборку
          </Button>
        </div>

        {/* Filters */}
        <div className="sticky top-14 z-20 -mx-4 bg-background/95 backdrop-blur-sm border-b px-4 py-3 lg:-mx-6 lg:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию"
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
                className="pl-9 h-9 bg-card"
              />
            </div>

            <Select value={filters.type} onValueChange={(v) => update("type", v)}>
              <SelectTrigger className="w-[140px] h-9 bg-card">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="global">Глобальные</SelectItem>
                <SelectItem value="seller">Продавца</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="pt-4">
          {filtered.length === 0 ? (
            collections.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-16 px-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Подборки ещё не созданы
                </h3>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                  Создайте первую подборку для организации товаров
                </p>
                <Button className="gap-2" onClick={() => navigate("/collections/new")}>
                  <Plus className="h-4 w-4" />
                  Создать подборку
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-12 px-6">
                <p className="text-sm text-muted-foreground">
                  Ничего не найдено по заданным фильтрам
                </p>
              </div>
            )
          ) : (
            <div className="rounded-lg border bg-card overflow-hidden">
              {/* Header row */}
              <div className="bg-table-header px-4 py-2.5 border-b">
                <div className="grid grid-cols-[1fr_100px_90px_100px_100px_140px_50px] gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <span>Название</span>
                  <span>Продавец</span>
                  <span>Тип</span>
                  <span>Режим</span>
                  <span>Товаров</span>
                  <span>Обновлено</span>
                  <span />
                </div>
              </div>

              {/* Data rows */}
              {filtered.map((col) => (
                <div
                  key={col.id}
                  className="grid grid-cols-[1fr_100px_90px_100px_100px_140px_50px] gap-4 items-center px-4 py-3 border-b last:border-0 transition-colors hover:bg-table-row-hover"
                >
                  {/* Name + slug */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{col.name}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{col.slug}</p>
                  </div>

                  {/* Seller */}
                  <span className="text-xs text-muted-foreground truncate">{col.seller}</span>

                  {/* Type */}
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit",
                      col.type === "global"
                        ? "bg-badge-global/15 text-badge-global"
                        : "bg-badge-seller/15 text-badge-seller"
                    )}
                  >
                    {col.type === "global" ? "Global" : "Seller"}
                  </span>

                  {/* Mode */}
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {col.mode === "manual" ? (
                      <>
                        <Hand className="h-3.5 w-3.5" />
                        Ручная
                      </>
                    ) : (
                      <>
                        <Tags className="h-3.5 w-3.5" />
                        По тегам
                      </>
                    )}
                  </span>

                  {/* Products count */}
                  <span className="text-sm tabular-nums">{col.productsCount}</span>

                  {/* Updated */}
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <p>{format(new Date(col.updatedAt), "dd MMM yyyy", { locale: ru })}</p>
                    <p className="truncate">{col.updatedBy}</p>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 bg-popover z-50">
                      <DropdownMenuItem className="gap-2" onClick={() => navigate(`/collections/${col.id}/edit`)}>
                        <Pencil className="h-4 w-4" />
                        Редактировать
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
