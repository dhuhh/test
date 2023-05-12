import React, { useState, useEffect } from 'react';
import { message,Card, Divider,Button ,Pagination ,Spin, Modal , Input , Form } from 'antd';
import { connect } from 'dva';
import { uniqBy } from 'lodash';
import { getQueryDictionary } from '$services/searchProcess';
import SearchFrom from './SearchFrom' ;
import getIframeSrc from '$utils/getIframeSrc';
import Iframe from 'react-iframe';
import BasicDataTable from '$common/BasicDataTable';
import ecifDown from '../../../../../../assets/ecifDown.png';
import { QueryAuditingManageList , QueryTreatmentPeopleList , QueryIsZb , BatchAuditing } from '$services/ecifEvent';
import styles from './index.less';

function CheckMan(props) {
  const { customerCode = '', state = {} } = props; // 客户号, 上个页面传过来的数据
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [selectAll, setSelectAll] = useState(false); // 全选
  const [dataSource, setDataSource] = useState([]);
  const [allData , setAllData] = useState([]);


  const [current,setCurrent] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false); // 表格loading
  const [custCount,setCustCount] = useState('');//客户数
  const [inCustCount ,setInCustCount] = useState(''); //未办数
  const [checkEventVisible ,setCheckEventVisible] = useState(false); 
  const [checkEventVisibleMore ,setCheckEventVisibleMore] = useState(false);
  const [autor , setAutor] = useState(false) ;// 权限控制
  const [run ,setRun] = useState(false);// 触发重置 调用接口

  const [peopleData, setPeopleData] = useState([]); // 执行人列表
  const [currentPeop ,setCurrentPeop ] = useState(1);
  const [searchPeop,setSearchPeop] = useState(''); // 查询条件搜索--执行人

  const [checkDataList,setCheckDataList] = useState([]);// 审核状态字典
  const [gfqxDataList,setGfqxDataList] = useState([]);// 客户不规范情形字典

  const [auditingStatus,setAuditing] = useState(['1']);// 审核状态 默认审核 -- 查询条件
  const [disorderlyCode,setDisorderly] = useState(''); // 客户不规范情形  -- 查询条件
  const [custField , setCustField] = useState('') ; // 客户字段  -- 查询条件
  const [importance,setImportance] = useState(['']);//重要程度 默认全部  -- 查询条件
  const [custCode , setCustCode] = useState(''); //客户  -- 查询条件
  const [department,setDepartment] = useState(''); //营业部  -- 查询条件
  const [treatmentPeople , setTreaPeople] = useState(''); // 执行人  -- 查询条件
  const [treatmentDate ,setTreat] = useState(''); //执行日期  -- 查询条件
  const [param , setParam] = useState({});
  const [serverName ,setServerName] = useState('');
  const [remark , setremark] = useState('');

  const { TextArea } = Input ;

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'custName',
      key: 'custName',
      width: 90,
      fixed: 'left',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '客户号',
      dataIndex: 'custCode',
      key: 'custCode',
      className: 'columnLine',
      width: 120,
      fixed: 'left',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '客户级别',
      dataIndex: 'custLvl',
      key: 'custLvl',
      className: 'columnLine',
      width: 90,
      fixed: 'left',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },

    {
      title: '事件描述',
      dataIndex: 'describe',
      key: 'describe',
      className: 'columnLine',
      width: 400,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '重要程度',
      dataIndex: 'importance',
      key: 'importance',
      className: 'columnLine',
      width: 90,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '服务方式 ',
      dataIndex: 'serviceWay',
      key: 'serviceWay',
      className: 'columnLine',
      // width: 90,
      render: (text) => <div>{text}</div>,
    },
    {
      title: '服务内容',
      dataIndex: 'serviceContent',
      key: 'serviceContent',
      className: 'columnLine',
      width: 220,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      key: 'attachment',
      className: 'columnLine',
      // width: 120,
      render: (text,coulmn) => <a style={{cursor: 'pointer'}} target="blank" href={`${coulmn.attachment}`} >< img style={{width:'24px'}} src={ecifDown} alt="" /></a>,

    },
    {
      title: '执行人 ',
      dataIndex: 'treatmentPeople',
      key: 'treatmentPeople',
      className: 'columnLine',
      // width: 120,
      render: (text) => <div>{text}</div>,
    },
    {
      title: '审核状态',
      dataIndex: 'auditingStatus',
      key: 'auditingStatus',
      className: 'columnLine',
      // width: 120,
      render: (text) => <div>{text}</div>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      className: 'columnLine',
      width: 70,
      fixed: 'right',
      render: (text,records) => records.auditingStatus === "待审核" ? <div onClick={()=>{onSubmit(records);}} style={{ color: '#244FFF', cursor: 'pointer', visibility: autor ? 'hidden' : 'visible'}}>审核</div> : '',
    },

  ];
  const tableProps = {
    scroll: { x: 1600 },
  };
  const rowSelection = {
    type: 'checkbox',
    crossPageSelect: false, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      let arr = uniqBy(allData.concat(selectedRows),'custCode');
      setAllData(arr);
      setSelectAll(currentSelectAll);
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: record=>{
      return { disabled: record.auditingStatus !== "待审核" };
    },
    fixed: true,
  };


  // 权限  0不是总部   1 是总部只有查询权限   2 管理员
  const getQueryIsZb = () =>{
    QueryIsZb().then(res=>{
      const { records = [] } = res ;
      if(records[0].cnt === '1'){
        setAutor(true);
      }else{
        setAutor(false);
      }
    });
  };
  
  useEffect(()=>{
    getQueryIsZb();
    getServerName();
    return ()=>{} ;
  },[]);

  const getServerName = ()=>{
    // const serverName = props.sysParam.filter(item => item.csmc === 'system.c4ym.url')[0].csz;
    let serverName = '';
    props.sysParam.map( item => {
      if(item.csmc === 'system.c4ym.url'){
        serverName = item.csz;
      }
    });
    setServerName(serverName);
  };

  const getData = ()=>{
    setTableLoading(true);
    setRun(false);
    const params = {
      current,
      pageLength: 0,
      pageNo: 0,
      pageSize,
      paging: 1,
      sort: "",
      total: -1,
      totalRows: 0,

      auditingStatus: auditingStatus.join(',') ,
      disorderlyCode: disorderlyCode,
      custField: custField,
      importance: importance.join(','),
      custCode: custCode,
      custOrg: department,
      treatmentDate: treatmentDate,
      treatmentPeople: treatmentPeople,

    };

    QueryAuditingManageList(params).then(res=>{
      setDataSource([]);
      setTableLoading(false);
      const { records , total = 0 , khzs = '', wwcs = '' } = res;
      setCustCount(khzs); //客户数
      setInCustCount(wwcs); //未办数
      setDataSource(records);
      setTotal(total);
    });

  };

  useEffect(() => {
    getData();
    return () => {};
  }, [current,pageSize,run]);


  // 执行人列表
  const getQueryTreatmentPeopleList = ()=>{
    const params = {
      current: currentPeop,
      keyword: searchPeop ? searchPeop : '',
      pageLength: 0,
      pageNo: 0,
      pageSize: 100,
      paging: 1,
      queryType: 0,
      sort: "",
      total: -1,
      totalRows: 0,
    };
    QueryTreatmentPeopleList(params).then(res=>{
      const { records = [] } = res;
      setPeopleData(records);
    });
  };

  useEffect(()=>{
    getQueryTreatmentPeopleList();
  },[currentPeop,searchPeop]);

  // 审核状态--BGFXX_SHZT 客户不规范情形--KHBGFQX  字典 
  const getAllQueryDictionary = ()=>{
    Promise.all([
      getQueryDictionary( { dictionaryType: "BGFXX_SHZT" }),
      getQueryDictionary( { dictionaryType: "KHBGFQX" }),
    ]).then(res=>{
      const [res1, res2 ] = res;
      const { records: records1 = [] } = res1;
      setCheckDataList(records1);
      const { records: records2 = [] } = res2;
      setGfqxDataList(records2);
    });
  };
  
  useEffect(()=>{
    getAllQueryDictionary();
    return ()=>{};
  },[]);


  // 批量审核按钮
  const showMoreVisible = ()=>{
    setCheckEventVisibleMore(true);
  };
  const remarkChange = (e)=>{
    if(e.target.value){
      setremark(e.target.value);
    }else{
      setremark('');
    }
  };
  // 批量审核
  const runBatchAuditing = (status)=>{

    if(!remark){
      message.warn('请先填写审核意见');
      return ;
    }
    const param = {
      auditingStatus: status,
      lcIdList: selectedRowKeys.join(','),
      remark: remark ,
    };

    BatchAuditing(param).then(res=>{
      setCheckEventVisibleMore(false);
      setremark('');
      setSelectedRowKeys([]);
      setSelectedRows([]);
      getData();
      message.success('操作成功');
    }).catch(err => message.error(err.note || err.message));
  };

  // 分页
  const handlePageChange = (current,pageSize) =>{
    setCurrent(current);
    setPageSize(pageSize);
  };
  const onSubmit = (records) =>{
    const { id , stepId } = records;
    const param = { id , stepId };
    setParam(param);
    setCheckEventVisible(true);
  };

  const showCancelVisible = ()=> {
    setCheckEventVisible(false);
    setCheckEventVisibleMore(false);
    getData();
  };

  return (
    <Spin spinning={tableLoading}>
      <Card className="ax-card" bodyStyle={{ paddingBottom: 0, paddingTop: '10px', minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
        <div className={styles.header}>
          检核审核管理
        </div>
        <div className={styles.tip}>
          <li>下达人:管理员 <span className={styles.txtColor}>重要</span></li>
          <li>未办数/客户数:<span className={styles.txtColor}>{inCustCount}/{custCount}</span></li>
        </div>
        <Divider style={{ margin: '10px 0 24px' }}/>
        <SearchFrom
          auditingStatus={auditingStatus}
          setAuditing={setAuditing}
          setDisorderly={setDisorderly}
          setCustField={setCustField}
          importance={importance}
          setImportance={setImportance}
          setCustCode={setCustCode}
          department={department}
          setDepartment={setDepartment}
          setTreat={setTreat}
          peopleData={peopleData}
          setTreaPeople={setTreaPeople}
          currentPeop={currentPeop}
          setCurrentPeop={setCurrentPeop}
          setSearchPeop={setSearchPeop}
          checkDataList={checkDataList}
          gfqxDataList={gfqxDataList}
          setRun={setRun}
          getData={getData}
          setAllData={setAllData}
          handlePageChange={handlePageChange}
          pageSize={pageSize}
          setDataSource={setDataSource}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectedRows={setSelectedRows}
        />
        <Divider style={{ margin: '0px 0 20px' }}/>
        <div style={{ marginBottom: '20px',position: 'relative',float: 'right',zIndex: '10' }}>
          <Button disabled={(!selectAll && !selectedRowKeys.length)} style={{ visibility: autor ? 'hidden' : 'visible' }} onClick={()=>{showMoreVisible();}} className={`m-btn ant-btn m-bss-btn ${styles.but}`} type="button">审 核</Button>
        </div>
        <BasicDataTable {...tableProps } rowSelection={rowSelection} specialPageSize={5} columns={columns} dataSource={dataSource} className={`${styles.table}`} pagination={false} rowKey={'id'} /> 
        <Pagination
          size='small'
          showLessItems
          showQuickJumper
          // hideOnSinglePage
          showSizeChanger
          className={`${styles.pagination} ${styles.pag}`}
          pageSizeOptions={['10', '50', '100','200']}
          pageSize={pageSize}
          current={current}
          total={total}
          showTotal={()=> `总共${total}条`}
          onChange={handlePageChange}
          onShowSizeChange={(current,pageSize) => handlePageChange(1, pageSize)}
        />

        <Modal 
          key={'evendShowDo'}
          visible={checkEventVisible}
          title={'事件审核'}
          footer={null}
          onCancel={() => { showCancelVisible(); }}
          width={document.body.clientWidth > 1300 ? 1200 : document.body.clientWidth - 100}
          height={900}
          bodyStyle={{ padding: 0 }}
          centered
        > 
          <div style={{ width: `calc(100% - 1px)`,height: '800px', position: 'relative', overflow: 'hidden' }}>
            <Iframe className={styles.iframe} width='100%' height='100%' src={getIframeSrc(props.tokenAESEncode, `${serverName}/ShowWorkflow?NewWindow=true&HideCancelBtn=true&PopupWin=false&wfid=${param.id}&stepId=${param.stepId}`, serverName)} />
          </div>
        </Modal>
        <Modal 
          key={'evendShowMore'}
          visible={checkEventVisibleMore}
          title={'事件批量审核'}
          footer={null}
          onCancel={() => { showCancelVisible(); }}
          width={500}
          bodyStyle={{ padding: 10 }}
          centered
        > 
          <div style={{ fontSize: 14, color: '#1A2243' }}>
            <Form style={{ margin: '20px 0px 20px 18px' }} className={`m-form-default ant-advanced-search-form ${styles.showTip}`}>
              <Form.Item className={`m-form-item m-form-bss-item-p ${styles.clearIcon}`} label='意见'>
                <TextArea autoSize onChange={(e)=>{remarkChange(e);}}/>
                {/* <Input onChange={(e)=>{remarkChange(e);}}/> */}
              </Form.Item>
            </Form>
            <div style={{ padding:'0 0 20px 70px'}}>
              <Button className={styles.save} onClick={()=>{runBatchAuditing('3')}} style={{width:'60px',height:'30px' , background: '#244FFF', color:'white' ,borderRadius:'1px', borderColor:'#244FFF'}} type="button" htmlType="submit">同意 </Button>
              <Button className={styles.remove} onClick={()=>{runBatchAuditing('2')}} style={{height:'30px',borderRadius:'1px',marginLeft:'12px' , color: '#1A2243'}} type="button">不同意 </Button>
            </div>
          </div>
        </Modal>
      </Card>
    </Spin>
  );
}

export default connect(({ global }) => ({
  sysParam: global.sysParam,
  tokenAESEncode: global.tokenAESEncode,
}))(CheckMan);