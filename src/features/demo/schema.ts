import { z } from "zod";

export interface DemoFormErrorMessages {
  firstNameMin: string;
  lastNameMin: string;
  emailInvalid: string;
  companyMin: string;
  phoneInvalid: string;
}

export function createDemoRequestSchema(m: DemoFormErrorMessages) {
  return z.object({
    firstName: z.string().trim().min(2, m.firstNameMin),
    lastName: z.string().trim().min(2, m.lastNameMin),
    email: z.string().trim().email(m.emailInvalid),
    company: z.string().trim().min(2, m.companyMin),
    phone: z
      .string()
      .trim()
      .min(1, m.phoneInvalid)
      .refine((v) => /^[+0-9][0-9\s()-]{6,20}$/.test(v), m.phoneInvalid),
  });
}

export type DemoRequestFormValues = z.infer<ReturnType<typeof createDemoRequestSchema>>;

export const demoRequestApiSchema = z.object({
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(200),
  phone: z.string().trim().regex(/^[+0-9][0-9\s()-]{6,20}$/),
  email: z.string().trim().email().max(255),
  locale: z.enum(["tr", "en"]).optional(),
});

export const demoProvisionResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    tenant_code: z.string(),
    username: z.string(),
    password: z.string(),
    login_url: z.string().url(),
    expires_at: z.string(),
  }),
});

export type DemoProvisionResult = z.infer<typeof demoProvisionResponseSchema>["data"];
