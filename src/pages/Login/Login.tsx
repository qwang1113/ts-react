import md5 from 'md5';
import React from 'react';
import { Form, Button } from 'antd';
import BaseComponent from '@components/Base';
import { FormComponentProps } from 'antd/lib/form';

import './Login.less';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import GenerateForm from '@components/GenerateForm';

@observer
class Login extends BaseComponent<FormComponentProps, {}>{
  @observable loading = false;

  @action
  setLoading = loading => this.loading = loading;

  submit = async () => {
    const params = await this.$getFormValue(this.props.form);
    this.setLoading(true);
    const res = await this.$Post('/user/login', {
      ...params,
      password: md5(params.password)
    });
    this.setLoading(false);
    if (!res) {
      this.props.form.resetFields();
      return;
    }
    sessionStorage.setItem('token', res.token);
    location.href = '/#/home';
  }

  render() {
    const { form } = this.props;
    return (
      <div className="login-container">
        <div className="content">
          <div className="logo-text">
            <div className="main-text">React基础框架</div>
            <div className="sub-text">基于TypeScript + React + Antd + Mobx等技术栈</div>
          </div>
          <Form
            className="input-area"
            onKeyPress={(e) => {
              e.nativeEvent.keyCode === 13 && this.submit();
            }}
          >
            <GenerateForm
              form={form}
              className="login-form"
              cols={1}
              items={[{
                dataKey: 'name',
                type: 'Input',
                required: true,
                placeholder: '用户名...',
                componentProps: {
                  autoComplete: 'username'
                },
                label: '用户名',
              }, {
                dataKey: 'password',
                type: 'Input',
                required: true,
                placeholder: '密码...',
                label: '密码',
                componentProps: {
                  type: 'password',
                  autoComplete: 'current-password'
                },
              }]}
            />
            <Button
              className="sub-btn"
              type="primary"
              loading={this.loading}
              onClick={this.submit}
            >
              登录
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(Login);