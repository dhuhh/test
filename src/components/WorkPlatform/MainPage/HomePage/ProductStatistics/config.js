/**
 *
 * @param {*} datas 图表数据
 * @returns
 */

const bylAnalysis = (datas) => {
  const times = [];
  const bylDatas = [];
  datas.forEach((item) => {
    times.push(item.prodTypeDesc); // 日期
    bylDatas.push({ value: item.amount, name: item.prodTypeDesc }); // 描述
  });
  const color = ['#f16767', '#67d2f1', '#f8c55c', '#a9cced', '#8b9be1', '#F3D290', '#F19E9E', '#A9CCED', '#C63136', '#5A6DB8'];
  return {
    color,
    grid: {
      top: '0%',
      left: '8%',
      right: '8%',
      bottom: '2%',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      axisPointer: {
        animation: false,
      },
    },
    legend: {
      orient: 'vertical',
      left: '60%',
      top: 'middle',
      data: times,
      // data: ['公募基金', '私募类产品', '银行理财', '收益凭证', '其他产品'],
      itemWidth: 18,
      itemHeight: 11,
      textStyle: {
        fontSize: 12,
        color: '#999',
      },
    },
    series: [
      {
        name: '产品销量分布统计',
        type: 'pie',
        center: ['30%', '50%'],
        radius: ['38%', '58%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '14',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: bylDatas,
      },
    ],
  };
};

const bylAnalysis2 = (datas) => {
  const times = [];
  const bylDatas = [];
  datas.forEach((item) => {
    times.push(item.prodTypeDesc); // 日期
    bylDatas.push({ value: item.amount, name: item.prodTypeDesc }); // 描述
  });
  const color = ['#8b9be1', '#a9cced', '#f8c55c', '#f16767', '#67d2f1', '#F3D290', '#F19E9E', '#A9CCED', '#C63136', '#5A6DB8'];
  return {
    color,
    grid: {
      top: '0%',
      left: '8%',
      right: '8%',
      bottom: '2%',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      axisPointer: {
        animation: false,
      },
    },
    legend: {
      orient: 'vertical',
      left: '60%',
      top: 'middle',
      data: times,
      itemWidth: 18,
      itemHeight: 11,
      textStyle: {
        fontSize: 12,
        color: '#999',
      },
    },
    series: [
      {
        name: '产品销量分布统计',
        type: 'pie',
        center: ['30%', '50%'],
        radius: ['38%', '58%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '14',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: bylDatas,
      },
    ],
  };
};

const bylAnalysis3 = (datas) => {
  const times = [];
  const amount = [];
  datas.forEach((item) => {
    times.push(item.statDate); // 日期
    amount.push(item.amount); // 单位净值
  });
  const color = ['#F16767', '#89ABFE', '#81B8F5', '#E24949', '#F8C55C', '#8B9BE1'];
  return {
    color,
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['销售收入'],
      x: 'center', // 'center' | 'left' | {number}
      y: '3%',
      itemWidth: 18,
      itemHeight: 11,
      textStyle: {
        fontSize: 12,
        color: '#999',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '19%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        fontSize: 12,
        color: '#999',
        rotate: 30,
      },
      axisLine: {
        lineStyle: {
          type: 'dotted',
          color: 'rgba(55,55,55,0.2)',
          opacity: 1,
        },
      },
      boundaryGap: false,
      data: times,
    },
    yAxis: {
      type: 'value',
      nameTextStyle: {
        fontSize: 12,
        color: '#999',
        padding: [0, 25, 0, 0],
      },
      axisLabel: {
        fontSize: 12,
        color: '#999',
      },
      splitLine: {
        lineStyle: {
          type: 'dotted',
          color: 'rgba(55,55,55,0.2)',
        },
      },
      axisLine: {
        lineStyle: {
          type: 'dotted',
          color: 'rgba(55,55,55,0.2)',
          opacity: 1,
        },
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: '产品收入趋势分析',
        type: 'line',
        stack: '总量',
        data: amount,
        areaStyle: {},
      },
    ],
  };
};


const bylAnalysis4 = (datas) => {
  const times = [];
  const prodAmount = [];
  const unitNav = [];
  datas.forEach((item) => {
    times.push(item.statDate); // 日期
    prodAmount.push(item.prodAmount); // 产品销量
    unitNav.push(item.csi300Index); // 沪深300
  });
  const color = ['#89ABFE', '#F16767', '#81B8F5', '#E24949', '#F8C55C', '#8B9BE1'];
  return {
    color,
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['产品销量', '沪深300'],
      x: 'center', // 'center' | 'left' | {number}
      y: '0%',
      itemWidth: 18,
      itemHeight: 11,
      textStyle: {
        fontSize: 12,
        color: '#999',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '4%',
      top: '21%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        fontSize: 10,
        color: '#999',
        rotate: 30,
      },
      axisLine: {
        lineStyle: {
          type: 'dotted',
          color: 'rgba(55,55,55,0.2)',
          opacity: 1,
          fontSize: 10,
        },
      },
      boundaryGap: false,
      data: times,
    },
    yAxis: [

      {
        type: 'value',
        name: '产品销量',
        min: 0,
        interval: 10000,
        axisLabel: {
          formatter: '{value}',
          fontSize: 10,
          color: '#999',
        },
        nameTextStyle: {
          fontSize: 10,
          color: '#999',
          padding: [0, 25, 0, 0],
        },
        splitLine: {
          lineStyle: {
            type: 'dotted',
            color: 'rgba(55,55,55,0.2)',
          },
        },
        axisLine: {
          lineStyle: {
            type: 'dotted',
            color: 'rgba(55,55,55,0.2)',
            opacity: 1,
          },
        },
        axisTick: {
          show: true,
        },
      },
      {
        type: 'value',
        name: '沪深300',
        min: 0,
        interval: 1000,
        axisLabel: {
          formatter: '{value}',
          fontSize: 10,
          color: '#999',
        },
        nameTextStyle: {
          fontSize: 10,
          color: '#999',
          padding: [0, 25, 0, 0],
        },
        splitLine: {
          lineStyle: {
            type: 'dotted',
            color: 'rgba(55,55,55,0)',
            opacity: 0,
          },
        },
        axisLine: {
          lineStyle: {
            type: 'dotted',
            color: 'rgba(55,55,55,0.2)',
          },
        },
        axisTick: {
          show: true,
        },
      },
    ],
    series: [
      {
        name: '产品销量',
        type: 'bar',
        data: prodAmount,
        barWidth: 5,
      },
      {
        name: '沪深300',
        type: 'line',
        yAxisIndex: 1,
        data: unitNav,
      },
    ],
  };
};

export {
  bylAnalysis,
  bylAnalysis2,
  bylAnalysis3,
  bylAnalysis4,
};
