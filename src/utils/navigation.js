import { categoryMenus } from '../data/menuCategories'

const fallbackPopularPicks = Object.entries(categoryMenus).flatMap(([slug, category]) =>
  category.items.map((item) => ({
    ...item,
    id: `${slug}-${item.id}`,
  })),
)

export function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export async function fetchPopularPicks() {
  try {
    const response = await fetch('/api/ice-creams')
    if (!response.ok) {
      throw new Error('Failed to load ice cream picks')
    }
    return response.json()
  } catch {
    return fallbackPopularPicks
  }
}
