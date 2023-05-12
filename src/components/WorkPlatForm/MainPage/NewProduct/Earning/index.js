import React, { Component } from 'react';
import { Button, Col, DatePicker, Icon, message, Row, Select, Spin } from 'antd';
// import { DatePicker as DatePicker4 } from 'antd-4';
// import 'antd-4/dist/antd.less';
// import locale from 'antd-4/es/date-picker/locale/zh_CN';
import moment from 'moment';
import lodash from 'lodash';
import DateEarning from './DateEarning';
import OtherEarning from './OtherEanring';
import DataTable from './DataTable';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import DatePickerPanel from './Common/DatePickerPanel';
import { formatColor, formatNum, formatDw, viewSensors, clickSensors } from './util';
import { FindHomePage, Findstocks, Findfinancials, Nationaldebtdetail, FindOtherDetails, FindDetailed, FindCalenderList, OptionFindHomePageList, OptionFindHomePage, OptionFindCalenderList, OptionFindDetailed, FindAvailableAccount, Updateday } from '$services/newProduct/customerPortrait';
import arrow_down_black from '$assets/newProduct/earing/arrow_down_black.png';
import arrow_down_blue from '$assets/newProduct/earing/arrow_down_blue.png';
import arrow_up_blue from '$assets/newProduct/earing/arrow_up_blue.png';
//import emptyImg from '$assets/newProduct/customerPortrait/缺省图.png';
import emptyImg from '$assets/newProduct/customerPortrait/defaultGraph.png';
import styles from './index.less';

class Earning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [], // 账户
      account: 1, // 账户类别
      earning: 1, // 收益周期
      beginTime: moment().startOf('year'),
      endTime: moment().subtract(1, 'days'),
      date: moment(), // 日历组件时间
      visible: false, // 收益周期自定义时浮层显隐状态
      loginAccount: props.customerCode || '', // 客户号
      homeData: {}, // 账单首页接口数据
      stocksData: {}, // 账单区间内股票数据
      financialsData: {}, // 账单区间内理财数据
      nationaldebtData: {}, // 账单区间内国债数据
      optionData: [], // 期权列表数据
      otherData: {}, // 账单区间内其他数据
      incomeData: {}, // 日历账单数据
      earningDateData: {}, // 有收益的日期数据
      datePickerVisible: false, // 日收益日历显隐状态
      rangePickerDate: [moment().subtract(1, 'days').subtract(1, 'years'), moment().subtract(1, 'days')], // rangePicker显示日期
      hasEarning: false, // 是否有收益数据
      loading: false,
      tableLoading: false,
      latestDate: moment(), // 最新日期
      updateDay: moment(), // 账单最新更新日期
      showDate: [moment().startOf('year'), moment().endOf('year')],
      yearVisible: false, // 年周期选择浮层显隐
    };
    this.earning = null; // 子图表组件实例
    this.dataTable = null; // 子表格组件实例
    this.yearSelectRef = null; // 年周期选择组件ref
    this.pickerRef = null;
  }

  componentDidMount() {
    const { loginAccount } = this.state;
    Promise.all([FindAvailableAccount({ loginAccount }), Updateday()]).then(response => {
      const [res1, res2] = response;
      const { records = [] } = res1;
      let result = [];
      records.forEach(item => {
        if (item.Name.indexOf('普通') > -1) {
          result.push({ ibm: 1, note: '普通账户' });
        } else if (item.Name.indexOf('信用') > -1) {
          result.push({ ibm: 2, note: '信用账户' });
        } else if (item.Name.indexOf('期权') > -1) {
          result.push({ ibm: 3, note: '期权账户' });
        }
      });
      if (!result.length) message.warning('无账户');
      const { records: records2 = moment().format('YYYYMMDD') } = res2;
      const updateDay = moment(records2);
      this.setState({ accounts: result.sort((a, b) => a.ibm - b.ibm), updateDay, beginTime: updateDay.clone().startOf('year'), endTime: updateDay, rangePickerDate: [updateDay.clone().subtract(1, 'years'), updateDay] }, () => {
        this.findHomePage().then(() => {
          this.earning?.initChartOne();
          this.earning?.initChartTwo();
        });
        this.getData();
        this.findCalenderList();
        viewSensors(this.state.account === 1 ? '普通账户' : this.state.account === 2 ? '信用账户' : '期权账户');
      });
    });
    let value1 = this.state.date.clone();
    while(value1.format('YYYY').substring(3) !== '0') {
      value1.subtract(1, 'years');
    }
    let value2 = this.state.date.clone();
    while(value2.format('YYYY').substring(3) !== '9') {
      value2.add(1, 'years');
    }
    this.setState({ showDate: [value1, value2] });
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.beginTime.isSame(this.state.beginTime, 'day') || !prevState.endTime.isSame(this.state.endTime, 'day')) {
      this.findHomePage().then(() => {
        this.earning?.initChartOne();
        this.earning?.initChartTwo();
      });
      this.getData();
    }
    if (prevState.account !== this.state.account) {
      viewSensors(this.state.account === 1 ? '普通账户' : this.state.account === 2 ? '信用账户' : '期权账户');
    }
    if (prevState.date.format('YYYY').substring(2, 3) !== this.state.date.format('YYYY').substring(2, 3)) {
      let value1 = this.state.date.clone();
      while(value1.format('YYYY').substring(3) !== '0') {
        value1.subtract(1, 'years');
      }
      let value2 = this.state.date.clone();
      while(value2.format('YYYY').substring(3) !== '9') {
        value2.add(1, 'years');
      }
      this.setState({ showDate: [value1, value2] });
    }
  }

  func = (records) => {
    if (lodash.get(records, 'years', []).length) {
      this.setState({ hasEarning: true });
      if (this.state.earning === 1) {
        if (this.state.beginTime.isSame(moment(records.years.sort((a, b) => b - a)[0]).startOf('year'), 'day') && this.state.endTime.isSame(moment(records.years.sort((a, b) => b - a)[0]).endOf('year'), 'day')) {
          this.findHomePage().then(() => {
            this.earning?.initChartOne();
            this.earning?.initChartTwo();
          });
          this.getData();
        } else {
          this.setState({
            date: moment(records.years.sort((a, b) => b - a)[0]).startOf('year'),
            beginTime: moment(records.years.sort((a, b) => b - a)[0]).startOf('year'),
            endTime: moment(records.years.sort((a, b) => b - a)[0]).endOf('year'),
          });
        }
      } else if (this.state.earning === 2) {
        const beginTime = moment(`${records.years.sort((a, b) => b - a)[0]}-${records.months.find(item => item.year === records.years.sort((a, b) => b - a)[0]).months.sort((a, b) => b - a)[0]}`).startOf('month');
        const endTime = moment(`${records.years.sort((a, b) => b - a)[0]}-${records.months.find(item => item.year === records.years.sort((a, b) => b - a)[0]).months.sort((a, b) => b - a)[0]}`).endOf('month');
        if (this.state.beginTime.isSame(beginTime, 'day') && this.state.endTime.isSame(endTime, 'day')) {
          this.findHomePage().then(() => {
            this.earning?.initChartOne();
            this.earning?.initChartTwo();
          });
          this.getData();
        } else {
          this.setState({
            date: beginTime,
            beginTime,
            endTime,
          });
        }
      } else if (this.state.earning === 3) {
        this.setState({ loading: true });
        const month = moment(`${records.years.sort((a, b) => b - a)[0]}-${records.months.find(item => item.year === records.years.sort((a, b) => b - a)[0]).months.sort((a, b) => b - a)[0]}`);
        const params = {
          loginAccount: this.state.loginAccount,
          accountType: `${this.state.account - 1}`,
          beginDate: month.clone().startOf('month').format('YYYYMMDD'),
          endDate: month.clone().endOf('month').format('YYYYMMDD'),
        };
        if (moment(params.endDate) > this.state.updateDay) params.endDate = this.state.updateDay.format('YYYYMMDD');
        if (moment(params.beginDate) > this.state.updateDay) params.beginDate = this.state.updateDay.format('YYYYMMDD');
        if (params.accountType === '2') {
          OptionFindDetailed(params).then(res => {
            const { records = {} } = res;
            let { profitList = [] } = records;
            profitList.sort((a, b) => b.date - a.date);
            this.setState({ incomeData: records });
            if (this.state.beginTime.isSame(moment(profitList[0].date), 'day') && this.state.endTime.isSame(moment(profitList[0].date), 'day')) {
              this.findHomePage().then(() => {
                this.earning?.initChartOne();
                this.earning?.initChartTwo();
              });
              this.getData();
            } else {
              this.setState({
                latestDate: moment(profitList[0].date),
                date: moment(profitList[0].date),
                beginTime: moment(profitList[0].date),
                endTime: moment(profitList[0].date),
              });
            }
            return res;
          }).catch(error => message.error(error.note || error.message)).finally(() => this.setState({ loading: false }));
        } else {
          FindDetailed(params).then(res => {
            const { records = {} } = res;
            let { profitList = [] } = records;
            profitList.sort((a, b) => b.date - a.date);
            this.setState({ incomeData: records });
            if (this.state.beginTime.isSame(moment(profitList[0].date), 'day') && this.state.endTime.isSame(moment(profitList[0].date), 'day')) {
              this.findHomePage().then(() => {
                this.earning?.initChartOne();
                this.earning?.initChartTwo();
              });
              this.getData();
            } else {
              this.setState({
                latestDate: moment(profitList[0].date),
                date: moment(profitList[0].date),
                beginTime: moment(profitList[0].date),
                endTime: moment(profitList[0].date),
              });
            }
            return res;
          }).catch(error => message.error(error.note || error.message)).finally(() => this.setState({ loading: false }));
        }
      } else if (this.state.earning === 4) {
        this.findHomePage().then(() => {
          this.earning?.initChartOne();
          this.earning?.initChartTwo();
        });
        this.getData();
      }
    } else {
      // message.warning('无收益数据');
      this.setState({ hasEarning: false });
    }
  };

  findCalenderList = async (payload = {}) => {
    this.setState({ loading: true });
    const params = {
      loginAccount: this.state.loginAccount,
      accountType: payload.accountType || `${this.state.account - 1}`,
    };
    const params2 = {
      loginAccount: this.state.loginAccount,
      accountType: payload.accountType || `${this.state.account - 1}`,
      beginDate: moment().startOf('month').format('YYYYMMDD'),
      endDate: this.state.updateDay.format('YYYYMMDD'),
    };
    if (moment(params2.beginDate) > this.state.updateDay) params2.beginDate = this.state.updateDay.format('YYYYMMDD');
    let res, res2;
    if (params.accountType === '2') {
      res = await OptionFindCalenderList(params);
      res2 = await OptionFindDetailed(params2);
    } else {
      res = await FindCalenderList(params);
      res2 = await FindDetailed(params2);
    }
    let { records = {} } = res;
    let { months = [] } = records;
    const profitList = lodash.get(res2, 'records.profitList', []);
    if (profitList.length) {
      if (months.find(item => item.year === this.state.updateDay.format('YYYY'))) {
        const i = months.findIndex(item => item.year === this.state.updateDay.format('YYYY'));
        if (!months[i].months.includes(this.state.updateDay.format('MM'))) {
          months[i].months.push(this.state.updateDay.format('MM'));
          records.months = months;
        }
      } else {
        months = [...months, { months: [this.state.updateDay.format('MM')], year: this.state.updateDay.format('YYYY') }];
        records.months = months;
      }
    }
    let years = [];
    months.forEach(item => {
      years.push(item.year);
    });
    records['years'] = years;
    this.setState({ earningDateData: records, loading: false });
    this.func(records);
  }

  getData = (activeKey = this.dataTable?.state?.activeKey, activeSubKey = this.dataTable?.state?.activeSubKey) => {
    const func = () => {
      let total = 0;
      if (activeKey === 1) {
        return this.findstocks({ pagination: { current: this.dataTable?.state?.current, pageSize: this.dataTable?.state?.pageSize } }).then(res => {
          total = lodash.get(res, 'records.profitList.positionStockList', []).concat(lodash.get(res, 'records.lossList.positionStockList', [])).length;
          this.dataTable?.setState({ total });
          return total;
        });
      } else if (activeKey === 2) {
        return this.findfinancials({ pagination: { current: this.dataTable?.state?.current, pageSize: this.dataTable?.state?.pageSize } }).then(res => {
          if (activeSubKey === 1) {
            total = lodash.get(res, 'records.fundPositionList', []).length;
          } else if (activeSubKey === 2) {
            total = lodash.get(res, 'records.lcPosiList', []).length;
          }
          this.dataTable?.setState({ total });
          return total;
        });;
      } else if (activeKey === 3) {
        if (this.state.account === 3) {
          return this.optionFindHomePageList({ pagination: { current: this.dataTable?.state.current, pageSize: this.dataTable?.state.pageSize } }).then(res => {
            total = lodash.get(res, 'total', 0);
            this.dataTable?.setState({ total });
            return total;
          });
        }
        return this.nationaldebtdetail({ pagination: { current: this.dataTable?.state.current, pageSize: this.dataTable?.state.pageSize } }).then(res => {
          total = lodash.get(res, 'records.debtList', []).length;
          this.dataTable?.setState({ total });
          return total;
        });;
      } else if (activeKey === 4) {
        return this.findOtherDetails({ pagination: { current: this.dataTable?.state.current, pageSize: this.dataTable?.state.pageSize } }).then(res => {
          total = lodash.get(res, 'records.detail', []).length;
          this.dataTable?.setState({ total });
          return total;
        });;
      }
    };
    return func()?.then(res => {
      this.dataTable?.getDataSource();
      return res;
    });
  }

  findHomePage = (payload = {}) => {
    this.setState({ loading: true });
    const params = {
      loginAccount: this.state.loginAccount,
      accountType: payload.accountType || `${this.state.account - 1}`,
      dateType: payload.dateType || this.computed('dateType'),
      beginDate: payload.beginDate || this.state.beginTime.format('YYYYMMDD'),
      endDate: payload.endDate || this.state.endTime.format('YYYYMMDD'),
    };
    if (moment(params.endDate) > this.state.updateDay) params.endDate = this.state.updateDay.format('YYYYMMDD');
    if (moment(params.beginDate) > this.state.updateDay) params.beginDate = this.state.updateDay.format('YYYYMMDD');
    if (this.state.account === 3) {
      return OptionFindHomePage(params).then(response => {
        // if (response.records === undefined) message.warning(`无${this.state.account === 1 ? '普通账户' : this.state.account === 2 ? '信用账户' : '期权账户'}`);
        const { records = [] } = response;
        this.setState({ homeData: records });
        return response;
      }).catch(error => {
        message.error(error.note || error.message);
      }).finally(() => this.setState({ loading: false }));
    } else {
      return FindHomePage(params).then(response => {
        // if (response.records === undefined) message.warning(`无${this.state.account === 1 ? '普通账户' : this.state.account === 2 ? '信用账户' : '期权账户'}`);
        const { records = [] } = response;
        this.setState({ homeData: records });
        return response;
      }).catch(error => {
        message.error(error.note || error.message);
      }).finally(() => this.setState({ loading: false }));
    }
  }

  findstocks = (payload = {}) => {
    this.setState({ tableLoading: true });
    // const { pagination = {} } = payload;
    const params = {
      loginAccount: this.state.loginAccount,
      accountType: payload.accountType || `${this.state.account - 1}`,
      beginDate: payload.beginDate || this.state.beginTime.format('YYYYMMDD'),
      endDate: payload.endDate || this.state.endTime.format('YYYYMMDD'),
      // paging: 1,
      // total: 0,
      // ...pagination,
    };
    if (moment(params.endDate) > this.state.updateDay) params.endDate = this.state.updateDay.format('YYYYMMDD');
    if (moment(params.beginDate) > this.state.updateDay) params.beginDate = this.state.updateDay.format('YYYYMMDD');
    if (params.accountType === '2') {
      this.setState({ stocksData: {} });
      return Promise.resolve({}).finally(() => this.setState({ tableLoading: false }));
    }
    return Findstocks(params).then(response => {
      const { records = [] } = response;
      this.setState({ stocksData: records });
      return response;
    }).catch(error => {
      message.error(error.note || error.message);
    }).finally(() => this.setState({ tableLoading: false }));
  }

  findfinancials = (payload = {}) => {
    this.setState({ tableLoading: true });
    // const { pagination = {} } = payload;
    const params = {
      loginAccount: this.state.loginAccount,
      accountType: payload.accountType || `${this.state.account - 1}`,
      beginDate: payload.beginDate || this.state.beginTime.format('YYYYMMDD'),
      endDate: payload.endDate || this.state.endTime.format('YYYYMMDD'),
      // paging: 1,
      // total: 0,
      // ...pagination,
    };
    if (moment(params.endDate) > this.state.updateDay) params.endDate = this.state.updateDay.format('YYYYMMDD');
    if (moment(params.beginDate) > this.state.updateDay) params.beginDate = this.state.updateDay.format('YYYYMMDD');
    if (params.accountType === '2') {
      this.setState({ financialsData: {} });
      return Promise.resolve({}).finally(() => this.setState({ tableLoading: false }));
    }
    return Findfinancials(params).then(response => {
      const { records = [] } = response;
      this.setState({ financialsData: records });
      return response;
    }).catch(error => {
      message.error(error.note || error.message);
    }).finally(() => this.setState({ tableLoading: false }));
  }

  nationaldebtdetail = (payload = {}) => {
    this.setState({ tableLoading: true });
    // const { pagination = {} } = payload;
    const params = {
      loginAccount: this.state.loginAccount,
      accountType: payload.accountType || `${this.state.account - 1}`,
      beginDate: payload.beginDate || this.state.beginTime.format('YYYYMMDD'),
      endDate: payload.endDate || this.state.endTime.format('YYYYMMDD'),
      pageNo: '1',
      // paging: 1,
      // total: 0,
      // ...pagination,
    };
    if (params.accountType === '2') {
      this.setState({ nationaldebtData: {} });
      return Promise.resolve({}).finally(() => this.setState({ tableLoading: false }));
    }
    if (moment(params.endDate) > this.state.updateDay) params.endDate = this.state.updateDay.format('YYYYMMDD');
    if (moment(params.beginDate) > this.state.updateDay) params.beginDate = this.state.updateDay.format('YYYYMMDD');
    return Nationaldebtdetail(params).then(response => {
      const { records = [] } = response;
      this.setState({ nationaldebtData: records });
      return response;
    }).catch(error => {
      message.error(error.note || error.message);
    }).finally(() => this.setState({ tableLoading: false }));
  }

  findOtherDetails = (payload = {}) => {
    this.setState({ tableLoading: true });
    // const { pagination = {} } = payload;
    const params = {
      loginAccount: this.state.loginAccount,
      accountType: payload.accountType || `${this.state.account - 1}`,
      beginDate: payload.beginDate || this.state.beginTime.format('YYYYMMDD'),
      endDate: payload.endDate || this.state.endTime.format('YYYYMMDD'),
      // paging: 1,
      // total: 0,
      // ...pagination,
    };
    if (params.accountType === '2') {
      this.setState({ otherData: {} });
      return Promise.resolve({}).finally(() => this.setState({ tableLoading: false }));
    }
    if (moment(params.endDate) > this.state.updateDay) params.endDate = this.state.updateDay.format('YYYYMMDD');
    if (moment(params.beginDate) > this.state.updateDay) params.beginDate = this.state.updateDay.format('YYYYMMDD');
    return FindOtherDetails(params).then(response => {
      const { records = [] } = response;
      this.setState({ otherData: records });
      return response;
    }).catch(error => {
      message.error(error.note || error.message);
    }).finally(() => this.setState({ tableLoading: false }));
  }

  optionFindHomePageList = (payload = {}) => {
    this.setState({ tableLoading: true });
    // const { pagination = {} } = payload;
    const params = {
      loginAccount: this.state.loginAccount,
      // accountType: payload.accountType || `${this.state.account - 1}`, // 期权账户不用传账户类别
      beginDate: payload.beginDate || this.state.beginTime.format('YYYYMMDD'),
      endDate: payload.endDate || this.state.endTime.format('YYYYMMDD'),
      dateType: payload.dateType || this.computed('dateType'),
      // paging: 1,
      // total: 0,
      // ...pagination,
    };
    if (moment(params.endDate) > this.state.updateDay) params.endDate = this.state.updateDay.format('YYYYMMDD');
    if (moment(params.beginDate) > this.state.updateDay) params.beginDate = this.state.updateDay.format('YYYYMMDD');
    return OptionFindHomePageList(params).then(response => {
      const { records } = response;
      this.setState({ optionData: records || lodash.get(response, 'findHomeOageFuturn', []) });
      return response;
    }).catch(error => {
      message.error(error.note || error.message);
    }).finally(() => this.setState({ tableLoading: false }));
  }

  // 点击账户类别
  handleAccountClick = (account) => {
    clickSensors(account === 1 ? '普通账户' : account === 2 ? '信用账户' : '期权账户');
    this.setState({ account });
    this.findCalenderList({ accountType: `${account - 1}` });
  }

  // 点击收益周期
  handleEarningClick = (earning) => {
    const m = {
      "1": "年收益点击次数",
      "2": "月收益点击次数",
      "3": "日收益点击次数",
      "4": "自定义时间点击次数",
    };

    let name = m[earning];
    newClickSensors({
      third_module: "收益",
      ax_button_name: name,
    });
    const { earningDateData } = this.state;
    if (earning === 4) {
      return;
    }
    this.setState({ earning, visible: false }, () => this.func(earningDateData));
  }

  // 计算
  computed = (type, ...rest) => {
    if (type === 'arrowSrc') {
      if (this.state.earning === 4) {
        if (this.state.visible) {
          return arrow_up_blue;
        } else {
          return arrow_down_blue;
        }
      } else {
        return arrow_down_black;
      }
    } else if (type === 'color') {
      const [val] = rest;
      return formatColor(formatNum(val));
    } else if (type === 'specialColor') {
      const [val] = rest;
      if (!Number(val)) return '#B0B5CC';
      return formatColor(formatNum(val));
    } else if (type === 'dateType') {
      if (this.state.earning === 1) {
        if (this.state.date.format('YYYY') === moment().format('YYYY')) {
          return '2';
        } else {
          return '5';
        }
      } else if (this.state.earning === 2) {
        if (this.state.date.format('YYYYMM') === moment().format('YYYYMM')) {
          return '1';
        } else {
          return '6';
        }
      } else if (this.state.earning === 3) {
        return '9';
      } else if (this.state.earning === 4) {
        if (this.state.rangePickerDate[0].isSame(this.state.updateDay.clone().subtract(1, 'months'), 'day') && this.state.rangePickerDate[1].isSame(this.state.updateDay.clone(), 'day')) {
          return '3';
        } else if (this.state.rangePickerDate[0].isSame(this.state.updateDay.clone().subtract(6, 'months'), 'day') && this.state.rangePickerDate[1].isSame(this.state.updateDay.clone(), 'day')) {
          return '7';
        } else if (this.state.rangePickerDate[0].isSame(this.state.updateDay.clone().subtract(1, 'years'), 'day') && this.state.rangePickerDate[1].isSame(this.state.updateDay.clone(), 'day')) {
          return '4';
        }
        return '8';
      }
    } else if (type === 'visibility') {
      const [current, incomeDataList] = rest;
      return incomeDataList.find(item => item.date === current.format('YYYYMMDD')) ? 'visible' : 'hidden';
    }
  }

  // 清空
  handleClear = () => {
    this.setState({
      rangePickerDate: [this.state.updateDay.clone().subtract(1, 'years'), this.state.updateDay.clone()],
    });
  }

  // 确定
  handleOk = () => {
    const { rangePickerDate: dates } = this.state;
    let endTime = moment();
    if (Number(dates[1].format('YYYYMMDD')) > Number(dates[0].clone().add(1, 'years').format('YYYYMMDD'))) {
      endTime = dates[0].clone().add(1, 'years');
      message.warning('查询时间不能超过一年，已为你自动更新时间');
    } else {
      endTime = dates[1];
    }
    this.setState({
      visible: false,
      date: dates[0],
      beginTime: dates[0],
      endTime,
    });
  }

  handleYearPickerChange = (value) => {
    this.setState({
      date: value.clone().startOf('year'),
      beginTime: value.clone().startOf('year'),
      endTime: value.format('YYYY') === moment().format('YYYY') ? this.state.updateDay.clone() : value.clone().endOf('year'),
      yearVisible: false,
    });
  }

  handleMonthPickerChange = (date) => {
    this.setState({
      date: date.clone().startOf('month'),
      beginTime: date.clone().startOf('month'),
      endTime: date.format('YYYYMM') === moment().format('YYYYMM') ? this.state.updateDay.clone() : date.clone().endOf('month'),
    });
  }

  handleDatePickerChange = (date) => {
    this.setState({
      date,
      beginTime: date,
      endTime: date,
    });
  }

  handlePanelChange = (value) => {
    const params = {
      loginAccount: this.state.loginAccount,
      accountType: `${this.state.account - 1}`,
      beginDate: value.clone().startOf('month').format('YYYYMMDD'),
      endDate: value.clone().endOf('month').format('YYYYMMDD'),
    };
    if (moment(params.endDate) > this.state.updateDay) params.endDate = this.state.updateDay.format('YYYYMMDD');
    if (moment(params.beginDate) > this.state.updateDay) params.beginDate = this.state.updateDay.format('YYYYMMDD');
    if (params.accountType === '2') {
      return OptionFindDetailed(params).then(res => {
        const { records = {} } = res;
        this.setState({ incomeData: records });
        return res;
      }).catch(error => message.error(error.note || error.message));
    } else {
      return FindDetailed(params).then(res => {
        const { records = {} } = res;
        this.setState({ incomeData: records });
        return res;
      }).catch(error => message.error(error.note || error.message));
    }
  }

  handleDatePickerOpenChange = (visible) => {
    if (visible) {
      this.handlePanelChange(this.state.date);
    }
  }

  handleRangePickerChange = (dates) => {
    this.setState({ rangePickerDate: dates });
  }

  handleBodyClick = (e) => {
    if (this.state.visible) {
      this.setState({ visible: false });
    }
    if (this.state.yearVisible) {
      this.yearSelectRef.blur();
      this.setState({ yearVisible: false });
    }
  }

  handleSuperPrevClick = () => {
    const { showDate } = this.state;
    const newShowDate = [showDate[0].clone().subtract(10, 'years'), showDate[1].clone().subtract(10, 'years')];
    this.setState({ showDate: newShowDate });
  }

  handleSuperNextClick = () => {
    const { showDate } = this.state;
    const newShowDate = [showDate[0].clone().add(10, 'years'), showDate[1].clone().add(10, 'years')];
    this.setState({ showDate: newShowDate });
  }

  handleClick = (value) => {
    this.handleYearPickerChange(moment(value));
  }

  // 渲染时间周期选择部分
  renderDatePicker = () => {
    const { earning = 1, earningDateData, showDate } = this.state;
    const _this = this;
    if (earning === 1) {
      return (
        <React.Fragment>
          <div style={{ paddingRight: 5 }}>统计周期</div>
          {/* <DatePicker4
            style={{ width: 160, height: 30 }}
            picker='year'
            value={this.state.date}
            allowClear={false}
            format='YYYY年'
            onChange={this.handleYearPickerChange}
            dropdownClassName={`${styles.yearPicker}`}
            disabledDate={current => !lodash.get(earningDateData, 'years', []).includes(current.format('YYYY')) }
          /> */}
          <div onClick={() => this.setState({ yearVisible: true })}>
            <Select
              style={{ width: 160, height: 30 }}
              value={this.state.date.format('YYYY年')}
              className={`${styles.select} ${styles.selectSuffixIcon}`}
              dropdownMatchSelectWidth={false}
              open={this.state.yearVisible}
              ref={el => this.yearSelectRef = el}
              suffixIcon={<Icon type="calendar" style={{ fontSize: 14 }} />}
              dropdownRender={() => (
                <div onClick={e => e.stopPropagation()} style={{ width: 280, color: '#1A2243', fontSize: 14 }}>
                  <Row type='flex' align='middle' justify='space-between' style={{ height: 40, borderBottom: '1px solid #EAEEF2', padding: '0 16px' }}>
                    <Col>
                      <span onClick={this.handleSuperPrevClick} className={`${styles.iconHover}`}><Icon type="double-left" /></span>
                    </Col>
                    <Col style={{ textAlign: 'center' }}>
                      {showDate[0].format('YYYY')}-{showDate[1].format('YYYY')}
                    </Col>
                    <Col>
                      <span onClick={this.handleSuperNextClick} className={`${styles.iconHover}`}><Icon type="double-right" /></span>
                    </Col>
                  </Row>
                  <Row type='flex' style={{ flexWrap: 'wrap', padding: '0 8px' }}>
                    { function() {
                      let arr = [];
                      let current = showDate[0].clone();
                      while (current <= showDate[1]) {
                        arr.push(current.format('YYYY'));
                        current.add(1, 'years');
                      }
                      return arr.map((value, index) => {
                        return (
                          <Col
                            key={index}
                            style={{ width: '33%', margin: '15px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onClick={(e) => { return lodash.get(earningDateData, 'years', []).includes(value) ? _this.handleClick(value) : ''; }}
                          >
                            <div className={`${styles.yearDate} ${!lodash.get(earningDateData, 'years', []).includes(value) ? styles.disabledDate : ''} ${_this.state.date.format('YYYY') === value ? styles.selectedYear : ''}`}>{value}</div>
                          </Col>
                        );
                      } );
                    }()
                    }
                  </Row>
                </div>
              )}
            />

          </div>
        </React.Fragment>
      );
    } else if (earning === 2) {
      return (
        <React.Fragment>
          <div style={{ paddingRight: 5 }}>统计周期</div>
          <DatePicker.MonthPicker
            value={this.state.date}
            allowClear={false}
            format='YYYY年MM月'
            onChange={this.handleMonthPickerChange}
            className={styles.datePickerInput}
            dropdownClassName={`${styles.datePickerCommon} ${styles.disabledMonth} ${styles.monthPicker}`}
            disabledDate={current => {
              const currentYear = current.format('YYYY');
              const currentMonth = current.format('MM');
              const months = lodash.get(earningDateData, 'months', []).find(item => item.year === currentYear) || {};
              return !lodash.get(months, 'months', []).includes(currentMonth);
            } }
          />
        </React.Fragment>
      );
    } else if (earning === 3) {
      const { incomeData = {} } = this.state;
      const { profitList: incomeDataList = [] } = incomeData;
      return (
        <React.Fragment>
          <div style={{ paddingRight: 5 }}>统计周期</div>
          <Select
            ref={el => this.pickerRef = el}
            value={this.state.date.format('YYYY年MM月DD日')}
            allowClear={false}
            style={{ width: 160, height: 30 }}
            className={styles.select}
            dropdownClassName={`${styles.datePicker} ${styles.datePickerCommon} datePicker`}
            dropdownRender={() => (
              <DatePickerPanel
                state={this.state}
                superPrevIcon={<Icon type="double-left" />}
                prevIcon={<Icon type="left" />}
                nextIcon={<Icon type="right" />}
                superNextIcon={<Icon type="double-right" />}
                pickerRef={this.pickerRef}
                handlePanelChange={this.handlePanelChange}
                onChange={this.handleDatePickerChange}
                computed={this.computed}
                onPanelChange={this.handlePanelChange}
                disabledDate={current => lodash.get(incomeDataList.find(item => item.date === current.format('YYYYMMDD')), 'income', '0').toString() === '0'}
                renderExtraFooter={() => (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, fontSize: 12, color: '#74819E', background: 'rgba(209,213,230,0.2)', borderRadius: '0 0 1px 1px', textAlign: 'center' }}>
                    <Icon type="exclamation-circle" style={{ fontSize: 14 }} />
                    <span style={{ paddingLeft: 6 }}>节假日收益将累计算在节假日前、后交易日当中。</span>
                  </div>
                )}
                dateRender={(current, today) => {
                  const temp = lodash.get(incomeDataList.find(item => item.date === current.format('YYYYMMDD')), 'income', '0');
                  return (
                    <div
                      className={`${temp.toString() === '0' ? styles.disabledDate : ''}`}
                      style={{ textAlign: 'center' }}
                    >
                      <div className={`${temp.toString() === '0' ? '' : styles.date} ${current.isSame(this.state.date, 'day') ? styles.selectedDate : ''}`}>
                        { current.date() }
                      </div>
                      <div
                        style={{ fontSize: 12, color: this.computed('specialColor', temp) }}
                      >
                        { lodash.get(incomeDataList.find(item => item.date === current.format('YYYYMMDD')), 'income', '') ?
                          formatDw(lodash.get(incomeDataList.find(item => item.date === current.format('YYYYMMDD')), 'income', '0')) : '-' }
                      </div>
                    </div>
                  );
                }}
              />
            )}
          />
        </React.Fragment>
      );
    } else if (earning === 4) {
      return <div style={{ fontSize: 12, color: '#244FFF' }}>已选周期：{this.state.beginTime.format('YYYY-MM-DD')}至{this.state.endTime.format('YYYY-MM-DD')}</div>;
    }
  }

  render() {
    return (
      <div style={{ fontSize: 14, color: '#1A2243' }} onClick={this.handleBodyClick}>
        <Spin spinning={this.state.loading}>
          <div style={{ height: 56, background: '#FFF', borderBottom: '1px solid #EAEEF2', display: 'flex', alignItems: 'center', paddingLeft: 24 }}>
            <div style={{ display: 'flex', borderRadius: '1px' }}>
              { this.state.accounts.map(item => {
                return <div key={item.ibm} onClick={() => this.handleAccountClick(item.ibm)} className={this.state.account === item.ibm ? styles.tabActive : styles.tab}>{item.note}</div>;
              }) }
            </div>
            { this.state.hasEarning && (
              <React.Fragment>
                <div style={{ display: 'flex', height: '100%' }}>
                  <div onClick={() => this.handleEarningClick(1)} className={this.state.earning === 1 ? styles.earningActive : styles.earning}>年收益</div>
                  <div onClick={() => this.handleEarningClick(2)} className={this.state.earning === 2 ? styles.earningActive : styles.earning}>月收益</div>
                  <div onClick={() => this.handleEarningClick(3)} className={this.state.earning === 3 ? styles.earningActive : styles.earning}>日收益</div>
                  <div onClick={() => this.handleEarningClick(4)} className={this.state.earning === 4 ? styles.earningActive : styles.earning}>
                    <div onClick={() => {
                      const { earningDateData } = this.state;
                      this.setState({ visible: !this.state.visible, earning: 4 }, () => this.func(earningDateData));
                    }}>自定义</div>
                    <div style={{ position: 'absolute' }} onClick={e => { if(this.state.visible) e.stopPropagation(); }}>
                      <DatePicker.RangePicker
                        dropdownClassName={`m-bss-range-picker ${styles.rangePicker} ${styles['rangePickerLeft' + this.state.accounts.length]}`}
                        open={true}
                        popupStyle={{ display: this.state.visible ? 'block' : 'none', zIndex: this.state.visible ? 2 : -1 }}
                        style={{ display: 'none' }}
                        value={this.state.rangePickerDate}
                        onChange={this.handleRangePickerChange}
                        disabledDate={current => current && current > this.state.updateDay.startOf('day')}
                        renderExtraFooter={() => (
                          <div style={{ padding: '5px 0', width: '525px', textAlign: 'right' }}>
                            <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px', width: 64, height: 32 }} onClick={this.handleClear}>重 置</Button>
                            <Button className="m-btn-radius ax-btn-small m-btn-blue" style={{ width: 64, height: 32 }} onClick={this.handleOk}>确 定</Button>
                          </div>
                        )}
                      />
                      <div style={{ position: 'absolute', zIndex: 98, top: '14px', width: '90px', height: '376px', borderRadius: '1px 0 0 1px', background: '#F3F4F7', color: '#1A2243', cursor: 'default', boxShadow: '-5px 2px 5px 0 rgba(5, 14, 28, 0.12)', display: this.state.visible ? 'block' : 'none' }}>
                        <div className={`${styles.quickSelectTime} ${this.state.rangePickerDate[0].isSame(this.state.updateDay.clone().subtract(1, 'months'), 'day') && this.state.rangePickerDate[1].isSame(this.state.updateDay.clone(), 'day') ? styles.activeQuickSelect : ''}`} onClick={() => this.setState({ rangePickerDate: [this.state.updateDay.clone().subtract(1, 'months'), this.state.updateDay.clone()] })}>近一月</div>
                        <div className={`${styles.quickSelectTime} ${this.state.rangePickerDate[0].isSame(this.state.updateDay.clone().subtract(6, 'months'), 'day') && this.state.rangePickerDate[1].isSame(this.state.updateDay.clone(), 'day') ? styles.activeQuickSelect : ''}`} onClick={() => this.setState({ rangePickerDate: [this.state.updateDay.clone().subtract(6, 'months'), this.state.updateDay.clone()] })}>近半年</div>
                        <div className={`${styles.quickSelectTime} ${this.state.rangePickerDate[0].isSame(this.state.updateDay.clone().subtract(1, 'years'), 'day') && this.state.rangePickerDate[1].isSame(this.state.updateDay.clone(), 'day') ? styles.activeQuickSelect : ''}`} onClick={() => this.setState({ rangePickerDate: [this.state.updateDay.clone().subtract(1, 'years'), this.state.updateDay.clone()] })}>近一年</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img style={{ width: 12, height: 12 }} src={this.computed('arrowSrc')} alt='' />
                  </div>
                </div>
                <div style={{ display: 'flex', margin: '0 28px', alignItems: 'center' }}>
                  { this.renderDatePicker() }
                </div>
                { this.state.earning === 1 && moment().isSame(this.state.date, 'year') &&
            <div style={{ color: '#959CBA' }}>数据更新至{this.state.updateDay.format('MM月DD日')}</div>
                }
              </React.Fragment>
            )}
          </div>
          {
            this.state.hasEarning ? (
              <React.Fragment>
                {
                  this.state.earning === 3 ? (
                    <DateEarning
                      {...this.state}
                      getInstence={(_this) => this.earning = _this}
                    />
                  ) : (
                    <OtherEarning
                      {...this.state}
                      getInstence={(_this) => this.earning = _this}
                    />
                  )
                }
                <Spin spinning={this.state.tableLoading}>
                  <DataTable
                    {...this.state}
                    getInstence={(_this) => this.dataTable = _this}
                    getData={this.getData}
                  />
                </Spin>
              </React.Fragment>
            ) : (
              <div style={{ display: 'flex', background: '#FFF', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: document.body.offsetHeight - 65 }}>
                <img src={emptyImg} alt='' />
                <div style={{ color: '#61698C' }}>暂无数据</div>
              </div>
            )
          }
        </Spin>
      </div>
    );
  }
}
export default Earning;
