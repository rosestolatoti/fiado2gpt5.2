import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/affiliate";

interface SocialProofCarouselProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Maria da Silva",
    age: 58,
    city: "São Paulo",
    message: "Amei a facilidade para encontrar os produtos! Os preços estão ótimos e o site é muito fácil de usar.",
    rating: 5,
    verified: true,
    date: "2026-01-25",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80"
  },
  {
    id: "t2", 
    name: "José Santos",
    age: 65,
    city: "Rio de Janeiro",
    message: "Parabéns pelo site! Encontrei tudo que precisava com ótimos preços. Recomendo a todos.",
    rating: 5,
    verified: true,
    date: "2026-01-24",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80"
  },
  {
    id: "t3",
    name: "Ana Costa",
    age: 62,
    city: "Belo Horizonte",
    message: "Sou cliente há 6 meses e só tenho elogios! Produtos de qualidade e entrega sempre no prazo.",
    rating: 5,
    verified: true,
    date: "2026-01-23",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80"
  },
  {
    id: "t4",
    name: "Carlos Oliveira",
    age: 70,
    city: "Curitiba",
    message: "Para minha idade, era difícil comprar online. Com este site ficou tudo mais simples!",
    rating: 4,
    verified: true,
    date: "2026-01-22",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80"
  },
  {
    id: "t5",
    name: "Teresa Lima",
    age: 59,
    city: "Salvador",
    message: "Excelente! Encontrei produtos que não achava em nenhum outro lugar. Super recomendo!",
    rating: 5,
    verified: true,
    date: "2026-01-21",
    avatarUrl: "https://images.unsplash.com/photo-1455869415373-2cd6a231dc22?w=80"
  }
];

export function SocialProofCarousel({ 
  testimonials = MOCK_TESTIMONIALS,
  autoPlay = true,
  interval = 5000,
  className 
}: SocialProofCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "size-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Quote className="size-8 text-primary" />
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            O que nossos clientes dizem
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Milhares de brasileiros já compraram através da Loja do Fiado. Veja os depoimentos!
        </p>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Testimonial Card */}
        <Card className="mx-auto max-w-3xl p-8 shadow-lg">
          <div className="grid md:grid-cols-[120px_1fr] gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="size-20 rounded-full overflow-hidden border-4 border-primary/20 mb-3">
                <img
                  src={testimonials[currentIndex].avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonials[currentIndex].name}`}
                  alt={testimonials[currentIndex].name}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-sm">{testimonials[currentIndex].name}</div>
                <div className="text-xs text-muted-foreground">
                  {testimonials[currentIndex].age && `${testimonials[currentIndex].age} anos`}
                  {testimonials[currentIndex].age && testimonials[currentIndex].city && " • "}
                  {testimonials[currentIndex].city}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Rating + Verified */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
                {testimonials[currentIndex].verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Compra verificada
                  </Badge>
                )}
              </div>

              {/* Message */}
              <blockquote className="text-lg leading-relaxed text-foreground italic">
                "{testimonials[currentIndex].message}"
              </blockquote>

              {/* Date */}
              <div className="text-sm text-muted-foreground">
                {formatDate(testimonials[currentIndex].date)}
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={goToPrevious}
          aria-label="Depoimento anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={goToNext}
          aria-label="Próximo depoimento"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={cn(
              "size-2 rounded-full transition-all",
              index === currentIndex 
                ? "bg-primary w-8" 
                : "bg-primary/30 hover:bg-primary/50"
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para depoimento ${index + 1}`}
          />
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-2xl border bg-card">
          <div className="font-serif text-2xl font-bold text-primary">10K+</div>
          <div className="text-sm text-muted-foreground">Clientes satisfeitos</div>
        </div>
        <div className="p-4 rounded-2xl border bg-card">
          <div className="font-serif text-2xl font-bold text-primary">4.8</div>
          <div className="text-sm text-muted-foreground">Média de avaliação</div>
        </div>
        <div className="p-4 rounded-2xl border bg-card">
          <div className="font-serif text-2xl font-bold text-primary">98%</div>
          <div className="text-sm text-muted-foreground">Entregas no prazo</div>
        </div>
        <div className="p-4 rounded-2xl border bg-card">
          <div className="font-serif text-2xl font-bold text-primary">24h</div>
          <div className="text-sm text-muted-foreground">Suporte rápido</div>
        </div>
      </div>
    </div>
  );
}