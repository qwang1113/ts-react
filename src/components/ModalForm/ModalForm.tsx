import { Modal } from 'antd';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ModalProps } from 'antd/lib/modal';
import { FormComponentProps } from 'antd/lib/form';

import "./index.less";
import BaseComponent from '@components/Base';
import GenerateForm from '@components/GenerateForm';
import { IFormItemProps } from '@components/GenerateForm/createElement';

interface IShowParams extends ModalProps {
  cols?: 1 | 2 | 3 | 4;
  items?: IFormItemProps[]
  content?: JSX.Element
}

class ModalForm extends BaseComponent {

  form: FormComponentProps["form"]

  dom: any

  state = {
    cols: 2,
    items: [],
    content: null,
    modalProps: {
      title: "",
      visible: false,
      cancelText: '取消',
      okText: '确定',
      destroyOnClose: true,
    },
  }

  callback = undefined;
  getForm = undefined;

  /**
   * 显示modal
   */
  show = (obj: IShowParams, cb: Function) => {
    const { cols, items, content, ...config } = obj;
    this.setState({
      content,
      cols: cols || 2,
      items: items || [],
      modalProps: {
        ...config,
        visible: true,
      },
    });
    this.callback = cb;
  }

  /**
   * 关闭
   */
  close = () => {
    this.setState({
      content: null,
      items: [],
      modalProps: {
        visible: false,
      },
    });
  }

  /**
   * 确定按钮点击
   */
  checkForm = () => {
    const { form, } = this;
    const { content } = this.state;
    if (content) {
      ('function' === typeof this.callback) && this.callback({}, this.close);
    } else {
      form.validateFields((err, values) => {
        if (err) return;
        ('function' === typeof this.callback) && this.callback(values, this.close);
      });
    }
  }

  /**
   * 设置当前组件挂载的dom
   * 供销毁组件使用
   */
  setDom = (dom: any) => {
    this.dom = dom;
  }

  /**
   * 在弹窗完全关闭后销毁弹窗实例
   */
  destory = () => {
    this.dom && ReactDom.unmountComponentAtNode(this.dom);
  }

  render() {
    const {
      cols,
      items,
      content,
      modalProps,
    } = this.state;
    return (
      <Modal
        className="app-modal-form"
        {...modalProps}
        onOk={this.checkForm}
        onCancel={this.close}
        afterClose={this.destory}
      >
        {content ? content : (
          <GenerateForm
            items={items}
            getForm={form => this.form = form}
            cols={cols}
          />
        )}
      </Modal>
    );
  }
}


export default (destory = true) => {
  const dom = document.createElement('div');
  const renderedContainer = ReactDom.render(
    <ModalForm />,
    dom
  ) as unknown as ModalForm;
  if(destory){
    renderedContainer.setDom(dom);
  }
  return renderedContainer;
};
