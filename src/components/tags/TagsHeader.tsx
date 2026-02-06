import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TagsHeaderProps {
  onCreateClick: () => void;
}

export function TagsHeader({ onCreateClick }: TagsHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Теги</h1>
        <p className="text-sm text-muted-foreground">
          Создавайте и управляйте тегами для подборок и поиска
        </p>
      </div>
      <Button onClick={onCreateClick} className="gap-2 self-start sm:self-auto">
        <Plus className="h-4 w-4" />
        Создать тег
      </Button>
    </div>
  );
}
