import React, { lazy, Component } from 'react';
import { hot } from 'react-hot-loader';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import './index.less';
import Loading from '@components/Loading';

const AppWrapper = props => <div className="appWrapper">{props.children}</div>;

const Home = lazy(() => import('@components/Home'));
const Login = lazy(() => import('@pages/Login'));
const NotFound = lazy(() => import('@components/NotFound'));

class AppRouter extends Component<{}> {
  render() {
    return (
      <AppWrapper>
        <Router>
          <React.Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path="/login" component={() => <Login />} />
              <Route path="/" component={() => <Home />} />
              {/* <PrivateRoute path="/" component={Home} /> */}
              <Route component={() => <NotFound />} />
            </Switch>
          </React.Suspense>
        </Router>
      </AppWrapper>
    );
  }
}

export default hot(module)(AppRouter);
