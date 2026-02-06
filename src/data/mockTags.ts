export type TagOwnerType = "global" | "seller";
export type TagVisibility = "public" | "service";
export type TagStatus = "active" | "archived";

export interface TagRestrictions {
  categories?: string[];
  sellers?: string[];
  priceMin?: number;
  priceMax?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerType: TagOwnerType;
  visibility: TagVisibility;
  status: TagStatus;
  restrictions: TagRestrictions;
  productsCount: number;
  collectionsCount: number;
  updatedAt: string;
  updatedBy: string;
}

export const mockCategories = [
  "Электроника",
  "Одежда",
  "Обувь",
  "Дом и сад",
  "Спорт",
  "Красота",
  "Детские товары",
  "Книги",
];

export const mockSellers = [
  "ООО «Магазин»",
  "ИП Петров",
  "TechStore",
  "FashionHouse",
  "SportLife",
];

export const mockTags: Tag[] = [
  {
    id: "1",
    name: "Новинки",
    slug: "novinki",
    description: "Недавно добавленные товары",
    ownerType: "global",
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
    slug: "rasprodazha",
    description: "Товары со скидкой",
    ownerType: "global",
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
    slug: "premium",
    description: "Премиальные товары",
    ownerType: "global",
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
    slug: "testovyj",
    description: "Тег для внутреннего тестирования",
    ownerType: "global",
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
    slug: "sezon-leto",
    ownerType: "seller",
    visibility: "public",
    status: "active",
    restrictions: { sellers: ["FashionHouse"], categories: ["Одежда", "Обувь"] },
    productsCount: 67,
    collectionsCount: 2,
    updatedAt: "2026-01-28T11:20:00",
    updatedBy: "FashionHouse",
  },
  {
    id: "6",
    name: "Хит продаж",
    slug: "hit-prodazh",
    description: "Популярные товары по продажам",
    ownerType: "global",
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
    slug: "utsenka",
    description: "Товары с уценкой",
    ownerType: "global",
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
    slug: "eksklyuziv",
    ownerType: "seller",
    visibility: "service",
    status: "active",
    restrictions: { sellers: ["TechStore"] },
    productsCount: 23,
    collectionsCount: 1,
    updatedAt: "2026-01-20T15:00:00",
    updatedBy: "TechStore",
  },
  {
    id: "9",
    name: "Подарки",
    slug: "podarki",
    description: "Идеи для подарков",
    ownerType: "global",
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
    slug: "arhivnyj-teg",
    ownerType: "global",
    visibility: "public",
    status: "archived",
    restrictions: {},
    productsCount: 0,
    collectionsCount: 0,
    updatedAt: "2025-11-10T10:00:00",
    updatedBy: "Дмитрий С.",
  },
];
