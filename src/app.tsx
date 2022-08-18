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
    <>
      <nav class="bg-gray-200 text-gray-900 px-4">
        <ul class="flex items-center">
          <li class="py-2 px-4">
            <Link href="/" class="no-underline hover:underline">
              Home
            </Link>
          </li>
          <li class="py-2 px-4">
            <Link href="/about" class="no-underline hover:underline">
              About
            </Link>
          </li>
          <li class="py-2 px-4">
            <Link href="/error" class="no-underline hover:underline">
              Error
            </Link>
          </li>
          <li class="py-2 px-4">
            <Link href="/stargazers" class="no-underline hover:underline">
              Stargazers
            </Link>
          </li>
          <li class="py-2 px-4">
            <Link href="/repos" class="no-underline hover:underline">
              Repos
            </Link>
          </li>
          <li class="py-2 px-4">
            <Link href="/savedrepos" class="no-underline hover:underline">
              Saved Repos ({savedRepos().length})
            </Link>
          </li>
          <li class="py-2 px-4">
            <Link href="/store" class="no-underline hover:underline">
              Store
            </Link>
          </li>

          <li class="text-sm flex items-center space-x-1 ml-auto">
            <span>URL:</span>
            <input
              class="w-75px p-1 bg-white text-sm rounded-lg"
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
    </>
  );
};

export default App;
