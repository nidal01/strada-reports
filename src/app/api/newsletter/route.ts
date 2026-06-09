import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { newsletterApiSchema } from "@/features/contact/api-schema";
import { getMailTo, sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = newsletterApiSchema.parse(await request.json());
    const locale = body.locale ?? "tr";

    const teamSubject = `[Strada Reports] Yeni bülten abonesi`;
    const teamText = `Yeni bülten aboneliği:\n\nE-posta: ${body.email}\nDil: ${locale}`;
    const teamHtml = `
      <h2>Yeni bülten aboneliği</h2>
      <p><strong>E-posta:</strong> ${body.email}</p>
      <p><strong>Dil:</strong> ${locale}</p>
    `;

    await sendMail({
      to: getMailTo(),
      subject: teamSubject,
      text: teamText,
      html: teamHtml,
    });

    const isTr = locale === "tr";
    await sendMail({
      to: body.email,
      subject: isTr
        ? "Strada Reports bültenine abone oldunuz"
        : "You're subscribed to Strada Reports updates",
      text: isTr
        ? "Strada Reports bültenine abone oldunuz. Yeni modüller ve özelliklerden ilk siz haberdar olacaksınız."
        : "You're subscribed to Strada Reports updates. We'll notify you about new modules and features.",
      html: isTr
        ? `<p>Strada Reports bültenine abone oldunuz.</p><p>Yeni modüller ve özelliklerden ilk siz haberdar olacaksınız.</p>`
        : `<p>You're subscribed to Strada Reports updates.</p><p>We'll notify you about new modules and features.</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Geçersiz e-posta" }, { status: 400 });
    }
    console.error("[newsletter]", err);
    return NextResponse.json({ error: "Abonelik başarısız" }, { status: 500 });
  }
}
