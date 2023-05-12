import React, { Component } from 'react';
import { Tooltip } from 'antd';
import LineChart from '../LineChart';
import AvgChg from '../AvgChg';
import GaugeChart from '../GaugeChart';
import HoldDay from '../HoldDay';
import HoldNum from '../HoldNum';
import RingChart from '../RingChart';
import thumbHeader from '$assets/newProduct/customerPortrait/thumb-header.png';
import smaileHeader from '$assets/newProduct/customerPortrait/smile-header.png';
import warnHeader from '$assets/newProduct/customerPortrait/warn-header.png';
import styles from './index.less';

export default class CustomerDiagnosisCard extends Component {
  state = {
    hasShownDescription: false,
  }
  showNine = false;
  changeShowNine = () => {
    this.showNine = true;
  }

  abstractDic(type) {
    const {
      other,
      fund_type: fundType,
    } = this.props.chartData;
    const {
      bstype,
    } = other;
    let str = '';
    switch (type) {
      case 'avg_chg_mkt':
        return '近一年上证指数收益趋势';
      case 'holding_days':
        return '长线投资和短线投资的平均收益率';
      case 'holding_num':
        return '全量客户不同持股数量近一年最大回撤率';
      case 'top_ind_perc':
        return '买入后板块指数涨幅在前10%的比例';
      case 'top_stk_perc':
        if (fundType === '1') {
          return '买入后基金涨幅在前10%的比例';
        }
        return '买入后证券涨幅在前10%的比例';
      case 'btm_ind_perc':
        return '卖出后板块指数涨幅在后10%的比例';
      case 'btm_stk_perc':
        if (fundType === '1') {
          return '卖出后基金涨幅在前10%的比例';
        }
        return '卖出后证券涨幅在后10%的比例';
      case 'avg_chg_ind':
        str = '股票后所属板块';
        return `${bstype === 1 ? '买入' : '卖出'}后${str}的平均涨幅`;
      case 'avg_chg_fund':
        str = '基金';
        return `${bstype === 1 ? '买入' : '卖出'}后${str}的平均涨幅`;
      case 'fund_aip':
        return '';
      case 'cptl_avl':
        return '近一月账户可用资金走势';
      case 'hld_prd_type':
        return '各类产品收益贡献及单日最高市值';
      default:
        return '';
    }
  }
  renderLevelImg() {
    if (this.props.level === 1) {
      return (
        <img
          className={styles.header}
          src={thumbHeader} alt=''>
        </img>
      );
    } else if (this.props.level === 2) {
      return (
        <img
          className={styles.header}
          src={warnHeader} alt=''>
        </img>
      );
    } else {
      return (
        <img
          className={styles.header}
          src={smaileHeader} alt=''>
        </img>
      );
    }
  }
  formatDate(date) {
    if (!date) {
      return '';
    }
    return date.replace(/-/g, '.');
  }
  buyOrSaleUrl() {
    if (this.props.chartData.other.bstype === 1) {
      return require('$assets/newProduct/customerPortrait/buy_noLine.png');
    }
    return require('$assets/newProduct/customerPortrait/sale_noLine.png');
  }
  redOrGreen9Url() {
    if (this.props.chartData.other.bstype === 1) {
      return require('$assets/newProduct/customerPortrait/red_9_noLine.png');
    }
    return require('$assets/newProduct/customerPortrait/green_9_noLine.png');
  }
  renderChart() {
    if (this.props.type === 'avg_chg_mkt' || this.props.type === 'avg_chg_stk' || this.props.type === 'cptl_avl' || this.props.type === 'in_day') {
      return (
        <LineChart
          type={this.props.type}
          className={styles.lineChart}
          chartData={this.props.chartData}
          changeShowNine={this.changeShowNine}
        />
      );
    } else if (this.props.type === 'fund_aip' || this.props.type === 'avg_chg_ind' || this.props.type === 'avg_chg_fund') {
      return <AvgChg chartData={this.props.chartData} />;
    } else if (this.props.type === 'top_ind_perc' || this.props.type === 'top_stk_perc' || this.props.type === 'btm_ind_perc' || this.props.type === 'btm_stk_perc') {
      return <GaugeChart chartData={this.props.chartData} />;
    } else if (this.props.type === 'holding_days') {
      return <HoldDay chartData={this.props.chartData} />;
    } else if (this.props.type === 'holding_num') {
      return <HoldNum chartData={this.props.chartData} />;
    } else if (this.props.type === 'hld_prd_type') {
      return <><RingChart chartData={this.props.chartData} /><div style={{ height: '6px' }}></div></>;
    }
  }
  showDescription = (e) => {
    this.setState({
      hasShownDescription: !this.state.hasShownDescription,
    });
  }
  render() {
    const { chartData } = this.props;
    return (
      <div className={styles.diagnosisCard}>
        {this.renderLevelImg()}
        <div className={styles.title}>
          {this.props.title}
        </div>
        <div className={styles.line}></div>
        <div className={styles.abstract}>
          <div className={styles.left}>
            {
              this.props.type !== 'in_day' && this.props.type !== 'avg_chg_stk' ? (this.props.type === 'fund_aip' ? (
                <div className={styles.subTitle}>
                  申万中证500增强A <span style={{ fontWeight: 'bold' }}>三种方式投资收益率</span></div>
              ) : (
                  <div>
                    { this.abstractDic(this.props.type)}
                  </div>
                )) : (
                  <><div className={styles.stockName}>
                    {this.props.chartData.other.prd_name}
                    {/* <div className={styles.essLinkArrow} /> */}
                  </div>
                    <div className={styles.stockDate}>
                      {this.formatDate(this.props.chartData.other.busi_date)} {chartData.other.bstype === 1 ? '买入' : '卖出'}
                    </div></>
                )
            }
          </div>
          {
            this.props.type === 'in_day' || this.props.type === 'avg_chg_stk' ? (
              <div className={styles.right}>
                {
                  this.props.chartData.other.bstype ? (
                    <div className={styles.titleRight}>
                      <div>
                        <img alt='' src={this.buyOrSaleUrl()}></img>
                        <div>客户的{(this.props.chartData.other.bstype === 1 || this.props.chartData.other.bstype === '1') ? '买入' : '卖出'}交易点</div>
                      </div>
                      {
                        this.showNine ? (
                          <div>
                            <img alt='' src={this.redOrGreen9Url()}></img>
                            <div>九转{(this.props.chartData.other.bstype === 1 || this.props.chartData.other.bstype === '1') ? '买入' : '卖出'}信号</div>
                          </div>
                        ) : ''
                      }
                    </div>
                  ) : ''
                }
              </div>
            ) : ''
          }

        </div>
        <div className={styles.chart}>
          {this.renderChart()}{/* {this.props.type} */}
        </div>
        <span className={styles.detail}>
          {chartData.desc}
          <span className={styles.description}>
            {
              chartData.explain && chartData.explain !== '' ? (
                <div>
                  <span onClick={this.showDescription} style={{ cursor: 'pointer' }}>
                    指标说明
                  </span>
                  {
                    this.state.hasShownDescription ? (
                      <div className={styles.descriptionLayout}>
                        <div className={styles.descriptionExpand}>
                          {chartData.explain}
                        </div>
                        <div className={styles.descriptionExpandArror} />
                      </div>
                    ) : ''
                  }

                </div>
              ) : ''
            }

          </span>
        </span>
      </div >
    );
  }
}
