import React from 'react';
import { Select } from 'antd';
import lodash from 'lodash';
import styles from './index.less';

class DSelect extends React.Component {
  handleValueChange = (_, es) => {
    const { dictionary = {}, dictKey = '', handleChange, handleTitleChange } = this.props;
    const dics = dictionary[dictKey] || [];
    const value = es.map(m => lodash.get(m, 'props.value', ''));
    const titles = es.map(m => lodash.get(m, 'props.children', ''));
    if (handleChange) {
      handleChange(value);
    }
    let title = '';
    if (titles.length === 1) {
      title = titles[0];
    } else {
      if (value.length === 0) {
        title = '';
      } else {
        if (dics.length === value.length) {
          title = '全选';
        } else {
          title = '多选';
        }
      }
    }
    if (handleTitleChange) {
      handleTitleChange(title);
    }
  }

  getDicData = () => {
    const { dictionary = {}, dictKey = '', colCode = '', filterDicData = [] } = this.props;
    let dics = dictionary[dictKey] || [];
    if (colCode && filterDicData.length > 0) {
      const item = filterDicData.find(m => m.code === colCode);
      if (item) {
        const { productCountItemModels = [] } = item;
        return productCountItemModels.map(m => ({ key: m.key, ibm: m.key, note: `${m.val || '--'}(${m.count || 0})` }));
      }
    }
    return dics;
  }

  render() {
    const { value = [], selectData = [] } = this.props;
    const dics = this.getDicData();
    return (
      <Select
        className={styles.mSelect}
        mode="multiple"
        allowClear
        dropdownClassName={styles.mSelectDropdown}
        maxTagCount={2}
        maxTagTextLength={3}
        value={value}
        onChange={this.handleValueChange}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        placeholder="请选择..."
        style={{ width: '100%' }}
        dropdownStyle={{ boxShadow: 'none' }}
        dropdownMenuStyle={{ height: '15.5rem' }}
        dropdownMatchSelectWidth
        getPopupContainer={triggerNode => triggerNode.parentElement}
        open
      >
        {
          dics.length > 0 ?
            dics.map(m => <Select.Option key={m.ibm} value={m.ibm}>{m.note}</Select.Option>) :
            selectData.map(m => <Select.Option key={m.ibm} value={m.ibm}>{m.note}</Select.Option>)
        }
      </Select>
    );
  }
}

export default DSelect;
