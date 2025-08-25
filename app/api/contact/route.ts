// app/api/contact/route.ts — endpoint Resend con logs detallados
import { NextResponse } from "next/server";

type Payload = { name: string; email: string; message: string; subject?: string };

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const { name, email, message, subject } = (await req.json()) as Payload;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
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
    let json: any = undefined;
    try { json = JSON.parse(text); } catch {}

    if (!r.ok) {
      console.error("[Resend error]", r.status, json || text);
      const providerMsg = (json && (json.error || json.message)) || text || "Email provider failed";
      return NextResponse.json({ ok: false, error: providerMsg }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[CONTACT API]", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
