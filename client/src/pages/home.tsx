import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ChevronRight,
  Loader2,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { SocialProofCarousel } from "@/components/SocialProofCarousel";
import type { Product } from "@/types/affiliate";

// Tipo Product importado de @/types/affiliate

const CATEGORIES = [
  "Destaques",
  "Eletrônicos",
  "Casa",
  "Beleza",
  "Moda",
  "Mercado",
  "Infantil",
  "Ferramentas",
];

// Produtos serão carregados da API
const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Smart TV 50\" 4K UHD Samsung",
    price: 2199.9,
    oldPrice: 2699.9,
    installment: "10x sem juros",
    rating: 4.7,
    reviews: 1284,
    tag: "OFERTA",
    category: "Eletrônicos",
    marketplace: "amazon",
    affiliateUrl: "https://www.amazon.com.br/dp/B08N5KWB9H?tag=fiado20",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b31ae5c5c6f?w=400",
      "https://images.unsplash.com/photo-1598327105666-5b31ae5c5c6f?w=400&h=300",
    ],
    thumbnail: "https://images.unsplash.com/photo-1598327105666-5b31ae5c5c6f?w=400",
    availability: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: true,
    published: true,
    slug: "smart-tv-50-4k-uhd-samsung"
  },
  {
    id: "p2",
    title: "Air Fryer 5L Inox Philips",
    price: 399.9,
    oldPrice: 549.9,
    installment: "6x sem juros",
    rating: 4.8,
    reviews: 2351,
    tag: "DESTAQUE",
    category: "Casa",
    marketplace: "mercadoLivre",
    affiliateUrl: "https://produto.mercadolivre.com.br/MLB123456790",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    ],
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    availability: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    published: true,
    slug: "air-fryer-5l-inox-philips"
  },
  {
    id: "p3",
    title: "Kit Skincare Vitamina C L'Oréal",
    price: 129.9,
    oldPrice: 189.9,
    installment: "3x sem juros",
    rating: 4.6,
    reviews: 842,
    tag: "OFERTA",
    category: "Beleza",
    marketplace: "shopee",
    affiliateUrl: "https://shopee.com.br/product/123456791",
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd05ed296d8?w=400"
    ],
    thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd05ed296d8?w=400",
    availability: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    published: true,
    slug: "kit-skincare-vitamina-c-loreal"
  },
  {
    id: "p4",
    title: "Tênis Casual Premium Nike",
    price: 179.9,
    oldPrice: 239.9,
    installment: "5x sem juros",
    rating: 4.5,
    reviews: 512,
    tag: "DESTAQUE",
    category: "Moda",
    marketplace: "amazon",
    affiliateUrl: "https://www.amazon.com.br/dp/B07XJ8C8F5?tag=fiado20",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"
    ],
    thumbnail: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    availability: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    published: true,
    slug: "tenis-casual-premium-nike"
  },
  {
    id: "p5",
    title: "Cesta Mercado Premium",
    price: 89.9,
    oldPrice: 119.9,
    installment: "à vista",
    rating: 4.4,
    reviews: 291,
    tag: "FRETE GRÁTIS",
    category: "Mercado",
    marketplace: "mercadoLivre",
    affiliateUrl: "https://produto.mercadolivre.com.br/MLB123456792",
    images: [
      "https://images.unsplash.com/photo-1607623814075-e51dfc24e5c9?w=400"
    ],
    thumbnail: "https://images.unsplash.com/photo-1607623814075-e51dfc24e5c9?w=400",
    availability: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    published: true,
    slug: "cesta-mercado-premium"
  },
  {
    id: "p6",
    title: "Furadeira + Maleta 500W Bosch",
    price: 249.9,
    oldPrice: 329.9,
    installment: "8x sem juros",
    rating: 4.7,
    reviews: 977,
    tag: "OFERTA",
    category: "Ferramentas",
    marketplace: "shopee",
    affiliateUrl: "https://shopee.com.br/product/123456793",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400"
    ],
    thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
    availability: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    published: true,
    slug: "furadeira-maleta-500w-bosch"
  },
  {
    id: "p7",
    title: "Jogo de Cama Queen 4 Peças",
    price: 159.9,
    oldPrice: 199.9,
    installment: "4x sem juros",
    rating: 4.6,
    reviews: 613,
    tag: "DESTAQUE",
    category: "Casa",
    marketplace: "shopee",
    affiliateUrl: "https://shopee.com.br/product/123456794",
    images: [
      "https://images.unsplash.com/photo-1522741736868-69c7a2fb9b2c?w=400"
    ],
    thumbnail: "https://images.unsplash.com/photo-1522741736868-69c7a2fb9b2c?w=400",
    availability: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    published: true,
    slug: "jogo-de-cama-queen-4-pecas"
  },
  {
    id: "p8",
    title: "Fone Bluetooth ANC Sony",
    price: 299.9,
    oldPrice: 399.9,
    installment: "10x sem juros",
    rating: 4.5,
    reviews: 1402,
    tag: "OFERTA",
    category: "Eletrônicos",
    marketplace: "amazon",
    affiliateUrl: "https://www.amazon.com.br/dp/B07QKJZ1L9?tag=fiado20",
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
    ],
    thumbnail: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    availability: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: true,
    published: true,
    slug: "fone-bluetooth-anc-sony"
  },
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function BrandMark() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2"
      data-testid="link-home"
    >
      <span
        className="grid size-9 place-items-center rounded-xl border bg-card shadow-sm"
        data-testid="img-logo"
        aria-hidden="true"
      >
        <span className="relative">
          <span className="absolute -inset-1 rounded-lg bg-[hsl(var(--accent))] blur-md opacity-35" />
          <span className="relative inline-flex items-center gap-1 font-serif text-[13px] font-semibold tracking-tight text-foreground">
            <span className="text-[hsl(var(--primary))]">L</span>
            <span className="text-[hsl(var(--accent-foreground))]">F</span>
          </span>
        </span>
      </span>
      <div className="leading-tight">
        <div
          className="font-serif text-lg font-semibold tracking-tight"
          data-testid="text-brand"
        >
          LOJA DO FIADO
        </div>
        <div
          className="text-xs text-muted-foreground"
          data-testid="text-tagline"
        >
          Ofertas rápidas. Compra fácil.
        </div>
      </div>
    </Link>
  );
}

function PromoStrip() {
  return (
    <div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <div className="container-shell">
        <div className="flex flex-wrap items-center justify-between gap-2 py-2">
          <div
            className="inline-flex items-center gap-2 text-xs"
            data-testid="text-promo"
          >
            <Sparkles className="size-4 text-[hsl(var(--accent))]" />
            <span className="font-medium">Semana do Fiado:</span>
            <span className="opacity-90">comparamos preços para você economizar</span>
          </div>
          <div className="hidden items-center gap-2 text-xs md:flex">
            <span className="inline-flex items-center gap-2 opacity-90" data-testid="text-trust-1">
              <ShieldCheck className="size-4" />
              Compra segura
            </span>
            <span className="inline-flex items-center gap-2 opacity-90" data-testid="text-trust-2">
              <Truck className="size-4" />
              Entrega rápida
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryPills({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="container-shell">
      <div
        className="flex items-center gap-2 overflow-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-testid="list-categories"
      >
        {CATEGORIES.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                isActive
                  ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-sm"
                  : "bg-card text-foreground hover:bg-[hsl(var(--secondary))]",
              )}
              data-testid={`button-category-${c}`}
            >
              <span className="font-medium">{c}</span>
              {isActive ? (
                <ChevronRight className="size-4" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ProductCard importado do componente separado

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Destaques");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState("https://chat.whatsapp.com/SEUGRUPOAQUI");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?limit=100');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data.products);
        } else {
          setError("Erro ao carregar produtos");
        }
      } catch (err) {
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        if (data.success && data.data?.whatsappGroupUrl) {
          setWhatsappGroupUrl(data.data.whatsappGroupUrl);
        }
      } catch {
        return;
      }
    };

    fetchSettings();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const base = activeCategory === "Destaques"
      ? products
      : products.filter((p) => p.category === activeCategory);

    if (!normalized) return base;
    return base.filter((p) => p.title.toLowerCase().includes(normalized));
  }, [query, activeCategory, products]);

  return (
    <div className="min-h-dvh bg-background grain">
      <PromoStrip />

      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container-shell">
          <div className="flex items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-xl border bg-card hover:bg-[hsl(var(--secondary))] transition"
                data-testid="button-menu"
                aria-label="Menu"
              >
                <Menu className="size-5" />
              </button>
              <BrandMark />
            </div>

            <div className="hidden flex-1 px-6 lg:block">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar produtos, marcas e ofertas..."
                  className="h-11 rounded-2xl border bg-card pl-11"
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="rounded-full bg-green-500 hover:bg-green-600 text-white"
                data-testid="button-whatsapp-group"
                onClick={() => window.open(whatsappGroupUrl, "_blank")}
              >
                <ShoppingBag className="size-4" />
                Entrar no grupo WhatsApp
              </Button>
            </div>
          </div>

          <div className="pb-4 lg:hidden">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="h-11 rounded-2xl border bg-card pl-11"
                data-testid="input-search-mobile"
              />
            </div>
          </div>
        </div>

        <CategoryPills active={activeCategory} onChange={setActiveCategory} />
      </header>

      <main className="container-shell relative z-10">


        <section className="pb-12 md:pb-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight" data-testid="text-section-title">
                Ofertas comparadas para você
              </h2>
              <p className="text-sm text-muted-foreground" data-testid="text-section-subtitle">
                Preços da Amazon, Shopee e Mercado Livre em um só lugar
              </p>
            </div>
            <Button variant="outline" className="rounded-full" data-testid="button-section-more">
              Ver mais
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {loading ? (
            <div className="mt-6 flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div
              className="mt-6 rounded-2xl border bg-card p-6 text-center"
              data-testid="error-products"
            >
              <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-destructive/10">
                <Search className="size-5 text-destructive" />
              </div>
              <div className="mt-3 font-medium" data-testid="text-error-title">
                Erro ao carregar produtos
              </div>
              <div className="mt-1 text-sm text-muted-foreground" data-testid="text-error-subtitle">
                {error}
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="grid-products">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {filteredProducts.length === 0 ? (
                <div
                  className="mt-6 rounded-2xl border bg-card p-6 text-center"
                  data-testid="empty-products"
                >
                  <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-[hsl(var(--secondary))]">
                    <Search className="size-5 text-muted-foreground" />
                  </div>
                  <div className="mt-3 font-medium" data-testid="text-empty-title">
                    Nenhum produto encontrado
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground" data-testid="text-empty-subtitle">
                    Tente outra busca ou escolha outra categoria.
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>

        {/* Seção de Prova Social */}
        <section className="pb-12 md:pb-16">
          <SocialProofCarousel />
        </section>

        <footer className="border-t py-10">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="font-serif text-lg font-semibold" data-testid="text-footer-brand">
                LOJA DO FIADO
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-footer-about">
                Layout inspirado em site de ofertas, pronto para você plugar seus produtos e links.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Atendimento", href: "/" },
                { label: "Trocas", href: "/" },
                { label: "Privacidade", href: "/" },
                { label: "Termos", href: "/" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-muted-foreground hover:text-foreground transition"
                  data-testid={`link-footer-${l.label}`}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold" data-testid="text-footer-cta">
                Receba ofertas
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Seu e-mail"
                  className="h-11 rounded-2xl bg-card"
                  data-testid="input-newsletter"
                />
                <Button className="h-11 rounded-2xl" data-testid="button-newsletter">
                  Assinar
                </Button>
              </div>
              <div className="text-xs text-muted-foreground" data-testid="text-footer-note">
                Sem spam. Só promoções.
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div data-testid="text-copyright">© {new Date().getFullYear()} LOJA DO FIADO</div>
            <div className="inline-flex items-center gap-2" data-testid="text-madefor">
              <span className="opacity-80">Feito para vender mais</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
