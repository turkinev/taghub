export type ProductType = "SKU" | "SPU";

export type TagSource = "marketer" | "seller" | "rule";

export interface ProductTag {
  tagId: string;
  tagName: string;
  source: TagSource;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  seller: string;
  category: string;
  price: number;
  rating: number;
  type: ProductType;
  parentSpuId?: string;
  tags: ProductTag[];
  imageUrl?: string;
}

export const mockProducts: Product[] = [
  {
    id: "p1",
    productId: "SPU-10001",
    name: "Смартфон Galaxy Pro Max 256GB",
    seller: "TechStore",
    category: "Электроника",
    price: 89990,
    rating: 4.8,
    type: "SPU",
    tags: [
      { tagId: "1", tagName: "Новинки", source: "marketer" },
      { tagId: "3", tagName: "Премиум", source: "rule" },
      { tagId: "6", tagName: "Хит продаж", source: "marketer" },
    ],
  },
  {
    id: "p2",
    productId: "SKU-10001-BLK",
    name: "Смартфон Galaxy Pro Max 256GB — Чёрный",
    seller: "TechStore",
    category: "Электроника",
    price: 89990,
    rating: 4.8,
    type: "SKU",
    parentSpuId: "p1",
    tags: [
      { tagId: "1", tagName: "Новинки", source: "marketer" },
      { tagId: "3", tagName: "Премиум", source: "rule" },
      { tagId: "6", tagName: "Хит продаж", source: "marketer" },
    ],
  },
  {
    id: "p3",
    productId: "SKU-10001-WHT",
    name: "Смартфон Galaxy Pro Max 256GB — Белый",
    seller: "TechStore",
    category: "Электроника",
    price: 89990,
    rating: 4.7,
    type: "SKU",
    parentSpuId: "p1",
    tags: [
      { tagId: "1", tagName: "Новинки", source: "marketer" },
      { tagId: "3", tagName: "Премиум", source: "rule" },
    ],
  },
  {
    id: "p4",
    productId: "SPU-10002",
    name: "Кроссовки AirRun Lite",
    seller: "SportLife",
    category: "Обувь",
    price: 7490,
    rating: 4.2,
    type: "SPU",
    tags: [
      { tagId: "2", tagName: "Распродажа", source: "marketer" },
      { tagId: "5", tagName: "Сезон лето", source: "seller" },
    ],
  },
  {
    id: "p5",
    productId: "SKU-10002-42",
    name: "Кроссовки AirRun Lite — 42 размер",
    seller: "SportLife",
    category: "Обувь",
    price: 7490,
    rating: 4.2,
    type: "SKU",
    parentSpuId: "p4",
    tags: [
      { tagId: "2", tagName: "Распродажа", source: "marketer" },
      { tagId: "5", tagName: "Сезон лето", source: "seller" },
    ],
  },
  {
    id: "p6",
    productId: "SPU-10003",
    name: "Платье летнее Floral Dream",
    seller: "FashionHouse",
    category: "Одежда",
    price: 4290,
    rating: 4.5,
    type: "SPU",
    tags: [
      { tagId: "1", tagName: "Новинки", source: "marketer" },
      { tagId: "5", tagName: "Сезон лето", source: "seller" },
    ],
  },
  {
    id: "p7",
    productId: "SPU-10004",
    name: "Набор кистей для макияжа ProArtist",
    seller: "ООО «Магазин»",
    category: "Красота",
    price: 2190,
    rating: 3.9,
    type: "SPU",
    tags: [
      { tagId: "9", tagName: "Подарки", source: "marketer" },
    ],
  },
  {
    id: "p8",
    productId: "SPU-10005",
    name: "Робот-пылесос CleanBot X1",
    seller: "TechStore",
    category: "Дом и сад",
    price: 32900,
    rating: 4.6,
    type: "SPU",
    tags: [
      { tagId: "3", tagName: "Премиум", source: "rule" },
      { tagId: "6", tagName: "Хит продаж", source: "marketer" },
      { tagId: "8", tagName: "Эксклюзив", source: "seller" },
    ],
  },
  {
    id: "p9",
    productId: "SPU-10006",
    name: "Конструктор LEGO Technic Гоночный автомобиль",
    seller: "ООО «Магазин»",
    category: "Детские товары",
    price: 5690,
    rating: 4.9,
    type: "SPU",
    tags: [
      { tagId: "9", tagName: "Подарки", source: "marketer" },
      { tagId: "1", tagName: "Новинки", source: "rule" },
    ],
  },
  {
    id: "p10",
    productId: "SPU-10007",
    name: "Книга «Чистый код» Роберт Мартин",
    seller: "ИП Петров",
    category: "Книги",
    price: 1290,
    rating: 4.9,
    type: "SPU",
    tags: [
      { tagId: "9", tagName: "Подарки", source: "marketer" },
    ],
  },
  {
    id: "p11",
    productId: "SPU-10008",
    name: "Беговая дорожка FitPro 3000",
    seller: "SportLife",
    category: "Спорт",
    price: 45900,
    rating: 3.5,
    type: "SPU",
    tags: [
      { tagId: "3", tagName: "Премиум", source: "rule" },
    ],
  },
  {
    id: "p12",
    productId: "SPU-10009",
    name: "Ноутбук UltraBook Pro 15",
    seller: "TechStore",
    category: "Электроника",
    price: 124900,
    rating: 4.4,
    type: "SPU",
    tags: [
      { tagId: "3", tagName: "Премиум", source: "rule" },
      { tagId: "1", tagName: "Новинки", source: "marketer" },
      { tagId: "6", tagName: "Хит продаж", source: "marketer" },
    ],
  },
  {
    id: "p13",
    productId: "SKU-10009-16",
    name: "Ноутбук UltraBook Pro 15 — 16GB RAM",
    seller: "TechStore",
    category: "Электроника",
    price: 124900,
    rating: 4.4,
    type: "SKU",
    parentSpuId: "p12",
    tags: [
      { tagId: "3", tagName: "Премиум", source: "rule" },
      { tagId: "1", tagName: "Новинки", source: "marketer" },
    ],
  },
  {
    id: "p14",
    productId: "SPU-10010",
    name: "Крем для лица Hydra Boost",
    seller: "ООО «Магазин»",
    category: "Красота",
    price: 1890,
    rating: 3.2,
    type: "SPU",
    tags: [],
  },
  {
    id: "p15",
    productId: "SPU-10011",
    name: "Куртка зимняя Explorer",
    seller: "FashionHouse",
    category: "Одежда",
    price: 12900,
    rating: 4.1,
    type: "SPU",
    tags: [
      { tagId: "2", tagName: "Распродажа", source: "marketer" },
    ],
  },
];
