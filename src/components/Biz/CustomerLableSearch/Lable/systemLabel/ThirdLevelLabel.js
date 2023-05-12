import React from 'react';
import { Tag } from 'antd';
import styles from '../myLabel.less';

class ThirdLevelLabel extends React.Component {
  getThirdLevelDatas = () => {
    const { thirdLevelDatas = {}, pid = '' } = this.props;
    const { records = [] } = thirdLevelDatas;
    const data = [];
    records.forEach((items = []) => {
      items.forEach((item = {}) => {
        if (item.pid === pid) {
          data.push(item);
        }
      });
    });
    return data;
  }
  render() {
    const { selectedLable = [], handleTagSelect, searchText = '', pid = '' } = this.props;
    const records = this.getThirdLevelDatas();
    return (
      records.map((item) => {
        const { id, name } = item;
        let tempClassName = `${selectedLable.includes(`${pid}-${id}`) ? 'm-tag-popup m-tag-blue' : 'm-tag-popup'}`;
        if (searchText && name.indexOf(searchText) >= 0) {
          tempClassName = `${tempClassName} m-tag-orange`;
        }
        return (
          <Tag.CheckableTag
            className={tempClassName}
            key={`${pid}-${id}`}
            title={name}
            checked={selectedLable.includes(`${pid}-${id}`)}
            onChange={checked => handleTagSelect(checked, `${pid}-${id}`, name)}
          >
            <span className="ant-tag-text">
              <span className={styles.overflow}>{name}</span>
            </span>
          </Tag.CheckableTag>
        );
      })
    );
  }
}

export default ThirdLevelLabel;
