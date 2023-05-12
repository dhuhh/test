import React from 'react';
import { Table, message, Row, Col, Checkbox, Divider, Button, Spin, Popover, Modal, Progress } from 'antd';
import lodash from 'lodash';
import { formatThousands } from '../Common/Utils';
import styles from '../index.less';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import { FetchCusProductList, QueryOtherListDisplayColumn } from '$services/newProduct';
import config from '$utils/config';

const { api } = config;
const {
  newProduct: {
    cusProductListExport,
  } } = api;

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      indeterminate: false,  // "全选框"样式属性
      checked: false,  // 列表筛选条件里的"全选"框值
      checkedGroup: [],  // 列表筛选条件里的多选框值
      checkboxData: [],
      market_value: null, // 上日市值
      transaction_amount: null, // 交易金额
      average_market_value: null, // 日均保有
      pdNo: null,
      input: null,
      pageSize: 20,
      current: 1,
      total: -1,
      columns: [],
      hasMore: true,
      allColumns: [],
      sort: '',
      modalVisible: false,
      percent: 0,
    };
  }

  async componentDidMount() {
    const { cusId, cusRng, cusType, tmPrd, timePeriod } = this.props;
    await this.fetchCusProductList({
      cusId,
      cusRng,
      cusType,
      tmPrd: tmPrd[timePeriod],
      current: 1,
      pageSize: 20,
      paging: 1,
      total: -1,
      srchTp: 1,
    });
    await this.fetchCusProductList({
      cusId,
      cusRng,
      cusType,
      tmPrd: tmPrd[timePeriod],
      current: 1,
      pageSize: 20,
      paging: 1,
      total: -1,
      srchTp: 2,
    });
    this.fetchColumns();
  }

  componentWillUnmount () {
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

  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }

  // 加载数据
  fetchData = (srchTp = 1, pageSize = 20, pdNo = '', sort = '') => {
    const { cusId, cusRng, cusType, tmPrd, timePeriod } = this.props;
    this.fetchCusProductList({
      cusId,
      cusRng,
      cusType,
      tmPrd: tmPrd[timePeriod],
      current: 1,
      pageSize,
      paging: 1,
      total: -1,
      srchTp,
      pdNo,
      sort,
    });
  }

  assembleColumns = () => {
    const { columns = [], allColumns = [] } = this.state;
    const column = [{
      title: '序号',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      width: 80,
    }];
    for (let i = 0; i < allColumns.length; i++) {
      if (allColumns[i].valObjsivTp === '3' && columns[i].title === '产品名称') {
        columns[i].filterDropdown = ({ confirm }) => this.getFilterDropdown(confirm);
        columns[i].filtered = !!this.state.checkedGroup.length;
      }
    }
    column.push(...columns);
    return column;
  }

  /*
 * 参数 s :要处理的数据
 * 参数 n :保留的小数数量。不传值，则默认是2位小数
*/
  // percentData = (s, n) => {
  //   n = n > 0 && n <= 20 ? n : 2;
  //   s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
  //   let l = s.split('.')[0].split('').reverse();
  //   let r = s.split('.')[1];
  //   let t = '';
  //   for (let i = 0; i < l.length; i++) {
  //     t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
  //   }
  //   return t.split('').reverse().join('') + '.' + r;
  // }

  // 查询表头
  fetchColumns = async () => {
    await QueryOtherListDisplayColumn({
      srchScene: 4, // 2|产品详情列表;3|理财客户列表;4|理财客户列表弹窗
    }).then(res => {
      const { records = [] } = res;
      if (records.length > 0) {
        let index = 0;
        let item = {};
        const { cusType = '' } = this.props;
        const columnsData = records.map((i, o) => {
          if (cusType === '12') {
            if (i.dispCol === '交易金额(万)') {
              index = o;
              item = {
                title: '销售金额(万)',
                dataIndex: i.colCode.toLowerCase(),
                key: i.colCode,
                className: 'm-black',
                sorter: i.isOrd === '1' ? (a, b) => a[i.colCode] - b[i.colCode] : null,
                sortDirections: i.isOrd === '1' ? ['descend', 'ascend'] : null,
                render: (text) => this.renderColumns(text, i.ftFmtTp, i.colCode),
              };
            }
          } else {
            if (i.dispCol === '交易金额(万)') {
              index = o;
              item = {
                title: '交易金额(万)',
                dataIndex: i.colCode.toLowerCase(),
                key: i.colCode,
                className: 'm-black',
                sorter: i.isOrd === '1' ? (a, b) => a[i.colCode] - b[i.colCode] : null,
                sortDirections: i.isOrd === '1' ? ['descend', 'ascend'] : null,
                render: (text) => this.renderColumns(text, i.ftFmtTp, i.colCode),
              };
            }
          }
          return {
            title: i.dispCol,
            dataIndex: i.colCode.toLowerCase(),
            key: i.colCode,
            className: 'm-black',
            sorter: i.isOrd === '1' ? (a, b) => a[i.colCode] - b[i.colCode] : null,
            sortDirections: i.isOrd === '1' ? ['descend', 'ascend'] : null,
            render: (text) => this.renderColumns(text, i.ftFmtTp, i.colCode),
          };
        });
        columnsData.splice(index, 1);
        columnsData.splice(2, 0, item);
        this.setState({
          columns: columnsData,
          allColumns: records,
        });
      }
    }).catch(err => {
      message.error(err.note || err.message);
    });
  }

  fetchCusProductList = (payload) => {
    const { srchTp, pageSize } = payload;
    this.setState({ loading: true });
    FetchCusProductList({
      ...payload,
    }).then((response) => {
      const { records, code = 0, statcData, total } = response;
      if (code > 0) {
        if (srchTp === 1) {
          for (let j = 0; j < records.length; j++) {
            records[j]['no'] = j + 1;
          }
          this.setState({
            dataSource: records,
            market_value: statcData[0].idxVal,
            transaction_amount: statcData[1].idxVal,
            average_market_value: statcData[2].idxVal,
            total,
            loading: false,
          });
        } else {
          this.setState({
            checkboxData: records,
            loading: false,
          });
        }
        if (pageSize >= total) {
          this.setState({ hasMore: false });
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  renderColumns = (text, type, colCode) => { // ftFmtTp 1直接展示；2|正红负绿
    // if (type === '1') {
    //   return <div className='m-darkgray'>{text}</div>;
    // } else if (Number(text) > 0) {
    //   return <div style={{ color: 'red' }}>{text}</div>;
    // } else {
    //   return <div style={{ color: 'green' }}>{text}</div>;
    // }
    if(text && text.includes('.')) { //如果是浮点数
      let textArr = text.split('.');
      let textOne = textArr[0];
      let textSecond = text.substring(text.indexOf('.') + 1, text.indexOf('.') + 3);
      if (type === '1') {
        if (colCode !== 'PD_CODE') {
          return <Popover content={<span className='m-darkgray'>{text}</span>}><span className='m-darkgray'>{textOne + '.' + textSecond}</span></Popover>;
        } else {
          return <div className='m-darkgray'>{text || '--'}</div>;
        }
      } else {
        if (colCode !== 'PD_CODE') {
          return <Popover content={<span className={Number.parseFloat(text) > 0 ? 'pink' : Number.parseFloat(text) < 0 ? 'green' : 'm-darkgray'}>{text}</span>}><span className={Number.parseFloat(text) > 0 ? 'pink' : Number.parseFloat(text) < 0 ? 'green' : 'm-darkgray'}>{textOne + '.' + textSecond}</span></Popover>;
        } else {
          return <div className='m-darkgray'>{text || '--'}</div>;
        }
      }
    } else {
      return <div className='m-darkgray'>{text}</div>;
    }
  }

  // 滚动条触底
  handleInfiniteOnLoad = () => {
    let { pageSize = 0 } = this.state;
    pageSize += 10;
    this.fetchData(2, pageSize);
  }

  getFilterDropdown = (confirm) => (
    <div style={{ width: '18rem', position: 'relative' }}>
      <Checkbox className={styles.selectAll} style={{ padding: '15px' }} indeterminate={this.state.indeterminate} checked={this.state.checked} onChange={this.handleCheckboxChange}>全选</Checkbox>
      <Divider style={{ margin: 0 }} />
      <Spin spinning={this.state.loading && this.state.hasMore}>
        <Scrollbars style={{ height: '16rem' }}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}
          >
            {
              this.state.checkboxData.length > 0 ? this.state.checkboxData.map((item, index) => {
                return (
                  <div style={{ padding: '10px 20px' }}>
                    <Checkbox className={styles.options} checked={this.state.checkedGroup.includes(index) ? true : false} onChange={() => { this.handleChange(index); }}>{item.pd_nm}&nbsp;{item.pd_code}</Checkbox>
                  </div>
                );
              }) : <span>暂无数据</span>
            }
          </InfiniteScroll>
        </Scrollbars>
      </Spin>
      <div style={{ padding: '10px 14px', textAlign: 'right', borderTop: '1px solid #EAEEF2' }}>
        <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px' }} onClick={this.handleClear}>清 空</Button>
        <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={() => { confirm(); this.handleOk(); }}>确 定</Button>
      </div>
    </div >
  )
  // 清空选中筛选条
  handleClear = () => {
    this.setState({
      checkedGroup: [],
      checked: false,
      indeterminate: false,
      pdNo: '',
    });
  }
  // 表头筛选确定按钮
  handleOk = () => {
    const { pdNo } = this.state;
    this.fetchData(1, 15, pdNo);
  }
  // 初始化
  init = () => {
    this.fetchData();
    this.setState({
      checkedGroup: [],
      indeterminate: false,
      checked: false,
      input: null,
      pdNo: '',
    });
  }

  // 列筛选里多选框选中
  handleChange = (index, dataIndex) => {
    // console.log(index,'index');
    let { checkedGroup, indeterminate = false, checked, hasMore, checkboxData, pdNo } = this.state;
    // 选中样式
    if (checkedGroup.indexOf(index) !== -1) {
      checkedGroup.splice(checkedGroup.indexOf(index), 1);
    } else {
      checkedGroup.push(index);
    }
    if (checkedGroup.length === 0) {
      indeterminate = false;
      checked = false;
    } else if (checkedGroup.length === checkboxData.length && !hasMore) {
      indeterminate = false;
      checked = true;
    } else {
      indeterminate = true;
      checked = false;
    }
    // 选中的数据
    if (checked) {
      pdNo = '';
    } else {
      const pdId = [];
      for (let item in checkedGroup) {
        pdId.push(checkboxData[checkedGroup[item]].pd_id);
      }
      pdNo = pdId.join(',');
    }
    // this.fetchData(1, 15, pdNo);
    this.setState({
      pdNo, checkedGroup, indeterminate, checked,
    });
  }

  // "全选"多选框改变
  handleCheckboxChange = (dataIndex) => {
    let { checked, checkedGroup, pdNo, checkboxData } = this.state;
    checked = !checked;
    if (checked) {
      checkedGroup = [...new Array(checkboxData.length).keys()];
      pdNo = '';
    } else {
      checkedGroup = [];
      pdNo = '';
    }
    // this.fetchData(1, 15, pdNo);
    this.setState({ checked, indeterminate: false, checkedGroup, pdNo });
  }

  // 格式化数据/单位
  formatValue = (value) => {
    let dw = '元';
    if (parseFloat(value) >= 10000000000) {
      value = (parseFloat(value) / 100000000).toFixed(2);
      dw = '亿';
    } else if (parseFloat(value) < 10000000000 && parseFloat(value) >= 1000000) {
      value = (parseFloat(value) / 10000).toFixed(2);
      dw = '万';
    }
    return { value, dw };
  }

  // 千分位处理
  handleQfNumberStr = (s, fixNum) => {
    let text = String(s);
    if (!text) {
      return '';
    }
    text = parseFloat(text).toFixed(fixNum);
    const arr = text.split('.');
    const [zs = '', xs] = arr;
    const re = /(?=(?!(\b))(\d{3})+$)/g;
    let str = zs.replace(re, ',');
    if (xs) {
      str = `${str}.${xs}`;
    }
    return str;
  }

  //明细排序
  handlePagerChange = (pagination, filters, sorter) => {
    const { pageSize: page, pdNo = '' } = this.state;
    let { current, pageSize } = pagination;
    if (page !== pageSize) {
      current = 1;              //pageSize发送变化则页码置为1
    }
    const { columnKey = '', order = '' } = sorter;
    const key = columnKey;
    const val = order === 'ascend' ? 'asc' : 'desc';
    let sort = '';
    if (key !== '' && val !== '') {
      sort = key + ' ' + val;
    }
    this.fetchData(1, pageSize, pdNo, sort);
    this.setState({ current, pageSize, sort });

  }

  // 导出
  showConfirm = () => {
    const {
      exportPercentUtl = '/api/customerAggs/v2/exportPercent', // 点击导出后系统处理进度信息
    } = this.props;
    const { total = 0, columns, current, pageSize, pdNo, sort } = this.state;
    if (total <= 0) {
      Modal.info({ content: '无数据可导出!' });
      return false;
    }
    const _props = this.props;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk () {
        const { cusName, cusId, cusRng, cusType, tmPrd, timePeriod } = _props;
        const tableHeaderCodes = columns.map(item => item.dataIndex).join(',');
        const headerInfo = columns.map(item => item.title).join(',');
        const cusProductListModel = {
          cusId,
          cusRng,
          cusType,
          tmPrd: tmPrd[timePeriod],
          current,
          pageSize,
          paging: 1,
          total,
          srchTp: 1,
          pdNo,
          sort,
        };
        const exportPayload = JSON.stringify({
          tableHeaderCodes,
          headerInfo,
          cusProductListModel,
          fileName: `${cusName}(${cusId})理财持仓明细`,
        });
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
        form1.action = cusProductListExport;

        // 对该 form 执行提交
        form1.submit();
        // 删除该 form
        document.getElementById('m_iframe').removeChild(form1);
        if (total >= 10000 && typeof EventSource !== 'undefined') {
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
  };

  render() {
    const { cusType = '' } = this.props;
    let { dataSource, loading, market_value, transaction_amount, average_market_value, total, current, pageSize, columns = [], modalVisible, percent } = this.state;
    market_value = this.formatValue(market_value);
    transaction_amount = this.formatValue(transaction_amount);
    average_market_value = this.formatValue(average_market_value);
    const tableProps = {
      className: styles.m_table,
      style: { padding: '2rem 2rem 4rem 2rem' },
      loading,
      dataSource,
      columns,
      bordered: true,
      onChange: this.handlePagerChange,
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: totals => `总共${totals}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'],
        total,
        current,
        pageSize,
        // onChange: this.handlePagerChange,
        // onShowSizeChange: this.handlePagerSizeChange,
      },
    };
    return (
      <Scrollbars autoHide autoHeight autoHeightMin={'20rem'} autoHeightMax={'55rem'} style={{ width: '100%' }} >
        <Row style={{ color: '#61698C', padding: '0 2.3%', fontSize: '16px', marginTop: '1rem' }} type='flex' align='middle' justify='space-between'>
          <Col>
            <span className="ax-tjsj-name">统计数据：</span>
            <span style={{ marginRight: '2rem' }}>上日市值：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(market_value, 'value', '--'))} </span> {lodash.get(market_value, 'dw', '元')}</span>
            <span style={{ marginRight: '2rem' }}>{cusType === '12' ? '销售金额' : '交易金额'}：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(transaction_amount, 'value', '--'))}</span> {lodash.get(transaction_amount, 'dw', '元')}</span>
            <span>日均保有：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(average_market_value, 'value', '--'))}</span> {lodash.get(average_market_value, 'dw', '元')}</span>
          </Col>
          <Col>
            <Button onClick={this.showConfirm} className="m-btn-radius m-btn-headColor" style={{ color: '#fff', background: '#244fff' }}>导出表格</Button>
            <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
            <Modal
              title="系统处理中,请稍候..."
              centered
              destroyOnClose
              closable={false}
              maskClosable={false}
              visible={modalVisible}
              footer={null}
            >
              <Row>
                <Col span={2}>进度:</Col>
                <Col span={22}><Progress percent={parseInt(percent, 10)} status={percent === '100' ? 'success' : 'active'} /></Col>
              </Row>
            </Modal>
          </Col>
        </Row>
        <Table {...tableProps} columns={this.assembleColumns()} />
      </Scrollbars>
    );
  }

}
export default DataTable;
