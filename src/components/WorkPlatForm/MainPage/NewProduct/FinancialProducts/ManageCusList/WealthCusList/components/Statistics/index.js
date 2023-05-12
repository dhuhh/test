import React, { Component } from 'react';
import { Button, Col, Row, Modal, Progress } from 'antd';
import lodash from 'lodash';
import config from '../../../../../../../../utils/config';
import { formatThousands } from '../../Common/Utils';

const { api } = config;
const {
  newProduct: {
    exportDataFinancailCusList,
  } } = api;
class Statistics extends Component {
  state = {
    modalVisible: false,
    percent: 0,
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
    const {
      total,
      exportPercentUtl = '/api/customerAggs/v2/exportPercent', // 点击导出后系统处理进度信息
    } = this.props;
    if (total <= 0) {
      Modal.info({ content: '无数据可导出!' });
      return false;
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
        action = exportDataFinancailCusList;
        const { customerType, tableHeaderNames, queryType, sort, timePeriod,filter: attrConditionModels, keyword } = _props;
        if (customerType === '12') {
          tableHeaderNames[2] = '销售金额(万)';
        }
        const tableHeaderCodes = [
          'customer_name',
          'customer_no',
          'transactionAmount',
          'marketValueMerge',
          'holding_product_number',
          'averageMarketValue',
        ];
        const operateButtonSelModel = {
          selectAll: 1,
        };
        const financialCusListModel = {
          customerType,
          fieldsCode: [""],
          keyword,
          queryType,
          sort,
          timePeriod,
        };
        const exportPayload = JSON.stringify({
          uuid,
          operateButtonSelModel,
          financialCusListModel,
          tableHeaderCodes,
          tableHeaderNames,
          attrConditionModels,
          // keyword,
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

  // 格式化数据/单位
  formatValue = (value) => {
    let dw = '元';
    if (parseFloat(value) >= 10000000000) {
      value = (parseFloat(value) / 100000000).toFixed(2);
      dw = '亿';
    } else if (parseFloat(value) < 10000000000 && parseFloat(value) >= 1000000) {
      value = (parseFloat(value) / 10000).toFixed(2);
      dw = '万';
    }
    return { value, dw };
  }

  render() {
    const { modalVisible, percent } = this.state;
    let { statistics: { market_value = '', transaction_amount = '', average_market_value = '' }, searchForm = {}, customerType = '' } = this.props;
    market_value = this.formatValue(market_value);
    transaction_amount = this.formatValue(transaction_amount);
    average_market_value = this.formatValue(average_market_value);
    return (
      <div style={{ color: '#61698C', padding: '0', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <div style={{ paddingRight: 10 }}>
          <span className="ax-tjsj-name">统计数据：</span>
          <span style={{ marginRight: '2rem' }}>上日市值：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(market_value, 'value', '--'))}</span> {lodash.get(market_value, 'dw', '元')}</span>
          <span style={{ marginRight: '2rem' }}>{customerType === '12' ? '销售金额' : '交易金额'}：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(transaction_amount, 'value', '--'))}</span> {lodash.get(transaction_amount, 'dw', '元')}</span>
          <span style={{ marginRight: '2rem' }}>日均保有：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(average_market_value, 'value', '--'))}</span> {lodash.get(average_market_value, 'dw', '元')}</span>
          { function() {
            if (lodash.get(searchForm, 'props.form', '')) {
              if (searchForm.props.form.getFieldsValue().khlx.join() === '12') {
                return <span>仅展示销售金额&gt;0元的客户列表，保有及市值按客户进行统计</span>;
              }
            }
          }() }
        </div>
        <div>
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
