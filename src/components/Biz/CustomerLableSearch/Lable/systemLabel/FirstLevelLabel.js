import React from 'react';
import { Tabs } from 'antd';
// import { Scrollbars } from 'react-custom-scrollbars';
import SecondLevelLabel from './SecondLevelLabel';
import styles from '../../index.less';

const { TabPane } = Tabs;


class FirstLevelLabel extends React.Component {
  state = {
    defaultActiveKeys: [],
    secondDefaultActiveKeys: [],
  }
  handlePanelChange = (openKeys = []) => {
    const { defaultActiveKeys = [] } = this.state;
    if (defaultActiveKeys.length === 0) {
      this.setState({
        defaultActiveKeys: openKeys,
        secondDefaultActiveKeys: [],
      });
      return;
    }
    if (openKeys.length > 2) {
      this.setState({
        defaultActiveKeys: openKeys[openKeys.length - 1],
        secondDefaultActiveKeys: [],
      });
      return;
    }
    const lastOpenKey = defaultActiveKeys[0];
    const keys = [];
    openKeys.forEach((item) => {
      if (item !== lastOpenKey) {
        keys.push(item);
      }
    });
    this.setState({
      defaultActiveKeys: keys,
      secondDefaultActiveKeys: [],
    });
  }
  updateSecondKeys = (keys) => {
    this.setState({
      secondDefaultActiveKeys: keys,
    });
  }
  render() {
    const { searchText = '', selectedLable = [], handleTagSelect, firstLevelDatas = {}, secondLevelDatas = {}, thirdLevelDatas = {}, defaultFirstActiveKey = '' } = this.props;
    const { defaultActiveKeys = '', secondDefaultActiveKeys } = this.state;
    const { records = [], datas = {} } = firstLevelDatas;
    let activeKey = searchText !== '' ? Object.keys(datas) : defaultActiveKeys;
    if (defaultFirstActiveKey) {
      activeKey = defaultFirstActiveKey;
    }
    return (
      // // <Scrollbars autoHide style={{ width: '100%', height: '20rem' }} >
      // // <Collapse bordered={false} activeKey={activeKey} onChange={this.handlePanelChange}>
      <Tabs defaultActiveKey={activeKey} tabBarStyle={{ margin: '0 !important' }} className={styles.fxlxTab}>
        {
          records.map(item => (
            <TabPane tab={item.name} key={item.id}>
              <SecondLevelLabel pid={item.id} searchText={searchText} selectedLable={selectedLable} handleTagSelect={handleTagSelect} secondLevelDatas={secondLevelDatas} thirdLevelDatas={thirdLevelDatas} secondDefaultActiveKeys={secondDefaultActiveKeys} updateSecondKeys={this.updateSecondKeys} />
            </TabPane>
          ))
        }
      </Tabs>
      // // </Collapse>
      // // </Scrollbars>
      // <div defaultActiveKey={activeKey} tabBarStyle={{ margin: '0 !important' }} className={styles.fxlxTab}>
      //   {
      //   records.map(item => (
      //     <div >
      //       <SecondLevelLabel pid={item.id} searchText={searchText} selectedLable={selectedLable} handleTagSelect={handleTagSelect} secondLevelDatas={secondLevelDatas} thirdLevelDatas={thirdLevelDatas} secondDefaultActiveKeys={secondDefaultActiveKeys} updateSecondKeys={this.updateSecondKeys} />
      //     </div>
      //       ))
      //     }
      // </div>
    );
  }
}

export default FirstLevelLabel;
