import { useState, useMemo } from "react";
import { Tags, Minus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockTags } from "@/data/mockTags";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onAssignTag: (tagId: string) => void;
  onRemoveTag: (tagId: string) => void;
  onClearSelection: () => void;
}

function TagSearchSelect({
  placeholder,
  onSelect,
  children,
}: {
  placeholder: string;
  onSelect: (tagId: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const activeTags = useMemo(() => mockTags.filter((t) => t.status === "active"), []);
  const filtered = useMemo(
    () =>
      activeTags.filter((t) =>
        search === "" || t.name.toLowerCase().includes(search.toLowerCase())
      ),
    [activeTags, search]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[220px] p-2" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-8 text-xs"
            autoFocus
          />
        </div>
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2 text-center">Ничего не найдено</p>
          ) : (
            filtered.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  onSelect(tag.id);
                  setSearch("");
                  setOpen(false);
                }}
                className="flex w-full items-center rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-accent text-left truncate"
              >
                {tag.name}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function BulkActionsToolbar({
  selectedCount,
  onAssignTag,
  onRemoveTag,
  onClearSelection,
}: BulkActionsToolbarProps) {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 lg:-mx-6">
      <div className="mx-4 lg:mx-6 mb-4 flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            {selectedCount}
          </div>
          <span className="text-muted-foreground">
            {selectedCount === 1 ? "товар выбран" : selectedCount < 5 ? "товара выбрано" : "товаров выбрано"}
          </span>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Assign tag */}
        <TagSearchSelect placeholder="Поиск тега..." onSelect={onAssignTag}>
          <Button size="sm" className="h-8 gap-1.5 text-xs">
            <Tags className="h-3.5 w-3.5" />
            Назначить тег
          </Button>
        </TagSearchSelect>

        <div className="h-5 w-px bg-border" />

        {/* Remove tag */}
        <TagSearchSelect placeholder="Поиск тега..." onSelect={onRemoveTag}>
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Minus className="h-3.5 w-3.5" />
            Снять тег
          </Button>
        </TagSearchSelect>

        <div className="ml-auto">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClearSelection}>
            Снять выделение
          </Button>
        </div>
      </div>
    </div>
  );
}
