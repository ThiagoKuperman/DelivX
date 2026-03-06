"use client"

import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react"

/* ═══════════════════════════════════════════
   DELIVX — Logística de Última Milla
   Web Completa: Landing + Calculadora + Blog
   Estética: Modern/Tech Dark
   ═══════════════════════════════════════════ */

const WHATSAPP_NUMBER = "5491112345678"
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Delivx!%20Quiero%20info%20sobre%20el%20servicio%20de%20envíos`

// ─── Color Tokens ───
const C = {
  bg: "#0A0A0F",
  bgCard: "#12121A",
  bgCardHover: "#1A1A25",
  bgAccent: "#16162080",
  border: "#1E1E2E",
  borderLight: "#2A2A3A",
  primary: "#00E89D",
  primaryDim: "#00C584",
  primaryGlow: "rgba(0,232,157,0.15)",
  primaryGlow2: "rgba(0,232,157,0.06)",
  secondary: "#7B61FF",
  secondaryGlow: "rgba(123,97,255,0.12)",
  text: "#F0F0F5",
  textMuted: "#8888A0",
  textDim: "#5A5A72",
  danger: "#FF4D6A",
  warning: "#FFB347",
  success: "#00E89D",
}

// ─── Intersection Observer Hook ───
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible] as const
}

// ─── Section Wrapper with animation ───
function Section({ id, children, style }: { id?: string; children: ReactNode; style?: CSSProperties }) {
  const [ref, visible] = useInView(0.08)
  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
        padding: "100px 24px",
        maxWidth: 1200,
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </section>
  )
}

// ─── Badge Component ───
function Badge({ children, color = C.primary }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 16px",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: color,
        background: color === C.primary ? C.primaryGlow : C.secondaryGlow,
        border: `1px solid ${color}33`,
        borderRadius: 100,
        fontFamily: "var(--font-jetbrains), monospace",
      }}
    >
      {children}
    </span>
  )
}

// ─── Button Component ───
function Button({
  children,
  variant = "primary",
  href,
  onClick,
  style: s,
  size = "md",
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  href?: string
  onClick?: () => void
  style?: CSSProperties
  size?: "sm" | "md" | "lg"
}) {
  const pad = size === "lg" ? "16px 36px" : size === "sm" ? "10px 20px" : "12px 28px"
  const fs = size === "lg" ? 16 : size === "sm" ? 13 : 14
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: pad,
    fontSize: fs,
    fontWeight: 600,
    fontFamily: "var(--font-outfit), sans-serif",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.3s ease",
    letterSpacing: "0.02em",
  }
  const variants: Record<string, CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDim})`,
      color: C.bg,
      boxShadow: `0 4px 24px ${C.primaryGlow}`,
    },
    secondary: {
      background: "transparent",
      color: C.text,
      border: `1.5px solid ${C.borderLight}`,
    },
    ghost: {
      background: C.primaryGlow2,
      color: C.primary,
      border: `1px solid ${C.primary}33`,
    },
  }
  const Tag = href ? "a" : "button"
  return (
    <Tag
      href={href}
      onClick={onClick}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{ ...base, ...variants[variant], ...s }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement
        target.style.transform = "translateY(-2px)"
        target.style.boxShadow =
          variant === "primary" ? `0 8px 32px ${C.primaryGlow}` : `0 4px 16px rgba(0,0,0,0.3)`
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement
        target.style.transform = "translateY(0)"
        target.style.boxShadow = (variants[variant].boxShadow as string) || "none"
      }}
    >
      {children}
    </Tag>
  )
}

// ─── Animated Counter ───
function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useInView(0.3)
  useEffect(() => {
    if (!visible) return
    let start: number | null = null
    const duration = 2000
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, end])
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
function Nav({ activeSection }: { activeSection: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { label: "Servicios", href: "#servicios" },
    { label: "Zonas", href: "#zonas" },
    { label: "Precios", href: "#calculadora" },
    { label: "Guías", href: "#blog" },
    { label: "Nosotros", href: "#nosotros" },
  ]

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "12px 24px" : "20px 24px",
        background: scrolled ? `${C.bg}E8` : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.5)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* Logo */}
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDim})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              color: C.bg,
            }}
          >
            D
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>
            Deliv<span style={{ color: C.primary }}>x</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 8 }}
          className="hidden md:flex"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 500,
                color: activeSection === l.href.slice(1) ? C.primary : C.textMuted,
                textDecoration: "none",
                borderRadius: 8,
                transition: "all 0.2s",
                background: activeSection === l.href.slice(1) ? C.primaryGlow2 : "transparent",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.text)}
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  activeSection === l.href.slice(1) ? C.primary : C.textMuted)
              }
            >
              {l.label}
            </a>
          ))}
          <Button href={WHATSAPP_URL} size="sm" style={{ marginLeft: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
            Cotiza ahora
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            color: C.text,
            fontSize: 24,
          }}
          className="block md:hidden"
          aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: `${C.bgCard}F5`,
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${C.border}`,
            padding: "16px 24px",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "14px 0",
                fontSize: 16,
                fontWeight: 500,
                color: C.textMuted,
                textDecoration: "none",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ paddingTop: 16 }}>
            <Button href={WHATSAPP_URL} size="lg" style={{ width: "100%", justifyContent: "center" }}>
              Cotiza ahora
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

// ═══════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════
function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px 80px",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 50%, ${C.primaryGlow} 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 30%, ${C.secondaryGlow} 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 50% 100%, rgba(0,232,157,0.04) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />
      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border}40 1px, transparent 1px), linear-gradient(90deg, ${C.border}40 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <div className="animate-in">
            <Badge>Logistica de ultima milla - GBA + CABA</Badge>
          </div>

          <h1
            className="animate-in-delay-1"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              marginTop: 24,
            }}
          >
            Tus envios{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 200%",
                animation: "gradientMove 4s ease infinite",
              }}
            >
              llegan hoy.
            </span>
            <br />
            Siempre.
          </h1>

          <p
            className="animate-in-delay-2"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.7,
              color: C.textMuted,
              marginTop: 24,
              maxWidth: 540,
            }}
          >
            Somos tu operador Flex en el Gran Buenos Aires. Flota propia de Sprinter, GPS en tiempo real y 97% de
            entregas a tiempo. Vos vende, nosotros entregamos.
          </p>

          <div className="animate-in-delay-3" style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
            <Button href={WHATSAPP_URL} size="lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              Empeza a enviar
            </Button>
            <Button href="#calculadora" variant="secondary" size="lg">
              Calcula tu tarifa
            </Button>
          </div>

          {/* Trust Badges */}
          <div
            className="animate-in-delay-4"
            style={{
              display: "flex",
              gap: 32,
              marginTop: 56,
              flexWrap: "wrap",
            }}
          >
            {[
              { val: "97%", label: "Entregas a tiempo" },
              { val: "24hs", label: "Entrega en el dia" },
              { val: "+120", label: "Paquetes por Sprinter" },
            ].map((b, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: C.primary,
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  {b.val}
                </div>
                <div style={{ fontSize: 13, color: C.textDim, marginTop: 2 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual - Abstract truck/package */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: "50%",
            transform: "translateY(-50%)",
            width: 420,
            height: 420,
            opacity: 0.6,
            animation: "float 6s ease-in-out infinite",
          }}
          className="hidden lg:block"
        >
          <svg viewBox="0 0 400 400" fill="none">
            <rect x="60" y="120" width="200" height="140" rx="16" stroke={C.primary} strokeWidth="2" opacity="0.5" />
            <rect x="260" y="160" width="80" height="100" rx="12" stroke={C.primary} strokeWidth="2" opacity="0.3" />
            <circle cx="120" cy="280" r="24" stroke={C.primary} strokeWidth="2" opacity="0.4" />
            <circle cx="230" cy="280" r="24" stroke={C.primary} strokeWidth="2" opacity="0.4" />
            <rect
              x="100"
              y="80"
              width="60"
              height="60"
              rx="8"
              stroke={C.secondary}
              strokeWidth="1.5"
              opacity="0.3"
              transform="rotate(-12 130 110)"
            />
            <rect
              x="180"
              y="60"
              width="50"
              height="50"
              rx="8"
              stroke={C.primary}
              strokeWidth="1.5"
              opacity="0.2"
              transform="rotate(8 205 85)"
            />
            <path d="M160 160 L160 220 M120 190 L200 190" stroke={C.primary} strokeWidth="1.5" opacity="0.2" />
          </svg>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// STATS BAR
// ═══════════════════════════════════════════
function StatsBar() {
  return (
    <div
      style={{
        background: C.bgCard,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 32,
          textAlign: "center",
        }}
      >
        {[
          { end: 645, suffix: "M", label: "Unidades vendidas online en Argentina (2025)", icon: "📦" },
          { end: 70, suffix: "%", label: "Compradores AMBA esperan entrega en 24hs", icon: "⚡" },
          { end: 60, suffix: "%", label: "Crecimiento e-commerce Argentina", icon: "📈" },
          { end: 25, suffix: "%", label: "Mas ventas con badge 'Llega hoy'", icon: "🏷️" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 14, marginBottom: 8 }}>{s.icon}</div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: C.primary,
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              <Counter end={s.end} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6, lineHeight: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════
function Services() {
  const services = [
    {
      icon: "🚀",
      title: "Envios Flex Same-Day",
      desc: "Retiramos y entregamos en el dia. Tu publicacion aparece con el filtro 'Llega hoy' en MercadoLibre y aumentas tus ventas un 25%.",
      tags: ["MercadoLibre", "Same-day"],
    },
    {
      icon: "📦",
      title: "Logistica E-commerce",
      desc: "Operamos con Tiendanube, Shopify y WooCommerce. Integramos tu tienda con nuestro sistema de tracking en tiempo real.",
      tags: ["Tiendanube", "Shopify", "WooCommerce"],
    },
    {
      icon: "🔄",
      title: "Rutas Fijas Diarias",
      desc: "Rutas programadas con paradas predefinidas. Ideal para distribuidoras, farmacias y negocios con entregas recurrentes.",
      tags: ["B2B", "Recurrente"],
    },
    {
      icon: "🏪",
      title: "Fulfillment & CrossDocking",
      desc: "Recibimos tu mercaderia, la clasificamos y la despachamos. Vos te enfocas en vender, nosotros en la operacion.",
      tags: ["Almacenamiento", "Despacho"],
    },
    {
      icon: "📍",
      title: "Tracking en Tiempo Real",
      desc: "GPS en cada Sprinter. Tus clientes saben donde esta su paquete en todo momento. Confirmacion con foto y firma digital.",
      tags: ["GPS", "Tecnologia"],
    },
    {
      icon: "💬",
      title: "Atencion por WhatsApp",
      desc: "Canal directo con tu coordinador asignado. Updates automaticos de estado de envio. Sin call centers, sin esperas.",
      tags: ["Directo", "24/7"],
    },
  ]

  return (
    <Section id="servicios">
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge>Servicios</Badge>
        <h2
          style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 16, letterSpacing: "-0.03em" }}
        >
          Todo lo que necesitas para <span style={{ color: C.primary }}>enviar sin preocuparte</span>
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, marginTop: 12, maxWidth: 560, margin: "12px auto 0" }}>
          Desde el retiro hasta la puerta del comprador, con tecnologia y una flota que se adapta a tu volumen.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20,
        }}
      >
        {services.map((s, i) => (
          <div
            key={i}
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 32,
              transition: "all 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.borderColor = `${C.primary}44`
              target.style.background = C.bgCardHover
              target.style.transform = "translateY(-4px)"
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.borderColor = C.border
              target.style.background = C.bgCard
              target.style.transform = "translateY(0)"
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.02em" }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {s.tags.map((t, j) => (
                <span
                  key={j}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: C.primaryGlow2,
                    color: C.primaryDim,
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ═══════════════════════════════════════════
// ZONES MAP
// ═══════════════════════════════════════════
function Zones() {
  const [activeZone, setActiveZone] = useState<string | null>(null)
  const zones = [
    {
      id: "sur",
      name: "GBA Sur",
      color: C.primary,
      municipios: "Avellaneda - Quilmes - Lomas de Zamora - Lanus - Berazategui",
      densidad: "Alta — zona industrial + residencial",
      sprinter: "Sprinter 1",
    },
    {
      id: "oeste",
      name: "GBA Oeste",
      color: C.secondary,
      municipios: "La Matanza - Moron - Ituzaingo - Merlo - Moreno",
      densidad: "Muy alta — mayor densidad poblacional",
      sprinter: "Sprinter 2",
    },
    {
      id: "norte",
      name: "GBA Norte",
      color: C.warning,
      municipios: "Tigre - San Isidro - Vicente Lopez - Malvinas Argentinas - Pilar",
      densidad: "Alta — zona residencial + comercial",
      sprinter: "Sprinter 3",
    },
    {
      id: "caba",
      name: "CABA",
      color: C.danger,
      municipios: "Todos los barrios de la Ciudad Autonoma de Buenos Aires",
      densidad: "Muy alta — precio mas elevado",
      sprinter: "Cobertura rotativa",
    },
  ]

  return (
    <Section id="zonas">
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge>Cobertura</Badge>
        <h2
          style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 16, letterSpacing: "-0.03em" }}
        >
          Cubrimos <span style={{ color: C.primary }}>todo el mapa Flex</span>
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, marginTop: 12 }}>
          Una Sprinter asignada por zona. Cobertura completa del Gran Buenos Aires.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {zones.map((z) => (
          <div
            key={z.id}
            onClick={() => setActiveZone(activeZone === z.id ? null : z.id)}
            style={{
              background: activeZone === z.id ? C.bgCardHover : C.bgCard,
              border: `1px solid ${activeZone === z.id ? z.color + "66" : C.border}`,
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: z.color,
                opacity: 0.06,
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: z.color,
                boxShadow: `0 0 12px ${z.color}88`,
                marginBottom: 16,
              }}
            />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{z.name}</h3>
            <p
              style={{
                fontSize: 12,
                color: z.color,
                fontWeight: 600,
                marginBottom: 12,
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              {z.sprinter}
            </p>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{z.municipios}</p>
            {activeZone === z.id && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${C.border}`,
                  fontSize: 13,
                  color: C.textDim,
                  animation: "fadeIn 0.3s ease",
                }}
              >
                Densidad: {z.densidad}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}

// ═══════════════════════════════════════════
// PRICING CALCULATOR
// ═══════════════════════════════════════════
function Calculator() {
  const [zone, setZone] = useState("caba")
  const [volume, setVolume] = useState(10)
  const [calculated, setCalculated] = useState(false)

  const prices: Record<string, { base: number; label: string }> = {
    caba: { base: 3500, label: "CABA" },
    gba1: { base: 4000, label: "GBA 1° cordon" },
    gba2: { base: 4500, label: "GBA 2° cordon" },
  }

  const getDiscount = (vol: number) => {
    if (vol >= 50) return 0.15
    if (vol >= 21) return 0.12
    if (vol >= 11) return 0.08
    return 0
  }

  const basePrice = prices[zone].base
  const discount = getDiscount(volume)
  const unitPrice = Math.round(basePrice * (1 - discount))
  const dailyTotal = unitPrice * volume
  const monthlyTotal = dailyTotal * 26

  const handleCalc = () => setCalculated(true)

  return (
    <Section id="calculadora" style={{ padding: "100px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge>Calculadora</Badge>
        <h2
          style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 16, letterSpacing: "-0.03em" }}
        >
          Calcula tu <span style={{ color: C.primary }}>tarifa en segundos</span>
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, marginTop: 12 }}>
          Precios transparentes. Sin recargos ocultos. Sin cargo por lluvia.
        </p>
      </div>

      <div
        style={{
          maxWidth: 740,
          margin: "0 auto",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "clamp(24px, 4vw, 48px)",
        }}
      >
        {/* Zone Selector */}
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.textMuted,
            display: "block",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-jetbrains), monospace",
          }}
        >
          Zona de entrega
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {Object.entries(prices).map(([key, val]) => (
            <button
              key={key}
              onClick={() => {
                setZone(key)
                setCalculated(false)
              }}
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                border: `1.5px solid ${zone === key ? C.primary : C.borderLight}`,
                background: zone === key ? C.primaryGlow : "transparent",
                color: zone === key ? C.primary : C.textMuted,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.textMuted,
            display: "block",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-jetbrains), monospace",
          }}
        >
          Envios por dia: <span style={{ color: C.primary, fontSize: 18, fontWeight: 800 }}>{volume}</span>
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={volume}
          onChange={(e) => {
            setVolume(Number(e.target.value))
            setCalculated(false)
          }}
          style={{
            width: "100%",
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(to right, ${C.primary} ${volume}%, ${C.borderLight} ${volume}%)`,
            cursor: "pointer",
            marginBottom: 8,
          }}
        />
        <div
          style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textDim, marginBottom: 32 }}
        >
          <span>1</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div
            style={{
              background: `${C.primary}15`,
              border: `1px solid ${C.primary}33`,
              borderRadius: 10,
              padding: "12px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>🎉</span>
            <span style={{ fontSize: 14, color: C.primary, fontWeight: 600 }}>
              Descuento por volumen! -{Math.round(discount * 100)}% sobre tarifa base
            </span>
          </div>
        )}

        <Button onClick={handleCalc} size="lg" style={{ width: "100%", justifyContent: "center", marginBottom: 24 }}>
          Calcular tarifa
        </Button>

        {/* Results */}
        {calculated && (
          <div
            style={{
              animation: "fadeInUp 0.5s ease",
              borderTop: `1px solid ${C.border}`,
              paddingTop: 24,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>Por envio</div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: C.text,
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  ${unitPrice.toLocaleString("es-AR")}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>Por dia</div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: C.primary,
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  ${dailyTotal.toLocaleString("es-AR")}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>Por mes (est.)</div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: C.text,
                    fontFamily: "var(--font-jetbrains), monospace",
                  }}
                >
                  ${monthlyTotal.toLocaleString("es-AR")}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: C.bgAccent,
                borderRadius: 10,
                fontSize: 13,
                color: C.textMuted,
                lineHeight: 1.7,
              }}
            >
              Retiro puerta a puerta incluido - Sin recargo por lluvia - Tracking GPS en tiempo real - Confirmacion con
              foto
            </div>

            <Button href={WHATSAPP_URL} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              Quiero esta tarifa — Hablar por WhatsApp
            </Button>
          </div>
        )}
      </div>
    </Section>
  )
}

// ═══════════════════════════════════════════
// WHY DELIVX
// ═══════════════════════════════════════════
function WhyDelivx() {
  const reasons = [
    {
      icon: "🚛",
      title: "Sprinter > Moto",
      desc: "Cada camioneta carga 80-120 paquetes vs 5-10 de una moto. Mas eficiente, mas predecible, paquetes mas grandes.",
    },
    {
      icon: "📊",
      title: "97% de cumplimiento",
      desc: "Tu reputacion en MercadoLibre es tu negocio. Nosotros la protegemos con procesos y tecnologia.",
    },
    {
      icon: "💸",
      title: "Sin costos ocultos",
      desc: "Precio transparente. Sin recargo por lluvia, sin cargo extra por retiro. Lo que cotizas es lo que pagas.",
    },
    {
      icon: "📱",
      title: "WhatsApp directo",
      desc: "Hablas con tu coordinador, no con un call center. Updates en tiempo real de cada envio.",
    },
  ]

  return (
    <Section id="nosotros">
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}
      >
        <div>
          <Badge>Por que Delivx?</Badge>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 800,
              marginTop: 16,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            No somos una app.
            <br />
            Somos <span style={{ color: C.primary }}>tu equipo logistico.</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>
            Mientras otros operadores te dan un numero de tracking y desaparecen, nosotros tenemos un coordinador
            dedicado por zona que conoce a tus compradores y optimiza las rutas todos los dias.
          </p>
          <Button href={WHATSAPP_URL} style={{ marginTop: 24 }}>
            Conocenos
          </Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reasons.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: 20,
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = `${C.primary}44`
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = C.border
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{r.icon}</span>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{r.title}</h4>
                <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ═══════════════════════════════════════════
// BLOG / GUIDES
// ═══════════════════════════════════════════
function Blog() {
  const articles = [
    {
      tag: "Guia Flex",
      title: "Como activar Envios Flex en MercadoLibre y multiplicar tus ventas",
      excerpt:
        "El filtro 'Llega hoy' puede aumentar tus conversiones un 25%. Te explicamos paso a paso como activarlo y que necesitas para mantener el badge activo.",
      readTime: "8 min",
      color: C.primary,
    },
    {
      tag: "Tips de envios",
      title: "5 errores que los vendedores de ML cometen con la logistica",
      excerpt:
        "Desde el embalaje hasta la eleccion del operador, estos errores te estan costando ventas y reputacion. Aprende a evitarlos.",
      readTime: "5 min",
      color: C.secondary,
    },
    {
      tag: "E-commerce",
      title: "Guia completa: logistica para Tiendanube en el GBA",
      excerpt:
        "Tiendanube no ofrece same-day propio en AMBA. Asi podes diferenciarte de tu competencia ofreciendo entregas en 24 horas.",
      readTime: "10 min",
      color: C.warning,
    },
    {
      tag: "Costos",
      title: "Cuanto cuesta enviar un paquete en GBA en 2026?",
      excerpt:
        "Comparativa actualizada de tarifas entre los principales operadores de ultima milla. Precios reales y sin letra chica.",
      readTime: "6 min",
      color: C.danger,
    },
  ]

  return (
    <Section id="blog">
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge color={C.secondary}>Guias & Recursos</Badge>
        <h2
          style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 16, letterSpacing: "-0.03em" }}
        >
          Aprende a <span style={{ color: C.primary }}>vender mas con mejor logistica</span>
        </h2>
        <p style={{ color: C.textMuted, fontSize: 17, marginTop: 12 }}>
          Recursos gratuitos para vendedores de MercadoLibre, Tiendanube y Shopify.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {articles.map((a, i) => (
          <article
            key={i}
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 28,
              transition: "all 0.3s ease",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.borderColor = `${a.color}44`
              target.style.transform = "translateY(-4px)"
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.borderColor = C.border
              target.style.transform = "translateY(0)"
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: a.color,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-jetbrains), monospace",
              }}
            >
              {a.tag}
            </span>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginTop: 12,
                lineHeight: 1.35,
                letterSpacing: "-0.02em",
                flex: 1,
              }}
            >
              {a.title}
            </h3>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65, marginTop: 12 }}>{a.excerpt}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                paddingTop: 16,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: 12, color: C.textDim }}>{a.readTime} lectura</span>
              <span style={{ fontSize: 13, color: a.color, fontWeight: 600 }}>Leer</span>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

// ═══════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════
function Testimonials() {
  const testimonials = [
    {
      name: "Martin L.",
      role: "Vendedor MercadoLibre - Quilmes",
      text: "Desde que trabajo con Delivx mi tasa de entregas a tiempo subio al 98%. Mis publicaciones aparecen con 'Llega hoy' y vendo mucho mas.",
      rating: 5,
    },
    {
      name: "Carolina F.",
      role: "Tienda online de cosmetica - CABA",
      text: "La diferencia es el trato directo. Le escribo a mi coordinador por WhatsApp y en 2 minutos tengo todo resuelto. Con los otros operadores esperaba horas.",
      rating: 5,
    },
    {
      name: "Diego R.",
      role: "Ferreteria online - La Matanza",
      text: "Con las motos no podia enviar mis productos mas grandes. Las Sprinter me solucionaron la vida. Ahora envio taladros, escaleras, de todo.",
      rating: 5,
    },
  ]

  return (
    <Section id="testimonios">
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge>Testimonios</Badge>
        <h2
          style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 16, letterSpacing: "-0.03em" }}
        >
          Lo que dicen <span style={{ color: C.primary }}>nuestros vendedores</span>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 32,
            }}
          >
            <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
              {Array(t.rating)
                .fill(0)
                .map((_, j) => (
                  <span key={j} style={{ color: C.warning, fontSize: 16 }}>
                    ★
                  </span>
                ))}
            </div>
            <p
              style={{ fontSize: 15, lineHeight: 1.7, color: C.textMuted, fontStyle: "italic", marginBottom: 20 }}
            >
              &ldquo;{t.text}&rdquo;
            </p>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ═══════════════════════════════════════════
// CTA FINAL
// ═══════════════════════════════════════════
function FinalCTA() {
  return (
    <Section id="contacto">
      <div
        style={{
          background: `linear-gradient(135deg, ${C.bgCard}, ${C.bgCardHover})`,
          border: `1px solid ${C.border}`,
          borderRadius: 24,
          padding: "clamp(40px, 6vw, 80px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 0%, ${C.primaryGlow} 0%, transparent 60%)`,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Listo para que tus envios
            <br />
            <span style={{ color: C.primary }}>lleguen hoy, siempre?</span>
          </h2>
          <p style={{ color: C.textMuted, fontSize: 17, marginTop: 16, maxWidth: 500, margin: "16px auto 0" }}>
            Escribinos por WhatsApp y en menos de 5 minutos tenes tu cotizacion personalizada. Sin compromiso.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <Button href={WHATSAPP_URL} size="lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              Hablar por WhatsApp
            </Button>
            <Button href="#calculadora" variant="secondary" size="lg">
              Calcular tarifa primero
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              marginTop: 48,
              flexWrap: "wrap",
            }}
          >
            {["Cotizacion en 5 minutos", "Sin compromiso", "Prueba gratuita de 5 envios"].map((t, i) => (
              <span key={i} style={{ fontSize: 13, color: C.textDim, fontWeight: 500 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════
function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${C.border}`,
        padding: "48px 24px",
        background: C.bgCard,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 7,
                background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDim})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 900,
                color: C.bg,
              }}
            >
              D
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>
              Deliv<span style={{ color: C.primary }}>x</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>
            Logistica de ultima milla para e-commerce.
            <br />
            CABA y Gran Buenos Aires.
          </p>
        </div>

        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            Servicios
          </h4>
          {["Envios Flex Same-Day", "Rutas fijas diarias", "Logistica e-commerce", "Fulfillment"].map((l, i) => (
            <div key={i} style={{ fontSize: 13, color: C.textDim, padding: "5px 0" }}>
              {l}
            </div>
          ))}
        </div>

        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            Zonas
          </h4>
          {["CABA", "GBA Norte", "GBA Sur", "GBA Oeste"].map((l, i) => (
            <div key={i} style={{ fontSize: 13, color: C.textDim, padding: "5px 0" }}>
              {l}
            </div>
          ))}
        </div>

        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            Contacto
          </h4>
          <a
            href={WHATSAPP_URL}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: C.primary,
              textDecoration: "none",
              padding: "5px 0",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
            WhatsApp
          </a>
          <div style={{ fontSize: 13, color: C.textDim, padding: "5px 0" }}>info@delivx.com.ar</div>
          <div style={{ fontSize: 13, color: C.textDim, padding: "5px 0" }}>@delivx.logistica</div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "32px auto 0",
          paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 12, color: C.textDim }}>2026 Delivx. Todos los derechos reservados.</span>
        <span style={{ fontSize: 12, color: C.textDim }}>CABA & Gran Buenos Aires, Argentina</span>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════
// FLOATING WHATSAPP BUTTON
// ═══════════════════════════════════════════
function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 999,
        width: 56,
        height: 56,
        borderRadius: 16,
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 24px rgba(37,211,102,0.4)",
        animation: "fadeIn 0.3s ease",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.1)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  )
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function DelivxApp() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const sections = ["hero", "servicios", "zonas", "calculadora", "blog", "nosotros", "contacto"]
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.3 }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Nav activeSection={activeSection} />
      <Hero />
      <StatsBar />
      <Services />
      <Zones />
      <Calculator />
      <WhyDelivx />
      <Testimonials />
      <Blog />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
