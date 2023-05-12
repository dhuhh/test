import React from 'react';
import { Card } from 'antd';
import PotentialCustomerBasicInfo from './BasicInfo';
import ProductCustomization from './ProductCustomization';
import MoreInfo from './MoreInfo';

class PotentialCustomerModal extends React.Component {
  render() {
    return (
      <Card className="m-card default">
        <PotentialCustomerBasicInfo />
        <ProductCustomization />
        <MoreInfo />
      </Card>
    );
  }
}

export default PotentialCustomerModal;
