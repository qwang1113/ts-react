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

  dataKey: string;

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
  placeholder?: string;
  componentProps?: object; // 表单组件的props
  labelOptions?: FormItemProps; // formItem的props
  options?: string | ISelectOption[]; // select, radioGroup, Checkbox 的options list
  validateOption?: GetFieldDecoratorOptions; // getFieldDecorator 第二个参数
  params?: object;
  labelKey?: string
  valueKey?: string
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
  WeekPicker,
  DatePicker,
  MonthPicker,
  RangePicker,
  Radio: Radio.Group,
  Checkbox: Checkbox.Group,
  TextArea: Input.TextArea,
  Custom: null,
};

@observer
export default class CreateElement extends React.Component<IFormItemProps & any> {

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
  updateOption = (value) => {
    this.options = value;
  }

  @action
  hideLoading = () => {
    this.loading = false;
  }

  async doFetch(options: string) {
    const {
      params,
      labelKey = 'name',
      valueKey = 'id'
    } = this.props;
    const res: ISelectOption[] = await Get(options, params);
    this.hideLoading();
    if (Array.isArray(res)) {
      this.updateOption(res.map(d => {
        return {
          label: d[labelKey],
          value: d[valueKey]
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
   * @memberof GenerateForm
   */
  getOptionList = (type: string, options: ISelectOption[] | string) => {
    if (Array.isArray(options)) {
      return options;
    }
    if ('string' === typeof options) {
      return this.options;
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
      placeholder,
      componentProps,
    } = this.props;
    const ele = Components[type];
    let props: { [propName: string]: any } = {
      value,
      onChange,
      checked,
      placeholder: placeholder || this.generatePlaceholder(),
    };
    let children = null;
    switch (type) {
      case 'Rate':
        props.allowHalf = true;
        break;
      case 'Radio':
      case 'Checkbox':
        props.options = this.getOptionList(type, options);
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
          const labelOptions = this.getOptionList(type, options);
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
      case 'TextArea':
        props.rows = 5;
        break;
      default:
        break;
    }

    // 合并默认属性与自定义属性
    Object.assign(props, componentProps);
    // 如果loading正在加载
    if(this.loading){
      return (
        <Spin size="small" />
      )
    }
    return React.createElement(ele, props, children);
  }
}
