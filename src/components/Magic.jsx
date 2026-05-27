import { useState } from 'react'
import MenuBookOverlay from './MenuBookOverlay'
import './Magic.css'

export default function Magic({ onBookClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleBookClick = () => {
    if (onBookClick) {
      onBookClick()
      return
    }

    setMenuOpen(true)
  }

  return (
    <div className="magic-container">
      <div className="particles" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="book-wrapper">
        <div className="glow"></div>
        <div
          className="book"
          role="button"
          tabIndex={0}
          aria-label="Open menu book"
          onClick={handleBookClick}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              handleBookClick()
            }
          }}
        >
          <div className="pages"></div>
          <div className="cover">
            <span className="sparkle sparkle1">*</span>
            <span className="sparkle sparkle2">*</span>
            <span className="sparkle sparkle3">*</span>
            MENU
          </div>
          <div className="spine"></div>
        </div>
      </div>

      {menuOpen && <MenuBookOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  )
}
