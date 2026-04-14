import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <>
      <Navbar onCategorySelect={setSelectedCategory} />
      <Routes>
        <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1a1a', color: '#f0ede8', border: '1px solid #2e2e2e', fontFamily: "'DM Sans', sans-serif" },
          success: { iconTheme: { primary: '#4ade80', secondary: '#111' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#111' } }
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}
