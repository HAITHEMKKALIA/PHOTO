import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const COLLECTIONS = [
  {
    id: '1',
    title: 'Lumière Noire',
    subtitle: 'Automne — Hiver 2024',
    description: 'Une ode au mystère et à l\'élégance. Des robes qui capturent la lumière comme des œuvres d\'art.',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=90',
    items: 12,
    color: 'from-purple-900/50',
  },
  {
    id: '2',
    title: 'Or & Nuit',
    subtitle: 'Collection Soirée',
    description: 'L\'alliance du noir profond et de l\'or. Pour les femmes qui osent briller.',
    image: 'https://images.unsplash.com/photo-1566479179817-57d7c3f9b12e?w=900&q=90',
    items: 8,
    color: 'from-amber-900/50',
  },
  {
    id: '3',
    title: 'Power Dressing',
    subtitle: 'Collection Bureau',
    description: 'Taillez votre chemin avec style. Blazers, tailleurs et vestes qui imposent le respect.',
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=900&q=90',
    items: 15,
    color: 'from-slate-900/50',
  },
  {
    id: '4',
    title: 'Printemps Doré',
    subtitle: 'Printemps — Été 2024',
    description: 'La légèreté du champagne, la douceur du satin. Pour les journées qui méritent d\'être fêtées.',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=90',
    items: 20,
    color: 'from-rose-900/50',
  },
  {
    id: '5',
    title: 'Édition Limitée',
    subtitle: 'Pièces Uniques',
    description: '10 créations numérotées. 10 femmes. 10 histoires uniques. Réservé aux initiées.',
    image: 'https://images.unsplash.com/photo-1536243983083-40f2e12be5b5?w=900&q=90',
    items: 10,
    color: 'from-violet-900/50',
    isLimited: true,
  },
  {
    id: '6',
    title: 'Casual Luxe',
    subtitle: 'Everyday Premium',
    description: 'Parce que chaque jour mérite un peu de luxe. Le confort ne sacrifie pas l\'élégance.',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=90',
    items: 25,
    color: 'from-emerald-900/50',
  },
]

export function Collections() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1536243983083-40f2e12be5b5?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-noir-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subtitle text-gold mb-4">Univers MILLA</p>
          <h1 className="font-display text-6xl md:text-7xl text-white mb-6">Nos Collections</h1>
          <div className="gold-divider" />
          <p className="text-white/50 text-base max-w-xl mx-auto mt-6">
            Chaque collection raconte une histoire. Trouvez celle qui résonne avec la vôtre.
          </p>
        </div>
      </div>

      {/* Collections grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden ${col.isLimited ? 'md:col-span-2' : ''}`}
            >
              <Link to={`/boutique`} className="block">
                <div className={`relative ${col.isLimited ? 'aspect-[16/7]' : 'aspect-[3/4]'} overflow-hidden`}>
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${col.color} via-transparent to-transparent opacity-70`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {col.isLimited && (
                    <div className="absolute top-4 left-4 bg-gold text-noir-900 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5">
                      Édition Limitée
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white/50 text-xs tracking-widest uppercase mb-1">{col.subtitle}</p>
                    <h2 className="font-display text-3xl text-white mb-2">{col.title}</h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-4 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {col.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold text-xs">{col.items} pièces</span>
                      <span className="flex items-center gap-2 text-white text-xs tracking-widest uppercase group-hover:text-gold transition-colors">
                        Découvrir <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center border-t border-white/[0.06]">
        <p className="text-white/40 text-sm mb-4">Vous cherchez quelque chose de précis ?</p>
        <Link to="/boutique" className="btn-gold inline-flex">
          Explorer toute la boutique
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
