const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export default function formatCurrency(amount) {
  return currency.format(Number(amount) || 0)
}
