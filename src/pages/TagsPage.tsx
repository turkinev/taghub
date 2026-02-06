import { useMemo, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TagsHeader } from "@/components/tags/TagsHeader";
import { TagsFilters, TagFilters } from "@/components/tags/TagsFilters";
import { TagsTable } from "@/components/tags/TagsTable";
import { TagModal, TagFormData } from "@/components/tags/TagModal";
import { TagsEmptyState } from "@/components/tags/TagsEmptyState";
import { TagsTableSkeleton } from "@/components/tags/TagsTableSkeleton";
import { mockTags, Tag } from "@/data/mockTags";
import { toast } from "sonner";

const defaultFilters: TagFilters = {
  search: "",
  ownerType: "all",
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

  // Demo loading toggle
  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const filteredTags = useMemo(() => {
    let result = [...tags];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
      );
    }

    // Owner type
    if (filters.ownerType !== "all") {
      result = result.filter((t) => t.ownerType === filters.ownerType);
    }

    // Visibility
    if (filters.visibility !== "all") {
      result = result.filter((t) => t.visibility === filters.visibility);
    }

    // Status
    if (filters.status !== "all") {
      result = result.filter((t) => t.status === filters.status);
    }

    // Sort
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
      slug: `${tag.slug}-copy`,
      status: "active",
      updatedAt: new Date().toISOString(),
      updatedBy: "Текущий пользователь",
    };
    setTags((prev) => [newTag, ...prev]);
    toast.success(`Тег «${tag.name}» дублирован`);
  };

  const handleToggleArchive = (tag: Tag) => {
    setTags((prev) =>
      prev.map((t) =>
        t.id === tag.id
          ? {
              ...t,
              status: t.status === "archived" ? "active" : "archived",
              updatedAt: new Date().toISOString(),
              updatedBy: "Текущий пользователь",
            }
          : t
      )
    );
    toast.success(
      tag.status === "archived"
        ? `Тег «${tag.name}» восстановлен`
        : `Тег «${tag.name}» архивирован`
    );
  };

  const handleSave = (data: TagFormData) => {
    if (editingTag) {
      // Update
      setTags((prev) =>
        prev.map((t) =>
          t.id === editingTag.id
            ? {
                ...t,
                name: data.name,
                slug: data.slug,
                description: data.description || undefined,
                visibility: data.visibility,
                ownerType: data.ownerType,
                restrictions: {
                  categories: data.categories.length > 0 ? data.categories : undefined,
                  sellers: data.sellers.length > 0 ? data.sellers : undefined,
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
      // Create
      const newTag: Tag = {
        id: String(Date.now()),
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        ownerType: data.ownerType,
        visibility: data.visibility,
        status: "active",
        restrictions: {
          categories: data.categories.length > 0 ? data.categories : undefined,
          sellers: data.sellers.length > 0 ? data.sellers : undefined,
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
    </AdminLayout>
  );
}
