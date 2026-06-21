import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Boards ───────────────────────────────────────────────────────────────────

export const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .max(80, "Board name is too long"),
  description: z.string().max(200, "Description is too long").optional(),
  isPublic: z.boolean().optional().default(false),
});

export const updateBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .max(80, "Board name is too long")
    .optional(),
  description: z.string().max(200, "Description is too long").optional(),
  isPublic: z.boolean().optional(),
});

// ─── Metrics ─────────────────────────────────────────────────────────────────

export const addMetricSchema = z.object({
  boardId: z.string().cuid("Invalid board ID"),
  name: z
    .string()
    .min(1, "Metric name is required")
    .max(80, "Metric name is too long"),
  value: z.number({ invalid_type_error: "Value must be a number" }),
  unit: z.string().max(20, "Unit is too long").optional(),
  timestamp: z.coerce.date().optional(),
});

export const csvRowSchema = z.object({
  name: z.string().min(1),
  value: z.coerce.number(),
  unit: z.string().optional(),
  timestamp: z.coerce.date().optional(),
});

export const csvImportSchema = z.array(csvRowSchema).min(1).max(500);

// ─── Inferred types ──────────────────────────────────────────────────────────

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type AddMetricInput = z.infer<typeof addMetricSchema>;
export type CsvRow = z.infer<typeof csvRowSchema>;
