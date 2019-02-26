import * as React from 'react';
import {
  Form,
  Button
} from 'antd';
import './index.less';
import { ButtonProps } from '_antd@3.10.8@antd/lib/button';

interface IFormSubmitButton {
  text: string;
}

interface IFormProps {
  className?: string; // 类名
  style?: object; // 样式
  cols?: 1 | 2 | 3 | 4; // 表单元素分几列展示
  btns?: (IFormSubmitButton & ButtonProps)[]
}

class GenerateFormBtns extends React.Component<IFormProps, {}> {

  static defaultProps: Partial<IFormProps> = {
    cols: 2
  };

  render() {
    const {
      className,
      style,
      cols,
      btns
    } = this.props;
    return (
      <Form.Item 
        className={`form-btns col-${cols} ${className}`}
        style={style}
      >
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
    );
  }
}

export default GenerateFormBtns;
