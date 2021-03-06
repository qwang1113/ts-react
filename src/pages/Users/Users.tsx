import * as React from 'react';
import md5 from 'md5';
import BaseComponent from '@components/Base';

import "./Users.less";
import Table from '@components/Table/Table';
import { getSessionStorage } from '@utils/util';
import ModalForm from '@components/ModalForm/ModalForm';
import { ValidationRule } from 'antd/lib/form';

const Form = ModalForm(false);

const filterList = [{
  label: '用户名',
  dataKey: 'search',
  type: 'Input',
  placeholder: '请输入...'
}, {
  label: '注册时间',
  dataKey: 'rigistTime',
  type: 'RangePicker'
}];

const generateValidator = (key: string): ValidationRule['validator'] => {
  const { form } = Form;
  return (_rules, value, cb) => {
    if (!form) {
      return cb();
    }
    if (!value || !form.getFieldValue(key)) {
      return cb();
    }
    if (value !== form.getFieldValue(key)) {
      cb('两次输入密码不一致');
      return;
    }
    form.setFieldsValue({
      [key]: value
    })
    cb();
  }
}

class Tables extends BaseComponent<{}, {}>{

  state = {
    type: 'text'
  }

  table = null;

  columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    format: 'datetime'
  }]

  getAddUserList = () => {
    return [{
      label: '用户名',
      dataKey: 'name',
      type: 'Input',
      placeholder: '请输入...',
      required: true,
    }, {
      label: '密码',
      dataKey: 'password',
      type: 'Input',
      placeholder: '请输入密码',
      required: true,
      componentProps: {
        type: 'password',
        autoComplete: "new-password",
      },
      rules: [{
        validator: generateValidator('repeatPwd')
      }]
    }, {
      label: '重复密码',
      dataKey: 'repeatPwd',
      type: 'Input',
      placeholder: '请输入密码',
      required: true,
      componentProps: {
        type: 'password',
        autoComplete: "new-password",
      },
      rules: [{
        validator: generateValidator('password')
      }]
    }]
  }

  /**
   * 添加新用户
   */
  handleAddNewUser = async () => {
    Form.show({
      title: '新增用户',
      cols: 1,
      items: this.getAddUserList()
    }, async (values, close) => {
      const res = await this.$Post('/user/add', {
        name: values.name,
        password: md5(values.password)
      });
      if (res) {
        this.$success('操作成功');
        this.table.fetchData();
        close();
      }
    });
  }

  /**
   * 编辑用户
   * @param user User
   */
  handleEditUser = async (current: { [x: string]: any; }) => {
    Form.show({
      title: '编辑用户',
      cols: 1,
      items: this.getAddUserList().map(user => {
        return {
          ...user,
          initialValue: current[user.dataKey]
        }
      })
    }, async (values, close) => {
      const res = await this.$Post('/user/add', {
        name: values.name,
        password: md5(values.password)
      });
      if (res) {
        this.$success('操作成功');
        this.table.fetchData();
        close();
      }
    });
  }

  render() {
    const userInfo = JSON.parse(getSessionStorage('userInfo') || '{}');
    return (
      <div className="container">
        <Table
          showIndex
          ref={ref => this.table = ref}
          deleteOption={{
            batch: true,
            url: '/user/delete',
            params: {},
            disabled: ({ id }) => id === userInfo.id,
          }}
          dataOptions={{
            url: '/users',
            filterList: filterList,
            params: { order_func: 'ASC', order_by: 'id' },
          }}
          btns={[{
            text: '新增用户',
            // withSelect: true,
            onClick: this.handleAddNewUser
          }]}
          actionBtns={[{
            text: '详情',
            type: 'detail',
            onClick: (row, idx) => {
              console.log(row, idx);
            }
          }, {
            text: '编辑',
            type: 'edit',
            onClick: this.handleEditUser
          }]}
          columns={this.columns}
          selectText={(rows) => {
            return `已选: ${rows.length}项`
          }}
        // onDataChanged={(data, filter) => {
        //   console.log(data, filter);
        // }}
        />
      </div>
    );
  }
}


export default Tables;