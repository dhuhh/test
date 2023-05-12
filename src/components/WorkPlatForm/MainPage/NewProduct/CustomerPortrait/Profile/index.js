import React, { Component } from 'react';
import { Tooltip } from 'antd';
import styles from './index.less';
import { QueryCusInfo } from '$services/newProduct';
import lv1 from '$assets/newProduct/customerPortrait/V12@2x.png';
import lv2 from '$assets/newProduct/customerPortrait/V22@2x.png';
import lv3 from '$assets/newProduct/customerPortrait/V32@2x.png';
import lv4 from '$assets/newProduct/customerPortrait/V42@2x.png';
import lv5 from '$assets/newProduct/customerPortrait/V52@2x.png';
import lv6 from '$assets/newProduct/customerPortrait/V62@2x.png';
import lv7 from '$assets/newProduct/customerPortrait/V72@2x.png';
export default class Profile extends Component {
  state = {
    cusInfo: {},
    date: '',
  };
  componentDidMount() {
    QueryCusInfo({
      cusNo: this.props.cusCode,
    }).then(res => {
      this.setState({
        cusInfo: res.records[0],
      });
    });
  }
  render() {
    const cusTypeDictionary={
      '0':'个人',
      '1':'机构',
      '2':'产品',
    }
    const { cusInfo } = this.state;
    const { openAccountDate } = cusInfo;
    let icon = [lv1, lv2, lv3, lv4, lv5, lv6, lv7];
    let year, month, day, date;
    if (openAccountDate) {
      year = openAccountDate.substring(0, 4);
      month = openAccountDate.substring(4, 6);
      day = openAccountDate.substring(6);
      date = `${year}-${month}-${day}`;
    }
    const title = <div>客户开户未满12个月,某月全账户日均净资产达到10000元或累计股基成交金额(含全账户的股票和场内基金成交金额,不含货币ETF、港股通、新三板)达到10000元</div>;
    return (

      <div className={styles.profile}>
        <div>
          <img src={require('$assets/newProduct/customerPortrait/默认头像-男.png')} alt='' style={{ marginTop: '40px' }}></img>
        </div>
        <div className={styles.name}>{cusInfo.name}</div>
        <div className={styles.info}>
          <span style={{ display: cusInfo.sex === '' ? 'none' : 'inline' }}>{cusInfo.sex}</span>
          <span style={{ display: cusInfo.age === '' ? 'none' : 'inline' }}>{cusInfo.age}岁</span>
          <span style={{ display: cusInfo.nation === '' ? 'none' : 'inline' }}>{cusInfo.nation}</span>
          <span style={{ display: cusInfo.country === '' ? 'none' : 'inline' }}>{cusInfo.country}</span>
          {/* <span style={{ display: cusInfo.cusType === '' ? 'none' : 'inline' }}>{cusInfo.cusType === '0' ? '个人' : '机构'}</span> */}
          <span style={{ display: cusInfo.cusType === '' ? 'none' : 'inline' }}>{cusTypeDictionary[cusInfo.cusType]||'--'}</span>
        </div>
        <div className={styles.date}>
          <span>开户日期</span>
          <span>{date}</span>
        </div>
        <div className={styles.time}>股龄{cusInfo.stockAge === '' ? '-' : cusInfo.stockAge}年/客龄{cusInfo.cusAge}年</div>
        <div className={styles.department}>
          {/*<img src={require('$assets/newProduct/customerPortrait/开户营业部@2x.png')} alt='' style={{ marginRight: '5px' }}></img>*/}
          <img src={require('$assets/newProduct/customerPortrait/accountOpeningBusinessDepartment@2x.png')} alt='' style={{ marginRight: '5px' }}></img>
          {cusInfo.department}
        </div>
        <div className={styles.state}>
          <div>
            <img src={icon[this.state.cusInfo.cusLvl - 1]} alt=''></img>
          </div>
          {cusInfo.riskLvl !== '' ? (<span><i></i> {cusInfo.riskLvl}</span>) : ''}
          {cusInfo.isValid === '1' ? (
            <Tooltip title={title} placement='bottom' overlayClassName={styles.invalidPop} align={{ offset: [-68, 10] }}>
              <span style={{ cursor: 'default' }}><i></i> {cusInfo.isValid === '1' ? '有效户' : '无效户'}</span>
            </Tooltip>
          ) : ''}
          {
            cusInfo.status !== '' ? (<span><i></i> {cusInfo.status}</span>) : ''
          }
        </div>
        <div className={styles.line}></div>
      </div>
    );
  }
}
