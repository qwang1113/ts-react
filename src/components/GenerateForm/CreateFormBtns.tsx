import * as React from 'react';
import {
  Form,
  Button
} from 'antd';
import './index.less';
import { ButtonProps } from 'antd/lib/button';

interface IFormSubmitButton {
  text: string;
}

interface IFormProps {
  className?: string; // 类名
  style?: object; // 样式
  btns?: (IFormSubmitButton & ButtonProps)[]
}

class GenerateFormBtns extends React.Component<IFormProps, {}> {

  render() {
    const {
      className,
      style,
      btns
    } = this.props;
    return (
      <Form.Item
        label="操作按钮"
        className={`form-btns ${className || ''}`}
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
