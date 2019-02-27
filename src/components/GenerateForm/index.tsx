import * as React from 'react';
import {
  Form,
} from 'antd';
import { isEmpty } from 'lodash';

import {
  FormComponentProps,
} from 'antd/lib/form/Form';
import { ButtonProps } from 'antd/lib/button';
import CreateElement, {
  IFormItemProps
} from './createElement';
import './index.less';
import GenerateFormBtns from './CreateFormBtns';

interface IFormSubmitButton {
  text: string;
}

interface IFormProps {
  className?: string; // 类名
  style?: React.StyleHTMLAttributes<any>; // 样式
  cols?: 1 | 2 | 3 | 4; // 表单元素分几列展示
  items: (IFormItemProps | JSX.Element)[];
  btnContainerClassName?: string
  btnContainerStyle?: React.StyleHTMLAttributes<any>
  btns?: (IFormSubmitButton & ButtonProps)[]
  getForm?: (form: any) => any
}

class GenerateForm extends React.Component<IFormProps & FormComponentProps, {}> {

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

  /**
   * 判断数据类型, 是否是FormItemProps
   */
  isFormItemProps = (item: any): item is IFormItemProps => {
    return item && typeof (item as IFormItemProps)['dataKey'] !== 'undefined'
  }

  render() {
    const {
      cols,
      items,
      className = '',
      style = {},
      btns,
      btnContainerClassName,
      btnContainerStyle
    } = this.props;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form className={`form-content col-${cols} ${className || ''}`} style={style}>
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
            return (
              <div className="ant-form-item" key={idx} >
                {item}
              </div>
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
