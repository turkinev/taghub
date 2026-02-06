import { Tags, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TagsEmptyStateProps {
  onCreateClick: () => void;
}

export function TagsEmptyState({ onCreateClick }: TagsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-16 px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
        <Tags className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Теги ещё не созданы</h3>
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
        Создайте первый тег для организации товаров и подборок
      </p>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="h-4 w-4" />
        Создать тег
      </Button>
    </div>
  );
}
