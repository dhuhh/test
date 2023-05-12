import React, { Component } from 'react';
import { Tabs,Modal ,Divider } from 'antd';
import styles from '../index.less';
const { TabPane } = Tabs;


export default class index extends Component {
  state = {
    tabKey: this.props.tab1,
  }
  changeTab = (tabKey)=>{
    this.setState({
      tabKey,
    });
  }
  render() {
    const { tabKey } = this.state;
    return (
      <div className={styles.tabsBox}>
        <Tabs className={styles.tabs} onChange={this.changeTab} activeKey={tabKey}>
          {
            this.props.children.map((item,index)=>{
              return (
                <TabPane tab={this.props.title[index]} key={index}>
                  {
                    item
                  }
                </TabPane>
              );
            })
          }
        </Tabs>
      </div>
    );
  }
}
