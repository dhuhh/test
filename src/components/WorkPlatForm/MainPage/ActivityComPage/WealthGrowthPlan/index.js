import React, { useState } from 'react';
import wealthLeftSmall from '$assets/activityComPage/wealthLeftSmall.png';
import wealthRight from '$assets/activityComPage/wealth-right.png';
import Embranchment from './embranchment';
import Person from './person';
import styles from './index.less';
import { Card , Tabs } from 'antd';

export default function WealthGrowthPlan(props){

  const [activeKey , setActiveKey ] = useState('embranchment');

  const renderTab = (tabString, tabKey) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={ activeKey === tabKey ? styles.tab_active : styles.tab_unactive}>
        <div style={{ lineHeight: '41px' , fontSize: 18 }} >{tabString}</div>
      </div>
    );
  };
  return (
    <React.Fragment>
      <Card className="ax-card" bodyStyle={{ padding: 0 , minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
        <div style={{ background: "linear-gradient(270deg, #3C91FF 0%, #4BCAFF 100%)" , maxHeight: 216 ,height: 216 }}>
          <div style={{ width: 'auto' , position: 'absolute' , top: 0 , left: 0 , zIndex: 2 }}>
            <img src={wealthLeftSmall} alt=""/>
          </div>
          <div style={{ width: 'auto' , position: 'absolute' , top: 0 , right: 0 ,zIndex: 1 }}>
            <img src={wealthRight} alt="" />
          </div>
        </div>
        <div style={{ padding: '0 24px',marginTop: -40 }}>
          <Tabs style={{ zIndex: 2 }} className={styles.tabs} activeKey={activeKey} onChange={activeKey => setActiveKey(activeKey)}>
            <Tabs.TabPane tab={renderTab('分支机构数据排行', 'embranchment')} key='embranchment'>
              <Embranchment />
            </Tabs.TabPane>
            <Tabs.TabPane tab={renderTab('个人活动数据排行', 'person')} key='person'>
              <Person />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Card>
    </React.Fragment>
  );

}