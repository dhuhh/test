import React ,{ useEffect,useState }from 'react';
import { Table, message, Checkbox, Popover, Icon, Modal, Divider,Spin ,Empty ,Input ,Button } from 'antd';
import TipModal from '../TipModal';
import { GetPaperCC,SavePaper,QueryCallList,QueryPaperList ,GetMsg, OperateAssignIntrptCust } from '$services/incidentialServices';
import Scrollbars from 'react-custom-scrollbars';
import TextArea from 'antd/lib/input/TextArea';
import styles from '../../InterruptCustomer/ProdBreak/index.less';

export default function Index(props) {
  const [visibleTip,setVisibleTip] = useState(false);
  const [content,setContent] = useState('');

  const [saveLoading,setSaveLoading] = useState(false);
  const [recordVisible,setRecordVisible] = useState(false);
  const [paperInfo,setPaperInfo] = useState({});
  const [paperValue,setPaperValue] = useState({});
  const [checkSelect,setCheckSelect] = useState({});
  const [remarkValue,setRemarkValue] = useState({});
  const [msgInfo,setMsgInfo] = useState([]);
  const [msgValue,setMsgValue] = useState(undefined);
  const executeRecord = ()=>{
    getPaperCC();
    getMsg();
  };
  const getPaperCC = ()=>{
    let obj1,obj2,obj3;
    GetPaperCC({
      // intId: '',
      intType: props.type,
    }).then(res=>{
      if(res.code === 2){
        message.info(res.note);
        return;
      }
      setRecordVisible(true);
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
      // intId: '',
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
        intId: props.selectedRowKeys.join(','),
        selectAll: props.selectAll ? 1 : 0,
        uuid: props.data.uuid,
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
          setSaveLoading(false);
          if (props.refresh) { props.refresh(1, 10);};
        });
    }
  };
  const showModal = () => {
    const { data: { uuid = '' }, selectedCount, selectAll, selectedRowKeys } = props;
    if (selectedCount <= 0) {
      Modal.info({ content: '请至少选择一个客户!' });
      return false;
    } else if (selectedCount === 1 && selectAll) {
      Modal.info({ content: '单客户操作请勿全选!' });
      return false;
    } else {
      const Params = {
        uuid: selectedRowKeys.join(','), // 所选客户对应的uid
        asgnTp: 4, // 1.分配；2.转办；3.撤回
        asgnMode: '', // 1.按员工；2.按部门；
        wthrAll: selectAll ? 1 : 0, // 0.非全选；1.全选
        qrySqlId: uuid,
        objNo: '', // 执行人；执行部门
        asgnNum: '', // 客户数
      };
      OperateAssignIntrptCust({ ...Params, asgnParm: '0' }).then((result) => {
        const { code: cxCode = 0 } = result;
        if (cxCode > 0) {
          executeRecord();
        }
      }).catch((error) => {
        setVisibleTip(true);
        setContent(!error.success ? error.message : error.note);
      });
    }
  };
  const width = window.innerWidth || document.clientWidth || document.body.clientWidth;
  const { questions = [] } = paperInfo;
  return (
    <React.Fragment>
      <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c fs14 ml14' style={{ border: 'none' }} onClick={showModal}>执行记录</Button>
      <TipModal visible={visibleTip} content={content} onCancel={()=>{setVisibleTip(false);}} />
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
    </React.Fragment>
  );
}
