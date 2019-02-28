import * as React from 'react';
import BaseComponent from '@components/Base';

import "./Table.less";
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import GenerateForm from '@components/GenerateForm';
import { IFormItemProps } from '@components/GenerateForm/createElement';
import GenerateFormBtns, { IFormBtnProps } from '@components/GenerateForm/CreateFormBtns';

interface IState {
  size: number;
  page: number;
  total: number;
  data: IBaseObj[];
  loading: boolean;
  selectedRowKeys: Array<number>
}

interface IProps extends TableProps<{}> {
  showFilter?: boolean; // 是否展示筛选栏
  showIndex?: boolean; // 是否显示索引列
  showSelect?: boolean; // 行是否可选
  filterList?: IFormItemProps[];
  url?: string;
  params?: object;
  onDataChanged?: (tableDataSource: Array<any>, filterValues: IBaseObj) => any;
  selectActionBtns: IFormBtnProps[]
}

class BaseTable extends BaseComponent<IProps, IState>{

  state = {
    size: 10,
    page: 0,
    total: 0,
    loading: false,
    data: [],
    selectedRowKeys: [], // 表格已经选择的列
  }

  form = null;

  componentDidMount() {
    const { url, dataSource } = this.props;
    // 获取缓存的size
    const size = localStorage.getItem('tableSize') || 10;
    this.setState({ size: +size })
    if (Array.isArray(dataSource)) {
      this.setState({ data: dataSource });
    } else if (url) {
      this.fetchData();
    } else {
      console.error('the url prop or dataSource must has one');
    }
  }

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

  async fetchData() {
    const { size, page } = this.state;
    const { url, params, onDataChanged } = this.props;
    this.setState({
      loading: true
    });
    const filterValues = await this.$getFormValue(this.form);
    const res = await this.$Get(url, {
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
          page: total === content.length ? page : page + 1,
          total: total,
          data: content,
          loading: false
        }
      })
    }
  }

  /**
   * 获取计算后的表格列配置
   */
  getComputedColumns = () => {
    const { size, page } = this.state;
    const {
      columns,
      showIndex,
    } = this.props;

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

    return computedColumns;
  }

  /**
   * 行选择change时
   * @param selectedRowKeys Array<number> 选择的行Key
   */
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  generateSelectActionBtns() {
    const { selectedRowKeys } = this.state;
    const { showSelect, selectActionBtns } = this.props;
    const hasSelected = selectedRowKeys.length > 0;
    if (!showSelect) {
      return null;
    }
    return (
      <div className="app-table-selectarea">
        {
          <React.Fragment>
            <GenerateFormBtns
              className="app-table-selectarea-btns"
              btns={selectActionBtns.map(btn => {
                return {
                  ...btn
                }
              })}
            />
            <span style={{ marginLeft: 8 }}>
              {`已选 ${selectedRowKeys.length} 项`}
            </span>
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
      rowKey,
      columns,
      showFilter,
      filterList,
      className,
      showSelect,
      selectActionBtns,
      ...props
    } = this.props;
    const rowKeyFunc = typeof rowKey === 'function'
      ? rowKey
      : (record: IDataRow) => `${record.id}`;
    const rowSelection = showSelect ? {
      selectedRowKeys,
      columnWidth: '0.2rem',
      onChange: this.onSelectChange,
    } : null;
    return (
      <div className="app-table" style={{ backgroundColor: '#fff' }}>
        {
          showFilter && (
            <div className="app-table-search-bar">
              <GenerateForm
                cols={4}
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
              />
            </div>
          )
        }
        {
          this.generateSelectActionBtns()
        }
        <Table
          size="middle"
          dataSource={data}
          loading={loading}
          rowKey={rowKeyFunc}
          rowSelection={rowSelection}
          columns={this.getComputedColumns()}
          className={`app-base-table ${className}`}
          pagination={{
            total,
            current: page + 1,
            pageSize: size,
            showTotal: total => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '40',],
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