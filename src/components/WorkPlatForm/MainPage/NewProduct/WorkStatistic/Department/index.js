import React ,{ useEffect,useState }from 'react';
import { Divider ,Button ,DatePicker ,Checkbox ,message ,TreeSelect ,Popover ,Tag ,Icon } from 'antd';
import BasicDataTable from '$common/BasicDataTable';
import TreeUtils from '$utils/treeUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import { GetEventFinishStatResponse ,GetWorkStatResponse,GetEventPushStatResponse ,GetDepartmentStatDetailResponse ,GetStaffStatDetailResponse,GetWorkStatDetailResponse ,GetMotTypeResponse ,GetHeadOfficeResponse,GetStaffDetailResponse } from '$services/newProduct';
import SingleSelect from '../singleSelect';
import event1 from '$assets/newProduct/workStatistic/event5.png';
import event2 from '$assets/newProduct/workStatistic/event6.png';
import event3 from '$assets/newProduct/workStatistic/event7.png';
import event4 from '$assets/newProduct/workStatistic/event8.png';
import styles from '../index.less';
import moment from 'moment';
import * as echarts from 'echarts';
import ReactDOMServer from 'react-dom/server';
import PieChart from '../pieChart';
import Export from '../export';

export default function Index(props) {
  const [pieData,setPieData] = useState([]);
  const [lineData,setLineData] = useState([]);
  const [eventStatistic,setEventStatistic] = useState({});
  const [eventType,setEventType] = useState(undefined);
  const [eventTypeData,setEventTypeData] = useState([]);
  const [dataSource,setDataSource] = useState([]);
  const [tableCol,setTableCol] = useState([]);
  const [total,setTotal] = useState(0);
  const [pageSize,setPageSize] = useState(10);
  const [current,setCurrent] = useState(1);
  const [loading,setLoading] = useState(false);
  const [range,setRange] = useState('3');
  const [tableType,setTableType] = useState('3');
  const [tjDateType,setTjDateType] = useState(1);
  const [tjDate,setTjDate] = useState([moment().startOf('year'), moment()]);
  const [mode,setMode] = useState(['month', 'month']);
  const [dept,setDept] = useState([]);
  const [allYyb,setAllYyb] = useState([]);
  const [departments,setDepartments] = useState([]);
  const [deptSearch,setDeptSearch] = useState('');
  const [deptValue,setDeptValue] = useState([]);
  const [visible,setVisible] = useState(false);
  const [userInfo,setUserInfo] = useState({});
  const [currentType,setCurrentType] = useState([]);
  const [addableType,setAddableType] = useState([]);
  const [exportParam,setExportParam] = useState({});
  const [exportType,setExportType] = useState('workStatistic');
  useEffect(()=>{
    getDepartments();
    getMotTypeResponse();
    getHeadOfficeResponse();
    // getDepartmentStatDetailResponse();
    // getStaffStatDetailResponse();
    // getWorkStatDetailResponse();
  },[]);
  useEffect(()=>{
    getEventFinishStatResponse();
    getWorkStatResponse();
  },[props.tjDate,props.tjDateType]);

  useEffect(()=>{
    eventType && getEventPushStatResponse();
  },[props.tjDate,props.tjDateType,eventType]);

  useEffect(()=>{
    fetchData();
  },[pageSize,current]);
  useEffect(()=>{
    initLineChart();
  },[lineData]);
  useEffect(()=>{
    if(tableType === '4'){
      getStaffDetailResponse();
    }
  },[currentType]);

  //事件统计
  const getEventFinishStatResponse = ()=>{
    GetEventFinishStatResponse({
      // "userId": `${JSON.parse(sessionStorage.user).id}` * 1,
      "dateStart": props.tjDateType === 2 ? props.tjDate[0].format('YYYYMMDD') : moment(props.tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": props.tjDateType === 2 ? props.tjDate[1].format('YYYYMMDD') : moment(props.tjDate[1]).endOf('month').format("YYYYMMDD"),
      "statFlag": 2,
    }).then(res=>{
      setEventStatistic(res.records[0] || {});
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };
  //工作统计饼图
  const getWorkStatResponse = ()=>{
    GetWorkStatResponse({
      // "userId": `${JSON.parse(sessionStorage.user).id}` * 1,
      "dateStart": props.tjDateType === 2 ? props.tjDate[0].format('YYYYMMDD') : moment(props.tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": props.tjDateType === 2 ? props.tjDate[1].format('YYYYMMDD') : moment(props.tjDate[1]).endOf('month').format("YYYYMMDD"),
      "statFlag": 2,
    }).then(res=>{
      let data = res.records[0] || {},obj1 = { name: 'workflow' ,label: '流程',key: 5 },obj2 = { name: 'task' ,label: '任务',key: 6 },obj3 = { name: 'event' ,label: '事件',key: 7 },obj4 = { name: 'message',label: '消息',key: 8 };
      Object.keys(data).forEach(item=>{
        if(item.includes('workflow')){
          obj1 = { ...obj1,[item]: data[item] };
        }else if(item.includes('task')){
          obj2 = { ...obj2,[item]: data[item] };
        }else if(item.includes('event')){
          obj3 = { ...obj3,[item]: data[item] };
        }else if(item.includes('message')){
          obj4 = { ...obj4,[item]: data[item] };
        }
      });
      setPieData([obj1,obj2,obj3,obj4]);
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };

  //事件推送折线图
  const getEventPushStatResponse = ()=>{
    GetEventPushStatResponse({
      // "userId":null,
      "motType": eventType,
      "dateStart": props.tjDateType === 2 ? props.tjDate[0].format('YYYYMMDD') : moment(props.tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": props.tjDateType === 2 ? props.tjDate[1].format('YYYYMMDD') : moment(props.tjDate[1]).endOf('month').format("YYYYMMDD"),
      "dateFlag": props.tjDateType,
    }).then(res=>{
      setLineData(res.records || []);
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };

  //分支机构报表
  const getDepartmentStatDetailResponse = ()=>{
    GetDepartmentStatDetailResponse({
      "department": dept.join(','),
      // "department": '3107',
      "dateStart": tjDateType === 2 ? tjDate[0].format('YYYYMMDD') : moment(tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": tjDateType === 2 ? tjDate[1].format('YYYYMMDD') : moment(tjDate[1]).endOf('month').format("YYYYMMDD"),
      "pageNo": current,
      "pageSize": pageSize,
    }).then(res=>{
      setDataSource(res.records || []);
      setTotal(res.total);
      setLoading(false);
      setExportParam({
        // "userId":null,
        "department": dept.join(','),
        // "department": '3107',
        "dateStart": tjDateType === 2 ? tjDate[0].format('YYYYMMDD') : moment(tjDate[0]).startOf('month').format("YYYYMMDD"),
        "dateEnd": tjDateType === 2 ? tjDate[1].format('YYYYMMDD') : moment(tjDate[1]).endOf('month').format("YYYYMMDD"),
        "pageNo": 0,
        "pageSize": 0,
      });
      setExportType('deptStatistic');
      setTableType(range);
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };
  //员工统计
  const getStaffStatDetailResponse = ()=>{
    GetStaffStatDetailResponse({
      "department": dept.join(','),
      // "department": '3107',
      "dateStart": tjDateType === 2 ? tjDate[0].format('YYYYMMDD') : moment(tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": tjDateType === 2 ? tjDate[1].format('YYYYMMDD') : moment(tjDate[1]).endOf('month').format("YYYYMMDD"),
      "pageNo": current,
      "pageSize": pageSize,
    }).then(res=>{
      setDataSource(res.records || []);
      setTotal(res.total);
      setLoading(false);
      setExportParam({
        // "userId":null,
        "department": dept.join(','),
        // "department": '3107',
        "dateStart": tjDateType === 2 ? tjDate[0].format('YYYYMMDD') : moment(tjDate[0]).startOf('month').format("YYYYMMDD"),
        "dateEnd": tjDateType === 2 ? tjDate[1].format('YYYYMMDD') : moment(tjDate[1]).endOf('month').format("YYYYMMDD"),
        "pageNo": 0,
        "pageSize": 0,
      });
      setExportType('staffStatistic');
      setTableType(range);
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };
  //工作类型
  const getWorkStatDetailResponse = ()=>{
    GetWorkStatDetailResponse({
      "department": dept.join(','),
      // "department": '3107',
      "dateStart": tjDateType === 2 ? tjDate[0].format('YYYYMMDD') : moment(tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": tjDateType === 2 ? tjDate[1].format('YYYYMMDD') : moment(tjDate[1]).endOf('month').format("YYYYMMDD"),
      "pageNo": current,
      "pageSize": pageSize,
    }).then(res=>{
      setDataSource(res.records || []);
      setTotal(res.total);
      setLoading(false);
      setExportParam({
        // "userId":null,
        "department": dept.join(','),
        // "department": '3107',
        "dateStart": tjDateType === 2 ? tjDate[0].format('YYYYMMDD') : moment(tjDate[0]).startOf('month').format("YYYYMMDD"),
        "dateEnd": tjDateType === 2 ? tjDate[1].format('YYYYMMDD') : moment(tjDate[1]).endOf('month').format("YYYYMMDD"),
        "pageNo": 0,
        "pageSize": 0,
      });
      setExportType('workStatistic');
      setTableType(range);
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };
  //员工明细
  const getStaffDetailResponse = ()=>{
    setLoading(true);
    GetStaffDetailResponse({
      "department": dept.join(','),
      // "department": '3107',
      "dateStart": tjDateType === 2 ? tjDate[0].format('YYYYMMDD') : moment(tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": tjDateType === 2 ? tjDate[1].format('YYYYMMDD') : moment(tjDate[1]).endOf('month').format("YYYYMMDD"),
      "motTypeList": currentType.map(item=>item.motTypeName).join(','),
      "pageNo": current,
      "pageSize": pageSize,
    }).then(res=>{
      const data = JSON.parse(res.result);
      setDataSource(data || []);
      setTableCol(Object.keys(data[0] || {}));
      setTotal(res.total);
      setLoading(false);
      setExportParam({
        // "userId":null,
        "department": dept.join(','),
        // "department": '3107',
        "dateStart": tjDateType === 2 ? tjDate[0].format('YYYYMMDD') : moment(tjDate[0]).startOf('month').format("YYYYMMDD"),
        "dateEnd": tjDateType === 2 ? tjDate[1].format('YYYYMMDD') : moment(tjDate[1]).endOf('month').format("YYYYMMDD"),
        "motTypeList": currentType.map(item=>item.motTypeName).join(','),
        "pageNo": 0,
        "pageSize": 0,
      });
      setExportType('staffDetail');
      setTableType(range);
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };
  const getMotTypeResponse = ()=>{
    GetMotTypeResponse().then(res=>{
      const { records = [] } = res;
      setEventTypeData(records);
      setEventType(records[0].motTypeId || undefined);
      setCurrentType(records.filter(item=>item.motTypeLevel === '重要'));
      setAddableType(records.filter(item=>item.motTypeLevel !== '重要'));
    });
  };
  const getHeadOfficeResponse = ()=>{
    GetHeadOfficeResponse().then(res=>{
      setUserInfo(res.records[0] || {});
    });
  };

  const fetchData = ()=>{
    setLoading(true);
    if(range === '1'){
      getDepartmentStatDetailResponse();
    }else if(range === '2'){
      getStaffStatDetailResponse();
    }else if(range === '3'){
      getWorkStatDetailResponse();
    }else if(range === '4'){
      getStaffDetailResponse();
    }
  };
  const reset = ()=>{
    setRange('3');
    setTjDate([moment().startOf('year'), moment()]);
    setMode(['month','month']);
    setTjDateType(1);
    setDeptSearch('');
    setDept([]);
    setDeptValue([]);
  };
 
  const deleteType = (id)=>{
    setAddableType([...addableType,currentType.find(item=>item.motTypeId === id)]);
    setCurrentType(currentType.filter(item=>item.motTypeId !== id));
  };
  const addType = (id)=>{
    setCurrentType([...currentType,addableType.find(item=>item.motTypeId === id)]);
    setAddableType(addableType.filter(item=>item.motTypeId !== id));
  };
  const getColumns = ()=>{
    let columns = [];
    if(tableType === '1'){
      //分支机构
      columns = [
        {
          title: '分支机构',
          dataIndex: 'department',
        },
        {
          title: '已完成流程',
          dataIndex: 'workflowFinishAmount',
        },
        {
          title: '流程总数',
          dataIndex: 'workflowAmount',
        },
        {
          title: '流程完成率',
          dataIndex: 'workflowRate',
        },
        {
          title: '已完成事件',
          dataIndex: 'eventFinishAmount',
        },
        {
          title: '事件总数',
          dataIndex: 'eventAmount',
        },
        {
          title: '事件完成率',
          dataIndex: 'eventFinishRate',
        },
        {
          title: '事件线上处理',
          dataIndex: 'eventHandlerOnline',
        },
        {
          title: '客户查看事件',
          dataIndex: 'eventCustomerViewed',
        },
        {
          title: '事件触达率',
          dataIndex: 'eventHandlerOnlineRate',
        },
      ];
    }else if(tableType === '2'){
      //员工统计
      columns = [
        {
          title: '员工',
          dataIndex: 'staffName',
        },
        {
          title: '已完成流程',
          dataIndex: 'workflowFinishAmount',
        },
        {
          title: '流程总数',
          dataIndex: 'workflowAmount',
        },
        {
          title: '流程完成率',
          dataIndex: 'workflowRate',
        },
        {
          title: '已完成事件',
          dataIndex: 'eventFinishAmount',
        },
        {
          title: '事件总数',
          dataIndex: 'eventAmount',
        },
        {
          title: '事件完成率',
          dataIndex: 'eventFinishRate',
        },
        {
          title: '事件线上处理',
          dataIndex: 'eventHandlerOnline',
        },
        {
          title: '客户查看事件',
          dataIndex: 'eventCustomerViewed',
        },
        {
          title: '事件触达率',
          dataIndex: 'eventHandlerOnlineRate',
        },
        {
          title: '超期未完成',
          dataIndex: 'eventExpiredRate',
        },
      ];
    }else if(tableType === '3'){
      //工作统计
      columns = [
        {
          title: '工作类型',
          dataIndex: 'type',
        },
        {
          title: '总数',
          dataIndex: 'totalAmount',
        },
        {
          title: '完成数',
          dataIndex: 'finishAmount',
        },
        {
          title: '完成率',
          dataIndex: 'finishRate',
        },
        {
          title: '线上处理',
          dataIndex: 'onlineAmount',
        },
        {
          title: '客户查看',
          dataIndex: 'viewAmount',
        },
        {
          title: '触达率',
          dataIndex: 'onlineRate',
        },
      ];
    }else if(tableType === '4'){
      //动态标签 员工明细
      columns = tableCol.map(item=>{return { title: item,dataIndex: item,width: 120 ,render: (text)=>{ return text && (item === '员工/完成率' ? text :(text=='0'||text=='0.00'?'--': text + '%'));} };});
    }
    return columns;
  };
  const handleTjDateType = (tjDateType) => {
    setTjDateType(tjDateType);
    if (tjDateType === 1) {
      setMode(['month', 'month']);
    } else {
      setMode(['date', 'date']);
    }
  };
  const handlePanelChange = (tjDate, mode) => {
    setTjDate(tjDate.sort((a, b) => a.format('YYYYMMDD') - b.format('YYYYMMDD')));
    if (tjDateType === 2) {
      setMode([mode[0], mode[1]]);
    } else {
      setMode([mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]);
    }
  };
  //资产趋势图
  const initLineChart = () => {
    let date = lineData.map(item=>item.date);
    let totalData = lineData.map(item=>item.totalAmount);
    let maxData = lineData.map(item=>item.maxAmount);
    let option = {
      title: {
        // text: '资产趋势',
        subtext: '单位 (条)',
        textStyle: {
          fontSize: 14,
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: 400,
        },
        subtextStyle: {
          fontSize: 12,
          color: 'rgba(0, 0, 0, 0.45)',
        },
      },
      color: ['#0F8AFF', '#FFA257'],
      legend: {
        top: 10,
        left: 'center',
        icon: 'circle',
        itemWidth: 8,
        itemGap: 32,
        textStyle: {
          fontSize: 12,
          color: ' #1A2243',
        },
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        extraCssText: 'box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);',
        padding: 0,
        formatter: (params) => {
          const jsx = (
            <>
              <div style={{ padding: '12px', background: '#FFF', color: '#1A2243', borderRadius: 2 }}>
                <div style={{ fontWeight: 500, marginBottom: 12 }}>{params[0].axisValue}</div>
                {params.map((item, index) => (
                  <div key={index} style={{ marginBottom: index === params.length - 1 ? 0 : 8 }}>
                    <span style={{ background: item.color, width: 8, height: 8, marginRight: 6, display: 'inline-block', borderRadius: '50%' }}></span>
                    <span>{item.seriesName}：{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: '#BFBFBF',
          },
        },
        data: date,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          interval: 'auto',
          // formatter: '{value}%',
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#EBECF2',
          },
        },
      },
      series: [
        {
          name: '推送总数',
          type: 'line',
          data: totalData,
          symbol: 'circle',
          symbolSize: totalData.length !== 1 ? 1 : 4,
          lineStyle: {
            width: 1.5,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: 'rgba(15, 138, 255, 0)',
              },
              {
                offset: 1,
                color: 'rgba(15, 138, 255, 0.06)',
              },
            ]),
          },
        },
        {
          name: '单员工推送峰值',
          type: 'line',
          data: maxData,
          symbol: 'circle',
          symbolSize: maxData.length !== 1 ? 1 : 4,
          lineStyle: {
            width: 1.5,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: 'rgba(255,162,87,0)',
              },
              {
                offset: 1,
                color: 'rgba(255,162,87,0.06)',
              },
            ]),
          },
        },
      ],
    };
    let myChart = echarts.init(document.getElementById('lineChart'), null, { devicePixelRatio: 2 });
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  // 获取管辖营业部的数据
  const getDepartments = () => {
    fetchUserAuthorityDepartment().then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments = [];
      datas.forEach((item) => {
        const { children } = item;
        departments.push(...children);
      });
      setAllYyb(records);
      setDepartments(departments);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  const maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  };
  // 格式化treeSelectValue
  const formatValue = () => {
    return dept.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val)?.yybmc }));
  };
  
  const filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const util = (fid, title) => {
      if (fid === '0') return false;
      for (let item of allYyb) {
        if (item.yybid === fid) {
          if (item.yybmc.indexOf(inputValue) > -1) {
            return true;
          } else {
            util(item.fid);
          }
          break;
        }
      }
    };
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    } else {
      return util(treeNode.props.fid, treeNode.props.title);
    }
  };
  // 选中营业部变化
  const handleYybChange = (value, label, extra) => {
    let deptemp = dept;
    if (value.length) {
      const array = [];
      array.push(extra.triggerValue);
      getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (deptemp.indexOf(item) === -1) deptemp.push(item);
        });
      } else {
        array.forEach(item => {
          if (deptemp.indexOf(item) > -1) deptemp.splice(deptemp.indexOf(item), 1);
        });
      }
    } else {
      deptemp = [];
    }
    setDeptSearch(deptSearch);
    setDept(deptemp);
    setDeptValue(deptemp.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val)?.yybmc })));
  };
  
  // 获取父节点下的所有子节点key
  const getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        getCheckedKeys(item.props.children, array);
      }
    });
  };
  // 搜索营业部变化
  const handleYybSearch = (value) => {
    setDeptSearch(value);
  };
  const tableProps = {
    loading,
    bordered: true,
    scroll: { x: true },
    rowKey: 'key',
    dataSource: dataSource.map((item, index) => {
      return { ...item,key: ((current - 1) * pageSize) + index + 1 };
    }),
    columns: getColumns(),
    className: `m-Card-Table ${styles.table}`,
    pagination: {
      className: `m-bss-paging ${styles.pagination}`,
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
        setCurrent(current);
        setPageSize(pageSize);
      },
      onShowSizeChange: (current, pageSize) => {
        setCurrent(current);
        setPageSize(pageSize);
      },
    },
  };
  
  return (
    <React.Fragment>
      <div className={styles.deptChart}>
        <div className={styles.pieChart}>
          {
            pieData.map(item=><PieChart item={item} key={item.key}/>)
          }
        </div>
        <Divider/>
        <div className={styles.event}>
          <div className={styles.eventChart}>
            <div className={styles.title}>事件统计</div>
            <div className={styles.content}>
              <div style={{ background: `url(${event1}) center center / cover no-repeat`,height: 60,width: 588 }}>事件数: {eventStatistic.eventAmount}</div>
              <div style={{ background: `url(${event2}) center center / cover no-repeat`,height: 60,width: 508 }}>已处理: {eventStatistic.handleEventAmount}  {eventStatistic.handleEventRate}%</div>
              <div style={{ background: `url(${event3}) center center / cover no-repeat`,height: 60,width: 428 }}>线上触达: {eventStatistic.touchEventAmount}  {eventStatistic.touchEventRate}%</div>
              <div style={{ background: `url(${event4}) center center / cover no-repeat`,height: 60,width: 348 }}>客户查看: {eventStatistic.viewedEventAmount}  {eventStatistic.viewedEventRate}%</div>
            </div>
          </div>
          <Divider type='vertical' style={{ height: 390 ,margin: '0 24px 0 0' }}/>
          <div className={styles.lineChart}>
            <div className={styles.header}>
              <div className={styles.title}>事件推送</div>  
              <div className={styles.searchItem}>
                <span className={styles.label}>事件类型</span>
                <SingleSelect setValue={setEventType} value={eventType} data={eventTypeData.map(item=>{return { name: item.motTypeName,value: item.motTypeId };})}/>
              </div>
            </div>
            <div id='lineChart' style={{ height: 358 }}></div>
          </div>
        </div>
      </div>
      <div style={{ background: '#F3F4F7',height: 8 }}></div>
      <div className={styles.deptTable}>
        <div className={styles.header}>统计明细</div>
        <Divider style={{ margin: 0 ,marginBottom: 20 }}/>
        <div className={styles.searchContent}>
          <div className={styles.searchItem}>
            <span className={styles.label} >统计维度</span>
            <div className={styles.item}>
              {
                userInfo.headOffice === '否' ? (
                <>
                  <Button className={`${styles.button} ${range === '2' ? styles.activeBtn : ''}`} onClick={()=>setRange('2')}>员工统计</Button>
                  <Button className={`${styles.button} ${range === '3' ? styles.activeBtn : ''}`} onClick={()=>setRange('3')}>工作</Button>
                  <Button className={`${styles.button} ${range === '4' ? styles.activeBtn : ''}`} onClick={()=>setRange('4')}>员工明细</Button>
                  {/* <Checkbox value='2' onChange={(e)=>setRange(e.target.value)} checked={range === '2'}>员工统计</Checkbox>
                  <Checkbox value='3' onChange={(e)=>setRange(e.target.value)} checked={range === '3'}>工作</Checkbox>
                  <Checkbox value='4' onChange={(e)=>setRange(e.target.value)} checked={range === '4'}>员工明细</Checkbox> */}
                </>
                ) : (
                <>
                  <Button className={`${styles.button} ${range === '1' ? styles.activeBtn : ''}`} onClick={()=>setRange('1')}>分支机构</Button>
                  <Button className={`${styles.button} ${range === '3' ? styles.activeBtn : ''}`} onClick={()=>setRange('3')}>工作</Button>
                  {/* <Checkbox value='1' onChange={(e)=>setRange(e.target.value)} checked={range === '1'}>分支机构</Checkbox>
                  <Checkbox value='3' onChange={(e)=>setRange(e.target.value)} checked={range === '3'}>工作</Checkbox> */}
                </>
                )
              }
              
            </div>
          </div>
          <div className={styles.searchItem}>
            <span className={styles.label}>统计时间</span>
            <Button className={`${styles.button} ${tjDateType === 1 ? styles.activeBtn : ''}`} onClick={()=>handleTjDateType(1)}>按月</Button>
            <Button className={`${styles.button} ${tjDateType === 2 ? styles.activeBtn : ''}`} onClick={()=>handleTjDateType(2)}>按日</Button>
            <DatePicker.RangePicker
              mode={mode}
              allowClear={false}
              value={tjDate}
              className={styles.rangePicker}
              dropdownClassName={`${styles.calendar} m-bss-range-picker`}
              style={{ width: '264px' }}
              placeholder={['开始日期', '结束日期']}
              format={tjDateType === 1 ? "YYYY-MM" : "YYYY-MM-DD"}
              separator='至'
              disabledDate={(current) => current && current > moment().endOf('day')}
              // getCalendarContainer={(trigger) => trigger.parentNode}
              onChange={tjDate=>setTjDate(tjDate)}
              onPanelChange={handlePanelChange}
            />
          </div>
          <div className={styles.searchItem}>
            <span className={styles.label}>统计范围</span>
            <TreeSelect
              showSearch
              className={styles.treeSelect}
              value={deptValue}
              treeData={departments}
              // dropdownMatchSelectWidth={false}
              dropdownClassName='m-bss-treeSelect'
              style={{ marginLeft: 8 }}
              dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
              filterTreeNode={filterTreeNode}
              placeholder="营业部"
              allowClear
              multiple
              searchValue={deptSearch}
              // autoClearSearchValue={false}
              treeDefaultExpandAll
              maxTagCount={3}
              maxTagPlaceholder={(value) => maxTagPlaceholder(value)}
              maxTagTextLength={5}
              treeCheckable={true}
              onChange={handleYybChange}
              onSearch={handleYybSearch}
              treeCheckStrictly={true}
              // showCheckedStrategy={TreeSelect.SHOW_ALL}
            />
          </div>
          <div style={{ margin: '0px 36px 16px 0px', display: 'flex', alignItems: 'center' }}>
            <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,marginRight: 12 ,borderRadius: 2 }} className='m-btn-radius ax-btn-small' type="button" onClick={reset} >重置</Button>
            <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,borderRadius: 2,boxShadow: 'none' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={fetchData}>查询</Button>
          </div>
        </div>
        <Divider style={{ margin: '4px 0 20px' }}/>
        <div style={{ display: 'flex',justifyContent: 'flex-end' ,marginBottom: 16 }}>
          <Export param={exportParam} getColumns={getColumns} total={total} type={exportType}/>
          {
            range === '4' && (
              <Popover
                overlayClassName={styles.Popover}
                content={<Scrollbars autoHide style={{ height: '42rem' ,width: '42rem' }}>
                  <div>
                    <div style={{ color: '#1a2243',fontWeight: 'bold',marginBottom: 12 }}>当前指标</div>
                    <div>
                      {
                        currentType.map((item,index)=>
                          (
                            <Tag className="m-tag-ax" key={item.motTypeId}>
                              <span>{item.motTypeName}</span>
                              <span onClick={() => { deleteType(item.motTypeId); }}><Icon type="close" /></span>
                            </Tag>
                          )
                        )
                      }
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#1a2243',fontWeight: 'bold',marginBottom: 12 }}>可添加指标</div>
                    <div>
                      {
                        addableType.map(item=>(
                          <Tag className="m-tag-ax m-tag-kbj" key={item.motTypeId}>
                            <span>{item.motTypeName}</span>
                            <span onClick={() => { addType(item.motTypeId);}} style={{ fontSize: 17 }}>+</span>
                          </Tag>
                        ))
                      }
                    </div>
                  </div>
                </Scrollbars>}
                trigger="click"
                visible={visible}
                placement="bottomRight"
                onVisibleChange={(visible)=>setVisible(visible)}
              >
                <div style={{ background: '#244fff',color: '#fff',fontSize: 16,padding: '10px 24px',cursor: 'pointer',marginLeft: 16 }}>编辑指标</div>
              </Popover>
            )
          }
        </div>
        <BasicDataTable {...tableProps}/>
      </div>
    </React.Fragment>
  );
}
