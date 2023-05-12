import React, { Fragment } from 'react';
import { Button, DatePicker, Input, message } from 'antd';
import { history as router } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import lodash from 'lodash';
import styles from './index.less';
import EchartPie from './echartPie';
import CommonTable from './commonTabel';
import CheckTable from './checkTable';
import Commtable from './commTable';
import FundsTable from './FundsTable';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import { FindAvailableAccount } from '$services/newProduct/customerPortrait';
import { viewSensors, clickSensors } from './utils';


class transactionHome extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      jyType2: '', // 交易类别*
      inputValue2: '', // 代码*
      cpType2: '',// 产品类型
      businessType2: '',// 业务类别
      inputValueHeyue2: '',// 合约代码
      qiquanType2: '', // 期权类别
      dealType2: '',// 买卖类别
      accountType2: 1, // 判断账户类型

      transactionType: 1, // 交易流水*
      accountType: 1, // 账户类型
      tjDateType: 1, // 时间区间*
      jyType: 1, // 交易类别
      businessType: 1, // 业务类别*
      dealType: 1, // 买卖类别*
      inputValueHeyue: '', // 代码*
      chaxunType: 1, // 查询方式的值*
      isMonth: 1, // 资产明细 1:月份/ 2:日期 (用于改变折线图,Table内容的) *

      tjDate: [moment().subtract(1, 'weeks'), moment()], // 显示时间
      mode: ['month', 'month'],
      tjDateCopy: '', // 转换容器
      isProductCode: false, // 产品代码筛选条件 (成交流水中除了期权没有)
      isTranType: false, // 交易类别 (只有普通/信用才有)
      isProdType: false, //产品类型 (只有理财才有)
      isBusiness: false, // 业务类别 (理财)
      isOption: false, // 期权类别 (期权)
      isDeal: false, // 买卖类别 (期权)
      isAgreeCode: false, // 合约代码 (期权)
      cpType: 1, //产品类型
      qiquanType: 1, // 期权类别
      inputValue: '', // *
      isShowTotal: false, // 查询方式(成交流水除了全部的其他情况)
      cehngjiao: true, // 成交按钮下属按钮show
      zijin: false, // 资金按钮对应的下属按钮
      yuyue: false, // 预约按钮对应的下属按钮
      isShowMonth: true,
      isBasicTable: true, // 成交Table
      isCheckTable: false, // 资金Table
      isComTable: false, // 预约Table
      isAccountClick: 1,// 成交流水的table区分 *
      isE: true,
      isEchart: true,
      isShowSearch: false, // 是否展示按钮
      isSearchType: 1, // 查阅方式父子组件传值用
      CopyaccountType: 2, // 给明细详情Table用
      isMoreYear: false, // 是否时间超过12M
      isJustForMonthDayTable: true,
      clickJiaoYi: true,
      clickZiJin: false,
      clickYuYue: false,

      accountTypeZijin: 1, // 资金流水-账户类型字段
      accountTypeZijin2: 1, // 给查询调接口用

      isResetCurrentPage: false,// 是否点击了查询

      accountData: [],//账户类型数据

      strategyName: '', // 策略名称输入框值
      fetchStrategyName: '', // 点击查询后策略名称值
    };
  }

  componentDidMount() {
    // 埋点
    viewSensors(this.state.clickJiaoYi === true ? '成交流水' : this.state.clickZiJin === true ? '资金流水' : '预约流水');
    this.findAvailableAccount();
  }
  //查询可获取的账户类型
  findAvailableAccount = () => {
    FindAvailableAccount({ loginAccount: this.props.customerCode }).then(res => {
      const { records = [] } = res;
      let result = records.length ? [{ ibm: 1, note: '全部' }] : [];
      const map = {
        普通: 2,
        信用: 3,
        期权: 5,
        理财: 4,
        基金投顾: 6,
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
  // 账户类型
  handleAccountType = (accountType, kindType) => {
    if (kindType === 'jiaoyi') { // 交易
      this.setState({
        transactionType: accountType,
      });
      // 三个一级按钮展示不同的二级按钮判断
      if (accountType === 1) {
        // 埋点
        newClickSensors({
          third_module: "交易",
          ax_button_name: "成交流水选择次数",
        });
        this.setState({
          cehngjiao: true,
          zijin: false,
          yuyue: false,

          isBasicTable: true,
          isCheckTable: false,
          isComTable: false,

          // tjDate: [moment().subtract(1, 'years'), moment()],
          // tjDateCopy: [moment().subtract(1, 'years'), moment()],

        });
      }
      if (accountType === 2) {
        newClickSensors({
          third_module: "交易",
          ax_button_name: "资金流水选择次数",
        });
        this.setState({
          zijin: true,
          yuyue: false,
          cehngjiao: false,

          isBasicTable: false,
          isCheckTable: true,
          isComTable: false,

          // tjDate: [moment().subtract(1, 'weeks'), moment()],
          // tjDateCopy: [moment().subtract(1, 'weeks'), moment()],
        });
      }
      if (accountType === 3) {
        newClickSensors({
          third_module: "交易",
          ax_button_name: "预约流水选择次数",
        });
        this.setState({
          yuyue: true,
          zijin: false,
          cehngjiao: false,

          isBasicTable: false,
          isCheckTable: false,
          isComTable: true,

          // tjDate: [moment().subtract(1, 'weeks'), moment()],
          // tjDateCopy: [moment().subtract(1, 'weeks'), moment()],
        });
      }
    }
    // 资金流水-账户字段
    if (kindType === "zhanghuZijin") {

      let m = {
        "1": "普通账户点击次数",
        "2": "信用账户点击次数",
        "3": "期权账户点击次数",
      };
      let name = m[accountType];
      newClickSensors({
        third_module: "交易",
        ax_page_name: "资金流水",
        ax_button_name: name ,
      });
      this.setState({
        accountTypeZijin: accountType,
      });
    }

    // 账户 **
    if (kindType === 'zhanghu') {

      let name = this.state.accountData.filter(item => accountType == item.ibm);
      newClickSensors({
        third_module: "交易",
        ax_page_name: "成交流水",
        ax_button_name: name[0].note + "账户点击次数",
      });
      this.setState({
        accountType,
      });
      if (accountType !== 1) {
        this.setState({
          isE: false,
        });
      } else {
        this.setState({
          isE: true,
        });
      }
      // 只有成交流水+全部时才有按月查询
      if (accountType === 2 || accountType === 3 || accountType === 4 || accountType === 5 || accountType === 6) {
        this.setState({
          isShowMonth: false,
        });
      } else {
        this.setState({
          isShowMonth: true,
        });
      }

      // 产品代码 普通/信用/理财
      if (accountType === 2 || accountType === 3 || accountType === 4) {
        this.setState({
          isProductCode: true,
        });
      } else {
        this.setState({
          isProductCode: false,
        });
      }
      // 普通/信用--交易类别
      if (accountType === 2 || accountType === 3) {
        this.setState({
          isTranType: true,
        });
      } else {
        this.setState({
          isTranType: false,
        });
      }
      // 理财-- 产品类型 业务类别
      if (accountType === 4) {
        this.setState({
          isProdType: true,
          isBusiness: true,
        });
      } else {
        this.setState({
          isProdType: false,
          isBusiness: false,
        });
      }
      // 期权--期权类型 买卖类别 合约代码
      if (accountType === 5) {
        this.setState({
          isOption: true,
          isDeal: true,
          isAgreeCode: true,
        });
      } else {
        this.setState({
          isOption: false,
          isDeal: false,
          isAgreeCode: false,
        });
      }

      // 查询方式
      if (accountType === 1) {
        this.setState({
          isShowSearch: false,
        });
      } else {
        this.setState({
          isShowSearch: true,
        });
      }
    }

    if (kindType === 'jyType') { // 交易类别
      // 埋点
      clickSensors('成交流水-交易类别');
      this.setState({
        jyType: accountType,
      });
    }
    if (kindType === 'cpType') { // 产品类型
      this.setState({
        cpType: accountType,
      });
    }
    if (kindType === 'businessType') { // 业务类别
      this.setState({
        businessType: accountType,
      });
    }
    if (kindType === 'qiquanType') { // 期权类别
      this.setState({
        qiquanType: accountType,
      });
    }
    if (kindType === 'dealType') { // 买卖类别
      this.setState({
        dealType: accountType,
      });
    }
    // 查阅方式 **
    if (kindType === 'searchType') {
      if (accountType === 1) {
        clickSensors('成交流水-明细');
      } else {
        clickSensors('成交流水-汇总');
      }
      this.setState({
        chaxunType: accountType,
      });
    }
  }


  // 月还是日
  handleTjDateType = (tjDateType) => {
    this.setState({
      tjDateType,
    });
    if (tjDateType === 1) {
      newClickSensors({
        third_module: "交易",
        ax_button_name: "统计时间维度次数按月"
      });
      this.setState({
        mode: ['month', 'month'],
      });
    } else {
      newClickSensors({
        third_module: "交易",
        ax_button_name: "统计时间维度次数按日"
      });
      this.setState({
        mode: ['day', 'day'],
      });
    }
  }

  // 时间框
  handlePanelChange = (tjDate, mode) => {
    this.setState({
      tjDate,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  };

  // 代码框
  checkInputValue = (e, type) => {
    if (type === 'heyue') {
      let { value } = e.target;
      value = value.replace(/[^\w\.\/]/ig, '');
      // value = value.replace(/[^\d^(;|；)]+/g, '');
      // value = value.replace(/；/g, ';');
      this.setState({ inputValueHeyue: value });
    } else {
      let { value } = e.target;
      value = value.replace(/[^\w\.\/]/ig, '');
      // value = value.replace(/[^\d^(;|；)]+/g, '');
      // value = value.replace(/；/g, ';');
      this.setState({ inputValue: value });
    }
  }


  // 查询
  fetchData = () => {
    const { tjDate, isResetCurrentPage } = this.state;
    const TimeLegth = moment(tjDate[1].format('YYYYMMDD')).diff(tjDate[0].format('YYYYMMDD'), 'month');
    // console.log(this.state, '全部的state');
    // console.log(this.state.tjDate[0].format('YYYYMMDD'),this.state.tjDate[1].format('YYYYMMDD'),'开始时间');
    this.setState({
      isAccountClick: this.state.accountType,
      isResetCurrentPage: !isResetCurrentPage,
    });
    // 交易大类的切换
    if (this.state.isBasicTable) {
      viewSensors('成交流水');
      this.setState({
        clickJiaoYi: true,
        clickZiJin: false,
        clickYuYue: false,
      });
    }
    if (this.state.isCheckTable) {
      viewSensors('资金流水');
      this.setState({
        clickJiaoYi: false,
        clickZiJin: true,
        clickYuYue: false,
      });
    }
    if (this.state.isComTable) {
      viewSensors('预约流水');
      this.setState({
        clickJiaoYi: false,
        clickZiJin: false,
        clickYuYue: true,
      });
    }
    // 时间
    // 按日OR按月
    if (this.state.tjDateType === 1) {
      this.setState({
        isMonth: 1,
      });
    } else {
      this.setState({
        isMonth: 2, // 按日
      });
    }
    // 时间区间大于12,只折线展示 ()
    if (TimeLegth <= 12) {
      this.setState({
        isMoreYear: false,
      });
    } else {
      this.setState({
        isMoreYear: true,
      });
    }
    // 判断isShowTotal
    if (this.state.transactionType === 1) {
      if (this.state.accountType === 1) { // 只有全部的时候不展示
        this.setState({
          isShowTotal: false,
        });
      } else {
        this.setState({
          isShowTotal: true,
        });
      }
    } else {
      this.setState({
        isShowTotal: false,
      });
    }
    // echart
    if (this.state.isE === true) {
      this.setState({
        isEchart: true,
      });
    } else {
      this.setState({
        isEchart: false,
      });
    }

    // 查询方式Table (取决于账户类型和查询方式两个参数)
    if (this.state.chaxunType === 1) {
      this.setState({
        isSearchType: 1,
      });
    } else { // 区分账户类型的汇总table
      this.setState({
        isSearchType: 2,
        CopyaccountType: this.state.accountType,
      });
    }
    // 给账户-全部-月/日 用的table
    if (this.state.accountType === 1) {
      this.setState({
        isJustForMonthDayTable: true,
      });
    } else {
      this.setState({
        isJustForMonthDayTable: false,
      });
    }

    this.setState({
      tjDateCopy: tjDate, // 改变时间只有在点击查询时后才调用接口
      jyType2: this.state.jyType,
      inputValue2: this.state.inputValue,
      cpType2: this.state.cpType,
      businessType2: this.state.businessType,
      inputValueHeyue2: this.state.inputValueHeyue,
      qiquanType2: this.state.qiquanType,
      dealType2: this.state.dealType,
      accountType2: this.state.accountType,
      accountTypeZijin2: this.state.accountTypeZijin,
      fetchStrategyName: this.state.strategyName,
    });
  }

  reset = () => {
    this.setState({
      jyType2: '', // 交易类别*
      inputValue2: '', // 代码*
      cpType2: '',// 产品类型
      businessType2: '',// 业务类别
      inputValueHeyue2: '',// 合约代码
      qiquanType2: '', // 期权类别
      dealType2: '',// 买卖类别
      accountType2: 1, // 判断账户类型

      transactionType: 1, // 交易流水*
      accountType: 1, // 账户类型
      tjDateType: 1, // 时间区间*
      jyType: 1, // 交易类别
      businessType: 1, // 业务类别*
      dealType: 1, // 买卖类别*
      inputValueHeyue: '', // 代码*
      chaxunType: 1, // 查询方式的值*
      isMonth: 1, // 资产明细 1:月份/ 2:日期 (用于改变折线图,Table内容的) *

      tjDate: [moment().subtract(1, 'weeks'), moment()], // 显示时间
      mode: ['month', 'month'],
      tjDateCopy: [moment().subtract(1, 'weeks'), moment()], // 转换容器
      isProductCode: false, // 产品代码筛选条件 (成交流水中除了期权没有)
      isTranType: false, // 交易类别 (只有普通/信用才有)
      isProdType: false, //产品类型 (只有理财才有)
      isBusiness: false, // 业务类别 (理财)
      isOption: false, // 期权类别 (期权)
      isDeal: false, // 买卖类别 (期权)
      isAgreeCode: false, // 合约代码 (期权)
      cpType: 1, //产品类型
      qiquanType: 1, // 期权类别
      inputValue: '', // *
      isShowTotal: false, // 查询方式(成交流水除了全部的其他情况)
      cehngjiao: true, // 成交按钮下属按钮show
      zijin: false, // 资金按钮对应的下属按钮
      yuyue: false, // 预约按钮对应的下属按钮
      isShowMonth: true,
      isBasicTable: true, // 成交Table
      isCheckTable: false, // 资金Table
      isComTable: false, // 预约Table
      isAccountClick: 1,// 成交流水的table区分 *
      isE: true,
      isEchart: true,
      isShowSearch: false, // 是否展示按钮
      isSearchType: 1, // 查阅方式父子组件传值用
      CopyaccountType: 2, // 给明细详情Table用
      isMoreYear: false, // 是否时间超过12M
      isJustForMonthDayTable: true,
      clickJiaoYi: true,
      clickZiJin: false,
      clickYuYue: false,

      accountTypeZijin: 1, // 资金流水-账户类型字段
      accountTypeZijin2: 1, // 给查询调接口用
    });
  }
  render() {
    const { transactionType, accountType, tjDateType, tjDate, mode, tjDateCopy, isMonth, isProductCode, isTranType, isProdType, isBusiness, isOption, isDeal, isAgreeCode,
      jyType, jyType2, cpType, businessType, qiquanType, dealType, isShowTotal, isShowMonth, isBasicTable, isCheckTable, isComTable, isAccountClick, isEchart, isSearchType, isShowSearch,
      cehngjiao, zijin, yuyue, chaxunType, CopyaccountType, isMoreYear, isJustForMonthDayTable, clickJiaoYi, clickZiJin, clickYuYue, inputValue, inputValue2, cpType2, businessType2,
      inputValueHeyue2, qiquanType2, dealType2, accountType2, accountTypeZijin, accountTypeZijin2, isResetCurrentPage } = this.state;
    const chengjiaoAll = { // 查询成交流水全部账户列表
      isMonth,
      tjDateCopy,
      tjDate, // 给初始化使用
      accountType2,
    };
    const chengjiaoCommCredit = { // 成交流水普通、信用账户-table
      isAccountClick,// 账户类型
      isSearchType,// 明细/汇总
      jyType2,// 交易类别
      inputValue2,// 产品代码
      isMonth, // 按月/按日
      tjDateCopy, // RangeTime
      accountType2,
    };
    const chengjiaoLicai = { // 成交-理财-table
      inputValue2,// 产品代码
      isSearchType,// 明细/汇总
      tjDateCopy, // RangeTime
      cpType2, // 产品类型
      businessType2, // 业务类别
      accountType2,
    };
    const chengjiaoqiquan = { // 成交-期权-table
      isSearchType,// 明细/汇总
      tjDateCopy, // RangeTime
      inputValueHeyue2,
      qiquanType2,
      dealType2,
      accountType2,
    };

    const zijinFlow = {
      // isAccountClick,
      accountTypeZijin2,
      tjDateCopy,
      tjDate, // 给初始化使用
      accountType2,
    };

    const yuyueFlow = {
      tjDateCopy,
      tjDate, // 给初始化使用
    };
    const accounts = this.state.accountData.filter(item => item.note !== '全部');
    return (
      <Fragment>
        <div style={{ marginTop: 155 }}>
          <div className={styles.searchBox2}>
            <div>
              <span className={styles.label}>交易流水</span>
              <Button className={`${styles.button} ${transactionType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'jiaoyi')}>成交流水</Button>
              <Button className={`${styles.button} ${transactionType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'jiaoyi')}>资金流水</Button>
              <Button className={`${styles.button} ${transactionType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3, 'jiaoyi')}>预约流水</Button>
            </div>
            {
              cehngjiao ? (
                <Fragment>
                  <div>
                    <span className={styles.label}>账户类型</span>
                    {
                      this.state.accountData.map(item =>
                        <Button key={item.ibm} className={`${styles.button} ${accountType === item.ibm ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(item.ibm, 'zhanghu')}>{item.note}</Button>
                      )
                    }
                    {/* <Button className={`${styles.button} ${accountType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'zhanghu')}>全部</Button>
                    <Button className={`${styles.button} ${accountType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'zhanghu')}>普通</Button>
                    <Button className={`${styles.button} ${accountType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3, 'zhanghu')}>信用</Button>
                    <Button className={`${styles.button} ${accountType === 4 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(4, 'zhanghu')}>理财</Button>
                    <Button className={`${styles.button} ${accountType === 5 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(5, 'zhanghu')}>期权</Button> */}
                  </div>
                  {/* ===========成交按钮========== */}
                  {
                    accountType === 6 ? (
                      <div>
                        <span className={styles.label}>策略名称</span>
                        <Input placeholder="请输入策略名称" onChange={e => this.setState({ strategyName: e.target.value })} value={this.state.strategyName} style={{ width: '230px', height: '34px' }} />
                      </div>
                    ) : null
                  }
                  {
                    isTranType ? (
                      <div>
                        <span className={styles.label}>交易类别</span>
                        <Button className={`${styles.button} ${jyType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'jyType')}>全部</Button>
                        <Button className={`${styles.button} ${jyType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'jyType')}>买入</Button>
                        <Button className={`${styles.button} ${jyType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3, 'jyType')}>卖出</Button>
                        <Button className={`${styles.button} ${jyType === 4 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(4, 'jyType')}>转托管</Button>
                        <Button className={`${styles.button} ${jyType === 1000 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1000, 'jyType')}>其他</Button>
                      </div>
                    ) : null
                  }
                  {
                    isProdType ? (
                      <div>
                        <span className={styles.label}>产品类型</span>
                        <Button className={`${styles.button} ${cpType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'cpType')}>全部</Button>
                        <Button className={`${styles.button} ${cpType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'cpType')}>开放式基金</Button>
                        <Button className={`${styles.button} ${cpType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3, 'cpType')}>资管产品</Button>
                        <Button className={`${styles.button} ${cpType === 4 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(4, 'cpType')}>银行理财</Button>
                        <Button className={`${styles.button} ${cpType === 5 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(5, 'cpType')}>信托产品</Button>
                        <Button className={`${styles.button} ${cpType === 6 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(6, 'cpType')}>其他金融产品</Button>

                      </div>
                    ) : null
                  }
                  {
                    isBusiness ? (
                      <div>
                        <span className={styles.label}>业务类别</span>
                        <Button className={`${styles.button} ${businessType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'businessType')}>全部</Button>
                        <Button className={`${styles.button} ${businessType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'businessType')}>申购</Button>
                        <Button className={`${styles.button} ${businessType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3, 'businessType')}>认购</Button>
                        <Button className={`${styles.button} ${businessType === 4 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(4, 'businessType')}>定额定投</Button>
                        <Button className={`${styles.button} ${businessType === 5 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(5, 'businessType')}>赎回</Button>
                        <Button className={`${styles.button} ${businessType === 6 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(6, 'businessType')}>其他</Button>
                      </div>
                    ) : null
                  }
                  {
                    isOption ? (
                      <div>
                        <span className={styles.label}>期权类别</span>
                        <Button className={`${styles.button} ${qiquanType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'qiquanType')}>全部</Button>
                        <Button className={`${styles.button} ${qiquanType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'qiquanType')}>认购</Button>
                        <Button className={`${styles.button} ${qiquanType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3, 'qiquanType')}>认沽</Button>
                        <Button className={`${styles.button} ${qiquanType === 100 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(100, 'qiquanType')}>其他</Button>
                      </div>
                    ) : null
                  }
                  {
                    isDeal ? (
                      <div>
                        <span className={styles.label}>买卖类别</span>
                        <Button className={`${styles.button} ${dealType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'dealType')}>全部</Button>
                        <Button className={`${styles.button} ${dealType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'dealType')}>买入开仓</Button>
                        <Button className={`${styles.button} ${dealType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3, 'dealType')}>卖出开仓</Button>
                        <Button className={`${styles.button} ${dealType === 4 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(4, 'dealType')}>备兑开仓</Button>
                        <Button className={`${styles.button} ${dealType === 5 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(5, 'dealType')}>买入平仓</Button>
                        <Button className={`${styles.button} ${dealType === 6 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(6, 'dealType')}>卖出平仓</Button>
                        <Button className={`${styles.button} ${dealType === 7 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(7, 'dealType')}>备兑平仓</Button>
                        <Button className={`${styles.button} ${dealType === 100 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(100, 'dealType')}>其他</Button>
                      </div>
                    ) : null
                  }

                  {
                    isShowSearch ? (
                      <div>
                        <span className={styles.label}>查阅方式</span>
                        <Button className={`${styles.button} ${chaxunType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'searchType')}>明细</Button>
                        <Button className={`${styles.button} ${chaxunType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'searchType')}>汇总</Button>
                      </div>
                    ) : null
                  }

                  {
                    isProductCode ? (
                      <div>
                        <span className={styles.label}>产品代码</span>
                        <Input placeholder="请输入产品代码" onChange={e => this.checkInputValue(e)} value={this.state.inputValue} style={{ width: '230px', height: '34px' }} />
                      </div>
                    ) : null
                  }

                  {
                    isAgreeCode ? (
                      <div>
                        <span className={styles.label}>合约代码</span>
                        <Input placeholder="请输入合约代码" onChange={e => this.checkInputValue(e, 'heyue')} value={this.state.inputValueHeyue} style={{ width: '230px', height: '34px' }} />
                      </div>
                    ) : null
                  }
                  {
                    isShowMonth ? (
                      <div>
                        <span className={styles.label}>统计时间</span>
                        <Button className={`${styles.button} ${tjDateType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleTjDateType(1)}>按月</Button>
                        <Button className={`${styles.button} ${tjDateType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleTjDateType(2)}>按日</Button>
                        <DatePicker.RangePicker
                          mode={mode}
                          allowClear={false}
                          value={tjDate}
                          className={styles.rangePicker}
                          dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                          style={{ width: '264px' }}
                          placeholder={['开始日期', '结束日期']}
                          format={tjDateType === 1 ? "YYYY-MM" : "YYYY-MM-DD"}
                          separator='至'
                          disabledDate={(current) => current && current > moment().endOf('day')}
                          onChange={tjDate => this.setState({ tjDate })}
                          onPanelChange={this.handlePanelChange}
                        />
                      </div>
                    ) : (
                      <div>
                        <span className={styles.label}>统计时间</span>
                        <DatePicker.RangePicker
                          allowClear={false}
                          value={tjDate}
                          className={styles.rangePicker}
                          dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                          style={{ width: '264px' }}
                          placeholder={['开始日期', '结束日期']}
                          format={"YYYY-MM-DD"}
                          separator='至'
                          disabledDate={(current) => current && current > moment().endOf('day')}
                          onChange={tjDate => this.setState({ tjDate })}
                          onPanelChange={this.handlePanelChange}
                        />
                      </div>
                    )
                  }

                </Fragment>
              ) : null
            }

            {/* ========资金按钮======= */}
            {
              zijin ? (
                <Fragment>
                  <div>
                    <span className={styles.label}>账户类型</span>
                    <Button className={`${styles.button} ${accountTypeZijin === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1, 'zhanghuZijin')}>普通</Button>
                    <Button className={`${styles.button} ${accountTypeZijin === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2, 'zhanghuZijin')}>信用</Button>
                    <Button className={`${styles.button} ${accountTypeZijin === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3, 'zhanghuZijin')}>期权</Button>
                  </div>
                  {/* <div>
                    <span className={styles.label}>账户类型</span>
                    <Button className={`${styles.button} ${accountType === 1 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(1,'zhanghu')}>普通</Button>
                    <Button className={`${styles.button} ${accountType === 2 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(2,'zhanghu')}>信用</Button>
                    <Button className={`${styles.button} ${accountType === 3 ? styles.activeBtn : ''}`} onClick={() => this.handleAccountType(3,'zhanghu')}>期权</Button>
                  </div> */}
                  <div>
                    <span className={styles.label}>统计时间</span>
                    <DatePicker.RangePicker
                      mode={['day', 'day']}
                      allowClear={false}
                      value={tjDate}
                      className={styles.rangePicker}
                      dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                      style={{ width: '264px' }}
                      placeholder={['开始日期', '结束日期']}
                      format={"YYYY-MM-DD"}
                      separator='至'
                      disabledDate={(current) => current && current > moment().endOf('day')}
                      onChange={tjDate => this.setState({ tjDate })}
                      onPanelChange={this.handlePanelChange}
                    />
                  </div>
                </Fragment>
              ) : null
            }

            {/* ========预约按钮=======  */}
            {
              yuyue ? (
                <Fragment>
                  <div>
                    <span className={styles.label}>统计时间</span>
                    <DatePicker.RangePicker
                      mode={['day', 'day']}
                      allowClear={false}
                      value={tjDate}
                      className={styles.rangePicker}
                      dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                      style={{ width: '264px' }}
                      placeholder={['开始日期', '结束日期']}
                      format={"YYYY-MM-DD"}
                      separator='至'
                      disabledDate={(current) => current && current > moment().endOf('day')}
                      onChange={tjDate => this.setState({ tjDate })}
                      onPanelChange={this.handlePanelChange}
                    />
                  </div>
                </Fragment>
              ) : null
            }

            <div>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={this.fetchData}>查询</Button>
            </div>
          </div>

          {
            clickJiaoYi && isAccountClick !== 6 ? (
              <Fragment>
                {
                  isEchart ? <EchartPie accounts={accounts} customerCode={this.props.customerCode} chengjiaoAll={chengjiaoAll} isMonth={isMonth} isMoreYear={isMoreYear} /> : null
                }
                <CommonTable isResetCurrentPage={isResetCurrentPage} accountType2={accountType2} customerCode={this.props.customerCode} chengjiaoAll={chengjiaoAll} chengjiaoCommCredit={chengjiaoCommCredit} chengjiaoLicai={chengjiaoLicai} chengjiaoqiquan={chengjiaoqiquan} isJustForMonthDayTable={isJustForMonthDayTable} isMonth={isMonth} isAccountClick={isAccountClick} isShowTotal={isShowTotal} isSearchType={isSearchType} CopyaccountType={CopyaccountType} />
              </Fragment>
            ) : null
          }

          {
            clickJiaoYi && isAccountClick === 6 ?
              <FundsTable customerCode={this.props.customerCode} isSearchType={isSearchType} tjDateCopy={tjDateCopy} fetchStrategyName={this.state.fetchStrategyName} />
              : null
          }

          {
            clickZiJin ? (
              <CheckTable isResetCurrentPage={isResetCurrentPage} customerCode={this.props.customerCode} zijinFlow={zijinFlow} />
            ) : null
          }

          {
            clickYuYue ? (
              <Commtable isResetCurrentPage={isResetCurrentPage} customerCode={this.props.customerCode} yuyueFlow={yuyueFlow} />
            ) : null
          }

          <div style={{ height: 70, backgroundColor: '#F2F3F7' }}></div>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ global, customerPanorama }) => ({
  // dictionary: global.dictionary,
}))(transactionHome);
