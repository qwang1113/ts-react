import * as ReactDom from 'react-dom';
import BaseComponent from '@components/Base';
import { Modal } from 'antd';
import * as React from 'react';
import GenerateForm from '@components/GenerateForm';
import { FormComponentProps } from 'antd/lib/form';

import "./index.less";
import { ModalProps } from 'antd/lib/modal';
import { IFormItemProps } from '@components/GenerateForm/createElement';

interface IShowParams extends ModalProps {
  cols?: 1 | 2 | 3 | 4;
  items: IFormItemProps[]
}

class ModalForm extends BaseComponent {

  form: FormComponentProps["form"]

  state = {
    cols: 2,
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
  getForm = undefined;

  /**
   * 显示modal
   */
  show = (obj: IShowParams, cb: Function) => {
    const { cols, items, ...config } = obj;
    this.setState({
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
    this.form.resetFields();
    this.setState({
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
    form.validateFields((err, values) => {
      if (err) return;
      ('function' === typeof this.callback) && this.callback(values, this.close);
    });
  }

  render() {
    const { items, modalProps, cols } = this.state;
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
          cols={cols}
        />
      </Modal>
    );
  }
}


export default ReactDom.render(
  <ModalForm />,
  document.createElement('div')
) as any;
