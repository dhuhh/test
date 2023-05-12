import React, { Component } from 'react';
import { Checkbox, Divider, message, Spin, Button } from 'antd';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import { FetchQueryInvestPlanList } from '$services/newProduct';
import styles from '../../index.less';

// 正选0, 反选3
class FilterProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasMore: true,
      pageSize: 15,
      productData: [], // 产品数据
      checked: false, // 全选
      checkedGroup: [],  // 多选框值
    };
    const { getInstence } = this.props;
    if (getInstence) {
      getInstence(this);
    }
  }

  componentDidUpdate = (prevProps) => {
    const { columnIndex = '' } = this.props;
    if (columnIndex === 'product_name') {
      const productNameVisible = lodash.get(prevProps, 'payload.productNameVisible', false);
      const newProductNameVisible = lodash.get(this.props, 'payload.productNameVisible', false);
      if (newProductNameVisible && !productNameVisible) {
        this.fetchQueryInvestPlanList(15, columnIndex);
      } else if (!newProductNameVisible && productNameVisible) {
        // this.setState({ productData: [], hasMore: true, loading: true, pageSize: 15, checked: false, checkedGroup: [] });
      }
    } else if (columnIndex === 'product_code') {
      const productCodeVisible = lodash.get(prevProps, 'payload.productCodeVisible', false);
      const newProductCodeVisible = lodash.get(this.props, 'payload.productCodeVisible', false);
      if (newProductCodeVisible && !productCodeVisible) {
        this.fetchQueryInvestPlanList(15, columnIndex);
      } else if (!newProductCodeVisible && productCodeVisible) {
        // this.setState({ productData: [], hasMore: true, loading: true, pageSize: 15, checked: false, checkedGroup: [] });
      }
    }
  }

  fetchQueryInvestPlanList = (pageSize = 15, columnIndex = '') => {
    this.setState({ loading: true });
    const { payload: { customerType = '11', queryType = 1 } } = this.props;
    const { checked, checkedGroup = [] } = this.state;
    const p = {
      customerType,
      queryType,
      attrConditionModels: [{ esCode: `automatic_investment_plan.${columnIndex}`, esValue: "", type: 5 }],
      fieldsCode: [`automatic_investment_plan.${columnIndex}`],
      investPlanAggModels: [],
      pagerModel: { pageNo: 1, pageSize },
      sort: [],
    };
    FetchQueryInvestPlanList(p).then((res) => {
      const { data = [], count = 0 } = res;
      let result = [];
      data.forEach((item) => {
        let value = lodash.get(item, `automatic_investment_plan.${columnIndex}`, '');
        result.push(value);
      });
      this.setState({ productData: result, pageSize, loading: false });
      if (checked) {
        let temp = [...new Array(result.length).keys()];
        const checkedResult = checkedGroup.concat(temp.slice(temp.length - 15));
        this.setState({ checkedGroup: checkedResult });
      }
      if (pageSize >= count) {
        this.setState({ hasMore: false });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 滚动条触底
  handleInfiniteOnLoad = () => {
    const { columnIndex = '' } = this.props;
    let { pageSize = 0 } = this.state;
    pageSize += 10;
    this.fetchQueryInvestPlanList(pageSize, columnIndex);
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
  // "全选"多选框改变
  handleCheckboxChange = () => {
    let { checked, checkedGroup, productData = [] } = this.state;
    // const { filterProductOnChange } = this.props;
    checked = !checked;
    if (checked) {
      checkedGroup = [...new Array(productData.length).keys()];
    } else {
      checkedGroup = [];
    }
    this.setState({ checked, checkedGroup });
    // if (filterProductOnChange) {
    //   filterProductOnChange(checked, '');
    // }
  }

  handleClear = () => {
    this.setState({
      checked: false, // 全选
      checkedGroup: [],  // 多选框值
    });
  }

  handleOk = () => {
    let { checked, checkedGroup, productData = [] } = this.state;
    const { filterProductOnChange, confirm } = this.props;
    if (filterProductOnChange) {
      let result = [];
      if (checked) {
        let temp = [...new Array(productData.length).keys()];
        checkedGroup.forEach((value) => {
          temp.splice(temp.indexOf(value), 1);
        });
        temp.forEach((value) => {
          result.push(productData[value]);
        });
      } else {
        checkedGroup.forEach((value) => {
          result.push(productData[value]);
        });
      }
      filterProductOnChange(checked, result.join(','));
    }
    if(confirm){
      confirm();
    }
  }

  render() {
    const { productData = [] } = this.state;
    return (
      <div style={{ width: '18rem', position: 'relative' }}>
        <Checkbox className={styles.options} style={{ padding: '15px' }} checked={this.state.checked} onChange={this.handleCheckboxChange}>全选</Checkbox>
        <Divider style={{ margin: 0 }} />
        <Spin spinning={this.state.loading && this.state.hasMore}>
          <Scrollbars style={{ height: '16rem' }}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            >
              {
                productData.map((item, index) => {
                  return (
                    <div key={`filterProductCheckbox${index}`} style={{ padding: '10px 20px' }}>
                      <Checkbox className={styles.options} checked={this.state.checkedGroup.includes(index) ? true : false} onChange={() => { this.handleChange(index); }}>{item}</Checkbox>
                    </div>
                  );
                })
              }
            </InfiniteScroll>
          </Scrollbars>
        </Spin>
        <div style={{ padding: '10px 14px', textAlign: 'right', borderTop: '1px solid #EAEEF2' }}>
          <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px' }} onClick={this.handleClear}>清 空</Button>
          <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleOk}>确 定</Button>
        </div>
      </div>
    );
  }
}
export default FilterProduct;
