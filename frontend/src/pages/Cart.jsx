// =============================================
// CART PAGE
// =============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, addToCart, removeFromCart, deleteFromCart, clearCart, totalPrice, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) { toast.error('Cart is empty!'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/orders', { items: cart });
      clearCart();
      toast.success(`Order placed! Token #${data.tokenNumber} 🎉`);
      navigate(`/order-confirmation/${data.order._id}`, { state: { order: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={{ fontSize: 80 }}>🛒</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)' }}>Add some delicious items to get started</p>
        <Link to="/menu" className="btn btn-primary" style={{ marginTop: 20, padding: '14px 32px' }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.pageTitle}>Your Cart</h1>
        <div style={styles.layout}>
          {/* Cart Items */}
          <div style={styles.items}>
            {cart.map(item => (
              <div key={item.menuItemId} style={styles.cartItem}>
                <span style={styles.itemEmoji}>{item.image}</span>
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemPrice}>₹{item.price} each</div>
                </div>
                <div style={styles.qtyRow}>
                  <button style={styles.qtyBtn} onClick={() => removeFromCart(item.menuItemId)}>−</button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => addToCart({ _id: item.menuItemId, ...item })}>+</button>
                </div>
                <div style={styles.itemTotal}>₹{item.price * item.quantity}</div>
                <button style={styles.deleteBtn} onClick={() => deleteFromCart(item.menuItemId)}>🗑️</button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={styles.summary}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <div style={styles.summaryRows}>
              <div style={styles.summaryRow}>
                <span>Items ({totalItems})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Taxes & fees</span>
                <span style={{ color: 'var(--success)' }}>Free</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
              <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{totalPrice}</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: 16, fontSize: 15, marginTop: 20 }}
              onClick={handlePlaceOrder} disabled={loading}>
              {loading ? '⏳ Placing order...' : '🎯 Place Order'}
            </button>
            <Link to="/menu" style={styles.continueLink}>← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { paddingTop: 80, paddingBottom: 40, minHeight: '100vh' },
  pageTitle: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 32 },
  empty: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 20 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' },
  items: { display: 'flex', flexDirection: 'column', gap: 12 },
  cartItem: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
  },
  itemEmoji: { fontSize: 36, flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 600, fontSize: 15 },
  itemPrice: { fontSize: 13, color: 'var(--text-muted)', marginTop: 2 },
  qtyRow: {
    display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg3)',
    border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden',
  },
  qtyBtn: {
    background: 'transparent', border: 'none', color: 'var(--text)',
    padding: '8px 14px', fontWeight: 700, fontSize: 16, cursor: 'pointer',
  },
  qty: { padding: '0 10px', fontWeight: 700, minWidth: 28, textAlign: 'center' },
  itemTotal: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, minWidth: 60, textAlign: 'right' },
  deleteBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18, opacity: 0.6 },
  summary: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: 24, position: 'sticky', top: 80,
  },
  summaryTitle: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 20 },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: 12 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 15 },
  continueLink: { display: 'block', textAlign: 'center', marginTop: 16, color: 'var(--text-muted)', fontSize: 14 },
};
