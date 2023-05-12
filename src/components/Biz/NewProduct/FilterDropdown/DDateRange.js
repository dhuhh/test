import React from 'react';
import { Row, Col, DatePicker } from 'antd';
import Moment from 'moment';
import styles from './index.less';

class DDateRange extends React.Component {
  state = {
    selectedLeftKey: '',
  }

  handleValueChange = (value) => {
    const { handleChange } = this.props;
    if (handleChange) {
      handleChange(value);
    }
  }

  handleLeftChange = (flag) => {
    const { handleChange } = this.props;
    let tmpl = null;
    switch (flag) {
      case '1':
        tmpl = [new Moment().add(-1, 'd'), new Moment().add(-1, 'd')];
        break;
      case '2':
        tmpl = [new Moment().add(-1, 'w'), new Moment()];
        break;
      case '3':
        tmpl = [new Moment().date(1), new Moment()];
        break;
      case '4':
        tmpl = [new Moment().month(0).date(1), new Moment()];
        break;
      default:
        tmpl = [];
        break;
    }
    this.setState({ selectedLeftKey: flag });
    if (handleChange) {
      handleChange(tmpl);
    }
  }

  render() {
    const { selectedLeftKey = '' } = this.state;
    const { value = [] } = this.props;
    const defDic = [
      { key: '1', title: '上日' },
      { key: '2', title: '近一周' },
      { key: '3', title: '本月' },
      { key: '4', title: '今年以来' },
    ];
    return (
      <Row style={{ minWidth: '52rem' }}>
        <Col span={4} className={styles.mDateRangeMenu} style={{ minHeight: '25rem' }}>
          {
            defDic.map(m => (
              <div
                key={m.key}
                onClick={() => { this.handleLeftChange(m.key); }}
                style={{ backgroundColor: selectedLeftKey === m.key && '#244FFF', color: selectedLeftKey === m.key && '#FFFFFF' }}
              >
                {m.title}
              </div>
            ))
          }
        </Col>
        <Col span={20} style={{ minHeight: '25rem', padding: '0 .5rem' }}>
          <DatePicker.RangePicker
            className={styles.mDateRange}
            value={value}
            onChange={this.handleValueChange}
            open={true}
            getCalendarContainer={triggerNode => triggerNode.parentNode}
            format="YYYY/MM/DD"
          />
        </Col>
      </Row>
    );
  }
}

export default DDateRange;
