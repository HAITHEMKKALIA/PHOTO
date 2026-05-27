import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { AdminLayout } from '@/components/layout/AdminLayout'

// Lazy loaded pages
const Home           = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })))
const Shop           = lazy(() => import('@/pages/Shop').then((m) => ({ default: m.Shop })))
const ProductDetail  = lazy(() => import('@/pages/ProductDetail').then((m) => ({ default: m.ProductDetail })))
const Collections    = lazy(() => import('@/pages/Collections').then((m) => ({ default: m.Collections })))
const Checkout       = lazy(() => import('@/pages/Checkout').then((m) => ({ default: m.Checkout })))
const Login          = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const Account        = lazy(() => import('@/pages/Account').then((m) => ({ default: m.Account })))
const About          = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })))
const Contact        = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard })))
const AdminOrders    = lazy(() => import('@/pages/admin/Orders').then((m) => ({ default: m.AdminOrders })))
const AdminProducts  = lazy(() => import('@/pages/admin/Products').then((m) => ({ default: m.AdminProducts })))
const AdminCustomers = lazy(() => import('@/pages/admin/Customers').then((m) => ({ default: m.AdminCustomers })))
const AdminSales     = lazy(() => import('@/pages/admin/Sales').then((m) => ({ default: m.AdminSales })))
const AdminInventory = lazy(() => import('@/pages/admin/Inventory').then((m) => ({ default: m.AdminInventory })))
const AdminCashier   = lazy(() => import('@/pages/admin/Cashier').then((m) => ({ default: m.AdminCashier })))
const AdminCMS       = lazy(() => import('@/pages/admin/CMS').then((m) => ({ default: m.AdminCMS })))
const AdminChat      = lazy(() => import('@/pages/admin/AdminChat').then((m) => ({ default: m.AdminChat })))
const AdminSettings  = lazy(() => import('@/pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })))

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="font-display text-8xl text-gold/20 mb-4">404</p>
        <h1 className="font-display text-4xl text-white mb-4">Page introuvable</h1>
        <p className="text-white/40 mb-8">La page que vous cherchez n'existe pas.</p>
        <a href="/" className="btn-gold inline-flex">Retour à l'accueil</a>
      </div>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#c9a84c', secondary: '#0a0a0a' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          duration: 3000,
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/"                  element={<Home />} />
            <Route path="/boutique"          element={<Shop />} />
            <Route path="/produit/:slug"     element={<ProductDetail />} />
            <Route path="/collections"       element={<Collections />} />
            <Route path="/checkout"          element={<Checkout />} />
            <Route path="/connexion"         element={<Login />} />
            <Route path="/compte"            element={<Account />} />
            <Route path="/compte/*"          element={<Account />} />
            <Route path="/a-propos"          element={<About />} />
            <Route path="/contact"           element={<Contact />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index           element={<AdminDashboard />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="produits"  element={<AdminProducts />} />
            <Route path="clients"   element={<AdminCustomers />} />
            <Route path="ventes"    element={<AdminSales />} />
            <Route path="stock"     element={<AdminInventory />} />
            <Route path="caisse"    element={<AdminCashier />} />
            <Route path="cms"       element={<AdminCMS />} />
            <Route path="chat"      element={<AdminChat />} />
            <Route path="settings"  element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
