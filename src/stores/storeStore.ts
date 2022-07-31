import { createSignal, createResource } from 'solid-js';
import { createMutable } from 'solid-js/store'
import { Product } from '../type/product'

export const cartMutable = createMutable({
  products: [] as Product[],
  get total() {
    return this.products.reduce((total, product) => total + product, 0)
  },
  onAddToCart(product: Product) {
    this.products.push(product)
  },
  clearCart() {
    this.products = []
  }
})

export const [search, setSearch] = createSignal('')
export const [cart, setCart] = createSignal<Product[]>([])

export const [products] = createResource<Product[]>(() => (
  fetch('http://fakestoreapi.com/products').then(res => res.json())
), {initialValue: []})



/*
  Derived selectors
*/

export const onSetSearch = (str: string) => setSearch(str)

export const onClearCart = () => setCart([])

export const onAddToCart = (p: Product) => setCart([...cart(), p])
