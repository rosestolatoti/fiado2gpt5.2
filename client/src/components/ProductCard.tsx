import { useState } from "react";
import { Heart, Play, Star, Flame, Truck, BadgePercent, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/affiliate";

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showFavorite?: boolean;
  className?: string;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function truncateTitle(title: string, maxLength = 80) {
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength - 3).trim()}...`;
}

// Cores e informações dos marketplaces
const MARKETPLACE_INFO = {
  amazon: {
    name: 'Amazon',
    icon: '🛒',
    shortName: 'Amazon',
    color: '#FF9900',
    hoverColor: '#E88B00',
    textColor: '#FFFFFF'
  },
  shopee: {
    name: 'Shopee',
    icon: '🛍️',
    shortName: 'Shopee',
    color: '#EE4D2D',
    hoverColor: '#D0011B',
    textColor: '#FFFFFF'
  },
  mercadoLivre: {
    name: 'Mercado Livre',
    icon: '📦',
    shortName: 'ML',
    color: '#FFE600',
    hoverColor: '#F4D600',
    textColor: '#000000'
  }
} as const;

export function ProductCard({ 
  product, 
  size = 'md', 
  showFavorite = true,
  className 
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const pct = discountPercent(product.price, product.oldPrice);
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const currentImage = images[currentImageIndex] || '';
  const marketplaceInfo = MARKETPLACE_INFO[product.marketplace];
  const displayTitle = truncateTitle(product.title);

  const sizes = {
    sm: {
      card: "max-w-sm",
      image: "aspect-[4/3]",
      title: "text-sm",
      price: "text-lg",
      spacing: "p-3"
    },
    md: {
      card: "max-w-md", 
      image: "aspect-[4/3]",
      title: "text-sm",
      price: "text-xl",
      spacing: "p-4"
    },
    lg: {
      card: "max-w-lg",
      image: "aspect-[16/12]",
      title: "text-base", 
      price: "text-2xl",
      spacing: "p-5"
    }
  };

  const currentSize = sizes[size];

  const getButtonText = () => {
    switch (product.availability) {
      case 'available':
        return `Ver na ${marketplaceInfo.shortName}`;
      case 'out_of_stock':
        return `Esgotado na ${marketplaceInfo.shortName}`;
      case 'unavailable':
        return `Indisponível na ${marketplaceInfo.shortName}`;
      default:
        return `Ver na ${marketplaceInfo.shortName}`;
    }
  };

  const handleButtonClick = () => {
    if (product.availability === 'available' && product.affiliateUrl) {
      window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');

      const analytics = window as Window & { gtag?: (...args: unknown[]) => void };
      if (analytics.gtag) {
        analytics.gtag('event', 'affiliate_click', {
          marketplace: product.marketplace,
          product_id: product.id,
          product_title: product.title
        });
      }
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
        currentSize.card,
        className
      )}
      data-testid={`card-product-${product.id}`}
    >
      {/* Imagem Principal */}
      <div className="relative">
        <div className={cn("w-full overflow-hidden", currentSize.image)}>
          <img
            src={currentImage}
            alt={product.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
            onError={(e) => {
              // Fallback para placeholder se a imagem falhar
              (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="400" height="300" fill="#f0f0f0"/>
                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="sans-serif">
                    Sem imagem
                  </text>
                </svg>
              `)}`;
            }}
          />
          
          {/* Overlay de vídeo se existir */}
          {product.video && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="lg" className="rounded-full" variant="secondary">
                <Play className="size-6" />
              </Button>
            </div>
          )}
        </div>

        {/* Navegação de Imagens */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  index === currentImageIndex 
                    ? "bg-white w-4" 
                    : "bg-white/50"
                )}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {product.tag && (
            <Badge
              variant="secondary"
              className={cn(
                "text-[11px] font-semibold tracking-wide",
                product.tag === "FRETE GRÁTIS" && "bg-emerald-600 text-white border-emerald-600"
              )}
              data-testid={`badge-tag-${product.id}`}
            >
              {product.tag === "OFERTA" ? (
                <Flame className="size-3 mr-1" />
              ) : product.tag === "DESTAQUE" ? (
                <Star className="size-3 mr-1" />
              ) : (
                <Truck className="size-3 mr-1" />
              )}
              {product.tag}
            </Badge>
          )}

          {pct && (
            <Badge 
              variant="outline"
              className="bg-accent text-accent-foreground text-[11px] font-semibold"
              data-testid={`badge-discount-${product.id}`}
            >
              <BadgePercent className="size-3 mr-1" />
              -{pct}%
            </Badge>
          )}

          {/* Badge do Marketplace */}
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-2 py-1",
              product.marketplace === 'amazon' && "border-orange-200 bg-orange-50 text-orange-700",
              product.marketplace === 'shopee' && "border-red-200 bg-red-50 text-red-700",
              product.marketplace === 'mercadoLivre' && "border-yellow-200 bg-yellow-50 text-yellow-700"
            )}
          >
            {marketplaceInfo.icon} {marketplaceInfo.name}
          </Badge>
        </div>

        {/* Botão de Favorito */}
        {showFavorite && (
          <button
            type="button"
            onClick={() => setIsFavorited(!isFavorited)}
            className={cn(
              "absolute right-3 top-3 grid size-9 place-items-center rounded-full border backdrop-blur-sm transition-all",
              "bg-card/80 hover:bg-card hover:scale-110",
              isFavorited && "bg-red-50 border-red-200 text-red-500"
            )}
            data-testid={`button-favorite-${product.id}`}
            aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className={cn("size-4", isFavorited && "fill-current")} />
          </button>
        )}
      </div>

      {/* Informações do Produto */}
      <div className={cn("space-y-3", currentSize.spacing)}>
        <div className="space-y-1">
          <h3
            className={cn("font-medium line-clamp-2 text-foreground", currentSize.title)}
            data-testid={`text-title-${product.id}`}
          >
            {displayTitle}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <div
              className={cn("font-serif font-semibold tracking-tight text-primary", currentSize.price)}
              data-testid={`text-price-${product.id}`}
            >
              {formatBRL(product.price)}
            </div>
            {product.oldPrice && (
              <div
                className="text-xs text-muted-foreground line-through"
                data-testid={`text-oldprice-${product.id}`}
              >
                {formatBRL(product.oldPrice)}
              </div>
            )}
          </div>
          
          {product.installment && (
            <div
              className="text-xs text-muted-foreground"
              data-testid={`text-installment-${product.id}`}
            >
              {product.installment}
            </div>
          )}
        </div>

        {/* Avaliação */}
        <div className="flex items-center justify-between gap-3">
          <div
            className="inline-flex items-center gap-1 text-xs text-muted-foreground"
            data-testid={`text-rating-${product.id}`}
          >
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span>({product.reviews.toLocaleString('pt-BR')})</span>
          </div>
        </div>

        {/* ÚNICO BOTÃO DO MARKETPLACE */}
        <Button
          size={size === 'lg' ? 'lg' : 'default'}
          className={cn(
            "rounded-full font-medium transition-all hover:scale-105 w-full",
            product.availability === 'available' && cn(
              "border-2 text-white",
              `bg-[${marketplaceInfo.color}] hover:bg-[${marketplaceInfo.hoverColor}] border-[${marketplaceInfo.color}]`
            ),
            product.availability === 'out_of_stock' && "opacity-60 cursor-not-allowed bg-muted text-muted-foreground",
            product.availability === 'unavailable' && "opacity-60 cursor-not-allowed bg-muted text-muted-foreground"
          )}
          disabled={product.availability !== 'available'}
          onClick={handleButtonClick}
          data-testid={`button-marketplace-${product.id}`}
        >
          <span className="mr-2">{marketplaceInfo.icon}</span>
          <span>{getButtonText()}</span>
          {product.availability === 'available' && (
            <ExternalLink className="size-3 ml-2" />
          )}
        </Button>
      </div>
    </div>
  );
}
