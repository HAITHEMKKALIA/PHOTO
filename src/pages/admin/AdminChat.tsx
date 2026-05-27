import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'

export function AdminChat() {
  const { conversations, messages, activeConversation, setActiveConversation, addMessage, markConversationRead } = useChatStore()
  const { profile } = useAuthStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeConversation) markConversationRead(activeConversation)
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
      sender_name: 'Équipe MILLA',
      sender_role: 'admin',
      content: input.trim(),
    })
    setInput('')
  }

  const activeConv = conversations.find((c) => c.id === activeConversation)

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-white">Chat clients</h1>

      <div className="flex h-[600px] glass-card overflow-hidden">
        {/* Conversations list */}
        <div className="w-64 flex-shrink-0 border-r border-white/[0.06] flex flex-col">
          <div className="p-4 border-b border-white/[0.06]">
            <p className="text-white/40 text-xs tracking-widest uppercase">Conversations ({conversations.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageCircle className="w-10 h-10 text-white/10 mb-3" />
                <p className="text-white/30 text-sm">Aucune conversation</p>
                <p className="text-white/20 text-xs mt-1">Les messages clients apparaîtront ici</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-all border-b border-white/[0.04] ${
                    activeConversation === conv.id ? 'bg-gold/5 border-l-2 border-l-gold' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="w-9 h-9 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold text-sm font-bold">
                    {conv.user?.full_name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm truncate">{conv.user?.full_name || 'Client'}</p>
                      {conv.unread_count > 0 && (
                        <span className="bg-gold text-noir-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    {conv.last_message && (
                      <p className="text-white/30 text-xs truncate mt-0.5">{conv.last_message}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {activeConversation && activeConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
                <div className="w-9 h-9 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-sm font-bold">
                  {activeConv.user?.full_name?.[0] || '?'}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{activeConv.user?.full_name || 'Client'}</p>
                  <p className="text-green-400 text-xs">En ligne</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                {convMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 text-sm ${
                      msg.sender_role === 'admin'
                        ? 'bg-gold text-noir-900'
                        : 'bg-white/[0.06] text-white border border-white/10'
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender_role === 'admin' ? 'text-noir-700' : 'text-white/30'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {convMessages.length === 0 && (
                  <div className="text-center py-12 text-white/30 text-sm">
                    Aucun message — démarrez la conversation
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="border-t border-white/[0.06] flex items-center gap-2 p-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Répondre..."
                  className="flex-1 bg-white/[0.04] border border-white/20 text-white placeholder-white/30 px-4 py-2 text-sm focus:outline-none focus:border-gold/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-gold flex items-center justify-center disabled:opacity-40 hover:bg-gold-light transition-colors"
                >
                  <Send className="w-4 h-4 text-noir-900" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30">Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
