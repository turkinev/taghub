import { useMemo, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TagsHeader } from "@/components/tags/TagsHeader";
import { TagsFilters, TagFilters } from "@/components/tags/TagsFilters";
import { TagsTable } from "@/components/tags/TagsTable";
import { TagModal, TagFormData } from "@/components/tags/TagModal";
import { TagsEmptyState } from "@/components/tags/TagsEmptyState";
import { TagsTableSkeleton } from "@/components/tags/TagsTableSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockTags, Tag } from "@/data/mockTags";
import { toast } from "sonner";

const defaultFilters: TagFilters = {
  search: "",
  visibility: "all",
  status: "active",
  sort: "updated",
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [filters, setFilters] = useState<TagFilters>(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<Tag | null>(null);

  const filteredTags = useMemo(() => {
    let result = [...tags];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }

    if (filters.visibility !== "all") {
      result = result.filter((t) => t.visibility === filters.visibility);
    }

    if (filters.status !== "all") {
      result = result.filter((t) => t.status === filters.status);
    }

    switch (filters.sort) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
        break;
      case "popularity":
        result.sort((a, b) => b.productsCount + b.collectionsCount - (a.productsCount + a.collectionsCount));
        break;
      case "updated":
      default:
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    return result;
  }, [tags, filters]);

  const handleCreate = () => {
    setEditingTag(null);
    setModalOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setModalOpen(true);
  };

  const handleDuplicate = (tag: Tag) => {
    const newTag: Tag = {
      ...tag,
      id: String(Date.now()),
      name: `${tag.name} (копия)`,
      status: "active",
      updatedAt: new Date().toISOString(),
      updatedBy: "Текущий пользователь",
    };
    setTags((prev) => [newTag, ...prev]);
    toast.success(`Тег «${tag.name}» дублирован`);
  };

  const handleToggleArchive = (tag: Tag) => {
    if (tag.status === "archived") {
      // Restore immediately
      setTags((prev) =>
        prev.map((t) =>
          t.id === tag.id
            ? { ...t, status: "active" as const, updatedAt: new Date().toISOString(), updatedBy: "Текущий пользователь" }
            : t
        )
      );
      toast.success(`Тег «${tag.name}» восстановлен`);
    } else {
      // Show confirmation dialog
      setArchiveTarget(tag);
    }
  };

  const confirmArchive = () => {
    if (!archiveTarget) return;
    setTags((prev) =>
      prev.map((t) =>
        t.id === archiveTarget.id
          ? { ...t, status: "archived" as const, updatedAt: new Date().toISOString(), updatedBy: "Текущий пользователь" }
          : t
      )
    );
    toast.success(`Тег «${archiveTarget.name}» архивирован`);
    setArchiveTarget(null);
  };

  const handleSave = (data: TagFormData) => {
    if (editingTag) {
      setTags((prev) =>
        prev.map((t) =>
          t.id === editingTag.id
            ? {
                ...t,
                name: data.name,
                description: data.description || undefined,
                visibility: data.visibility,
                restrictions: {
                  categories: data.categories.length > 0 ? data.categories : undefined,
                  priceMin: data.priceMin ? Number(data.priceMin) : undefined,
                  priceMax: data.priceMax ? Number(data.priceMax) : undefined,
                },
                updatedAt: new Date().toISOString(),
                updatedBy: "Текущий пользователь",
              }
            : t
        )
      );
      toast.success(`Тег «${data.name}» обновлён`);
    } else {
      const newTag: Tag = {
        id: String(Date.now()),
        name: data.name,
        description: data.description || undefined,
        visibility: data.visibility,
        status: "active",
        restrictions: {
          categories: data.categories.length > 0 ? data.categories : undefined,
          priceMin: data.priceMin ? Number(data.priceMin) : undefined,
          priceMax: data.priceMax ? Number(data.priceMax) : undefined,
        },
        productsCount: 0,
        collectionsCount: 0,
        updatedAt: new Date().toISOString(),
        updatedBy: "Текущий пользователь",
      };
      setTags((prev) => [newTag, ...prev]);
      toast.success(`Тег «${data.name}» создан`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-0">
        <TagsHeader onCreateClick={handleCreate} />
        <TagsFilters filters={filters} onChange={setFilters} />

        <div className="pt-4">
          {loading ? (
            <TagsTableSkeleton />
          ) : filteredTags.length === 0 ? (
            tags.length === 0 ? (
              <TagsEmptyState onCreateClick={handleCreate} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-12 px-6">
                <p className="text-sm text-muted-foreground">
                  Ничего не найдено по заданным фильтрам
                </p>
              </div>
            )
          ) : (
            <TagsTable
              tags={filteredTags}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onToggleArchive={handleToggleArchive}
            />
          )}
        </div>
      </div>

      <TagModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tag={editingTag}
        onSave={handleSave}
      />

      {/* Archive confirmation dialog */}
      <AlertDialog open={!!archiveTarget} onOpenChange={(open) => !open && setArchiveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Архивировать тег?</AlertDialogTitle>
            <AlertDialogDescription>
              Внимание! Тег будет отвязан от всех товаров и заархивирован. Вы уверены?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmArchive}>Архивировать</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
