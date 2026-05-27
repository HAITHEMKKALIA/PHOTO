import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, SlidersHorizontal, Grid3x3, LayoutList, X, ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/shop/ProductCard'
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils'

const CATEGORIES = ['Tous','Robes','Blazers','Sacs','Jupes','Tops','Pantalons','Vestes']
const SIZES = ['XS','S','M','L','XL','XXL','Unique']
const COLORS = ['Noir','Or','Blanc','Rouge','Bordeaux','Champagne','Nude','Marine']
const SORT_OPTIONS = [
  { value: 'featured', label: 'Mis en avant' },
  { value: 'new', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name', label: 'Nom A-Z' },
]

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [grid, setGrid] = useState<2 | 3 | 4>(3)
  const [sort, setSort] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const q = searchParams.get('q') || ''
  const filterNew = searchParams.get('filter') === 'new'

  useEffect(() => {
    if (filterNew) setSort('new')
  }, [filterNew])

  const filteredProducts = useMemo(() => {
    let products = [...DEMO_PRODUCTS] as any[]

    if (q) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase()) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q.toLowerCase()))
      )
    }

    if (filterNew) products = products.filter((p) => p.is_new)

    if (selectedSizes.length > 0) {
      products = products.filter((p) =>
        p.sizes.some((s: string) => selectedSizes.includes(s))
      )
    }

    if (selectedColors.length > 0) {
      products = products.filter((p) =>
        p.colors.some((c: string) => selectedColors.some((sc) => c.includes(sc)))
      )
    }

    products = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sort) {
      case 'new':       return products.filter((p) => p.is_new)
      case 'price-asc': return [...products].sort((a, b) => a.price - b.price)
      case 'price-desc':return [...products].sort((a, b) => b.price - a.price)
      case 'name':      return [...products].sort((a, b) => a.name.localeCompare(b.name))
      default:          return products.filter((p) => p.is_featured).concat(products.filter((p) => !p.is_featured))
    }
  }, [q, filterNew, selectedSizes, selectedColors, priceRange, sort])

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  const toggleColor = (c: string) =>
    setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])

  const clearFilters = () => {
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, 1000])
    setSelectedCategory('Tous')
    setSearchParams({})
  }

  const activeFiltersCount = selectedSizes.length + selectedColors.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-noir-800/50 border-b border-white/[0.06] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subtitle text-gold mb-3">Notre Boutique</p>
          <h1 className="font-display text-5xl text-white mb-4">
            {q ? `Résultats pour "${q}"` : filterNew ? 'Nouvelles Arrivées' : 'Toute la Collection'}
          </h1>
          <p className="text-white/40 text-sm">
            {filteredProducts.length} pièce{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Categories tabs */}
      <div className="border-b border-white/[0.06] bg-noir-900/80 sticky top-20 z-20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-xs tracking-widest uppercase whitespace-nowrap transition-all font-body ${
                  selectedCategory === cat
                    ? 'bg-gold text-noir-900 font-semibold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-gold/50 text-white/60 hover:text-white text-sm transition-all"
            >
              <Filter className="w-4 h-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="bg-gold text-noir-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-white/40 hover:text-white text-xs flex items-center gap-1">
                <X className="w-3 h-3" /> Réinitialiser
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white/[0.04] border border-white/20 text-white text-sm px-4 py-2 pr-8 focus:outline-none focus:border-gold/50 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-noir-700">{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            {/* Grid toggle */}
            <div className="hidden sm:flex border border-white/20">
              {([2, 3, 4] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGrid(g)}
                  className={`p-2 transition-colors ${grid === g ? 'bg-gold/10 text-gold' : 'text-white/30 hover:text-white'}`}
                >
                  {g === 2 ? <LayoutList className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 280 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-[280px] space-y-8 pr-6 border-r border-white/[0.06]">
                  {/* Price */}
                  <div>
                    <h3 className="text-white/80 text-xs tracking-widest uppercase mb-4">Prix</h3>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min={0}
                        max={1000}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                        className="w-full accent-gold"
                      />
                      <div className="flex justify-between text-white/40 text-xs">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h3 className="text-white/80 text-xs tracking-widest uppercase mb-4">Tailles</h3>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSize(s)}
                          className={`px-3 py-1.5 text-xs border transition-all ${
                            selectedSizes.includes(s)
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-white/20 text-white/50 hover:border-white/40'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h3 className="text-white/80 text-xs tracking-widest uppercase mb-4">Couleurs</h3>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleColor(c)}
                          className={`px-3 py-1.5 text-xs border transition-all ${
                            selectedColors.includes(c)
                              ? 'border-gold text-gold'
                              : 'border-white/20 text-white/50 hover:border-white/40'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-2xl text-white mb-3">Aucun résultat</p>
                <p className="text-white/40 text-sm mb-6">Essayez d'ajuster vos filtres</p>
                <button onClick={clearFilters} className="btn-outline-gold inline-flex">
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  grid === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : grid === 3
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
