"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/site";
import {
  createDemoRequestSchema,
  type DemoProvisionResult,
  type DemoRequestFormValues,
} from "@/features/demo/schema";

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
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CredentialRow({
  label,
  value,
  copyLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
}) {
  async function copy() {
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white/5 px-3 py-2.5">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <code className="break-all text-sm text-white">{value}</code>
        <button
          type="button"
          onClick={copy}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label={copyLabel}
        >
          <Copy className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function DemoRequestForm() {
  const locale = useLocale();
  const t = useTranslations("demoRequest.form");
  const tErr = useTranslations("demoRequest.errors");
  const [credentials, setCredentials] = useState<DemoProvisionResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = createDemoRequestSchema({
    firstNameMin: tErr("firstNameMin"),
    lastNameMin: tErr("lastNameMin"),
    emailInvalid: tErr("emailInvalid"),
    companyMin: tErr("companyMin"),
    phoneInvalid: tErr("phoneInvalid"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DemoRequestFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  async function onSubmit(values: DemoRequestFormValues) {
    setSubmitError(null);

    const res = await fetch("/api/demo-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, locale }),
    });

    const json = await res.json().catch(() => null);

    if (res.status === 409) {
      setSubmitError(t("activeDemoError"));
      return;
    }

    if (!res.ok || !json?.data) {
      setSubmitError(t("submitError"));
      return;
    }

    setCredentials({
      tenant_code: json.data.tenant_code,
      username: json.data.username,
      password: json.data.password,
      login_url: json.data.login_url ?? siteConfig.appUrl,
      expires_at: json.data.expires_at,
    });
  }

  function handleReset() {
    reset();
    setCredentials(null);
    setSubmitError(null);
  }

  const expiresLabel = credentials
    ? new Date(credentials.expires_at).toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
    <AnimatePresence mode="wait">
      {credentials ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-4"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-positive-500/15 text-positive-400">
              <Check className="size-6" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-white">{t("successTitle")}</h3>
              <p className="text-sm text-slate-400">{t("successBody")}</p>
            </div>
          </div>

          <CredentialRow label={t("tenantCode")} value={credentials.tenant_code} copyLabel={t("copy")} />
          <CredentialRow label={t("username")} value={credentials.username} copyLabel={t("copy")} />
          <CredentialRow label={t("password")} value={credentials.password} copyLabel={t("copy")} />

          <p className="text-xs text-slate-500">{t("expiresNote", { date: expiresLabel })}</p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg">
              <a href={credentials.login_url} target="_blank" rel="noopener noreferrer">
                {t("loginCta")}
                <ExternalLink className="size-4" />
              </a>
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              {t("successReset")}
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label={t("firstName")} error={errors.firstName?.message}>
              <Input
                id="firstName"
                autoComplete="given-name"
                placeholder={t("firstNamePlaceholder")}
                aria-invalid={!!errors.firstName}
                {...register("firstName")}
              />
            </Field>
            <Field id="lastName" label={t("lastName")} error={errors.lastName?.message}>
              <Input
                id="lastName"
                autoComplete="family-name"
                placeholder={t("lastNamePlaceholder")}
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
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
          </div>

          {submitError ? (
            <p className="flex items-center gap-1.5 text-sm text-red-400" role="alert">
              <AlertCircle className="size-4 shrink-0" />
              {submitError}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
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
  );
}
