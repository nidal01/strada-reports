"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  createContactSchema,
  type ContactFormValues,
} from "@/features/contact/schema";

/**
 * Demo-request form. Client-side validation via Zod + React Hook Form, with an
 * animated success state. The submit handler simulates a network round-trip;
 * swap `fakeSubmit` for a server action / API route in production.
 */
export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const tErr = useTranslations("contactPage.errors");
  const [submitted, setSubmitted] = useState(false);

  const schema = createContactSchema({
    nameMin: tErr("nameMin"),
    emailInvalid: tErr("emailInvalid"),
    companyMin: tErr("companyMin"),
    phoneInvalid: tErr("phoneInvalid"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  async function onSubmit(_values: ContactFormValues) {
    // Simulated async submission — replace with a server action.
    await new Promise((r) => setTimeout(r, 1100));
    setSubmitted(true);
  }

  function handleReset() {
    reset();
    setSubmitted(false);
  }

  return (
    <div className="glass-strong gradient-border relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center py-12 text-center"
            role="status"
            aria-live="polite"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 16 }}
              className="flex size-16 items-center justify-center rounded-full bg-positive-500/15 text-positive-400"
            >
              <Check className="size-8" />
            </motion.span>
            <h3 className="mt-6 text-xl font-semibold text-white">{t("successTitle")}</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-400">{t("successBody")}</p>
            <Button variant="outline" className="mt-6" onClick={handleReset}>
              {t("successReset")}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label={t("name")} error={errors.name?.message}>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder={t("namePlaceholder")}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </Field>

              <Field id="email" label={t("email")} error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </Field>

              <Field id="company" label={t("company")} error={errors.company?.message}>
                <Input
                  id="company"
                  autoComplete="organization"
                  placeholder={t("companyPlaceholder")}
                  aria-invalid={!!errors.company}
                  {...register("company")}
                />
              </Field>

              <Field id="phone" label={t("phone")} error={errors.phone?.message}>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t("phonePlaceholder")}
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
              </Field>
            </div>

            <Field id="message" label={t("message")} error={errors.message?.message}>
              <Textarea
                id="message"
                placeholder={t("messagePlaceholder")}
                {...register("message")}
              />
            </Field>

            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 w-full sm:w-auto sm:self-start">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Labelled field wrapper with inline, accessible error messaging. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs text-red-400"
        >
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
