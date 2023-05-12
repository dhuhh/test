import { Col, DatePicker, Row, Tooltip } from 'antd';
import React from 'react';
import styles from '../../index.less';

function CalendarPopover(props) {
  const handleChange = (date) => {
    props.setTime(date);
    // 选中日期的时候关掉日历
    props.setSearchFormSetVisible(false);
  };

  const renderTitle = (current) => {
    let title = '';
    const item = props.signDate.find(item => item.date === current.format('YYYYMMDD'));
    if (item) {
      if (item.taskNum) title += `任务${item.taskNum}/`;
      if (item.eventNum) title += `事件${item.eventNum}/`;
      if (item.processNum) title += `流程${item.processNum}/`;
      title = title.substr(0, title.length - 1);
    }
    return title;
  };

  const computed = (current) => {
    return props.signDate.find(item => item.date === current.format('YYYYMMDD')) && props.signDate.find(item => item.date === current.format('YYYYMMDD')).eventNum ? '#FF6E30' : '#234EFD';
  };

  return (
    <div>
      <DatePicker
        value={props.time}
        onChange={handleChange}
        open={props.visible}
        dropdownClassName={styles.datePicker}
        dateRender={(current, today) => (
          <Tooltip title={renderTitle(current)}>
            <div className='ant-calendar-date'>
              <Row type='flex' align='middle' justify='center'>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  { current.format('D') }
                </Col>
                {
                  props.signDate.find(item => item.date === current.format('YYYYMMDD')) && (
                    <Col style={{ alignSelf: 'flex-start' }}>
                      <div style={{ width: 6, height: 6, background: computed(current), borderRadius: '50%' }}></div>
                    </Col>
                  )}
              </Row>

            </div>
          </Tooltip>
        )}
      />
    </div>
  );
}

export default CalendarPopover;