import React, { Component } from 'react';
import { Col, Row, Select, Spin } from 'antd';
import { GetGroupInfoModel } from '$services/newProduct';
import lodash from 'lodash';
import styles from '../../index.less';
import { Scrollbars } from 'react-custom-scrollbars';

class GroupSearchInput extends Component {
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
    this.debounceFetchData = lodash.debounce(this.getGroupInfoModel, 300);
  }
  // 输入值改变
  handleSearch = (searchValue) => {
    this.setState({ searchValue , status: false });
    this.debounceFetchData(searchValue,1);
  }
  // 查询数据
  getGroupInfoModel = (param , paCurren) => {
    const { current , status , pageSize , data } = this.state;
    const { modalType = '' } = this.props;
    if(status) return;
    this.setState({ loading: true });

    let params = { 
      'grpName': param,
      pageSize: pageSize , 
      // grpTp: '',
      grpTp: modalType ? modalType : '', // 查询类型  1 个人  2 渠道  3 营业部合作小组 4 渠道 + 营业部合作小组  空字符 查询全部
      paging: 1, 
      current: paCurren ? paCurren : current,
    };
    GetGroupInfoModel(params).then(res => {
      let len = res.records.length;
      let datas = res.records.map(obj => {
        return obj.grpNm;
      });
      
      datas = paCurren ? Array.from(new Set([...datas])) : Array.from(new Set(data.concat(datas))) ;

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
    this.getGroupInfoModel();
  }
  popScroll = (e) =>{
    if( e.target.scrollTop + e.target.clientHeight + 10 >= e.target.scrollHeight){
      this.getGroupInfoModel();
    }
  }
  render() {
    const { data = [], total = 0, loading = true } = this.state;
    const { groupValue, groupChange } = this.props;
    return (
      <Select
        style={{ width: '160px' }}
        className={`${styles.select} ${styles.selectHeight} ${this.props.groupValue && styles.searchSelect}`}
        suffixIcon={<i className='iconfont icon-sousuo' style={{ fontSize: 14, position: 'relative', left: '3px' }}></i>}
        showSearch
        onSearch={this.handleSearch}
        filterOption={false}
        value={groupValue || undefined}
        placeholder={'二维码名称'}
        onChange={groupChange}
        allowClear
        onFocus={this.handleFocus}
        dropdownMenuStyle={{maxHeight: 'none' }}
        dropdownRender={menu => (
          <Row>
            <Spin spinning={loading}>
              <Row type='flex' justify='end'>
                <Col style={{ padding: '8px 16px', color: '#244FFF' }}>共{total}条</Col>
              </Row>
              <Scrollbars style={{ height: 250 }} onScroll={this.popScroll}>
                {menu}
              </Scrollbars>
            </Spin>
          </Row>
        )}
      >
        { data.map(item => (
          <Select.Option key={item} value={item} title={item}>
            {item}
          </Select.Option >
        ))
        }
      </Select>
    );
  }
}
export default GroupSearchInput;
