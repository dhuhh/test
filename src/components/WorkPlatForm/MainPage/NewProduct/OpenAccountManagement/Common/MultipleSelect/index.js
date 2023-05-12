import React, { Component } from 'react';
import { Checkbox, Col, message, Row, Select, Spin } from 'antd';
import { QueryZhdm } from '$services/newProduct';
import lodash from 'lodash';
import styles from '../../index.less';
import performanceStyles from '../../QueryPerformance/index.less';

class MultipleSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // 加载状态
      searchValue: '', // 模糊搜索输入值
      data: [], // 下拉框数据
      total: 0,
    };
    this.debounceFetchData = lodash.debounce(this.searchChannelInfo, 300);
  }
  // 输入值改变
  handleSearch = (searchValue) => {
    this.setState({ searchValue });
    this.debounceFetchData(searchValue);
  }
  // 查询数据
  searchChannelInfo = (param) => {
    QueryZhdm({ 'name': param }).then(res => {
      let data = res.records;
      this.setState({
        data,
        loading: false,
        total: res.total || 0,
      });
    }).catch(err => message.error(err.note || err.message));
  }
  // 获取焦点回调
  handleFocus = () => {
    this.searchChannelInfo('');
  }
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }
  render() {
    const { data = [], total = 0, loading = true } = this.state;
    const { zhcl, zhclChange } = this.props;
    return (
      <Select
        mode='multiple'
        maxTagCount={3}
        maxTagTextLength={7}
        showArrow={true}
        maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
        menuItemSelectedIcon={e => {
          return data.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={zhcl.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
        }}
        style={{ width: '160px' }}
        className={`${styles.select} ${this.props.value && styles.searchSelect} ${performanceStyles.mulSelect160}`}
        suffixIcon={<i className='iconfont icon-sousuo' style={{ fontSize: 14 }}></i>}
        showSearch
        onSearch={this.handleSearch}
        placeholder={'组合策略'}
        filterOption={false}
        value={zhcl || []}
        onChange={zhclChange}
        allowClear
        dropdownClassName={styles.dropDown}
        onFocus={this.handleFocus}
        getPopupContainer={node => node.parentNode}
        dropdownRender={menu => (
          <Row>
            <Spin spinning={loading} >
              <div className='m-bss-select-checkbox'>
                <div className='m-bss-select-dropdown' >{menu}</div>
              </div>
            </Spin>
          </Row>
        )
        }
      >
        {
          data.map(item => (
            <Select.Option key={item.zhdm} value={item.zhdm} title={item.name}>
              {item.name}
            </Select.Option >
          ))
        }
      </Select >
    );
  }
}
export default MultipleSearchInput;
