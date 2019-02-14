import { lazy } from 'react';

export const Login = lazy(() => import( /* webpackChunkName: "Login" */ '@pages/Login'));
export const PublicHome = lazy(() => import( /* webpackChunkName: "PublicHome" */ '@components/Home'));
export const NotFound = lazy(() => import( /* webpackChunkName: "NotFound" */ '@components/NotFound'));
export const UserManager = lazy(() => import( /* webpackChunkName: "UserManager" */ '@pages/UserManager'))
export const Home = lazy(() => import( /* webpackChunkName: "Home" */ '@pages/Home'))

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
    component: Home
  },
  {
    path: '/user-manager',
    title: '用户管理',
    icon: 'user',
    component: UserManager
  },
];

export default menu;
