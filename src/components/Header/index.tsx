import * as React from 'react';
import { Layout, Icon } from 'antd';
import { inject, observer } from 'mobx-react';

import './index.less';


interface IStoreProps {
  sideBarCollapsed?: boolean;
  toggleSideBarCollapsed?: () => void;
}

function Header({ sideBarCollapsed, toggleSideBarCollapsed }: IStoreProps) {
  return (
    <Layout.Header className='header'>
      <Icon
        className="trigger"
        type={sideBarCollapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={toggleSideBarCollapsed}
      />
      {/* <div className="right">
        <Icon className="right-icon" type="logout" theme="outlined" onClick={logout} />
      </div> */}
    </Layout.Header>
  );
}

export default inject(
  (store: IStore): IStoreProps => {
    const { globalStore } = store;
    const { sideBarCollapsed, toggleSideBarCollapsed } = globalStore;
    return { sideBarCollapsed, toggleSideBarCollapsed };
  }
)(observer(Header));
