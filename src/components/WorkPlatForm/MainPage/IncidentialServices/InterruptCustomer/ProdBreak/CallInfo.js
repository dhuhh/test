import React,{ useEffect,useState } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import tishi_black from '$assets/incidentialServices/tishi_black.png';
import tishi from '$assets/incidentialServices/tishi.png';
import { FetchIntrptCustBasicInfo ,VirtualMakeCall, CallResultCallbackLocal ,GetPaperCC,SavePaper,QueryCallList,QueryPaperList ,GetMsg, VirtualMakeCallHSCC } from '$services/incidentialServices';
import { Table, message, Checkbox, Popover, Icon, Modal, Divider,Spin ,Empty ,Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import tishi_origin from '$assets/incidentialServices/tishi_origin.png';
//import defaultImg from '$assets/newProduct/customerPortrait/缺省图@2x.png';
import defaultImg from '$assets/newProduct/customerPortrait/defaultGraph@2x.png';
import styles from './index.less';

function CallInfo(props) {
  const [callLoading,setCallLoading] = useState(false);
  const [recordLoading,setRecordLoading] = useState(true);
  const [saveLoading,setSaveLoading] = useState(false);
  const [tipVisible,setTipVisible] = useState(false);
  const [callVisible,setCallVisible] = useState(false);
  const [recordVisible,setRecordVisible] = useState(false);
  const [callData,setCallData] = useState([]);
  const [recordData,setRecordData] = useState([]);
  const [custInfo,setCustInfo] = useState({});
  const [paperInfo,setPaperInfo] = useState({});
  const [paperValue,setPaperValue] = useState({});
  const [checkSelect,setCheckSelect] = useState({});
  const [remarkValue,setRemarkValue] = useState({});
  const [msgInfo,setMsgInfo] = useState([]);
  const [msgValue,setMsgValue] = useState(undefined);
  useEffect(() => {
    intrptCustV2BasicInfo();
    // getPaperCC();
    queryCallList();
    queryPaperList();
    // getMsg();
  },[]);
  useEffect(() => {
    if(recordVisible){
      // getPaperCC();
      // getMsg();
    }
  },[recordVisible]);
  const executeRecord = ()=>{
    getPaperCC();
    getMsg();
  };
  const intrptCustV2BasicInfo = ()=>{
    FetchIntrptCustBasicInfo({ intId: props.custNo }).then(res=>{
      const { records = [] } = res;
      setCustInfo(records[0] || {});
    }).catch(err => message.error(err.note || err.message));
  };
  const getPaperCC = ()=>{
    let obj1,obj2,obj3;
    GetPaperCC({
      // intId: props.custNo,
      intType: props.type,
    }).then(res=>{
      if(res.code === 2){
        message.info(res.note);
        return;
      }
      setRecordVisible(true);
      setTipVisible(false);
      setPaperInfo(res);
      res?.questions?.forEach((item) => {
        obj1 = { ...obj1,[item.questionId]: undefined };
        obj2 = { ...obj2,[item.questionId]: false };
        item?.options?.forEach(item=>{
          obj3 = { ...obj3,[item.optionId]: undefined };
        });
      });
      setPaperValue(obj1);
      setCheckSelect(obj2);
      setRemarkValue(obj3);
    }).catch(err => message.error(err.note || err.message));
  };
  const getMsg = ()=>{
    GetMsg({
      // intId: props.custNo,
      intType: props.type,
    }).then(res=>{
      setMsgInfo(res.records || []);
      setMsgValue(undefined);
    }).catch(err => message.error(err.note || err.message));
  };
  const savePaper = ()=>{
    setSaveLoading(true);
    const { questions = [] } = paperInfo;
    let checkArr = questions.filter(item=>item.mustAnswerFlag === '1' && !paperValue[item.questionId]);
    if(checkArr.length > 0){
      let obj;
      checkArr.forEach(item=>{obj = { ...obj,[item.questionId]: true };});
      setCheckSelect(obj);
      message.info('请填写必答题');
      setSaveLoading(false);
    }else{
      let answerList = [],obj;
      paperInfo.questions.map(item=>item.questionId).map((item,index)=>{
        obj = { ...obj,[item]: false };
        let questionItem = questions.find(item1=>item1.questionId === item);
        let type = questionItem?.questionType;
        if(paperValue[item] && paperValue[item].length > 0){
          return {
            questionType: type,
            questionId: item,
            questionNo: index + 1,
            questionInfo: questionItem?.questionContent,
            answerId: type === '1' ? paperValue[item] : type === '2' ? paperValue[item].map(item=>item.split('/')[0]).join(',') : '',
            answerInfo: type === '2' ? paperValue[item].map(item=>{return (item.split('/')[1]) + (remarkValue[item.split('/')[0]] ? `(备注:${remarkValue[item.split('/')[0]]})` : '');}).join('、') : type === '3' ? paperValue[item] : questionItem?.options?.find(item2=>item2.optionId === paperValue[item])?.optionContent + (remarkValue[paperValue[item]] ? `(备注:${remarkValue[paperValue[item]]})` : ''),
            answerNo: questionItem?.options?.find(item2=>item2.optionId === paperValue[item])?.optionOrder || '',
          };
        }else{
          return null;
        }
      }).forEach(item=>{
        if(item){
          answerList.push(item);
        }
      });
      setCheckSelect({ ...checkSelect,...obj });
      SavePaper({
        intId: props.custNo,
        selectAll: 0,
        uuid: props.note,
        // customerNo: props.customerNo,
        // intPhone: custInfo.sjhm,
        intType: props.type,
        msgId: msgValue || '',
        msgTitle: msgInfo.find(item=>item.msgId === msgValue)?.msgTitle || '',
        msgInfo: msgInfo.find(item=>item.msgId === msgValue)?.msgInfo || '',
        answers: answerList,
        paperId: paperInfo.paperId,
        paperVersion: paperInfo.paperVersion,
      }).then(res=>{
        message.info(res.note);
      }).catch(err => message.error(err.note || err.message))
        .finally(()=>{
          setRecordVisible(false);
          queryPaperList();
          setSaveLoading(false);
        });
    }
  };
  const queryCallList = ()=>{
    setCallLoading(true);
    QueryCallList({
      intId: Number(props.custNo),
      // intType: props.type,
    }).then(res=>{
      setCallData(res.records);
    }).catch(err => message.error(err.note || err.message))
      .finally(()=>{setCallLoading(false);});
  };
  const queryPaperList = ()=>{
    QueryPaperList({
      intId: props.custNo,
      // intType: props.type,
    }).then(res=>{
      setRecordData(res.records);
    }).catch(err => message.error(err.note || err.message));
  };
  // 外呼
  const handleOk = () => {
    const { custNo } = props;
    const params = {
      userPhone: `${custInfo.excPhn}`,
      intPhone: `${custInfo.custPhn}`,
      intId: custNo,
    };
    VirtualMakeCallHSCC(params).then((res) => {
      const { uniqueId = '', note = '呼叫成功' } = res;
      message.info(note);
      // CallResultCallbackLocal({
      //   custNo,
      //   uniqueId,
      //   whlx: '2',
      // }).catch(err => message.error(err.note || err.message));
    }).catch(err => message.error(err.note || err.message))
      .finally(() => {setCallVisible(false);queryCallList();});
  };
  const getColumn = ()=>{
    return [
      {
        title: '序号',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '呼叫时间',
        dataIndex: 'callTime',
        width: 200,
      },
      {
        title: '呼叫人员',
        dataIndex: 'callUserName',
        width: 200,
      },
      {
        title: '呼叫方式',
        dataIndex: 'callType',
        width: 200,
      },
      {
        title: '呼叫是否接通',
        dataIndex: 'isCalled',
        width: 200,
      },
      {
        title: '呼叫录音号',
        dataIndex: 'callRecord',
        width: 200,
      },
    ];
  };
  const tableProps = {
    loading: callLoading,
    rowKey: 'id',
    dataSource: callData.map((item,index)=>{return { id: index + 1,...item };}),
    columns: getColumn(),
    bordered: true,
    className: 'm-Card-Table pt16',
    pagination: false,
  };
  const { authorities: { valueSearch } } = props;
  const { questions = [] } = paperInfo;
  const width = window.innerWidth || document.clientWidth || document.body.clientWidth;
  const isExecute = ['已执行','待执行'].includes(props.status);
  return (
    <div className={styles.callInfo}>
      <div className={styles.title}>
        <div className={styles.label}>呼叫记录</div>
        <div className={styles.titleBtn} style={{ position: 'relative' }}>
          {
            valueSearch && valueSearch.includes('isCall') && (
              <Popover visible={tipVisible} placement='topRight' content={<div style={{ padding: '12px 8px', fontSize: 16, color: '#1A2243', width: 422 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={tishi} alt='' />
                    <div style={{ paddingLeft: 10, fontWeight: 'bold' }}>财富管家提醒您</div>
                  </div>
                  <div className={styles.closeHover} onClick={() => setTipVisible(false)}><Icon type="close" style={{ color: 'rgba(5, 14, 28, 0.4)' }} /></div>
                </div>
                <div style={{ lineHeight: '26px', marginTop: 6, paddingLeft: 32 }}>将接通您的手机号码{custInfo.excPhn || '--'}，客户来电显示为95517</div>
              </div>} getPopupContainer={triggerNode => triggerNode.parentElement}>
                <div style={{ marginRight: 24 ,color: isExecute ? '' : '#959cba',background: isExecute ? '' : '#d1d5e6' }} onMouseEnter={()=>{isExecute && setTipVisible(true);}} onClick={() => {
                  if(isExecute){
                    setTipVisible(false);
                    setCallVisible(true);
                  }else{
                    message.info('仅限“待执行”和“已执行”状态可操作');
                  }
                }} className={styles.btn}>呼叫客户</div>
              </Popover>
            )
          }
          {
            valueSearch && valueSearch.includes('excute') && <div className={styles.btn} style={{ color: isExecute ? '' : '#959cba',background: isExecute ? '' : '#d1d5e6' }} onClick={()=>{isExecute ? executeRecord() : message.info('仅限“待执行”和“已执行”状态可操作');}}>执行记录</div>
          }
        </div>
      </div>
      <div style={{ textAlign: 'right',marginTop: 8 }}><img src={tishi_black} alt='' /><span style={{ fontSize: 12, color: '#959CBA', marginLeft: 4 }}>“成功呼叫客户或填写问卷提交，工单状态变更为已执行”</span></div>
      <Table {...tableProps} style={{ marginBottom: 36 }}/>
      <div className={styles.title}>
        <div className={styles.label}>服务记录</div>
      </div>
      {
        recordData.length > 0 ? recordData.map((item,index)=>(
          <div className={styles.serviceInfo} style={{ marginTop: index === 0 ? 20 : 36 }} key={index}>
            <div className={styles.serviceHeader}>
              <div>
                <span>服务时间：</span>
                <span>{item.serviceTime}</span>
              </div>
              <div>
                <span>服务人员：</span>
                <span>{item.serviceUserName}</span>
              </div>
              <div>
                <span>流水号：</span>
                <span>{item.serviceId}</span>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.serviceCnt}>
                <div>服务内容：</div>
                <div>
                  {
                    item.answers.sort((a,b)=>a.questionNo - b.questionNo).map((item,index)=><span style={{ marginRight: 40,flexShrink: 0 ,display: 'inline-block',maxWidth: '100%' ,wordBreak: 'break-all' }} key={index}>{item.questionNo}、{item.answerInfo}</span>)
                  }
                </div>
              </div>
              <div className={styles.msgCnt}>
                <div>短信内容：</div>
                <div>{item.msgInfo}</div>
              </div>
            </div>
          </div>
        )) : <Empty image={defaultImg} description='暂无数据' style={{ height: '200px', paddingTop: '50px' }} />
      }
      <Modal
        width='480px'
        className={styles.modal}
        visible={callVisible}
        onCancel={()=>{setCallVisible(false);}}
        title={<div><img src={tishi_origin} alt='' style={{ margin: '-3px 10px 0 0' }}/><span style={{ fontSize: 16, color: '#1A2243', fontWeight: 'bold' }}>操作提示</span></div>}
        footer={<>
          <div onClick={()=>{setCallVisible(false);}}>取消</div>
          <div onClick={()=>{handleOk();}}>确定</div>
        </>}
      >
        <div style={{ padding: '24px 48px', color: '#61698C' }}>
          将接通您的手机号码{custInfo.excPhn || '--'}，同步接通该客户（客户来电显示为95517），请确认是否呼叫？
        </div>
      </Modal>
      <Modal
        width='614px'
        className={styles.recordModal}
        visible={recordVisible}
        // visible={true}
        onCancel={()=>{setRecordVisible(false);}}
        title='执行'
        destroyOnClose
        footer={<>
          <div onClick={()=>{setRecordVisible(false);}}>取消</div>
          <div onClick={saveLoading ? '' : savePaper}>确定</div>
        </>}
      >
        <Scrollbars autoHide style={{ height: width > 1280 ? 690 : 317 }}>
          <div className={styles.title}><span>开场白参考话术</span></div>
          <Divider style={{ margin: 0 }}/>
          <div className={styles.content}>{paperInfo.paperHeader}</div>
          <Divider style={{ margin: 0 }}/>
          <div className={styles.title}><span>回访问卷</span></div>
          <Divider style={{ margin: 0 }}/>
          <div style={{ padding: '0 24px' }}>
            {
              questions.map((item,index)=>{
                if(item.questionType === '1'){
                  console.log(item.options.find(item1=>item1.optionInputFlag === '1'));
                  return (
                    <React.Fragment key={item.questionId}>
                      <div className={styles.question}>
                        <div className={styles.text} style={{ color: checkSelect[item.questionId] ? '#EC3A48' : '' }}>{item.questionContent}<span>{`（${item.mustAnswerFlag === '1' ? '必答题/' : ''}单选）`}</span></div>
                        {
                          item.options.find(item1=>item1.optionInputFlag === '1') ? (
                            <div className={styles.optionInput}>
                              {
                                item.options.map(item1=>(
                                  <div key={item1.optionId}>
                                    <Checkbox style={{ marginRight: 16,flexShrink: 0 ,width: `${14 * Math.max(...item.options.map(item1=>item1.optionContent.length)) + 24}px` }} value={item1.optionId} checked={paperValue[item.questionId] === item1.optionId} onChange={(e)=>{setPaperValue({ ...paperValue,[item.questionId]: e.target.value });}} key={item1.optionId}>{item1.optionContent}</Checkbox>
                                    {item1.optionInputFlag === '1' ? paperValue[item.questionId] === item1.optionId ? (
                                      <div style={{ flex: 1 ,flexShrink: 0 }}>
                                        <Input style={{ width: 200 ,borderRadius: 2 }} placeholder='请输入' value={remarkValue[item1.optionId]} onChange={(e)=>{setRemarkValue({ ...remarkValue,[item1.optionId]: e.target.value });}} maxLength={200}/>
                                      </div>
                                    ) : (
                                      <div style={{ flex: 1 ,flexShrink: 0 }}>
                                        <div style={{ width: 200 ,borderRadius: 2 ,background: '#F0F1F5',height: 32 ,padding: '6px 0 5px 11px',color: '#C7CADA' }}>请输入</div>
                                      </div>
                                    ) : ''}
                                  </div>
                                )
                                )
                              }
                            </div>
                          ) : (
                            <div className={styles.option}>
                              {
                                item.options.map(item1=>
                                  <Checkbox style={{ marginRight: 16 }} value={item1.optionId} checked={paperValue[item.questionId] === item1.optionId} onChange={(e)=>{setPaperValue({ ...paperValue,[item.questionId]: e.target.value });}} key={item1.optionId}>{item1.optionContent}</Checkbox>
                                )
                              }
                            </div>
                          )
                        }

                        {/* {
                          item.options.find(item1=>item1.optionId === paperValue[item.questionId])?.optionInputFlag === '1' && (
                            <div style={{ position: 'relative' }}>
                              <TextArea style={{ width: 320,resize: 'vertical',marginTop: 12 }} maxLength={200} autoSize={{ minRows: 3, maxRows: 10 }} onChange={(e)=>{setRemarkValue({ ...remarkValue,[item.questionId]: e.target.value });}} value={remarkValue[item.questionId]}/>
                              <div style={{ position: 'absolute',bottom: 2,right: 255,fontSize: 12,color: '#959CBA' }}>{remarkValue[item.questionId]?.length || 0}/200</div>
                            </div>
                          )
                        } */}
                      </div>
                      {
                        index < questions.length - 1 && <Divider style={{ margin: 0 }} dashed/>
                      }
                    </React.Fragment>
                  );
                }else if(item.questionType === '2'){
                  return (
                    <React.Fragment key={index}>
                      <div className={styles.question}>
                        <div className={styles.text} style={{ color: checkSelect[item.questionId] ? '#EC3A48' : '' }}>{item.questionContent}<span>{`（${item.mustAnswerFlag === '1' ? '必答题/' : ''}多选）`}</span></div>
                        {
                          item.options.find(item1=>item1.optionInputFlag === '1') ? (
                            <div className={styles.optionInput}>
                              {
                                item.options.map(item1=>(
                                  <div key={item1.optionId}>
                                    <Checkbox style={{ marginRight: 16,flexShrink: 0 ,width: `${14 * Math.max(...item.options.map(item1=>item1.optionContent.length)) + 24}px` }} value={item1.optionId + '/' + item1.optionContent} checked={paperValue[item.questionId]?.includes(item1.optionId + '/' + item1.optionContent)} onChange={(e)=>{
                                      let arr = paperValue[item.questionId] || [];
                                      if(e.target.checked){
                                        arr.push(e.target.value);
                                      }else{
                                        arr = arr.filter(item => item !== e.target.value);
                                      }
                                      setPaperValue({ ...paperValue,[item.questionId]: arr });
                                    }} key={item1.optionId}>{item1.optionContent}</Checkbox>
                                    {item1.optionInputFlag === '1' ? paperValue[item.questionId]?.includes(item1.optionId + '/' + item1.optionContent) ? (
                                      <div style={{ flex: 1 ,flexShrink: 0 }}>
                                        <Input style={{ width: 200 ,borderRadius: 2 }} placeholder='请输入' value={remarkValue[item1.optionId]} onChange={(e)=>{setRemarkValue({ ...remarkValue,[item1.optionId]: e.target.value });}} maxLength={200}/>
                                      </div>
                                    ) : (
                                      <div style={{ flex: 1 ,flexShrink: 0 }}>
                                        <div style={{ width: 200 ,borderRadius: 2 ,background: '#F0F1F5',height: 32 ,padding: '6px 0 5px 11px',color: '#C7CADA' }}>请输入</div>
                                      </div>
                                    ) : ''}
                                  </div>
                                )
                                )
                              }
                            </div>
                          ) : (
                            <div className={styles.option}>
                              <Checkbox.Group
                                options={item.options.map(item1=>{
                                  return { label: item1.optionContent,value: item1.optionId + '/' + item1.optionContent };
                                })}
                                value={paperValue[item.questionId]}
                                onChange={(checkList)=>{setPaperValue({ ...paperValue,[item.questionId]: checkList });}}
                              />
                            </div>
                          )
                        }

                      </div>
                      {
                        index < questions.length - 1 && <Divider style={{ margin: 0 }} dashed/>
                      }
                    </React.Fragment>
                  );
                }else if(item.questionType === '3'){
                  return (
                    <React.Fragment key={index}>
                      <div className={styles.question}>
                        <div className={styles.text} style={{ color: checkSelect[item.questionId] ? '#EC3A48' : '' }}>{item.questionContent}<span>{item.mustAnswerFlag === '1' ? '（必答题）' : ''}</span></div>
                        <div className={styles.option}>
                          <div style={{ position: 'relative' }}>
                            <TextArea style={{ width: 320,resize: 'vertical' }} maxLength={200} autoSize={{ minRows: 3, maxRows: 10 }} onChange={(e)=>{setPaperValue({ ...paperValue,[item.questionId]: e.target.value });}} value={paperValue[item.questionId]}/>
                            <div style={{ position: 'absolute',bottom: 2,right: 255,fontSize: 12,color: '#959CBA' }}>{paperValue[item.questionId]?.length || 0}/200</div>
                          </div>
                        </div>
                      </div>
                      {
                        index < questions.length - 1 && <Divider style={{ margin: 0 }} dashed/>
                      }
                    </React.Fragment>
                  );
                }
              })
            }
          </div>
          <Divider style={{ margin: 0 }}/>
          <div className={styles.title}><span>结束语参考话术</span></div>
          <Divider style={{ margin: 0 }}/>
          <div className={styles.content}>{paperInfo.paperFooter}</div>
          <div style={{ height: 6,background: '#F3F4F7' }}></div>
          <Divider style={{ margin: 0 }}/>
          <div className={styles.title}><span>推送短信</span></div>
          <Divider style={{ margin: 0 }}/>
          <div style={{ padding: '0 24px 12px' }}>
            {
              msgInfo.length > 0 ? msgInfo.map((item,index)=>{
                return (
                  <React.Fragment key={index}>
                    <div style={{ padding: '16px 0' }}>
                      <Checkbox value={item.msgId} checked={item.msgId === msgValue} onChange={(e)=>{
                        if(e.target.checked){
                          setMsgValue(e.target.value);
                        }else{
                          setMsgValue(undefined);
                        }
                      }}>{item.msgTitle}</Checkbox>
                      <div style={{ marginTop: 16,color: '#61698C',fontSize: 14 }}>{item.msgInfo}</div>
                    </div>
                    {
                      index < 1 && <Divider style={{ margin: 0 }} dashed/>
                    }
                  </React.Fragment>
                );
              }) : <div style={{ height: 80,color: '#1A2243',display: 'flex',justifyContent: 'center',alignItems: 'center' }}>暂未配置短信模板</div>
            }
          </div>
        </Scrollbars>
      </Modal>
    </div>
  );
}
export default connect(({ global }) => ({
  authorities: global.authorities,
  sysParam: global.sysParam,
}))(CallInfo);
