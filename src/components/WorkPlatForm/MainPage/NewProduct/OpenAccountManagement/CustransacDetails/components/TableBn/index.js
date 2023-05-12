import React, { Component } from 'react';
import { Modal ,Divider,message,Progress, Row,Col } from 'antd';
import { connect } from 'dva';
import config from '$utils/config';
import Ebutton32 from '../Ebutton32';
import './index.css';
const { ftq } = config;
const {
  productChance: {
    getValueAddProductChanceResponseExport
  } } = ftq;

class TableBtn extends Component {
  state={
    // visible: false,
    data: [],
    modalVisible: false,
    percent: 0,
  }

  exportApi = (type)=>{
    switch(type){
      case 1: return getValueAddProductChanceResponseExport;

      default:getValueAddProductChanceResponseExport;
    }
  }
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }
  export = (flag) => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = this.exportApi(this.props.type||1);
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    let total = this.props.total||0;
    if(total > 40000){
      Modal.info({ content: '导出数据不能超过4万条!' });
      return;
    }else if(total <= 0){
      Modal.info({ content: '暂无数据可导出!' });
      return;
    }
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let columns = _this.props.getColumns();
        let headerCodeList = columns.map(item => item.dataIndex).filter(item=> item !== 'phone');
        let headerList = columns.map(item => typeof item.title === 'string' ? item.title : item.key).filter(item=> item !== '手机号');
        headerList = headerList.join(',');
        headerCodeList = headerCodeList.join(',');
        let param = _this.props.param();
        console.log(columns,'columns');
        const exportPayload = JSON.stringify({
          headerCodeList,
          headerList,
          ...param,
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

        if (total >= 10000000 && typeof EventSource !== 'undefined') {
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
    const { data } = this.state;
    return (
      <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <div style={{display:'flex',alignItems:'center'}}>
          <span style={{ height: 15, width: 4, background: '#244FFF', display: "inline-block", marginRight: 4 }}></span>
          <span style={{ fontSize: 16, color: '#1A2243', fontWeight: 'bold',verticalAlign:'bottom' }}>查询结果</span>
        </div>
        <div style={{display:'flex',marginBottom:'20px'}}>
          {/* <div className='shortCut' onClick={this.export}>导出</div> */}
          <Ebutton32 onClick={this.export} text='导出'/>
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
        <Modal
        //   className={styles.modal}
        className='modalPadding'
          visible={this.state.c4Visible}
          footer={null}
          destroyOnClose
          onCancel={this.handleCancelC4}
          width={this.state.c4Type === 2 ? 819 : 686}
        >
          <iframe src={this.state.c4Url} title='c4' style={{ border: 'none' }} width='100%' height='564px'/>
        </Modal>
      </div>
      </>
    );
  }
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(TableBtn);