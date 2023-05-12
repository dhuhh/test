import React from 'react';
import { Row, Col, Card, Tabs } from 'antd';
import BasicModal from '../../../Common/BasicModal';
import MyGroup from './MyGroup';

const colors = ['m-tag-violet', 'm-tag-blue', 'm-tag-orange', 'm-tag-pink'];
class SearchMod extends React.Component {
  state={
    selectedLable: [],
    selectedLableTitle: [],
  }
  handleChange = (value) => { // 改变state
    const { keys = [], titles = [] } = value;
    this.setState({
      selectedLable: keys,
      selectedLableTitle: titles,
    });
  }
  handleTagSelect = (checked, khqid, khqmc) => { // 客户群标签选择操作
    const { selectedLable, selectedLableTitle } = this.state;
    if (checked) {
      selectedLable.push(khqid);
      selectedLableTitle.push(khqmc);
    } else {
      const index = selectedLable.indexOf(khqid);
      if (index !== -1) {
        selectedLable.splice(index, 1);
        selectedLableTitle.splice(index, 1);
      }
    }
    this.setState({
      selectedLable,
      selectedLableTitle,
    });
  }
  handleOk = () => {
    const { onOk } = this.props;
    onOk({ keys: this.state.selectedLable, titles: this.state.selectedLableTitle });
  }
  render() {
    // const { visible, onCancel, title = '客户群选择', myCusGroup = [], shareCusGroup = [] } = this.props;
    const { visible, onCancel, title = '客户群选择', myCusGroup = [], departmentCusGroup = [], khfwDatas } = this.props;
    const modalProps = {
      title,
      visible,
      width: '50%',
      onCancel,
      onOk: this.handleOk,
    };
    return (
      <BasicModal {...modalProps}>
        <div className="scroll">
          <Row style={{ padding: '0' }} >
            <Col xs={24} sm={24} lg={24} xl={24}>
              <Row className="m-row-title">
                <Col sm={24}>
                  <span className="head-title">已选客户群</span>
                </Col>
                <Col sm={24}>
                  {
                    this.state.selectedLable.map((item, index) => {
                      return (
                        <div key={item} className={`${colors[index % 4]} m-tag-popup ant-tag`}>
                          <span className="ant-tag-text">
                            <span className="">{this.state.selectedLableTitle[index]}</span>
                            <i className="iconfont icon-close-small" onClick={() => { this.handleTagSelect(false, this.state.selectedLable[index], this.state.selectedLableTitle[index]); }} />
                          </span>
                        </div>
                      );
                    })
                  }
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} lg={24} xl={24}>
              <Card className="m-card myCard default">
                <Tabs defaultActiveKey="1" className="m-tabs-underline m-tabs-underline-small">
                  <Tabs.TabPane tab="我的客户群" key="1">
                    <MyGroup selectedLable={this.state.selectedLable} selectedLableTitle={this.state.selectedLableTitle} handleTagSelect={this.handleTagSelect} groups={myCusGroup} />
                  </Tabs.TabPane>
                  {
                    khfwDatas.findIndex(item => item.name.indexOf('营业部') >= 0) >= 0 ? (
                      <Tabs.TabPane tab="营业部客户群" key="2">
                        <MyGroup selectedLable={this.state.selectedLable} selectedLableTitle={this.state.selectedLableTitle} handleTagSelect={this.handleTagSelect} groups={departmentCusGroup} />
                      </Tabs.TabPane>
                    ) : null
                  }
                </Tabs>
              </Card>
            </Col>
          </Row>
        </div>
      </BasicModal>
    );
  }
}
export default SearchMod;
