import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "../storage";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor";
  permissions: string[];
  createdAt: string;
  lastLogin: string | null;
};

type TokenUser = {
  id: string;
  email: string;
  role: string;
  permissions: string[];
};

const users: AuthUser[] = [
  {
    id: "1",
    name: "William Admin",
    email: "admin@lojafiaco.com",
    password: "$2b$10$koTJITcdsRy5Pt0xUD8AX.hvyWHKJRTH22yxvy/pFPCn1D/8hoK3C", // "Senha123!"
    role: "admin" as const,
    permissions: ["products:read", "products:write", "products:delete", "settings:read", "settings:write"],
    createdAt: new Date().toISOString(),
    lastLogin: null
  }
];

const JWT_SECRET = process.env.JWT_SECRET || "loja-fiado-super-secret-key-2026";
const JWT_EXPIRES_IN = "7d";

// Middleware para validar token
export function authenticateToken(req: Request, res: Response, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: "Token não fornecido" 
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: "Token inválido" 
      });
    }

    const requestWithUser = req as Request & { user?: TokenUser };
    requestWithUser.user = user;
    next();
  });
}

// Login
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios"
      });
    }

    // Buscar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha incorretos"
      });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha incorretos"
      });
    }

    // Atualizar último login
    user.lastLogin = new Date().toISOString();

    // Gerar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        permissions: user.permissions 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}

// Verificar token
export function verifyToken(req: Request, res: Response) {
  const requestWithUser = req as Request & { user?: TokenUser };
  res.json({
    success: true,
    data: requestWithUser.user
  });
}

// Logout
export function logout(req: Request, res: Response) {
  // Em um sistema real, poderíamos invalidar o token
  // Por enquanto, apenas retornamos sucesso
  res.json({
    success: true,
    message: "Logout realizado com sucesso"
  });
}

// Atualizar senha
export async function updatePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const requestWithUser = req as Request & { user?: TokenUser };
    const userId = requestWithUser.user?.id;

    if (!currentPassword || !newPassword || !userId) {
      return res.status(400).json({
        success: false,
        error: "Senha atual e nova senha são obrigatórias"
      });
    }

    // Buscar usuário
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado"
      });
    }

    // Verificar senha atual
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Senha atual incorreta"
      });
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    res.json({
      success: true,
      message: "Senha atualizada com sucesso"
    });

  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}
