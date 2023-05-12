import React ,{ useEffect,useState }from 'react';
import { DatePicker ,Input ,Button, Divider ,message ,Modal } from 'antd';
import { Link } from 'umi';
import BasicDataTable from '$common/BasicDataTable';
import arrow from '$assets/newProduct/workStatistic/arrow.png';
import file from '$assets/newProduct/workStatistic/file.png';
import { GetEventListResponse,GetServiceDetailResponse } from '$services/newProduct';
import SingleSelect from '../singleSelect';
import moment from 'moment';
import styles from '../index.less';
import Export from '../export';

export default function Incomplete(props) {
  const [date,setDate] = useState([moment().startOf('year'), moment()]);
  const [finishDate,setFinishDate] = useState([moment().startOf('year'), moment()]);
  const [level,setLevel] = useState(0);
  const [custInfo,setCustInfo] = useState('');
  const [dataSource,setDataSource] = useState([]);
  const [loading,setLoading] = useState(false);
  const [total,setTotal] = useState(0);
  const [pageSize,setPageSize] = useState(10);
  const [current,setCurrent] = useState(1);
  const [exportParam,setExportParam] = useState({});
  
  const [modalVisible,setModalVisible] = useState(false);
  const [recordData,setRecordData] = useState({});
  const [detailData,setDetailData] = useState([]);

  useEffect(()=>{
    getEventListResponse();
  },[current,pageSize,props.update]);

  const getEventListResponse = ()=>{
    setLoading(true);
    GetEventListResponse({
      // "userId":null,
      "generateDateStart": date[0].format('YYYYMMDD'),
      "generateDateEnd": date[1].format('YYYYMMDD'),
      "finishDateStart": finishDate[0].format('YYYYMMDD'),
      "finishDateEnd": finishDate[1].format('YYYYMMDD'),
      "eventLevel": level,
      "customerNo": custInfo,
      "finishFlag": 2,
      "pageNo": current,
      "pageSize": pageSize,
    }).then(res=>{
      setDataSource(res.records);
      setTotal(res.total);
      setExportParam({
        // "userId":null,
        "generateDateStart": date[0].format('YYYYMMDD'),
        "generateDateEnd": date[1].format('YYYYMMDD'),
        "finishDateStart": finishDate[0].format('YYYYMMDD'),
        "finishDateEnd": finishDate[1].format('YYYYMMDD'),
        "eventLevel": level,
        "customerNo": custInfo,
        "finishFlag": 2,
        "pageNo": 0,
        "pageSize": 0,
      });
    }).catch(error => {
      message.error(error.note || error.success);
    }).finally(()=>{
      setLoading(false);
    });
  };
  
  const detailContent = (record)=>{
    setRecordData(record);
    setDetailData([]);
    setModalVisible(true);
    GetServiceDetailResponse({
      eventId: record.eventId,
      // eventId: '109836584',
    }).then(res=>{
      setDetailData(res.records);
    });
  };
  const reset = ()=>{
    setDate([moment().startOf('year'), moment()]);
    setFinishDate([moment().startOf('year'), moment()]);
    setLevel(0);
    setCustInfo('');
  };

  const getColumns = ()=>{
    return [
      {
        title: '生成日期',
        dataIndex: 'generateDate',
      },
      {
        title: '事件等级',
        dataIndex: 'eventLevel',
      },
      {
        title: '事件类型',
        dataIndex: 'eventType',
      },
      {
        title: '事件内容',
        dataIndex: 'eventContent',
      },
      {
        title: '完成日期',
        dataIndex: 'finishDate',
      },
      {
        title: '客户号',
        dataIndex: 'customerNO',
      },
      {
        title: '客户姓名',
        dataIndex: 'customerName',
        render: (text, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.customerNO}`} target='_blank'>{text}</Link>,
      },
      {
        title: '完成方式',
        dataIndex: 'finishMode',
      },
      {
        title: '完成内容',
        dataIndex: '完成内容',
        render: (text,records)=><div style={{ color: '#244FFF',cursor: 'pointer' }} onClick={()=>{detailContent(records);}}>详情</div>,
      },
    ];
  };
  const tableProps = {
    bordered: true,
    loading,
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
    <div style={{ margin: '20px 24px 24px' }}>
      <div className={styles.searchContent}>
        <div className={styles.searchItem}>
          <span className={styles.label} >生成日期</span>
          <DatePicker.RangePicker
            allowClear={false}
            value={date}
            className={styles.rangePicker}
            dropdownClassName={`${styles.calendar} m-bss-range-picker`}
            style={{ width: '264px' }}
            placeholder={['请选择', '请选择']}
            format="YYYY-MM-DD"
            separator='至'
            disabledDate={(current) => current && current > moment().endOf('day')}
            onChange={date => setDate(date)}
          />
        </div>
        <div className={styles.searchItem}>
          <span className={styles.label} >完成日期</span>
          <DatePicker.RangePicker
            allowClear={false}
            value={finishDate}
            className={styles.rangePicker}
            dropdownClassName={`${styles.calendar} m-bss-range-picker`}
            style={{ width: '264px' }}
            placeholder={['请选择', '请选择']}
            format="YYYY-MM-DD"
            separator='至'
            disabledDate={(current) => current && current > moment().endOf('day')}
            onChange={finishDate => setFinishDate(finishDate)}
          />
        </div>
        <div className={styles.searchItem}>
          <span className={styles.label}>事件等级</span>
          <SingleSelect setValue={setLevel} value={level} data={[{ value: 0,name: '全部' },{ value: 1,name: '一般' },{ value: 2,name: '重要' }]}/>
        </div>
        <div className={styles.searchItem}>
          <span className={styles.label}>客户</span>
          <Input className={styles.input} allowClear placeholder='姓名/客户号' value={custInfo} onChange={(e)=>setCustInfo(e.target.value)}/>
        </div>
        <div style={{ margin: '0px 36px 16px 0px', display: 'flex', alignItems: 'center' }}>
          <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,marginRight: 12 ,borderRadius: 2 }} className='m-btn-radius ax-btn-small' type="button" onClick={reset} >重置</Button>
          <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,borderRadius: 2,boxShadow: 'none' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={getEventListResponse}>查询</Button>
        </div>
      </div>
      <Divider style={{ margin: '4px 0 20px' }}/>
      <Export param={exportParam} getColumns={getColumns} total={total} type='staffEvent'/>
      <BasicDataTable {...tableProps}/>
      <Modal
        className={styles.contentModal}
        visible={modalVisible}
        // visible={true}
        footer={
          <div style={{ display: 'flex' ,justifyContent: 'flex-end' }}>
            <div className={styles.footerBtn} style={{ border: '1px solid #D1D5E6',padding: '5px 16px',marginRight: 16,cursor: 'pointer',color: '#61698C',borderRadius: 2 }} onClick={()=>setModalVisible(false)}>取消</div>
            <div style={{ border: '1px solid #244FFF',padding: '5px 16px',background: '#244FFF',color: '#FFF' ,cursor: 'pointer' ,borderRadius: 2 }} onClick={()=>{setModalVisible(false);}}>确定</div>
          </div>
        }
        title = '完成内容'
        onCancel={() => { setModalVisible(false); }}
        width='480px'
        destroyOnClose
        maskClosable={false}
        centered>
        {
          recordData.handleMode === '1' && (
            <React.Fragment>
              <div className={styles.option}>
                <div className={styles.question}>服务类型：</div>
                <div className={styles.answer}>{detailData[0]?.serviceType}</div>
              </div>
              <div className={styles.option}>
                <div className={styles.question}>服务方式：</div>
                <div className={styles.answer}>{detailData[0]?.serviceChannel}</div>
              </div>
              <div className={styles.option}>
                <div className={styles.question}>服务主题：</div>
                <div className={styles.answer}>{detailData[0]?.serviceTitle}</div>
              </div>
              <div className={styles.option}>
                <div className={styles.question}>服务内容：</div>
                <div className={styles.answer}>{detailData[0]?.serviceContent}</div>
              </div>
              <div className={styles.option}>
                <div className={styles.question}>附件内容：</div>
                {
                  detailData[0]?.attachTitle.length > 0 && (
                    <div className={styles.answer} style={{ display: 'flex' ,alignItems: 'center' }}>
                      <img src={file} alt='' style={{ width: 16,height: 16 }}/>
                      <div>{detailData[0]?.attachTitle}</div>
                      <div style={{ color: '#244FFF',marginLeft: 16 ,cursor: 'pointer' }} onClick={()=>{window.open(detailData[0]?.attachUrl);}}>查看</div>
                    </div>
                  )
                }
              </div>
            </React.Fragment>
          )
        }
        {
          recordData.handleMode === '2' && (
            <React.Fragment>
              {
                detailData.map(item=>(
                  <div className={styles.option}>
                    <div className={styles.question}>{item?.questionTitle}：</div>
                    <div className={styles.answer}>{item?.questionAnswer}</div>
                  </div>
                ))
              }
            </React.Fragment>
          )
        }
        {
          recordData.handleMode === '3' && (
            <React.Fragment>
              {
                recordData.finishMode === '短信' ? (
                <>
                  <div className={styles.title}>短信内容</div>
                  <div className={styles.content}>
                    {detailData[0]?.msgTp}
                  </div>
                </>
                ) : (
                <>
                  <div className={styles.title}>相关链接</div>
                  <div className={styles.content}>
                    <div>{detailData[0]?.wechatTp}</div>
                    {detailData[0]?.wechatTp && <img src={arrow} alt='' onClick={()=>{window.open(detailData[0]?.msgUrl);}}/>}
                    {/* <img src={arrow} alt='' onClick={()=>{window.open(detailData[0]?.msgUrl);}}/> */}
                  </div>
                </>
                )
              }
            </React.Fragment>
          )
        }
        
      </Modal>
    </div>
  );
}
