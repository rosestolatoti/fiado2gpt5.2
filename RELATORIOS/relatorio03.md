# RELATÓRIO 03 - PLANEJAMENTO DA IMPLEMENTAÇÃO

**Data:** 29/01/2026  
**Status:** Em andamento  
**Responsável:** Sisyphus + Agentes Especializados

---

## 🎯 FASE 1: DEFINIÇÃO DA ESTRUTURA DE DADOS

### Análise da Estrutura Atual vs Necessária

#### 📋 Tipo Product - ATUAL
```typescript
type Product = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  installment?: string;
  rating: number;
  reviews: number;
  tag?: "OFERTA" | "DESTAQUE" | "FRETE GRÁTIS";
  category: string;
};
```

#### 🚀 Tipo Product - EXPANDIDO (Proposta)
```typescript
type Product = {
  // Campos existentes (mantidos)
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  installment?: string;
  rating: number;
  reviews: number;
  tag?: "OFERTA" | "DESTAQUE" | "FRETE GRÁTIS";
  category: string;
  
  // 🆕 Campos para afiliados
  affiliateUrls: {
    amazon?: string;
    shopee?: string;
    mercadoLivre?: string;
  };
  
  // 🆕 Mídia avançada
  images: string[];           // Múltiplas imagens
  video?: string;             // URL do vídeo (YouTube/Vimeo)
  thumbnail: string;           // Imagem principal
  
  // 🆕 Informações detalhadas
  description?: string;        // Descrição completa
  specifications?: Record<string, string>; // Especificações técnicas
  brand?: string;             // Marca do produto
  model?: string;             // Modelo específico
  
  // 🆕 Controle de afiliados
  availability: {
    amazon: 'available' | 'out_of_stock' | 'unavailable';
    shopee: 'available' | 'out_of_stock' | 'unavailable';
    mercadoLivre: 'available' | 'out_of_stock' | 'unavailable';
  };
  
  // 🆕 Metadata
  createdAt: string;
  updatedAt: string;
  featured: boolean;          // Produto em destaque
  slug: string;               // URL amigável
};
```

---

## 🏗️ ESTRUTURA DO PAINEL ADMIN

### Tipos para Sistema Admin

#### 📊 SiteConfig - Configurações do Site
```typescript
type SiteConfig = {
  // Identidade visual
  siteName: string;
  logoUrl?: string;
  faviconUrl?: string;
  
  // Contato
  whatsappNumber?: string;
  contactEmail?: string;
  
  // Cores personalizadas
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
};
```

#### 🗣️ Testimonial - Prova Social
```typescript
type Testimonial = {
  id: string;
  name: string;
  age?: number;
  city?: string;
  message: string;
  rating: number;           // 1-5 estrelas
  avatarUrl?: string;
  verified: boolean;        // Compra verificada
  date: string;
};
```

#### 👤 AdminUser - Usuário Admin
```typescript
type AdminUser = {
  id: string;
  name: string;
  email: string;
  password: string;        // Hashed
  role: 'admin' | 'editor';
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
};
```

---

## 📁 ESTRUTURA DE ARQUIVOS PROPOSTA

### Frontend - Novos Arquivos
```
client/src/
├── pages/
│   ├── admin/
│   │   ├── login.tsx              # Login do painel admin
│   │   ├── dashboard.tsx          # Dashboard principal
│   │   ├── products/
│   │   │   ├── list.tsx          # Listagem de produtos
│   │   │   ├── create.tsx         # Criar produto
│   │   │   └── edit.tsx          # Editar produto
│   │   ├── settings/
│   │   │   ├── site.tsx          # Configurações do site
│   │   │   ├── testimonials.tsx   # Gerenciar provas sociais
│   │   │   └── profile.tsx        # Perfil do usuário
│   │   └── layout.tsx             # Layout admin
│   └── product/
│       └── [slug].tsx              # Página detalhes do produto
├── components/
│   ├── admin/
│   │   ├── ProductForm.tsx         # Formulário de produto
│   │   ├── ImageUpload.tsx         # Upload de imagens
│   │   ├── MarketplaceButtons.tsx   # Botões dos marketplaces
│   │   ├── TestimonialCard.tsx      # Card de prova social
│   │   └── SocialProofCarousel.tsx  # Carrossel de provas sociais
│   └── product/
│       ├── ProductCard.tsx         # Card produto (atualizado)
│       ├── ProductGallery.tsx       # Galeria de imagens
│       └── VideoPlayer.tsx         # Player de vídeo
├── hooks/
│   ├── useAuth.ts                  # Autenticação
│   ├── useProducts.ts              # CRUD produtos
│   ├── useImageUpload.ts           # Upload de imagens
│   └── useLocalStorage.ts          # Persistência local
└── lib/
    ├── api.ts                      # Cliente API
    ├── auth.ts                     # Funções de autenticação
    └── validations.ts              # Validações Zod
```

### Backend - Novos Arquivos
```
server/
├── routes/
│   ├── auth.ts                     # Rotas de autenticação
│   ├── products.ts                 # CRUD de produtos
│   ├── settings.ts                 # Configurações do site
│   ├── testimonials.ts            # Provas sociais
│   └── upload.ts                  # Upload de arquivos
├── middleware/
│   ├── auth.ts                    # Middleware de autenticação
│   ├── upload.ts                  # Middleware de upload
│   └── validation.ts              # Validação de dados
├── controllers/
│   ├── authController.ts          # Controller auth
│   ├── productController.ts       # Controller produtos
│   └── settingsController.ts       # Controller configurações
└── utils/
    ├── jwt.ts                     # Utilitários JWT
    ├── password.ts                # Hash de senhas
    └── upload.ts                 # Gestão de uploads
```

---

## 🎨 IMPLEMENTAÇÃO POR FASES

### FASE 1 - Fundamentos (HOJE)
1. **Estrutura de Dados**
   - [ ] Criar tipos TypeScript expandidos
   - [ ] Criar schemas Zod para validação
   - [ ] Migrar MOCK_PRODUCTS para nova estrutura

2. **Componentes Base**
   - [ ] Criar ImageUpload.tsx
   - [ ] Atualizar ProductCard.tsx para afiliados
   - [ ] Criar MarketplaceButtons.tsx

### FASE 2 - Transformação Afiliados (DIA 2)
1. **Página Principal**
   - [ ] Atualizar home.tsx com novos campos
   - [ ] Implementar links de afiliado
   - [ ] Adicionar galeria de imagens

2. **Botões Marketplace**
   - [ ] Implementar cores oficiais
   - [ ] Lógica de disponibilidade
   - [ ] Redirecionamento seguro

### FASE 3 - Painel Admin (DIA 3-4)
1. **Autenticação**
   - [ ] Sistema de login
   - [ ] Session management
   - [ ] Proteção de rotas

2. **CRUD Produtos**
   - [ ] Formulário completo
   - [ ] Upload de imagens
   - [ ] Validações

### FASE 4 - Recursos Avançados (DIA 5)
1. **Prova Social**
   - [ ] Sistema de testimonials
   - [ ] Carrossel automático
   - [ ] Validação social

2. **Configurações**
   - [ ] Editor visual do site
   - [ ] Personalização de cores
   - [ ] SEO optimization

---

## 🔧 TECNOLOGIAS E FERRAMENTAS

### Stack Técnico Definido
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Drizzle ORM + PostgreSQL
- **Upload**: Multer + Cloudinary (ou armazenamento local)
- **Auth**: JWT + bcrypt
- **Validação**: Zod + React Hook Form
- **Estado**: TanStack Query + localStorage

### Ferramentas de Desenvolvimento
- **Componentes**: 55 componentes shadcn/ui prontos
- **Build**: Vite (rápido e moderno)
- **Deploy**: Replit Deploy (simples)
- **Versionamento**: Git (já configurado)

---

## ⚠️ PONTOS CRÍTICOS DE IMPLEMENTAÇÃO

### 🎯 Prioridades Altas
1. **Upload de imagens** - Não existe componente, precisa criar
2. **Autenticação segura** - Proteger painel admin
3. **Performance** - Múltiplas imagens não podem pesar
4. **UX para sênior** - Interface extremamente intuitiva

### 🚧 Desafios Técnicos
1. **Persistência de dados** - Migrar de mock para banco real
2. **Links afiliado** - Validação e rastreamento
3. **Editor visual** - Sistema de edição em tempo real
4. **Mobile responsiveness** - Layout adaptável

### 📊 Métricas de Sucesso
- **Tempo de carregamento** < 3s
- **Taxa de conversão** > 2%
- **Usabilidade sênior** (feedback positivo)
- **Acessibilidade** WCAG 2.1 AA

---

## 🔄 PRÓXIMA AÇÃO IMEDIATA

### 📋 TODO #1: Definir Estrutura de Dados
- [ ] Criar tipos TypeScript completos
- [ ] Definir schemas Zod para validação
- [ ] Criar interfaces para API
- [ ] Planejar migração de dados

### 🎯 Foco Principal
Transformar estrutura atual para suportar:
- Múltiplos marketplaces por produto
- Upload e gestão de múltiplas imagens
- Sistema de provas sociais
- Configurações visuais editáveis

---

**Status:** 🔄 Aguardando aprovação para iniciar implementação  
**Próxima atualização:** Relatório 04 - Implementação FASE 1 completa