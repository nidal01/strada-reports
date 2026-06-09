import { z } from "zod";

export const contactApiSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().min(2).max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .refine((v) => !v || /^[+0-9][0-9\s()-]{6,20}$/.test(v), "invalid_phone"),
  message: z.string().trim().max(1000).optional(),
  locale: z.enum(["tr", "en"]).optional(),
});

export const newsletterApiSchema = z.object({
  email: z.string().trim().email().max(200),
  locale: z.enum(["tr", "en"]).optional(),
});

export type ContactApiPayload = z.infer<typeof contactApiSchema>;
export type NewsletterApiPayload = z.infer<typeof newsletterApiSchema>;
