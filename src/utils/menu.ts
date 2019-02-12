import { lazy, LazyExoticComponent, ComponentElement } from 'react';

// export const asynchronousComponents = {
//   Home: lazy(() => import( /* webpackChunkName: "Home" */ '@pages/Home')),
//   About: lazy(() => import( /* webpackChunkName: "About" */ '@pages/About')),
// };

// // 所有路由的key
// export type AsynchronousComponentKeys = keyof typeof asynchronousComponents;

export interface IMenu {
  title: string;
  path?: string;
  icon?: string;
  exact?: boolean;
  showInMenu?: boolean;
  children?: IMenu[];
  component?: LazyExoticComponent<() => ComponentElement<{}, any>>
}

export const menu: IMenu[] = [
  {
    path: '/home',
    title: '主页',
    icon: 'setting',
    component: lazy(() => import( /* webpackChunkName: "Home" */ '@pages/Home')),
  },
  {
    path: '/about',
    title: '关于',
    icon: 'setting',
    component: lazy(() => import( /* webpackChunkName: "About" */ '@pages/About'))
  },
];

export default menu;
