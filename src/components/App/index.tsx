import {
  Route,
  Switch,
} from 'react-router-dom';
import { LocaleProvider } from 'antd';
import React from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import './index.less';
import Home from '@components/Home';
import Login from '@pages/Login/Login';

const AppWrapper = props => <div className="appWrapper">{props.children}</div>;

const AppRouter = () => {
  return (
    <LocaleProvider locale={zhCN}>
      <AppWrapper>
        <Switch>
          <Route exact path="/login" component={() => <Login />} />
          <Route path="/" component={() => <Home />} />
        </Switch>
      </AppWrapper>
    </LocaleProvider>
  );
}

export default AppRouter;
