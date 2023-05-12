import React, { Component } from 'react';
import { Checkbox, Col, message, Row, Select, Spin } from 'antd';
import arrowDown from '$assets/newProduct/chance/arrow_down.png';
import arrowUp from '$assets/newProduct/chance/arrow_up.png';
import { QueryTag,QueryCustomerGroup ,QueryScenes } from '$services/newProduct';
import lodash from 'lodash';
import styles from '../index.less';

class MultipleSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // 加载状态
      searchValue: '', // 模糊搜索输入值
      data: [], // 下拉框数据
      total: 0,
    };
    if (this.props.api === 'custGrup') {
      this.debounceFetchData = lodash.debounce(this.queryCustomerGroup, 300);
    }
  }
  //输入值改变
  handleSearch = (searchValue) => {
    if(this.props.api === 'custGrup'){
      this.setState({ searchValue });
      this.debounceFetchData(searchValue);
    }
  }
  componentDidMount(){
    const { api } = this.props;
    if(api === 'tag'){
      this.queryTag();
    }else if(api === 'custGrup'){
      this.queryCustomerGroup();
    }else if(api === 'riskValue'){
      this.setState({
        loading: false,
        data: [{ id: 1,name: '保守型' },{ id: 2,name: '谨慎型' },{ id: 3,name: '稳健型' },{ id: 4,name: '积极型' },{ id: 5,name: '激进型' },{ id: 6,name: '最低型' }],
      });
    }else if(api === 'scene'){
      this.queryScenes();
    }else if(api === 'custRank'){
      this.setState({
        loading: false,
        data: [{ id: 1,name: 'V1' },{ id: 2,name: 'V2' },{ id: 3,name: 'V3' },{ id: 4,name: 'V4' },{ id: 5,name: 'V5' },{ id: 6,name: 'V6' },{ id: 7,name: 'V7' }],
      });
    }else if(api === 'historyProd'){
      this.setState({
        loading: false,
        data: [{ id: 1,name: '投顾产品' },{ id: 2,name: '策略工具' }],
      });
    }else if(api === 'bussiOpen'){
      this.setState({
        loading: false,
        data: [{ id: 1,name: '融资融券' },{ id: 2,name: '港股通' },{ id: 3,name: '北交所' },{ id: 4,name: '基金投顾' }],
      });
    }else if(api === 'qkImportance'){
      this.setState({
        loading: false,
        data: [{ id: 5,name: '强烈' },{ id: 4,name: '较高' },{ id: 3,name: '一般' },{ id: 2,name: '较低' },{ id: 1,name: '暂无' }],
      });
    }else if(api === 'bussGkbin'){
      this.setState({
        loading: false,
        data: [{ id: 7,name: '全部' },{ id: 0,name: '0分' },{ id: 1,name: '1分' },{ id: 2,name: '2分' },{ id: 4,name: '4分' }],
      });
    }else if(api === 'newIsTrade'){
      this.setState({
        loading: false,
        data: [
          { id: '1', name: "已普通交易已信用交易" },
          { id: '2', name: "已普通交易未信用交易" },
          { id: '3', name: "未普通交易已信用交易" },
          { id: '4', name: "未普通交易未信用交易" }
        ],
      });
    }
  }
  queryTag = ()=>{
    QueryTag().then(res=>{
      let data = res.records[0];
      let tagsData = [];
      Object.keys(data).forEach(item=>{
        if(item === 'activityTag'){
          let arr = data[item].map(item1=>{return { ...item1,type: 1 };});
          tagsData = [...tagsData,...arr];
        }else if(item === 'companyTag'){
          let arr = data[item].map(item1=>{return { ...item1,type: 2 };});
          tagsData = [...tagsData,...arr];
        }else if(item === 'staffTag'){
          let arr = data[item].map(item1=>{return { ...item1,type: 3 };});
          tagsData = [...tagsData,...arr];
        }
      });
      this.setState({
        data: tagsData,
        loading: false,
      });
    });
  }
  queryCustomerGroup = (keyword)=>{
    QueryCustomerGroup({
      "pageNo": 1,
      "pageSize": 100,
      keyword,
    }).then(res=>{
      this.setState({
        data: res.records,
        loading: false,
      });
    });
  }
  queryScenes = ()=>{
    QueryScenes().then(res=>{
      this.setState({
        data: res.records,
        loading: false,
      });
    });
  }
  //获取焦点回调
  handleFocus = () => {
    const { api } = this.props;
    if (api === 'custGrup') {
      this.queryCustomerGroup();
    }else if(api === 'tag'){
      this.queryTag();
    }
  }
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }
  render() {
    const { data = [], total = 0, loading = true } = this.state;
    const { value, onChange, visible ,maxTagTextLength } = this.props;
    return (
      <Select
        open={visible}
        mode='multiple'
        maxTagCount={3}
        maxTagTextLength={maxTagTextLength ? maxTagTextLength : 4}
        showArrow={true}
        maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
        menuItemSelectedIcon={e => {
          return data.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={value.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
        }}
        className={`${styles.select} ${this.props.value && styles.searchSelect} ${styles.mulSelect}`}
        suffixIcon={<img alt='' src={visible ? arrowUp : arrowDown}/>}
        // onSearch={this.handleSearch}
        placeholder='请选择'
        autoClearSearchValue={false}
        filterOption={(input, option) => option.props.children.indexOf(input) !== -1}
        value={value || []}
        onChange={onChange}
        allowClear
        dropdownClassName={styles.dropDown}
        onFocus={this.handleFocus}
        // getPopupContainer={node => node.parentNode}
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
        {this.props.api === 'tag' ?
          data.map(item => (
            <Select.Option key={item.tagId} value={`${item.tagId}/${item.type}/${item.tag}`} title={item.tag}>
              {item.tag}
            </Select.Option >
          )) : data.map(item => (
            <Select.Option key={item.id} value={item.id} title={item.name}>
              {item.name}
            </Select.Option >
          ))
        }
      </Select >
    );
  }
}
export default MultipleSearchInput;
