import * as React from 'react';

import {
  Input,
  Select,
  DatePicker,
  Radio,
  Checkbox,
  Switch,
  Rate,
  Spin,
  Cascader,
  InputNumber,
} from 'antd';

import Upload from '@components/Upload';

import {
  ValidationRule,
  GetFieldDecoratorOptions,
} from 'antd/lib/form/Form';

import {
  FormItemProps
} from 'antd/lib/form/FormItem';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import { baseUrl, Get } from '@utils/api';

interface IComponents {
  [index: string]: any;
}

interface IFormItemBase {
  label?: string;
  required?: boolean;
  style?: React.CSSProperties;

  dataKey?: string;

  type?: keyof typeof Components;

  rules?: ValidationRule[];
  initialValue?: any;

  // 图片上传， 最大数量
  max?: number;
}

export interface ISelectOption {
  value?: string | number;
  label?: string;
  key?: string;
  disabled?: boolean;
}

export interface IFormItemProps extends IFormItemBase {
  placeholder?: string | string[];
  componentProps?: IBaseObj; // 表单组件的props
  labelOptions?: FormItemProps; // formItem的props
  options?: string | ISelectOption[] | string[]; // select, radioGroup, Checkbox 的options list
  validateOption?: GetFieldDecoratorOptions; // getFieldDecorator 第二个参数
  params?: IBaseObj;
  labelKey?: string
  valueKey?: string
  childrenKey?: string
  component?: (values: any, onChange: Function) => JSX.Element
  value?: any
  checked?: boolean
  onChange?: Function
  fileList?: any
}

const {
  MonthPicker,
  RangePicker,
  WeekPicker,
} = DatePicker;

const Components: IComponents = {
  Rate,
  Input,
  Select,
  Switch,
  Upload,
  Cascader,
  WeekPicker,
  DatePicker,
  MonthPicker,
  InputNumber,
  RangePicker,
  Radio: Radio.Group,
  Checkbox: Checkbox.Group,
  TextArea: Input.TextArea,
  Custom: null,
};

@observer
export default class CreateElement extends React.Component<IFormItemProps> {

  @observable options = [];

  @observable loading = true;

  componentDidMount() {
    const { options } = this.props;
    if ('string' === typeof options) {
      this.doFetch(options);
    } else {
      this.hideLoading();
    }
  }

  @action
  updateOption = (value: any[]) => {
    this.options = value;
  }

  @action
  hideLoading = () => {
    this.loading = false;
  }

  async doFetch(options: string) {
    const {
      params,
      valueKey = 'id',
      labelKey = 'name',
      childrenKey = 'children'
    } = this.props;
    const res: ISelectOption[] = await Get(options, params);
    this.hideLoading();
    if (Array.isArray(res)) {
      this.updateOption(res.map(d => {
        return {
          label: d[labelKey],
          value: d[valueKey],
          children: d[childrenKey]
        }
      }));
    }
  }

  /**
   * 生成formItem placeholder
   * @param item IFormItemProps
   */
  generatePlaceholder = () => {
    const { type, label } = this.props;
    return `${type === 'Input' ? '请输入' : '请选择'}${label}`;
  }

  /**
   * 判断获取options
   */
  getOptionList = (options: string | any[]) => {
    if ('string' === typeof options) {
      return this.options;
    } else if (Array.isArray(options)) {
      return options.map(opt => {
        if('string' === typeof opt){
          return {
            label: opt,
            value: opt,
          }
        }
        return opt;
      })
    }
    return [];
  }

  render() {
    const {
      max,
      type,
      value,
      options,
      checked,
      onChange,
      fileList,
      component,
      placeholder,
      componentProps,
    } = this.props;
    if (type === 'Custom') {
      if (typeof component === 'function') {
        return component(value, onChange);
      }
      return component;
    }
    const ele = Components[type];
    let props: { [propName: string]: any } = {
      value,
      onChange,
      checked,
      placeholder: placeholder || this.generatePlaceholder(),
    };
    let children = null;
    switch (type) {
      case 'TextArea':
        props.rows = 5;
        break;
      case 'RangePicker':
        props.rows = 5;
        if (!Array.isArray(props.placeholder)) {
          props.placeholder = ['开始时间', '结束时间'];
        }
        break;
      case 'Cascader':
        props.allowClear = true;
        break;
      case 'Rate':
        props.allowHalf = true;
        break;
      case 'Radio':
      case 'Checkbox':
        props.options = this.getOptionList(options);
        break;
      case 'Select':
        {
          Object.assign(props, {
            allowClear: true,
            showSearch: true,
            optionFilterProp: "children",
            filterOption: (input, option) => {
              return option.props.children.toLowerCase().indexOf(
                input.toLowerCase()
              ) >= 0;
            }
          });
          const labelOptions = this.getOptionList(options);
          children = labelOptions.map((opt: ISelectOption) => {
            return (
              <Select.Option
                key={opt.key || opt.label}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </Select.Option>
            );
          });
        }
        break;
      case 'Upload':
        {
          Object.assign(props, {
            max,
            listType: 'picture-card',
            action: baseUrl + '/public/upload',
            fileList: Array.isArray(fileList)
              ? fileList
              : fileList
                ? fileList.fileList
                : [],
          });
        }
        break;
      default:
        break;
    }

    // 合并默认属性与自定义属性
    Object.assign(props, componentProps);
    // 如果loading正在加载
    if (this.loading) {
      return (
        <Spin />
      )
    }
    return React.createElement(ele, props, children);
  }
}
