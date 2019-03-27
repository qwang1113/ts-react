import * as React from 'react';
import BaseComponent from '@components/Base';

import Table from '@components/Table/Table';
import ModalForm from '@components/ModalForm/ModalForm';
import FieldsTable from './FieldsTable';
import { TableColumns, GenerateAddOrEditFieldSchema, AddOrEditTableSchema } from './schema';
import { bindInitialValueWithSchema, generateHiddenFormItem } from '@utils/util';

const Form = ModalForm();

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

  fieldRefs: IBaseObj = {};

  addOrEditTable = (row: any) => {
    let id = null;
    if (row && typeof row.id !== undefined) {
      id = row.id;
    }
    ModalForm().show({
      cols: 1,
      items: id ? bindInitialValueWithSchema(
        [...AddOrEditTableSchema, generateHiddenFormItem('id', id)],
        row
      ) : AddOrEditTableSchema,
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
    ModalForm().show({
      title: '新增字段',
      cols: 1,
      items: GenerateAddOrEditFieldSchema(row.id)
    }, async (values, close) => {
      const res = await this.$Post('/field/add', values);
      if (res) {
        const currentRef = this.fieldRefs[row.id];
        if (currentRef) {
          currentRef.fetchData();
        }
        close();
      }
    });
    ModalForm().show({
      title: '新增字段',
      cols: 1,
      items: GenerateAddOrEditFieldSchema(row.id)
    }, async (values, close) => {
      const res = await this.$Post('/field/add', values);
      if (res) {
        const currentRef = this.fieldRefs[row.id];
        if (currentRef) {
          currentRef.fetchData();
        }
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
          columns={TableColumns}
          selectText={(rows) => {
            return `已选: ${rows.length}项`
          }}
          expandedRowRender={(row: any) => {
            return (
              <FieldsTable
                tableId={row.id}
                ref={ref => this.fieldRefs[row.id] = ref}
              />
            )
          }}
        />
      </div>
    );
  }
}


export default Tables;