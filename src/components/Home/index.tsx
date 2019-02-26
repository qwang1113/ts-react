import {
  Route,
  Switch,
  Redirect,
  Link,
  withRouter,
  RouteComponentProps,
  HashRouter as Router,
} from 'react-router-dom';
import * as React from 'react';
// import { hot } from 'react-hot-loader';
import { Layout, Breadcrumb } from 'antd';
import { inject, observer } from 'mobx-react';

import Sider from '@components/Sider';
import NotFound from '@components/NotFound';
import Header from '@components/Header';
import { getRoutesByPath, getStorage } from '@utils/index';

import menu, { IMenu } from '../../utils/menu';
import './index.less';

interface Props {
  selectedKey?: string;
  setSelectedKey?: (selectedKey: string) => void;
}

// @hot(module)
@inject(
  (store: IStore): Props => {
    const { globalStore: { setSelectedKey, selectedKey } } = store;
    return {
      selectedKey,
      setSelectedKey
    };
  }
)
@observer
class Home extends React.Component<RouteComponentProps & Props, {}> {

  constructor(props){
    super(props);
    if(!getStorage('token')){
      location.href = '/#/login';
    }
  }

  state = {};

  componentDidMount(){
    console.log(333);
  }

  /**
   * 监听路由变化, 将更新映射到globalStore的selectedKey中
   *
   * @static
   * @param {(RouteComponentProps<any> & Props)} props
   * @returns
   * @memberof Home
   */
  static getDerivedStateFromProps(props: RouteComponentProps & Props) {
    const { location: { pathname }, setSelectedKey } = props;
    setSelectedKey(pathname);
    return null;
  }

  /**
   * 创建面包屑
   * @memberof Home
   */
  createBreadCrumb = () => {
    const { selectedKey: pathname } = this.props;
    return getRoutesByPath(pathname, menu).map(route => {
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

export default withRouter(Home);
