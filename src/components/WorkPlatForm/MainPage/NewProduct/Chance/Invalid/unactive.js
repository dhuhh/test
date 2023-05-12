import React, { Component } from 'react';
import styles from '../index.less';
import { message,Popover } from 'antd';
import moment from 'moment';
import { QueryInvalidCustomer } from '$services/newProduct';
import MultipleSearchInput from '../Common/MultipleSearchInput';
import IconSure from '$assets/newProduct/staff/questionMark.png';
import TableBtn from '../Common/TableBtn';
import SearchContent from '../Common/SearchContent';
import { Link } from 'umi';
import BasicDataTable from '$common/BasicDataTable';
import { func } from 'prop-types';

export default class unactive extends Component {
  state ={
    tableVisible: false,
    selectAll: false,
    selectedRowKeys: [],
    selectedRows: [],
    md5: '',
    dataSource: [],
    pageSize: 10,
    current: 1,
    total: 0,
    loading: false,

    custRange: 0,
    gudongka:0,
    custRank: [],
    rankVisible: false,
    rjDateKey: 0,
    rjDate: [undefined,undefined],//默认无限制
    activePotential: 3,
    outAssetMin: null,
    outAssetMax: null,
    khDateKey: 0,
    khDate: [undefined,undefined],
    assetsPeak: 0,
    loginDate: [undefined,undefined],
    historyProd: [],
    prodVisible: false,
    bussiOpen: [],
    openVisible: false,
    tags: [],
    custGrup: [],
    tagsVisible: false,
    custVisible: false,
    isHidden:true,
    visible1:false,
    visible2:false
  }
  newState = this.state
  componentDidMount(){
    let that = this
    window.addEventListener('scroll',this.getScroll,true)
    window.addEventListener('click',(e)=>{
      if(e.path[1].className=='ant-popover-inner-content'||e.path[0].className=='ant-popover-inner-content'||e.path[1].className=='ant-popover-open'){

      }else if(that.state.isHidden==false||that.state.visible1==true||that.state.visible2==true){
          setTimeout(()=>{
            this.setState({
              isHidden:true,
              visible1:false,
              visible2:false
            })
           },200)
      }
    },true)
  }

  getScroll = (e)=>{
    if(e.type=='scroll'&&e.path[0].className=='ant-select-dropdown-menu  ant-select-dropdown-menu-root ant-select-dropdown-menu-vertical'){

    }else{
      this.setState({
        isHidden:true,
        visible1:false,
        visible2:false
      })
    }
  }

  hidden = ()=>{
    setTimeout(()=>{
      this.setState({
        isHidden:false
      })
    },300)
  }

  getParam = ()=>{
    const { rjDate,rjDateKey, custRange,gudongka,custRank,activePotential,outAssetMin,outAssetMax,khDate,khDateKey,assetsPeak,loginDate,historyProd,bussiOpen,tags,custGrup } = this.newState;
    return {
      buzState: 0 ,
      customerRange: custRange,
      isShareHolder:gudongka,
      customerLevel: custRank,
      recentPaymentDateRange: {
        "isCustom": rjDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": rjDateKey === 999 ? null : rjDateKey,
        "date": null,
        "dateFrom": rjDateKey === 999 ? (rjDate[0] ? rjDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": rjDateKey === 999 ? (rjDate[1] ? rjDate[1].format('YYYYMMDD') : "30000101") : null,
      },
      activePotential: activePotential,
      externalMarketValue: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+outAssetMin,
        // "valueTo": ''+outAssetMax,
        "valueFrom": outAssetMin === null ? '0' : `${outAssetMin}`,
        "valueTo": outAssetMax === null ? `${Math.pow(2,31)}` : `${outAssetMax}`,
      },
      registerYears: {
        "isCustom": khDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": khDateKey === 999 ? null : khDateKey,
        "date": null,
        "dateFrom": khDateKey === 999 ? (khDate[0] ? khDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": khDateKey === 999 ? (khDate[1] ? khDate[1].format('YYYYMMDD') : "30000101") : null,
      },
      assetsPeak: assetsPeak,
      recentOnlineDateRange: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (loginDate[0] ? loginDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (loginDate[1] ? loginDate[1].format('YYYYMMDD') : "30000101"),
      },
      historyContract: historyProd,
      buzOpening: bussiOpen,
      "staffTagList": tags.filter(item=>item.split('/')[1] === '3').map(item=>item.split('/')[0]),
      "companyTagList": tags.filter(item=>item.split('/')[1] === '2').map(item=>item.split('/')[0]),
      "activityTagList": tags.filter(item=>item.split('/')[1] === '1').map(item=>item.split('/')[0]),
      customerGroupList: custGrup,
      pageNo: 0,
      pageSize: 0,
    };
  }

  changeClick = (type)=>{
     setTimeout(()=>{
      this.setState({
        visible1:type==1?true:false,
        visible2:type==1?false:true
       })
     },300)
  }

  getColumns = ()=>{
    const {isHidden} = this.state
    return [
      {
        title: '姓名',
        dataIndex: 'customerName',
        key: '姓名',
        render: (text, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.customerNO}`} target='_blank'>{text}</Link>,
      },
      {
        title: '客户号',
        dataIndex: 'customerNO',
        key: '客户号',
      },
      {
        title: '客户级别',
        dataIndex: 'customerLevel',
        key: '客户级别',
      },
      {
        title: '最近入金时间',
        dataIndex: 'recentPaymentDate',
        key: '最近入金时间',
      },
      {
        title: '激活潜力',
        dataIndex: 'activePotential',
        key: '激活潜力',
        filterDropdown: (<div></div>),
        filterIcon: //getPopupContainer={() => document.getElementById('isWantUp')}
        <Popover placement="bottomLeft" overlayClassName={styles.isTitlePover}  content={<span style={{ whiteSpace: 'pre-wrap' }}>
          无效户激活潜力筛选：通过结合高价值潜客预测模型和种子人群放大模型，对全量无效户进行评分，筛选出与已激活无效户具有相似特征的高潜力客户或周内新增无效户并识别客户潜力资产。<br/>更新频率：每周日更新一次。</span>} trigger="click">
          <span style={{position: 'relative',background:'transparent', display: 'inline-block', width: '16px',height:'16px', left: '-10px',top:'-2px', margin: '0 4px' }}><img className='iconSure' onClick={this.hidden} src={IconSure} alt='' style={{width:'16px',height:'16px',position:'absolute',left:'10px',top:'3px'}}/></span>
        </Popover>
      },
      {
        title: '预估外部市值(元)',
        dataIndex: 'externalMarketValue',
        key: '预估外部市值(元)',
      },
      {
        title: '资产峰值(近一年)(元)',
        dataIndex: 'assetsPeak',
        key: '资产峰值(近一年)(元)',
      },
      {
        title: '当前资产(元)',
        dataIndex: 'previousAsset',//等待后端字段名
        key: '当前资产(元)',
      },
      {
        title: '手机证券最近登录时间',
        dataIndex: 'recentOnlineDate',
        key: '手机证券最近登录时间',
      },
      {
        title: '开发关系',
        dataIndex: 'devRela',//等待后端字段名
        key: '开发关系',
      },
      {
        title: '服务关系',
        dataIndex: 'serviceRela',//等待后端字段名
        key: '服务关系',
      },
      {
        title: '无效户激活关系',
        dataIndex: 'activateRela',//等待后端字段名
        key: '无效户激活关系',
      },
    ];
  }
  // 点击时间周期按钮
  handleClick = (value, key) => {
    this.setState({
      [key]: value,
    });
  }
  setStateChange = (state)=>{
    this.setState({
      ...state,
    });
  }
  reset = ()=>{
    this.setState({
      custRange: 0,
      gudongka:0,
      custRank: [],
      rankVisible: false,
      rjDateKey: 0,
      rjDate: [undefined,undefined],//默认无限制
      activePotential: 3,
      outAssetMin: null,
      outAssetMax: null,
      khDateKey: 0,
      khDate: [undefined,undefined],
      assetsPeak: 0,
      loginDate: [undefined,undefined],
      historyProd: [],
      bussiOpen: [],
      tags: [],
      custGrup: [],
      openVisible: false,
      prodVisible: false,
    });
  }
  // componentDidMount(){
    //this.queryData();
  // }
  queryData = ()=>{
    this.setState({
      tableVisible: true,
      current: 1,
      selectAll: false,
      selectedRowKeys: [],
      selectedRows: [],
    },this.fetchData());
  }
  fetchData = ()=>{
    this.setState({
      loading: true,
    });
    const { rjDate,rjDateKey, custRange,gudongka,custRank,activePotential,outAssetMin,outAssetMax,khDate,khDateKey,assetsPeak,loginDate,historyProd,bussiOpen,tags,custGrup } = this.state;
    QueryInvalidCustomer({
      buzState: 0 ,
      customerRange: custRange,
      isShareHolder:gudongka,
      customerLevel: custRank,
      recentPaymentDateRange: {
        "isCustom": rjDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": rjDateKey === 999 ? null : rjDateKey,
        "date": null,
        "dateFrom": rjDateKey === 999 ? (rjDate[0] ? rjDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": rjDateKey === 999 ? (rjDate[1] ? rjDate[1].format('YYYYMMDD') : "30000101") : null,
      },
      activePotential: activePotential,
      externalMarketValue: {
        "isCustom": true,
        "isSingleValue": false,
        "enumTypeValue": null,
        "value": null,
        // "valueFrom": ''+outAssetMin,
        // "valueTo": ''+outAssetMax,
        "valueFrom": outAssetMin === null ? '0' : `${outAssetMin}`,
        "valueTo": outAssetMax === null ? `${Math.pow(2,31)}` : `${outAssetMax}`,
      },
      registerYears: {
        "isCustom": khDateKey === 999 ? true : false,
        "isDatePoint": false,
        "enumTypeDate": khDateKey === 999 ? null : khDateKey,
        "date": null,
        "dateFrom": khDateKey === 999 ? (khDate[0] ? khDate[0].format('YYYYMMDD') : "19000101") : null,
        "dateTo": khDateKey === 999 ? (khDate[1] ? khDate[1].format('YYYYMMDD') : "30000101") : null,
      },
      assetsPeak: assetsPeak,
      recentOnlineDateRange: {
        "isCustom": true,
        "isDatePoint": false,
        "enumTypeDate": null,
        "date": null,
        "dateFrom": (loginDate[0] ? loginDate[0].format('YYYYMMDD') : "19000101"),
        "dateTo": (loginDate[1] ? loginDate[1].format('YYYYMMDD') : "30000101"),
      },
      historyContract: historyProd,
      buzOpening: bussiOpen,
      "staffTagList": tags.filter(item=>item.split('/')[1] === '3').map(item=>item.split('/')[0]),
      "companyTagList": tags.filter(item=>item.split('/')[1] === '2').map(item=>item.split('/')[0]),
      "activityTagList": tags.filter(item=>item.split('/')[1] === '1').map(item=>item.split('/')[0]),
      customerGroupList: custGrup,
      pageNo: this.state.current,
      pageSize: this.state.pageSize,
    }).then(res=>{
      this.setState({ dataSource: res.records ,total: res.total ,loading: false ,md5: res.note });
      this.newState = this.state;
    }).catch(err => message.error(err.note || err.message));
  }
  render() {
    const { pageSize,current,total } = this.state;
    const tableProps = {
      bordered: true,
      scroll: { x: true },
      rowKey: 'key',
      dataSource: this.state.dataSource.map((item, index) => {
        return { ...item,key: ((current - 1) * pageSize) + index + 1 };
      }),
      columns: this.getColumns(),
      className: 'm-Card-Table',
      pagination: {
        className: 'm-bss-paging',
        showTotal: totals => {
          return `总共${totals}条`;
        },
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        total,
        current,
        pageSize,
        onChange: (current, pageSize) => {
          this.setState({ current, pageSize }, () => this.fetchData());
        },
        onShowSizeChange: (current, pageSize) => {
          this.setState({ current, pageSize }, () => this.fetchData());
        },
      },
      rowSelection: {
        type: 'checkbox',
        crossPageSelect: true, // checkbox默认开启跨页全选
        selectAll: this.state.selectAll,
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
          this.setState({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys,selectedRows });
        },
        getCheckboxProps: record => ({
          disabled: record.status === 0, // Column configuration not to be checked
          name: record.status,
        }),
        fixed: true,
      },
      // onChange: this.handleTableChange,
    };
    const { rjDate,rjDateKey, custRange,gudongka,custRank,activePotential,outAssetMin,outAssetMax,khDate,khDateKey,assetsPeak,loginDate,historyProd,bussiOpen,tags,custGrup,tagsVisible ,custVisible ,openVisible,prodVisible,visible1,visible2 } = this.state;
    const SearchProps = {
      rankVisible: this.state.rankVisible,
      rjDate,rjDateKey, custRange,gudongka,custRank,activePotential,outAssetMin,outAssetMax,khDate,khDateKey,assetsPeak,loginDate,historyProd,bussiOpen,tags,custGrup,tagsVisible ,custVisible,openVisible,prodVisible,
      handleClick: this.handleClick,
      setStateChange: this.setStateChange,
      changeClick:this.changeClick,
      reset: this.reset,
      queryData: this.queryData,
      visible1,
      visible2
    };
    const btnProps = { type: 10 ,total,getColumns: this.getColumns,param: this.getParam(),selectAll: this.state.selectAll,selectedRows: this.state.selectedRows,md5: this.state.md5 };
    return (
      <div id='Invalid-unactive' className={styles.Table} onClick={() => this.setState({ tagsVisible: false,custVisible: false ,riskVisible: false,sceneVisible: false,rankVisible: false ,prodVisible: false,openVisible: false })}>
        <SearchContent {...SearchProps} IconSure ={IconSure}/>
        {
          this.state.tableVisible && (
          <>
            <TableBtn {...btnProps}/>
            <BasicDataTable {...tableProps} style={{ marginBottom: 20 }} loading={this.state.loading}/>
          </>
          )
        }
      </div>
    );
  }
}
