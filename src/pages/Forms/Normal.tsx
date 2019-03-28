import * as React from 'react';
import Title from '@components/Title/Title';
import BaseComponent from '@components/Base';
import GenerateForm from '@components/GenerateForm';


export default class Normal extends BaseComponent {

  handleSubmit = (e) => {
    console.log(e);
  }

  render() {
    return (
      <div>
        <GenerateForm
          cols={2}
          className="app-container"
          btns={[{
            text: '确定',
            type: 'primary',
            htmlType: 'submit'
          }, {
            text: '取消',
          }]}
          onSubmit={this.handleSubmit}
          items={[
            <Title text="普通表单" />
            , {
              label: '普通输入框',
              dataKey: 'Input',
              type: 'Input',
              placeholder: '请输入',
              required: true
            }
          ]}
        />
      </div>
    )
  }
}