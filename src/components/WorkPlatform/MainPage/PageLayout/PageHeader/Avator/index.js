/* eslint-disable no-shadow */
/* eslint-disable no-debugger */
import React from 'react';
import BasicModal from '../../../../../../components/Common/BasicModal';
import avatorPng from '../../../../../../assets/avatar-person-male.png';
import AvatorCanvas from './AvatorCanvas';

class Avator extends React.Component {
  state = {
    visible: false,
    photo: this.props.avatorShowPic,
  };

  componentWillReceiveProps(nextProps) {
    const { avatorShowPic } = nextProps;

    this.setState({
      photo: avatorShowPic,
    });
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleClose = () => {
    this.setState({ visible: false });
  }

  showDefaultImgError = (e) => {
    e.target.src = avatorPng;
  }

  render() {
    const { visible, photo } = this.state;
    const { avatorShowPic = '', dispatch, forceRender, avatorPng, photoPng } = this.props;
    return (
      <React.Fragment>
        <img id="userInfoAvatorImgs" src={photo ? `data:image/png;base64,${photo}` : avatorPng} alt="avator" title="点击修改头像" onError={this.showDefaultImgError} onClick={this.showModal} />
        <BasicModal
          width="50rem"
          style={{ top: '2rem' }}
          title="修改头像"
          visible={visible}
          onCancel={this.handleClose}
          footer={null}
        >
          <AvatorCanvas photoPng={photoPng} dispatch={dispatch} forceRender={forceRender} onCancel={this.handleClose} showPic={avatorShowPic} />
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default Avator;
