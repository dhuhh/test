import React from 'react';
import { Timeline } from 'antd';
import BasicModal from '../../../Common/BasicModal';

class WorkLogViewModal extends React.Component {
  render() {
    const modalProps = {
      width: '28%',
      title: '浏览',
      footer: null,
      ...this.props,
    };
    return (
      <BasicModal {...modalProps}>
        <Timeline className="m-timeline m-timeline-blue ant-timeline" style={{ marginTop: '2rem' }}>
          {modalProps.worklogViewList.map((item, index) => {
            return (
              <Timeline.Item key={index} style={{ paddingBottom: '1rem' }}>
                <span className="time">{item.llsj}</span>
                <span className="time">{item.llr}</span>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </BasicModal>
    );
  }
}

export default WorkLogViewModal;

