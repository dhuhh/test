import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Icon, Row, Select, Upload, DatePicker, message, Spin, Modal } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import config from '$utils/config';
import { QueryUploadList, HandleInAndReAuditImport } from '$services/newProduct';
import styles from '../index.less';

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY年MM月';
const { api } = config;
const { basicservices: {
  sendMessageFile,
} } = api;

export default Form.create()(function UploadFile(props) {
  const [fileList, setFileList] = useState([]);
  const [md5s, setMd5s] = useState([]);
  const [loading, setLoading] = useState(false);
  const { form: { getFieldDecorator }, cycles = [], setCycles } = props;
  let ifile = {};

  // 确认按钮
  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const { queryUploadList, setRecordLoading } = props;
        let length = md5s.length;
        if (length) {
          setLoading(true);
          setRecordLoading(true);
        } else {
          message.warning('未上传文件');
        }
        const { yf } = values;
        md5s.forEach((item, index) => {
          const formData = new FormData();
          formData.append('file', fileList[index].originFileObj);
          HandleInAndReAuditImport({
            month: Number(yf.format('yyyyMM')),
            uuid: guid(),
            fileMd5: item,
            file: formData,
          }).then(() => {
            length -= 1;
            if (!length){
              setLoading(false);
              setFileList([]);
              setMd5s([]);
              if (queryUploadList) queryUploadList();
            }
          }).catch((error) => {
            message.error(error.success ? error.note : error.message, 4);
            length -= 1;
            if (!length) {
              setLoading(false);
              setFileList([]);
              setMd5s([]);
              if (queryUploadList) queryUploadList();
            }
          });
        });
      }
    });
  };

  // 生成uuid
  const guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  };

  const deleteConfirm = (title, file, fileList) => {
    Modal.confirm({
      title,
      onOk() {
        const { response } = file;
        const { data: { md5 = '' } } = response;
        if (md5 && md5s.indexOf(md5) > -1) {
          md5s.splice(md5s.indexOf(md5), 1);
        }
        setFileList([...fileList]);
      },
    });
  };

  // 上传文件状态改变
  const handleChange = ({ file, fileList, event }) => {
    const { status, response } = file;
    const { name = '' } = file;
    if (name.includes('.')) {
      const type = name.split('.').pop();
      if (status !== 'removed' && type !== 'xls' && type !== 'xlsx') {
        message.warning('仅支持xls、xlsx文件');
        return false;
      }
    }
    // 增加只能上传一个文件逻辑
    if (fileList.length > 1) {
      message.warning('只能上传一个文件');
      return false;
    }
    const temp = lodash.cloneDeep(file);
    if (status === 'error' || status === 'done') {
      // 成功上传文件
      const { code = 0 } = response;
      if (code > 0) {
        const { data: { md5 = '', human: size = '' } } = response;
        if (md5 && md5s.indexOf(md5) === -1) { // 上传新文件
          md5s.push(md5);
          temp.name = file.name + `（${size}）`;
          const { uid } = file;
          fileList.forEach((item, index) => {
            if (item.uid === uid) {
              fileList.splice(index, 1);
            }
          });
          fileList.push(temp);
          if (status === 'error') message.info('文件上传失败');
        } else if (md5 && md5s.indexOf(md5) > -1) { // 上传重复文件
          const { uid } = file;
          fileList.forEach((item, index) => {
            if (item.uid === uid) {
              fileList.splice(index, 1);
              message.warning('重复文件');
            }
          });
        }
      } else {
        message.error('文件上传失败');
        return false;
      }
    } else if (status === 'removed') { // 删除文件
      deleteConfirm('你确认要删除该文件吗？', file, fileList);
      return false;
    }
    setFileList([...fileList]);
    return true;
  };

  // 取消按钮
  const handleClear = () => {
    if (!fileList.length) {
      message.warning('未上传文件');
      return;
    }
    Modal.confirm({
      title: '你确认要删除上传的文件吗？',
      onOk() {
        setFileList([]);
        setMd5s([]);
      },
    });
  };

  // 下载模板
  const download = () => {
    window.open(`${props.serverName}/OperateProcessor?Column=MBFJ&PopupWin=false&Table=TTYMBWH&operate=Download&Type=Attachment&ID=3`);
  };

  return (
    <Form onSubmit={handleSubmit} style={{ color: '#61698c', fontSize: 16 }}>
      <Row>第一步：选择要上传的考核月份</Row>
      <Row style={{ padding: '16px 0 26px' }}>
        <Form.Item label='选择月份' labelAlign='left' colon={false} className={styles.formItem}>
          {
            getFieldDecorator('yf', { initialValue: moment('2021-03', monthFormat) })(
              <MonthPicker allowClear={false} format={monthFormat} disabledDate={(current) => current > moment().endOf('M') || current < moment().subtract(1, 'years').startOf('M') } />
            )
          }
        </Form.Item>
      </Row>
      <Row>第二步：下载模板</Row>
      <Row style={{ padding: '16px 0 55px' }}>
        {/* <Button style={{ height: '40px' }}>
          <a className={`${styles.aHover}`} href={`${props.serverName}/OperateProcessor?Column=MBFJ&PopupWin=false&Table=TTYMBWH&operate=Download&&Type=Attachment&ID=3`}download target="blank">
            <Icon type="download" /> 点击下载模板
          </a>
        </Button> */}
        <Button style={{ height: '40px', color: '#1a2243' }} onClick={download}><Icon type="download" /> 点击下载模板</Button>
        {/* <iframe title="下载" id="m_iframe" ref={(c) => { ifile = c; }} style={{ display: 'none' }} /> */}
      </Row>
      <Row>2.填好模板后，向CRM上传你填好的理财产品销售关系信息</Row>
      <Spin spinning={loading}>
        <Row style={{ padding: '16px 0 12px' }}>
          <Col style={{ minHeight: '125px' }}>
            <Upload
              action={sendMessageFile}
              fileList={fileList}
              onChange={handleChange}
              accept='.xls, .xlsx'
            >
              <Row type='flex'>
                <Button style={{ height: '40px' }}><Icon type="upload" /> 点击上传附件</Button>
                <Col style={{ height: '40px', fontSize: 12, lineHeight: '40px', marginLeft: 10, color: '#61698c' }}>仅支持xls、xlsx文件</Col>
              </Row>
            </Upload>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ cssFloat: 'left' }}>
            <Button className="m-btn-radius ax-btn-small" onClick={handleClear}>取消</Button>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" htmlType='submit'>确定</Button>
          </Form.Item>
        </Row>
      </Spin>
    </Form>
  );
});