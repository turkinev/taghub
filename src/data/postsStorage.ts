// ─── Types ───

export interface PostAuthor {
  name: string;
  avatar: string;
}

export interface PostReaction {
  emoji: string;
  label: string;
  count: number;
  isActive: boolean;
}

export interface PostComment {
  id: string;
  author: PostAuthor;
  date: string;
  text: string;
}

export interface Post {
  id: string;
  author: PostAuthor;
  date: string;
  text: string;
  images: string[];
  reactions: PostReaction[];
  comments: PostComment[];
  status: "draft" | "published";
}

// ─── Default reactions ───

export const DEFAULT_REACTIONS: PostReaction[] = [
  { emoji: "👍", label: "like", count: 0, isActive: false },
  { emoji: "❤️", label: "heart", count: 0, isActive: false },
  { emoji: "🔥", label: "fire", count: 0, isActive: false },
  { emoji: "😂", label: "laugh", count: 0, isActive: false },
  { emoji: "😮", label: "wow", count: 0, isActive: false },
];

// ─── Seed data ───

const SEED_POSTS: Post[] = [
  {
    id: "post-1",
    author: { name: "Анна Иванова", avatar: "https://i.pravatar.cc/150?u=anna" },
    date: new Date(2026, 1, 25, 10, 30).toISOString(),
    text: "Запускаем **весеннюю распродажу**! Скидки до 50% на все категории. Подробности: https://example.com/sale",
    images: [
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    ],
    reactions: [
      { emoji: "👍", label: "like", count: 24, isActive: false },
      { emoji: "❤️", label: "heart", count: 12, isActive: false },
      { emoji: "🔥", label: "fire", count: 8, isActive: false },
      { emoji: "😂", label: "laugh", count: 0, isActive: false },
      { emoji: "😮", label: "wow", count: 3, isActive: false },
    ],
    comments: [
      {
        id: "c1",
        author: { name: "Пётр Сидоров", avatar: "https://i.pravatar.cc/150?u=petr" },
        date: new Date(2026, 1, 25, 11, 0).toISOString(),
        text: "Отличная новость! Давно ждали!",
      },
      {
        id: "c2",
        author: { name: "Мария Козлова", avatar: "https://i.pravatar.cc/150?u=maria" },
        date: new Date(2026, 1, 25, 12, 15).toISOString(),
        text: "А на электронику тоже скидки?",
      },
    ],
    status: "published",
  },
  {
    id: "post-2",
    author: { name: "Дмитрий Петров", avatar: "https://i.pravatar.cc/150?u=dmitry" },
    date: new Date(2026, 1, 24, 15, 0).toISOString(),
    text: "Новая коллекция **летней обуви** уже доступна. Более 200 моделей от лучших брендов.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    ],
    reactions: [
      { emoji: "👍", label: "like", count: 15, isActive: false },
      { emoji: "❤️", label: "heart", count: 7, isActive: false },
      { emoji: "🔥", label: "fire", count: 2, isActive: false },
    ],
    comments: [],
    status: "published",
  },
  {
    id: "post-3",
    author: { name: "Анна Иванова", avatar: "https://i.pravatar.cc/150?u=anna" },
    date: new Date(2026, 1, 23, 9, 0).toISOString(),
    text: "Планируем обновление системы лояльности. Черновик — пока не публикуем.",
    images: [],
    reactions: DEFAULT_REACTIONS.map((r) => ({ ...r })),
    comments: [],
    status: "draft",
  },
];

// ─── localStorage helpers ───

const STORAGE_KEY = "admin_posts";

function getSavedPosts(): Post[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePosts(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function loadPosts(): Post[] {
  const saved = getSavedPosts();
  if (saved && saved.length > 0) return saved;
  savePosts(SEED_POSTS);
  return [...SEED_POSTS];
}

export function savePost(post: Post): Post[] {
  const posts = loadPosts();
  const idx = posts.findIndex((p) => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.unshift(post);
  }
  savePosts(posts);
  return posts;
}

export function deletePost(id: string): Post[] {
  const posts = loadPosts().filter((p) => p.id !== id);
  savePosts(posts);
  return posts;
}

export function getPostById(id: string): Post | undefined {
  return loadPosts().find((p) => p.id === id);
}

export function generateId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateCommentId(): string {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
