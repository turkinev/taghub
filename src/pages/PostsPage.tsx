import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, MessageSquare, Image as ImageIcon } from "lucide-react";
import { loadPosts, deletePost, type Post } from "@/data/postsStorage";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(() => loadPosts());
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = q ? posts.filter((p) => p.text.toLowerCase().includes(q)) : posts;
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, search]);

  const handleDelete = (id: string) => {
    const updated = deletePost(id);
    setPosts(updated);
    toast({ title: "Пост удалён" });
  };

  const preview = (text: string) => {
    const clean = text.replace(/\*\*/g, "");
    return clean.length > 100 ? clean.slice(0, 100) + "…" : clean;
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Посты ленты новостей</h1>
          <Button onClick={() => navigate("/admin/posts/new")}>
            <Plus className="h-4 w-4 mr-1.5" /> Создать пост
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по тексту…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Автор</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="hidden md:table-cell">Текст</TableHead>
                <TableHead className="text-center"><ImageIcon className="h-4 w-4 mx-auto" /></TableHead>
                <TableHead className="text-center"><MessageSquare className="h-4 w-4 mx-auto" /></TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Постов не найдено
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium whitespace-nowrap">{post.author.name}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                    {format(new Date(post.date), "dd MMM yyyy, HH:mm", { locale: ru })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate text-sm">
                    {preview(post.text)}
                  </TableCell>
                  <TableCell className="text-center">{post.images.length}</TableCell>
                  <TableCell className="text-center">{post.comments.length}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status === "published" ? "Опубликован" : "Черновик"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/posts/${post.id}/edit`)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/posts/${post.id}/comments`)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить пост?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Пост и все комментарии будут удалены.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)}>Удалить</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
