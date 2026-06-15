import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import toast from 'react-hot-toast'

// Demo credentials:
// Customer:  demo@milla.fr / demo1234
// Admin:     admin@milla.fr / admin1234

const DEMO_USERS = [
  {
    id: 'user-1',
    email: 'demo@milla.fr',
    password: 'demo1234',
    full_name: 'Sophie Martin',
    role: 'customer' as const,
    phone: '+33 6 12 34 56 78',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'admin-1',
    email: 'admin@milla.fr',
    password: 'admin1234',
    full_name: 'Admin MILLA',
    role: 'admin' as const,
    phone: '+33 1 23 45 67 89',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

export function Login() {
  const navigate = useNavigate()
  const { setProfile } = useAuthStore()
  const addNotification = useNotificationStore((s) => s.addNotification)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const user = DEMO_USERS.find((u) => u.email === form.email && u.password === form.password)
    if (user) {
      const { password, ...profile } = user
      setProfile(profile)
      addNotification({
        user_id: profile.id,
        title: 'Connexion réussie',
        message: `Bienvenue, ${profile.full_name.split(' ')[0]} !`,
        type: 'system',
      })
      toast.success(`Bienvenue ${profile.full_name.split(' ')[0]} !`)
      navigate(profile.role === 'admin' ? '/admin' : '/compte')
    } else {
      toast.error('Email ou mot de passe incorrect')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (regForm.password !== regForm.confirm) { toast.error('Les mots de passe ne correspondent pas'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const newProfile = {
      id: crypto.randomUUID(),
      email: regForm.email,
      full_name: regForm.name,
      role: 'customer' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setProfile(newProfile)
    toast.success('Compte créé avec succès !')
    navigate('/compte')
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Left — Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=90"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-noir-900" />
        <div className="absolute bottom-16 left-12">
          <span className="font-display text-4xl gold-text">MILLA</span>
          <p className="text-white/50 text-sm mt-2">Votre univers mode exclusif</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-12">
            <span className="font-display text-3xl gold-text">MILLA BOUTIQUE</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mb-10 border-b border-white/10">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 pb-4 text-sm tracking-widest uppercase border-b-2 transition-all ${
                !isRegister ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 pb-4 text-sm tracking-widest uppercase border-b-2 transition-all ${
                isRegister ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {!isRegister ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs tracking-widest uppercase">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="input-gold pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs tracking-widest uppercase">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-gold pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" className="text-gold/70 hover:text-gold text-xs transition-colors">
                  Mot de passe oublié ?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full group"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-noir-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Se connecter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              {/* Demo credentials */}
              <div className="border border-white/10 p-4 bg-white/[0.02]">
                <p className="text-white/40 text-xs mb-2 tracking-widest uppercase">Démo</p>
                <div className="space-y-1 text-xs text-white/30">
                  <p>Client : <span className="text-white/50">demo@milla.fr / demo1234</span></p>
                  <p>Admin : <span className="text-white/50">admin@milla.fr / admin1234</span></p>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs tracking-widest uppercase">Nom complet</label>
                <input
                  type="text"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="Sophie Martin"
                  className="input-gold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs tracking-widest uppercase">Email</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="votre@email.com"
                  className="input-gold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs tracking-widest uppercase">Mot de passe</label>
                <input
                  type="password"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Min. 8 caractères"
                  className="input-gold"
                  required minLength={8}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs tracking-widest uppercase">Confirmer</label>
                <input
                  type="password"
                  value={regForm.confirm}
                  onChange={(e) => setRegForm({ ...regForm, confirm: e.target.value })}
                  placeholder="Répéter le mot de passe"
                  className="input-gold"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full group">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-noir-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Créer mon compte <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
