# 🛍️ Loja do Fiado

> **Ofertas comparadas para você economizar** - Uma plataforma de e-commerce de afiliados que compara preços da Amazon, Shopee e Mercado Livre em um só lugar.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.0.1-000000?logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.14-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)](https://www.postgresql.org/)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Páginas](#páginas)
  - [Página Principal (Home)](#página-principal-home)
  - [Painel Administrativo](#painel-administrativo)
  - [Login Administrativo](#login-administrativo)
  - [Cadastro de Produtos](#cadastro-de-produtos)
- [Como Funciona](#como-funciona)
- [Instalação e Configuração](#instalação-e-configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [API Endpoints](#api-endpoints)
- [Deploy](#deploy)
- [Contato](#contato)

---

## 🎯 Sobre o Projeto

A **Loja do Fiado** é uma plataforma de e-commerce moderna desenvolvida para afiliados de marketplaces. O sistema permite:

- 📦 **Catálogo de Produtos**: Exibição organizada de produtos de múltiplos marketplaces
- 🔍 **Comparação de Preços**: Produtos da Amazon, Shopee e Mercado Livre em um único lugar
- 🏷️ **Categorização**: Filtros por categorias (Eletrônicos, Casa, Beleza, Moda, etc.)
- 🌟 **Produtos em Destaque**: Sistema de destaque para ofertas especiais
- 🔐 **Painel Admin**: Gerenciamento completo de produtos e configurações
- 📊 **Dashboard**: Estatísticas de vendas e produtos

O projeto foi construído com uma arquitetura moderna full-stack utilizando React no frontend, Express no backend e PostgreSQL como banco de dados.

---

## ✨ Funcionalidades

### 🛒 Para Clientes
- ✅ Interface moderna e responsiva
- ✅ Busca de produtos em tempo real
- ✅ Filtros por categoria
- ✅ Sistema de avaliações e reviews
- ✅ Indicadores de desconto
- ✅ Redirecionamento para links de afiliados
- ✅ Grupo de WhatsApp para ofertas

### 🔐 Para Administradores
- ✅ Login seguro com JWT
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de produtos
- ✅ Upload de imagens
- ✅ Gestão de múltiplos marketplaces
- ✅ Sistema de tags e destaques

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.2.0 | Biblioteca UI para construção de interfaces |
| **TypeScript** | 5.6.3 | Superset JavaScript com tipagem estática |
| **Tailwind CSS** | 4.1.14 | Framework CSS utilitário |
| **Vite** | 7.1.9 | Build tool e dev server |
| **Wouter** | 3.3.5 | Router leve para React |
| **TanStack Query** | 5.60.5 | Gerenciamento de estado servidor |
| **Radix UI** | ^1.x | Componentes primitivos acessíveis |
| **Framer Motion** | 12.23.24 | Animações e transições |
| **Lucide React** | 0.545.0 | Biblioteca de ícones |

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Express.js** | 5.0.1 | Framework web para Node.js |
| **TypeScript** | 5.6.3 | Tipagem estática no backend |
| **Drizzle ORM** | 0.39.3 | ORM TypeScript para PostgreSQL |
| **PostgreSQL** | Latest | Banco de dados relacional |
| **JWT** | 9.0.3 | Autenticação via tokens |
| **BcryptJS** | 3.0.3 | Hash de senhas |
| **Zod** | 3.25.76 | Validação de schemas |

### Banco de Dados
| Entidade | Descrição |
|----------|-----------|
| **Users** | Usuários administrativos |
| **Products** | Produtos do catálogo |

### Ferramentas de Desenvolvimento
- **ESBuild** - Bundler rápido
- **Drizzle Kit** - Migrations e CLI do ORM
- **TSX** - Execução de TypeScript
- **PostCSS** - Processamento CSS

---

## 📁 Estrutura do Projeto

```
Loja-Fiaco-Moderno/
├── 📁 client/                    # Frontend React
│   ├── 📁 src/
│   │   ├── 📁 components/        # Componentes React
│   │   │   ├── 📁 ui/           # Componentes de UI (shadcn/ui)
│   │   │   ├── ProductCard.tsx  # Card de produto
│   │   │   ├── ImageUpload.tsx  # Upload de imagens
│   │   │   └── SocialProofCarousel.tsx # Carrossel de prova social
│   │   ├── 📁 hooks/            # Custom React Hooks
│   │   │   ├── useAuth.ts       # Hook de autenticação
│   │   │   └── use-toast.ts     # Hook de notificações
│   │   ├── 📁 lib/              # Utilitários e configurações
│   │   │   ├── utils.ts         # Funções utilitárias
│   │   │   └── queryClient.ts   # Configuração do Query Client
│   │   ├── 📁 pages/            # Páginas da aplicação
│   │   │   ├── home.tsx         # Página principal
│   │   │   ├── not-found.tsx    # Página 404
│   │   │   └── 📁 admin/        # Área administrativa
│   │   │       ├── login.tsx    # Login admin
│   │   │       ├── dashboard.tsx # Dashboard
│   │   │       └── 📁 products/ # Gerenciamento de produtos
│   │   │           └── form.tsx # Form de produto
│   │   ├── 📁 types/            # Tipagens TypeScript
│   │   │   └── affiliate.ts     # Tipos de afiliados
│   │   ├── index.css            # Estilos globais
│   │   ├── main.tsx             # Entry point
│   │   └── App.tsx              # Componente principal
│   └── index.html               # Template HTML
├── 📁 server/                    # Backend Express
│   ├── 📁 routes/               # Rotas da API
│   │   ├── auth.ts              # Autenticação
│   │   └── products.ts          # Produtos
│   ├── db.ts                    # Configuração do banco
│   ├── index.ts                 # Entry point do servidor
│   ├── routes.ts                # Registro de rotas
│   ├── storage.ts               # Interface de storage
│   ├── static.ts                # Servir arquivos estáticos
│   └── vite.ts                  # Integração Vite
├── 📁 shared/                    # Código compartilhado
│   └── schema.ts                # Schema do Drizzle ORM
├── 📁 RELATORIOS/               # Documentação de relatórios
├── 📄 package.json              # Dependências e scripts
├── 📄 tsconfig.json             # Configuração TypeScript
├── 📄 vite.config.ts            # Configuração Vite
└── 📄 README.md                 # Este arquivo
```

---

## 🎨 Páginas

### 🏠 Página Principal (Home)

**Rota:** `/`

A página inicial apresenta um layout moderno inspirado em sites de ofertas:

#### Componentes Principais:
- **Header Sticky**: Logo, busca e botão WhatsApp
- **Faixa Promocional**: "Semana do Fiado" com selos de confiança
- **Categorias**: Pills filtráveis (Destaques, Eletrônicos, Casa, Beleza, etc.)
- **Grid de Produtos**: Cards com imagem, preço, avaliação e tags
- **Prova Social**: Carrossel de depoimentos
- **Footer**: Links e newsletter

#### Funcionalidades:
- ✅ Busca em tempo real
- ✅ Filtro por categoria
- ✅ Indicadores de desconto
- ✅ Redirecionamento para marketplaces
- ✅ Design responsivo (mobile-first)
- ✅ Animações suaves

#### Categorias Disponíveis:
1. 🌟 Destaques
2. 📱 Eletrônicos
3. 🏠 Casa
4. 💄 Beleza
5. 👕 Moda
6. 🛒 Mercado
7. 👶 Infantil
8. 🔧 Ferramentas

---

### 🔐 Painel Administrativo

**Rota:** `/admin`

Área protegida para gestão da loja:

#### Dashboard:
- **Estatísticas Gerais**:
  - Total de produtos
  - Produtos em destaque
  - Produtos disponíveis
  - Taxa de conversão

- **Distribuição por Marketplace**:
  - Amazon 🛒
  - Shopee 🛍️
  - Mercado Livre 📦

- **Lista de Produtos**:
  - Tabela com todos os produtos
  - Filtros por categoria e marketplace
  - Ações: Ver, Editar, Excluir
  - Badges de status

#### Segurança:
- 🔒 Autenticação JWT
- 🔒 Rotas protegidas
- 🔒 Verificação de token

---

### 🔑 Login Administrativo

**Rota:** `/admin/login`

Página de autenticação para acesso ao painel:

#### Features:
- ✅ Formulário com email e senha
- ✅ Validação de campos
- ✅ Toggle de visibilidade da senha
- ✅ Mensagens de erro claras
- ✅ Loading state
- ✅ Design moderno com gradiente

#### Credenciais de Demonstração:
```
Email: admin@lojafiaco.com
Senha: Senha123!
```

---

### ➕ Cadastro de Produtos

**Rota:** `/admin/products/new` | `/admin/products/:id/edit`

Formulário completo para cadastro e edição de produtos:

#### Seções do Formulário:

1. **📋 Informações Básicas**
   - Título do produto
   - Marca
   - Descrição detalhada
   - Categoria
   - Etiqueta (OFERTA, DESTAQUE, FRETE GRÁTIS)
   - Produto em destaque (switch)

2. **💰 Preços e Avaliação**
   - Preço atual
   - Preço anterior (para cálculo de desconto)
   - Parcelamento
   - Avaliação (0-5 estrelas)
   - Número de reviews

3. **🔗 Configuração de Afiliado**
   - Marketplace (Amazon, Shopee, Mercado Livre)
   - URL de afiliado
   - Disponibilidade
   - URL do vídeo (opcional)

4. **🖼️ Imagens do Produto**
   - Upload de até 5 imagens
   - Preview antes do envio
   - Limite de 5MB por imagem

5. **⚙️ Especificações Técnicas**
   - Adicionar/remover especificações dinamicamente
   - Campos chave-valor personalizáveis

#### Validações:
- ✅ Campos obrigatórios
- ✅ Formato de URL
- ✅ Valores numéricos
- ✅ Limite de imagens

---

## ⚙️ Como Funciona

### 🔄 Fluxo de Dados

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Cliente   │────▶│    API      │────▶│  PostgreSQL │
│   (React)   │◀────│  (Express)  │◀────│  (Drizzle)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 🔐 Fluxo de Autenticação

1. **Login**: Usuário envia email/senha
2. **Validação**: Backend verifica credenciais
3. **Token**: JWT gerado e retornado
4. **Storage**: Token salvo no localStorage
5. **Requests**: Token enviado no header Authorization
6. **Verify**: Backend valida token em rotas protegidas

### 📦 Fluxo de Produtos

1. **Cadastro**: Admin preenche formulário
2. **Upload**: Imagens enviadas para storage
3. **Validação**: Zod valida dados
4. **Save**: Drizzle ORM persiste no PostgreSQL
5. **List**: Produtos disponíveis via API
6. **Display**: React renderiza cards

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**:
```bash
git clone https://github.com/rosestolatoti/fiado.git
cd fiado
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
```bash
# Crie um arquivo .env na raiz
DATABASE_URL=postgresql://user:password@localhost:5432/fiado
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
```

4. **Configure o banco de dados**:
```bash
# Crie o banco de dados no PostgreSQL
createdb fiado

# Execute as migrations
npm run db:push
```

5. **Inicie o servidor de desenvolvimento**:
```bash
# Modo desenvolvimento (cliente + servidor)
npm run dev

# Ou separadamente:
npm run dev:client  # Apenas cliente (porta 5000)
npm run dev         # Servidor API (porta 3000)
```

6. **Acesse a aplicação**:
- 🌐 Cliente: http://localhost:5000
- 🔌 API: http://localhost:3000/api

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor em modo desenvolvimento |
| `npm run dev:client` | Inicia apenas o cliente Vite |
| `npm run build` | Compila projeto para produção |
| `npm run start` | Inicia servidor em modo produção |
| `npm run check` | Verifica tipos TypeScript |
| `npm run db:push` | Sincroniza schema com banco de dados |

---

## 🔌 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login de usuário |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/verify` | Verifica token (protegido) |
| PUT | `/api/auth/password` | Atualiza senha (protegido) |

### Produtos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/products` | Lista produtos (com filtros) |
| GET | `/api/products/stats` | Estatísticas (protegido) |
| GET | `/api/products/:id` | Detalhes de um produto |
| POST | `/api/products` | Cria produto (protegido) |
| PUT | `/api/products/:id` | Atualiza produto (protegido) |
| DELETE | `/api/products/:id` | Remove produto (protegido) |

### Query Parameters (GET /api/products)
- `?category=Eletrônicos` - Filtrar por categoria
- `?marketplace=amazon` - Filtrar por marketplace
- `?featured=true` - Apenas destaques
- `?search=smartphone` - Busca por texto
- `?limit=20&offset=0` - Paginação

---

## 📦 Deploy

### Build para Produção

```bash
# Compila o projeto
npm run build

# Inicia em modo produção
npm run start
```

O build cria:
- `dist/public/` - Arquivos estáticos do frontend
- `dist/index.cjs` - Servidor compilado

### Deploy no Replit

O projeto está configurado para deploy automático no Replit:
1. Botão "Deploy" no painel
2. Configurações automáticas
3. Domínio gerado: `https://fiado.seusuario.repl.co`

### Deploy em Servidor Próprio

```bash
# 1. Clone e instale
git clone https://github.com/rosestolatoti/fiado.git
cd fiado
npm install

# 2. Configure .env
# ... configure suas variáveis

# 3. Build
npm run build

# 4. Inicie
npm run start
```

---

## 🔒 Segurança

- ✅ Senhas hasheadas com BcryptJS
- ✅ Autenticação JWT com expiração
- ✅ Proteção CSRF via SameSite cookies
- ✅ Validação de inputs com Zod
- ✅ SQL Injection protegido (Drizzle ORM)
- ✅ XSS protegido (React sanitização)

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT.

---

## 📧 Contato

**Desenvolvedor:** rosestolatoti  
**Email:** rosestolatoti@gmail.com  
**Repositório:** https://github.com/rosestolatoti/fiado

---

<p align="center">
  Feito com ❤️ para ajudar afiliados a venderem mais
</p>

<p align="center">
  <strong>Loja do Fiado</strong> - Ofertas rápidas. Compra fácil.
</p>