import React, { Component } from 'react';
import { Checkbox, Col, message, Row, Select, Spin } from 'antd';
import arrowDown from '$assets/newProduct/chance/arrow_down.png';
import arrowUp from '$assets/newProduct/chance/arrow_up.png';
import { QueryTag,QueryCustomerGroup ,QueryScenes } from '$services/newProduct';
import { FetchQueryChnlList } from '$services/customeranalysis';
import lodash from 'lodash';
import styles from './index.less';

class MultipleSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: true, // 加载状态
      searchValue: '', // 模糊搜索输入值
      data: [], // 下拉框数据
      total: 0,
    };
    if (this.props.api === 'custGrup') {
      this.debounceFetchData = lodash.debounce(this.queryCustomerGroup, 300);
    } else if (this.props.api === 'channel') {
      this.debounceFetchData = lodash.debounce(this.queryChnlList, 300);
    }
  }
  //输入值改变
  handleSearch = (searchValue) => {
    if(this.props.api === 'custGrup' || this.props.api === 'channel'){
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
    } else if(api === 'channel') {
      this.queryChnlList();
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
      "current": 1,
      "pageSize": 100,
      keyword,
    }).then(res=>{
      this.setState({
        data: res.records,
        loading: false,
      });
    });
  }

  queryChnlList = (keyword)=>{
    FetchQueryChnlList({
      // keyword,
    }).then(res=>{
      this.setState({
        data: res.records.slice(0,11).map((item)=> { return {id: item.chnlCode, name: item.chnlName} }),
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
    this.setState({ visible: true })
    if (api === 'custGrup') {
      this.queryCustomerGroup();
    }
  }
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }
  render() {
    const { data = [], total = 0, visible, loading = true } = this.state;
    const { value, onChange, maxTagTextLength } = this.props;
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
        onBlur={() => { this.setState({ visible: false }) }}
        allowClear
        // dropdownClassName={styles.dropDown}
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
            <Select.Option key={item.tagId} value={`${item.tagId}`} title={item.tag}>
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
