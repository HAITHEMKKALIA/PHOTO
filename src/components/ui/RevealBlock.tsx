import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealBlockProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale' | 'fade'
  once?: boolean
}

export function RevealBlock({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: 0.9,
      ease: 'power4.out',
    }
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration: 0.9,
      ease: 'power4.out',
      delay,
    }

    switch (direction) {
      case 'up':    fromVars.y = 60;   toVars.y = 0;    break
      case 'left':  fromVars.x = -60;  toVars.x = 0;    break
      case 'right': fromVars.x = 60;   toVars.x = 0;    break
      case 'scale': fromVars.scale = 0.85; toVars.scale = 1; break
    }

    gsap.fromTo(el, fromVars, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    })
  }, [delay, direction, once])

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}

// Staggered children reveal
export function RevealStagger({
  children,
  className = '',
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.children

    gsap.fromTo(items,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8, stagger, delay,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    )
  }, [stagger, delay])

  return <div ref={ref} className={className}>{children}</div>
}
