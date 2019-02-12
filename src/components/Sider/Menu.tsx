import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { computed } from 'mobx';
import { Menu, Icon } from 'antd';

import menu, { IMenu } from '@utils/menu';
import './index.less';

const { SubMenu } = Menu;

interface IStoreProps {
  sideBarTheme?: IGlobalStore.SideBarTheme;
  navOpenKeys?: string[];
  selectedKey?: string;
  setOpenKeys?: (openKeys: string[]) => void;
  setSelectedKey?: (selectedKey: string) => void;
  routerStore?: RouterStore;
  sideBarCollapsed?: boolean;
}

@inject(
  (store: IStore): IStoreProps => {
    const { routerStore, globalStore } = store;
    const {
      sideBarTheme,
      navOpenKeys,
      setOpenKeys,
      selectedKey,
      setSelectedKey,
      sideBarCollapsed
    } = globalStore;
    return {
      routerStore,
      sideBarTheme,
      navOpenKeys,
      setOpenKeys,
      selectedKey,
      setSelectedKey,
      sideBarCollapsed
    };
  }
)
@observer
class SiderMenu extends React.Component<IStoreProps> {

  @computed
  get currentRoute() {
    return this.props.routerStore.location.pathname;
  }

  // 递归生成菜单
  getMenus = (menus: IMenu[], prefix = '') => {
    return menus.map(singleMenu => {
      if (singleMenu.children) {
        const SubMenuEl = singleMenu.showInMenu !== false ? (
          <SubMenu
            key={prefix + singleMenu.path}
            title={
              <span>
                {singleMenu.icon && <Icon type={singleMenu.icon} />}
                <span>{singleMenu.title}</span>
              </span>
            }
          >
            {
              this.getMenus(singleMenu.children, prefix = prefix + singleMenu.path)
            }
          </SubMenu>
        ) : null;
        prefix = ''; // 需要清除之前的状态
        return SubMenuEl;
      }
      return singleMenu.showInMenu !== false ? (
        <Menu.Item key={prefix + singleMenu.path}>
          {singleMenu.icon && <Icon type={singleMenu.icon} />}
          <span>{singleMenu.title}</span>
        </Menu.Item>
      ) : null;
    });
  }

  /**
   * 选择菜单项目
   * @param key string 菜单key
   * @memberof SiderMenu
   */
  selectMenu = ({ key }: { key: string }) => {
    const { history } = this.props.routerStore;
    const { setSelectedKey } = this.props;
    setSelectedKey(key);
    history.push(key);
  }

  /**
   * 菜单展开
   *
   * @memberof SiderMenu
   */
  openMenu = openKeys => {
    const { setOpenKeys } = this.props;
    setOpenKeys(openKeys);
  }

  render() {
    const {
      sideBarTheme,
      navOpenKeys,
      selectedKey,
      sideBarCollapsed
    } = this.props;
    return (
      <Menu
        className="menu"
        theme={sideBarTheme}
        mode="inline"
        openKeys={navOpenKeys}
        selectedKeys={[selectedKey]}
        onSelect={this.selectMenu}
        onOpenChange={this.openMenu}
        inlineCollapsed={sideBarCollapsed}
      >
        {this.getMenus(menu)}
      </Menu>
    );
  }
}

export default SiderMenu;
