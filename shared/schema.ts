import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tabela de produtos para afiliados
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  price: real("price").notNull(),
  oldPrice: real("old_price"),
  installment: text("installment"),
  rating: real("rating").notNull().default(0),
  reviews: integer("reviews").notNull().default(0),
  tag: text("tag"),
  category: text("category").notNull().default("Destaques"),
  marketplace: text("marketplace").notNull(),
  affiliateUrl: text("affiliate_url").notNull(),
  images: jsonb("images").notNull().default(sql`'[]'::jsonb`),
  video: text("video"),
  thumbnail: text("thumbnail").notNull().default(""),
  description: text("description"),
  specifications: jsonb("specifications").default(sql`'{}'::jsonb`),
  brand: text("brand"),
  model: text("model"),
  availability: text("availability").notNull().default("available"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`'default'`),
  siteName: text("site_name").notNull().default("Loja do Fiado"),
  whatsappGroupUrl: text("whatsapp_group_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
