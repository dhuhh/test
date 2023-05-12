import React, { Component } from 'react';
import { Tabs } from 'antd';
import GroupReport from './GroupReport';
import StaffReport from './StaffReport';
import styles from './index.less';
export default class WageStatistics extends Component {
  state = {
    activeKey: 'groupReport',
  };
  componentDidMount() {
  }
  renderTab = (tabString, tabKey) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ lineHeight: '44px' }}>{tabString}</div>
        <div style={{ visibility: tabKey === this.state.activeKey ? 'visible' : 'hidden' }} className={styles.tabsInkBar}></div>
      </div>
    );
  }
  render() {
    return (
      <div>
        <Tabs className={styles.tabs} activeKey={this.state.activeKey} onChange={activeKey => { this.setState({ activeKey }); }}>
          <Tabs.TabPane tab={this.renderTab('渠道小组提成汇总表', 'groupReport')} key='groupReport'>
            <GroupReport />
          </Tabs.TabPane>
          <Tabs.TabPane tab={this.renderTab('渠道小组员工提成报表', 'staffReport')} key='staffReport'>
            <StaffReport />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
