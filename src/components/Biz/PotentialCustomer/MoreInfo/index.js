import React from 'react';
import { Card, Tabs } from 'antd';
import MessageLog from './MessageLog';
import OrderFlow from './OrderFlow';
import InformationUpdatelog from './InformationUpdateLog';

const { TabPane } = Tabs;

class MoreInfo extends React.Component {
  state = {
    currentKey: '1',
  }
  handleChange = (value) => {
    this.setState({
      currentKey: value,
    });
  }
  render() {
    return (
      <Card className="m-card default" >
        <Tabs className="m-tabs-underline m-tabs-underline-small" onChange={this.handleChange} value={this.state.currentKey}>
          <TabPane tab="消息记录" key="1" />
          <TabPane tab="订单流水" key="2" />
          <TabPane tab="信息更新记录" key="3" />
        </Tabs>
        <div className="m-tabs-underline ant-tabs-content ant-tabs-content-animated" style={{ marginLeft: 0 }}>
          <div className={`ant-tabs-tabpane ${this.state.currentKey === '1' ? 'ant-tabs-tabpane-active' : 'ant-tabs-tabpane-inactive'}`} style={{ display: this.state.currentKey === '1' ? 'block' : 'none' }}>
            <MessageLog />
          </div>
          <div className={`ant-tabs-tabpane ${this.state.currentKey === '2' ? 'ant-tabs-tabpane-active' : 'ant-tabs-tabpane-inactive'}`} style={{ display: this.state.currentKey === '2' ? 'block' : 'none' }}>
            <OrderFlow />
          </div>
          <div className={`ant-tabs-tabpane ${this.state.currentKey === '3' ? 'ant-tabs-tabpane-active' : 'ant-tabs-tabpane-inactive'}`} style={{ display: this.state.currentKey === '3' ? 'block' : 'none' }}>
            <InformationUpdatelog />
          </div>
        </div>
      </Card>
    );
  }
}

export default MoreInfo;
