import { message } from 'antd';
import React ,{ useEffect,useState }from 'react';
import profileImg from '$assets/incidentialServices/defaultAvatar-man@2x.png';
import styles from './index.less';
import { FetchIntrptCustBasicInfo } from '$services/incidentialServices';

export default function ProdCustInfo(props) {
  const [custInfo,setCustInfo] = useState({});
  useEffect(() => {
    intrptCustV2BasicInfo();
  },[]);
  const intrptCustV2BasicInfo = ()=>{
    FetchIntrptCustBasicInfo({ intId: props.custNo }).then(res=>{
      const { records = [] } = res;
      setCustInfo(records[0] || {});
      if(props.updateFlag === '是'){
        window.opener.postMessage({ action: 'updateFlag' }, '*');
      }
    }).catch(err => message.error(err.note || err.message));
  };
  return (
    <div className={styles.prodCustInfo}>
      <div className={styles.profileInfo} >
        <img src={profileImg} alt='' ></img>
        <div>{custInfo.custNm}</div>
        <div>客户号: {custInfo.custNo}</div>
      </div>
      <div style={{ flex: 1 ,paddingLeft: document.body.clientWidth > 1450 ? 55 : 20 }} className={styles.detailInfo}>
        <div className={styles.detailInfoItem}>
          {
            [5,6,7].includes(props.type) && (
              <div>
                <span>客户等级</span>
                <span>{custInfo.custLv}</span>
              </div>
            )
          }
          <div>
            <span>手机号码</span>
            <span>{custInfo.custPhn}</span>
          </div>
          <div>
            <span>证件编号</span>
            <span>{custInfo.idcard}</span>
          </div>
          <div>
            <span>开户渠道</span>
            <span>{custInfo.accChnl}</span>
          </div>
          <div>
            <span>风险评测结果</span>
            <span>{custInfo.risk}</span>
          </div>
        </div>
        <div className={styles.detailInfoItem}>
          {
            props.type === 5 && (
              <div>
                <span>客户类型</span>
                <span>{custInfo.custTp}</span>
              </div>
            )
          }
          <div>
            <span>客户开户日期</span>
            <span>{custInfo.accDate}</span>
          </div>
          <div>
            <span>客户开户营业部</span>
            <span>{custInfo.accOrg}</span>
          </div>
          <div>
            <span>客户存管银行</span>
            <span>{custInfo.accBank}</span>
          </div>
          <div>
            <span>资金账号</span>
            <span>{custInfo.accNo}</span>
          </div>
          {
            [6,7].includes(props.type) && (
              <div>
                <span></span>
                <span></span>
              </div>
            )
          }
        </div>
        {
          [8].includes(props.type) && (
            <div className={styles.detailInfoItem}>
              <div>
                <span>调研问卷结果</span>
                <span>{`投资品种: ${custInfo.investmentType} 投资期限: ${custInfo.investmentLimit}`}</span>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}
