import type { Request, Response } from "express";
import { storage } from "../storage";
import { isDatabaseConnected } from "../db";
import type { InsertProduct } from "@shared/schema";

// Gerar slug a partir do título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

// Listar produtos
export async function getProducts(req: Request, res: Response) {
  try {
    const storageMode = isDatabaseConnected ? "database" : "memory";
    const {
      page = 1,
      limit = 10,
      category,
      marketplace,
      published,
      featured,
      search,
      sortBy = "created_desc"
    } = req.query;

    const publishedParam = published ? String(published) : "true";
    const publishedFilter = publishedParam === "all"
      ? undefined
      : publishedParam === "false"
        ? false
        : true;

    const result = await storage.getProducts({
      page: parseInt(String(page)),
      limit: parseInt(String(limit)),
      category: category ? String(category) : undefined,
      marketplace: marketplace ? String(marketplace) : undefined,
      published: publishedFilter,
      featured: featured === "true",
      search: search ? String(search) : undefined,
      sortBy: String(sortBy)
    });

    res.json({
      success: true,
      meta: {
        storage: storageMode
      },
      data: {
        products: result.products,
        pagination: {
          page: parseInt(String(page)),
          limit: parseInt(String(limit)),
          total: result.total,
          totalPages: Math.ceil(result.total / parseInt(String(limit)))
        }
      }
    });

  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}

// Obter produto por ID
export async function getProduct(req: Request, res: Response) {
  try {
    const storageMode = isDatabaseConnected ? "database" : "memory";
    const id = String(req.params.id);
    
    const product = await storage.getProduct(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produto não encontrado"
      });
    }

    res.json({
      success: true,
      meta: {
        storage: storageMode
      },
      data: product
    });

  } catch (error) {
    console.error("Erro ao obter produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}

// Criar produto
export async function createProduct(req: Request, res: Response) {
  try {
    const storageMode = isDatabaseConnected ? "database" : "memory";
    const productData = req.body;
    
    // Validações básicas
    const requiredFields = ['title', 'price', 'marketplace', 'affiliateUrl'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios: ${missingFields.join(', ')}`
      });
    }

    // Preparar dados do produto
    const insertData: InsertProduct = {
      title: productData.title,
      price: Number(productData.price),
      oldPrice: productData.oldPrice ? Number(productData.oldPrice) : null,
      installment: productData.installment || null,
      rating: Number(productData.rating) || 0,
      reviews: Number(productData.reviews) || 0,
      tag: productData.tag || null,
      category: productData.category || "Destaques",
      marketplace: productData.marketplace,
      affiliateUrl: productData.affiliateUrl,
      images: productData.images || [],
      video: productData.video || null,
      thumbnail: productData.thumbnail || productData.images?.[0] || "",
      description: productData.description || null,
      specifications: productData.specifications || {},
      brand: productData.brand || null,
      model: productData.model || null,
      availability: productData.availability || "available",
      published: productData.published ?? false,
      featured: Boolean(productData.featured),
      slug: generateSlug(productData.title)
    };

    const newProduct = await storage.createProduct(insertData);

    res.status(201).json({
      success: true,
      meta: {
        storage: storageMode
      },
      data: newProduct,
      message: "Produto criado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}

// Atualizar produto
export async function updateProduct(req: Request, res: Response) {
  try {
    const storageMode = isDatabaseConnected ? "database" : "memory";
    const id = String(req.params.id);
    const updates = req.body;

    // Verificar se produto existe
    const existingProduct = await storage.getProduct(id);
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: "Produto não encontrado"
      });
    }

    if (updates.title && updates.title !== existingProduct.title) {
      updates.slug = generateSlug(updates.title);
    }

    if (Array.isArray(updates.images) && (!updates.thumbnail || updates.thumbnail === "")) {
      updates.thumbnail = updates.images[0] || "";
    }

    const updatedProduct = await storage.updateProduct(id, updates);

    res.json({
      success: true,
      meta: {
        storage: storageMode
      },
      data: updatedProduct,
      message: "Produto atualizado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}

// Excluir produto
export async function deleteProduct(req: Request, res: Response) {
  try {
    const storageMode = isDatabaseConnected ? "database" : "memory";
    const id = String(req.params.id);
    
    const deletedProduct = await storage.deleteProduct(id);
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: "Produto não encontrado"
      });
    }

    res.json({
      success: true,
      meta: {
        storage: storageMode
      },
      data: deletedProduct,
      message: "Produto excluído com sucesso"
    });

  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}

// Obter estatísticas
export async function getStats(req: Request, res: Response) {
  try {
    const storageMode = isDatabaseConnected ? "database" : "memory";
    const stats = await storage.getProductStats();

    res.json({
      success: true,
      meta: {
        storage: storageMode
      },
      data: stats
    });

  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}
