import React, { Component } from 'react';
import { Col, message, Row, Select, Spin } from 'antd';
import lodash from 'lodash';
import styles from '../index.less';

class SearchInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false, //加载状态
      searchValue: '', // 模糊搜索输入值
      data: [], // 下拉框数据
      showValue: '', // 选中显示值，解决数据为空时select.option选不上去
      checkedGroup: [], // 多选框值
      hasMore: true,
    };
    this.debounceFetchData = lodash.debounce(this.fetchData, 300);
  }
  // 输入值改变
  handleSearch = (searchValue) => {
    this.setState({ searchValue });
    this.debounceFetchData(searchValue);
  }
  // 查询数据
  fetchData = (searchValue) => {
    // this.setState({ loading: true });

    // api().then((response) => {
    //   const { data = [], count = 0 } = response;

    // this.setState({ total: count, loading: false });
    // }).catch((error) => {
    //   message.error(error.success ? error.note : error.message);
    // });
  }
  // 选中option回调
  handleChange = (value) => {
    let { showValue } = this.state;
    if (value === '--') {
      value = '';
      showValue = '--';
    } else if (!value) {
      showValue = '';
    }
    this.setState({ showValue });
    const { onChange } = this.props;
    if (onChange) onChange(value);
  }
  // 获取焦点回调
  handleFocus = () => {
    this.fetchData('');
  }

  // 列筛选里多选框改变
  handleChange = (index) => {
    let { checkedGroup, checked, productData = [], hasMore } = this.state;
    // const { filterProductOnChange } = this.props;
    if (checkedGroup.indexOf(index) !== -1) {
      checkedGroup.splice(checkedGroup.indexOf(index), 1);
    } else {
      checkedGroup.push(index);
    }
    if (checkedGroup.length === 0) {
      checked = false;
    } else if (checkedGroup.length === productData.length && !hasMore) {
      checked = true;
    }
    this.setState({ checkedGroup, checked });
  }
  render() {
    const { type } = this.props;
    const { data = [], total = 0, loading = true, showValue = '' } = this.state;
    return (
      <Select
        className={`${styles.select} ${this.props.value && styles.searchSelect}`}
        suffixIcon={<i className='iconfont icon-sousuo' style={{ fontSize: 20, position: 'relative', top: -5, right: 5 }}></i>}
        showSearch
        // mode="multiple"
        onSearch={this.handleSearch}
        value={this.props.value || showValue}
        onChange={this.handleChange}
        allowClear
        onFocus={this.handleFocus}
        dropdownRender={menu => (
          <Row>
            <Spin spinning={loading}>
              <Row type='flex' justify='end'>
                <Col style={{ padding: '8px 16px', color: '#244FFF' }}>共{total}条</Col>
              </Row>
              {menu}
            </Spin>
          </Row>
        )}
      >
        {
          data.map(item =>
            <Select.Option key={item.code} value={ item.code || '--'}><span>{item.code || '--'}  {item.name || '--'}</span></Select.Option>) 
        }
      </Select>

    );
  }
}
export default SearchInput;
