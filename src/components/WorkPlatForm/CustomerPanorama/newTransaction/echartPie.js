// 饼图
import React, { Fragment } from 'react';
import { Divider,message,Empty } from 'antd';
import { history as router } from 'umi';
import { connect } from 'dva';
import styles from './index.less';
import moment from 'moment';
import lodash, { result, forEach } from 'lodash';
import * as echarts from 'echarts';
import ReactDOMServer from 'react-dom/server';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import { QueryProfitAllAcountTable } from '$services/customerPanorama';
import iconCheck from '../../../../assets/newProduct/customerPanorama/iconCheck.png';
import iconLineBar from '../../../../assets/newProduct/customerPanorama/iconLineBar.png';
import { viewSensors, clickSensors,formatNum,formatDw } from './utils';
//import defaultImg from '$assets/newProduct/customerPortrait/缺省图@2x.png';
import defaultImg from '$assets/newProduct/customerPortrait/defaultGraph@2x.png';

class echartPie extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chartType: 1,
      isMonth: 1,
      beginDate: '',
      endDate: '',
      customerCode: '', // 客户号
      pieData: [],
      lineBarData: [],
      timeData: '', // 截止时间
      TotalData: '', // 饼图 总数据

      tooptip: [],
      barChartDataSource: [],
      Time: [],

      arrTotalProfit: [], // 总量
      ProfitDate: [], // X
      res: [],
      resLine: [], // 总数据
    };
  }
  componentDidMount() {
    const { chengjiaoAll: { isMonth,tjDateCopy,tjDate }, customerCode } = this.props;
    this.setState({
      beginDate: tjDate[0].format('YYYYMM'),
      endDate: tjDate[1].format('YYYYMM'),
      customerCode: this.props.customerCode, // 客户号
    },
    ()=>{
      if (this.props.accounts.length) {
        this.fetchAllAccountGraph().then(() => {
          this.changeEcharts();
        });
      }
    }
    );
  }

  componentWillReceiveProps(nextProps){
    // 时间超过12个月只展示折线
    if(nextProps.isMoreYear === true){
      // 当在按月的时候,选择的时间超过12个月时,用此参数入参及判断
      this.setState({
        chartType: 2,
      },
      ()=>{
        this.clickChange(2);
      }
      );
    }else { // 时间没有超过12个月,分为按月和按日
      if(nextProps.isMonth !== this.props.isMonth){
        if(nextProps.isMonth === 1){
          this.setState({
            chartType: 1,
          },
          ()=>{
            this.clickChange(1);
          }
          );
        }
        else {
          this.setState({
            chartType: 2,
          },
          ()=>{
            this.clickChange(2);
          }
          );
        }
      }
    }

    // 查询条件变化
    if(nextProps.chengjiaoAll.isMonth !== this.props.chengjiaoAll.isMonth || nextProps.chengjiaoAll.tjDateCopy[0] !== this.props.chengjiaoAll.tjDateCopy[0] || nextProps.chengjiaoAll.tjDateCopy[1] !== this.props.chengjiaoAll.tjDateCopy[1]){
      if(nextProps.chengjiaoAll.isMonth === 1){ // 按月
        this.setState({
          isMonth: nextProps.chengjiaoAll.isMonth,
          beginDate: nextProps.chengjiaoAll.tjDateCopy[0].format('YYYYMM'),
          endDate: nextProps.chengjiaoAll.tjDateCopy[1].format('YYYYMM'),
        },
        ()=>{
          this.fetchAllAccountGraph();
        }
        );
      }else { // 按日
        this.setState({
          isMonth: nextProps.chengjiaoAll.isMonth,
          beginDate: nextProps.chengjiaoAll.tjDateCopy[0].format('YYYYMMDD'),
          endDate: nextProps.chengjiaoAll.tjDateCopy[1].format('YYYYMMDD'),
        },
        ()=>{
          this.fetchAllAccountGraph();
        }
        );
      }

    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.accounts?.length && this.props.accounts?.length) {
      this.fetchAllAccountGraph().then(() => {
        this.changeEcharts();
      });
    }
  }

  changeEcharts = () => {
    // 时间超过12个月只展示折线
    if(this.props.isMoreYear === true){
      // 当在按月的时候,选择的时间超过12个月时,用此参数入参及判断
      this.setState({
        chartType: 2,
      },
      ()=>{
        this.clickChange(2);
      }
      );
    }else { // 时间没有超过12个月,分为按月和按日
      // if(nextProps.isMonth !== this.props.isMonth){
      if(this.props.isMonth === 1){
        this.setState({
          chartType: 1,
        },
        ()=>{
          this.clickChange(1);
        }
        );
      }
      else {
        this.setState({
          chartType: 2,
        },
        ()=>{
          this.clickChange(2);
        }
        );
      }
      // }
    }
  }

  //计算对象数组中某个属性合计
 countTotal=(arr, keyName) =>{
   let total = 0;
   total = arr.reduce(function (total, currentValue, currentIndex, arr){
     return Number(currentValue[keyName] ) ? (total + Number(currentValue[keyName] )) : total;
   }, 0);
   return total;
 }

  // 去重
  unique=(arr)=> {
    return Array.from(new Set(arr));
  }

  // 数组对象去重(相同时间去掉重复对象)
   deWeight=(arr)=> {
     for (let i = 0; i < arr.length - 1; i++) {
       for (let j = i + 1; j < arr.length; j++) {
         if (arr[i].profitDate === arr[j].profitDate) {
           arr.splice(j, 1);
           j--;
         }
       }
     }
     return arr;
   }

// 查询成交流水全部账户图表
fetchAllAccountGraph = async () => {
  await QueryProfitAllAcountTable({
    accnNo: this.props.customerCode, // 客户号
    monthOrday: this.state.isMonth.toString() === '1' ? '2' : '1' , // 按月/按日  入参写反了,此处修正
    beginDate: this.state.beginDate,// 开始时间
    endDate: this.state.endDate, // 结束时间
  }).then((ret = {}) => {
    const { code = 0, records = [] } = ret;
    if (code > 0) {
      // 饼
      const res = records[0].profitSector;
      const resLine = records[0].profitLineChart.sort((a, b) => a.profitDate - b.profitDate);
      this.setState({ // 缺省图判断
        res,
        resLine,
      });
      const datax = [
        { value: 0, name: '普通' },
        { value: 0, name: '信用' },
        { value: 0, name: '理财' },
        { value: 0, name: '期权' },
        { value: 0, name: '基金投顾' },
      ];
      if (Array.isArray(res)) {
        res.forEach((item) => {
          datax[1].value += (item.creditProfit).replace(/,/g, ""); // 信用
          datax[2].value += (item.finanProfit).replace(/,/g, ""); // 理财
          datax[0].value += (item.normalProfit).replace(/,/g, ""); // 普通
          datax[3].value += (item.optionProfit).replace(/,/g, ""); // 期权
          datax[4].value += (item.fundProfit).replace(/,/g, ""); // 基金
        });
        this.setState({ pieData: datax, timeData: records[0].profitSector[0].profitDate, TotalData: (records[0].profitSector[0].totalProfit).replace(/,/g, ""),
        },
        ()=>{
          this.initPieChart();
        }
        );
      }

      // 折线
      const arrnew = [];
      const arrProfitDate = [];
      resLine.forEach(e => {
        arrnew.push((e.totalProfit).replace(/,/g, ""));
        arrProfitDate.push(e.profitDate);
      });
      this.setState({
        arrTotalProfit: arrnew,
        ProfitDate: arrProfitDate,
        resLine,
      },
      ()=>{
        this.initLineChart();
      }
      );

      // 柱状图
      const dataSource = [
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
        { data: [] },
      ];
      const arrCreditProfit = []; // 信用
      const arrNormalProfit = []; // 普通
      const arrFinanProfit = [] ; // 理财
      const arrOptionProfit = []; // 期权
      const arrFundProfit = []; // 基金投顾
      const Time = [];
      for (let i in resLine){
        for (let key in resLine[i]) {
          Time.push(resLine[i].profitDate);
          if(key === 'creditProfit'){
            arrCreditProfit.push((resLine[i].creditProfit).replace(/,/g, ""));
          }
          if(key === 'normalProfit'){
            arrNormalProfit.push((resLine[i].normalProfit).replace(/,/g, ""));
          }
          if(key === 'finanProfit'){
            arrFinanProfit.push((resLine[i].finanProfit).replace(/,/g, ""));
          }
          if(key === 'optionProfit'){
            arrOptionProfit.push((resLine[i].optionProfit).replace(/,/g, ""));
          }
          if(key === 'fundProfit'){
            arrFundProfit.push((resLine[i].fundProfit).replace(/,/g, ""));
          }
        }
      }
      dataSource[1].data += arrCreditProfit.join(';');
      dataSource[0].data += arrNormalProfit.join(';');
      dataSource[2].data += arrFinanProfit.join(';');
      dataSource[3].data += arrOptionProfit.join(';');
      dataSource[4].data += arrFundProfit.join(';');
      this.setState({
        barChartDataSource: dataSource,
        Time: this.unique(Time),
      },
      ()=>{
        this.initBarChart();
      }
      );
    }
  }).catch((error) => {
    message.error(!error.success ? error.message : error.note);
  });

}

  // 饼图
  initPieChart = () => {
    let { pieData,timeData,TotalData } = this.state;
    let { accounts = [] } = this.props;
    if (accounts.length) accounts = accounts.map(item => item.note);
    pieData = pieData.filter(item => accounts.includes(item.name));
    let option = {
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
                <div style={{ fontWeight: 600 }}>{params['name']}</div>
              </div>
              <div style={{ paddingLeft: 20 }}>
                <span>占比：</span>
                <span>{params['percent']}%</span>
              </div>
              <div style={{ paddingLeft: 20 }}>
                <span>交易量：</span>
                <span>{formatDw(params['value'])}元</span>
              </div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },

      title: {
        text: `数据截止至${timeData !== "" ? timeData.replace(/-/g, '.') : '--'}`,
        x: '28%',
        y: 60,
        textStyle: {
          fontSize: 14,
          color: '#61698C',
          fontWeight: 400,
        },
      },

      color: ['#7D93EE ', '#FFA257', '#0F8AFF ', '#00B7FF ', '#71CF8E'],

      legend: {
        orient: 'vertical',
        top: 'center',
        left: '65%',
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          fontSize: 14,
          color: ' #1A2243',
        },
      },

      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['30%', '50%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: (params) => {
                return [
                  `{a|总交易量}`,
                  `{b|${formatDw(TotalData.replace(/,/g, ""))}}`,
                ].join(`\n`);
              },
              rich: {
                a: {
                  color: ' #61698C',
                  fontSize: 14,
                  lineHeight: 20,
                  fontWeight: 400,
                },
                b: {
                  fontSize: 20,
                  fontFamily: 'EssenceSansStd-Regular',
                  color: '#1A2243',
                  lineHeight: 20,
                  fontWeight: 400,
                },
              },
            },
          },
          emphasis: {
          },
          itemStyle: {
            borderWidth: 1, //设置border宽度
            borderColor: '#fff',
          },
          labelLine: {
            show: false,
          },
          data: pieData, // [{name:'',valule:''},{...}]
        },
      ],
    };
    echarts.init(document.getElementById('pieChart'), null, { devicePixelRatio: 2 }).dispose();
    let myChart = echarts.init(document.getElementById('pieChart'), null, { devicePixelRatio: 2 });
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }

  // 柱状图
  initBarChart = () => {
    const { barChartDataSource,Time } = this.state;
    let { accounts = [] } = this.props;
    if (accounts.length) accounts = accounts.map(item => item.note);
    let series = [];
    const map = {
      普通: 0,
      信用: 1,
      理财: 2,
      期权: 3,
      基金投顾: 4,
    };
    accounts.forEach((item, index) => {
      series.push({
        name: item,
        type: 'bar',
        stack: 'Ad',
        barWidth: `${(barChartDataSource[map[item]]?.data?.split(';')?.length ?? 10) * 5}%`,
        data: barChartDataSource[map[item]]?.data?.split(';'), // 数组
        itemStyle: {
          normal: {
            // borderColor: '#fff',
          },
        },
      });
    });
    let option = {
      tooltip: {
        trigger: 'axis',
        extraCssText: 'box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);',
        padding: 0,
        formatter: (params) => {
          const countTotal = this.countTotal(params,'value');
          const jsx = (
          <>
            <div style={{ background: '#F3F4F7', padding: '16px 120px 16px 12px', color: '#1A2243' }}>
              <div style={{ fontWeight: 600 }}>{params[0].axisValue.replace(/^(\d{4})(\d{2})$/, "$1-$2")}总交易量</div>
              <div style={{ fontWeight: 600 }}>{formatDw(countTotal)}元</div>
            </div>
            <div style={{ padding: '16px', background: '#FFF', color: '#1A2243' }}>
              {params.map(item => (
                <div>
                  <span style={{ background: item.color, width: 8, height: 8, marginRight: 6, display: 'inline-block' }}></span>
                  <span>{item.seriesName}<text style={{ display: item.seriesName === '基金投顾' ? 'none' : '' }}>账户</text>：{formatDw(item.value)}元</span>
                </div>
              ))}
            </div>
          </>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      title: {
        text: '交易趋势',
        subtext: '单位 (元)',
        x: '3%',
        textStyle: {
          fontSize: 14,
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: 400,
        },
        subtextStyle: {
          fontSize: 12,
          color: 'rgba(0, 0, 0, 0.45)',
        },
      },
      color: ['#7D93EE ', '#FFA257', '#0F8AFF ', '#00B7FF ', '#71CF8E '],
      legend: {
        icon: 'rect',
        itemWidth: 8,
        itemHeight: 8,
        top: 20,
        borderRadius: 2,
        left: 'center',
        textStyle: {
          fontSize: 12,
          color: '#61698C',
        },
        splitLine: {
          lineStyle: {
            color: '#EBECF2',
          },
        },

      },
      grid: {
        left: '3%',
        right: '9%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          axisTick: {
            show: true,
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#959CBA',
            },
          },
          data: Time,
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series,
    };
    echarts.init(document.getElementById('barChart'), null, { devicePixelRatio: 2 }).dispose();
    let myChart = echarts.init(document.getElementById('barChart'), null, { devicePixelRatio: 2 });
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  }

  // 折线图
  initLineChart = () => {
    const { arrTotalProfit,ProfitDate,resLine } = this.state;
    let option = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      title: {
        text: '交易趋势',
        subtext: '单位 (元)',
        x: '3%',
        textStyle: {
          fontSize: 14,
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: 400,
        },
        subtextStyle: {
          fontSize: 12,
          color: 'rgba(0, 0, 0, 0.45)',
        },
      },
      tooltip: {
        trigger: 'axis',
        extraCssText: 'box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);',
        padding: 0,
        formatter: (params) => {
          const objectContent = resLine.filter(item=>{
            return item.profitDate === params[0].axisValue;
          });
          const keyName = [];
          const valueData = [];
          for (let key in objectContent) {
            for ( let i in objectContent[key] ){
              keyName.push(i);
              valueData.push(objectContent[key][i]);
            }
          }
          let { accounts = [] } = this.props;
          if (accounts.length) accounts = accounts.map(item => item.note);
          // 时间和总量筛除
          const map = {
            普通: 'normalProfit',
            信用: 'creditProfit',
            理财: 'finanProfit',
            期权: 'optionProfit',
            基金投顾: 'fundProfit',
          };
          const keyNameCopy = keyName.slice(2,7).filter(item => accounts.map(key => map[key]).includes(item));
          const temp = valueData.slice(2,7);
          const valueDataCopy = [];
          accounts.forEach((item, index) => {
            const m = {
              '普通': 0,
              '信用': 1,
              '理财': 2,
              '期权': 3,
              '基金投顾': 4,
            };
            valueDataCopy.push(temp[m[item]]);
          });
          const jsx = (
            <>
              <div style={{ background: '#F3F4F7', padding: '16px 120px 16px 12px', color: '#1A2243' }}>
                <div style={{ fontWeight: 600 }}>{(params[0].axisValue).replace(/^(\d{4})(\d{2})$/, "$1-$2")}总交易量</div>
                <div style={{ fontWeight: 600 }}>{formatDw(params.reduce((pre, cur) => pre + cur.value, 0))}元</div>
              </div>
              <div style={{ display: "flex",flexDirection: 'row',alignItems: 'center' ,background: '#FFF' }}>
                <div style={{ padding: '16px', color: '#1A2243' }}>

                  {keyNameCopy.map(item => (
                    <div>
                      {/* <span style={{ background: item.color, width: 8, height: 8, marginRight: 6, display: 'inline-block' }}></span> */}
                      <div>{item === 'normalProfit' ? <div style={{ display: 'flex',alignItems: 'center' }}> <div style={{ height: '8px',width: '8px',backgroundColor: '#7D93EE ',marginRight: '8px' }}></div> <div >普通账户:</div></div>
                        : item === 'creditProfit' ? <div style={{ display: 'flex',alignItems: 'center' }}> <div style={{ height: '8px',width: '8px',backgroundColor: '#FFA257',marginRight: '8px' }}></div> <div >信用账户:</div></div>
                          : item === 'finanProfit' ? <div style={{ display: 'flex',alignItems: 'center' }}> <div style={{ height: '8px',width: '8px',backgroundColor: '#0F8AFF ',marginRight: '8px' }}></div> <div >理财账户:</div></div>
                            : item === 'optionProfit' ? <div style={{ display: 'flex',alignItems: 'center' }}> <div style={{ height: '8px',width: '8px',backgroundColor: '#00B7FF  ',marginRight: '8px' }}></div> <div >期权账户:</div></div>
                              : item === 'fundProfit' ? <div style={{ display: 'flex',alignItems: 'center' }}> <div style={{ height: '8px',width: '8px',backgroundColor: '#71CF8E',marginRight: '8px' }}></div> <div >基金投顾:</div></div> : '' }</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px', width: '100%', color: '#1A2243',marginLeft: '-25px' }}>
                  {valueDataCopy.map(item => (
                    <div>
                      {/* <span style={{ background: item.color, width: 8, height: 8, marginRight: 6, display: 'inline-block' }}></span> */}
                      <span>{item}元</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      legend: {
        icon: 'circle',
        itemWidth: 19,
        itemHeight: 8,
        top: 20,
        left: 'center',
        textStyle: {
          fontSize: 12,
          color: '#61698C',
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: '#959CBA',
          },
          axisLabel: { // X数据
            // interval: Math.floor(result.length / 3),
            formatter(value) {
              return `${value.toString().substring(0, 4)}`;
              // return `${value.toString().substring(0, 4)}-${value.toString().substring(4, 6)}-${value.toString().substring(6)}`;
            },
          },
        },
        data: ProfitDate,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: '总交易量',
          data: arrTotalProfit, // 数组
          type: 'line',
          lineStyle: {
            color: '#244FFF',
            width: 1,
          },
          symbol: 'circle',
          showSymbol: true,
          symbolSize: 1,
          itemStyle: {
            color: '#244FFF',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: 'rgba(91, 156, 255, 0)',
              },
              {
                offset: 1,
                color: 'rgba(91, 156, 255, 0.06)',
              },
            ]),
          },
        },
      ],
    };
    echarts.init(document.getElementById('lineChart'), null, { devicePixelRatio: 2 }).dispose();
    let myChart = echarts.init(document.getElementById('lineChart'), null, { devicePixelRatio: 2 });
    myChart.resize();
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize();
    };
  }


  clickChange = (key) => {
    this.setState({
      chartType: key,
    },
    ()=>{
      if( key === 1){
        // 埋点
        clickSensors('趋势图切换按钮');
        newClickSensors({
          third_module: "交易",
          ax_button_name: "柱状图选择次数",
        });
        this.initBarChart();

      }else {
        newClickSensors({
          third_module: "交易",
          ax_button_name: "趋势图选择次数",
        });
        clickSensors('趋势图切换按钮');
        this.initLineChart();
      }
    }
    );
  }
  render() {
    const { isMonth, isMoreYear } = this.props;
    const { chartType,res = [],resLine = [] } = this.state;
    return (
      <Fragment>
        <div className={styles.chartBox}>
          <div style={{ fontSize: 16, color: ' #1A2243', fontWeight: 500 }}>交易概况</div>
          <Divider style={{ margin: '16px 0' }}></Divider>
          <div className={styles.echartBox}>
            <div className={styles.pieChart}>
              {
                res.length === 0 ? (<Empty image={defaultImg} description='' style={{ height: '400px', paddingTop: '120px' }} />) : (<div id='pieChart' className={styles.pieChart}></div>)
              }
            </div>

            <div className={styles.barChart} style={{ position: 'relative' }}>
              {
                res.length === 0 ? (<Empty image={defaultImg} description='' style={{ height: '400px', paddingTop: '120px' }} />) : (
                  <Fragment>
                    {
                      isMoreYear ? (
                        null
                      ) : (
                        <div style={{ position: 'absolute', left: 100, pointerEvents: 'auto', zIndex: 1, display: isMonth === 1 ? 'block' : 'none' }}>

                          <span className={styles.cutBtn} onClick={()=>{this.clickChange(1);}} style={{ color: chartType === 1 ? '#244FFF' : '', borderColor: chartType === 1 ? '#244FFF' : '' ,borderRadius: 1 }}><img style={{ height: 17,width: 17 }} src={iconCheck} alt=''/>柱形图</span>
                          <span className={styles.cutBtn} onClick={()=>{this.clickChange(2);}} style={{ color: chartType === 2 ? '#244FFF' : '', borderColor: chartType === 2 ? '#244FFF' : '',borderRadius: 1 }}><img style={{ height: 17,width: 17 }} src={iconLineBar} alt=''/>趋势图</span>
                        </div>
                      )
                    }
                    <div id='barChart' className={styles.barChart} style={{ display: chartType === 1 && !isMoreYear ? 'block' : 'none' }}></div>
                    <div id='lineChart' className={styles.barChart} style={{ display: chartType === 2 || isMonth !== 1 && isMoreYear ? 'block' : 'none' }}></div>
                  </Fragment>
                )
              }

            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(echartPie);
