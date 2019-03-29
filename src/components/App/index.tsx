import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Cookie from 'js-cookie';
import { LocaleProvider } from 'antd';
import React from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import './index.less';
import Home from '@components/Home';
import Login from '@pages/Login/Login';
import { getSessionStorage } from '@utils/util';

const AppWrapper = (props: { children: React.ReactNode; }) => <div className="appWrapper">{props.children}</div>;

const AppRouter = () => {
  const token = Cookie.get('token') || getSessionStorage('token');
  return (
    <LocaleProvider locale={zhCN}>
      <AppWrapper>
        <Switch>
          <Route exact path="/login" component={() => <Login />} />
          <Route path="/" component={() => token ? <Home /> : <Redirect to="/login"/>} />
        </Switch>
      </AppWrapper>
    </LocaleProvider>
  );
}

export default AppRouter;
