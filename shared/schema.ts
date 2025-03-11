import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep original user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Add our abortion statistics schema
export const abortionStats = pgTable("abortion_stats", {
  id: serial("id").primaryKey(),
  stateId: text("state_id").notNull(),
  stateName: text("state_name").notNull(),
  count: integer("count").notNull(),
  rate: decimal("rate", { precision: 4, scale: 1 }).notNull(),
  change: decimal("change", { precision: 5, scale: 1 }).notNull(),
  status: text("status").notNull(),
  region: text("region").notNull(),
  year: integer("year").notNull(),
});

export const insertAbortionStatSchema = createInsertSchema(abortionStats).omit({
  id: true,
});

export type InsertAbortionStat = z.infer<typeof insertAbortionStatSchema>;
export type AbortionStat = typeof abortionStats.$inferSelect;

// Enums for filters
export enum Region {
  ALL = "all",
  NORTHEAST = "northeast",
  MIDWEST = "midwest",
  SOUTH = "south",
  WEST = "west",
}

export enum LegalStatus {
  ALL = "all",
  LEGAL = "legal",
  RESTRICTED = "restricted",
  BANNED = "banned",
}

export enum DataView {
  TOTAL = "total",
  RATE = "rate",
  PERCENTAGE = "percentage",
}
