import React from 'react';
import { Row, Col } from 'antd';

class SelectedLable extends React.Component {
  render() {
    const { selectedLable = [], selectedLableTitle, handleTagSelect } = this.props;
    const colors = ['m-tag-violet', 'm-tag-blue', 'm-tag-orange', 'm-tag-pink'];
    return (
      <Row className="m-row-title" style={{ paddingTop: '0' }}>
        <Col sm={24}>
          <span className="head-title" style={{ fontSize: '1.2rem', lineHeight: '0.5' }}>已选客户所在标签</span>
        </Col>
        <Col sm={24}>
          {
            selectedLable.map((item, index) => {
              return (
                <div key={item} title={selectedLableTitle[index]} className={`${colors[index % 4]} m-tag-popup ant-tag`} style={{ marginBottom: '0.3rem' }}>
                  <span className="ant-tag-text">
                    <span className="">{selectedLableTitle[index]}</span>
                    <i className="iconfont icon-close-small" title={`将已选客户从${selectedLableTitle[index]}中移除`} onClick={() => handleTagSelect(false, item, selectedLableTitle[index])} />
                  </span>
                </div>
              );
            })
          }
        </Col>
      </Row>
    );
  }
}
export default SelectedLable;
