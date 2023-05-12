import React ,{ useEffect, useState } from 'react' ;
import { Button, Card,Divider,Descriptions, Pagination } from 'antd';
import { PaperClipOutlined , CaretDownOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import BasicDataTable from '$common/BasicDataTable';
import { QueryRecordInfo , QueryRecordList } from '$services/ecifEvent';
import { history as router } from 'umi';
import styles from '../../index.less';


function DealListDetailRecord(props) {

  const [current,setCurrent] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [tabelDate ,setTabelDate ] = useState({});
  const { customerCode } = props;
  const codeParam = customerCode.split('&&');

  const columns = [
    {
      title: '服务方式',
      dataIndex: 'serviceWay',
      key: 'serviceWay',

      width: 90,
      render: (text) => <div>{text}</div>,
    },
    {
      title: '服务内容',
      dataIndex: 'serviceContent',
      key: 'serviceContent',
      className: 'columnLine',
      // width: 120,
      render: (text) => <div >{text}</div>,
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      key: 'attachment',
      className: 'columnLine',

      render: (text,coulmn) => <a id='ecifDown' style={{cursor: 'pointer'}} target="blank" href={`${coulmn.attachment}`} ><PaperClipOutlined />1个<CaretDownOutlined /> </a>,

    },
    {
      title: '执行人',
      dataIndex: 'treatmentPeople',
      key: 'treatmentPeople',
      className: 'columnLine',
      render: (text) => <div >{text}</div>,
    },
    {
      title: '执行时间',
      dataIndex: 'treatmentTime',
      key: 'treatmentTime',
      className: 'columnLine',
      render: (text) => <div>{text}</div>,
    },
    {
      title: '审核人',
      dataIndex: 'auditingPeople',
      key: 'auditingPeople',
      className: 'columnLine',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '审核结果',
      dataIndex: 'auditingResult',
      key: 'auditingResult',
      className: 'columnLine',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '审核备注',
      dataIndex: 'auditingRemark',
      key: 'auditingRemark',
      className: 'columnLine',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '审核时间',
      dataIndex: 'auditingTime',
      key: 'auditingTime',
      className: 'columnLine',
      width: 200,
      fixed: 'right',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },

  ];
  const tableProps = {
    scroll: { x: 1600 },
  };
  const goBack = () =>{

    if(codeParam[3] == '1'){
      router.push({ pathname: `/newProduct/works/dealListDetail/${codeParam[2]}` });
    }

    if(codeParam[3] == '2'){
      router.push({ pathname: `/single/dealListDetail/${codeParam[2]}` });
    }
  };
  // 表格
  const getQueryRecordInfo = ()=>{
    const param = {
      eventId: codeParam[0],
      custCode: codeParam[1],
    };

    QueryRecordInfo(param).then(res=>{
      const { records } = res ;
      setTabelDate(records[0]);
    });

  };
  // 列表
  const getQueryRecordList = () =>{
    const param = {
      current,
      eventInfoId: codeParam[1],
      pageLength: 0,
      pageNo: 0,
      pageSize,
      paging: 1,
      sort: "",
      total: -1,
      totalRows: 0 ,
    };
    QueryRecordList(param).then(res=>{
      const { records = [] , total } = res;
      setTotal(total);
      setDataSource(records);

    });

  };

  useEffect(()=>{
    getQueryRecordInfo();
    return ()=>{} ;
  },[]);

  useEffect(()=>{
    getQueryRecordList();
    return ()=>{} ;
  },[ current, pageSize]);

  // 分页
  const handlePageChange = (current,pageSize) =>{
    setCurrent(current);
    setPageSize(pageSize);
  };



  return(
    
    <React.Fragment>
      <Card className='ax-card' bodyStyle={{ paddingBottom: 0, paddingTop: 0, minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
        <div className={styles.dealBack} >
          <Button onClick={()=>{ goBack();}} icon='arrow-left' className={styles.dealBut}>返回上一层</Button>
          <span className={styles.dealSpan} >| 审核记录</span>
        </div>
        <div className={styles.recordDes}>
          <Descriptions bordered column={4}>  
            <Descriptions.Item label='客户名称'>{tabelDate.custName}</Descriptions.Item>
            <Descriptions.Item label='客户等级'>{tabelDate.custLvl}</Descriptions.Item>
            <Descriptions.Item label='客户类型'>{tabelDate.custType}</Descriptions.Item>
            <Descriptions.Item label='所属营业部'>{tabelDate.custOrg}</Descriptions.Item>
            <Descriptions.Item label='执行人'>{tabelDate.treatmentPeople}</Descriptions.Item>
            <Descriptions.Item label='客户字段'>{tabelDate.custField}</Descriptions.Item>
            <Descriptions.Item label='重要程度'>{tabelDate.importance}</Descriptions.Item>
            <Descriptions.Item label='处理方式'>{tabelDate.treatmentWay}</Descriptions.Item>
            <Descriptions.Item label='服务方式'>{tabelDate.serviceWay}</Descriptions.Item>
            <Descriptions.Item label='执行时间' span={2}>{tabelDate.treatmentTime}</Descriptions.Item>
            <Descriptions.Item label='附件'>   {tabelDate.attachment ? ( <a style={{cursor: 'pointer'}} target="blank" href={`${tabelDate.attachment}`} ><PaperClipOutlined /> 1个</a> ) : '' }   </Descriptions.Item>
            <Descriptions.Item label='事件描述' span={4}>{tabelDate.eventContent}</Descriptions.Item>
            <Descriptions.Item label='服务内容' span={4}>{tabelDate.serviceContent}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className={styles.recordTip}><span style={{ marginLeft: '10px'}}>审核记录</span></div>
        <Divider className={styles.recordList}/>
        <BasicDataTable {...tableProps } specialPageSize={5} columns={columns} dataSource={dataSource} className={`${styles.table}`} pagination={false} />
        <Pagination
          size='small'
          showLessItems
          showQuickJumper
          hideOnSinglePage
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
    </React.Fragment>
  );
  
}

export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(DealListDetailRecord);