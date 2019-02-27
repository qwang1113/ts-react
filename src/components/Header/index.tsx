import * as React from 'react';
import { Layout, Icon } from 'antd';
import * as Cookie from 'js-cookie';
import { inject, observer } from 'mobx-react';

import './index.less';
import BaseComponent from '@components/Base';


interface IStoreProps {
  sideBarCollapsed?: boolean;
  toggleSideBarCollapsed?: () => void;
  routerStore?: RouterStore
}


@inject(
  (store: IStore): IStoreProps => {
    const { globalStore, routerStore } = store;
    const { sideBarCollapsed, toggleSideBarCollapsed } = globalStore;
    return { sideBarCollapsed, toggleSideBarCollapsed, routerStore };
  }
)
@observer
class Header extends BaseComponent<IStoreProps, {}>{

  /**
   * 退出登录操作
   */
  logout = () => {
    Cookie.remove('token');
    sessionStorage.removeItem('token');
    this.props.routerStore.push('/login');
  }

  render() {
    const { sideBarCollapsed, toggleSideBarCollapsed } = this.props;
    return (
      <Layout.Header className='header'>
        <Icon
          className="trigger"
          type={sideBarCollapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggleSideBarCollapsed}
        />
        <div className="right">
          <Icon className="right-icon" type="logout" theme="outlined" onClick={this.logout} />
        </div>
      </Layout.Header>
    );
  }
}

export default Header;
