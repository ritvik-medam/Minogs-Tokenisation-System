import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Auth({ mode }) {
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const isLogin = mode === 'login'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        toast.success('Welcome back! 👋')
      } else {
        await signup(form.name, form.email, form.password)
        toast.success('Account created! 🎉')
      }
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-logo">🍽️</div>
        <h2 className="auth-title">{isLogin ? 'Welcome back' : 'Join Mingos'}</h2>
        <p className="auth-sub">{isLogin ? 'Login to order your favourite food' : 'Create an account to start ordering'}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Your Name</label>
              <input className="input-field" name="name" placeholder="Ritvik Medam" value={form.name} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input className="input-field" type="email" name="email" placeholder="you@rvu.edu.in" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input-field" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? '...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? '/signup' : '/login'} className="auth-link">
            {isLogin ? 'Sign up' : 'Login'}
          </Link>
        </p>

        {isLogin && (
          <div className="auth-hint">
            <span>Admin demo:</span> admin@mingos.com / admin123
          </div>
        )}
      </div>
    </div>
  )
}
