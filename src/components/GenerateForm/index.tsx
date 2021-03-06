import {
  Form,
} from 'antd';
import dayjs from 'dayjs';
import * as React from 'react';
import { isEmpty, get } from 'lodash';

import {
  FormProps,
  FormComponentProps,
} from 'antd/lib/form/Form';
import CreateElement, {
  IFormItemProps
} from './createElement';
import BaseComponent from '@components/Base';
import { ButtonProps } from 'antd/lib/button';
import GenerateFormBtns from './CreateFormBtns';

import './index.less';
interface IFormSubmitButton {
  text: string;
}

interface IFormProps extends FormProps {
  cols?: 1 | 2 | 3 | 4; // 表单元素分几列展示
  items: IFormItemProps[];
  btnContainerClassName?: string
  btnContainerStyle?: React.StyleHTMLAttributes<any>
  btns?: (IFormSubmitButton & ButtonProps)[]
  getForm?: (form: FormComponentProps["form"]) => any
  onSubmit?: (values: IBaseObj) => any
}

export type IGenerateFormProps = IFormProps & FormComponentProps;

class GenerateForm extends BaseComponent<IGenerateFormProps, {}> {

  constructor(props: IGenerateFormProps) {
    super(props);
    const { getForm } = props;
    getForm && getForm(props.form);
  }

  static defaultProps: Partial<IGenerateFormProps> = {
    cols: 2
  };

  /**
   * 生成formItem placeholder
   * @param item IFormItemProps
   */
  generatePlaceholder = (item: IFormItemProps) => {
    const { type, label } = item;
    return `${type === 'Input' ? '请输入' : '请选择'}${label}`;
  }

  /**
   * formItem getFieldDecorator
   * @param item IFormItemProps
   */
  generateFieldDecorator(item: IFormItemProps) {
    const {
      type,
      rules = [],
      required = false,
      validateOption = {}
    } = item;
    let { initialValue } = item;
    let valuePropName: string;
    const computedRules = rules;
    if (['Input', 'TextArea'].find(item => item === type)) {
      computedRules.push({
        whitespace: true,
        message: this.generatePlaceholder(item)
      });
    }
    switch (type) {
      case 'Switch':
        valuePropName = 'checked';
        break;
      case 'Upload':
        valuePropName = 'fileList';
        if (initialValue) {
          initialValue = initialValue.filter((v: any) => v && !isEmpty(v));
        }
        break;
      default:
        valuePropName = 'value';
    }
    if (required && !rules.find(rule => rule.required)) {
      computedRules.push({
        required,
        message: this.generatePlaceholder(item)
      });
    }
    return {
      initialValue,
      valuePropName,
      validateFirst: true,
      rules: computedRules,
      ...validateOption
    };
  }

  /**
   * 生成formItemOption
   * @param item IFormItemProps
   */
  generateItemOptions = (item: IFormItemProps) => {
    const {
      label,
      required,
      style,
      labelOptions = {}
    } = item;
    return {
      label,
      required,
      style,
      ...labelOptions
    };
  }

  /**
   * 获取并格式化表单数据
   */
  getFormFieldsValue = async () => {
    const { items } = this.props;
    const values = await this.$getFormValue(this.props.form);
    let clonedValues: IBaseObj = Object.assign({}, values);
    Object.keys(values).forEach(key => {
      const currentItem = items.find(item => {
        return item && item.dataKey === key
      });
      // fuck
      if (!currentItem) {
        return;
      }
      const type = currentItem.type;
      // 处理文件上传的情况, 取出id
      if (type === 'Upload' && values[key]) {
        if (!currentItem.max || currentItem.max === 1) {
          // 单文件
          if (get(values, `${key}.file.status`) === 'done') {
            clonedValues[key] = get(values, `${key}.file.response.id`)
          }
        } else {
          // 多文件
          clonedValues[key] = get(values, `${key}.fileList`, []).map((file: any) => {
            if (get(file, `status`) === 'done') {
              return get(file, `response.id`);
            }
          })
        }
      }
      if (type === 'DatePicker' && values[key]) {
        if (!get(currentItem, 'componentProps.showTime')) {
          clonedValues[key] = dayjs(`${values[key].format('YYYY-MM-DD')} 00:00:00`)
        }
      }
      if (type === 'RangePicker' && values[key]) {
        if (!get(currentItem, 'componentProps.showTime')) {
          clonedValues[key] = values[key].map((time: { format: (arg0: string) => void; }, idx: number) => dayjs(`${time.format('YYYY-MM-DD')} ${idx === 0 ? '00:00:00' : '23:59:59'}`));
        }
      }
    });
    return clonedValues;
  }

  /**
   * 处理表单提交
   */
  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = await this.getFormFieldsValue();
    const { onSubmit } = this.props;
    onSubmit && onSubmit(values);
  }

  render() {
    const {
      btns,
      cols,
      items,
      className,
      btnContainerStyle,
      btnContainerClassName,
      form, // 排除(antd报错)
      getForm, // 排除(这个属性本身已经使用了, 不能透传到下面)
      onSubmit, // 排除(需要自动处理submit)
      ...formProps
    } = this.props;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form
        className={`form-content col-${cols} ${className}`}
        onSubmit={this.handleSubmit}
        {...formProps}
      >
        {
          items.map((item, idx) => {
            if (item === null) {
              return null;
            } else if (item === undefined) {
              return (
                <div className="ant-form-item" key={idx} />
              )
            } else if (React.isValidElement(item)) {
              return (
                <React.Fragment key={idx}>
                  {item}
                </React.Fragment>
              )
            } else if (!item.dataKey) {
              console.error(item, 'formItem config must have a dataKey props');
              return null
            } else {
              return (
                <Form.Item
                  key={item.dataKey}
                  {...this.generateItemOptions(item)}
                >
                  {
                    getFieldDecorator(item.dataKey, this.generateFieldDecorator(item))(
                      <CreateElement {...item} />
                    )
                  }
                </Form.Item>
              )
            }
          })
        }
        {
          btns && btns.length && (
            <GenerateFormBtns
              btns={btns}
              className={btnContainerClassName}
              style={btnContainerStyle}
            />
          )
        }
      </Form>
    );
  }
}

export default Form.create()(GenerateForm);
