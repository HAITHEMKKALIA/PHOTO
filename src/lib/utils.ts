import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '…'
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending:          'En attente',
  confirmed:        'Confirmée',
  preparing:        'En préparation',
  shipped:          'Expédiée',
  out_for_delivery: 'En livraison',
  delivered:        'Livrée',
  cancelled:        'Annulée',
  refunded:         'Remboursée',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending:          'text-yellow-400 bg-yellow-400/10',
  confirmed:        'text-blue-400 bg-blue-400/10',
  preparing:        'text-orange-400 bg-orange-400/10',
  shipped:          'text-purple-400 bg-purple-400/10',
  out_for_delivery: 'text-cyan-400 bg-cyan-400/10',
  delivered:        'text-green-400 bg-green-400/10',
  cancelled:        'text-red-400 bg-red-400/10',
  refunded:         'text-gray-400 bg-gray-400/10',
}

export const DEMO_PRODUCTS = [
  {
    id: '1', name: 'Robe Étoile Noire', slug: 'robe-etoile-noire',
    description: 'Une robe élégante en soie noire avec des détails brodés dorés. Parfaite pour les soirées de gala.',
    price: 420, compare_price: 580,
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    ],
    sizes: ['XS','S','M','L','XL'], colors: ['Noir','Bordeaux'],
    stock: 12, is_featured: true, is_new: true, tags: ['robe','soirée','luxe'],
    created_at: '2024-01-01',
  },
  {
    id: '2', name: 'Blazer Or & Nuit', slug: 'blazer-or-nuit',
    description: 'Blazer structuré avec des boutons dorés, coupe cintrée. Le power dressing au féminin.',
    price: 285, compare_price: 390,
    images: [
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4e31?w=800&q=80',
    ],
    sizes: ['XS','S','M','L'], colors: ['Noir','Ivoire'],
    stock: 8, is_featured: true, is_new: false, tags: ['blazer','business','luxe'],
    created_at: '2024-01-02',
  },
  {
    id: '3', name: 'Sac Velours Minuit', slug: 'sac-velours-minuit',
    description: 'Sac en velours profond avec chaîne dorée. Un accessoire iconique pour toutes les occasions.',
    price: 195, compare_price: undefined,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    ],
    sizes: ['Unique'], colors: ['Noir','Bordeaux','Caramel'],
    stock: 20, is_featured: true, is_new: true, tags: ['sac','accessoire','velours'],
    created_at: '2024-01-03',
  },
  {
    id: '4', name: 'Jupe Plissée Lumière', slug: 'jupe-plissee-lumiere',
    description: 'Jupe mi-longue plissée en satin champagne, fluide et raffinée.',
    price: 165, compare_price: 210,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4e31?w=800&q=80',
    ],
    sizes: ['XS','S','M','L','XL'], colors: ['Champagne','Noir','Rose poudré'],
    stock: 15, is_featured: false, is_new: true, tags: ['jupe','satin','élégant'],
    created_at: '2024-01-04',
  },
  {
    id: '5', name: 'Perfecto Cuir Doré', slug: 'perfecto-cuir-dore',
    description: 'Perfecto en cuir véritable avec détails dorés. L\'alliance parfaite du rock et du luxe.',
    price: 680, compare_price: 850,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
    ],
    sizes: ['XS','S','M','L'], colors: ['Noir','Cognac'],
    stock: 5, is_featured: true, is_new: false, tags: ['veste','cuir','luxe'],
    created_at: '2024-01-05',
  },
  {
    id: '6', name: 'Robe Sequins Galaxie', slug: 'robe-sequins-galaxie',
    description: 'Robe à sequins noirs et dorés, coupe asymétrique. Pour briller sous tous les projecteurs.',
    price: 520, compare_price: 690,
    images: [
      'https://images.unsplash.com/photo-1566479179817-57d7c3f9b12e?w=800&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
    ],
    sizes: ['XS','S','M','L'], colors: ['Noir/Or','Argent'],
    stock: 7, is_featured: true, is_new: true, tags: ['robe','sequins','gala'],
    created_at: '2024-01-06',
  },
  {
    id: '7', name: 'Top Dentelle Éternel', slug: 'top-dentelle-eternel',
    description: 'Top en dentelle française avec doublure nude. Raffinement et sensualité.',
    price: 145, compare_price: 195,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    ],
    sizes: ['XS','S','M','L','XL'], colors: ['Noir','Ivoire','Nude'],
    stock: 18, is_featured: false, is_new: false, tags: ['top','dentelle','élégant'],
    created_at: '2024-01-07',
  },
  {
    id: '8', name: 'Pantalon Palazzo Nuit', slug: 'pantalon-palazzo-nuit',
    description: 'Pantalon palazzo en crêpe noir, taille haute, jambes larges. Élégance absolue.',
    price: 220, compare_price: 280,
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
      'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=800&q=80',
    ],
    sizes: ['XS','S','M','L','XL'], colors: ['Noir','Marine','Bordeaux'],
    stock: 14, is_featured: false, is_new: false, tags: ['pantalon','palazzo','soirée'],
    created_at: '2024-01-08',
  },
]
