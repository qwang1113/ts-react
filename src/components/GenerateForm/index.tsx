import * as React from 'react';
import {
  Form,
  Button
} from 'antd';
import { isEmpty } from 'lodash';

import {
  FormComponentProps,
} from 'antd/lib/form/Form';
import CreateElement, {
  IFormItemProps
} from './createElement';
import './index.less';
import { ButtonProps } from '_antd@3.10.8@antd/lib/button';

interface IFormSubmitButton {
  text: string;
}

interface IFormProps {
  className?: string; // 类名
  style?: object; // 样式
  cols?: 1 | 2 | 3 | 4; // 表单元素分几列展示
  items: IFormItemProps[];
  btns?: (IFormSubmitButton & ButtonProps)[]
}

class GenerateForm extends React.Component<IFormProps & FormComponentProps, {}> {

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

  render() {
    const {
      cols,
      items,
      form,
      className = '',
      style = {},
      btns
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={`form-content col-${cols} ${className || ''}`} style={style}>
        {items.map((item) => {
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
          );
        })}
        <Form.Item className={`form-btns col-${cols}`}>
          {Array.isArray(btns) && btns.map((item, idx) => {
            const { text, style, ...props } = item;
            return (
              <Button
                key={item.title || idx}
                {...props}
                style={{ marginRight: 20, ...style }}
              >
                {text}
              </Button>
            );
          })}
        </Form.Item>
      </div>
    );
  }
}

export default GenerateForm;
