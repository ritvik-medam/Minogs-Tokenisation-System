// =============================================
// NAVBAR COMPONENT
// =============================================
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../utils/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Search with debounce
  const handleSearch = (val) => {
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    if (val.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await API.get(`/menu/search?q=${val}`);
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch {}
    }, 300);
  };

  const selectSuggestion = (item) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/menu?category=${encodeURIComponent(item.category)}&item=${item._id}`);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoEmoji}>🍽️</span>
          <span style={styles.logoText}>MINGOS</span>
        </Link>

        {/* Search Bar */}
        <div style={styles.searchWrap} ref={searchRef}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search food, categories..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div style={styles.suggestions}>
              {suggestions.map(item => (
                <div key={item._id} style={styles.suggestionItem} onClick={() => selectSuggestion(item)}>
                  <span style={styles.sugEmoji}>{item.image}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.category} • ₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side nav */}
        <div style={styles.navRight}>
          <Link to="/menu" style={{
            ...styles.navLink,
            color: location.pathname === '/menu' ? 'var(--primary)' : 'var(--text-muted)'
          }}>Menu</Link>

          {user ? (
            <>
              <Link to="/cart" style={styles.cartBtn}>
                🛒 <span style={styles.cartCount}>{totalItems}</span>
              </Link>
              <div style={styles.userMenu}>
                <button style={styles.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
                  <span style={styles.avatar}>{user.name[0].toUpperCase()}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>▾</span>
                </button>
                {menuOpen && (
                  <div style={styles.dropdown}>
                    <div style={styles.dropName}>{user.name}</div>
                    <div style={styles.dropEmail}>{user.email}</div>
                    <hr style={styles.dropDivider} />
                    <Link to="/profile" style={styles.dropItem} onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" style={styles.dropItem} onClick={() => setMenuOpen(false)}>⚙️ Admin Panel</Link>
                    )}
                    <button style={{ ...styles.dropItem, ...styles.dropLogout }} onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 13 }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: 'rgba(15,14,13,0.95)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)', height: 64,
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 20px',
    height: '100%', display: 'flex', alignItems: 'center', gap: 20,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
  },
  logoEmoji: { fontSize: 24 },
  logoText: {
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
    color: 'var(--primary)', letterSpacing: 2,
  },
  searchWrap: {
    flex: 1, maxWidth: 440, position: 'relative', display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute', left: 12, fontSize: 14, zIndex: 1, pointerEvents: 'none',
  },
  searchInput: {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 24, padding: '9px 16px 9px 36px', color: 'var(--text)',
    fontSize: 14, transition: 'border-color 0.2s',
  },
  suggestions: {
    position: 'absolute', top: '110%', left: 0, right: 0,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 12, overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100,
  },
  suggestionItem: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
    cursor: 'pointer', transition: 'background 0.15s',
  },
  sugEmoji: { fontSize: 24, width: 32, textAlign: 'center' },
  navRight: { display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 },
  navLink: { fontWeight: 500, fontSize: 14, transition: 'color 0.2s' },
  cartBtn: {
    display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg3)',
    border: '1px solid var(--border)', borderRadius: 24,
    padding: '7px 14px', fontSize: 16, cursor: 'pointer', transition: 'all 0.2s',
  },
  cartCount: {
    background: 'var(--primary)', color: 'white', borderRadius: '50%',
    width: 20, height: 20, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 11, fontWeight: 700,
  },
  userMenu: { position: 'relative' },
  userBtn: {
    display: 'flex', alignItems: 'center', gap: 6, background: 'transparent',
    border: 'none', cursor: 'pointer',
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 700, fontSize: 14,
  },
  dropdown: {
    position: 'absolute', top: '120%', right: 0, minWidth: 200,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 12, overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 200,
  },
  dropName: { padding: '12px 16px 2px', fontWeight: 700, fontSize: 14 },
  dropEmail: { padding: '0 16px 12px', fontSize: 12, color: 'var(--text-muted)' },
  dropDivider: { border: 'none', borderTop: '1px solid var(--border)' },
  dropItem: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', fontSize: 14, color: 'var(--text)',
    cursor: 'pointer', background: 'transparent', width: '100%',
    textAlign: 'left', transition: 'background 0.15s',
    fontFamily: 'var(--font-body)',
  },
  dropLogout: { color: 'var(--error)', border: 'none' },
  authBtns: { display: 'flex', gap: 8 },
};
