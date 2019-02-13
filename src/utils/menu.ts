import { lazy } from 'react';

export interface IMenu {
  title: string;
  path?: string;
  icon?: string;
  exact?: boolean;
  showInMenu?: boolean;
  children?: IMenu[];
  component?: any
}

export const menu: IMenu[] = [
  {
    path: '/home',
    title: '主页',
    icon: 'setting',
    component: lazy(() => import( /* webpackChunkName: "Home" */ '@pages/Home')),
  },
  {
    path: '/user-manager',
    title: '用户管理',
    icon: 'user',
    component: lazy(() => import( /* webpackChunkName: "UserManager" */ '@pages/UserManager'))
  },
];

export default menu;
