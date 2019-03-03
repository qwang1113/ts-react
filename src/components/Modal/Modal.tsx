import React from "react";
import { Modal as AntdModal } from "antd";

export default class Modal{
  static show = ({
    title,
    content
  }) => {
    return ;
  }

  static comfirm = ({
    title,
    content,
  }) => {
    return new Promise((resolve, reject) => {
      const model = AntdModal.confirm({
        title,
        content,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          resolve();
          model.destroy();
        },
        onCancel: () => {
          reject();
          model.destroy();
        }
      });
    })
  }
}