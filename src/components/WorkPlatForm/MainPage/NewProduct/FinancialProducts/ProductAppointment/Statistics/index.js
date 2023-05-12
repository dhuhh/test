import React, { Component } from 'react';
import { Button, Col, Row, Modal, Progress } from 'antd';
import config from '$utils/config';

const { ftq } = config;

const {
  newProduct: {
    productAppointmentExport,
  } } = ftq;

class Statistics extends Component {
  state = {
    modalVisible: false,
    percent: 0,
  }

  componentDidMount() {

  }

  componentWillUnmount () {
    // 清空定时器,避免内存泄漏
    if (this.timers && this.timers.length > 0) {
      this.timers.forEach((timer) => {
        clearTimeout(timer);
      });
      this.timers = null;
    }
    // 关闭EventSource,避免内存泄漏
    if (this.eventSources && this.eventSources.length > 0) {
      this.eventSources.forEach((eventSource) => {
        if (eventSource && eventSource.close) {
          eventSource.close();
        }
      });
      this.eventSources = null;
    }
  }

  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }

  showConfirm = () => {
    const { total = 0 } = this.props;
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统
    if (total <= 0) {
      Modal.info({ content: '当前无数据导出!' });
      return false;
    }
    if (total > 50000) {
      Modal.info({ content: '导出数据不能超过5万条!' });
      return;
    }
    const _props = this.props;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk () {
        let action = '';
        action = productAppointmentExport;
        const { productAppointmentModel } = _props;
        const tableHeaderCodesArr = [
          'CUSTOMER',
          'ACCOUNT',
          'ORG_FULL_NAME',
          'TRD_NAME',
          'PR_ORDER_STATUS',
          'CREATE_TIME',
          'INST_CODE',
          'INST_SNAME',
          'ORDER_AMT',
          'ORDER_VOL',
          'RESULT_TEXT',
        ];
        const headerInfoArr = [
          '客户号',
          '资金账号',
          '营业部',
          '交易行为',
          '预委托状态',
          '委托时间',
          '产品代码',
          '产品名称',
          '委托金额',
          '委托份额',
          '委托结果描述',
        ];
        let tableHeaderCodes = tableHeaderCodesArr.join(',');
        let headerInfo = headerInfoArr.join(',');
        const exportPayload = JSON.stringify({
          tableHeaderCodes,
          headerInfo,
          productAppointmentModel,
        });
        const form1 = document.createElement('form');
        form1.id = 'form1';
        form1.name = 'form1';
        // 添加到 body 中
        document.getElementById('m_iframe').appendChild(form1);
        // 创建一个输入
        const input = document.createElement('input');
        // 设置相应参数
        input.type = 'text';
        input.name = 'exportPayload';
        input.value = exportPayload;

        // 将该输入框插入到 form 中
        form1.appendChild(input);

        // form 的提交方式
        form1.method = 'POST';
        // form 提交路径
        form1.action = action;

        // 对该 form 执行提交
        form1.submit();
        // 删除该 form
        document.getElementById('m_iframe').removeChild(form1);
        if (total >= 10000 && typeof EventSource !== 'undefined') {
          // if (typeof EventSource !== 'undefined') {
          if (!_this.timers) {
            _this.timers = [];
          }
          // 浏览器支持 Server-Sent
          const timer1 = setTimeout(() => {
            _this.setState({ modalVisible: true, percent: 0 });
            const source = new EventSource(`${exportPercentUtl}?uuid=${uuid}`);
            let eventSourcesIndex = 0;
            // 成功与服务器发生连接时触发
            source.onopen = () => {
              if (!_this.eventSources) {
                _this.eventSources = [];
              }
              eventSourcesIndex = _this.eventSources.legnth;
              _this.eventSources.push(source);
            };
            source.onmessage = (event) => {
              const { data: percent = 0 } = event;
              if (percent === '100') {
                source.close();
                if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
                const timer2 = setTimeout(() => {
                  _this.setState({ modalVisible: false, percent: 0 });
                  if (_this.timers && _this.timers.length > 0) {
                    const index = _this.timers.findIndex(timer => timer === timer2);
                    if (index >= 0) {
                      _this.timers.splice(index, 1);
                    }
                  }
                }, 1000);
                _this.timers.push(timer2);
              }
              // handle message
              _this.setState({ percent });
            };
            source.onerror = () => {
              source.close();
              if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
              const timer3 = setTimeout(() => {
                _this.setState({ modalVisible: false, percent: 0 });
                if (_this.timers && _this.timers.length > 0) {
                  const index = _this.timers.findIndex(timer => timer === timer3);
                  if (index >= 0) {
                    _this.timers.splice(index, 1);
                  }
                }
              }, 1000);
              _this.timers.push(timer3);
            };
          }, 500);
          _this.timers.push(timer1);
        } else {
          // 浏览器不支持 Server-Sent..
        }
      },
    });
  };

  render() {
    const { modalVisible, percent } = this.state;

    return (
      <div style={{ color: '#61698C', padding: '0', fontSize: '16px', marginBottom: '16px' }}>
        <div style={{ display: "flex" , justifyContent: 'end' }}>
          <Button onClick={this.showConfirm} className="m-btn-radius m-btn-blue" style={{ marginRight: '0' }} >导出表格</Button>
          <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
          <Modal
            title="系统处理中,请稍候..."
            centered
            destroyOnClose
            closable={false}
            maskClosable={false}
            visible={modalVisible}
            footer={null}
          >
            <Row>
              <Col span={2}>进度:</Col>
              <Col span={22}><Progress percent={parseInt(percent, 10)} status={percent === '100' ? 'success' : 'active'} /></Col>
            </Row>
          </Modal>
        </div>
      </div>
    );
  }
}
export default Statistics;
