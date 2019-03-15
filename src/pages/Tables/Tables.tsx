import * as React from 'react';
import BaseComponent from '@components/Base';

import Table from '@components/Table/Table';
import ModalForm from '@components/ModalForm/ModalForm';
import FieldsTable from './FieldsTable';

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
    dataIndex: 'comment',
    key: 'comment',
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    format: 'datetime'
  }]

  addOrEditTable = (row: any) => {
    let id = null;
    if (row && typeof row.id !== undefined) {
      id = row.id;
    }
    ModalForm.show({
      cols: 1,
      items: [{
        label: '名称',
        dataKey: 'name',
        type: 'Input',
        required: true,
        initialValue: id ? row.name : '',
      }, {
        label: '数据表描述',
        dataKey: 'description',
        required: true,
        type: 'Input',
        initialValue: id ? row.description : '',
      }, {
        label: '备注',
        dataKey: 'comment',
        type: 'Input',
        initialValue: id ? row.comment : '',
      }, id ? {
        label: 'id',
        dataKey: 'id',
        type: 'Input',
        initialValue: id + '',
        labelOptions: {
          style: {
            display: 'none'
          }
        }
      } : null],
      title: (id ? '编辑' : '新增') + '数据表'
    }, async (values, close) => {
      const res = await this.$Post('/table/add', values);
      if (res) {
        this.table.fetchData();
        close();
      }
    });
  }

  addField = (row: any) => {
    ModalForm.show({
      title: '新增字段',
      cols: 1,
      items: [{
        label: 'tableId',
        dataKey: 'tableId',
        type: 'Input',
        initialValue: row.id + '',
        labelOptions: {
          style: {
            display: 'none'
          }
        }
      }, {
        label: '名称',
        dataKey: 'name',
        type: 'Input',
        required: true,
      }, {
        label: '字段类型',
        dataKey: 'type',
        type: 'Select',
        required: true,
        options: [{
          label: 'string',
          value: 'string'
        }, {
          label: 'number',
          value: 'number'
        }]
      }, {
        label: '数据表描述',
        dataKey: 'description',
        type: 'Input',
      }, {
        label: '备注',
        dataKey: 'comment',
        type: 'Input',
      }]
    }, async (values, close) => {
      const res = await this.$Post('/table/addField', values);
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
          ref={ref => this.table = ref}
          deleteOption={{
            url: '/table/delete',
          }}
          dataOptions={{
            url: '/tables',
            filterList: filterList,
          }}
          btns={[{
            text: '新增数据表',
            onClick: this.addOrEditTable
          }]}
          actionBtns={[{
            text: '新建字段',
            type: 'detail',
            onClick: this.addField
          }, {
            text: '编辑',
            type: 'edit',
            onClick: this.addOrEditTable
          }]}
          columns={this.columns}
          selectText={(rows) => {
            return `已选: ${rows.length}项`
          }}
          expandedRowRender={(row: any) => {
            return (
              <FieldsTable 
                tableId={row.id}
                dataSource={row.fields || []} 
              />
            )
          }}
        />
      </div>
    );
  }
}


export default Tables;