import * as React from 'react';
import BaseComponent from '@components/Base';

import "./Table.less";
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import GenerateForm from '@components/GenerateForm';
import { IFormItemProps } from '@components/GenerateForm/createElement';

interface IState {
  size: number;
  page: number;
  total: number;
  data: {}[];
  loading: boolean;
}

interface IProps extends TableProps<{}> {
  showFilter?: boolean;
  filterList?: IFormItemProps[];
  url?: string;
  params?: object;
}

class BaseTable extends BaseComponent<IProps, IState>{

  state = {
    size: 10,
    page: 0,
    total: 0,
    loading: false,
    data: []
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
    const { url, params } = this.props;
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

  render() {
    const {
      size,
      data,
      page,
      total,
      loading,
    } = this.state;
    const {
      rowKey,
      columns,
      showFilter,
      filterList,
      className,
      ...props
    } = this.props;
    const rowKeyFunc = typeof rowKey === 'function'
      ? rowKey
      : (record: IDataRow) => `${record.id}`;
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
        <Table
          className={`base-table ${className}`}
          size="middle"
          rowKey={rowKeyFunc}
          dataSource={data}
          columns={columns}
          loading={loading}
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