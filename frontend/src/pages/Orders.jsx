import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import './Orders.css'

const STATUS_COLORS = { pending:'badge-gray', preparing:'badge-orange', ready:'badge-green', completed:'badge-yellow', cancelled:'badge-red' }
const STATUS_ICONS = { pending:'⏳', preparing:'👨‍🍳', ready:'✅', completed:'🎉', cancelled:'❌' }

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { loadCartFromOrder } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data.orders)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleReorder = (order) => {
    loadCartFromOrder(order.items)
    toast.success('Items added to cart!')
    navigate('/cart')
  }

  if (loading) return <div className="page-container" style={{display:"flex",justifyContent:"center",paddingTop:"8rem"}}><div className="spinner"></div></div>

  return (
    <div className="page-container">
      <h1 className="section-title">📦 My Orders</h1>
      {orders.length === 0 ? (
        <div style={{textAlign:"center",padding:"4rem 1rem"}}>
          <div style={{fontSize:"3.5rem",marginBottom:"1rem"}}>📦</div>
          <h3>No orders yet</h3>
          <p style={{color:"var(--text2)",marginBottom:"1.5rem"}}>Start ordering from the menu!</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Browse Menu</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card card">
              <div className="ord-header">
                <div className="ord-token">Token #{order.tokenNumber}</div>
                <span className={`badge ${STATUS_COLORS[order.status] || 'badge-gray'}`}>
                  {STATUS_ICONS[order.status]} {order.status}
                </span>
              </div>
              <div className="ord-date">{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}</div>
              <div className="ord-items">
                {order.items.map((item, i) => (
                  <span key={i} className="ord-item-tag">{item.name} ×{item.quantity}</span>
                ))}
              </div>
              <div className="ord-footer">
                <span className="ord-total">₹{order.totalAmount}</span>
                <button className="btn btn-outline ord-reorder-btn" onClick={() => handleReorder(order)}>
                  🔁 Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
