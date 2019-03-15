import * as React from 'react';
import BaseComponent from '@components/Base';

import Table from '@components/Table/Table';
import ModalForm from '@components/ModalForm/ModalForm';
import { TableProps } from 'antd/lib/table';

interface IProps extends TableProps<any>{
  tableId: string
}

class FieldsTable extends BaseComponent<IProps, {}>{

  table = null;

  columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '字段类型',
    dataIndex: 'type',
    key: 'type',
  }, {
    title: '描述',
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
    const id = row.id;
    ModalForm.show({
      cols: 1,
      items: [{
        label: '名称',
        dataKey: 'name',
        type: 'Input',
        required: true,
        initialValue: row.name,
      }, {
        label: '数据表描述',
        dataKey: 'description',
        required: true,
        type: 'Input',
        initialValue: row.description,
      }, {
        label: '备注',
        dataKey: 'comment',
        type: 'Input',
        initialValue: row.comment,
      }, {
        label: 'id',
        dataKey: 'id',
        type: 'Input',
        initialValue: id + '',
        labelOptions: {
          style: {
            display: 'none'
          }
        }
      }],
      title: '编辑字段'
    }, async (values, close) => {
      const res = await this.$Post('/table/add', values);
      if (res) {
        this.table.fetchData();
        close();
      }
    });
  }

  render() {
    const { dataSource } = this.props;
    return (
      <div className="tables-container">
        <Table
          showIndex
          dataSource={dataSource}
          actionBtns={[{
            text: '编辑',
            type: 'edit',
            onClick: this.addOrEditTable
          }]}
          columns={this.columns}
        />
      </div>
    );
  }
}


export default FieldsTable;