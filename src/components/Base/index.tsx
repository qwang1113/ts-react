import { message } from "antd";
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Get, Post, Put } from "@utils/api";

class BaseComponent<P = {}, S = {}> extends React.Component<P, S>{

  $message = message;

  $Get = Get
  $Post = Post
  $Put = Put

  $error = (msg: string) => {
    message.destroy();
    message.error(msg);
  }

  $success = (msg: string) => {
    message.destroy();
    message.success(msg);
  }

  $getFormValue = (form: WrappedFormUtils): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!form) {
        reject('form is invalid');
      }
      form.validateFieldsAndScroll((err, val) => {
        if(err){
          reject(err);
        } else {
          resolve(val);
        }
      })
    })
  }
}

export default BaseComponent;