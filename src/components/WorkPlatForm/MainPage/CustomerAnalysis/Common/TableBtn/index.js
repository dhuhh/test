import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import styles from './index.less';
import { Modal ,Divider,message,Progress, Row,Col } from 'antd';
import { connect } from 'dva';
import config from '$utils/config';
const { api } = config;
const {
  customeranalysis: {
    queryTradingMergeAccountExport,
    queryAssetInflowAndOutflowExport,
    queryStockTransactionRankingExport,
    queryCusProfitAndLossDetailsExport,
    queryTradingOrdinaryAccountExport,
    queryTradingCreditAccountExport,
    queryTradingFinancialManageAccountExport,
    queryTradingOptionsAccountExport,
    queryAssetRankingExport,
    queryContributionRankingExport,
    queryMidRangeAffluenceAnalyseExport,
    queryIndividualStockRankingExport,
    queryPositionRankingExport,
    queryTurnoverRankingExport
  } } = api;

class TableBtn extends Component {
  state={
    visible: false,
    data: [],
    modalVisible: false,
    percent: 0,
    c4Visible: false,
    c4Type: undefined,
  }
  componentDidMount(){
    window.addEventListener('message', (e) => {
      const { page, action, success } = e.data;
      if (action === 'closeModal') {
        this.setState({ c4Visible: false });
      }
    });
  }

  handleCancelC4 = () => {
    this.setState({
      c4Visible: false,
    });
  };
  showModalC4 = (type) => {
    const { sysParam,total,selectAll,selectedRows,md5 = '205B43C345444C2DEE3087918F3429D0' } = this.props;
    let showTotal = 0;
    if(selectAll && selectedRows.length > 0) showTotal = total - selectedRows.length;
    if(selectAll && selectedRows.length === 0) showTotal = total;
    if(!selectAll) showTotal = selectedRows.length; 
    const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
    let url = '';
    if((!selectAll && selectedRows.length === 0) || (selectAll && selectedRows.length === total)){
      message.info('请先选择客户');
    }else{
      if(type === 1){
        url = `${serverName}/bss/ncrm/ncustomer/customerHandle/customerLabels/page/customerDBQ.sdo?allSelected=${selectAll}&allSelectedDatas=${selectedRows.map(item=>item.custId || item.id).join(',')}&fromToken=${md5}`;
      }else if(type === 2){
        url = `${serverName}/bss/newMsg/page/sendSingle.sdo?msgType=2&id=${selectedRows.map(item=>item.custId || item.id).join(',')}&sttgCode=CUST_LST&allSelDatas=${selectedRows.map(item=>item.custId || item.id).join(',')}&allSel=${selectAll}&fromToken=${md5}`;
      }else if(type === 3){
        url = `${serverName}/bss/ncrm/ncustomer/customerHandle/customerServiceLogs/page/customerFW.sdo?allSelected=${selectAll}&allSelectedDatas=${selectedRows.map(item=>item.custId || item.id).join(',')}&fromToken=${md5}`;
      }else if(type === 4){
        url = `${serverName}/bss/ncrm/ncustomer/customerHandle/customerGroups/page/index.sdo?allSelected=${selectAll}&allSelectedDatas=${selectedRows.map(item=>item.custId || item.id).join(',')}&fromToken=${md5}&selectedCount=${showTotal}`;
      }
      console.log(url);
      this.setState({
        c4Url: url,
        c4Visible: true,
        c4Type: type,
      });
    }
  };

  exportApi = (type)=>{
    switch(type){
      case 1: return queryTradingMergeAccountExport; // 交易量排行-合并账户
      case 2: return queryAssetInflowAndOutflowExport; // 客户资产流入流出
      case 3: return queryStockTransactionRankingExport; // 个股成交排行
      case 4: return queryCusProfitAndLossDetailsExport; // 账户盈亏排行
      case 5: return queryTradingOrdinaryAccountExport; // 交易量排行-普通账户
      case 6: return queryTradingCreditAccountExport; // 交易量排行-信用账户
      case 7: return queryTradingFinancialManageAccountExport; // 交易量排行-理财账户
      case 8: return queryTradingOptionsAccountExport; // 交易量排行-股票期权账户
      case 9: return queryAssetRankingExport; // 资产排行
      case 10: return queryContributionRankingExport; // 贡献排行
      case 11: return queryMidRangeAffluenceAnalyseExport; // 中端富裕客户分析
      case 12: return queryIndividualStockRankingExport; // 个股持仓排行
      case 13: return queryPositionRankingExport; // 单只证券持仓排行
      case 14: return queryTurnoverRankingExport; // 周转率排行
    }
  }
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }
  export = (flag) => {
    const {total,selectAll,selectedRows } = this.props;
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
    const action = this.exportApi(this.props.type);
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    if(total > 40000){
      Modal.info({ content: '导出数据不能超过4万条!' });
      return;
    }else if(total <= 0){
      Modal.info({ content: '暂无数据可导出!' });
      return;
    }else if((!selectAll && selectedRows.length === 0) || (selectAll && selectedRows.length === total)){
      Modal.info({ content: '请选择要导出的记录!'});
      return;
    }
    
    let showTotal = 0;
    if(selectAll && selectedRows.length > 0) showTotal = total - selectedRows.length;
    if(selectAll && selectedRows.length === 0) showTotal = total;
    if(!selectAll) showTotal = selectedRows.length; 
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（共${showTotal}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // 存在操作，则导出去掉操作列
        const tmpGetColumns = () => {
          const columnsList = _this.props.getColumns();
          if(columnsList.length > 0 && columnsList.slice(-1)[0].title === '操作') columnsList.splice(-1, 1);
          return columnsList;
        };
        let columns = tmpGetColumns();
        let headerCodeList = columns.map(item => item.dataIndex).filter(item=> item !== 'phoneNumber');
        let headerList = columns.map(item => typeof item.title === 'string' ? item.title : item.key).filter(item=> item !== '手机号');
        headerList = headerList.join(',');
        headerCodeList = headerCodeList.join(',');
        const resultParams = cloneDeep(_this.props.param);
        // 获取选择的客户号
        if(_this.props.iskhh) {
          resultParams['khh'] = _this.props.selectedRows.map((item) => item.custId || item.id).join();
          // 全选传1否则传0
          resultParams['isSelectAll'] = _this.props.selectAll ? 1 : 0;
        } else if(_this.props.isId) {
          if(_this.props.isId?.name === 'ID') {
            resultParams['exportId'] = _this.props.selectedRows.map((item) => item.ID).join();
          } else {
            resultParams['exportId'] = _this.props.selectedRows.map((item) => item.id).join();
          }
          // 全选传1否则传0
          resultParams['isSelectAll'] = _this.props.selectAll ? 1 : 0;
        } else if(_this.props.iskhhs) {
          resultParams['khhs'] = _this.props.selectedRows.map((item) => item.custCode).join();
          // 全选传1否则传0
          resultParams['isSelectAll'] = _this.props.selectAll ? 1 : 0;
        } else if(_this.props.iscusNoList){
          resultParams['cusNoList'] = _this.props.selectedRows.map((item) => item.custId || item.id).join();
          resultParams['isAll'] = _this.props.selectAll ? 1 : 0;
        } else {
          resultParams['cusNo'] = _this.props.selectedRows.map((item) => item.custId || item.id).join();
          resultParams['isAll'] = _this.props.selectAll ? 1 : 0;
        }
        if(resultParams?.paging) delete resultParams.paging;
        if(resultParams?.current) delete resultParams.current;
        if(resultParams?.pageSize) delete resultParams.pageSize;
        let param = resultParams;
        const exportPayload = JSON.stringify({
          tableHeaderCodes: headerCodeList,
          headerInfo: headerList,
          request: {...param},
        });
        // console.log('导出', exportPayload);
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
              eventSourcesIndex = _this.eventSources.length;
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
    const { data } = this.state;
    const notShowMessage = [3, 9, 10, 11, 12, 13, 14]; // 不显示消息发送的type类型
    const notShowGroup = [3, 9, 10, 11, 12, 13, 14]; // 不显示设置客户群的type类型
    // console.log('?????????????????', this.props.authorities)
    const { JSP_NCRM = [] } = this.props.authorities;
    const isXXFS = JSP_NCRM.includes('WDKH_FSDX'); // 是否有消息发送权限
    const isSZKHQ = JSP_NCRM.includes('WDKH_SZKHQ'); // 是否有设置客户群权限
    const isDC = JSP_NCRM.includes('WDKH_DC'); // 是否有导出权限
    
    return (
      <>
      <Divider style={{ margin: '0 0 20px 0' }}></Divider>
      <div className={styles.title}>
        <div className={styles.label}>
          <span style={{ height: 15, width: 4, background: '#244FFF', display: "inline-block", marginRight: 4 }}></span>
          <span style={{ fontSize: 16, color: '#1A2243', fontWeight: 'bold' }}>查询结果</span>
        </div>
        <div className={styles.btn}>
          {/* <div onClick={()=>this.showModalC4(1)}>打标签</div> */}
          { isXXFS && !notShowMessage.includes(this.props.type) && <div onClick={()=>this.showModalC4(2)}>消息发送</div> }
          { isSZKHQ && !notShowGroup.includes(this.props.type) && <div onClick={()=>this.showModalC4(4)}>设置客户群</div> }
          {/* <div onClick={()=>this.showModalC4(3)}>填写服务记录</div> */}
          {isDC && <div style={{ padding: '10px 40px', color: '#fff', background: '#244FFF' }} onClick={this.export}>导出</div>}
        </div>
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
          className={styles.modal}
          visible={this.state.c4Visible}
          footer={null}
          destroyOnClose
          onCancel={this.handleCancelC4}
          width={this.state.c4Type === 2 ? 819 : 686}
        >
          <iframe src={this.state.c4Url} title='c4' style={{ border: 'none' }} width='100%' height='564px'/>
        </Modal>
      </div>
      </>
    );
  }
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
  authorities: global.authorities,
}))(TableBtn);