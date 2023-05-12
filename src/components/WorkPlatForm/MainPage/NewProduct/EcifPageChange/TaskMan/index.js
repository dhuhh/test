import React, { useState, useEffect } from 'react';
import { message,Card, Divider,Button ,Pagination ,Spin , Modal , Select ,Form } from 'antd';
import SearchFrom from './SearchFrom' ;
import { uniqBy } from 'lodash';
import { Link } from 'umi';
import lodash from 'lodash';
import ecifSearch from '../../../../../../assets/ecifSearch.png';
import BasicDataTable from '$common/BasicDataTable';
import { getQueryDictionary } from '$services/searchProcess';
import { QueryTaskManageList , QueryTreatmentPeopleList , TaskDistribution , QueryIsZb } from '$services/ecifEvent';
import styles from './index.less';
import FilterDegree from './FilterDegree';

export default Form.create() (function TaskMan(props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [selectAll, setSelectAll] = useState(false); // 全选
  const [current,setCurrent] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false); // 表格loading
  const [dataSource, setDataSource] = useState([]);
  const [allData , setAllData] = useState([]);
  const [peopleData, setPeopleData] = useState([]); // 执行人列表
  const [currentPeop ,setCurrentPeop ] = useState(1);
  const [searchPeop,setSearchPeop] = useState(''); // 查询条件搜索--执行人
  const [modalVisible , setModalVisible] = useState(false) ; // 弹窗
  const [custLvlData , setCustLvlData] = useState([]); // 客户级别字典
  const [custTypeData , setCustTypeData] = useState([]); // 客户类型字典
  const [custCount,setCustCount] = useState('');//客户数
  const [inCustCount ,setInCustCount] = useState(''); //未办数
  const [autor , setAutor] = useState(false) ;// 权限控制
  const [run ,setRun] = useState(false);// 触发重置 调用接口

  const [rosterStatus,setDdztData] = useState(['1']);// 名单状态 默认待执行 -- 查询条件
  const [disorderlyCode,setDisorderly] = useState(''); // 客户不规范情形  -- 查询条件
  const [custField , setCustField] = useState('') ; // 客户字段  -- 查询条件
  const [importance,setImportance] = useState(['']);//重要程度 默认全部  -- 查询条件
  const [custCode , setCustCode] = useState(''); //客户  -- 查询条件
  const [department,setDepartment] = useState(''); //营业部  -- 查询条件
  const [disDate , setDisDate] = useState([]); // 分配日期  -- 查询条件
  const [treatmentDate ,setTreat] = useState(''); //执行日期  -- 查询条件
  const [treatmentPeople , setTreaPeople] = useState(''); // 执行人  -- 查询条件
  const [custLvl , setCustLvl ] = useState([]) ; //客户级别-- 查询条件
  const [custType , setCustType] = useState([]) ; // 客户类型 -- 查询条件
  const [type , setType] = useState('1'); // 接口类型  1分配  2调整
  const [disTreatmentPeople , setDisTreatmentPeople] = useState(''); // 执行人  按钮弹窗
  const [runDepartment,setRunDepartment] = useState(''); // 列表选项营业部

  const { form: { getFieldDecorator ,setFieldsValue } } = props;

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'custName',
      key: 'custName',
      className: 'columnLine',
      width: 90,
      fixed: 'left',
      render: (text,record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.custCode}`} target='_blank'><div style={{ color: '#244fff', cursor: 'pointer',wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div></Link>,
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
      width: 120,
      fixed: 'left',
      filterDropdown: ({ confirm }) => <FilterDegree setDataParam={setCustLvl} getData={getData} IMP_ZTList={custLvlData} confirm={confirm } />,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '客户类型',
      dataIndex: 'custType',
      key: 'custType',
      className: 'columnLine',
      width: 120,
      fixed: 'left',
      filterDropdown: ({ confirm }) => <FilterDegree setDataParam={setCustType} getData={getData} IMP_ZTList={custTypeData} confirm={confirm } />,
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
      title: '事件描述',
      dataIndex: 'eventContent',
      key: 'eventContent',
      className: 'columnLine',
      width: 300,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '客户营业部',
      dataIndex: 'custOrg',
      key: 'custOrg',
      className: 'columnLine',
      width: 200,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '名单状态',
      dataIndex: 'treatmentStatus',
      key: 'treatmentStatus',
      className: 'columnLine',
      width: 90,
      render: (text) => <div>{text === '1' ? '待分配' : text === '2' ? "待执行" : text === '3' ? '已完成' : '' }</div>,
    },
    {
      title: '执行人',
      dataIndex: 'treatmentPeople',
      key: 'treatmentPeople',
      className: 'columnLine',
      width: 100,
      render: (text) => <div>{text}</div>,
    },
    {
      title: '执行时间',
      dataIndex: 'treatmentTime',
      key: 'treatmentTime',
      className: 'columnLine',
      // width: 120,
      render: (text) => <div>{text}</div>,
    },
    {
      title: '分配人',
      dataIndex: 'distributionPeople',
      key: 'distributionPeople',
      className: 'columnLine',
      // width: 120,
      render: (text) => <div>{text}</div>,
    },
    {
      title: '分配时间',
      dataIndex: 'distributionTime',
      key: 'distributionTime',
      className: 'columnLine',
      // width: 120,
      render: (text) => <div>{text}</div>,
    },

  ];

  const tableProps = {
    scroll: { x: 1900 },
  };
  const rowSelection = {
    type: 'checkbox',
    crossPageSelect: false, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      let depArr = [];
      let arr = uniqBy(allData.concat(selectedRows),'custCode');
      setAllData(arr);
      // 历史选项跟当下选中交叉获取营业部id
      arr.forEach( (item,index) => {
        selectedRows.forEach(key=>{
          if(item.id === key.id){
            depArr.push(item.orgId);
          }
        });
      });
      // 营业部集合
      if(uniqBy(depArr).length > 1){
        message.error(`跨营业部无法批量调整或分配执行人!`);
        return;
      }else{
        setRunDepartment(uniqBy(depArr)[0]);
        setSelectedRowKeys(currentSelectedRowKeys);
        setSelectedRows(selectedRows);
      }
      // setSelectAll(currentSelectAll);
    },
    getCheckboxProps: record=>{
      // 已完成 3  自动分配的数据 1  开发关系 10  服务关系 11
      return { disabled: record.treatmentStatus === "3" || record.type === '1' || record.type === '10' || record.type === '11' || record.type === '99' };
    },
    fixed: true,
  };



  const getData = () =>{
   
    setTableLoading(true);
    setRun(false);
    const params = {
      auditingStatus: "",
      current,
      pageLength: 0,
      pageNo: 0,
      pageSize,
      paging: 1,
      sort: "",
      total: -1,
      totalRows: 0,

      custLvl: custLvl.join(','), // 客户级别 -- 查询条件
      custType: custType.join(','), // 客户类型 -- 查询条件
      distributionDateStart: disDate.length > 0 ? disDate[0] : '',
      distributionDateEnd: disDate.length > 0 ? disDate[1] : '',
      rosterStatus: rosterStatus.join(',') ,
      disorderlyCode: disorderlyCode,
      custField: custField,
      importance: importance.join(','),
      custCode: custCode,
      custOrg: department,
      treatmentDate: treatmentDate,
      treatmentPeople: treatmentPeople,
    };
    QueryTaskManageList(params).then(res=>{
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
    return () =>{};
  }, [current,pageSize,custLvl,custType,run]);


  // 客户级别--KHJB 客户类型--BGFXX_KHLX  字典 
  const getAllQueryDictionary = ()=>{
    Promise.all([
      getQueryDictionary( { dictionaryType: "KHJB" }),
      getQueryDictionary( { dictionaryType: "BGFXX_KHLX" }),
    ]).then(res=>{
      const [res1, res2 ] = res;
      const { records: records1 = [] } = res1;
      setCustLvlData(records1);
      const { records: records2 = [] } = res2;
      setCustTypeData(records2);
    });

  };
  
  // 权限  0不是总部  1 是总部只有查询权限  2 管理员
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
    getAllQueryDictionary();
    getQueryIsZb();
    return ()=>{};
  },[]);


  // 执行人列表*/
  const getQueryTreatmentPeopleList = ()=>{
    const params = {
      current: currentPeop,
      keyword: searchPeop ? searchPeop : '',
      pageLength: 0,
      pageNo: 0,
      pageSize: 100,
      paging: 1,
      queryType: 0,
      orgId: modalVisible ? runDepartment : department,
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
  },[currentPeop,searchPeop,department,modalVisible]);


  // 分页
  const handlePageChange = (current,pageSize) =>{
    setCurrent(current);
    setPageSize(pageSize);
  };
  //type 2|调整  1|分配弹窗
  const showVisibelModal = (type) =>{
    let show = true ;
    if(type === '1'){
      allData.forEach( (item,index) => {
        selectedRowKeys.forEach(key=>{
          if(item.id === key && item.treatmentStatus === '2'){
            show = false ;
            message.error(`待执行状态的数据不能分配`);
          }
        });
      });
    }
    
    if(type === '2'){
      allData.forEach( (item,index) => {
        selectedRowKeys.forEach(key=>{
          if(item.id === key && item.treatmentStatus === '1'){
            show = false ;
            message.error(`待分配状态的数据不能调整`);
          }
        });
      });
    }
    if(show){
      setType(type);
      setModalVisible(true);
    }

  };
  // 调整/分配 执行
  const runTaskDistribution = ()=>{
    
    if(disTreatmentPeople === undefined || disTreatmentPeople === ''){
      message.error('请先输入执行人');
      return;
    }

    let rwid = [];
    // 1分配--id  2调整--rwid
    if(type === '2'){
      allData.forEach( (item,index) => {
        selectedRowKeys.forEach(key=>{
          if(item.id === key ){
            rwid.push(item.rwId);
          }
        });
      });
    }
    setModalVisible(false);
    setTableLoading(true);
    const params = {
      checkAll: 0, //是否全选  0否  1是
      custCodeList: type === '1' ? selectedRowKeys.join(',') : rwid.join(','), // 客户号集合  1分配--id  2调整--rwid
      disTreatmentPeople: disTreatmentPeople, //执行人
      type: type , // 接口类型  1分配  2调整
      custCode: custCode, //客户 -- 查询条件
      custField: custField, // 客户字段 -- 查询条件
      custLvl: custLvl.join(','), // 客户级别 -- 查询条件
      custOrg: department, //营业部 -- 查询条件
      custType: custType.join(','), // 客户类型 -- 查询条件
      disorderlyCode: disorderlyCode, // 客户不规范情形 -- 查询条件
      distributionDateStart: disDate.length > 0 ? disDate[0] : '', //分配日期 -- 查询条件
      distributionDateEnd: disDate.length > 0 ? disDate[1] : '', //分配日期 -- 查询条件
      importance: importance.join(','), //重要程度  -- 查询条件
      rosterStatus: rosterStatus.join(','), // 名单状态 -- 查询条件
      treatmentDate: treatmentDate, //执行日期 -- 查询条件
      treatmentPeople: treatmentPeople, // 执行人 -- 查询条件
    };
    TaskDistribution(params).then(res=>{
      setTableLoading(false);
      const { note = '' } = res ;
      if(note === '操作成功'){
        message.success(note);
        getData();
      }else{
        message.error(note);
      }
      setAllData([]);
      // 分配去掉搜索框历史
      if(type === '1'){
        setFieldsValue({ 'peopleDataSel': '' });
      }
      // setSelectAll(false);
      setDisTreatmentPeople('');
      setSelectedRowKeys([]);
      setSelectedRows([]);
    });
  };
  // 弹窗--搜索执行人
  const handDisParamPeopSeach = (e)=>{
    setSearchPeop(e);
  };
  const dHandDisParamPeopSeach = lodash.debounce(handDisParamPeopSeach, 300);
  //弹窗--选择执行人
  const handDisParamPeopChange = (e) =>{
    setDisTreatmentPeople(e);
  };
  const dHandDisParamPeopChange = lodash.debounce(handDisParamPeopChange, 300);
  // 执行人滚动加载
  const handPeoScroChange = (e) =>{
    const { target } = e;
    let num = currentPeop;
    if(target.scrollTop + target.offsetHeight > target.scrollHeight - 20){
      num++;
      setCurrentPeop(num);
    }
    if(num > 1){
      if(target.scrollTop === 0){
        num-- ;
        setCurrentPeop(num);
      }
    }
  };
  const visibled = () =>{
    setFieldsValue({ 'peopleDataSel': '' });
    setModalVisible(false);
  };

  return (
    <Spin spinning={tableLoading}>
      <Card className="ax-card" bodyStyle={{ paddingBottom: '10px', paddingTop: '10px', minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
        <div onClick={()=>{getQueryIsZb();}} className={styles.header}>
          检核任务管理
        </div>
        <div className={styles.tip}>
          <li>下达人:管理员 <span className={styles.txtColor}>重要</span></li>
          <li>未办数/客户数:<span className={styles.txtColor}>{inCustCount}/{custCount}</span></li>
        </div>

        <Divider style={{ margin: '10px 0 24px' }}/>
        <SearchFrom 
          rosterStatus={rosterStatus}
          setDdztData={setDdztData}
          setDisorderly={setDisorderly}
          setCustField={setCustField}
          importance={importance}
          setImportance={setImportance}
          setCustCode={setCustCode}
          department={department}
          setDepartment={setDepartment}
          setDisDate={setDisDate}
          setTreat={setTreat}
          peopleData={peopleData}
          setTreaPeople={setTreaPeople}
          currentPeop={currentPeop}
          setCurrentPeop={setCurrentPeop}
          setSearchPeop={setSearchPeop}
          getData={getData}
          setCurrent={setCurrent}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectedRows={setSelectedRows}
          setRun={setRun}
          setAllData={setAllData}
          handlePageChange={handlePageChange}
          pageSize={pageSize}

        />
        <Divider style={{ margin: '0px 0 20px' }}/>
        <div style={{ marginBottom: '20px',position: 'relative',zIndex: '9',float: 'right' }}>
          <Button disabled={(!selectAll && !selectedRowKeys.length)} style={{ visibility: autor ? 'hidden' : 'visible' }} onClick={()=>{ showVisibelModal('2');}} className={`m-btn ant-btn m-bss-btn mr14 ${styles.but}`} type="button">调 整</Button>
          <Button disabled={(!selectAll && !selectedRowKeys.length)} style={{ visibility: autor ? 'hidden' : 'visible' }} onClick={()=>{showVisibelModal('1');}} className={`m-btn ant-btn m-bss-btn ${styles.but}`} >分 配</Button>
        </div>
        <BasicDataTable {...tableProps } specialPageSize={5} rowKey={'id'} columns={columns} dataSource={dataSource} className={`${styles.table}`} rowSelection={rowSelection} pagination={false} />
        <Pagination
          size='small'
          showLessItems
          showQuickJumper
          // hideOnSinglePage
          showSizeChanger
          className={`${styles.pagination} ${styles.pag}`}
          pageSizeOptions={['10', '50', '100', '200']}
          pageSize={pageSize}
          current={current}
          total={total}
          showTotal={()=> `总共${total}条`}
          onChange={handlePageChange}
          onShowSizeChange={(current,pageSize) => handlePageChange(1, pageSize)}
        />
      </Card>
      <Modal 
        key={'showNice'}
        visible={modalVisible}
        title={<div style={{ fontSize: 14, display: 'flex', alignItems: 'center', color: '#1A2243' }}>
          {type === '1' ? '分配' : '调整'}
        </div>}
        footer={null}
        onCancel={() => { setModalVisible(false); }}
        width={500}
        bodyStyle={{ padding: 10 }}
        centered
      > 
        <div style={{ fontSize: 14, color: '#1A2243' }}>
          <Form style={{ margin: '20px 0px 20px 18px' }} className={`m-form-default ant-advanced-search-form ${styles.showTip}`}>
            <Form.Item className={`m-form-item m-form-bss-item-p ${styles.clearIcon}`} label='执行人'>
              {
                getFieldDecorator('peopleDataSel',{})(
                  <Select 
                    showSearch
                    suffixIcon={<img alt="" src={ecifSearch} /> }
                    allowClear
                    onSearch={dHandDisParamPeopSeach}
                    onChange={dHandDisParamPeopChange} 
                    onBlur={()=>setSearchPeop('')}
                    onFocus={()=>{setSearchPeop('');}}
                    onPopupScroll={(e)=>handPeoScroChange(e)}
                    filterOption={(input, option) => {
                      return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }}
                  >
                    {
                      peopleData.map( (item ,index) => {
                        return <Select.Option key={`${index} + l`} title={item.objName} value={item.objId}>{item.objName}</Select.Option>;
                      }) 
                    }
                  </Select>
                )
              }

            </Form.Item>
          </Form>
          <div style={{ padding: '0 0 20px 83px' }}>
            <Button className={styles.save} onClick={()=>{runTaskDistribution(1);}} style={{ width: '60px',height: '30px' , background: '#244FFF', color: 'white' ,borderRadius: '1px', borderColor: '#244FFF' }} type="button" htmlType="submit">保存 </Button>
            <Button className={styles.remove} onClick={()=>{visibled()}} style={{ width: '60px',height: '30px',borderRadius: '1px',marginLeft: '12px' }} type="button">取消 </Button>
          </div>
        </div>
      </Modal>
    </Spin>
  );
})
