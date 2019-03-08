import { lazy } from 'react';

export const Login = lazy(() => import( /* webpackChunkName: "Login" */ '@pages/Login/Login'));
export const PublicHome = lazy(() => import( /* webpackChunkName: "PublicHome" */ '@components/Home'));
export const NotFound = lazy(() => import( /* webpackChunkName: "NotFound" */ '@components/NotFound'));
export const Users = lazy(() => import( /* webpackChunkName: "UserManager" */ '@pages/Users/Users'))
export const Home = lazy(() => import( /* webpackChunkName: "Home" */ '@pages/Home/Home'))
export const Normal = lazy(() => import( /* webpackChunkName: "Normal" */ '@pages/Forms/Normal'))

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
    path: '/users',
    title: '用户管理',
    icon: 'user',
    component: Users
  },
  {
    path: '/forms',
    title: '表单',
    icon: 'user',
    children: [{
      path: '/normal',
      title: '普通输入框',
      icon: 'user',
      component: Normal
    }]
  },
];

export default menu;
