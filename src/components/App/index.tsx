import {
  Route,
  Switch,
  withRouter,
  HashRouter as Router,
  RouteComponentProps
} from 'react-router-dom';
import { LocaleProvider } from 'antd';
// import { hot } from 'react-hot-loader';
import React, { useEffect } from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import './index.less';
import Loading from '@components/Loading';
import { getRoutesByPath } from '@utils/index';
import menu, { Login, PublicHome, NotFound } from '@utils/menu';

const AppWrapper = props => <div className="appWrapper">{props.children}</div>;

const AppRouter = (props: RouteComponentProps) => {
  useEffect(() => {
    const { pathname } = props.location;
    const routes = getRoutesByPath(pathname, menu);
    if (!routes || routes.length === 0) {
      return;
    }
    document.title = routes.pop().title;
  });
  return (
    <LocaleProvider locale={zhCN}>
      <AppWrapper>
        <Router>
          <React.Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path="/login" component={() => <Login />} />
              <Route path="/" component={() => <PublicHome />} />
              <Route component={() => <NotFound />} />
            </Switch>
          </React.Suspense>
        </Router>
      </AppWrapper>
    </LocaleProvider>
  );
}

export default withRouter(AppRouter);
// export default hot(module)(withRouter(AppRouter));
