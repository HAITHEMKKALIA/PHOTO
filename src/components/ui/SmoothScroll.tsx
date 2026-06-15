import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function getLenis() { return lenis }

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis!.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    gsap.ticker.add((time) => { lenis!.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis?.destroy()
      lenis = null
    }
  }, [])

  return <>{children}</>
}
