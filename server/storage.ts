import { eq, desc, asc, sql } from "drizzle-orm";
import { type User, type InsertUser, type Product, type InsertProduct, type SiteSettings, type InsertSiteSettings, users, products, siteSettings } from "../shared/schema.js";
import { db } from "./db.js";

const seedCatalog = [
  {
    title: "Mochila Escolar Rodinhas + Lancheira Térmica",
    price: 299.9,
    oldPrice: 359.9,
    installment: "10x sem juros",
    rating: 4.6,
    reviews: 528,
    tag: "OFERTA",
    category: "Infantil",
    marketplace: "amazon",
    affiliateUrl: "https://www.amazon.com.br/Mochila-Rodinhas-Lancheira-Infantil-Masculino/dp/B0CSDQPS33",
    images: [
      "https://m.media-amazon.com/images/I/61uZMFyYGXL._AC_SL1000_.jpg",
      "https://m.media-amazon.com/images/I/61yKNyYRWbL._AC_SL1000_.jpg",
      "https://m.media-amazon.com/images/I/61xztpNshUL._AC_SL1000_.jpg",
    ],
    video: null,
    thumbnail: "https://m.media-amazon.com/images/I/61uZMFyYGXL._AC_SL1000_.jpg",
    description: "Mochila com rodinhas resistente, com lancheira térmica combinando. Ideal para o dia a dia escolar.",
    specifications: {
      material: "Poliéster",
      capacidade: "20L",
      compartimentos: "3",
      rodinhas: "Silicone reforçado",
    },
    brand: "Fiado",
    model: "School Travel",
    availability: "available",
    published: true,
    featured: true,
    slug: "mochila-escolar-rodinhas-lancheira-termica",
  },
  {
    title: "Kit Violino Eagle VE441 4/4 + Estojo + Arco",
    price: 899.9,
    oldPrice: 999.9,
    installment: "8x sem juros",
    rating: 4.8,
    reviews: 214,
    tag: "DESTAQUE",
    category: "Outros",
    marketplace: "shopee",
    affiliateUrl: "https://shopee.com.br/search?keyword=violino%20eagle%20ve441",
    images: [
      "https://images.tcdn.com.br/img/img_prod/480495/kit_violino_eagle_ve441_4_4_estojo_estante_espaleira_afinador_1023117_1_6d2281593633a2bc86ed200575cf3b49.jpg",
      "https://images.tcdn.com.br/img/img_prod/480495/kit_violino_eagle_ve441_4_4_estojo_estante_espaleira_afinador_1023117_2_2c5e12d7be1ba1b2d5a9ce65bc36b3b5.jpg",
      "https://images.tcdn.com.br/img/img_prod/480495/kit_violino_eagle_ve441_4_4_estojo_estante_espaleira_afinador_1023117_3_5b57fbc1943d094fb5508fb67e4516a3.jpg",
    ],
    video: null,
    thumbnail: "https://images.tcdn.com.br/img/img_prod/480495/kit_violino_eagle_ve441_4_4_estojo_estante_espaleira_afinador_1023117_1_6d2281593633a2bc86ed200575cf3b49.jpg",
    description: "Violino tamanho 4/4 com estojo e arco. Ótimo para estudantes e músicos iniciantes.",
    specifications: {
      tamanho: "4/4",
      material: "Madeira selecionada",
      acompanha: "Estojo, arco e breu",
    },
    brand: "Eagle",
    model: "VE441",
    availability: "available",
    published: true,
    featured: true,
    slug: "kit-violino-eagle-ve441-estojo-arco",
  },
  {
    title: "Smart TV Box Intelbras Izy Stick Android TV 11",
    price: 249.9,
    oldPrice: 329.9,
    installment: "6x sem juros",
    rating: 4.7,
    reviews: 892,
    tag: "OFERTA",
    category: "Eletrônicos",
    marketplace: "mercadoLivre",
    affiliateUrl: "https://produto.mercadolivre.com.br/MLB-3839607327-smart-stick-android-tv-izy-play-full-hd-portatil-intelbras-_JM",
    images: [
      "https://intelbras.vtexassets.com/arquivos/ids/169572/Foto-IZY-Play-Kit-Stick-.png",
      "https://intelbras.vtexassets.com/arquivos/ids/169573/intelbras_IZY_play_09.png",
      "https://intelbras.vtexassets.com/arquivos/ids/169574/intelbras_IZY_play_07.png",
    ],
    video: null,
    thumbnail: "https://intelbras.vtexassets.com/arquivos/ids/169572/Foto-IZY-Play-Kit-Stick-.png",
    description: "Transforme sua TV em smart com Android TV 11, Google Assistente e streaming em alta definição.",
    specifications: {
      sistema: "Android TV 11",
      armazenamento: "8GB",
      wifi: "Dual Band",
      compatibilidade: "HDMI",
    },
    brand: "Intelbras",
    model: "Izy Stick",
    availability: "available",
    published: true,
    featured: true,
    slug: "smart-tv-box-intelbras-izy-stick-android-tv-11",
  },
];

let databaseSeeded = false;

const normalizeTitle = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Interface de Storage
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, password: string): Promise<User | undefined>;
  
  // Products
  getProducts(filters?: {
    category?: string;
    marketplace?: string;
    published?: boolean;
    featured?: boolean;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<Product | undefined>;
  getProductStats(): Promise<{
    totalProducts: number;
    totalCatalog: number;
    featuredProducts: number;
    availableProducts: number;
    byMarketplace: Record<string, number>;
    byCategory: Record<string, number>;
    recentProducts: Product[];
  }>;
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
}

// Storage em memória para desenvolvimento sem banco de dados
export class MemStorage implements IStorage {
  private usersMap: Map<string, User> = new Map();
  private productsMap: Map<string, Product> = new Map();
  private userIdCounter = 1;
  private productIdCounter = 1;
  private siteSettings: SiteSettings = {
    id: "default",
    siteName: "Loja do Fiado",
    whatsappGroupUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  constructor() {
    this.seedProducts();
  }

  private seedProducts() {
    const now = new Date();
    const initialProducts: Product[] = seedCatalog.map((product, index) => ({
      id: `p${index + 1}`,
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      installment: product.installment ?? null,
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      tag: product.tag ?? null,
      category: product.category ?? "Destaques",
      marketplace: product.marketplace,
      affiliateUrl: product.affiliateUrl,
      images: product.images,
      video: product.video ?? null,
      thumbnail: product.thumbnail ?? product.images[0] ?? "",
      description: product.description ?? null,
      specifications: product.specifications ?? {},
      brand: product.brand ?? null,
      model: product.model ?? null,
      availability: product.availability ?? "available",
      published: product.published ?? true,
      featured: product.featured ?? false,
      slug: product.slug,
      createdAt: new Date(now.getTime() - (seedCatalog.length - index) * 1000),
      updatedAt: now,
    }));

    initialProducts.forEach(p => {
      this.productsMap.set(p.id, p);
      this.productIdCounter = Math.max(this.productIdCounter, parseInt(p.id.replace('p', '')) + 1);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = `u${this.userIdCounter++}`;
    const user: User = {
      ...insertUser,
      id,
    };
    this.usersMap.set(id, user);
    return user;
  }

  async updateUserPassword(id: string, password: string): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    const updated = { ...user, password };
    this.usersMap.set(id, updated);
    return updated;
  }

  async getProducts(filters?: {
    category?: string;
    marketplace?: string;
    published?: boolean;
    featured?: boolean;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    let allProducts = Array.from(this.productsMap.values());

    if (filters?.category) {
      allProducts = allProducts.filter(p => p.category === filters.category);
    }
    
    if (filters?.marketplace) {
      allProducts = allProducts.filter(p => p.marketplace === filters.marketplace);
    }

    if (filters?.published !== undefined) {
      allProducts = allProducts.filter(p => p.published === filters.published);
    }
    
    if (filters?.featured) {
      allProducts = allProducts.filter(p => p.featured);
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      allProducts = allProducts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    // Sorting
    const sortBy = filters?.sortBy || "created_desc";
    switch (sortBy) {
      case "price_asc":
        allProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        allProducts.sort((a, b) => b.price - a.price);
        break;
      case "title_asc":
        allProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "created_desc":
      default:
        allProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = allProducts.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);
    
    return { products: paginatedProducts, total };
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = `p${this.productIdCounter++}`;
    const now = new Date();
    const images = (insertProduct.images ?? []) as string[];
    const product: Product = {
      id,
      title: insertProduct.title,
      price: insertProduct.price,
      oldPrice: insertProduct.oldPrice ?? null,
      installment: insertProduct.installment ?? null,
      rating: insertProduct.rating ?? 0,
      reviews: insertProduct.reviews ?? 0,
      tag: insertProduct.tag ?? null,
      category: insertProduct.category ?? "Destaques",
      marketplace: insertProduct.marketplace,
      affiliateUrl: insertProduct.affiliateUrl,
      images,
      video: insertProduct.video ?? null,
      thumbnail: insertProduct.thumbnail ?? images[0] ?? "",
      description: insertProduct.description ?? null,
      specifications: insertProduct.specifications ?? {},
      brand: insertProduct.brand ?? null,
      model: insertProduct.model ?? null,
      availability: insertProduct.availability ?? "available",
      published: insertProduct.published ?? true,
      featured: insertProduct.featured ?? false,
      slug: insertProduct.slug,
      createdAt: now,
      updatedAt: now
    };
    this.productsMap.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.productsMap.get(id);
    if (!existing) return undefined;

    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    ) as Partial<InsertProduct>;

    const updated: Product = {
      ...existing,
      ...sanitizedUpdates,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.productsMap.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<Product | undefined> {
    const product = this.productsMap.get(id);
    if (product) {
      this.productsMap.delete(id);
    }
    return product;
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    totalCatalog: number;
    featuredProducts: number;
    availableProducts: number;
    byMarketplace: Record<string, number>;
    byCategory: Record<string, number>;
    recentProducts: Product[];
  }> {
    const allProducts = Array.from(this.productsMap.values());
    const publishedProducts = allProducts.filter(p => p.published);
    
    const totalProducts = publishedProducts.length;
    const totalCatalog = new Set(allProducts.map(p => normalizeTitle(p.title))).size;
    const featuredProducts = publishedProducts.filter(p => p.featured).length;
    const availableProducts = publishedProducts.filter(p => p.availability === "available").length;
    
    // Count by marketplace
    const byMarketplace = publishedProducts.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.marketplace] = (acc[product.marketplace] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by category
    const byCategory = publishedProducts.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Recent products (last 5)
    const recentProducts = publishedProducts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return {
      totalProducts,
      totalCatalog,
      featuredProducts,
      availableProducts,
      byMarketplace,
      byCategory,
      recentProducts
    };
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return this.siteSettings;
  }

  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    this.siteSettings = {
      ...this.siteSettings,
      ...settings,
      id: "default",
      updatedAt: new Date(),
    };
    return this.siteSettings;
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(id: string, password: string): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  // Product methods
  async getProducts(filters?: {
    category?: string;
    marketplace?: string;
    published?: boolean;
    featured?: boolean;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    if (!databaseSeeded) {
      const existing = await db.select().from(products).limit(1);
      if (existing.length === 0) {
        await db.insert(products).values(
          seedCatalog.map((product) => ({
            title: product.title,
            price: product.price,
            oldPrice: product.oldPrice ?? null,
            installment: product.installment ?? null,
            rating: product.rating ?? 0,
            reviews: product.reviews ?? 0,
            tag: product.tag ?? null,
            category: product.category ?? "Destaques",
            marketplace: product.marketplace,
            affiliateUrl: product.affiliateUrl,
            images: product.images,
            video: product.video ?? null,
            thumbnail: product.thumbnail ?? product.images[0] ?? "",
            description: product.description ?? null,
            specifications: product.specifications ?? {},
            brand: product.brand ?? null,
            model: product.model ?? null,
            availability: product.availability ?? "available",
            published: product.published ?? true,
            featured: product.featured ?? false,
            slug: product.slug,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        );
      }
      databaseSeeded = true;
    }

    let allProducts: Product[] = await db.select().from(products);

    // Apply filters in memory for simplicity
    if (filters?.category) {
      allProducts = allProducts.filter((p: Product) => p.category === filters.category);
    }
    
    if (filters?.marketplace) {
      allProducts = allProducts.filter((p: Product) => p.marketplace === filters.marketplace);
    }
    
    if (filters?.published !== undefined) {
      allProducts = allProducts.filter((p: Product) => p.published === filters.published);
    }

    if (filters?.featured) {
      allProducts = allProducts.filter((p: Product) => p.featured);
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      allProducts = allProducts.filter((p: Product) => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    // Sorting
    const sortBy = filters?.sortBy || "created_desc";
    switch (sortBy) {
      case "price_asc":
        allProducts.sort((a: Product, b: Product) => a.price - b.price);
        break;
      case "price_desc":
        allProducts.sort((a: Product, b: Product) => b.price - a.price);
        break;
      case "title_asc":
        allProducts.sort((a: Product, b: Product) => a.title.localeCompare(b.title));
        break;
      case "created_desc":
      default:
        allProducts.sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = allProducts.length;
    const paginatedProducts = allProducts.slice(offset, offset + limit);
    
    return { products: paginatedProducts, total };
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const images = (insertProduct.images ?? []) as string[];
    const values = {
      title: insertProduct.title,
      price: insertProduct.price,
      oldPrice: insertProduct.oldPrice ?? null,
      installment: insertProduct.installment ?? null,
      rating: insertProduct.rating ?? 0,
      reviews: insertProduct.reviews ?? 0,
      tag: insertProduct.tag ?? null,
      category: insertProduct.category ?? "Destaques",
      marketplace: insertProduct.marketplace,
      affiliateUrl: insertProduct.affiliateUrl,
      images,
      video: insertProduct.video ?? null,
      thumbnail: insertProduct.thumbnail ?? images[0] ?? "",
      description: insertProduct.description ?? null,
      specifications: insertProduct.specifications ?? {},
      brand: insertProduct.brand ?? null,
      model: insertProduct.model ?? null,
      availability: insertProduct.availability ?? "available",
      published: insertProduct.published ?? true,
      featured: insertProduct.featured ?? false,
      slug: insertProduct.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const [product] = await db.insert(products).values(values).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<Product | undefined> {
    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return deleted;
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    totalCatalog: number;
    featuredProducts: number;
    availableProducts: number;
    byMarketplace: Record<string, number>;
    byCategory: Record<string, number>;
    recentProducts: Product[];
  }> {
    const allProducts: Product[] = await db.select().from(products);
    const publishedProducts = allProducts.filter(p => p.published);
    
    const totalProducts = publishedProducts.length;
    const totalCatalog = new Set(allProducts.map(p => normalizeTitle(p.title))).size;
    const featuredProducts = publishedProducts.filter(p => p.featured).length;
    const availableProducts = publishedProducts.filter(p => p.availability === "available").length;
    
    // Count by marketplace
    const byMarketplace = publishedProducts.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.marketplace] = (acc[product.marketplace] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by category
    const byCategory = publishedProducts.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Recent products (last 5)
    const recentProducts = publishedProducts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return {
      totalProducts,
      totalCatalog,
      featuredProducts,
      availableProducts,
      byMarketplace,
      byCategory,
      recentProducts
    };
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const [settings] = await db.select().from(siteSettings);
    if (settings) return settings;

    const [created] = await db
      .insert(siteSettings)
      .values({
        id: "default",
        siteName: "Loja do Fiado",
      })
      .returning();
    return created;
  }

  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const existing = await this.getSiteSettings();
    const [updated] = await db
      .update(siteSettings)
      .set({
        ...settings,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, existing.id))
      .returning();
    return updated;
  }
}

// Usar MemStorage quando não houver DATABASE_URL
export const storage: IStorage = db ? new DatabaseStorage() : new MemStorage();
