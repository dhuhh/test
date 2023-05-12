import React from 'react';
import { connect } from 'dva';
import { Upload, message, Button, Icon } from 'antd';
import debounce from 'lodash.debounce';
import _array from 'lodash/array';
import { DeletMessageFile } from '../../../services/basicservices/message';
// import htmlToDraft from 'html-to-draftjs';
import config from '../../../utils/config';

const { api } = config;
const { basicservices: {
  sendMessageFile,
  deletMessageFile,
  getMessageFile,
} } = api;


class UploadAttachmen extends React.Component {
  constructor(props) {
    super(props);
    // const { tx = '', txpath } = this.props;
    this.constFileList = debounce(this.constFileList, 300);// 强制一个函数在某个连续时间段内只执行一次
    this.state = {
      fileList: [],
    };
  }
  componentDidMount() {
    setTimeout(() => {
      const { tx = '', txpath = '' } = this.props;
      this.constFileList(tx, txpath);
    }, 300);
  }
  componentWillReceiveProps(nextProps) {
    const { tx = '', txpath = '' } = nextProps;
    const { tx: preTx = '' } = this.props;
    if (preTx === '' && tx !== preTx) {
      this.constFileList(tx, txpath);
    }
  }
  constFileList = (tx = '', txpath = '') => {
    const paths = txpath ? txpath.split(',') : [];
    const tempFileList = [];
    tx.split(',').forEach((item, index) => {
      if (item) {
        const url = _array.nth(paths, index) || '';
        let md5 = 0;
        if (url.indexOf('ATT') > 0) {
          md5 = url.substring(url.indexOf('Column=') + 7, url.indexOf('&'));
        }
        tempFileList.push({
          name: item,
          status: 'done',
          uid: md5,
          url: `${localStorage.getItem('livebos') || ''}${_array.nth(paths, index)}`,
          response: { data: { md5: item } },
        });
      }
    });
    const { onChange, id } = this.props;
    if (onChange) {
      onChange({
        fileList: tempFileList,
        id,
      });
    }
    this.setState({
      fileList: tempFileList,
    });
  }
  onRemove = async (file) => {
    const { response: tempResponse = {} } = file;
    const { data = {} } = tempResponse;
    const { md5 = '' } = data || {};
    // let result = true;
    // if (md5) {
    //   const url = deletMessageFile + md5;
    //   DeletMessageFile(url);
    // }
    if (md5.indexOf('服务器附件') === -1) {
      const url = deletMessageFile + md5;
      DeletMessageFile(url);
      return true;
    }
    const { onChange, id } = this.props;
    if (onChange) {
      onChange({
        fileList: this.state.fileList.filter(item => item.name !== file.name),
        id,
      });
    }
    this.setState({
      fileList: this.state.fileList.filter(item => item.name !== file.name),
    });
    return false;
  }
  beforeUpload = (file) => {
    const { fileList = [] } = this.state;
    const tempList = fileList.filter(item => item.name === file.name);
    // let flag = true;
    if (tempList.length > 0) {
      message.error('附件重复提交！');
      return new Promise((resolve) => {
        console.info(resolve(file)); // eslint-disable-line
      });
    }
    // if (flag) {
    const isLt32M = file.size / 1024 / 1024 < 32;
    if (!isLt32M) {
      message.error('附件大小不能超过 32MB!');
      // flag = false;
      return new Promise((resolve) => {
        console.info(resolve(file)); // eslint-disable-line
      });
    }
    // }
    // return flag;
  }
  resetFileList = (fileList) => {
    let tempFileList = [];
    const md5s = new Set();
    if (fileList.length > 1) {
      message.warning('最多只能上传一个文件');
    }
    fileList.forEach((file, index) => {
      if (index <= 1) {
        const { response: tempResponse = {} } = file;
        const { data = {} } = tempResponse;
        const { md5 = '' } = data || {};
        md5s.add(md5);
      }
    });
    const tempMd5s = Array.from(md5s);
    tempMd5s.forEach((item) => {
      const tempIndex = fileList.findIndex((temp) => {
        const { response: tempResponse = {} } = temp;
        const { data = {} } = tempResponse;
        const { md5 = '' } = data || {};
        return item === md5;
      });
      if (tempIndex >= 0) {
        tempFileList.push(fileList[tempIndex]);
      }
    });
    tempFileList = tempFileList.length > 0 ? tempFileList : fileList;
    this.setState({
      fileList: tempFileList.slice(-1),
    });
    const { onChange, id } = this.props;
    if (onChange) {
      onChange({
        fileList: tempFileList,
        id,
      });
    }
  }
  handleChange = (info) => {
    const { file, fileList } = info;
    const { status = '', percent = 0, response = {} } = file || {};
    // const { fileList: tempfiles = [] } = this.state;
    // const tempList = tempfiles.filter(item => item.name === file.name);
    // if (status === 'uploading') {
    //   if (tempList.length > 0) {
    //     message.error('附件重复提交！');
    //     return false;
    //   }
    // }
    if (status !== 'uploading') { // 不为上传状态时
      if (parseInt(percent, 10) === 100 || status === 'error') {
        const { message: fileMessage = '', code = -1, note = '' } = response;
        if (code < 0) {
          const { uid = '' } = file;
          if (uid) {
            const tempIndex = fileList.findIndex((item) => { return item.uid === uid; });
            if (tempIndex >= 0) {
              fileList.splice(tempIndex, 1);
            }
          }
          message.error(fileMessage || note || '文件上传错误');
        }
      }
    } else {
      // 校验大小
      const { sysParam = [] } = this.props;
      const tempIndex = sysParam.findIndex((item) => { return item.csmc === 'CRMII_MAIL_ATTACHMENT_MAXSIZE'; });
      const size = tempIndex >= 0 ? parseInt(sysParam[tempIndex].csz || 32, 10) : 32;
      const isLt32M = file.size / 1024 / 1024 < size;
      if (!isLt32M) {
        const { uid = '' } = file;
        if (uid) {
          const tempIndex1 = fileList.findIndex((item) => { return item.uid === uid; });
          if (tempIndex1 >= 0) {
            fileList.splice(tempIndex1, 1);
          }
        }
        message.error(`附件大小不能超过${size}MB!`);
      }
    }
    if (Array.isArray(fileList)) {
      this.resetFileList(fileList);
    }
    return true;
  }
  handleEdit = (id) => {
    const { handleEdit } = this.props;
    if (handleEdit) {
      handleEdit(id);
    }
  }
  render() {
    const { fileList = [] } = this.state;
    const { stacitText = true, isEdit, tx, txpath, id } = this.props; // eslint-disable-line
    const tempFileList = [];
    fileList.forEach((item) => {
      const { response: tempResponse = {} } = item;
      const { data = {} } = tempResponse;
      const { md5 = '' } = data || {};
      if (md5.indexOf('服务器') < 0) {
        tempFileList.push({
          ...item,
          url: `${getMessageFile}${md5}`, // 下载地址
        });
      } else {
        tempFileList.push({
          ...item,
        });
      }
    });
    const upLoadProps = {
      showUploadList: true,
      beforeUpload: this.beforeUpload,
      defaultFileList: tempFileList,
      fileList: tempFileList,
      action: sendMessageFile,
      onChange: this.handleChange,
      onRemove: this.onRemove,
      accept: '.xls, .xlsx, .doc, .docx, .txt, .pdf, .jpg, .png',
    };
    // if (isEdit === 1) {
    //   if (stacitText) {
    //     return (
    //       <div>
    //         <span className="ant-form-item-children">
    //           <span className="ant-form-text"><a href={`${localStorage.getItem('livebos') || ''}${txpath}`}>{tx || ''}</a></span>
    //         </span>
    //         <span style={{ cursor: 'pointer' }} className="ant-form-item-children" onClick={() => { this.handleEdit(id); }}>
    //           <span className="ant-form-text blue">
    //                 编辑
    //             <i className="iconfont icon-modifyList blue" />
    //           </span>
    //         </span>
    //       </div>
    //     );
    //   }
      return (
        <Upload
          {...upLoadProps}
        >
          <Button disabled={false}>
            <Icon type="upload" /> 上传文件
          </Button>
        </Upload>
      );
    // }
    // return (
    //   <div>
    //     <span className="ant-form-item-children">
    //       <span className="ant-form-text"><a href={`${localStorage.getItem('livebos') || ''}${txpath}`}>{tx || ''}</a></span>
    //     </span>
    //   </div>
    // );
  }
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(UploadAttachmen);
