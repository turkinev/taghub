import { useState } from "react";
import { Tags, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTags } from "@/data/mockTags";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onAssignTag: (tagId: string) => void;
  onRemoveTag: (tagId: string) => void;
  onClearSelection: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onAssignTag,
  onRemoveTag,
  onClearSelection,
}: BulkActionsToolbarProps) {
  const [assignTagId, setAssignTagId] = useState<string>("");
  const [removeTagId, setRemoveTagId] = useState<string>("");

  const activeTags = mockTags.filter((t) => t.status === "active");

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
        <div className="flex items-center gap-2">
          <Select value={assignTagId} onValueChange={setAssignTagId}>
            <SelectTrigger className="w-[160px] h-8 text-xs bg-card">
              <SelectValue placeholder="Выберите тег" />
            </SelectTrigger>
            <SelectContent>
              {activeTags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            disabled={!assignTagId}
            onClick={() => {
              onAssignTag(assignTagId);
              setAssignTagId("");
            }}
          >
            <Tags className="h-3.5 w-3.5" />
            Назначить
          </Button>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Remove tag */}
        <div className="flex items-center gap-2">
          <Select value={removeTagId} onValueChange={setRemoveTagId}>
            <SelectTrigger className="w-[160px] h-8 text-xs bg-card">
              <SelectValue placeholder="Выберите тег" />
            </SelectTrigger>
            <SelectContent>
              {activeTags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            disabled={!removeTagId}
            onClick={() => {
              onRemoveTag(removeTagId);
              setRemoveTagId("");
            }}
          >
            <Minus className="h-3.5 w-3.5" />
            Снять
          </Button>
        </div>

        <div className="ml-auto">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClearSelection}>
            Снять выделение
          </Button>
        </div>
      </div>
    </div>
  );
}
