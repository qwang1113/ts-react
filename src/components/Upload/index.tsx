import * as React from 'react';
import { Button } from 'antd';
import {
  Icon,
  Upload as UploadComponent,
} from 'antd';
import BaseComponent from '@components/Base';

export default class Upload extends BaseComponent<{ max: number } & any> {
  state = {
    fileNum: 0
  };

  handleChange = (files) => {
    const { file } = files;
    const { onChange } = this.props;
    if (file.status === 'error') {
      this.$error('文件上传失败');
    }
    onChange && onChange(files);
  }

  getUploadElement = (max: number) => {
    const { listType } = this.props;
    if (this.props.fileList.length >= max) {
      return null;
    }
    if (listType === 'text') {
      return (
        <Button>
          <Icon type="upload" /> 点击上传
        </Button>
      )
    }
    return (
      <React.Fragment>
        <Icon type="upload" /><br /> 点击上传
      </React.Fragment>
    )
  }

  generateFileEithUrl = (fileList) => {
    return fileList.map(file => {
      const url = file.status === 'done'
        ? process.env.NODE_ENV === 'production'
          ? file.response.url
          : `//localhost:3002${file.response.url}`
        : undefined
      return {
        ...file,
        // 设置默预览链接
        url
      }
    })
  }

  render() {
    const {
      onChange,
      max = 1,
      fileList = [],
      ...props
    } = this.props;
    return (
      <UploadComponent
        {...props}
        fileList={this.generateFileEithUrl(fileList)}
        onChange={this.handleChange}
      >
        {
          this.getUploadElement(max)
        }
      </UploadComponent>
    );
  }
}
