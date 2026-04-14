import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  if (!user) { navigate('/login'); return null }

  return (
    <div className="page-container">
      <div className="profile-card card">
        <div className="profile-avatar">{user.name[0].toUpperCase()}</div>
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        {user.role === 'admin' && (
          <span className="badge badge-orange" style={{margin:'0 auto 0.5rem'}}>Admin</span>
        )}
        <div className="profile-actions">
          <button className="btn btn-outline" style={{flex:1}} onClick={() => navigate('/orders')}>
            📦 My Orders
          </button>
          {user.role === 'admin' && (
            <button className="btn btn-outline" style={{flex:1}} onClick={() => navigate('/admin')}>
              ⚙️ Admin Panel
            </button>
          )}
          <button className="btn btn-danger" style={{flex:1}} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  )
}
