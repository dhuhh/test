import React, { Component } from 'react';
import { Col, message, Row, Select, Spin } from 'antd';
import { GetChannelInfoModel, GetGroupInfoModel } from '$services/newProduct';
import lodash from 'lodash';
import styles from '../../index.less';
import { Scrollbars } from 'react-custom-scrollbars';
class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // 加载状态
      searchValue: '', // 模糊搜索输入值
      data: [], // 下拉框数据
      total: 0,
      current: 1 ,
      status: false ,
      pageSize: 50 ,
    };
    if (this.props.api === 'GetGroupInfoModel') {
      this.debounceFetchData = lodash.debounce(this.searchGroupInfo, 300);
    } else {
      this.debounceFetchData = lodash.debounce(this.searchChannelInfo, 300);
    }
  }
  // 输入值改变
  handleSearch = (searchValue ) => {
    this.setState({ searchValue , status: false });
    this.debounceFetchData(searchValue,1);
  }


  // 查询数据
  searchChannelInfo = (param , paCurren) => {
    const { current , status , pageSize , data } = this.state;
    if(status) return;
    this.setState({ loading: true });
    let params = {
      'chnlInf': param, 
      pageSize: pageSize, 
      paging: 1, 
      current: paCurren ? paCurren : current ,
    };
    GetChannelInfoModel(params).then(res => {
      let len = res.records.length;
      let datas = res.records.map(obj => {
        return { chnlCode: obj.chnlCode, chnlNm: obj.chnlNm, chnlId: obj.chnlId };
      });
      // 去重
      let setData1 = Array.from(new Set(datas.map(item=>JSON.stringify(item)))).map(i=>JSON.parse(i));
      let setData2 = Array.from(new Set(data.concat(datas).map(item=>JSON.stringify(item)))).map(i=>JSON.parse(i));

      datas = paCurren ? setData1 : setData2;
      this.setState({
        data: datas,
        loading: false,
        total: res.total,
        current: paCurren ? paCurren : current + 1 ,
        status: paCurren ? false : pageSize > len ,
      });
    });
  }
  // 查询小组数据
  searchGroupInfo = (param , paCurren) => {
    const { current , status , pageSize , data } = this.state;
    if(status) return;
    this.setState({ loading: true });
    let params = { 
      'grpName': param, 
      grpTp: 2, 
      pageSize: pageSize, 
      paging: 1, 
      current: paCurren ? paCurren : current ,
    };

    GetGroupInfoModel(params).then(res => {
      let len = res.records.length;
      let datas = res.records.map(obj => {
        return { chnlCode: obj.grpCode, chnlNm: obj.grpNm, chnlId: obj.grpId };
      });
      // 去重
      let setData1 = Array.from(new Set(datas.map(item=>JSON.stringify(item)))).map(i=>JSON.parse(i));
      let setData2 = Array.from(new Set(data.concat(datas).map(item=>JSON.stringify(item)))).map(i=>JSON.parse(i));

      datas = paCurren ? setData1 : setData2;
      this.setState({
        data: datas,
        loading: false,
        total: res.total,
        current: paCurren ? paCurren : current + 1 ,
        status: paCurren ? false : pageSize > len ,
      });
    });
  }
  // 获取焦点回调
  handleFocus = () => {
    if (this.props.api === 'GetGroupInfoModel') {
      this.searchGroupInfo();
    } else {
      this.searchChannelInfo();
    }
  }

  popScroll = (e) =>{
    if( e.target.scrollTop + e.target.clientHeight + 10 >= e.target.scrollHeight){
      if (this.props.api === 'GetGroupInfoModel') {
        this.searchGroupInfo();
      } else {
        this.searchChannelInfo();
      }
    }
  }
  render() {
    const { data = [], total = 0, loading = true } = this.state;
    const { channelValue, channelChange } = this.props;
    let change = false;
    const datas = data.filter(item => {
      if(item.chnlCode === 'cr'){
        change = true;
      }
      return item.chnlCode !== 'cr' ;
    });

    return (
      <Select
        style={{ width: '160px' }}
        className={`${styles.select} ${styles.selectHeight} ${this.props.value && styles.searchSelect}`}
        suffixIcon={<i className='iconfont icon-sousuo' style={{ fontSize: 14, position: 'relative', left: '3px' }}></i>}
        showSearch
        onSearch={this.handleSearch}
        placeholder={this.props.api === 'GetGroupInfoModel' ? '小组代码/小组名称' : '渠道代码/渠道名称'}
        filterOption={false}
        value={channelValue || undefined}
        onChange={channelChange}
        allowClear
        dropdownMenuStyle={{ maxHeight: 'none' }}
        dropdownClassName={styles.dropDown}
        onFocus={this.handleFocus}
        dropdownRender={menu => (
          <Row>
            <Spin spinning={loading} >
              <Row type='flex' justify='end'>
                <Col style={{ padding: '8px 16px', color: '#244FFF' }}>共{change ? (total - 1) : total}条</Col>
              </Row>
              <Scrollbars style={{ height: 250 }} onScroll={this.popScroll}>
                {menu}
              </Scrollbars>
            </Spin>
          </Row>
        )
        }
      >
        {
          datas.map(item => (
            <Select.Option key={item.chnlCode} value={item.chnlId} title={`${item.chnlCode}/${item.chnlNm}`}>
              {`${item.chnlCode || '-'}/${item.chnlNm || '-'}`}
            </Select.Option >
          ))
        }
      </Select >
    );
  }
}
export default SearchInput;
