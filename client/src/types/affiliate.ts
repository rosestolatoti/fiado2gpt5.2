// Tipos expandidos para Loja de Afiliados
// Gerado em 29/01/2026 - Sisyphus

export type Marketplace = 'amazon' | 'shopee' | 'mercadoLivre';

export type AvailabilityStatus = 'available' | 'out_of_stock' | 'unavailable';

export type ProductTag = "OFERTA" | "DESTAQUE" | "FRETE GRÁTIS";

export interface Product {
  // Campos originais (mantidos para compatibilidade)
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  installment?: string;
  rating: number;
  reviews: number;
  tag?: ProductTag;
  category: string;
  
  // 🆕 Campo para afiliados (APENAS 1 MARKETPLACE POR PRODUTO)
  marketplace: Marketplace;
  affiliateUrl: string;
  
  // 🆕 Mídia avançada
  images: string[];           // Array de URLs de imagens
  video?: string;             // URL do vídeo (YouTube/Vimeo)
  thumbnail: string;           // Imagem principal (thumbnail)
  
  // 🆕 Informações detalhadas
  description?: string;        // Descrição completa do produto
  specifications?: Record<string, string>; // Especificações técnicas
  brand?: string;             // Marca do produto
  model?: string;             // Modelo específico
  
  // 🆕 Controle de afiliados
  availability: AvailabilityStatus;
  
  // 🆕 Metadata
  createdAt: string;
  updatedAt: string;
  featured: boolean;          // Produto em destaque na home
  slug: string;               // URL amigável para SEO
}

// Configurações do site
export interface SiteConfig {
  // Identidade visual
  siteName: string;
  logoUrl?: string;
  faviconUrl?: string;
  
  // Contato
  whatsappNumber?: string;
  whatsappGroupUrl?: string;
  contactEmail?: string;
  
  // Cores personalizadas (opcional)
  primaryColor?: string;
  secondaryColor?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Social Proof
  testimonials: Testimonial[];
  
  // Analytics
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

// Prova Social - Testemunhais
export interface Testimonial {
  id: string;
  name: string;
  age?: number;
  city?: string;
  message: string;
  rating: number;           // 1-5 estrelas
  avatarUrl?: string;
  verified: boolean;        // Compra verificada
  date: string;
  productId?: string;       // Produto relacionado (opcional)
}

// Usuário do Painel Admin
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;        // Hashed com bcrypt
  role: 'admin' | 'editor';
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
}

// Categoria de produto
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;             // Ordem de exibição
}

// Configurações de upload
export interface UploadConfig {
  maxSize: number;          // Tamanho máximo em bytes
  allowedTypes: string[];    // ['image/jpeg', 'image/png', 'image/webp']
  uploadPath: string;        // Caminho de armazenamento
  compress: boolean;         // Comprimir imagens
}

// Analytics de cliques
export interface AffiliateClick {
  id: string;
  productId: string;
  marketplace: Marketplace;
  timestamp: string;
  userAgent?: string;
  ip?: string;
  referrer?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginação
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filtros de produtos
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  tag?: ProductTag;
  marketplace?: Marketplace;
  availability?: AvailabilityStatus;
  featured?: boolean;
  search?: string;
}

// Sort options
export type ProductSort = 
  | 'price_asc' 
  | 'price_desc' 
  | 'rating_desc' 
  | 'reviews_desc'
  | 'created_desc'
  | 'created_asc'
  | 'title_asc'
  | 'title_desc';

// Form data para criação/edição
export interface ProductFormData {
  title: string;
  price: number;
  oldPrice?: number;
  installment?: string;
  rating: number;
  reviews: number;
  tag?: ProductTag;
  category: string;
  description?: string;
  specifications?: Record<string, string>;
  brand?: string;
  model?: string;
  marketplace: Marketplace;
  affiliateUrl: string;
  availability: AvailabilityStatus;
  featured: boolean;
  images: string[];         // URLs base64 das imagens
  video?: string;
}

// Context types
export interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

// Component props types
export interface ProductCardProps {
  product: Product;
  showMarketplaceButtons?: boolean;
  size?: 'sm' | 'md' | 'lg';
  lazy?: boolean;
}

export interface MarketplaceButtonProps {
  marketplace: Marketplace;
  url?: string;
  availability: AvailabilityStatus;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  maxSize?: number;
  disabled?: boolean;
}
