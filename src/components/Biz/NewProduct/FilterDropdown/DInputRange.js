import React from 'react';
import { Input } from 'antd';
import lodash from 'lodash';
import styles from './index.less';

class DInputRange extends React.Component {
  handleValueChange = (e, i) => {
    const { value = [], handleChange, handleTitleChange } = this.props;
    const v = lodash.get(e, 'target.value', '');
    const tv = JSON.parse(JSON.stringify(value));
    tv[i] = v;
    if (handleChange) {
      handleChange(tv);
    }
    if (handleTitleChange) {
      handleTitleChange(`${tv[0] || ''} - ${tv[1]}`);
    }
  }

  render() {
    const { value = [] } = this.props;
    return (
      <div>
        <Input
          className={styles.mInput}
          value={value[0] || ''}
          placeholder="请输入"
          onChange={(e) => { this.handleValueChange(e, 0); }}
          style={{ width: '8rem' }}
        />
        <span> - </span>
        <Input
          className={styles.mInput}
          value={value[1] || ''}
          placeholder="请输入"
          onChange={(e) => { this.handleValueChange(e, 1); }}
          style={{ width: '8rem' }}
        />
      </div>
    );
  }
}

export default DInputRange;
