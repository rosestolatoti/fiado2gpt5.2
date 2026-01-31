import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { 
  Package, 
  TrendingUp, 
  ShoppingCart,
  Plus,
  Search,
  Edit,
  Trash2,
  EyeOff,
  Star,
  Truck,
  Flame,
  Upload,
  Download,
  XCircle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@/types/affiliate";

const CATEGORIES = [
  "Destaques",
  "Cozinha",
  "Casa",
  "Decoração",
  "Limpeza",
  "Eletrônicos",
  "Celulares",
  "Acessórios",
  "Áudio",
  "Informática",
  "Moda Feminina",
  "Moda Masculina",
  "Beleza",
  "Saúde",
  "Mercado",
  "Infantil",
  "Ferramentas",
  "Pets",
  "Automotivo",
  "Esporte",
  "Jardim",
  "Outros",
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLoc] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMarketplace, setFilterMarketplace] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [storageMode, setStorageMode] = useState<"database" | "memory" | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCatalog: 0,
    featuredProducts: 0,
    availableProducts: 0,
    byMarketplace: {
      amazon: 0,
      shopee: 0,
      mercadoLivre: 0,
    },
    byCategory: {},
    recentProducts: [],
  });

  const formatBRL = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const getMarketplacePercent = (count: number) => {
    return stats.totalProducts > 0 ? Math.round((count / stats.totalProducts) * 100) : 0;
  };

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await fetch("/api/products?limit=200&sortBy=created_desc&published=all", { cache: "no-store" });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products || []);
        setStorageMode(data.meta?.storage ?? null);
      }
    } finally {
      setProductsLoading(false);
    }
  };

  const loadStats = async () => {
    const response = await fetch("/api/products/stats", {
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (data.success) {
      setStats(data.data);
      setStorageMode(data.meta?.storage ?? null);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    void loadStats();
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "products_updated_at") {
        void loadProducts();
        void loadStats();
      }
    };

    const onProductsUpdated = () => {
      void loadProducts();
      void loadStats();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("products-updated", onProductsUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("products-updated", onProductsUpdated);
    };
  }, []);

  const handleRemoveFromSite = async (productId: string) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ published: false }),
    });
    const data = await response.json();
    if (data.success) {
      await loadProducts();
      await loadStats();
    }
  };

  const handlePublishToSite = async (productId: string) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ published: true }),
    });
    const data = await response.json();
    if (data.success) {
      await loadProducts();
      await loadStats();
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const response = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (data.success) {
      await loadProducts();
      await loadStats();
    }
  };

  const handleBulkRemoveFromSite = async () => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ published: false }),
        })
      )
    );
    setSelectedIds([]);
    await loadProducts();
    await loadStats();
  };

  const handleBulkPublishToSite = async () => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ published: true }),
        })
      )
    );
    setSelectedIds([]);
    await loadProducts();
    await loadStats();
  };

  const handleBulkDelete = async () => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        })
      )
    );
    setSelectedIds([]);
    await loadProducts();
    await loadStats();
  };

  const handleBulkDeleteBoth = async () => {
    await handleBulkDelete();
  };

  const handleToggleSelection = (productId: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((product) => product.id));
      return;
    }
    setSelectedIds([]);
  };

  const escapeCsvValue = (value: string) => {
    if (value.includes('"') || value.includes(",") || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const handleExportCsv = () => {
    const headers = [
      "title",
      "price",
      "oldPrice",
      "installment",
      "rating",
      "reviews",
      "tag",
      "category",
      "marketplace",
      "affiliateUrl",
      "images",
      "thumbnail",
      "description",
      "specifications",
      "brand",
      "model",
      "availability",
      "featured",
      "published",
      "video",
    ];
    const rows = filteredProducts.map((product) => [
      product.title,
      String(product.price ?? ""),
      String(product.oldPrice ?? ""),
      product.installment ?? "",
      String(product.rating ?? ""),
      String(product.reviews ?? ""),
      product.tag ?? "",
      product.category ?? "",
      product.marketplace ?? "",
      product.affiliateUrl ?? "",
      (product.images ?? []).join("|"),
      product.thumbnail ?? "",
      product.description ?? "",
      JSON.stringify(product.specifications ?? {}),
      product.brand ?? "",
      product.model ?? "",
      product.availability ?? "",
      String(product.featured ?? false),
      String(product.published ?? true),
      product.video ?? "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "produtos.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const parseCsvLine = (line: string) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];
      if (char === '"' && inQuotes && next === '"') {
        current += '"';
        i += 1;
        continue;
      }
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    result.push(current);
    return result.map((value) => value.trim());
  };

  const handleImportCsv = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      return;
    }
    const headers = parseCsvLine(lines[0]).map((header) => header.trim());
    const records = lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      return headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = values[index] ?? "";
        return acc;
      }, {});
    });

    await Promise.all(
      records.map((record) => {
        const images = record.images
          ? record.images.split("|").map((value) => value.trim()).filter(Boolean)
          : [];
        let specifications: Record<string, string> = {};
        if (record.specifications) {
          try {
            specifications = JSON.parse(record.specifications);
          } catch {
            specifications = {};
          }
        }
        const payload = {
          title: record.title,
          price: record.price ? Number(record.price) : 0,
          oldPrice: record.oldPrice ? Number(record.oldPrice) : undefined,
          installment: record.installment || "",
          rating: record.rating ? Number(record.rating) : 0,
          reviews: record.reviews ? Number(record.reviews) : 0,
          tag: record.tag || undefined,
          category: record.category || "Destaques",
          marketplace: record.marketplace || "amazon",
          affiliateUrl: record.affiliateUrl || "",
          images,
          thumbnail: record.thumbnail || images[0] || "",
          description: record.description || "",
          specifications,
          brand: record.brand || "",
          model: record.model || "",
          availability: record.availability || "available",
          featured: record.featured === "true",
          published: record.published !== "false",
          video: record.video || "",
        };
        return fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        });
      })
    );

    await loadProducts();
    await loadStats();
    setSelectedIds([]);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesMarketplace = filterMarketplace === "all" || product.marketplace === filterMarketplace;
    
    return matchesSearch && matchesCategory && matchesMarketplace;
  });

  const allSelected = selectedIds.length > 0 && selectedIds.length === filteredProducts.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < filteredProducts.length;

  const getMarketplaceBadge = (marketplace: string) => {
    const variants = {
      amazon: "bg-orange-100 text-orange-800 border-orange-200",
      shopee: "bg-red-100 text-red-800 border-red-200", 
      mercadoLivre: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };

    const labels = {
      amazon: "Amazon",
      shopee: "Shopee",
      mercadoLivre: "Mercado Livre"
    };

    return (
      <Badge variant="outline" className={variants[marketplace as keyof typeof variants]}>
        {labels[marketplace as keyof typeof labels]}
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

  const amazonCount = stats.byMarketplace.amazon || 0;
  const shopeeCount = stats.byMarketplace.shopee || 0;
  const mercadoLivreCount = stats.byMarketplace.mercadoLivre || 0;
  const amazonPercent = getMarketplacePercent(amazonCount);
  const shopeePercent = getMarketplacePercent(shopeeCount);
  const mercadoLivrePercent = getMarketplacePercent(mercadoLivreCount);

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
        {storageMode === "memory" && (
          <Alert className="mb-6">
            <AlertDescription>
              Banco de dados não conectado. Os cadastros ficam temporários e podem sumir ao reiniciar.
            </AlertDescription>
          </Alert>
        )}
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos publicados</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Total de publicações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos no banco</CardTitle>
              <ShoppingCart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCatalog}</div>
              <p className="text-xs text-muted-foreground">
                Produtos únicos por título
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos em Destaque</CardTitle>
              <Star className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalProducts > 0 ? Math.round((stats.featuredProducts / stats.totalProducts) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalProducts > 0 ? Math.round((stats.availableProducts / stats.totalProducts) * 100) : 0}% ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Distribution */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Amazon</CardTitle>
                <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
                  AMZ
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{amazonCount}</div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${amazonPercent}%`, background: "linear-gradient(90deg, #3b82f6, #0f172a)" }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{amazonPercent}% do catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Shopee</CardTitle>
                <span className="rounded-full bg-orange-500 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
                  SHP
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopeeCount}</div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${shopeePercent}%`, background: "linear-gradient(90deg, #ff6a00, #ee4d2d)" }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{shopeePercent}% do catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Mercado Livre</CardTitle>
                <span className="rounded-full bg-yellow-300 px-2 py-1 text-[10px] font-semibold tracking-wide text-yellow-900">
                  ML
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mercadoLivreCount}</div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${mercadoLivrePercent}%`, background: "linear-gradient(90deg, #fde047, #111827)" }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{mercadoLivrePercent}% do catálogo</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-extrabold tracking-wide">
                  TITULO PRODUTOS BANCO DE DADOS
                </CardTitle>
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
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
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
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleImportCsv(file);
                    }
                    event.currentTarget.value = "";
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-4 mr-2" />
                  Importar CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                >
                  <Download className="size-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 p-3">
                <div className="text-sm text-muted-foreground">
                  {selectedIds.length} selecionado(s)
                </div>
                <Button variant="outline" size="sm" onClick={handleBulkPublishToSite}>
                  <Eye className="size-4 mr-2" />
                  Publicar no site
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkRemoveFromSite}>
                  <EyeOff className="size-4 mr-2" />
                  Remover do site
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="size-4 mr-2" />
                  Excluir do banco
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                  Limpar seleção
                </Button>
              </div>
            )}

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                        onCheckedChange={(checked) => handleToggleAll(Boolean(checked))}
                      />
                    </TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Preço atual</TableHead>
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-center">Olho</TableHead>
                    <TableHead className="text-center">Editar</TableHead>
                    <TableHead className="text-center">Lixeira</TableHead>
                    <TableHead className="text-center">Publicar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(product.id)}
                          onCheckedChange={(checked) => handleToggleSelection(product.id, Boolean(checked))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="size-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium whitespace-normal max-w-[360px]">
                              {product.title}
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
                      <TableCell>{getMarketplaceBadge(product.marketplace)}</TableCell>
                      <TableCell>{formatDate(product.createdAt)}</TableCell>
                      <TableCell>
                        {product.tag ? (
                          <Badge variant="secondary" className="text-xs">
                            {getTagIcon(product.tag)}
                            {product.tag}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromSite(product.id)}
                          title="Ocultar do site"
                          disabled={product.published === false}
                        >
                          <EyeOff className="size-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLoc(`/admin/products/${product.id}/edit`)}
                          title="Editar produto"
                        >
                          <Edit className="size-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                          title="Excluir do banco"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublishToSite(product.id)}
                          disabled={product.published !== false}
                          title="Publicar no site"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!productsLoading && filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground">
                        Nenhum produto encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-end">
              <Button
                className="rounded-full"
                onClick={handleBulkPublishToSite}
                disabled={selectedIds.length === 0}
              >
                Publicar selecionados no site
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
