import { FC, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { pieProps } from '../provideType';

type Props = Readonly<{
  pageUrl: string, // 调用该组件的页面路由及tabKey组成的字符串，防止id重复
  data?: pieProps,
}>;

const PieChart: FC<Props> = (props) => {
  const [seriesData, setSeriesData] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState<Object>(); // 数值总量

  useEffect(() => { getSeriesList() }, [JSON.stringify(props)])

  useEffect(() => { initBar() }, [JSON.stringify(props), JSON.stringify(seriesData)]);
  
  // 获取series模块数据
  const getSeriesList = () => {
    const seriesList: object[] = [];
    let totalValue = 0;
    if(props.data?.data) {
      props.data.data.forEach((item) => {
        totalValue += Number(item.data);
        seriesList.push({ value: item.data, name: item.name, itemStyle: {color: item.color} });
      })
    }
    setSeriesData(seriesList);
    setTotalValue(totalValue);
  }

  // 构建饼图
  const initBar = () => {
    let chartDom = document.getElementById(`${props.pageUrl}pie`)!;
    let myChart = echarts.init(chartDom);

    let option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'center',
        left: '43%',
        orient: 'vertical',
        icon: 'circle',
        itemWidth: 8, // 图标高
        itemGap: 10, // 间距
        formatter: function (name: string) {
          return props.pageUrl.startsWith('account') ? `{a|${name} ${seriesData.find((item: any)=>item.name === name)?.value}人}` : `{a|${name}}`;
        },
        textStyle: {
          rich: {
            a: {
              fontSize: 14,
              fontWeight: 400,
              color: '#1A2243',
            },
          },
        },
      },
      title: {
        text: ' 客户数',
        // 副标题
        subtext: `{a|${totalValue}}{b|人}`,
        // 主副标题间距
        itemGap: 5,
        x: '24%',
        y: 'center',
        top: '140',
        textAlign:'center',
        // 主标题样式
        textStyle: {
          fontSize: 14,
          fontWeight: 400,
          color: '#61698C'
        },
        // 副标题样式
        subtextStyle: {
          rich: {
            a: {
              fontSize: 20,
              fontWeight: 400,
              color: '#1A2243'
            },
            b: {
              fontSize: 12,
              fontWeight: 400,
              color: '#1A2243'
            },
          },
        },
      },
      series: [
        {
          name: props.data?.label || '',
          type: 'pie',
          radius: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: seriesData,
          center: ['25%', '50%'], // 饼图位置
        }
      ]
    };
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }

  return (<div id={`${props.pageUrl}pie`} style={{ height: '320px' }}></div>);
}

export default PieChart;