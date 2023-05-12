import React from 'react';
import OrderFlowSearchForm from './form';
import OrderFlowDataList from './list';

class OrderFlow extends React.Component {
  render() {
    return (
      <div>
        <OrderFlowSearchForm />
        <OrderFlowDataList />
      </div>
    );
  }
}

export default OrderFlow;
