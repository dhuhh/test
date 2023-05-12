import { FC, useLayoutEffect } from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import { barProps, lineProps, pieProps } from './provideType';

type Props = Readonly<{
  chartType: string, // 图表的类型，分别为柱状图：'bar'; 饼图：'pie'; 折线图：'line'
  pageUrl: string, // 调用该组件的页面路由及tabKey组成的字符串
  barData?: barProps,
  lineData?: lineProps,
  pieData?: pieProps,
}>

const Charts: FC<Props> = (props) => {
  // 由于刷新时左侧sider变化，导致并列的图表先加载会出现超出可视区域的问题，动态获取窗口变化，并调整宽度
  useLayoutEffect(() => {
    dynChangeWidth();
    window.addEventListener('resize', () => {
      dynChangeWidth();
    });
    return () => { window.removeEventListener('resize', () => { dynChangeWidth(); }) }
  }, [])

  const dynChangeWidth = () => {
    const echartBox: HTMLCollection | NodeList = document.getElementsByClassName('cusAnalysisEchartBox');
    if(echartBox !== null) {
      for(let i = 0; i < echartBox.length; i++) {
        const element = echartBox[i] as HTMLElement;
        element.style.width = `${ window.innerWidth - 176 - 16 }px`; // 减去左侧sider(176)和页面padding(16)
      }
    }
  }

  const type = props.chartType;
  return type === 'bar' ? <BarChart pageUrl={props.pageUrl} data={props.barData} />
   : type === 'line' ? <LineChart pageUrl={props.pageUrl} data={props.lineData} />
   : type === 'pie' ? <PieChart pageUrl={props.pageUrl} data={props.pieData} /> : null;
}

export default Charts;