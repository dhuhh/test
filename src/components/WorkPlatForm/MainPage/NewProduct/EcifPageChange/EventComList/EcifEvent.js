import React, { useState, useEffect ,useCallback } from 'react';
import { Card, Divider,Button ,Pagination, Spin , Modal , message } from 'antd';
import { QueryEcifEventDetailCusList,QueryEventCustomerInfoList } from '$services/ecifEvent';
import { getQueryDictionary } from '$services/searchProcess';
import BasicDataTable from '$common/BasicDataTable';
import { usePrevious, addSensors } from './util';
import { uniqBy } from 'lodash';
import moment from 'moment';
import styles from './index.less';
import { history as router, Link } from 'umi';
import arrow_right from '$assets/newProduct/arrow_right.svg';
import FilterColumn from './FilterColumn';
import FilterDegree from './FilterDegree';
import FilterLevel from './FilterLevel' ;
import EcifRelatedEvents from './EcifRelatedEvents';

export default function EcifEvent(props) {

  const ecifEventType = props.eventId ;// ecif事件类型 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [selectAll, setSelectAll] = useState(false); // 全选
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [allData , setAllData] = useState([]); // 历史选中
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [summary, setSummary] = useState({});

  const [ecifEventVisible,setEcifEventVisible] = useState(false); // Ecif事件弹框
  const prevCurrent = usePrevious(current); // prevProps
  const [tableLoading, setTableLoading] = useState(false); // 表格loading
  const [eventRecord, setEventRecord] = useState({}); // 事件弹框信息
  const [levelDateLength , setLeveLength] = useState(0);
  const [sortRules , setSortRules] = useState(''); // 分配日期 1 降序  2  升序
  const [sort , setSort] = useState('') ;// 距离日期 1 降序  2  升序
  
  const [levelDate , setLevelDate] = useState(''); //客户级别字典
  const [custTypeData , setCustTypeData] = useState([]); // 客户类型字典
  const [disorderlyData, setDisorderlyData] = useState([]); // 不规范情形字典
  const [treatmentData , setTreatment ] = useState([]); // 处理方式字典
  
  const [cusCode , setCusCode] = useState(''); //客户级别--查询条件
  const [custType , setCustType] = useState('');// 客户类型--查询条件
  const [disorderly , setDisorderly] = useState(''); //不规范情景--查询条件
  const [treatmentWay , setTreatmentWay ] = useState(''); // 处理方式--查询条件
  const [standardWay , setStandardWay] = useState(''); // 账户规范方式----查询条件
  const [importance , setImportance] = useState(''); //重要程度--查询条件


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


  const columns = [
    {
      title: '级别',
      dataIndex: 'cusLvl',
      key: 'cusLvl',
      className: 'columnLine',
      // width: 170,
      render: (text) => <div>{text}</div>,
      filterDropdown: ({ confirm }) => <FilterLevel confirm={confirm} levelDateLength={levelDateLength} treeData={levelDate} setCusCode={setCusCode} />,
    },
    {
      title: '客户',
      dataIndex: 'cusName',
      className: 'columnLine',
      key: 'cusName',
      width: 120,
      render: (_, record) => <Link style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} to={`/customerPanorama/customerInfo?customerCode=${record.cusCode}`} target='_blank'><div style={{ color: '#244FFF' , cursor: 'pointer' }}>{record.cusName}</div></Link>,
    },
    {
      title: '客户号',
      dataIndex: 'cusCode',
      className: 'columnLine',
      key: 'cusCode',
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
      className: 'columnLine',
      key: 'disorderlyName',
      width: 230,
      filterDropdown: ({ confirm }) => <FilterColumn DIS_ZTList={disorderlyData} setDisorderly={setDisorderly} confirm={confirm} />,
      render: text => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }}>{text}</div>,
    },
    {
      title: '事件描述',
      dataIndex: 'describe',
      className: 'columnLine',
      key: 'describe',
      width: 350,
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
      // width: 124,
      filterDropdown: ({ confirm }) => <FilterDegree setStateData={setStandardWay} TATA_ZTList={disAutorData} confirm={confirm } />,
      render: (text) => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', lineHeight: '20px', letterSpacing: '1px' }} >{text}</div>,
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
      className: 'columnLine',
      key: 'importance',
      // width: 130,
      filterDropdown: ({ confirm }) => <FilterDegree setStateData={setImportance} TATA_ZTList={importanceData} confirm={confirm } />,
      render: text => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', lineHeight: '20px' }}>{text}</div>,
    },
    {
      title: '分配日期',
      dataIndex: 'distributionTime',
      key: 'distributionTime',
      className: 'columnLine',
      // width: 124,
      sorter: true,
      render: text => <div >{moment(text).format('YYYY-MM-DD')}</div>,
      
    },
    {
      title: '距离到期',
      dataIndex: 'deadlineTime',
      key: 'deadlineTime',
      className: 'columnLine',
      // width: 124,
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
      width: 90,
      render: (_, record) => <span style={{ color: '#244FFF', cursor: 'pointer' }} onClick={() => {handleWith(record);} }>处理</span>,
    },
  ];

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
  // 处理
  const handleWith = (record) => {
    addSensors('事件处理');
    const param = { custCode: record.cusCode,motId: record.eventId ,importance , disorderlyCode: disorderly , custCodeList: cusCode ,crm: '2' } ;
    let params = JSON.stringify(param);
    sessionStorage.setItem('ecifParam',params);
    router.push({ pathname: `/single/dealListDetail/${ecifEventType}` });
    
  };

  // 批量处理
  const handleMuchWidth = () => {
    addSensors('事件处理');
    const custCodes = [];
    const motId = [];
    const way = [] ;
    //treatmentWay 1|尽职调查2|通知3|账户核查
    allData.forEach( (item) => {
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
    const param = { custCode: custCodes.join(','),motId: motId.join(',') ,importance , disorderlyCode: disorderly , custCodeList: cusCode , crm: '2' } ;
    let params = JSON.stringify(param);
    sessionStorage.setItem('ecifParam',params);
    router.push({ pathname: `/single/dealListDetail/${ecifEventType}` });
  };

  const tableProps = {
    scroll: { x: 2280 },
    onChange: onTableChange ,
  };
  // 全选按钮
  const rowSelection = {
    type: 'checkbox',
    crossPageSelect: false, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      let arr = uniqBy(allData.concat(selectedRows),'eventId');
      setAllData(arr);
      setSelectAll(currentSelectAll);
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
    fixed: true,
  };
  const getData = useCallback(
    () => {
      setTableLoading(true);
      
      const params = {
        current,
        cusCode,
        disorderly,
        eventId: ecifEventType,
        importance,
        treatmentWay,
        custType,
        standardWay,
        pageLength: 0,
        pageNo: 0,
        pageSize,
        paging: 1,
        sort,
        total: -1,
        totalRows: 0,
        sortRules,
      };
      const data = {  
        // cusCode: params.cusCode,
        eventId: params.eventId ,
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
          setAllData([]);
          setSelectAll(false);
          setSelectedRowKeys([]);
          setSelectedRows([]);
        }
      }).catch((error) => {
        message.error(error.note || error.message);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, pageSize, importance, disorderly,cusCode,sortRules,sort,treatmentWay,custType,standardWay],
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

  // Ecif事件关联
  const handleEcifWith = (record) => {
    setEventRecord({ custCode: record.cusCode, motId: record.eventId ,cusLvl: record.cusLvl });
    setEcifEventVisible(true);
  };

  useEffect(() => {
    getData();
    return () => {};
  }, [getData]);


  useEffect(() => {
    // 获取不规范列表
    getAllQueryDictionary();
    return () => {};
  }, []);
  const handlePageChange = (current, pageSize) => {
    setCurrent(current);
    setPageSize(pageSize);
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
  return (
    <Spin spinning={tableLoading}>
      <Card className="ax-card" bodyStyle={{ paddingBottom: 0, paddingTop: '10px', minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
        <div style={{ height: '50px' }}>
            待服务客户/ <span style={{ color: '#FF6E30' }}>{summary.custCount}</span> 今日新增 / <span style={{ color: '#FF6E30' }}>{summary.newCusNum}</span>  两天内到期 / <span style={{ color: '#FF6E30' }}>{summary.custExpire}</span> 
          <Button disabled={(!selectAll && !selectedRowKeys.length)} className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14  ${styles.handleWidth}`} style={{ border: 'none', minWidth: 108, height: 32 ,float: 'right' }} onClick={()=>handleMuchWidth()}> 批量处理{renderCount()}</Button>
        </div>
        <Divider style={{ margin: '0px 0 14px' }}/>
        <div style={{ paddingBottom: '12px' }}>
          <p style={{ color: '#1A2243',fontSize: '14px' }}>客户不规范身份信息处理</p>
        </div>
        <BasicDataTable {...tableProps} specialPageSize={5} rowKey={'eventId'} rowSelection={rowSelection} columns={columns} dataSource={dataSource} className={`${styles.table}`} pagination={false} />
        <Pagination
          size='small'
          showLessItems
          showQuickJumper
          showSizeChanger
          className={`${styles.pagination} ${styles.pag}`}
          pageSizeOptions={['20', '50', '100']}
          pageSize={pageSize}
          current={current}
          total={total}
          showTotal={()=> `总共${total}条`}
          onChange={handlePageChange}
          onShowSizeChange={(current,pageSize) => handlePageChange(1, pageSize)}
        />
      </Card>
      <Modal
        key={`ecfiEvent${eventRecord.motId}`}
        visible={ecifEventVisible}
        title={<div style={{ fontSize: 14, display: 'flex', alignItems: 'center', color: '#1A2243' }}>
          <span style={{ fontSize: 18, marginRight: 13 }}>客户关联事件</span>
          <span>{eventRecord.cusLvl}&nbsp; </span>
          <Link to={`/customerPanorama/customerInfo?customerCode=${eventRecord.custCode}`} target='_blank'>
            <span className={styles.hover}>{eventRecord.eventNum}({eventRecord.custCode})</span>
          </Link>
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
    </Spin>
  );
}
