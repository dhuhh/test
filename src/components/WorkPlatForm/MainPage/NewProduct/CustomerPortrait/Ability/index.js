import React, { Component } from 'react';
import { Select, Modal, Empty, Button } from 'antd';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import Title from '../Common/Title';
import Poptag from '../Common/Poptag';
import CustomerInvestDetail from './CustomerInvestDetail';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import styles from './index.less';
import { QueryAnaCalendar, QueryAnaScore } from '$services/newProduct';
//import defaultImg from '$assets/newProduct/customerPortrait/缺省图@2x.png';
import defaultImg from '$assets/newProduct/customerPortrait/defaultGraph@2x.png';
import { getPdf } from '../util';
// import { transform } from 'lodash';

require('echarts/lib/chart/radar');
require("echarts/lib/component/legend");
let echarts = require('echarts/lib/echarts');


const { Option } = Select;

export default class Ability extends Component {
  state = {
    compositiveScore: '',
    averageAblility: {},
    personalAblility: {},
    rank: '',
    anaCalendar: [],
    date: [],
    visible: false,
    personalAblilityArr: [],
    averageAblilityArr: new Array(5),
    time: '1',
    recent1: '',
    recent2: '',
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
    newClickSensors({
      third_module: "画像",
      ax_page_name: "账户投资能力",
      ax_button_name: "查看账户分析报告次数",
    });
  };
  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  componentDidMount() {
    //近两年日期详情
    this.getRecentDetailDate();
    //查询账户分析日历
    this.queryInvestCalandar();

    //查询各项能力得分详情
    this.getInfoByYear(this.state.time);
  }
  personalAblilityArr() {
    let arr = [];
    const { personalAblility } = this.state;
    arr[0] = personalAblility.profit;
    arr[1] = personalAblility.pos_manage;
    arr[2] = personalAblility.pos_close;
    arr[3] = personalAblility.selection;
    arr[4] = personalAblility.risk_control;
    return arr;
  }
  averageAblilityArr() {
    let arr = [];
    const { averageAblility } = this.state;
    arr[0] = averageAblility.profit;
    arr[1] = averageAblility.pos_manage;
    arr[2] = averageAblility.pos_close;
    arr[3] = averageAblility.selection;
    arr[4] = averageAblility.risk_control;
    return arr;
  }

  getOption = () => {
    let option = {
      color: ['#234FFF', '#E9B552'],
      legend: {
        show: false,
        data: [{
          name: '该客户',
          icon: 'rect',
          textStyle: {
            fontSize: 13,
            fontWeight: 400,
            color: '#61698c',
          },
        }, {
          name: '平均水平',
          icon: 'rect',
          textStyle: {
            fontSize: 13,
            fontWeight: 400,
            color: '#61698c',
          },
        }],
        bottom: 39,
        width: 400,
        height: 26,
        itemWidth: 16,
        itemHeight: 6,
        itemGap: 86,
      },
      /* grid: {
        height: 900,
        top: 100,
      }, */
      radar: {
        radius: 100,
        splitNumber: 3,
        axisLine: {
          symbol: ['none', 'circle'],
          symbolSize: 4,
          lineStyle: {
            type: 'dashed',
          },
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        name: {
          formatter: (param) => {
            if (!param) {
              return '';
            }
            const params = param.split('|');
            return `{name|${params[0]}}\n{number|${params[1]}}`;
          },
          rich: {
            name: {
              fontSize: 13,
              fontWeight: 400,
              color: '#61698c',
              lineHeight: 20,
            },
            number: {
              fontSize: 13,
              fontWeight: 400,
              color: '#1a2243',
              lineHeight: 20,
              align: 'center',
            },
          },
        },
        shape: 'circle',
        splitArea: {
          show: false,
        },
        indicator: [{
          name: `盈利能力|${/* JSON.parse(localStorage.getItem('personalAblilityArr'))[0] ||  */this.state.personalAblilityArr[0]}分`,
          max: 20,
        }, {
          name: `仓位管理能力|${/* JSON.parse(localStorage.getItem('personalAblilityArr'))[1] ||  */this.state.personalAblilityArr[1]}分`,
          max: 20,
        }, {
          name: `止盈止损能力|${/* JSON.parse(localStorage.getItem('personalAblilityArr'))[2] ||  */this.state.personalAblilityArr[2]}分`,
          max: 20,
        }, {
          name: `资产选择能力|${/* JSON.parse(localStorage.getItem('personalAblilityArr'))[3] ||  */this.state.personalAblilityArr[3]}分`,
          max: 20,
        }, {
          name: `风险控制能力|${/* JSON.parse(localStorage.getItem('personalAblilityArr'))[4] ||  */this.state.personalAblilityArr[4]}分`,
          max: 20,
        }],
      },
      series: [{
        type: 'radar',
        zlevel: 2,
        data: [{
          name: '该客户',
          symbol: 'none',
          value: this.state.personalAblilityArr,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0.5,
              y: 1,
              x2: 0.5,
              y2: 0,
              colorStops: [{
                offset: 0, color: '#1080FF', // 0% 处的颜色
              }, {
                offset: 1, color: '#234FFF', // 100% 处的颜色
              }],
              global: false, // 缺省为 false
            },
          },
        }],
        lineStyle: {
          color: '#234FFF',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: '#1080FF',
            },
            {
              offset: 1,
              color: '#234FFF',
            },
          ]),
        },
      }, {
        type: 'radar',
        zlevel: 1,
        data: [{
          symbol: 'none',
          name: '平均水平',
          value: this.state.averageAblilityArr,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0.5,
              y: 1,
              x2: 0.5,
              y2: 0,
              colorStops: [{
                offset: 0, color: '#FFE7B6', // 0% 处的颜色
              }, {
                offset: 1, color: '#FFCF74', // 100% 处的颜色
              }],
              global: false, // 缺省为 false
            },
          },
        }],
        lineStyle: {
          color: '#E9B552',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: '#FFE7B6',
            },
            {
              offset: 1,
              color: '#FFCF74',
            },
          ]),
        },
      }],
    };
    return option;
  }

  handleChange = (value,a) => {
    newClickSensors({
      third_module: "画像",
      ax_page_name: "账户投资能力",
      ax_button_name: "统计周期" + a.props.title ,
    });
    this.setState({ time: value });
    this.getInfoByYear(value);
  }
  getRecentDetailDate() {
    let recent1 = `${moment().subtract(1, "years").format("YYYY.MM.DD")}-${moment().format("YYYY.MM.DD")}`;
    let recent2 = `${moment().subtract(2, "years").format("YYYY.MM.DD")}-${moment().format("YYYY.MM.DD")}`;
    this.setState({
      recent1,
      recent2,
    });
  }
  getInfoByYear = (timeRange) => {
    const map = {
      '1': '近一年',
      '2': '近两年',
      // '3': this.props.anaCalendar[0],
      // '4': this.props.anaCalendar[1],
    };
    this.state.anaCalendar.forEach((item, index) => {
      map[index + 3] = item;
    });
    const param = {
      cusCode: this.props.cusCode,
      term: '360',
    };
    // 如果不是年份
    if (map[timeRange] === '近两年') {
      param.term = '720';
    } else if (map[timeRange] === '近一年') {
      param.term = '360';
    } else {
      param.year = map[timeRange];
    }
    //更新各项能力得分详情
    this.queryInvestScore(param);
  }
  queryInvestCalandar = () => {
    QueryAnaCalendar({
      "cusCode": this.props.cusCode,
      /* "term": "360",
      "year": "2020", */
    }).then(res => {
      let dateArr = res.records.yearly_report.sort((a, b) => b - a);
      let month = moment().format('MM');
      let day = moment().format('DD');
      let date = [];
      dateArr.forEach((item, index) => {
        if (`${item}` === moment().format('YYYY')) {
          date.push(`${item}.01.01-${item}.${month}.${day}`);
        } else {
          date.push(`${item}.01.01-${item}.12.31`);
        }
      });
      /* let date1 = `${dateArr[0]}.01.01-${dateArr[0]}.${month}.${day}`;
      let date2 = `${dateArr[1]}.01.01-${dateArr[1]}.12.31`; */
      this.setState({
        anaCalendar: dateArr,
        date,
      });

    });
  }
  queryInvestScore = (param) => {
    QueryAnaScore(param).then(res => {
      const { compositive_score, rank, average_ablility, personal_ablility, compute_begin_date, compute_end_date } = res.records;
      let beginDate = compute_begin_date.split('-').join('.');
      let endDate = compute_end_date.split('-').join('.');
      this.setState({
        compositiveScore: compositive_score,
        averageAblility: average_ablility,
        personalAblility: personal_ablility,
        rank: rank,
        beginDate: beginDate,
        endDate: endDate,
      });
      this.setState({
        personalAblilityArr: this.personalAblilityArr(),
        averageAblilityArr: this.averageAblilityArr(),
      });
    });
  }

  export = () => {
    let title = moment().format('账户分析报告(YYYYMMDD)');
    newClickSensors({
      third_module: "画像",
      ax_page_name: "账户投资能力",
      ax_button_name: "账户投资能力导出点击次数"
    });
    getPdf(title, '#customerInvestDetailModal', this.modal.scrollRef);
  }
  render() {
    return (
      <div className={styles.ability}>
        <Modal
          className={styles.modal}
          title={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 18, color: '#1A2243' }}>账户分析报告</span><span style={{ fontSize: 14, color: '#959CBA', paddingLeft: 7 }}>每周末更新数据</span>
            </div>
            <div style={{ position: 'relative', left: -50 }}>
              <Button style={{ height: 34 }} className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.export}>导出</Button>
            </div>
          </div>}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          style={{ top: 50, padding: 0 }}
          width='568px'
          destroyOnClose
        // visible={true}
        >
          {/* {
            this.state.compositiveScore === '' ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '766px', paddingTop: '130px' }} description='过去三个月客户账户收益缺失,暂无分析报告' /> :
              (<CustomerInvestDetail anaCalendar={this.state.anaCalendar} cusCode={this.props.cusCode} time={this.state.time} detailDate={[this.state.date1, this.state.date2, this.state.recent1, this.state.recent2]} />)
          } */}
          <CustomerInvestDetail getInstance={(modal) => this.modal = modal} anaCalendar={this.state.anaCalendar} cusCode={this.props.cusCode} time={this.state.time} detailDate={this.state.date} recent1={this.state.recent1}
            recent2={this.state.recent2} />
        </Modal>
        <Title title='账户投资能力'>
          <span>统计周期</span>
          <Select optionLabelProp='title' value={this.state.time} style={{ width: 120, height: 32 }} onChange={this.handleChange} dropdownClassName={styles.select}>
            <Option value="2" title='近两年'>{`近两年`}</Option>
            <Option value="1" title='近一年'>{`近一年`}</Option>

            {
              this.state.anaCalendar.map((item, index) => {
                if (item !== moment().format('YYYY')) return <Select.Option key={`${index + 3}`} value={`${index + 3}`} title={item}>{`${item}`}</Select.Option>;
                return null;
              })
            }
            {/* <Option value="2">近两年</Option>
            <Option value="1">近一年</Option>
            <Option value="3">{this.state.anaCalendar[0]}</Option>
            <Option value="4">{this.state.anaCalendar[1]}</Option> */}
          </Select>
          {/* <span onClick={this.showModal} style={{ display: this.state.compositiveScore === '' ? 'none' : 'inline' }}>
            查看账户分析报告
            <img src={require('$assets/newProduct/customerPortrait/common_year_arrow_light_right.png')} alt=''></img>
          </span> */}
        </Title>
        <div className={styles.line}></div>
        {
          this.state.compositiveScore === '' ? <Empty image={defaultImg} description='过去三个月该客户的账户收益数据缺失,暂无账户分析报告' style={{ height: '400px', paddingTop: '120px' }} /> : (
            <div>
              <div className={styles.content}>
                <div className={styles.left}>
                  <ReactEcharts option={this.state.personalAblilityArr.length ? this.getOption() : {}} style={{ height: '400px', width: '400px' }} />
                  <div className={styles.analycis_chart_tip}>
                    <p><em className={styles.ac_tip_g1} /><span>该客户</span></p>
                    <p><em className={styles.ac_tip_g2} /><span>平均水平</span></p>
                  </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.right}>
                  <div style={{ fontFamily: 'EssenceSansStd-Regular' }}>{this.state.compositiveScore}<span>分</span></div>
                  <div>最终综合得分</div>
                  <Poptag rank={`${this.state.rank}%`} type='ability' />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 28 }}>
                <Button
                  style={{ width: 152, height: 32, background: '#244FFF', color: '#FFF', borderRadius: 2, boxShadow: '0px 2px 14px 0px rgba(0, 26, 78, 0.14)' }}
                  onClick={this.showModal}
                >
                  查看账户分析报告
                </Button>
              </div>
            </div>
          )
        }
      </div >
    );
  }
}
