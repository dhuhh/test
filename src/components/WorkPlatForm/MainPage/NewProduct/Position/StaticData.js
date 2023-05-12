import React, { useState, useEffect } from 'react';
import { Col, Icon, Row } from 'antd';
import { formatColor, formatThousands, formatDw } from '../Earning/util';
import MyPopover from '../Earning/Common/MyPopover';
import earning from '$assets/newProduct/earing/earning.svg';
import earningTwo from '$assets/newProduct/earing/earningTwo.png';
import styles from './index.less';

export default function(props) {
  const computed = (type, ...rest) => {
    if (type === 'color') {
      const [val = ''] = rest;
      return formatColor(val);
    }
  };

  return (
    <div style={{ background: '#FFF', borderTop: '1px solid #EBECF2', borderBottom: '1px solid #EBECF2' }}>
      <div style={{ margin: '24px 0 0 24px', fontSize: 12 }}>
        <span style={{ color: 'red' }}>*</span>
        <span>提示：统计数据截止至T-1日</span>
      </div>
      <Row style={{ height: 126 }}>
        <Col span={12} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 'calc(50% - 0.5px)', display: 'flex', alignItems: 'center', marginLeft: 24 }}>
            <div>
              <img src={earning} alt='' />
            </div>
            <div style={{ marginLeft: 10 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ paddingRight: 5, lineHeight: '20px' }}>累计收益(元)</span>
                <MyPopover content={<div style={{ color: '#61698C', width: 309 }}>
                  <div style={{ marginBottom: 5 }}>
                    <span style={{ color: '#1A2243', fontWeight: 'bold' }}>累计收益=</span>
                    <span>清仓{props.activeAccount === '4' ? '基金' : '股票'}收益+持仓中的{props.activeAccount === '4' ? '基金' : '股票'}收益</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ color: '#1A2243', fontWeight: 'bold' }}>持仓{props.activeAccount === '4' ? '基金' : '股票'}收益=</span>
                    <span>持仓{props.activeAccount === '4' ? '基金' : '股票'}总盈亏</span>
                  </div>
                  <div style={{ fontSize: 12 }}>※当查看周期不含最近一个交易日时，累计总收益不含持仓{props.activeAccount === '4' ? '基金' : '股票'}收益。</div>
                </div>}>
                  <Icon type="question-circle" style={{ fontSize: 14, color: '#959CBA' }} />
                </MyPopover>
              </div>
              <div className={styles.essenceFont} style={{ fontSize: 24, color: computed('color', props.homeData.total_return || '0') }}>{formatDw(props.homeData.total_return || '0.00')}</div>
            </div>
          </div>
          <div style={{ width: 1, height: 44, background: '#EAECF2' }}></div>
          <div style={{ width: 'calc(50% - 0.5px)', display: 'flex', alignItems: 'center', marginLeft: 24 }}>
            <div style={{ width: 36, height: 36 }}>
              <img style={{ width: '100%', height: '100%' }} src={earningTwo} alt='' />
            </div>
            <div style={{ marginLeft: 10 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ paddingRight: 5, lineHeight: '20px', paddingBottom: 3 }}>清仓收益(元)</span>
                <MyPopover placement='bottom' content={<div style={{ color: '#61698C', width: 309 }}>
                  <div style={{ marginBottom: 10, color: '#1A2243', fontWeight: 'bold' }}>清仓收益是所有清仓周期收益之和，不含持有中{props.activeAccount === '4' ? '基金' : '股票'}周期的收益。</div>
                  <div style={{ fontSize: 12 }}>※收盘时将持仓{props.activeAccount === '4' ? '基金' : '股票'}全部卖出定义为“清仓”，收盘前全部卖出再买入在本功能中不算清仓。</div>
                </div>}>
                  <Icon type="question-circle" style={{ fontSize: 14, color: '#959CBA' }} />
                </MyPopover>
              </div>
              <div className={styles.essenceFont} style={{ fontSize: 24, color: computed('color', props.homeData.close_total_return || '0') }}>{formatDw(props.homeData.close_total_return || '0.00')}</div>
            </div>
          </div>
        </Col>
        <Col span={12} style={{ height: '100%' }}>
          <div style={{ height: '100%', marginRight: 24, boxShadow: '0 0 26px 0 rgba(5, 14, 28, 0.06)', borderRadius: 4, display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flexBasis: '50%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ flex: 1, textAlign: 'right' }}>交易{props.activeAccount === '4' ? '基金' : '股票'}数</span>
              <span style={{ flex: 1, fontSize: 18, color: '#FF6E30', marginLeft: 8 }}>{props.activeAccount === '4' ? props.homeData.trd_fund_num || '0' : props.homeData.trd_stock_num || '0'}</span>
            </div>
            <div style={{ flexBasis: '50%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ flex: 1, textAlign: 'right' }}>交易总次数</span>
              <span style={{ flex: 1, fontSize: 18, color: '#FF6E30', marginLeft: 8 }}>{props.homeData.total_trd_times || '0'}</span>
            </div>
            <div style={{ flexBasis: '50%', height: '50%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <span style={{ flex: 1, textAlign: 'right' }}>清仓次数</span>
              <span style={{ flex: 1, fontSize: 18, color: '#FF6E30', marginLeft: 8 }}>{props.homeData.close_times || '0'}</span>
              <div style={{ width: '50%', position: 'absolute', fontSize: 12, top: 20, left: 0, color: '#61698C', textAlign: 'right' }}>
                <span>(胜率</span>
                <span style={{ color: computed('color', props.homeData.win_rate === -1 ? '0' : props.homeData.win_rate) }}>{(props.homeData.close_times === 0 && props.homeData.win_rate == -1) ? '0.00' : (((props.homeData.close_times === '' || props.homeData.close_times === null) && props.homeData.win_rate == -1) ? '--' : (props.homeData.win_rate * 100)?.toFixed(2))}%</span>
                <span>)</span>
              </div>
            </div>
            <div style={{ flexBasis: '50%', height: '50%', display: 'flex', justifyContent: 'center' }}>
              <span style={{ flex: 1, textAlign: 'right' }}>清仓{props.activeAccount === '4' ? '' : '股'}平均持有天数</span>
              <span style={{ flex: 1, fontSize: 18, color: '#FF6E30', marginLeft: 8 }}>{props.homeData.avg_holding_days || 0}</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

