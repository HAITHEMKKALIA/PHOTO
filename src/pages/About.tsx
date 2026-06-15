import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function About() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1536243983083-40f2e12be5b5?w=1600&q=90"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir-900/60 via-noir-900/40 to-noir-900" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="section-subtitle text-gold mb-4">Notre Histoire</p>
            <h1 className="font-display text-6xl md:text-7xl text-white">
              L'art de la<br /><span className="gold-text">mode féminine</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <AnimatedSection>
            <p className="section-subtitle text-gold mb-4">Notre vision</p>
            <h2 className="font-display text-4xl text-white mb-6">
              MILLA, c'est plus qu'une boutique
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              Fondée par des passionnées de mode, MILLA BOUTIQUE est née d'une conviction simple :
              chaque femme mérite de se sentir extraordinaire dans ce qu'elle porte.
            </p>
            <p className="text-white/50 leading-relaxed mb-6">
              Nous sélectionnons avec soin des créations qui allient élégance intemporelle et
              modernité audacieuse. Chaque pièce de notre collection est choisie pour sa qualité,
              son originalité et sa capacité à mettre en valeur la femme qui la porte.
            </p>
            <p className="text-white/50 leading-relaxed">
              MILLA, c'est une invitation à embrasser votre style unique, à oser l'excellence
              et à célébrer la féminité dans toute sa diversité.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=700&q=90"
                alt="À propos MILLA"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/10 border border-gold/20 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-display text-3xl gold-text">5</p>
                  <p className="text-white/40 text-xs">ans d'excellence</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Values */}
        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <p className="section-subtitle text-gold mb-4">Ce qui nous définit</p>
            <h2 className="font-display text-4xl text-white">Nos valeurs</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Qualité irréprochable',
                desc: 'Chaque tissu, chaque couture est examinée. Nous ne proposons que ce que nous porterions nous-mêmes.',
                icon: '◆',
              },
              {
                title: 'Style intemporel',
                desc: 'Au-delà des tendances, nous créons des pièces qui traversent les saisons et gardent leur éclat.',
                icon: '◈',
              },
              {
                title: 'Femme au centre',
                desc: 'Tout est pensé pour la femme réelle : des tailles inclusives, des coupes flatteuses, un service personnalisé.',
                icon: '◉',
              },
            ].map((value) => (
              <div key={value.title} className="glass-card p-8 text-center">
                <div className="text-gold text-4xl mb-4">{value.icon}</div>
                <h3 className="font-display text-xl text-white mb-3">{value.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Numbers */}
        <AnimatedSection className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '5 000+', label: 'Clientes fidèles' },
              { num: '200+',   label: 'Créations uniques' },
              { num: '98%',    label: 'Satisfaction client' },
              { num: '5 ★',    label: 'Note moyenne' },
            ].map(({ num, label }) => (
              <div key={label} className="glass-card p-6 text-center">
                <p className="font-display text-4xl gold-text mb-2">{num}</p>
                <p className="text-white/40 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection>
          <div className="text-center py-12 border-t border-white/[0.06]">
            <p className="section-subtitle text-gold mb-4">Rejoignez l'aventure</p>
            <h2 className="font-display text-4xl text-white mb-6">Prête à écrire votre histoire ?</h2>
            <Link to="/boutique" className="btn-gold inline-flex">
              Découvrir la boutique
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
