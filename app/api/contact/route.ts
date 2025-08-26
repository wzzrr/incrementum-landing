// app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message, subject } = await req.json();

    // Validaciones básicas
    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos requeridos" },
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

    // Construcción del HTML del correo
    const html = `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${name || "(sin nombre)"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `;

    // Llamada a la API de Resend
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        subject: subject || "Automation Contact Incrementum",
        html,
        reply_to: email,
      }),
    });

    const text = await r.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (!r.ok) {
      console.error("[Resend Error]", r.status, json || text);
      return NextResponse.json(
        { ok: false, error: json?.error || "Email provider failed" },
        { status: 502 }
      );
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
