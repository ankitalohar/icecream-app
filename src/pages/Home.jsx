import { useEffect, useRef, useState } from 'react'
import Magic from '../components/Magic'
import CustomerFeedback from '../components/CustomerFeedback'
import MenuBookOverlay from '../components/MenuBookOverlay'
import Rating from '../components/Rating'
import { popularPicks } from '../data/popularPicks'
import video1 from '../assets/v1.mp4'
import video2 from '../assets/v2.mp4'
import video3 from '../assets/v3.mp4'
import aboutVideo4 from '../assets/v4.mp4'
import aboutVideo5 from '../assets/v5.mp4'
import aboutVideo6 from '../assets/v6.mp4'
import './Home.css'

const videos = [video1, video2, video3]
const aboutVideos = [aboutVideo4, aboutVideo5, aboutVideo6]

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState(0)
  const [activeAboutVideo, setActiveAboutVideo] = useState(0)
  const [isAboutGlitching, setIsAboutGlitching] = useState(false)
  const heroVideoRefs = useRef([])
  const aboutVideoRefs = useRef([])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveVideo((current) => (current + 1) % videos.length)
    }, 6000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    heroVideoRefs.current.forEach((video, index) => {
      if (!video) return

      if (index === activeVideo) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [activeVideo])

  useEffect(() => {
    const aboutTransitionTimers = []
    const intervalId = window.setInterval(() => {
      setIsAboutGlitching(true)

      aboutTransitionTimers.push(
        window.setTimeout(() => {
          setActiveAboutVideo((current) => (current + 1) % aboutVideos.length)
        }, 220),
        window.setTimeout(() => {
          setIsAboutGlitching(false)
        }, 780),
      )
    }, 5200)

    return () => {
      window.clearInterval(intervalId)
      aboutTransitionTimers.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [])

  useEffect(() => {
    aboutVideoRefs.current.forEach((video, index) => {
      if (!video) return

      if (index === activeAboutVideo) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [activeAboutVideo])

  const handleOpenMenu = () => {
    setIsMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <div className="home-wrapper">
        <section className="hero-section">
        <div className="video-background">
          {videos.map((video, index) => (
            <video
              ref={(element) => {
                heroVideoRefs.current[index] = element
              }}
              key={video}
              className={`hero-video ${index === activeVideo ? 'active' : ''}`}
              src={video}
              autoPlay={index === 0}
              muted
              loop
              playsInline
              preload="auto"
            />
          ))}
          <div className="video-glitch" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Vivelle Icecream</p>
          <h1>Vivelle treats made with love</h1>
          <p className="hero-text">
            Experience handcrafted ice cream, bright flavors, and the magic of Vivelle in every scoop.
          </p>
          <div className="hero-realism-strip" aria-label="Vivelle highlights">
            <span>Small-batch churned</span>
            <span>Real fruit</span>
            <span>Fresh waffle cones</span>
          </div>
          <button className="primary-button" onClick={handleOpenMenu}>
            Open the Vivelle Menu Book
          </button>
        </div>
      </section>

      <section className="about-section" id="about">
        <h2>About Vivelle Icecream</h2>
        <div className="about-section__inner">
          <div className="about-section__card about-section__card--text">
            <div className="about-section__copy">
              <p>
                Vivelle Icecream was founded in 2018 in a small neighborhood kitchen by a dessert
                lover with a dream: to make ice cream the way it should be, with real ingredients,
                careful craft, and bright, memorable flavors. What started as a weekend passion
                project quickly became a local favorite for anyone who wanted ice cream made
                without shortcuts.
              </p>
              <p>
                Today, every batch is still handcrafted in small quantities, with seasonal fruit,
                local dairy, and house-made mix-ins. From our first scoop to the latest flavor,
                Vivelle remains committed to sharing joy, one perfect spoonful at a time.
              </p>
            </div>
          </div>
          <div className="about-video-frame">
            <div className="about-video-wrapper">
              {aboutVideos.map((video, index) => (
                <video
                  ref={(element) => {
                    aboutVideoRefs.current[index] = element
                  }}
                  key={video}
                  className={`about-video ${index === activeAboutVideo ? 'active' : ''}`}
                  src={video}
                  autoPlay={index === 0}
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ))}
              <div className={`about-video-glitch ${isAboutGlitching ? 'active' : ''}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="popular-picks-section" id="popular">
        <h2>Popular Picks</h2>
        <div className="popular-picks-grid">
          {popularPicks.map((item) => {
            console.log(item.name, item.image)
            return (
              <article key={item._id} className="popular-card">
                <div className="popular-image">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                  <span className="popular-detail">{item.tag}</span>
                </div>
                <div className="popular-copy">
                  <h3>{item.name}</h3>
                  <Rating value={item.rating} />
                  <p>{item.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="menu-section" id="menu">
        <h2>Menu Book</h2>
        <Magic onBookClick={handleOpenMenu} />
      </section>

      <section className="feedback-section">
        <CustomerFeedback />
      </section>

      <section className="contact-section" id="contact">
        <h2>Contact</h2>
        <p>Questions or custom orders? Send us a message and we’ll get back to you soon.</p>
        <form className="contact-form">
          <input type="text" placeholder="Your name" />
          <input type="email" placeholder="Your email" />
          <textarea placeholder="Your message" rows="4" />
          <button type="submit" className="primary-button">
            Send Message
          </button>
        </form>
      </section>

      </div>

      {isMenuOpen && <MenuBookOverlay onClose={handleCloseMenu} />}
    </>
  )
}
