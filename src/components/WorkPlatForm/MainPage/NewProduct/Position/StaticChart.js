import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Card, Col, Row ,Tooltip } from 'antd';
import * as echarts from 'echarts';
import { formatColor, formatThousands, formatDw } from '../Earning/util';
import questionMark from '$assets/newProduct/customerPortrait/question-mark.png';
import { themeEC5 } from './util';
import styles from './index.less';

export default forwardRef((props, ref) => {
  const pieChart = useRef(null);
  const barChart = useRef(null);

  const computed = useCallback((type, ...rest) => {
    if (type === 'color') {
      const [val = ''] = rest;
      return formatColor(val);
    } else if (type === 'width') {
      const [val = 'left'] = rest;
      if (props.activeAccount === '1') {
        return 'calc(50% - 1px)';
      } else {
        if (val === 'left') return 'calc(40% - 0.5px)';
        return 'calc(60% - 1px)';
      }
    }
  }, [props.activeAccount]);

  const initPieChart = useCallback(() => {
    let { homeData = [], activeAccount } = props;
    if (!(homeData instanceof Array)) {
      homeData = [];
    }
    if (homeData.length > 11) {
      const other = homeData.filter(item => item.Name === 'OTHER').reduce((previousValue, currentValue) => {
        return { ...previousValue, positionValue: Number(previousValue.positionValue) + Number(currentValue.positionValue), profitAndloss: Number(previousValue.profitAndloss) + Number(currentValue.profitAndloss) };
      }, { Name: "其他", positionValue: '0.00', profitAndloss: '0.00', stockCode: "--" });
      homeData = [...homeData.filter(item => item.Name !== 'OTHER'), other];
    }
    let legendData = homeData.map(item => item.Name);
    if (homeData.length > 5) {
      for (let i = 0; i < legendData.length; i++) {
        i += 3;
        if (i < legendData.length) {
          legendData.splice(i, 0, '');
        }
      }
    }
    const legend = {
      data: legendData,
      orient: (activeAccount === '1' || homeData.length > 5) ? 'horizontal' : 'vertical',
      left: (activeAccount === '1' || homeData.length > 5) ? 'center' : 'auto',
      bottom: (activeAccount === '1' || homeData.length > 5) ? '5%' : 'auto',
      right: (activeAccount === '1' || homeData.length > 5) ? 'auto' : '5%',
      top: (activeAccount === '1' || homeData.length > 5) ? 'auto' : 'middle',
      icon: 'circle',
      itemWidth: 8,
      itemGap: (activeAccount === '1') ? 30 : 8,
      formatter: activeAccount === '1' ? (value) => value : (value) => {
        let code = homeData?.find(item => item.Name === value)?.stockCode || '--';
        if (value.length > 10) {
          value = value.substring(0, 10) + '...';
        }
        if (code.length > 15) {
          code = code.substring(0, 15) + '...';
        }
        return `{code|${code}}\n{name|${value}}`;
      },
      textStyle: activeAccount === '1' ? {} : {
        padding: [20, 0, 0, 0],
        lineHeight: 18,
        rich: {
          code: {
            color: '#1A2243',
          },
          name: {
            color: '#74819E',
            width: homeData.length > 5 ? pieChart.current.clientWidth / 4 : 'auto',
          },
        },
      },
    };
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFF',
        textStyle: {
          color: '#1A2243',
        },
        extraCssText: 'box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);',
        formatter: (params) => {
          const jsx = (
            <div style={{ paddingRight: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: params['color'] }}></div>
                </div>
                <div>{params['name']}</div>
              </div>
              <div style={{ paddingLeft: 20 }}>
                <span>持仓市值：</span>
                <span style={{ color: computed('color', params['value']) }}>{formatDw(params['value'])}</span></div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      legend,
      series: [{
        name: '持仓概要',
        type: 'pie',
        radius: activeAccount === '1' ? 100 : [70, 105],
        center: (activeAccount === '1' || homeData.length > 5) ? ['50%', 150] : ['40%', 150],
        data: homeData?.map(item => ({ name: item.Name, value: Math.abs(Number(item.positionValue)) })),
        label: {
          show: true,
          position: 'outside',
          formatter: '{d}%',
          color: '#1A2243',
        },
      }],
    };
    echarts.init(pieChart.current, themeEC5).setOption(option);
  }, [computed, props]);

  const initBarChart = useCallback(() => {
    let { homeData = [], activeAccount } = props;
    if (!(homeData instanceof Array)) {
      homeData = [];
    }
    if (homeData.length > 11) {
      const other = homeData.filter(item => item.Name === 'OTHER').reduce((previousValue, currentValue) => {
        return { ...previousValue, positionValue: Number(previousValue.positionValue) + Number(currentValue.positionValue), profitAndloss: Number(previousValue.profitAndloss) + Number(currentValue.profitAndloss) };
      }, { Name: "其他", positionValue: '0.00', profitAndloss: '0.00', stockCode: "--" });
      homeData = [...homeData.filter(item => item.Name !== 'OTHER'), other];
    }
    const xData = activeAccount === '1' ? homeData?.map(item => item.Name) : homeData?.map(item => (item.stockCode || '--') + '|' + item.Name);
    const yData = homeData?.map(item => ({ name: item.Name, value: Number(item.profitAndloss), itemStyle: { color: Number(item.profitAndloss) < 0 ? '#099A08' : '#E84646' }, label: { position: Number(item.profitAndloss) < 0 ? 'bottom' : 'top', color: Number(item.profitAndloss) < 0 ? '#099A08' : Number(item.profitAndloss) > 0 ? '#E84646' : '#61698C' } }));
    const maxLengthEl = homeData?.map(item => item.Name.length > item.stockCode.length ? item.Name : item.stockCode ).sort((a, b) => b.length - a.length)[0];
    const maxLengthElEnglish = maxLengthEl?.replace(/[^0-9a-z]/ig, '')?.length;
    const maxLengthElChinese = maxLengthEl?.replace(/[0-9a-z]/ig, '')?.length;
    const option = {
      grid: {
        top: '5%',
        bottom: activeAccount === '1' ? 60 : (maxLengthElChinese * 10) + (maxLengthElEnglish * 5) + 20 + 12,
        containLabel: false,
      },
      tooltip: {
        show: activeAccount === '1' ? false : true,
        trigger: 'axis',
        backgroundColor: '#FFF',
        borderColor: '#D1D5E6',
        borderWidth: 1,
        textStyle: {
          fontSize: 12,
        },
        extraCssText: 'box-shadow: -2px 2px 8px 0px rgba(5, 14, 28, 0.12);',
        axisPointer: {
          type: 'line',
          lineStyle: {
            width: 30,
            color: 'rgba(36,79,255,0.05)',
          },
        },
        formatter: (params) => {
          const jsx = (
            <div style={{ padding: '0 5px' }}>
              <div style={{ color: '#74819E' }}>{params[0].name}</div>
              <div style={{ color: computed('color', params[0]?.value) }}>{formatDw(params[0]?.value)}</div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      xAxis: {
        type: 'category',
        data: xData,
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
          margin: 20,
          lineHeight: 16,
          color: '#74819E',
          rotate: activeAccount === '1' ? 0 : 45,
          formatter: value => {
            if (activeAccount === '1') return value;
            let arr = value.split('|');
            if (arr.length < 2) arr = ['--', '--'];
            return `{code|${arr[0]}}\n{name|${arr[1]}}`;
          },
          rich: {
            code: {
              color: '#1A2243',
            },
            name: {
              color: '#74819E',
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: {
            width: 1,
            color: '#CCCCCC',
          },
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
        data: yData,
        type: 'bar',
        barWidth: activeAccount === '1' ? 30 : 15,
        label: {
          show: activeAccount === '1' ? true : false,
          formatter: (params) => {
            return formatDw(params.value);
          },
        },
      }],
    };
    echarts.init(barChart.current).setOption(option);
  }, [computed, props]);

  useEffect(() => {
    echarts.dispose(pieChart.current);
    echarts.dispose(barChart.current);
    initPieChart();
    initBarChart();
  }, [props.homeData]);

  let { homeData = [], activeAccount } = props;
  if (!(homeData instanceof Array)) {
    homeData = [];
  }
  const yData = homeData?.map(item => ({ name: item.Name, value: item.positionValue })) || [];
  const xData = homeData?.map(item => item.Name.length > item.stockCode.length ? item.Name : item.stockCode);
  const maxLengthEl = xData.sort((a, b) => b.length - a.length)[0];
  const maxLengthElEnglish = maxLengthEl?.replace(/[^0-9a-z]/ig, '')?.length;
  const maxLengthElChinese = maxLengthEl?.replace(/[0-9a-z]/ig, '')?.length;
  const barHeight = activeAccount === '1' ? 350 : ((350 + (maxLengthElEnglish * 5) + (maxLengthElChinese * 10) - 50 + 12) || 350);
  const pieHeight = props.activeAccount === '1' ? 350 : yData.length > 5 ? 350 + (65 * (Math.ceil((yData.length - 3) / 3))) : 350;
  return (
    <Row type='flex' style={{ background: '#FFF', borderTop: '1px solid #EBECF2', borderBottom: '1px solid #EBECF2' }}>
      <Col style={{ width: computed('width', 'left') }}>
        <Card
          className={`ax-card ${styles.card}`}
          bordered={false}
          title={<span className="ax-card-title" style={{ color: '#1A2243' }}>持仓概要{activeAccount === '4' && (
            <Tooltip title="统计口径不包含基金投顾持仓数据" placement='bottom' overlayClassName={styles.tooltip}>
              <img src={questionMark} alt='' style={{ width: 15,marginLeft: 4 }}/>
            </Tooltip>
          )}</span>}
          bodyStyle={{ padding: 0 }}
        >
          <div ref={pieChart} style={{ width: '100%', height: pieHeight }} />
        </Card>
      </Col>
      <Col style={{ width: 1, background: '#EBECF2' }}></Col>
      <Col style={{ width: computed('width', 'right') }}>
        <Card
          className={`ax-card ${styles.card}`}
          bordered={false}
          title={<span className="ax-card-title" style={{ color: '#1A2243' }}>收益概要{activeAccount === '4' && (
            <Tooltip title="统计口径不包含基金投顾持仓数据" placement='bottom' overlayClassName={styles.tooltip}>
              <img src={questionMark} alt='' style={{ width: 15,marginLeft: 4 }}/>
            </Tooltip>
          )}</span>}
          bodyStyle={{ padding: 0 }}
        >
          <div ref={barChart} style={{ width: '100%', height: barHeight }} />
        </Card>
      </Col>
    </Row>
  );
});

