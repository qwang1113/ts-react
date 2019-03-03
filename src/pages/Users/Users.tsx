import * as React from 'react';
import BaseComponent from '@components/Base';

import "./Users.less";
import Table from '@components/Table/Table';
import { getSessionStorage } from '@utils/util';

const filterList = [{
  label: '用户名',
  dataKey: 'search',
  type: 'Input',
  placeholder: '请输入...'
}, {
  label: '注册时间',
  dataKey: 'rigistTime',
  type: 'RangePicker'
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
    console.log(getSessionStorage('userInfo'));
    const userInfo = JSON.parse(getSessionStorage('userInfo') || '{}');
    return (
      <div className="tables-container">
        <Table
          showFilter
          showIndex
          batchDelete
          btns={[{
            text: '新增用户',
            // withSelect: true,
            onClick: (rows) => {
              console.log(rows);
            }
          }]}
          actionBtns={[{
            text: '详情',
            type: 'detail',
            onClick: (row, idx) => {
              console.log(row, idx);
            }
          }, {
            text: '编辑',
            type: 'edit',
            onClick: (row, idx) => {
              console.log(row, idx);
            }
          }, {
            text: '删除',
            type: 'delete',
            disabled: ({ id }) => id === userInfo.id,
            // 一下条件同时满足则调用表格默认删除方法
            // 1. 当deleteUrl传入
            // 2. type==='delete'
            // 3. onClick不传
          }]}
          deleteParams={{}}
          deleteUrl="/user/delete"
          filterList={filterList}
          url="/users"
          params={{ order_func: 'ASC', order_by: 'id' }}
          columns={this.columns}
          onDataChanged={(data, filter) => {
            console.log(data, filter);
          }}
        />
      </div>
    );
  }
}


export default Tables;