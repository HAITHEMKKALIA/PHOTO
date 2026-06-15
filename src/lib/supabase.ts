import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: { Row: import('@/types').Profile }
      products: { Row: import('@/types').Product }
      orders: { Row: import('@/types').Order }
      order_items: { Row: import('@/types').OrderItem }
      chat_messages: { Row: import('@/types').ChatMessage }
      chat_conversations: { Row: import('@/types').ChatConversation }
      notifications: { Row: import('@/types').Notification }
      cms_sections: { Row: import('@/types').CMSSection }
      transactions: { Row: import('@/types').Transaction }
    }
  }
}
