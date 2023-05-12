import React, { Fragment } from 'react';
import { Table,Button,Divider,Radio,message,Modal } from 'antd';
import { history as router } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import lodash from 'lodash';
import config from '$utils/config';
import styles from './index.less';
import BasicDataTable from '$common/BasicDataTable';
import { QueryYuyueWater } from '$services/customerPanorama';
import { newClickSensors, newViewSensors } from "$utils/newSensors";

const { api } = config;
const {
  customerPanorama: {
    getAppointmentExport,
  } } = api;
class Commontable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagesize: 10,
      current: 1,
      TableData: [], // Table数据
      total: 0,
      radioValue: 1,
      customerCode: '',
      beginDate: '',
      endDate: '',
      loading: false,
    };
  }

  componentDidMount() {
    const { customerCode,yuyueFlow: { tjDate } } = this.props;
    this.setState({
      customerCode: this.props.customerCode,
      beginDate: tjDate[0].format('YYYYMMDD'),
      endDate: tjDate[1].format('YYYYMMDD'),
    },
    ()=>{
      this.fetchQueryYuyueWater();
    }
    );
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isResetCurrentPage !== this.props.isResetCurrentPage){
      this.setState({
        current: 1,
      });
    }
    if(nextProps.yuyueFlow.tjDateCopy[0] !== this.props.yuyueFlow.tjDateCopy[0] || nextProps.yuyueFlow.tjDateCopy[1] !== this.props.yuyueFlow.tjDateCopy[1] ){
      this.setState({
        beginDate: nextProps.yuyueFlow.tjDateCopy[0].format('YYYYMMDD'),
        endDate: nextProps.yuyueFlow.tjDateCopy[1].format('YYYYMMDD'),
      },
      ()=>{
        this.fetchQueryYuyueWater();
      }
      );
    }
  }

  fetchQueryYuyueWater = () => {
    this.setState({
      loading: true,
    });
    const { current,pagesize,beginDate,endDate,customerCode } = this.state;
    QueryYuyueWater({
      custNo: this.props.customerCode, // 客户号
      beginDate: moment(beginDate).format("YYYY-MM-DD"),// 开始时间
      endDate: moment(endDate).format("YYYY-MM-DD"), // 结束时间

      // "beginDate": "2020-01-01",
      // "custNo": "101380242",
      // "endDate": "2021-12-30",
    }).then((ret = {}) => {
      const { code = 0, records = [] ,total = 0 } = ret;
      if (code > 0 && records !== null) {
        this.setState({
          TableData: records,
          total,
          loading: false,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({
        loading: false,
      });
    });
  }

  // 翻页
  pageChange = (value) => {
    this.setState({ current: value }, () => {
      this.fetchQueryYuyueWater();
    });
  }
 // 改变每页展示条数
 handlePageSizeChange = (current, pagesize) => {
   this.setState({ current: 1, pagesize }, () => {
     this.fetchQueryYuyueWater();
   });
 }

    // radio
    onChange=(e)=>{
      this.setState({
        radioValue: e.target.value,
      });
    }

    getColumnMonth=()=>[
      {
        title: '客户号',
        dataIndex: 'CUSTOMER',
        key: 'CUSTOMER',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.CUSTOMER} > {record.CUSTOMER || '--'} </div>;
        },
      },
      {
        title: '资金账户',
        dataIndex: 'ACCOUNT',
        key: 'ACCOUNT',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.ACCOUNT} > {record.ACCOUNT || '--'} </div>;
        },
      },

      {
        title: '交易行为',
        dataIndex: 'TRD_NAME',
        key: 'TRD_NAME',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.TRD_NAME} > {record.TRD_NAME || '--'} </div>;
        },
      },
      {
        title: '预委托状态',
        dataIndex: 'PR_ORDER_STATUS',
        key: 'PR_ORDER_STATUS',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.PR_ORDER_STATUS} > {record.PR_ORDER_STATUS || '--'} </div>;
        },
      },
      {
        title: '委托时间',
        dataIndex: 'CREATE_TIME',
        key: 'CREATE_TIME',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.CREATE_TIME} > {record.CREATE_TIME || '--'} </div>;
        },
      },
      {
        title: '产品代码',
        dataIndex: 'INST_CODE',
        key: 'INST_CODE',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.INST_CODE} > {record.INST_CODE || '--'} </div>;
        },
      },
      {
        title: '产品名称',
        dataIndex: 'INST_SNAME',
        key: 'INST_SNAME',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.INST_SNAME} > {record.INST_SNAME || '--'} </div>;
        },
      },
      {
        title: '委托金额',
        dataIndex: 'ORDER_AMT',
        key: 'ORDER_AMT',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.ORDER_AMT} > {record.ORDER_AMT || '--'} </div>;
        },
      },
      {
        title: '委托份额',
        dataIndex: 'ORDER_VOL',
        key: 'ORDER_VOL',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.ORDER_VOL} > {record.ORDER_VOL || '--'} </div>;
        },
      },
      {
        title: '委托结果描述',
        dataIndex: 'RESULT_TEXT',
        key: 'RESULT_TEXT',
        // width: 100,
        align: 'left',
        render: (text, record) => {
          return <div title={record.RESULT_TEXT} > {record.RESULT_TEXT || '--'} </div>;
        },
      },
    ]

    // 生成uuid
    guid = () => {
          const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
      return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
    }

    // 导出功能
    export = () => {
      newClickSensors({
        third_module: "交易",
        ax_page_name: "预约流水",
        ax_button_name: "预约流水导出次数"
      });
      const { isAccountClick,isMonth,isSearchType } = this.props;
      const { current,pagesize,beginDate,endDate,customerCode } = this.state;
      const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
      const action = getAppointmentExport ;
      const uuid = this.guid(); // 获取唯一识别码
      const _this = this;
      let total = this.state.total;
      if (total <= 0) {
        Modal.info({ content: '当前无数据导出!' });
        return false;
      }
      if (total > 50000) {
        Modal.info({ content: '导出数据不能超过5万条!' });
        return;
      }
      Modal.confirm({
        title: '提示：',
        content: `是否导出数据（共${total}条）？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          let columns = _this.getColumnMonth();
          let tableHeaderCodes = columns.map(item => item.dataIndex);
          tableHeaderCodes = tableHeaderCodes.join(',');
          let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key);
          headerInfo = headerInfo.join(',');
          // 查询条件
          let getAchievementAnalysisModel = {
            custNo: _this.props.customerCode, // 客户号
            beginDate: moment(beginDate).format("YYYY-MM-DD"),// 开始时间
            endDate: moment(endDate).format("YYYY-MM-DD"), // 结束时间
          };
          debugger;
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
      const { current , TableData ,pagesize, total,loading } = this.state;
      return (
        <Fragment>
          <div className={styles.list}>
            <div className={styles.listTitle}>
              <div style={{ fontSize: 16, color: ' #1A2243', fontWeight: 500 }}>预约流水</div>
              <Button style={{ width: 88, height: 30 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>
            </div>
            <Divider style={{ margin: '0 0 16px 0' }}></Divider>
            {
              this.props.isShowTotal ? (
                <Radio.Group onChange={this.onChange} defaultValue={1}>
                  <Radio value={1}>明细</Radio>
                  <Radio value={2}>汇总</Radio>
                </Radio.Group>
              ) : (
                null
              )
            }
            <BasicDataTable
              loading={loading}
              rowKey='key'
              style={{ marginBottom: '10px' }}
              className={`${styles.tableTwo} m-Card-Table`}
              dataSource={TableData}
              columns={ this.getColumnMonth()}
              pagination={{
                size: "small",
                className: `${styles.pagination} ${styles.smallPagination}`,
                hideOnSinglePage: false,
                showQuickJumper: true,
                pageSize: pagesize,
                showSizeChanger: true,
                // showTotal: v => `共${v}条`,
                defaultCurrent: 1,
                total: Number(total),
                onChange: this.pageChange,
                onShowSizeChange: this.handlePageSizeChange,
                current,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTitle: true,
              }}
              // scroll={{ x: true, y: true }}
            />
          </div>
          <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
        </Fragment>
      );
    }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Commontable);
