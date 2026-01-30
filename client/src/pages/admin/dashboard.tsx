import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Package, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Tag,
  Truck,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@/types/affiliate";

// Mock de dados do dashboard
const mockStats = {
  totalProducts: 156,
  featuredProducts: 23,
  availableProducts: 142,
  byMarketplace: {
    amazon: 68,
    shopee: 52,
    mercadoLivre: 36
  },
  byCategory: {
    "Eletrônicos": 34,
    "Casa": 28,
    "Beleza": 22,
    "Moda": 19,
    "Mercado": 15,
    "Ferramentas": 13,
    "Infantil": 15,
    "Destaques": 10
  }
};

const mockProducts: Product[] = [
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
    affiliateUrl: "https://www.amazon.com.br/dp/B08N5KWB9H",
    images: ["https://images.unsplash.com/photo-1598327105666-5b31ae5c5c6f?w=400"],
    thumbnail: "https://images.unsplash.com/photo-1598327105666-5b31ae5c5c6f?w=400",
    availability: "available",
    createdAt: "2026-01-25T10:30:00Z",
    updatedAt: "2026-01-29T14:15:00Z",
    featured: true,
    slug: "smart-tv-50-4k-uhd-samsung"
  },
  // ... outros produtos
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLoc] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMarketplace, setFilterMarketplace] = useState("all");

  const formatBRL = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesMarketplace = filterMarketplace === "all" || product.marketplace === filterMarketplace;
    
    return matchesSearch && matchesCategory && matchesMarketplace;
  });

  const getMarketplaceBadge = (marketplace: string) => {
    const variants = {
      amazon: "bg-orange-100 text-orange-800 border-orange-200",
      shopee: "bg-red-100 text-red-800 border-red-200", 
      mercadoLivre: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    
    const icons = {
      amazon: "🛒",
      shopee: "🛍️",
      mercadoLivre: "📦"
    };

    return (
      <Badge variant="outline" className={variants[marketplace as keyof typeof variants]}>
        {icons[marketplace as keyof typeof icons]} {marketplace}
      </Badge>
    );
  };

  const getAvailabilityBadge = (availability: string) => {
    const variants = {
      available: "bg-green-100 text-green-800 border-green-200",
      out_of_stock: "bg-red-100 text-red-800 border-red-200",
      unavailable: "bg-gray-100 text-gray-800 border-gray-200"
    };

    const labels = {
      available: "Disponível",
      out_of_stock: "Esgotado", 
      unavailable: "Indisponível"
    };

    return (
      <Badge variant="outline" className={variants[availability as keyof typeof variants]}>
        {labels[availability as keyof typeof labels]}
      </Badge>
    );
  };

  const getTagIcon = (tag?: string) => {
    switch (tag) {
      case "OFERTA": return <Flame className="size-3" />;
      case "DESTAQUE": return <Star className="size-3" />;
      case "FRETE GRÁTIS": return <Truck className="size-3" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg border bg-primary text-primary-foreground">
                <span className="font-serif text-sm font-bold">LF</span>
              </div>
              <div>
                <div className="font-semibold">Painel Admin</div>
                <div className="text-xs text-muted-foreground">Loja do Fiado</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Bem-vindo, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos em Destaque</CardTitle>
              <Star className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.featuredProducts}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((mockStats.featuredProducts / mockStats.totalProducts) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.availableProducts}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((mockStats.availableProducts / mockStats.totalProducts) * 100)}% ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">
                +0.5% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Distribution */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Amazon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{mockStats.byMarketplace.amazon}</div>
                  <p className="text-sm text-muted-foreground">produtos</p>
                </div>
                <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-lg">🛒</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Shopee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{mockStats.byMarketplace.shopee}</div>
                  <p className="text-sm text-muted-foreground">produtos</p>
                </div>
                <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-lg">🛍️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mercado Livre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{mockStats.byMarketplace.mercadoLivre}</div>
                  <p className="text-sm text-muted-foreground">produtos</p>
                </div>
                <div className="size-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produtos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Gerencie seu catálogo de produtos
                </p>
              </div>
              <Button onClick={() => setLoc("/admin/products/new")}>
                <Plus className="size-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Beleza">Beleza</SelectItem>
                  <SelectItem value="Moda">Moda</SelectItem>
                  <SelectItem value="Mercado">Mercado</SelectItem>
                  <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMarketplace} onValueChange={setFilterMarketplace}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Marketplace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os marketplaces</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="shopee">Shopee</SelectItem>
                  <SelectItem value="mercadoLivre">Mercado Livre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="size-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium line-clamp-1 max-w-[200px]">
                              {product.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {product.tag && (
                                <Badge variant="secondary" className="text-xs">
                                  {getTagIcon(product.tag)}
                                  {product.tag}
                                </Badge>
                              )}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                <span>{product.rating}</span>
                                <span>({product.reviews})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatBRL(product.price)}</div>
                          {product.oldPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatBRL(product.oldPrice)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{getMarketplaceBadge(product.marketplace)}</TableCell>
                      <TableCell>{getAvailabilityBadge(product.availability)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}