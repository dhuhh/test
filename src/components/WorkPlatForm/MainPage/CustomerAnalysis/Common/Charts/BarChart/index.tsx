import { FC, useEffect } from 'react';
import * as echarts from 'echarts';
import { barProps } from '../provideType';

type Props = Readonly<{
  pageUrl: string, // 调用该组件的页面路由及tabKey组成的字符串，防止id重复
  data?: barProps,
}>;

const BarChart: FC<Props> = (props) => {
  useEffect(() => { initBar() }, [props]);
  const initBar = () => {
    let chartDom = document.getElementById(`${props.pageUrl}bar`)!;
    let myChart = echarts.init(chartDom);

    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: ''
        }
      },
      grid: {
        left: '0%',
        right: '8%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: props.data?.xData || [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            show: true,
            // interval: 0, // 代表显示所有x轴标签显示
            textStyle: {
              color: '#61698C', //更改坐标轴文字颜色
              fontSize: '12px'   //更改坐标轴文字大小
            }
          },
          axisLine: {
            show: true, // 是否显示轴线
            lineStyle: {
              color: '#959CBA', // 刻度线的颜色
            }
          }
        }
      ],
      yAxis: [
        {
          axisLabel: {
            show: true,
            textStyle: {
              color: '#61698C',
              fontSize: '12px'
            }
          },
          axisLine: { show: false }, // 坐标轴
          axisTick: { show: false }, // 刻度线
          name: props.data?.yName || '单位（万元）',
          // splitNumber: 5, // 横线数
          nameTextStyle: {
            color: '#61698C',
            padding: [0, 0, 0, 9],
            fontSize: '12px'
          },
          type: 'value'
        }
      ],
      series: [
        /** 利用stack重叠和透明色实现柱体与底部留有一段小间隙的效果
         *  透明柱体的数值通过(最大值 - 最小值) * 0.015 实现大概的比列效果
         */
        {
          stack: 'Direct',
          type: 'bar',
          barWidth: '40%',
          data: Array.from(Array(props.data?.seriesData ? props.data?.seriesData.length : 0),
           () => (Math.max(...(props.data?.seriesData || [])) - Math.min(...(props.data?.seriesData || []))) * 0.015),
          color: 'rgba(0,0,0,0)',
          tooltip: {
            show: false,
          }
        },
        {
          stack: 'Direct',
          type: 'bar',
          barWidth: '40%',
          data: props.data?.seriesData || [],
          color: '#7D93EE'
        }
      ]
    };
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }

  return (<div id={`${props.pageUrl}bar`} style={{ height: '320px' }}></div>);
}

export default BarChart;