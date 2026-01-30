import { eq, desc, asc, sql } from "drizzle-orm";
import { type User, type InsertUser, type Product, type InsertProduct, type SiteSettings, type InsertSiteSettings, users, products, siteSettings } from "@shared/schema";
import { db } from "./db";

// Interface de Storage
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(filters?: {
    category?: string;
    marketplace?: string;
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
    // Adicionar alguns produtos iniciais para teste
    this.seedProducts();
  }

  private seedProducts() {
    const initialProducts: Product[] = [
      {
        id: "p1",
        title: "Smart TV 50\" 4K UHD Samsung",
        price: 2199.90,
        oldPrice: 2699.90,
        installment: "10x sem juros",
        rating: 4.7,
        reviews: 1284,
        tag: "OFERTA",
        category: "Eletrônicos",
        marketplace: "amazon",
        affiliateUrl: "https://www.amazon.com.br/dp/B08N5KWB9H?tag=fiado20",
        images: ["https://images.unsplash.com/photo-1598327105666-5b31ae5c5c6f?w=400"],
        video: null,
        thumbnail: "https://images.unsplash.com/photo-1598327105666-5b31ae5c5c6f?w=400",
        description: null,
        specifications: null,
        brand: null,
        model: null,
        availability: "available",
        featured: true,
        slug: "smart-tv-50-4k-uhd-samsung",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "p2",
        title: "Air Fryer 5L Inox Philips",
        price: 399.90,
        oldPrice: 549.90,
        installment: "6x sem juros",
        rating: 4.8,
        reviews: 2351,
        tag: "DESTAQUE",
        category: "Casa",
        marketplace: "mercadoLivre",
        affiliateUrl: "https://produto.mercadolivre.com.br/MLB123456790",
        images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"],
        video: null,
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        description: null,
        specifications: null,
        brand: null,
        model: null,
        availability: "available",
        featured: false,
        slug: "air-fryer-5l-inox-philips",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "p3",
        title: "Kit Skincare Vitamina C L'Oréal",
        price: 129.90,
        oldPrice: 189.90,
        installment: "3x sem juros",
        rating: 4.6,
        reviews: 842,
        tag: "OFERTA",
        category: "Beleza",
        marketplace: "shopee",
        affiliateUrl: "https://shopee.com.br/product/123456791",
        images: ["https://images.unsplash.com/photo-1570172619644-dfd05ed296d8?w=400"],
        video: null,
        thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd05ed296d8?w=400",
        description: null,
        specifications: null,
        brand: null,
        model: null,
        availability: "available",
        featured: false,
        slug: "kit-skincare-vitamina-c-loreal",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

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

  async getProducts(filters?: {
    category?: string;
    marketplace?: string;
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
    featuredProducts: number;
    availableProducts: number;
    byMarketplace: Record<string, number>;
    byCategory: Record<string, number>;
    recentProducts: Product[];
  }> {
    const allProducts = Array.from(this.productsMap.values());
    
    const totalProducts = allProducts.length;
    const featuredProducts = allProducts.filter(p => p.featured).length;
    const availableProducts = allProducts.filter(p => p.availability === "available").length;
    
    // Count by marketplace
    const byMarketplace = allProducts.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.marketplace] = (acc[product.marketplace] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by category
    const byCategory = allProducts.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Recent products (last 5)
    const recentProducts = allProducts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return {
      totalProducts,
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

  // Product methods
  async getProducts(filters?: {
    category?: string;
    marketplace?: string;
    featured?: boolean;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    // Get all products first
    let allProducts: Product[] = await db.select().from(products);

    // Apply filters in memory for simplicity
    if (filters?.category) {
      allProducts = allProducts.filter((p: Product) => p.category === filters.category);
    }
    
    if (filters?.marketplace) {
      allProducts = allProducts.filter((p: Product) => p.marketplace === filters.marketplace);
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
    featuredProducts: number;
    availableProducts: number;
    byMarketplace: Record<string, number>;
    byCategory: Record<string, number>;
    recentProducts: Product[];
  }> {
    const allProducts: Product[] = await db.select().from(products);
    
    const totalProducts = allProducts.length;
    const featuredProducts = allProducts.filter(p => p.featured).length;
    const availableProducts = allProducts.filter(p => p.availability === "available").length;
    
    // Count by marketplace
    const byMarketplace = allProducts.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.marketplace] = (acc[product.marketplace] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count by category
    const byCategory = allProducts.reduce((acc: Record<string, number>, product: Product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Recent products (last 5)
    const recentProducts = allProducts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return {
      totalProducts,
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
        whatsappGroupUrl: "",
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
