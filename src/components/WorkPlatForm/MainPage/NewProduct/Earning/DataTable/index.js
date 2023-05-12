import { Affix, Button, Icon, Modal, Pagination, Spin, Table } from 'antd';
import React, { Component } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { formatColor, formatThousands, formatNum, exportExcel, clickSensors } from '../util';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import $ from '$assets/newProduct/earing/$.png';
import _$ from '$assets/newProduct/earing/_$.png';
//import emptyImg from '$assets/newProduct/customerPortrait/缺省图.png';
import emptyImg from '$assets/newProduct/customerPortrait/defaultGraph.png';
import styles from './index.less';
import MyPopover from '../Common/MyPopover';

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1, // 股票|理财|国债|其他
      activeSubKey: 1, // 理财下子tab  基金|理财
      pageSize: 20,
      current: 1,
      total: 0,
      loading: false,
      dataSource: [],
      sort: ['profitOrLossAmount', 'descend'],
    };
    const { getInstence } = props;
    if (getInstence && typeof getInstence === 'function') {
      getInstence(this);
    }
  }

  componentDidMount = () => {
    if (this.props.account === 3) {
      this.setState({ activeKey: 3 });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account !== this.props.account) {
      if (this.props.account === 3) {
        this.setState({ activeKey: 3 });
      } else {
        this.setState({ activeKey: 1 });
      }
    }
    if (prevState.activeKey !== this.state.activeKey) { // || prevState.current !== this.state.current || prevState.pageSize !== this.state.pageSize
      this.props.getData();
    }
  }
  computed = (type, ...rest) => {
    if (type === 'color') {
      const [val] = rest;
      return formatColor(formatNum(val));
    }
  }
  getColumns = (activeKey = this.state.activeKey, earning = this.props.earning) => {
    let columns = [];
    const { sort } = this.state;
    if (activeKey === 4) {
      columns = [
        {
          title: '日期',
          dataIndex: 'date',
          render: text => text ? moment(text).format('YYYY-MM-DD') : '-',
        },
        {
          title: '盈亏来源',
          dataIndex: 'bizName',
        },
        {
          title: '盈亏金额',
          dataIndex: 'totalAmt',
          sorter: true,
          sortOrder: sort[0] === 'totalAmt' ? sort[1] : false,
          render: (text) => <div style={{ color: this.computed('color', text) }}>{formatThousands(text)}</div>,
        },
      ];
    } else if (activeKey === 3) {
      if (this.props.account === 3) {
        columns = [
          {
            title: '名称/代码',
            dataIndex: 'customerNameAndCode',
            // render: (_, record) => `${record.name}/${record.code}`,
          },
          {
            title: '期初金额',
            dataIndex: 'amountAtTheBeginning',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '期末金额',
            dataIndex: 'amountAtTheEnding',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '净流入金额',
            dataIndex: 'netInflow',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '盈亏金额',
            dataIndex: 'amountOfProfitAndLoss',
            sorter: true,
            sortOrder: sort[0] === 'amountOfProfitAndLoss' ? sort[1] : false,
            render: (text) => <div style={{ color: this.computed('color', text) }}>{formatThousands(text)}</div>,
          },
        ];
      } else {
        columns = [
          {
            title: '名称/代码',
            dataIndex: 'code',
            render: (_, record) => `${record.dayType}/${record.secuIntl}`,
          },
          {
            title: '收益',
            dataIndex: 'profitAmt',
            sorter: true,
            sortOrder: sort[0] === 'profitAmt' ? sort[1] : false,
            render: (text) => <div style={{ color: this.computed('color', text) }}>{formatThousands(text)}</div>,
          },
          {
            title: '交易日期',
            dataIndex: 'trdDate',
            render: text => text ? moment(text).format('YYYY-MM-DD') : '-',
          },
          {
            title: '出借金额',
            dataIndex: 'landAmt',
            sorter: true,
            sortOrder: sort[0] === 'landAmt' ? sort[1] : false,
            render: text => `${formatThousands(text)}`,
          },
        ];
      }
    } else {
      if (earning === 3) {
        columns = [
          {
            title: '名称/代码',
            dataIndex: 'code',
            render: (_, record) => `${record.name}/${record.code}`,
          },
          {
            title: '日终市值',
            dataIndex: 'finalPosiAmount',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '前一日市值',
            dataIndex: 'initialPosiAmount',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '净流入金额',
            dataIndex: 'netInflowAmt',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '盈亏金额',
            dataIndex: activeKey === 1 ? 'profitOrLossAmount' : 'income',
            sorter: true,
            sortOrder: sort[0] === (activeKey === 1 ? 'profitOrLossAmount' : 'income') ? sort[1] : false,
            render: (text) => <div style={{ color: this.computed('color', text) }}>{formatThousands(text)}</div>,
          },
        ];
      } else {
        columns = [
          {
            title: '名称/代码',
            dataIndex: 'code',
            render: (_, record) => `${record.name}/${record.code}`,
          },
          {
            title: '期初金额',
            dataIndex: 'initialPosiAmount',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '期末金额',
            dataIndex: 'finalPosiAmount',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '净流入金额',
            dataIndex: 'netInflowAmt',
            render: text => `${formatThousands(text)}`,
          },
          {
            title: '盈亏金额',
            dataIndex: activeKey === 1 ? 'profitOrLossAmount' : 'income',
            sorter: true,
            sortOrder: sort[0] === (activeKey === 1 ? 'profitOrLossAmount' : 'income') ? sort[1] : false,
            render: (text) => <div style={{ color: this.computed('color', text) }}>{formatThousands(text)}</div>,
          },
        ];
      }
    }
    return columns;
  }
  // 切换tab，股票|理财|国债理财|其他
  handleTabClick = (activeKey) => {

    const m = {
      "1": "访问股票次数",
      "2": "访问理财次数",
      "3": "访问国债理财次数",
      "4": "访问其他次数",
    };
    let name = m[activeKey];
    newViewSensors({
      third_module: "收益",
      ax_page_name: name,
    });
    this.setState({ activeKey });
  }
  // 导出
  export = () => {
    clickSensors('导出');
    newClickSensors({
      third_module: "收益",
      ax_button_name: "收益导出点击次数"
    });
    const _this = this;
    this.setState({ loading: true });
    const { getData, account } = this.props;
    const taskMap = {
      1: [getData(1), getData(2, 1), getData(2, 2), getData(3), getData(4)],
      2: [getData(1), getData(4)],
      3: [getData(3)],
    };
    Promise.all(taskMap[account]).then((response) => {
      this.setState({ loading: false });
      const total = response.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      Modal.confirm({
        title: '提示：',
        content: `是否导出数据（共${total}条）？`,
        onOk() {
          toExcel();
          getData();
          _this.getColumns();
          _this.getDataSource();
        },
        onCancel() {
          getData();
        },
      });
    });
    // 生成excel
    const toExcel = () => {
      let sheetArr = [];
      if (account === 1) {
        sheetArr = [
          { sheet: exportExcel.toSheet(this.getColumns(1), this.getDataSource(1)), sheetName: '股票' },
          { sheet: exportExcel.toSheet(this.getColumns(2), this.getDataSource(2,1)), sheetName: '基金' },
          { sheet: exportExcel.toSheet(this.getColumns(2), this.getDataSource(2,2)), sheetName: '理财' },
          { sheet: exportExcel.toSheet(this.getColumns(3), this.getDataSource(3), 3), sheetName: '国债理财' },
          { sheet: exportExcel.toSheet(this.getColumns(4), this.getDataSource(4)), sheetName: '其他' },
        ];
      } else if (account === 2) {
        sheetArr = [
          { sheet: exportExcel.toSheet(this.getColumns(1), this.getDataSource(1)), sheetName: '股票' },
          { sheet: exportExcel.toSheet(this.getColumns(4), this.getDataSource(4)), sheetName: '其他' },
        ];
      } else if (account === 3) {
        sheetArr = [
          { sheet: exportExcel.toSheet(this.getColumns(3), this.getDataSource(3)), sheetName: 'sheet' },
        ];
      }
      // //设置列宽
      // sheet1['!cols'] = [
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 10 },
      // ];
      exportExcel.toExcel(`收益(${moment().format('YYYY.MM.DD HH:mm:ss')})`, ...sheetArr);
    };
  };
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize });
  };
  handleActiveSubKey = (activeSubKey) => {

    newClickSensors({
      third_module: "收益",
      ax_page_name: '理财',
      ax_button_name: activeSubKey === 1 ? '点击基金次数' : '点击理财次数',
    });
    this.setState({ activeSubKey }, () => {
      this.getDataSource();
    });
  }
  getDataSource = (activeKey = this.state.activeKey, activeSubKey = this.state.activeSubKey) => {
    let dataSource = [];
    let sort = [];
    if (activeKey === 1) {
      dataSource = lodash.get(this.props.stocksData, 'profitList.positionStockList', []).concat(lodash.get(this.props.stocksData, 'lossList.positionStockList', []));
      dataSource.sort((a, b) => b.profitOrLossAmount - a.profitOrLossAmount);
      sort = ['profitOrLossAmount', 'descend'];
    } else if (activeKey === 2) {
      if (activeSubKey === 1) {
        dataSource = lodash.get(this.props.financialsData, 'fundPositionList', []);
      } else if (activeSubKey === 2) {
        dataSource = lodash.get(this.props.financialsData, 'lcPosiList', []);
      }
      dataSource.sort((a, b) => b.income - a.income);
      sort = ['income', 'descend'];
    } else if (activeKey === 3) {
      if (this.props.account === 3) {
        dataSource = lodash.get(this.props, 'optionData', []);
        dataSource.sort((a, b) => b.amountOfProfitAndLoss - a.amountOfProfitAndLoss);
        sort = ['amountOfProfitAndLoss', 'descend'];
      } else {
        dataSource = lodash.get(this.props.nationaldebtData, 'debtList', []);
        dataSource.sort((a, b) => b.landAmt - a.landAmt);
        sort = ['landAmt', 'descend'];
      }
    } else if (activeKey === 4) {
      dataSource = lodash.get(this.props.otherData, 'detail', []);
      dataSource.sort((a, b) => b.totalAmt - a.totalAmt);
      sort = ['totalAmt', 'descend'];
    }
    dataSource.forEach((item, index) => {
      item['key'] = index;
    });
    this.setState({ dataSource, sort });
    return dataSource;
  }
  handleTableChange = (_, __, sorter) => {
    let { dataSource = [] } = this.state;
    const { columnKey, order = false } = sorter;
    dataSource.sort((a, b) => order === 'ascend' ? a[columnKey] - b[columnKey] : b[columnKey] - a[columnKey] );
    this.setState({ dataSource, sort: [columnKey, order] });
  }
  renderStatic = () => {
    const { stocksData = {}, financialsData = {} } = this.props;
    const { activeKey = 1 } = this.state;
    if (activeKey === 1) {
      return (
        <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <div style={{ color: this.computed('color', lodash.get(stocksData, 'profitList.total', '0')) }}>{formatThousands(lodash.get(stocksData, 'profitList.total', '0'))}</div>
              <div style={{ color: '#74819E', display: 'flex', alignItems: 'center' }}>
                <div style={{  width: 13, height: 13, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={$} style={{ width: 13, height: 13 }} alt='' />
                </div>
                <span style={{ paddingLeft: 4 }}>盈利金额</span>
              </div>
            </div>
            <div style={{  width: 1 , height: 24, background: '#D1D5E6', opacity: 0.5, margin: '0 50px' }}></div>
            <div>
              <div style={{ color: this.computed('color', lodash.get(stocksData, 'lossList.total', '0')) }}>{formatThousands(lodash.get(stocksData, 'lossList.total', '0'))}</div>
              <div style={{ color: '#74819E', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 15, height: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', top: 1 }}>
                  <img src={_$} style={{ width: 15, height: 13 }} alt='' />
                </div>
                <span style={{ paddingLeft: 4 }}>亏损金额</span>
              </div>
            </div>
            <div style={{  width: 1 , height: 24, background: '#D1D5E6', opacity: 0.5, margin: '0 50px' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 40 }}>
              <div style={{ width: 4, height: 4, background: '#244FFF', borderRadius: '50%', marginRight: 5 }}></div>
              <div>持股胜率：{lodash.get(stocksData, 'profitList.winRate', '0')}%</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 40 }}>
              <div style={{ width: 4, height: 4, background: '#244FFF', borderRadius: '50%', marginRight: 5 }}></div>
              <div>持仓总数：{lodash.get(stocksData, 'holdNumber', '0')}只</div>
            </div>
            <div  style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 4, height: 4, background: '#244FFF', borderRadius: '50%', marginRight: 5 }}></div>
              <div>盈利：{lodash.get(stocksData, 'profitList.positionStockNumber', '0')}只</div>
            </div>
          </div>
          <Button style={{ height: 34 }} className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.export}>导出</Button>
        </div>
      );
    } else if (activeKey === 2) {
      return    (
        <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: 130, height: 34, border: '.5px solid #D1D5E6', borderRadius: 17, color: '#61698C' }}>
              <div onClick={() => this.handleActiveSubKey(1)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} className={this.state.activeSubKey === 1 ? styles.activeTableTab : ''}>基金</div>
              <div onClick={() => this.handleActiveSubKey(2)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} className={this.state.activeSubKey === 2 ? styles.activeTableTab : ''}>理财</div>
            </div>
            <div style={{ marginLeft: 40 }}>
              <div style={{ color: this.computed('color', this.state.activeSubKey === 1 ? lodash.get(financialsData, 'fundRangeIncome', '0') : lodash.get(financialsData, 'lcFinalPlAmt', '0')) }}>{this.state.activeSubKey === 1 ? formatThousands(lodash.get(financialsData, 'fundRangeIncome', '0')) : formatThousands(lodash.get(financialsData, 'lcFinalPlAmt', '0'))}</div>
              <div style={{ color: '#74819E', display: 'flex', alignItems: 'center' }}>
                <img src={$} style={{ width: 13, height: 13 }} alt='' />
                <span style={{ paddingLeft: 4 }}>{this.state.activeSubKey === 1 ? '基金' : '理财'}收益总金额</span>
              </div>
            </div>

          </div>
          <Button style={{ height: 34 }} className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.export}>导出</Button>
        </div>
      );
    } else if (activeKey === 3) {
      return (
        <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', fontSize: 12 }}>
          <div></div>
          <Button style={{ height: 34 }} className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.export}>导出</Button>
        </div>
      );
    } else if (activeKey === 4) {
      return (
        <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ paddingRight: 6 }}>其他收益金额</div>
            <MyPopover overlayClassName={styles.otherPopover} placement='bottom' content={<div style={{ width: 625, lineHeight: '24px' }}>
              <div style={{ fontWeight: 600 }}>其他收益金额=账户收益-(股票收益+理财收益+国债逆回购收益)</div>
              <div style={{ padding: '5px 0' }}>一般来说，其他收益是由现金收益、天利宝收益、个人所得税扣款、两融利息等组成。</div>
              <div style={{ padding: '5px 0' }}>※如果其他收益明细之和与其他收益不守恒时，通常是由于：</div>
              <div style={{ padding: '5px 0' }}>1、部分otc产品、场内基金产品，资金流水记录和实际份额金额不守恒而产生的差额；</div>
              <div style={{ padding: '5px 0' }}>2、账单中产品收益多算或少算的差额也会计算在“其他”收益里。例如：由于部分可转债的清算规则，导致股票收益金额将债券市值计入收益，为了保障账户收益的守恒，则会在其他收益中扣除；</div>
              <div style={{ padding: '5px 0' }}>3、由融资融券或股票质押而产生的利息支出；</div>
              <div style={{ padding: '5px 0' }}>4、行情工具、投顾组合等服务产品购买，或投顾产品提佣签约后客户股票交易产生的增值服务费。</div>
              <div style={{ padding: '10px 0 5px' }}>如有疑问可以提供账单首页展示时间区间的截图及资金账号发送至意见反馈，我们会尽快为您查询。感谢您的支持!</div>
            </div>}>
              <Icon type="question-circle" style={{ width: 14, height: 14, color: '#A7AEC6' }} />
            </MyPopover>
          </div>
          <Button style={{ height: 34 }} className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.export}>导出</Button>
        </div>
      );
    }
  }
  render() {
    const { homeData = [] } = this.props;
    let { current, pageSize, dataSource = [] } = this.state;
    dataSource = dataSource.slice(pageSize * (current - 1), pageSize * current);
    const nameMap = {
      1: '股票',
      2: '理财',
      3: '国债理财',
      4: '其他',
    };
    return (
      <div style={{ background: '#FFF', marginTop: 8 }}>
        { this.props.account !== 3 && (
          <Affix offsetTop={0}>
            <div style={{ width: '100%', height: 56, borderBottom: '1px solid #EAEEF2', display: 'flex', padding: '0 24px', background: '#FFF' }}>
              <div onClick={() => this.handleTabClick(1)} className={this.state.activeKey === 1 ? styles.activeTab : styles.tab}>
                <div style={{ paddingRight: 6 }}>股票</div>
                <div style={{ color: this.computed('color', lodash.get(homeData, 'incomeOverview.rangeStockReturns', '0')) }}>￥{formatThousands(lodash.get(homeData, 'incomeOverview.rangeStockReturns', '0'))}</div>
              </div>
              { this.props.account !== 2 && (
                <div onClick={() => this.handleTabClick(2)} className={this.state.activeKey === 2 ? styles.activeTab : styles.tab}>
                  <div style={{ paddingRight: 6 }}>理财</div>
                  <div style={{ color: this.computed('color', lodash.get(homeData, 'incomeOverview.rangeFinancialIncome', '0')) }}>￥{formatThousands(lodash.get(homeData, 'incomeOverview.rangeFinancialIncome', '0'))}</div>
                </div>
              )}
              { this.props.account !== 2 && (
                <div onClick={() => this.handleTabClick(3)} className={this.state.activeKey === 3 ? styles.activeTab : styles.tab}>
                  <div style={{ paddingRight: 6 }}>国债理财</div>
                  <div style={{ color: this.computed('color', lodash.get(homeData, 'incomeOverview.rangeDebtReverseRepurchaseIncome', '0')) }}>￥{formatThousands(lodash.get(homeData, 'incomeOverview.rangeDebtReverseRepurchaseIncome', '0'))}</div>
                </div>
              )}
              <div onClick={() => this.handleTabClick(4)} className={this.state.activeKey === 4 ? styles.activeTab : styles.tab}>
                <div style={{ paddingRight: 6 }}>其他</div>
                <div style={{ color: this.computed('color', lodash.get(homeData, 'incomeOverview.rangeCashIncome', '0')) }}>￥{formatThousands(lodash.get(homeData, 'incomeOverview.rangeCashIncome', '0'))}</div>
              </div>
            </div>
          </Affix>
        )}
        <Spin spinning={this.state.loading}>
          { this.renderStatic() }
          <div style={{ padding: '0 24px', overflow: 'auto', minHeight: 420 }}>
            <Table columns={this.getColumns()} dataSource={dataSource} className={`m-table-customer ${styles.table}`} pagination={false} onChange={this.handleTableChange} sortDirections={['descend', 'ascend']}
              locale={{ emptyText: <div style={{ textAlign: 'center', padding: '34px 0 20px' }}>
                <img src={emptyImg} style={{ width: 121, height: 81 }} alt='' />
                <div style={{ color: '#61698C' }}>账单期内暂无{this.props.account === 3 ? '' : this.state.activeKey === 2 ? (this.state.activeSubKey === 1 ? '基金' : '理财') : nameMap[this.state.activeKey]}收益明细</div>
              </div> }}
            />
            <Pagination
              style={{ float: 'right', margin: '18px 0 29px' }}
              size='small'
              showLessItems
              showQuickJumper
              showSizeChanger
              className={`${styles.pagination}`}
              pageSizeOptions={['20', '50', '100']}
              pageSize={this.state.pageSize}
              current={this.state.current}
              total={this.state.total}
              onChange={this.handlePageChange}
              onShowSizeChange={(current,pageSize) => this.handlePageChange(1, pageSize)}
            />
          </div>
        </Spin>

      </div>
    );
  }
}

export default DataTable;
