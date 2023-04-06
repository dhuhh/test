/* eslint-disable react/no-unused-state */
/* eslint-disable no-debugger */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Input, AutoComplete, message } from 'antd';
import { Link } from 'dva/router';
import debounce from 'lodash.debounce';
import { EncryptBase64 } from '../../../../Common/Encrypt';
import { FetchQueryInnerObject } from '../../../../../services/commonbase';
import styles from './searchInput.less';

const Option = AutoComplete.Option; // eslint-disable-line

class SearchInput extends React.Component {
  constructor() {
    super();
    this.fetchDatas = debounce(this.fetchDatas, 200); // 强制一个函数在某个连续时间段内只执行一次
  }
  state = {
    customerList: [],
    customerCount: 0,
    fillValue: '',
    isFirstSearch: true,
    productList: [],
  };

  // 产品
  fetchQueryInnerObject = async () => {
    await FetchQueryInnerObject({
      id: '',
      keyword: this.state.fillValue,
      objectName: 'PIF.TPROD_BASIC_INFO',
    })
      .then((response) => {
        const { records = [] } = response;
        if (records && records.length > 0) {
          this.setState({ productList: records });
        }
      })
      .catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleAutoCompleteOnClick = (value, isFirstSearch) => {
    if (!value || isFirstSearch) {
      this.handleSearch('');
    }
  };

  handleSearch = (value) => {
    const valueFormat = value.replace(/'/g, '');
    if (this.state.isFirstSearch && value !== '') {
      this.setState({
        isFirstSearch: false,
      });
    }
    this.setState({
      productList: [],
    });
    this.fetchDatas(valueFormat);
  };

  fetchDatas = (value) => {
    if (value !== '') {
      this.fetchQueryInnerObject(value);
    }
  };

  hanleChange = (value) => {
    this.setState({
      fillValue: value,
    });
  };

  render() {
    const {
      productList = [],
      isFirstSearch = true,
      fillValue = '',
    } = this.state;
    const options =
      productList.length > 0
        ? productList.map((item, index) => (
          <Option key={item.id} value={`${item.name}`}>
            <Link
              to={`/productPanorama/index/${EncryptBase64(item.id)}`}
              title={item.name}
              target="_blank"
              style={{ color: '#2daae4', width: '100%', display: 'block' }}
            >
              {item.name}
            </Link>
          </Option>
        ))
        : [fillValue.length === 0 ? '请输入关键字' : '暂无数据'];

    return (
      <div id="SearchInput_pageheader" style={{ width: '100%' }}>
        <AutoComplete
          allowClear
          className={classnames(
            'certain-category-search m-search-head',
            styles.searchInput
          )}
          dropdownClassName="certain-category-search-dropdown"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{
            width: '17rem',
            zIndex: 999,
            top: '36px',
            position: 'fixed',
          }}
          style={{ width: '100%', color: '#6E6E6E' }}
          dataSource={options}
          placeholder="请输入产品名称/代码"
          optionLabelProp="value"
          onChange={this.hanleChange}
          value={fillValue}
          onSearch={(value) => {
            this.handleSearch(value);
          }}
        >
          <Input
            onClick={() => this.handleAutoCompleteOnClick(fillValue, isFirstSearch)}
            suffix={<i className="iconfont icon-icon-search" />}
          />
        </AutoComplete>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(SearchInput);
