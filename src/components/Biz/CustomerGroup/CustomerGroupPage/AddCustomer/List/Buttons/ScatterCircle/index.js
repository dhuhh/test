import React from 'react';
import { Button } from 'antd';
import BasicModal from '../../../../../../../Common/BasicModal';
import ScatterCircleModalContent from '../../../../../../../Biz/Digital/ScatterCircle';

class ScatterCircle extends React.Component {
  state = {
    visible: false,
  }

  render() {
    const { visible = false } = this.state;
    const scatterCircleModalProps = {
      width: '80rem',
      title: '散点圈人',
      style: { top: '2rem', overflowY: 'auto' },
      visible,
      onCancel: () => { this.setState({ visible: false }); },
      footer: null,
    };
    return (
      <React.Fragment>
        <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => { this.setState({ visible: true }); }}>散点圈人</Button>
        <BasicModal {...scatterCircleModalProps}>
          <ScatterCircleModalContent />
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default ScatterCircle;
