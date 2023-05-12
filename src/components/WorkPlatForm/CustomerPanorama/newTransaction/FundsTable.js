import React, { Component } from 'react';
import { Button, Divider, message, Modal } from 'antd';
import BasicDataTable from '$common/BasicDataTable';
import { QueryFundInvestmentAccount } from '$services/customerPanorama';
import config from '$utils/config';
import styles from './index.less';
import { newClickSensors, newViewSensors } from "$utils/newSensors";

const { api } = config;
const {
  customerPanorama: {
    queryFundInvestmentAccountExport,
  } } = api;

class FundsTable extends Component {
  state = {
    loading: false,
    current: 1,
    pageSize: 10,
    total: 0,
    dataSource: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // 查询列表
    if (prevProps.isSearchType !== this.props.isSearchType || prevProps.fetchStrategyName !== this.props.fetchStrategyName ||
      prevProps.tjDateCopy[0] !== this.props.tjDateCopy[0] || prevProps.tjDateCopy[1] !== this.props.tjDateCopy[1]) {
      this.fetchData();
    }
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

  getColumns = () => {
    const { isSearchType } = this.props;
    let columns = [];
    if (Number(isSearchType) === 1) {
      columns = [
        { title: '交易日期', dataIndex: 'profitDate' },
        { title: '策略名称', dataIndex: 'strategyName' },
        { title: '交易类型', dataIndex: 'profitType' },
        { title: '金额', dataIndex: 'money' },
        { title: '手续费', dataIndex: 'serviceCharge' },
      ];
    } else {
      columns = [
        { title: '策略名称', dataIndex: 'strategyName' },
        { title: '转入资金', dataIndex: 'inMoney' },
        { title: '转出资金', dataIndex: 'outMoney' },
        { title: '应计服务费', dataIndex: 'accrued' },
      ];
    }
    return columns;
  }

  fetchData = () => {
    const { customerCode, isSearchType, tjDateCopy, fetchStrategyName } = this.props;
    const { current, pageSize } = this.state;
    const params = {
      accnNo: customerCode,
      strategyCode: fetchStrategyName,
      istotal: Number(isSearchType),
      beginDate: Number(tjDateCopy[0].format('YYYYMMDD')),
      endDate: Number(tjDateCopy[1].format('YYYYMMDD')),
      paging: 1,
      current,
      pageSize,
    };
    this.setState({ loading: true });
    QueryFundInvestmentAccount(params).then((res) => {
      const { records = [], total = 0 } = res;
      this.setState({ dataSource: records.map((item, index) => ({ ...item, key: index })), total, loading: false });
    }).catch((error) => message.error(error.note || error.message));
  }

  pageChange = (current, pageSize) => {
    this.setState(( current, pageSize ), () => {
      this.fetchData();
    });
  }

  export = () => {
    newClickSensors({
      third_module: "交易",
      ax_page_name: "成交流水",
      ax_button_name: "导出次数",
    });
    const total = this.state.total;
    if (total <= 0) {
      Modal.info({ content: '当前无数据导出!' });
      return false;
    }
    if (total > 50000) {
      Modal.info({ content: '导出数据不能超过5万条!' });
      return;
    }
    // 生成uuid
    const guid = () => {
      const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
    };
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = queryFundInvestmentAccountExport ;
    const uuid = guid(); // 获取唯一识别码
    const _this = this;
    const columns = this.getColumns();
    const { customerCode, isSearchType, tjDateCopy, fetchStrategyName } = this.props;
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${total}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let tableHeaderCodes = columns.map(item => item.dataIndex).join(',');
        let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key).join(',');
        // 查询条件
        let getAchievementAnalysisModel = {
          accnNo: customerCode,
          strategyCode: fetchStrategyName,
          istotal: Number(isSearchType),
          beginDate: Number(tjDateCopy[0].format('YYYYMMDD')),
          endDate: Number(tjDateCopy[1].format('YYYYMMDD')),
        };
        const exportPayload = JSON.stringify({
          tableHeaderCodes,
          headerInfo,
          getAchievementAnalysisModel,
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
    const { loading = false, dataSource = [], current, pageSize, total } = this.state;
    return (
      <div className={styles.list}>
        <div className={styles.listTitle}>
          <div style={{ fontSize: 16, color: ' #1A2243', fontWeight: 500 }}>成交流水</div>
          <Button style={{ width: 88, height: 30 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>
        </div>
        <Divider style={{ margin: '0 0 16px 0' }}></Divider>
        <BasicDataTable
          rowKey='key'
          loading={loading}
          style={{ marginBottom: '10px' }}
          className={`${styles.table}`}
          dataSource={dataSource}
          columns={this.getColumns()}
          pagination={{
            className: `${styles.pagination} ${styles.smallPagination}`,
            size: 'small',
            showSizeChanger: true,
            showQuickJumper: true,
            hideOnSinglePage: false,
            current,
            pageSize,
            // showTotal: v => `共${v}条`,
            defaultCurrent: 1,
            total,
            onChange: this.pageChange,
            onShowSizeChange: this.handlePageSizeChange,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTitle: true,
          }}
          // scroll={{ x: true, y: true }}
        />
        <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
      </div>
    );
  }
}

export default FundsTable;