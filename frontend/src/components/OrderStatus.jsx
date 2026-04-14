import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './OrderStatus.css'

const STEPS = ['pending','preparing','ready']

export default function OrderStatus({ orderId, onClose }) {
  const [order, setOrder] = useState(null)
  const [prevStatus, setPrevStatus] = useState(null)

  useEffect(() => {
    if (!orderId) return
    const poll = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`)
        const o = res.data.order
        if (prevStatus && o.status !== prevStatus) {
          if (o.status === 'preparing') toast('👨‍🍳 Your order is being prepared!', { icon: '🔥' })
          if (o.status === 'ready') toast.success('🎉 Your order is READY! Token #' + o.tokenNumber)
        }
        setPrevStatus(o.status)
        setOrder(o)
      } catch(e) {}
    }
    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [orderId, prevStatus])

  if (!order) return <div className="os-loading"><div className="spinner"></div></div>

  const stepIdx = STEPS.indexOf(order.status)

  return (
    <div className="os-card card fade-in">
      <div className="os-header">
        <div>
          <div className="os-token">Token #{order.tokenNumber}</div>
          <div className="os-queue">Queue position: {order.queuePosition}</div>
        </div>
        <div className="os-time">~{order.estimatedTime} min</div>
      </div>

      {/* Step progress */}
      <div className="os-steps">
        {STEPS.map((step, i) => (
          <div key={step} className={`os-step ${i <= stepIdx ? 'done' : ''} ${i === stepIdx ? 'active' : ''}`}>
            <div className="os-dot">
              {i < stepIdx ? '✓' : i === stepIdx ? '●' : '○'}
            </div>
            <span className="os-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
            {i < STEPS.length - 1 && <div className={`os-line ${i < stepIdx ? 'done' : ''}`}></div>}
          </div>
        ))}
      </div>

      {order.status === 'ready' && (
        <div className="os-ready">
          <div className="os-ready-icon">🎉</div>
          <div className="os-ready-text">Your food is ready! Pick up at the counter.</div>
        </div>
      )}

      <div className="os-items">
        {order.items.map((item, i) => (
          <div key={i} className="os-item">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="os-total">
          <span>Total</span><span>₹{order.totalAmount}</span>
        </div>
      </div>

      {onClose && <button className="btn btn-outline" style={{width:'100%',marginTop:'1rem'}} onClick={onClose}>Close</button>}
    </div>
  )
}
