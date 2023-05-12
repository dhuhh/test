import React from 'react';
import CustomerGroupWidget from './CustomerGroupWidget';

class CustomerGroup extends React.Component {
  state = {
    inputTagPickerValue: {
      keys: [],
      titles: [],
    },
  }
  componentWillReceiveProps(nextProps) {
    const { customerGroups = '', customerGroupsTitles = '' } = nextProps;
    if (customerGroups && customerGroups !== '') {
      this.setState({
        inputTagPickerValue: {
          keys: customerGroups === '' ? [] : customerGroups.split(','),
          titles: customerGroupsTitles === '' ? [] : customerGroupsTitles.split(','),
        },
      });
    } else if (customerGroups === '') {
      this.setState({
        inputTagPickerValue: {
          keys: [],
          titles: [],
        },
      });
    }
  }
  hanleInputTagPickerChange = (value) => {
    // 额外执行，由父级传入
    const { handleOkExtra } = this.props;
    this.setState({ inputTagPickerValue: value });
    this.triggerChange(value);
    // 执行额外方法
    const { keys, titles } = value;
    if (handleOkExtra && typeof handleOkExtra === 'function') {
      handleOkExtra.call(this, keys, titles);
    }
  }
  triggerChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }
  render() {
    const { inputTagPickerValue: valueInstate } = this.state;
    const { inputTagPickerValue: value = valueInstate, authorities, dictionary, userBasicInfo, queryParameter, khfwDatas, getContainer, showLabel = true } = this.props;
    const inputTagPickerProps = {
      value,
      onChange: this.hanleInputTagPickerChange,
    };
    let hasButton = false;
    if (Object.keys(authorities).includes('customerGroup')) {
      hasButton = true;
    }
    return (
      <CustomerGroupWidget getContainer={getContainer} hasButton={hasButton} khfwDatas={khfwDatas} queryParameter={queryParameter} authorities={authorities} dictionary={dictionary} userBasicInfo={userBasicInfo} showLabel={showLabel} {...inputTagPickerProps} />
    );
  }
}
export default CustomerGroup;
