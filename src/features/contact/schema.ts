import { z } from "zod";

/** Localised validation messages injected from the i18n bundle. */
export interface ContactErrorMessages {
  nameMin: string;
  emailInvalid: string;
  companyMin: string;
  phoneInvalid: string;
}

/**
 * Schema factory — keeps validation logic decoupled from layout and lets error
 * copy come from next-intl. Phone is optional but, when present, must be a
 * plausible international/Turkish number.
 */
export function createContactSchema(m: ContactErrorMessages) {
  return z.object({
    name: z.string().trim().min(2, m.nameMin),
    email: z.string().trim().email(m.emailInvalid),
    company: z.string().trim().min(2, m.companyMin),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^[+0-9][0-9\s()-]{6,20}$/.test(v),
        m.phoneInvalid,
      ),
    message: z.string().trim().max(1000).optional(),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
