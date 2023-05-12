import React, { useState, useEffect } from 'react';
import { Table , Tooltip , Icon , message , Select , Pagination } from 'antd';
import styles from './index.less';
import wealthTop1 from '$assets/activityComPage/wealth_top1.png';
import wealthTop2 from '$assets/activityComPage/wealth_top2.png';
import wealthTop3 from '$assets/activityComPage/wealth_top3.png';
import wealthArrow from '$assets/activityComPage/wealth_arrow.png';
import unselected from '$assets/activityComPage/unselected.png';
import selected from '$assets/activityComPage/selected.png';
import ExportTab from './exportTab';
import { QueryYgRanking } from '$services/activityComPage';
import moment from 'moment';
import config from '$utils/config';

const { ftq } = config;
const { activityComPage: { exportQueryYgRanking } } = ftq;
export default function Person(props) {
  const [loading , setLoading ] = useState(false);
  const [dataSource , setDataSource ] = useState([]);
  const [pageNo , setPageNo ] = useState(1);
  const [pageSize , setPageSize ] = useState(10);
  const [total , setTotal] = useState(0);
  const [visiblet , setVisiblet] = useState(false);
  const [stage , setStage ] = useState('1');  
  const [sort , setSort ] = useState('1'); // 月度销量排序 1 月度客户数排序 2 累计销量排序 3 累计客户数排序 4
  const dateList = [
    { name: '第一阶段 5月9日-7月31日' , value: '8' }, 
    { name: '第二阶段 8月1日-11月31日' , value: '9' } ,
    { name: '5月数据' , value: '1' } ,
    { name: '6月数据' , value: '2' } ,
    { name: '7月数据' , value: '3' },
    { name: '8月数据' , value: '4' },
    { name: '9月数据' , value: '5' },
    { name: '10月数据' , value: '6' },
    { name: '11月数据' , value: '7' } ,
  ] ;


  useEffect(()=>{
    changeTabShow();
  },[]);

  const changeTabShow = () =>{
    let timeMoth = moment().format('MM');
    if(timeMoth < '08'){
      setStage('8');
    }else{
      setStage('9');
    };
  };

  useEffect(()=>{
    getQueryYgRanking();
  },[pageSize , pageNo , stage , sort]);

  // 列表
  const getQueryYgRanking = ()=>{
    setLoading(true);
    setVisiblet(false);
    const prams = { 
      pageCount: pageSize ,
      pageNumber: pageNo,
      stage: stage,
      sort,
    };
    QueryYgRanking(prams).then(res=>{
      setLoading(false);
      const { records = [] , total = 0 , khwdmc = '' ,ljkhs = '',ljkhxl = '', pm = '',ydkhs = '',ydkhxl = '',ygxm = '', yybmc = '' } = res;
      const mineBranch = { khwdmc ,ljkhs,ljkhxl,ydkhs,ydkhxl,pm: `我的本月排名:${pm}` ,ygxm,yybmc };
      records.unshift(mineBranch);
      setDataSource(records);
      setTotal(total);

    }).catch(err =>message.error(err.note || err.message));
  };


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

  const handleTableChange = (p, c, s) => {
    setPageNo(p);
    setPageSize(c);

  };
  const cpydkhxl = '产品范围仅包括活动指定的9款固收+产品，产品累计考核销量=实际销量*考核系数' ;
  const cpydkhs = '以客户号进行统计，9只产品考核销量不低于1万的客户号即为一个购买客户数，不同活动阶段剔除重复客户' ;
  const cpljkhxl = '产品范围仅包括活动指定的9款固收+产品，产品累计考核销量=实际销量*考核系数' ;
  const cpljgmkhs = '以客户号进行统计，9只产品考核销量不低于1万的客户号即为一个购买客户数' ;

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
      title: '姓名',
      dataIndex: 'ygxm',
      align: 'center',
      className: `m-black`,
      key: 'ygxm',
      width: 210,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: '所属分支机构',
      className: 'm-black',
      align: 'center',
      dataIndex: 'khwdmc',
      key: 'khwdmc',
      width: 250,
      render: text => <div className={styles.columnsTtxt} >{filterText(text)}</div>,
    },
    {
      title: '所属营业部',
      className: 'm-black',
      align: 'center',
      dataIndex: 'yybmc',
      key: 'yybmc',
      width: 250,
      render: text => <div className={styles.columnsTtxt} >{filterText(text)}</div>,
    },
    {
      title: <div style={{ display: 'flex',alignItems: 'center' , cursor: 'pointer' }}>
        <div>产品月度考核销量(万元) <img src={sort === '1' ? selected : unselected} alt="" /></div>
        <Tooltip title={cpydkhxl}>
          <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
        </Tooltip>
      </div>,
      dataIndex: 'ydkhxl',
      align: 'center',
      key: 'ydkhxl',
      width: 210,
      onHeaderCell: colums=>sorterColum(colums),
      className: 'm-black',
      render: text => <div className={styles.columnsTtxt}>{ text || '--' }</div>,
    },
    {
      title: <div style={{ display: 'flex',alignItems: 'center' , cursor: 'pointer' }}>
        <div>产品月度购买客户数 <img src={sort === '2' ? selected : unselected} alt="" /></div>
        <Tooltip title={cpydkhs}>
          <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
        </Tooltip>
      </div>,
      onHeaderCell: colums=>sorterColum(colums),
      className: 'm-black',
      align: 'center',
      dataIndex: 'ydkhs',
      key: 'ydkhs',
      width: 210,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: <div style={{ display: 'flex',alignItems: 'center' , cursor: 'pointer' }}>
        <div>产品累计考核销量(万元) <img src={sort === '3' ? selected : unselected} alt="" /></div>
        <Tooltip title={cpljkhxl}>
          <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
        </Tooltip>
      </div>,
      className: 'm-black',
      align: 'center',
      dataIndex: 'ljkhxl',
      onHeaderCell: colums=>sorterColum(colums),
      key: 'ljkhxl',
      width: 210,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: <div style={{ display: 'flex',alignItems: 'center' , cursor: 'pointer' }}>
        <div>产品累计购买客户数<img src={sort === '4' ? selected : unselected} alt="" /></div>
        <Tooltip title={cpljgmkhs}>
          <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
        </Tooltip>
      </div>,
      className: 'm-black',
      align: 'center',
      dataIndex: 'ljkhs',
      key: 'ljkhs',
      onHeaderCell: colums=>sorterColum(colums),
      width: 220,
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
  ];
  //月度销量排序 1 月度客户数排序 2 累计销量排序 3 累计客户数排序 4
  const sorterColum = (column) =>{
    return{
      onClick: () => {
        switch (column.dataIndex) {
          case 'ydkhxl':
            setSort('1');
            break;
          case 'ydkhs':
            setSort('2');
            break;
          case 'ljkhxl':
            setSort('3');
            break;
          case 'ljkhs':
            setSort('4');
            break;
          default:
            setSort('1');
            break;
        }
      },
    };

  };
  
  const tableProps = {
    className: styles.tabelHasPerColor,
    scroll: { x: 1730 },
    loading,
    dataSource: dataSource,
    bordered: true,
    pagination: false ,
  };
  // 选择阶段
  const selectChange = (value) =>{
    setPageNo(1);
    setStage(value);
  };

  const visibleChange = (e) =>{
    e.stopPropagation();
    setVisiblet(!visiblet);
  };


  const tableHeaderCodes = getColumns.map(item => item.dataIndex).join(',');   
  const tableHeaderNames = ['排名', '姓名','所属分支机构', '所属营业部' ,'产品月度考核销量(万元)','产品月度购买客户数','产品累计考核销量(万元)','产品累计购买客户数'].join(','); 
  const ygRankingModel = { stage,sort };

  const exportPayload = JSON.stringify({
    ygRankingModel,
    tableHeaderNames,
    tableHeaderCodes,
  });


  return(
    <React.Fragment>
      <div style={{ padding: "4px 0 16px 0" , display: 'flex',alignItems: 'center' , justifyContent: 'space-between' }} >
        <div style={{ width: 350 }} onClick={(e)=>visibleChange(e)}>
          <span>统计时间</span>
          <Select className={styles.o_select} open={visiblet} onBlur={()=>{setVisiblet(false);}} style={{ width: 250 , marginLeft: 8 }} value={stage} onChange={(value)=>selectChange(value)} suffixIcon={<img className={ visiblet ? styles.tabelHasArrow : '' } src={wealthArrow} alt=''/>} >
            {
              dateList.map( (item ) => {
                return <Select.Option key={item.name} title={item.name} value={item.value}>{item.name}</Select.Option>;
              }) 
            }
          </Select>
        </div>
        <ExportTab total={total} exportPayload={exportPayload} action={exportQueryYgRanking}/>
      </div>
      <Table {...tableProps} columns={getColumns} ></Table>
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
    </React.Fragment>
  );
  
}