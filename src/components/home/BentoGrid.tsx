import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react'
import { RevealBlock, RevealStagger } from '@/components/ui/RevealBlock'
import { KineticText } from '@/components/ui/KineticText'
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils'

// ─── Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`
  }
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

// ─── Parallax image ─────────────────────────────────────────────────────────
function ParallaxImage({ src, className = '' }: { src: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt=""
        style={{ y, scale: 1.2 }}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

// ─── Number counter ─────────────────────────────────────────────────────────
function StatCard({ number, label, sub }: { number: string; label: string; sub: string }) {
  return (
    <RevealBlock direction="scale">
      <div className="glass-card p-6 h-full flex flex-col justify-between group hover:border-gold/40 transition-all duration-500">
        <div className="text-5xl font-display gold-text font-black leading-none mb-2">{number}</div>
        <div>
          <p className="text-white font-semibold text-sm">{label}</p>
          <p className="text-white/30 text-xs mt-0.5">{sub}</p>
        </div>
        <div className="w-8 h-px bg-gold/40 mt-4 group-hover:w-full transition-all duration-700" />
      </div>
    </RevealBlock>
  )
}

// ─── Featured product mini ───────────────────────────────────────────────────
function MiniProduct({ product }: { product: typeof DEMO_PRODUCTS[0] }) {
  return (
    <Link
      to={`/produit/${product.slug}`}
      className="flex items-center gap-3 p-3 hover:bg-white/[0.04] transition-all group border-b border-white/[0.05] last:border-0"
    >
      <div className="w-12 h-14 overflow-hidden flex-shrink-0">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{product.name}</p>
        <p className="text-gold text-xs font-bold mt-0.5">{formatPrice(product.price)}</p>
      </div>
      <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-gold transition-colors flex-shrink-0" />
    </Link>
  )
}

// ─── Main Bento Grid ────────────────────────────────────────────────────────
export function BentoGrid() {
  const featured = DEMO_PRODUCTS.filter((p) => p.is_featured)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <RevealBlock className="text-center mb-16">
        <p className="section-subtitle text-gold mb-4">Collections 2026</p>
        <KineticText
          text="L'univers MILLA"
          tag="h2"
          className="section-title"
          trigger="scroll"
          stagger={0.04}
        />
        <div className="gold-divider mt-4" />
      </RevealBlock>

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-12 grid-rows-[auto] gap-4">

        {/* Hero cell — large feature */}
        <RevealBlock className="col-span-12 md:col-span-7 row-span-2" direction="left">
          <TiltCard className="h-full min-h-[480px]">
            <div className="relative h-full overflow-hidden group luxury-card">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1536243983083-40f2e12be5b5?w=1200&q=90"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/30 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase mb-3">Collection Phare</span>
                <h3 className="font-display text-4xl text-white mb-2">Lumière Noire</h3>
                <p className="text-white/50 text-sm mb-6 max-w-xs">Automne — Hiver 2026. Des pièces qui défient le temps.</p>
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-gold hover:text-white transition-colors group/link"
                >
                  Explorer
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </div>
              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(201,168,76,0.05) 50%, transparent 60%)', backgroundSize: '200% 200%', animation: 'shimmer 1.5s linear' }}
              />
            </div>
          </TiltCard>
        </RevealBlock>

        {/* Stats column */}
        <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">
          <StatCard number="200+" label="Créations" sub="par saison" />
          <StatCard number="98%" label="Satisfaction" sub="clientes" />
          <StatCard number="5★" label="Note moyenne" sub="4 900+ avis" />
          <StatCard number="24h" label="Expédition" sub="express" />
        </div>

        {/* Trending product */}
        <RevealBlock className="col-span-12 md:col-span-5" direction="up">
          <div className="glass-card h-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span className="text-white/60 text-xs tracking-widest uppercase">Tendances</span>
              </div>
              <Link to="/boutique" className="text-gold text-xs hover:text-white transition-colors">
                Tout voir →
              </Link>
            </div>
            <div>
              {featured.slice(0, 4).map((p) => (
                <MiniProduct key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* Mood / editorial cell */}
        <RevealBlock className="col-span-12 md:col-span-4" direction="up" delay={0.1}>
          <TiltCard className="h-full min-h-[280px]">
            <div className="relative h-full overflow-hidden group luxury-card">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=90"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">Power Dressing</p>
                <h4 className="font-display text-2xl text-white">Le Blazer Parfait</h4>
              </div>
            </div>
          </TiltCard>
        </RevealBlock>

        {/* New arrivals pill */}
        <RevealBlock className="col-span-12 md:col-span-3" direction="up" delay={0.2}>
          <div className="glass-card h-full p-6 flex flex-col justify-between min-h-[200px] group hover:border-gold/50 transition-all duration-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-white/40 text-xs tracking-widest uppercase">Nouveautés</span>
            </div>
            <div>
              <p className="font-display text-3xl text-white mb-1">12</p>
              <p className="text-white/40 text-sm">nouvelles pièces cette semaine</p>
            </div>
            <Link
              to="/boutique?filter=new"
              className="btn-gold py-2 text-xs inline-flex items-center gap-2 w-full justify-center"
            >
              Découvrir
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </RevealBlock>

        {/* Wide editorial strip */}
        <RevealBlock className="col-span-12" direction="up" delay={0.1}>
          <TiltCard>
            <div className="relative overflow-hidden h-48 group luxury-card">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1600&q=90"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-noir-900 via-noir-900/60 to-transparent" />
              <div className="absolute inset-0 flex items-center px-8 sm:px-16">
                <div>
                  <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2">Édition Limitée</p>
                  <h3 className="font-display text-3xl sm:text-4xl text-white">
                    Black Friday — <span className="gold-text">-30%</span>
                  </h3>
                </div>
                <Link
                  to="/boutique"
                  className="ml-auto btn-gold text-xs px-6 py-3 hidden sm:flex items-center gap-2 group/link"
                >
                  Profiter
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </TiltCard>
        </RevealBlock>
      </div>
    </section>
  )
}
