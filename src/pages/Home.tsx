import { lazy, Suspense, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Star, Truck, Shield, RotateCcw, Gem } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProductCard } from '@/components/shop/ProductCard'
import { BentoGrid } from '@/components/home/BentoGrid'
import { RevealBlock, RevealStagger } from '@/components/ui/RevealBlock'
import { KineticText } from '@/components/ui/KineticText'
import { Magnetic } from '@/components/ui/Magnetic'
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const HeroSection = lazy(() =>
  import('@/components/home/HeroSection').then((m) => ({ default: m.HeroSection }))
)

// ─── Horizontal scroll marquee (GSAP) ───────────────────────────────────────
function Marquee({ items }: { items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    gsap.to(el, { x: '-50%', duration: 22, repeat: -1, ease: 'none' })
  }, [])
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden py-5 border-y border-white/[0.05] bg-noir-900/60">
      <div ref={trackRef} className="flex gap-10 whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="text-white/15 text-[10px] font-body tracking-[0.5em] uppercase">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Horizontal product scroll section ──────────────────────────────────────
function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const totalWidth = track.scrollWidth - window.innerWidth

    gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${totalWidth}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
      },
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const items = DEMO_PRODUCTS.slice(0, 6) as any[]

  return (
    <div ref={sectionRef} className="relative overflow-hidden h-screen">
      <div className="absolute top-16 left-8 sm:left-16 z-10">
        <RevealBlock>
          <p className="section-subtitle text-gold mb-2">Glissez →</p>
          <h2 className="font-display text-4xl md:text-5xl text-white">Best-sellers</h2>
        </RevealBlock>
      </div>
      <div ref={trackRef} className="flex items-center gap-6 h-full pl-[30vw] pr-24" style={{ width: 'max-content' }}>
        {items.map((product, i) => (
          <div key={product.id} className="w-[280px] sm:w-[320px] flex-shrink-0">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Parallax editorial strip ────────────────────────────────────────────────
function EditorialStrip() {
  const ref  = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          src="https://images.unsplash.com/photo-1536243983083-40f2e12be5b5?w=1600&q=80"
          alt=""
          style={{ y: y1, scale }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-noir-900 via-noir-900/80 to-noir-900/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y2 }}>
            <RevealBlock>
              <p className="section-subtitle text-gold mb-4">Offre Exclusive</p>
              <KineticText
                text="Édition Limitée"
                tag="h2"
                className="font-display text-5xl md:text-6xl text-white leading-tight"
                trigger="scroll"
                stagger={0.05}
              />
              <br />
              <KineticText
                text="Automne 2026"
                tag="h2"
                className="font-display text-5xl md:text-6xl gold-text leading-tight"
                trigger="scroll"
                stagger={0.05}
                delay={0.3}
              />
              <p className="text-white/40 text-sm leading-relaxed mt-6 mb-8 max-w-sm">
                20 pièces numérotées. Chaque robe porte l'empreinte de nos créateurs.
                Soyez la première à la découvrir.
              </p>
              <Magnetic>
                <Link to="/collections" className="btn-gold inline-flex group">
                  Découvrir l'édition
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
            </RevealBlock>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Promises bar ────────────────────────────────────────────────────────────
const PROMISES = [
  { Icon: Truck,    title: 'Livraison gratuite', desc: 'Dès 150€' },
  { Icon: Shield,   title: 'Paiement sécurisé',  desc: 'SSL 3D Secure' },
  { Icon: RotateCcw,title: 'Retours 14 jours',   desc: 'Sans frais' },
  { Icon: Gem,      title: 'Qualité premium',     desc: 'Haute couture' },
]

// ─── Testimonials ────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Sophie M.', city: 'Paris', rating: 5, text: 'Une boutique exceptionnelle. La robe que j\'ai reçue est d\'une qualité incroyable. Je reviendrai sans hésiter !' },
  { name: 'Camille D.', city: 'Lyon', rating: 5, text: 'Service parfait. Réponse en moins d\'une heure via le chat, livraison en 2 jours. Parfait.' },
  { name: 'Marie L.', city: 'Bordeaux', rating: 5, text: 'MILLA, c\'est le luxe accessible. Les créations sont uniques et on se sent vraiment spéciale.' },
]

// ─── Main ────────────────────────────────────────────────────────────────────
export function Home() {
  const newArrivals = DEMO_PRODUCTS.filter((p) => p.is_new).slice(0, 4)
  const marqueeItems = ['MILLA BOUTIQUE', '✦', 'HAUTE COUTURE', '✦', 'PARIS', '✦', 'MODE FÉMININE', '✦', 'LUXE & ÉLÉGANCE', '✦', 'COLLECTION 2026', '✦']

  return (
    <div className="overflow-x-hidden">
      {/* Hero 3D */}
      <Suspense fallback={<div className="h-screen bg-noir-900 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" /></div>}>
        <HeroSection />
      </Suspense>

      {/* Marquee */}
      <Marquee items={marqueeItems} />

      {/* Bento Grid 2026 */}
      <BentoGrid />

      {/* Horizontal scroll products */}
      <HorizontalScroll />

      {/* Editorial parallax */}
      <EditorialStrip />

      {/* New arrivals grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealBlock className="text-center mb-16">
          <p className="section-subtitle text-gold mb-4">Fraîchement arrivées</p>
          <KineticText text="Nouvelles créations" tag="h2" className="section-title" trigger="scroll" stagger={0.04} />
          <div className="gold-divider mt-4" />
        </RevealBlock>
        <RevealStagger className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product, i) => (
            <ProductCard key={product.id} product={product as any} index={i} />
          ))}
        </RevealStagger>
        <RevealBlock className="text-center mt-12">
          <Magnetic>
            <Link to="/boutique" className="btn-outline-gold inline-flex">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Magnetic>
        </RevealBlock>
      </section>

      {/* Promises */}
      <section className="py-16 border-y border-white/[0.05] bg-noir-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealStagger className="grid grid-cols-2 md:grid-cols-4 gap-8" stagger={0.1}>
            {PROMISES.map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3 group">
                <div className="w-12 h-12 border border-gold/20 group-hover:border-gold/60 group-hover:bg-gold/5 flex items-center justify-center transition-all duration-500">
                  <Icon className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
                </div>
                <h4 className="text-white text-sm font-semibold">{title}</h4>
                <p className="text-white/30 text-xs">{desc}</p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealBlock className="text-center mb-16">
          <p className="section-subtitle text-gold mb-4">Avis clients</p>
          <KineticText text="Elles parlent de nous" tag="h2" className="section-title" trigger="scroll" stagger={0.04} />
        </RevealBlock>
        <RevealStagger className="grid md:grid-cols-3 gap-6" stagger={0.12}>
          {TESTIMONIALS.map(({ name, city, rating, text }) => (
            <div key={name} className="luxury-card p-6 group hover:border-gold/30 transition-all duration-500">
              <div className="flex gap-1 mb-4">
                {Array(rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-white/50 text-sm leading-relaxed italic mb-5">"{text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                <div className="w-8 h-8 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">
                  {name[0]}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{name}</p>
                  <p className="text-white/30 text-xs">{city}</p>
                </div>
              </div>
            </div>
          ))}
        </RevealStagger>
      </section>
    </div>
  )
}
