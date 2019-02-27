import * as React from 'react';
import BaseComponent from '@components/Base';
import GenerateForm from '@components/GenerateForm';

class Home extends BaseComponent<{}, {}>{

  render() {
    return (
      <div>
        <GenerateForm
          cols={2}
          className="app-container"
          btns={[{
            text: '确定',
            type: 'primary',
            onClick: () => { }
          }, {
            text: '取消',
          }]}
          items={[{
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
          },
          {
            label: '单文件上传',
            dataKey: 'Upload',
            type: 'Upload',
          }, {
            label: '多文件上传',
            dataKey: 'MultiUpload',
            type: 'Upload',
            max: 3
          },
          {
            label: '开关',
            dataKey: 'Switch',
            type: 'Switch',
          },
          {
            label: '单选',
            dataKey: 'Radio',
            type: 'Radio',
            options: [{
              label: '苹果',
              value: 0
            }, {
              label: '梨',
              value: 1
            }]
          },
          {
            label: '多选',
            dataKey: 'CheckBox',
            type: 'Checkbox',
            options: [{
              label: '苹果',
              value: 0
            }, {
              label: '梨',
              value: 1
            }]
          },
          {
            label: '评分',
            dataKey: 'Rate',
            type: 'Rate',
          },
          {
            label: '文本域',
            dataKey: 'TextArea',
            type: 'TextArea',
            required: true,
            initialValue: '我是文本域'
          }, null,
          ]}
        />
      </div>
    );
  }
}


export default Home;