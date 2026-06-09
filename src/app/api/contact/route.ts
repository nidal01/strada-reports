import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { contactApiSchema } from "@/features/contact/api-schema";
import { getMailTo, sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const body = contactApiSchema.parse(await request.json());
    const phone = body.phone?.trim() || "—";
    const message = body.message?.trim() || "—";

    const subject = `[Strada Reports] Demo talebi — ${body.company}`;
    const text = [
      "Yeni demo / iletişim talebi",
      "",
      `Ad Soyad: ${body.name}`,
      `E-posta: ${body.email}`,
      `Şirket: ${body.company}`,
      `Telefon: ${phone}`,
      "",
      "Mesaj:",
      message,
    ].join("\n");

    const html = `
      <h2>Yeni demo / iletişim talebi</h2>
      <p><strong>Ad Soyad:</strong> ${escapeHtml(body.name)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(body.email)}</p>
      <p><strong>Şirket:</strong> ${escapeHtml(body.company)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    await sendMail({
      to: getMailTo(),
      subject,
      text,
      html,
      replyTo: body.email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Geçersiz form verisi" }, { status: 400 });
    }
    console.error("[contact]", err);
    return NextResponse.json({ error: "Gönderim başarısız" }, { status: 500 });
  }
}
