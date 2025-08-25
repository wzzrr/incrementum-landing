// app/api/contact/route.ts
import { NextResponse } from "next/server";

type ContactBody = {
  name: string;
  email: string;
  message: string;
  subject?: string;
};

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Extrae mensaje de error de respuestas del provider sin usar `any`
function extractError(x: unknown): string | null {
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

    // Validaciones
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    if (message.trim().length < 20) {
      return NextResponse.json({ ok: false, error: "Message too short" }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const from = process.env.CONTACT_FROM || "Incrementum <onboarding@resend.dev>";
    const to = process.env.CONTACT_TO || "incrementumautomation@gmail.com";
    const subj = subject || "Automation Contact – Incrementum";

    const html = `
      <h2>Nuevo contacto desde la landing</h2>
      <p><b>Nombre:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p style="white-space:pre-wrap">${message}</p>
    `;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject: subj, html, reply_to: email }),
    });

    const text = await r.text();
    let json: unknown = undefined;
    try {
      json = JSON.parse(text);
    } catch {
      // respuesta no-JSON, usamos `text` abajo
    }

    if (!r.ok) {
      const providerMsg = extractError(json) ?? (text || "Email provider failed");
      console.error("[Resend error]", r.status, json ?? text);
      return NextResponse.json({ ok: false, error: providerMsg }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[CONTACT API]", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
