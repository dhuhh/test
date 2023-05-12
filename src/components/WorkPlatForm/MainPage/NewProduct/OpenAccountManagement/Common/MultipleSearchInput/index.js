import React, { Component } from 'react';
import { Checkbox, Col, message, Row, Select, Spin } from 'antd';
import { GetChannelInfoModel, GetGroupInfoModel } from '$services/newProduct';
import lodash from 'lodash';
import styles from '../../index.less';
import performanceStyles from '../../QueryPerformance/index.less';
import { Scrollbars } from 'react-custom-scrollbars';
class MultipleSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // 加载状态
      searchValue: '', // 模糊搜索输入值
      data: [], // 下拉框数据
      total: 0,
      current: 1,
      status: false , //滚动
      pageSize: 50 ,
    };
    if (this.props.api === 'GetGroupInfoModel') {
      this.debounceFetchData = lodash.debounce(this.searchGroupInfo, 300);
    } else {
      this.debounceFetchData = lodash.debounce(this.searchChannelInfo, 300);
    }
  }
  // 输入值改变
  handleSearch = (searchValue) => {
    this.setState({ searchValue , status: false });
    this.debounceFetchData(searchValue, 1);
  }
  // 查询渠道数据
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
        total: res.total || 0,
        current: paCurren ? paCurren : current + 1 ,
        status: paCurren ? false : pageSize > len ,
      });
    }).catch(err => message.error(err.note || err.message));
  }
  // 查询二维码名称数据
  searchGroupInfo = (param , paCurren) => {

    const { current , status , pageSize , data } = this.state;
    const { modalType = '' } = this.props;
    // 滚动加载开关
    if(status) return;
    this.setState({ loading: true });

    let params = { 
      'grpName': param, 
      grpTp: modalType ? modalType : '4', // 查询类型  1 个人  2 渠道  3 营业部合作小组 4 渠道 + 营业部合作小组  空字符 查询全部
      pageSize: pageSize, 
      paging: 1, 
      current: paCurren ? paCurren : current ,
    };

    GetGroupInfoModel(params).then(res => {
      let len = res.records.length;
      let datas = res.records.map(obj => {
        return { chnlCode: obj.grpCode, chnlNm: obj.grpNm, chnlId: obj.grpId };
      });
      // 深度去重
      let setData1 = Array.from(new Set(datas.map(item=>JSON.stringify(item)))).map(i=>JSON.parse(i));
      // 深度去重+合并
      let setData2 = Array.from(new Set(data.concat(datas).map(item=>JSON.stringify(item)))).map(i=>JSON.parse(i));

      datas = paCurren ? setData1 : setData2;

      this.setState({
        data: datas ,
        loading: false,
        total: res.total || 0,
        current: paCurren ? paCurren : current + 1 ,
        status: paCurren ? false : pageSize > len ,
      });
    }).catch(err => message.error(err.note || err.message));
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

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  render() {
    const { data = [], total = 0, loading = true } = this.state;
    const { channelValue, channelChange, visible , api , type = '' } = this.props;
    let plaText = api === 'GetGroupInfoModel' && type === 'groupTeam' ? '小组代码/小组名称' : api === 'GetGroupInfoModel' ? '二维码代码/二维码名称' : '渠道代码/渠道名称' ;
    let change = false;
    const datas = data.filter(item => {
      if(item.chnlCode === 'cr'){
        change = true;
      }
      return item.chnlCode !== 'cr' ;
    });
    return (
      <Select
        open={visible}//是否展开下拉菜单，继承父
        mode='multiple'//模式为多选
        maxTagCount={3}
        maxTagTextLength={7}
        showArrow={true}//显示下拉箭头
        maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
        menuItemSelectedIcon={e => {
          return data.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={channelValue.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
        }}
        style={{ width: '200px' }}
        className={`${styles.select} ${this.props.value && styles.searchSelect} ${performanceStyles.mulSelect}`}
        suffixIcon={<i className='iconfont icon-sousuo' style={{ fontSize: 14 }}></i>}
        showSearch
        onSearch={this.handleSearch}
        placeholder={plaText}
        filterOption={false}
        value={channelValue || []}
        onChange={channelChange}
        allowClear
        dropdownClassName={styles.dropDown}
        dropdownMenuStyle={{ maxHeight: 'none' }}
        onFocus={this.handleFocus}
        getPopupContainer={node => node.parentNode}
        dropdownRender={menu => (
          <Row>
            <Spin spinning={loading} >
              <Row type='flex' justify='end'>
                <Col style={{ padding: '8px 16px', color: '#244FFF' }}>共{change ? (total - 1) : total}条</Col>
              </Row>
              <div className='m-bss-select-checkbox'>
                <div className='m-bss-select-dropdown' >
                  <Scrollbars style={{ height: 250 }} onScroll={this.popScroll}>
                    {menu}
                  </Scrollbars>
                </div>
              </div>
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
export default MultipleSearchInput;
