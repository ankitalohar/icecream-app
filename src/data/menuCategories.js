import { getProductsByCategory, productCategoryList } from './products'

export const menuCategories = productCategoryList.map(({ slug, menuTitle, subtitle, icon, buttonLabel }) => ({
  slug,
  title: menuTitle,
  subtitle,
  icon,
  buttonLabel,
}))

export const categoryMenus = Object.fromEntries(
  productCategoryList.map((category) => [
    category.slug,
    {
      title: category.menuTitle,
      eyebrow: category.eyebrow,
      description: category.description,
      items: getProductsByCategory(category.slug),
    },
  ]),
)

export function getCategoryMenu(slug) {
  return categoryMenus[slug] ?? null
}
