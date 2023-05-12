import React from 'react';
import { Card, Button } from 'antd';
import SearchForm from './SearchForm';
import DataChartAndList from './DataChartAndList';
import Export from './Export';

class LoginStatus extends React.Component {
  state = {
    payload: {
    },
  }

  updatePayload = (p) => {
    const { payload } = this.state;
    this.setState({
      payload: {
        ...payload,
        ...p,
      },
    });
  }
  handleClick = () => {
    if (this.exprot) {
      this.exprot.showConfirm();
    }
  }
  render() {
    const { payload } = this.state;
    return (
      <Card
        className="m-card"
        title={<span style={{ padding: 0 }} className="m-top-pay-title">登录情况趋势统计图</span>}
        extra={<Button onClick={this.handleClick} className="m-btn-radius m-btn-gray">导出</Button>}
      >
        <SearchForm updatePayload={this.updatePayload} />
        <Export ref={(node) => { this.exprot = node; }} payload={payload} />
        <DataChartAndList payload={payload} />
      </Card>
    );
  }
}
export default LoginStatus;
