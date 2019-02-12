import * as React from 'react';
import {
  Icon,
  Upload as UploadComponent,
  message
} from 'antd';

export default class Upload extends React.Component<{ max: number } & any> {
  state = {
    fileNum: 0
  };

  handleChange = (files) => {
    const { file } = files;
    const { onChange } = this.props;
    if (file.status === 'error') {
      message.error('文件上传失败');
    }
    onChange && onChange(files);
  }

  render() {
    const { max = 1, onChange, ...props } = this.props;
    return (
      <UploadComponent
        {...props}
        onChange={this.handleChange}
      >
        {
          this.props.fileList.length < max && (
            <React.Fragment>
              <Icon type="upload" /><br /> 点击上传
            </React.Fragment>
          )
        }
      </UploadComponent>
    );
  }
}
