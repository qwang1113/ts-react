import md5 from 'md5';
import React from 'react';
import { Button } from 'antd';
import Cookie from 'js-cookie';
import BaseComponent from '@components/Base';

import './Login.less';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import GenerateForm from '@components/GenerateForm';
import { setSessionStorage } from '@utils/util';

@observer
class Login extends BaseComponent<{}, {}>{
  @observable loading = false;

  form = null;

  @action
  setLoading = loading => this.loading = loading;

  submit = async () => {
    const params = await this.$getFormValue(this.form);
    this.setLoading(true);
    const res = await this.$Post('/user/login', {
      ...params,
      password: md5(params.password)
    });
    this.setLoading(false);
    if (!res) {
      this.form.resetFields();
      return;
    }
    setSessionStorage('token', res.token);
    Cookie.set('token', res.token);
    location.href = '/#/home';
  }

  render() {
    return (
      <div className="login-container">
        <div className="content">
          <div className="logo-text">
            <div className="main-text">React基础框架</div>
            <div className="sub-text">基于TypeScript + React + Antd + Mobx等技术栈</div>
          </div>
          <div className="login-form">
            <GenerateForm
              className="input-area"
              onKeyPress={(e) => {
                e.nativeEvent.keyCode === 13 && this.submit();
              }}
              getForm={form => this.form = form}
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
          </div>
        </div>
      </div>
    )
  }
}

export default Login;