import * as React from 'react';
import BaseComponent from '@components/Base';

import "./Users.less";
import Table from '@components/Table/Table';
import { getSessionStorage } from '@utils/util';
import ModalForm from '@components/ModalForm/ModalForm';

const filterList = [{
  label: '用户名',
  dataKey: 'search',
  type: 'Input',
  placeholder: '请输入...'
}, {
  label: '注册时间',
  dataKey: 'rigistTime1',
  type: 'RangePicker'
}, {
  label: '注册时间',
  dataKey: 'rigistTime2',
  type: 'RangePicker'
}, {
  label: '注册时间',
  dataKey: 'rigistTime3',
  type: 'RangePicker'
}, {
  label: '注册时间',
  dataKey: 'rigistTime4',
  type: 'RangePicker'
}, {
  label: '注册时间',
  dataKey: 'rigistTime5',
  type: 'RangePicker'
}, {
  label: '注册时间',
  dataKey: 'rigistTime6',
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

  handleAddNewUser = async () => {
    ModalForm.setItems(filterList).show({
      title: '新增用户'
    }, (values, close) => {
      console.log(values);
      close();
    });
  }

  render() {
    const userInfo = JSON.parse(getSessionStorage('userInfo') || '{}');
    return (
      <div className="tables-container">
        <Table
          showIndex
          deleteOption={{
            batch: true,
            url: '/user/delete',
            params: {},
            disabled: ({ id }) => id === userInfo.id,
            visiable: ({ id }) => id === userInfo.id,
          }}
          dataOptions={{
            url: '/users',
            filterList: filterList,
            params: {order_func: 'ASC', order_by: 'id'},
          }}
          btns={[{
            text: '新增用户',
            // withSelect: true,
            onClick: this.handleAddNewUser
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
          }]}
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