import React,{ useEffect } from 'react';
import * as echarts from 'echarts';


export default function PieChart(props) {
  useEffect(()=>{
    initPie();
  },[props]);
  const initPie = ()=>{
    let center = ['50%', '40%'];
    let myChart = echarts.init(document.getElementById(props.item.key));
    const { item = {} } = props;
    let value = [item[`${item.name}FinishAmount`],item[`${item.name}Amount`]],color;
    if(item.label === '流程'){
      color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#19BDFF' },
        { offset: 1, color: '#0B88FF' },
      ]);
    }else if(item.label === '任务'){
      color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#FFCF90' },
        { offset: 1, color: '#FFA257' },
      ]);
    }else if(item.label === '事件'){
      color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#F8ED69' },
        { offset: 1, color: '#EED637' },
      ]);
    }else if(item.label === '消息'){
      color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#8FEFE9' },
        { offset: 1, color: '#56DBCE' },
      ]);
    }
    // let value = [100,100];
    let option = {
      grid: {
        left: 0,
        bottom: 0,
        top: 0 ,
        containLabel: true,
      },
      title: {
        text: `已完成/总数`,
        x: '48%',
        y: '75%',
        textAlign: 'center',
        textStyle: {
          fontSize: 16,
          color: '#61698C',
          fontWeight: 400,
        },
        subtext: value[0] + '/' + value[1],
        subtextStyle: {
          color: '#1A2243',
          fontSize: 16, // 副标题文字颜色
          // fontWeight: 'bold',
        },
      },
      series: [
        // 边框的设置
        {
          name: '2',
          radius: ['48%', '65%'],
          center,
          clockWise: false,
          type: 'pie',
          hoverAnimation: false, // 取消饼图放大效果
          labelLine: {
            show: false,
          },
          data: [{
            value: value[1] - value[0],
            itemStyle: {
              normal: { color: "#D5DEE8" },
              emphasis: { color: "#D5DEE8" },
            },
          },{
            value: value[0] === '0' ? '' : value[0],
            itemStyle: {
              color: "rgba(0, 0, 0, 0)",
            },
          }],
        },
        // 主要展示层的
        {
          radius: ['45%', '68%'],
          center,
          type: 'pie',
          name: "1",
          hoverAnimation: false, // 取消饼图放大效果
          labelLine: {
            show: false,
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: (params) => {
                return [
                  `{a|${item.label}}`,
                  `{b|${item[`${item.name}FinishRate`]}%}`,
                ].join(`\n`);
              },
              rich: {
                a: {
                  color: ' #61698C',
                  fontSize: 16,
                  lineHeight: 20,
                  fontWeight: 400,
                  padding: [10,0,0,0],
                },
                b: {
                  color: '#1A2243',
                  fontSize: 26,
                  fontFamily: 'EssenceSansStd-Regular',
                  padding: [-8,0,0,0],
                  lineHeight: 20,
                  fontWeight: 400,
                },
              },
            },
          },
          data: [{
            value: value[0] === '0' ? '' : value[0],
            itemStyle: {
              normal: { // 渐变色操作
                color,
              },
            },
  
          },{
            value: value[1] - value[0],
            itemStyle: {
              normal: { color: "transparent" },
              emphasis: { color: "transparent" },
            },
          }],
        },
        
      ],
    };
    myChart.setOption(option);
  };
  return (
    <div id={props.item.key}>
    </div>
  );
}
