export type UserRole = 'customer' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  cover_image_url?: string
  is_featured: boolean
  season?: string
  year?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price?: number
  category_id?: string
  collection_id?: string
  images: string[]
  video_url?: string
  sizes: string[]
  colors: string[]
  stock: number
  is_featured: boolean
  is_new: boolean
  tags: string[]
  created_at: string
  category?: Category
  collection?: Collection
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  size: string
  color: string
  quantity: number
  unit_price: number
  total_price: number
  product?: Product
}

export interface ShippingAddress {
  full_name: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  shipping_address: ShippingAddress
  notes?: string
  tracking_number?: string
  estimated_delivery?: string
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_role: UserRole
  content: string
  read: boolean
  created_at: string
}

export interface ChatConversation {
  id: string
  user_id: string
  last_message?: string
  last_message_at?: string
  unread_count: number
  user?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'order' | 'promo' | 'system' | 'chat'
  read: boolean
  link?: string
  created_at: string
}

export interface CMSSection {
  id: string
  key: string
  title: string
  content: string
  image_url?: string
  is_active: boolean
  updated_at: string
}

export interface Transaction {
  id: string
  order_id?: string
  type: 'sale' | 'refund' | 'expense'
  amount: number
  description: string
  payment_method: 'cash' | 'card' | 'transfer'
  created_at: string
}

export type StatsMetric = {
  label: string
  value: string | number
  change?: number
  icon?: string
}
