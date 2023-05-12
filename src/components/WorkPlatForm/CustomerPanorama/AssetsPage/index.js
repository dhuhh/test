import React, { Component } from 'react';
import { Button, DatePicker, Icon, Modal, Divider, Pagination, Popover, Form, Input, Checkbox, Switch, message, Row, Col, Progress, Spin, Empty } from 'antd';
import moment from 'moment';
import * as echarts from 'echarts';
import { getPdf } from './util';
import { connect } from 'dva';
import ReactDOMServer from 'react-dom/server';
import BasicDataTable from '$common/BasicDataTable';
import { formatColor, formatThousands, formatDw, viewSensors, clickSensors } from './util';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
//import delete_icon from '$assets/newProduct/customerPanorama/删除@2x.png';
import delete_icon from '$assets/newProduct/customerPanorama/delete@2x.png';
//import defaultImg from '$assets/newProduct/customerPortrait/缺省图@2x.png';
import defaultImg from '$assets/newProduct/customerPortrait/defaultGraph@2x.png';
import { QueryCusInfo } from '$services/newProduct';
import { QueryAssetPieChartInformation, SaveProgramIndicatorInformation, QueryProgramIndicatorInformation, QueryIndicatorSchemeDefinition, QueryAssetPlanTrendList, QueryAssetPlanMonthList, QueryCustomerContributionTrendList, QueryCustomerContributionList, QueryAccountAnalysisListInfo, QueryAccountAnalysisSum } from '$services/customerPanorama';
import { FindAvailableAccount } from '$services/newProduct/customerPortrait';
import config from '$utils/config';
import questionMark from '$assets/newProduct/customerPortrait/question-mark.png';
import iconCheck from '../../../../assets/newProduct/customerPanorama/iconCheck.png';
import iconLineBar from '../../../../assets/newProduct/customerPanorama/iconLineBar.png';
import styles from './index.less';
const CheckboxGroup = Checkbox.Group;
const { api, prefix } = config;
const {
  customerPanorama: {
    queryAccountAnalysisListInfoExport, queryAssetPlanMonthListExport, queryCustomerContributionListExport, queryAccountAnalysisSumExport,
  } } = api;
class AssetsPage extends Component {
  state = {
    accountData: [],
    indexData: [],
    pieData: undefined,
    barData: [],
    stackData: [],
    barItem: [],
    pieItem: [],
    stackItem: [],
    pieLabel: {},
    pieTips: '',
    barLabel: '',
    listTotal: [],
    customIndex: [],
    accountType: 0,
    tjDateType: 2, //统计时间类型
    mode: ['month', 'month'],
    openDate: '',
    tjDate: [moment().subtract(1, 'years'), moment()],
    dateType: 3, //时间按钮类型
    indexType: 1, //指标类型
    fetchType: 0,
    chartType: 1,
    visible: false,
    modalVisible: false,
    modalLoading: false,
    pageSize: 10,
    current: 1,
    total: 0,
    dataSource: [],
    indeterminate: false,
    checkAll: false,
    checkedList: [],
    indexList: [],
    open: false,
    switchKey: false,
    loading: false,
    fetchLoading: false,
    isLineShow: 2,
    customizeIndex: undefined,
    showDefaultImg: false,
    showPie: true,
  }
  newState = {}
  componentDidMount() {
    // this.initPieChart();
    // this.initBarChart();
    // this.initLineChart();
    viewSensors();
    this.queryCusInfo();
    this.findAvailableAccount();
    this.fetchData();
    this.queryIndicatorSchemeDefinition();
    let that = this;
    document.onclick = function (param) {
      if (!param.target) {
        return;
      }
      if (param.target.id !== 'rangePicker') {
        that.setState({
          open: false,
        });
      }
    };
  }
  componentWillUnmount() {
    // 清空定时器,避免内存泄漏
    if (this.timers && this.timers.length > 0) {
      this.timers.forEach((timer) => {
        clearTimeout(timer);
      });
      this.timers = null;
    }
    // 关闭EventSource,避免内存泄漏
    if (this.eventSources && this.eventSources.length > 0) {
      this.eventSources.forEach((eventSource) => {
        if (eventSource && eventSource.close) {
          eventSource.close();
        }
      });
      this.eventSources = null;
    }
  }
  //查询信息
  fetchData = () => {
    this.setState({
      fetchLoading: true,
    });
    if (this.state.indexType === 1 || this.state.indexType === 2) {
      if (this.state.accountType !== 5) {
        this.queryAssetPlanTrendList();
        if (this.state.accountType === 3) {
          this.setState({
            showPie: false,
          });
        } else {
          this.setState({
            showPie: true,
          }, () => {
            this.queryAssetPieChartInformation();
          });

        }
      }
      this.setState({
        current: 1,
        pageSize: 10,
      }, () => {
        this.queryAssetPlanMonthList();
      });

    } else if (this.state.indexType === 3) {
      this.qeryStackInfo();
      if (this.state.fetchType === 0) {
        this.setState({
          current: 1,
          pageSize: 10,
        }, () => {
          this.qeryAccountAnalysisListInfo();
        });
      } else {
        this.setState({
          current: 1,
          pageSize: 10,
        }, () => {
          this.queryAccountAnalysisSum();
        });
      }
    } else {
      if (this.state.fetchType === 0) {
        this.setState({
          current: 1,
          pageSize: 10,
        }, () => {
          this.qeryAccountAnalysisListInfo();
        });
      } else {
        this.setState({
          current: 1,
          pageSize: 10,
        }, () => {
          this.queryAccountAnalysisSum();
        });
      }

    }
    //指标方案埋点
    newClickSensors({
      third_module: "资产贡献",
      ax_button_name: "点击查询次数",
    });
    if (![1, 2, 3].includes(this.state.indexType)) {
      newClickSensors({
        third_module: "资产贡献",
        ax_button_name: "自定义指标方案指标采用次数",
      });
      if (this.state.fetchType === 0) {
        clickSensors("明细");
      } else {
        clickSensors("汇总");
      }
    }
    this.newState = this.state;
    this.forceUpdate();
  }
  queryCusInfo = () => {
    QueryCusInfo({
      cusNo: this.props.customerCode,
    }).then(res => {
      this.setState({
        openDate: res.records[0].openAccountDate,
      });
    });
  }

  //账户分析汇总
  queryAccountAnalysisSum = () => {
    const { tjDate, accountType, indexType, tjDateType, pageSize, current, total, customizeIndex } = this.state;
    this.setState({
      loading: true,
    });
    let param = {
      accnNo: this.props.customerCode,
      accnType: accountType,
      beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
      endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
      current: current,
      pageSize: pageSize,
      paging: 1,
      sort: "",
      statisTm: tjDateType,
      // planType: indexType,
    };
    if (indexType !== 3) {
      param = { ...param, planType: customizeIndex };
    }
    QueryAccountAnalysisSum(param).then(res => {
      this.setState({
        fetchLoading: false,
        dataSource: res.records,
        total: res.total,
        loading: false,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //账户分析信息查询(不分页)
  qeryStackInfo = () => {
    const { tjDate, accountType, indexType, tjDateType, pageSize, current, total } = this.state;
    QueryAccountAnalysisListInfo({
      accnNo: this.props.customerCode * 1,
      accnType: accountType,
      beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
      endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
      sort: "",
      statisTm: tjDateType,
    }).then(res => {
      this.setState({
        fetchLoading: false,
        stackData: res.records?.sort((a, b) => {
          if (a.日期) {
            return a.日期 - b.日期;
          } else {
            return a.月份 - b.月份;
          }
        }),
      });
      if (res.records.length !== 0) {
        this.getStackItem();
      }

    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //账户分析信息查询(分页)
  qeryAccountAnalysisListInfo = () => {
    const { tjDate, accountType, indexType, tjDateType, pageSize, current, total, customizeIndex } = this.state;
    this.setState({
      loading: true,
    });
    let param = {
      accnNo: this.props.customerCode,
      accnType: accountType,
      beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
      endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
      current: current,
      pageSize: pageSize,
      paging: 1,
      sort: "",
      statisTm: tjDateType,
      // planType: indexType,
    };
    if (indexType !== 3) {
      param = { ...param, planType: customizeIndex };
    }
    QueryAccountAnalysisListInfo(param).then(res => {
      this.setState({
        fetchLoading: false,
        loading: false,
        dataSource: res.records,
        total: res.total,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //查询资产贡献列表
  queryAssetPlanMonthList = () => {
    const { tjDate, accountType, indexType, tjDateType, pageSize, current, total } = this.state;
    this.setState({
      loading: true,
    });
    let tableList = undefined;
    if (indexType === 1) {
      tableList = QueryAssetPlanMonthList({
        accnNo: this.props.customerCode,
        accnType: accountType,
        beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
        endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
        current: current,
        pageSize: pageSize,
        paging: 1,
        sort: "",
        statisTm: tjDateType,
      });
    } else if (indexType === 2) {
      tableList = QueryCustomerContributionList({
        accnNo: this.props.customerCode,
        accnType: accountType,
        beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
        endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
        current: current,
        pageSize: pageSize,
        paging: 1,
        sort: "",
        statisTm: tjDateType,
      });
    }
    tableList.then(res => {
      this.setState({
        dataSource: res.records,
        total: res.total,
        loading: false,
        fetchLoading: false,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //查询自定义指标方案
  queryIndicatorSchemeDefinition = () => {
    QueryIndicatorSchemeDefinition({
      "custNo": this.props.customerCode * 1,
      "accnType": this.state.accountType,
      statisTm: this.state.tjDateType,
    }).then(res => {
      this.setState({
        customIndex: res.records,
      });
      if (![1, 2, 3].includes(this.state.indexType)) {
        this.setState({
          indexType: 1,
        });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //查询可获取的账户类型
  findAvailableAccount = () => {
    FindAvailableAccount({ loginAccount: this.props.customerCode }).then(res => {
      const { records = [] } = res;
      let result = records.length ? [{ ibm: 0, note: '全部' }] : [];
      const map = {
        普通: 1,
        信用: 2,
        期权: 3,
        理财: 4,
        基金投顾: 5,
      };
      records.forEach(item => {
        const name = item.Name.indexOf('账户') > -1 ? item.Name.replace(/账户/g, '') : item.Name;
        result.push({ ibm: map[name], note: name });
      });
      this.setState({
        accountData: result,
      });
    }).catch(err => message.error(err.note || err.message));
  }

  //获取指标方案
  queryProgramIndicatorInformation = () => {
    this.setState({
      modalLoading: true,
    });
    QueryProgramIndicatorInformation({
      "custNo": this.props.customerCode * 1,
      "accnType": this.state.accountType,
      statisTm: this.state.tjDateType,
    }).then(res => {
      let indexData = res.records.map(item => {
        return { value: item.id, label: item.targetName };
      });
      this.setState({
        indexData,
        modalLoading: false,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //获取资产趋势图
  queryAssetPlanTrendList = () => {
    const { tjDate, accountType, indexType, tjDateType } = this.state;
    const TimeLegth = moment(tjDate[1].format('YYYYMMDD')).diff(tjDate[0].format('YYYYMMDD'), 'month');
    let TrendList = undefined;
    if (indexType === 1) {
      TrendList = QueryAssetPlanTrendList({
        accnNo: this.props.customerCode * 1,
        accnType: accountType,
        statisTm: tjDateType,
        beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
        endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
      });
    } else if (indexType === 2) {
      TrendList = QueryCustomerContributionTrendList({
        accnNo: this.props.customerCode * 1,
        accnType: accountType,
        statisTm: tjDateType,
        beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
        endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
      });
    }
    TrendList.then(res => {
      this.setState({
        fetchLoading: false,
        barData: res.records?.sort((a, b) => {
          if (a.日期) {
            return a.日期 - b.日期;
          } else {
            return a.月份 - b.月份;
          }
        }),
        isLineShow: tjDateType,
      }, () => {
        if (this.state.barData.length > 0) {
          this.getBarItem();
          if (tjDateType === 2) {
            if (TimeLegth <= 12) {
              this.setState({
                isLineShow: 2,
              });
            } else {
              this.setState({
                isLineShow: 1,
              });
            }
          }
        }
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //获取资产贡献饼图
  queryAssetPieChartInformation = () => {
    const { accountType, indexType , tjDateType , tjDate } = this.state;
    QueryAssetPieChartInformation({
      "accnNo": this.props.customerCode,
      "accnType": accountType,
      "planType": indexType,
      statisTm: tjDateType,
      beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
      endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
      // "statisTm": 0,
    }).then(res => {
      if (res.records[0]) {
        let pieData = res.records[0];
        let keys = Object.keys(res.records[0]).filter(item => item !== '时间截止日期');
        let total = 0;
        keys.forEach(item => total += Number(pieData[item]));
        if (total === 0) {
          this.setState({
            showDefaultImg: true,
          });
        } else {
          keys.forEach(item => {
            if (Number(pieData[item]) === 0) {
              delete pieData[item];
            }
          });
          this.setState({
            pieData,
            showDefaultImg: false,
          }, () => {
            setTimeout(() => {
              this.getPieItem();
            }, 100);

          });
        }

      } else {
        this.setState({
          pieData: undefined,
        });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleAccountType = (accountType) => {
    let m = {
      "0": "全部账户点击次数",
      "1": "普通账户点击次数",
      "2": "信用账户点击次数",
      "3": "期权账户点击次数",
      "4": "理财账户点击次数",
      "5": "基金投顾账户点击次数",
    };
    let name = m[accountType];
    newClickSensors({
      third_module: "资产贡献",
      ax_button_name: name,
    });

    this.setState({
      accountType,
    }, () => {
      this.queryIndicatorSchemeDefinition();
    });
  }
  handleTjDateType = (tjDateType) => {

    this.setState({
      tjDateType,
    }, () => {
      this.queryIndicatorSchemeDefinition();
    });
    if (tjDateType === 2) {
      newClickSensors({
        third_module: "资产贡献",
        ax_button_name: "统计时间维度次数按月"
      });
      this.setState({
        mode: ['month', 'month'],
      });
    } else {
      newClickSensors({
        third_module: "资产贡献",
        ax_button_name: "统计时间维度次数按日"
      });
      this.setState({
        mode: ['date', 'date'],
      });
    }
  }
  handlePanelChange = (tjDate, mode) => {
    this.setState({
      tjDate: tjDate.sort((a, b) => a.format('YYYYMMDD') - b.format('YYYYMMDD')),
      dateType: undefined,
    });
    if (this.state.tjDateType === 1) {
      this.setState({
        mode: [mode[0], mode[1]],
      });
    } else {
      this.setState({
        mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
      });
    }
  };
  handleIndexType = (indexType) => {
    if([1,2].includes(indexType)){
      let m = {
        "1": "指标方案-资产方案点击次数",
        "2": "指标方案-贡献方案点击次数",
      };
      let name = m[indexType];
      newClickSensors({
        third_module: "资产贡献",
        ax_button_name: name ,
      });
    };
    if (indexType === 2 && [3, 5].includes(this.state.accountType)) {
      this.handleAccountType(0);
    }
    this.setState({
      indexType,
    });
    if (![1, 2, 3].includes(indexType)) {
      this.setState({
        customizeIndex: indexType,
      });
    }
  }
  addIndex = () => {
    newClickSensors({
      third_module: "资产贡献",
      ax_button_name: "指标方案-自定义方案点击次数",
    });
    this.queryProgramIndicatorInformation();
    this.setState({
      visible: true,
      checkedList: [],
      indeterminate: false,
      checkAll: false,
    });
  }
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
  getPieItem = () => {
    const { indexType, accountType, pieData } = this.state;
    console.log('showPie', this.state.showPie, 'showDefaultImg', this.state.showDefaultImg);
    let label = '';
    let tips = '';
    if (indexType === 1) {
      if (accountType === 0) {
        label = '总资产';
        tips = '期末资产';
      } else if (accountType === 1) {
        label = '普通账户-总资产';
        tips = '市值';
      } else if (accountType === 2) {
        label = '信用账户-总资产';
        tips = '负债';
      } else if (accountType === 4) {
        label = '理财账户-总资产';
        tips = '保有量';
      } else if (accountType === 3) {
        label = '期权账户-总资产';
        tips = '市值';
      }
    } else if (indexType === 2) {
      if (accountType === 0) {
        label = '总贡献';
        tips = '佣金收入';
      } else if (accountType === 1) {
        label = '普通账户-总贡献';
        tips = '佣金收入';
      } else if (accountType === 2) {
        label = '信用账户-总贡献';
        tips = '佣金收入';
      } else if (accountType === 4) {
        label = '理财账户-总贡献';
        tips = '手续费';
      }
    }
    let pieLabel = { name: label === '信用账户-总资产' ? '' : label, value: pieData[label] };
    let tempData = pieData;
    delete tempData[label];
    // delete tempData['时间截止日期'];
    let keys = Object.keys(tempData);
    let values = Object.values(tempData);
    let pieItem = keys.map((item, index) => { return { name: item, value: values[index] }; });
    this.setState({
      pieItem,
      pieLabel,
      pieTips: tips,
    }, () => {
      console.log(document.getElementById('pieChart'));
      let myChart = echarts.init(document.getElementById('pieChart'));
      myChart.dispose();
      this.initPieChart();
    });
  }
  getBarItem = () => {
    const { indexType, accountType, barData, tjDateType } = this.state;
    let label = '';
    if (indexType === 1 && tjDateType === 2) {
      if (accountType === 0) {
        label = '期末总资产';
      } else if (accountType === 1) {
        label = '普通账户-总资产';
      } else if (accountType === 2) {
        label = '期末总资产-信用';
      } else if (accountType === 4) {
        label = '理财账户-总资产';
      } else if (accountType === 3) {
        label = '期末总资产-期权';
      }
    } else if (indexType === 1 && tjDateType === 1) {
      if (accountType === 0) {
        label = '总资产';
      } else if (accountType === 1) {
        label = '普通账户-总资产';
      } else if (accountType === 2) {
        label = '信用账户-总资产';
      } else if (accountType === 4) {
        label = '理财账户-总资产';
      } else if (accountType === 3) {
        label = '期权账户-总资产';
      }
    } else if (indexType === 2) {
      if (accountType === 0) {
        label = '总贡献';
      } else if (accountType === 1) {
        label = '普通账户总贡献';
      } else if (accountType === 2) {
        label = '信用账户总贡献';
      } else if (accountType === 4) {
        label = '理财账户总贡献';
      }
    }
    let keys = Object.keys(barData[0]).filter(item => item !== '月份' && item !== '日期' && item !== label);
    let barItem = keys.map((item, index) => {
      if (barData.map(item1 => { return item1[item]; }).reduce((pre, cur) => Number(pre) + Number(cur)) > 0) {
        return {
          name: item,
          type: 'bar',
          stack: 'Ad',
          barWidth: this.state.showPie ? `${barData.length * 5}%` : 35,
          data: barData.map(item1 => { return item1[item]; }),
        };
      }
    }).filter(item => item);
    let barLabel = label;
    this.setState({
      barItem,
      barLabel,
    }, () => {
      let myChart = echarts.init(document.getElementById('barChart'));
      myChart.dispose();
      this.initBarChart();
      let myChart1 = echarts.init(document.getElementById('lineChart'));
      myChart1.dispose();
      this.initLineChart();
    });
  }
  getStackItem = () => {
    const { stackData } = this.state;
    const { accountType, tjDateType } = this.newState;
    let keys = Object.keys(stackData[0] || {}).filter(item => item !== '日期' && item !== '月份');
    let Item = keys.map(key => { return { [key]: stackData.map(item => item[key]) }; });
    let listTotal = keys.map(key => [key, stackData.map(item => item[key]).reduce((pre, cur) => pre + cur.split(',').join('') * 1, 0)]);
    let stackItem = {};
    Item.forEach(item => Object.assign(stackItem, item));
    this.setState({
      stackItem,
      listTotal,
      indexList: accountType === 0 ? [tjDateType === 1 ? '总资产' : '期末总资产', '交易量', '总贡献'] : [keys[0], keys[1], keys[2]],
    }, () => {
      if (this.state.switchKey) {
        let myChart = echarts.init(document.getElementById('stackLine'));
        myChart.dispose();
        this.initStackLineChart();
      }

    });
  }
  initPieChart = () => {
    const { pieItem, pieLabel, pieTips } = this.state;
    let colorData = ['#7D93EE', '#FFA257', '#0F8AFF', '#00B7FF', '#71CF8E', '#5081DF', '#FF7957', '#E9D54C', '#63ADE8', '#4FCBBF', '#F6C34F', '#A084FF'];
    colorData = colorData.slice(0, pieItem.filter(item => item.name !== '时间截止日期').length);
    let chartData = pieItem.filter(item => item.name !== '时间截止日期');
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
            <div style={{ padding: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: params['color'] }}></div>
                </div>
                <div style={{ fontWeight: 500 }}>{params['name']}</div>
              </div>
              <div style={{ paddingLeft: 20 }}>
                <span>占比：</span>
                <span>{params['percent']}%</span>
              </div>
              <div style={{ paddingLeft: 20 }}>
                <span>{pieTips}：</span>
                <span>{formatDw(params['value'])}元</span>
              </div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      title: {
        text: `数据截止至${moment(pieItem.find(item => item.name === '时间截止日期')?.value).format('YYYY-MM-DD')}`,
        x: '40%',
        y: 60,
        textAlign: 'center',
        textStyle: {
          fontSize: 14,
          color: '#61698C',
          fontWeight: 400,
        },
      },
      color: colorData,
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
          name: '',
          type: 'pie',
          radius: ['29%', '48%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: (params) => {
                return pieLabel.name !== '' ? [
                  `{a|${pieLabel.name}}`,
                  `{b|${formatDw(pieLabel.value)}}`,
                ].join(`\n`) : '';
              },
              rich: {
                a: {
                  color: ' #61698C',
                  fontSize: 14,
                  lineHeight: 20,
                  fontWeight: 400,
                },
                b: {
                  color: '#1A2243',
                  fontSize: 20,
                  fontFamily: 'EssenceSansStd-Regular',
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
          data: chartData,
        },
      ],
    };
    let myChart = echarts.init(document.getElementById('pieChart'), null, { devicePixelRatio: 2 });
    myChart.setOption(option);
    // myChart.resize();
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }
  initBarChart = () => {
    const { barItem, barData, barLabel } = this.state;
    let date = barData.map(item => item.月份 || item.日期);
    let colorData = ['#7D93EE', '#FFA257', '#0F8AFF', '#00B7FF', '#71CF8E', '#5081DF', '#FF7957', '#E9D54C', '#63ADE8', '#4FCBBF', '#F6C34F', '#A084FF'];
    colorData = colorData.slice(0, barItem.length);
    let legendData = barItem.map(item => item.name);
    if (legendData.length >= 5) {
      legendData.splice(5, 0, '');
    }
    let option = {
      tooltip: {
        trigger: 'axis',
        extraCssText: 'box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13)',
        borderRadius: 10,
        padding: 0,
        formatter: (params) => {
          const jsx = (
            <div style={{ overflow: 'hidden', borderRadius: 2 }}>
              <div style={{ background: '#F3F4F7', padding: '8px 120px 8px 12px', color: '#1A2243' }}>
                <div style={{ fontWeight: 500, marginBottom: 2 }}>{moment(params[0].axisValue).format('M月')}{barLabel}</div>
                <div style={{ fontWeight: 500 }}>{formatDw(barData.filter(item => item.月份 === params[0].axisValue || item.日期 === params[0].axisValue)[0][barLabel])}元</div>
              </div>
              <div style={{ padding: '16px', background: '#FFF', color: '#1A2243' }}>
                {params.map((item, index) => {
                  if (Number(item.value) !== 0) {
                    return (
                      <div key={index} style={{ marginBottom: index === params.length - 1 ? 0 : 8 }}>
                        <span style={{ background: item.color, width: 8, height: 8, borderRadius: 1, marginRight: 6, display: 'inline-block' }}></span>
                        <span>{item.seriesName}：{formatDw(item.value)}元</span>
                      </div>
                    );
                  }
                  ;
                })}
              </div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        },
      },
      title: {
        text: this.newState.indexType === 1 ? '资产趋势' : '贡献趋势',
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
      color: colorData,
      legend: {
        icon: 'rect',
        itemWidth: 8,
        itemHeight: 8,
        borderRadius: 1,
        top: 20,
        data: legendData,
        left: 'center',
        textStyle: {
          fontSize: 12,
          color: '#61698C',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
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
          data: date,
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
          splitLine: {
            lineStyle: {
              color: '#EBECF2',
            },
          },
        },
      ],
      series: barItem,
    };
    let myChart = echarts.init(document.getElementById('barChart'), null, { devicePixelRatio: 2 });
    // myChart.resize();
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }
  initLineChart = () => {
    const { barData, barLabel } = this.state;
    let colorData = ['#7D93EE', '#FFA257', '#0F8AFF', '#00B7FF', '#71CF8E', '#5081DF', '#FF7957', '#E9D54C', '#63ADE8', '#4FCBBF', '#F6C34F', '#A084FF'];
    let date = barData.map(item => item.日期 || item.月份);
    let tips = Object.keys(barData[0]).filter(item => item !== barLabel && item !== '日期' && item !== '月份');
    let title = Object.keys(barData[0]).filter(item => item === barLabel);
    let lineData = barData.map(item => item[title]);
    let option = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      title: {
        text: this.newState.indexType === 1 ? '资产趋势' : '贡献趋势',
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
      tooltip: {
        trigger: 'axis',
        extraCssText: 'box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);',
        padding: 0,
        formatter: (params) => {
          const jsx = (
            <div style={{ overflow: 'hidden', borderRadius: 2 }}>
              <div style={{ background: '#F3F4F7', padding: '8px 120px 8px 12px', color: '#1A2243' }}>
                <div style={{ fontWeight: 500, marginBottom: 2 }}>{params[0].axisValue.length === 6 ? moment(params[0].axisValue).format('YYYY-MM') : moment(params[0].axisValue).format('YYYY-MM-DD')}{barLabel}</div>
                <div style={{ fontWeight: 500 }}>{formatDw(params[0].value)}元</div>
              </div>
              <div style={{ padding: '16px', background: '#FFF', color: '#1A2243' }}>
                {
                  tips.map((item, index) => {
                    if (Number(barData.filter(item => item.日期 === params[0].axisValue || item.月份 === params[0].axisValue)[0][item]) !== 0) {
                      return (
                        <div key={index} style={{ marginBottom: index === tips.length - 1 ? 0 : 8 }}>
                          <span style={{ background: colorData[index], width: 8, height: 8, marginRight: 6, borderRadius: 1, display: 'inline-block' }}></span>
                          <span>{item}：{formatDw(barData.filter(item => item.日期 === params[0].axisValue || item.月份 === params[0].axisValue)[0][item])}元</span>
                        </div>
                      );
                    }
                  })
                }
              </div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
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
        },
        data: date,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#EBECF2',
          },
        },
      },
      series: [
        {
          data: lineData,
          type: 'line',
          name: barLabel,
          lineStyle: {
            color: '#244FFF',
            width: 1.5,
          },
          // symbol: yData.length <= 1 ? 'circle' : 'circle',
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
    let myChart = echarts.init(document.getElementById('lineChart'), null, { devicePixelRatio: 2 });
    // myChart.resize();
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }
  initStackLineChart = () => {
    const { indexList, stackItem, stackData } = this.state;
    let date = stackData.map(item => item.月份 || item.日期);
    let seriesData = [
      {
        name: indexList[0],
        type: 'line',
        // stack: 'Total',
        data: indexList[0] ? stackItem[indexList[0]]?.map(item => item.split(',').join('')) : [],
        symbol: 'circle',
        showSymbol: true,
        symbolSize: indexList.length === 1 ? 1 : 0,
        lineStyle: {
          width: 1.5,
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
      {
        name: indexList[1],
        type: 'line',
        // stack: 'Total',
        data: indexList[1] ? stackItem[indexList[1]].map(item => item.split(',').join('')) : [],
        symbol: 'circle',
        showSymbol: true,
        symbolSize: indexList.length === 2 ? 1 : 0,
        lineStyle: {
          width: 1.5,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: 'rgba(246, 195, 79, 0)',
            },
            {
              offset: 1,
              color: 'rgba(246, 195, 79, 0.06)',
            },
          ]),
        },
      },
      {
        name: indexList[2],
        type: 'line',
        // stack: 'Total',
        data: indexList[2] ? stackItem[indexList[2]].map(item => item.split(',').join('')) : [],
        symbol: 'circle',
        showSymbol: true,
        symbolSize: indexList.length === 3 ? 1 : 0,
        lineStyle: {
          width: 1.5,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: 'rgba(0, 183, 255, 0)',
            },
            {
              offset: 1,
              color: 'rgba(0, 183, 255, 0.06)',
            },
          ]),
        },
      },
      {
        name: indexList[3],
        type: 'line',
        // stack: 'Total',
        data: indexList[3] ? stackItem[indexList[3]].map(item => item.split(',').join('')) : [],
        symbol: 'circle',
        showSymbol: true,
        symbolSize: indexList.length === 4 ? 1 : 0,
        lineStyle: {
          width: 1.5,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: 'rgba(255, 162, 87, 0)',//颜色4
            },
            {
              offset: 1,
              color: 'rgba(255, 162, 87, 0.06)',
            },
          ]),
        },
      },
      {
        name: indexList[4],
        type: 'line',
        // stack: 'Total',
        data: indexList[4] ? stackItem[indexList[4]].map(item => item.split(',').join('')) : [],
        symbol: 'circle',
        showSymbol: true,
        symbolSize: indexList.length === 5 ? 1 : 0,
        lineStyle: {
          width: 1.5,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: 'rgba(255, 121, 87, 0)',
            },
            {
              offset: 1,
              color: 'rgba(255, 121, 87, 0.06)',
            },
          ]),
        },
      },
    ];
    seriesData = seriesData.slice(0, indexList.length);
    let option = {
      title: {
        text: '账户分析',
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
      color: [' #0F8AFF', '#F6C34F', '#00B7FF', '#FFA257', '#FF7957'],
      legend: {
        top: '3%',
        left: '15%',
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          fontSize: 14,
          color: ' #1A2243',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        extraCssText: 'box-shadow: 0px 0px 18px 0px rgba(5, 14, 28, 0.13);',
        padding: 0,
        formatter: (params) => {
          // console.log(params);
          const jsx = (
            <>
              <div style={{ padding: '12px', background: '#FFF', color: '#1A2243', borderRadius: 2 }}>
                <div style={{ fontWeight: 500, marginBottom: 12 }}>{params[0].axisValue.length === 6 ? moment(params[0].axisValue).format('YYYY-MM') : moment(params[0].axisValue).format('YYYY-MM-DD')}</div>
                {params.map((item, index) => (
                  <div key={index} style={{ marginBottom: index === params.length - 1 ? 0 : 8 }}>
                    <span style={{ background: item.color, width: 8, height: 8, marginRight: 6, display: 'inline-block', borderRadius: '50%' }}></span>
                    <span>{item.seriesName}：{formatDw(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          );
          return ReactDOMServer.renderToString(jsx);
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
        },
        data: date,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#EBECF2',
          },
        },
      },
      series: seriesData,
    };
    let myChart = echarts.init(document.getElementById('stackLine'), null, { devicePixelRatio: 2 });
    // myChart.resize();
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }
  getColumns = () => {
    const { dataSource } = this.state;
    const { indexType, fetchType } = this.newState;
    let keys = dataSource[0] && Object.keys(dataSource[0]);
    let columns = keys?.filter(item => item !== 'key').map((item, index) => {
      return {
        title: <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{item}</div>,
        key: item,
        dataIndex: item,
        ellipsis: true,
        width: 180,
        render: (text) => {
          if (item === '月份') {
            return moment(text)._isValid ? moment(text).format('YYYY.MM') : text;
          } else if (item === '日期') {
            return moment(text)._isValid ? moment(text).format('YYYY.MM.DD') : text;
          } else {
            return text;
          }
        },
      };
    });
    return columns;
  }
  onChange = checkedList => {
    if (checkedList.length > this.state.checkedList.length){
      let arr = checkedList.filter(item => !this.state.checkedList.includes(item));
      let name = this.state.indexData.filter(item=>arr.includes(item.value));
      newClickSensors({
        third_module: "资产贡献",
        ax_page_name: '新增指标方案分别点击次数',
        ax_button_name: name[0].label,
      });

    }
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length &&
        checkedList.length < this.state.indexData.length,
      checkAll: checkedList.length === this.state.indexData.length,
    });
    setTimeout(() => {
      this.props.form.setFieldsValue({ 'indexSelc': checkedList });
    });
  };

  onCheckAllChange = e => {
    let allData = this.state.indexData.map(item => item.value);
    if (e.target.checked) {
      this.state.indexData.map(item => {
        newClickSensors({
          third_module: "资产贡献",
          ax_page_name: "新增指标方案分别点击次数",
          ax_button_name: item.label,
        });
      });
    }

    this.setState({
      checkedList: e.target.checked ? allData : [],
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => {
      this.props.form.setFieldsValue({ 'indexSelc': this.state.checkedList });
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        if (!value.indexSelc || value.indexSelc.length === 0) {
          message.info('请选择指标方案');
        } else {
          newClickSensors({
            third_module: "资产贡献",
            ax_button_name: "新增指标方案保存点击次数",
          });
          SaveProgramIndicatorInformation({
            targetId: value.indexSelc.join(','),
            accnType: this.state.accountType,
            statisTm: this.state.tjDateType,
            planName: value.projNm,
            srcType: 1,
          }).then(res => {
            if (res.code > 0) {
              message.info('保存成功');
              this.queryIndicatorSchemeDefinition();
            }
          }).catch(err => message.error(err.note || err.message));
          this.setState({
            visible: false,
          });
        }
      }
    });
  }
  setIndexList = (e) => {
    let indexList = this.state.indexList;
    if (e.target.checked) {
      if (indexList.length >= 5) {
        message.info('最多选择5项指标');
        return;
      }
      clickSensors('图表分析-指标选择');
      indexList.push(e.target.value);
    } else {
      indexList = indexList.filter(item => item !== e.target.value);
    }
    this.setState({
      indexList,
    }, () => {
      let myChart = echarts.init(document.getElementById('stackLine'));
      myChart.dispose();
      this.initStackLineChart();
    });
  }
  resetIndex = () => {
    const { stackData } = this.state;
    const { accountType, tjDateType } = this.newState;
    let keys = Object.keys(stackData[0] || {}).filter(item => item !== '日期' && item !== '月份');
    this.setState({
      indexList: accountType === 0 ? [tjDateType === 1 ? '总资产' : '期末总资产', '交易量', '总贡献'] : [keys[0], keys[1], keys[2]],
    }, () => {
      let myChart = echarts.init(document.getElementById('stackLine'));
      myChart.dispose();
      this.initStackLineChart();
    });
  }
  setDate = (type) => {
    const map = {
      1: [moment().startOf('year'), moment()],//本年
      2: [moment().startOf('month'), moment()],//本月
      3: [moment().subtract(1, 'years'), moment()],//近一年
      4: [moment().subtract(6, 'months'), moment()],//近半年
      5: [moment().startOf('quarter'), moment().endOf('quarter')],//本季度
      6: [moment().quarter(moment().quarter() - 1).startOf('quarter'), moment().quarter(moment().quarter() - 1).endOf('quarter')],//上季度
      7: [moment(this.state.openDate), moment()],//开户以来
    };
    this.setState({
      tjDate: map[type],
      dateType: type,
    });
  }
  changeSwitch = () => {
    this.setState({
      switchKey: !this.state.switchKey,
    }, () => {
      if (this.state.switchKey) {
        clickSensors('图表分析');
        this.initStackLineChart();
      }
    });
  }
  deleteIndex = (index) => {
    SaveProgramIndicatorInformation({
      planId: index * 1,
      accnType: this.state.accountType,
      statisTm: this.state.tjDateType,
      srcType: 3,
    }).then(res => {
      if (res.code > 0) {
        message.info('删除成功');
        this.queryIndicatorSchemeDefinition();
      }
    }).catch(err => message.error(err.note || err.message));
  }
  reset = () => {
    this.setState({
      accountType: 0,
      tjDateType: 2,
      tjDate: [moment().subtract(1, 'years'), moment()],
      indexType: 1,
    });
  }
  exportChart = () => {
    const map = {
      0: '全部',
      1: '普通',
      2: '信用',
      3: '期权',
      4: '理财',
      5: '基金投顾',
    };
    let dateType = this.newState.tjDateType === 1 ? 'YYYY.MM.DD' : 'YYYY.MM';
    let title = moment(this.newState.tjDate[1]).format(`账户分析-${map[this.newState.accountType]}账户-${dateType}`);
    getPdf(title, '#stackLine');
  }
  handlePagerChange = (current, pageSize) => {
    this.setState({
      pageSize,
      current,
    }, () => {
      if (this.newState.indexType === 1 || this.newState.indexType === 2) {
        this.queryAssetPlanMonthList();
      } else {
        this.qeryAccountAnalysisListInfo();
      }
    });
  }
  handlePagerSizeChange = (current, pageSize) => {
    this.setState({
      pageSize,
      current,
    }, () => {
      if (this.newState.indexType === 1 || this.newState.indexType === 2) {
        this.queryAssetPlanMonthList();
      } else {
        this.qeryAccountAnalysisListInfo();
      }
    });
  }
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }
  // 导出
  export = () => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    let action = undefined;
    const { indexType, fetchType, accountType, tjDateType, tjDate } = this.newState;
    if (indexType === 1) {
      action = queryAssetPlanMonthListExport;
    } else if (indexType === 2) {
      action = queryCustomerContributionListExport;
    } else {
      if (fetchType === 0) {
        action = queryAccountAnalysisListInfoExport;
      } else {
        action = queryAccountAnalysisSumExport;
      }
    }
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    let total = this.state.total;
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        newClickSensors({
          third_module: "资产贡献",
          ax_button_name: "导出次数",
        });
        let columns = _this.getColumns();
        // columns.shift();
        let tableHeaderCodes = columns.map(item => item.dataIndex);
        let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key);
        tableHeaderCodes = tableHeaderCodes.join(',');
        headerInfo = headerInfo.join(',');
        let param = {
          "accnNo": _this.props.customerCode,
          "accnType": accountType,
          beginDate: tjDateType === 2 ? moment(tjDate[0]).format('YYYYMM') : moment(tjDate[0]).format('YYYYMMDD'),
          endDate: tjDateType === 2 ? moment(tjDate[1]).format('YYYYMM') : moment(tjDate[1]).format('YYYYMMDD'),
          "sort": "",
          "statisTm": tjDateType,
        };
        let QueryAssetPlanMonthListModel = param;
        let QueryAccountAnalysisListInfoModel = param;
        let QueryAccountAnalysisSum = param;
        if (![1, 2, 3].includes(indexType)) {
          QueryAccountAnalysisListInfoModel = { ...param, planType: indexType };
          QueryAccountAnalysisSum = { ...param, planType: indexType };
        }
        let exportPayload;
        if ([1, 2].includes(indexType)) {
          exportPayload = JSON.stringify({
            tableHeaderCodes,
            headerInfo,
            QueryAssetPlanMonthListModel,
          });
        } else {
          if (fetchType === 0) {
            exportPayload = JSON.stringify({
              tableHeaderCodes,
              headerInfo,
              QueryAccountAnalysisListInfoModel,
            });
          } else {
            exportPayload = JSON.stringify({
              tableHeaderCodes,
              headerInfo,
              QueryAccountAnalysisSum,
            });
          }
        }

        const form1 = document.createElement('form');
        form1.id = 'form1';
        form1.name = 'form1';
        // 添加到 body 中
        document.getElementById('m_iframe').appendChild(form1);
        // 创建一个输入
        const input = document.createElement('input');
        // 设置相应参数
        input.type = 'text';
        input.name = 'exportPayload';
        input.value = exportPayload;

        // 将该输入框插入到 form 中
        form1.appendChild(input);

        // form 的提交方式
        form1.method = 'POST';
        // form 提交路径
        form1.action = action;

        // 对该 form 执行提交
        form1.submit();
        // 删除该 form
        document.getElementById('m_iframe').removeChild(form1);

        if (total >= 10000000 && typeof EventSource !== 'undefined') {
          // if (typeof EventSource !== 'undefined') {
          if (!_this.timers) {
            _this.timers = [];
          }
          // 浏览器支持 Server-Sent
          const timer1 = setTimeout(() => {
            _this.setState({ modalVisible: true, percent: 0 });
            const source = new EventSource(`${exportPercentUtl}?uuid=${uuid}`);
            let eventSourcesIndex = 0;
            // 成功与服务器发生连接时触发
            source.onopen = () => {
              if (!_this.eventSources) {
                _this.eventSources = [];
              }
              eventSourcesIndex = _this.eventSources.legnth;
              _this.eventSources.push(source);
            };
            source.onmessage = (event) => {
              const { data: percent = 0 } = event;
              if (percent === '100') {
                source.close();
                if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
                const timer2 = setTimeout(() => {
                  _this.setState({ modalVisible: false, percent: 0 });
                  if (_this.timers && _this.timers.length > 0) {
                    const index = _this.timers.findIndex(timer => timer === timer2);
                    if (index >= 0) {
                      _this.timers.splice(index, 1);
                    }
                  }
                }, 1000);
                _this.timers.push(timer2);
              }
              // handle message
              _this.setState({ percent });
            };
            source.onerror = () => {
              source.close();
              if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
              const timer3 = setTimeout(() => {
                _this.setState({ modalVisible: false, percent: 0 });
                if (_this.timers && _this.timers.length > 0) {
                  const index = _this.timers.findIndex(timer => timer === timer3);
                  if (index >= 0) {
                    _this.timers.splice(index, 1);
                  }
                }
              }, 1000);
              _this.timers.push(timer3);
            };
          }, 500);
          _this.timers.push(timer1);
        } else {
          // 浏览器不支持 Server-Sent..
        }
      },
    });
  }
  render() {
    const { accountData, accountType, tjDateType, mode, tjDate, visible, dataSource, current, pageSize, total, open, dateType, chartType, switchKey, checkedList, indexList, isLineShow, indexData, customIndex, loading, stackData, listTotal, fetchType, indexType } = this.state;
    let newIndexType = this.newState.indexType;
    const columns = this.getColumns() || [];
    dataSource.forEach((item, index) => {
      item['key'] = ((current - 1) * pageSize) + index + 1;
    });
    const tableProps = {
      rowKey: 'key',
      dataSource: dataSource,
      // scroll: { x: 1790 },
      columns,
      pagination: false,
      handlePagerSizeChange: this.handlePagerSizeChange,
      handlePagerChange: this.handlePagerChange,
      loading,
    };
    const paginationProps = {
      size: 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      onChange: this.handlePagerChange,
      onShowSizeChange: this.handlePagerSizeChange,
      total,
      pageSize,
      current,
    };
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    return (
      <div style={{ marginTop: 155 }}>
        <div className={styles.searchBox} style={{ paddingBottom: 0 }}>
          <div>
            <span className={styles.label}>账户类型</span>
            {
              accountData.map(item =>
                <Button key={item.ibm} className={`${styles.button} ${accountType === item.ibm ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(item.ibm)} style={{ display: indexType === 2 && [3, 5].includes(item.ibm) ? 'none' : 'inline-block' }}>{item.note}</Button>
              )
            }

            {/* <Button className={`${styles.button} ${accountType === 0 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(0)}>全部</Button>
            <Button className={`${styles.button} ${accountType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1)}>普通</Button>
            <Button className={`${styles.button} ${accountType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2)}>信用</Button>
            <Button className={`${styles.button} ${accountType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3)}>理财</Button>
            <Button style={{ display: indexType === 2 ? 'none' : 'inline-block' }} className={`${styles.button} ${accountType === 4 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(4)}>期权</Button>
            <Button style={{ display: indexType === 2 ? 'none' : 'inline-block' }} className={`${styles.button} ${accountType === 5 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(5)}>基金投顾</Button> */}
          </div>
          <div>
            <span className={styles.label}>指标方案
              <Popover content={<div style={{ color: '#1A2243', padding: '12px 8px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 9 }}>方案说明</div>
                <div style={{ marginBottom: '20px' }}>资产方案：对客户各账户资产指标的展示，包括总资产、净资产、资产<br></br>净流入、资产峰值、资金余额、各账户具体业务类型的资产指标(如股票<br></br>市值、货币基金市值、场外基金市值、债券市值等)。 </div>
                <div style={{ marginBottom: '20px' }}>贡献方案：对客户各账户贡献指标的展示，包括总贡献、净佣金收入、<br></br>利差、息费收入、各账户具体业务类型的贡献指标(如股票佣金收入、资<br></br>管产品手续费、投顾产品服务费等)。 </div>
                <div> 账户分析：对客户账户进行多维度汇总及明细分析，包括期末总资产、<br></br>期末净资产、日均净资产、资产净流入、交易量、总贡献、交易笔数、<br></br>总佣金。</div>
              </div>} title={null} placement="bottom">
                <img style={{ width: 15, marginTop: -2, marginLeft: 2 }} src={questionMark} alt='' />
              </Popover>
            </span>
            <Button className={`${styles.button} ${indexType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleIndexType(1)}>资产方案</Button>
            <Button className={`${styles.button} ${indexType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleIndexType(2)}>贡献方案</Button>
            <Button className={`${styles.button} ${indexType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleIndexType(3)}>账户分析</Button>
            {
              customIndex.map(item => <Button key={item.id} style={{ position: 'relative' }} className={`${styles.button} ${indexType === item.id ? styles.activeBtn : ''}`} onClick={() => this.handleIndexType(item.id)}>{item?.planName}<img onClick={() => this.deleteIndex(item.id)} src={delete_icon} style={{ position: 'absolute', width: 12, top: -5 }} alt='' /></Button>)
            }
            <span onClick={() => this.addIndex()} style={{ background: ' #EFF1F5', borderRadius: '2px', padding: '5px 6px', color: '#244FFF', cursor: 'pointer' }}><Icon type="plus" style={{ marginRight: 3 }} />指标方案</span>
          </div>
          {
            ![1, 2].includes(indexType) && (
              <div>
                <span className={styles.label}>查询方式</span>
                <Button className={`${styles.button} ${fetchType === 0 ? styles.activeBtn : ''}`} onClick={() => this.setState({ fetchType: 0 })}>明细</Button>
                <Button className={`${styles.button} ${fetchType === 1 ? styles.activeBtn : ''}`} onClick={() => this.setState({ fetchType: 1 })}>汇总</Button>
              </div>
            )
          }


        </div>
        <div className={styles.searchBox} style={{ paddingTop: 0 }}>
          <div style={{ position: 'relative' }}>
            <span className={styles.label}>统计时间</span>
            <Button className={`${styles.button} ${tjDateType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleTjDateType(2)}>按月</Button>
            <Button className={`${styles.button} ${tjDateType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleTjDateType(1)}>按日</Button>
            <div onClick={(e) => { if (!open) { this.setState({ open: !open }); }; e.stopPropagation(); }} id='rangePicker'>
              <DatePicker.RangePicker
                mode={mode}
                allowClear={false}
                value={tjDate}
                open={true}
                popupStyle={{ display: open ? 'block' : 'none', zIndex: open ? 2 : -1 }}
                className={styles.rangePicker}
                dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                style={{ width: '264px' }}
                placeholder={['开始日期', '结束日期']}
                format={tjDateType === 2 ? "YYYY-MM" : "YYYY-MM-DD"}
                separator='至'
                disabledDate={(current) => current && current > moment().endOf('day')}
                getCalendarContainer={(trigger) => trigger.parentNode}
                onChange={tjDate => {
                  this.setState({ tjDate, dateType: undefined });
                }}
                onPanelChange={this.handlePanelChange}
              // onOpenChange={(open) => this.setState({ open })}
              />
            </div>
            {open && (
              <div className={styles.calendarBox}>
                <div onClick={() => this.setDate(1)} style={{ background: dateType === 1 ? '#F0F1F5' : '' }}>本年</div>
                <div onClick={() => this.setDate(2)} style={{ background: dateType === 2 ? '#F0F1F5' : '' }}>本月</div>
                <div onClick={() => this.setDate(3)} style={{ background: dateType === 3 ? '#F0F1F5' : '' }}>近一年</div>
                <div onClick={() => this.setDate(4)} style={{ background: dateType === 4 ? '#F0F1F5' : '' }}>近半年</div>
                <div onClick={() => this.setDate(5)} style={{ background: dateType === 5 ? '#F0F1F5' : '' }}>本季度</div>
                <div onClick={() => this.setDate(6)} style={{ background: dateType === 6 ? '#F0F1F5' : '' }}>上季度</div>
                <div onClick={() => this.setDate(7)} style={{ background: dateType === 7 ? '#F0F1F5' : '' }}>开户以来</div>
              </div>
            )}
          </div>
          <div>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={this.fetchData}>查询</Button>
          </div>
        </div>
        <Spin spinning={this.state.fetchLoading}>
          {
            [1, 2].includes(newIndexType) && (
              <>
                {
                  this.newState.accountType !== 5 && (
                    <div className={styles.chartBox}>
                      <div style={{ fontSize: 16, color: ' #1A2243', fontWeight: 500 }}>{this.newState.indexType === 1 ? '资产概况' : '贡献概况'}</div>
                      <Divider style={{ margin: '16px 0' }}></Divider>
                      <div className={styles.echartBox}>

                        <div className={styles.pieChart} style={{ display: this.state.showPie ? 'block' : 'none' }}>
                          {
                            this.state.pieData instanceof Object && !this.state.showDefaultImg ? (
                              <div id='pieChart' className={styles.pieChart}></div>
                            ) : <Empty image={defaultImg} description='暂无数据' style={{ height: '400px', paddingTop: '120px' }} />
                          }
                        </div>



                        <div className={styles.barChart} style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', left: 120, pointerEvents: 'auto', zIndex: 1, display: isLineShow === 2 && this.state.barData.length > 0 ? 'block' : 'none' }}>
                            <span className={styles.cutBtn} onClick={() => {
                              this.setState({ chartType: 1 }, () => {
                                let myChart = echarts.init(document.getElementById('barChart'));
                                myChart.dispose();
                                this.initBarChart();
                              });
                            }} style={{ color: chartType === 1 ? '#244FFF' : '', borderColor: chartType === 1 ? '#244FFF' : '', borderRadius: 1 }}><img style={{ height: 17, width: 17 }} src={iconCheck} alt='' />柱形图</span>
                            <span className={styles.cutBtn} onClick={() => {
                              this.setState({ chartType: 2 }, () => {
                                clickSensors('趋势图切换按钮');
                                let myChart = echarts.init(document.getElementById('lineChart'));
                                myChart.dispose();
                                this.initLineChart();
                              });
                            }} style={{ color: chartType === 2 ? '#244FFF' : '', borderColor: chartType === 2 ? '#244FFF' : '', borderRadius: 1 }}><img style={{ height: 17, width: 17 }} src={iconLineBar} alt='' />趋势图</span>
                          </div>
                          {
                            this.state.barData.length > 0 ? (
                              <>
                                <div id='barChart' className={styles.barChart} style={{ display: chartType === 1 && isLineShow === 2 ? 'block' : 'none' }}></div>
                                <div id='lineChart' className={styles.barChart} style={{ display: chartType === 2 || isLineShow === 1 ? 'block' : 'none' }}></div>
                              </>
                            ) : <Empty image={defaultImg} description='暂无数据' style={{ height: '400px', paddingTop: '120px' }} />
                          }
                        </div>
                      </div>
                    </div>
                  )
                }

                <div className={styles.list}>
                  <div className={styles.listTitle}>
                    <div style={{ fontSize: 16, color: ' #1A2243', fontWeight: 500 }}>{this.newState.indexType === 1 ? '资产明细' : '贡献明细'}</div>
                    <Button style={{ width: 88, height: 30 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>
                  </div>
                  <Divider style={{ margin: '0 0 16px 0' }}></Divider>
                  <BasicDataTable {...tableProps} style={{ marginBottom: '10px' }} className={`${styles.table}`} />
                  <Pagination {...paginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />
                </div>
              </>
            )}
          {
            newIndexType === 3 && this.newState.accountType !== 5 && (
              <div className={styles.chartList}>
                <div className={styles.listTitle}>
                  <div style={{ fontSize: 16, color: ' #1A2243', fontWeight: 500 }}>账户分析</div>
                  {
                    stackData.length !== 0 && (
                      <div className={styles.titleBtn}>
                        <div onClick={this.exportChart} className={styles.exportBtn} style={{ display: switchKey ? 'block' : 'none' }}><Icon type="upload" width='16px' style={{ marginRight: 2 }} />导出PDF</div>
                        <div><div style={{ marginRight: 8 }}>图表分析</div><Switch onChange={this.changeSwitch} checked={switchKey} /></div>
                      </div>
                    )
                  }
                </div>
                <Divider style={{ margin: '0 0 16px 0' }}></Divider>
                {
                  switchKey && stackData.length !== 0 && (
                    <div className={styles.chartBox} >
                      <div className={styles.stackLine}>
                        <div id='stackLine' className={styles.stackLine}></div>
                      </div>
                      <div className={styles.checkBox}>
                        <div>
                          <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: ' #1A2243', fontWeight: 500 }}>指标选择</div>
                            <div style={{ color: ' #244FFF', cursor: 'pointer' }} onClick={this.resetIndex}>重置</div>
                          </div>
                          <Divider style={{ margin: '0 0 16px 0' }}></Divider>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {Object.keys(stackData[0] || {}).filter(item => item !== '日期' && item !== '月份').map((item, index) => { if (index % 2 === 0) return <Checkbox checked={indexList.includes(item)} key={index} value={item} onChange={this.setIndexList}>{item}</Checkbox>; })}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {Object.keys(stackData[0] || {}).filter(item => item !== '日期' && item !== '月份').map((item, index) => { if (index % 2 !== 0) return <Checkbox checked={indexList.includes(item)} key={index} value={item} onChange={this.setIndexList}>{item}</Checkbox>; })}
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  stackData.length !== 0 && (
                    <div className={styles.listBox}>
                      <div style={{ marginTop: 12, padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#1A2243', fontWeight: 500 }}>{customIndex.filter(item => item.id === newIndexType)[0]?.planName}</span>
                        <Button style={{ width: 88, height: 30 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>
                      </div>
                      <BasicDataTable {...tableProps} style={{ marginBottom: '10px' }} className={`${styles.table}`} />
                      <Pagination {...paginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />
                    </div>
                  )
                }
                {
                  stackData.length === 0 && <Empty image={defaultImg} description='暂无数据' style={{ height: '400px', paddingTop: '120px' }} />
                }
              </div>
            )
          }
          {
            (![1, 2, 3].includes(newIndexType) || (newIndexType === 3 && this.newState.accountType === 5)) && (
              <div style={{ background: '#FFF', padding: '0 16px' }}>
                <div style={{ marginTop: 12, padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#1A2243', fontWeight: 500 }}>{customIndex.filter(item => item.id === newIndexType)[0]?.planName}</span>
                  <Button style={{ width: 88, height: 30 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>
                </div>
                <Divider style={{ margin: '0 0 16px 0' }}></Divider>
                <BasicDataTable {...tableProps} style={{ marginBottom: '10px' }} className={`${styles.table}`} />
                <Pagination {...paginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />
              </div>
            )
          }
        </Spin>

        <div style={{ height: 70, backgroundColor: '#F2F3F7' }}></div>
        <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
        <Modal
          title="系统处理中,请稍候..."
          centered
          destroyOnClose
          closable={false}
          maskClosable={false}
          visible={this.state.modalVisible}
          footer={null}
        >
          <Row>
            <Col span={2}>进度:</Col>
            <Col span={22}><Progress percent={parseInt(this.state.percent, 10)} status={this.state.percent === '100' ? 'success' : 'active'} /></Col>
          </Row>
        </Modal>
        <Modal
          title="新增指标方案"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className={styles.addModal}
          width='1000px'
          centered
          destroyOnClose={true}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button className={styles.cancelBtn} onClick={this.handleCancel}>取消</Button>
              <Button onClick={this.handleSubmit} className={styles.submitBtn} >保存</Button>
            </div>
          }
        >
          <Spin spinning={this.state.modalLoading}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item label='方案名称  ' className={styles.formItem} colon={false}>
                {getFieldDecorator('projNm', {
                  rules: [{ required: true, message: '请填写方案名称' }],
                })(
                  <Input style={{ width: 250 }} autoComplete='off' />
                )}
              </Form.Item>
              <Form.Item label={<div style={{ paddingRight: 10 }}><span style={{ color: '#f5222d', fontFamily: 'SimSun, sans-serif', marginRight: 4 }}>*</span>指标方案</div>} className={styles.formItem} colon={false}>
                {getFieldDecorator('indexSelc', {
                  rules: [],
                })(
                  <div>
                    <div>
                      <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                      // style={{ marginBottom: 6 }}
                      >
                        全选
                      </Checkbox>
                    </div>
                    <CheckboxGroup
                      options={indexData}
                      value={this.state.checkedList}
                      onChange={this.onChange}
                    />
                  </div>
                )}
              </Form.Item>
            </Form>
          </Spin>

        </Modal>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(AssetsPage));
