import React from 'react';
import { Input } from 'antd';
import lodash from 'lodash';
import styles from './index.less';

class DInput extends React.Component {
  handleValueChange = (e) => {
    const { handleChange, handleTitleChange } = this.props;
    const value = lodash.get(e, 'target.value', '');
    if (handleChange) {
      handleChange([value]);
    }
    if (handleTitleChange) {
      handleTitleChange(value);
    }
  }

  render() {
    const { value = [] } = this.props;
    return (
      <Input
        className={styles.mInput}
        value={value[0] || ''}
        placeholder="请输入"
        onChange={this.handleValueChange}
      />
    );
  }
}

export default DInput;
