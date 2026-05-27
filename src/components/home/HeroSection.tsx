import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import gsap from 'gsap'

function GoldenOrb({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#c9a84c"
            emissive="#8b5e1a"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            distort={0.35}
            speed={1.5}
          />
        </Sphere>
      </mesh>
    </Float>
  )
}

function FloatingRing({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.1
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
  })
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <torusGeometry args={[1.5, 0.03, 16, 100]} />
      <meshStandardMaterial
        color="#c9a84c"
        emissive="#c9a84c"
        emissiveIntensity={0.4}
        metalness={1}
        roughness={0}
      />
    </mesh>
  )
}

function DiamondParticles() {
  const ref = useRef<THREE.Points>(null)
  const count = 120
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.rotation.x = state.clock.elapsedTime * 0.01
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#e8d5a3" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function CameraRig() {
  const { camera } = useThree()
  useFrame((state) => {
    camera.position.x += (state.mouse.x * 0.5 - camera.position.x) * 0.02
    camera.position.y += (state.mouse.y * 0.3 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Scene3D() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 8, 20]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} color="#c9a84c" intensity={2} />
      <pointLight position={[-5, -3, -5]} color="#4a2f8f" intensity={1.5} />
      <spotLight position={[0, 8, 0]} color="#e8d5a3" intensity={1} angle={0.4} penumbra={1} />
      <Stars radius={50} depth={50} count={3000} factor={2} saturation={0} fade speed={0.5} />
      <DiamondParticles />
      <GoldenOrb position={[3, 0, -2]} scale={1.2} />
      <GoldenOrb position={[-3.5, 1, -3]} scale={0.7} />
      <GoldenOrb position={[0, -2, -4]} scale={0.4} />
      <FloatingRing position={[0, 0, -3]} rotation={[0.4, 0, 0.3]} />
      <FloatingRing position={[-2, 1.5, -4]} rotation={[1, 0.5, 0]} />
      <Environment preset="night" />
      <CameraRig />
    </>
  )
}

const HERO_ITEMS = [
  {
    title: 'Collection',
    highlight: 'Lumière Noire',
    subtitle: 'Automne — Hiver 2024',
    description: 'Des pièces qui capturent l\'essence du luxe contemporain. Pour la femme qui définit ses propres règles.',
    cta: 'Découvrir la Collection',
    ctaLink: '/collections',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200&q=90',
  },
  {
    title: 'Nouvelle',
    highlight: 'Arrivée',
    subtitle: 'Édition Limitée',
    description: 'Blazers structurés, robes à sequins, accessoires iconiques. La mode comme art de vivre.',
    cta: 'Voir les Nouveautés',
    ctaLink: '/boutique?filter=new',
    image: 'https://images.unsplash.com/photo-1566479179817-57d7c3f9b12e?w=1200&q=90',
  },
  {
    title: 'Style',
    highlight: 'Intemporel',
    subtitle: 'Pièces Signature',
    description: 'Chaque création est pensée pour durer au-delà des saisons. Investissez dans l\'excellence.',
    cta: 'Explorer la Boutique',
    ctaLink: '/boutique',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=90',
  },
]

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_ITEMS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!textRef.current) return
    gsap.fromTo(
      textRef.current.querySelectorAll('.hero-animate'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    )
  }, [activeSlide])

  const current = HERO_ITEMS[activeSlide]

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background image with parallax */}
      {HERO_ITEMS.map((item, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === activeSlide ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <img
            src={item.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-noir-900/95 via-noir-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-900/80 via-transparent to-transparent" />
        </motion.div>
      ))}

      {/* 3D Canvas overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Scene3D />
          </Canvas>
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div ref={textRef} className="max-w-2xl">
            <motion.div
              key={`sub-${activeSlide}`}
              className="hero-animate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-subtitle text-gold/80 mb-4 inline-block">
                {current.subtitle}
              </span>
            </motion.div>

            <motion.h1
              key={`title-${activeSlide}`}
              className="hero-animate font-display text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {current.title}
            </motion.h1>
            <motion.h1
              key={`highlight-${activeSlide}`}
              className="hero-animate font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 gold-text text-shadow-gold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {current.highlight}
            </motion.h1>

            <motion.p
              key={`desc-${activeSlide}`}
              className="hero-animate text-white/60 text-lg leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {current.description}
            </motion.p>

            <motion.div
              key={`cta-${activeSlide}`}
              className="hero-animate flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to={current.ctaLink} className="btn-gold group">
                {current.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/a-propos" className="btn-outline-gold group">
                <Play className="w-4 h-4" />
                Notre histoire
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`transition-all duration-500 ${
              i === activeSlide
                ? 'w-10 h-1 bg-gold'
                : 'w-4 h-1 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-8 z-10 flex flex-col items-center gap-2">
        <div className="w-px h-16 bg-gradient-to-b from-gold/60 to-transparent" />
        <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase rotate-90 origin-center mt-4">
          Scroll
        </span>
      </div>
    </section>
  )
}
