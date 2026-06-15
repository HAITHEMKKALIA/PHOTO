import { useRef, useEffect, Suspense, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { Float, Stars, useTexture, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { KineticText, ScrambleText } from '@/components/ui/KineticText'
import { Magnetic } from '@/components/ui/Magnetic'

// ─── Distortion Shader Material ───────────────────────────────────────────────
const DistortMaterial = shaderMaterial(
  { uTime: 0, uMouse: new THREE.Vector2(0.5, 0.5), uTexture: null, uDistort: 0.04 },
  /* vertex */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform float uTime;
    void main() {
      vUv = uv;
      vNormal = normal;
      vec3 p = position;
      p.z += sin(p.x * 4.0 + uTime * 0.6) * 0.05;
      p.z += cos(p.y * 3.0 + uTime * 0.5) * 0.05;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `,
  /* fragment */ `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uDistort;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      float d = length(uv - uMouse);
      float wave = sin(uv.x * 12.0 + uTime * 0.8) * uDistort;
      wave *= smoothstep(0.8, 0.0, d);
      uv.y += wave;
      uv.x += sin(uv.y * 8.0 + uTime * 0.6) * uDistort * 0.5;
      vec4 tex = texture2D(uTexture, uv);
      // Vignette
      float vign = 1.0 - smoothstep(0.3, 1.0, length(vUv - 0.5) * 1.4);
      gl_FragColor = vec4(tex.rgb * vign, tex.a);
    }
  `
)
extend({ DistortMaterial })

declare global {
  namespace JSX { interface IntrinsicElements { distortMaterial: any } }
}

// ─── Distorted image plane ─────────────────────────────────────────────────────
function DistortPlane({ url }: { url: string }) {
  const matRef = useRef<any>(null)
  const tex = useTexture(url)
  const { mouse } = useThree()

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uTime  = clock.elapsedTime
    matRef.current.uMouse = new THREE.Vector2(
      THREE.MathUtils.lerp(matRef.current.uMouse.x, (mouse.x + 1) / 2, 0.05),
      THREE.MathUtils.lerp(matRef.current.uMouse.y, (mouse.y + 1) / 2, 0.05)
    )
  })

  return (
    <mesh>
      <planeGeometry args={[3.6, 4.8, 32, 32]} />
      <distortMaterial ref={matRef} uTexture={tex} uDistort={0.04} transparent />
    </mesh>
  )
}

// ─── Gold dust particles ───────────────────────────────────────────────────────
function GoldDust() {
  const ref = useRef<THREE.Points>(null)
  const count = 200
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      sizes[i] = Math.random() * 0.04 + 0.01
    }
    return { positions, sizes }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.015
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.setY(i, pos.getY(i) + Math.sin(clock.elapsedTime + i) * 0.001)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04} color="#e8d5a3" transparent opacity={0.7}
        sizeAttenuation blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Floating geometric shapes ─────────────────────────────────────────────────
function FloatingShapes() {
  return (
    <>
      <Float speed={1.2} floatIntensity={0.8} rotationIntensity={0.4}>
        <mesh position={[3.5, 1.5, -2]}>
          <torusGeometry args={[0.6, 0.02, 8, 64]} />
          <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={0.5} metalness={1} roughness={0} />
        </mesh>
      </Float>
      <Float speed={0.9} floatIntensity={0.5} rotationIntensity={0.6}>
        <mesh position={[-3.8, -1, -3]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#e8d5a3" emissive="#c9a84c" emissiveIntensity={0.3} metalness={0.8} roughness={0.1} />
        </mesh>
      </Float>
      <Float speed={1.5} floatIntensity={1} rotationIntensity={0.3}>
        <mesh position={[4.5, -2, -1.5]}>
          <torusKnotGeometry args={[0.2, 0.06, 64, 8]} />
          <meshStandardMaterial color="#c9a84c" emissive="#8b6914" emissiveIntensity={0.4} metalness={1} roughness={0} />
        </mesh>
      </Float>
    </>
  )
}

function CameraParallax() {
  const { camera, mouse } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.03
    camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })
  return null
}

const SLIDES = [
  {
    title: ['L\'Art de', 'la Nuit'],
    sub: 'Collection Automne — Hiver 2026',
    desc: 'Des créations qui capturent l\'essence du luxe contemporain.',
    url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1600&q=90',
    cta: 'Voir la collection',
    link: '/collections',
  },
  {
    title: ['Séquins &', 'Lumière'],
    sub: 'Édition Limitée — 20 pièces',
    desc: 'Pour la femme qui ose briller dans toute sa splendeur.',
    url: 'https://images.unsplash.com/photo-1566479179817-57d7c3f9b12e?w=1600&q=90',
    cta: 'Découvrir',
    link: '/boutique?filter=new',
  },
  {
    title: ['Élégance', 'Absolue'],
    sub: 'Pièces Signature — MILLA',
    desc: 'L\'intemporel réinventé pour la femme d\'aujourd\'hui.',
    url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1600&q=90',
    cta: 'Explorer',
    link: '/boutique',
  },
]

export function HeroSection() {
  const [slide, setSlide]   = useState(0)
  const [prevSlide, setPrev] = useState<number | null>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const lineRef  = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(() => {
      setPrev(slide)
      setSlide((s) => (s + 1) % SLIDES.length)
    }, 6000)
    return () => clearTimeout(t)
  }, [slide])

  // GSAP title animation on slide change
  useEffect(() => {
    if (!titleRef.current) return
    gsap.fromTo(
      titleRef.current.querySelectorAll('.hero-line'),
      { y: 80, opacity: 0, rotateX: -60, filter: 'blur(8px)' },
      { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 1, stagger: 0.15, ease: 'power4.out', delay: 0.1 }
    )
    gsap.fromTo(
      titleRef.current.querySelectorAll('.hero-meta'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
    )
  }, [slide])

  // Progress bar
  useEffect(() => {
    const bar = progressRef.current
    if (!bar) return
    gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: 'none' })
  }, [slide])

  const current = SLIDES[slide]

  const goTo = (i: number) => { setPrev(slide); setSlide(i) }

  return (
    <section className="relative h-screen overflow-hidden bg-noir-900" style={{ perspective: '1200px' }}>

      {/* ── BG images with crossfade ── */}
      {SLIDES.map((s, i) => (
        <AnimatePresence key={i}>
          {i === slide && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={s.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-noir-900/95 via-noir-900/60 to-noir-900/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-900/90 via-transparent to-noir-900/20" />
              {/* Grain overlay */}
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '180px' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* ── 3D Canvas ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[4, 4, 4]} color="#c9a84c" intensity={2.5} />
            <pointLight position={[-4, -2, 2]} color="#6b21a8" intensity={1.5} />
            <Stars radius={60} depth={50} count={2000} factor={1.5} saturation={0} fade speed={0.3} />
            <GoldDust />
            <FloatingShapes />
            <CameraParallax />
          </Canvas>
        </Suspense>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="max-w-2xl" ref={titleRef} style={{ perspective: '800px' }}>

            {/* Slide counter */}
            <div className="hero-meta flex items-center gap-3 mb-8">
              <span className="text-gold font-mono text-xs">
                {String(slide + 1).padStart(2, '0')}
              </span>
              <div className="w-12 h-px bg-white/20">
                <div ref={progressRef} className="h-full bg-gold origin-left" style={{ transform: 'scaleX(0)' }} />
              </div>
              <span className="text-white/30 font-mono text-xs">
                {String(SLIDES.length).padStart(2, '0')}
              </span>
            </div>

            {/* Subtitle */}
            <p className="hero-meta text-white/40 text-xs tracking-[0.4em] uppercase mb-6">
              {current.sub}
            </p>

            {/* Title lines */}
            <div className="overflow-hidden mb-2" style={{ transformStyle: 'preserve-3d' }}>
              <h1 className="hero-line font-display text-[clamp(3.5rem,9vw,7rem)] leading-[0.88] text-white font-black">
                {current.title[0]}
              </h1>
            </div>
            <div className="overflow-hidden mb-10" style={{ transformStyle: 'preserve-3d' }}>
              <h1 className="hero-line font-display text-[clamp(3.5rem,9vw,7rem)] leading-[0.88] gold-text font-black text-shadow-gold">
                {current.title[1]}
              </h1>
            </div>

            {/* Desc */}
            <p className="hero-meta text-white/50 text-base leading-relaxed mb-10 max-w-md">
              {current.desc}
            </p>

            {/* CTAs */}
            <div className="hero-meta flex flex-wrap gap-4 items-center">
              <Magnetic strength={0.25}>
                <Link to={current.link} className="btn-gold group relative overflow-hidden" data-cursor-label="Voir">
                  <span className="relative z-10 flex items-center gap-2">
                    {current.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </Magnetic>
              <Link to="/a-propos" className="text-white/50 hover:text-white text-sm tracking-widest uppercase transition-colors flex items-center gap-2 group">
                Notre histoire
                <span className="w-8 h-px bg-white/30 group-hover:bg-gold group-hover:w-12 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide dots ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-none ${
              i === slide ? 'w-10 h-0.5 bg-gold' : 'w-3 h-0.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* ── Vertical scroll hint ── */}
      <div className="absolute bottom-10 right-8 z-10 flex flex-col items-center gap-3">
        <div className="w-px h-14 relative overflow-hidden bg-white/10">
          <motion.div
            className="absolute top-0 w-full bg-gold"
            animate={{ height: ['0%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-white/20 text-[9px] tracking-[0.4em] uppercase writing-vertical">Scroll</span>
      </div>

      {/* ── Floating brand label ── */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 z-10 hidden xl:block">
        <div className="flex flex-col items-center gap-2">
          {['M','I','L','L','A'].map((c, i) => (
            <motion.span
              key={i}
              className="font-display text-white/10 text-xs font-bold tracking-[0.3em]"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
