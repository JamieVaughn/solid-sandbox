import { lazy } from 'solid-js';
import type { RouteDefinition } from 'solid-app-router';

import Home from './pages/home';
import AboutData from './pages/about.data';
import Store from './pages/store';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '/stargazers',
    component: lazy(() => import('./pages/stargazers')),
  },
  {
    path: '/repos',
    component: lazy(() => import('./pages/repos')),
  },
  {
    path: '/savedrepos',
    component: lazy(() => import('./components/SavedRepos')),
  },
  {
    path: '/store',
    component: lazy(() => import('./pages/store')),
  },
  // {
  //   path: '/detail',
  //   component: lazy(() => import('./pages/store')),
  //   children: [
  //     {path: '/:id', component: lazy(() => import('./components/productDetail'))},
  //   ]
  // },
  {
    path: '/detail/:id',
    component: lazy(() => import('./components/productDetail')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
