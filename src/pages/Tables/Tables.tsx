import * as React from 'react';
import BaseComponent from '@components/Base';

import "./Tables.less";
import Table from '@components/Table/Table';

const filterList = [{
  label: '用户名',
  dataKey: 'search',
  type: 'Input',
  placeholder: '请输入...'
}];

class Tables extends BaseComponent<{}, {}>{
  columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  }]

  render() {
    return (
      <div className="tables-container">
        <Table
          showFilter
          filterList={filterList}
          url="/users"
          params={{order_func: 'ASC', order_by: 'id'}}
          columns={this.columns}
        />
      </div>
    );
  }
}


export default Tables;