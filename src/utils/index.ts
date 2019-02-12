import { IMenu } from './menu';

/**
 * setCookie
 *
 * @export
 * @param {string} name
 * @param {string} value
 * @param {number} [expiredays=365]
 */
export function setCookie(name: string, value: string, expiredays = 365) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = `${name}=${escape(value)};expires=${exdate.toUTCString()}`;
}

/**
 * getCookie
 *
 * @export
 * @param {string} name
 * @returns
 */
export function getCookie(name: string) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(name + '=');
    if (cStart !== -1) {
      cStart = cStart + name.length + 1;
      let cEnd = document.cookie.indexOf(';', cStart);
      if (cEnd === -1) {
        cEnd = document.cookie.length;
      }
      return unescape(document.cookie.substring(cStart, cEnd));
    }
  }
  return '';
}

/**
 * clearCookie
 *
 * @export
 * @param {string} name
 */
export function clearCookie(name: string) {
  setCookie(name, '');
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
