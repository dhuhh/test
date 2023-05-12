import React from 'react';
import { message } from 'antd';
import InputTagPicker from '../../../Common/InputTagPicker/PopPicker';
import { getCusGroup } from '../../../../services/customerbase/myCusGroup';
import Modal from './modal';
import SearchMod from './SearchMod';
// import styles from './index.less';

class CustomerGroupWidget extends React.Component {
  state = {
    modalVisible: false,
    searchModVisible: false, // 搜索弹出框
    myCusGroup: [],
    departmentCusGroup: [],
  }
  componentDidMount() {
    // 获取客户群信息
    this.fetchCusGroupData();
  }
  // 获取客户群信息
  fetchCusGroupData = () => {
    // 获取我的客户群群信息 和 获取共享群信息
    getCusGroup({ khqlx: '', paging: 0 }).then((result) => {
      const { records = [] } = result || {};
      const myCusGroup = [];
      const departmentCusGroup = [];
      if (Array.isArray(records)) {
        records.forEach((item) => {
          const { khqlx = '我的客户群' } = item;
          if (khqlx === '我的客户群') {
            myCusGroup.push(item);
          } else {
            departmentCusGroup.push(item);
          }
        });
      }
      this.setState({
        myCusGroup,
        departmentCusGroup,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 选择客户群弹出层中确认按钮点击事件
  handleOk = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    this.setState({
      searchModVisible: false,
    });
  }
  // 点击输入框后弹框,选择客户群
  handleInputClick = () => {
    this.setState({ searchModVisible: true });
    // 获取客户群信息
    this.fetchCusGroupData();
    const { value = {} } = this.props;
    const { keys = [], titles = [] } = value;
    this.searchMod.handleChange({
      keys,
      titles,
    });
  }
  // 点击按钮后弹框
  handleInputButtonChange = () => {
    this.setState({ modalVisible: true });
    // 获取客户群信息
    this.fetchCusGroupData();
  }
  // 关闭弹框重新查询数据
  handleModalClose = () => {
    this.setState({ modalVisible: false, myCusGroup: [] });
    // this.fetchCusGroupData();
  }
  handleDelete = (key, khqmc) => {
    const { value = {} } = this.props;
    if (value.keys.includes(key)) {
      const keys = value.keys.filter(item => item !== key);
      const titles = value.titles.filter(item => item !== khqmc);
      this.searchMod.handleChange({
        keys,
        titles,
      });
      const { onChange } = this.props;
      if (onChange) {
        onChange({
          keys,
          titles,
        });
      }
    }
  }
  // 对外提供onChange事件,用于给form表单等调用
  hanleInputTagPickerChange = (value) => {
    this.searchMod.handleChange(value);
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }
  render() {
    // 屏蔽共享群
    // const { modalVisible, myCusGroup = [], shareCusGroup = [] } = this.state;
    const { modalVisible, myCusGroup = [], departmentCusGroup = [] } = this.state;
    const { value, lable = '客户群', authorities, dictionary, userBasicInfo, queryParameter, khfwDatas, hasButton = true, getContainer, showLabel } = this.props;
    const inputTagPickerProps = {
      lable: showLabel ? lable : '',
      value,
      hasButton,
      buttonIcon: 'icon-customer-gl',
      onButtonClick: this.handleInputClick,
      onManageClick: this.handleInputButtonChange,
      onChange: this.hanleInputTagPickerChange,
    };
    return (
      <span>
        <InputTagPicker {...inputTagPickerProps} />
        <Modal
          visible={modalVisible}
          myCusGroup={myCusGroup}
          departmentCusGroup={departmentCusGroup}
          refreshCusGroupData={this.fetchCusGroupData}
          authorities={authorities}
          dictionary={dictionary}
          onCancel={this.handleModalClose}
          userBasicInfo={userBasicInfo}
          handleDelete={this.handleDelete}
          queryParameter={queryParameter}
          khfwDatas={khfwDatas}
          style={{ top: '2rem' }}
          getContainer={getContainer}
        />
        <SearchMod
          ref={(node) => { this.searchMod = node; }}
          userBasicInfo={userBasicInfo}
          visible={this.state.searchModVisible}
          onOk={this.handleOk}
          onCancel={() => { this.setState({ searchModVisible: false }); }}
          myCusGroup={myCusGroup}
          khfwDatas={khfwDatas}
          departmentCusGroup={departmentCusGroup}
        />
      </span>
    );
  }
}
export default CustomerGroupWidget;
