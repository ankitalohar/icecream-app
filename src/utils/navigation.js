import { products } from '../data/products'

export function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export async function fetchPopularPicks() {
  return products
}
