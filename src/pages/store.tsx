import { Component, createEffect } from 'solid-js'
import { Route, Routes, useParams, Outlet } from "solid-app-router";
import Header from '../components/Header'
import StorePage from '../components/StorePage'
import ProductDetail from '../components/ProductDetail';
import '../index.css'

const Store: Component = () => {
  return (
    <div>
      <Header />
      <Outlet />
      {/* <Routes>
        <Route path='/' element={<StorePage />} />
        <Route path='/detail/:id' element={<ProductDetail />} />
      </Routes> */}
    </div>
  )
}

<Routes>
        <Route path='/' element={<StorePage />} />
        <Route path='/detail/:id' element={<ProductDetail />} />
      </Routes>


export default Store
