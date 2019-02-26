import * as React from 'react';
import BaseComponent from '@components/Base';

import "./Table.less";
import { Table, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { TableProps } from 'antd/lib/table';
import GenerateForm from '@components/GenerateForm';
import { IFormItemProps } from '@components/GenerateForm/createElement';
import GenerateFormBtns from '@components/GenerateForm/CreateFormBtns';

interface IState {
  size: number;
  page: number;
  total: number;
  data: {}[];
  loading: boolean;
}

interface IProps extends TableProps<{}> {
  showFilter?: boolean;
  filterList?: IFormItemProps[]
}

class BaseTable extends BaseComponent<IProps & FormComponentProps, IState>{

  state = {
    size: 10,
    page: 0,
    total: 0,
    loading: false,
    data: []
  }

  componentDidMount() {
    this.fetchData();
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
    this.setState({
      page: 0,
      size: size,
    }, this.fetchData);
  };

  /**
   * 重置搜索条件并重置页面
  */
  resetParams = () => {
    this.setState({
      size: 10,
      page: 0,
    }, this.fetchData);
  };

  async fetchData() {

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
      form,
      rowKey,
      columns,
      showFilter,
      filterList,
      ...props
    } = this.props;
    const rowKeyFunc = typeof rowKey === 'function'
      ? rowKey
      : (record: IDataRow) => `${record.id}`;
    return (
      <div className="app-table">
        {
          showFilter && (
            <div className="app-table-search-bar">
              <Form>
                <GenerateForm
                  cols={3}
                  form={form}
                  items={filterList}
                />
                <GenerateFormBtns 
                  btns={[{
                    text: '确定',
                    type: 'primary',
                    onClick: () => {}
                  }, {
                    text: '取消',
                  }]}
                />
              </Form>
            </div>
          )
        }
        <Table
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
            showQuickJumper: true,
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


export default Form.create()(BaseTable);