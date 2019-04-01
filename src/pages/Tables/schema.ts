// 数据表tableCols
export const TableColumns = [{
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
}];

/**
 * 新增字段
 * @param id number 表格id
 */
export const GenerateAddOrEditFieldSchema = (tableId: string, fieldId?: string) => {
  return [{
    label: 'tableId',
    dataKey: 'tableId',
    type: 'Input',
    initialValue: tableId + '',
    labelOptions: {
      style: {
        display: 'none'
      }
    }
  },
  fieldId ? {
    label: 'id',
    dataKey: 'id',
    type: 'Input',
    initialValue: fieldId + '',
    labelOptions: {
      style: {
        display: 'none'
      }
    }
  } : undefined,
  {
    label: '名称',
    dataKey: 'name',
    type: 'Input',
    required: true,
  }, {
    label: '字段类型',
    dataKey: 'type',
    type: 'Select',
    required: true,
    options: [
      'string',
      'number',
      'boolean'
    ]
  }, {
    label: '数据表描述',
    dataKey: 'description',
    type: 'Input',
  }, {
    label: '备注',
    dataKey: 'comment',
    type: 'Input',
  }];
}

// 新增或编辑数据表

export const AddOrEditTableSchema = [{
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
}];


// 数据字段的表头配置
export const FieldsCols = [{
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
}];