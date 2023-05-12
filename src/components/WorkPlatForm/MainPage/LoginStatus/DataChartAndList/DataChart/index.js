import React, { Fragment } from 'react';
import { Row } from 'antd';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';

class TrendCharts extends React.Component {
  render() {
    const { dataSource = [] } = this.props;
    const array = [];
    Object.assign(array, dataSource);
    array.reverse();
    const rq = [];
    const dlrs = [];
    const dlrc = [];
    array.forEach((element) => {
      rq.push(element.rq || '');
      dlrs.push(element.dlrs || '');
      dlrc.push(element.dlrc || '');
    });
    const AnalysisOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: [
        {
          orient: 'horizontal',
          x: 'center',
          data: ['登录人数', '登录人次'],
        },
      ],
      grid: {
        left: '4%',
        right: '4%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: rq,
          splitLine: { show: false }, // 去除网格线
          axisLine: { show: false },
          axisTick: { show: false },
        },
      ],
      yAxis: [
        {
          axisLine: { show: false },
          axisTick: { show: false },
          type: 'value',
          // scale: true, // 是否加大波动幅度
          // splitLine: { show: false }, // 去除网格线
          splitLine: { // 网格线
            lineStyle: {
              type: 'dashed', // 设置网格线类型 dotted：虚线   solid:实线
            },
            show: true, // 隐藏或显示
          },
        },
      ],
      series: [
        {
          name: '登录人数',
          type: 'line',
          data: dlrs,
          symbol: 'none', // 取消折点圆圈
          itemStyle: {
            normal: {
              color: '#2d68de',
            },
          },
        },
        {
          name: '登录人次',
          type: 'line',
          data: dlrc,
          symbol: 'none', // 取消折点圆圈
          itemStyle: {
            normal: {
              color: '#ec932b',
            },
          },
        },
      ],
    };
    return (
      <Fragment>
        <Row className="m-row-form" style={{ marginTop: '1rem' }}>
          <ReactEchartsCore
            echarts={echarts}
            style={{ height: '41rem', width: '100%' }}
            option={AnalysisOption}
            notMerge
            lazyUpdate
            theme="blue"
          />
        </Row>
      </Fragment>
    );
  }
}
export default TrendCharts;
