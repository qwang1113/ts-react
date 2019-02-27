import {
  Route,
  Switch,
  HashRouter as Router,
} from 'react-router-dom';
import { LocaleProvider } from 'antd';
import React from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import './index.less';
import Loading from '@components/Loading';
import { Login, PublicHome, NotFound } from '@utils/menu';

const AppWrapper = props => <div className="appWrapper">{props.children}</div>;

const AppRouter = () => {
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

export default AppRouter;
