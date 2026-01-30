// Schemas Zod para validação de dados da Loja de Afiliados
// Gerado em 29/01/2026 - Sisyphus

import { z } from 'zod';

// Enums baseados nos tipos
export const MarketplaceSchema = z.enum(['amazon', 'shopee', 'mercadoLivre']);
export const AvailabilityStatusSchema = z.enum(['available', 'out_of_stock', 'unavailable']);
export const ProductTagSchema = z.enum(['OFERTA', 'DESTAQUE', 'FRETE GRÁTIS']);
export const UserRoleSchema = z.enum(['admin', 'editor']);

// Schema de URL de afiliado
export const AffiliateUrlSchema = z.object({
  amazon: z.string().url('URL da Amazon inválida').optional(),
  shopee: z.string().url('URL da Shopee inválida').optional(),
  mercadoLivre: z.string().url('URL do Mercado Livre inválida').optional(),
}).refine(
  (data) => data.amazon || data.shopee || data.mercadoLivre,
  { message: 'Pelo menos uma URL de afiliado é obrigatória' }
);

// Schema de disponibilidade
export const AvailabilitySchema = z.object({
  amazon: AvailabilityStatusSchema,
  shopee: AvailabilityStatusSchema,
  mercadoLivre: AvailabilityStatusSchema,
});

// Schema de especificações
export const SpecificationsSchema = z.record(z.string(), z.string()).optional();

// Schema principal de Produto
export const ProductSchema = z.object({
  // Campos obrigatórios
  id: z.string().min(1, 'ID é obrigatório'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200, 'Título muito longo'),
  price: z.number().positive('Preço deve ser positivo'),
  rating: z.number().min(0, 'Avaliação deve ser entre 0 e 5').max(5, 'Avaliação deve ser entre 0 e 5'),
  reviews: z.number().min(0, 'Número de avaliações não pode ser negativo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  
  // Campos opcionais
  oldPrice: z.number().positive('Preço antigo deve ser positivo').optional(),
  installment: z.string().max(50, 'Texto de parcelamento muito longo').optional(),
  tag: ProductTagSchema.optional(),
  
  // Campos de afiliados
  affiliateUrls: AffiliateUrlSchema,
  availability: AvailabilitySchema,
  
  // Mídia
  images: z.array(z.string().url('URL de imagem inválida')).min(1, 'Pelo menos uma imagem é obrigatória'),
  video: z.string().url('URL de vídeo inválida').optional(),
  thumbnail: z.string().url('URL da thumbnail inválida'),
  
  // Informações detalhadas
  description: z.string().max(2000, 'Descrição muito longa').optional(),
  specifications: SpecificationsSchema,
  brand: z.string().max(100, 'Nome da marca muito longo').optional(),
  model: z.string().max(100, 'Nome do modelo muito longo').optional(),
  
  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  featured: z.boolean(),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
});

// Schema para criação de produto (sem ID e timestamps)
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Para upload de imagens
  images: z.array(z.instanceof(File)).min(1, 'Pelo menos uma imagem é obrigatória'),
});

// Schema para atualização de produto
export const UpdateProductSchema = CreateProductSchema.partial().extend({
  id: z.string().min(1, 'ID é obrigatório'),
});

// Schema de Testimonial
export const TestimonialSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  age: z.number().min(18, 'Idade mínima é 18 anos').max(120, 'Idade máxima é 120 anos').optional(),
  city: z.string().max(100, 'Nome da cidade muito longo').optional(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(500, 'Mensagem muito longa'),
  rating: z.number().min(1, 'Avaliação deve ser entre 1 e 5').max(5, 'Avaliação deve ser entre 1 e 5'),
  avatarUrl: z.string().url('URL do avatar inválida').optional(),
  verified: z.boolean(),
  date: z.string(),
  productId: z.string().optional(),
});

// Schema para criação de testimonial
export const CreateTestimonialSchema = TestimonialSchema.omit({
  id: true,
  date: true,
}).extend({
  avatar: z.instanceof(File).optional(),
});

// Schema de Usuário Admin
export const AdminUserSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  role: UserRoleSchema,
  permissions: z.array(z.string()),
  lastLogin: z.string().optional(),
  createdAt: z.string(),
});

// Schema para criação de usuário
export const CreateUserSchema = AdminUserSchema.omit({
  id: true,
  lastLogin: true,
  createdAt: true,
});

// Schema de login
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Schema de Configuração do Site
export const SiteConfigSchema = z.object({
  siteName: z.string().min(1, 'Nome do site é obrigatório').max(100, 'Nome do site muito longo'),
  logoUrl: z.string().url('URL do logo inválida').optional(),
  faviconUrl: z.string().url('URL do favicon inválida').optional(),
  whatsappNumber: z.string().regex(/^\d{10,15}$/, 'Número de WhatsApp inválido').optional(),
  contactEmail: z.string().email('Email de contato inválido').optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  metaTitle: z.string().max(60, 'Título SEO muito longo').optional(),
  metaDescription: z.string().max(160, 'Descrição SEO muito longa').optional(),
  testimonials: z.array(TestimonialSchema),
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
});

// Schema de Categoria
export const CategorySchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(1, 'Nome da categoria é obrigatório').max(50, 'Nome muito longo'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  description: z.string().max(200, 'Descrição muito longa').optional(),
  imageUrl: z.string().url('URL da imagem inválida').optional(),
  featured: z.boolean(),
  order: z.number().min(0, 'Ordem não pode ser negativa'),
});

// Schema para criação de categoria
export const CreateCategorySchema = CategorySchema.omit({
  id: true,
}).extend({
  image: z.instanceof(File).optional(),
});

// Schema de filtros de produtos
export const ProductFiltersSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().min(0, 'Preço mínimo não pode ser negativo').optional(),
  maxPrice: z.number().positive('Preço máximo deve ser positivo').optional(),
  rating: z.number().min(0, 'Avaliação mínima é 0').max(5, 'Avaliação máxima é 5').optional(),
  tag: ProductTagSchema.optional(),
  marketplace: MarketplaceSchema.optional(),
  availability: AvailabilityStatusSchema.optional(),
  featured: z.boolean().optional(),
  search: z.string().max(100, 'Termo de busca muito longo').optional(),
});

// Schema de paginação
export const PaginationSchema = z.object({
  page: z.number().min(1, 'Página deve ser pelo menos 1').default(1),
  limit: z.number().min(1, 'Limite deve ser pelo menos 1').max(100, 'Limite máximo é 100').default(20),
});

// Schema de ordenação
export const ProductSortSchema = z.enum([
  'price_asc',
  'price_desc', 
  'rating_desc',
  'reviews_desc',
  'created_desc',
  'created_asc',
  'title_asc',
  'title_desc'
]);

// Schema de upload de imagem
export const ImageUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default([
    'image/jpeg',
    'image/png', 
    'image/webp'
  ]),
}).refine(
  (data) => data.file.size <= data.maxSize,
  { message: 'Arquivo muito grande' }
).refine(
  (data) => data.allowedTypes.includes(data.file.type),
  { message: 'Tipo de arquivo não permitido' }
);

// Schema de Analytics de Cliques
export const AffiliateClickSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  productId: z.string().min(1, 'ID do produto é obrigatório'),
  marketplace: MarketplaceSchema,
  timestamp: z.string(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
  referrer: z.string().optional(),
});

// Schema de resposta da API
export const ApiResponseSchema = <T = any>(dataSchema?: z.ZodType<T>) => z.object({
  success: z.boolean(),
  data: dataSchema ? dataSchema.optional() : z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Schema de resposta paginada
export const PaginatedResponseSchema = <T = any>(dataSchema: z.ZodType<T>) => z.object({
  data: z.array(dataSchema),
  total: z.number().min(0),
  page: z.number().min(1),
  limit: z.number().min(1),
  totalPages: z.number().min(0),
});

// Types inferidos dos schemas
export type Marketplace = z.infer<typeof MarketplaceSchema>;
export type AvailabilityStatus = z.infer<typeof AvailabilityStatusSchema>;
export type ProductTag = z.infer<typeof ProductTagSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type ProductFormData = z.infer<typeof CreateProductSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;
export type ProductSort = z.infer<typeof ProductSortSchema>;

// Export default schemas para uso fácil
export default {
  ProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  TestimonialSchema,
  CreateTestimonialSchema,
  AdminUserSchema,
  CreateUserSchema,
  LoginSchema,
  SiteConfigSchema,
  CategorySchema,
  CreateCategorySchema,
  ProductFiltersSchema,
  PaginationSchema,
  ProductSortSchema,
  ImageUploadSchema,
  AffiliateClickSchema,
  ApiResponseSchema,
  PaginatedResponseSchema,
};
