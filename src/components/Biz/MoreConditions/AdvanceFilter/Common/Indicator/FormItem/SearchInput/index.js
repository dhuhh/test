import React from 'react';
import { Input, AutoComplete, Icon, message } from 'antd';
import debounce from 'lodash.debounce';
import { fetchStockCode } from '../../../../../../../../services/financialproducts';
// import { FetchQueryStaffTips } from '../../../../../../../../services/staffrelationship';

const Option = AutoComplete.Option; // eslint-disable-line
const OptGroup = AutoComplete.OptGroup; // eslint-disable-line
export default class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    const { value = '' } = props;
    this.fetchDatas = debounce(this.fetchDatas, 200);// 强制一个函数在某个连续时间段内只执行一次 win10自带输入法输入慢会有问题 待解决
    this.state = {
      productList: [], // 产品的结果
      productCount: 0, // 产品的数量
      value,
    };
  }
  componentDidMount() {
    this.fetchDatas('');
  }
  // componentWillReceiveProps(nextProps) {
  //   if ('value' in nextProps) {
  //     const { value } = nextProps;
  //     this.setState({
  //       value,
  //     });
  //   }
  // }
  handleSearch = (value) => {
    const valueFormat = value.replace(/'/g, '');
    this.setState({
      productList: [],
    });
    this.fetchDatas(valueFormat);
  }
  fetchDatas = (value) => {
    const { lb = '1' } = this.props;
    this.handleSearchProductsList(value, lb);
  }
  // 模糊搜索
  handleSearchProductsList = async (value, lb) => {
    if (lb !== '3') { // 人员
      // 产品/证券
      fetchStockCode({
        paging: 1,
        current: 1,
        pageSize: 10,
        total: -1,
        sort: '',
        mhss: value,
        lb,
      }).then((response) => {
        const { records = [], total = 0 } = response;
        this.setState({
          productList: records,
          productCount: total,
        });
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }
  hanleChange = (value = '') => {
    const code = value.split('-')[0];
    const { onChange } = this.props;
    this.setState({
      value,
    });
    if (onChange) {
      onChange(code);
    }
  }
  renderTitle = (title) => {
    return (
      <span>
        {title.name}
        <span className="blue" style={{ float: 'right' }}>共{title.count}条</span>
      </span>
    );
  }
  renderChlidren= (list) => {
    const result = [];
    list.forEach((item) => {
      result.push({
        title: item.zqmc,
        // count: item.counts,
        key: item.zqdm,
      });
    });
    return result;
  }
  renderListResult = (productCount, productList) => {
    let productResult = [];

    // 有结果
    if (productCount > 0) {
      // 产品
      productResult = this.renderChlidren(productList);
    }
    return productResult;
  }
  render() {
    const { productCount = 0, productList = [] } = this.state;
    const productResult = this.renderListResult(productCount, productList);
    const { lb = '1' } = this.props;
    // 组建数据源 三种情况
    const dataSource = [];
    if (productCount > 0) {
      dataSource.push({
        key: 2,
        title: {
          name: lb === '名称/编号',
          count: productCount,
        },
        children: productResult,
      });
    } else {
      dataSource.push({
        key: '#',
        title: {
          name: '无结果',
          count: 0,
        },
        children: [{
          title: '!',
          key: '换个关键词试试',
        }],
      });
    }
    const options = dataSource.map((group, index) => (
      <OptGroup
        key={index}
        label={this.renderTitle(group.title)}
      >
        {group.children.map(opt => (
          <Option key={`${group.key}-${opt.key}-${opt.title}`} value={`${opt.key}-${opt.title}`.trim()}>
            <span>{opt.key}</span><span style={{ float: 'right' }}>{opt.title}</span>
          </Option>
        ))}
      </OptGroup>
    ));
    return (
      <div style={{ width: '100%' }} >
        <AutoComplete
          dropdownClassName="certain-category-search-dropdown"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: '17rem', zIndex: 9999, position: 'fixed' }}
          style={{ width: '100%', color: '#6E6E6E' }}
          dataSource={options}
          onChange={this.hanleChange}
          placeholder="请选择"
          value={this.state.value}
          optionLabelProp="value"
          onSearch={(value) => { this.handleSearch(value); }}
        >
          <Input
            suffix={<Icon type="search" className="certain-category-icon" />}
          />
        </AutoComplete>
      </div>
    );
  }
}
