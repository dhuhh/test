import React, { useState, useEffect , useCallback } from 'react';
import BasicDataTable from '$common/BasicDataTable';
import { connect } from 'dva';
import { Link } from 'umi';
import lodash from 'lodash';
import C4Iframe from '../../CommonWork/Common/Dialog/C4Iframe';
import { RecorderEventContext,WriterEventContext,EarnEventLink,SendMessage,EarnMessageStaff ,QueryServiceRecorder,InvstmentAdviserSaver} from '$services/newProduct';
import { FetchStaffMessageQuotal } from '$services/incidentialServices';
import { QueryEventDetail , QueryCustomerEventDatas , QueryEventInfoCus , QueryEventCustomerList} from '$services/ecifEvent';
import moment from 'moment';
import { uniqBy } from 'lodash';
import CryptoJS from 'crypto-js';
import { addSensors } from './util';
import styles from './index.less';
import { Card, Divider , Input , Button , Pagination , Modal , message , Checkbox , Select , Table , Switch , DatePicker , Icon} from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import TextArea from 'antd/lib/input/TextArea';
import tipsImg from '$assets/newProduct/icon／tishi／_tishi1@2x.png';

function OtherEvent(props) {
  // sjid={sjid}&KHYYB={KHYYB}&RYYYB={RYYYB}&RYXXID={RYXXID}&SJDJ={SJDJ}&KSRQ={KSRQ}&JSRQ={JSRQ}&ZT={ZT}=&TYPE={TYPE}
  const params = props.params;
  const chanObjValue = () =>{
    for(let item in params){
      if(params[item]=='null'){
        params[item] = ''
      }
    }
  }
  useEffect(() => {
    chanObjValue()
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sjid = props.params.sjid 
  const { KHYYB = '' , RYYYB = '' , RYXXID = '' , SJDJ = '' , KSRQ = '' , JSRQ = '' , ZT = '' , TYPE = ''} = params //TYPE ||  customer person
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [selectAll, setSelectAll] = useState(false); // 全选
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
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
  const [kind ,setKind] = useState('1') ; // 事件大类区分表单标识
  const [typeDescription , setTypeDescription] = useState('') // 事件说明
  const [loading, setLoading] = useState(false); // 表格loading
  const [seachValue , setSeachValue] = useState('') ; // 搜索
  const [seachValueTwo , setSeachValueTwo] = useState('') ; // 搜索确认
  const [title , setTitle] = useState('') ;
  const [notDoneCustomerCount , setNotDoneCustomerCount] = useState('') ;
  const [customerCount , setCustomerCount] = useState('') ;
  const [role , setRole] = useState('') ;
  const [cusNo , setCusNo] = useState('');
  const [imp , setImp] = useState(''); //等级 重要 一般
  const [mds , setMds] = useState('');
  const [allData , setAllData] = useState([]); // 历史选中

  const columns = [

    // TYPE && TYPE === 'person' ?  { width: 0

    // } : {
    //   title: '序号',
    //   dataIndex: 'no',
    //   className: `m-black`,
    //   align: 'center',
    //   key: 'no',
    //   width: 70,
    //   render: (text) => <div>{text}</div>,
    // },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      align: 'center',
      render: (text,record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.customerNo}`} target='_blank'><div style={{ color: '#244fff', cursor: 'pointer' }}>{ `${record.customerName} (${record.customerNo})`}</div></Link>,
    },
    {
      title: '客户级别',
      dataIndex: 'customerLevel',
      key: 'customerLevel',
      align: 'center',
      width: 136,
      render: (text) => <div >{text}</div>,
    },
    {
      title: '柜台手机',
      dataIndex: 'counterPhone',
      key: 'counterPhone',
      align: 'center',
      width: 136,
      render: text => <div>{text || '--'}</div>,
    },
    {
      title: '事件内容',
      dataIndex: 'eventContent',
      key: 'eventContent',
      align: 'center',
      render: text => <div style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: text ?'left' : 'center', lineHeight: '20px', letterSpacing: '1px' }}>{text || '--'}</div>,
    },

   TYPE && TYPE === 'person' ? { width: 0, 
     }:{
      title: '处理人',
      dataIndex: 'czr',
      key: 'czr',
      width: 136,
      align: 'center',
      render: (text) => <div >{text || '--'}</div>,
    } ,
    {
      title: '截至日期',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 136,
      align: 'center',
      render: (text) => <div>{text}</div>,
    },
    {
      title: '关联事件数',
      dataIndex: 'relatedEventCount',
      key: 'relatedEventCount',
      width: 136,
      align: 'center',
      render: (text) => <div>{text}</div>,
    },
    
  ];

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

  // 全选按钮
  const rowSelection = {
    type: 'checkbox',
    crossPageSelect: true, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      let arr = uniqBy(allData.concat(selectedRows),'taskId');
      setAllData(arr);
      setSelectAll(currentSelectAll);
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
    fixed: true,
  };
  

  // 表格配置属性
  const tableProps = {
    scroll: { x: 1080 },
    bordered: true,
    loading,
  };
  // 分页
  const handlePageChange = (current, pageSize) => {
    setCurrent(current);
    setPageSize(pageSize);
  };
  // 搜索框变化
  const handCustChange = (e) =>{
    setSeachValue(e?.target?.value)
  }

  // 二次确认搜索内容
  const handSubChange = () =>{
    setSeachValueTwo(seachValue)
  }
  // 获取个人表头信息
  const getQueryEventDetail = () => {
      QueryEventDetail({eventId:sjid}).then(res=>{
        console.log('个人：',res)
        if(res.records.length){
          const {title = '' , notDoneCustomerCount = '' , customerCount = '' , role = '' , kind = '' , describe = '' , eventLevel = '' } = res.records[0] ;
          setKind(kind);
          setTitle(title);
          setNotDoneCustomerCount(notDoneCustomerCount);
          setCustomerCount(customerCount);
          setTypeDescription(describe);
          setRole(role);
          setImp(eventLevel);
        }
      }).catch((error) => {
        message.error(error.note || error.message);
      });
    }
  // 获取营业部表头信息
  const getQueryEventInfoCus = () => {

    let params = {
      sjId:sjid,
      khYyb:KHYYB == 'null' ? '' : KHYYB,
      ryYyb:RYYYB == 'null' ? '' : RYYYB,
      ryId:RYXXID == 'null' ? '' : RYXXID,
      sjDj:SJDJ == 'null' ? '' : SJDJ,
      rwKsRq:KSRQ == 'null' ? '' : KSRQ,
      rwJzRq:JSRQ == 'null' ? '' : JSRQ,
      zt:ZT == 'null' ? '' : ZT
    }
    QueryEventInfoCus(params).then(res=>{
      console.log('营业部：',res)
      if(res.records.length){
        const {title = '' , notDoneCustomerCount = '' , customerCount = '' , role = '' , kind = '' , describe = '' , eventLevel = ''} = res.records[0];
        setKind(kind);
        setTitle(title);
        setNotDoneCustomerCount(notDoneCustomerCount)
        setCustomerCount(customerCount);
        setRole(role);
        setImp(eventLevel);
        setTypeDescription(describe);
      }
    }).catch((error) => {
        message.error(error.note || error.message);
      });
  }


  const getTabelDetail = () =>{
    if(TYPE==='person'){
      getQueryEventDetail()
    }
    if(TYPE==='customer'){
      getQueryEventInfoCus()
    }
  };


  useEffect(() => {
    getTabelDetail()
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 营业部获取列表
  const getQueryEventCustomerList= () =>{
    setLoading(true);
    let params = {
          current: current,
          pageSize: pageSize,
          paging: 1,
          sort: "",
          total: -1,
          
          gzLx : 2 ,
          sjId : sjid ,
          rwLx : '' ,
          rwZl : '' ,
          zxLx : '' ,
          xdRq : '' ,
          jzRq : '' ,
          gnId : '' ,
          cxLx : 1 ,
          gjz : seachValueTwo,
          khYyb: KHYYB == 'null' ? '' : KHYYB,
          ryYyb: RYYYB == 'null' ? '' : RYYYB,
          ryId: RYXXID == 'null' ? '' : RYXXID,
          sjDj: SJDJ == 'null' ? '' : SJDJ,
          rwKsRq: KSRQ == 'null' ? '' : KSRQ,
          rwJzRq: JSRQ == 'null' ? '' : JSRQ,
          zt:ZT == 'null' ? '' : ZT,
      }

    QueryEventCustomerList(params).then(res=>{
      setLoading(false);
      const { total = 0 , records = [] , note = ''} =res
      records.forEach((item,index)=>{
        item.no = (((current - 1) * pageSize) + index + 1) + '';
      });
      setMds(note);
      setDataSource(records);
      setTotal(total);
    }).catch((error) => {
        message.error(error.note || error.message);
      });

  }

  // 个人获取列表
  const getQueryCustomerEventDatas= () =>{
   setLoading(true);
   let params = {
        current: current,
        eventId: sjid,
        pageLength: 0,
        pageNo: 0,
        pageSize: pageSize,
        paging: 1,
        queryType: 1, // 0 全部  1 待办  2 已办
        sort: "",
        total: -1,
        totalRows: 0,
        workType: 2 ,
        keyword : seachValueTwo
     }

   QueryCustomerEventDatas(params).then(res=>{
    setLoading(false);
    const { total = 0 , records = [] , note =  ''} =res
    setDataSource(records);
    setTotal(total);
    setMds(note)
   }).catch((error) => {
      message.error(error.note || error.message);
    });

  }

  const getData = () =>{
    if(TYPE==='person'){
      getQueryCustomerEventDatas()
    }

    if(TYPE==='customer'){
      getQueryEventCustomerList()
    }
  }

  useEffect(() => {
   getData()
   return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current,pageSize,seachValueTwo]);


  // 通知
  const handleIgnore = ()=>{
    addSensors('事件忽略');
    queryServiceRecorder(1,'待办已处理')
  };

  // 处理
  const handleMuchWith = ()=>{
    addSensors('事件处理');
    const selectArr = []
    allData.forEach(item=>{
      selectedRowKeys.forEach(k=>{
        if(item.taskId==k){
          selectArr.push(item)
        }
      })
    })
    console.log(selectArr)
    if(kind == '1' || kind == ''){
      const { sysParam } = props;
      const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
      let url = '' ;
      if(TYPE==='person'){
         url = `${serverName}/bss/ncrm/work/event/page/newMission.sdo?sjid=${sjid}&khhs=${selectArr.map(item => item.customerNo).join(',')}&allSel=${selectAll ? '1' : '0'}&token=${mds}&khIDs=${selectArr.map(item => item.taskId).join(',')}&customerLevel=${''}&rlms=${''}&cxlx=${'0'}`;
        }else{
         url = `${serverName}/bss/ncrm/work/event/page/newMission.sdo?sjid=${sjid}&khhs=${selectArr.map(item => item.customerNo).join(',')}&allSel=${selectAll ? '1' : '0'}&token=${mds}&khIDs=${selectArr.map(item => item.taskId).join(',')}&customerLevel=${''}&rlms=${''}&cxlx=${'0'}&KHYYB=${KHYYB}`;
        }
      setC4Url(url);
      setHandleWidthTaskVisible(true);
    }else if(kind == '2'){
      setListVisible(true);
      setListValue({})
      setMsgStaff(selectArr.map(item => item.taskId).join(','));
      setCusNo(selectArr.map(item => item.customerNo).join(','));

    }else if(kind == '3'){
      setSendMsgVisible(true);
      setMsgContent('');
      setSwitchKey(false);
      setMsgStaff(selectArr.map(item => item.taskId).join(','));
      setCusNo(selectArr.map(item => item.customerNo).join(','))
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
        setModalLoading(false)
        message.error(error.note || error.message);
      });
    }
  };

  const writerEventContext = ()=>{
    WriterEventContext({
      eventId: sjid, 
      // eventId: '273',
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
    let eventId = sjid
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
        md: mds,
        ntfyFlg: 0,
        sbj:title , 
        tx: msgContent,
        txHtml: '<p>正文</p>',
        senWay: selectAll ? 2 : 1,
        rvwTp: 0,
        oprTp: 2,
        sendTp: 1,
        sfqx: selectAll ? 1 : 0,
        // khh: msgStaff,
        khh: cusNo,
        fwlb: 7,
        presend: timing ? moment(msgDate).format('YYYY-MM-DD') + ' ' + timeHValue + ':' + timeMValue : undefined,
        id: sjid, 
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
        message.error(error.note || error.message);
      });
    }
  };

  const getMsgStaffList = ()=>{
    setStaffListLoading(true);
    EarnMessageStaff({
      chnl: '8',
      chnlList: '8',
      sendWay: selectAll ? 2 : 1,
      rcvrTp: 1,
      sfqx: selectAll ? 1 : 0,
      khh: cusNo,
      // khh: '101216346',
      rcvr: mds,
      "pageNo": 0,
      "pageSize": 5,
      "paging": 1,
      "current": staffListCurrent,
      "total": -1,
      id:sjid, 
    }).then(res=>{
      setStaffList(res.records);
      setStaffListTotal(res.total);
      setStaffListLoading(false);
    }).catch((error) => {
      message.error(error.note || error.message);
    });
  };
  // 填写服务记录
  const queryServiceRecorder = async (serviceWay,msg = '')=>{
    setLoading(true);
    const params = {
      // custCode:msgStaff,
      custCode:selectedRowKeys.join(','),
      title:title,  // 标题 --事件大类
      content:typeDescription, // 内容 -- 事件大类
      eventId: sjid,
      serviceWay,
      handleContent: 1,
      isAll:selectAll ? 1 : 0,
    };
    setSelectAll(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
   await QueryServiceRecorder(params).then(res=>{
      if(res.code>0){
        if(msg){
          // message.info('待办已处理');
          message.info(msg);
        }
        setLoading(false);
        getData();
        getTabelDetail()
        setSelectAll(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setCurrent(1);

      }
    }).catch((error) => {
        message.error(error.note || error.success);
    })
  }

  // 加密
  const stringToHex = (str) => {
    const data = CryptoJS.enc.Utf8.parse(str);
    return CryptoJS.enc.Hex.stringify(data);
  };

 // 替换短信模板中的链接
  const generateMessage = (msg, url) => {
    if (_.isEmpty(msg)) return '';
    return msg.replace(/\${链接}/, url);
  }

  const listener = useCallback((e) => {
    const { action, success } = e.data;
      if (action === 'closeModal') {
        setHandleWidthTaskVisible(false);
      }
      if (success) {
        // window.parent.postMessage({ action: 'queryBacklog' }, '*');
        getData();
        getTabelDetail()
        setSelectAll(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setCurrent(1);
      }
    
  },[getData , props]);

  useEffect(() => {
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [listener]);

  return (
    <Card className="ax-card" bodyStyle={{ paddingBottom: 0, paddingTop: '10px', minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
      <div className={styles.o_title}>{title}</div>
      <Divider style={{ margin: '0px 0 14px' }}/>
      {/* style={{ display: TYPE==='person' ? 'block' : 'none' }} */}
      <div><span className={styles.o_name}>事件说明:</span><span className={styles.o_content}>{typeDescription} </span></div>
      <div className={styles.o_box}>
        <div className={styles.o_tip}>
          <Input style={{ height: 32 , width: 270 }} 
           placeholder='请输入客户姓名/客户号'
           onChange={(e)=>{handCustChange(e)}}
           suffix={<Icon type="search"  onClick={()=>handSubChange()}/>}
           allowClear
           onPressEnter={()=>{handSubChange()}}
           />
          <div className={styles.o_count}><span className={styles.o_name}>未办数/客户数:</span><span className={styles.o_content}>{notDoneCustomerCount || '0' } / {customerCount || '0' }</span></div>
          <div className={styles.o_count}><span className={styles.o_name}>下达人/</span><span className={styles.o_content}> {role} ({imp == '1' ? '重要' : imp == '2' ? '一般' : '无' })</span></div>
        </div>
        <div style={{ display :'flex' , alignItems:'center'}}>
          <Button  disabled={(!selectAll && !selectedRowKeys.length)} style={{ border: 'none', height: 42 , minWidth: 108 , marginRight:20 ,display : TYPE==='person' ? 'block' : 'none' }} className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14  ${styles.handleWidth} ${styles.o_deal}`} onClick={()=>handleIgnore()}>已通知客户</Button>        
          <Button  disabled={(!selectAll && !selectedRowKeys.length)} style={{ border: 'none', minWidth: 108, height: 42 }} className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14  ${styles.handleWidth} ${styles.o_deal}`} onClick={()=>handleMuchWith()}>处理</Button>
        </div>
      </div>
      <div style={{ paddingTop: 24 }}>
        {/* specialPageSize={5} rowSelection={ TYPE==='person' ? rowSelection : null  } */}
        <BasicDataTable {...tableProps} rowKey={'taskId'} rowSelection={rowSelection} className={styles.o_table} columns={columns} dataSource={dataSource} pagination={false} />
        <Pagination
          showLessItems
          showQuickJumper
          showSizeChanger
          className={styles.o_pagination}
          pageSizeOptions={['10', '50', '100']}
          pageSize={pageSize}
          current={current}
          total={total}
          showTotal={()=> `总共${total}条`}
          onChange={handlePageChange}
          onShowSizeChange={(current,pageSize) => handlePageChange(1, pageSize)}
        />
      </div>
      <Modal
        className={styles.o_modal}
        visible={handleWidthTaskVisible}
        footer={null}
        onCancel={() => { setHandleWidthTaskVisible(false); }}
        width='80%'
      >
        <C4Iframe src={c4Url} />
      </Modal>
      <Modal
        className={styles.o_eventModal}
        visible={listVisible}
        footer={null}
        title = '批量处理'
        onCancel={() => { setListVisible(false); }}
        width='614px'
        destroyOnClose
        maskClosable={false}
      >
        <div className={styles.o_form}>
          {
            eventList?.formTitleList?.map( item =>{
              if(item.type === '1'){
                if(item?.radioList?.length === 2){
                  return (
                    <div className={styles.o_formItem} key={item.titleId}>
                      <div className={styles.o_label}>{item.titleName}</div>
                      <div className={styles.o_item}>
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
                    <div className={styles.o_formItem} key={item.titleId}>
                      <div className={styles.o_label}>{item.titleName}</div>
                      <div className={styles.o_item}><Select style={{ width: 320 }} value={listValue[item.titleId]} onChange={(value)=>{
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
              //     <div className={styles.o_formItem} key={item.titleId}>
              //       <div className={styles.o_label}>{item.titleName}</div>
              //       <div className={styles.o_item}><Select style={{ width: 320 }}>
              //         {/* <Select.Option key='1'>1</Select.Option>
              //         <Select.Option key='2'>2</Select.Option>
              //         <Select.Option key='3'>3</Select.Option> */}
              //       </Select></div>
              //     </div>
              //   );
              // }
              else if(item.type === '3'){
                return (
                  <div className={styles.o_TextArea} key={item.titleId}>
                    <div className={styles.o_label}>{item.titleName}</div>
                    <div className={styles.o_item}><TextArea style={{ width: 350,resize: 'vertical' }} maxLength={150} autoSize={{ minRows: 3, maxRows: 10 }} value={listValue[item.titleId]} onChange={(e)=>{
                      setListValue({ ...listValue,[item.titleId]: e.target.value });
                    }}/></div>
                  </div>
                );
              }
              else if(item.type === '4'){
                return (
                  <div className={styles.o_formItem} key={item.titleId}>
                    <div className={styles.o_label}>{item.titleName}</div>
                    <div className={styles.o_item}><TextArea style={{ width: 350 }} maxLength={150} autoSize={{ minRows: 1, maxRows: 1 }} value={listValue[item.titleId]} onChange={(e)=>{
                      setListValue({ ...listValue,[item.titleId]: e.target.value });
                    }}/></div>
                  </div>
                );
              }
            })
          }
        </div>
        <div className={styles.o_submit}>
          <Button className='m-btn ant-btn mr20' style={{ width: 70, height: '42px', borderRadius: '1px' ,fontSize: 14 }} onClick={()=>setListVisible(false)}>取消</Button>
          <Button htmlType='submit' className='m-btn ant-btn m-btn-blue' style={{ width: 70, height: '42px', borderRadius: '1px' ,fontSize: 14 }} onClick={()=>{if(!modalLoading)recorderEventContext();}}>确定</Button>
        </div>
      </Modal>
      <Modal
        className={styles.o_msgModal}
        visible={sendMsgVisible}
        destroyOnClose
        maskClosable={false}
        footer={<div style={{ display: 'flex',alignItems: 'center' }}>
          <div style={{ flex: 1 }}></div>
          <div className={styles.o_msgCheck}><Checkbox checked={timing} onChange={(e)=>setTiming(e.target.checked)}>定时发送</Checkbox></div>
          {
            timing && (
              <div onClick={(e) => { if (!dateOpen) { setDateOpen(!dateOpen); }; e.stopPropagation(); }} id='rangePicker' style={{ position: 'relative' }}>
                <DatePicker
                  allowClear={false}
                  open={true}
                  style={{ width: '250px' }}
                  popupStyle={{ display: dateOpen ? 'block' : 'none', zIndex: dateOpen ? 9 : -1 }}
                  className={styles.o_rangePicker}
                  dropdownClassName={`${styles.o_calendar} m-bss-range-picker`}
                  placeholder='请选择'
                  format="YYYY-MM-DD"
                  getCalendarContainer={(trigger) => trigger.parentNode}
                  onChange={msgDate => {
                    setMsgDate(msgDate);
                  }}
                  showToday={false}
                />
                {dateOpen && (
                  <div className={styles.o_calendarBox}>
                    <div style={{ height: 41 ,borderBottom: '1px solid #EAEEF2',borderLeft: '1px solid #EAEEF2',display: 'flex',alignItems: 'center',justifyContent: 'center' }}>{`${moment(msgDate).format('YYYY-MM-DD')} ${timeHValue}:${timeMValue}`}</div>
                    <div style={{ display: 'flex',height: 256 }}>
                      <div style={{ overflow: 'auto',flex: 1 ,borderLeft: '1px solid #EAEEF2' }}>
                        <Scrollbars autoHide height='256'>
                          {
                            timeH().map(item=>
                              <div className={styles.o_timeItem} key={item} onClick={()=>{setTimeHValue(item);}} style={{ background: timeHValue === item ? '#F0F1F5' : '' }}>{item}</div>
                            )
                          }
                        </Scrollbars>
                      </div>
                      <div style={{ overflow: 'auto',flex: 1 ,borderLeft: '1px solid #EAEEF2' }}>
                        <Scrollbars autoHide height='256'>
                          {
                            timeM().map(item=>
                              <div className={styles.o_timeItem} key={item} onClick={()=>{setTimeMValue(item);}} style={{ background: timeMValue === item ? '#F0F1F5' : '' }}>{item}</div>
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
         
          <div className={styles.o_sendBtn} style={{ border: '1px solid #D1D5E6',padding: '5px 16px',marginRight: 8,cursor: 'pointer',color: '#61698C',marginLeft: 8 }} onClick={()=>{
            setSendMsgVisible(false);
          }}>关闭</div>
          <div className={styles.o_sendBtn} style={{ border: '1px solid #D1D5E6',padding: '5px 16px' ,marginRight: 8,cursor: 'pointer',color: '#61698C' }} onClick={()=>{if(!modalLoading)sendMessage(true)}}>测试发送给自己</div>
          <div style={{ border: '1px solid #244FFF',padding: '5px 16px',background: '#244FFF',color: '#FFF' ,cursor: 'pointer' }} onClick={()=>{if(!modalLoading)sendMessage()}}>发送</div>
        </div>}
        title = '发送短信'
        onCancel={() => { setSendMsgVisible(false); }}
        width='960px'>
        <div style={{ display: 'flex',background: '#F2F3F7',padding: 16 }}>
          <div style={{ padding: 16 ,marginRight: 16 ,background: '#FFF',width: 305 }}>
            <div style={{ color: '#1A2243',fontSize: 16 ,marginBottom: 13 }}>客户名单</div>
            <Table columns={msgCustCol} dataSource={staffList} size="middle" bordered rowKey='objectId' loading={staffListLoading} pagination={
              {  pageSize:5,current: staffListCurrent,total: staffListTotal ,onChange: (current,pageSize)=>{setStaffListCurrent(current);} }
            }></Table>
          </div>
          <div style={{ padding: 16 ,marginRight: 16 ,background: '#FFF' ,flex: 1 }}>
            <div style={{ color: '#1A2243',fontSize: 16 ,marginBottom: 13 }}>短信内容</div>
            <div className={styles.o_form}>
              <div className={styles.o_formItem} style={{ marginBottom: 17 }}>
                <div className={styles.o_label}>使用链接模板</div>
                <div style={{ color: '#244FFF' }}>
                  <Switch onChange={()=>{setSwitchKey(!switchKey);}} checked={switchKey} style={{ marginRight: 8 ,marginTop:-2}}/>{switchKey && <span onClick={()=>{
                    window.open(msgLink)
                  }} style={{cursor:'pointer'}}>预览链接</span>}
                </div>
              </div>
              <div className={styles.o_TextArea} style={{ marginBottom: 17 }}>
                <div className={styles.o_label}>正文</div>
                <div className={styles.o_item} style={{ position: 'relative' }}><TextArea style={{ width: 466,resize: 'vertical' }} autoSize={{ minRows: 6, maxRows: 10 }} onChange={(e)=>{
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
    </Card>
  );
}

export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(OtherEvent);