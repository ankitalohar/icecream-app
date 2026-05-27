import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import useCart from '../context/useCart'
import MenuBookOverlay from './MenuBookOverlay'
import logo from '../assets/logo.png'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Popular Picks', to: '/#popular' },
  { label: 'Menu', to: '/menu', opensMenuBook: true },
  { label: 'Order', to: '/order' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuBookOpen, setMenuBookOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { items: cart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  function isNavItemActive(item) {
    if (item.to.includes('#')) {
      const [pathname, hash] = item.to.split('#')
      return location.pathname === pathname && location.hash === `#${hash}`
    }

    if (item.to === '/menu') {
      return location.pathname === '/menu' || location.pathname.startsWith('/menu/')
    }

    return location.pathname === item.to && !location.hash
  }

  function handleMenuBookOpen() {
    setMenuOpen(false)
    setProfileOpen(false)
    setMenuBookOpen(true)
  }

  function closeNavigation() {
    setMenuOpen(false)
    setProfileOpen(false)
  }

  async function handleLogout() {
    setMenuOpen(false)
    setProfileOpen(false)
    await logout()
    navigate('/login')
  }

  return (
    <>
      <header className="header">
        <section className="header__inner">
          <NavLink to="/" className="logo" onClick={closeNavigation}>
            <img src={logo} alt="Icey Bliss" className="logo__image" />
          </NavLink>

          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => {
              setProfileOpen(false)
              setMenuOpen((open) => !open)
            }}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav ${menuOpen ? 'nav--open' : ''}`}>
            <ul className="nav__list">
              {navItems.filter((item) => user?.role !== 'admin' || item.to !== '/order').map((item) => (
                <li key={item.label}>
                  {item.opensMenuBook ? (
                    <button
                      type="button"
                      className={`nav__link nav__link--button${
                        isNavItemActive(item) || menuBookOpen ? ' nav__link--active' : ''
                      }`}
                      aria-haspopup="dialog"
                      aria-expanded={menuBookOpen}
                      onClick={handleMenuBookOpen}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={`nav__link${isNavItemActive(item) ? ' nav__link--active' : ''}`}
                      onClick={closeNavigation}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
              {user?.role === 'admin' ? (
                <>
                  <li>
                    <NavLink to="/dashboard" className="nav__dashboard" onClick={closeNavigation}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button type="button" className="nav__logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : user ? (
                <>
                  <li className="nav__profile-wrap">
                    <button
                      type="button"
                      className="nav__profile"
                      aria-expanded={profileOpen}
                      aria-haspopup="menu"
                      onClick={() => setProfileOpen((open) => !open)}
                    >
                      <span className="nav__profile-icon" aria-hidden="true"><span /></span>
                      <span>{user.name}</span>
                    </button>
                    {profileOpen && (
                      <section className="profile-menu glass" role="menu">
                        <NavLink to="/profile#profile" role="menuitem" onClick={closeNavigation}>User profile</NavLink>
                        <NavLink to="/profile#history" role="menuitem" onClick={closeNavigation}>Order history</NavLink>
                        <NavLink to="/profile#addresses" role="menuitem" onClick={closeNavigation}>Saved address</NavLink>
                        <button type="button" role="menuitem" onClick={handleLogout}>Logout</button>
                      </section>
                    )}
                  </li>
                  <li>
                    <NavLink
                      to="/order?cart=open"
                      className="nav__cart"
                      aria-label={`Cart, ${cartCount} items`}
                      onClick={() => {
                        closeNavigation()
                        window.dispatchEvent(new CustomEvent('vivelle:open-cart'))
                      }}
                    >
                      <span className="nav__cart-icon" aria-hidden="true" />
                      Cart <strong>{cartCount}</strong>
                    </NavLink>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className={`nav__link${location.pathname === '/login' ? ' nav__link--active' : ''}`}
                    onClick={closeNavigation}
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </section>
      </header>

      {menuBookOpen && <MenuBookOverlay onClose={() => setMenuBookOpen(false)} />}
    </>
  )
}
