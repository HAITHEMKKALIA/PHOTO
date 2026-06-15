import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface KineticTextProps {
  text: string
  className?: string
  delay?: number
  trigger?: 'scroll' | 'mount'
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  stagger?: number
  gold?: boolean
}

export function KineticText({
  text,
  className = '',
  delay = 0,
  trigger = 'mount',
  tag: Tag = 'span',
  stagger = 0.025,
  gold = false,
}: KineticTextProps) {
  const ref = useRef<HTMLElement>(null)
  const chars = text.split('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = el.querySelectorAll('.char')

    if (trigger === 'scroll') {
      gsap.fromTo(spans,
        { y: '100%', opacity: 0, rotateX: -90, filter: 'blur(4px)' },
        {
          y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)',
          duration: 0.7, stagger, delay,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      )
    } else {
      gsap.fromTo(spans,
        { y: '120%', opacity: 0, rotateX: -90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger, delay, ease: 'power4.out' }
      )
    }
  }, [delay, stagger, trigger])

  return (
    <Tag
      ref={ref as any}
      className={`overflow-hidden inline-block ${className}`}
      style={{ perspective: '1000px' }}
    >
      <span className="inline-block" aria-label={text}>
        {chars.map((char, i) => (
          <span
            key={i}
            className={`char inline-block ${gold ? 'gold-text' : ''}`}
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            aria-hidden
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </Tag>
  )
}

// Scramble text effect
interface ScrambleProps {
  text: string
  className?: string
  active?: boolean
}

export function ScrambleText({ text, className = '', active = true }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'

  useEffect(() => {
    const el = ref.current
    if (!el || !active) return
    let iteration = 0
    const interval = setInterval(() => {
      el.innerText = text
        .split('')
        .map((char, idx) => {
          if (idx < iteration) return char
          if (char === ' ') return ' '
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')
      if (iteration >= text.length) clearInterval(interval)
      iteration += 1 / 3
    }, 30)
    return () => clearInterval(interval)
  }, [text, active])

  return <span ref={ref} className={className}>{text}</span>
}
