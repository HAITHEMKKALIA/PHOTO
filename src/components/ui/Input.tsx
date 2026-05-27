import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  suffix?: ReactNode
}

export function Input({ label, error, icon, suffix, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-white/60 text-xs font-body tracking-widest uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'w-full bg-white/[0.04] border border-white/20 text-white placeholder-white/30',
            'px-4 py-3 focus:outline-none focus:border-gold/60 focus:bg-white/[0.06]',
            'transition-all duration-200 font-body text-sm',
            icon && 'pl-10',
            suffix && 'pr-10',
            error && 'border-red-500/50 focus:border-red-400',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
