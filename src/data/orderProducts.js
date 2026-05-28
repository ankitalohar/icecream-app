import { productCategoryList, products } from './products'

export const orderCategories = [
  {
    label: 'All',
    value: 'all',
  },
  ...productCategoryList.map((category) => ({
    label: category.buttonLabel,
    value: category.slug,
  })),
]

export const orderProducts = products
