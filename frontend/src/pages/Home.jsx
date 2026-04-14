import { useState, useEffect } from 'react'
import api from '../utils/api'
import FoodCard from '../components/FoodCard'
import './Home.css'

export default function Home({ selectedCategory }) {
  const [menu, setMenu] = useState({})
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, popRes] = await Promise.all([
          api.get('/menu'),
          api.get('/menu/popular')
        ])
        setMenu(menuRes.data.menu)
        setPopular(popRes.data.popular)
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="page-container" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
      <div className="spinner"></div>
    </div>
  )

  const categories = selectedCategory ? [selectedCategory] : Object.keys(menu)

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-text">
          <div className="hero-label">RV University Canteen</div>
          <h1 className="hero-title">Mingos <span>Canteen</span></h1>
          <p className="hero-sub">Order food, skip the queue. Get your token and relax!</p>
        </div>
        <div className="hero-emoji">🍽️</div>
      </div>

      {/* Trending */}
      {!selectedCategory && popular.length > 0 && (
        <section className="section">
          <div className="section-title">🔥 Trending Today</div>
          <div className="grid-cards">
            {popular.map(item => <FoodCard key={item._id} item={item} />)}
          </div>
        </section>
      )}

      {/* Menu by category */}
      {categories.map(cat => (
        menu[cat] && menu[cat].length > 0 && (
          <section key={cat} className="section">
            <div className="section-title">{cat}</div>
            <div className="grid-cards">
              {menu[cat].map(item => <FoodCard key={item._id} item={item} />)}
            </div>
          </section>
        )
      ))}
    </div>
  )
}
