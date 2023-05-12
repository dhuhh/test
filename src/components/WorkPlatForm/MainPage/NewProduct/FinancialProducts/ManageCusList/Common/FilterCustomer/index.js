import React, { Component } from 'react';
import { Checkbox, Divider, message, Spin, Button } from 'antd';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import { FetchQueryInvestPlanList, FetchQueryFinancailCusList } from '$services/newProduct';
import styles from '../../index.less';

// 正选0, 反选3
class FilterCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pageSize: 100,
      customerData: [], // 产品数据
      checked: false, // 全选
      checkedGroup: [],  // 多选框值
    };
    const { getInstence } = this.props;
    if (getInstence) {
      getInstence(this);
    }
  }

  componentDidUpdate = (prevProps) => {
    const customerNameVisible = lodash.get(prevProps, 'payload.customerNameVisible', false);
    const newCustomerNameVisible = lodash.get(this.props, 'payload.customerNameVisible', false);
    if (newCustomerNameVisible && !customerNameVisible) {
      this.getCustomerList();
    } else if (!newCustomerNameVisible && customerNameVisible) {
      // this.setState({ customerData: [], loading: true, pageSize: 100, checked: false, checkedGroup: [] });
    }
  }

  getCustomerList = (pageSize = 100) => {
    this.setState({ loading: true });
    const { payload: { customerType = '11', queryType = 1, timePeriod = 'last_week' }, serviceType = '' } = this.props;
    // const { checked, checkedGroup = [] } = this.state;
    const p = serviceType === 'invest' ?
      {
        customerType,
        queryType,
        attrConditionModels: [{ esCode: 'automatic_investment_plan.customer_level', esValue: '', type: 4 }],
        fieldsCode: ['automatic_investment_plan.customer_level'],
        investPlanAggModels: [],
        pagerModel: { pageNo: 1, pageSize },
        sort: [],
      } :
      {
        timePeriod,
        customerType,
        queryType,
        attrConditionModels: [{ esCode: 'customer_level', esValue: '', type: 4 }],
        fieldsCode: ['customer_level'],
        financialCusListAggModelList: [],
        financialCusListAggSunModelList: [],
        pagerModel: { pageNo: 1, pageSize },
        sort: [],
      };
    if (serviceType === 'invest') {
      FetchQueryInvestPlanList(p).then((res) => {
        const { data = [] } = res;
        this.setState({ customerData: data, pageSize, loading: false });
        // if (checked) {
        //   let temp = [...new Array(result.length).keys()];
        //   const checkedResult = checkedGroup.concat(temp.slice(temp.length - 15));
        //   this.setState({ checkedGroup: checkedResult });
        // }
        // if (pageSize >= count) {
        //   this.setState({ hasMore: false });
        // }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else if (serviceType === 'wealth') {
      FetchQueryFinancailCusList(p).then((res) => {
        const { data = [] } = res;
        this.setState({ customerData: data, pageSize, loading: false });
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }
  // // 滚动条触底
  // handleInfiniteOnLoad = () => {
  //   let { pageSize = 0 } = this.state;
  //   pageSize += 10;
  //   this.getCustomerList(pageSize);
  // }
  // 列筛选里多选框改变
  handleChange = (index) => {
    let { checkedGroup, checked, customerData = [] } = this.state;
    // const { filterCustomerOnChange } = this.props;
    if (checkedGroup.indexOf(index) !== -1) {
      checkedGroup.splice(checkedGroup.indexOf(index), 1);
    } else {
      checkedGroup.push(index);
    }
    if (checkedGroup.length === 0) {
      checked = false;
    } else if (checkedGroup.length === customerData.length) {
      checked = true;
    }
    this.setState({ checkedGroup, checked });
  }
  // "全选"多选框改变
  handleCheckboxChange = () => {
    let { checked, checkedGroup, customerData = [] } = this.state;
    // const { filterCustomerOnChange } = this.props;
    checked = !checked;
    if (checked) {
      checkedGroup = [...new Array(customerData.length).keys()];
    } else {
      checkedGroup = [];
    }
    this.setState({ checked, checkedGroup });
    // if (filterCustomerOnChange) {
    //   filterCustomerOnChange(checked, '');
    // }
  }

  handleClear = () => {
    const { handleSetPayload, handleFormChange } = this.props;
    this.setState({
      checked: false, // 全选
      checkedGroup: [],  // 多选框值
    });
    if (handleSetPayload && handleFormChange) {
      handleSetPayload({ columnExtraTitle: '', filter: [] });
      handleFormChange({ filter: [] });
    }
  }

  handleOk = () => {
    let { checked, checkedGroup, customerData = [] } = this.state;
    const { filterCustomerOnChange, confirm, columnExtraTitle = {}, handleSetPayload } = this.props;
    if (filterCustomerOnChange) {
      let result = [];
      let strValue = '';
      if (checked) {
        let temp = [...new Array(customerData.length).keys()];
        checkedGroup.forEach((value) => {
          temp.splice(temp.indexOf(value), 1);
        });
        temp.forEach((value) => {
          result.push(customerData[value]['sx']);
        });
        strValue = '全选';
      } else {
        if (checkedGroup.length !== 0) {
          strValue = '多选';
        }
        checkedGroup.forEach((value) => {
          result.push(customerData[value]['sx']);
        });
      }
      if (handleSetPayload) {
        const extraTitle = { ...columnExtraTitle };
        extraTitle['customer_name'] = strValue;
        handleSetPayload({ columnExtraTitle: extraTitle });
      }
      const strDict = {};
      customerData.forEach(item => {
        strDict[item.sx] = item.khjbmc;
      });
      filterCustomerOnChange(checked, result.join(','), strDict);
    }
    if (confirm) {
      confirm();
    }
  }

  render() {
    const { customerData = [] } = this.state;
    return (
      <div style={{ width: '18rem', position: 'relative' }}>
        <Checkbox className={styles.options} style={{ padding: '15px' }} checked={this.state.checked} onChange={this.handleCheckboxChange}>全选</Checkbox>
        <Divider style={{ margin: 0 }} />
        <Spin spinning={this.state.loading}>
          <Scrollbars style={{ height: '16rem' }}>
            {
              customerData.map((item, index) => {
                return (
                  <div key={`filterCustomerCheckbox${index}`} style={{ padding: '10px 20px' }}>
                    <Checkbox className={styles.options} checked={this.state.checkedGroup.includes(index) ? true : false} onChange={() => { this.handleChange(index); }}>{`${item['khjbmc'] || '--'} (${item['count'] || '--'}个)`}</Checkbox>
                  </div>
                );
              })
            }
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
export default FilterCustomer;
