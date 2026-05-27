import { useCallback, useState } from 'react'
import ToastContext from './toast-context'

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((items) => [...items, { id, message, type }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3600)
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <section className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <p key={toast.id} className={`toast toast--${toast.type}`}>{toast.message}</p>
        ))}
      </section>
    </ToastContext.Provider>
  )
}
