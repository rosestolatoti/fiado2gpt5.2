import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  BadgePercent,
  ChevronRight,
  Flame,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Smart TV 50\" 4K UHD",
    price: 2199.9,
    oldPrice: 2699.9,
    installment: "10x sem juros",
    rating: 4.7,
    reviews: 1284,
    tag: "OFERTA",
    category: "Eletrônicos",
  },
  {
    id: "p2",
    title: "Air Fryer 5L Inox",
    price: 399.9,
    oldPrice: 549.9,
    installment: "6x sem juros",
    rating: 4.8,
    reviews: 2351,
    tag: "DESTAQUE",
    category: "Casa",
  },
  {
    id: "p3",
    title: "Kit Skincare Vitamina C",
    price: 129.9,
    oldPrice: 189.9,
    installment: "3x sem juros",
    rating: 4.6,
    reviews: 842,
    tag: "OFERTA",
    category: "Beleza",
  },
  {
    id: "p4",
    title: "Tênis Casual Premium",
    price: 179.9,
    oldPrice: 239.9,
    installment: "5x sem juros",
    rating: 4.5,
    reviews: 512,
    tag: "DESTAQUE",
    category: "Moda",
  },
  {
    id: "p5",
    title: "Cesta Mercado (itens selecionados)",
    price: 89.9,
    oldPrice: 119.9,
    installment: "à vista",
    rating: 4.4,
    reviews: 291,
    tag: "FRETE GRÁTIS",
    category: "Mercado",
  },
  {
    id: "p6",
    title: "Furadeira + Maleta 500W",
    price: 249.9,
    oldPrice: 329.9,
    installment: "8x sem juros",
    rating: 4.7,
    reviews: 977,
    tag: "OFERTA",
    category: "Ferramentas",
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
  },
  {
    id: "p8",
    title: "Fone Bluetooth ANC",
    price: 299.9,
    oldPrice: 399.9,
    installment: "10x sem juros",
    rating: 4.5,
    reviews: 1402,
    tag: "OFERTA",
    category: "Eletrônicos",
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
            <span className="opacity-90">descontos selecionados + frete especial</span>
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

function ProductCard({ product }: { product: Product }) {
  const pct = discountPercent(product.price, product.oldPrice);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative">
        <div
          className="aspect-[4/3] w-full bg-gradient-to-br from-[hsl(var(--secondary))] via-[hsl(var(--background))] to-[hsl(var(--secondary))]"
          data-testid={`img-product-${product.id}`}
        />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          {product.tag ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold tracking-wide",
                product.tag === "FRETE GRÁTIS"
                  ? "bg-emerald-600 text-white"
                  : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
              )}
              data-testid={`badge-tag-${product.id}`}
            >
              {product.tag === "OFERTA" ? (
                <Flame className="size-3" aria-hidden="true" />
              ) : product.tag === "DESTAQUE" ? (
                <Star className="size-3" aria-hidden="true" />
              ) : (
                <Truck className="size-3" aria-hidden="true" />
              )}
              {product.tag}
            </span>
          ) : null}

          {pct ? (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent))] px-2 py-1 text-[11px] font-semibold text-[hsl(var(--accent-foreground))]"
              data-testid={`badge-discount-${product.id}`}
            >
              <BadgePercent className="size-3" aria-hidden="true" />
              -{pct}%
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border bg-card/80 backdrop-blur-sm transition hover:bg-card"
          data-testid={`button-favorite-${product.id}`}
          aria-label="Favoritar"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <div
            className="line-clamp-2 text-sm font-medium text-foreground"
            data-testid={`text-title-${product.id}`}
          >
            {product.title}
          </div>
          <div className="flex items-baseline gap-2">
            <div
              className="font-serif text-xl font-semibold tracking-tight"
              data-testid={`text-price-${product.id}`}
            >
              {formatBRL(product.price)}
            </div>
            {product.oldPrice ? (
              <div
                className="text-xs text-muted-foreground line-through"
                data-testid={`text-oldprice-${product.id}`}
              >
                {formatBRL(product.oldPrice)}
              </div>
            ) : null}
          </div>
          <div
            className="text-xs text-muted-foreground"
            data-testid={`text-installment-${product.id}`}
          >
            {product.installment}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div
            className="inline-flex items-center gap-1 text-xs text-muted-foreground"
            data-testid={`text-rating-${product.id}`}
          >
            <Star className="size-4 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span>({product.reviews})</span>
          </div>

          <Button
            size="sm"
            className="rounded-full"
            data-testid={`button-addcart-${product.id}`}
          >
            <ShoppingCart className="size-4" />
            <span>Adicionar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Destaques");

  const products = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const base = activeCategory === "Destaques"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

    if (!normalized) return base;
    return base.filter((p) => p.title.toLowerCase().includes(normalized));
  }, [query, activeCategory]);

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
                variant="secondary"
                className="hidden rounded-full md:inline-flex"
                data-testid="button-deals"
              >
                <Tag className="size-4" />
                Ver ofertas
              </Button>

              <Button
                variant="outline"
                className="rounded-full"
                data-testid="button-cart"
              >
                <ShoppingBag className="size-4" />
                Carrinho
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
        <section className="py-8 md:py-10">
          <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div
                className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground"
                data-testid="badge-hero"
              >
                <Sparkles className="size-4 text-[hsl(var(--accent))]" />
                Layout estilo ofertas (moderno)
              </div>
              <h1
                className="text-balance font-serif text-4xl font-semibold tracking-tight md:text-5xl"
                data-testid="text-hero-title"
              >
                Ofertas inteligentes da <span className="text-[hsl(var(--primary))]">LOJA DO FIADO</span>
              </h1>
              <p
                className="max-w-[52ch] text-pretty text-base text-muted-foreground md:text-lg"
                data-testid="text-hero-subtitle"
              >
                Um layout inspirado em sites de oferta: categorias em destaque, grid de produtos
                com cards ricos e ações rápidas.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button className="rounded-full" data-testid="button-hero-shop">
                  <ShoppingCart className="size-4" />
                  Comprar agora
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  data-testid="button-hero-whatsapp"
                >
                  Falar no WhatsApp
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2" data-testid="text-hero-trust-1">
                  <ShieldCheck className="size-4 text-[hsl(var(--accent))]" />
                  Pagamento facilitado
                </span>
                <span className="inline-flex items-center gap-2" data-testid="text-hero-trust-2">
                  <Truck className="size-4 text-[hsl(var(--accent))]" />
                  Entrega para sua região
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[28px] bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.25),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(136,19,55,0.22),transparent_65%)] blur-xl" />
              <div
                className="relative overflow-hidden rounded-[28px] border bg-card shadow-soft"
                data-testid="card-hero"
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold" data-testid="text-hero-card-title">
                        Destaques de hoje
                      </div>
                      <div className="text-xs text-muted-foreground" data-testid="text-hero-card-subtitle">
                        Seleção com preço bom e giro rápido
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-full" data-testid="button-hero-card-more">
                      Ver tudo
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {MOCK_PRODUCTS.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-2xl border bg-[hsl(var(--background))] p-3"
                        data-testid={`row-featured-${p.id}`}
                      >
                        <div className="size-12 rounded-xl bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--muted))]" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium" data-testid={`text-featured-title-${p.id}`}>
                            {p.title}
                          </div>
                          <div className="text-xs text-muted-foreground" data-testid={`text-featured-price-${p.id}`}>
                            {formatBRL(p.price)} • {p.installment}
                          </div>
                        </div>
                        <Button size="sm" className="rounded-full" data-testid={`button-featured-add-${p.id}`}>
                          <ShoppingCart className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {["Ofertas", "Top", "Frete"].map((label) => (
                      <div
                        key={label}
                        className="rounded-2xl border bg-card p-3 text-center"
                        data-testid={`card-kpi-${label}`}
                      >
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="font-serif text-lg font-semibold text-[hsl(var(--primary))]">+{label === "Top" ? "120" : label === "Frete" ? "35" : "58"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight" data-testid="text-section-title">
                Produtos em destaque
              </h2>
              <p className="text-sm text-muted-foreground" data-testid="text-section-subtitle">
                Grid com cards, preços e ações rápidas (modelo para sua loja)
              </p>
            </div>
            <Button variant="outline" className="rounded-full" data-testid="button-section-more">
              Ver mais
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="grid-products">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {products.length === 0 ? (
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
