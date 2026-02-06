export type CollectionType = "global" | "seller";
export type CollectionMode = "manual" | "by_tags";
export type CollectionVisibility = "public" | "service";
export type CollectionStatus = "active" | "archived";

export interface Collection {
  id: string;
  name: string;
  type: CollectionType;
  mode: CollectionMode;
  visibility: CollectionVisibility;
  status: CollectionStatus;
  productsCount: number;
  updatedAt: string;
  updatedBy: string;
}

export const mockCollections: Collection[] = [
  {
    id: "c1",
    name: "Лучшее за неделю",
    type: "global",
    mode: "by_tags",
    visibility: "public",
    status: "active",
    productsCount: 48,
    updatedAt: "2026-02-05T16:00:00",
    updatedBy: "Анна М.",
  },
  {
    id: "c2",
    name: "Зимняя распродажа 2026",
    type: "global",
    mode: "manual",
    visibility: "public",
    status: "active",
    productsCount: 124,
    updatedAt: "2026-02-04T11:30:00",
    updatedBy: "Иван К.",
  },
  {
    id: "c3",
    name: "Подарки до 3 000 ₽",
    type: "global",
    mode: "by_tags",
    visibility: "public",
    status: "active",
    productsCount: 87,
    updatedAt: "2026-02-03T09:15:00",
    updatedBy: "Анна М.",
  },
  {
    id: "c4",
    name: "Электроника — хиты",
    type: "global",
    mode: "by_tags",
    visibility: "public",
    status: "active",
    productsCount: 63,
    updatedAt: "2026-02-01T14:45:00",
    updatedBy: "Иван К.",
  },
  {
    id: "c5",
    name: "TechStore: Эксклюзив",
    type: "seller",
    mode: "manual",
    visibility: "public",
    status: "active",
    productsCount: 19,
    updatedAt: "2026-01-30T10:00:00",
    updatedBy: "TechStore",
  },
  {
    id: "c6",
    name: "FashionHouse: Летний сезон",
    type: "seller",
    mode: "by_tags",
    visibility: "public",
    status: "active",
    productsCount: 34,
    updatedAt: "2026-01-28T15:20:00",
    updatedBy: "FashionHouse",
  },
  {
    id: "c7",
    name: "Тестовая подборка (QA)",
    type: "global",
    mode: "manual",
    visibility: "service",
    status: "active",
    productsCount: 5,
    updatedAt: "2026-01-25T08:30:00",
    updatedBy: "Дмитрий С.",
  },
  {
    id: "c8",
    name: "Чёрная пятница 2025",
    type: "global",
    mode: "manual",
    visibility: "public",
    status: "archived",
    productsCount: 0,
    updatedAt: "2025-11-30T23:59:00",
    updatedBy: "Анна М.",
  },
  {
    id: "c9",
    name: "Спорт — бестселлеры",
    type: "global",
    mode: "by_tags",
    visibility: "public",
    status: "active",
    productsCount: 41,
    updatedAt: "2026-02-02T12:00:00",
    updatedBy: "Иван К.",
  },
  {
    id: "c10",
    name: "SportLife: Новое поступление",
    type: "seller",
    mode: "manual",
    visibility: "service",
    status: "active",
    productsCount: 12,
    updatedAt: "2026-01-22T17:00:00",
    updatedBy: "SportLife",
  },
];
