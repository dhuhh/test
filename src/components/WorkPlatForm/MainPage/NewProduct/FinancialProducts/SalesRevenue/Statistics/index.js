import React, { Component } from 'react';
import { Button, Col, Row, Modal, Progress, message } from 'antd';
import lodash from 'lodash';
import { FetchSalesDisplayBoard } from '$services/newProduct';
import config from '$utils/config';
import { formatThousands } from '$components/WorkPlatForm/MainPage/NewProduct/FinancialProducts/ManageCusList/Common/Utils';

const { api } = config;
const {
  newProduct: {
    saleAndIncomeListExport,
  } } = api;
class Statistics extends Component {
  state = {
    modalVisible: false,
    percent: 0,
    date: '',
  }

  componentDidMount() {
    // 获取数据更新时间
    FetchSalesDisplayBoard({}).then((res) => {
      const { code = 0, date = '' } = res;
      if (code > 0) {
        this.setState({
          date,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
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
      total = 0,
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
        action = saleAndIncomeListExport;
        const { saleAndIncomeListModel, staticalPeriod } = _props;
        const tableHeaderCodes = [
          'product_major_type_name',
          'product_sub_type_name',
          'transaction_behavior',
          'transaction_date',
          'product_code',
          'product_name',
          'sales_volume',
          'evaluate_sales_volume',
          'sales_revenue',
          'customer_name',
          'customer_no',
          'customer_department',
        ];
        const tableHeaderNames = [
          '产品大类',
          '产品子类',
          '交易行为',
          '交易日期',
          '产品代码',
          '产品名称',
          '销售额(元)',
          '考核销量(元)',
          '销售创收(元)',
          '客户姓名',
          '客户号',
          '客户所在营业部',
        ];
        const exportPayload = JSON.stringify({
          uuid,
          dcsl: total,
          tableHeaderCodes,
          tableHeaderNames,
          staticalPeriod,
          saleAndIncomeListModel,
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
    const { statistics = {} } = this.props;
    const { evaluateSalesVolumeAll = '', salesRevenueAll = '', salesVolumeAll = '' } = statistics;
    return (
      <div style={{ color: '#61698C', padding: '0', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <div style={{ paddingRight: 10 }}>
          <span className="ax-tjsj-name">统计数据：</span>
          <span style={{ marginRight: '2rem' }}>销售额：<span style={{ color: '#FF6E2F' }}>{formatThousands(salesVolumeAll ? (salesVolumeAll / 10000).toFixed(2) : '0') || '0'}</span>万</span>
          <span style={{ marginRight: '2rem' }}>考核销量：<span style={{ color: '#FF6E2F' }}>{formatThousands(evaluateSalesVolumeAll ? (evaluateSalesVolumeAll / 10000).toFixed(2) : '0') || '0'}</span>万</span>
          <span style={{ marginRight: '2rem' }}>销量创收：<span style={{ color: '#FF6E2F' }}>{formatThousands(salesRevenueAll ? (salesRevenueAll / 10000).toFixed(2) : '0') || '0'}</span>万</span>
          <span><span style={{ color: '#E81818' }}>*</span>该看板数据为“理财产品销售关系”数据，数据更新至<span style={{ color: '#E81818' }}>{this.state.date || '--'}</span></span>
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
