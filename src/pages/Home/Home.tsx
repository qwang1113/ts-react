import * as React from 'react';
import Title from '@components/Title/Title';
import BaseComponent from '@components/Base';
import GenerateForm from '@components/GenerateForm';

class Home extends BaseComponent<{}, {}>{

  form = null;

  render() {
    return (
      <div>
        <GenerateForm
          cols={2}
          className="app-container"
          getForm={form => this.form = form}
          onSubmit={(e: React.FormEvent) => {
            e.stopPropagation();
            this.$getFormValue(this.form).then(val => {
              console.log(val);
            })
          }}
          btns={[{
            text: '确定',
            type: 'primary',
            htmlType: 'submit'
          }, {
            text: '取消',
          }]}
          items={[
            <Title text="普通表单" />
            , {
              label: '普通输入框',
              dataKey: 'Input',
              type: 'Input',
              placeholder: '请输入',
              required: true
            }, {
              label: '普通输入框(禁用)',
              dataKey: 'disableInput',
              type: 'Input',
              placeholder: '请输入',
              componentProps: {
                disabled: true
              }
            },
            <Title text="下拉" />,
            {
              label: '选择框',
              dataKey: 'Select',
              type: 'Select',
              options: '/examples',
              labelKey: 'name',
              valueKey: 'id',
              params: { test: null }
            },
            <Title text="日期选择" />,
            {
              label: '日期选择',
              dataKey: 'DatePicker',
              type: 'DatePicker',
              placeholder: '请选择'
            },
            {
              label: '时间日期选择',
              dataKey: 'datetimePicker',
              type: 'DatePicker',
              placeholder: '请选择',
              componentProps: {
                showTime: true,
                format: "YYYY-MM-DD HH:mm:ss"
              }
            },
            {
              label: '时间段',
              dataKey: 'rangePicker',
              type: 'RangePicker',
              placeholder: ['请选择开始日期', '请选择结束日期'],
            },
            <Title text="文件上传" />,
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
            <Title text="开关, 单选, 复选" />,
            {
              label: '开关',
              dataKey: 'Switch',
              type: 'Switch',
            },
            {
              label: '单选',
              dataKey: 'Radio',
              type: 'Radio',
              options: '/examples',
              labelKey: 'name',
              valueKey: 'id'
            },
            {
              label: '多选',
              dataKey: 'CheckBox',
              type: 'Checkbox',
              options: '/examples',
              labelKey: 'name',
              valueKey: 'id'
            },
            <Title text="评分" />,
            {
              label: '评分',
              dataKey: 'Rate',
              type: 'Rate',
            },
            <Title text="文本域" />,
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