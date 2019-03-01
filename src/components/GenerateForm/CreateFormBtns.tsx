import * as React from 'react';
import {
  Form,
  Button
} from 'antd';
import './index.less';
import { ButtonProps } from 'antd/lib/button';

export interface IActionBtn {
  text: string;
}

export interface IFormBtnProps {
  className?: string; // 类名
  style?: object; // 样式
  btns?: (IActionBtn & ButtonProps)[]
}

class GenerateFormBtns extends React.Component<IFormBtnProps, {}> {

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
