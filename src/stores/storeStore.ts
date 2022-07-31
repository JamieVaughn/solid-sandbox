import { createSignal, createResource } from 'solid-js';
import { createMutable } from 'solid-js/store'
import { Product } from '../type/product'

export const cartMutable = createMutable({
  products: JSON.parse(window.localStorage.getItem('cart') || '[]'), //[] as Product[],
  get total() {
    return this.products.reduce((total, product) => total + product.price, 0)
  },
  onAddToCart(product: Product) {
    this.products.push(product)
    window.localStorage.setItem('cart', JSON.stringify(this.products))
  },
  clearCart() {
    this.products = []
    window.localStorage.setItem('cart', JSON.stringify('[]'))

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
