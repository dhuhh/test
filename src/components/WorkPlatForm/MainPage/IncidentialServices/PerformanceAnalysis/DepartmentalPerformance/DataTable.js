import React from 'react';
import { Divider, Pagination, Tooltip, Icon, Modal } from 'antd';
import BasicDataTable from '../../../../../Common/BasicDataTable';
import Exports from '../../Common/Exports';
import CustomerModal from './CustomerModal';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: '',
      dataSource: [],
      modalVisible: false,
      record: {},
    };
  }

  componentDidMount() {
    const { data: { records = [] }, totalData = [] } = this.props;
    this.getDataSource(records, totalData);
  }

  componentWillReceiveProps(nextProps) {
    const { data: { records = [] }, totalData = [] } = nextProps;
    if (nextProps.data !== this.props.data || totalData !== this.props.totalData) {
      this.setState({ sortOrder: '' });
      this.getDataSource(records, totalData);
    }
  }

  getDataSource = (data, totalData) => {
    let dataSource = [];
    if (data.length !== 0) {
      dataSource = [...totalData];
      data.forEach((item, index) => {
        dataSource.push({
          key: index,
          ...item,
        });
      });
    }
    this.setState({ dataSource });
  }

  // 选择状态改变时的操作
  onSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
    this.setState({
      selectAll: currentSelectAll,
      selectedRowKeys: currentSelectedRowKeys,
    });
  }

  handlePagerChange = (current, pageSize) => {
    const { loadChangePage } = this.props;
    const pageState = {
      ...this.props.pageState,
      current,
      pageSize,
    };
    if (loadChangePage) {
      loadChangePage(pageState);
    }
  }

  handlePagerSizeChange = (current, pageSize) => {
    this.handlePagerChange(1, pageSize);
  }

  reWriteTitle = () => {
    const { sortOrder } = this.state;
    let tip = '点击升序';
    if (sortOrder === 'ascend') {
      tip = '点击降序';
    } else if (sortOrder === 'descend') {
      tip = '取消排序';
    }
    return (
      <Tooltip title={tip}>
        <span>召回率</span>
        <span className='ant-table-column-sorter'>
          <div className='ant-table-column-sorter-inner ant-table-column-sorter-inner-full'>
            <Icon type="caret-up" className={`ant-table-column-sorter-up ${sortOrder === 'ascend' ? 'on' : 'off'}`} />
            <Icon type="caret-down" className={`ant-table-column-sorter-down ${sortOrder === 'descend' ? 'on' : 'off'}`} />
          </div>
        </span>
      </Tooltip>
    );
  }

  handleClickHeader = () => {
    const { sortOrder } = this.state;
    const { data, totalData } = this.props;
    return {
      onClick: () => {
        let sort = '';
        let ret = [...data.records];
        if (sortOrder === '') {
          sort = 'ascend';
          ret = ret.sort((a, b) => parseFloat(a.zhl) > parseFloat(b.zhl) ? 1 : -1);
          this.getDataSource(ret, totalData);
        } else if (sortOrder === 'ascend') {
          sort = 'descend';
          ret = ret.sort((a, b) => parseFloat(a.zhl) > parseFloat(b.zhl) ? -1 : 1);
          this.getDataSource(ret, totalData);
        } else {
          this.getDataSource(data.records, totalData);
        }
        this.setState({
          sortOrder: sort,
        });
      },
    };
  }

  render() {
    const { pageState: { pageSize = 5, current }, payload, data: { records = [], total = 0 }, loading = true ,newPayload: { zdlx = '' } } = this.props;
    let columns = [
      {
        title: '执行部门',
        dataIndex: 'zxbm',
        key: '执行部门',
        align: 'center',
        render: (text, record) => <div className={record.zxbm === '总计' ? 'm-darkred' : 'm-darkgray'} >{text}</div>,
      },
      {
        title: '分配客户数',
        dataIndex: 'fpkhs',
        key: '分配客户数',
        align: 'center',
      },
      {
        title: '执行客户数',
        dataIndex: 'zxkhs',
        key: '执行客户数',
        align: 'center',
        render: (text, record) => <div style={{ color: '#244FFF' }} onClick={() => { this.setState({ modalVisible: true, record }); }}>{text}</div>,
      },
      {
        title: '执行率',
        dataIndex: 'zxl',
        key: '执行率',
        align: 'center',
        // render: (text) => <div>{Number(text * 100).toFixed(2)}%</div>,
      },
      {
        title: '自动撤回客户数',
        dataIndex: 'chkhs',
        key: '自动撤回客户数',
        align: 'center',
      },
      {
        title: '自动撤回率',
        dataIndex: 'chl',
        key: '自动撤回率',
        align: 'center',
        // render: (text) => <div>{Number(text * 100).toFixed(2)}%</div>,
      },
      {
        title: '接通客户数',
        dataIndex: 'jtkhs',
        key: '接通客户数',
        align: 'center',
      },
      {
        title: '接通率',
        dataIndex: 'jtl',
        key: '接通率',
        align: 'center',
        // render: (text) => <div>{Number(text * 100).toFixed(2)}%</div>,
      },
      {
        title: ['3','4'].includes(zdlx) ? '意愿购买数' : ['6'].includes(zdlx) ? '意愿入金数' : ['7'].includes(zdlx) ? '意愿开通数' : '意愿开户数',
        dataIndex: 'yykhs',
        key: ['3','4'].includes(zdlx) ? '意愿购买数' : ['6'].includes(zdlx) ? '意愿入金数' : ['7'].includes(zdlx) ? '意愿开通数' : '意愿开户数',
        align: 'center',
      },
      {
        title: ['3','4'].includes(zdlx) ? '意愿购买率' : ['6'].includes(zdlx) ? '意愿入金率' : ['7'].includes(zdlx) ? '意愿开通率' : '意愿开户率',
        dataIndex: 'yykhl',
        key: ['3','4'].includes(zdlx) ? '意愿购买率' : ['6'].includes(zdlx) ? '意愿入金率' : ['7'].includes(zdlx) ? '意愿开通率' : '意愿开户率',
        align: 'center',
        // render: (text) => <div>{Number(text * 100).toFixed(2)}%</div>,
      },
      {
        title: '召回客户数',
        dataIndex: 'zhkhs',
        key: '召回客户数',
        align: 'center',
      },
      {
        title: () => this.reWriteTitle(),
        dataIndex: 'zhl',
        align: 'center',
        key: '召回率',
        // sorter: (a, b) => parseFloat(a.zhl) - parseFloat(b.zhl),
        className: 'ant-table-column-has-actions ant-table-column-has-sorters',
        onHeaderCell: () => this.handleClickHeader(),
        // render: (text) => <div>{Number(text * 100).toFixed(2)}%</div>,
      },
      {
        title: '有效户数',
        dataIndex: 'yxkhs',
        key: '有效户数',
        align: 'center',
      },
      {
        title: '中端富裕客户数',
        dataIndex: 'zdkhs',
        key: '中端富裕客户数',
        align: 'center',
      },
      {
        title: '有效户率',
        dataIndex: 'sucessRate',
        key: '有效户率',
        align: 'center',
        // width: 125,
        // render: (text) => <div>{Number(text * 100).toFixed(2)}%</div>,
      },
      // {
      //   title: <div className='lh18'><p>资产净流入</p><p>(开户一年内)</p></div>,
      //   dataIndex: 'zcjlr',
      //   key: '资产净流入(开户一年内)',
      //   align: 'center',
      // },
      {
        title: '累计交易量',
        dataIndex: 'jyl',
        key: '累计交易量',
        align: 'center',
      },
      {
        title: '累计总贡献',
        dataIndex: 'zgx',
        key: '累计总贡献',
        align: 'center',
      },
      // {
      //   title: '年化贡献',
      //   dataIndex: 'nhgx',
      //   key: '年化贡献',
      //   align: 'center',
      // },
      {
        title: '当前净资产',
        dataIndex: 'dqzzc',
        key: '当前净资产',
        align: 'center',
      },
      {
        title: '近一年资产峰值',
        dataIndex: 'zcfzjyn',
        align: 'center',
      },
    ];
    if(['3','4'].includes(zdlx)){
      columns.splice(15,4,{
        title: '签约交易量',
        dataIndex: 'qyjyl',
        align: 'center',
      },{
        title: '佣金收入',
        dataIndex: 'yjsr',
        align: 'center',
      },{
        title: '现金收入',
        dataIndex: 'xjsr',
        align: 'center',
      },{
        title: '签约总资产',
        dataIndex: 'qyzzc',
        align: 'center',
      });
    }else if(zdlx === '5'){
      columns.splice(12,7,{
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>公募基金累计购买金额</span>
            <Tooltip title='客户购买理财产品（判断召回成功）当天，购买的公募基金总额'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        dataIndex: 'gmjjgmje',
        key: '公募基金累计购买金额',
        align: 'center',
      },{
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>累计收入贡献</span>
            <Tooltip title='该客户购买公募基金总额对应的前期销售费用'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        dataIndex: 'gmjjsrgx',
        key: '累计收入贡献',
        align: 'center',
      },{
        title: (
          <div>
            <span style={{ paddingRight: 5 }}>新增理财客户数</span>
            <Tooltip title='该客户自断点日至召回成功日，根据当年投资偏好标签，从交易型客户转变为理财型客户或配置型客户，即为新增理财客户'><Icon type="question-circle" style={{ color: '#959CBA' }} /></Tooltip>
          </div>
        ),
        dataIndex: 'gmjjxzlc',
        key: '新增理财客户数',
        align: 'center',
      },);
      columns.splice(8,2);
    }else if(zdlx === '6'){
      columns.splice(12,7,{
        title: '召回入金金额',
        dataIndex: 'zhrjje',
        align: 'center',
      },{
        title: '召回资产占比',
        dataIndex: 'zhzczb',
        align: 'center',
      },{
        title: '服务贡献',
        dataIndex: 'fwgx',
        align: 'center',
      },{
        title: '入金交易量',
        dataIndex: 'rjjyl',
        align: 'center',
      });
    }else if(zdlx === '7'){
      columns.splice(12,7,{
        title: '召回业务交易量',
        dataIndex: 'zhywjyl',
        align: 'center',
      },{
        title: '召回业务贡献',
        dataIndex: 'zhywgx',
        align: 'center',
      });
      // columns.splice(8,2);
    }else if(zdlx === '8'){
      columns.splice(12,7,{
        title: '召回购买金额',
        dataIndex: 'zhrjje',
        align: 'center',
      },{
        title: '召回管理服务费',
        dataIndex: 'rjjyl',
        align: 'center',
      });
      columns.splice(8,2);
    }
    const tableProps = {
      className: 'm-Card-Table pt16',
      loading,
      rowKey: 'custNo',
      dataSource: this.state.dataSource,
      columns,
      bordered: true,
      pagination: false,
      // scroll: { x: true },
    };
    const paginationProps = {
      className: 'm-bss-paging tr pt24 pb24',
      showTotal: () => {
        return `显示${records.length}条 总共${total}条`;
      },
      // hideOnSinglePage: true,
      // showLessItems: true,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      total,
      current,
      pageSize,
      onChange: this.handlePagerChange,
      onShowSizeChange: this.handlePagerSizeChange,
    };
    return (
      <React.Fragment>
        <div className='tr' style={{ margin: '0 2rem', paddingBottom: total <= 5 ? '2rem' : '', position: 'relative' }}>
          <Divider style={{ margin: '0px 0 24px' }} />
          {/*导出*/}
          <Exports displayColumns={columns} queryParameter={payload} selectedCount={total} selectAll={true} selectedRowKeys='' exportsType='depPerfermReport' />
          <BasicDataTable {...tableProps} />
          <Pagination {...paginationProps} />
        </div>
        <Modal
          visible={this.state.modalVisible}
          title='客户明细'
          footer={null}
          onCancel={() => { this.setState({ modalVisible: false }); }}
          width={document.body.clientWidth > 1300 ? 1200 : document.body.clientWidth - 100}
          bodyStyle={{ padding: 0 }}
          centered
          destroyOnClose
        >
          <CustomerModal
            record={this.state.record}
            payload={this.props.payload}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
export default DataTable;
