import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import useToast from '../context/useToast'

const stages = ['Order Placed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered']

export default function TrackOrder() {
  const { orderId } = useParams()
  const notify = useToast()
  const [order, setOrder] = useState(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await api(`/orders/track/${orderId}`)
        if (active) {
          setOrder(data)
          setNow(Date.now())
        }
      } catch (error) {
        if (active) notify(error.message, 'error')
      }
    }
    load()
    const timer = window.setInterval(load, 10000)
    return () => { active = false; window.clearInterval(timer) }
  }, [notify, orderId])

  if (!order) return <p className="page-state">Loading order tracking...</p>
  const index = order.status === 'Cancelled' ? -1 : stages.indexOf(order.status)
  const remaining = Math.max(0, Math.ceil((new Date(order.estimatedDeliveryAt) - now) / 60000))

  return (
    <section className="tracking-page glass">
      <p className="eyebrow">Live tracking</p>
      <h1>{order.orderId}</h1>
      <p className={order.status === 'Cancelled' ? 'cancelled' : 'muted'}>
        {order.status === 'Cancelled' ? 'This order was cancelled.' : `${remaining} minutes estimated until delivery`}
      </p>
      <div className="tracker">
        <div className="tracker__line"><span style={{ width: `${Math.max(0, index) * 25}%` }} /></div>
        {stages.map((stage, stageIndex) => (
          <article className={stageIndex <= index ? 'complete' : ''} key={stage}>
            <span className="tracker__dot" />
            <strong>{stage}</strong>
            <small>{order.timeline.find((event) => event.status === stage)?.at ? new Date(order.timeline.find((event) => event.status === stage).at).toLocaleTimeString() : 'Pending'}</small>
          </article>
        ))}
      </div>
      <section className="tracking-address">
        <h2>Delivery address</h2>
        <p>{order.deliveryAddress}</p>
      </section>
    </section>
  )
}
