import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [variant, setVariant] = useState<'default' | 'hover' | 'click' | 'text'>('default')
  const [label, setLabel] = useState('')

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX  = mouseX
    let ringY  = mouseY

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.04, ease: 'none' })
    }

    const onDown  = () => setVariant('click')
    const onUp    = () => setVariant(v => v === 'click' ? 'default' : v)

    const onEnterLink = (e: MouseEvent) => {
      const t = e.currentTarget as HTMLElement
      setVariant('hover')
      setLabel(t.dataset.cursorLabel || '')
    }
    const onLeaveLink = () => { setVariant('default'); setLabel('') }

    const onEnterText = () => setVariant('text')
    const onLeaveText = () => setVariant('default')

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    const links = document.querySelectorAll('a, button, [data-cursor]')
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink as EventListener)
      el.addEventListener('mouseleave', onLeaveLink)
    })
    const texts = document.querySelectorAll('input, textarea')
    texts.forEach(el => {
      el.addEventListener('mouseenter', onEnterText)
      el.addEventListener('mouseleave', onLeaveText)
    })

    // Ring follows with lag
    let raf: number
    const follow = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      gsap.set(ring, { x: ringX, y: ringY })
      raf = requestAnimationFrame(follow)
    }
    follow()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      links.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink as EventListener)
        el.removeEventListener('mouseleave', onLeaveLink)
      })
      cancelAnimationFrame(raf)
    }
  }, [])

  const ringSize = variant === 'hover' ? 64 : variant === 'click' ? 20 : variant === 'text' ? 4 : 36
  const ringOpacity = variant === 'text' ? 0.2 : 1
  const dotSize = variant === 'hover' ? 0 : variant === 'text' ? 18 : 5

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <motion.div
          animate={{ width: dotSize, height: dotSize, opacity: variant === 'hover' ? 0 : 1 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full bg-white"
        />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <motion.div
          animate={{
            width:  ringSize,
            height: ringSize,
            opacity: ringOpacity,
            backgroundColor: variant === 'hover' ? 'rgba(201,168,76,0.15)' : 'transparent',
            borderColor: variant === 'hover' ? '#c9a84c' : 'rgba(255,255,255,0.5)',
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full border flex items-center justify-center"
        >
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[9px] text-gold tracking-widest uppercase font-bold whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      </div>
    </>
  )
}
