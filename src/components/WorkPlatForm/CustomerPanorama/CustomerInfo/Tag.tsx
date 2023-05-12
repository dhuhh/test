import { Card, Col, Row, Popover } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { QueryCusLabel } from '$services/newProduct';
import dobule_right_arrow from '$assets/newProduct/customerPanorama/dobule_right_arrow.png';
import { getTagHoverResponseList } from '../../../../services/customer/customerTag.js'
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import styles from './index.less';
import { history } from 'umi';

type Props = Readonly<{
  customerCode: string,
  clickSensors: (ax_button_name: string) => void,
}>

interface State {
  hotLabels: any[],
  content: any[],
}

const Tag: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    hotLabels: [],
    content: [],
  })

  useEffect(() => {
    QueryCusLabel({
      cusNo: customerCode,
      userId: 0,
    }).then((res: IObject) => {
      const { records = [] } = res;
      let hotLabels: any[] = records.filter((item: IObject) => item.type === '1').slice(0, 5);
      // setState({ ...state, hotLabels });
      let hoverId = ''
      hotLabels.map((item) => {
        hoverId = hoverId ? hoverId + ',' + item.id : item.id
      })
      getTagHoverResponseList({
        tagId: hoverId ? hoverId : '-1'
      }).then((res: any) => {
        setState({ ...state, content: res.records,hotLabels })
      })
    });

  }, [])

  const toCustomerPortrait = () => {
    newClickSensors({
      third_module: "客户概况",
      ax_button_name: "标签入口点击次数",
    }); 
    history.push(`/customerPanorama/customerPortrait?customerCode=${customerCode}`);
  }

  const { hotLabels = [] } = state;
  const { customerCode = '' } = props;
  return (
    <Card
      className={`ax-card ${styles.card}`}
      style={{ height: '100%' }}
      bordered={false}
      bodyStyle={{ padding: '0 20px', color: '#1A2243' }}
      title={<div className="ax-card-title" style={{ color: '#1A2243' }}>标签</div>}
      extra={<div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#1A2243' }} onClick={toCustomerPortrait}>
        <span style={{ marginRight: 4 }}>全部标签</span>
        <img src={dobule_right_arrow} alt='' />
      </div>}
    >
      <div>
        {
          hotLabels.map((item, index) => (
            // <Col key={index} span={12}>
            index < 16 ?
              (<Popover content={state.content.filter(items=>items.tagId==item.id)[0]['tagDesc']} trigger="hover" key={item.id} arrowPointAtCenter={true} placement='top' overlayClassName={styles.proverStyle}>
                <span className={styles.pro_btn} style={{ background: '#fff', display: 'inline-block', height: '28px', borderRadius: 2, padding: '4px 6px', lineHeight: '20px', fontSize: 12, color: '#61698C', marginRight: 10, marginBottom: 10, width: 'fit-content', cursor: 'default', border: '1px solid #DFE1EA' }}>{item.name}</span>
              </Popover>) :
              <span>...</span>
            // </Col>
          ))
        }
      </div>
    </Card>
  );
};
export default Tag;
