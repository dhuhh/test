import React, { useState, useEffect } from 'react';
import { Table , Tooltip , Icon , Modal , Select , message , Divider , Pagination } from 'antd';
import styles from './index.less';
import { QueryKhwdRanking , QueryYybRanking } from '$services/activityComPage';
import wealthTop1 from '$assets/activityComPage/wealth_top1.png';
import wealthTop2 from '$assets/activityComPage/wealth_top2.png';
import wealthTop3 from '$assets/activityComPage/wealth_top3.png';
import wealthArrow from '$assets/activityComPage/wealth_arrow.png';
import unselected from '$assets/activityComPage/unselected.png';
import selected from '$assets/activityComPage/selected.png';
import ExportTab from './exportTab';
import moment from 'moment';
import config from '$utils/config';
const { ftq } = config;
const { activityComPage: { exportQueryKhwdRanking } } = ftq;


export default function Embranchment(props) {

  const [modalVisible ,setModalVisible] = useState(false);
  const [modelWidth , setModelWidth] = useState(960) ; // 分支机构弹窗
  const [dataSource , setDataSource ] = useState([]);
  const [loading , setLoading ] = useState(false);
  const [brLoading , setBrLoading ] = useState(false);
  const [total , setTotal] = useState(0);
  const [branchTotal , setBranchTotal] = useState(0);
  const [branchData ,setBranchData] = useState([]);
  const [pageNo , setPageNo ] = useState(1);
  const [pageSize , setPageSize ] = useState(10);
  const [brPageNo , setBrPageNo] = useState(1);
  const [brPageSize , setBrPageSize] = useState(10);
  const [khwdId , setKhwdId] = useState('');
  const [sort , setSort ] = useState('1'); // 销量完成率排序 1 客户数完成率 2,
  const [stage , setStage ] = useState('1'); // 1 第一阶段 2 第二阶段
  const [visible , setVisible] = useState(false);
  const dateList = [{ name: '第一阶段 2022.05.09-07.31' , value: '1' }, { name: '第二阶段 2022.08.01-11.31' , value: '2' }] ;


  useEffect(()=>{
    getModalWidth();
    let timeMoth = moment().format('MM');
    if( timeMoth > 7){
      setStage('2');
    }
  },[]);
  const getModalWidth = () =>{
    let width = document.body.clientWidth * 0.7 ;
    setModelWidth(width);
  };

  useEffect(()=>{
    getQueryKhwdRanking();
  },[ pageSize, pageNo ,stage , sort]);

  // 列表
  const getQueryKhwdRanking = ()=>{
    setLoading(true);
    setVisible(false);
    const prams = {
      pageCount: pageSize,
      pageNumber: pageNo,
      stage: stage,
      sort,
    };
    QueryKhwdRanking(prams).then(res=>{
      setLoading(false);
      const { records = [] , total = 0 , khs = '' ,khwcl = '',khwdid = '',khwdmc = '',khxl = '',mbkhs = '',mbxl = '',pm = '',xlwcl = '' } = res;
      const mineBranch = { khs ,khwcl,khwdid,khwdmc,khxl,mbkhs,mbxl,pm: `本机构排名:${pm}` ,xlwcl };
      records.unshift(mineBranch);
      setDataSource(records);
      setTotal(total);

    }).catch(err =>message.error(err.note || err.message));
  };
  // 弹窗列表
  const getQueryYybRanking = ({ id,pageSize ,pageNo })=>{
    setBrLoading(true);
    const prams = {
      khwdId: id ? id : khwdId,
      pageCount: pageSize ? pageSize : brPageSize ,
      pageNumber: pageNo ? pageNo : brPageNo,
      stage: stage,
      xlSort: '0',
    };
    QueryYybRanking(prams).then(res=>{
      setBrLoading(false);
      const { records = [] , total = 0 } = res;
      records.forEach((item,index)=>{
        item.no = (((prams.pageNumber - 1) * prams.pageCount) + index + 1) + '';
      });
      setBranchData(records);
      setBranchTotal(total);

    }).catch(err => message.error(err.note || err.message));
  };

  // 分页
  const handleTableChange = (p, c, s) => {
    setPageNo(p);
    setPageSize(c);
  };
  const handleBrTableChange = (p, c, s) => {
    setBrPageNo(p);
    setBrPageSize(c);
    getQueryYybRanking({ pageSize: c , pageNo: p });

  };
  // 选择阶段
  const selectChange = async (value) =>{
    setStage(value);
    setPageNo(1);
  };

  const visibleChange = (e) =>{
    e.stopPropagation();
    setVisible(!visible);
  };
  // 弹窗
  const showBranchModel = (id)=>{
    getModalWidth();
    getQueryYybRanking({ id });
    setModalVisible(true);
    setKhwdId(id);
  };

  const handleModelCancle = ()=>{
    setModalVisible(false);
    setKhwdId('');
  };
  const cpljkhxl = '产品范围仅包括活动指定的9款固收+产品，产品累计考核销量=实际销量*考核系数' ;
  const xlwcl = '销量完成率=产品累计考核销量/目标销量' ;
  const cpljgmkhs = '以客户号进行统计，9只产品考核销量不低于1万的客户号即为一个购买客户数，不同活动阶段剔除重复客户' ;
  const khswcl = '客户数完成率=产品累计购买客户数/目标客户数' ;

  const filterText = (value) => {
    let len = value.length;
    return (
      <div>
        {
          len > 16 ? <Tooltip title={value}><span style={{ cursor: 'pointer' }}>{value.slice(0,16)}...</span> </Tooltip> : 
            <span>{value || '--'}</span>  
        } 
      </div>
    );
  };

  const reWriteRank = (value) => {
    return (
      <div>
        {
          value === '1' ? <img src={wealthTop1} alt=''/> : value === '2' ? <img src={ wealthTop2 } alt=''/> : value === '3' ? <img src={wealthTop3} alt=''/> : <span>{value || '--'}</span>
        } 
      </div>
    );
  };

  const getColumns = [

    {
      title: '排名',
      dataIndex: 'pm',
      className: `m-black`,
      align: 'center',
      key: 'pm',
      width: 210,
      render: (text,record) => <div className={styles.columnsTtxt} >{reWriteRank(text)}</div>,
    },
    {
      title: '分支机构名称',
      dataIndex: 'khwdmc',
      align: 'center',
      className: `m-black`,
      key: 'khwdmc',
      width: 250,
      render: (text,s) => <div style={{ color: '#244FFF' ,cursor: 'pointer' }} onClick={()=>showBranchModel(s.khwdid)} className={styles.columnsTtxt} >{filterText(text)}</div> ,
    },
    {
      title: '目标销量(万元)',
      className: 'm-black',
      align: 'center',
      dataIndex: 'mbxl',
      key: 'mbxl',
      width: 210,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: <div style={{ display: 'flex',alignItems: 'center' , cursor: 'pointer' }}>
        <div>产品累计考核销量(万元) <img src={ sort === '3' ? selected : unselected} alt="" /></div>
        <Tooltip title={cpljkhxl}>
          <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
        </Tooltip>
      </div>,
      dataIndex: 'khxl',
      align: 'center',
      key: 'khxl',
      width: 210,
      onHeaderCell: colums=>sorterColum(colums),
      className: 'm-black',
      render: text => <div className={styles.columnsTtxt}>{ text || '--' }</div>,
    },
    {
      title: <div style={{ display: 'flex',alignItems: 'center' , cursor: 'pointer' }}>
        <div>销量完成率 <img src={ sort === '1' ? selected : unselected} alt="" /></div>
        <Tooltip title={xlwcl}>
          <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
        </Tooltip>
      </div>,
      dataIndex: 'xlwcl',
      align: 'center',
      key: 'xlwcl',
      width: 210,
      onHeaderCell: colums=>sorterColum(colums),
      className: 'm-black',
      render: text => <div className={styles.columnsTtxt}>{ text || '--' }</div>,
    },
    {
      title: '目标客户数',
      className: 'm-black',
      align: 'center',
      dataIndex: 'mbkhs',
      key: 'mbkhs',
      width: 210,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: <div style={{ display: 'flex',alignItems: 'center' , cursor: 'pointer' }}>
        <div>产品累计购买客户数 <img src={ sort === '4' ? selected : unselected} alt="" /></div>
        <Tooltip title={cpljgmkhs}>
          <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
        </Tooltip>
      </div>,
      dataIndex: 'khs',
      align: 'center',
      key: 'khs',
      width: 210,
      onHeaderCell: colums=>sorterColum(colums),
      className: 'm-black',
      render: text => <div className={styles.columnsTtxt}>{ text || '--' }</div>,
    },
    {
      title: <div style={{ display: 'flex',alignItems: 'center' , cursor: 'pointer' }}>
        <div>客户数完成率 <img src={sort === '2' ? selected : unselected} alt="" /></div>
        <Tooltip title={khswcl}>
          <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
        </Tooltip>
      </div>,
      className: 'm-black',
      align: 'center',
      dataIndex: 'khwcl',
      key: 'khwcl',
      onHeaderCell: colums=>sorterColum(colums),
      width: 210,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },

  ];
  // 销量完成率排序 1 客户数完成率 2, 产品累计考核销量 3  产品累计购买客户数 4
  const sorterColum = (column) =>{
    return{
      onClick: () => {
        switch (column.dataIndex) {
          case 'xlwcl':
            setSort('1');
            break;
          case 'khwcl':
            setSort('2');
            break;
          case 'khs':
            setSort('4');
            break;
          case 'khxl':
            setSort('3');
            break;
          default: 
            setSort('1');
            break;
        }
      },
    };

  };

  const getColumnsModal = [

    {
      title: '序号',
      dataIndex: 'no',
      className: `m-black`,
      align: 'center',
      key: 'no',
      width: 70,
      render: (text) => <div className={styles.columnsTtxt} >{text}</div>,
    },
    {
      title: '分支机构名称',
      dataIndex: 'khwdmc',
      align: 'center',
      className: `m-black`,
      key: 'khwdmc',
      width: 250,
      render: text => <div className={styles.columnsTtxt} >{filterText(text)}</div>,
    },
    {
      title: '营业部名称',
      dataIndex: 'yybmc',
      align: 'center',
      className: `m-black`,
      key: 'yybmc',
      width: 250,
      render: text => <div className={styles.columnsTtxt} >{filterText(text)}</div>,
    },
    {
      title: '产品累计考核销量(万元)',
      className: 'm-black',
      align: 'center',
      dataIndex: 'khxl',
      key: 'khxl',
      width: 210,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },

    {
      title: '产品累计购买客户数',
      className: 'm-black',
      align: 'center',
      dataIndex: 'khs',
      key: 'khs',
      width: 210,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },

  ];

  const tableProps = {
    className: styles.tabelHasEmbColor,
    scroll: { x: 1640 } ,
    loading,
    dataSource: dataSource,
    bordered: true,
    pagination: false ,
  };

  const tablePropsModal = {
    className: styles.tabelModel,
    scroll: { x: 800 },
    loading: brLoading,
    dataSource: branchData,
    bordered: true,
  };

  const tableHeaderCodes = getColumns.map(item => item.dataIndex).join(',');   
  const tableHeaderNames = ['排名', '分支机构名称','目标销量(万元)', '产品累计考核销量(万元)' ,'销量完成率','目标客户数','产品累计购买客户数','客户数完成率'].join(','); 
  const tableHeaderYybCodes = getColumnsModal.map(item => item.dataIndex).join(',');
  const tableHeaderYybNames = ['分支机构名称' , '营业部名称' , '产品累计考核销量(万元)' , '产品累计购买客户数'].join(',');
  const khwdRankingModel = { stage,sort };

  const exportPayload = JSON.stringify({
    khwdRankingModel,
    tableHeaderNames,
    tableHeaderCodes,
    tableHeaderYybCodes,
    tableHeaderYybNames,
  });

  return(
    <React.Fragment>
      <div style={{ padding: "4px 0 16px 0" , display: 'flex',alignItems: 'center' , justifyContent: 'space-between' }} >
        <div style={{ width: 350 }} onClick={(e)=>visibleChange(e)}>
          <span>竞赛阶段</span>
          <Select className={styles.o_select} open={visible} onBlur={()=>{setVisible(false);}} style={{ width: 250 , marginLeft: 8 }} value={stage} onChange={(value)=>selectChange(value)} suffixIcon={<img className={ visible ? styles.tabelHasArrow : '' } src={wealthArrow} alt=''/>}>
            {
              dateList.map( (item ) => {
                return <Select.Option key={item.name} title={item.name} value={item.value}>{item.name}</Select.Option>;
              }) 
            }
          </Select>
        </div>
        <ExportTab total={total} exportPayload={exportPayload} action={exportQueryKhwdRanking}/>
        
      </div>
      <Table {...tableProps} columns={getColumns} key={'one'}></Table>
      <Pagination
        showLessItems
        className={`${styles.o_pagination}` }
        showQuickJumper
        showSizeChanger
        pageSizeOptions={['10', '50', '100']}
        pageSize={pageSize}
        current={pageNo}
        total={total}
        showTotal={()=> `总共${total}条`}
        onShowSizeChange={(current,pageSize)=>handleTableChange(1,pageSize)}
        onChange={handleTableChange}
      />
      <Modal 
        key={'showEmbranch'}
        visible={modalVisible}
        title={<div style={{ fontSize: 16, color: '#1A2243',fontFamily: 'PingFangSC-Medium, PingFang SC',fontWeight: 500 }}>营业部详细数据</div>}
        footer={null}
        onCancel={() => { handleModelCancle(); }}
        width={modelWidth}
        bodyStyle={{ padding: 0 }}
      > 
        <Table {...tablePropsModal} columns={getColumnsModal} key={'two'} style={{ padding: 20 }} pagination={false}></Table>
        <Divider style={{ color: 'red' , margin: 0 }}/>
        <Pagination
          size='small'
          showLessItems
          className={`${styles.pagination} ${styles.o_pagination}` }
          showQuickJumper
          showSizeChanger
          pageSizeOptions={['10', '50', '100']}
          pageSize={brPageSize}
          current={brPageNo}
          total={branchTotal}
          showTotal={()=> `总共${branchTotal}条`}
          onShowSizeChange={(current,pageSize)=>handleBrTableChange(1,pageSize)}
          onChange={handleBrTableChange}
        />
      </Modal>
    </React.Fragment>
  );
  
}