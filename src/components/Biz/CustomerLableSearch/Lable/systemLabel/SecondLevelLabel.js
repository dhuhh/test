import React from 'react';
import { Card } from 'antd';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import ThirdLevelLabel from './ThirdLevelLabel';
import styles from '../../index.less';

class SecondLevelLabel extends React.Component {
  getSecondLevelDatas = () => {
    const { secondLevelDatas = {}, pid = '' } = this.props;
    const { records = [] } = secondLevelDatas;
    const data = [];
    records.forEach((item) => {
      if (item.pid === pid) {
        data.push(item);
      }
    });
    return data;
  }
  handlePanelChange = (openKeys = []) => {
    const { secondDefaultActiveKeys = [], updateSecondKeys } = this.props;
    if (secondDefaultActiveKeys.length === 0) {
      if (updateSecondKeys && typeof updateSecondKeys === 'function') {
        updateSecondKeys.call(this, openKeys);
      }
      return;
    }
    if (openKeys.length > 2) {
      if (updateSecondKeys && typeof updateSecondKeys === 'function') {
        updateSecondKeys.call(this, openKeys[openKeys.length - 1]);
      }
      return;
    }
    const lastOpenKey = secondDefaultActiveKeys[0];
    const keys = [];
    openKeys.forEach((item) => {
      if (item !== lastOpenKey) {
        keys.push(item);
      }
    });
    if (updateSecondKeys && typeof updateSecondKeys === 'function') {
      updateSecondKeys.call(this, keys);
    }
  }
  render() {
    const { searchText = '', selectedLable = [], handleTagSelect, secondLevelDatas = {}, thirdLevelDatas = {}, secondDefaultActiveKeys = [] } = this.props; // eslint-disable-line
    const records = this.getSecondLevelDatas();
    // const { datas = {} } = secondLevelDatas;
    return (
      <Scrollbars autoHide style={{ width: '100%', height: '20rem', marginLeft: '2rem' }} >
        {/* <Collapse bordered={false} activeKey={searchText !== '' ? Object.keys(datas) : secondDefaultActiveKeys} onChange={this.handlePanelChange}>
          {
            records.map(item => (
              <Collapse.Panel header={item.name} key={item.id}>
                <ThirdLevelLabel pid={item.id} searchText={searchText} selectedLable={selectedLable} handleTagSelect={handleTagSelect} thirdLevelDatas={thirdLevelDatas} />
              </Collapse.Panel>
            ))
          }
        </Collapse> */}
        {
          records.map((item) => {
            return (
              <Card title={<span style={{ }}>{item.name}</span>} className={classnames(` ${styles.flCard} m-card default `)} headStyle={{ maxHeight: '4rem' }}>
                <ThirdLevelLabel pid={item.id} searchText={searchText} selectedLable={selectedLable} handleTagSelect={handleTagSelect} thirdLevelDatas={thirdLevelDatas} />
              </Card>);
          })
        }
      </Scrollbars>
    );
  }
}

export default SecondLevelLabel;
