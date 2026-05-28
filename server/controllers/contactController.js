import Contact from '../models/Contact.js'
import { syncContact } from '../services/firestore.js'

function clean(value) {
  return String(value || '').trim()
}

export async function createContact(req, res) {
  const payload = {
    name: clean(req.body.name),
    email: clean(req.body.email).toLowerCase(),
    subject: clean(req.body.subject),
    message: clean(req.body.message),
  }

  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required.' })
  }

  const contact = await Contact.create(payload)
  await syncContact(contact)
  res.status(201).json(contact)
}
