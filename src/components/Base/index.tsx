import { message } from "antd";
import React from 'react';
import { WrappedFormUtils } from '_antd@3.10.8@antd/lib/form/Form';

export default class BaseComponent<P = {}, S = {}> extends React.Component<P, S>{

  $message = message;

  $getFormValue = (form: WrappedFormUtils) => {
    return new Promise((resolve, reject) => {
      if(!form){
        reject('form is invalid');
      }
      form.validateFieldsAndScroll((err, val) => {
        err && reject(err);
        resolve(val);
      })
    })
  }
}