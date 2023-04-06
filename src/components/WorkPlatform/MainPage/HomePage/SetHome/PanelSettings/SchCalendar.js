import React from 'react';
import { Card } from 'antd';

class SchCalendar extends React.Component {
  state = {
  }

  render() {
    return (
      <Card
        className="m-card m-card-shadow noPadding"
        title="产品日历"
      >
        <div style={{ lineHeight: '60px', textAlign: 'center' }}>
          <i className="iconfont icon-calendarLine m-color" style={{ fontSize: '48px', opacity: '0.1', fontWeight: 'bold' }} />
        </div>
      </Card>
    );
  }
}

export default SchCalendar;
