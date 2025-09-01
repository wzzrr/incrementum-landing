// app/api/contact/route.ts
import { NextResponse } from "next/server";

type ContactBody = {
  name?: string;
  email: string;
  message: string;
  subject?: string;
};

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function extractProviderError(x: unknown): string | null {
  if (x && typeof x === "object") {
    const rec = x as Record<string, unknown>;
    if (typeof rec.error === "string") return rec.error;
    if (typeof rec.message === "string") return rec.message;
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { name, email, message, subject } = (await req.json()) as ContactBody;

    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }
    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Email inválido" },
        { status: 400 }
      );
    }
    if (message.trim().length < 20) {
      return NextResponse.json(
        { ok: false, error: "Mensaje demasiado corto" },
        { status: 400 }
      );
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.CONTACT_FROM;
    const TO = process.env.CONTACT_TO;

    if (!RESEND_API_KEY || !FROM || !TO) {
      console.error("⚠️ Faltan env vars en Vercel");
      return NextResponse.json(
        { ok: false, error: "Configuración del servidor incompleta" },
        { status: 500 }
      );
    }

    const html = `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${name ?? "(sin nombre)"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p style="white-space:pre-wrap;">${message}</p>
    `;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        subject: subject || "Automation Contact – Incrementum",
        html,
        reply_to: email,
      }),
    });

    const text = await r.text();
    let json: unknown = undefined;
    try {
      json = JSON.parse(text);
    } catch {
      // respuesta no-JSON, usamos text
    }

    if (!r.ok) {
      const providerMsg = extractProviderError(json) ?? (text || "Email provider failed");
      console.error("[Resend error]", r.status, json ?? text);
      return NextResponse.json({ ok: false, error: providerMsg }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Contact API Error]", err);
    return NextResponse.json(
      { ok: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
