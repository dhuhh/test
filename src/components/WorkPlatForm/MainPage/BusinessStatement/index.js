import React, { Component } from 'react';
import { Row, Card ,Tabs,message } from 'antd';
import { connect } from 'dva';
import ActivityReport from './ActivityReport';
import ReportFrom from './ReportFrom';
import DerformanceDetail from './DerformanceDetail';
import ConversionFrom from './ConversionFrom';
import styles from './index.less';
import TreeUtils from '$utils/treeUtils';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';

class BusinessStatement extends Component {
  state={
    activeKey: 'detail', 
    departments: [], // 营业部数据
    allYyb: [],
  }
  componentDidMount(){
    const { authorities = {} } = this.props;
    const { businessStatement = [] } = authorities;
    // 是否有查询全部营业部的权限
    if(businessStatement.includes('ggtyyball')){
      this.setState({ activeKey: 'activity' });
    }
    this.getDepartments();
  }
  // 获取管辖营业部的数据
  getDepartments = () => {
    fetchUserAuthorityDepartment().then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments = [];
      datas.forEach((item) => {
        const { children } = item;
        departments.push(...children);
      });
      this.setState({ departments, allYyb: records });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
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
    const { authorities = {} } = this.props;
    const { businessStatement = [] } = authorities;
    const { departments = [],allYyb } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Card className="ax-card" bodyStyle={{ paddingBottom: 0, paddingTop: 0, minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
            <Tabs className={styles.tabs} activeKey={this.state.activeKey} onChange={activeKey => this.setState({ activeKey })}>
              {
                businessStatement.includes('ggtyyball') && (              
                  <Tabs.TabPane tab={this.renderTab('港股通活动业绩表', 'activity')} key='activity'>
                    <ActivityReport departments={departments} allYyb={allYyb}/>
                  </Tabs.TabPane>
                )
              }
              {
                businessStatement.includes('ggtyyball') && (              
                  <Tabs.TabPane tab={this.renderTab('港股通业务报表', 'reportfrom')} key='reportfrom'>
                    <ReportFrom departments={departments} allYyb={allYyb}/>
                  </Tabs.TabPane>
                )
              }
              <Tabs.TabPane tab={this.renderTab('业绩明细表', 'detail')} key='detail'>
                <DerformanceDetail departments={departments} allYyb={allYyb}/>
              </Tabs.TabPane>
              <Tabs.TabPane tab={this.renderTab('港股通潜客转化报表', 'conversion')} key='conversion'>
                <ConversionFrom departments={departments} allYyb={allYyb}/>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Row>
      </React.Fragment>
    );
  }
}
export default  connect(({ global }) => ({
  authorities: global.authorities,
}))(BusinessStatement) ;