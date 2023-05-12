import React, { Component } from 'react';
import { Button, Col, Row, Modal, Progress, Spin } from 'antd';
import config from '$utils/config';
// import { formatThousands } from '$components/Common/Utils';

const { api } = config;
const {
  newProduct: {
    exportDataIncomeAndRewardList,
  } } = api;
class Export extends Component {
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
    const { getTotalCount, setData, exportMaxcount = 1000000 } = this.props;
    if (getTotalCount) {
      getTotalCount().then(res => {
        let count = 0;
        console.log(res,'getTotalCount');
        alert('test')
        let collectCount = res[0].count, detailCount = res[1].count, staffCount = res[2].count, productCount = res[3].count;
        res.forEach(i => {
          if (i.success) {
            count += i.count;
          }
        });
        if (setData) {
          setData({
            exportLoading: false,
          });
        }
        if (count >= exportMaxcount) {
          Modal.warning({ title: `导出数据大于${exportMaxcount}条，无法导出` });
        } else {
          this.export(count, collectCount, detailCount, staffCount, productCount);
        }
      }).catch(err => {
        console.log(err, 'error');
      });
    }

  };

  export = (totalCount, collectCount, detailCount, staffCount, productCount) => {
    const {
      exportPercentUtl = '/api/customerAggs/v2/exportPercent', // 点击导出后系统处理进度信息
    } = this.props;
    if (totalCount <= 0) {
      Modal.info({ content: '无数据可导出!' });
      return false;
    }
    const _props = this.props;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    Modal.confirm({
      title: '提示：',
      content: (<div>
        <span>是否导出数据（共{totalCount}条）？</span>
        <div>汇总：{collectCount}条</div>
        <div>销售明细：{detailCount}条</div>
        <div>按人员：{staffCount}条</div>
        <div>按产品：{productCount}条</div>
      </div>),
      okText: '确定',
      cancelText: '取消',
      onOk () {
        let action = '';
        action = exportDataIncomeAndRewardList;
        const tableHeaderNamesTotal = ['分支号', '分支机构/营业部', '销售额(元)', '占比', '考核销量(元)', '占比', '估算销售创收(元)', '估算销售奖励(元)'];
        const tableHeaderNamesDetail = ['营业部', '产品大类', '产品子类', '交易行为', '交易日期', '产品代码', '产品名称', '销售额(万)', '客户名称', '客户号', '客户级别', '销售关系', '开发关系', '服务关系', '考核销量(元)', '销售创收(元)', '手续费收入(元)', '佣金收入(元)', '销售服务费收入(元)', '其他收入(元)', '销售奖励(元)', '手续费奖励(元)', '佣金奖励(元)', '销售服务费奖励(元)', '其他奖励(元)', '更新日期', '备注'];
        const tableHeaderNamesByProduct = ['产品大类', '产品子类', '产品代码', '产品名称', '销售额(元)', '考核销量(元)', '日均考核保有(元)', '销售创收(元)', '手续费收入(元)', '佣金收入(元)', '销售服务费收入(元)', '其他收入(元)', '销售创收(元)', '手续费奖励(元)', '佣金奖励(元)', '销售服务费奖励(元)', '其他奖励(元)'];
        const tableHeaderNamesByStaff = ['人员id', '姓名', '销售额(元)', '占比', '考核销量(元)', '占比', '日均考核保有(元)', '估算销售创收(元)', '估算销售奖励(元)'];
        const tableHeaderCodesTotal = ['customer_department_id', 'customer_department', 'salesVolume', 'salesVolumePro', 'evaluateSalesVolume', 'evaluateSalesVolumePro', 'evaluateSalesRevenue', 'evaluateSalesReward'];
        const tableHeaderCodesDetail = ['customer_department', 'product_major_type_name', 'product_sub_type_name', 'transaction_behavior', 'transaction_date', 'product_code', 'product_name', 'sales_volume', 'customer_name', 'customer_no', 'customer_level_name', 'sales_staff_name', 'development_staff_name', 'service_staff_name', 'evaluate_sales_volume', 'sales_revenue', 'fee_income', 'commission_income', 'sales_service_income', 'others_income', 'sales_reward', 'fee_reward', 'commission_reward', 'sales_service_reward', 'others_reward', 'date', 'remarks'];
        const tableHeaderCodesByProduct = ['product_major_type_name', 'product_sub_type_name', 'product_code', 'product_name', 'salesVolume', 'evaluateSalesVolume', 'evaluateHoldings', 'salesRevenue', 'feeIncome', 'commissionIncome', 'salesServiceIncome', 'othersIncome', 'salesReward', 'feeReward', 'commissionReward', 'salesServiceReward', 'othersReward'];
        const tableHeaderCodesByStaff = ['staff_id', 'staff_name', 'salesVolume', 'salesVolumePro', 'evaluateSalesVolume', 'evaluateSalesVolumePro', 'evaluateHoldings', 'evaluateSalesRevenue', 'evaluateSalesReward'];
        const { incomeAndRewardListModel, cycleValue } = _props;
        const exportPayload = JSON.stringify({
          uuid,
          tableHeaderNamesTotal,
          tableHeaderNamesDetail,
          tableHeaderNamesByProduct,
          tableHeaderNamesByStaff,
          tableHeaderCodesTotal,
          tableHeaderCodesDetail,
          tableHeaderCodesByProduct,
          tableHeaderCodesByStaff,
          staticalPeriod: cycleValue,
          incomeAndRewardListModel,
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
        if (totalCount >= 10000 && typeof EventSource !== 'undefined') {
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
  }

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

  render () {
    const { modalVisible, percent, loading } = this.state;
    const { incomeReward, exportMaxcount = 1000000 } = this.props;
    return (
      <Row style={{ color: '#61698C', padding: '0', fontSize: '16px', marginBottom: '16px' }} type='flex' align='middle'>
        <Col span={6}>
          {
            incomeReward.includes('export') ?
              <Button onClick={this.showConfirm} style={{ marginTop: 10 }} className="m-btn-radius m-btn-blue"><Spin spinning={loading}>全部导出</Spin></Button> :
              ''
          }
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

export default Export;