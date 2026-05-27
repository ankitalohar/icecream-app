import Product from '../models/Product.js'

export async function listProducts(req, res) {
  const query = { active: true }
  if (req.query.category) query.category = req.query.category
  if (req.query.search) query.name = { $regex: String(req.query.search), $options: 'i' }
  res.json(await Product.find(query).sort({ rating: -1, name: 1 }))
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found.' })
  res.json(product)
}
