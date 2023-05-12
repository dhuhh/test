import React from 'react';
import { Row, Col, Input, message, Tabs } from 'antd';
import { fetchSeniorCusLabelCondition } from '../../../../../services/customersenior';
// import { OmitProps } from 'antd/lib/transfer/renderListBody';
// import FirstLevelLabel from './FirstLevelLabel';
import LabelTree from './LabelTree';
import styles from './index.less';

const { TabPane } = Tabs;
class SystemLabel extends React.Component {
  state = {
    allLabelData: [],
    firstLevelDatas: {},
    secondLevelDatas: {},
    thirdLevelDatas: {},
    searchText: '',
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    fetchSeniorCusLabelCondition({
        entityType: '1',
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        this.setState({
          allLabelData: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  searchChange = (e) => {
    const { value } = e.target;
    this.setState({
      searchText: value,
    });
    const { onChange } = this.lableTree;
    if(onChange){
      onChange(value);
    }
  }
  render() {
    const { selectedLable = [], handleTagSelect, checked } = this.props;
    const { searchText, allLabelData } = this.state;
    return (
      <Row className="m-row-tag" style={{ background: '#fff', padding: '0', height: '30rem' }}>
        <Col sm={24} lg={8}>
          <Input
            placeholder="请输入关键字"
            className="m-input-search-form"
            onChange={this.searchChange}
            style={{ width: '30rem', marginLeft: '2rem', marginTop: '2rem' }}
          />
        </Col>
        <Col sm={24}>
        <Tabs className={styles.fxlxTab} tabBarStyle={{ margin: '0 !important' }}>
            {
            allLabelData.map((item, index) => (
                <TabPane tab={item.name} key={index}>
                 <LabelTree ref={(c) => { this.lableTree = c }} datas={item.child} searchText={searchText} selectedLable={selectedLable} handleTagSelect={handleTagSelect} checked={checked} />
                </TabPane>
            ))
            }
        </Tabs>
        </Col>
      </Row>
    );
  }
}

export default SystemLabel;
