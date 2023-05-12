import React from 'react';
import { Pagination, Tooltip, Icon, Button, Modal, message, Spin,Divider } from 'antd';
import BasicDataTable from '$common/BasicDataTable';
// import Exports from './exportFun'
import config from '$utils/config';
import styles from './index.less';
import { QueryCapitalFlowAccount } from '$services/customerPanorama';
import { newClickSensors, newViewSensors } from "$utils/newSensors";


const { api } = config;
const {
  customerPanorama: {
    getCapitalListExport, // 资金流水导出
  } } = api;
class checkTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectAll: false, // 是否全部选中
      selectedRowKeys: [], // 选中行
      visible: false,
      departmentInfo: [],
      pagesize: 10,
      current: 1,
      total: 0,
      id: {},
      loading: false,

      TableData: [],
    };
  }
  componentDidMount(){
    const { customerCode,zijinFlow: { accountTypeZijin2,tjDate } } = this.props;
    this.setState({
      customerCode: this.props.customerCode,
      beginDate: tjDate[0].format('YYYYMMDD'),
      endDate: tjDate[1].format('YYYYMMDD'),
      accountTypeZijin2,
      // accountTypeZijin2: 1,
    },
    ()=>{
      this.fetchFlowAccount();
    }
    );
  }

  componentWillReceiveProps(nextProps){
    // 只要触发查询就初始化部分参数
    if(nextProps.isResetCurrentPage !== this.props.isResetCurrentPage){
      this.setState({
        current: 1,
        selectedRowKeys: [], // 资金流水切换账户类型后默认不带有上次点选的内容
      });
    }
    if(nextProps.zijinFlow.accountTypeZijin2 !== this.props.zijinFlow.accountTypeZijin2 || nextProps.zijinFlow.tjDateCopy[0] !== this.props.zijinFlow.tjDateCopy[0] || nextProps.zijinFlow.tjDateCopy[1] !== this.props.zijinFlow.tjDateCopy[1] ){
      this.setState({
        accountTypeZijin2: nextProps.zijinFlow.accountTypeZijin2,
        beginDate: nextProps.zijinFlow.tjDateCopy[0].format('YYYYMMDD'),
        endDate: nextProps.zijinFlow.tjDateCopy[1].format('YYYYMMDD'),
      },
      ()=>{
        this.fetchFlowAccount();
      }
      );
    }
  }
  // 资金流水
  fetchFlowAccount = async () => {
    this.setState({
      loading: true,
      TableData: [],
    });
    const { current,pagesize,beginDate,endDate,accountTypeZijin2,customerCode } = this.state;
    await QueryCapitalFlowAccount({
      accnNo: this.props.customerCode, // 客户号
      pageNo: current,
      pageSize: pagesize ,
      beginDate: beginDate,// 开始时间
      endDate: endDate, // 结束时间
      istotal: '', // 是否全选
      accountType: accountTypeZijin2.toString(), // 账户类型
      idList: '',

    }).then((ret = {}) => {
      const { code = 0, records = [] ,total = 0 } = ret;
      if (code > 0) {
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
      this.fetchFlowAccount();
    });
  }
 // 改变每页展示条数
 handlePageSizeChange = (current, pagesize) => {
   this.setState({ current: 1, pagesize }, () => {
     this.fetchFlowAccount();
   });
 }

  getColumns = () => [
    {
      title: '交易日期',
      dataIndex: 'profitDate',
      key: 'profitDate',
      align: 'left',
      // width: 100,
      render: (text,record) => {
        return <div title = {record.profitDate} > { record.profitDate || '--'} </div>;
      } },
    {
      title: '客户号',
      dataIndex: 'custNumber',
      key: 'custNumber',
      // width: 100,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.custNumber} > { record.custNumber || '--'} </div>;
      },
    },
    {
      title: '资金账户',
      dataIndex: 'fundAccount',
      key: 'fundAccount',
      // width: 100,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.fundAccount} > {record.fundAccount || '--'} </div>;
      } },
    {
      title: '业务说明',
      dataIndex: 'description',
      key: 'description',
      // width: 150,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.description} > { record.description || '--'} </div>;
      },
    },

    {
      title: '发生金额',
      dataIndex: 'incurredAmount',
      key: 'incurredAmount',
      // width: 150,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.incurredAmount } > { record.incurredAmount || '--'} </div>;
      },
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      // width: 150,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.currency} > { record.currency || '--'} </div>;
      },
    },
    {
      title: '本次资金余额',
      dataIndex: 'fundAmount',
      key: 'fundAmount',
      align: 'left',
      render: (text,record) => {
        return <div title = {record.fundAmount} > { record.fundAmount || '--'} </div>;
      },
    },
  ]

  getColumns2 = () => [
    {
      title: '交易日期',
      dataIndex: 'profitDate',
      key: 'profitDate',
      align: 'left',
      // width: 100,
      render: (text,record) => {
        return <div title = {record.profitDate} > { record.profitDate || '--'} </div>;
      } },
    {
      title: '客户号',
      dataIndex: 'custNumber',
      key: 'custNumber',
      // width: 100,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.custNumber} > { record.custNumber || '--'} </div>;
      },
    },
    {
      title: '资金账户',
      dataIndex: 'fundAccount',
      key: 'fundAccount',
      // width: 100,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.fundAccount} > {record.fundAccount || '--'} </div>;
      } },
    {
      title: '业务说明',
      dataIndex: 'description',
      key: 'description',
      // width: 150,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.description} > { record.description || '--'} </div>;
      },
    },

    {
      title: '发生金额',
      dataIndex: 'incurredAmount',
      key: 'incurredAmount',
      // width: 150,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.incurredAmount } > { record.incurredAmount || '--'} </div>;
      },
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      // width: 150,
      align: 'left',
      render: (text,record) => {
        return <div title = {record.currency} > { record.currency || '--'} </div>;
      },
    },
    {
      title: '本次资金余额',
      dataIndex: 'fundAmount',
      key: 'fundAmount',
      align: 'left',
      render: (text,record) => {
        return <div title = {record.fundAmount} > { record.fundAmount || '--'} </div>;
      },
    },
    {
      title: '操作摘要',
      dataIndex: 'note',
      key: 'note',
      align: 'left',
      render: (text,record) => {
        return <div title = {record.note} > { record.note || '--'} </div>;
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
       ax_page_name: "资金流水",
       ax_button_name: "资金流水导出次数"
     });

     const { selectAll,selectedRowKeys , current,pagesize,beginDate,endDate,accountTypeZijin2,customerCode } = this.state;

     const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
     const action = getCapitalListExport; //
     const uuid = this.guid(); // 获取唯一识别码
     const _this = this;
     let total = this.state.total;
     let checkOutNumber = '';
     if(selectAll !== true){
       checkOutNumber = selectedRowKeys.length;
     }else {
       checkOutNumber = total;
     }
     if (selectAll !== true && checkOutNumber <= 0) {
       Modal.info({ content: '请至少选择一条数据或记录!' });
       return false;
     }
     if (checkOutNumber > 50000) {
       Modal.info({ content: '导出数据不能超过5万条!' });
       return;
     }
     Modal.confirm({
       title: '提示：',
       content: `是否导出数据（共${checkOutNumber}条）？`,
       okText: '确定',
       cancelText: '取消',
       onOk() {
         if(checkOutNumber > 50000){
           Modal.info({ content: '导出数据不能超过5万条!' });
           return null;
         }
         let columns = accountTypeZijin2 === 3 ? _this.getColumns2() : _this.getColumns();
         let tableHeaderCodes = columns.map(item => item.dataIndex);
         tableHeaderCodes = tableHeaderCodes.join(',');
         let headerInfo = columns.map(item => typeof item.title === 'string' ? item.title : item.key);
         headerInfo = headerInfo.join(',');
         // 查询条件
         let getAchievementAnalysisModel = {
           accnNo: _this.props.customerCode, // 客户号
           pageNo: current,
           pageSize: pagesize ,
           beginDate: beginDate,// 开始时间
           endDate: endDate, // 结束时间
           istotal: selectAll ? 2 : 1, // 是否全选 2是  1否
           accountType: accountTypeZijin2.toString(), // 账户类型
           idList: selectedRowKeys.join(','), // 选中/没有选中

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
     const { current,pagesize,total,accountTypeZijin2,loading,TableData } = this.state;
     const tableProps = {
       scroll: { x: true },
       rowKey: 'idList', // 单行选中标志 idList
       dataSource: TableData,
       columns: accountTypeZijin2 === 3 ? this.getColumns2() : this.getColumns(),
       className: 'm-Card-Table',
       pagination: false,
       rowSelection: {
         type: 'checkbox',
         crossPageSelect: true, // checkbox默认开启跨页全选
         selectAll: this.state.selectAll,
         selectedRowKeys: this.state.selectedRowKeys,
         onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {this.setState({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys });},
         getCheckboxProps: record => ({ disabled: record.status === 0,name: record.status }),
         fixed: true,
       },
     };

     return (
       <React.Fragment>
         <div className={styles.list}>
           <div className={styles.listTitle}>
             <div style={{ fontSize: 16, color: ' #1A2243', fontWeight: 500 }}>资金流水</div>
             <Button style={{ width: 88, height: 30 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => this.export()}>导出</Button>
           </div>
           <Divider style={{ margin: '0 0 16px 0' }}></Divider>
           <BasicDataTable
             rowKey='key'
             {...tableProps}
             style={{ marginBottom: '10px' }}
             className={`${styles.tableTwo} m-Card-Table`}
             loading={loading}
             pagination={{
               size: "small",
               className: `${styles.pagination} ${styles.smallPagination}`,
               hideOnSinglePage: false,
               showQuickJumper: true,
               pageSize: pagesize,
               showSizeChanger: true,
               defaultCurrent: 1,
               total: Number(total),
               onChange: this.pageChange,
               onShowSizeChange: this.handlePageSizeChange,
               current,
               pageSizeOptions: ['10', '20', '50', '100'],
               showTitle: true,
             }}
           />
         </div>
         <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
       </React.Fragment >
     );
   }
}
export default checkTable;
