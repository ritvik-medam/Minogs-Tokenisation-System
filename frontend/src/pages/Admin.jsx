import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './Admin.css'

const CATEGORIES = ['South Indian','North Indian','Chinese','Quick Bites','Non-Veg','Beverages','Thali','Chaats','Egg Items','Ice Cream']
const STATUS_OPTIONS = ['pending','preparing','ready','completed','cancelled']
const STATUS_COLORS = { pending:'badge-gray', preparing:'badge-orange', ready:'badge-green', completed:'badge-yellow', cancelled:'badge-red' }
const BLANK_ITEM = { name:'', category:'South Indian', price:'', image:'🍽️', description:'', isVeg:true, avgPrepTime:5 }

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(BLANK_ITEM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    fetchStats()
  }, [user])

  useEffect(() => {
    if (tab === 'orders') fetchOrders()
    else if (tab === 'menu') fetchMenu()
  }, [tab])

  const fetchStats = async () => {
    try { const r = await api.get('/admin/stats'); setStats(r.data) } catch(e) {}
  }
  const fetchOrders = async () => {
    try { const r = await api.get('/admin/orders'); setOrders(r.data.orders) } catch(e) {}
  }
  const fetchMenu = async () => {
    try { const r = await api.get('/admin/menu'); setMenuItems(r.data.items) } catch(e) {}
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status })
      toast.success('Status updated!')
      fetchOrders()
    } catch(e) { toast.error('Failed to update') }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSaveItem = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editItem) {
        await api.put(`/admin/menu/${editItem._id}`, formData)
        toast.success('Item updated!')
      } else {
        await api.post('/admin/menu', formData)
        toast.success('Item added!')
      }
      setShowForm(false); setEditItem(null); setFormData(BLANK_ITEM)
      fetchMenu()
    } catch(e) { toast.error(e.response?.data?.message || 'Error') }
    finally { setLoading(false) }
  }

  const handleDeleteItem = async (id) => {
    if (!confirm('Delete this item?')) return
    try { await api.delete(`/admin/menu/${id}`); toast.success('Deleted'); fetchMenu() }
    catch(e) { toast.error('Failed') }
  }

  const openEditForm = (item) => {
    setEditItem(item); setFormData({ ...item }); setShowForm(true)
  }

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <p className="admin-sub">Manage Mingos Canteen</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['dashboard','orders','menu'].map(t => (
          <button key={t} className={`admin-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t==='dashboard'?'📊':t==='orders'?'📦':'🍽️'} {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && stats && (
        <div className="admin-stats fade-in">
          <div className="stat-card card">
            <div className="stat-icon">📦</div>
            <div className="stat-val">{stats.totalOrdersToday}</div>
            <div className="stat-label">Orders Today</div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">💰</div>
            <div className="stat-val">₹{stats.totalRevenue}</div>
            <div className="stat-label">Revenue Today</div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">⏳</div>
            <div className="stat-val">{stats.activeOrders}</div>
            <div className="stat-label">Active Orders</div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-val">{stats.avgPrepTime || 0} min</div>
            <div className="stat-label">Avg Prep Time</div>
          </div>
          {stats.popularItem && (
            <div className="stat-card stat-wide card">
              <div className="stat-icon">{stats.popularItem.image}</div>
              <div>
                <div className="stat-val">{stats.popularItem.name}</div>
                <div className="stat-label">🔥 Most Popular Today ({stats.popularItem.todayOrderCount} orders)</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {tab === 'orders' && (
        <div className="fade-in">
          <div className="admin-orders">
            {orders.map(o => (
              <div key={o._id} className="admin-order card">
                <div className="ao-top">
                  <span className="ao-token">Token #{o.tokenNumber}</span>
                  <span className="ao-user">{o.user?.name || 'User'}</span>
                  <span className="ao-amount">₹{o.totalAmount}</span>
                  <span className="ao-time">{new Date(o.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
                </div>
                <div className="ao-items">
                  {o.items.map((item, i) => <span key={i} className="ord-item-tag">{item.name} ×{item.quantity}</span>)}
                </div>
                <div className="ao-status">
                  <select
                    className="input-field ao-select"
                    value={o.status}
                    onChange={e => handleStatusChange(o._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className={`badge ${STATUS_COLORS[o.status]||'badge-gray'}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Management */}
      {tab === 'menu' && (
        <div className="fade-in">
          <div className="menu-admin-header">
            <span>{menuItems.length} items</span>
            <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditItem(null); setFormData(BLANK_ITEM) }}>
              + Add Item
            </button>
          </div>

          {showForm && (
            <div className="menu-form card" style={{marginBottom:'1.5rem'}}>
              <h3 style={{marginBottom:'1.25rem'}}>{editItem ? 'Edit Item' : 'Add New Item'}</h3>
              <form onSubmit={handleSaveItem} className="mf-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input className="input-field" name="name" value={formData.name} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select className="input-field" name="category" value={formData.category} onChange={handleFormChange}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input className="input-field" type="number" name="price" value={formData.price} onChange={handleFormChange} required min={0} />
                </div>
                <div className="form-group">
                  <label>Emoji (image)</label>
                  <input className="input-field" name="image" value={formData.image} onChange={handleFormChange} maxLength={4} />
                </div>
                <div className="form-group">
                  <label>Avg Prep Time (min)</label>
                  <input className="input-field" type="number" name="avgPrepTime" value={formData.avgPrepTime} onChange={handleFormChange} min={1} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input className="input-field" name="description" value={formData.description} onChange={handleFormChange} />
                </div>
                <div className="form-group mf-check">
                  <label><input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleFormChange} /> Vegetarian</label>
                  <label><input type="checkbox" name="isAvailable" checked={formData.isAvailable !== false} onChange={handleFormChange} /> Available</label>
                </div>
                <div className="mf-actions">
                  <button className="btn btn-primary" type="submit" disabled={loading}>{loading?'Saving...':'Save Item'}</button>
                  <button className="btn btn-outline" type="button" onClick={() => {setShowForm(false);setEditItem(null)}}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-menu-list">
            {menuItems.map(item => (
              <div key={item._id} className={`ami-row card ${!item.isAvailable?'unavailable':''}`}>
                <span className="ami-emoji">{item.image}</span>
                <div className="ami-info">
                  <div className="ami-name">{item.name}</div>
                  <div className="ami-cat">{item.category} · {item.isVeg?'🟢 Veg':'🔴 Non-veg'}</div>
                </div>
                <span className="ami-price">₹{item.price}</span>
                <span className="ami-orders">{item.todayOrderCount} today</span>
                <div className="ami-actions">
                  <button className="btn btn-outline ami-btn" onClick={() => openEditForm(item)}>Edit</button>
                  <button className="btn btn-danger ami-btn" onClick={() => handleDeleteItem(item._id)}>Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
