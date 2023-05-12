import React from 'react';
import { Timeline } from 'antd';
import BasicModal from '../../../Common/BasicModal';

class WorkLogCommentModal extends React.Component {
  render() {
    const modalProps = {
      width: '60%',
      title: '评论',
      footer: null,
      ...this.props,
    };
    return (
      <BasicModal {...modalProps}>
        <Timeline className="m-timeline m-timeline-big m-timeline-blue m-timeline-con ant-timeline" style={{ padding: '3.083rem' }}>
          {modalProps.worklogCommentList.map((item, index) => {
            return (
              <Timeline.Item key={index} style={{ padding: 0 }}>
                <div className="m-item-content-info">
                  <a className="name">{item.plr || '--'}</a>
                  <span className="time-no">{item.plnr.replace(/<br\/>/g, '\n') || '--'}</span>
                </div>
                <p className="info">{(item.plsj || '')}</p>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </BasicModal>
    );
  }
}

export default WorkLogCommentModal;

