import React from 'react';
import BasicModal from '../../Common/BasicModal';

import InputTagPicker from '../../Common/InputTagPicker';
import Lable from './Lable';

class CustomerLable extends React.Component {
  state = {
    inputTagPickerValue: {
      keys: ['1', '2', '3', '4', '5', '6'],
      titles: ['第一项', '第二项', '第三项', '第四项', '第五项', '第六项'],
      modalVisible: false,
    },
  }
  hanleInputTagPickerChange = (value) => {
    this.setState({ inputTagPickerValue: value });
  }
  // 标签弹出层按钮
  buttonShowModal = () => {
    this.setState({
      modalVisible: true,
    });
  }
  // 弹出层中确认按钮点击事件
  handleOk = (e) => { // eslint-disable-line
    this.setState({
      modalVisible: false,
    });
  }
  // 弹出层中取消按钮点击事件
  handleCancel = (e) => { // eslint-disable-line
    this.setState({
      modalVisible: false,
    });
  }
  render() {
    const { inputTagPickerValue } = this.state;
    const inputTagPickerProps = {
      lable: '客户标签',
      value: inputTagPickerValue,
      onChange: this.hanleInputTagPickerChange,
      onButtonClick: this.buttonShowModal,
    };
    return (
      <div>
        <InputTagPicker {...inputTagPickerProps} />
        <BasicModal
          title="打标签"
          width="50%"
          style={{ height: '100%', margin: '0 auto', top: 20 }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Lable />
        </BasicModal>
      </div>
    );
  }
}
export default CustomerLable;
