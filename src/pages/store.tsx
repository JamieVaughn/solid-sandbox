import {Component, createResource, createSignal, Show} from 'solid-js'
import Header from '../components/Header'
import { Product } from '../type/product'

const Store: Component = () => {
  const [search, setSearch] = createSignal('')
  const [cart, setCart] = createSignal<Product[]>([])
  return (
    <div>
      <Header cart={cart} onClearCart={() => setCart([])} search={search} onSetSearch={str => setSearch(str)}/>
      <p>{search()}</p>
    </div>
  )
}

export default Store
