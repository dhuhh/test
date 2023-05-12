import React from 'react';
import { connect } from 'dva';
import { Upload, Button, Icon } from 'antd';
import { DeletMessageFile } from '../../../../../../services/basicservices/message';
import config from '../../../../../../utils/config';
import TipModal from '../TipModal';
//import photo from '../../../../../../assets/incidentialServices/上传附件.svg';
import photo from '../../../../../../assets/incidentialServices/uploadAttachments.svg';
const { api } = config;
const { basicservices: {
  sendMessageFile,
  deletMessageFile,
  // getMessageFile,
} } = api;


class UploadAttachmen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  onRemove = async (file) => {
    const { response: tempResponse = {} } = file;
    const { data = {} } = tempResponse;
    const { md5 = '' } = data || {};
    // let result = true;
    if (md5) {
      const url = deletMessageFile + md5;
      DeletMessageFile(url);
    }
    // if (md5.indexOf('服务器附件') === -1) {
    //   const url = deletMessageFile + md5;
    //   DeletMessageFile(url);
    //   return true;
    // }
    const fileList = this.state.fileList.filter(item => item.name !== file.name);
    this.setState({
      fileList,
    });
    this.handleUpdatachange(fileList);
    return false;
  }
  beforeUpload = (file) => {
    const { fileList = [], visible } = this.state;
    const tempList = fileList.filter(item => item.response.data.name === file.name);
    let flag = true;
    if (tempList.length > 0) {
      this.setState({
        visible: !visible,
        content: '附件重复提交！',
      });
      flag = false;
      // return new Promise((reject) => {
      //   console.info(reject(file)); // eslint-disable-line
      // });
    }
    // if (flag) {
    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      this.setState({
        visible: !visible,
        content: '附件大小不能超过 50MB!',
      });
      flag = false;
      // return new Promise((reject) => {
      //   console.info(reject(file)); // eslint-disable-line
      // });
    }
    // }
    return flag;
  }
  resetFileList = (fileList) => {
    const { visible } = this.state;
    let tempFileList = [];
    const md5s = new Set();
    if (fileList.length > 1) {
      setTimeout(() => {
        this.setState({
          visible: !visible,
          content: '最多只能上传一个文件',
        });
      }, 100);
    } else {
      fileList.forEach((file, index) => {
        // if (index <= 1) {
        const { response: tempResponse = {} } = file;
        const { data = {} } = tempResponse;
        const { md5 = '' } = data || {};
        md5s.add(md5);
        // }
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
        // fileList: tempFileList.slice(-1),
        fileList: tempFileList,
      });
      this.handleUpdatachange(tempFileList);
    }
  }
  handleChange = (info) => {
    const { visible } = this.state;
    const { file, fileList } = info;
    const { status = '', percent = 0, response = {} } = file || {};
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
          this.setState({
            visible: !visible,
            content: fileMessage || note || '文件上传错误',
          });
        }
      }
    } else {
      // 校验大小
      const { sysParam = [] } = this.props;
      const tempIndex = sysParam.findIndex((item) => { return item.csmc === 'CRMII_MAIL_ATTACHMENT_MAXSIZE'; });
      const size = tempIndex >= 0 ? parseInt(sysParam[tempIndex].csz || 50, 10) : 50;
      const isLt50M = file.size / 1024 / 1024 < size;
      if (!isLt50M) {
        const { uid = '' } = file;
        if (uid) {
          const tempIndex1 = fileList.findIndex((item) => { return item.uid === uid; });
          if (tempIndex1 >= 0) {
            fileList.splice(tempIndex1, 1);
          }
        }
        this.setState({
          visible: !visible,
          content: `附件大小不能超过${size}MB!`,
        });
      }
    }
    if (Array.isArray(fileList) && status !== '') {
      this.resetFileList(fileList);
    }
    return true;
  }

  handleUpdatachange = (fileList) => {
    const fileMd5 = [];
    fileList.forEach(item => {
      const { response: tempResponse = {} } = item;
      const { data = {} } = tempResponse;
      const { md5 = '' } = data || {};
      fileMd5.push(md5);
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        fileMd5: fileMd5,
      });
    }
  }

  // 基本信息模块
  renderFileListItemContent = (file, name, human) => {
    return (
      <div className='m-black'>
        <span>{name}</span>
        <span className="pl10">({human})</span>
        <span style={{ position: 'absolute', right: '12px', cursor: 'pointer' }} onClick={() => this.onRemove(file)}>删除</span>
      </div>
    );
  }

  handleCancel = () => {
    // 取消按钮的操作
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      content: '',
    });
  }

  render() {
    const { fileList = [], visible, content } = this.state;
    const tempFileList = [];
    const showPic = photo;
    fileList.forEach((item) => {
      const { response: tempResponse = {} } = item;
      const { data = {} } = tempResponse;
      const { md5 = '', name, human } = data || {};
      if (md5.indexOf('服务器') < 0) {
        tempFileList.push({
          ...item,
          // url: `${getMessageFile}${md5}`, // 下载地址
          name: this.renderFileListItemContent(item, name, human),
        });
      } else {
        tempFileList.push({
          ...item,
          name: this.renderFileListItemContent(item, name, human),
        });
      }
    });
    const upLoadProps = {
      // showUploadList: false,
      showUploadList: { showRemoveIcon: false },
      beforeUpload: this.beforeUpload,
      defaultFileList: tempFileList,
      fileList: tempFileList,
      action: sendMessageFile,
      onChange: this.handleChange,
      onRemove: this.onRemove,
      accept: '.xls, .xlsx, .doc, .docx, .txt, .pdf, .jpg, .png',
      disabled: tempFileList.length > 0,
    };
    return (
      <Upload
        {...upLoadProps}
      >
        <Button onClick={() => tempFileList.length > 0 ? this.setState({
          visible: !visible,
          content: '最多只能上传一个文件',
        }) : ''}>
          <div style={{display: 'flex', alignItems: 'center',}}>
            <img src={showPic} alt="" />
            <span style={{marginLeft: 4}}>点击上传附件</span>
          </div>
        </Button>
        <TipModal visible={visible} content={content} onCancel={this.handleCancel} />
      </Upload>
    );
  }
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(UploadAttachmen);
