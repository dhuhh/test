import React from 'react';
import BasicModal from '../../Common/BasicModal';
import InputTagPicker from '../../Common/InputTagPicker/PopPicker';
import Lable from './Lable';

class CustomerLable extends React.Component {
  state = {
    inputTagPickerValueMod: { // 弹出框里选的标签
      keys: [],
      titles: [],
    },
    inputTagPickerValue: { // 外面input框里的标签
      keys: [],
      titles: [],
    },
    visible: false,
    checked: true,
  }
  componentWillReceiveProps(nextProps) {
    const { customerTags = '', customerTagTitles = '' } = nextProps;
    if (customerTags && customerTags !== '') {
      this.setState({
        inputTagPickerValue: {
          keys: customerTags === '' ? [] : customerTags.split(','),
          titles: customerTagTitles === '' ? [] : customerTagTitles.split('~*|*~'),
        },
      });
    } else if (customerTags === '') {
      this.setState({
        inputTagPickerValue: {
          keys: [],
          titles: [],
        },
      });
    }
  }
  hanleInputTagPickerChange = (value) => {
    const { keys = [], titles = [] } = value;
    this.triggerChange({ keys: keys.join(','), titles: titles.join('~*|*~') });
    this.setState({ inputTagPickerValue: value, inputTagPickerValueMod: value });
  }
  // 标签弹出层按钮
  buttonShowModal = () => {
    const { keys, titles } = this.state.inputTagPickerValue;
    this.state.inputTagPickerValueMod.keys = [];
    this.state.inputTagPickerValueMod.titles = [];
    keys.forEach((item, index) => {
      this.state.inputTagPickerValueMod.keys.push(item);
      this.state.inputTagPickerValueMod.titles.push(titles[index]);
    });
    this.setState({
      visible: true,
    });
  }

  // 弹出层中确认按钮点击事件
  handleOk = () => {
    // 额外执行，由父级组件传入
    const { handleOkExtra } = this.props;
    const { inputTagPickerValueMod } = this.state;
    const keys = inputTagPickerValueMod && inputTagPickerValueMod.keys.join(',');
    const titles = inputTagPickerValueMod && inputTagPickerValueMod.titles.join('~*|*~');
    if (inputTagPickerValueMod && inputTagPickerValueMod.keys.length === 0) {
      // 清空输入框
      this.setState({
        inputTagPickerValue: {
          keys: [],
          titles: [],
        },
      }, () => {
        this.handleCancel();
      });
      return false;
    }
    this.triggerChange({ keys, titles });
    this.setState({
      visible: false,
      inputTagPickerValue: {
        keys: typeof keys === 'string' ? keys.split(',') : keys,
        titles: typeof titles === 'string' ? titles.split('~*|*~') : titles,
      },
    });
    // 执行额外方法
    if (handleOkExtra && typeof handleOkExtra === 'function') {
      handleOkExtra.call(this, keys, titles);
    }
  }

  // 弹出层中取消按钮点击事件
  handleCancel = () => {
    this.setState({
      inputTagPickerValueMod: {
        keys: [],
        titles: [],
      },
      visible: false,
    });
  }
  // 选中标签操作
  handleTagSelect = (checked, key, title) => {
    const { keys, titles } = this.state.inputTagPickerValueMod;
    if (checked) {
      keys.push(key);
      titles.push(title);
    } else {
      const index = keys.indexOf(key);
      if (index !== -1) {
        keys.splice(index, 1);
        titles.splice(index, 1);
      }
    }
    this.setState({
      inputTagPickerValueMod: {
        keys,
        titles,
      },
      checked,
    });
  }
  triggerChange = (changedValue) => {
    // 将值改变传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, changedValue));
    }
  }
  render() {
    const { inputTagPickerValue, checked } = this.state;
    const { hotCusLable, dispatch, getContainer } = this.props;
    const inputTagPickerProps = {
      lable: '客户标签',
      value: inputTagPickerValue,
      onChange: this.hanleInputTagPickerChange,
      onButtonClick: this.buttonShowModal,
      hasButton: false,
    };
    return (
      <div>
        <InputTagPicker {...inputTagPickerProps} />
        <BasicModal
          title="选择标签"
          width="50%"
          style={{ height: '100%', margin: '0 auto', top: 20 }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          getContainer={getContainer}
        >
          <Lable handleTagSelect={this.handleTagSelect} selectedLable={this.state.inputTagPickerValueMod.keys} checked={checked} selectedLableTitle={this.state.inputTagPickerValueMod.titles} dispatch={dispatch} hotCusLable={hotCusLable} />
        </BasicModal>
      </div>
    );
  }
}
export default CustomerLable;
