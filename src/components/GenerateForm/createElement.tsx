import * as React from 'react';

import {
  Input,
  Select,
  DatePicker,
  Radio,
  Checkbox,
  Switch,
  Rate,
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
  label: string;
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
  value: string | number;
  label: string;
  key?: string;
  disabled?: boolean;
}

export interface IFormItemProps extends IFormItemBase {
  placeholder?: string;
  componentProps?: object; // 表单组件的props
  labelOptions?: FormItemProps; // formItem的props
  options?: string | ISelectOption[]; // select, radioGroup, Checkbox 的options list
  validateOption?: GetFieldDecoratorOptions; // getFieldDecorator 第二个参数
}

const Components: IComponents = {
  Input,
  Select,
  DatePicker,
  Radio: Radio.Group,
  Checkbox: Checkbox.Group,
  Switch,
  Upload,
  Rate,
  TextArea: Input.TextArea,
  Custom: null,
};

@observer
export default class CreateElement extends React.Component<IFormItemProps & any> {

  @observable options = [];

  componentDidMount() {
    const { options } = this.props;
    if ('string' === typeof options) {
      this.doFetch(options);
    }
  }

  @action
  updateOption = (value) => {
    this.options = value;
  }

  async doFetch(options: string) {
    const res: { ecode: number, data: ISelectOption[] } = await Get(options);
    if (res && res.ecode === 0) {
      this.updateOption(res.data || []);
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
      type,
      options,
      componentProps,
      value,
      onChange,
      checked,
      placeholder,
      fileList,
      max
    } = this.props;
    const ele = Components[type];
    const props = Object.assign({
      placeholder: placeholder || this.generatePlaceholder(),
      value,
      onChange,
      checked,
    }, componentProps);
    let children;
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
            action: baseUrl + '/public/upload',
            listType: 'picture-card',
            fileList: Array.isArray(fileList) ? fileList : fileList ? fileList.fileList : [],
            max
          });
        }
        break;
      default:
        break;
    }
    return React.createElement(ele, props, children);
  }
}
