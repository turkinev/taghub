import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, CalendarIcon, X, GripVertical, Plus, Trash2, Upload,
} from "lucide-react";
import {
  getPostById, savePost, generateId, DEFAULT_REACTIONS,
  type Post, type PostReaction,
} from "@/data/postsStorage";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [authorName, setAuthorName] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [reactions, setReactions] = useState<PostReaction[]>(
    DEFAULT_REACTIONS.map((r) => ({ ...r }))
  );
  const [date, setDate] = useState<Date>(new Date());
  const [timeStr, setTimeStr] = useState(format(new Date(), "HH:mm"));
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const post = getPostById(id);
      if (!post) {
        toast({ title: "Пост не найден", variant: "destructive" });
        navigate("/admin/posts");
        return;
      }
      setAuthorName(post.author.name);
      setAuthorAvatar(post.author.avatar);
      setText(post.text);
      setImages(post.images);
      setReactions(post.reactions);
      const d = new Date(post.date);
      setDate(d);
      setTimeStr(format(d, "HH:mm"));
    }
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 4 - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const urls = toAdd.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(dragIdx, 1);
      arr.splice(idx, 0, item);
      return arr;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  // Reactions management
  const [newEmoji, setNewEmoji] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const addReaction = () => {
    if (!newEmoji.trim() || !newLabel.trim()) return;
    setReactions((prev) => [
      ...prev,
      { emoji: newEmoji.trim(), label: newLabel.trim(), count: 0, isActive: false },
    ]);
    setNewEmoji("");
    setNewLabel("");
  };

  const removeReaction = (idx: number) => {
    setReactions((prev) => prev.filter((_, i) => i !== idx));
  };

  const buildPost = (status: "draft" | "published"): Post => {
    const [h, m] = timeStr.split(":").map(Number);
    const pubDate = new Date(date);
    pubDate.setHours(h || 0, m || 0, 0, 0);

    const existing = id ? getPostById(id) : undefined;
    return {
      id: existing?.id ?? generateId(),
      author: { name: authorName, avatar: authorAvatar },
      date: pubDate.toISOString(),
      text,
      images,
      reactions,
      comments: existing?.comments ?? [],
      status,
    };
  };

  const validate = () => {
    if (!authorName.trim()) {
      toast({ title: "Укажите имя автора", variant: "destructive" });
      return false;
    }
    if (!text.trim()) {
      toast({ title: "Введите текст поста", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSave = (status: "draft" | "published") => {
    if (!validate()) return;
    const post = buildPost(status);
    savePost(post);
    toast({ title: status === "published" ? "Пост опубликован" : "Черновик сохранён" });
    navigate("/admin/posts");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/posts")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">
            {isEdit ? "Редактирование поста" : "Новый пост"}
          </h1>
        </div>

        {/* Author */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Автор</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Имя</Label>
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Имя автора" />
            </div>
            <div className="space-y-1.5">
              <Label>URL аватара</Label>
              <Input value={authorAvatar} onChange={(e) => setAuthorAvatar(e.target.value)} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        {/* Text */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Текст поста</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Текст поста…"
            />
            <p className="text-xs text-muted-foreground">
              Поддерживается **жирный текст** и URL-ссылки (распознаются автоматически)
            </p>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Изображения (до 4)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "relative group rounded-lg overflow-hidden border aspect-square bg-muted",
                    dragIdx === idx && "opacity-50"
                  )}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <GripVertical className="absolute top-1 left-1 h-4 w-4 text-background opacity-0 group-hover:opacity-80 transition-opacity cursor-grab" />
                </div>
              ))}
              {images.length < 4 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Загрузить</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Reactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Реакции</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {reactions.map((r, idx) => (
                <div key={idx} className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
                  <span>{r.emoji}</span>
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="text-xs text-muted-foreground">({r.count})</span>
                  <button onClick={() => removeReaction(idx)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <div className="space-y-1">
                <Label className="text-xs">Эмодзи</Label>
                <Input value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} placeholder="😍" className="w-20" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Название</Label>
                <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="love" className="w-32" />
              </div>
              <Button variant="outline" size="sm" onClick={addReaction}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Добавить
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Date */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Дата публикации</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs">Дата</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "dd MMM yyyy", { locale: ru })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Время</Label>
              <Input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} className="w-[130px]" />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <Button variant="outline" onClick={() => handleSave("draft")}>
            Сохранить черновик
          </Button>
          <Button onClick={() => handleSave("published")}>
            Опубликовать
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
