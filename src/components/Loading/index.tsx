import * as React from 'react';
import { Spin } from 'antd';

import './index.less';

function Loading() {
  return (
    <div className="page-loading">
      <Spin className="page-loading-spin" size="large"/>
    </div>
  );
}

export default Loading;
