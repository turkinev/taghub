import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TagFilters {
  search: string;
  visibility: string;
  status: string;
  sort: string;
}

interface TagsFiltersProps {
  filters: TagFilters;
  onChange: (filters: TagFilters) => void;
}

export function TagsFilters({ filters, onChange }: TagsFiltersProps) {
  const update = (key: keyof TagFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="sticky top-14 z-20 -mx-4 bg-background/95 backdrop-blur-sm border-b px-4 py-3 lg:-mx-6 lg:px-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="pl-9 h-9 bg-card"
          />
        </div>

        {/* Visibility */}
        <Select value={filters.visibility} onValueChange={(v) => update("visibility", v)}>
          <SelectTrigger className="w-[140px] h-9 bg-card">
            <SelectValue placeholder="Видимость" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="public">Публичные</SelectItem>
            <SelectItem value="service">Служебные</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={filters.status} onValueChange={(v) => update("status", v)}>
          <SelectTrigger className="w-[130px] h-9 bg-card">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
            <SelectItem value="all">Все</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={filters.sort} onValueChange={(v) => update("sort", v)}>
          <SelectTrigger className="w-[200px] h-9 bg-card">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">По дате изменения</SelectItem>
            <SelectItem value="name">По названию А–Я</SelectItem>
            <SelectItem value="popularity">По популярности</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
