import React, { Component } from 'react';
import { Checkbox, Divider, message, Spin, Button } from 'antd';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import { FetchQueryProductList } from '$services/newProduct';

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
  }

  componentDidUpdate = (prevProps) => {
    const { payload: { productNameVisible = false } } = prevProps;
    const { payload: { productNameVisible: newProductNameVisible = false } } = this.props;
    if (newProductNameVisible && !productNameVisible) {
      this.fetchQueryProductList();
    } else if (!newProductNameVisible && productNameVisible) {
      this.setState({ productData: [], hasMore: true, loading: true, pageSize: 15, checked: false, checkedGroup: [] });
    }
  }

  fetchQueryProductList = (pageSize = 15) => {
    this.setState({ loading: true });
    const { payload: { payload: queryParams = {} } } = this.props;
    const { checked, checkedGroup = [] } = this.state;
    const pagerModel = { pageNo: 1, pageSize };
    queryParams['pagerModel'] = pagerModel;
    FetchQueryProductList(queryParams).then((ret) => {
      const { data = [], count = 0 } = ret;
      const result = [];
      data.forEach((item) => {
        result.push(lodash.get(item, 'product_name', '--'));
      });
      this.setState({
        productData: result,
        pageSize,
        loading: false,
      });
      // if (handleSummaryChange && handleSetCount) {
      //   handleSummaryChange(summary);
      //   handleSetCount(count);
      // }
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
    let { pageSize = 0 } = this.state;
    pageSize += 10;
    this.fetchQueryProductList(pageSize);
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
    // if (filterProductOnChange) {
    //   let result = [];
    //   if (checked) {
    //     let temp = [...new Array(productData.length).keys()];
    //     checkedGroup.forEach((value) => {
    //       temp.splice(temp.indexOf(value), 1);
    //     });
    //     temp.forEach((value) => {
    //       result.push(productData[value]);
    //     });
    //   } else {
    //     checkedGroup.forEach((value) => {
    //       result.push(productData[value]);
    //     });
    //   }
    //   filterProductOnChange(checked, result.join(','));
    // }
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
        <Checkbox style={{ padding: '15px' }} checked={this.state.checked} onChange={this.handleCheckboxChange}>全选</Checkbox>
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
                    <div key={`filterProductListCheckbox${index}`} style={{ padding: '10px 20px' }}>
                      <Checkbox checked={this.state.checkedGroup.includes(index) ? true : false} onChange={() => { this.handleChange(index); }}>{item}</Checkbox>
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
