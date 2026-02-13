export type TagVisibility = "public" | "service";
export type TagStatus = "active" | "archived";

export interface TagRestrictions {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  visibility: TagVisibility;
  status: TagStatus;
  restrictions: TagRestrictions;
  productsCount: number;
  collectionsCount: number;
  updatedAt: string;
  updatedBy: string;
}

export interface Category {
  name: string;
  subcategories: string[];
}

export const mockCategoryTree: Category[] = [
  {
    name: "Электроника",
    subcategories: ["Смартфоны", "Ноутбуки", "Планшеты", "Наушники", "Аксессуары"],
  },
  {
    name: "Одежда",
    subcategories: ["Мужская", "Женская", "Детская", "Спортивная"],
  },
  {
    name: "Обувь",
    subcategories: ["Кроссовки", "Ботинки", "Сандалии", "Туфли"],
  },
  {
    name: "Дом и сад",
    subcategories: ["Мебель", "Декор", "Освещение", "Инструменты"],
  },
  {
    name: "Спорт",
    subcategories: ["Тренажёры", "Одежда", "Аксессуары", "Питание"],
  },
  {
    name: "Красота",
    subcategories: ["Уход за лицом", "Уход за телом", "Макияж", "Парфюмерия"],
  },
  {
    name: "Детские товары",
    subcategories: ["Игрушки", "Одежда", "Коляски", "Питание"],
  },
  {
    name: "Книги",
    subcategories: ["Художественные", "Научные", "Учебные", "Детские"],
  },
];

export const mockCategories = mockCategoryTree.map((c) => c.name);

export const mockTags: Tag[] = [
  {
    id: "1",
    name: "Новинки",
    description: "Недавно добавленные товары",
    visibility: "public",
    status: "active",
    restrictions: { categories: ["Электроника", "Одежда"] },
    productsCount: 342,
    collectionsCount: 5,
    updatedAt: "2026-02-05T14:30:00",
    updatedBy: "Анна М.",
  },
  {
    id: "2",
    name: "Распродажа",
    description: "Товары со скидкой",
    visibility: "public",
    status: "active",
    restrictions: { priceMin: 100, priceMax: 5000 },
    productsCount: 1230,
    collectionsCount: 12,
    updatedAt: "2026-02-04T10:15:00",
    updatedBy: "Иван К.",
  },
  {
    id: "3",
    name: "Премиум",
    description: "Премиальные товары",
    visibility: "public",
    status: "active",
    restrictions: { priceMin: 5000 },
    productsCount: 89,
    collectionsCount: 3,
    updatedAt: "2026-02-03T16:45:00",
    updatedBy: "Анна М.",
  },
  {
    id: "4",
    name: "Тестовый",
    description: "Тег для внутреннего тестирования",
    visibility: "service",
    status: "active",
    restrictions: {},
    productsCount: 15,
    collectionsCount: 1,
    updatedAt: "2026-02-02T09:00:00",
    updatedBy: "Дмитрий С.",
  },
  {
    id: "5",
    name: "Сезон лето",
    visibility: "public",
    status: "active",
    restrictions: { categories: ["Одежда", "Обувь"] },
    productsCount: 67,
    collectionsCount: 2,
    updatedAt: "2026-01-28T11:20:00",
    updatedBy: "Менеджер",
  },
  {
    id: "6",
    name: "Хит продаж",
    description: "Популярные товары по продажам",
    visibility: "public",
    status: "active",
    restrictions: {},
    productsCount: 210,
    collectionsCount: 8,
    updatedAt: "2026-01-25T13:10:00",
    updatedBy: "Иван К.",
  },
  {
    id: "7",
    name: "Уценка",
    description: "Товары с уценкой",
    visibility: "public",
    status: "archived",
    restrictions: { priceMax: 1000 },
    productsCount: 0,
    collectionsCount: 0,
    updatedAt: "2025-12-15T08:30:00",
    updatedBy: "Анна М.",
  },
  {
    id: "8",
    name: "Эксклюзив",
    visibility: "service",
    status: "active",
    restrictions: {},
    productsCount: 23,
    collectionsCount: 1,
    updatedAt: "2026-01-20T15:00:00",
    updatedBy: "Менеджер",
  },
  {
    id: "9",
    name: "Подарки",
    description: "Идеи для подарков",
    visibility: "public",
    status: "active",
    restrictions: { categories: ["Электроника", "Красота", "Книги"] },
    productsCount: 156,
    collectionsCount: 4,
    updatedAt: "2026-02-01T12:00:00",
    updatedBy: "Анна М.",
  },
  {
    id: "10",
    name: "Архивный тег",
    visibility: "public",
    status: "archived",
    restrictions: {},
    productsCount: 0,
    collectionsCount: 0,
    updatedAt: "2025-11-10T10:00:00",
    updatedBy: "Дмитрий С.",
  },
];
