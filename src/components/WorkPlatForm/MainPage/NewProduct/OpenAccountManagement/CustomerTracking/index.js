import React, { Component } from 'react';
import { Row, Steps, Tabs, message } from 'antd';
import { connect } from 'dva';
import { GetChnnlAccnBreakCust } from '$services/newProduct';
import styles from './index.less';
import InterruptAccount from './interruptAccount';
import NotGold from './notGold';
import NotMid from './notMid';
import NotValid from './notValid';
import Ignore from './Ignore';
const { Step } = Steps;


class CustomerTracking extends Component {
  state = {
    step: 0,
    breakCustInfo: [],
  };
  componentDidMount() {
    this.getChnnlAccnBreakCust();
  }
  getChnnlAccnBreakCust = () => {
    GetChnnlAccnBreakCust().then(res => {
      this.setState({
        breakCustInfo: res.records,
      });
    }).catch(error => {
      message.error(error.note || error.success);
    });
  }

  changeStep = (step) => {
    this.setState({
      step,
    });
  }

  render() {
    const { step, breakCustInfo } = this.state;
    return (
      <div style={{ fontSize: 14, color: '#1A2243', background: '#FFF', overflow: 'auto' }} className={styles.CustomerTracking}>
        <Row className={styles.progressStyle}>
          <Steps progressDot current={step} onChange={this.changeStep} >
            <Step title={<div style={{ color: step === 0 ? '#244FFF' : '#61698C' }}><div style={{ fontSize: 14 }}>开户中断</div><div style={{ fontSize: 12 }}>({breakCustInfo.find(item => item.proType === '1')?.proNum || 0})</div></div>} status={step === 0 ? 'finish' : 'wait'} />
            <Step title={<div style={{ color: step === 1 ? '#244FFF' : '#61698C' }}><div style={{ fontSize: 14 }}>30天内未入金</div><div style={{ fontSize: 12 }}>({breakCustInfo.find(item => item.proType === '2')?.proNum || 0})</div></div>} status={step === 1 ? 'finish' : 'wait'} />
            <Step title={<div style={{ color: step === 2 ? '#244FFF' : '#61698C' }}><div style={{ fontSize: 14 }}>入金30天未转有效</div><div style={{ fontSize: 12 }}>({breakCustInfo.find(item => item.proType === '3')?.proNum || 0})</div></div>} status={step === 2 ? 'finish' : 'wait'} />
            <Step title={<div style={{ color: step === 3 ? '#244FFF' : '#61698C' }}><div style={{ fontSize: 14, whiteSpace: 'nowrap' }}>转有效60天内未转中端</div><div style={{ fontSize: 12 }}>({breakCustInfo.find(item => item.proType === '4')?.proNum || 0})</div></div>} status={step === 3 ? 'finish' : 'wait'} />
            <Step title={<div style={{ color: step === 4 ? '#244FFF' : '#61698C' }}><div style={{ fontSize: 14 }}>已过期/已忽略/已执行</div></div>} status={step === 4 ? 'finish' : 'wait'} />
          </Steps>
        </Row>
        <Tabs activeKey={step + ''} animated={false}>
          <Tabs.TabPane key='0' tab=''>
            <InterruptAccount getChnnlAccnBreakCust={this.getChnnlAccnBreakCust} />
          </Tabs.TabPane>
          <Tabs.TabPane key='1' tab=''>
            <NotGold getChnnlAccnBreakCust={this.getChnnlAccnBreakCust} />
          </Tabs.TabPane>
          <Tabs.TabPane key='2' tab=''>
            <NotValid getChnnlAccnBreakCust={this.getChnnlAccnBreakCust} />
          </Tabs.TabPane>
          <Tabs.TabPane key='3' tab=''>
            <NotMid getChnnlAccnBreakCust={this.getChnnlAccnBreakCust} />
          </Tabs.TabPane>
          <Tabs.TabPane key='4' tab=''>
            <Ignore getChnnlAccnBreakCust={this.getChnnlAccnBreakCust} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  sysParam: global.sysParam,
  authorities: global.authorities,
}))(CustomerTracking);