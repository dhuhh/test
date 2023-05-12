import React, { Component } from 'react';
import { Row, Col } from 'antd';
import CompContent from '../../../../../components/WorkPlatForm/MainPage/Customer/Label';

class Label extends Component {
  render() {
    return (
      <React.Fragment>
        {/* 顶部标签定义栏 */}
        <Row className="m-row-pay-top" >
          <Col sm={24} >
            <div className="m-top-pay-title" >标签定义</div>
          </Col>
        </Row>

        {/* 下面的内容 */}
        <CompContent />
      </React.Fragment>
    );
  }
}
export default Label;
