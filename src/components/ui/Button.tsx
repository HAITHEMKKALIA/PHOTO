import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'gold',
  size = 'md',
  isLoading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'relative inline-flex items-center justify-center gap-2 font-body font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const variants = {
    gold:    'bg-gold-gradient text-noir-900 hover:shadow-gold-lg hover:scale-[1.02]',
    outline: 'border border-gold text-gold hover:bg-gold hover:text-noir-900',
    ghost:   'text-white/70 hover:text-white hover:bg-white/5',
    danger:  'bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30',
  }

  const sizes = {
    sm: 'px-5 py-2 text-xs',
    md: 'px-8 py-3 text-xs',
    lg: 'px-10 py-4 text-sm',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
