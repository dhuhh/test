import React, { useState } from 'react';
import { Button, Card, Row , Tabs } from 'antd';
import { history as router } from 'umi';
import { connect } from 'dva';
import Deal from './Deal';
import Record from './Record';
import styles from '../../index.less';

function DealListDetail(props) {
  const { customerCode = '' } = props; // 客户号, 上个页面传过来的数据
  const ecifParam = sessionStorage.getItem('ecifParam');
  const { custCode = '',motId = '' , calendarModel = '' ,importance = '', disorderlyCode = '', custCodeList = '' , crm = '' } = JSON.parse(ecifParam);
  const [activeKey,setActiveKey] = useState('deal');
  const serverName = props.sysParam.filter(item => item.csmc === 'system.c4ym.url')[0].csz;


  const renderTab = (tabString, tabKey) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ lineHeight: '44px' }}>{tabString}</div>
        <div style={{ visibility: tabKey === activeKey ? 'visible' : 'hidden' }} className={styles.tabsInkBars}></div>
      </div>
    );
  };

  const goBack = () =>{

    if(crm === '1'){
      router.push({ pathname: `/newProduct/work/:activeKey` });
    }
    if(crm === '2'){
      router.push({ pathname: `/single/eventComList/index` ,query: { sjid: customerCode } });
    }
    

  };
  return (
    <React.Fragment>
      <Row>
        <Card className="ax-card" bodyStyle={{ paddingBottom: 0, paddingTop: 0, minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
          <div className={styles.dealBack} >
            <Button onClick={()=>{ goBack();}} icon='arrow-left' className={styles.dealBut}>返回上一层</Button>
            <span className={styles.dealSpan}>| 客户不规范身份信息处理</span>
          </div>
          <Tabs className={styles.dealTab} destroyInactiveTabPane activeKey={activeKey} onChange={activeKey => setActiveKey(activeKey)}>
            <Tabs.TabPane tab={renderTab('待处理事件', 'deal')} key='deal' forceRender>
              <Deal custCode={custCode} eventId={customerCode} motId={motId} calendarModel={calendarModel} importance={importance} disorderlyCode={disorderlyCode} custCodeList={custCodeList} crm={crm} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={renderTab('处理记录', 'record')} key='record'>
              <Record sysParam={props.sysParam} custCode={custCode} eventId={customerCode} motId={motId} importance={importance} disorderlyCode={disorderlyCode} custCodeList={custCodeList} serverName={serverName}/>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Row>
    </React.Fragment>
  );
}


export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(DealListDetail);