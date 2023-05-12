import React from 'react';
import { Row, Col, Tabs, Card } from 'antd';
import SelectedLable from './selectedLable';
import MyLable from './myLabel';
// import HotLable from './hotLable';
import styles from '../../CustomerLableSearch/index.less';

const { TabPane } = Tabs;

class Lable extends React.Component {
  render() {
    const { handleTagSelect, selectedRowKeys = [], myCusLable, dispatch, cusBasicInfo, selectedLable, selectedLableTitle, selectedCount, handleClear, handleSearch, selectAll, addLabel } = this.props;
    const { khxm = '--', khh = '--', nl = '--', xb = '--' } = cusBasicInfo;
    let showKhxm = '';
    if (parseInt(selectedCount, 10) > 1) {
      showKhxm = `已选择${selectedCount}个客户`;
    } else {
      showKhxm = khxm;
    }
    return (
      <div className="scroll">
        <Row style={{ padding: '0' }} >
          <Col xs={24} sm={24} lg={24} xl={24}>
            <Row className="m-row-title">
              <Col sm={24}>
                <div className="title-header" style={{ paddingTop: '0' }}>
                  <span className="title-header-top" style={{ fontSize: '1.2rem' }}>{showKhxm}</span>
                  <i className={`iconfont ${xb.indexOf('男') >= 0 ? 'icon-man' : 'icon-woman'}`} style={{ display: (selectedRowKeys.length !== 1 || selectAll) ? 'none' : '', fontSize: '1.6rem' }} />
                  <button type="button" style={{ display: (selectedRowKeys.length !== 1 || selectAll) ? 'none' : '' }} className="m-btn-tag m-btn-tag-pink ant-btn " size="small">
                    <span>{ nl === '' ? '--' : nl }岁</span>
                  </button>
                </div>
              </Col>
              <Col sm={24} style={{ display: (selectedRowKeys.length !== 1 || selectAll) ? 'none' : '' }}>
                <span className="title-header-bottom">({khh})</span>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} lg={24} xl={24}>
            <SelectedLable handleTagSelect={handleTagSelect} selectedLableTitle={selectedLableTitle} selectedLable={selectedLable} />
          </Col>
          <Col xs={24} sm={24} lg={24} xl={24}>
            <Card className={`m-card myCard default ${styles.activeTab}`}>
              <Tabs defaultActiveKey="1" className={styles.typeTab} style={{ borderTop: 'solid 1px #ecedee' }} tabPosition="left">
                <TabPane tab="我的标签" key="1">
                  <MyLable handleSearch={handleSearch} handleClear={handleClear} handleTagSelect={handleTagSelect} selectedLable={selectedLable} myCusLable={myCusLable} dispatch={dispatch} addLabel={addLabel} />
                </TabPane>
                {/* <TabPane tab="热门系统标签" key="2">
                  <HotLable handleTagSelect={handleTagSelect} selectedLable={selectedLable} hotCusLable={hotCusLable} dispatch={dispatch} />
                </TabPane> */}
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Lable;
