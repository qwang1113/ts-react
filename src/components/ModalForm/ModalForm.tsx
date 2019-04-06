import { Modal } from 'antd';
import * as React from 'react';
import {
  render,
  unmountComponentAtNode,
} from 'react-dom';
import { ModalProps } from 'antd/lib/modal';
import { FormComponentProps } from 'antd/lib/form';

import "./index.less";
import BaseComponent from '@components/Base';
import GenerateForm, { IGenerateFormProps } from '@components/GenerateForm';
import { IFormItemProps } from '@components/GenerateForm/createElement';

interface IShowParams extends ModalProps {
  cols?: IGenerateFormProps['cols'];
  items?: IFormItemProps[]
  content?: JSX.Element
}

interface ICallback {
  (values: any, close: Function): void;
}

interface IState {
  cols: IGenerateFormProps['cols']
  items: IFormItemProps[]
  content: JSX.Element
  modalProps: ModalProps,
}

class ModalForm extends BaseComponent<{}, IState> {

  dom: HTMLDivElement // 弹窗挂载的dom节点
  
  form: FormComponentProps["form"] // antd form

  callback: ICallback = undefined;  // show方法的callback

  shouldDestoryInstanceOnClose: boolean = true // 是否在modal 关闭后销毁实例

  state: IState = {
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

  /**
   * 显示modal
   */
  show = (obj: IShowParams, cb: (values: any, close: Function) => void) => {
    const { cols = 2, items = [], content, ...config } = obj;
    this.setState({
      cols,
      items,
      content,
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
    if ('function' === typeof this.callback) {
      content
        ? this.callback({}, this.close)
        : form.validateFields((err, values) => {
          if (err) return;
          this.callback(values, this.close);
        });
    }
  }

  /**
   * 设置当前组件挂载的dom
   * 供销毁组件使用
   */
  setDom = (dom: HTMLDivElement, destory: boolean) => {
    this.dom = dom;
    this.shouldDestoryInstanceOnClose = destory;
  }

  /**
   * 在弹窗完全关闭后销毁弹窗实例
   */
  destory = () => {
    this.dom && this.shouldDestoryInstanceOnClose && unmountComponentAtNode(this.dom);
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
        width={(5.2 * cols) + 'rem'}
        bodyStyle={{minHeight: 450}}
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
  const renderedContainer = render(
    <ModalForm />,
    dom
  ) as unknown as ModalForm;
  renderedContainer.setDom(dom, destory);
  return renderedContainer;
};
