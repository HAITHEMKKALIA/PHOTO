import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={cn('relative', sizes[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[200] bg-noir-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border border-gold/20 animate-ping absolute inset-0" />
          <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center">
            <span className="font-display text-xl text-gold">M</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
