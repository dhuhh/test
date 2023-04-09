import React, { Component } from 'react';
import classnames from 'classnames';
import { Tag } from 'antd';
import styles from './index.less';

const { CheckableTag } = Tag;

class TagPicker extends Component {
  state = {
    isMulti: this.props.isMulti || false,
    allTagData: { show: true, key: '', showText: '全部', ...(this.props.allTagData || {}) },
    value: this.props.initialValue || [],
    displayTag: this.props.displayTag,
  }

  handleListSearch = () => {
    const { handleListSearch } = this.props;
    if (handleListSearch && typeof handleListSearch === 'function') {
      handleListSearch.call(111);
    }
  };

  // 选中全选tag
  handleSelectAll = (checked, allKeyValue) => {
    const { value } = this.state;
    // 选中'全选'后,将value清空,并将全选的key加入其中
    value.length = 0;
    value.push(allKeyValue);
    this.setState({ value });
    this.triggerChange(value);
    this.handleListSearch();
  }

  // 选中其它tag
  handleSelect = (checked, tag, allKeyValue) => {
    const { isMulti, value: valueInstate } = this.state;
    const { rowKey = 'id', value = [] } = this.props;
    const tempValue = [...value];
    // 处理value值
    if (value.length === 0) {
      tempValue.push(...valueInstate);
    }
    const selectedValue = tag[rowKey] || '';
    if (isMulti) { // 多选
      if (checked) { // 选中时,去掉allKeyValue(全选的值),并将当前选中的值放入value中
        const index = tempValue.indexOf(allKeyValue);
        if (index >= 0) {
          tempValue.splice(index, 1);
        }
        tempValue.push(selectedValue);
      } else { // 取消选中,去掉当前取消选中的值,并将allKeyValue(全选的值)放入value中
        const index = tempValue.indexOf(selectedValue);
        if (index >= 0) {
          tempValue.splice(index, 1);
        }
        if (tempValue.length === 0) {
          tempValue.push(allKeyValue);
        }
      }
    } else if (checked) { // 单选, 选中后,清空value,并将当前选中的值放入value中,单选无法取消选中
      tempValue.length = 0;
      tempValue.push(selectedValue);
    }
    this.setState({ value: tempValue });
    this.triggerChange(tempValue);
    this.handleListSearch();
  }

  // 向外层的form表单暴露的triggerChange函数(antd的form控件需求)
  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange([...changedValue]);
    }
  }

  // 切换显示隐藏
  handleTag = () => {
    this.setState((prevState) => {
      return { displayTag: !prevState.displayTag };
    });
  }

  render() {
    const { value: valueInstate, allTagData: allTagDataInstate, displayTag } = this.state;
    const { className, style, tagClassName = `${styles.tagSelect} m-tag-small`, allTagData = {}, rowKey = 'id', titleKey = 'name', label = '', dataSource = [], value = valueInstate, tagType } = this.props;
    // 处理样式
    const cls = classnames('m-tagbox', styles.tagSelect, className);
    // 处理全选的相关数据
    const atd = {
      ...allTagDataInstate,
      ...allTagData,
    };
    // 处理value值
    if (value.length === 0) {
      value.push(...valueInstate);
      if (value.length === 0) {
        value.push(atd.key);
      }
    }

    return (
      <div className={cls} style={style}>
        {label && <div className="m-tagbox-left">{label}</div>}
        <div className="m-tagbox-right">
          <div className={`${displayTag ? 'm-tagbox-rightMain  isHidden' : 'm-tagbox-rightMain'}`}>
            { tagType === '1' ? <div className="list-arrow" onClick={this.handleTag}><i className={`${displayTag ? 'iconfont icon-left-line-arrow' : 'iconfont icon-down-line-arrow'}`} /></div> : '' }
            {
              !atd.show ? '' : (
                <CheckableTag
                  className={tagClassName}
                  key={atd.key}
                  checked={value.includes(atd.key)}
                  onChange={checked => this.handleSelectAll(checked, atd.key)}
                >
                  {atd.showText}
                </CheckableTag>
              )
            }
            {dataSource.map(tag => (
              <CheckableTag
                className={tagClassName}
                key={tag[rowKey]}
                checked={value.includes(tag[rowKey])}
                onChange={checked => this.handleSelect(checked, tag, atd.key)}
              >
                {tag[titleKey]}
              </CheckableTag>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default TagPicker;
