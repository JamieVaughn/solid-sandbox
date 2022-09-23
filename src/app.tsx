import { Component, createSignal, onCleanup, onMount, For } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Link, useRoutes, Route, Routes, useLocation, Outlet } from 'solid-app-router'
import { savedRepos } from './components/SavedRepos'

import { routes } from './routes'
// import Home from './pages/home';
// import About from './pages/about';
// import Stargazers from './pages/stargazers';
// import NotFound from './errors/404';
// import StorePage from './components/StorePage';
// import ProductDetail from './pages/store/[id]';
// import Header from './components/Header';
import './index.css'
import { preview } from 'vite'

const [store, setStore] = createStore({
  users: [] as { name: string }[],
})

function dispatch(action: unknown) {}

function reducer() {}

const App: Component = () => {
  const location = useLocation()
  const Route = useRoutes(routes)
  const [xy, setXy] = createSignal({ x: 0, y: 0, show: false })

  const handleMouseMove = (e) => {
    setXy({ x: e.clientX, y: e.clientY, show: true })
  }
  const handleMouseTransition = (e) => {
    setXy((prev) => ({ ...prev, show: e.type === 'mouseenter' }))
  }
  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseTransition)
    document.addEventListener('mouseleave', handleMouseTransition)
  })
  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseenter', handleMouseTransition)
    document.removeEventListener('mouseleave', handleMouseTransition)
  })

  const pages = [
    'home',
    'about',
    'error',
    'stargazers',
    'repos',
    'saved repos',
    'store',
    'canvas',
    'grid',
    'offscreen',
    'conway',
    'smoothlife',
    'machine',
  ]

  return (
    <div class='wrapper'>
      <style>{styles}</style>
      <nav class='bg-gray-100 text-blue-900 px-4 min-h-screen'>
        <ul class='flex flex-col items-center w-35'>
          <For each={pages}>
            {(item) => {
              const path = item === 'home' ? '' : item.replace(' ', '')
              return (
                <li class='py-1 px-2 capitalize'>
                  <Link
                    href={`/${path}`}
                    class='no-underline hover:underline'
                  >
                    {item} {item === 'saved repos' ? `(${savedRepos().length})` : ''}
                  </Link>
                </li>
              )
            }}
          </For>

          <li class='text-sm flex items-center order-first'>
            <span>URL:</span>
            <input
              class='bg-white text-sm rounded-lg'
              type='text'
              readOnly
              value={location.pathname}
            />
          </li>
        </ul>
      </nav>

      <main>
        <Route />
      </main>
      <div
        style={{
          visibility: xy().show ? 'visible' : 'hidden',
          position: 'fixed',
          // top: xy().y + 'px',
          // left: xy().x + 'px',
          transform: `translate(${xy().x - 5}px, ${xy().y + 5}px)`,
        }}
      >
        👆
      </div>
    </div>
  )
}

export default App

const styles = `
  .wrapper {
    display: flex;
    flex-direction: columns;
  }
`
