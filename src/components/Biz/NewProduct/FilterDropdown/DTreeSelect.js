import React from 'react';
import { TreeSelect } from 'antd';
import styles from './index.less';

class DTreeSelect extends React.Component {
  handleValueChange = (value) => {
    const { handleChange } = this.props;
    if (handleChange) {
      handleChange([value]);
    }
  }

  render() {
    const { value = [] } = this.props;
    return (
      <TreeSelect
        className={styles.mSelect}
        dropdownClassName={styles.mSelectDropdown}
        showSearch={false}
        // filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        style={{ width: '100%' }}
        placeholder="请选择..."
        allowClear={false}
        treeDefaultExpandAll
        value={value[0]}
        onChange={this.handleValueChange}
      >
        <TreeSelect.TreeNode value="parent 1" title="parent 1" key="0-1">
          <TreeSelect.TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
            <TreeSelect.TreeNode value="leaf1" title="my leaf" key="random" />
            <TreeSelect.TreeNode value="leaf2" title="your leaf" key="random1" />
          </TreeSelect.TreeNode>
          <TreeSelect.TreeNode value="parent 1-1" title="parent 1-1" key="random2">
            <TreeSelect.TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
          </TreeSelect.TreeNode>
        </TreeSelect.TreeNode>
      </TreeSelect>
    );
  }
}

export default DTreeSelect;
