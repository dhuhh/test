import React from 'react';
import { Row, Col } from 'antd';
import { withRouter } from 'dva/router';
import SchCalendar from './SchCalendar';

function OperationalCalendar(props) {
  return (
    <Row className="m-row">
      <Col xs={24} sm={24} lg={24} xl={24} >
        <SchCalendar {...props} />
      </Col>
    </Row>
  );
}

export default withRouter(OperationalCalendar);
