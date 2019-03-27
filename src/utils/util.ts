import { get } from 'lodash';
import { IMenu } from './menu';
import { IFormItemProps } from '@components/GenerateForm/createElement';

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

/**
 * 将表单配置与数据值绑定
 * @param schema schema列表
 * @param data 需要bind的数据
 */
export const bindInitialValueWithSchema = (
  schemaList: IFormItemProps[],
  data: IBaseObj,
  key = 'initialValue'
) => {
  return schemaList.map(schema => {
    const type = schema.type;
    const value = get(data, schema.dataKey);
    return {
      ...schema,
      [key]: type === 'Input' ? (value || '') + '' : value
    }
  });
}

/**
 * 生成表单隐藏项目配置
 * @param key dataKey
 * @param type? 组件类型
 */
export const generateHiddenFormItem = (
  key: string,
  value: any,
  type: IFormItemProps['type'] = 'Input'
) => {
  return {
    dataKey: key,
    type: type || 'Input',
    initialValue: type === 'Input' ? (value || '') + '' : value,
    labelOptions: {
      style: {
        display: 'none'
      }
    }
  }
}