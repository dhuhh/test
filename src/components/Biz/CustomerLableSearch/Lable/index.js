import React from 'react';
import { Row, Col, Tabs, Card } from 'antd';
import SelectedLable from './selectedLable';
import MyLable from './myLabel';
// import HotLable from './hotLable';
import SystemLabel from './systemLabel';
import styles from '../index.less';
import NewSyetemLabel from './NewSyetemLabel';

const { TabPane } = Tabs;

class Lable extends React.Component {
  render() {
    const { handleTagSelect, /* hotCusLable = [], */ myCusLable, dispatch, selectedLable, selectedLableTitle, checked } = this.props;
    return (
      <div className="scroll">
        <Row style={{ padding: '0' }} >
          <Col xs={24} sm={24} lg={24} xl={24}>
            <SelectedLable handleTagSelect={handleTagSelect} selectedLableTitle={selectedLableTitle} selectedLable={selectedLable} />
          </Col>
          <Col xs={24} sm={24} lg={24} xl={24}>
            <Card className={`m-card myCard default ${styles.activeTab}`}>
              <Tabs defaultActiveKey="1" className={styles.typeTab} style={{ borderTop: 'solid 1px #ecedee' }} tabPosition="left">
                <TabPane tab="手工标签" key="1">
                  <MyLable handleTagSelect={handleTagSelect} selectedLable={selectedLable} myCusLable={myCusLable} dispatch={dispatch} />
                </TabPane>
                <TabPane tab="系统标签" key="2">
                  {/* <HotLable handleTagSelect={handleTagSelect} selectedLable={selectedLable} hotCusLable={hotCusLable} dispatch={dispatch} /> */}
                  {/* <SystemLabel handleTagSelect={handleTagSelect} selectedLable={selectedLable} /> */}
                  <NewSyetemLabel handleTagSelect={handleTagSelect} selectedLable={selectedLable} checked={checked} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Lable;
