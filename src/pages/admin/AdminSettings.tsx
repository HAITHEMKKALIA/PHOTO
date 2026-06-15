import { useState } from 'react'
import { Save, Store, Mail, Bell, Shield, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'MILLA BOUTIQUE',
    storeEmail: 'contact@milla-boutique.fr',
    storePhone: '+33 1 23 45 67 89',
    storeAddress: '24 Rue de la Paix, 75001 Paris',
    currency: 'EUR',
    freeShippingThreshold: 150,
    defaultShipping: 5.90,
    expressShipping: 9.90,
    notifyNewOrder: true,
    notifyLowStock: true,
    notifyNewCustomer: false,
    maintenanceMode: false,
    allowRegistration: true,
    primaryColor: '#c9a84c',
  })

  const handleSave = () => {
    toast.success('Paramètres sauvegardés')
  }

  const Section = ({ title, Icon, children }: { title: string; Icon: any; children: React.ReactNode }) => (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
        <Icon className="w-5 h-5 text-gold" />
        <h2 className="font-display text-xl text-white">{title}</h2>
      </div>
      {children}
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white">Paramètres</h1>
        <button onClick={handleSave} className="btn-gold py-2 px-5 text-xs flex items-center gap-2">
          <Save className="w-4 h-4" /> Sauvegarder
        </button>
      </div>

      <Section title="Boutique" Icon={Store}>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Nom de la boutique', key: 'storeName', type: 'text' },
            { label: 'Email contact',      key: 'storeEmail', type: 'email' },
            { label: 'Téléphone',          key: 'storePhone', type: 'tel' },
            { label: 'Devise',             key: 'currency', type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">{label}</label>
              <input
                type={type}
                value={(settings as any)[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="input-gold"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Adresse</label>
            <input type="text" value={settings.storeAddress} onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })} className="input-gold" />
          </div>
        </div>
      </Section>

      <Section title="Livraison" Icon={Mail}>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Livraison gratuite dès (€)', key: 'freeShippingThreshold' },
            { label: 'Livraison standard (€)',     key: 'defaultShipping' },
            { label: 'Livraison express (€)',      key: 'expressShipping' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">{label}</label>
              <input
                type="number" step="0.01"
                value={(settings as any)[key]}
                onChange={(e) => setSettings({ ...settings, [key]: +e.target.value })}
                className="input-gold"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Notifications" Icon={Bell}>
        <div className="space-y-3">
          {[
            { key: 'notifyNewOrder',    label: 'Notification nouvelles commandes' },
            { key: 'notifyLowStock',    label: 'Alerte stock bas' },
            { key: 'notifyNewCustomer', label: 'Notification nouveau client' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setSettings({ ...settings, [key]: !(settings as any)[key] })}
                className={`w-11 h-6 rounded-full transition-all relative flex items-center ${(settings as any)[key] ? 'bg-gold' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute transition-all ${(settings as any)[key] ? 'left-6' : 'left-1'}`} />
              </div>
              <span className="text-white/70 text-sm">{label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Sécurité" Icon={Shield}>
        <div className="space-y-3">
          {[
            { key: 'allowRegistration', label: 'Autoriser les inscriptions' },
            { key: 'maintenanceMode',   label: 'Mode maintenance (site inaccessible)' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setSettings({ ...settings, [key]: !(settings as any)[key] })}
                className={`w-11 h-6 rounded-full transition-all relative flex items-center ${(settings as any)[key] ? 'bg-gold' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute transition-all ${(settings as any)[key] ? 'left-6' : 'left-1'}`} />
              </div>
              <span className={`text-sm ${key === 'maintenanceMode' ? 'text-red-400' : 'text-white/70'}`}>{label}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  )
}
