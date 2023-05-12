import React from 'react';
import { Select, AutoComplete, Input, Tooltip, Icon } from 'antd';
import debounce from 'lodash.debounce';
import { getHistoryList } from '$services/searchProcess';
import { set } from 'lodash';

const { Option } = Select;
class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = debounce(this.handleSearch, 400);// 强制一个函数在某个连续时间段内只执行一次 win10自带输入法输入慢会有问题 待解决
    this.onFlurSearchData = debounce(this.onFlurSearchData, 400);
    this.state = {
      seleValue: '',
      selectData: [], //模糊搜索框数据
      total: 0,
    };
    const { getInstence } = props;
    if (getInstence) {
      getInstence(this);
    }

  }
  // 得到焦点拿到历史查询记录
  onFlurSearchData=()=>{
    this.setState({ selectData: [],total: 0 });
    getHistoryList().then(res=>{
      const { records = [] } = res;
      setTimeout(() => {
        this.setState({ selectData: records,total: records.length });
      }, 0);
    });
  }

  handleSearch = (value) => {
    let valueFormat = '';
    if (value !== '' && value !== undefined) {
      valueFormat = value.replace(/'/g, '');
    }
    this.setState({ seleValue: valueFormat.trim() });
  }
  // 失去焦点把值传回父组件searchfrom
  onBlurAjaxData=()=>{
    const { parentThis } = this.props;
    const  { seleValue } = this.state;
    this.setState({ selectData: [] });
    if (parentThis) {
      parentThis.setState({ custCode: seleValue });
    }
  }
  // 存贮input输入的值
  handleInputChange = (value) => {
    let valueFormat = '';
    if (value !== '' && value !== undefined) {
      valueFormat = value.replace(/'/g, '');
    }
    this.setState({ seleValue: valueFormat.trim() });
  }
  // 清空选项
  handleClick = () => {
    this.setState({ seleValue: '' });
  }
  render() {
    const { seleValue,selectData = [] } = this.state;
    // let newDate = [...new Set(selectData.map(tag=>tag.nr))];
    let options = [];
    options = selectData.map((opt, index) => (
      <Option key={`${opt.nr}-${index}`}  value={opt.nr}>
        {opt.nr}
      </Option>
    ));
    if (selectData.length === 0) {
      options = [<Option key="P1S" disabled>查询不到该客户记录</Option>];
    }
    return (
      <div>
        <AutoComplete id="product"
          dataSource={options}
          placeholder="客户姓名/客户号/资金账号/证件号"
          onSearch={(value) => { this.handleSearch(value); }}
          onChange={(value) => { this.handleInputChange(value); }}
          onFocus={() => {this.onFlurSearchData(); }}
          onBlur={(val)=>{this.onBlurAjaxData(val);}}
          value={seleValue}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          <Input
            suffix={
              <span>
                {
                  seleValue !== '' ? (
                    <Tooltip >
                      <Icon type="close" style={{ color: 'rgba(0,0,0,.45)' }} onClick={this.handleClick} />
                    </Tooltip>
                  ) : (<Icon type="search" style={{ color: 'rgba(149, 156, 186, 1)' }} />)
                }
              </span>
            }
            maxLength={20}
          />
        </AutoComplete >
      </div>
    );
  }
}
export default SearchInput;
