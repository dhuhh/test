function Describe() {
  return (
    <div style={{ backgroundColor: '#F6F7FA', padding: '14px 0 16px 12px',fontSize: '13px',color: '#1A2243' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '65px',textAlign: 'right' }}>活动时间:</div>
        <ul style={{ marginLeft: '10px' }}>
          <li>
           2021年4月23日(含) - 2021年7月31日(含)
          </li>
        </ul>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '65px',textAlign: 'right' }}>说明:</div>
        <ul style={{ marginLeft: '10px',lineHeight: '20px' }}>
          <li>1、首次开通：指活动期间首次开通港股通的客户</li>
          <li>2、达到费用支持1：指活动期间首次开通港股通的客户，且开通后月日均港股通保有量达到1万以上的</li>
          <li style={{ textIndent: '1.5em' }}>客户（月日均=每日港股通市值之和/交易日天数，开通当月仅计算开通后的交易日天数）</li>
          <li>3、达到费用支持2：达到费用支持1的客户，且活动期港股通累计成交量达10万人民币上 </li>
          <li>4、开通但尚未满足活动条件：首次开通客户中剔除达到费用支持1的客户</li>
        </ul>
      </div>

    </div>

  );
  
}
export default Describe;