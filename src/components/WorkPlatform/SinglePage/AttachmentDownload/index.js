import React, { Component } from 'react';
import { Row, Col, Form, Button, Modal } from 'antd';
import config from '../../../../utils/config';
import styles from './index.less';

const FormItem = Form.Item;

const { api } = config;
const { commonbase: {
  downloadAttachmentOfDocumentByZip,
} } = api;

class AttachmentDownload extends Component {
    state = {
      modalVisible: false,
    }

    componentWillUnmount() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }

    handleOK =() => {
      const { search } = this.props;
      const form1 = document.createElement('form');
      form1.id = 'form1';
      form1.name = 'form1';
      // 添加到 body 中
      document.getElementById('m_iframe').appendChild(form1);
      // 创建一个输入
      const input = document.createElement('input');
      // 设置相应参数
      input.type = 'text';
      input.name = 'search';
      input.value = search;
      // 将该输入框插入到 form 中
      form1.appendChild(input);
      // form 的提交方式
      form1.method = 'POST';
      // form 提交路径
      form1.action = downloadAttachmentOfDocumentByZip + search;
      // 对该 form 执行提交
      form1.submit();
      // 删除该 form
      document.getElementById('m_iframe').removeChild(form1);
      // 延迟1秒钟执行
      this.timer = setTimeout(() => {
        const { onCancelOperate } = this.props;
        if (onCancelOperate) {
          onCancelOperate();
        }
      }, 1000);
    }

  // 取消按钮
  handleCancelClick = () => {
    const { onCancelOperate } = this.props;
    if (onCancelOperate) {
      onCancelOperate();
    }
  }

  render() {
    const { modalVisible } = this.state;
    return (
      <Form className="m-form">
        <div className="dis-fx alc" style={{ padding: '10rem 1.5rem 1.5rem 1.5rem', fontSize: '1.5rem' }}>
          <i className="iconfont icon-icon-download m-color" style={{ fontSize: '2.5rem' }} />&nbsp;&nbsp;文档附件下载
        </div>
        <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
        <Row className="m-row-form" style={{ borderTop: '1px solid #e9e9e9', background: '#fff', position: 'fixed', bottom: '0', margin: '0', width: '100%' }}>
          <Col span={24} style={{ textAlign: 'right', marginTop: '1rem' }}>
            <FormItem
              wrapperCol={{ span: 24 }}
              className={`m-product-search-item ${styles.mitem}`}
            >
              <Button
                className="ant-btn m-btn-radius m-btn-red ant-btn-primary"
                onClick={this.handleOK}
                style={{ margin: '0 1rem 0 0.833rem' }}
              > 下载
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Modal
          title="系统处理中,请稍候..."
          centered
          destroyOnClose
          closable={false}
          maskClosable={false}
          visible={modalVisible}
          footer={null}
        />
      </Form>
    );
  }
}

export default Form.create()(AttachmentDownload);
