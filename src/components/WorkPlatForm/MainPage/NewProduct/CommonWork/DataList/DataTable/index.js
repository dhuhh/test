import { Button, Form, message, Modal, Pagination, Spin ,Input ,Select,Checkbox,Table,Switch ,DatePicker } from 'antd';
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import { connect } from 'dva';
import lodash from 'lodash';
import { uniqBy } from 'lodash';
import { usePrevious, addSensors } from '../../util';
import FollowLog from '../../Common/Dialog/FollowLog';
import CustomerRelatedEvents from '../../Common/Dialog/CustomerRelatedEvents';
import EcifRelatedEvents from '../../Common/Dialog/EcifRelatedEvents';
import C4Iframe from '../../Common/Dialog/C4Iframe';
import Filter from '../../Common/Filter';
import BasicDataTable from '$common/BasicDataTable';
import { FetchStaffMessageQuotal } from '$services/incidentialServices';
import { QueryUserTaskCust, SaveOverLookUserTaskCust, QueryEventDetailCusList, IgnoreEvent ,RecorderEventContext,WriterEventContext,EarnEventLink,SendMessage,EarnMessageStaff ,QueryServiceRecorder,InvstmentAdviserSaver } from '$services/newProduct';
import { QueryEcifEventDetailCusList,QueryEventCustomerInfoList } from '$services/ecifEvent';
import CryptoJS from 'crypto-js';
import { getQueryDictionary } from '$services/searchProcess';
import arrow_right from '$assets/newProduct/arrow_right.svg';
import noticeIconEnclosure from '$assets/newProduct/notice_icon_enclosure.png';
import tipsImg from '$assets/newProduct/icon／tishi／_tishi1@2x.png';
import filter from '$assets/newProduct/filter.svg';
import filter_finished from '$assets/newProduct/filter_finished.svg';
import styles from '../../index.less';
import { history as router, Link } from 'umi';
import FilterColumn from './FilterColumn';
import FilterDegree from './FilterDegree';
import FilterLevel from './FilterLevel' ;
import TextArea from 'antd/lib/input/TextArea';

function reducer(state, action) {
  const newState = { ...state };
  newState[action.type] = action.value;
  return newState;
}

function DataTable(props) {
  const [custRank, setCustRank] = useState('0');
  const [status, setStatus] = useState('0');
  const [summary, setSummary] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [allData , setAllData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false); // 弹框显隐
  const [custNo, setCustNo] = useState(''); // 查看弹框客户号
  const [custId, setCustId] = useState(''); // 查看弹框客户id
  const [selectAll, setSelectAll] = useState(false); // 全选
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [ignoreModal, setIgnoreModal] = useState(false); // 确认忽略
  const [loading, setLoading] = useState(false); // loading
  const [eventVisible, setEventVisible] = useState(false); // 事件弹框
  const [ecifEventVisible,setEcifEventVisible] = useState(false); // Ecif事件弹框
  const [eventRecord, setEventRecord] = useState({}); // 事件弹框信息
  const [handleEventVisible, setHandleEventVisible] = useState({}); // 事件表单弹框信息
  const [handleWidthTaskVisible, setHandleWidthTaskVisible] = useState(false); // 任务处理弹框
  const [c4Url, setC4Url] = useState(''); // c4操作页url
  const [tableLoading, setTableLoading] = useState(false); // 表格loading
  const [eventStatus, setEventStatus] = useState('1'); // 事件状态
  // const [initKey, setInitKey] = useState(''); // 表格key
  const prevCurrent = usePrevious(current); // prevProps
  const [filterVisible, dispatch] = useReducer(reducer, { visible1: false, visible2: false, visible3: false });
  const detailType = props.activeList.replace(/[0-9]/g, '');
  const eventType = props.eventType ; // 事件类型

  const ecifEventType = props.ecifEventType ; // ECIF事件跟其他事件
  const [levelDateLength , setLeveLength] = useState(0);
  const [sortRules , setSortRules] = useState(''); // 分配日期 1 降序  2  升序
  const [sort , setSort] = useState('') ;// 距离日期 1 降序  2  升序
  
  const [levelDate , setLevelDate] = useState(''); //客户级别列表-字典
  const [custTypeData , setCustTypeData] = useState([]); // 客户类型字典
  const [disorderlyData, setDisorderlyData] = useState([]); // 不规范情形字典
  const [treatmentData , setTreatment ] = useState([]); // 处理方式字典
  
  const [cusCode , setCusCode] = useState(''); //客户级别-查询条件
  const [custType , setCustType] = useState('');// 客户类型--查询条件
  const [disorderly , setDisorderly] = useState(''); //不规范情景-查询条件
  const [treatmentWay , setTreatmentWay ] = useState(''); // 处理方式--查询条件
  const [standardWay , setStandardWay] = useState(''); // 账户规范方式----查询条件
  const [importance , setImportance] = useState(''); //重要程度-查询条件

  const [eventList , setEventList] = useState({}); //获取事件表单数据
  const [listValue , setListValue] = useState({}); //填写表单值
  const [listVisible , setListVisible] = useState(false); //表单modal
  const [sendMsgVisible , setSendMsgVisible] = useState(false); //发送短信modal
  const [messageQuota , setMessageQuota] = useState({}); //短信参数
  const [switchKey , setSwitchKey] = useState(false); //switch开关
  const [msgContent , setMsgContent] = useState(''); //短信内容
  const [dateOpen , setDateOpen] = useState(false); //日历开关
  const [msgDate,setMsgDate] = useState(moment());
  const [timeHValue,setTimeHValue] = useState(moment().format('HH'));
  const [timeMValue,setTimeMValue] = useState(moment().format('mm'));
  const [timing,setTiming] = useState(false);
  const [msgLink,setMsgLink] = useState('');
  const [msgCnt,setMsgCnt] = useState('');
  const [msgTitle,setMsgTitle] = useState('');
  const [msgDesc,setMsgDesc] = useState('');
  const [msgStaff,setMsgStaff] = useState('');
  const [staffList,setStaffList] = useState([]);
  const [staffListCurrent,setStaffListCurrent] = useState(1);
  const [staffListTotal,setStaffListTotal] = useState(0);
  const [staffListLoading,setStaffListLoading] = useState(false);
  const [modalLoading,setModalLoading] = useState(false);
  const [cusNot , setCusNot] = useState('');
  const [mds , setMds] = useState('');
  const [singeDeal , setSingeDeal] = useState(false); // 单条处理 默认selectAll全选为false

  useEffect(() => {
    const nodes = document.getElementsByClassName('ant-table-filter-dropdown');
    if (nodes && [...nodes].length && nodes[0].style.boxShadow !== 'none') {
      [...nodes].forEach(item => {
        // 区分下拉弹窗某些不需要多余的背景
        if(!item.firstChild.className.includes('pDropDownInput')){
          item.style.background = 'transparent'; item.style.boxShadow = 'none';
        }
      });
    }
    return () => {
      [...nodes].forEach(item => {
        if(!item.firstChild.className.includes('pDropDownInput')){
          item.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'; item.style.background = '#FFF';
        }
      });
    };
  });
  // Ecif排序
  const onTableChange = (a,b,c)=>{
    if(c.field === 'distributionTime'){
      setSort('');
      if(c.order === 'ascend'){
        setSortRules('2');
      }else{
        setSortRules('1');
      }
    }else{
      setSortRules('');
      if(c.order === 'ascend'){
        setSort('2');
      }else{
        setSort('1');
      }
    }
  };
  // 定列表滚动条宽度
  const tableProps = detailType === 'task' ? {
  } : eventType === 'ecifEvent' ? {
    scroll: { x: 2080 },
    onChange: onTableChange ,
  } : {
    scroll: { x: 1200 },
  } ;
  //全选框功能
  const rowSelection = {
    type: 'checkbox',
    crossPageSelect: eventType === 'ecifEvent' ? false : true, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      if(eventType === 'ecifEvent'){
        let arr = uniqBy(allData.concat(selectedRows),'eventId');
        setAllData(arr);
      }
      setSelectAll(currentSelectAll);
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
    fixed: true,
  };
  const custRankData = [
    { key: '0', value: '全部客户' },
    { key: '1', value: 'V1-V4' },
    { key: '2', value: 'V4' },
    { key: '3', value: 'V5-V7(金桂卡)' },
  ];
  const statusData = detailType === 'task' ? [
    { key: '0', value: '待服务' },
    { key: '1', value: '已服务' },
    { key: '2', value: '已忽略' },
  ] : [
    { key: '0', value: '最近更新' },
    { key: '1', value: '即将过期' },
  ];
  const eventStatusData = [
    { key: '1', value: '待服务' },
    { key: '2', value: '已忽略' },
    { key: '3', value: '已服务' },
  ];

  //重要程度字典
  const importanceData = [
    { id: 'A', name: '高' },
    { id: 'B', name: '中' },
    { id: 'C', name: '低' },
  ];
  // 账户规范方式字典
  const disAutorData = [
    { id: '临柜', name: '临柜' },
    { id: '自助', name: '自助' },
  ];


  // 任务列表表头
  const taskColumnData = [
    {
      title: '级别',
      dataIndex: 'custRank',
      className: 'columnLine',
      key: 'custRank',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      filterIcon: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src={custRank !== '0' ? filter_finished : filter} alt='' style={{ width: 10, height: 10 }} /></div>,
      filterDropdown: ({ confirm }) => <Filter visible={filterVisible.visible1} value={custRank} onChange={(value) => { setCustRank(value); setCurrent(1); dispatch({ type: 'visible1', value: false }); confirm(); }} data={custRankData} />,
      onFilterDropdownVisibleChange: (visible) => dispatch({ type: 'visible1', value: visible }),
    },
    {
      title: '客户',
      dataIndex: 'custName',
      key: 'custName',
      className: 'columnLine',
      render: (_, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.custNo}`} target='_blank'><div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.hover}>{record.custName}({record.custNo})</div></Link> ,
      filterIcon: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src={status !== '0' ? filter_finished : filter} alt='' style={{ width: 10, height: 10 }} /></div>,
      filterDropdown: ({ confirm }) => <Filter visible={filterVisible.visible2} value={status} onChange={(value) => { setStatus(value); setCurrent(1); dispatch({ type: 'visible2', value: false }); confirm(); }} data={statusData} />,
      onFilterDropdownVisibleChange: (visible) => dispatch({ type: 'visible2', value: visible }),
    },
    {
      title: '营业部',
      dataIndex: 'custOrg',
      key: 'custOrg',
      className: 'columnLine',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '手机号',
      dataIndex: 'custPhone',
      key: 'custPhone',
      className: 'columnLine',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      className: 'columnLine',
      fixed: 'right',
      width: 70,
      render: (_, record) => <span style={{ color: '#244FFF', cursor: 'pointer', wordBreak: 'break-all', whiteSpace: 'normal' }} onClick={() => {handleWith(record);} }>{status === '1' ? '查看' : '处理'}</span>,
    },
  ];
  // 其他事件列表表头
  const eventColumnData = [
    {
      title: '级别',
      dataIndex: 'cusLvl',
      key: 'cusLvl',
      className: 'columnLine',
      width: 70,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
      filterIcon: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src={custRank !== '0' ? filter_finished : filter} alt='' style={{ width: 10, height: 10 }} /></div>,
      filterDropdown: ({ confirm }) => <Filter visible={filterVisible.visible1} value={custRank} onChange={(value) => { setCustRank(value); setCurrent(1); dispatch({ type: 'visible1', value: false }); confirm(); }} data={custRankData} />,
      onFilterDropdownVisibleChange: (visible) => dispatch({ type: 'visible1', value: visible }),
    },
    props.calendar && detailType === 'event' ?
      {
        title: '客户',
        dataIndex: 'custName',
        key: 'custName',
        className: 'columnLine',
        // width: 160,
        render: (_, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.cusNo}`} target='_blank'><div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.hover}>{record.cusNum}({record.cusNo})</div></Link> ,
        filterIcon: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src={eventStatus !== '1' ? filter_finished : filter} alt='' style={{ width: 10, height: 10 }} /></div>,
        filterDropdown: ({ confirm }) => <Filter visible={filterVisible.visible3} value={eventStatus} onChange={(value) => { setEventStatus(value); setCurrent(1); dispatch({ type: 'visible3', value: false }); confirm(); }} data={eventStatusData} />,
        onFilterDropdownVisibleChange: (visible) => dispatch({ type: 'visible3', value: visible }),
      } : {
        title: '客户',
        dataIndex: 'custName',
        className: 'columnLine',
        key: 'custName',
        // width: 160,
        render: (_, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.cusNo}`} target='_blank'><div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.hover}>{record.cusNum}({record.cusNo})</div></Link> ,
      },
    {
      title: '事件描述',
      dataIndex: 'describe',
      className: 'columnLine',
      key: 'describe',
      width: 259,
      render: text => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }}>{text}</div>,
    },
    props.calendar && detailType === 'event' ?
      {
        title: props.calendar ? '处理时间' : '更新日期',
        dataIndex: 'updateTime',
        className: 'columnLine',
        key: 'updateTime',
        render: text => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{moment(text).format('YYYY-MM-DD')}</div>,
      } :
      {
        title: props.calendar ? '处理时间' : '更新日期',
        dataIndex: 'updateTime',
        key: 'updateTime',
        className: 'columnLine',
        render: text => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{moment(text).format('YYYY-MM-DD')}</div>,
        filterIcon: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src={status !== '0' ? filter_finished : filter} alt='' style={{ width: 10, height: 10 }} /></div>,
        filterDropdown: ({ confirm }) => <Filter visible={filterVisible.visible2} value={status} onChange={(value) => { setStatus(value); setCurrent(1); dispatch({ type: 'visible2', value: false }); confirm(); }} data={statusData} />,
        onFilterDropdownVisibleChange: (visible) => dispatch({ type: 'visible2', value: visible }),
      },
    // {
    //   title: '距离到期',
    //   dataIndex: 'deadline',
    //   className: 'columnLine',
    //   key: 'deadline',
    //   render: text => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{Number(text) > 0 ? text + '天' : moment().subtract(Math.abs(Number(text)), 'days').format('YYYY-MM-DD')}</div>,
    // },
    {
      title: '关联事件',
      dataIndex: 'eventNum',
      className: 'columnLine',
      key: 'eventNum',
      render: (text, record) => <div style={{ cursor: 'pointer', wordBreak: 'break-all', whiteSpace: 'normal' }} onClick={() => { handleWith(record); }}>关联事件<span style={{ color: '#244FFF' }}>({text})</span></div>,
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      className: 'columnLine',
      fixed: 'right',
      width: 70,
      render: (_, record) => <span style={{ color: props.calendar && eventStatus === '3' ? '#61698C' : '#244FFF', cursor: 'pointer', wordBreak: 'break-all', whiteSpace: 'normal' }} onClick={() => {handleWith(record, 1,eventType);} }>处理</span>,
    },
  ];
  // 客户不规范（ECIF）列表表头
  const ecifColumnData = [
    {
      title: '级别',
      dataIndex: 'cusLvl',
      key: 'cusLvl',
      className: 'columnLine',
      width: 70,
      render: (text) => <div>{text}</div>,
      filterDropdown: ({ confirm }) => <FilterLevel levelDateLength={levelDateLength} confirm={confirm} treeData={levelDate} setCusCode={setCusCode} />,
    },
    {
      title: '客户',
      dataIndex: 'cusName',
      key: 'cusName',
      className: 'columnLine',
      width: 100,
      render: (_, record) => <Link style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} to={`/customerPanorama/customerInfo?customerCode=${record.cusCode}`} target='_blank'><div style={{ color: '#244FFF' , cursor: 'pointer' }}>{record.cusName}</div></Link> ,
    },
    {
      title: '客户号',
      dataIndex: 'cusCode',
      key: 'cusCode',
      className: 'columnLine',
      width: 124,
      render: (_, record) => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} >{record.cusCode}</div>,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      className: 'columnLine',
      width: 124,
      render: (text) => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} >{text}</div>,
    },
    {
      title: '客户类型',
      dataIndex: 'custType',
      key: 'custType',
      className: 'columnLine',
      // width: 124,
      filterDropdown: ({ confirm }) => <FilterDegree setStateData={setCustType} TATA_ZTList={custTypeData} confirm={confirm } />,
      render: (text) => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} >{text}</div>,
    },
    {
      title: '客户账号不规范情形',
      dataIndex: 'disorderlyName',
      key: 'disorderlyName',
      className: 'columnLine',
      width: 230,
      filterDropdown: ({ confirm }) => <FilterColumn DIS_ZTList={disorderlyData} setDisorderly={setDisorderly} confirm={confirm} />,
      render: text => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }}>{text}</div>,
    },
    {
      title: '事件描述',
      dataIndex: 'describe',
      key: 'describe',
      className: 'columnLine',
      width: 300,
      render: text => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }}>{text}</div>,
    },
    {
      title: '处理方式',
      dataIndex: 'treatmentWay',
      key: 'treatmentWay',
      className: 'columnLine',
      // width: 124,
      filterDropdown: ({ confirm }) => <FilterDegree setStateData={setTreatmentWay} TATA_ZTList={treatmentData} confirm={confirm } />,
      render: (text) => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} >{text === '1' ? '尽职调查' : text === '2' ? '通知' : '账户核查'}</div>,
    },
    {
      title: '账户规范方式',
      dataIndex: 'StandardWay',
      key: 'StandardWay',
      className: 'columnLine',
      width: 124,
      filterDropdown: ({ confirm }) => <FilterDegree setStateData={setStandardWay} TATA_ZTList={disAutorData} confirm={confirm } />,
      render: (text) => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} >{text === '1' ? '临柜' : text === '2' ? '自助' : text}</div>,
    },
    {
      title: '联系地址',
      dataIndex: 'address',
      key: 'address',
      className: 'columnLine',
      width: 200,
      render: (text) => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} >{text}</div>,
    },
    {
      title: '重要程度',
      dataIndex: 'importance',
      key: 'importance',
      className: 'columnLine',
      // width: 130,
      filterDropdown: ({ confirm }) => <FilterDegree setStateData={setImportance} TATA_ZTList={importanceData} confirm={confirm } />,
      render: text => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', lineHeight: '20px' }}>{text}</div>,
    },
    {
      title: '分配日期',
      dataIndex: 'distributionTime',
      key: 'distributionTime',
      className: 'columnLine',
      width: 124,
      sorter: true,
      render: text => <div >{moment(text).format('YYYY-MM-DD')}</div>,
    },
    {
      title: '距离到期',
      dataIndex: 'deadlineTime',
      key: 'deadlineTime',
      className: 'columnLine',
      width: 124,
      sorter: true,
      render: text => <div>{moment(text).format('YYYY-MM-DD')}</div>,
    },
    {
      title: '关联事件',
      dataIndex: 'eventNum',
      key: 'eventNum',
      className: 'columnLine',
      width: 100,
      render: (text, record) => <div style={{ cursor: 'pointer' }} onClick={() => { handleEcifWith(record); }}>关联事件<span style={{ color: '#244FFF' }}>({text})</span></div>,
    },
    {
      title: '操作',
      dataIndex: 'nie',
      align: 'center',
      className: 'columnLine',
      fixed: 'right',
      width: 70,
      render: (_, record) => <span style={{ color: '#244FFF', cursor: 'pointer' }} onClick={() => {handleWith(record, 1, eventType);} }>处理</span>,
    },
  ];
  const columns = detailType === 'task' ? taskColumnData : eventType === 'ecifEvent' ? ecifColumnData : eventColumnData;

  const getData = useCallback(
    () => {
      setTableLoading(true);
      const params = detailType === 'task' ? {
        paging: 1,
        current,
        pageSize,
        total: -1,
        custRank: Number(custRank),
        status: Number(status),
        taskId: Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id),
        // taskId: 53,
      } : {
        paging: 1,
        current,
        pageSize,
        total: -1,
        cusLvl: Number(custRank),
        sortRules: Number(status) + 1,
        eventId: Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id),
      };
      if (detailType === 'event' && props.calendar) {
        params['date'] = props.time.format('YYYYMMDD');
        params['status'] = Number(eventStatus);
        params['sortRules'] = 3;
      }
      if (detailType === 'task') {
        QueryUserTaskCust(params).then((response) => {
          setTableLoading(false);
          const summary = {
            custCount: response.custCount,
            custAccom: response.custAccom,
            rate: response.custRate,
            custOver: response.custOver,
            oprUser: response.oprUser,
          };
          const { records = [], total = 0 } = response;
          setSummary(summary);
          setDataSource(records);
          setTotal(total);
          if (prevCurrent === current) {
            setSelectAll(false);
            setSelectedRowKeys([]);
            setSelectedRows([]);
          }
          // changeKey();
        }).catch((error) => {
          // message.error(error.note || error.message);
        });
      } else {
        if( eventType === 'ecifEvent'){

          const params = {
            current,
            cusCode,
            disorderly,
            eventId: Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id),
            importance,
            pageLength: 0,
            treatmentWay,
            custType,
            standardWay,
            pageNo: 0,
            pageSize,
            paging: 1,
            sort,
            total: -1,
            totalRows: 0,
            sortRules,
          };

          if(props.calendar){
            params['date'] = props.time.format('YYYYMMDD');
          }
          
          const data = {  
            // cusCode: params.cusCode,
            eventId: params.eventId ,
            date: params.date,
            disorderly: params.disorderly ,
            importance: params.importance ,
            sortRules: params.sortRules ,
          };
          // 获取客户级别
          getQueryEventCustomerInfoList(data);
          // 事件列表
          QueryEcifEventDetailCusList(params).then(res=>{
            setTableLoading(false);
            const { records = [], total = 0 } = res;
            setDataSource(records);
            setTotal(total);
            const summary = {
              newCusNum: res.newCusNum,
              custCount: res.custCount,
              custAccom: res.custAccom,
              oprUser: res.oprUser,
              custExpire: res.custExpire,
            };
            setSummary(summary);
            if (prevCurrent === current) {
              setSelectAll(false);
              setSelectedRowKeys([]);
              setSelectedRows([]);
            }

          }).catch((error) => {
            // message.error(error.note || error.message);
          });

        }else{
          QueryEventDetailCusList(params).then((response1) => {
            setTableLoading(false);
            const { records = [], total = 0 , note = ''} = response1;
            setDataSource(records);
            setTotal(total);
            setMds(note)
            const summary = {
              newCusNum: response1.newCusNum,
              custCount: response1.custCount,
              custAccom: response1.custAccom,
              oprUser: response1.oprUser,
              custExpire: response1.custExpire,
            };
            setSummary(summary);
            if (prevCurrent === current) {
              setSelectAll(false);
              setSingeDeal(false)
              setSelectedRowKeys([]);
              setSelectedRows([]);
            }
            // changeKey();
          }).catch((error) => {
            // message.error(error.note || error.message);
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, pageSize, custRank, status, eventStatus,importance, disorderly,cusCode,sortRules,sort,props.time, props.calendar, props.activeList,treatmentWay,custType,standardWay],
  );
  // ECIF 事件列表客户等级树形数据
  const getQueryEventCustomerInfoList = (params) =>{
    QueryEventCustomerInfoList(params).then(res=>{

      let list = res.records;
      setLeveLength(list.length);
      let data = []; 
      let treeData = [];
      for(var i = 0,length = list.length; i < length; i++) {
        //  组装树形数据结构
        //  1.先分大类data
        //  2.根据data细分treeData树形数据结构
        if(!data[list[i].custLvl]) {
          var arr = [];
          var arrObj = {};
          var treesObj = {};
          arrObj.title = `${list[i].custName}(${list[i].custCode})`;
          arrObj.key = list[i].custCode;
          arr.push(arrObj);
          data[list[i].custLvl] = arr;

          treesObj.title = list[i].custLvl;
          treesObj.key = list[i].custLvl;
          treesObj.children = arr;
          treeData.push(treesObj);         
        }else {
          var arrObjs = {};
          arrObjs.title = `${list[i].custName}(${list[i].custCode})`;
          arrObjs.key = list[i].custCode;
          data[list[i].custLvl].push(arrObjs);
        }
      }
      // 树形数据排序
      treeData.sort(function(a,b) { return a.title.replace(/[^0-9]/g, '') - b.title.replace(/[^0-9]/g, ''); });
      // 树形数据组装小类长度
      treeData.forEach((i,d)=>{
        i.title = `${i.title} (${i.children.length}个)`;
      });
        
      setLevelDate(treeData);
    });
  };

  // 获取字典
  const getAllQueryDictionary = ()=>{
    let payload = { dictionaryType: "KHBGFQX" }; // 不规范情景
    let param = { dictionaryType: "BGFXX_KHLX" }; //客户类型
    let param2 = { dictionaryType: "BGFXX_CLFS" }; // 处理方式

    Promise.all([
      getQueryDictionary(payload),
      getQueryDictionary(param),
      getQueryDictionary(param2),
    ]).then(res=>{
      const [res1, res2 , res3 ] = res;

      const { records: records1 = [] } = res1;
      setDisorderlyData(records1);
      const { records: records2 = [] } = res2;
      setCustTypeData(records2);
      const { records: records3 = [] } = res3;
      setTreatment(records3);

    });
    
  };


  useEffect(() => {
    getData();
    return () => {};
  }, [getData]);


  useEffect(() => {
    if(eventType === 'ecifEvent'){
      // 获取不规范列表
      getAllQueryDictionary();
    }
    return () => {};
  }, []);

  const { onChange } = props;
  if (onChange && typeof onChange === 'function') onChange(getData);

  const listener = useCallback((e) => {
    const { page, action, success } = e.data;
    if (page === 'cusTaskMission') {
      if (action === 'closeModal') {
        setHandleWidthTaskVisible(false);
      }
      if (success) {
        window.parent.postMessage({ action: 'queryBacklog' }, '*');
        getData();
        props.queryCalContent();
        setSelectAll(false);
        setSingeDeal(false)
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setCurrent(1);
        // 测试要求刷新左边列表
        props.queryBackLogList({ pagination: { current: 1, pageSize: props.pageSize, total: -1, paging: 1 } }).then((response) => {
          const listData = response.records || [];
          // if (listData.length) {
          //   if (listData[0].typeId === '2') {
          //     props.setActiveList('task0');
          //   } else if (listData[0].typeId === '1') {
          //     props.setActiveList('event0');
          //   } else if (listData[0].typeId === '3') {
          //     props.setActiveList('flow0');
          //   }
          // }
          // props.setPageSize(10);

          if (listData.find(item => item.id === props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id) === undefined) {
            if (listData.length) {
              if (listData[0].typeId === '2') {
                props.setActiveList('task0');
              } else if (listData[0].typeId === '1') {
                props.setActiveList('event0');
                if(listData[0].id === ecifEventType){
                  props.setEventType('ecifEvent');
                }else{
                  props.setEventType('otherEvent')
                }
              } else if (listData[0].typeId === '3') {
                props.setActiveList('flow0');
              }
            }
          }else{
          //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型 
          if(listData[0].typeId === '1' &&  props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id == ecifEventType) {
              props.setEventType('ecifEvent');
            }else{
              props.setEventType('otherEvent');
           }
          }
          props.setListData(listData);
        });
      }
    } else if (page === 'newMission') {
      if (action === 'closeModal') {
        setHandleWidthTaskVisible(false);
      }
      if (success) {
        window.parent.postMessage({ action: 'queryBacklog' }, '*');
        getData();
        props.queryCalContent();
        setSelectAll(false);
        setSingeDeal(false)
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setCurrent(1);
        // 测试要求刷新左边列表
        props.queryBackLogList({ pagination: { current: 1, pageSize: props.pageSize, total: -1, paging: 1 } }).then((response) => {
          const listData = response.records || [];

          if (listData.find(item => item.id === props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id) === undefined) {
            if (listData.length) {
              if (listData[0].typeId === '2') {
                props.setActiveList('task0');
              } else if (listData[0].typeId === '1') {
                props.setActiveList('event0');
                if(listData[0].id === ecifEventType){
                  props.setEventType('ecifEvent');
                }else{
                  props.setEventType('otherEvent')
                }
              } else if (listData[0].typeId === '3') {
                props.setActiveList('flow0');
              }
            }
          }else{
          //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型 
          if(listData[0].typeId === '1' &&  props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id == ecifEventType) {
              props.setEventType('ecifEvent');
            }else{
              props.setEventType('otherEvent');
           }
          }
          props.setListData(listData);
        });
      }
    }
  },[getData , props]);

  useEffect(() => {
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [listener]);

  // 处理
  const handleWith = (record, falg = 0, eventType = 'otherEvent') => {
    
    if (detailType === 'task') {
      if (status === '1') {
        setCustNo(record.custNo);
        setCustId(record.id);
        setVisible(true);
      } else {
        addSensors('任务处理');
        const { sysParam } = props;
        const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
        const url = `${serverName}/bss/ncrm/work/page/cusTaskMission.sdo?taskId=${record.taskId}&allSel=0&subTaskIds=${record.id}&customerCodes=${record.custNo}&token=318672AC1B2D2AFA06CF8D3014225A56&customerLevel=${custRank}&finishFlag=${status}`;
        setC4Url(url);
        setHandleWidthTaskVisible(true);
      }
    } else {
      if (falg === 1) {
        addSensors('事件处理');
        if (props.calendar && eventStatus === '3') return;
        if(eventType === 'ecifEvent'){
          const param = { custCode: record.cusCode,motId: record.eventId ,importance , disorderlyCode: disorderly , custCodeList: cusCode ,crm: '1' } ;
          if(props.calendar){
            param['calendarModel'] = props.time.format('YYYYMMDD');
          }
          let params = JSON.stringify(param);
          sessionStorage.setItem('ecifParam',params);
          router.push({ pathname: `/newProduct/works/dealListDetail/${ecifEventType}` });
        }else{
          if(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.kind === '1'|| props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.kind === ''){
            const { sysParam } = props;
            const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
            const url = `${serverName}/bss/ncrm/work/event/page/newMission.sdo?sjid=${props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id}&khhs=${record.cusNo}&allSel=0&token=${mds}&khIDs=${record.eventId}&customerLevel=${custRank}&rlms=${props.calendar ? props.time.format('YYYYMMDD') : ''}&cxlx=${props.calendar ? eventStatus : '0'}`;
            setC4Url(url);
            setHandleWidthTaskVisible(true);
          }else if(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.kind === '2'){
            setListVisible(true);
            setSingeDeal(true)
            setListValue({})
            setMsgStaff(record.eventId);
            setCusNot(record.cusNo);
          }else if(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.kind === '3'){
            setSendMsgVisible(true);
            setSingeDeal(true)
            setMsgStaff(record.eventId);
            setCusNot(record.cusNo);
            setMsgContent('')
            setSwitchKey(false)
            setTiming(false)
            setMsgDate(moment())
            setTimeHValue(moment().format('HH'))
            setTimeMValue(moment().format('mm'))
          }
        }
      } else {
        setEventRecord({ cusNo: record.cusNo, cusLvl: record.cusLvl, cusNum: record.cusNum, eventId: record.eventId });
        setEventVisible(true);
      }
    }
  };
  // Ecif事件关联
  const handleEcifWith = (record) => {
    setEventRecord({ custCode: record.cusCode, motId: record.eventId ,cusLvl: record.cusLvl });
    setEcifEventVisible(true);
  };

  // 批量处理
  const handleMuchWidth = () => {
    if (detailType === 'task') {
      addSensors('任务处理');
      const { sysParam } = props;
      const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
      const url = `${serverName}/bss/ncrm/work/page/cusTaskMission.sdo?taskId=${props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id}&allSel=${selectAll ? '1' : '0'}&subTaskIds=${selectedRows.map(item => item.id).join(',')}&customerCodes=${selectedRows.map(item => item.custNo).join(',')}&token=318672AC1B2D2AFA06CF8D3014225A56&customerLevel=${custRank}&finishFlag=${status}`;
      setC4Url(url);
      setHandleWidthTaskVisible(true);
    } else {
      addSensors('事件处理');
      if(eventType === 'ecifEvent'){
        const custCodes = [];
        const motId = [];
        const way = [] ;
        //treatmentWay 1|尽职调查2|通知3|账户核查
        allData.forEach( (item,index) => {
          selectedRowKeys.forEach(key=>{
            if(item.eventId === key ){
              // 尽职调查跟账户核查 走单条处理方式
              if(item.treatmentWay === '1' || item.treatmentWay === '3'){
                way.push(item.eventId);
              }
              motId.push(item.eventId);
              custCodes.push(item.cusCode);
            }
          });
        });

        // 避免数据是多条尽调或者通知跟尽调混合
        if(way.length > 1 || (custCodes.length > 1 && way.length >= 1)){
          message.error('选择事件中包含需尽职调查、账户核查的事件，请进行单条处理！');
          return;
        }
        const param = { custCode: custCodes.join(','),motId: motId.join(',') ,importance , disorderlyCode: disorderly , custCodeList: cusCode ,crm: '1' } ;
        if(props.calendar){
          param['calendarModel'] = props.time.format('YYYYMMDD');
        }
        let params = JSON.stringify(param);
        sessionStorage.setItem('ecifParam',params);
        router.push({ pathname: `/newProduct/works/dealListDetail/${ecifEventType}` });
      }else{
        if(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.kind === '1'|| props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.kind === ''){
          const { sysParam } = props;
          const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
          const url = `${serverName}/bss/ncrm/work/event/page/newMission.sdo?sjid=${props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id}&khhs=${selectedRows.map(item => item.cusNo).join(',')}&allSel=${selectAll ? '1' : '0'}&token=${mds}&khIDs=${selectedRows.map(item => item.eventId).join(',')}&customerLevel=${custRank}&rlms=${props.calendar ? props.time.format('YYYYMMDD') : ''}&cxlx=${props.calendar ? eventStatus : '0'}`;
          setC4Url(url);
          setHandleWidthTaskVisible(true);
        }else if(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.kind === '2'){
          setListVisible(true);
          setListValue({})
          setMsgStaff(selectedRows.map(item => item.eventId).join(','))
          setCusNot(selectedRows.map(item => item.cusNo).join(','))
        }else if(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.kind === '3'){
          setSendMsgVisible(true);
          setMsgContent('')
          setSwitchKey(false)
          setMsgStaff(selectedRows.map(item => item.eventId).join(','));
          setCusNot(selectedRows.map(item => item.cusNo).join(','));
          setTiming(false)
          setMsgDate(moment())
          setTimeHValue(moment().format('HH'))
          setTimeMValue(moment().format('mm'))
        }
      }
    }
  };

  const handleIgnoreModal = () => {
    if (!selectAll && !selectedRowKeys.length) {
      message.warning('未选中任何记录！');
    } else {
      if(detailType === 'task' ){
        setIgnoreModal(true);
      }else{
        handleIgnore()
      }
    }
  };
  // 忽略任务/事件
  const handleIgnore = () => {
    if (detailType === 'task') {
      addSensors('任务忽略');
      setLoading(true);
      const taskId = Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id);
      const params = {
        taskId,
        st: selectAll ? 1 : 0,
        custId: selectedRows.map(item => item.id).join(','),
        custRank: Number(custRank),
      };
      SaveOverLookUserTaskCust(params).then((response) => {
        window.parent.postMessage({ action: 'queryBacklog' }, '*');
        message.success(response.note || '操作成功');
      }).catch((error) => {
        message.error(error.note || error.success);
      }).finally(() => {
        setLoading(false);
        setIgnoreModal(false);
        getData();
        props.queryCalContent();
        setSelectAll(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setCurrent(1);
        // 测试要求刷新左边列表
        props.queryBackLogList({ pagination: { current: 1, pageSize: props.pageSize, total: -1, paging: 1 } }).then((response) => {
          const listData = response.records || [];

          if (listData.find(item => item.id === props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id) === undefined) {
            if (listData.length) {
              if (listData[0].typeId === '2') {
                props.setActiveList('task0');
              } else if (listData[0].typeId === '1') {
                props.setActiveList('event0');
                if(listData[0].id === ecifEventType){
                  props.setEventType('ecifEvent');
                }else{
                  props.setEventType('otherEvent')
                }
              } else if (listData[0].typeId === '3') {
                props.setActiveList('flow0');
              }
            }
          }else{
          //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型 
          if(listData[0].typeId === '1' &&  props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id == ecifEventType) {
              props.setEventType('ecifEvent');
            }else{
              props.setEventType('otherEvent');
           }
          }
          props.setListData(listData);
        });
      });
    } else if (detailType === 'event') {
      addSensors('事件忽略');
      setLoading(true);
      setTableLoading(true);
      // const eventType = Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id);
      // const eventId = selectedRows.map(item => item.eventId).join(',');
      // const params = {
      //   eventType,
      //   eventId,
      //   isAll: selectAll ? '1' : '0',
      //   isRelation: 0,
      // };
      // if (props.calendar) params['date'] = props.time.format('YYYYMMDD');
      // IgnoreEvent(params).then((response) => {
      //   message.success(response.note || '操作成功');
      //   window.parent.postMessage({ action: 'queryBacklog' }, '*');
      const params = {
        custCode:selectedRows.map(item => item.eventId).join(','),
        title:props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.sbj,
        content:props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.cntnt,
        eventId: Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id),
        serviceWay:1,
        handleContent: 1,
        isAll:selectAll ? 1 : 0,
      };
      QueryServiceRecorder(params).then(res=>{
        message.info('待办已完成');
        window.parent.postMessage({ action: 'queryBacklog' }, '*');
      }).catch((error) => {
        message.error(error.note || error.success);
      }).finally(() => {
        setLoading(false);
        setIgnoreModal(false);
        getData();
        props.queryCalContent();
        setSelectAll(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setCurrent(1);
        // 测试要求刷新左边列表
        props.queryBackLogList({ pagination: { current: 1, pageSize: props.pageSize, total: -1, paging: 1 } }).then((response) => {
          const listData = response.records || [];

          if (listData.find(item => item.id === props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id) === undefined) {
            if (listData.length) {
              if (listData[0].typeId === '2') {
                props.setActiveList('task0');
              } else if (listData[0].typeId === '1') {
                props.setActiveList('event0');
                if(listData[0].id === ecifEventType){
                  props.setEventType('ecifEvent');
                }else{
                  props.setEventType('otherEvent')
                }
              } else if (listData[0].typeId === '3') {
                props.setActiveList('flow0');
              }
            }
          }else{
          //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型 
          if(listData[0].typeId === '1' &&  props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id == ecifEventType) {
              props.setEventType('ecifEvent');
            }else{
              props.setEventType('otherEvent');
           }
          }
          props.setListData(listData);
        });
      });
    }
  };
  const renderCount = () => {
    let count = 0;
    if (selectAll) {
      count = total - selectedRowKeys.length;
    } else {
      count = selectedRowKeys.length;
    }
    if (count) return `(${count})`;
    return '';
  };
  const handlePageChange = (current, pageSize) => {
    setCurrent(current);
    setPageSize(pageSize);
  };
  const computed = (type) => {
    if (type === 'lookAttac') {
      return props.activeList.replace(/[0-9]/g, '') === 'task' && props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.attac ? 'visible' : 'hidden';
    } else if (type === 'taskPeriod') {
      return props.activeList.replace(/[0-9]/g, '') === 'task' ? 'visible' : 'hidden';
    }
  };
  const download = () => {
    const { sysParam } = props;
    const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
    window.open(`${serverName}/OperateProcessor?Column=FJ&Table=TB_TASK&operate=Download&Type=Attachment&ID=${props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.id}`);
  };
  const toAllTask = () => {
    const { sysParam } = props;
    const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
    // window.parent.postMessage({ action: 'editTask', taskId: props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id || '0' }, '*');
    window.open(`${serverName}/bss/ncrm/work/page/taskDetail.sdo?sjid=${props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id || '0'}&sftjkh=1`);
  };

  useEffect(() => {
    if(listVisible){
      writerEventContext();
    }
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listVisible]);
  useEffect(() => {
    if(sendMsgVisible){
      fetchStaffMessageQuotal();
      earnEventLink();
      getMsgStaffList();
    }
    return () => {};
  }, [sendMsgVisible]);
  useEffect(() => {
    if(sendMsgVisible){
      getMsgStaffList();
    }
    return () => {};
  }, [staffListCurrent]);
  useEffect(() => {
    if(switchKey){
      setMsgContent(msgCnt);
    }else{
      setMsgContent('');
    }
    return () => {};
  }, [switchKey]);
  useEffect(() => {
    showTime();
    document.onclick = function (param) {
      if (!param.target) {
        return;
      }
      if (param.target.id !== 'rangePicker') {
        setDateOpen(false);
      }
    };
    return () => {
    };
  });
  const fetchStaffMessageQuotal = ()=>{
    FetchStaffMessageQuotal().then((ret = {}) => {
      const { records = [], code = 0 } = ret || {};
      if (code > 0) {
        setMessageQuota(records[0]);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  const recorderEventContext = ()=>{
    let param = [];
    let tip = true
    eventList?.formTitleList?.forEach((item,index)=>{
      if(listValue[item.titleId] && (!lodash.isEmpty(lodash.trim(listValue[item.titleId])))){
        param[index] = {
          an: listValue[item.titleId], cywj: eventList.eventId, ord: item.titlePro, topic: item.titleId, type: item.type,
        };
      }else if(tip){
        message.info(item.type === '3' ? `请填写${item.titleName}` : `请选择${item.titleName}`)
        tip =false
      }
    });
    if(param.length === Object.keys(listValue).length){
      setModalLoading(true)
      RecorderEventContext(param).then(res=>{
        if(res.code > 0){
          message.info('提交成功');
          queryServiceRecorder(1)
          setListVisible(false);
        }
        setModalLoading(false)
      }).catch((error) => {
        message.error(error.note || error.message);
      });
    }
  };
  const writerEventContext = ()=>{
    WriterEventContext({
      eventId: Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id),
      // eventId: '294',
    }).then(res=>{
      setEventList(res?.records[0]);
      res?.records[0]?.formTitleList.forEach((item) => {
        setListValue({ ...listValue,[item.titleId]: undefined });
      });
    }).catch((error) => {
      message.error(error.note || error.message);
    });
  };
  const earnEventLink = ()=>{
    let eventId = Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id)
    EarnEventLink({
      eventId,
      // eventId: '49',
    }).then(res=>{
      let linkData = res.records[0]
      if(linkData){
        setMsgLink(linkData.msgLink);
        // setMsgTitle(linkData.title)
        // setMsgDesc(linkData.descript)
        // setMsgCnt(linkData.msgContent)
        const { sysParam = [] } = props;
        const serverName = sysParam.filter(item => item?.csmc === 'system.c4ym.url')[0]?.csz;
        const SHARE_URL =  (serverName === 'https://crm.axzq.com.cn:8081' ? 'https://crm.axzq.com.cn':'https://scrm.essence.com.cn');
        const ICON_URL = 'https://essence-1253205294.cos.ap-guangzhou.myqcloud.com/mrmp/crm/sftp_file/logo.png';
        // 把分享信息保存到c端
        const shareMessage = {
          title: linkData.title,
          summary: linkData.descript,
          pic: ICON_URL,
          // 是否是主题资讯
          isTheme: 0,
          detailUrl: linkData.msgLink,
        };
        const param2 = { proType: '15', id: `${eventId}_${JSON.parse(sessionStorage.getItem('user')).id}`, describe: JSON.stringify(shareMessage) };
        // iframe的url过长，微信传输的时候会被截断，所以先在b端存进数据库。在c端打开的时候，再从c端读取url
        InvstmentAdviserSaver(param2);
        const redirectId = stringToHex(`${eventId}_${JSON.parse(sessionStorage.getItem('user')).id}`);
        const shareUrl = `${SHARE_URL}/tifa/index.html#/redirect/${redirectId}`;
        // 重新生成短息内容
        setMsgCnt(generateMessage(linkData.msgContent, shareUrl))
      }
    }).catch((error) => {
      message.error(error.note || error.message);
    });
  };
  const sendMessage = (sendSelf)=>{
    if(msgContent === ''){
      message.info('请填写短信内容');
    }else {
      let param = {
        chnl: '8',
        rcvr: 1,
        // md: 'D2DD1E47E3197EB0FEC32F1456230A0D',
        md: mds,
        ntfyFlg: 0,
        sbj:props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.sbj ,
        tx: msgContent,
        txHtml: '<p>正文</p>',
        senWay: singeDeal ? 1 : selectAll ? 2 : 1,
        rvwTp: 0,
        oprTp: 2,
        sendTp: 1,
        sfqx:singeDeal ? 0 : selectAll ? 1 : 0,
        khh: cusNot,
        fwlb: 7,
        presend: timing ? moment(msgDate).format('YYYY-MM-DD') + ' ' + timeHValue + ':' + timeMValue : undefined,
        id: Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id),
      }
      if(sendSelf){
        param.rcvr = 3
        param.khh = '0'
      }
      setModalLoading(true)
      SendMessage(param).then(res=>{
        if(res.code > 0){
          queryServiceRecorder(8)
          setSendMsgVisible(false);
        }
        message.info(res.note);
        setModalLoading(false)
      }).catch((error) => {
        setModalLoading(false)
        setSingeDeal(false)
        message.error(error.note || error.message);
      });
    }
  };
  const getMsgStaffList = ()=>{
    setStaffListLoading(true);
    EarnMessageStaff({
      chnl: '8',
      chnlList: '8',
      sendWay:singeDeal ? 1 : selectAll ? 2 : 1,
      rcvrTp: 1,
      sfqx:singeDeal ? 0 : selectAll ? 1 : 0,
      khh: cusNot,
      // rcvr: 'D2DD1E47E3197EB0FEC32F1456230A0D',
      rcvr: mds,
      "pageNo": 0,
      "pageSize": 5,
      "paging": 1,
      "current": staffListCurrent,
      "total": -1,
      id:Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id),
    }).then(res=>{
      setStaffList(res.records);
      setStaffListTotal(res.total);
      setStaffListLoading(false);
    }).catch((error) => {
      message.error(error.note || error.message);
    });
  };
  const queryServiceRecorder = (serviceWay)=>{
    const params = {
      custCode:msgStaff,
      title:props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.sbj,
      content:props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.cntnt,
      eventId: Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id),
      serviceWay,
      handleContent: 1,
      isAll:singeDeal ? 0 : selectAll ? 1 : 0,
    };
    QueryServiceRecorder(params).then(res=>{
      if(res.code>0){
        getData();
        props.queryCalContent();
        setSelectAll(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setSingeDeal(false);
        setCurrent(1);
        // 测试要求刷新左边列表
        props.queryBackLogList({ pagination: { current: props.current, pageSize: props.pageSize, total: -1, paging: 1 } }).then((response) => {
          const listData = response.records || [];

          if (listData.find(item => item.id === props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id) === undefined) {
            if (listData.length) {
              if (listData[0].typeId === '2') {
                props.setActiveList('task0');
              } else if (listData[0].typeId === '1') {
                props.setActiveList('event0');
                if(listData[0].id === ecifEventType){
                  props.setEventType('ecifEvent');
                }else{
                  props.setEventType('otherEvent')
                }
              } else if (listData[0].typeId === '3') {
                props.setActiveList('flow0');
              }
            }
          }else{
          //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型 
          if(listData[0].typeId === '1' &&  props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id == ecifEventType) {
              props.setEventType('ecifEvent');
            }else{
              props.setEventType('otherEvent');
           }
          }
          props.setListData(listData);
        });
      }
    })
  }
  // 替换短信模板中的链接
  const generateMessage = (msg, url) => {
    if (_.isEmpty(msg)) return '';
    return msg.replace(/\${链接}/, url);
  }
  
  // 加密
  const stringToHex = (str) => {
    const data = CryptoJS.enc.Utf8.parse(str);
    return CryptoJS.enc.Hex.stringify(data);
  };

  const msgCustCol = [{
    title: '客户姓名',
    dataIndex: 'objectName',
    key: 'objectName',
    ellipsis: true,
  },
  {
    title: '柜台手机',
    dataIndex: 'phone',
    key: 'phone',
    ellipsis: true,
  }];
  const timeH = ()=>{
    let timearr = [];
    for(let i = 0 ;i < 24;i++){
      if(i < 10){
        timearr.push('0' + i);
      }else{
        timearr.push('' + i);
      }
    }
    return timearr;
  };
  const timeM = ()=>{
    let timearr = [];
    for(let i = 0 ;i < 60;i++){
      if(i < 10){
        timearr.push('0' + i);
      }else{
        timearr.push('' + i);
      }
    }
    return timearr;
  };
  const showTime = ()=>{
    setTimeout(()=>{
      if(document.getElementById('rangePicker')){
        document.getElementById('rangePicker').getElementsByClassName('ant-calendar-picker-input')[0].value = moment(msgDate).format('YYYY-MM-DD') + ' ' + timeHValue + ':' + timeMValue;
      }
      
    });
  };
  return (
    <Spin spinning={tableLoading}>
      <div style={{ height: 52, borderBottom: '1px solid #e8e8e8', padding: '0 22px 0 16px', display: 'flex', alignItems: 'center', fontSize: 12, position: 'relative' }}>
        <div style={{ marginRight: 32 }}>
          <div>{detailType === 'task' ? '任务周期' : '事件详情'}</div>
          { detailType === 'task' && <div>{moment(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.beginTime).format('YYYY.MM.DD')}-{moment(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.endTime).format('YYYY.MM.DD')}</div> }
        </div>
        <div style={{ color: '#61698C' }}>
          <div>
            { detailType === 'task' ? (
              <>
                <span>已服务客户</span>
                <span style={{ color: '#FF6E30' }}>{summary?.rate || '-'}</span>
                <span> / 完成率</span>
                <span style={{ color: '#FF6E30' }}>{summary?.custOver || '-'}</span>
              </>
            ) :
              (props.calendar ? (
              <>
                <span>待服务客户</span>
                <span style={{ color: '#FF6E30' }}>{summary.custCount || '-'}/{summary.custAccom}</span>
                <span> / 已忽略</span>
                <span style={{ color: '#FF6E30' }}>{summary.oprUser || '-'}</span>
              </>
              ) : (
              <>
                <span>待服务客户</span>
                <span style={{ color: '#FF6E30' }}>{summary.custCount || '-'}</span>
                <span> / 今日新增</span>
                <span style={{ color: '#FF6E30' }}>{summary.newCusNum || '-'}</span>
              </>
              ))
            }
          </div>
          { detailType === 'task' ? (
            <div>
              <span>待服务客户</span>
              <span style={{ color: '#FF6E30' }}>{summary?.custCount || '-'}/{summary?.custAccom || '-'}</span>
              <span> / 已忽略客户</span>
              <span style={{ color: '#FF6E30' }}>{summary?.oprUser || '-'}</span>
            </div>
          ) : (props.calendar ? '' : (
            <div>
              <span>2天内到期</span>
              <span style={{ color: '#FF6E30' }}>{summary.custExpire || '-'}</span>
            </div>
          ))
          }
        </div>
        <div style={{ position: 'absolute', right: '22px' }}>
          { detailType === 'task' && lodash.get(props.authorities, 'backlog', []).includes('queryAllCust') &&
            <Button onClick={toAllTask} className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14 ml14 m-btn-radius ${styles.ignore}`} style={{ border: 'none', width: 72, minWidth: 72, maxWidth: 72, height: 32, margin: 0, padding: 0 }}>全部客户</Button>
          }

          <Button disabled={(!selectAll && !selectedRowKeys.length) || (detailType === 'task' && (status === '2' || status === '1')) || (props.calendar && detailType === 'event' && (eventStatus === '2' || eventStatus === '3'))} onClick={loading? '':handleIgnoreModal} className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14 ml14 m-btn-radius ${styles.ignore}`} style={{ visibility: eventType === 'otherEvent' ? 'visible' : 'hidden', border: 'none', minWidth: 108, height: 32, marginRight: 0 ,backgroundColor:detailType=== 'task'? '#F0F1F5':'#244FFF',color:detailType=== 'task'? '#1A2243':'#fff'}}>{ props.activeList.replace(/[0-9]/g, '') === 'task' ? '忽略任务' : '已通知客户' }{renderCount()}</Button>

          <Button disabled={(!selectAll && !selectedRowKeys.length) || (detailType === 'task' && status === '1') || (props.calendar && detailType === 'event' && eventStatus === '3')} className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14 ml14 ${styles.handleWidth}`} style={{ border: 'none', minWidth: 108, height: 32 }} onClick={handleMuchWidth}>批量处理{renderCount()}</Button>
        </div>
      </div>
      <Scrollbars autoHide className={styles.showCroll} style={{ height: props.height - 40 - 6, marginBottom: 40 }}>
        <div style={{ margin: '0 16px' }}>
          <div style={{ padding: '10px 0' }}>
            <div dangerouslySetInnerHTML={{ __html: props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.sbj || '-' }} title={props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.sbj || '-'} style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }} />
            <div dangerouslySetInnerHTML={{ __html: props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.cntnt || '-' }} style={{ color: '#4B516A', wordBreak: 'break-all' }} />
            {
              props.activeList.replace(/[0-9]/g, '') === 'task' && props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.strategy &&
              <div>策略：{props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.strategy || '-'}</div>
            }
          </div>
          <BasicDataTable {...tableProps} specialTotal={ eventType === 'ecifEvent' ? '' : total} specialPageSize={5} rowKey={detailType === 'task' ? 'id' : 'eventId'} rowSelection={rowSelection} columns={columns} dataSource={dataSource} className={`${styles.table}`} pagination={false} />
        </div>
      </Scrollbars>
      <div style={{ width: `calc(100% - ${props.width}px - 1px)`, height: 40, background: '#FFF', borderTop: '1px solid #e8e8e8', position: 'fixed', bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',zIndex: 99 }}>
        <div onClick={download} className={styles.hover} style={{ display: 'flex', alignItems: 'center', color: '#61698C', fontSize: 12, visibility: computed('lookAttac') }}>
          <div>
            <img style={{ width: 14, height: 14 }} src={noticeIconEnclosure} alt='' />
          </div>
          <span>查看附件</span>
        </div>
        <Pagination
          size='small'
          showLessItems
          showQuickJumper
          showSizeChanger
          className={`${styles.pagination} ${styles.smallPagination}`}
          pageSizeOptions={['20', '50', '100']}
          pageSize={pageSize}
          current={current}
          total={total}
          showTotal={()=> `总共${total}条`}
          onChange={handlePageChange}
          onShowSizeChange={(current,pageSize) => handlePageChange(1, pageSize)}
        />
      </div>
      {/* <div style={{ paddingBottom: 22 }}>
        <span style={{ paddingRight: 10 }}>客户级别</span>
        <Select
          style={{ width: '20%', color: '#1A2243' }}
          value={custRank}
          onChange={(value) => { setCustRank(value); setCurrent(1); }}
        >
          <Select.Option key='0' value='0'>全部客户</Select.Option>
          <Select.Option key='1' value='1'>V1-V4</Select.Option>
          <Select.Option key='2' value='2'>V4</Select.Option>
          <Select.Option key='3' value='3'>V5-V7(金桂卡)</Select.Option>
        </Select>
        <span style={{ padding: '0 10px 0 20px' }}>{props.activeList.replace(/[0-9]/g, '') === 'task' ? '任务状态' : '排序规则'}</span>
        <Select
          style={{ width: '20%', color: '#1A2243' }}
          value={status}
          onChange={(value) => { setStatus(value); setCurrent(1); }}
        >
          <Select.Option key='0' value='0'>{detailType === 'task' ? '待服务' : '最近更新'}</Select.Option>
          <Select.Option key='1' value='1'>{detailType === 'task' ? '已服务' : '即将过期'}</Select.Option>
          { detailType === 'task' && <Select.Option key='2' value='2'>已忽略</Select.Option> }
        </Select>
        {
          props.calendar && detailType === 'event' ? (
          <>
            <span style={{ padding: '0 10px 0 20px' }}>事件状态</span>
            <Select
              style={{ width: '20%', color: '#1A2243' }}
              value={eventStatus}
              onChange={(value) => { setEventStatus(value); setCurrent(1); }}
            >
              <Select.Option key='1' value='1'>待服务</Select.Option>
              <Select.Option key='2' value='2'>已忽略</Select.Option>
              <Select.Option key='3' value='3'>已服务</Select.Option>
            </Select>
          </>
          ) : ''
        }
      </div> */}
      <Modal
        key={`log${custNo}`}
        visible={visible}
        title='跟进日志'
        footer={null}
        onCancel={() => { setVisible(false); }}
        className={styles.followLogModal}
      >
        <FollowLog handleOk={() => { setVisible(false); }} custNo={custNo} custId={custId} />
      </Modal>
      <Modal
        key={`relevanceEvent${eventRecord.eventId}`}
        visible={eventVisible}
        title={<div style={{ fontSize: 14, display: 'flex', alignItems: 'center', color: '#1A2243' }}>
          <span style={{ fontSize: 18, marginRight: 13 }}>客户关联事件</span>
          <span>{eventRecord.cusLvl}&nbsp; </span>
          <span className={styles.hover} onClick={() => window.open(`${window.location.href.substring(0, window.location.href.indexOf('#') + 1)}/customerPanorama/customerInfo?customerCode=${eventRecord.cusNo}`)}>{eventRecord.cusNum}({eventRecord.cusNo})</span>
          <span style={{ display: 'flex', alignItems: 'center', marginLeft: 5 }}><img src={arrow_right} alt='' /></span>
        </div>}
        footer={null}
        onCancel={() => { setEventVisible(false); }}
        width={document.body.clientWidth > 1300 ? 1200 : document.body.clientWidth - 100}
        bodyStyle={{ padding: 0 }}
        centered
      >
        <CustomerRelatedEvents handleOk={() => { setEventVisible(false); }} cusNo={eventRecord.cusNo} />
      </Modal>
      <Modal
        key={`ecfiEvent${eventRecord.motId}`}
        visible={ecifEventVisible}
        title={<div style={{ fontSize: 14, display: 'flex', alignItems: 'center', color: '#1A2243' }}>
          <span style={{ fontSize: 18, marginRight: 13 }}>客户关联事件</span>
          <span>{eventRecord.cusLvl}&nbsp; </span>
          <span className={styles.hover} onClick={() => window.open(`${window.location.href.substring(0, window.location.href.indexOf('#') + 1)}/customerPanorama/customerInfo?customerCode=${eventRecord.custCode}`)}>{eventRecord.eventNum}({eventRecord.custCode})</span>
          <span style={{ display: 'flex', alignItems: 'center', marginLeft: 5 }}><img src={arrow_right} alt='' /></span>
        </div>}
        footer={null}
        onCancel={() => { setEcifEventVisible(false); }}
        width={document.body.clientWidth > 1300 ? 1200 : document.body.clientWidth - 100}
        bodyStyle={{ padding: 0 }}
        centered
      >
        <EcifRelatedEvents ecifEventType={ecifEventType} custCode={eventRecord.custCode} motId={eventRecord.motId} />
      </Modal>

      <Modal
        visible={ignoreModal}
        title='温馨提示'
        footer={null}
        onCancel={() => { setIgnoreModal(false); }}
      >
        <p style={{ marginBottom: 24 }}>忽略之后，将不再在待办中提示，可以在【工作】-【日历模式】查询历史，确定忽略选中的客户吗？</p>
        <div style={{ textAlign: 'right' }}>
          <Spin spinning={loading}>
            <Button className="m-btn-radius ax-btn-small" onClick={() => { setIgnoreModal(false); }}>取消</Button>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={handleIgnore}>确定</Button>
          </Spin>
        </div>
      </Modal>
      <Modal
        className={styles.modal}
        visible={handleWidthTaskVisible}
        footer={null}
        onCancel={() => { setHandleWidthTaskVisible(false); }}
        width='50%'
      >
        <C4Iframe src={c4Url} />
        {/* <iframe id='c4Iframe' src={c4Url} title='c4' width='100%' height='700px' /> */}
      </Modal>
      <Modal
        className={styles.eventModal}
        visible={listVisible}
        footer={null}
        title = '批量处理'
        onCancel={() => { setListVisible(false);setSingeDeal(false); }}
        width='614px'
        destroyOnClose
        maskClosable={false}
      >
        <div className={styles.form}>
          {
            eventList?.formTitleList?.map(item=>{
              if(item.type === '1'){
                if(item?.radioList?.length === 2){
                  return (
                    <div className={styles.formItem} key={item.titleId}>
                      <div className={styles.label}>{item.titleName}</div>
                      <div className={styles.item}>
                        {
                          item?.radioList?.map(item1=> (
                            <Checkbox style={{ marginRight: 16 }} value={item1.radioId} checked={item1.radioId === listValue[item.titleId]} onClick={()=>{
                              setListValue({ ...listValue,[item.titleId]: item1.radioId });
                            }}>{item1.radioName}</Checkbox>
                          ))
                        }
                      </div>
                    </div>
                  );
                }else{
                  return (
                    <div className={styles.formItem} key={item.titleId}>
                      <div className={styles.label}>{item.titleName}</div>
                      <div className={styles.item}><Select style={{ width: 320 }} value={listValue[item.titleId]} onChange={(value)=>{
                        setListValue({ ...listValue,[item.titleId]: value });
                      }}>
                        {
                          item?.radioList?.map(item1=>{
                            return <Select.Option key={item1.radioId} title={item1.raiodName} value={item1.radioId}>{item1.radioName}</Select.Option>;
                          })
                        }
                      </Select></div>
                    </div>
                  );
                }
              }
              // else if(item.type === '2'){
              //   return (
              //     <div className={styles.formItem} key={item.titleId}>
              //       <div className={styles.label}>{item.titleName}</div>
              //       <div className={styles.item}><Select style={{ width: 320 }}>
              //         <Select.Option key='1'>1</Select.Option>
              //         <Select.Option key='2'>2</Select.Option>
              //         <Select.Option key='3'>3</Select.Option>
              //       </Select></div>
              //     </div>
              //   );
              // }
              else if(item.type === '3'){
                return (
                  <div className={styles.TextArea} key={item.titleId}>
                    <div className={styles.label}>{item.titleName}</div>
                    <div className={styles.item}><TextArea style={{ width: 350,resize: 'vertical' }} maxLength={150} autoSize={{ minRows: 3, maxRows: 10 }} value={listValue[item.titleId]} onChange={(e)=>{
                      setListValue({ ...listValue,[item.titleId]: e.target.value });
                    }}/></div>
                  </div>
                );
              }
              else if(item.type === '4'){
                return (
                  <div className={styles.formItem} key={item.titleId}>
                    <div className={styles.label}>{item.titleName}</div>
                    <div className={styles.item}><TextArea style={{ width: 350 }} maxLength={150} autoSize={{ minRows: 1, maxRows: 1 }} value={listValue[item.titleId]} onChange={(e)=>{
                      setListValue({ ...listValue,[item.titleId]: e.target.value });
                    }}/></div>
                  </div>
                );
              }
            })
          }
        </div>
        <div className={styles.submit}>
          <Button className='m-btn ant-btn mr20' style={{ width: 70, height: '42px', borderRadius: '1px' ,fontSize: 14 }} onClick={()=>{setListVisible(false);setSingeDeal(false)}}>取消</Button>
          <Button htmlType='submit' className='m-btn ant-btn m-btn-blue' style={{ width: 70, height: '42px', borderRadius: '1px' ,fontSize: 14 }} onClick={()=>{if(!modalLoading)recorderEventContext();}}>确定</Button>
        </div>
      </Modal>
      <Modal
        className={styles.msgModal}
        visible={sendMsgVisible}
        destroyOnClose
        maskClosable={false}
        footer={<div style={{ display: 'flex',alignItems: 'center' }}>
          <div style={{ flex: 1 }}></div>
          <div className={styles.msgCheck}><Checkbox checked={timing} onChange={(e)=>setTiming(e.target.checked)}>定时发送</Checkbox></div>
          {
            timing && (
              <div onClick={(e) => { if (!dateOpen) { setDateOpen(!dateOpen); }; e.stopPropagation(); }} id='rangePicker' style={{ position: 'relative' }}>
                {/* <div className={styles.timeInput} style={{ borderColor: dateOpen ? '#244FFF' : '#D1D5E6' }}>{moment(msgDate).format('YYYY-MM-DD')}</div> */}
                <DatePicker
                  allowClear={false}
                  open={true}
                  style={{ width: '250px' }}
                  popupStyle={{ display: dateOpen ? 'block' : 'none', zIndex: dateOpen ? 9 : -1 }}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                  placeholder='请选择'
                  format="YYYY-MM-DD"
                  getCalendarContainer={(trigger) => trigger.parentNode}
                  onChange={msgDate => {
                    setMsgDate(msgDate);
                  }}
                  showToday={false}
                />
                {dateOpen && (
                  <div className={styles.calendarBox}>
                    <div style={{ height: 41 ,borderBottom: '1px solid #EAEEF2',borderLeft: '1px solid #EAEEF2',display: 'flex',alignItems: 'center',justifyContent: 'center' }}>{`${moment(msgDate).format('YYYY-MM-DD')} ${timeHValue}:${timeMValue}`}</div>
                    <div style={{ display: 'flex',height: 256 }}>
                      <div style={{ overflow: 'auto',flex: 1 ,borderLeft: '1px solid #EAEEF2' }}>
                        <Scrollbars autoHide height='256'>
                          {
                            timeH().map(item=>
                              <div className={styles.timeItem} key={item} onClick={()=>{setTimeHValue(item);}} style={{ background: timeHValue === item ? '#F0F1F5' : '' }}>{item}</div>
                            )
                          }
                        </Scrollbars>
                      </div>
                      <div style={{ overflow: 'auto',flex: 1 ,borderLeft: '1px solid #EAEEF2' }}>
                        <Scrollbars autoHide height='256'>
                          {
                            timeM().map(item=>
                              <div className={styles.timeItem} key={item} onClick={()=>{setTimeMValue(item);}} style={{ background: timeMValue === item ? '#F0F1F5' : '' }}>{item}</div>
                            )
                          }
                        </Scrollbars>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }
         
          <div className={styles.sendBtn} style={{ border: '1px solid #D1D5E6',padding: '5px 16px',marginRight: 8,cursor: 'pointer',color: '#61698C',marginLeft: 8 }} onClick={()=>{
            setSendMsgVisible(false);setSingeDeal(false);
          }}>关闭</div>
          <div className={styles.sendBtn} style={{ border: '1px solid #D1D5E6',padding: '5px 16px' ,marginRight: 8,cursor: 'pointer',color: '#61698C' }} onClick={()=>{if(!modalLoading)sendMessage(true)}}>测试发送给自己</div>
          <div style={{ border: '1px solid #244FFF',padding: '5px 16px',background: '#244FFF',color: '#FFF' ,cursor: 'pointer' }} onClick={()=>{if(!modalLoading)sendMessage()}}>发送</div>
        </div>}
        title = '发送短信'
        onCancel={() => { setSendMsgVisible(false);setSingeDeal(false); }}
        width='960px'>
        <div style={{ display: 'flex',background: '#F2F3F7',padding: 16 }}>
          <div style={{ padding: 16 ,marginRight: 16 ,background: '#FFF',width: 305 }}>
            <div style={{ color: '#1A2243',fontSize: 16 ,marginBottom: 13 }}>客户名单</div>
            <Table columns={msgCustCol} dataSource={staffList} size="middle" bordered rowKey='objectId' loading={staffListLoading} pagination={
              { pageSize:5,current: staffListCurrent,total: staffListTotal ,onChange: (current,pageSize)=>{setStaffListCurrent(current);} }
            }></Table>
          </div>
          <div style={{ padding: 16 ,marginRight: 16 ,background: '#FFF' ,flex: 1 }}>
            <div style={{ color: '#1A2243',fontSize: 16 ,marginBottom: 13 }}>短信内容</div>
            <div className={styles.form}>
              <div className={styles.formItem} style={{ marginBottom: 17 }}>
                <div className={styles.label}>使用链接模板</div>
                <div style={{ color: '#244FFF' }}>
                  <Switch onChange={()=>{setSwitchKey(!switchKey);}} checked={switchKey} style={{ marginRight: 8 ,marginTop:-2}}/>{switchKey && <span onClick={()=>{
                    window.open(msgLink)
                  }} style={{cursor:'pointer'}}>预览链接</span>}
                </div>
              </div>
              <div className={styles.TextArea} style={{ marginBottom: 17 }}>
                <div className={styles.label}>正文</div>
                <div className={styles.item} style={{ position: 'relative' }}><TextArea style={{ width: 466,resize: 'vertical' }} autoSize={{ minRows: 6, maxRows: 10 }} onChange={(e)=>{
                  setMsgContent( e.target.value );}} value={msgContent} maxLength={150}/>
                <div style={{ position: 'absolute',bottom: 2,right: 7,fontSize: 12,color: '#959CBA' }}>{msgContent.length}/已输入</div></div>
              </div>
              <div style={{ border: '1px solid #99CEFF',background: '#EBF5FF',borderRadius: 2 ,padding: 16,color: '#1A2243',marginLeft: 95 }}>
                <div style={{ fontSize: 16,fontWeight: 'bold' ,marginBottom: 8 }}><img src={tipsImg} alt='' style={{ width: 22,marginRight: 8,marginTop: -3 }}></img>提示信息</div>
                <div style={{ marginLeft: 30 }}>
                  <p>本月发送短信限制<span style={{ color: '#58AFFF' }}>{messageQuota.bype}</span>条， 还可发送<span style={{ color: '#58AFFF' }}>{messageQuota.bycxsype}</span>条</p>
                  <p>每次最多<span style={{ color: '#58AFFF' }}>{messageQuota.mcsl}</span>条， 最大允许字数：150字</p>
                  <p>{'如使用模板，模板中的$V{KHXM}会自动替换为客户姓名'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Spin>
  );
}

export default connect(({ global }) => ({
  authorities: global.authorities,
  // dictionary: global.dictionary,
  sysParam: global.sysParam,
  // theme: global.theme,
}))(DataTable);