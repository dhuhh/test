import React ,{ useEffect,useState ,useCallback}from 'react';
import { connect } from 'dva';
import { DatePicker ,Input ,Button, Divider,message ,Modal,Checkbox,Select,Table,Switch} from 'antd';
import BasicDataTable from '$common/BasicDataTable';
import { Link } from 'umi';
import TextArea from 'antd/lib/input/TextArea';
import C4Iframe from '../../CommonWork/Common/Dialog/C4Iframe';
import { addSensors } from '../util';
import lodash from 'lodash';
import Scrollbars from 'react-custom-scrollbars';
import { GetEventListResponse,RecorderEventContext,WriterEventContext,EarnEventLink,SendMessage,EarnMessageStaff ,QueryServiceRecorder,InvstmentAdviserSaver } from '$services/newProduct';
import { FetchStaffMessageQuotal } from '$services/incidentialServices';
import SingleSelect from '../singleSelect';
import moment from 'moment';
import CryptoJS from 'crypto-js';
import tipsImg from '$assets/newProduct/icon／tishi／_tishi1@2x.png';
import Export from '../export';
import styles from '../index.less';

function Incomplete(props) {
  const [date,setDate] = useState([moment().startOf('year'), moment()]);
  const [level,setLevel] = useState(0);
  const [expire,setExpire] = useState(0);
  const [custInfo,setCustInfo] = useState('');
  const [dataSource,setDataSource] = useState([]);
  const [loading,setLoading] = useState(false);
  const [total,setTotal] = useState(0);
  const [pageSize,setPageSize] = useState(10);
  const [current,setCurrent] = useState(1);
  const [exportParam,setExportParam] = useState({});

  //事件处理参数
  const [c4Url, setC4Url] = useState(''); // c4操作页url
  const [handleWidthTaskVisible, setHandleWidthTaskVisible] = useState(false); // 任务处理弹框
  const [listVisible , setListVisible] = useState(false); //表单modal
  const [listValue , setListValue] = useState({}); //填写表单值
  const [msgStaff,setMsgStaff] = useState('');
  const [sendMsgVisible , setSendMsgVisible] = useState(false); //发送短信modal
  const [msgContent , setMsgContent] = useState(''); //短信内容
  const [messageQuota , setMessageQuota] = useState({}); //短信参数
  const [switchKey , setSwitchKey] = useState(false); //switch开关
  const [timing,setTiming] = useState(false);
  const [msgDate,setMsgDate] = useState(moment());
  const [timeHValue,setTimeHValue] = useState(moment().format('HH'));
  const [timeMValue,setTimeMValue] = useState(moment().format('mm'));
  const [eventList , setEventList] = useState({}); //获取事件表单数据
  const [modalLoading,setModalLoading] = useState(false);
  const [dateOpen , setDateOpen] = useState(false); //日历开关
  const [staffList,setStaffList] = useState([]);
  const [staffListLoading,setStaffListLoading] = useState(false);
  const [staffListTotal,setStaffListTotal] = useState(0);
  const [staffListCurrent,setStaffListCurrent] = useState(1);
  const [msgLink,setMsgLink] = useState('');
  const [msgCnt,setMsgCnt] = useState('');
  const [cusNo , setCusNo] = useState('');
  const [recordData,setRecordData] = useState({})

  useEffect(()=>{
    document.onclick = function (param) {
      if (!param.target) {
        return;
      }
      if (param.target.id !== 'rangePicker') {
        setDateOpen(false);
      }
    };
    // window.addEventListener('message', (e) => {
    //   const { page, action, success } = e.data;
    //   if (action === 'closeModal') {
    //     setHandleWidthTaskVisible(false);
    //   }
    //   if(success){
    //     getEventListResponse()
    //     props.setUpdate(!props.update)
    //   }
    // });
  },[]);
  const getEventListResponse = useCallback(()=>{
    setLoading(true);
    GetEventListResponse({
      // "userId":null,
      "generateDateStart": date[0].format('YYYYMMDD'),
      "generateDateEnd": date[1].format('YYYYMMDD'),
      "eventLevel": level,
      "customerNo": custInfo,
      "expiredFlag": expire,
      "finishFlag": 1,
      "pageNo": current,
      "pageSize": pageSize,
    }).then(res=>{
      setDataSource(res.records);
      setTotal(res.total)
      setExportParam({
        // "userId":null,
        "generateDateStart": date[0].format('YYYYMMDD'),
        "generateDateEnd": date[1].format('YYYYMMDD'),
        "eventLevel": level,
        "customerNo": custInfo,
        "expiredFlag": expire,
        "finishFlag": 1,
        "pageNo": 0,
        "pageSize": 0,
      })
    }).catch(error => {
      message.error(error.note || error.success);
    }).finally(()=>{
      setLoading(false);
    });
  },[date,level,custInfo,expire,current,pageSize])
  useEffect(()=>{
    getEventListResponse()
  },[current,pageSize])
  
  const listener = useCallback((e)=>{
    console.log(props)
    const { page, action, success } = e.data;
      if (action === 'closeModal') {
        setHandleWidthTaskVisible(false);
      }
      if(success){
        getEventListResponse()
        props.setUpdate(!props.update)
      }
  },[getEventListResponse,props])
  useEffect(() => {
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [listener]);
  const reset = ()=>{
    setDate([moment().startOf('year'), moment()])
    setLevel(0)
    setCustInfo('')
    setExpire(0)
  }
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
        title: '客户号',
        dataIndex: 'customerNO',
      },
      {
        title: '是否过期',
        dataIndex: 'expiredFlag',
      },
      {
        title: '客户姓名',
        dataIndex: 'customerName',
        render: (text, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.customerNO}`} target='_blank'>{text}</Link>,
      },
      {
        title: '操作',
        dataIndex: '操作',
        render: (text,records)=><div style={{ color: '#244FFF',cursor: 'pointer' }} onClick={()=>handleEvent(records)}>处理</div>,
      },
    ];
  };
  const handleEvent = (record)=>{
    setRecordData(record)
    const { handleMode,motTypeId,customerNO,serviceStartDate ,eventId,customerLevel} = record;
    addSensors('事件处理');
    if(handleMode === '1'){
      const { sysParam } = props;
      let custRank = '';
      if(['1','2','3'].includes(customerLevel)){
        custRank = '1'
      }else if(customerLevel === '4'){
        custRank = '2'
      }else if(['5','6','7'].includes(customerLevel)){
        custRank = '3'
      }
      console.log(custRank)
      const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
      const url = `${serverName}/bss/ncrm/work/event/page/newMission.sdo?sjid=${motTypeId}&khhs=${customerNO}&allSel=0&token=D2DD1E47E3197EB0FEC32F1456230A0D&khIDs=${eventId}&customerLevel=${custRank}&rlms=${serviceStartDate}&cxlx=${'0'}`;
      setC4Url(url);
      setHandleWidthTaskVisible(true);
    }else if(handleMode === '2'){
      setListVisible(true);
      setListValue({});
      setMsgStaff(eventId);
      setCusNo(customerNO);

    }else if(handleMode === '3'){
      setSendMsgVisible(true);
      setMsgContent('');
      setSwitchKey(false);
      setMsgStaff(eventId);
      setCusNo(customerNO);
      setTiming(false);
      setMsgDate(moment());
      setTimeHValue(moment().format('HH'));
      setTimeMValue(moment().format('mm'));
    }
  };

  useEffect(() => {
    if(listVisible){
      writerEventContext();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listVisible]);
  useEffect(() => {
    if(sendMsgVisible){
      fetchStaffMessageQuotal();
      earnEventLink();
      getMsgStaffList();
    }
  }, [sendMsgVisible]);
  useEffect(() => {
    if(sendMsgVisible){
      getMsgStaffList();
    }
  }, [staffListCurrent]);
  useEffect(() => {
    if(switchKey){
      setMsgContent(msgCnt);
    }else{
      setMsgContent('');
    }
  }, [switchKey]);
  useEffect(() => {
    showTime();
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
        message.info('提交成功');
        queryServiceRecorder(1)
        setListVisible(false);
      }).catch((error) => {
        message.error(error.note || error.message);
      }).finally(()=>{
        setModalLoading(false)
      });
    }
  };
  const writerEventContext = ()=>{
    WriterEventContext({
      eventId: recordData.motTypeId,
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
    let eventId = recordData.motTypeId
    EarnEventLink({
      eventId,
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
        md: 'D2DD1E47E3197EB0FEC32F1456230A0D',
        ntfyFlg: 0,
        sbj:recordData.eventContent ,
        tx: msgContent,
        txHtml: '<p>正文</p>',
        senWay: 1,
        rvwTp: 0,
        oprTp: 2,
        sendTp: 1,
        sfqx: 0,
        // khh: msgStaff,
        khh: cusNo,
        fwlb: 7,
        presend: timing ? moment(msgDate).format('YYYY-MM-DD') + ' ' + timeHValue + ':' + timeMValue : undefined,
        id: recordData.motTypeId,
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
      }).catch((error) => {
        message.error(error.note || error.message);
      }).finally(()=>{setModalLoading(false)});
    }
  };
  const getMsgStaffList = ()=>{
    setStaffListLoading(true);
    EarnMessageStaff({
      chnl: '8',
      chnlList: '8',
      sendWay: 1,
      rcvrTp: 1,
      sfqx: 0,
      // khh: msgStaff,
      khh: cusNo,
      // khh: '101216346',
      rcvr: 'D2DD1E47E3197EB0FEC32F1456230A0D',
      "pageNo": 0,
      "pageSize": 5,
      "paging": 1,
      "current": staffListCurrent,
      "total": -1,
      id:recordData.motTypeId,
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
      title:recordData.eventType,
      content:recordData.eventContent,
      eventId: recordData.motTypeId,
      serviceWay,
      handleContent: 1,
      isAll:0,
      dateWay:recordData.serviceStartDate
    };
  
    QueryServiceRecorder(params).then(res=>{
      getEventListResponse()
      props.setUpdate(!props.update)
    })
  }
  // 替换短信模板中的链接
  const generateMessage = (msg, url) => {
    if (_.isEmpty(msg)) return '';
    return msg.replace(/\${链接}/, url);
  }

  // const getShareUrl = (eventId,content) => {
  //   const SHARE_URL =  process.env.NODE_ENV === 'development' ? 'https://crm.axzq.com.cn':'https://scrm.essence.com.cn';
  //   const ICON_URL = process.env.NODE_ENV === 'https://essence-1253205294.cos.ap-guangzhou.myqcloud.com/mrmp/crm/sftp_file/logo.png';
  //   // 把分享信息保存到c端
  //   const shareMessage = {
  //     title: msgTitle,
  //     summary: msgDesc,
  //     pic: ICON_URL,
  //     // 是否是主题资讯
  //     isTheme: 0,
  //     detailUrl: msgLink,
  //   };
  //   const param2 = { proType: '15', id: `${eventId}_${JSON.parse(sessionStorage.getItem('user')).id}`, describe: JSON.stringify(shareMessage) };
  //   // iframe的url过长，微信传输的时候会被截断，所以先在b端存进数据库。在c端打开的时候，再从c端读取url
  //   InvstmentAdviserSaver(param2);
  //   const redirectId = stringToHex(`${eventId}_${JSON.parse(sessionStorage.getItem('user')).id}`);
  //   const shareUrl = `${SHARE_URL}/tifa/index.html#/redirect/${redirectId}`;
  //   // 重新生成短息内容
  //   setMsgCnt(generateMessage(content, shareUrl))
  // }
  
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
          <span className={styles.label}>事件等级</span>
          <SingleSelect setValue={setLevel} value={level} data={[{ value: 0,name: '全部' },{ value: 1,name: '一般' },{ value: 2,name: '重要' }]}/>
        </div>
        <div className={styles.searchItem}>
          <span className={styles.label}>客户</span>
          <Input className={styles.input} allowClear placeholder='姓名/客户号' value={custInfo} onChange={(e)=>setCustInfo(e.target.value)}/>
        </div>
        <div className={styles.searchItem}>
          <span className={styles.label}>是否过期</span>
          <SingleSelect setValue={setExpire} value={expire} data={[{ value: 0,name: '全部' },{ value: 1,name: '未过期' },{ value: 2,name: '已过期' }]}/>
        </div>
        <div style={{ margin: '0px 36px 16px 0px', display: 'flex', alignItems: 'center' }}>
          <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,marginRight: 12 ,borderRadius: 2 }} className='m-btn-radius ax-btn-small' type="button" onClick={reset} >重置</Button>
          <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,borderRadius: 2,boxShadow: 'none' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={(getEventListResponse)}>查询</Button>
        </div>
      </div>
      <Divider style={{ margin: '4px 0 20px' }}/>
      <Export param={exportParam} getColumns={getColumns} total={total} type='staffEvent'/>
      <BasicDataTable {...tableProps}/>
      <Modal
        className={styles.modal}
        visible={handleWidthTaskVisible}
        footer={null}
        onCancel={() => { setHandleWidthTaskVisible(false); }}
        width='80%'
        centered
      >
        <C4Iframe src={c4Url} />
        {/* <iframe id='c4Iframe' src={c4Url} title='c4' width='100%' height='700px' /> */}
      </Modal>
      <Modal
        className={styles.eventModal}
        visible={listVisible}
        footer={null}
        title = '处理'
        onCancel={() => { setListVisible(false); }}
        width='614px'
        destroyOnClose
        maskClosable={false}
        centered
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
                            <Checkbox style={{ marginRight: 16 }} key={item1.radioId} value={item1.radioId} checked={item1.radioId === listValue[item.titleId]} onClick={()=>{
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
              //         {/* <Select.Option key='1'>1</Select.Option>
              //         <Select.Option key='2'>2</Select.Option>
              //         <Select.Option key='3'>3</Select.Option> */}
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
          <Button className='m-btn ant-btn mr20' style={{ width: 70, height: '42px', borderRadius: '1px' ,fontSize: 14 }} onClick={()=>setListVisible(false)}>取消</Button>
          <Button htmlType='submit' className='m-btn ant-btn m-btn-blue' style={{ width: 70, height: '42px', borderRadius: '1px' ,fontSize: 14 }} onClick={()=>{if(!modalLoading)recorderEventContext();}}>确定</Button>
        </div>
      </Modal>
      <Modal
        className={styles.msgModal}
        visible={sendMsgVisible}
        destroyOnClose
        maskClosable={false}
        centered
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
                  dropdownClassName={`${styles.modalCalendar} m-bss-range-picker`}
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
            setSendMsgVisible(false);
          }}>关闭</div>
          <div className={styles.sendBtn} style={{ border: '1px solid #D1D5E6',padding: '5px 16px' ,marginRight: 8,cursor: 'pointer',color: '#61698C' }} onClick={()=>{if(!modalLoading)sendMessage(true)}}>测试发送给自己</div>
          <div style={{ border: '1px solid #244FFF',padding: '5px 16px',background: '#244FFF',color: '#FFF' ,cursor: 'pointer' }} onClick={()=>{if(!modalLoading)sendMessage()}}>发送</div>
        </div>}
        title = '发送短信'
        onCancel={() => { setSendMsgVisible(false); }}
        width='960px'>
        <div style={{ display: 'flex',background: '#F2F3F7',padding: 16 }}>
          <div style={{ padding: 16 ,marginRight: 16 ,background: '#FFF',width: 305 }}>
            <div style={{ color: '#1A2243',fontSize: 16 ,marginBottom: 13 }}>客户名单</div>
            <Table className={styles.table} columns={msgCustCol} dataSource={staffList} size="middle" bordered rowKey='objectId' loading={staffListLoading} pagination={
              {  pageSize:5,current: staffListCurrent,total: staffListTotal ,onChange: (current,pageSize)=>{setStaffListCurrent(current);} }
            }></Table>
          </div>
          <div style={{ padding: 16 ,background: '#FFF' ,flex: 1 }}>
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
                <div className={styles.item} style={{ position: 'relative' }}><TextArea style={{ width: 483,resize: 'vertical' }} autoSize={{ minRows: 6, maxRows: 10 }} onChange={(e)=>{
                  setMsgContent( e.target.value );}} value={msgContent} maxLength={150}/>
                <div style={{ position: 'absolute',bottom: 2,right: 7,fontSize: 12,color: '#959CBA' }}>{msgContent.length}/已输入</div></div>
              </div>
              <div style={{ border: '1px solid #99CEFF',background: '#EBF5FF',borderRadius: 2 ,padding: 16,color: '#1A2243',marginLeft: 92 }}>
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
    </div>
  );
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(Incomplete);
