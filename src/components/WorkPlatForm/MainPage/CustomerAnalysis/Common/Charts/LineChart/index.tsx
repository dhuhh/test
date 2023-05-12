import { FC, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { lineProps } from '../provideType';

type Props = Readonly<{
  pageUrl: string, // 调用该组件的页面路由及tabKey组成的字符串，防止id重复
  data?: lineProps,
}>;

const LineChart: FC<Props> = (props) => {
  const [seriesData, setSeriesData] = useState<Object>();
  const [legendData, setLegendData] = useState<string[]>([])

  useEffect(() => { getSeriesList() }, [JSON.stringify(props)])

  useEffect(() => { initBar() }, [props, seriesData]);
  
  // 获取series模块数据
  const getSeriesList = () => {
    const seriesList: object[] = [];
    const legendData: string[] = []; 
    if(props.data?.seriesData) {
      props.data.seriesData.forEach((item) => {
        seriesList.push(
          {
            name: item.name,
            type: 'line',
            data: item.data,
            showSymbol: false, // 去掉小圆点，但鼠标放上去有显示
            itemStyle : {  
              normal: {
                color: item.color, // 圆点颜色
                borderColor: "#ffffff",
                borderType: "solid",
                borderWidth: 3,
                lineStyle: {
                  color: item.color, // 线条颜色
                  width: 1, //设置线条粗细
                },
              }
            },
            symbol: "circle", // 圆点形状
            symbolSize: 2, // 宽高
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: item.rgbaColor, // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 149, 255, 0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        );
        legendData.push(item.name);
      })
      setSeriesData(seriesList);
      setLegendData(legendData);
    }
  }

  // 构建折线图
  const initBar = () => {
    let chartDom = document.getElementById(`${props.pageUrl}line`)!;
    let myChart = echarts.init(chartDom);

    // 统计所有数据，根据最大值规定y轴刻度
    const dataList: number[] = [];
    props.data?.seriesData.forEach((item) => {
      if(item.data && item.data.length > 0) {
        item.data.forEach((opt) => {
          dataList.push(Number(opt));
        })
      }
    })

    let option: any = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        textStyle:{
          fontSize: 12,
          color:'#61698C'
        },
        icon: 'circle',
        top: 30,
        itemWidth: 8, // 图标高
        itemGap: 16, // 间距
        data: legendData,
      },
      grid: {
        left: props.pageUrl.startsWith('customerAssets') ? '0%' : '4%',
        right: '4%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: props.data?.xData,
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
      },
      yAxis: {
        type: 'value',
        minInterval: 1, // 最小间距为1
        axisLine: { show: false }, // 坐标轴
        axisTick: { show: false }, // 刻度线
        name: JSON.stringify(props.data?.xData) === '[]' ? '' : ( props.data?.yName || '单位（个）'),
        nameTextStyle: {
          color: '#61698C',
          padding: props.pageUrl.startsWith('customerAssets') ? [0, 0, 0, 20] : [0, 20, 0, 0],
          fontSize: '12px'
        },
        // splitNumber: 4, // 横线数
      },
      series: seriesData
    };
    if(dataList.length > 0 && Math.max(...dataList) <= 4) option['yAxis']['max'] = 4;
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }

  return (<div id={`${props.pageUrl}line`} style={{ height: '320px' }}></div>);
}

export default LineChart;