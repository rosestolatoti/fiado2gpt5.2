import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "../storage.js";

type TokenUser = {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  name: string;
  lastLogin: string | null;
  createdAt: string;
};

const resolveEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const JWT_SECRET = resolveEnv("JWT_SECRET") || "loja-fiado-super-secret-key-2026";
const JWT_EXPIRES_IN = "7d";
const ADMIN_EMAIL = resolveEnv(
  "ADMIN_EMAIL",
  "EMAIL_DO_ADMINISTRADOR",
  "E_MAIL_DO_ADMINISTRADOR",
  "ADMINISTRADOR_EMAIL",
  "EMAIL_ADMIN",
).toLowerCase();
const ADMIN_PASSWORD = resolveEnv(
  "ADMIN_PASSWORD",
  "SENHA_DE_ADMINISTRADOR",
  "ADMINISTRADOR_SENHA",
  "SENHA_ADMIN",
);
const ADMIN_NAME = resolveEnv("ADMIN_NAME", "NOME_ADMIN", "ADMIN_NOME") || "Admin";
const ADMIN_PERMISSIONS = ["products:read", "products:write", "products:delete", "settings:read", "settings:write"];

async function ensureAdminUser() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return null;
  }

  const existing = await storage.getUserByUsername(ADMIN_EMAIL);
  if (existing) {
    return existing;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const created = await storage.createUser({
    username: ADMIN_EMAIL,
    password: hashed,
  });
  return created;
}

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

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        error: "Admin não configurado"
      });
    }

    if (normalizedEmail !== ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha incorretos"
      });
    }

    await ensureAdminUser();
    const user = await storage.getUserByUsername(normalizedEmail);
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

    const lastLogin = new Date().toISOString();
    const createdAt = new Date().toISOString();

    // Gerar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: normalizedEmail, 
        role: "admin",
        permissions: ADMIN_PERMISSIONS,
        name: ADMIN_NAME,
        lastLogin,
        createdAt
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: ADMIN_NAME,
          email: normalizedEmail,
          role: "admin",
          permissions: ADMIN_PERMISSIONS,
          lastLogin
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

    const user = await storage.getUser(userId);
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
    await storage.updateUserPassword(user.id, hashedNewPassword);

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
