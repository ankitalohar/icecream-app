import { useEffect } from 'react'

export default function CursorFlowBackground() {
  useEffect(() => {
    let frameId = 0
    let nextX = window.innerWidth / 2
    let nextY = window.innerHeight / 2

    function updatePosition() {
      document.documentElement.style.setProperty('--flow-x', `${nextX}px`)
      document.documentElement.style.setProperty('--flow-y', `${nextY}px`)
      frameId = 0
    }

    function handlePointerMove(event) {
      nextX = event.clientX
      nextY = event.clientY

      if (!frameId) {
        frameId = window.requestAnimationFrame(updatePosition)
      }
    }

    updatePosition()
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return <div className="cursor-flow-bg" aria-hidden="true" />
}
