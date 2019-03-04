import * as ReactDom from 'react-dom';
import BaseComponent from '@components/Base';
import { Modal } from 'antd';
import * as React from 'react';
import GenerateForm from '@components/GenerateForm';

import "./index.less";

class ModalForm extends BaseComponent {

  form = null;

  state = {
    items: [],
    modalProps: {
      title: "",
      visible: false,
      cancelText: '取消',
      okText: '确定',
      destroyOnClose: true,
    },
  }

  callback = undefined;

  /**
   * 显示modal
   */
  show = (obj = {}, cb) => {
    const callback = typeof obj === 'function' ? obj : cb;
    this.setState({
      modalProps: {
        ...obj,
        visible: true,
      },
    });
    this.callback = callback;
  }

  /**
   * 关闭
   */
  close = () => {
    const { modalProps, } = this.state;
    this.setState({
      modalProps: {
        ...modalProps,
        visible: false,
      },
    });
  }

  /**
   * 设置表单域
   */
  setItems = items => {
    this.setState({
      items,
    });
    return this;
  }

  /**
   * 确定按钮点击
   */
  checkForm = () => {
    const { form, } = this;
    form.validateFields((err, values) => {
      if (err) return;
      ('function' === typeof this.callback) && this.callback(values, this.close);
    });
  }

  render() {
    const { items, modalProps, } = this.state;
    return (
      <Modal
        className="app-modal-form"
        {...modalProps}
        onOk={this.checkForm}
        onCancel={this.close}
      >
        <GenerateForm
          items={items}
          getForm={form => this.form = form}
          cols={2}
        />
      </Modal>
    );
  }
}


export default ReactDom.render(
  <ModalForm />,
  document.createElement('div')
) as any;
