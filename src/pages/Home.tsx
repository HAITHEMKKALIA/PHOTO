import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import gsap from 'gsap'
import { lazy, Suspense } from 'react'
const HeroSection = lazy(() => import('@/components/home/HeroSection').then((m) => ({ default: m.HeroSection })))
import { ProductCard } from '@/components/shop/ProductCard'
import { DEMO_PRODUCTS } from '@/lib/utils'

const COLLECTIONS = [
  {
    id: 'soiree',
    title: 'Soirée & Gala',
    subtitle: 'Robes de prestige',
    image: 'https://images.unsplash.com/photo-1566479179817-57d7c3f9b12e?w=800&q=80',
    href: '/collections',
    count: '24 pièces',
  },
  {
    id: 'business',
    title: 'Power Dressing',
    subtitle: 'Blazers & Tailleurs',
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80',
    href: '/collections',
    count: '18 pièces',
  },
  {
    id: 'casual',
    title: 'Casual Luxe',
    subtitle: 'Élégance du quotidien',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    href: '/collections',
    count: '32 pièces',
  },
]

const PROMISES = [
  { Icon: Truck,     title: 'Livraison gratuite',   desc: 'Dès 150€ d\'achat en France' },
  { Icon: Shield,    title: 'Paiement sécurisé',    desc: 'SSL & 3D Secure garantis' },
  { Icon: RotateCcw, title: 'Retours 14 jours',     desc: 'Échanges et remboursements' },
  { Icon: Star,      title: 'Qualité premium',       desc: 'Sélection haute couture' },
]

function SectionHeader({ subtitle, title, description }: { subtitle: string; title: string; description?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div ref={ref} className="text-center mb-16">
      <motion.p
        className="section-subtitle text-gold mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {subtitle}
      </motion.p>
      <motion.h2
        className="section-title mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      <div className="gold-divider" />
      {description && (
        <motion.p
          className="text-white/40 max-w-xl mx-auto mt-4 text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

export function Home() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current) return
    gsap.to(marqueeRef.current, {
      x: '-50%',
      duration: 25,
      repeat: -1,
      ease: 'none',
    })
  }, [])

  const featured = DEMO_PRODUCTS.filter((p) => p.is_featured).slice(0, 4)
  const newArrivals = DEMO_PRODUCTS.filter((p) => p.is_new).slice(0, 4)

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <Suspense fallback={<div className="h-screen bg-noir-900" />}>
        <HeroSection />
      </Suspense>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-white/[0.06] bg-noir-800/50 py-4">
        <div ref={marqueeRef} className="flex gap-12 whitespace-nowrap" style={{ width: 'max-content' }}>
          {Array(4).fill(['MILLA BOUTIQUE', '★', 'HAUTE COUTURE', '★', 'MODE FÉMININE', '★', 'LUXE & ÉLÉGANCE', '★']).flat().map((item, i) => (
            <span key={i} className="text-white/20 text-xs font-body tracking-[0.4em] uppercase">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Collections */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          subtitle="Nos Collections"
          title="L'élégance en toutes occasions"
          description="De la soirée de gala au bureau, MILLA habille chaque moment de votre vie avec raffinement."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden ${i === 0 ? 'md:row-span-2 aspect-[3/4]' : 'aspect-square'}`}
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/50 text-xs tracking-widest uppercase mb-1">{col.subtitle}</p>
                <h3 className="font-display text-2xl text-white mb-1">{col.title}</h3>
                <p className="text-gold text-xs mb-4">{col.count}</p>
                <Link
                  to={col.href}
                  className="inline-flex items-center gap-2 text-white text-xs tracking-widest uppercase hover:text-gold transition-colors group/link"
                >
                  Découvrir
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          subtitle="Sélection"
          title="Pièces Coups de Cœur"
          description="Nos stylistes ont sélectionné pour vous les créations les plus iconiques de la saison."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product as any} index={i} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/boutique" className="btn-outline-gold inline-flex">
            Voir toute la boutique
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1536243983083-40f2e12be5b5?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-noir-900/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-noir-900 via-noir-900/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <span className="section-subtitle text-gold mb-4 block">Offre Exclusive</span>
            <h2 className="font-display text-5xl md:text-6xl text-white leading-tight mb-6">
              Édition Limitée<br />
              <span className="gold-text">Automne 2024</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              20 pièces uniques signées par nos créateurs. Chaque robe raconte une histoire.
              Soyez la première à la porter.
            </p>
            <Link to="/collections" className="btn-gold inline-flex">
              Découvrir l'édition
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          subtitle="Nouvelles Arrivées"
          title="Les dernières créations"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product, i) => (
            <ProductCard key={product.id} product={product as any} index={i} />
          ))}
        </div>
      </section>

      {/* Promises */}
      <section className="py-16 border-t border-white/[0.06] bg-noir-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {PROMISES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-white font-body text-sm font-semibold">{title}</h4>
                <p className="text-white/40 text-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader subtitle="Avis Clients" title="Elles parlent de nous" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sophie M.', city: 'Paris', rating: 5, text: 'Une boutique exceptionnelle. La robe que j\'ai reçue est d\'une qualité incroyable, exactement comme sur les photos. Je reviendrai sans hésiter !' },
            { name: 'Camille D.', city: 'Lyon', rating: 5, text: 'Service client parfait. J\'ai eu une question sur les tailles, l\'équipe a répondu en moins d\'une heure via le chat. Livraison en 2 jours. Parfait.' },
            { name: 'Marie L.', city: 'Bordeaux', rating: 5, text: 'MILLA Boutique, c\'est le luxe accessible. Les créations sont uniques et on se sent vraiment spéciale en les portant. Mon adresse mode préférée !' },
          ].map(({ name, city, rating, text }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array(rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-white/60 text-sm leading-relaxed italic mb-4">"{text}"</p>
              <div>
                <p className="text-white font-semibold text-sm">{name}</p>
                <p className="text-white/30 text-xs">{city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
