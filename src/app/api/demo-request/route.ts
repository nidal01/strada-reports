import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { demoRequestApiSchema } from "@/features/demo/schema";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = demoRequestApiSchema.parse(await request.json());
    const apiUrl = process.env.DEMO_PROVISION_API_URL?.replace(/\/$/, "");
    const apiKey = process.env.DEMO_PROVISION_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error("[demo-request] DEMO_PROVISION_API_URL or DEMO_PROVISION_API_KEY missing");
      return NextResponse.json({ error: "Demo servisi yapılandırılmamış" }, { status: 503 });
    }

    const upstream = await fetch(`${apiUrl}/api/public/v1/demo-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Demo-Provision-Key": apiKey,
      },
      body: JSON.stringify({
        first_name: body.firstName,
        last_name: body.lastName,
        company_name: body.company,
        phone: body.phone,
        email: body.email,
      }),
      cache: "no-store",
    });

    const json = await upstream.json().catch(() => null);

    if (upstream.status === 409) {
      return NextResponse.json(
        { error: json?.message ?? "Aktif demo mevcut" },
        { status: 409 },
      );
    }

    if (!upstream.ok || !json?.data) {
      console.error("[demo-request] upstream failed", upstream.status, json);
      return NextResponse.json({ error: "Demo oluşturulamadı" }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      data: {
        tenant_code: json.data.tenant_code,
        username: json.data.username,
        password: json.data.password,
        login_url: json.data.login_url ?? siteConfig.appUrl,
        expires_at: json.data.expires_at,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Geçersiz form verisi" }, { status: 400 });
    }
    console.error("[demo-request]", err);
    return NextResponse.json({ error: "Gönderim başarısız" }, { status: 500 });
  }
}
