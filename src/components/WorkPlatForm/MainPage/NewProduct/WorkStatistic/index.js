import React ,{ useState,useEffect }from 'react';
import { Tabs,Modal ,Divider ,Button ,DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.less';
import Staff from './Staff';
import Department from './Department';
const { TabPane } = Tabs;

export default function Index(props) {
  const [tabKey,setTabKey] = useState('0');
  const [tjDateType,setTjDateType] = useState(1);
  const [tjDate,setTjDate] = useState([moment().startOf('year'), moment()]);
  const [mode,setMode] = useState(['month', 'month']);
  const [auth,setAuth] = useState([]);

  useEffect(()=>{
    setAuth(JSON.parse(sessionStorage.getItem('allMenuRoutes')));
    if(JSON.parse(sessionStorage.getItem('allMenuRoutes')).find(item=>item.objectDescription === '我的工作统计')?.qx !== '1'){
      setTabKey('1');
    }
  },[]);

  const handleTjDateType = (tjDateType) => {
    setTjDateType(tjDateType);
    if (tjDateType === 1) {
      setMode(['month', 'month']);
    } else {
      setMode(['date', 'date']);
    }
  };
  const handlePanelChange = (tjDate, mode) => {
    setTjDate(tjDate.sort((a, b) => a.format('YYYYMMDD') - b.format('YYYYMMDD')));
    if (tjDateType === 2) {
      setMode([mode[0], mode[1]]);
    } else {
      setMode([mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]);
    }
  };
  const Props = {
    tjDate,
    tjDateType,
  };
  return (
    <div className={styles.tabsBox}>
      <Tabs className={styles.tabs} onChange={(tabKey)=>setTabKey(tabKey)} activeKey={tabKey} tabBarExtraContent={<div style={{ position: 'relative' }} className={styles.searchBox}>
        <span className={styles.label}>统计区间</span>
        <Button className={`${styles.button} ${tjDateType === 1 ? styles.activeBtn : ''}`} onClick={()=>handleTjDateType(1)}>按月</Button>
        <Button className={`${styles.button} ${tjDateType === 2 ? styles.activeBtn : ''}`} onClick={()=>handleTjDateType(2)}>按日</Button>
        <DatePicker.RangePicker
          mode={mode}
          allowClear={false}
          value={tjDate}
          className={styles.rangePicker}
          dropdownClassName={`${styles.calendar} m-bss-range-picker`}
          style={{ width: '264px' }}
          placeholder={['开始日期', '结束日期']}
          format={tjDateType === 1 ? "YYYY-MM" : "YYYY-MM-DD"}
          separator='至'
          disabledDate={(current) => current && current > moment().endOf('day')}
          // getCalendarContainer={(trigger) => trigger.parentNode}
          onChange={tjDate=>setTjDate(tjDate)}
          onPanelChange={handlePanelChange}
        />
      </div>}>
        {
          auth.find(item=>item.objectDescription === '我的工作统计')?.qx === '1' && (
            <TabPane tab='我的工作统计' key='0'>
              <Staff {...Props}/>
            </TabPane>
          )
        }
        {
          auth.find(item=>item.objectDescription === '部门工作统计')?.qx === '1' && (
            <TabPane tab='部门工作统计' key='1'>
              <Department {...Props}/>
            </TabPane>
          )
        }
      </Tabs>
    </div>
  );
}
