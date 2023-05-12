import React, { Component } from 'react';
import { Button, Col, Row, Modal, Progress, Spin } from 'antd';
import config from '$utils/config';
const { ftq } = config;

const {
  newProduct: {
    exportOwnershipDetail,
  } } = ftq;

class TenureExport extends Component {
  state = {
    modalVisible: false,
    percent: 0,
    loading: false,
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
        action = exportOwnershipDetail;
        const { ownershipDetailModel } = _props;
        const tableHeaderCodesArr = [
          'yyb',
          'cpdl',
          'cpzl',
          'cpdm',
          'cpmc',
          'khmc',
          'khh',
          'khjb',
          'xsgx',
          'kfgx',
          'fwgx',
          'tjrq',
          'rjby',
          'rjkhby',

        ];
        const headerInfoArr = [
          '营业部',
          '产品大类',
          '产品子类',
          '产品代码',
          '产品名称',
          '客户名称',
          '客户号',
          '客户级别',
          '销售关系',
          '开发关系',
          '服务关系',
          '统计日期',
          '日均保有(万)',
          '日均考核保有(万)',
        ];
        let tableHeaderCodes = tableHeaderCodesArr.join(',');
        let headerInfo = headerInfoArr.join(',');
        const exportPayload = JSON.stringify({
          tableHeaderCodes,
          headerInfo,
          ownershipDetailModel,
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

  render () {
    const { modalVisible, percent, loading } = this.state;
    return (
      <Row style={{ color: '#61698C', padding: '0', fontSize: '16px', marginBottom: '16px' }} type='flex' align='middle'>
        <Col span={6}>
          <Button onClick={this.showConfirm} style={{ marginTop: 10 }} className="m-btn-radius m-btn-blue"><Spin spinning={loading}>导出表格</Spin></Button> 
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
        </Col>
      </Row>
    );
  }
}

export default TenureExport;