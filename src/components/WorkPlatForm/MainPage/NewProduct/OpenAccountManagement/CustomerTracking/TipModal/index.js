/* eslint-disable array-callback-return */
import React from 'react';
import { Button } from 'antd';
import BasicModal from '$common/BasicModal';

class TipModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {

  }

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  render() {
    const { visible = false, content = '' } = this.props;
    return (
      <BasicModal
        className='m-bss-nofooter-modal'
        width="614px"
        title='提示'
        destroyOnClose
        visible={visible}
        onCancel={this.onCancel}
        footer={null}
      >
        <div style={{ padding: '30px 24px 20px' }}>
          <div>{content}</div>
          <div style={{ textAlign: 'right', paddingTop: '47px' }}>
            <Button className='m-btn ant-btn m-btn-blue' style={{ height: '40px', borderRadius: '0px' }} onClick={this.onCancel}>确定</Button>
          </div>
        </div>
      </BasicModal>
    );
  }
}
export default TipModal;
