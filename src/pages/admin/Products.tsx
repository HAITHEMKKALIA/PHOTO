import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, Image } from 'lucide-react'
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import toast from 'react-hot-toast'

export function AdminProducts() {
  const [products, setProducts] = useState([...DEMO_PRODUCTS] as any[])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<any | null>(null)
  const [form, setForm] = useState({
    name: '', price: '', compare_price: '', description: '',
    sizes: 'XS,S,M,L,XL', colors: 'Noir', stock: '',
    is_featured: false, is_new: false, images: '',
  })

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditProduct(null)
    setForm({ name: '', price: '', compare_price: '', description: '', sizes: 'XS,S,M,L,XL', colors: 'Noir', stock: '', is_featured: false, is_new: false, images: '' })
    setModalOpen(true)
  }

  const openEdit = (product: any) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      price: String(product.price),
      compare_price: String(product.compare_price || ''),
      description: product.description,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
      stock: String(product.stock),
      is_featured: product.is_featured,
      is_new: product.is_new,
      images: product.images.join(','),
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Nom et prix requis'); return }
    const newProduct = {
      id: editProduct?.id || crypto.randomUUID(),
      name: form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, '-'),
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : undefined,
      description: form.description,
      sizes: form.sizes.split(',').map((s) => s.trim()),
      colors: form.colors.split(',').map((c) => c.trim()),
      stock: Number(form.stock) || 0,
      is_featured: form.is_featured,
      is_new: form.is_new,
      images: form.images ? form.images.split(',').map((i) => i.trim()) : ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80'],
      tags: [],
      created_at: new Date().toISOString(),
    }
    if (editProduct) {
      setProducts((prev) => prev.map((p) => p.id === editProduct.id ? newProduct : p))
      toast.success('Produit mis à jour')
    } else {
      setProducts((prev) => [...prev, newProduct])
      toast.success('Produit créé')
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast.success('Produit supprimé')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white">Produits ({products.length})</h1>
        <button onClick={openAdd} className="btn-gold py-2 px-5 text-xs flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit..." className="input-gold pl-10 w-full sm:w-80" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-noir-600">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {product.is_new && <span className="badge-new">Nouveau</span>}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => openEdit(product)} className="w-9 h-9 bg-gold flex items-center justify-center hover:bg-gold-light transition-colors">
                  <Edit className="w-4 h-4 text-noir-900" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="w-9 h-9 bg-red-600 flex items-center justify-center hover:bg-red-500 transition-colors">
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-white text-sm font-semibold truncate">{product.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gold text-sm font-bold">{formatPrice(product.price)}</span>
                <span className={`text-xs ${product.stock > 5 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editProduct ? 'Modifier le produit' : 'Nouveau produit'} size="lg">
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Nom *</label>
              <input className="input-gold" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Prix (€) *</label>
              <input type="number" className="input-gold" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Prix barré (€)</label>
              <input type="number" className="input-gold" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} />
            </div>
            <div>
              <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Stock</label>
              <input type="number" className="input-gold" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div>
              <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Tailles (virgules)</label>
              <input className="input-gold" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="XS,S,M,L,XL" />
            </div>
            <div>
              <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Couleurs (virgules)</label>
              <input className="input-gold" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Noir,Blanc" />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Description</label>
            <textarea className="input-gold min-h-[100px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">URLs images (virgules)</label>
            <input className="input-gold" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-gold" />
              <span className="text-white/60 text-sm">Mis en avant</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="accent-gold" />
              <span className="text-white/60 text-sm">Nouveau</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost border border-white/20 flex-1">Annuler</button>
            <button onClick={handleSave} className="btn-gold flex-1">Sauvegarder</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
