// app/page.tsx — Single-file landing ready for VSCode (Next.js App Router)
// Dependencias mínimas: tailwindcss (ya viene con create-next-app) y lucide-react.
// Instala: npm i lucide-react

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  CircuitBoard,
  Rocket,
  Compass,
  MessageCircle,
  Languages,
  Shield,
  Zap,
  Workflow,
  Globe,
  Phone,
  Mail,
  Star,
  Check,
} from "lucide-react";

// ————————————————————————————————————————————————
// Config
// ————————————————————————————————————————————————
const WHATSAPP_NUMBER = "5493834042707"; // intl sin+
const AGENCY_NAME = "Incrementum";

// Dataset para el gráfico de impacto global (valores relativos)
const IMPACT_DATA: { label: string; value: number; unit?: "%" | "pts" }[] = [
  { label: "Tiempo de respuesta", value: -48, unit: "%" },
  { label: "AHT", value: -23, unit: "%" },
  { label: "Errores", value: -40, unit: "%" },
  { label: "SLA", value: 21, unit: "%" },
  { label: "Leads", value: 32, unit: "%" },
  { label: "CSAT", value: 0.7, unit: "pts" },
  { label: "Costos", value: -18, unit: "%" },
];

export default function Page() {
  const [lang, setLang] = useState<'es' | 'en'>("es");
  const t = useMemo(() => copy[lang], [lang]);

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    lang === "es"
      ? `Hola ${AGENCY_NAME}, quiero agendar una reunión.`
      : `Hi ${AGENCY_NAME}, I'd like to book a call.`
  )}`;

  // Smoke tests + mini tests (no framework) – no rompen prod
  useEffect(() => {
    runSmokeTests();
  }, []);

  // Handler de formulario en una sola página (intenta POST y hace fallback a mailto)
  const [sending, setSending] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
    };

    // Validación mínima
    if (payload.message.length < 20) {
      alert(lang === 'es' ? 'El mensaje debe tener al menos 20 caracteres.' : 'Message must be at least 20 characters.');
      return;
    }

    setSending(true);
    try {
      // Si existe un endpoint /api/contact lo usa; si no, hace fallback a mailto
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert(t.form.success);
        (e.currentTarget as HTMLFormElement).reset();
        return;
      }
      throw new Error("No API");
    } catch {
      // Fallback mailto
      const mailto = `mailto:incrementumautomation@gmail.com?subject=${encodeURIComponent("Contacto Landing")}&body=${encodeURIComponent(
        `Nombre: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`
      )}`;
      window.location.href = mailto;
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#374151]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="inline-flex items-center gap-2 font-semibold">
            <LogoMark />
            <span className="text-lg">{AGENCY_NAME}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#servicios" className="hover:text-black transition">{t.nav.services}</a>
            <a href="#proceso" className="hover:text-black transition">{t.nav.process}</a>
            <a href="#casos" className="hover:text-black transition">{t.nav.cases}</a>
            <a href="#faq" className="hover:text-black transition">{t.nav.faq}</a>
            <a href="#contacto" className="hover:text-black transition">{t.nav.contact}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label={t.a11y.langToggle}
              onClick={() => setLang((p) => (p === "es" ? "en" : "es"))}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-black/10 hover:border-black/20 bg-white text-sm"
            >
              <Languages className="w-4 h-4" />
              <span>{lang === "es" ? "EN" : "ES"}</span>
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm"
              style={{ backgroundImage: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)" }}
            >
              <MessageCircle className="w-4 h-4" /> {t.cta.connect}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <HeroBackground />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0B0F14]">{t.hero.h1}</h1>
              <p className="mt-5 text-lg text-[#374151] max-w-prose">{t.hero.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium"
                  style={{ backgroundImage: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)" }}
                >
                  <MessageCircle className="w-5 h-5" /> {t.cta.connect}
                </a>
                <a href="#contacto" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-black/10 bg-white hover:border-black/20">
                  {t.cta.book} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <ul className="mt-8 text-sm text-black/70 grid grid-cols-2 gap-y-2 max-w-md">
                <li>• n8n · WhatsApp API · CRMs</li>
                <li>• AI Agents · Data Integrations</li>
                <li>• SEO & Performance A+</li>
                <li>• Support ES/EN</li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
                <HeroArtwork />
              </div>
              <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-3xl opacity-70 blur-2xl" style={{ background: "radial-gradient(ellipse at center, #06B6D4 0%, transparent 60%)" }} aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0B0F14]">{t.sections.services}</h2>
          <p className="mt-2 text-black/70 max-w-prose">{t.copy.servicesLead}</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard icon={<Bot className="w-6 h-6" />} title={t.services.automation.title} desc={t.services.automation.desc} bullets={[t.bullets.lowRisk, t.bullets.quickWin]} />
            <ServiceCard icon={<CircuitBoard className="w-6 h-6" />} title={t.services.integration.title} desc={t.services.integration.desc} bullets={[t.bullets.singleView, t.bullets.scale]} />
            <ServiceCard icon={<Rocket className="w-6 h-6" />} title={t.services.innovation.title} desc={t.services.innovation.desc} bullets={[t.bullets.proto, t.bullets.metrics]} />
            <ServiceCard icon={<Compass className="w-6 h-6" />} title={t.services.consulting.title} desc={t.services.consulting.desc} bullets={[t.bullets.clarity, t.bullets.enable]} />
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0B0F14]">{t.sections.process}</h2>
          <p className="mt-2 text-black/70 max-w-prose">{t.copy.processLead}</p>
          <ol className="mt-10 grid md:grid-cols-4 gap-6">
            <ProcessStep icon={<Globe className="w-5 h-5" />} title={t.process.discover.title} desc={t.process.discover.desc} index={1} />
            <ProcessStep icon={<Workflow className="w-5 h-5" />} title={t.process.design.title} desc={t.process.design.desc} index={2} />
            <ProcessStep icon={<Zap className="w-5 h-5" />} title={t.process.build.title} desc={t.process.build.desc} index={3} />
            <ProcessStep icon={<Shield className="w-5 h-5" />} title={t.process.launch.title} desc={t.process.launch.desc} index={4} />
          </ol>
        </div>
      </section>

      {/* Casos → Gráfico General */}
      <section id="casos" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0B0F14]">{t.sections.cases}</h2>
          <p className="mt-4 text-black/70 max-w-2xl mx-auto">{t.copy.casesLead}</p>
          <div className="mt-10">
            <OverallImpactChart data={IMPACT_DATA} lang={lang} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0B0F14] text-center">{t.sections.faq}</h2>
          <div className="mt-8 space-y-3">
            {t.faq.map((f, i) => (
              <details key={i} className="group rounded-2xl bg-white ring-1 ring-black/5 p-5">
                <summary className="list-none flex items-center justify-between cursor-pointer select-none">
                  <span className="font-medium">{f.q}</span>
                </summary>
                <p className="mt-3 text-black/70 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden" style={{ backgroundImage: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)" }}>
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-3xl bg-white/10 blur-xl" aria-hidden />
            <h2 className="text-2xl sm:text-3xl font-bold max-w-2xl">{t.ctaBanner.title}</h2>
            <p className="mt-2 text-white/90 max-w-prose">{t.ctaBanner.sub}</p>
            <div className="mt-6 flex gap-3">
              <a href={waHref} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-2 bg-white text-[#0B0F14] px-5 py-3 rounded-2xl font-medium">
                <Phone className="w-4 h-4" /> {t.cta.book}
              </a>
              <a href="#contacto" className="inline-flex items-center gap-2 bg-transparent border border-white/60 text-white px-5 py-3 rounded-2xl font-medium hover:bg-white/10">
                <Mail className="w-4 h-4" /> {t.cta.write}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold text-[#0B0F14]">{t.sections.contact}</h2>
            <p className="mt-2 text-black/70 max-w-prose">{t.copy.contactLead}</p>
            <ul className="mt-4 text-sm text-black/70 space-y-1">
              <li>• Email: incrementumautomation@gmail.com</li>
              <li>• WhatsApp: +{WHATSAPP_NUMBER}</li>
            </ul>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <li className="flex items-center gap-2"><Star className="w-4 h-4" /> {t.promises.fast}</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> {t.promises.clear}</li>
              <li className="flex items-center gap-2"><Shield className="w-4 h-4" /> {t.promises.secure}</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4" /> {t.promises.simple}</li>
            </ul>
          </div>
          <form onSubmit={onSubmit} className="rounded-3xl bg-[#F9FAFB] ring-1 ring-black/5 p-6 grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">{t.form.name}</span>
              <input name="name" type="text" required placeholder={t.form.namePh} className="px-3 py-2 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">{t.form.email}</span>
              <input name="email" type="email" required placeholder="nombre@correo.com" className="px-3 py-2 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">{t.form.message}</span>
              <textarea name="message" required minLength={20} rows={5} placeholder={t.form.messagePh} className="px-3 py-2 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]" />
            </label>
            <div className="flex items-center justify-between">
              <div className="text-xs text-black/50">{t.form.note}</div>
              <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white disabled:opacity-60" style={{ backgroundImage: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)" }}>
                {sending ? (lang === 'es' ? 'Enviando…' : 'Sending…') : t.form.submit}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="inline-flex items-center gap-2 font-semibold">
              <LogoMark /> <span>{AGENCY_NAME}</span>
            </div>
            <p className="mt-3 text-black/60 max-w-xs">{t.footer.tagline}</p>
          </div>
          <div>
            <div className="font-medium text-[#0B0F14] mb-2">{t.footer.quicklinks}</div>
            <ul className="space-y-1 text-black/70">
              <li><a href="#servicios" className="hover:text-black">{t.nav.services}</a></li>
              <li><a href="#proceso" className="hover:text-black">{t.nav.process}</a></li>
              <li><a href="#casos" className="hover:text-black">{t.nav.cases}</a></li>
              <li><a href="#faq" className="hover:text-black">{t.nav.faq}</a></li>
              <li><a href="#contacto" className="hover:text-black">{t.nav.contact}</a></li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-[#0B0F14] mb-2">{t.footer.contact}</div>
            <ul className="space-y-1 text-black/70">
              <li>incrementumautomation@gmail.com</li>
              <li>+{WHATSAPP_NUMBER}</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-[#0B0F14] mb-2">{t.footer.follow}</div>
            <ul className="space-y-1 text-black/70">
              <li><a href="#" className="hover:text-black" aria-label="LinkedIn">LinkedIn</a></li>
              <li><a href="#" className="hover:text-black" aria-label="Instagram">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-black/50">© {new Date().getFullYear()} {AGENCY_NAME}. All rights reserved.</div>
      </footer>

      {/* util */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar{ display:none; }
        .hide-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      {/* JSON-LD (mejora SEO básica) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            lang === "es"
              ? {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: AGENCY_NAME,
                  url: "https://incrementum.example",
                  sameAs: ["https://www.linkedin.com/"],
                  contactPoint: [{ "@type": "ContactPoint", telephone: "+" + WHATSAPP_NUMBER, contactType: "customer service", availableLanguage: ["Spanish", "English"] }]
                }
              : {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: AGENCY_NAME,
                  url: "https://incrementum.example",
                  sameAs: ["https://www.linkedin.com/"],
                  contactPoint: [{ "@type": "ContactPoint", telephone: "+" + WHATSAPP_NUMBER, contactType: "customer service", availableLanguage: ["English", "Spanish"] }]
                }
          )
        }}
      />
    </div>
  );
}

// ————————————————————————————————————————————————
// Componentes auxiliares
// ————————————————————————————————————————————————
function ServiceCard({ icon, title, desc, bullets }: { icon: React.ReactNode; title: string; desc: string; bullets?: string[] }) {
  return (
    <article className="rounded-3xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-md transition">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundImage: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)" }}>{icon}</div>
      <h3 className="mt-4 font-semibold text-lg text-[#0B0F14]">{title}</h3>
      <p className="mt-2 text-sm text-black/70">{desc}</p>
      {bullets && (
        <ul className="mt-3 space-y-1 text-sm">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-black/70"><Check className="w-4 h-4" /> {b}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

function ProcessStep({ icon, title, desc, index }: { icon: React.ReactNode; title: string; desc: string; index: number }) {
  return (
    <li className="relative rounded-3xl bg-white ring-1 ring-black/5 p-6">
      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-2xl text-white grid place-items-center font-semibold" style={{ backgroundImage: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)" }}>{index}</div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundImage: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)" }}>{icon}</div>
      <h3 className="mt-4 font-semibold text-lg text-[#0B0F14]">{title}</h3>
      <p className="mt-2 text-sm text-black/70">{desc}</p>
    </li>
  );
}

function OverallImpactChart({ data, lang }: { data: { label: string; value: number; unit?: "%" | "pts" }[]; lang: 'es' | 'en' }) {
  // Normalizamos por el valor absoluto máximo para la barra
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value))) || 1;
  const fmt = (v: number, u?: "%" | "pts") => `${v > 0 ? "+" : ""}${v}${u ?? "%"}`;
  const title = lang === 'es' ? 'Impacto Global de Automatizaciones' : 'Overall Automation Impact';
  const subtitle = lang === 'es' ? 'Promedios observados en implementaciones recientes' : 'Averages observed across recent implementations';

  return (
    <div className="mx-auto max-w-3xl text-left">
      <div className="mb-4">
        <div className="text-sm uppercase tracking-wider text-black/60">{title}</div>
        <div className="text-xs text-black/50">{subtitle}</div>
      </div>
      <ul className="space-y-3">
        {data.map((d) => {
          const width = Math.max(6, Math.round((Math.abs(d.value) / maxAbs) * 100));
          const isNeg = d.value < 0;
          return (
            <li key={d.label} className="grid grid-cols-[160px_1fr_64px] items-center gap-3">
              <span className="text-sm text-[#0B0F14]">{d.label}</span>
              <div className="relative h-3 rounded-full bg-black/5 overflow-hidden">
                <div
                  className={`absolute top-0 h-full ${isNeg ? 'right-1/2 origin-right' : 'left-1/2 origin-left'}`}
                  style={{
                    width: `${width / 2}%`,
                    backgroundImage: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                    transform: 'translateX(0)'
                  }}
                  aria-hidden
                />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10" aria-hidden />
              </div>
              <span className="text-sm tabular-nums text-black/70 text-right">{fmt(d.value, d.unit)}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 text-[11px] text-black/50">{lang === 'es' ? 'Valores relativos; negativos indican reducción.' : 'Relative values; negatives indicate reduction.'}</div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="relative w-6 h-6" aria-hidden>
      <svg viewBox="0 0 48 48" className="w-6 h-6">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path d="M24 4c6 6 12 10 12 18s-6 14-12 22C18 36 12 28 12 20S18 10 24 4z" fill="url(#g)" />
        <circle cx="24" cy="20" r="3" fill="#fff" />
        <path d="M24 20v10m0-10h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function HeroBackground() {
  return (
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#F3F4F6" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <g opacity="0.12">
        <circle cx="12%" cy="20%" r="160" fill="#10B981" />
        <circle cx="90%" cy="0%" r="220" fill="#06B6D4" />
      </g>
    </svg>
  );
}

function HeroArtwork() {
  return (
    <div className="w-full h-full relative grid place-items-center">
      <svg viewBox="0 0 600 450" className="w-full h-full">
        <defs>
          <linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <rect width="600" height="450" fill="#fff" />
        {/* Formas abstractas fluidas */}
        <path d="M80,260 C120,160 250,120 320,200 C380,270 500,260 520,330 C540,400 380,420 260,380 C160,350 80,360 80,260 Z" fill="url(#a)" opacity="0.18" />
        {/* Líneas/nodos */}
        <g stroke="url(#a)" strokeWidth="2" opacity="0.6">
          <path d="M120 120 H520" />
          <path d="M160 160 H560" />
          <path d="M200 200 H540" />
        </g>
        <g fill="#0B0F14" opacity="0.6">
          <circle cx="200" cy="200" r="4" />
          <circle cx="260" cy="220" r="4" />
          <circle cx="340" cy="210" r="4" />
          <circle cx="420" cy="200" r="4" />
        </g>
      </svg>
    </div>
  );
}

// ————————————————————————————————————————————————
// Copy (ES/EN) – abstracto
// ————————————————————————————————————————————————
const copy = {
  es: {
    nav: { services: "Servicios", process: "Proceso", cases: "Casos", faq: "FAQ", contact: "Contacto" },
    a11y: { langToggle: "Cambiar idioma" },
    hero: {
      h1: "Keep Moving, Develop Business",
      sub: "Integramos personas y tecnología para que tu negocio evolucione sin límites.",
    },
    cta: { connect: "Conéctate con nosotros", book: "Agenda una llamada", write: "Escríbenos" },
    sections: { services: "Servicios", process: "Proceso", cases: "Impacto", faq: "Preguntas frecuentes", contact: "Contacto" },
    copy: {
      servicesLead: "Cuatro frentes para acelerar tu operación con foco en ROI y simplicidad.",
      processLead: "Desde la detección del problema hasta el lanzamiento, en ciclos cortos y medibles.",
      casesLead: "Resultados promedio de implementaciones recientes.",
      contactLead: "¿Tienes un reto concreto? Cuéntanos y proponemos el camino más corto.",
    },
    bullets: {
      lowRisk: "Bajo riesgo, alto impacto",
      quickWin: "Implementaciones rápidas",
      singleView: "Vista unificada de datos",
      scale: "Listo para escalar",
      proto: "Prototipado ágil",
      metrics: "Impacto medible",
      clarity: "Roadmap claro",
      enable: "Enablement de equipos",
    },
    services: {
      automation: { title: "Automatización", desc: "Flujos con n8n y agentes IA para eliminar tareas repetitivas y reducir errores." },
      integration: { title: "Integración", desc: "Conectamos WhatsApp, CRMs, ERPs y hojas de cálculo para una visión unificada." },
      innovation: { title: "Innovación", desc: "Prototipos con IA priorizando time-to-value y KPIs." },
      consulting: { title: "Consultoría", desc: "Gobernanza de datos, diseño de procesos y acompañamiento." },
    },
    process: {
      discover: { title: "Descubrir", desc: "Relevamos procesos, objetivos y restricciones." },
      design: { title: "Diseñar", desc: "Arquitectura simple, segura y medible." },
      build: { title: "Construir", desc: "Integraciones y agentes en sprints cortos." },
      launch: { title: "Desplegar", desc: "Monitoreo, retro y mejoras continuas." },
    },
    faq: [
      { q: "¿Trabajan con cuentas existentes de WhatsApp/CRM?", a: "Sí. Integramos tu stack actual, evitando migraciones innecesarias." },
      { q: "¿Cómo miden el impacto?", a: "Definimos KPIs simples (tiempos, volúmenes, costos) y los seguimos en dashboards." },
      { q: "¿Qué tiempos manejan?", a: "Primera entrega en 2–3 semanas según alcance." },
    ],
    promises: { fast: "Respuesta en menos de 24 h", clear: "Propuesta clara", secure: "Buenas prácticas y seguridad", simple: "Simplicidad primero" },
    ctaBanner: { title: "¿Listo para avanzar con soluciones inteligentes?", sub: "15 minutos para entender tu reto y proponer el camino más corto." },
    form: { name: "Nombre", email: "Email", message: "Mensaje", submit: "Enviar", namePh: "Tu nombre", messagePh: "Cuéntanos brevemente tu necesidad…", note: "Respondemos en < 24h · ES/EN", success: "¡Gracias! Te responderemos en menos de 24 h." },
    footer: { tagline: "Integramos personas y tecnología para que tu negocio evolucione.", quicklinks: "Links", contact: "Contacto", follow: "Redes" },
  },
  en: {
    nav: { services: "Services", process: "Process", cases: "Impact", faq: "FAQ", contact: "Contact" },
    a11y: { langToggle: "Toggle language" },
    hero: { h1: "Keep Moving, Develop Business", sub: "We integrate people and technology so your business evolves without limits." },
    cta: { connect: "Connect with us", book: "Book a call", write: "Write to us" },
    sections: { services: "Services", process: "Process", cases: "Impact", faq: "Frequently asked questions", contact: "Contact" },
    copy: { servicesLead: "Four pillars to accelerate operations with ROI and simplicity.", processLead: "From discovery to launch in short, measurable cycles.", casesLead: "Average outcomes from recent implementations.", contactLead: "Have a specific challenge? Tell us and we’ll propose the shortest path." },
    bullets: { lowRisk: "Low risk, high impact", quickWin: "Quick wins", singleView: "Unified view", scale: "Built to scale", proto: "Rapid prototyping", metrics: "Metrics-first", clarity: "Clear roadmap", enable: "Team enablement" },
    services: { automation: { title: "Automation", desc: "Workflows with n8n and AI agents to remove repetitive work and reduce errors." }, integration: { title: "Integration", desc: "Connect WhatsApp, CRMs, ERPs and spreadsheets for a unified view." }, innovation: { title: "Innovation", desc: "AI prototyping focused on time-to-value and KPIs." }, consulting: { title: "Consulting", desc: "Data governance, process design and enablement." } },
    process: { discover: { title: "Discover", desc: "Map processes, goals and constraints." }, design: { title: "Design", desc: "Simple, secure, measurable architecture." }, build: { title: "Build", desc: "Integrations and agents in short sprints." }, launch: { title: "Launch", desc: "Monitoring, feedback and continuous improvement." } },
    faq: [ { q: "Do you work with existing WhatsApp/CRM accounts?", a: "Yes. We integrate your current stack, avoiding unnecessary migrations." }, { q: "How do you measure impact?", a: "We define simple KPIs (time, volume, cost) and track them in dashboards." }, { q: "What timelines do you handle?", a: "First delivery in 2–3 weeks depending on scope." } ],
    promises: { fast: "Reply in under 24h", clear: "Clear proposal", secure: "Best practices & security", simple: "Simplicity first" },
    ctaBanner: { title: "Ready to move forward with smart solutions?", sub: "15 minutes to understand your challenge and propose the shortest path." },
    form: { name: "Name", email: "Email", message: "Message", submit: "Send", namePh: "Your name", messagePh: "Briefly describe your need…", note: "Reply in < 24h · ES/EN", success: "Thanks! We will get back to you within 24h." },
    footer: { tagline: "We integrate people and technology so your business evolves.", quicklinks: "Quick links", contact: "Contact", follow: "Follow" },
  },
} as const;

// ————————————————————————————————————————————————
// Tests básicos (no modificar a menos que sea necesario)
// ————————————————————————————————————————————————
function runSmokeTests() {
  try {
    // Estructura base
    console.assert(copy.es && copy.en, "copy debe tener 'es' y 'en'");
    ["services", "process", "cases", "faq", "contact"].forEach((k) =>
      console.assert((copy.es as any).sections[k] && (copy.en as any).sections[k], `sections.${k} requerido`)
    );

    // Textos clave
    console.assert(typeof copy.es.hero.h1 === "string" && typeof copy.en.hero.h1 === "string", "hero.h1 requerido");

    // Datos de impacto
    console.assert(Array.isArray(IMPACT_DATA) && IMPACT_DATA.length >= 5, "IMPACT_DATA mínimo 5 elementos");
    console.assert(IMPACT_DATA.every((d) => typeof d.value === "number" && !Number.isNaN(d.value)), "IMPACT_DATA valores numéricos");

    // FAQ presenta items
    console.assert(copy.es.faq.length > 0 && copy.en.faq.length > 0, "FAQ requerido");
  } catch (e) {
    console.warn("Smoke tests warning:", e);
  }
}
