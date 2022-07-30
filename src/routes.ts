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
    data: AboutData,
  },
  {
    path: '/store',
    component: lazy(() => import('./pages/store')),
    data: AboutData,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
