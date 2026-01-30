import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Save, Eye, EyeOff, Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ImageUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Product, ProductFormData, Marketplace, AvailabilityStatus } from "@/types/affiliate";

const CATEGORIES = [
  "Destaques",
  "Eletrônicos", 
  "Casa",
  "Beleza",
  "Moda",
  "Mercado",
  "Infantil",
  "Ferramentas"
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

  // Estado temporário para gerenciar especificações como array
  const [specsList, setSpecsList] = useState<Array<{ key: string; value: string }>>([]);

  const [showAffiliateUrl, setShowAffiliateUrl] = useState(false);

  useEffect(() => {
    if (isEditing) {
      // Carregar dados do produto para edição
      loadProduct(id!);
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (isEditing) return;
    const loadSuggestions = async () => {
      try {
        setSuggestionsLoading(true);
        const response = await fetch("/api/products?limit=8&sortBy=created_desc");
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.data.products || []);
        }
      } finally {
        setSuggestionsLoading(false);
      }
    };

    loadSuggestions();
  }, [isEditing]);

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
          images: [], // Não carregamos files do backend
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

    const specsArray = Object.entries(product.specifications || {}).map(([key, value]) => ({
      key,
      value
    }));
    setSpecsList(specsArray);
  };

  // Converter objeto de specs para array quando carregar produto
  useEffect(() => {
    if (formData.specifications) {
      const specsArray = Object.entries(formData.specifications).map(([key, value]) => ({
        key,
        value
      }));
      setSpecsList(specsArray);
    }
  }, []);

  // Atualizar formData.specifications quando specsList mudar
  useEffect(() => {
    const specsObj = specsList.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    setFormData(prev => ({
      ...prev,
      specifications: specsObj
    }));
  }, [specsList]);

  const addSpecification = () => {
    setSpecsList(prev => [...prev, { key: "", value: "" }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', newValue: string) => {
    setSpecsList(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: newValue };
      return newList;
    });
  };

  const removeSpecification = (index: number) => {
    setSpecsList(prev => prev.filter((_, i) => i !== index));
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

                {!isEditing && (
                  <div className="space-y-2">
                    <Label>Sugestões de produtos já cadastrados</Label>
                    {suggestionsLoading ? (
                      <div className="text-sm text-muted-foreground">Carregando sugestões...</div>
                    ) : suggestions.length > 0 ? (
                      <div className="space-y-2">
                        {suggestions.map((product) => (
                          <div key={product.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                            <div className="text-sm line-clamp-1">{product.title}</div>
                            <Button type="button" variant="outline" size="sm" onClick={() => applySuggestion(product)}>
                              Usar
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Nenhuma sugestão disponível</div>
                    )}
                  </div>
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

            {/* Especificações */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Especificações Técnicas</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                    <Plus className="size-4 mr-2" />
                    Adicionar Especificação
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {specsList.map((spec, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <Input
                        placeholder="Nome da especificação (ex: Tamanho)"
                        value={spec.key}
                        onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Valor (ex: 50 polegadas)"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {specsList.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma especificação adicionada
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
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
