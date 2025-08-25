// app/api/contact/route.ts
import { NextResponse } from "next/server";

type Payload = { name: string; email: string; message: string };

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = (await req.json()) as Payload;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    if (message.trim().length < 20) {
      return NextResponse.json({ ok: false, error: "Message too short" }, { status: 400 });
    }

    const html = `
      <h2>Nuevo contacto desde la landing</h2>
      <p><b>Nombre:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p style="white-space:pre-wrap">${message}</p>
    `;

    const from = process.env.CONTACT_FROM || "Incrementum <onboarding@resend.dev>";
    const to = process.env.CONTACT_TO || "incrementum@gmail.com";

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Nuevo contacto – Landing Incrementum",
        html,
        reply_to: email,
      }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.error("[Resend error]", err);
      return NextResponse.json({ ok: false, error: "Email provider failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[CONTACT API]", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
