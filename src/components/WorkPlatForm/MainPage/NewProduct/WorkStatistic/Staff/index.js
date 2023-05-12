import React ,{ useEffect,useState }from 'react';
import { Divider ,Tabs ,message } from 'antd';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { GetEventFinishStatResponse ,GetWorkStatResponse } from '$services/newProduct';
import event1 from '$assets/newProduct/workStatistic/event1.png';
import event2 from '$assets/newProduct/workStatistic/event2.png';
import event3 from '$assets/newProduct/workStatistic/event3.png';
import event4 from '$assets/newProduct/workStatistic/event4.png';
import Incomplete from './incomplete';
import Completed from './completed';
import styles from '../index.less';
import PieChart from '../pieChart';
import { Scrollbars } from 'react-custom-scrollbars';
const { TabPane } = Tabs;

export default function Index(props) {
  const [pieData,setPieData] = useState([]);
  // const [pieData,setPieData] = useState([{ name: 'workflow' ,label: '流程',key: 1 },{ name: 'task' ,label: '任务',key: 2 },{ name: 'event' ,label: '事件',key: 3 },{ name: 'message',label: '消息',key: 4 }]);
  const [eventStatistic,setEventStatistic] = useState({});
  const [eventKey,setEventKey] = useState('0');
  const [update,setUpdate] = useState(false);
  useEffect(()=>{
    getEventFinishStatResponse();
    getWorkStatResponse();
  },[props.tjDate,props.tjDateType]);
  //事件统计
  const getEventFinishStatResponse = ()=>{
    GetEventFinishStatResponse({
      // "userId": `${JSON.parse(sessionStorage.user).id}` * 1,
      "dateStart": props.tjDateType === 2 ? props.tjDate[0].format('YYYYMMDD') : moment(props.tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": props.tjDateType === 2 ? props.tjDate[1].format('YYYYMMDD') : moment(props.tjDate[1]).endOf('month').format("YYYYMMDD"),
      "statFlag": 1,
    }).then(res=>{
      setEventStatistic(res.records[0] || {});
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };
  //工作统计饼图
  const getWorkStatResponse = ()=>{
    GetWorkStatResponse({
      // "userId": `${JSON.parse(sessionStorage.user).id}` * 1,
      "dateStart": props.tjDateType === 2 ? props.tjDate[0].format('YYYYMMDD') : moment(props.tjDate[0]).startOf('month').format("YYYYMMDD"),
      "dateEnd": props.tjDateType === 2 ? props.tjDate[1].format('YYYYMMDD') : moment(props.tjDate[1]).endOf('month').format("YYYYMMDD"),
      "statFlag": 1,
    }).then(res=>{
      let data = res.records[0] || {},obj1 = { name: 'workflow' ,label: '流程',key: 1 },obj2 = { name: 'task' ,label: '任务',key: 2 },obj3 = { name: 'event' ,label: '事件',key: 3 },obj4 = { name: 'message',label: '消息',key: 4 };
      Object.keys(data).forEach(item=>{
        if(item.includes('workflow')){
          obj1 = { ...obj1,[item]: data[item] };
        }else if(item.includes('task')){
          obj2 = { ...obj2,[item]: data[item] };
        }else if(item.includes('event')){
          obj3 = { ...obj3,[item]: data[item] };
        }else if(item.includes('message')){
          obj4 = { ...obj4,[item]: data[item] };
        }
      });
      setPieData([obj1,obj2,obj3,obj4]);
      // let data = res.records[0] || {};
      // Object.keys(data).forEach(item=>{
      //   if(item.includes('workflow')){
      //     pieData[0][item] = data[item];
      //   }else if(item.includes('task')){
      //     pieData[1][item] = data[item];
      //   }else if(item.includes('event')){
      //     pieData[2][item] = data[item];
      //   }else if(item.includes('message')){
      //     pieData[3][item] = data[item];
      //   }
      // });
      // setPieData(pieData);
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };
  const Props = {
    update,
    setUpdate,
  };
  return (
    <div className={styles.staff}>
      <Scrollbars style={{ height: 280 }}>
        <div className={styles.staffChart}>
          <div className={styles.pieChart}>
            {
              pieData.map(item=><PieChart item={item} key={item.key}/>)
            }
          </div>
          <Divider type='vertical' style={{ height: 232,margin: 0 }}/>
          <div className={styles.event}>
            <div className={styles.title}>事件统计</div>
            <div className={styles.content}>
              <div style={{ background: `url(${event1}) center center / cover no-repeat`,height: 43,width: 438 }}>事件数: {eventStatistic.eventAmount}</div>
              <div style={{ background: `url(${event2}) center center / cover no-repeat`,height: 43,width: 358 }}>已处理: {eventStatistic.handleEventAmount}  {eventStatistic.handleEventRate}%</div>
              <div style={{ background: `url(${event3}) center center / cover no-repeat`,height: 43,width: 278 }}>线上触达: {eventStatistic.touchEventAmount}  {eventStatistic.touchEventRate}%</div>
              <div style={{ background: `url(${event4}) center center / cover no-repeat`,height: 43,width: 198 }}>客户查看: {eventStatistic.viewedEventAmount}  {eventStatistic.viewedEventRate}%</div>
            </div>
          </div>
        </div>
      </Scrollbars>
      <div className={styles.staffTable}>
        <div style={{ background: '#F3F4F7',height: 8 }}></div>
        <Tabs className={styles.tabs} onChange={(eventKey)=>setEventKey(eventKey)} activeKey={eventKey}>
          <TabPane tab='未完成事件' key='0'>
            <Incomplete {...Props}/>
          </TabPane>
          <TabPane tab='已完成事件' key='1'>
            <Completed {...Props}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
