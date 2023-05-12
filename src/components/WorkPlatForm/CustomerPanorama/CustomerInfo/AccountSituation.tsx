import { Card, Col, Icon, message, Popover, Row } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { Jyhgupdateday } from '$services/newProduct/customerPortrait';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import { QueryAccountInformation,GetProfitDate } from '$services/customerPanorama';
import account_situation_bg1 from '$assets/newProduct/customerPanorama/account_situation_bg1.png';
import account_situation_bg2 from '$assets/newProduct/customerPanorama/account_situation_bg2.png';
import dobule_right_arrow from '$assets/newProduct/customerPanorama/dobule_right_arrow.png';
import account_situation_contribution from '$assets/newProduct/customerPanorama/account_situation_contribution.png';
import account_situation_earning from '$assets/newProduct/customerPanorama/account_situation_earning.png';
import account_situation_position from '$assets/newProduct/customerPanorama/account_situation_position.png';
import account_situation_transaction from '$assets/newProduct/customerPanorama/account_situation_transaction.png';
import styles from './index.less';
import { history } from 'umi';

type Props = Readonly<{
  customerCode: string,
  clickSensors: (ax_button_name: string) => void,
}>

interface State {
  allInfo: any,
  contributions: any,
  positions: any,
  profits: any,
  transactions: any,
  latestDate: string,
}

const AccountSituation: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    allInfo: {},
    contributions: {},
    positions: {},
    profits: {},
    transactions: {},
    latestDate: moment().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    Jyhgupdateday().then((res: any) => {
      const { records: latestDate = moment().format('YYYYMMDD') } = res;
      QueryAccountInformation({
        custNo: customerCode,
        loginAccount: customerCode,
        queryType: '0',
        begindate: moment(latestDate).subtract(1, 'years').format('YYYYMMDD'),
        enddate: moment(latestDate).format('YYYYMMDD'),
      }).then((res: any) => {
        const { result: allInfo = {} } = res;
        // if (records.length) {
        // const allInfo = records[0];
        const { contributions = {}, positions = {}, profits = {}, transactions = {} } = allInfo;
        setState({
          ...state,
          latestDate,
          allInfo,
          contributions,
          positions,
          profits,
          transactions,
        });
        // }
      }).catch((err: any) => message.error(err.note || err.message));
    }).catch((err: any) => {
      GetProfitDate().then((res:any)=>{
        const { date: latestDate = moment().format('YYYYMMDD') } = res.record;
      QueryAccountInformation({
        custNo: customerCode,
        loginAccount: customerCode,
        queryType: '0',
        begindate: moment(latestDate).subtract(1, 'years').format('YYYYMMDD'),
        enddate: moment(latestDate).format('YYYYMMDD'),
      }).then((res: any) => {
        const { result: allInfo = {} } = res;
        // if (records.length) {
        // const allInfo = records[0];
        const { contributions = {}, positions = {}, profits = {}, transactions = {} } = allInfo;
        setState({
          ...state,
          latestDate,
          allInfo,
          contributions,
          positions,
          profits,
          transactions,
        });
        // }
      })
      })
    });
  }, [])

  const { customerCode = ''} = props;
  const { allInfo = {}, contributions = {}, positions = {}, profits = {}, transactions = {} } = state;

  return (
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '0', color: '#1A2243' }}
      title={<div className="ax-card-title" style={{ color: '#1A2243' }}>账户概况</div>}
    >
      <Row type='flex' align='middle' style={{ padding: '0 20px' }}>
        <Col span={11} style={{ display: 'flex', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 38, left: 16 }}>
            <div style={{ lineHeight: '20px', color: '#61698C' }}>总资产</div>
            <div style={{ marginTop: 10 }}>
              <span style={{ color: '#1A2243', fontSize: 22, fontFamily: 'EssenceSansStd-Regular' }}>{allInfo.totalAmount || '--'}</span>
              <span style={{ color: '#1A2243' }}> 万</span>
            </div>
            <div></div>
          </div>
          <div style={{ width: 133, height: 132, backgroundImage: `url(${account_situation_bg1})` }}></div>
          <div style={{ marginLeft: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <div style={{ background: '#F2B24B', width: 8, height: 8, borderRadius: '50%', marginRight: 4 }}></div>
                <div style={{ color: '#61698C' }}>保证金</div>
              </div>
              <div style={{ marginLeft: 12 }}><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{allInfo.bond || '--'}</span><span> 万</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <div style={{ background: '#FF6E30', width: 8, height: 8, borderRadius: '50%', marginRight: 4 }}></div>
                <div style={{ color: '#61698C' }}>净资产</div>
              </div>
              <div style={{ marginLeft: 12 }}><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{allInfo.netAssets || '--'}</span><span> 万</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <div style={{ background: '#09C985', width: 8, height: 8, borderRadius: '50%', marginRight: 4 }}></div>
                <div style={{ color: '#61698C' }}>负债</div>
              </div>
              <div style={{ marginLeft: 12 }}><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{allInfo.liabilities || '--'}</span><span> 万</span></div>
            </div>
          </div>
        </Col>
        <Col span={2} style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 1, height: 100, background: '#EBECF2' }}></div>
        </Col>
        <Col span={11} style={{ position: 'relative' }}>
          <div style={{ width: 132, height: 132, marginLeft: 56, backgroundImage: `url(${account_situation_bg2})` }}></div>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight: 6, color: '#61698C' }}>外部市值</span>
              <Popover trigger='click' content={<div style={{ width: 500 }}>
                <p>沪市总市值=T-2日(T日为发行公告确定的网上申购日）前20个交易日(含T-2日）账户中上海非限售A股股票的日均持有巿值在1万元以上(含1万元)，每一万市值对应1000股申购额度。</p>
                <br />
                <p>深市总市值=T-2日(T日为发行公告确定的网上申购日)前20个交易日(含T-2日）账户中深圳非限售A股股票的日均持有市值在1万元以上(含1万元)，每一万市值对应1000股申购额度。</p>
                <br />
                <p>外部巿值=(沪市总市值+深市总市值)-在安信的前20个交易日股票日均市值(不含场内基金)</p>
              </div>}>
                <Icon type="question-circle" style={{ fontSize: 16, color: '#959CBA', cursor: 'pointer' }} />
              </Popover>
            </div>
            <div>
              <span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 22 }}>{allInfo.EmarketValue || '-'}</span>
              <span> 万</span>
            </div>
          </div>
        </Col>
      </Row>

      <div style={{ height: '1px', border: '1px solid #EBECF2', margin: '14px 20px 3px' }}></div>

      <Row type='flex' style={{ padding: '0 10px' }}>
        <Col className={styles.floatCard}>
          <Row type='flex' justify='space-between' align='middle' style={{ lineHeight: '26px', fontSize: 16, marginBottom: 10 }}>
            <Col>贡献</Col>
            <Col style={{ cursor: 'pointer' }} onClick={() => {
              newClickSensors({
                third_module: "客户概况",
                ax_button_name: "贡献入口点击次数",
              }); 
             history.push(`/customerPanorama/assets?customerCode=${customerCode}`); }}><img src={dobule_right_arrow} alt='' /></Col>
          </Row>
          <Row type='flex' justify='space-between' align='middle' style={{ background: 'linear-gradient(90deg, #F8D89B 0%, #FFEDC7 100%)', padding: '12px 18px 8px 12px', borderRadius: 4 }}>
            <Col>
              <div style={{ paddingBottom: 4, color: '#997623' }}>本月贡献</div>
              <div style={{ color: '#6A5218' }}>
                <span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 18 }}>{contributions.contributionMonth || '--'}</span>
                <span style={{ fontSize: 12 }}> 元</span>
              </div>
            </Col>
            <Col>
              <img src={account_situation_contribution} alt='' />
            </Col>
          </Row>
          <Row style={{ padding: '0 12px', fontSize: 12 }}>
            <Col span={12} style={{ padding: '10px 0' }}>
              <div style={{ paddingBottom: 6, color: '#61698C' }}>本月息费：</div>
              <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{contributions.feeMonth || '--'}</span><span> 元</span></div>
            </Col>
            {
              contributions.nCommission &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>普通账户本月佣金：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{contributions.nCommission || '--'}</span><span> 元</span></div>
              </Col>
            }{
              contributions.lCommission &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>理财账户本月佣金：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{contributions.lCommission || '--'}</span><span> 元</span></div>
              </Col>
            }{
              contributions.xCommission &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>信用账户本月佣金：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{contributions.xCommission || '--'}</span><span> 元</span></div>
              </Col>
            }{
              contributions.qCommission &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>期权账户本月佣金：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{contributions.qCommission || '--'}</span><span> 元</span></div>
              </Col>
            }{
              contributions.jCommission &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>基金投顾本月佣金：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{contributions.jCommission || '--'}</span><span> 元</span></div>
              </Col>
            }
          </Row>
        </Col>

        <Col className={styles.floatCard}>
          <Row type='flex' justify='space-between' align='middle' style={{ lineHeight: '26px', fontSize: 16, marginBottom: 10 }}>
            <Col>交易</Col>
            <Col style={{ cursor: 'pointer' }} onClick={() => { 
              newClickSensors({
                third_module: "客户概况",
                ax_button_name: "交易入口点击次数",
              }); 
             history.push(`/customerPanorama/transaction?customerCode=${customerCode}`); }}><img src={dobule_right_arrow} alt='' /></Col>
          </Row>
          <Row type='flex' justify='space-between' align='middle' style={{ background: 'linear-gradient(90deg, #E4BE77 0%, #F9E3B5 100%)', padding: '12px 18px 8px 12px', borderRadius: 4 }}>
            <Col>
              <div style={{ paddingBottom: 4, color: '#80631D' }}>本月交易量</div>
              <div style={{ color: '#523F12' }}>
                <span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 18 }}>{transactions.volume || '--'}</span>
                <span style={{ fontSize: 12 }}> 万</span>
              </div>
            </Col>
            <Col>
              <img src={account_situation_transaction} alt='' />
            </Col>
          </Row>
          <Row style={{ padding: '0 12px', fontSize: 12 }}>
            <Col span={12} style={{ padding: '10px 0' }}>
              <div style={{ paddingBottom: 6, color: '#61698C' }}>资产净流入：</div>
              <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{transactions.assetInflow || '--'}</span><span> 万</span></div>
            </Col>
            {
              transactions.nVolume &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>普通账户本月交易量：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{transactions.nVolume || '--'}</span><span> 万</span></div>
              </Col>
            }{
              transactions.lVolume &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>理财账户本月交易量：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{transactions.lVolume || '--'}</span><span> 万</span></div>
              </Col>
            }{
              transactions.xVolume &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>信用账户本月交易量：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{transactions.xVolume || '--'}</span><span> 万</span></div>
              </Col>
            }{
              transactions.qVolume &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>期权账户本月交易量：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{transactions.qVolume || '--'}</span><span> 万</span></div>
              </Col>
            }{
              transactions.tgVolume &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>基金投顾本月交易量：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{transactions.tgVolume || '--'}</span><span> 万</span></div>
              </Col>
            }
          </Row>
        </Col>
      </Row>

      <Row type='flex' style={{ padding: '0 10px' }}>
        <Col className={styles.floatCard}>
          <Row type='flex' justify='space-between' align='middle' style={{ lineHeight: '26px', fontSize: 16, marginBottom: 10 }}>
            <Col>收益</Col>
            <Col style={{ cursor: 'pointer' }} onClick={() => { 
              newClickSensors({
                third_module: "客户概况",
                ax_button_name: "收益入口点击次数",
              }); 
             history.push(`/customerPanorama/earning?customerCode=${customerCode}`); }}><img src={dobule_right_arrow} alt='' /></Col>
          </Row>
          <Row type='flex' justify='space-between' align='middle' style={{ background: 'linear-gradient(90deg, #3A7BEC 0%, #6CB2F7 100%)', padding: '12px 18px 8px 12px', borderRadius: 4 }}>
            <Col style={{ color: '#fff' }}>
              <div style={{ paddingBottom: 4 }}>近一年累计收益：</div>
              <div>
                <span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 18 }}>{profits.cumulativeIncome || '--'}</span>
                <span style={{ fontSize: 12 }}> 万</span>
              </div>
            </Col>
            <Col>
              <img src={account_situation_earning} alt='' />
            </Col>
          </Row>
          <Row style={{ padding: '0 12px', fontSize: 12 }}>
            <Col span={12} style={{ padding: '10px 0' }}>
              <div style={{ paddingBottom: 6, color: '#61698C' }}>近一年清仓收益：</div>
              <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{profits.liquidationIncome || '--'}</span><span> 万</span></div>
            </Col>
            <Col span={12} style={{ padding: '10px 0' }}>
              <div style={{ paddingBottom: 6, color: '#61698C' }}>当月总盈亏：</div>
              <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{profits.profitloss || '--'}</span><span> 万</span></div>
            </Col>
            {
              profits.nProfitloss &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>普通账户当月盈亏：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{profits.nProfitloss || '--'}</span><span> 万</span></div>
              </Col>
            }{
              profits.lProfitloss &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>理财账户当月盈亏：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{profits.lProfitloss || '--'}</span><span> 万</span></div>
              </Col>
            }{
              profits.xProfitloss &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>信用账户当月盈亏：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{profits.xProfitloss || '--'}</span><span> 万</span></div>
              </Col>
            }{
              profits.qProfitloss &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>期权账户当月盈亏：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{profits.qProfitloss || '--'}</span><span> 万</span></div>
              </Col>
            }{
              profits.jProfitloss &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>基金投顾当月盈亏：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{profits.jProfitloss || '--'}</span><span> 万</span></div>
              </Col>
            }
          </Row>
        </Col>

        <Col className={styles.floatCard}>
          <Row type='flex' justify='space-between' align='middle' style={{ lineHeight: '26px', fontSize: 16, marginBottom: 10 }}>
            <Col>持仓</Col>
            <Col style={{ cursor: 'pointer' }} onClick={() => {
              newClickSensors({
                third_module: "客户概况",
                ax_button_name: "持仓入口点击次数",
              }); 
             history.push(`/customerPanorama/position?customerCode=${customerCode}`); }}><img src={dobule_right_arrow} alt='' /></Col>
          </Row>
          <Row type='flex' justify='space-between' align='middle' style={{ background: 'linear-gradient(90deg, #244FFF 0%, #839BFF 100%)', padding: '12px 18px 8px 12px', borderRadius: 4 }}>
            <Col style={{ color: '#fff' }}>
              <div style={{ paddingBottom: 4 }}>最新市值：</div>
              <div>
                <span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 18 }}>{positions.marValue || '--'}</span>
                <span style={{ fontSize: 12 }}> 万</span>
              </div>
            </Col>
            <Col>
              <img src={account_situation_position} alt='' />
            </Col>
          </Row>
          <Row style={{ padding: '0 12px', fontSize: 12 }}>
            <Col span={12} style={{ padding: '10px 0' }}>
              <div style={{ paddingBottom: 6, color: '#61698C' }}>近一年清仓次数：</div>
              <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{positions.clearingTimes || '--'}</span><span> 次</span></div>
            </Col>
            <Col span={12} style={{ padding: '10px 0' }}>
              {/* 近一年清仓持有天数修改为近一年交易总次数 */}
              <div style={{ paddingBottom: 6, color: '#61698C' }}>近一年交易总次数：</div>
              <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{positions.holdingDays || '--'}</span><span> 次</span></div>
            </Col>
            {
              positions.nMarValue &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>普通账户市值：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{positions.nMarValue || '--'}</span><span> 万</span></div>
              </Col>
            }{
              positions.lMarValue &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>理财账户市值：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{positions.lMarValue || '--'}</span><span> 万</span></div>
              </Col>
            }{
              positions.xMarValue &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>信用账户市值：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{positions.xMarValue || '--'}</span><span> 万</span></div>
              </Col>
            }{
              positions.qMarValue &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>期权账户市值：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{positions.qMarValue || '--'}</span><span> 万</span></div>
              </Col>
            }{
              positions.jMarValue &&
              <Col span={12} style={{ padding: '10px 0' }}>
                <div style={{ paddingBottom: 6, color: '#61698C' }}>基金投顾市值：</div>
                <div><span style={{ fontFamily: 'EssenceSansStd-Regular', fontSize: 16 }}>{positions.jMarValue || '--'}</span><span> 万</span></div>
              </Col>
            }
          </Row>
        </Col>
      </Row>
    </Card>
  );
};
export default AccountSituation;
