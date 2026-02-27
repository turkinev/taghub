import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Send } from "lucide-react";
import {
  getPostById, savePost, generateCommentId,
  type Post, type PostComment,
} from "@/data/postsStorage";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function PostCommentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [adminText, setAdminText] = useState("");
  const [adminName, setAdminName] = useState("Администратор");

  useEffect(() => {
    if (!id) return;
    const p = getPostById(id);
    if (!p) {
      toast({ title: "Пост не найден", variant: "destructive" });
      navigate("/admin/posts");
      return;
    }
    setPost(p);
  }, [id]);

  if (!post) return null;

  const updatePost = (updated: Post) => {
    savePost(updated);
    setPost({ ...updated });
  };

  const handleDeleteComment = (commentId: string) => {
    const updated: Post = {
      ...post,
      comments: post.comments.filter((c) => c.id !== commentId),
    };
    updatePost(updated);
    toast({ title: "Комментарий удалён" });
  };

  const handleAddComment = () => {
    if (!adminText.trim()) {
      toast({ title: "Введите текст комментария", variant: "destructive" });
      return;
    }
    const comment: PostComment = {
      id: generateCommentId(),
      author: { name: adminName || "Администратор", avatar: "https://i.pravatar.cc/150?u=admin" },
      date: new Date().toISOString(),
      text: adminText.trim(),
    };
    const updated: Post = {
      ...post,
      comments: [...post.comments, comment],
    };
    updatePost(updated);
    setAdminText("");
    toast({ title: "Комментарий добавлен" });
  };

  const preview = post.text.replace(/\*\*/g, "").slice(0, 60);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/posts")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Комментарии</h1>
            <p className="text-sm text-muted-foreground truncate max-w-md">
              К посту: {preview}…
            </p>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-3">
          {post.comments.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">Комментариев пока нет</p>
          )}
          {post.comments.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex gap-3 py-3 px-4">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={c.author.avatar} />
                  <AvatarFallback>{c.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(c.date), "dd MMM yyyy, HH:mm", { locale: ru })}
                    </span>
                  </div>
                  <p className="text-sm mt-0.5">{c.text}</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить комментарий?</AlertDialogTitle>
                      <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteComment(c.id)}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add admin comment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Добавить комментарий от администратора</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Имя</Label>
              <Input value={adminName} onChange={(e) => setAdminName(e.target.value)} className="max-w-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Комментарий</Label>
              <Textarea value={adminText} onChange={(e) => setAdminText(e.target.value)} rows={3} placeholder="Текст…" />
            </div>
            <Button onClick={handleAddComment}>
              <Send className="h-4 w-4 mr-1.5" /> Отправить
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
