import React,{ useState ,useEffect } from 'react';
import { Tabs,message ,Divider,Steps ,Tooltip } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import wrongImg from '$assets/incidentialServices/wrong@2x.png';
import finishImg from '$assets/incidentialServices/finish@2x.png';
import commonArrow from '$assets/incidentialServices/common_arrow.png';
import downArrow from '$assets/incidentialServices/down_arrow.png';
import questionMark from '$assets/newProduct/customerPortrait/question-mark.png';
import { IntrptCustV2Detail ,IntrptCustV2DetailHis } from '$services/incidentialServices';
const { TabPane } = Tabs;
const { Step } = Steps;

function InterruptInfo(props) {
  const [tabKey,setTabKey] = useState('0');
  const [stepInfo,setStepInfo] = useState([]);
  const [stepInfoHis,setStepInfoHis] = useState([]);
  const [stepData,setStepData] = useState([]);
  const [stepHisVisble,setStepHisVisble] = useState({});
  const stepItem = (index)=>{
    return <div style={{ width: 32,height: 32,background: '#E1E2E7',borderRadius: '50%',color: '#fff',fontSize: 14,display: 'table-cell',verticalAlign: 'middle' }}>{index}</div>;
  };
  useEffect(() => {
    intrptCustV2Detail();
    intrptCustV2DetailHis();
    if(props.type === 5){
      setStepData([{ id: '301',note: '产品与客户风险匹配确认' },{ id: '302',note: '基金购买金额设置' },{ id: '303',note: '基金购买完成' }]);
    }else if(props.type === 6){
      setStepData([{ id: '601',note: '入金失败' }]);
    }else if(props.type === 7){
      setStepData([{ id: '701',note: '进入业务开通模块' },{ id: '702',note: '权限开通资格' },{ id: '703',note: '账户信息检查通过' },{ id: '704',note: '签署完成' }]);
    }else if(props.type === 8){
      if(props.fundType === '8'){
        setStepData([{ id: '801',note: '适当性匹配' },{ id: '802',note: '协议签署页' },{ id: '803',note: '资金转入设置' }]);
      }else{
        setStepData([{ id: '811',note: '适当性匹配' },{ id: '812',note: '协议签署页' },{ id: '813',note: '定投设置页' }]);
      }
    }else{
      setStepData([{ id: '201',note: '订阅产品页' },{ id: '202',note: '适当性匹配确认页' },{ id: '203',note: '确认订单页' },{ id: '204',note: '点击确认签署或购买' },{ id: '205',note: '达成预签约订单' },{ id: '206',note: '生成有效订单' }]);
    }
  },[]);
  const intrptCustV2Detail = ()=>{
    IntrptCustV2Detail({ intId: props.custNo }).then(res=>{
      const { records } = res;
      setStepInfo(records);
    }).catch(err => message.error(err.note || err.message));
  };
  const intrptCustV2DetailHis = ()=>{
    IntrptCustV2DetailHis({ intId: props.custNo }).then(res=>{
      const { records } = res;
      let obj = {},newArr = [];
      records.forEach(item=>{
        //根据对象的属性是唯一的，将值作为对象的属性名
        if(!obj[item.zdsj]){
          var arr = [];
          arr.push(item);
          newArr.push(arr);
          obj[item.zdsj] = item;
        }else{
          newArr.forEach((value,index)=>{
            //如果已经存在  就循环新组的值将值插入属性相同的数组里   为了防止重复添加   只要和第一个比较就可以了
            if(value[0].zdsj === item.zdsj){
              value.push(item);
            }
          });
        }
      });
      let visibleObj = {};
      newArr.forEach((item,index)=>{
        if(index === 0){
          visibleObj[index] = true;
        }else{
          visibleObj[index] = false;
        }
      });
      setStepInfoHis(newArr);
      setStepHisVisble(visibleObj);
    }).catch(err => message.error(err.note || err.message));
  };
  const download = () => {
    const { sysParam } = props;
    const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
    // window.open(`${serverName}/OperateProcessor?Column=WJ&PopupWin=false&Table=Entity_YQYDDCZZY&operate=Download&&Type=Attachment&ID=1`);
    window.location.href = `${serverName}/OperateProcessor?Column=WJ&PopupWin=false&Table=Entity_YQYDDCZZY&operate=Download&&Type=Attachment&ID=1`;
  };
  return (
    <div className={styles.tabsBox}>
      <Tabs className={styles.tabs} onChange={(tabKey)=>{setTabKey(tabKey);}} activeKey={tabKey}>
        <TabPane tab='本次中断' key='0'>
          {
            props.type !== 6 ? stepInfo.map((item,index)=>{
              return (
                <div className={styles.tabItem} key={index}>
                  <div className={styles.tableHeader}>
                    <div>
                      <span>{props.type === 8 ? '策略名称' : '产品名称'}</span>
                      <span>{item.cpmc}</span>
                    </div>
                    <div>
                      <span>{props.type === 8 ? '基金投顾类型' : '产品代码'}</span>
                      <span>{props.type === 8 ? (props.fundType === '8' ? '基金投顾购买' : '基金投顾定投') : item.cpdm}</span>
                    </div>
                  </div>
                  <Divider style={{ margin: 0 ,background: '#EAECF2' }}/>
                  <div className={styles.tableContent}>
                    <Steps current={item.zdjd - 1} labelPlacement='vertical' size='small' className={styles.prodSteps}>
                      {
                        stepData.map((item1,index)=>{
                          return (
                            <Step title={item1.note} status={item.zdjd === item1.id && !(item.zdjd === '206' && item.yzdjd !== '') && item.zdjd !== '303' ? 'error' : item.zdjd >= item1.id ? 'finish' : 'wait'} description={[item.zdjd,item.yzdjd].includes(item1.id) ? (
                              <>
                                {item1.id === '205' && (
                                  <div style={{ fontSize: 14,color: '#61698C',paddingTop: 4,whiteSpace: 'normal',wordBreak: 'break-all' }}>{item.zdyy}<span style={{ position: 'relative' }}>
                                    <Tooltip placement="topLeft" title={<><div>客户因为佣金模板问题导致无法正常签约，经客户确认签署了预签约订单，请为该客户调整佣金模板，完成后该预签约订单第二天自动生成有效订单。</div><div style={{ marginTop: 8,color: '#244FFF',textDecoration: 'underline',cursor: 'pointer' }} onClick={download}>预签约订单原因及操作指引 (下载)</div></>} overlayClassName={styles.tooltip} trigger='click' getPopupContainer={triggerNode => triggerNode.parentNode}>
                                      <img style={{ width: 15, marginTop: -2, marginLeft: 2 ,cursor: 'pointer' }} src={questionMark} alt='' />
                                    </Tooltip>
                                  </span></div>
                                )}<div style={{ paddingTop: 6 }}>{item.zdjd === item1.id ? item.zdsj : item.yzdsj}</div>
                              </>
                            ) : ''} icon={item.zdjd - item1.id >= 0 ? <img src={(item.zdjd === item1.id) && !(item.zdjd === '206' && item.yzdjd !== '') && item.zdjd !== '303' ? wrongImg : finishImg} alt='' style={{ width: 32 }} /> : stepItem(index + 1)} key={item1.id}/>
                          );
                        })
                      }
                    </Steps>
                  </div>
                </div>
              );
            }) : (
              <div style={{ display: 'flex' ,flexWrap: 'wrap' }}>
                {
                  stepInfo.map((item,index)=>{
                    return (
                      <div style={{ textAlign: 'center',marginRight: 32,marginBottom: 24 ,width: 250 }}>
                        <img src={wrongImg} alt='' style={{ width: 32 }} />
                        <div style={{ fontSize: 16,color: '#EC3A48',marginTop: 6,marginBottom: 2 }}>入金失败</div>
                        <div style={{ fontSize: 14,color: '#61698C',marginBottom: 6 }}>{item.zdyy}</div>
                        <div style={{ fontSize: 12,color: '#959CBA' }}>{item.zdsj}</div>
                      </div>
                    );
                  })
                }
              </div>
            )
          }
        </TabPane>
        <TabPane tab='历史中断' key='1'>
          {
            stepInfoHis.map((item,index)=>{
              return (
                <div key={index}>
                  <div style={{ display: 'flex',alignItems: 'center',margin: '8px 0 24px 0',cursor: 'pointer' }} onClick={()=>{setStepHisVisble({ ...stepHisVisble,...{ [index]: !stepHisVisble[index] } });}}>
                    <img src={stepHisVisble[index] ? downArrow : commonArrow} alt='' style={{ width: 16 ,height: 16 }}/>
                    <div style={{ fontSize: 14,color: '#61698C',paddingRight: 8,flexShrink: 0 }}>{item[0].zdsj}</div>
                    <Divider style={{ margin: 0 }}/>
                  </div>
                  {
                    props.type !== 6 ? stepHisVisble[index] && item.map((item1,index1)=>{
                      return (
                        <div className={styles.tabItem} key={index1}>
                          <div className={styles.tableHeader}>
                            <div>
                              <span>{props.type === 8 ? '策略名称' : '产品名称'}</span>
                              <span>{item1.cpmc}</span>
                            </div>
                            <div>
                              <span>{props.type === 8 ? '基金投顾类型' : '产品代码'}</span>
                              <span>{props.type === 8 ? (props.fundType === '8' ? '基金投顾购买' : '基金投顾定投') : item1.cpdm}</span>
                            </div>
                          </div>
                          <Divider style={{ margin: 0 ,background: '#EAECF2' }}/>
                          <div className={styles.tableContent}>
                            <Steps current={item1.zdjd - 1} labelPlacement='vertical' size='small' className={styles.prodSteps}>
                              {
                                stepData.map((item2,index2)=>{
                                  return (
                                    <Step title={item2.note} status={item1.zdjd === item2.id && !(item1.zdjd === '206' && item1.yzdjd !== '') && item1.zdjd !== '303' ? 'error' : item1.zdjd >= item2.id ? 'finish' : 'wait'} description={[item1.zdjd,item1.yzdjd].includes(item2.id) ? (
                                    <>
                                      {item2.id === '205' && (
                                        <div style={{ fontSize: 14,color: '#61698C',paddingTop: 4,whiteSpace: 'normal',wordBreak: 'break-all' }}>{item1.zdyy}<span style={{ position: 'relative' }}>
                                          <Tooltip placement="topLeft" title={<><div>客户因为佣金模板问题导致无法正常签约，经客户确认签署了预签约订单，请为该客户调整佣金模板，完成后该预签约订单第二天自动生成有效订单。</div><div style={{ marginTop: 8,color: '#244FFF',textDecoration: 'underline',cursor: 'pointer' }} onClick={download}>预签约订单原因及操作指引 (下载)</div></>} overlayClassName={styles.tooltip} trigger='click' getPopupContainer={triggerNode => triggerNode.parentNode}>
                                            <img style={{ width: 15, marginTop: -2, marginLeft: 2 ,cursor: 'pointer' }} src={questionMark} alt='' />
                                          </Tooltip>
                                        </span></div>
                                      )}<div style={{ paddingTop: 6 }}>{item1.zdjd === item2.id ? item1.zdsj : item1.yzdsj}</div>
                                    </>
                                    ) : ''} icon={item1.zdjd - item2.id >= 0 ? <img src={item1.zdjd === item2.id && !(item1.zdjd === '206' && item1.yzdjd !== '') && item1.zdjd !== '303' ? wrongImg : finishImg} alt='' style={{ width: 32 }} /> : stepItem(index2 + 1)} key={item2.id}/>
                                  );
                                })
                              }
                            </Steps>
                          </div>
                        </div>
                      );
                    }) : (
                      <div style={{ display: 'flex' ,flexWrap: 'wrap' }}>
                        {
                          stepHisVisble[index] && item.map((item1,index1)=>{
                            return (
                              <div style={{ textAlign: 'center',marginRight: 32,marginBottom: 24 ,width: 250 }} key={index1}>
                                <img src={wrongImg} alt='' style={{ width: 32 }} />
                                <div style={{ fontSize: 16,color: '#EC3A48',marginTop: 6,marginBottom: 2 }}>入金失败</div>
                                <div style={{ fontSize: 14,color: '#61698C',marginBottom: 6 }}>{item1.zdyy}</div>
                                <div style={{ fontSize: 12,color: '#959CBA' }}>{item1.zdsj}</div>
                              </div>
                            );
                          })
                        }
                      </div>
                    )
                  }
                </div>
              );
            })
          }
        </TabPane>
      </Tabs>
    </div>
  );
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(InterruptInfo);
