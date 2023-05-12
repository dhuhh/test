import { message, Timeline } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { QueryLifeCycleList } from '$services/customerPanorama';
import styles from '../index.less';

type Props = Readonly<{
  customerCode: string,
}>

interface State {
  lifeCycles: any[],
}

const LifeCycle: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    lifeCycles: [],
  });

  useEffect(() => {
    QueryLifeCycleList({ custNo: props.customerCode }).then((res: any) => {
      const { records = [] } = res;
      setState({ ...state, lifeCycles: records })
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])

  return (
    <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'center', color: '#1A2243' }}>
      <Timeline className={styles.timeLine}>
        {
          state.lifeCycles.map((item, index) => (
            <Timeline.Item key={index} dot={<div style={{ width: 8, height: 8, background: '#244FFF', borderRadius: '50%' }}></div>}>
              <div style={{ fontSize: 16, lineHeight: '20px', marginBottom: 4, color: '#1A2243' }}>{item.srcName}</div>
              <div style={{ fontSize: 12, lineHeight: '18px', color: '#959CBA' }}>{item.date}</div>
            </Timeline.Item>
          ))
        }
      </Timeline>
    </div>
  );
};
export default LifeCycle;
