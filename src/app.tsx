import type { Component } from 'solid-js';
import { Link, useRoutes, Route, Routes, useLocation, Outlet } from 'solid-app-router';
import { savedRepos } from "./components/SavedRepos";

import { routes } from './routes';
// import Home from './pages/home';
// import About from './pages/about';
// import Stargazers from './pages/stargazers';
// import NotFound from './errors/404';
// import StorePage from './components/StorePage';
// import ProductDetail from './pages/store/[id]';
// import Header from './components/Header';
// import './index.css'


const App: Component = () => {
  const location = useLocation();
  const Route = useRoutes(routes);

  return (
    <div class='wrapper'>
      <style>{styles}</style>
      <nav class="bg-gray-100 text-blue-900 px-4 min-h-screen">
        <ul class="flex flex-col items-center">
          <li class="py-1 px-2">
            <Link href="/" class="no-underline hover:underline">
              Home
            </Link>
          </li>
          <li class="py-1 px-2">
            <Link href="/about" class="no-underline hover:underline">
              About
            </Link>
          </li>
          <li class="py-1 px-2">
            <Link href="/error" class="no-underline hover:underline">
              Error
            </Link>
          </li>
          <li class="py-1 px-2">
            <Link href="/stargazers" class="no-underline hover:underline">
              Stargazers
            </Link>
          </li>
          <li class="py-1 px-2">
            <Link href="/repos" class="no-underline hover:underline">
              Repos
            </Link>
          </li>
          <li class="py-1 px-2">
            <Link href="/savedrepos" class="no-underline hover:underline">
              Saved Repos ({savedRepos().length})
            </Link>
          </li>
          <li class="py-1 px-2">
            <Link href="/store" class="no-underline hover:underline">
              Store
            </Link>
          </li>
          <li class="py-1 px-2">
            <Link href="/canvas" class="no-underline hover:underline">
              Canvas
            </Link>
          </li>

          <li class="text-sm flex items-center order-first">
            <span>URL:</span>
            <input
              class="bg-white text-sm rounded-lg"
              type="text"
              readOnly
              value={location.pathname}
            />
          </li>
        </ul>
      </nav>

      <main>
        <Route />
      </main>
    </div>
  );
};

export default App;

const styles = `
  .wrapper {
    display: flex;
    flex-direction: columns;
  }
`
