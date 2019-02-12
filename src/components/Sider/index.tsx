import { Layout, Icon } from 'antd';
import * as React from 'react';
import { observer, inject } from 'mobx-react';

import './index.less';
import SiderMenu from './Menu';

interface IStoreProps {
  sideBarCollapsed?: boolean;
  sideBarTheme?: IGlobalStore.SideBarTheme;
  changeSiderTheme?: (theme: IGlobalStore.SideBarTheme) => void;
}

@inject(
  (store: IStore): IStoreProps => {
    const { globalStore } = store;
    const { sideBarCollapsed, sideBarTheme } = globalStore;
    return {
      sideBarCollapsed,
      sideBarTheme,
    };
  }
)
@observer
class Sider extends React.Component<IStoreProps> {

  render() {
    const { sideBarCollapsed, sideBarTheme } = this.props;
    return (
      <Layout.Sider
        className="sider"
        trigger={null}
        theme={sideBarTheme}
        collapsible
        collapsed={sideBarCollapsed}
      >
        <div className={`logoBox ${sideBarTheme}`}>
          {
            sideBarCollapsed ? (
              <Icon type="ant-design" style={{fontSize: 30}}/>
            ) : (
              <span style={{ fontSize: 16 }}>React 基础框架</span>
            )
          }
        </div>
        <SiderMenu />
      </Layout.Sider>
    );
  }
}

export default Sider;
