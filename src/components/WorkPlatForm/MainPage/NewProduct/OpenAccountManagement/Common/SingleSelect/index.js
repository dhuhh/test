import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import styles from '../../index.less';
class SingleSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { selectChange, selectValue , dictionary } = this.props;
    const groupTypeInfo = dictionary['CHNL_EWMLX'] || [];
    // 去除个人
    // const filtersDate = groupTypeInfo.filter(item => item.ibm !== '1');
    return (
      <Select
        style={{ width: '160px' }}
        value={selectValue}
        onChange={selectChange}
        defaultActiveFirstOption={false}
        className={styles.selectHeight}
      >
        <Select.Option key='0' value=''>全部</Select.Option>
        {groupTypeInfo.map(item => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>
        )}
      </Select >
    );
  }
}
export default connect(({ global })=>({
  dictionary: global.dictionary,
}))(SingleSelect);
