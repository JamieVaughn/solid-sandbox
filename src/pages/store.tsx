import {Component, createResource, createSignal, Show} from 'solid-js'
import { Route, Routes } from "solid-app-router";
import Header from '../components/Header'
import StorePage from '../components/StorePage'
import { Product } from '../type/product'
import '../index.css'

const Store: Component = () => {
  const [search, setSearch] = createSignal('')
  const [cart, setCart] = createSignal<Product[]>([])

  const [products] = createResource<Product[]>(() => (
    fetch('http://fakestoreapi.com/products').then(res => res.json())
  ), {initialValue: []})
  return (
    <div>
      <Header cart={cart} onClearCart={() => setCart([])} search={search} onSetSearch={str => setSearch(str)}/>
      <Routes>
        <Route path='/' element={<StorePage products={products} search={search} onAddToCart={p => setCart([...cart(), p])}/>} />
      </Routes>
    </div>
  )
}

export default Store
