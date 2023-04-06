import React from 'react';
import { Card } from 'antd';

class MyUpcoming extends React.Component {
  state = {
  }

  render() {
    return (
      <Card
        className="m-card m-card-shadow noPadding"
        title="我的待办"
      >
        <div style={{ lineHeight: '60px', textAlign: 'center' }}>
          <i className="iconfont icon-deal m-color" style={{ fontSize: '48px', opacity: '0.1', fontWeight: 'bold' }} />
        </div>
      </Card>
    );
  }
}

export default MyUpcoming;
