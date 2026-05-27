import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import heroVideo1 from '../assets/v1.mp4'
import heroVideo2 from '../assets/v2.mp4'
import heroVideo3 from '../assets/v3.mp4'

const heroVideos = [heroVideo1, heroVideo2, heroVideo3]

export default function Hero() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const transitionTimers = useRef([])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsGlitching(true)

      transitionTimers.current = [
        window.setTimeout(() => {
          setActiveVideo((currentVideo) => (currentVideo + 1) % heroVideos.length)
        }, 260),

        window.setTimeout(() => {
          setIsGlitching(false)
        }, 780),
      ]
    }, 5200)

    return () => {
      window.clearInterval(intervalId)
      transitionTimers.current.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [])

  return (
    <section id="hero" className="hero">
      <section
        className={`hero__visual ${isGlitching ? 'hero__visual--glitch' : ''}`}
        aria-hidden="true"
      >
        {heroVideos.map((video, index) => (
          <video
            className={`hero__video ${
              index === activeVideo ? 'hero__video--active' : ''
            }`}
            key={video}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ))}
        <span className="hero__scanline" />
      </section>
      <section className="hero__content">
        <p className="hero__eyebrow">Artisan ice cream since 2018</p>
        <h1 className="hero__title">
          Scoops of happiness,
          <br />
          one flavor at a time
        </h1>
        <p className="hero__text">
          Discover our most-loved flavors - handcrafted daily with real ingredients
          and zero shortcuts.
        </p>
        <section className="hero__actions">
          <Link to="/#popular" className="btn btn--primary">
            View popular picks
          </Link>
          <Link to="/menu" className="btn btn--outline">
            Full menu
          </Link>
        </section>
      </section>
    </section>
  )
}
