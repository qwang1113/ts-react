import * as React from 'react';
import { configure } from 'mobx';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import createHashHistory from 'history/createHashHistory';
import { syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';
import * as store from './stores';
import App from '@components/App';

import './index.less';

configure({ enforceActions: 'observed' });

const hashHistory = createHashHistory();
const history = syncHistoryWithStore(hashHistory, store.routerStore);

render(
  <Provider {...store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);

((doc, win) => {
  const docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = () => {
      const scrollWidth = docEl.scrollWidth;
      if (!scrollWidth) { return; }
      if (scrollWidth > 1366) {
        docEl.style.fontSize = Math.floor(100 * (scrollWidth / 1920)) + 'px';
      } else {
        docEl.style.fontSize = Math.floor(100 * (1366 / 1700)) + 'px';
        docEl.style.minWidth = '1200px';
      }
    };
  if (!doc.addEventListener) { return; }
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);