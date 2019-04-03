import { lazy } from 'react';

export const Login = lazy(() => import( /* webpackChunkName: "Login" */ '@pages/Login/Login'));
export const PublicHome = lazy(() => import( /* webpackChunkName: "PublicHome" */ '@components/Home'));
export const NotFound = lazy(() => import( /* webpackChunkName: "NotFound" */ '@components/NotFound'));
export const Users = lazy(() => import( /* webpackChunkName: "UserManager" */ '@pages/Users/Users'))
export const Home = lazy(() => import( /* webpackChunkName: "Home" */ '@pages/Home/Home'))
export const Normal = lazy(() => import( /* webpackChunkName: "Normal" */ '@pages/Forms/Normal'))
export const HelloWorld = lazy(() => import( /* webpackChunkName: "Normal" */ '@pages/Three/HelloWorld'))
export const Light = lazy(() => import( /* webpackChunkName: "Normal" */ '@pages/Three/Light'))
export const Texture = lazy(() => import( /* webpackChunkName: "Normal" */ '@pages/Three/Texture'))
export const Tables = lazy(() => import( /* webpackChunkName: "Tables" */ '@pages/Tables/Tables'))

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
    path: '/tables',
    title: '数据表管理',
    icon: 'user',
    component: Tables
  },
  {
    path: '/forms',
    title: '表单',
    icon: 'user',
    // showInMenu: false,
    children: [{
      path: '/normal',
      title: '普通输入框',
      icon: 'user',
      component: Normal
    }]
  },
  {
    path: '/three',
    title: 'Three.js示例',
    icon: 'user',
    children: [{
      path: '/hello_world',
      title: 'hello_world',
      icon: 'user',
      component: HelloWorld
    }, {
      path: '/light',
      title: 'light',
      icon: 'user',
      component: Light
    }, {
      path: '/texture',
      title: 'texture',
      icon: 'user',
      component: Texture
    }]
  },
];

export default menu;
