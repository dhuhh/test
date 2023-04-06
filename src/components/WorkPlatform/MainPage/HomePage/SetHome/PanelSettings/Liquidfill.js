import React from 'react';
import { Card } from 'antd';

class Liquidfill extends React.Component {
  state = {
  }

  handleDel = (value) => {
    const { handleDel } = this.props;
    handleDel(value);
  }

  render() {
    return (
      <Card
        className="m-card m-card-shadow noPadding"
        title="消息概况"
      >
        <div style={{ lineHeight: '60px', textAlign: 'center' }}>
          <i className="iconfont icon-xiaoxizhongxin m-color" style={{ fontSize: '48px', opacity: '0.1', fontWeight: 'bold' }} />
        </div>
      </Card>
    );
  }
}

export default Liquidfill;
