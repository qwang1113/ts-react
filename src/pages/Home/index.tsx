import * as React from 'react';
import GenerateForm from '@components/GenerateForm';

export default () => {
  return (
    <div className='main'>
      <GenerateForm 
        // cols={2}
        items={[{
          label: '输入框',
          required: true,
          dataKey: 'Input',
          type: 'Input',
          initialValue: '请输入啦啦啦啦',
        }, {
          label: '选择框',
          required: true,
          dataKey: 'Select',
          type: 'Select',
          options: [{
            label: '测试1',
            value: 0
          }]
        }, {
          label: '请输入啦啦啦啦',
          required: true,
          dataKey: 'DatePicker',
          type: 'DatePicker',
        }, {
          label: 'Upload',
          required: true,
          dataKey: 'Upload',
          type: 'Upload',
        }]}

        onSubmit={(...args) => {
          console.log(args)
        }}
      />
    </div>
  )
}