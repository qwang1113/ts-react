import { IMenu } from './menu';

/**
 * 检查storage
 */
export function hasStorage(): boolean {
  return typeof sessionStorage !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * getSessionStorage
 *
 * @export
 * @param {string} name
 * @returns string
 */
export function getSessionStorage(name: string): string {
  if (hasStorage) {
    return sessionStorage.getItem(name);
  }
  return '';
}

/**
 * setSessionStorage
 *
 * @export
 * @param {string} name
 * @returns string
 */
export function setSessionStorage(name: string, value: string): void {
  if (hasStorage) {
    sessionStorage.setItem(name, value);
  }
}

/**
 * removeSessionStorage
 *
 * @export
 * @param {string} name
 * @returns string
 */
export function removeSessionStorage(name: string): void {
  if (hasStorage) {
    sessionStorage.removeItem(name);
  }
}

/**
 * getLocalStorage
 *
 * @export
 * @param {string} name
 * @returns string
 */
export function getLocalStorage(name: string): string {
  if (hasStorage) {
    return localStorage.getItem(name);
  }
  return '';
}

/**
 * setLocalStorage
 *
 * @export
 * @param {string} name
 * @returns string
 */
export function setLocalStorage(name: string, value: string): void {
  if (hasStorage) {
    localStorage.setItem(name, value);
  }
}

/**
 * removeLocalStorage
 *
 * @export
 * @param {string} name
 * @returns string
 */
export function removeLocalStorage(name: string): void {
  if (hasStorage) {
    localStorage.removeItem(name);
  }
}

/**
 * 延时方法
 * @param time number 延时时间
 * @returns Promise
 */
export function sleep(time: number = 1000): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}

/**
 * 根据页面路径返回对应路由项列表
 * @param pathName string 页面路径
 * @param menus 路由数组
 */
export function getRoutesByPath(pathName: string, menus: IMenu[]) {
  const routes = [];
  const pathArr = pathName.split('/').filter(p => !!p);
  const getExactRoute = (subPathes: string[], subMenus: IMenu[]) => {
    const curremtMenu = subMenus.find(menu => menu.path === `/${subPathes[0]}`);
    if (!curremtMenu) {
      return;
    }
    routes.push(curremtMenu);
    if (curremtMenu.children) {
      getExactRoute(subPathes.slice(1), curremtMenu.children);
    }
  };
  getExactRoute(pathArr, menus);
  return routes;
}
