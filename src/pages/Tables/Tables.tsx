import * as React from 'react';
import BaseComponent from '@components/Base';

import "./Tables.less";
import Table from '@components/Table/Table';

const filterList = [{
  label: '普通输入框',
  dataKey: 'Input',
  type: 'Input',
  placeholder: '请输入...'
}, {
  label: '普通输入框(禁用)',
  dataKey: 'disableInput',
  type: 'Input',
  placeholder: '请输入...',
  componentProps: {
    disabled: true
  }
}, {
  label: '选择框',
  dataKey: 'Select',
  type: 'Select',
  options: [{
    label: '测试1',
    value: 0
  }]
}, {
  label: '日期选择',
  dataKey: 'DatePicker',
  type: 'DatePicker',
  placeholder: '请选择...'
}];

class About extends BaseComponent<{}, {}>{
  componentDidMount(){
    this.fetchData();
  }

  async fetchData() {
    
  }

  render() {
    return (
      <div className="tables-container">
        <Table
          showFilter
          filterList={filterList}
        />
      </div>
    );
  }
}


export default About;