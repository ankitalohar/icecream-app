import o1 from '../assets/o1.png'
import o2 from '../assets/o2.jpg'
import o3 from '../assets/o3.jpg'
import o4 from '../assets/o4.jpg'
import o5 from '../assets/o5.jpg'
import o6 from '../assets/o6.jpg'
import o7 from '../assets/o7.jpg'
import o8 from '../assets/o8.jpg'
import o9 from '../assets/o9.jpg'
import o10 from '../assets/o10.jpg'
import o11 from '../assets/o11.jpg'
import o12 from '../assets/o12.jpg'
import o13 from '../assets/o13.jpg'
import o14 from '../assets/o14.jpg'
import o15 from '../assets/o15.jpg'
import o16 from '../assets/o16.jpg'
import o17 from '../assets/o17.jpg'
import o18 from '../assets/o18.jpg'
import o19 from '../assets/o19.jpg'
import o20 from '../assets/o20.jpg'
import o21 from '../assets/o21.jpg'
import o22 from '../assets/o22.jpg'
import o23 from '../assets/o23.jpg'
import o24 from '../assets/o24.jpg'
import o25 from '../assets/o25.jpg'
import o26 from '../assets/o26.jpg'
import o27 from '../assets/o27.jpg'
import o28 from '../assets/o28.jpg'
import o29 from '../assets/o29.jpg'
import o30 from '../assets/o30.jpg'
import o31 from '../assets/o31.jpg'
import c1 from '../assets/c1.jpg'
import c2 from '../assets/c2.jpg'
import c3 from '../assets/c3.jpg'
import c4 from '../assets/c4.jpg'
import c5 from '../assets/c5.jpg'
import c6 from '../assets/c6.jpg'
import c7 from '../assets/c7.jpg'
import c8 from '../assets/c8.jpg'
import s1 from '../assets/s1.jpg'
import s2 from '../assets/s2.jpg'
import s3 from '../assets/s3.jpg'
import s4 from '../assets/s4.jpg'
import s5 from '../assets/s5.jpg'
import s6 from '../assets/s6.jpg'
import s7 from '../assets/s7.jpg'
import s8 from '../assets/s8.jpg'
import s9 from '../assets/s9.jpg'
import s10 from '../assets/s10.jpg'
import s11 from '../assets/s11.jpg'
import s12 from '../assets/s12.jpg'
import s13 from '../assets/s13.jpg'
import s14 from '../assets/s14.jpg'
import s15 from '../assets/s15.jpg'
import s16 from '../assets/s16.jpg'
import s17 from '../assets/s17.jpg'
import s18 from '../assets/s18.jpg'

void o31

export const productCategoryList = [
  {
    slug: 'ice-cream',
    title: 'Ice Creams',
    menuTitle: 'Ice Cream',
    buttonLabel: 'Ice Cream',
    eyebrow: 'Scoops, cups & sundaes',
    subtitle: 'Classic scoops, bright fruit creams, and premium dessert sundaes.',
    description: 'Handcrafted ice creams made in small batches with real sauces, fruit, nuts, and crunchy toppings.',
    icon: 'Ice',
  },
  {
    slug: 'shakes',
    title: 'Shakes',
    menuTitle: 'Shakes',
    buttonLabel: 'Shake',
    eyebrow: 'Sip & smile',
    subtitle: 'Thick, creamy shakes blended to order.',
    description: 'Tall dessert shakes finished with whipped cream, sauces, sprinkles, and chilled cafe-style toppings.',
    icon: 'Shake',
  },
  {
    slug: 'ice-cream-rolls',
    title: 'Ice Cream Rolls',
    menuTitle: 'Ice Cream Rolls',
    buttonLabel: 'Ice Cream Roll',
    eyebrow: 'Made fresh on the pan',
    subtitle: 'Freshly rolled on a frozen pan with your choice of mix-ins.',
    description: 'Creamy ice cream bases spread, chopped, and rolled with rich sauces and crunchy mix-ins.',
    icon: 'Roll',
  },
]

const categoryTitleBySlug = Object.fromEntries(productCategoryList.map((category) => [category.slug, category.title]))

const catalog = [
  {
    id: 1,
    name: 'Dark Chocolate Fudge',
    category: 'ice-cream',
    price: 249,
    rating: 4.8,
    image: o1,
    description: 'Rich dark chocolate ice cream with glossy fudge swirls and cocoa shards.',
    tag: 'Premium',
  },
  {
    id: 2,
    name: 'Cookies & Cream',
    category: 'ice-cream',
    price: 199,
    rating: 4.9,
    image: o2,
    description: 'Vanilla cream packed with crushed chocolate cookies and a soft cookie crumble finish.',
    tag: 'Bestseller',
  },
  {
    id: 3,
    name: 'Caramel Crunch',
    category: 'ice-cream',
    price: 249,
    rating: 4.8,
    image: o3,
    description: 'Caramel sundae scoops layered with crunchy nuts, wafer bits, and caramel drizzle.',
    tag: 'Crunchy',
  },
  {
    id: 4,
    name: 'Vanilla Swirl',
    category: 'ice-cream',
    price: 149,
    rating: 4.7,
    image: o4,
    description: 'Clean vanilla ice cream with a silky milk finish and delicate vanilla aroma.',
    tag: 'Classic',
  },
  {
    id: 5,
    name: 'Belgian Chocolate',
    category: 'ice-cream',
    price: 249,
    rating: 4.8,
    image: o5,
    description: 'Dense Belgian cocoa scoops folded with chocolate curls and a deep fudge finish.',
    tag: 'Signature',
  },
  {
    id: 6,
    name: 'Berry Bliss',
    category: 'ice-cream',
    price: 199,
    rating: 4.7,
    image: o6,
    description: 'Vanilla berry scoops rippled with blueberry compote and bright forest-fruit notes.',
    tag: 'Fruity',
  },
  {
    id: 7,
    name: 'Mocha Delight',
    category: 'ice-cream',
    price: 199,
    rating: 4.7,
    image: o7,
    description: 'Coffee-kissed chocolate cream with cocoa dust and a mellow mocha finish.',
    tag: 'Cafe',
  },
  {
    id: 8,
    name: 'Butterscotch Caramel',
    category: 'ice-cream',
    price: 199,
    rating: 4.8,
    image: o8,
    description: 'Golden butterscotch ice cream folded with praline crunch and caramel chips.',
    tag: 'Crunchy',
  },
  {
    id: 9,
    name: 'Choco Espresso',
    category: 'ice-cream',
    price: 249,
    rating: 4.7,
    image: o9,
    description: 'Espresso-toned chocolate scoops finished with fudge sauce and dark cocoa flakes.',
    tag: 'Bold',
  },
  {
    id: 10,
    name: 'Oreo Blast',
    category: 'ice-cream',
    price: 199,
    rating: 4.9,
    image: o10,
    description: 'Cookies and cream sundae stacked with Oreo crumble and smooth vanilla cream.',
    tag: 'Loaded',
  },
  {
    id: 11,
    name: 'Triple Chocolate',
    category: 'ice-cream',
    price: 299,
    rating: 4.9,
    image: o11,
    description: 'Chocolate ice cream with fudge ribbons, cocoa chunks, and shaved chocolate.',
    tag: 'Premium',
  },
  {
    id: 12,
    name: 'Pistachio Dream',
    category: 'ice-cream',
    price: 249,
    rating: 4.8,
    image: o12,
    description: 'Roasted pistachio ice cream with chopped nuts and a creamy saffron-style finish.',
    tag: 'Nutty',
  },
  {
    id: 13,
    name: 'Chocolate Roll',
    category: 'ice-cream-rolls',
    price: 299,
    rating: 4.8,
    image: o13,
    description: 'Fresh chocolate ice cream roll spread with fudge sauce and vanilla cream ribbons.',
    tag: 'Rolled',
  },
  {
    id: 14,
    name: 'Cinnamon Crunch',
    category: 'ice-cream',
    price: 199,
    rating: 4.6,
    image: o14,
    description: 'Warm cinnamon custard scoop with biscuit crunch and caramelized dessert crumbs.',
    tag: 'Dessert',
  },
  {
    id: 15,
    name: 'Caramel Latte',
    category: 'ice-cream',
    price: 199,
    rating: 4.7,
    image: o15,
    description: 'Coffee cream swirled with caramel sauce for a smooth latte-inspired scoop.',
    tag: 'Cafe',
  },
  {
    id: 16,
    name: 'Brownie Fudge',
    category: 'ice-cream',
    price: 249,
    rating: 4.9,
    image: o16,
    description: 'Chocolate brownie ice cream packed with brownie bits, cookie crumb, and fudge.',
    tag: 'Loaded',
  },
  {
    id: 17,
    name: 'Mango Vanilla Swirl',
    category: 'ice-cream',
    price: 199,
    rating: 4.7,
    image: o17,
    description: 'Vanilla scoops ribboned with ripe mango sauce and a light buttery crunch.',
    tag: 'Seasonal',
  },
  {
    id: 18,
    name: 'Tropical Mango',
    category: 'ice-cream',
    price: 199,
    rating: 4.8,
    image: o18,
    description: 'Sunny mango ice cream with tropical fruit sauce and crisp cone accents.',
    tag: 'Tropical',
  },
  {
    id: 19,
    name: 'Mint Chocolate Chip',
    category: 'ice-cream',
    price: 199,
    rating: 4.7,
    image: o19,
    description: 'Cool mint ice cream with dark chocolate chips and a fresh mint finish.',
    tag: 'Fresh',
  },
  {
    id: 20,
    name: 'Strawberry Delight',
    category: 'ice-cream',
    price: 199,
    rating: 4.8,
    image: o20,
    description: 'Creamy strawberry scoops topped with raspberry sauce and soft berry notes.',
    tag: 'Fruity',
  },
  {
    id: 21,
    name: 'Raspberry Cream',
    category: 'ice-cream',
    price: 199,
    rating: 4.7,
    image: o21,
    description: 'Pink raspberry cream with tart berry pieces and a smooth dairy finish.',
    tag: 'Berry',
  },
  {
    id: 22,
    name: 'Red Velvet Scoop',
    category: 'ice-cream',
    price: 249,
    rating: 4.8,
    image: o22,
    description: 'Velvety cream cheese-style ice cream with red velvet cake crumble.',
    tag: 'Dessert',
  },
  {
    id: 23,
    name: 'Berry Cupcake Bliss',
    category: 'ice-cream',
    price: 249,
    rating: 4.8,
    image: o23,
    description: 'Berry cupcake-inspired scoop with raspberry sauce and soft cake-like sweetness.',
    tag: 'Dessert',
  },
  {
    id: 24,
    name: 'Blackberry Chocolate',
    category: 'ice-cream',
    price: 249,
    rating: 4.7,
    image: o24,
    description: 'Blackberry cream with chocolate cookie pieces and a dark berry finish.',
    tag: 'Premium',
  },
  {
    id: 25,
    name: 'Coconut Vanilla',
    category: 'ice-cream',
    price: 149,
    rating: 4.6,
    image: o25,
    description: 'Tender coconut and vanilla ice cream with a mellow tropical cream finish.',
    tag: 'Classic',
  },
  {
    id: 26,
    name: 'Cotton Candy Burst',
    category: 'ice-cream',
    price: 199,
    rating: 4.7,
    image: o26,
    description: 'Blue and pink cotton candy ice cream with candy sprinkles and playful sweetness.',
    tag: 'Fun',
  },
  {
    id: 27,
    name: 'Lychee Cream',
    category: 'ice-cream',
    price: 199,
    rating: 4.6,
    image: o27,
    description: 'Soft lychee cream scoops with a floral fruit finish and light syrupy sweetness.',
    tag: 'Floral',
  },
  {
    id: 28,
    name: 'Galaxy Sundae',
    category: 'ice-cream',
    price: 349,
    rating: 4.9,
    image: o28,
    description: 'Colorful sundae with stacked scoops, chocolate drizzle, sprinkles, and a cone crown.',
    tag: 'Showstopper',
  },
  {
    id: 29,
    name: 'Rose Pistachio',
    category: 'ice-cream',
    price: 249,
    rating: 4.8,
    image: o29,
    description: 'Rose cream ice cream with pistachio flecks, petals, and a delicate nutty finish.',
    tag: 'Indian special',
  },
  {
    id: 30,
    name: 'Golden Waffle Sundae',
    category: 'ice-cream',
    price: 349,
    rating: 4.9,
    image: o30,
    description: 'Golden waffle sundae with vanilla scoops, nuts, caramel pearls, and crisp cone pieces.',
    tag: 'Signature',
  },
  {
    id: 31,
    name: 'Bubblegum Shake',
    category: 'shakes',
    price: 299,
    rating: 4.8,
    image: s1,
    description: 'Pastel bubblegum shake topped with whipped cream, candy pieces, and pink drizzle.',
    tag: 'Shake',
  },
  {
    id: 32,
    name: 'Chocolate Shake',
    category: 'shakes',
    price: 249,
    rating: 4.8,
    image: s2,
    description: 'Thick chocolate shake blended with cocoa cream, fudge sauce, and chocolate curls.',
    tag: 'Shake',
  },
  {
    id: 33,
    name: 'Oreo Shake',
    category: 'shakes',
    price: 249,
    rating: 4.9,
    image: s3,
    description: 'Creamy vanilla shake loaded with crushed Oreo cookies and a smooth cookie finish.',
    tag: 'Shake',
  },
  {
    id: 34,
    name: 'Strawberry Shake',
    category: 'shakes',
    price: 229,
    rating: 4.7,
    image: s4,
    description: 'Fresh strawberry shake with berry sauce, whipped cream, and soft fruit notes.',
    tag: 'Shake',
  },
  {
    id: 35,
    name: 'Vanilla Shake',
    category: 'shakes',
    price: 199,
    rating: 4.6,
    image: s5,
    description: 'Classic vanilla shake blended extra creamy with a clean, mellow dairy finish.',
    tag: 'Shake',
  },
  {
    id: 36,
    name: 'Butterscotch Shake',
    category: 'shakes',
    price: 229,
    rating: 4.7,
    image: s6,
    description: 'Golden butterscotch shake with praline crunch, caramel drizzle, and whipped cream.',
    tag: 'Shake',
  },
  {
    id: 37,
    name: 'Mango Shake',
    category: 'shakes',
    price: 229,
    rating: 4.8,
    image: s7,
    description: 'Chilled mango shake made with ripe mango cream and a bright tropical finish.',
    tag: 'Shake',
  },
  {
    id: 38,
    name: 'Cold Coffee Shake',
    category: 'shakes',
    price: 249,
    rating: 4.8,
    image: s8,
    description: 'Cafe-style cold coffee shake with caramel notes, cream, and a smooth mocha edge.',
    tag: 'Shake',
  },
  {
    id: 39,
    name: 'KitKat Shake',
    category: 'shakes',
    price: 269,
    rating: 4.8,
    image: s9,
    description: 'Crunchy wafer shake blended with chocolate sauce, cream, and crisp KitKat pieces.',
    tag: 'Shake',
  },
  {
    id: 40,
    name: 'Brownie Shake',
    category: 'shakes',
    price: 279,
    rating: 4.9,
    image: s10,
    description: 'Loaded brownie shake with fudge, brownie chunks, and a rich chocolate finish.',
    tag: 'Shake',
  },
  {
    id: 48,
    name: 'Chocolate Swirl Roll Shake',
    category: 'shakes',
    price: 349,
    rating: 4.9,
    image: s11,
    description: 'Chocolate rolled cream finished with glossy fudge, toasted marshmallow, and crisp wafer bites.',
    tag: 'Premium roll shake',
  },
  {
    id: 49,
    name: 'Cookies & Cream Roll Shake',
    category: 'shakes',
    price: 329,
    rating: 4.9,
    image: s12,
    description: 'Creamy cookie-speckled rolls topped with whipped cream, Oreo crunch, and chocolate ribbons.',
    tag: 'Premium roll shake',
  },
  {
    id: 50,
    name: 'Strawberry Sundae Shake',
    category: 'shakes',
    price: 329,
    rating: 4.8,
    image: s13,
    description: 'Strawberry rolls crowned with whipped cream, berry drizzle, and a fresh strawberry finish.',
    tag: 'Berry special',
  },
  {
    id: 51,
    name: 'Mango Cream Shake',
    category: 'shakes',
    price: 329,
    rating: 4.8,
    image: s14,
    description: 'Velvety mango cream rolls layered with juicy mango cubes and a soft whipped cream crown.',
    tag: 'Tropical',
  },
  {
    id: 52,
    name: 'Choco Waffle Roll Shake',
    category: 'shakes',
    price: 359,
    rating: 4.9,
    image: s15,
    description: 'Chocolate waffle roll cream with caramel-fudge drizzle, whipped cream, and chocolate bar crunch.',
    tag: 'Signature',
  },
  {
    id: 53,
    name: 'Strawberry Rose Roll Shake',
    category: 'shakes',
    price: 339,
    rating: 4.8,
    image: s16,
    description: 'Rosy strawberry rolls with berry crumble folded through each creamy spiral.',
    tag: 'Floral berry',
  },
  {
    id: 54,
    name: 'Dark Chocolate Lava Shake',
    category: 'shakes',
    price: 369,
    rating: 4.9,
    image: s17,
    description: 'Dark chocolate cookie rolls loaded with brownie crumble, Oreo bits, and molten fudge sauce.',
    tag: 'Lava',
  },
  {
    id: 55,
    name: 'Blueberry Cream Roll Shake',
    category: 'shakes',
    price: 349,
    rating: 4.8,
    image: s18,
    description: 'Blueberry cream rolls topped with whole berries and a cloud of whipped cream.',
    tag: 'Berry premium',
  },
  {
    id: 41,
    name: 'Chocolate Swirl Roll',
    category: 'ice-cream-rolls',
    price: 299,
    rating: 4.8,
    image: c1,
    description: 'Chocolate roll ribbons finished with fudge sauce, vanilla cream, and a crisp cocoa crunch.',
    tag: 'Rolled',
  },
  {
    id: 42,
    name: 'Cookies & Cream Roll',
    category: 'ice-cream-rolls',
    price: 299,
    rating: 4.9,
    image: c2,
    description: 'Fresh pan rolls folded with cookie crumble, vanilla cream, and chocolate drizzle.',
    tag: 'Rolled',
  },
  {
    id: 43,
    name: 'Strawberry Sundae Roll',
    category: 'ice-cream-rolls',
    price: 279,
    rating: 4.8,
    image: c3,
    description: 'Strawberry cream rolls layered with berry sauce, whipped cream, and sundae-style sweetness.',
    tag: 'Berry roll',
  },
  {
    id: 44,
    name: 'Mango Cream Roll',
    category: 'ice-cream-rolls',
    price: 279,
    rating: 4.8,
    image: c4,
    description: 'Mango cream spread on the frozen pan, rolled fresh, and topped with mango sauce.',
    tag: 'Tropical',
  },
  {
    id: 45,
    name: 'Choco Waffle Roll',
    category: 'ice-cream-rolls',
    price: 329,
    rating: 4.9,
    image: c5,
    description: 'Chocolate waffle rolls with fudge ribbons, cocoa crumble, and a silky finish.',
    tag: 'Signature',
  },
  {
    id: 46,
    name: 'Strawberry Rose Roll',
    category: 'ice-cream-rolls',
    price: 319,
    rating: 4.8,
    image: c6,
    description: 'Rosy strawberry rolls with berry crumble, floral cream, and a soft whipped finish.',
    tag: 'Floral berry',
  },
  {
    id: 47,
    name: 'Dark Chocolate Lava Roll',
    category: 'ice-cream-rolls',
    price: 349,
    rating: 4.9,
    image: c7,
    description: 'Dark chocolate rolls loaded with brownie crumble, cookie bits, and molten fudge sauce.',
    tag: 'Lava',
  },
  {
    id: 56,
    name: 'Blueberry Cream Roll',
    category: 'ice-cream-rolls',
    price: 329,
    rating: 4.8,
    image: c8,
    description: 'Blueberry cream rolls layered with berry compote, whole berries, and a chilled fruit finish.',
    tag: 'Berry roll',
  },
]

export const products = catalog.map((product) => ({
  ...product,
  _id: `product-${product.id}`,
  categoryTitle: categoryTitleBySlug[product.category],
  localCatalog: true,
}))

export function getProductsByCategory(category) {
  return products.filter((product) => product.category === category)
}
