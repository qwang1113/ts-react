import {
  Form,
} from 'antd';
import moment from 'moment';
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
  getForm?: (form: any) => any
  onFormSubmit?: (formFields: any) => any
}

class GenerateForm extends BaseComponent<IFormProps & FormComponentProps, {}> {

  constructor(props) {
    super(props);
    const { getForm } = props;
    getForm && getForm(props.form);
  }

  static defaultProps: Partial<IFormProps & FormComponentProps> = {
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
    let valuePropName;
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
          initialValue = initialValue.filter(v => v && !isEmpty(v));
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
   * 判断数据类型, 是否是FormItemProps
   */
  isFormItemProps = (item: any): item is IFormItemProps => {
    return item && typeof (item as IFormItemProps)['dataKey'] !== 'undefined'
  }

  getFormFieldsValue = async () => {
    const { items } = this.props;
    const values = await this.$getFormValue(this.props.form);
    let clonedValues: IBaseObj = Object.assign({}, values);
    Object.keys(values).forEach(key => {
      const currentItem = items.find(item => {
        return this.isFormItemProps(item) && item.dataKey === key
      });
      // fuck
      if (!this.isFormItemProps(currentItem)) {
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
          clonedValues[key] = get(values, `${key}.fileList`, []).map(file => {
            if (get(file, `status`) === 'done') {
              return get(file, `response.id`);
            }
          })
        }
      }
      if (type === 'DatePicker' && values[key]) {
        if (!get(currentItem, 'componentProps.showTime')) {
          clonedValues[key] = moment(`${values[key].format('YYYY-MM-DD')} 00:00:00`)
        }
      }
      if (type === 'RangePicker' && values[key]) {
        if (!get(currentItem, 'componentProps.showTime')) {
          clonedValues[key] = values[key].map(time => `${time.format('YYYY-MM-DD')} 00:00:00`);
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
    const { onFormSubmit } = this.props;
    onFormSubmit && onFormSubmit(this.getFormFieldsValue());
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
      onFormSubmit, // 排除
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
            if (this.isFormItemProps(item)) {
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
            return (item === null || item === undefined) ? (
              <div className="ant-form-item" key={idx} >
                {item}
              </div>
            ) : (
                <React.Fragment key={idx}>
                  {item}
                </React.Fragment>
              );
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
