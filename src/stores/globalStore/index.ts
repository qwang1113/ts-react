import { observable, action } from 'mobx';

enum LOCALSTORAGE_KEYS {
  USERINFO = 'userInfo',
  NAV_OPEN_KEYS = 'navOpenKeys',
  SIDE_BAR_THEME = 'sideBarTheme',
  SIDE_BAR_COLLAPSED = 'sideBarCollapsed',
}

export class GlobalStore {
  /**
   * 菜单栏折叠
   *
   * @type {boolean}
   * @memberof GlobalStore
   */
  @observable
  sideBarCollapsed: boolean = localStorage.getItem(LOCALSTORAGE_KEYS.SIDE_BAR_COLLAPSED) === '1';
  /**
   * 菜单栏主题
   *
   * @type {IGlobalStore.SideBarTheme}
   * @memberof GlobalStore
   */
  @observable
  sideBarTheme: IGlobalStore.SideBarTheme = (
    (localStorage.getItem(LOCALSTORAGE_KEYS.SIDE_BAR_THEME) as IGlobalStore.SideBarTheme) || 'light'
  );

  /**
   * 打开的菜单key
   *
   * @type {string[]}
   * @memberof GlobalStore
   */
  @observable
  navOpenKeys: string[] = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.NAV_OPEN_KEYS)) || [];

  /**
   * 折叠菜单
   * @memberof GlobalStore
   */
  @action
  toggleSideBarCollapsed = () => {
    this.sideBarCollapsed = !this.sideBarCollapsed;
    localStorage.setItem(LOCALSTORAGE_KEYS.SIDE_BAR_COLLAPSED, this.sideBarCollapsed ? '1' : '0');
  }

  /**
   * 打开关闭menu
   * @param openKeys string[] 打开的项目keys
   * @memberof GlobalStore
   */
  @action
  setOpenKeys = (openKeys: string[]) => {
    this.navOpenKeys = openKeys;
    localStorage.setItem(LOCALSTORAGE_KEYS.NAV_OPEN_KEYS, JSON.stringify(openKeys));
  }
}

export default new GlobalStore();
