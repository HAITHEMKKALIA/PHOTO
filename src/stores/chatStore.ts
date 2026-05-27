import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, ChatConversation } from '@/types'

interface ChatState {
  conversations: ChatConversation[]
  messages: Record<string, ChatMessage[]>
  activeConversation: string | null
  isOpen: boolean
  setOpen: (open: boolean) => void
  setActiveConversation: (id: string | null) => void
  addMessage: (conversationId: string, msg: Omit<ChatMessage, 'id' | 'created_at' | 'read'>) => void
  markConversationRead: (conversationId: string) => void
  getOrCreateConversation: (userId: string, userName: string) => string
  totalUnread: () => number
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversation: null,
      isOpen: false,

      setOpen: (isOpen) => set({ isOpen }),
      setActiveConversation: (id) => set({ activeConversation: id }),

      getOrCreateConversation: (userId, userName) => {
        const existing = get().conversations.find((c) => c.user_id === userId)
        if (existing) return existing.id
        const id = crypto.randomUUID()
        set((s) => ({
          conversations: [
            {
              id,
              user_id: userId,
              unread_count: 0,
              user: { id: userId, full_name: userName } as any,
            },
            ...s.conversations,
          ],
          messages: { ...s.messages, [id]: [] },
        }))
        return id
      },

      addMessage: (conversationId, msg) => {
        const newMsg: ChatMessage = {
          ...msg,
          id: crypto.randomUUID(),
          read: false,
          created_at: new Date().toISOString(),
        }
        set((s) => ({
          messages: {
            ...s.messages,
            [conversationId]: [...(s.messages[conversationId] || []), newMsg],
          },
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  last_message: msg.content,
                  last_message_at: newMsg.created_at,
                  unread_count:
                    msg.sender_role === 'admin' ? c.unread_count + 1 : c.unread_count,
                }
              : c
          ),
        }))
      },

      markConversationRead: (conversationId) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, unread_count: 0 } : c
          ),
          messages: {
            ...s.messages,
            [conversationId]: (s.messages[conversationId] || []).map((m) => ({
              ...m,
              read: true,
            })),
          },
        }))
      },

      totalUnread: () =>
        get().conversations.reduce((sum, c) => sum + c.unread_count, 0),
    }),
    { name: 'milla-chat' }
  )
)
