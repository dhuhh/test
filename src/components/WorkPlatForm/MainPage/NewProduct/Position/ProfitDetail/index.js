import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Button, Card, Col, Icon, message, Modal, Pagination, Popover, Row, Table, Tag, Tooltip } from 'antd';
import { history as router } from 'umi';
import XLSX from 'xlsx';
import * as echarts from 'echarts';
import lodash from 'lodash';
import moment from 'moment';
import MyPopover from '../../Earning/Common/MyPopover';
import { formatColor, formatThousands, formatNum, exportExcel, formatDw } from '../../Earning/util';
import { HisstocksdetailService as Hisstocksdetail, HisfundsdetailService as Hisfundsdetail } from '../services';
import { FindHqDeal4hisStock } from '$services/newProduct';
import styles from './index.less';

export default function ProfitDetail(props) {
  const [homeData, setHomeData] = useState({}); // 页面数据
  const [legendType, setLegendType] = useState('2'); // 折线图tab栏选中
  const [merge, setMerge] = useState(false); // 是否 选中只看卖出
  const [dataSource, setDataSource] = useState([]); // 接口获取的数据
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { customerCode = '', state = {} } = props; // 客户号, 上个页面传过来的数据
  const chart = useRef(null); // 折线图
  const [stockData, setStockData] = useState([]);

  const { latestDate } = state;

  useEffect(() => {
    if (state.activeAccount === '4') {
      setLegendType('1');
    } else {
      const { date = [moment(), moment()] } = state;
      FindHqDeal4hisStock({
        beginDate: moment(lodash.get(state, 'record.open_date', '') || lodash.get(state, 'record.opens[0].open_date', '') || date[1].format('YYYYMMDD')).format('YYYYMMDD'),
        endDate: moment(lodash.get(state, 'record.close_date', '') || lodash.get(state, 'record.opens[0].close_date', '') || date[1].format('YYYYMMDD')).format('YYYYMMDD'),
        secuIntl: `${lodash.get(state, 'record.secu_intl', '')}`,
      }).then(res => {
        const { records = [] } = res;
        setStockData(records);
      });
    }
  }, [state]);

  const fetchData = useCallback(async (payload = {}) => {
    let params = {};
    const { date = [moment(), moment()] } = state;
    if (state.activeAccount === '4') {
      params = {
        accountType: '0',
        loginAccount: customerCode,
        secucode: lodash.get(state, 'record.secu_code', ''),
        secuIntl: `${lodash.get(state, 'record.secu_intl', '')}`,
        ishold: `${lodash.get(state, 'record.is_hold', '') || lodash.get(state, 'record.opens[0].is_hold', 0)}`,
        begindate: lodash.get(state, 'record.open_date', '') || lodash.get(state, 'record.opens[0].open_date', '') || date[1].format('YYYY-MM-DD'),
        enddate: lodash.get(state, 'record.close_date', '') || lodash.get(state, 'record.opens[0].close_date', '') || date[1].format('YYYY-MM-DD'),
        isSell: merge ? '1' : '0',
        current,
        pageSize,
        paging: 1,
        ...payload,
      };
      if (moment(params.begindate) > moment(latestDate)) params.begindate = latestDate;
      if (moment(params.enddate) > moment(latestDate)) params.enddate = latestDate;
      return Hisfundsdetail(params);
    } else {
      params = {
        accountType: state.activeAccount === '2' ? '0' : '1',
        loginAccount: customerCode,
        secucode: lodash.get(state, 'record.secu_code', ''),
        ishold: `${lodash.get(state, 'record.is_hold', '') || lodash.get(state, 'record.opens[0].is_hold', 0)}`,
        begindate: lodash.get(state, 'record.open_date', '') || lodash.get(state, 'record.opens[0].open_date', '') || date[1].format('YYYY-MM-DD'),
        enddate: lodash.get(state, 'record.close_date', '') || lodash.get(state, 'record.opens[0].close_date', '') || date[1].format('YYYY-MM-DD'),
        isSell: merge ? '1' : '0',
        market: lodash.get(state, 'record.market', ''),
        secuIntl: `${lodash.get(state, 'record.secu_intl', '')}`,
        isshort: `${lodash.get(state, 'record.is_short', '') || lodash.get(state, 'record.opens[0].is_short', 0)}`,
        current,
        pageSize,
        paging: 1,
        ...payload,
      };
      if (moment(params.begindate) > moment(latestDate)) params.begindate = latestDate;
      if (moment(params.enddate) > moment(latestDate)) params.enddate = latestDate;
      return Hisstocksdetail(params);
    }
  }, [current, customerCode, latestDate, merge, pageSize, state]);

  try {
    useEffect(() => {
      fetchData().then((res) => {
        const { records = {}, total = 0, records: { trades = [] } } = res;
        setDataSource(trades); setTotal(total); setHomeData(records);
      });
    }, [fetchData]);
  } catch (e) {
    message.error(e.message);
  }

  const computed = (type, ...rest) => {
    if (type === 'color') {
      const [val = ''] = rest;
      return formatColor(val);
    }
  };
  const initChart = useCallback(() => {
    const data = legendType === '1' ? (homeData.closingPrice || homeData.fundNetValue || stockData || [{ date: moment().format('YYYYMMDD'), value: 0 }]).map(item => ({ date: item.date?.replace(/-/g, '') || item.trd_date?.replace(/-/g, ''), value: item.closePrice || item.nav || item.value })) : (homeData.history || [{ busi_date: moment().format('YYYYMMDD'), value: 0 }]).map(item => ({ date: item.busi_date?.replace(/-/g, ''), value: item.value }));
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#FFF',
        borderColor: 'rgba(242, 178, 75, 0.38)',
        borderWidth: 1,
        extraCssText: 'box-shadow: -2px 2px 8px 0px rgba(5, 14, 28, 0.12);',
        textStyle: {
          fontSize: 12,
          color: '#1A2243',
        },
        axisPointer: {
          lineStyle: {
            color: '#F2B24B',
          },
        },
        formatter: (params) => {
          const value0 = Number(lodash.get(params, '[0].value[1]', '0')).toFixed(2);
          const jsx = (
            <div style={{ padding: '5px' }}>
              <div style={{ color: '#74819E' }}>{moment(params[0].name).format('YYYY.MM.DD')}</div>
              <div style={{ padding: '5px 0 0', display: 'flex', alignItems: 'center', color: computed('color', value0) }}>
                {Number(value0) > 0 ? '+' + formatDw(Number(value0)) : formatDw(Number(value0).toFixed(2))}
              </div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 1,
            color: '#D1D5E6',
          },
        },
        axisLabel: {
          interval: 0,
          color: '#61698c',
          formatter: (param) => {
            if (data.length >= 2) {
              if (param == Math.min(...(data.map(item => item.date)))) {
                return `{minFont|${moment(param).format('YYYY.MM.DD')}}`;
                // return param;
              }
              if (param == Math.max(...(data.map(item => item.date)))) {
                return `{maxFont|${moment(param).format('YYYY.MM.DD')}}`;
              }
              return '';
            } else {
              return param;
            }
          },
          rich: {
            minFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 29,
              padding: [0, 0, 0, -0],
            },
            maxFont: {
              fontSize: 12,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 29,
              padding: [0, 0, 0, 0],
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        nameTextStyle: {
          color: '#74819E',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#D1D5E6',
          },
        },
        axisLabel: {
          formatter: value => {
            return formatDw(value);
          },
          color: '#74819E',
        },
      },
      series: [{
        // name: 'TA的',
        data: data.map(item => [item?.date, item?.value || 0]),
        type: 'line',
        showSymbol: false,
        itemStyle: {
          color: '#244FFF',
        },
      }],
    };
    echarts.init(chart.current).setOption(option);
  }, [homeData.closingPrice, homeData.fundNetValue, homeData.history, legendType, stockData]);

  useEffect(() => {
    initChart();
  }, [initChart]);

  const handleLegendClick = (legendType) => {
    setLegendType(legendType);
    initChart();
  };
    // 选中只看卖出
  const handleMergeClick = () => {
    setMerge(!merge);
  };
  // 导出
  const exportTable = () => {
    fetchData({ paging: 0 }).then((res) => {
      const { records: { trades = [] } } = res;
      const dataSource = trades;
      Modal.confirm({
        title: '提示：',
        content: `是否导出数据（共${total}条）？`,
        onOk() {
          let table = [];
          let tableHeader = {};
          let arr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
          let columns = getColumns();
          columns.forEach((item, index) => {
            tableHeader[arr[index]] = item.key;
          });
          table.push(tableHeader);
          dataSource.forEach((item1, index1) => {
            let row = {};
            columns.forEach((item2, index2) => {
              if (item2.hasOwnProperty('render')) {
                if (item2.dataIndex === 'return') {
                  row[arr[index2]] = formatThousands(item1[item2.dataIndex]);
                } else {
                  row[arr[index2]] = item2.render(item1[item2.dataIndex]);
                }
              } else {
                row[arr[index2]] = item1[item2.dataIndex];
              }
            });
            table.push(row);
          });
          let ws = XLSX.utils.json_to_sheet(table, { header: arr.slice(0, columns.length), skipHeader: true });
          let wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws);
          XLSX.writeFile(wb,`${state.activeAccount === '4' ? '基金' : '股票'}盈亏详情数据导出（${moment().format('YYYYMMDD')}）.xlsx`);
        },
      });
    });
  };
  // 分页器操作处理
  const handlePageChange = (current, pageSize) => {
    setCurrent(current); setPageSize(pageSize);
  };
  const getColumns = () => {
    const columns = [
      {
        title: '操作',
        key: '操作',
        dataIndex: 'is_buy',
        render: text => `${text === 1 ? '买入' : '卖出'}`,
      },
      {
        title: '操作时间',
        key: '操作时间',
        dataIndex: 'busi_date',
      },
      {
        title: '发生金额',
        key: '发生金额',
        dataIndex: 'trd_amt',
        render: text => formatDw(Math.round(Number(text) * 100) / 100),
      },
      {
        title: '均价',
        key: '均价',
        dataIndex: 'trd_price',
        render: text => formatDw((Math.round(Number(text) * 1000) / 1000).toFixed(3), 3),
      },
      {
        title: '数量',
        key: '数量',
        dataIndex: 'trd_volume',
        render: text => formatThousands(text).split('.')[0],
      },
      {
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>卖出收益</span>
            <MyPopover placement='bottomRight' content={<div style={{ color: '#1A2243', fontSize: 14, width: 309 }}>
              <div style={{ fontWeight: 'bold', lineHeight: '22px' }}>卖出收益是指卖出实现的收益,每次出收益按持仓成本平均值法计算。</div>
              <div style={{ marginTop: 8, color: '#61698C', fontSize: 12, lineHeight: '18px' }}>
                <div>例如：</div>
                <div>先以1元买入某股票100股,再以2元买入100股，隔日以3元卖出50股。</div>
                <div>本次卖出收益=3*50-(1*100+2*100)/200*50=75元</div>
              </div>
            </div>}><Icon type="question-circle" style={{ color: '#959CBA', fontSize: 14 }} /></MyPopover>
          </div>
        ),
        key: '卖出收益',
        dataIndex: 'return',
        render: (text) => <div style={{ color: computed('color', text) }}>{formatDw(Math.round(Number(text) * 100) / 100)}</div>,
      },
    ];
    return columns;
  };
  return (
    <div style={{ color: '#1A2243', fontSize: 14, background: '#FFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px' }}>
        <Button icon='arrow-left' style={{ color: '#244FFF' }} onClick={() => router.goBack()}>返回上层</Button>
        <span>丨{state.activeAccount === '4' ? '基金' : '股票'}盈亏详情</span>
      </div>
      <Row type='flex' align='middle' style={{ padding: '0 0 16px', margin: '0 24px', borderBottom: '1px solid #EBECF2' }}>
        <Col style={{ height: 40, background: '#F7F8FA', borderRadius: 4, padding: '0 23px', display: 'flex', alignItems: 'center' }}>
          { (state.record?.is_short || lodash.get(state.record, 'opens[0].is_short', 0)) ? <div style={{ width: 38, height: 22, marginRight: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FF6E30', background: 'rgba(255, 110, 48, 0.04)', border: '1px solid #FFBFA3', borderRadius: '3px', fontSize: 12 }}>融券</div> : '' }
          <span style={{ fontWeight: 'bold', padding: '0 8px 0 0' }}>{homeData.prd_name || '-'}</span>
          <span>{homeData.secu_code || '-'}</span>
          { state.activeAccount === '4' ? '' : (
            <React.Fragment>
              {/* <span style={{ margin: '0 32px', color: computed('color', '1.50') }}>1.50</span>
              <span style={{ color: computed('color', '0.20') }}>0.20%</span> */}
            </React.Fragment>
          )}
          {/* <Icon type="right" style={{ margin: '0 0 0 20px' }} /> */}
        </Col>
        <Col style={{ fontSize: 12, margin: '0 17px 0 24px' }}>持仓{homeData.holding_days || '0'}个交易日</Col>
        <Col style={{ fontSize: 12 }}>{homeData.open_date || '-'} 建仓-{homeData.close_date || '-'} 清仓</Col>
      </Row>
      <Row style={{ borderBottom: '1px solid #EBECF2' }}>
        <Col span={12}>
          <div style={{ margin: '36px 50px 36px 24px', boxShadow: '0 0 26px 0 rgba(5, 14, 28, 0.06)', borderRadius: '4px' }}>
            <Row style={{ borderBottom: '1px solid #EBECF2' }}>
              <Col span={12} style={{ padding: '20px 24px' }}>
                <div style={{ marginBottom: 10 }}>
                  <Popover trigger='click' placement='bottomLeft'
                    content={<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#1A2243', fontSize: 14 }}>
                      <div style={{ color: '#61698C', marginTop: 15 }}>累计收益(元)</div>
                      <div style={{ fontSize: 20, margin: '2px 0 10px', color: computed('color', homeData.total_return || '0') }}>{formatDw(homeData.total_return || '0')}</div>
                      <div style={{ width: 33, height: 25, marginBottom: 17, clipPath: 'polygon(0 0, 50% 100%, 100% 0)', background: '#F3F4F7', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold', color: '#61698C', fontSize: 18, position: 'relative', top: '-4px' }}>=</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 140, height: 50, background: 'rgba(240,241,245,0.8)', borderRadius: 6, padding: '7px 0 0 0', textAlign: 'center' }}>
                          <div style={{ color: '#61698C', fontSize: 12 }}>期末持有</div>
                          <div>{formatDw(homeData.end_amt || 0)}</div>
                        </div>
                        <div style={{ width: 20, height: 20, background: 'rgba(240,241,245,0.8)', border: '3px solid #FFF', borderRadius: '50%', color: '#61698C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 -3px', zIndex: 2, fontWeight: 'bold' }}>-</div>
                        <div style={{ width: 140, height: 50, background: 'rgba(240,241,245,0.8)', borderRadius: 6, padding: '7px 0 0 0', textAlign: 'center' }}>
                          <div style={{ color: '#61698C', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ paddingRight: 6 }}>净流入</div>
                            <MyPopover placement='bottom' content={<div style={{ width: 338, lineHeight: '24px' }}>
                              <div style={{ fontWeight: 600 }}>净流入=买入金额-卖出金额</div>
                              {/* <div>资金流入及流出是指该资金账号内外之间的资金出入，例如银证转账、托管转入转出等。</div> */}
                            </div>}>
                              <Icon type="question-circle" style={{ fontSize: 14, color: '#959CBA' }} />
                            </MyPopover>
                          </div>
                          <div>{formatDw(homeData.net_capital_in || 0)}</div>
                        </div>
                        <div style={{ width: 20, height: 20, background: 'rgba(240,241,245,0.8)', border: '3px solid #FFF', borderRadius: '50%', color: '#61698C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 -3px', zIndex: 2, fontWeight: 'bold' }}>-</div>
                        <div style={{ width: 140, height: 50, background: 'rgba(240,241,245,0.8)', borderRadius: 6, padding: '7px 0 0 0', textAlign: 'center' }}>
                          <div style={{ color: '#61698C', fontSize: 12 }}>期初持有</div>
                          <div>{formatDw(homeData.bgn_amt || 0)}</div>
                        </div>
                      </div>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 1, height: 15, background: '#B0B5CC' }}></div>
                        <div style={{ width: 134, height: 16, border: '1px solid #B0B5CC', borderBottom: '1px solid transparent' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: 120, height: 50, background: '#FCF6E9', padding: '6px 0 0 0', textAlign: 'center' }}>
                            <div>买入金额</div>
                            <div style={{ color: '#C79031' }}>{formatDw(homeData.buy_amt || 0)}</div>
                          </div>
                          <div style={{ width: 20, height: 20, background: 'rgba(240,241,245,0.8)', border: '3px solid #FFF', borderRadius: '50%', color: '#61698C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 -3px', zIndex: 2, fontWeight: 'bold' }}>-</div>
                          <div style={{ width: 120, height: 50, background: '#FCF6E9', padding: '6px 0 0 0', textAlign: 'center' }}>
                            <div>卖出金额</div>
                            <div style={{ color: '#C79031' }}>{formatDw(homeData.sell_amt || 0)}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#74819E', padding: '22px 0 10px' }}>
                          <div>累计收益是指查询的时间周期内，可获得的总收益。</div>
                        </div>
                      </div>
                    </div>}
                  >
                    <span style={{ paddingRight: 4 }}>累计收益(元)</span>
                    <Icon type="question-circle" style={{ fontSize: 14, color: '#959CBA', cursor: 'pointer' }} />
                  </Popover>
                </div>
                <div className={styles.essenceFont} style={{ fontSize: 26, color: computed('color', homeData.total_return || 0) }}>{formatDw(homeData.total_return || '0')}</div>
              </Col>
              <Col span={12} style={{ padding: '20px 24px' }}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ paddingRight: 4 }}>已实现收益(元)</span>
                  <Popover trigger='click' placement='bottom' content={<div style={{ color: '#1A2243', fontSize: 14, textAlign: 'center' }}>
                    <div style={{ color: '#61698C', marginTop: 15 }}>已实现收益(元)</div>
                    <div style={{ fontSize: 20, margin: '2px 0 10px', color: computed('color', homeData.have_return || 0) }}>{formatDw(homeData.have_return || 0)}</div>
                    <div style={{ width: 341, margin: '0 10px', padding: '12px 0', background: 'rgba(240,241,245,0.8)', borderRadius: 1, textAlign: 'center' }}>
                      <div>
                        <span>已实现收益=</span>
                        <span style={{ color: '#61698C' }}>每次卖出收益之和</span>
                      </div>
                      <div style={{ color: '#959CBA', fontSize: 12, marginTop: 5 }}>（如已清仓股票，则已实现收益=累计收益）</div>
                    </div>
                    <div style={{ width: 341, margin: '10px 10px 18px', fontSize: 12, color: '#959CBA', textAlign: 'justify', wordBreak: 'break-all', lineHeight: '20px' }}>
                      <div>卖出收益是指卖出实现的收益,每次出收益按持仓成本平均值法计算。例如：先以1元买入某股票100股,再以2元买入100股，隔日以3元卖出50股。</div>
                      <div>本次卖出收益=3*50-(1*100+2*100)/200*50=75元</div>
                    </div>
                  </div>}>
                    <Icon type="question-circle" style={{ fontSize: 14, color: '#959CBA' }} />
                  </Popover>
                </div>
                <div className={styles.essenceFont} style={{ fontSize: 26, color: computed('color', homeData.have_return || 0) }}>{formatDw(homeData.have_return || 0)}</div>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ padding: '16px 24px 30px', lineHeight: '22px' }}>
                <div style={{ color: '#61698C' }}>累计买入金额</div>
                <div style={{ margin: '2px 0 30px' }}>{formatDw(homeData.buy_amt || 0)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#61698C' }}>买入均价</div>
                  <div>{formatThousands((Math.round(Number(homeData.avg_buy_price || 0) * 1000) / 1000).toFixed(3), 3)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <div style={{ color: '#61698C' }}>买入次数</div>
                  <div>{homeData.buy_times || 0}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#61698C' }}>
                    <MyPopover overlayClassName={styles.myPopover1} trigger='click' placement='bottomLeft' content={<div style={{ color: '#1A2243', fontSize: 14, width: 300 }}>
                      <div style={{ fontWeight: 'bold' }}>资金加权收益率是指以投资组合在报告周期内的收益金额与最大投入本金计算出的收益率,该收益率计算方法可以避免在出现大额资金变动时收益率与收益金额正负号不一致的情况。</div>
                      <br />
                      <div style={{ color: '#61698C', fontSize: 12 }}>
                        <div style={{ paddingBottom: 5 }}>举个例子：</div>
                        <div style={{ padding: '5px 0' }}>T日：总资产1万元，T日收盘收益200元</div>
                        <div style={{ padding: '5px 0' }}>T+1日：转出5200元</div>
                        <div style={{ padding: '5px 0' }}>T+1日：总资产5000元，T+1日收盘亏损-150元</div>
                        <div style={{ padding: '5px 0' }}>收益金额=200-150=+50元</div>
                        <div style={{ padding: '5px 0' }}>资金加权收益率=50/10000=0.5%</div>
                      </div>
                    </div>}>
                      <span style={{ paddingRight: 4 }}>收益率</span>
                      <Icon type="question-circle" style={{ fontSize: 14, color: '#959CBA', cursor: 'pointer' }} />
                    </MyPopover>
                  </div>
                  <div style={{ color: computed('color', homeData.mwrr || 0) }}>{((Math.round(Number(homeData.mwrr) * 10000) / 100) || 0).toFixed(2)}%</div>
                </div>
              </Col>
              <Col span={12} style={{ padding: '16px 24px 30px', lineHeight: '22px' }}>
                <div style={{ color: '#61698C' }}>累计卖出金额</div>
                <div style={{ margin: '2px 0 30px' }}>{formatDw(homeData.sell_amt || 0)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#61698C' }}>卖出均价</div>
                  <div>{formatThousands((Math.round(Number(homeData.avg_sell_price || 0) * 1000) / 1000).toFixed(3), 3)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <div style={{ color: '#61698C' }}>卖出次数</div>
                  <div>{homeData.sell_times || 0}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#61698C' }}>
                    <MyPopover overlayClassName={styles.myPopover2} trigger='click' placement='bottomLeft' content={<div style={{ color: '#1A2243', fontSize: 14, width: 300 }}>
                      <div style={{ fontWeight: 'bold' }}>卖出胜率是指卖出实现的收益。每次卖出收益按持仓成本平均值法计算。</div>
                      <br />
                      <div style={{ fontSize: 12, color: '#61698C' }}>例如：先以1元买入某股票100股，再以2元买入100股，隔日以3元卖出50股时，当次卖出收益=3*50-(1*100+2*100)/200*50=75元</div>
                    </div>}>
                      <span style={{ paddingRight: 4 }}>卖出胜率</span>
                      <Icon type="question-circle" style={{ fontSize: 14, color: '#959CBA', cursor: 'pointer' }} />
                    </MyPopover>
                  </div>
                  <div>{homeData.close_win_rate === -1 ? '--' : ((Math.round(Number(homeData.close_win_rate) * 10000) / 100) || 0).toFixed(2)}%</div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={12}>
          <Row style={{ width: 284, height: 24, margin: '24px auto 0', background: 'rgba(209,213,230,0.32)', borderRadius: 16, fontSize: 12, color: '#61698C' }}>
            <Col span={12} className={legendType === '1' ? styles.activeLegend : styles.legend} onClick={() => handleLegendClick('1')}>{state.activeAccount === '4' ? '净值' : '行情（收盘价）'}走势</Col>
            <Col span={12} className={legendType === '2' ? styles.activeLegend : styles.legend} onClick={() => handleLegendClick('2')}>累计收益</Col>
          </Row>
          { legendType === '2' && (
            <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: 'calc(10% - 45px)' }}>
              <div style={{ width: 13, height: 3, background: '#244FFF' }}></div>
              <div style={{ fontSize: 12, marginLeft: 5 }}>
                <span style={{ color: '#74819E' }}>累计收益：</span>
                <span style={{ color: computed('color', homeData.total_return || 0) }}>{formatThousands(homeData.total_return || 0)}</span>
              </div>
            </div>
          )}
          <div ref={chart} style={{ width: '100%', height: 321 }} />
        </Col>
      </Row>
      <Card
        className={`ax-card ${styles.card}`}
        bordered={false}
        bodyStyle={{ padding: '0 24px' }}
        title={<div style={{ display: 'flex', alignItems: 'center', color: '#1A2243' }}>
          <span className="ax-card-title">操作明细</span>
          <div onClick={handleMergeClick} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 14, margin: '0 4px 0 16px', cursor: 'default' }} >只看卖出</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              { merge ? <Icon type="check-circle" theme="filled" style={{ fontSize: 15, color: '#244FFF' }} /> : <span style={{ width: 15, height: 15, border: '1px solid #74819E', borderRadius: '50%' }}></span> }
            </div>
          </div>
        </div> }
        extra={<div><Button style={{ height: 34 }} className="m-btn-radius ax-btn-small m-btn-blue" onClick={exportTable}>导出</Button></div>}
      >
        <Table
          columns={getColumns()}
          className={`m-table-customer ${styles.table}`}
          pagination={false}
          dataSource={dataSource.map((item, index) => ({ ...item, key: index }))}
        />
        <Pagination
          style={{ float: 'right', margin: '20px 0' }}
          size='small'
          showLessItems
          showQuickJumper
          showSizeChanger
          className={`${styles.pagination}`}
          pageSizeOptions={['10', '20', '40', '100']}
          showTotal={(total) => <div style={{ fontSize: 12 }}>{`总共${total}条`}</div>}
          pageSize={pageSize}
          current={current}
          total={total}
          onChange={handlePageChange}
          onShowSizeChange={(current,pageSize) => handlePageChange(1, pageSize)}
        />
      </Card>
    </div>
  );
}
