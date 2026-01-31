import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Save, Eye, EyeOff, Trash2, XCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImageUpload } from "@/components/ImageUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Product, ProductFormData, Marketplace, AvailabilityStatus } from "@/types/affiliate";

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

export default function ProductForm() {
  const [loc, setLoc] = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [duplicateMatches, setDuplicateMatches] = useState<Product[]>([]);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [selectedSuggestionIds, setSelectedSuggestionIds] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    price: 0,
    oldPrice: undefined,
    installment: "",
    rating: 5,
    reviews: 0,
    tag: undefined,
    category: "Destaques",
    description: "",
    specifications: {},
    brand: "",
    model: "",
    marketplace: "amazon",
    affiliateUrl: "",
    availability: "available",
    featured: false,
    images: [],
    video: ""
  });

  const [showAffiliateUrl, setShowAffiliateUrl] = useState(false);

  const normalizeTitle = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const notifyProductsUpdated = () => {
    localStorage.setItem("products_updated_at", Date.now().toString());
    window.dispatchEvent(new Event("products-updated"));
  };

  useEffect(() => {
    if (isEditing) {
      // Carregar dados do produto para edição
      loadProduct(id!);
    }
  }, [id, isEditing]);

  const loadSuggestions = async () => {
    try {
      setSuggestionsLoading(true);
      const response = await fetch("/api/products?limit=200&sortBy=created_desc", { cache: "no-store" });
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data.products || []);
      }
    } finally {
      setSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing) return;
    void loadSuggestions();
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) return;
    const title = formData.title.trim();
    if (!title) {
      setDuplicateMatches([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setDuplicateLoading(true);
        const response = await fetch(`/api/products?search=${encodeURIComponent(title)}&limit=5&sortBy=created_desc`, { cache: "no-store" });
        const data = await response.json();
        if (data.success) {
          const matches = (data.data.products || []).filter((product: Product) =>
            normalizeTitle(product.title) === normalizeTitle(title)
          );
          setDuplicateMatches(matches);
        }
      } finally {
        setDuplicateLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [formData.title, isEditing]);

  const loadProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        const product = data.data;
        setFormData({
          title: product.title,
          price: product.price,
          oldPrice: product.oldPrice,
          installment: product.installment || "",
          rating: product.rating,
          reviews: product.reviews,
          tag: product.tag,
          category: product.category,
          description: product.description || "",
          specifications: product.specifications || {},
          brand: product.brand || "",
          model: product.model || "",
          marketplace: product.marketplace,
          affiliateUrl: product.affiliateUrl,
          availability: product.availability,
          featured: product.featured,
          images: product.images || [],
          video: product.video || ""
        });
      } else {
        setError("Produto não encontrado");
      }
    } catch (err) {
      setError("Erro ao carregar produto");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        thumbnail: formData.images[0] || "", // Primeira imagem como thumbnail
        published: false,
      };

      let response;
      if (isEditing) {
        response = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (data.success) {
      notifyProductsUpdated();
        setLoc("/admin");
      } else {
        setError(data.error || "Erro ao salvar produto");
      }
    } catch (err) {
      setError("Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSite = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        },
        body: JSON.stringify({ published: false })
      });
      const data = await response.json();
      if (data.success) {
      notifyProductsUpdated();
        setLoc("/admin");
      } else {
        setError(data.error || "Erro ao remover do site");
      }
    } catch {
      setError("Erro ao remover do site");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromDatabase = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        },
      });
      const data = await response.json();
      if (data.success) {
      notifyProductsUpdated();
        setLoc("/admin");
      } else {
        setError(data.error || "Erro ao excluir do banco");
      }
    } catch {
      setError("Erro ao excluir do banco");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoth = async () => {
    await handleDeleteFromDatabase();
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Se o campo é affiliateUrl, atualizar preview
    if (field === "affiliateUrl" && value) {
      setPreviewUrl(value);
    }
  };

  const applySuggestion = (product: Product) => {
    setFormData({
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice ?? undefined,
      installment: product.installment || "",
      rating: product.rating,
      reviews: product.reviews,
      tag: product.tag,
      category: product.category,
      description: product.description || "",
      specifications: product.specifications || {},
      brand: product.brand || "",
      model: product.model || "",
      marketplace: product.marketplace,
      affiliateUrl: product.affiliateUrl,
      availability: product.availability,
      featured: product.featured,
      images: product.images || [],
      video: product.video || ""
    });

  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  });

  const handleSuggestionPublish = async (productId: string, published: boolean) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ published }),
    });
    const data = await response.json();
    if (data.success) {
      notifyProductsUpdated();
      await loadSuggestions();
    }
  };

  const handleSuggestionDelete = async (productId: string) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (data.success) {
      setSelectedSuggestionIds((prev) => prev.filter((id) => id !== productId));
      notifyProductsUpdated();
      await loadSuggestions();
    }
  };

  const handleBulkPublishSuggestions = async () => {
    if (selectedSuggestionIds.length === 0) return;
    await Promise.all(
      selectedSuggestionIds.map((id) =>
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
    setSelectedSuggestionIds([]);
    notifyProductsUpdated();
    await loadSuggestions();
  };

  const handleToggleSuggestion = (productId: string, checked: boolean) => {
    setSelectedSuggestionIds((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const handleToggleAllSuggestions = (checked: boolean) => {
    if (checked) {
      setSelectedSuggestionIds(suggestions.map((product) => product.id));
      return;
    }
    setSelectedSuggestionIds([]);
  };

  const allSuggestionsSelected = selectedSuggestionIds.length > 0 && selectedSuggestionIds.length === suggestions.length;
  const someSuggestionsSelected = selectedSuggestionIds.length > 0 && selectedSuggestionIds.length < suggestions.length;

  const formatBRL = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const marketplaceLabel: Record<Marketplace, string> = {
    amazon: "Amazon",
    shopee: "Shopee",
    mercadoLivre: "Mercado Livre",
  };

  const formatDate = (value?: string | Date | null) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLoc("/admin")}
            >
              <ArrowLeft className="size-4 mr-2" />
              Voltar
            </Button>
            <div>
              <div className="font-semibold">
                {isEditing ? "Editar Produto" : "Novo Produto"}
              </div>
              <div className="text-sm text-muted-foreground">
                {isEditing ? "Atualize as informações do produto" : "Cadastre um novo produto no catálogo"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Produto *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Smart TV 50 4K UHD"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      placeholder="Ex: Samsung"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                    />
                  </div>
                </div>

                {!isEditing && duplicateMatches.length > 0 && (
                  <Alert>
                    <AlertDescription>
                      Já existe um produto com o mesmo título no banco.
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => applySuggestion(duplicateMatches[0])}>
                          Usar existente
                        </Button>
                        <Button type="button" size="sm" onClick={() => setDuplicateMatches([])}>
                          Adicionar como novo
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrição detalhada do produto..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tag">Etiqueta</Label>
                    <Select
                      value={formData.tag ?? "none"}
                      onValueChange={(value) => handleInputChange("tag", value === "none" ? undefined : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma etiqueta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        <SelectItem value="OFERTA">OFERTA</SelectItem>
                        <SelectItem value="DESTAQUE">DESTAQUE</SelectItem>
                        <SelectItem value="FRETE GRÁTIS">FRETE GRÁTIS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Produto em destaque</Label>
                </div>
              </CardContent>
            </Card>

            {/* Preços e Avaliação */}
            <Card>
              <CardHeader>
                <CardTitle>Preços e Avaliação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço Atual *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="299.90"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oldPrice">Preço Anterior</Label>
                    <Input
                      id="oldPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="399.90"
                      value={formData.oldPrice || ""}
                      onChange={(e) => handleInputChange("oldPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installment">Parcelamento</Label>
                  <Input
                    id="installment"
                    placeholder="Ex: 10x sem juros"
                    value={formData.installment}
                    onChange={(e) => handleInputChange("installment", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Avaliação</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="4.5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange("rating", parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reviews">Número de Avaliações</Label>
                    <Input
                      id="reviews"
                      type="number"
                      min="0"
                      placeholder="150"
                      value={formData.reviews}
                      onChange={(e) => handleInputChange("reviews", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketplace */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Configuração de Afiliado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="marketplace">Marketplace *</Label>
                    <Select
                      value={formData.marketplace}
                      onValueChange={(value: Marketplace) => handleInputChange("marketplace", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o marketplace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amazon">
                          🛒 Amazon
                        </SelectItem>
                        <SelectItem value="shopee">
                          🛍️ Shopee
                        </SelectItem>
                        <SelectItem value="mercadoLivre">
                          📦 Mercado Livre
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Disponibilidade</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value: AvailabilityStatus) => handleInputChange("availability", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status de disponibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponível</SelectItem>
                        <SelectItem value="out_of_stock">Esgotado</SelectItem>
                        <SelectItem value="unavailable">Indisponível</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliateUrl">URL de Afiliado *</Label>
                  <div className="relative">
                    <Input
                      id="affiliateUrl"
                      type="url"
                      placeholder="https://www.amazon.com.br/dp/..."
                      value={formData.affiliateUrl}
                      onChange={(e) => handleInputChange("affiliateUrl", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowAffiliateUrl(!showAffiliateUrl)}
                    >
                      {showAffiliateUrl ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                  
                  {showAffiliateUrl && formData.affiliateUrl && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Preview:</div>
                      <a 
                        href={formData.affiliateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {formData.affiliateUrl}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video">URL do Vídeo (opcional)</Label>
                  <Input
                    id="video"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.video}
                    onChange={(e) => handleInputChange("video", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Imagens */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Imagens do Produto *</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.images}
                  onChange={(urls) => {
                    handleInputChange("images", urls);
                  }}
                  maxImages={5}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
                {formData.images.length === 0 && (
                  <p className="text-sm text-destructive mt-2">
                    Adicione pelo menos uma imagem do produto
                  </p>
                )}
              </CardContent>
            </Card>

            {!isEditing && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Produtos já cadastrados no banco</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestionsLoading || duplicateLoading ? (
                    <div className="text-sm text-muted-foreground">Carregando produtos...</div>
                  ) : suggestions.length > 0 ? (
                    <>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-10">
                                <Checkbox
                                  checked={allSuggestionsSelected ? true : someSuggestionsSelected ? "indeterminate" : false}
                                  onCheckedChange={(checked) => handleToggleAllSuggestions(Boolean(checked))}
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
                              <TableHead className="text-center">Usar</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {suggestions.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedSuggestionIds.includes(product.id)}
                                    onCheckedChange={(checked) => handleToggleSuggestion(product.id, Boolean(checked))}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={product.thumbnail || product.images?.[0]}
                                      alt={product.title}
                                      className="size-10 rounded object-cover"
                                    />
                                    <div className="font-medium whitespace-normal max-w-[360px]">
                                      {product.title}
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
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs">
                                    {marketplaceLabel[product.marketplace]}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatDate(product.createdAt)}</TableCell>
                                <TableCell>
                                  {product.tag ? (
                                    <Badge variant="secondary" className="text-xs">
                                      {product.tag}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSuggestionPublish(product.id, false)}
                                    title="Ocultar do site"
                                    disabled={product.published === false}
                                  >
                                    <EyeOff className="size-4" />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setLoc(`/admin/products/${product.id}/edit`)}
                                    title="Editar produto"
                                  >
                                    <Edit className="size-4" />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSuggestionDelete(product.id)}
                                    title="Excluir do banco"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => applySuggestion(product)}
                                  >
                                    Usar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button
                          className="rounded-full"
                          onClick={handleBulkPublishSuggestions}
                          disabled={selectedSuggestionIds.length === 0}
                        >
                          Publicar selecionados no site
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Nenhum produto encontrado</div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-end">
            {isEditing && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveFromSite}
                  disabled={loading}
                >
                  <EyeOff className="size-4 mr-2" />
                  Remover do site
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeleteFromDatabase}
                  disabled={loading}
                >
                  <Trash2 className="size-4 mr-2" />
                  Excluir do banco
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeleteBoth}
                  disabled={loading}
                >
                  <XCircle className="size-4 mr-2" />
                  Excluir do site e banco
                </Button>
              </>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setLoc("/admin")}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              <Save className="size-4 mr-2" />
              {loading ? "Salvando..." : (isEditing ? "Atualizar Produto" : "Criar Produto")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
