import * as React from 'react';
import BaseComponent from '@components/Base';

import Table from '@components/Table/Table';
import ModalForm from '@components/ModalForm/ModalForm';
import { TableProps } from 'antd/lib/table';
import { FieldsCols, GenerateAddOrEditFieldSchema } from './schema';
import { bindInitialValueWithSchema } from '@utils/util';

interface IProps extends TableProps<any> {
  tableId: string
}

class FieldsTable extends BaseComponent<IProps, {}>{

  table = null;

  editField = (row: any) => {
    const { tableId } = this.props;
    ModalForm().show({
      cols: 1,
      items: bindInitialValueWithSchema(
        GenerateAddOrEditFieldSchema(tableId, row.id),
        row
      ),
      title: '编辑字段'
    }, async (values, close) => {
      const res = await this.$Post('/field/add', values);
      if (res) {
        this.table.fetchData();
        close();
      }
    });
  }

  fetchData = () => this.table && this.table.fetchData()

  render() {
    const { tableId } = this.props;
    return (
      <Table
        showIndex
        dataOptions={{
          url: '/fields',
          params: {
            tableId
          }
        }}
        deleteOption={{
          batch: true,
          url: '/field/delete',
        }}
        actionBtns={[{
          text: '编辑',
          type: 'edit',
          onClick: this.editField
        }]}
        columns={FieldsCols}
        pagination={false}
        style={{ paddingTop: 0 }}
        ref={ref => this.table = ref}
      />
    );
  }
}


export default FieldsTable;