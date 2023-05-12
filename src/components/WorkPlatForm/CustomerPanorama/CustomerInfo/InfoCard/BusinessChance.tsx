import { Button, message, Rate,Tooltip,Popover } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { QueryRecommendCustomerFund, QueryBusinessOpportunityList } from '$services/customerPanorama';
import  {GetCustomerContractWillResponse} from '$services/productChance'
import IconSure from '$assets/newProduct/staff/questionMark.png';
import styles from '../index.less';

type Props = Readonly<{
  customerCode: string,
}>

interface State {
  products: any[],
  havePrioritys: any[],
  noPrioritys: any[],
  failPrioritys: any[],
  productChance:any[],
}

const BusinessChance: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    products: [],
    havePrioritys: [],
    noPrioritys: [],
    failPrioritys: [],
    productChance:[],
  });

  useEffect(() => {
    Promise.all([
      QueryRecommendCustomerFund({ customer: props.customerCode }),
      QueryBusinessOpportunityList({ custNo: props.customerCode, type: '5' }),
      QueryBusinessOpportunityList({ custNo: props.customerCode, type: '4' }),
      QueryBusinessOpportunityList({ custNo: props.customerCode, type: '6' }),
      GetCustomerContractWillResponse({customerNO:props.customerCode}),
    ]).then((res: any[]) => {
      const [res1, res2, res3,res4,res5] = res;
      const { records: records1 = [] } = res1;
      const { records: records2 = [] } = res2;
      const { records: records3 = [] } = res3;
      const { records: records4 = [] } = res4;
      const { records: records5 = [] } = res5;

      setState({
        ...state,
        products: records1,
        noPrioritys: records2,
        havePrioritys: records3,
        failPrioritys: records4,
        productChance:records5,
      });
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])





  return (
    <div style={{ color: '#1A2243' }}>
      <div style={{ padding: '0 0 0 20px' }}>
        <div style={{ margin: '8px 0 0', fontWeight: 'bold' }}>已开通业务</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {
            state.havePrioritys.map((item, index) => <Button key={index} className={`${styles.button}`}>{item.typeName}</Button>)
          }
        </div>
        <div style={{ margin: '32px 0 0' }}>
          <div style={{ fontWeight: 'bold' }}>有资格未开通业务</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
              state.noPrioritys.map((item, index) => <div key={index} className={styles.noPrioritysTag}>{item.typeName}</div>)
            }
          </div>
        </div>
        <div style={{ margin: '32px 0 0' }}>
          <div style={{ fontWeight: 'bold' }}>未达标业务</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
              state.failPrioritys.map((item, index) => <div key={index} className={styles.noPrioritysTag}>{item.typeName}</div>)
            }
          </div>
        </div>
      </div>
      <div>
        <div style={{ margin: '32px 0 12px 20px', fontWeight: 'bold' }}>适合产品：</div>
        {
          state.products.map((item: any, index: number) => (
            <div key={index} className={styles.productCard}>
              <div>{item.name}（{item.code}）</div>
              <div style={{ margin: '10px 0 4px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ padding: '2px 8px', fontSize: 12, color: '#FFF', background: '#0E8AFF', cursor: 'default', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>推荐理由</div>
                <Rate disabled value={item.priority} style={{ fontSize: 14, color: '#FCAC01' }} className={styles.rate} />
              </div>
              <div style={{ fontSize: 12, color: '#61698C', lineHeight: '22px' }}>{item.reason}</div>
            </div>
          ))
        }
      </div>
      <div>
        <div style={{ margin: '32px 0 12px 20px', fontWeight: 'bold' }}>产品与签约意愿：
        <Popover arrowPointAtCenter={true} placement="bottomRight"overlayClassName={styles.isShowPover}  content={<span>全提佣潜力模型依据客户最近一段时间的交易风格进行评估，分值越高代表客户进行全提佣签约可能性越大，最高为1</span>} trigger="click">
          <span style={{ position: 'relative', display: 'inline-block', width: '16px',top:'-1px', left: '-12px', margin: '0 4px' }}><img className='iconSure' src={IconSure} alt='' /></span>
        </Popover>
        </div>
        {
          state.productChance.length>0?state.productChance.slice(0,3).map((item: any, index: number) => (
            <div key={index} className={styles.productCard}>
              <div>{item.productName}（{item.productCode}）</div>
              <div style={{ margin: '10px 0 4px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ padding: '2px 8px', fontSize: 12, color: '#FC643C',border:'1px solid #FC643C', background: '#fff', cursor: 'default', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>签约意愿:<span style={{marginLeft:'2px'}}>{item.contractWill}</span></div>
              </div>
              <div style={{ fontSize: 12, color: '#61698C', lineHeight: '22px' }}>{item.desc}</div>
            </div>
          )):<div style={{fontWeight:600,marginLeft:'24px'}}>无推荐产品</div>
        }
      </div>
    </div>
  );
};
export default BusinessChance;
