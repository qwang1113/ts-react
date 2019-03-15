import dayjs from 'dayjs';
import { Table } from 'antd';
import * as React from 'react';
import { TableProps, ColumnProps } from 'antd/lib/table';
import BaseComponent from '@components/Base';
import { ButtonProps } from 'antd/lib/button';
import GenerateForm from '@components/GenerateForm';
import { IFormItemProps } from '@components/GenerateForm/createElement';
import GenerateFormBtns, { IActionBtn } from '@components/GenerateForm/CreateFormBtns';

import "./Table.less";
import Modal from '@components/Modal/Modal';

interface IState {
  size: number;
  page: number;
  total: number;
  data: IBaseObj[];
  loading: boolean;
  selectedRowKeys: Array<number>
}

interface IRowFunc {
  (row: any, index: number): any
}

interface ITableActionBtn {
  text: string;
  color?: string;
  disabled?: boolean | IRowFunc;
  visiable?: boolean | IRowFunc;
  type?: 'edit' | 'detail' | 'delete';
  onClick?: IRowFunc
}

interface IDeleteOption {
  batch?: boolean;
  url?: string;
  params?: object;
  disabled?: boolean | IRowFunc;
  visiable?: boolean | IRowFunc;
}

interface IDataOptions {
  url?: string;
  filterList?: IFormItemProps[];
  params?: object;
}

interface ISelectText {
  (rows: number[]): string | JSX.Element
}

interface IProps extends TableProps<{}> {
  deleteOption?: IDeleteOption
  dataOptions?: IDataOptions;
  showIndex?: boolean; // 是否显示索引列
  selectText?: ISelectText;
  btns?: (IActionBtn & ButtonProps & {
    withSelect?: boolean;
    onClick?: (any) => any
  })[];
  actionBtns?: ITableActionBtn[]
  onDataChanged?: (tableDataSource: Array<any>, filterValues: IBaseObj) => any;
  columns?: (ColumnProps<any> & {
    format?: string
  })[]
}

class BaseTable extends BaseComponent<IProps, IState>{

  static defaultProps = {
    showIndex: false,
    dataOptions: {},
    deleteOption: {},
    btns: []
  }

  state = {
    size: 10,
    page: 0,
    total: 0,
    data: [],
    loading: false,
    selectedRowKeys: [], // 表格已经选择的列
  }

  form = null;

  formRef = null;

  componentDidMount() {
    const { dataOptions, dataSource } = this.props;
    // 获取缓存的size
    const size = localStorage.getItem('tableSize') || 10;
    this.setState({ size: +size })
    if (Array.isArray(dataSource)) {
      this.setState({ data: dataSource });
    } else if (dataOptions.url) {
      this.fetchData();
    } else {
      console.warn('you must provide a source for this table');
    }
  }

  /**
   * 分页页码改变回调
   */
  changePage = (page, pageSize, ) => {
    this.setState({
      page: page - 1,
      size: pageSize,
    }, this.fetchData);
  };

  /**
   * pageSize改变
   * @param current
   * @param size
   */
  changePageSize = (current, size) => {
    // 将更改的size缓存到storage中
    localStorage.setItem('tableSize', size);
    this.setState({
      page: 0,
      size: size,
    }, this.fetchData);
  };

  /**
   * 重置搜索条件并重置页面
  */
  resetFilter = () => {
    this.form.resetFields();
    this.setState({
      size: 10,
      page: 0,
    }, this.fetchData);
  };

  /**
   * 当配置了表格加载数据时, 加载表格数据
   */
  async fetchData() {
    const { size, page } = this.state;
    const {
      dataOptions,
      onDataChanged,
    } = this.props;

    const {
      url,
      filterList,
      params
    } = dataOptions;
    const hasFilter = Array.isArray(filterList) && filterList.length > 0;
    this.setState({
      loading: true
    }, async () => {
      let filterValues = {};
      if (hasFilter) {
        filterValues = await this.formRef.getFormFieldsValue();
      }
      const res = await this.$Post(url, {
        ...params,
        ...filterValues,
        size,
        page
      });
      if (res) {
        const { content, total } = res;
        onDataChanged && onDataChanged(content, filterValues);
        this.setState(({ page }) => {
          return {
            page,
            total: total,
            data: content,
            loading: false,
            selectedRowKeys: []
          }
        })
      }
    });
  }

  /**
   * 获取计算后的表格列配置
   */
  getComputedColumns = (): ColumnProps<any>[] => {
    const { size, page } = this.state;
    const {
      columns,
      showIndex,
      actionBtns,
      deleteOption
    } = this.props;

    const { url: deleteUrl, disabled, visiable } = deleteOption;

    let computedColumns = [
      ...columns
    ];

    if (showIndex) {
      computedColumns.unshift({
        key: "index",
        title: '序号',
        dataIndex: 'index',
        align: 'left',
        render: (text, record, index) => {
          const key = size * page + index + 1;
          return key < 10 ? `0${key}` : key;
        },
      })
    }

    if (actionBtns && actionBtns.length) {
      computedColumns.push({
        key: "action",
        title: '操作',
        align: 'center',
        render: (text, row, index) => {
          let computedActionBtns = [...actionBtns];
          if (deleteUrl && !actionBtns.find(btn => btn.type === 'delete')) {
            computedActionBtns.push({
              disabled,
              visiable,
              text: '删除',
              type: 'delete',
              onClick: row => this.handleDeleteRows(row.id),
            });
          }
          const generateBtnFunc = (btns: ITableActionBtn[]) => {
            return btns.map(
              (btn: ITableActionBtn) => {
                return this.generateTableActionBtn(
                  row,
                  index,
                  btn,
                )
              }
            );
          }
          return generateBtnFunc(computedActionBtns);
        },
      });
    }

    return computedColumns.map(col => {
      if (col.render) {
        return col;
      }
      const formatFunc = (text, f) => text ? dayjs(text).format(f) : ''
      const { format, ...column } = col;
      const formatTypeFunc = [{
        type: 'date',
        format: text => formatFunc(text, 'YYYY-MM-DD')
      }, {
        type: 'datetime',
        format: text => formatFunc(text, 'YYYY-MM-DD HH:mm:ss')
      }]
      const findType = formatTypeFunc.find(t => t.type === format);
      if (format) {
        return {
          ...column,
          render: findType ? findType.format : (text => formatFunc(text, format))
        }
      }
      return column;
    });
  }

  /**
   * 生成表格按钮组
   * @param row object 表格行数据
   * @index number 行索引
   * @btn 行按钮配置
   */
  generateTableActionBtn = (
    row,
    index,
    btn,
  ) => {
    const {
      color,
      disabled,
      text,
      onClick,
      type,
      visiable = true
    } = btn;
    const colorsMap = {
      detail: 'blue',
      edit: 'green',
      delete: '#f55'
    }
    const computedDisabled = typeof disabled === 'function' ? disabled(row, index) : disabled;
    const computedVisiable = typeof visiable === 'function' ? visiable(row, index) : visiable;
    if (!computedVisiable) {
      return null;
    }
    return (
      <span
        key={btn.text}
        className={
          `app-table-action-btn ${computedDisabled ? 'disabled' : ''}`
        }
        style={{ color: color || colorsMap[type] }}
        onClick={() => {
          if (computedDisabled) {
            return;
          }
          if (onClick) {
            onClick(row, index);
          } else {
            if (btn.type === 'delete') {
              this.handleDeleteRows(row.id);
            }
          }
        }}
      >
        {text}
      </span>
    )
  }

  /**
   * 行选择change时
   * @param selectedRowKeys Array<number> 选择的行Key
   */
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  /**
   * 多选删除按钮
   * @param selectedRowKeys Array<number> 待删除项目id
   */
  handleDeleteRows = async (id) => {
    const { deleteOption } = this.props;
    const { selectedRowKeys } = this.state;
    const hasId = typeof id === 'number';
    const { url: deleteUrl, params: deleteParams } = deleteOption;
    try {
      await Modal.comfirm({
        title: '提示',
        content: '确定删除吗?'
      });
      const res = await this.$Get(deleteUrl, {
        idList: hasId ? [id] : selectedRowKeys,
        ...deleteParams
      });
      if (res) {
        this.setState({
          selectedRowKeys: [],
        }, this.fetchData);
      }
    } catch (error) { }
  }

  /**
   * 生成选择之后的自定义按钮, 可根据传入的deleteUrl生成默认的删除按钮以及方法
   */
  generateTableBtns() {
    const { selectedRowKeys } = this.state;
    const { btns, deleteOption, selectText } = this.props;
    const { batch: batchDelete, url: deleteUrl } = deleteOption;
    const hasSelected = selectedRowKeys.length > 0;
    const isNeedShowSelect = !!btns.find(({ withSelect }) => !!withSelect) || deleteUrl;
    if (
      !deleteUrl
      && (!btns || btns.length === 0)
    ) {
      return null;
    }
    let computedBtns = btns.map(({ withSelect, ...btn }) => {
      return {
        ...btn,
        disabled: !hasSelected && withSelect,
        onClick: withSelect
          ? () => {
            btn.onClick && btn.onClick(selectedRowKeys);
          }
          : btn.onClick
      }
    });
    if (deleteUrl && batchDelete) {
      computedBtns.unshift({
        disabled: !hasSelected,
        text: '删除',
        onClick: this.handleDeleteRows,
      });
    }

    return (
      <div className="app-table-selectarea">
        {
          <React.Fragment>
            {
              computedBtns.length > 0 && (
                <GenerateFormBtns
                  btns={computedBtns}
                  className="app-table-selectarea-btns"
                />
              )
            }
            {
              isNeedShowSelect && hasSelected && (
                <span style={{ marginLeft: 8 }}>
                  {selectText ? selectText(selectedRowKeys) : `已选 ${selectedRowKeys.length} 项`}
                </span>
              )
            }
          </React.Fragment>
        }
      </div>
    )
  }

  render() {
    const {
      size,
      data,
      page,
      total,
      loading,
      selectedRowKeys
    } = this.state;
    const {
      columns,
      className,
      btns,
      style,
      deleteOption,
      dataOptions,
      ...props
    } = this.props;
    /* 是否需要显示表格选择列需要满足以下条件某一项
      1. 传入deleteUrl时
      2. btns中某一项包含withSelect时 
    */
    const { batch: batchDelete, url: deleteUrl } = deleteOption;
    const {
      filterList,
    } = dataOptions;
    const hasFilter = Array.isArray(filterList) && filterList.length > 0;
    const isNeedShowSelect = !!btns.find(({ withSelect }) => !!withSelect)
      || (deleteUrl && batchDelete);
    const rowKeyFunc = (record: IDataRow, idx) => {
      if (isNeedShowSelect) {
        return `${record.id}`;
      }
      return `${record.id}` || `${idx}`;
    };

    const rowSelection = isNeedShowSelect ? {
      selectedRowKeys,
      columnWidth: '0.2rem',
      onChange: this.onSelectChange,
    } : null;
    return (
      <div
        className={`app-table ${className}`}
        style={{ backgroundColor: '#fff', ...style }}
      >
        {
          hasFilter && (
            <div className="app-table-search-bar">
              <GenerateForm
                cols={3}
                items={filterList}
                className="search-bar-form"
                btns={[{
                  text: '筛选',
                  type: 'primary',
                  onClick: this.fetchData.bind(this)
                }, {
                  text: '重置',
                  onClick: this.resetFilter.bind(this)
                }]}
                getForm={form => this.form = form}
                wrappedComponentRef={ref => this.formRef = ref}
              />
            </div>
          )
        }
        {
          this.generateTableBtns()
        }
        <Table
          size="middle"
          dataSource={data}
          loading={loading}
          rowKey={rowKeyFunc}
          rowSelection={rowSelection}
          columns={this.getComputedColumns()}
          className={`app-base-table`}
          pagination={{
            total,
            current: page + 1,
            pageSize: size,
            showTotal: total => `共 ${total} 条`,
            pageSizeOptions: ['3', '10', '20', '40',],
            size: 'small',
            showSizeChanger: true,
            onChange: this.changePage,
            onShowSizeChange: this.changePageSize,
          }}
          {...props}
        />
      </div>
    );
  }
}


export default BaseTable;