import { IMenu } from './menu';

/**
 * getStorage
 *
 * @export
 * @param {string} name
 * @returns
 */
export function getStorage(name: string) {
  return sessionStorage.getItem(name);
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
