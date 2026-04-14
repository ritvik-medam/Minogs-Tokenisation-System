// =============================================
// FOOD CARD COMPONENT
// =============================================
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function FoodCard({ item, isTrending = false }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cartItem = cart.find(i => i.menuItemId === item._id);
  const qty = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(item);
    toast.success(`${item.name} added to cart!`, { icon: item.image });
  };

  return (
    <div style={styles.card}>
      {/* Image area */}
      <div style={styles.imageArea}>
        <span style={styles.emoji}>{item.image}</span>
        {isTrending && <span style={styles.trendBadge}>🔥 Trending</span>}
        <span style={{ ...styles.vegBadge, background: item.isVeg ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)' }}>
          {item.isVeg ? '🥦 Veg' : '🍗 Non-Veg'}
        </span>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <div style={styles.name}>{item.name}</div>
        {item.description && <div style={styles.desc}>{item.description}</div>}
        <div style={styles.footer}>
          <div style={styles.price}>₹{item.price}</div>
          {qty === 0 ? (
            <button style={styles.addBtn} onClick={handleAdd}>+ Add</button>
          ) : (
            <div style={styles.qtyControl}>
              <button style={styles.qtyBtn} onClick={() => removeFromCart(item._id)}>−</button>
              <span style={styles.qtyNum}>{qty}</span>
              <button style={styles.qtyBtn} onClick={handleAdd}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', overflow: 'hidden',
    transition: 'all 0.2s ease', cursor: 'default',
    display: 'flex', flexDirection: 'column',
  },
  imageArea: {
    background: 'var(--bg3)', height: 130, display: 'flex',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  emoji: { fontSize: 64, lineHeight: 1 },
  trendBadge: {
    position: 'absolute', top: 8, left: 8, background: 'var(--primary)',
    color: 'white', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
  },
  vegBadge: {
    position: 'absolute', top: 8, right: 8,
    color: 'white', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
  },
  info: { padding: 14, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
  name: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, lineHeight: 1.3 },
  desc: { fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, flex: 1 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  price: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--primary)' },
  addBtn: {
    background: 'var(--primary)', color: 'white', border: 'none',
    borderRadius: 8, padding: '7px 16px', fontWeight: 700, fontSize: 13,
    cursor: 'pointer', transition: 'background 0.2s',
  },
  qtyControl: {
    display: 'flex', alignItems: 'center', gap: 0,
    background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden',
  },
  qtyBtn: {
    background: 'transparent', color: 'var(--text)', border: 'none',
    padding: '6px 12px', fontWeight: 700, fontSize: 16, cursor: 'pointer',
  },
  qtyNum: { padding: '0 6px', fontWeight: 700, fontSize: 14, minWidth: 24, textAlign: 'center' },
};
