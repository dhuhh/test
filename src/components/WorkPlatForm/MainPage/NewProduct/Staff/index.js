import React, { Component } from "react";
import {
  Divider,
  Icon,
  DatePicker,
  Button,
  Select,
  Progress,
  message,
  Popover,
  Empty,
  Col,
  Row,
  RightOutlined,
  Spin
} from "antd";
import { connect } from "dva";
import { history, Link } from "umi";
import moment from "moment";
import * as echarts from "echarts";
import ReactDOMServer from "react-dom/server";
import ShowCardSimple from "./showCard-simple/index";
import {
  formatColor,
  formatThousands,
  formatDw,
  viewSensors,
  clickSensors
} from "./util";
import {
  QueryCustBasicInfo,
  QueryNewCustchanges,
  QueryCustGradeDis,
  QueryCustServiceDis,
  QueryCustAssetOverview,
  QueryProportionOfAsset,
  QueryZcRankInfo,
  QueryAssetTrendAnalysis,
  QueryIncomeGeneInfo,
  QueryWorksInfo,
  QueryServiceChange,
  QueryQualificationInfo,
  QueryStaffEfficiency2, //员工主页绩效查询
  QueryIndexCustDetails //查询员工指标明细客户
} from "$services/newProduct";
//import { getResponse } from '$services/customer/customerTag'
import getdate from "./test";
import defaultImg from "$assets/newProduct/customerPortrait/缺省图@2x.png";
import custImg from "$assets/newProduct/staff/icon_my_kehu@2x.png";
import assetsImg from "$assets/newProduct/staff/icon_my_zcgk@2x.png";
import questionImg from "$assets/newProduct/customerPortrait/question-mark.png";
import zzcImg from "$assets/newProduct/staff/icon_my_zzc@2x.png";
import jzcImg from "$assets/newProduct/staff/icon_my_jzc@2x.png";
import zclrImg from "$assets/newProduct/staff/icon_my_zclr@2x.png";
import bylImg from "$assets/newProduct/staff/icon_my_byl@2x.png";
import yjcsImg from "$assets/newProduct/staff/icon_my_yjcs@2x.png";
import jylImg from "$assets/newProduct/staff/icon_my_jyl@2x.png";
import zgxImg from "$assets/newProduct/staff/icon_my_zgx@2x.png";
import jyjImg from "$assets/newProduct/staff/icon_my_jyj@2x.png";
import jycsImg from "$assets/newProduct/staff/icon_my_ssyj@2x.png";
import workImg from "$assets/newProduct/staff/icon_my_work@2x.png";
import downImg from "$assets/newProduct/staff/icon_my_down@2x.png";
import top1Img from "$assets/newProduct/staff/icon_my_top1@2x.png";
import top2Img from "$assets/newProduct/staff/icon_my_top2@2x.png";
import top3Img from "$assets/newProduct/staff/icon_my_top3@2x.png";
import upImg from "$assets/newProduct/staff/icon_my_up@2x.png";
import jXiaoImg from "$assets/newProduct/staff/icon_my_jixiao@2x.png";
import jXiaoBtnImg from "$assets/newProduct/staff/icon_jixiao@2x.png";

import styles from "./index.less";
const topImg = [top1Img, top2Img, top3Img];
class Staff extends Component {
  state = {
    hasRespon: false,
    dateBtn: 1,
    custDate: [moment().subtract(1, "months"), moment()],
    businessType: "2",
    businessData: [],
    gxTypeData: [
      { ibm: 0, note: "全部" },
      { ibm: 1, note: "服务关系" },
      { ibm: 10, note: "开发关系" },
      { ibm: 11, note: "无效户激活" }
    ],
    gxType: 0,
    assetsType: 0,
    tjDateType: 1,
    tjDate: [moment().subtract(1, "months"), moment()],
    tjMonth: [moment().subtract(1, "months"), moment()],
    tjDateStart: undefined,
    mode: ["date", "date"],
    basicInfo: {},
    custLineData: [],
    custRank: [],
    custServe: {},
    assetInfo: {},
    assetRatio: {},
    assetRank: {},
    assetTrend: [],
    Income: [],
    workInfo: {},
    qualificationInfo: {},
    select: moment().format("YYYY"),
    kaoheTest: [
      {
        id: "1",
        mubiao: 100,
        wancheng: 90,
        paiming: 1,
        xishu: 0.8
      },
      {
        id: "2",
        mubiao: 100,
        wancheng: 80,
        paiming: 2,
        xishu: 0.8
      },
      {
        id: "3",
        mubiao: 100,
        wancheng: 70,
        paiming: 3,
        xishu: 0.8
      },
      {
        id: "4",
        mubiao: 100,
        wancheng: 60,
        paiming: 4,
        xishu: 0.8
      },
      {
        id: "5",
        mubiao: 100,
        wancheng: 50,
        paiming: 5,
        xishu: 0.8
      },
      {
        id: "6",
        mubiao: 100,
        wancheng: 23,
        paiming: 6,
        xishu: 0.8
      }
    ],
    assessData: {},
    kaoheType: true,

    time: moment(),
    yearSelect: false,
    spinLoading: false
  };
  componentDidMount() {
    console.log(this.props.authorities, "this.props.authorities");
    this.queryServiceChange();
    this.queryCustBasicInfo();
    this.queryNewCustchanges();
    this.queryCustGradeDis();
    this.queryCustServiceDis();
    this.queryCustAssetOverview();
    this.queryProportionOfAsset();
    this.queryZcRankInfo();
    this.queryAssetTrendAnalysis();
    this.queryIncomeGeneInfo();
    this.queryWorksInfo();
    this.queryQualificationInfo();
    this.queryStaffEfficiency({
      annual: this.state.select,
      userId: JSON.parse(sessionStorage.getItem("user")).id
    });
    //this.GetResponse()
    //this.kaoHeXinKaiYouXiao()
  }
  /*  GetResponse=()=>{
    getResponse({}).then(res=>{
      console.log(res.records[0],'权限权限')
      if(res.records[0].result=='是'){
        console.log('判断为是');
        this.setState({hasRespon:true})
    }else{
      console.log('判断为否');
      this.setState({hasRespon:false})
    }
    })
  } */
  //绩效模块考核年度变更回调
  handleChange = val => {
    console.log(val);
    /* this.queryStaffEfficiency({ annual:val})
      this.setState({ select: val }); */
  };
  //员工主页绩效查询
  queryStaffEfficiency = val => {
    this.setState({ spinLoading: true });
    QueryStaffEfficiency2(val)
      .then(res => {
        console.log("员工主页绩效查询", res);
        const { records = [] } = res;
        this.setState({ assessData: records[0] });
      })
      .catch(err => message.error(err.note || err.message))
      .finally(() => this.setState({ spinLoading: false }));
  };
  handleYearOpenChange = status => {
    if (status) {
      this.setState({ yearSelect: true });
    } else {
      this.setState({ yearSelect: false });
    }
  };
  handleYearPanelChange = value => {
    this.queryStaffEfficiency({ annual: value.format("YYYY") });
    console.log(value.format("YYYY"));
    this.setState({
      yearSelect: false,
      time: value
    });
    this.setState({ select: value.format("YYYY") });
  };
  //执业资格信息
  queryQualificationInfo = () => {
    QueryQualificationInfo()
      .then(res => {
        console.log("职业资格信息", res);
        this.setState({ qualificationInfo: res.records[0] || {} });
      })
      .catch(err => message.error(err.note || err.message));
  };
  //业务机会字典
  queryServiceChange = () => {
    QueryServiceChange().then(res => {
      console.log("业务机会字典", res);
      this.setState({
        businessData: res.records
      });
    });
  };
  //客户基本信息
  queryCustBasicInfo = () => {
    QueryCustBasicInfo({
      custNo: this.props.userId
      // "custNo": "3898",
    })
      .then(res => {
        console.log("客户基本信息", res);
        this.setState({ basicInfo: res.records[0] || {} });
      })
      .catch(err => message.error(err.note || err.message));
  };
  //新增客户变化
  queryNewCustchanges = () => {
    QueryNewCustchanges({
      // "custNo": "28653",
      // "beginDate": "20180101",
      // "endDate": "20180201",
      custNo: this.props.userId,
      beginDate: this.state.custDate[0].format("YYYYMMDD"),
      endDate: this.state.custDate[1].format("YYYYMMDD")
    })
      .then(res => {
        console.log("新增客户变化", res);
        this.setState(
          {
            custLineData: res.records
          },
          () => {
            if (this.state.custLineData.length > 0) {
              this.initCustLineChart();
            }
          }
        );
      })
      .catch(err => message.error(err.note || err.message));
  };
  //客户等级分布
  queryCustGradeDis = () => {
    QueryCustGradeDis({
      custNo: this.props.userId
      // "custNo": "2583",
    })
      .then(res => {
        console.log("客户等级分布", res);
        this.setState(
          {
            custRank: res.records?.sort((a, b) => b?.grade - a?.grade)
          },
          () => {
            if (Object.keys(this.state.custRank).length > 0) {
              this.initRankPie();
            }
          }
        );
      })
      .catch(err => message.error(err.note || err.message));
  };
  //客户业务分布
  queryCustServiceDis = () => {
    QueryCustServiceDis({
      type: this.state.businessType + "",
      custNo: this.props.userId
      // "custNo": "29009",
    })
      .then(res => {
        this.setState(
          {
            custServe: res.records[0] || {}
          },
          () => {
            if (Object.keys(this.state.custServe).length > 0) {
              this.initBusinessPie();
            }
          }
        );
      })
      .catch(err => message.error(err.note || err.message));
  };
  //资产概况
  queryCustAssetOverview = () => {
    QueryCustAssetOverview({
      // "custNo": "2583",
      custNo: this.props.userId
    })
      .then(res => {
        console.log("资产概况", res);
        this.setState({
          assetInfo: res.records[0] || {}
        });
      })
      .catch(err => message.error(err.note || err.message));
  };
  //资产分类占比
  queryProportionOfAsset = () => {
    QueryProportionOfAsset({
      // "custNo": "2583",
      custNo: this.props.userId,
      kind: this.state.assetsType
    })
      .then(res => {
        console.log("资产分类占比", res);
        this.setState(
          {
            assetRatio: res.records[0] || {}
          },
          () => {
            if (Object.keys(this.state.assetRatio).length > 0) {
              this.initAssetsPie();
            }
          }
        );
      })
      .catch(err => message.error(err.note || err.message));
  };
  //资产排名情况
  queryZcRankInfo = () => {
    QueryZcRankInfo({
      // "custNo": "2583",
      custNo: this.props.userId
    })
      .then(res => {
        console.log("资产排名情况", res);
        this.setState({
          assetRank: res.result[0] || {}
        });
      })
      .catch(err => message.error(err.note || err.message));
  };
  //资产趋势图
  queryAssetTrendAnalysis = () => {
    QueryAssetTrendAnalysis({
      // "custNo": "2583",
      custNo: this.props.userId,
      kind: this.state.gxType,
      monthOrday: this.state.tjDateType,
      beginDate:
        this.state.tjDateType === 1
          ? this.state.tjDate[0]?.format("YYYYMMDD")
          : this.state.tjMonth[0]?.format("YYYYMM"),
      endDate:
        this.state.tjDateType === 1
          ? this.state.tjDate[1]?.format("YYYYMMDD")
          : this.state.tjMonth[1]?.format("YYYYMM")
    })
      .then(res => {
        this.setState(
          {
            assetTrend: res.records
          },
          () => {
            if (this.state.assetTrend.length > 0) {
              this.initAssetsLineChart();
            }
          }
        );
      })
      .catch(err => message.error(err.note || err.message));
  };
  //业绩创收
  queryIncomeGeneInfo = () => {
    QueryIncomeGeneInfo({
      // "custNo": "29009",
      custNo: this.props.userId
    })
      .then(res => {
        this.setState(
          {
            Income: res.records.data
          },
          () => {
            this.initTradeBar();
            this.initCommissionBar();
          }
        );
      })
      .catch(err => message.error(err.note || err.message));
  };
  //工作模块
  queryWorksInfo = () => {
    QueryWorksInfo({
      // "custNo": "29009",
      custNo: this.props.userId
    })
      .then(res => {
        this.setState({
          workInfo: res.records[0] || {}
        });
      })
      .catch(err => message.error(err.note || err.message));
  };

  //新增客户变化趋势图
  initCustLineChart = () => {
    const { custLineData } = this.state;
    let time = custLineData?.map(item => item.time);
    let newCust = custLineData?.map(item => item.newCust);
    let newEffective = custLineData?.map(item => item.newEffective);
    let richNum = custLineData?.map(item => item.richNum);
    let option = {
      title: {
        text: "新增客户变化",
        textStyle: {
          fontSize: 14,
          color: "rgba(0, 0, 0, 0.85)",
          fontWeight: 400
        }
      },
      color: [" #0F8AFF", "#00B7FF", "#F6C34F"],
      legend: {
        top: 0,
        left: "center",
        icon: "circle",
        itemWidth: 8,
        itemGap: 40,
        textStyle: {
          fontSize: 14,
          color: " #1A2243"
        }
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true
      },
      tooltip: {
        trigger: "axis",
        extraCssText: "box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);",
        padding: 0,
        formatter: params => {
          // console.log(params);
          const jsx = (
            <>
              <div
                style={{
                  padding: "12px",
                  background: "#FFF",
                  color: "#1A2243",
                  borderRadius: 2
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 12 }}>
                  {params[0].axisValue.length === 6
                    ? moment(params[0].axisValue).format("YYYY-MM")
                    : moment(params[0].axisValue).format("YYYY-MM-DD")}
                </div>
                {params.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: index === params.length - 1 ? 0 : 8
                    }}
                  >
                    <span
                      style={{
                        background: item.color,
                        width: 8,
                        height: 8,
                        marginRight: 6,
                        display: "inline-block",
                        borderRadius: "50%"
                      }}
                    ></span>
                    <span>
                      {item.seriesName}：{item.value}人
                    </span>
                  </div>
                ))}
              </div>
            </>
          );
          return ReactDOMServer.renderToString(jsx);
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        axisTick: {
          show: true,
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: "#BFBFBF"
          }
        },
        data: time
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: "#EBECF2"
          }
        }
      },
      series: [
        {
          name: "新开客户数",
          type: "line",
          data: newCust,
          symbol: "circle",
          showSymbol: true,
          symbolSize: 1,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(15, 138, 255, 0)"
              },
              {
                offset: 1,
                color: "rgba(15, 138, 255, 0.06)"
              }
            ])
          }
        },
        {
          name: "新增有效户",
          type: "line",
          data: newEffective,
          symbol: "circle",
          showSymbol: true,
          symbolSize: 1,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(0, 183, 255, 0)"
              },
              {
                offset: 1,
                color: "rgba(0, 183, 255, 0.06)"
              }
            ])
          }
        }
        // {
        //   name: '新增中端富裕客户数',
        //   type: 'line',
        //   // stack: 'Total',
        //   data: richNum,
        //   symbol: 'circle',
        //   showSymbol: true,
        //   symbolSize: 1,
        //   lineStyle: {
        //     width: 1.5,
        //   },
        //   areaStyle: {
        //     color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        //       {
        //         offset: 0,
        //         color: 'rgba(246, 195, 79, 0)',
        //       },
        //       {
        //         offset: 1,
        //         color: 'rgba(246, 195, 79, 0.06)',
        //       },
        //     ]),
        //   },
        // },
      ]
    };
    let myChart = echarts.init(document.getElementById("custLine"), null, {
      devicePixelRatio: 2
    });
    // myChart.resize();
    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };
  //客户等级分布饼图
  initRankPie = () => {
    let colorData = [
      "#0F8AFF",
      "#00B7FF",
      "#F6C34F",
      "#FFA257",
      "#FF7957",
      "#E9D54C",
      "#71CF8E"
    ];
    const { custRank } = this.state;
    let data = custRank.map(item => {
      return { name: item.grade, value: item.number };
    });
    let option = {
      color: colorData,
      legend: {
        //图例组件
        orient: "vertical", //图例列表的布局朝向。
        top: "center", //图例组件离容器上侧的距离。
        left: "48%",
        icon: "circle",
        itemGap: 15, //图例每项之间的间隔。
        itemWidth: 8, //图例标记的图形宽度。
        formatter: function(name) {
          //格式化图例
          return `{a|${name}}{b|占比：}{c|${
            custRank.find(item => item.grade === name).proportion
          }}{b|人数：}{c|${
            custRank.find(item => item.grade === name).number
          }人}`;
        },
        textStyle: {
          //全局的字体样式
          rich: {
            a: {
              fontSize: 14,
              fontWeight: 500,
              color: "#1A2243"
            },
            b: {
              fontSize: 14,
              color: "#61698C",
              padding: [0, 0, 0, 24]
            },
            c: {
              fontSize: 14,
              color: "#1A2243",
              width: 48
            }
          }
        }
      },
      series: [
        //主要配置项
        {
          name: "",
          type: "pie", //指定echarts为饼
          radius: ["38%", "63%"], //外圈和内圈的范围
          center: [0, "50%"],
          left: "30%",
          avoidLabelOverlap: true, //防止标签重叠
          label: {
            //是否显示文本标签
            show: false,
            position: "center"
          },
          itemStyle: {
            borderWidth: 1, //设置border宽度
            borderColor: "#fff"
          },
          labelLine: {
            show: false
          },
          data
        }
      ]
    };
    let myChart = echarts.init(document.getElementById("rankPie"), null, {
      devicePixelRatio: 2
    });
    myChart.setOption(option);
    // myChart.resize();
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };
  //业务分布饼图
  initBusinessPie = () => {
    let colorData = ["#0F8AFF", "#00B7FF", "#F6C34F"];
    const { custServe } = this.state;
    let data =
      Object.keys(custServe).length > 0
        ? [
            { name: "已开通", value: custServe.openNum },
            { name: "已达标未开通", value: custServe.suceNum },
            { name: "未开通未达标", value: custServe.failNum }
          ]
        : [];
    let option = {
      color: colorData,
      series: [
        {
          name: "",
          type: "pie",
          radius: ["38%", "63%"],
          center: [0, "50%"],
          left: "30%",
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: "center"
          },
          itemStyle: {
            borderWidth: 1, //设置border宽度
            borderColor: "#fff"
          },
          labelLine: {
            show: false
          },
          data
        }
      ]
    };
    let myChart = echarts.init(document.getElementById("businessPie"), null, {
      devicePixelRatio: 2
    });
    myChart.setOption(option);
    myChart.on("legendselectchanged", params => {
      myChart.setOption({
        legend: { selected: { [params.name]: true } }
      });
      this.routeBusiness(params.name);
    });
    // myChart.resize();
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };
  //考核-新开有效户饼图
  // kaoHeXinKaiYouXiao = () => {
  //   let colorData = ["#00B7FF"];
  //   let option = {
  //     tooltip: {
  //       trigger: "item"
  //     },
  //
  //     series: [
  //       {
  //         name: "",
  //         type: "pie",
  //         radius: ["70%", "100%"],
  //         center: ["50%", "50%"],
  //
  //         avoidLabelOverlap: true,
  //         label: {
  //           show: false,
  //           position: "center"
  //         },
  //         itemStyle: {
  //           borderWidth: 1, //设置border宽度
  //           borderColor: "#fff"
  //         },
  //         labelLine: {
  //           show: false
  //         },
  //         data: [
  //           { value: 1048, name: "Search Engine" },
  //           { value: 735, name: "Direct" }
  //         ]
  //       }
  //     ]
  //   };
  //   let myChart = echarts.init(document.getElementById("kaoHePie"), null, {
  //     devicePixelRatio: 4
  //   });
  //   myChart.setOption(option);
  //   window.addEventListener("resize", () => {
  //     myChart.resize();
  //   });
  // };
  //资产分类占比饼图
  initAssetsPie = () => {
    let colorData = ["#0F8AFF", "#00B7FF", "#F6C34F", "#FFA257", "#FF7957"];
    const { assetRatio } = this.state;
    let data =
      Object.keys(assetRatio).length > 0
        ? [
            {
              name: "普通账户",
              value: assetRatio?.ptMoney,
              ratio: assetRatio?.ptProportion
            },
            {
              name: "信用账户",
              value: assetRatio?.rzrqMoney,
              ratio: assetRatio?.rzrqProportion
            },
            {
              name: "理财账户",
              value: assetRatio?.lccpMoney,
              ratio: assetRatio?.lccpProportion
            },
            {
              name: "股票期权账户",
              value: assetRatio?.ggqqMoney,
              ratio: assetRatio?.ggqqProportion
            },
            {
              name: "基金投顾账户",
              value: assetRatio?.jjtgMoney,
              ratio: assetRatio?.jjtgProportion
            }
          ]
        : [];
    let option = {
      color: colorData,
      legend: {
        orient: "vertical",
        top: "center",
        left: "48%",
        icon: "circle",
        itemGap: 15,
        itemWidth: 8,
        formatter: function(name) {
          return `{a|${name}}{b|占比：}{c|${
            data.find(item => item.name === name).ratio
          }}{b|金额：}{d|${formatDw(
            data.find(item => item.name === name).value
          )}元}`;
        },
        textStyle: {
          rich: {
            a: {
              fontSize: 14,
              fontWeight: 500,
              color: "#1A2243",
              width: 80
            },
            b: {
              fontSize: 14,
              color: "#61698C",
              padding: [0, 0, 0, 24]
            },
            c: {
              fontSize: 14,
              color: "#1A2243",
              width: 50
            },
            d: {
              fontSize: 14,
              color: "#1A2243"
            }
          }
        }
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["38%", "63%"],
          center: [0, "50%"],
          left: "30%",
          avoidLabelOverlap: true,
          label: {
            normal: {
              show: true,
              position: "center",
              formatter: params => {
                return [
                  `{a|合计(万元)}`,
                  `{b|${formatDw(assetRatio?.totalMoney, 0)?.split("万")[0]}}`
                ].join(`\n`);
              },
              rich: {
                a: {
                  color: " #61698C",
                  fontSize: 14,
                  lineHeight: 20,
                  fontWeight: 400
                },
                b: {
                  color: "#1A2243",
                  fontSize: 20,
                  fontFamily: "EssenceSansStd-Regular",
                  lineHeight: 28,
                  fontWeight: 400
                }
              }
            }
          },
          itemStyle: {
            borderWidth: 1, //设置border宽度
            borderColor: "#fff"
          },
          labelLine: {
            show: false
          },
          data
        }
      ]
    };
    let myChart = echarts.init(document.getElementById("assetsPie"), null, {
      devicePixelRatio: 2
    });
    myChart.setOption(option);
    // myChart.resize();
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };
  //资产趋势图
  initAssetsLineChart = () => {
    const { assetTrend } = this.state;
    let date = assetTrend.map(item => item.time);
    let ptData = assetTrend.map(item =>
      Number(item.normalPro.replace("%", ""))
    );
    let xyData = assetTrend.map(item =>
      Number(item.creditPro.replace("%", ""))
    );
    let lcData = assetTrend.map(item => Number(item.finanPro.replace("%", "")));
    let gpData = assetTrend.map(item =>
      Number(item.optionPro.replace("%", ""))
    );
    let jjData = assetTrend.map(item => Number(item.fundPro.replace("%", "")));
    let zzcData = assetTrend.map(item =>
      Number(item.assetsPro.replace("%", ""))
    );
    let option = {
      title: {
        text: "账户资产",
        subtext: "单位 (万)",
        textStyle: {
          fontSize: 14,
          color: "rgba(0, 0, 0, 0.85)",
          fontWeight: 400
        },
        subtextStyle: {
          fontSize: 12,
          color: "rgba(0, 0, 0, 0.45)"
        }
      },
      color: [
        " #0F8AFF",
        "#00B7FF",
        "#F6C34F",
        "#FFA257",
        "#FF7957",
        "#E9D54C"
      ],
      legend: {
        //图例
        top: 0,
        left: "center",
        icon: "circle",
        itemWidth: 8,
        itemGap: 40,
        textStyle: {
          fontSize: 14,
          color: " #1A2243"
        }
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true
      },
      tooltip: {
        trigger: "axis",
        extraCssText: "box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);",
        padding: 0,
        formatter: params => {
          // console.log(params);
          const jsx = (
            <>
              <div
                style={{
                  padding: "12px",
                  background: "#FFF",
                  color: "#1A2243",
                  borderRadius: 2
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 12 }}>
                  {params[0].axisValue.length === 6
                    ? moment(params[0].axisValue).format("YYYY-MM")
                    : moment(params[0].axisValue).format("YYYY-MM-DD")}
                </div>
                {params.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: index === params.length - 1 ? 0 : 8
                    }}
                  >
                    <span
                      style={{
                        background: item.color,
                        width: 8,
                        height: 8,
                        marginRight: 6,
                        display: "inline-block",
                        borderRadius: "50%"
                      }}
                    ></span>
                    <span>
                      {item.seriesName}：{formatThousands(item.value)}万
                    </span>
                  </div>
                ))}
              </div>
            </>
          );
          return ReactDOMServer.renderToString(jsx);
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        axisTick: {
          show: true,
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: "#BFBFBF"
          }
        },
        data: date
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          interval: "auto"
          // formatter: '{value}%',
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: "#EBECF2"
          }
        }
      },
      series: [
        {
          name: "普通账户",
          type: "line",
          data: ptData,
          symbol: "circle",
          symbolSize: ptData.length !== 1 ? 1 : 4,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(15, 138, 255, 0)"
              },
              {
                offset: 1,
                color: "rgba(15, 138, 255, 0.06)"
              }
            ])
          }
        },
        {
          name: "信用账户",
          type: "line",
          data: xyData,
          symbol: "circle",
          symbolSize: xyData.length !== 1 ? 1 : 4,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(0, 183, 255, 0)"
              },
              {
                offset: 1,
                color: "rgba(0, 183, 255, 0.06)"
              }
            ])
          }
        },
        {
          name: "理财账户",
          type: "line",
          // stack: 'Total',
          data: lcData,
          symbol: "circle",
          symbolSize: lcData.length !== 1 ? 1 : 4,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(246, 195, 79, 0)"
              },
              {
                offset: 1,
                color: "rgba(246, 195, 79, 0.06)"
              }
            ])
          }
        },
        {
          name: "股票期权账户",
          type: "line",
          // stack: 'Total',
          data: gpData,
          symbol: "circle",
          symbolSize: gpData.length !== 1 ? 1 : 4,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(255, 162, 87, 0)"
              },
              {
                offset: 1,
                color: "rgba(255, 162, 87, 0.06)"
              }
            ])
          }
        },
        {
          name: "基金投顾账户",
          type: "line",
          // stack: 'Total',
          data: jjData,
          symbol: "circle",
          symbolSize: jjData.length !== 1 ? 1 : 4,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(255, 121, 87, 0)"
              },
              {
                offset: 1,
                color: "rgba(255, 121, 87, 0.06)"
              }
            ])
          }
        },
        {
          name: "总资产",
          type: "line",
          // stack: 'Total',
          data: zzcData,
          symbol: "circle",
          symbolSize: zzcData.length !== 1 ? 1 : 4,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(233, 213, 76, 0)"
              },
              {
                offset: 1,
                color: "rgba(233, 213, 76, 0.06)"
              }
            ])
          }
        }
      ]
    };
    let myChart = echarts.init(document.getElementById("assetsLine"), null, {
      devicePixelRatio: 2
    });
    // myChart.resize();
    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };
  //交易趋势图
  initTradeBar = () => {
    let colorData = [
      "#0F8AFF",
      "#00B7FF",
      "#F6C34F",
      "#FFA257",
      "#FF7957",
      "#FF8F70"
    ];
    const { Income } = this.state;
    let tradeData = Income.tranStatusList || [];
    if (tradeData.length === 0) {
      return;
    }
    let date = tradeData.map(item => item?.month);
    let putongData = tradeData.map(item => item?.norTran);
    let xinyongData = tradeData.map(item => item?.creditTran);
    let qiquanData = tradeData.map(item => item?.optionTran);
    let licaiData = tradeData.map(item => item?.finaTran);
    let jijinData = tradeData.map(item => item?.fundTran);
    let hejiData = tradeData.map(item => item?.toTran);
    let option = {
      tooltip: {
        trigger: "axis",
        extraCssText: "box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);",
        padding: 0,
        formatter: params => {
          // console.log(params);
          const jsx = (
            <>
              <div
                style={{
                  padding: "12px",
                  background: "#FFF",
                  color: "#1A2243",
                  borderRadius: 2
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 12 }}>
                  {params[0].axisValue.length === 6
                    ? moment(params[0].axisValue).format("YYYY-MM")
                    : moment(params[0].axisValue).format("YYYY-MM-DD")}
                </div>
                {params.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: index === params.length - 1 ? 0 : 8
                    }}
                  >
                    <span
                      style={{
                        background: item.color,
                        width: 8,
                        height: 8,
                        marginRight: 6,
                        display: "inline-block",
                        borderRadius: "50%"
                      }}
                    ></span>
                    <span>
                      {item.seriesName}：{formatThousands(item.value)}万
                    </span>
                  </div>
                ))}
              </div>
            </>
          );
          return ReactDOMServer.renderToString(jsx);
        }
      },
      title: {
        text: "交易趋势",
        subtext: "单位 (万)",
        textStyle: {
          fontSize: 14,
          color: "rgba(0, 0, 0, 0.85)",
          fontWeight: 400
        },
        subtextStyle: {
          fontSize: 12,
          color: "rgba(0, 0, 0, 0.45)"
        }
      },
      color: colorData,
      legend: {
        icon: "rect",
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 1,
        left: 282,
        itemGap: 40,
        textStyle: {
          fontSize: 12,
          color: "#61698C"
        },
        data: [
          { name: "普通账户" },
          { name: "信用账户" },
          { name: "期权账户" },
          { name: "理财账户" },
          { name: "基金投顾账户" },
          { name: "合计", icon: "circle" }
        ]
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: "#BFBFBF"
            }
          },
          data: date
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "#EBECF2"
            }
          }
        }
      ],
      series: [
        {
          name: "普通账户",
          type: "bar",
          stack: "putong",
          barWidth: 8,
          data: putongData
        },
        {
          name: "信用账户",
          type: "bar",
          stack: "xinyong",
          barWidth: 8,
          data: xinyongData
        },
        {
          name: "期权账户",
          type: "bar",
          stack: "qiquan",
          barWidth: 8,
          data: qiquanData
        },
        {
          name: "理财账户",
          type: "bar",
          stack: "licai",
          barWidth: 8,
          data: licaiData
        },
        {
          name: "基金投顾账户",
          type: "bar",
          stack: "jijin",
          barGap: 0.5,
          barWidth: 8,
          data: jijinData
        },
        {
          name: "合计",
          type: "line",
          stack: "heji",
          data: hejiData,
          symbol: "circle",
          showSymbol: true,
          symbolSize: 1,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(255, 143, 112, 0)"
              },
              {
                offset: 1,
                color: "rgba(255, 143, 112, 0.06)"
              }
            ])
          }
        }
      ]
    };
    let myChart = echarts.init(document.getElementById("tradeBar"), null, {
      devicePixelRatio: 2
    });
    // myChart.resize();
    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };
  //佣金趋势图
  initCommissionBar = () => {
    let colorData = [
      "#0F8AFF",
      "#00B7FF",
      "#F6C34F",
      "#FFA257",
      "#FF7957",
      "#FF8F70"
    ];
    const { Income } = this.state;
    let CommissionData = Income.commiStatusList || [];
    if (CommissionData.length === 0) {
      return;
    }
    let date = CommissionData.map(item => item?.month);
    let putongData = CommissionData.map(item => item?.norCommi);
    let xinyongData = CommissionData.map(item => item?.creditCommi);
    let qiquanData = CommissionData.map(item => item?.optionCommi);
    let licaiData = CommissionData.map(item => item?.finaCommi);
    let jijinData = CommissionData.map(item => item?.fundCommi);
    let hejiData = CommissionData.map(item => item?.toCommi);
    let option = {
      tooltip: {
        trigger: "axis",
        extraCssText: "box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);",
        padding: 0,
        formatter: params => {
          // console.log(params);
          const jsx = (
            <>
              <div
                style={{
                  padding: "12px",
                  background: "#FFF",
                  color: "#1A2243",
                  borderRadius: 2
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 12 }}>
                  {params[0].axisValue.length === 6
                    ? moment(params[0].axisValue).format("YYYY-MM")
                    : moment(params[0].axisValue).format("YYYY-MM-DD")}
                </div>
                {params.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: index === params.length - 1 ? 0 : 8
                    }}
                  >
                    <span
                      style={{
                        background: item.color,
                        width: 8,
                        height: 8,
                        marginRight: 6,
                        display: "inline-block",
                        borderRadius: "50%"
                      }}
                    ></span>
                    <span>
                      {item.seriesName}：{formatThousands(item.value)}万
                    </span>
                  </div>
                ))}
              </div>
            </>
          );
          return ReactDOMServer.renderToString(jsx);
        }
      },
      title: {
        text: "佣金趋势",
        subtext: "单位 (万)",
        textStyle: {
          fontSize: 14,
          color: "rgba(0, 0, 0, 0.85)",
          fontWeight: 400
        },
        subtextStyle: {
          fontSize: 12,
          color: "rgba(0, 0, 0, 0.45)"
        }
      },
      color: colorData,
      legend: {
        icon: "rect",
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 1,
        left: 282,
        itemGap: 40,
        textStyle: {
          fontSize: 12,
          color: "#61698C"
        },
        data: [
          { name: "普通账户" },
          { name: "信用账户" },
          { name: "期权账户" },
          { name: "理财账户" },
          { name: "基金投顾账户" },
          { name: "合计", icon: "circle" }
        ]
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: "#BFBFBF"
            }
          },
          data: date
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "#EBECF2"
            }
          }
        }
      ],
      series: [
        {
          name: "普通账户",
          type: "bar",
          stack: "putong",
          barWidth: 8,
          data: putongData
        },
        {
          name: "信用账户",
          type: "bar",
          stack: "xinyong",
          barWidth: 8,
          data: xinyongData
        },
        {
          name: "期权账户",
          type: "bar",
          stack: "qiquan",
          barWidth: 8,
          data: qiquanData
        },
        {
          name: "理财账户",
          type: "bar",
          stack: "licai",
          barWidth: 8,
          data: licaiData
        },
        {
          name: "基金投顾账户",
          type: "bar",
          stack: "jijin",
          barGap: 0.5,
          barWidth: 8,
          data: jijinData
        },
        {
          name: "合计",
          type: "line",
          stack: "heji",
          data: hejiData,
          symbol: "circle",
          showSymbol: true,
          symbolSize: 1,
          lineStyle: {
            width: 1.5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(255, 143, 112, 0)"
              },
              {
                offset: 1,
                color: "rgba(255, 143, 112, 0.06)"
              }
            ])
          }
        }
      ]
    };
    let myChart = echarts.init(document.getElementById("commissionBar"), null, {
      devicePixelRatio: 2
    });
    // myChart.resize();
    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  };
  setDateBtn = dateBtn => {
    const map = {
      1: [moment().subtract(1, "months"), moment()], //近一月
      2: [moment().startOf("month"), moment()], //本月
      3: [moment().subtract(1, "weeks"), moment()], //近一周
      4: [moment().subtract(1, "months"), moment()] //自定义
    };
    this.setState(
      {
        dateBtn,
        custDate: map[dateBtn]
      },
      () => {
        this.queryNewCustchanges();
      }
    );
  };
  setAssetsType = assetsType => {
    this.setState(
      {
        assetsType
      },
      () => {
        this.queryProportionOfAsset();
      }
    );
  };
  handleTjDateType = tjDateType => {
    this.setState(
      {
        tjDateType
      },
      () => {
        this.queryAssetTrendAnalysis();
      }
    );
    if (tjDateType === 2) {
      this.setState({
        mode: ["month", "month"]
      });
    } else {
      this.setState({
        mode: ["date", "date"]
      });
    }
  };
  handlePanelChange = (tjDate, mode) => {
    if (this.state.tjDateType === 1) {
      this.setState({
        mode: [mode[0], mode[1]]
      });
    } else {
      let date = tjDate;
      if (Math.abs(tjDate[0].diff(tjDate[1], "month")) > 12) {
        date = [moment().subtract(1, "months"), moment()];
        message.info("选择月份范围不能超过12个月");
      }
      this.setState(
        {
          tjMonth: date.sort(
            (a, b) => a.format("YYYYMMDD") - b.format("YYYYMMDD")
          ),
          mode: [
            mode[0] === "date" ? "month" : mode[0],
            mode[1] === "date" ? "month" : mode[1]
          ]
        },
        () => {
          this.queryAssetTrendAnalysis();
        }
      );
    }
  };
  disabledDate = current => {
    const { tjDateStart } = this.state;
    if (tjDateStart) {
      let dayLength = Math.abs(moment(tjDateStart).diff(current, "day"));
      return dayLength >= 30 || current > moment().endOf("day");
    } else {
      return current && current > moment().endOf("day");
    }
  };

  changeFontsize = (x, y) => {
    const z = x + y;
    console.log(z, "zzzzzzzzzzzzzzzzzzzzzzz");
    if (z <= 8) {
      return "24px";
    }
    return `${250 / z}px`;
  };
  changeFontsize3 = (x, y) => {
    const z = x + y;
    if (z <= 7) {
      return "36px";
    }
    return `${248 / z}px`;
  };
  changeFontsize2 = (indexValue, targetValue) => {
    if (targetValue == 0) {
      return "18px";
    } else if ((indexValue / targetValue) * 100 == 0) {
      return "18px";
    } else if (
      ((indexValue / targetValue) * 100).toFixed(2).toString()
        .length <= 5
    ) {
      return "18px";
    } else {
      return (
        `${90 / (((indexValue / targetValue) * 100).toFixed(2).toString().length)}px`
      );
    }
  };
  keepTwoDecimalPlaces = (val) => {
    if (val === '' || val == undefined) {
      return '--'
    } else {
      let number =parseFloat(val);
      if (number && String(number).indexOf('.') !== -1) {
      number = number.toFixed(2);
    }
    return number
    }
    // 如果存在小数点，则四舍五入保留两位小数，如果是整数则直接显示整数
  }
  render() {
    const {
      dateBtn,
      custDate,
      businessData,
      gxTypeData,
      businessType,
      gxType,
      assetsType,
      tjDateType,
      tjDate,
      mode,
      basicInfo,
      assetInfo,
      assetRank,
      Income,
      custServe,
      workInfo,
      custLineData,
      qualificationInfo,
      assessData
    } = this.state;
    const myLabelInstr = this.props.authorities.staff_index || [];
    const custRank = Income.custrankList || [];
    const prodRank = Income.prorankList || [];
    const stockRank = Income.shareList || [];
    const assessment = assessData.assessment || [];
    const noAssessment = assessData.noAssessment || [];
    const score = assessData.score || "";

    return (
      <div>
        <div className={styles.basicInfo}>
          <div className={styles.staffName}>{basicInfo.custName}</div>
          <div className={styles.staffInfo}>
            <div>
              <div>
                <span>用户ID：</span>
                <span>{basicInfo.staffId}</span>
              </div>
              <div>
                <span>员工ID：</span>
                <span>{basicInfo.custNo}</span>
              </div>
              <div>
                <span>营业部：</span>
                <span>{basicInfo.dept}</span>
              </div>
            </div>
            <div>
              <div>
                <span>执业资格：</span>
                <span>{qualificationInfo.qualification}</span>
              </div>
              <div>
                <span>所属机构管理员：</span>
                <span>{qualificationInfo.departadmin}</span>
              </div>
              <div>
                {qualificationInfo.senioradmin && (
                  <>
                    <span>上级管理员：</span>
                    <span>
                      {qualificationInfo.senioradmin === ""
                        ? "无"
                        : qualificationInfo.senioradmin}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {myLabelInstr.includes("staff_epa_pc") && (
          <div className={styles.custNum}>
            <Spin spinning={this.state.spinLoading}>
              <div className={styles.title}>
                <img
                  src={jXiaoImg}
                  alt=""
                  style={{ width: 24, marginRight: 2, marginTop: -3 }}
                />
                <span>绩效</span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#959CBA",
                    fontWeight: 400,
                    marginLeft: "8px"
                  }}
                >
                  资产创收类指标单位默认为元
                </span>
                {this.state.assessData.length !== 0 ? (
                  <Button type="link" style={{ float: "right" }}>
                    <Link
                      to={`/newProduct/xqing?thisYear=${this.state.select}`}
                      target="_self"
                    >
                      <span
                        style={{
                          display: "flex",
                          color: "#244FFF",
                          fontSize: 14,
                          cursor: "pointer",
                          alignItems: "center"
                        }}
                      >
                        查看详细数据{" "}
                        <Icon
                          type="right"
                          style={{
                            fontSize: "12px",
                            paddingTop: "2px",
                            paddingLeft: "2px"
                          }}
                        />
                      </span>
                    </Link>
                  </Button>
                ) : null}
                <Divider
                  style={{ margin: 0, marginTop: 16, marginBottom: 24 }}
                ></Divider>
                <div className={styles.jiXiao_kaoHeTitle}>
                  <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {/* <img
                      src={jXiaoBtnImg}
                      alt=""
                      style={{ width: 24, marginRight: 4, marginTop: -3 }}
                    />
                    {this.state.assessData.isLssued === "1" ? (
                      <span>考核得分：{score}</span>
                    ) : (
                      "年度考核指标未下达"
                    )} */}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    id="jixiaoKaoHe"
                  >
                    <span style={{ marginRight: "8px", fontSize: "14px" }}>
                      考核年度
                    </span>
                    <Select
                      getPopupContainer={triggerNode => triggerNode.parentElement}
                      style={{ width: "225px" }}
                      value={this.state.select}
                      onChange={val => {
                        this.setState({select:val})
                        this.queryStaffEfficiency({ annual:val});
                      }}
                    >
                      {this.props.dictionary["TPRFM_YEAR"]?.map(item => (
                        <Option value={item.note}>{item.note}</Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  {Object.keys(this.state.assessData).length !== 0 &&
                  (this.state.assessData.assessment.length !== 0 ||
                    this.state.assessData.noAssessment.length !== 0) ? (
                    // 如何收到了后台的数据，进行判断渲染
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {//如果存在下发指标，就去渲染对应的考核项
                      this.state.assessData.isLssued === "1" ? (
                        assessment.map(item => {
                          return (
                            <div
                              className={styles.cardItemss}
                              style={{ fontWeight: "normal", height: "168px" }}
                              key={item.indexCode}
                            >
                              <div style={{ display: "flex"}}>
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      //justifyContent: "space-between",
                                      alignItems: "center",
                                      //padding: 16,
                                      fontSize: "14px",
                                      height:'60px'
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#61698C",
                                        paddingRight: "4px",
                                        paddingLeft:'16px'
                                      }}
                                    >
                                      {item.indexName||'--'}
                                    </span>
                                    {item.remark.length !== 0 ? (
                                      <Popover
                                        placement="bottomLeft"
                                        trigger="hover"
                                        overlayClassName={styles.indexDetail}
                                        arrowPointAtCenter={true}
                                        content={
                                          <div
                                            style={{
                                              background:'#474D64',
                                              color: "#FFFFFF",
                                              padding: 16,
                                              width: 440,
                                              boxSizing: "border-box",
                                              overflow: "auto"
                                            }}
                                          >
                                            {item.remark}
                                          </div>
                                        }
                                        title={null}
                                      >
                                        <img
                                          style={{
                                            width: 15,
                                            marginTop: -2,
                                            marginLeft: 2
                                          }}
                                          src={questionImg}
                                          alt=""
                                        />
                                      </Popover>
                                    ) : null}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 24,
                                      color: "#1A2243",
                                      fontFamily: "EssenceSansStd-Regular",
                                      height:'60px',
                                      display:'flex',
                                      alignItems:'center',
                                      paddingLeft:'16px'
                                      //padding: "0 16px",
                                      //paddingTop: "14px",
                                      //marginBottom: 16,
                                    }}
                                  >
                                    <div>
                                    <div
                                      style={{
                                        paddingBottom: "3px",
                                        fontWeight: "600",
                                        color: "#1A2243",
                                        fontSize: "24px"
                                      }}
                                    >
                                      <span
                                        style={{
                                          whiteSpace: "nowrap",
                                          fontSize: this.changeFontsize(
                                            item.indexValue.length,
                                            item.targetValue.length
                                          )
                                        }}
                                      >
                                        {item.indexValue||'--'}/{item.targetValue||'--'}
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "400",
                                        color: "#959CBA"
                                      }}
                                    >
                                      完成值/目标值
                                    </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    //background: "pink",
                                    flex: "1",
                                    display: "flex",
                                    flexDirection: "row-reverse"
                                    //alignItems: "center",
                                    //justifyContent: "center",
                                    //marginLeft: "5px"
                                  }}
                                >
                                  <div
                                    id="kaoHePie"
                                    style={{
                                      display: "flex",
                                      height: "86px",
                                      width: "86px",
                                      //background: "black",
                                      margin: "19px",
                                      //marginLeft: "35px",
                                      fontWeight: "600",
                                      fontSize: "18px"
                                      //border: "1px solid"
                                    }}
                                  >
                                    <Progress
                                      type="circle"
                                      percent={
                                        item.targetValue == 0
                                          ? 0
                                          : (item.indexValue /
                                              item.targetValue) *
                                            100
                                      }
                                      format={() => (
                                        <span
                                          style={{
                                            color: "#1A2243",
                                            fontSize: this.changeFontsize2(
                                              item.indexValue,
                                              item.targetValue
                                            )
                                          }}
                                        >
                                          {item.targetValue == 0
                                            ? "0%"
                                            : `${
                                                (item.indexValue /
                                                  item.targetValue) *
                                                  100 ==
                                                0
                                                  ? 0
                                                  : (
                                                      (item.indexValue /
                                                        item.targetValue) *
                                                      100
                                                    ).toFixed(2)
                                              }%`}
                                        </span>
                                      )}
                                      width={86}
                                      strokeLinecap="butt"
                                      strokeWidth={11}
                                      strokeColor="#00B7FF"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  background: "#F6FAFF",
                                  padding: "12px 16px",
                                  fontSize: "14px"
                                }}
                              >
                                <span
                                  style={{ color: "#61698C" }}
                                  className={styles.spananame}
                                >
                                  <span>
                                    {" "}
                                    营业部排名:
                                    <span style={{ fontWeight: 600 }}>
                                      {item.departRanking||'--'}
                                    </span>
                                  </span>
                                  {/* {Number(Income?.tranStatus) < 0 ? "昨日减少" : "昨日新增"} */}
                                </span>
                                <span
                                  className={styles.spananame}
                                  style={{
                                    color: "#61698C"
                                  }}
                                >
                                  考核系数：
                                  <span style={{ fontWeight: 600 }}>
                                    {item.assCoefficient||'--'}
                                  </span>
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        //否则就去渲染非考核项
                        <>
                          {/* <div>该年度考核目标值未下达</div> */}
                          {noAssessment.map(item => (
                            <div
                              className={styles.cardItemss}
                              style={{ fontWeight: "normal", height: "124px" }}
                            >
                              <ShowCardSimple
                                key={item.indexId}
                                {...item}
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    // 如果什么数据都没有显示空页面
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="暂无数据"
                      style={{ height: "140px", paddingTop: "30px" }}
                    />
                  )}
                </div>
              </div>
            </Spin>
          </div>
        )}

        <div className={styles.custNum}>
          <div className={styles.title}>
            <img
              src={custImg}
              alt=""
              style={{ width: 24, marginRight: 2, marginTop: -3 }}
            />
            <span>客户数</span>
            <Divider
              style={{ margin: 0, marginTop: 16, marginBottom: 24 }}
            ></Divider>
          </div>
          <div className={styles.custStatis}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  height: 15,
                  width: 4,
                  background: "#0F8AFF",
                  display: "inline-block",
                  marginRight: 4
                }}
              ></span>
              <span
                style={{ fontSize: 16, color: "#1A2243", fontWeight: "bold" }}
              >
                客户统计
              </span>
            </div>
            <div style={{ display: "flex", marginTop: 16, marginBottom: 27 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <div style={{ fontSize: 14, color: "#61698C" }}>客户总数</div>
                <Link to={"/iframe/bss/customer/page/index.sdo?queryType=1"}>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 500,
                      color: "#244FFF",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 12,
                      cursor: "pointer"
                    }}
                    // onClick={() => { window.parent.postMessage({ action: 'changeHash', hash: '/bss/customer/page/index.sdo?queryType=1' }, '*'); }}
                  >
                    {basicInfo.totalCust || "--"}户
                    <Icon
                      type="right"
                      style={{ fontSize: 14, marginLeft: 2 }}
                    />
                  </span>
                </Link>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <div style={{ fontSize: 14, color: "#61698C" }}>营业部排名</div>
                <div
                  style={{ fontWeight: 500, color: "#1A2243", marginTop: 12 }}
                >
                  <span style={{ fontSize: 24 }}>
                    {basicInfo.deptRanking?.split("/")[0]}
                    {basicInfo.deptRanking ? "/" : "--"}
                  </span>
                  <span style={{ fontSize: 16 }}>
                    {basicInfo.deptRanking?.split("/")[1]}
                  </span>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <div style={{ fontSize: 14, color: "#61698C" }}>全公司排名</div>
                <div
                  style={{ fontWeight: 500, color: "#1A2243", marginTop: 12 }}
                >
                  <span style={{ fontSize: 24 }}>
                    {basicInfo.wholeCompany?.split("/")[0]}
                    {basicInfo.wholeCompany ? "/" : "--"}
                  </span>
                  <span style={{ fontSize: 16 }}>
                    {basicInfo.wholeCompany?.split("/")[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Divider style={{ margin: 0, marginBottom: 22 }}></Divider>
          <div className={styles.custChange}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 17,
                justifyContent: "space-between",
                height: 32
              }}
            >
              <div>
                <span
                  style={{
                    height: 15,
                    width: 4,
                    background: "#0F8AFF",
                    display: "inline-block",
                    marginRight: 4
                  }}
                ></span>
                <span
                  style={{ fontSize: 16, color: "#1A2243", fontWeight: "bold" }}
                >
                  新增客户变化
                </span>
              </div>
              <div className={styles.dateBtn} style={{ position: "relative" }}>
                <span
                  onClick={() => this.setDateBtn(1)}
                  className={`${dateBtn === 1 ? styles.activeBtn : ""} ${
                    styles.button
                  }`}
                >
                  近一月
                </span>
                <span
                  onClick={() => this.setDateBtn(2)}
                  className={`${dateBtn === 2 ? styles.activeBtn : ""} ${
                    styles.button
                  }`}
                >
                  本月
                </span>
                <span
                  onClick={() => this.setDateBtn(3)}
                  className={`${dateBtn === 3 ? styles.activeBtn : ""} ${
                    styles.button
                  }`}
                >
                  近一周
                </span>
                <span
                  onClick={() => this.setDateBtn(4)}
                  className={`${dateBtn === 4 ? styles.activeBtn : ""} ${
                    styles.button
                  }`}
                >
                  自定义
                </span>
                {dateBtn === 4 && (
                  <DatePicker.RangePicker
                    getCalendarContainer={trigger => trigger.parentNode}
                    allowClear={false}
                    value={custDate}
                    className={styles.rangePicker}
                    dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                    style={{ width: "264px" }}
                    placeholder={["开始日期", "结束日期"]}
                    format="YYYY-MM-DD"
                    separator="至"
                    disabledDate={current =>
                      current && current > moment().endOf("day")
                    }
                    onChange={custDate =>
                      this.setState({ custDate }, () => {
                        this.queryNewCustchanges();
                      })
                    }
                  />
                )}
              </div>
            </div>
            {custLineData.length > 0 ? (
              <div id="custLine" style={{ height: 350 }}></div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无数据"
                style={{ height: "350px", paddingTop: "120px" }}
              />
            )}
          </div>
          <Divider style={{ margin: "24px 0" }}></Divider>
          <div style={{ display: "flex", height: 300 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    height: 15,
                    width: 4,
                    background: "#0F8AFF",
                    display: "inline-block",
                    marginRight: 4
                  }}
                ></span>
                <span
                  style={{ fontSize: 16, color: "#1A2243", fontWeight: "bold" }}
                >
                  客户等级分布
                </span>
              </div>
              {Object.keys(this.state.custRank).length > 0 ? (
                <div
                  id="rankPie"
                  style={{ width: "100%", height: "100%" }}
                ></div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                  style={{ height: "300px", paddingTop: "60px" }}
                />
              )}
            </div>
            <Divider
              type="vertical"
              style={{ height: "100%", margin: "0 16px" }}
            ></Divider>
            <div style={{ flex: 1, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      height: 15,
                      width: 4,
                      background: "#0F8AFF",
                      display: "inline-block",
                      marginRight: 4
                    }}
                  ></span>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#1A2243",
                      fontWeight: "bold"
                    }}
                  >
                    客户业务分布
                  </span>
                </div>
                <div>
                  <span>业务类型</span>
                  <Select
                    value={businessType}
                    onChange={businessType =>
                      this.setState({ businessType }, () => {
                        this.queryCustServiceDis();
                      })
                    }
                    style={{ width: 140, height: 30, marginLeft: 8 }}
                    className={styles.select}
                    placeholder=""
                    dropdownClassName={styles.dropSelect}
                  >
                    {businessData.map(item => (
                      <Select.Option
                        key={item.ID}
                        value={item.ID}
                        title={item.MC}
                      >
                        {item.MC}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              {Object.keys(this.state.custServe).length > 0 ? (
                <>
                  <div
                    id="businessPie"
                    style={{ width: "100%", height: "100%" }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      left: "50%",
                      top: 30,
                      padding: custServe?.failProp !== "" ? "45px 0" : "90px 0"
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        height: "100%",
                        flexDirection: "column"
                      }}
                    >
                      <div>
                        {/* <span style={{ cursor: 'pointer' }} onClick={() => { window.parent.postMessage({ action: 'changeHash', hash: `/bss/ncrm/home/businessPromotion/page/indexForC5.sdo?ywid=${businessType}` }, '*'); }}>
                          <span style={{ width: 8, height: 8, background: '#0F8AFF', borderRadius: '50%', display: 'inline-block', marginRight: 4 }}></span>
                          <span style={{ color: '#244FFF' }}>已开通</span>
                          <Icon type="right" style={{ fontSize: 12, marginLeft: 2, color: '#244FFF' }} />
                        </span> */}
                        <Link
                          to={`/single/newProduct/chance?tab=${businessType}&tab1=1`}
                          target="_blank"
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              background: "#0F8AFF",
                              borderRadius: "50%",
                              display: "inline-block",
                              marginRight: 4
                            }}
                          ></span>
                          <span style={{ color: "#244FFF" }}>已开通</span>
                          <Icon
                            type="right"
                            style={{
                              fontSize: 12,
                              marginLeft: 2,
                              color: "#244FFF"
                            }}
                          />
                        </Link>
                      </div>
                      <div
                        style={{ fontSize: 14, marginLeft: 12, marginTop: 3 }}
                      >
                        <span style={{ color: "#61698C" }}>占比：</span>
                        <span
                          style={{
                            color: "#1A2243",
                            width: 65,
                            display: "inline-block"
                          }}
                        >
                          {custServe?.openProp}
                        </span>
                        <span style={{ color: "#61698C" }}>人数：</span>
                        <span style={{ color: "#1A2243" }}>
                          {custServe?.openNum}人
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        height: "100%",
                        flexDirection: "column"
                      }}
                    >
                      <div>
                        {/* <span style={{ cursor: 'pointer' }} onClick={() => { window.parent.postMessage({ action: 'changeHash', hash: `/bss/ncrm/home/businessPromotion/page/indexForC5.sdo?ywid=${businessType}` }, '*'); }}>
                          <span style={{ width: 8, height: 8, background: '#00B7FF', borderRadius: '50%', display: 'inline-block', marginRight: 4 }}></span>
                          <span style={{ color: '#244FFF' }}>已达标未开通</span>
                          <Icon type="right" style={{ fontSize: 12, marginLeft: 2, color: '#244FFF' }} />
                        </span> */}
                        <Link
                          to={`/single/newProduct/chance?tab=${businessType}&tab1=0&tab2=1`}
                          target="_blank"
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              background: "#00B7FF",
                              borderRadius: "50%",
                              display: "inline-block",
                              marginRight: 4
                            }}
                          ></span>
                          <span style={{ color: "#244FFF" }}>
                            {custServe?.failProp === ""
                              ? "未开通"
                              : "已达标未开通"}
                          </span>
                          <Icon
                            type="right"
                            style={{
                              fontSize: 12,
                              marginLeft: 2,
                              color: "#244FFF"
                            }}
                          />
                        </Link>
                      </div>
                      <div
                        style={{ fontSize: 14, marginLeft: 12, marginTop: 3 }}
                      >
                        <span style={{ color: "#61698C" }}>占比：</span>
                        <span
                          style={{
                            color: "#1A2243",
                            width: 65,
                            display: "inline-block"
                          }}
                        >
                          {custServe?.suceProp}
                        </span>
                        <span style={{ color: "#61698C" }}>人数：</span>
                        <span style={{ color: "#1A2243" }}>
                          {custServe?.suceNum}人
                        </span>
                      </div>
                    </div>
                    {custServe?.failProp !== "" && (
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          height: "100%",
                          flexDirection: "column"
                        }}
                      >
                        <div>
                          {/* <span style={{ cursor: 'pointer' }} onClick={() => { window.parent.postMessage({ action: 'changeHash', hash: `/bss/ncrm/home/businessPromotion/page/indexForC5.sdo?ywid=${businessType}` }, '*'); }}>
                          <span style={{ width: 8, height: 8, background: '#F6C34F', borderRadius: '50%', display: 'inline-block', marginRight: 4 }}></span>
                          <span style={{ color: '#244FFF' }}>未开通未达标</span>
                          <Icon type="right" style={{ fontSize: 12, marginLeft: 2, color: '#244FFF' }} />
                        </span> */}
                          <Link
                            to={`/single/newProduct/chance?tab=${businessType}&tab1=0&tab2=0`}
                            target="_blank"
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                background: "#F6C34F",
                                borderRadius: "50%",
                                display: "inline-block",
                                marginRight: 4
                              }}
                            ></span>
                            <span style={{ color: "#244FFF" }}>
                              未开通未达标
                            </span>
                            <Icon
                              type="right"
                              style={{
                                fontSize: 12,
                                marginLeft: 2,
                                color: "#244FFF"
                              }}
                            />
                          </Link>
                        </div>
                        <div
                          style={{ fontSize: 14, marginLeft: 12, marginTop: 3 }}
                        >
                          <span style={{ color: "#61698C" }}>占比：</span>
                          <span
                            style={{
                              color: "#1A2243",
                              width: 65,
                              display: "inline-block"
                            }}
                          >
                            {custServe?.failProp}
                          </span>
                          <span style={{ color: "#61698C" }}>人数：</span>
                          <span style={{ color: "#1A2243" }}>
                            {custServe?.failNum}人
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                  style={{ height: "300px", paddingTop: "60px" }}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.assets}>
          <div className={styles.title}>
            <img
              src={assetsImg}
              alt=""
              style={{ width: 24, marginRight: 2, marginTop: -3 }}
            />
            <span>资产概况</span>
          </div>
          <div className={styles.assetsCard}>
            <div className={styles.cardItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16
                }}
              >
                <span style={{ color: "#61698C" }}>
                  <img
                    src={zzcImg}
                    alt=""
                    style={{ width: 24, marginTop: -4, marginRight: 2 }}
                  />
                  总资产
                </span>
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        color: "#1A2243",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      按照开发关系、服务关系、无效户激活关系汇总
                    </div>
                  }
                  title={null}
                  placement="bottomRight"
                  trigger="click"
                >
                  <img
                    style={{ width: 15, marginTop: -2, marginLeft: 2 }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#1A2243",
                  fontFamily: "EssenceSansStd-Regular",
                  padding: "0 16px",
                  marginBottom: 16
                }}
              >
                {assetInfo.totalAssets
                  ? formatThousands(assetInfo.totalAssets)
                  : "--"}
                万
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F6FAFF",
                  padding: "12px 16px"
                }}
              >
                <span style={{ color: "#61698C" }}>
                  {Number(assetInfo.beTotalAssets) < 0
                    ? "昨日减少"
                    : "昨日新增"}
                </span>
                <span
                  style={{
                    color:
                      Number(assetInfo.beTotalAssets) < 0
                        ? "#20D535"
                        : "#EF5A3C"
                  }}
                >
                  <img
                    src={Number(assetInfo.beTotalAssets) < 0 ? downImg : upImg}
                    alt=""
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                  {assetInfo.beTotalAssets
                    ? formatThousands(Math.abs(assetInfo.beTotalAssets))
                    : "--"}
                  万
                </span>
              </div>
            </div>
            <div className={styles.cardItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16
                }}
              >
                <span style={{ color: "#61698C" }}>
                  <img
                    src={jzcImg}
                    alt=""
                    style={{ width: 24, marginTop: -4, marginRight: 2 }}
                  />
                  净资产
                </span>
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        color: "#1A2243",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      总资产-负债，按照开发关系、服务关系、无效户激活关系汇总
                    </div>
                  }
                  title={null}
                  placement="bottomRight"
                  trigger="click"
                >
                  <img
                    style={{ width: 15, marginTop: -2, marginLeft: 2 }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#1A2243",
                  fontFamily: "EssenceSansStd-Regular",
                  padding: "0 16px",
                  marginBottom: 16
                }}
              >
                {assetInfo.netAssets
                  ? formatThousands(assetInfo.netAssets)
                  : "--"}
                万
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F6FAFF",
                  padding: "12px 16px"
                }}
              >
                <span style={{ color: "#61698C" }}>
                  {Number(assetInfo.beNetAssets) < 0 ? "昨日减少" : "昨日新增"}
                </span>
                <span
                  style={{
                    color:
                      Number(assetInfo.beNetAssets) < 0 ? "#20D535" : "#EF5A3C"
                  }}
                >
                  <img
                    src={Number(assetInfo.beNetAssets) < 0 ? downImg : upImg}
                    alt=""
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                  {assetInfo.beNetAssets
                    ? formatThousands(Math.abs(assetInfo.beNetAssets))
                    : "--"}
                  万
                </span>
              </div>
            </div>
            <div className={styles.cardItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16
                }}
              >
                <span style={{ color: "#61698C" }}>
                  <img
                    src={zclrImg}
                    alt=""
                    style={{ width: 24, marginTop: -4, marginRight: 2 }}
                  />
                  本月资产净流入
                </span>
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        color: "#1A2243",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      存入金额-取出金额+转入证券市值-转出证券市值，按照开发关系、服务关系、无效户激活关系汇总
                    </div>
                  }
                  title={null}
                  placement="bottomRight"
                  trigger="click"
                >
                  <img
                    style={{ width: 15, marginTop: -2, marginLeft: 2 }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#1A2243",
                  fontFamily: "EssenceSansStd-Regular",
                  padding: "0 16px",
                  marginBottom: 16
                }}
              >
                {assetInfo.netInflow
                  ? formatThousands(assetInfo.netInflow)
                  : "--"}
                万
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F6FAFF",
                  padding: "12px 16px"
                }}
              >
                <span style={{ color: "#61698C" }}>上月环比</span>
                <span
                  style={{
                    color:
                      Number(assetInfo?.beNetInflow?.split("%")[0]) < 0
                        ? "#20D535"
                        : "#EF5A3C"
                  }}
                >
                  <img
                    src={
                      Number(assetInfo?.beNetInflow?.split("%")[0]) < 0
                        ? downImg
                        : upImg
                    }
                    alt=""
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                  {Math.abs(Number(assetInfo?.beNetInflow?.split("%")[0])) ||
                    "--"}
                  %
                </span>
              </div>
            </div>
            <div className={styles.cardItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16
                }}
              >
                <span style={{ color: "#61698C" }}>
                  <img
                    src={bylImg}
                    alt=""
                    style={{ width: 24, marginTop: -4, marginRight: 2 }}
                  />
                  产品保有量
                </span>
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        color: "#1A2243",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      上日产品市值，按照开发关系、服务关系、无效户激活关系汇总
                    </div>
                  }
                  title={null}
                  placement="bottomRight"
                  trigger="click"
                >
                  <img
                    style={{ width: 15, marginTop: -2, marginLeft: 2 }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#1A2243",
                  fontFamily: "EssenceSansStd-Regular",
                  padding: "0 16px",
                  marginBottom: 16
                }}
              >
                {assetInfo.proReten
                  ? formatThousands(assetInfo.proReten)
                  : "--"}
                万
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F6FAFF",
                  padding: "12px 16px"
                }}
              >
                <span style={{ color: "#61698C" }}>
                  {Number(assetInfo.beProReten) < 0 ? "昨日减少" : "昨日新增"}
                </span>
                <span
                  style={{
                    color:
                      Number(assetInfo.beProReten) < 0 ? "#20D535" : "#EF5A3C"
                  }}
                >
                  <img
                    src={Number(assetInfo.beProReten) < 0 ? downImg : upImg}
                    alt=""
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                  {assetInfo.beProReten
                    ? formatThousands(Math.abs(assetInfo.beProReten))
                    : "--"}
                  万
                </span>
              </div>
            </div>
          </div>
          <Divider style={{ margin: "24px 0" }}></Divider>
          <div style={{ display: "flex", height: 300 }}>
            <div style={{ flex: 5, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      height: 15,
                      width: 4,
                      background: "#0F8AFF",
                      display: "inline-block",
                      marginRight: 4
                    }}
                  ></span>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#1A2243",
                      fontWeight: "bold"
                    }}
                  >
                    资产分类占比
                  </span>
                </div>
                <div className={styles.assetsBtn}>
                  <span
                    className={`${assetsType === 0 ? styles.activeBtn : ""}`}
                    onClick={() => this.setAssetsType(0)}
                  >
                    全部
                  </span>
                  <span
                    className={`${assetsType === 10 ? styles.activeBtn : ""}`}
                    onClick={() => this.setAssetsType(10)}
                  >
                    开发关系
                  </span>
                  <span
                    className={`${assetsType === 1 ? styles.activeBtn : ""}`}
                    onClick={() => this.setAssetsType(1)}
                  >
                    服务关系
                  </span>
                  <span
                    className={`${assetsType === 11 ? styles.activeBtn : ""}`}
                    onClick={() => this.setAssetsType(11)}
                  >
                    无效户激活
                  </span>
                </div>
              </div>
              {Object.keys(this.state.assetRatio).length > 0 ? (
                <div
                  id="assetsPie"
                  style={{ width: "100%", height: "100%" }}
                ></div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                  style={{ height: "300px", paddingTop: "60px" }}
                />
              )}
            </div>
            <Divider
              type="vertical"
              style={{ height: "100%", margin: "0 16px" }}
            ></Divider>
            <div style={{ flex: 3 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    height: 15,
                    width: 4,
                    background: "#0F8AFF",
                    display: "inline-block",
                    marginRight: 4
                  }}
                ></span>
                <span
                  style={{ fontSize: 16, color: "#1A2243", fontWeight: "bold" }}
                >
                  排名情况
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <div style={{ marginTop: 35, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    营业部排名
                  </div>
                  <div style={{ marginTop: 8, color: "#1A2243", fontSize: 16 }}>
                    <span style={{ fontSize: 24 }}>
                      {assetRank.deptRanking?.split("/")[0]}
                      {assetRank.deptRanking ? "/" : "--"}
                    </span>
                    {assetRank.deptRanking?.split("/")[1]}
                  </div>
                </div>
                <div style={{ marginTop: 35, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    分公司排名
                  </div>
                  <div style={{ marginTop: 8, color: "#1A2243", fontSize: 16 }}>
                    <span style={{ fontSize: 24 }}>
                      {assetRank.branchOffice?.split("/")[0]}
                      {assetRank.branchOffice ? "/" : "--"}
                    </span>
                    {assetRank.branchOffice?.split("/")[1]}
                  </div>
                </div>
                <div style={{ marginTop: 35, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    全公司排名
                  </div>
                  <div style={{ marginTop: 8, color: "#1A2243", fontSize: 16 }}>
                    <span style={{ fontSize: 24 }}>
                      {assetRank.wholeCompany?.split("/")[0]}
                      {assetRank.wholeCompany ? "/" : "--"}
                    </span>
                    {assetRank.wholeCompany?.split("/")[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Divider style={{ margin: "24px 0" }}></Divider>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  height: 15,
                  width: 4,
                  background: "#0F8AFF",
                  display: "inline-block",
                  marginRight: 4
                }}
              ></span>
              <span
                style={{ fontSize: 16, color: "#1A2243", fontWeight: "bold" }}
              >
                资产趋势
              </span>
            </div>
            <div
              style={{
                margin: "16px 0 24px 0",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(0, 0, 0, 0.85)",
                    marginRight: 8
                  }}
                >
                  关系类型
                </span>
                <Select
                  value={gxType}
                  onChange={gxType =>
                    this.setState({ gxType }, () => {
                      this.queryAssetTrendAnalysis();
                    })
                  }
                  style={{ width: 140, height: 30 }}
                  className={styles.select}
                  placeholder=""
                  dropdownClassName={styles.dropSelect}
                >
                  {gxTypeData.map(item => (
                    <Select.Option
                      key={item.ibm}
                      value={item.ibm}
                      title={item.note}
                    >
                      {item.note}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div style={{ marginLeft: 32 }}>
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(0, 0, 0, 0.85)",
                    marginRight: 8
                  }}
                >
                  统计时间
                </span>
                <Button
                  className={`${styles.button} ${
                    tjDateType === 2 ? styles.activeBtn : ""
                  }`}
                  onClick={() => this.handleTjDateType(2)}
                >
                  按月
                </Button>
                <Button
                  className={`${styles.button} ${
                    tjDateType === 1 ? styles.activeBtn : ""
                  }`}
                  onClick={() => this.handleTjDateType(1)}
                >
                  按日
                </Button>
                <DatePicker.RangePicker
                  mode={mode}
                  allowClear={false}
                  value={tjDateType === 2 ? this.state.tjMonth : tjDate}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.tjcalendar} m-bss-range-picker`}
                  style={{ width: "264px" }}
                  placeholder={["开始日期", "结束日期"]}
                  format={tjDateType === 2 ? "YYYY-MM" : "YYYY-MM-DD"}
                  separator="至"
                  disabledDate={this.disabledDate}
                  onChange={tjDate => {
                    if (tjDateType === 1) {
                      this.setState({ tjDate, tjDateStart: undefined }, () => {
                        this.queryAssetTrendAnalysis();
                      });
                    } else {
                      console.log("1111");
                      this.setState(
                        { tjMonth: tjDate, tjDateStart: undefined },
                        () => {
                          this.queryAssetTrendAnalysis();
                        }
                      );
                    }
                  }}
                  onCalendarChange={date =>
                    this.setState({ tjDateStart: date[0] })
                  }
                  onPanelChange={this.handlePanelChange}
                />
                <span style={{ marginLeft: 8, color: "#61698C", fontSize: 12 }}>
                  {this.state.tjDateType === 1
                    ? "注意：时间不能超过30天"
                    : "注意：时间不能超过12个月"}
                </span>
              </div>
            </div>
            {this.state.assetTrend.length > 0 ? (
              <div id="assetsLine" style={{ height: 350 }}></div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无数据"
                style={{ height: "350px", paddingTop: "120px" }}
              />
            )}
          </div>
        </div>
        <div className={styles.performance}>
          <div className={styles.title}>
            <img
              src={yjcsImg}
              alt=""
              style={{ width: 24, marginRight: 2, marginTop: -3 }}
            />
            <span>业绩创收</span>
          </div>
          <div className={styles.assetsCard}>
            <div className={styles.cardItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16
                }}
              >
                <span style={{ color: "#61698C" }}>
                  <img
                    src={jylImg}
                    alt=""
                    style={{ width: 24, marginTop: -4, marginRight: 2 }}
                  />
                  近一月交易量
                </span>
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        color: "#1A2243",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      合并账户交易量，按照开发关系、服务关系、无效户激活关系汇总
                    </div>
                  }
                  title={null}
                  placement="bottomRight"
                  trigger="click"
                >
                  <img
                    style={{ width: 15, marginTop: -2, marginLeft: 2 }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#1A2243",
                  fontFamily: "EssenceSansStd-Regular",
                  padding: "0 16px",
                  marginBottom: 16,
                  height: 21
                }}
              >
                {Income?.transaction
                  ? formatThousands(Income?.transaction)
                  : "--"}
                万
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F6FAFF",
                  padding: "12px 16px"
                }}
              >
                <span style={{ color: "#61698C" }}>
                  {Number(Income?.tranStatus) < 0 ? "昨日减少" : "昨日新增"}
                </span>
                <span
                  style={{
                    color:
                      Number(Income?.tranStatus) < 0 ? "#20D535" : "#EF5A3C"
                  }}
                >
                  <img
                    src={Number(Income?.tranStatus) < 0 ? downImg : upImg}
                    alt=""
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                  {Income?.tranStatus
                    ? formatThousands(Math.abs(Income?.tranStatus))
                    : "--"}
                  万
                </span>
              </div>
            </div>
            <div className={styles.cardItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16
                }}
              >
                <span style={{ color: "#61698C" }}>
                  <img
                    src={zgxImg}
                    alt=""
                    style={{ width: 24, marginTop: -4, marginRight: 2 }}
                  />
                  近一月总贡献
                </span>
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        color: "#1A2243",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      合并账户总贡献，按照开发关系、服务关系、无效户激活关系汇总
                    </div>
                  }
                  title={null}
                  placement="bottomRight"
                  trigger="click"
                >
                  <img
                    style={{ width: 15, marginTop: -2, marginLeft: 2 }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#1A2243",
                  fontFamily: "EssenceSansStd-Regular",
                  padding: "0 16px",
                  marginBottom: 16,
                  height: 21
                }}
              >
                {Income?.contribution
                  ? formatThousands(Income?.contribution)
                  : "--"}
                万
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F6FAFF",
                  padding: "12px 16px"
                }}
              >
                <span style={{ color: "#61698C" }}>
                  {Number(Income?.contriStatus) < 0 ? "昨日减少" : "昨日新增"}
                </span>
                <span
                  style={{
                    color:
                      Number(Income?.contriStatus) < 0 ? "#20D535" : "#EF5A3C"
                  }}
                >
                  <img
                    src={Number(Income?.contriStatus) < 0 ? downImg : upImg}
                    alt=""
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                  {Income?.contriStatus
                    ? formatThousands(Math.abs(Income?.contriStatus))
                    : "--"}
                  万
                </span>
              </div>
            </div>
            <div className={styles.cardItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16
                }}
              >
                <span style={{ color: "#61698C" }}>
                  <img
                    src={jyjImg}
                    alt=""
                    style={{ width: 24, marginTop: -4, marginRight: 2 }}
                  />
                  近一月净佣金
                </span>
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        color: "#1A2243",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      合并账户净佣金，按照开发关系、服务关系、无效户激活关系汇总
                    </div>
                  }
                  title={null}
                  placement="bottomRight"
                  trigger="click"
                >
                  <img
                    style={{ width: 15, marginTop: -2, marginLeft: 2 }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#1A2243",
                  fontFamily: "EssenceSansStd-Regular",
                  padding: "0 16px",
                  marginBottom: 16,
                  height: 21
                }}
              >
                {Income?.commission
                  ? formatThousands(Income?.commission)
                  : "--"}
                万
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F6FAFF",
                  padding: "12px 16px"
                }}
              >
                <span style={{ color: "#61698C" }}>
                  {Number(Income?.commiStatus) < 0 ? "昨日减少" : "昨日新增"}
                </span>
                <span
                  style={{
                    color:
                      Number(Income?.commiStatus) < 0 ? "#20D535" : "#EF5A3C"
                  }}
                >
                  <img
                    src={Number(Income?.commiStatus) < 0 ? downImg : upImg}
                    alt=""
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                  {Income?.commiStatus
                    ? formatThousands(Math.abs(Income?.commiStatus))
                    : "--"}
                  万
                </span>
              </div>
            </div>
            <div className={styles.cardItem}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16
                }}
              >
                <span style={{ color: "#61698C" }}>
                  <img
                    src={jycsImg}
                    alt=""
                    style={{ width: 24, marginTop: -4, marginRight: 2 }}
                  />
                  近一月交易次数
                </span>
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        color: "#1A2243",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      合并账户交易次数，按照开发关系、服务关系、无效户激活关系汇总
                    </div>
                  }
                  title={null}
                  placement="bottomRight"
                  trigger="click"
                >
                  <img
                    style={{ width: 15, marginTop: -2, marginLeft: 2 }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#1A2243",
                  fontFamily: "EssenceSansStd-Regular",
                  padding: "0 16px",
                  marginBottom: 16,
                  height: 21
                }}
              >
                {Income?.reCommi ? formatThousands(Income?.reCommi, 0) : "--"}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F6FAFF",
                  padding: "12px 16px"
                }}
              >
                <span style={{ color: "#61698C" }}>
                  {Number(Income?.reComStatus) < 0 ? "昨日减少" : "昨日新增"}
                </span>
                <span
                  style={{
                    color:
                      Number(Income?.reComStatus) < 0 ? "#20D535" : "#EF5A3C"
                  }}
                >
                  <img
                    src={Number(Income?.reComStatus) < 0 ? downImg : upImg}
                    alt=""
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                  {Income?.reComStatus
                    ? formatThousands(Math.abs(Income?.reComStatus), 0)
                    : "--"}
                </span>
              </div>
            </div>
          </div>
          <Divider style={{ margin: "24px 0" }}></Divider>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <span
              style={{
                height: 15,
                width: 4,
                background: "#0F8AFF",
                display: "inline-block",
                marginRight: 4
              }}
            ></span>
            <span
              style={{ fontSize: 16, color: "#1A2243", fontWeight: "bold" }}
            >
              近一年交易量趋势
            </span>
          </div>
          {Income?.tranStatusList?.length > 0 ? (
            <div id="tradeBar" style={{ height: 350 }}></div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
              style={{ height: "350px", paddingTop: "120px" }}
            />
          )}

          <Divider style={{ margin: "24px 0" }}></Divider>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <span
              style={{
                height: 15,
                width: 4,
                background: "#0F8AFF",
                display: "inline-block",
                marginRight: 4
              }}
            ></span>
            <span
              style={{ fontSize: 16, color: "#1A2243", fontWeight: "bold" }}
            >
              近一年佣金量趋势
            </span>
          </div>
          {Income?.commiStatusList?.length > 0 ? (
            <div id="commissionBar" style={{ height: 350 }}></div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
              style={{ height: "350px", paddingTop: "120px" }}
            />
          )}

          <Divider style={{ margin: "24px 0" }}></Divider>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <span
              style={{
                height: 15,
                width: 4,
                background: "#0F8AFF",
                display: "inline-block",
                marginRight: 4
              }}
            ></span>
            <span
              style={{ fontSize: 16, color: "#1A2243", fontWeight: "bold" }}
            >
              近一年交易量排名
            </span>
          </div>
          <div style={{ display: "flex", height: 300 }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  marginBottom: 16,
                  color: "rgba(0, 0, 0, 0.85)",
                  fontSize: 14
                }}
              >
                客户排名
              </div>
              {custRank.length > 0 ? (
                custRank.map((item, index) => {
                  return (
                    <div
                      style={{ display: "flex", marginBottom: 27 }}
                      key={index}
                    >
                      {index < 3 ? (
                        <img
                          src={topImg[index]}
                          alt=""
                          style={{ width: 30, marginRight: 8 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            background: "#E3F0FF",
                            color: "#61698C",
                            borderRadius: "50%",
                            marginRight: 8,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          {index + 1}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4
                          }}
                        >
                          <Link
                            to={`/customerPanorama/customerInfo?customerCode=${item?.khh}`}
                            target="_blank"
                          >
                            <span
                              style={{
                                color: "#244FFF",
                                fontSize: 14,
                                cursor: "pointer"
                              }}
                            >
                              {item?.name}
                              <Icon type="right" style={{ marginLeft: 2 }} />
                            </span>
                          </Link>
                          <span
                            style={{
                              color: "#1A2243",
                              fontSize: 14,
                              fontFamily: "EssenceSansStd-Regular"
                            }}
                          >
                            {formatDw(item?.month)}元
                          </span>
                        </div>
                        <div style={{ background: "#F0F1F5", height: 6 }}>
                          <div
                            style={{
                              background: "#0F8AFF",
                              height: 6,
                              width: `${(item?.month / custRank[0]?.month) *
                                95}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                  style={{ height: "300px", paddingTop: "60px" }}
                />
              )}
            </div>
            <Divider
              style={{ height: "100%", margin: "0 16px" }}
              type="vertical"
            ></Divider>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    marginBottom: 16,
                    color: "rgba(0, 0, 0, 0.85)",
                    fontSize: 14
                  }}
                >
                  产品排名
                </div>
                <div style={{ fontSize: 12, color: "#B0B5CC" }}>
                  剔除货基/天利宝/证金宝/新户理财
                </div>
              </div>
              {prodRank.length > 0 ? (
                prodRank.map((item, index) => {
                  return (
                    <div
                      style={{ display: "flex", marginBottom: 27 }}
                      key={index}
                    >
                      {index < 3 ? (
                        <img
                          src={topImg[index]}
                          alt=""
                          style={{ width: 30, marginRight: 8 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            background: "#E3F0FF",
                            color: "#61698C",
                            borderRadius: "50%",
                            marginRight: 8,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          {index + 1}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4
                          }}
                        >
                          <span style={{ color: "#61698C", fontSize: 14 }}>
                            {item?.name}
                          </span>
                          <span
                            style={{
                              color: "#1A2243",
                              fontSize: 14,
                              fontFamily: "EssenceSansStd-Regular"
                            }}
                          >
                            {formatDw(item?.month)}元
                          </span>
                        </div>
                        <div style={{ background: "#F0F1F5", height: 6 }}>
                          <div
                            style={{
                              background: "#0F8AFF",
                              height: 6,
                              width: `${(item?.month / prodRank[0]?.month) *
                                95}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                  style={{ height: "300px", paddingTop: "60px" }}
                />
              )}
            </div>
            <Divider
              style={{ height: "100%", margin: "0 16px" }}
              type="vertical"
            ></Divider>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  marginBottom: 16,
                  color: "rgba(0, 0, 0, 0.85)",
                  fontSize: 14
                }}
              >
                股票排名
              </div>
              {stockRank.length > 0 ? (
                stockRank.map((item, index) => {
                  return (
                    <div
                      style={{ display: "flex", marginBottom: 27 }}
                      key={index}
                    >
                      {index < 3 ? (
                        <img
                          src={topImg[index]}
                          alt=""
                          style={{ width: 30, marginRight: 8 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            background: "#E3F0FF",
                            color: "#61698C",
                            borderRadius: "50%",
                            marginRight: 8,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          {index + 1}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4
                          }}
                        >
                          <span style={{ color: "#61698C", fontSize: 14 }}>
                            {item?.name}
                          </span>
                          <span
                            style={{
                              color: "#1A2243",
                              fontSize: 14,
                              fontFamily: "EssenceSansStd-Regular"
                            }}
                          >
                            {formatDw(item?.month)}元
                          </span>
                        </div>
                        <div style={{ background: "#F0F1F5", height: 6 }}>
                          <div
                            style={{
                              background: "#0F8AFF",
                              height: 6,
                              width: `${(item?.month / stockRank[0]?.month) *
                                95}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                  style={{ height: "300px", paddingTop: "60px" }}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.work}>
          <div className={styles.title}>
            <img
              src={workImg}
              alt=""
              style={{ width: 24, marginRight: 2, marginTop: -6 }}
            />
            <span>工作</span>
          </div>
          <div style={{ display: "flex", height: 196, marginTop: 17 }}>
            <div
              style={{
                flex: 1,
                border: "1px solid",
                borderImage:
                  "linear-gradient(180deg, rgba(246, 250, 255, 1), rgba(235, 236, 242, 1)) 1 1",
                background:
                  "linear-gradient(180deg, #F6FAFF 0%, rgba(255, 255, 255, 0.1) 100%)",
                borderRadius: 1,
                marginRight: 17
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 24,
                  marginBottom: 27
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    本年覆盖率营业部排名
                  </div>
                  <div
                    style={{ fontWeight: 500, color: "#1A2243", marginTop: 12 }}
                  >
                    <span style={{ fontSize: 24 }}>
                      {workInfo?.rankOfCov?.split("/")[0]}
                      {workInfo?.rankOfCov ? "/" : "--"}
                    </span>
                    <span style={{ fontSize: 16 }}>
                      {workInfo?.rankOfCov?.split("/")[1]}
                    </span>
                  </div>
                </div>
                <Divider
                  type="vertical"
                  style={{ height: 45, margin: "0 16px" }}
                ></Divider>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    本年覆盖率公司排名
                  </div>
                  <div
                    style={{ fontWeight: 500, color: "#1A2243", marginTop: 12 }}
                  >
                    <span style={{ fontSize: 24 }}>
                      {workInfo?.rankOfCovDept?.split("/")[0]}
                      {workInfo?.rankOfCovDept ? "/" : "--"}
                    </span>
                    <span style={{ fontSize: 16 }}>
                      {workInfo?.rankOfCovDept?.split("/")[1]}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: "#0F8AFF",
                  background: "#F0F7FF",
                  margin: "0 16px",
                  padding: "4px 0",
                  textAlign: "center",
                  borderRadius: 1,
                  marginBottom: 8
                }}
              >
                本年服务记录数：{workInfo?.serviceNum || "--"}
              </div>
              <div
                style={{
                  color: "#0F8AFF",
                  background: "#F0F7FF",
                  margin: "0 16px",
                  padding: "4px 0",
                  textAlign: "center",
                  borderRadius: 1
                }}
              >
                本年服务覆盖率：{workInfo?.serviceRate || "--"}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                border: "1px solid",
                borderImage:
                  "linear-gradient(180deg, rgba(246, 250, 255, 1), rgba(235, 236, 242, 1)) 1 1",
                background:
                  "linear-gradient(180deg, #F6FAFF 0%, rgba(255, 255, 255, 0.1) 100%)",
                borderRadius: 1,
                marginRight: 17
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 24,
                  marginBottom: 27
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    本年完成率营业部排名
                  </div>
                  <div
                    style={{ fontWeight: 500, color: "#1A2243", marginTop: 12 }}
                  >
                    <span style={{ fontSize: 24 }}>
                      {workInfo?.sucessRate?.split("/")[0]}
                      {workInfo?.sucessRate ? "/" : "--"}
                    </span>
                    <span style={{ fontSize: 16 }}>
                      {workInfo?.sucessRate?.split("/")[1]}
                    </span>
                  </div>
                </div>
                <Divider
                  type="vertical"
                  style={{ height: 45, margin: "0 16px" }}
                ></Divider>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    本年完成率公司排名
                  </div>
                  <div
                    style={{ fontWeight: 500, color: "#1A2243", marginTop: 12 }}
                  >
                    <span style={{ fontSize: 24 }}>
                      {workInfo?.sucessRateCom?.split("/")[0]}
                      {workInfo?.sucessRateCom ? "/" : "--"}
                    </span>
                    <span style={{ fontSize: 16 }}>
                      {workInfo?.sucessRateCom?.split("/")[1]}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{ display: "flex", margin: "0 16px", marginBottom: 8 }}
              >
                <div
                  style={{
                    flex: 1,
                    color: "#0F8AFF",
                    background: "#F0F7FF",
                    padding: "4px 0",
                    textAlign: "center",
                    borderRadius: 1,
                    marginRight: 8
                  }}
                >
                  本年任务接收：{workInfo?.receiver || "--"}
                </div>
                <div
                  style={{
                    flex: 1,
                    color: "#0F8AFF",
                    background: "#F0F7FF",
                    padding: "4px 0",
                    textAlign: "center",
                    borderRadius: 1
                  }}
                >
                  本年已处理：{workInfo?.down || "--"}
                </div>
              </div>
              <div
                style={{
                  color: "#0F8AFF",
                  background: "#F0F7FF",
                  margin: "0 16px",
                  padding: "4px 0",
                  textAlign: "center",
                  borderRadius: 1
                }}
              >
                本年完成率：{workInfo?.rate || "--"}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                border: "1px solid",
                borderImage:
                  "linear-gradient(180deg, rgba(246, 250, 255, 1), rgba(235, 236, 242, 1)) 1 1",
                background:
                  "linear-gradient(180deg, #F6FAFF 0%, rgba(255, 255, 255, 0.1) 100%)",
                borderRadius: 1
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 24,
                  marginBottom: 27
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    本年已读率营业部排名
                  </div>
                  <div
                    style={{ fontWeight: 500, color: "#1A2243", marginTop: 12 }}
                  >
                    <span style={{ fontSize: 24 }}>
                      {workInfo?.readRateDept?.split("/")[0]}
                      {workInfo?.readRateDept ? "/" : "--"}
                    </span>
                    <span style={{ fontSize: 16 }}>
                      {workInfo?.readRateDept?.split("/")[1]}
                    </span>
                  </div>
                </div>
                <Divider
                  type="vertical"
                  style={{ height: 45, margin: "0 16px" }}
                ></Divider>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ fontSize: 14, color: "#61698C" }}>
                    本年已读率公司排名
                  </div>
                  <div
                    style={{ fontWeight: 500, color: "#1A2243", marginTop: 12 }}
                  >
                    <span style={{ fontSize: 24 }}>
                      {workInfo?.readRateCom?.split("/")[0]}
                      {workInfo?.readRateCom ? "/" : "--"}
                    </span>
                    <span style={{ fontSize: 16 }}>
                      {workInfo?.readRateCom?.split("/")[1]}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{ display: "flex", margin: "0 16px", marginBottom: 8 }}
              >
                <div
                  style={{
                    flex: 1,
                    color: "#0F8AFF",
                    background: "#F0F7FF",
                    padding: "4px 0",
                    textAlign: "center",
                    borderRadius: 1,
                    marginRight: 8
                  }}
                >
                  本年通知数：{workInfo?.notify || "--"}
                </div>
                <div
                  style={{
                    flex: 1,
                    color: "#0F8AFF",
                    background: "#F0F7FF",
                    padding: "4px 0",
                    textAlign: "center",
                    borderRadius: 1
                  }}
                >
                  本年已读数：{workInfo?.readNum || "--"}
                </div>
              </div>
              <div
                style={{
                  color: "#0F8AFF",
                  background: "#F0F7FF",
                  margin: "0 16px",
                  padding: "4px 0",
                  textAlign: "center",
                  borderRadius: 1
                }}
              >
                本年已读率：{workInfo?.readRate || "--"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
  dictionary: global.dictionary //字典信息
}))(Staff);
