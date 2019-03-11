import * as React from 'react';
import BaseComponent from '@components/Base';

import Table from '@components/Table/Table';
import ModalForm from '@components/ModalForm/ModalForm';

const filterList = [{
  label: '名称',
  dataKey: 'search',
  type: 'Input',
  placeholder: '请输入...'
}];

class Tables extends BaseComponent<{}, {}>{

  state = {
    type: 'text'
  }

  table = null;

  columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '数据表描述',
    dataIndex: 'description',
    key: 'description',
  }, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    format: 'datetime'
  }]

  addTable = () => {
    ModalForm.show({
      cols: 1,
      items: [{
        label: '名称',
        dataKey: 'name',
        type: 'Input',
        required: true,
      }, {
        label: '数据表描述',
        dataKey: 'description',
        required: true,
        type: 'Input',
      }, {
        label: '备注',
        dataKey: 'comment',
        type: 'Input',
      }],
      title: '新增数据表'
    }, async (values, close) => {
      const res = await this.$Post('/table/add', values);
      if (res) {
        this.table.fetchData();
        close();
      }
    });
  }

  render() {
    return (
      <div className="tables-container">
        <Table
          showIndex
          ref={ref => this.table = ref}
          deleteOption={{
            batch: true,
            url: '/table/delete',
          }}
          dataOptions={{
            url: '/tables',
            filterList: filterList,
          }}
          btns={[{
            text: '新增数据表',
            // withSelect: true,
            onClick: this.addTable
          }]}
          actionBtns={[{
            text: '编辑',
            type: 'edit',
            // onClick: this.handleEditUser
          }]}
          columns={this.columns}
          selectText={(rows) => {
            return `已选: ${rows.length}项`
          }}
        // onDataChanged={(data, filter) => {
        //   console.log(data, filter);
        // }}
        />
      </div>
    );
  }
}


export default Tables;