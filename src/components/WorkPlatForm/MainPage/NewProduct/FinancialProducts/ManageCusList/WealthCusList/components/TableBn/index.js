import React, { Component } from 'react';
import { Modal ,Divider,message,Progress, Row,Col } from 'antd';
import Ebutton32 from "../Ebutton32";
import { connect } from 'dva';
import config from '$utils/config';
import lodash from 'lodash';
import { formatThousands } from '../../../Common/Utils';
import './index.css';
const { ftq } = config;
const {
  newProduct: {
    custProductDetailExport
  } } = ftq;

class TableBtn extends Component {
  state={
    modalVisible: false,
    percent: 0,
    isSell:true,
    sellMoney:0.00,
    dateMoney:0.00
  }

  componentDidMount(){
    this.props.getRef(this)
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

  handle = (type,sellMoney=0.00,dateMoney=0.00) => {
     this.setState({
      isSell:type,
      sellMoney,
      dateMoney
     })
  }

  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }
  formatValue = (value) => {
    let dw = '元';
    if (parseFloat(value) >= 10000000000) {
      value = (parseFloat(value) / 100000000).toFixed(2);
      dw = '亿';
    } else if (parseFloat(value) < 10000000000 && parseFloat(value) >= 1000000) {
      value = (parseFloat(value) / 10000).toFixed(2);
      dw = '万';
    }else{
      value = parseFloat(value).toFixed(2)
    }
    return { value, dw };
  }
  export = (flag) => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = custProductDetailExport;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    let total = this.props.total||0;
    let param = this.props.param||{}
    if(!param.cusType){
      Modal.info({ content: '客户类型不能为空!' });
      return;
    }
    if(total <= 0){
      Modal.info({ content: '暂无数据可导出!' });
      return;
    }
    if(total > 100000){
      Modal.info({ content: '最大导出条数为100000条' });
      return;
    }
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const tableHeaderCodes = [
          "customer_name",
          "customer_no",
          "product_name",
          "product_code",
          "product_type",
          "market_value",
          "cccb",
          "cysy",
          "dqr"
        ];
        const headerInfo = [
          "客户姓名",
          "客户号",
          "产品名称",
          "产品代码",
          "产品大类",
          '上日市值',
          "持有成本",
          "持有收益",
          "到期日",
        ]
        let headerList = headerInfo.join(',');
        let headerCodeList = tableHeaderCodes.join(',');
        let exportPayload = {}
        if(total >= 10000 && typeof EventSource !== 'undefined'){
          exportPayload = JSON.stringify({
            tableHeaderCodes:headerCodeList,
            headerInfo:headerList,
            custProductDetailModel:{...param,paging:0},
            uuid:uuid,
            fileName:`理财客户持仓明细列表(${new Date().getFullYear()}${new Date().getMonth()+1<10?'0'+(new Date().getMonth()+1):new Date().getMonth()+1}${new Date().getDate()})`
          });
        }else{
          exportPayload = JSON.stringify({
            tableHeaderCodes:headerCodeList,
            headerInfo:headerList,
            custProductDetailModel:{...param,paging:0}
          });
        }
        
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
  }
  render() {
    const { dateMoney,sellMoney,isSell } = this.state;
    let market_value = this.formatValue(dateMoney);
    let transaction_amount = this.formatValue(sellMoney);
    return (
      <>
      <Divider style={{ margin: '0 0 20px 0' }}></Divider>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <div >
        <span className="ax-tjsj-name">统计数据：</span>
          <span style={{ marginRight: '2rem' }}>上日市值：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(market_value, 'value', '--'))}</span> {lodash.get(market_value, 'dw', '元')}</span>
          <span style={{ marginRight: '2rem' }}>{isSell ? '销售金额' : '交易金额'}：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(transaction_amount, 'value', '--'))}</span> {lodash.get(transaction_amount, 'dw', '元')}</span>
          {/* {isSell&&<span>仅展示销售金额&gt;0元的客户列表，保有及市值按客户进行统计</span>} */}
        </div>
        <div style={{display:'flex',marginBottom:'20px'}}>
          {/* <div className='shortCut' onClick={this.export}>导出</div> */}
          <Ebutton32 text="导出表格" onClick={this.export}/>
        </div>
        <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
        <Modal
          title="系统处理中,请稍候..."
          centered
          destroyOnClose
          closable={false}
          maskClosable={false}
          visible={this.state.modalVisible}
          footer={null}
        >
          <Row>
            <Col span={2}>进度:</Col>
            <Col span={22}><Progress percent={parseInt(this.state.percent, 10)} status={this.state.percent === '100' ? 'success' : 'active'} /></Col>
          </Row>
        </Modal>
      </div>
      </>
    );
  }
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(TableBtn);