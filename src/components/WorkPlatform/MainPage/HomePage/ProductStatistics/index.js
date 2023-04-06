import React from 'react';
import { Row, Col } from 'antd';
import SalesDistributionStatistics from './SalesDistributionStatistics';
import IncomeTrendAnalysis from './IncomeTrendAnalysis';
import IncomeDistributionStatistics from './IncomeDistributionStatistics';
import SalesTrendAnalysis from './SalesTrendAnalysis';

function ProductStatistics(props) {
  return (
    <Row className="m-row" style={{ margin: '0 -10px' }}>
      <Col xs={24} sm={24} lg={12} xl={12} xxl={6}>
        <SalesDistributionStatistics {...props} />
      </Col>
      <Col xs={24} sm={24} lg={12} xl={12} xxl={6}>
        <IncomeDistributionStatistics {...props} />
      </Col>
      <Col xs={24} sm={24} lg={12} xl={12} xxl={6}>
        <IncomeTrendAnalysis {...props} />
      </Col>
      <Col xs={24} sm={24} lg={12} xl={12} xxl={6}>
        <SalesTrendAnalysis {...props} />
      </Col>
    </Row>
  );
}
export default ProductStatistics;
