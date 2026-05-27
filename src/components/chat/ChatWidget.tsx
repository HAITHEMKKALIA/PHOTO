import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/lib/utils'

export function ChatWidget() {
  const { isOpen, setOpen, activeConversation, setActiveConversation, messages, addMessage, markConversationRead, getOrCreateConversation } = useChatStore()
  const { profile } = useAuthStore()
  const [input, setInput] = useState('')
  const [minimized, setMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!profile || !isOpen) return
    const convId = getOrCreateConversation(profile.id, profile.full_name)
    setActiveConversation(convId)
  }, [profile, isOpen])

  useEffect(() => {
    if (activeConversation) {
      markConversationRead(activeConversation)
    }
  }, [activeConversation, messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeConversation])

  const convMessages = activeConversation ? (messages[activeConversation] || []) : []

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !activeConversation || !profile) return
    addMessage(activeConversation, {
      conversation_id: activeConversation,
      sender_id: profile.id,
      sender_name: profile.full_name,
      sender_role: 'customer',
      content: input.trim(),
    })
    setInput('')
    // Simulate admin response
    setTimeout(() => {
      addMessage(activeConversation, {
        conversation_id: activeConversation,
        sender_id: 'admin',
        sender_name: 'Équipe MILLA',
        sender_role: 'admin',
        content: getAutoResponse(input),
      })
    }, 1500)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (!profile) return
            setOpen(true)
          }}
          className="fixed bottom-6 right-6 z-70 w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-gold-lg hover:shadow-gold transition-all"
          title="Chat avec nous"
        >
          <MessageCircle className="w-6 h-6 text-noir-900" />
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-70 w-96 max-w-[calc(100vw-24px)] shadow-noir flex flex-col"
            style={{ height: minimized ? 'auto' : '520px' }}
          >
            {/* Header */}
            <div className="bg-noir-700 border border-white/10 flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-gold/20 border border-gold/30 flex items-center justify-center">
                    <span className="font-display text-gold text-sm">M</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-noir-700" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">MILLA Boutique</p>
                  <p className="text-green-400 text-xs">En ligne</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMinimized(!minimized)}
                  className="text-white/40 hover:text-white transition-colors p-1"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/40 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 bg-noir-800 border-x border-white/[0.06]">
                  {/* Welcome */}
                  {convMessages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 text-gold" />
                      </div>
                      <p className="font-display text-white text-lg mb-1">Bonjour {profile.full_name.split(' ')[0]} !</p>
                      <p className="text-white/40 text-sm">Notre équipe est là pour vous aider. Posez-nous vos questions sur nos créations, tailles, livraisons...</p>
                    </div>
                  )}

                  {convMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] ${
                          msg.sender_role === 'customer'
                            ? 'bg-gold text-noir-900'
                            : 'bg-white/[0.06] text-white border border-white/10'
                        } px-4 py-2.5 text-sm leading-relaxed`}
                      >
                        {msg.sender_role === 'admin' && (
                          <p className="text-gold text-[10px] font-bold tracking-wider mb-1">
                            {msg.sender_name}
                          </p>
                        )}
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender_role === 'customer' ? 'text-noir-600' : 'text-white/30'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSend}
                  className="bg-noir-700 border border-white/10 border-t-0 flex items-center gap-2 px-4 py-3"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-8 h-8 bg-gold flex items-center justify-center disabled:opacity-40 hover:bg-gold-light transition-colors"
                  >
                    <Send className="w-4 h-4 text-noir-900" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function getAutoResponse(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('taille') || m.includes('size')) return 'Nos vêtements suivent les tailles standards EU. Pour vous aider, quelle est votre mensuration habituelle ? Vous pouvez aussi consulter notre guide des tailles sur chaque page produit.'
  if (m.includes('livraison') || m.includes('délai')) return 'Nous livrons en 3 à 5 jours ouvrés en France métropolitaine. La livraison est gratuite dès 150€ d\'achat. Pour les DOM-TOM, comptez 7 à 10 jours.'
  if (m.includes('retour') || m.includes('échange')) return 'Vous disposez de 14 jours après réception pour retourner un article. Les retours sont gratuits. Contactez-nous avec votre numéro de commande et nous vous enverrons l\'étiquette de retour.'
  if (m.includes('commande') || m.includes('suivi')) return 'Vous pouvez suivre votre commande dans votre espace client, section "Mes commandes". Vous avez également reçu un email de confirmation avec un lien de suivi.'
  if (m.includes('paiement') || m.includes('payer')) return 'Nous acceptons les cartes bancaires (Visa, Mastercard, Amex), PayPal et le virement bancaire. Toutes les transactions sont sécurisées par SSL.'
  return 'Merci pour votre message ! Notre équipe styliste reviendra vers vous dans les plus brefs délais. En attendant, n\'hésitez pas à parcourir nos nouvelles collections.'
}
