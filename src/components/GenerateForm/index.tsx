import * as React from 'react';
import {
  Form,
  Button,
} from 'antd';
import { isEmpty } from 'lodash';

import {
  FormComponentProps,
} from 'antd/lib/form/Form';

import CreateElement, {
  IFormItemProps
} from './createElement';

import './index.less';
import FormItem from '_antd@3.10.8@antd/lib/form/FormItem';

interface IFormProps {
  className?: string; // 类名
  style?: object; // 样式
  cols?: 1 | 2 | 3; // 表单元素分几列展示
  items: IFormItemProps[];
  onSubmit?: (values: any) => void;
  btnText?: string;
}

class GenerateForm extends React.Component<IFormProps & FormComponentProps, {}> {

  static defaultProps: Partial<IFormProps & FormComponentProps> = {
    cols: 1
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

  handleSubmit = (e) => {
    const { onSubmit } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values: { index?: any, key?: any }) => {
      if (!err) {
        // format upload result;
        const uploadComponents = this.props.items.filter(item => item.type === 'Upload');
        if (uploadComponents) {
          uploadComponents.forEach(cmp => {
            try {
              const val = values[cmp.dataKey];
              if (val) {
                if (Array.isArray(val)) {
                  values[cmp.dataKey] = val[0] ? val[0].id : null;
                } else {
                  values[cmp.dataKey] = val.file.response.data;
                }
              }
            } catch (error) {
              console.log(error);
            }
          });
        }
        onSubmit && onSubmit(values);
      }
    });
  }

  render() {
    const {
      cols,
      style,
      items,
      className = '',
      form: {
        getFieldDecorator
      }
    } = this.props;
    return (
      <Form
        style={style}
        onSubmit={this.handleSubmit}
        className="form-container"
      >
        <div className={`form-content ${className} col-${cols}`}>
          {items.map((item: IFormItemProps) => {
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
        </div>
        <FormItem className={cols > 1 ? 'padLeft' : ''}>
          <Button type="primary" htmlType="submit">{this.props.btnText || '保存'}</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create<{}>()(GenerateForm);
