export function notFound(_req, res) {
  res.status(404).json({ error: 'API route not found.' })
}

export function errorHandler(error, _req, res, _next) {
  void _next
  console.error(error)
  if (error.code === 11000) return res.status(409).json({ error: 'That value is already in use.' })
  res.status(error.status || 500).json({ error: error.message || 'Something went wrong.' })
}
