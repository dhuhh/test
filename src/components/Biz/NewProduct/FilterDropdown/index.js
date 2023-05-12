import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button } from 'antd';
import DSelect from './DSelect';
import DInput from './DInput';
import DInputRange from './DInputRange';
import DTreeSelect from './DTreeSelect';
import DDateRange from './DDateRange';

/**
 * Component: FilterDropdown
 * Description: 表格filter的组件
 * Author: WANGQI
 * Date: 2020/11/06
 * Remarks: 注释的代码都不要删，可能会用到
 */
class FilterDropdown extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired, // 组件类型
    dictKey: PropTypes.string, // 组件需要的字典key
    onChange: PropTypes.func, // 接收value的回调函数
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [], // 使用数组，无论是single还是range；date类数值都是Moment类型，调用接口时需处理
      title: '', // 回显title
    };
  }

  handleValueChange = (value) => {
    this.setState({ value });
  }

  handleTitleChange = (title) => {
    this.setState({ title });
  }

  getContent = () => {
    const { value = [] } = this.state;
    const { type = '', dictKey = '', dictionary, selectData = [], colCode = '', filterDicData = [] } = this.props;
    let cont = null;
    const commonProps = {
      value,
      handleChange: this.handleValueChange,
      handleTitleChange: this.handleTitleChange,
    };
    // 1|字典;2|范围值;3|具体值
    switch (type) {
      case '1':
        cont = <DSelect dictKey={dictKey} dictionary={dictionary} selectData={selectData} colCode={colCode} filterDicData={filterDicData} {...commonProps} />;
        break;
      case '2':
        cont = <DInputRange {...commonProps} />;
        break;
      case '3':
        cont = <DInput {...commonProps} />;
        break;
      case 'treeSelect':
        cont = <DTreeSelect {...commonProps} />;
        break;
      case 'dateRange':
        cont = <DDateRange {...commonProps} />;
        break;
      default: cont = null;
        break;
    }
    return cont;
  }

  handleClear = () => {
    const { onChange } = this.props;
    this.setState({ value: [], title: '' });
    if (onChange) {
      onChange({ value: [], title: '' });
    }
  }

  handleOk = () => {
    const { value = [], title = '' } = this.state;
    const { onChange, confirm } = this.props;
    if (onChange) {
      onChange({ value, title });
    }
    if (confirm) {
      confirm();
    }
  }

  render() {
    return (
      <div>
        <div style={{ width: '26rem', padding: '1rem', height: `${this.props.type === '1' ? '20rem' : 'auto'}` }}>
          {this.getContent()}
        </div>
        <div style={{ padding: '10px 14px', textAlign: 'right', borderTop: '1px solid #EAEEF2' }}>
          <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px' }} onClick={this.handleClear}>清 空</Button>
          <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleOk}>确 定</Button>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(FilterDropdown);
