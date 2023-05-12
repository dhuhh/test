import React, { Component } from 'react';
import { Tabs,Modal ,Divider } from 'antd';
import styles from './index.less';
import Invalid from './Invalid';
import TianLiBao from './TianLiBao';
import Margin from './Margin';
import StockOptions from './StockOptions';
import HKStock from './HKStock';
import NewThirdBoard from './NewThirdBoard';
import TechBoard from './TechBoard';
import GrowthBoard from './GrowthBoard';
import PekingStock from './PekingStock';
import FundInvest from './FundInvest';
import { viewSensors } from './utils.js';
const { TabPane } = Tabs;

export default class index extends Component {
  state = {
    tabKey: this.props.tabKey,
  }

  componentDidMount() {
    viewSensors();
  }

  changeTab = (tabKey)=>{
    this.setState({
      tabKey,
    });
  }
  render() {
    const { tabKey } = this.state;
    const { tab1,tab2 } = this.props;
    return ( 
      <Tabs className={styles.bussiTabs} onChange={this.changeTab} activeKey={tabKey}>
        <TabPane tab='无效户激活' key='1'>
          <Invalid tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='天利宝' key='2'>
          <TianLiBao tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='融资融券' key='3'>
          <Margin tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='股票期权' key='4'>
          <StockOptions tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='港股通' key='5'>
          <HKStock tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='新三板' key='6'>
          <NewThirdBoard tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='科创板' key='7'>
          <TechBoard tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='创业板' key='8'>
          <GrowthBoard tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='北交所' key='9'>
          <PekingStock tab1={tab1} tab2={tab2}/>
        </TabPane>
        <TabPane tab='基金投顾' key='10'>
          <FundInvest tab1={tab1} tab2={tab2}/>
        </TabPane>
      </Tabs>
    );
  }
}
