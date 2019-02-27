import {
  Route,
  Switch,
  Redirect,
  Link,
  HashRouter as Router,
} from 'react-router-dom';
import * as React from 'react';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import { Layout, Breadcrumb } from 'antd';

import Sider from '@components/Sider';
import NotFound from '@components/NotFound';
import Header from '@components/Header';
import { getRoutesByPath, getStorage } from '@utils/index';

import menu, { IMenu } from '../../utils/menu';
import './index.less';
import BaseComponent from '@components/Base';

interface IStoreProps {
  routerStore?: RouterStore;
}

@hot(module)
@inject(
  (store: IStore): IStoreProps => {
    const { routerStore } = store;
    return {
      routerStore,
    };
  }
)
@observer
class Home extends BaseComponent<IStoreProps, {}> {

  state = {}

  @computed
  get selectedKeys() {
    return this.props.routerStore.location.pathname;
  }

  constructor(props) {
    super(props);
    if (!getStorage('token')) {
      location.href = '/#/login';
    }
  }

  static getDerivedStateFromProps(props) {
    const pathname = props.routerStore.location.pathname;
    const routes = getRoutesByPath(pathname, menu);
    if (!routes || routes.length === 0) {
      return;
    }
    document.title = routes.pop().title;
    return null;
  }

  /**
   * 创建面包屑
   * @memberof Home
   */
  createBreadCrumb = () => {
    return getRoutesByPath(this.selectedKeys, menu).map(route => {
      return (
        <Breadcrumb.Item key={route.title}>
          {route.title}
        </Breadcrumb.Item>
      );
    });
  }

  /**
   * 递归创建路由
   * @param menus 路由列表
   * @param prefix string 前缀path
   * @memberof Home
   */
  createRoutes = (menus: IMenu[], prefix: string = '') => {
    let routes = [];
    for (const singleMenu of menus) {
      if (singleMenu.children) {
        routes = routes.concat(this.createRoutes(singleMenu.children, prefix = prefix + singleMenu.path));
        prefix = '';
      } else {
        routes.push(
          <Route
            key={prefix + singleMenu.path}
            exact={singleMenu.exact !== false}
            path={prefix + singleMenu.path}
            component={() => React.createElement(singleMenu.component || null)}
          />
        );
      }
    }
    return routes;
  }

  render() {
    const home = menu[0].path;
    return (
      <Layout>
        <Sider />
        <Layout>
          <Header />
          <Layout.Content className="content">
            <Breadcrumb style={{ display: 'block' }}>
              <Breadcrumb.Item>
                <Link to={home}>主页</Link>
              </Breadcrumb.Item>
              {this.createBreadCrumb()}
            </Breadcrumb>
            <Router>
              <Switch>
                <Route exact path="/" render={() => (<Redirect to={home} />)} />
                {this.createRoutes(menu)}
                <Route component={() => <NotFound />} />
              </Switch>
            </Router>
          </Layout.Content>
        </Layout>
      </Layout >
    );
  }
}

export default Home;
