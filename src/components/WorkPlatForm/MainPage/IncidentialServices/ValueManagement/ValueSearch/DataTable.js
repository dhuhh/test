import React from 'react';
import { connect } from 'dva';
import { Card, Affix, Icon, Spin, Divider } from 'antd';
import { Link } from 'dva/router';
import BasicDataTable from '../../../../../Common/BasicDataTable';
import styles from './index.less';
import { prefix } from '../../../../../../utils/config';
import { EncryptBase64 } from '../../../../../Common/Encrypt';
import CustomerDistribute from '../customerDistribute';
import Manage from './Manage';
import Execute from '../../Common/Execute';
import Exports from '../../Common/Exports';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,

      scrollElement: null, // 滚动条容器
      // isHide: false, // 是否隐藏面板
      // height: 540, // 左侧表格的高度
      scrollWidth: document.body.offsetWidth, // 列表的宽度
      selectAll: false,
      selectedRowKeys: [], // 选中(未全选)/取消选中(全选)的rowkey值
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.reset();
    }
  }

  // 窗口大小改变的时候调整固定
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
    // let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    // height -= 100;
    this.setState({
      // height: this.state.isHide ? '100%' : height,
      scrollWidth: width,
    });
  }

  // 处理全屏(需要全屏显示DOM元素)
  // launchFullScreen = () => {
  //   // 先检测最标准的方法
  //   // 隐藏目录
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'global/hideMenu' });
  //   this.state.isHide = true;
  //   this.setState({
  //     isHide: true,
  //     scrollWidth: 0,
  //   });
  //   this.updateDimensions();
  // };

  // 退出全屏(需要全屏显示DOM元素)
  // exitFullScreen = () => {
  //   // 显示目录
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'global/showMenu' });
  //   this.state.isHide = false;
  //   this.setState({
  //     isHide: false,
  //     scrollWidth: document.body.offsetWidth,
  //   });
  //   this.updateDimensions();
  // }

  _setScrollElement = (scrollElement) => {
    if (scrollElement) {
      this.setState({
        scrollElement,
      });
    }
  }

  // 选择状态改变时的操作
  onSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
    this.setState({
      selectAll: currentSelectAll,
      selectedRowKeys: currentSelectedRowKeys,
    });
  }

  handlePagerChange = (current, pageSize) => {
    const { loadChangePage, setData } = this.props;
    const pageState = {
      ...this.props.pageState,
      current,
      pageSize,
    };
    if (setData) {
      setData('pageState', pageState);
    }
    if (loadChangePage) {
      loadChangePage(pageState);
    }
  }

  refresh = (current, pageSize) => {
    this.setState({
      selectAll: false,
      selectedRowKeys: [],
    });
    this.handlePagerChange(current, pageSize);
  }

  handlePagerSizeChange = (current, pageSize) => {
    this.handlePagerChange(1, pageSize);
  }

  fetchDataSource = () => {
    const { data } = this.props;
    let dataSource = [];
    if (data.records.length !== 0) {
      data.records.forEach((item, index) => {
        dataSource.push({
          key: index,
          ...item,
        });
      });
    }
    return dataSource;
  }

  reset = () => {
    this.setState({
      selectAll: false,
      selectedRowKeys: [],
    });
  }

  render() {
    const { loaded = false, selectAll, selectedRowKeys = [], scrollWidth } = this.state;
    const { pageState: { pageSize = 5, current }, data: { total = 0 }, loading = true, payload, data, dictionary = {}, authorities = {} ,newPayload: { intTp: intrptType = '' } } = this.props;
    const columns = [
      {
        title: '客户姓名',
        dataIndex: 'custNm',
        key: '客户姓名',
        align: 'center',
        width: 120,
        render: (text,record)=>{
          // if(['3','4','5'].includes(intrptType)){
          return <Link to={`/customerPanorama/customerInfo?customerCode=${record.custNo}`} target='_blank'><div style={{ wordBreak: 'break-all', whiteSpace: 'normal', color: '#244FFF', cursor: 'pointer' }}>{text}</div></Link>;
          // }else{
          //   return text;
          // }
        },
      },
      {
        title: '手机',
        dataIndex: 'custPhn',
        key: '手机',
        align: 'center',
        ellipsis: true,
        width: 120,
      },
      {
        title: '中断类型',
        dataIndex: 'intTp',
        key: '中断类型',
        align: 'center',
        width: 120,
      },
      {
        title: '中断时间',
        dataIndex: 'intTm',
        key: '中断时间',
        align: 'center',
        width: 120,
        render: (text, record) => <div>{text.split(' ')[0]}<br />{text.split(' ')[1]}</div>,
      },
      {
        title: '中断时长(小时)',
        dataIndex: 'intrptDrtn',
        key: '中断时长(小时)',
        align: 'center',
        width: 120,
        // sorter: (a, b) => a.intrptDrtn - b.intrptDrtn,
      },
      {
        title: '下发时长(小时)',
        dataIndex: 'issueTn',
        key: '下发时长(小时)',
        align: 'center',
        width: 120,
        // sorter: (a, b) => a.intrptDrtn - b.intrptDrtn,
      },
      {
        title: '中断步骤',
        dataIndex: 'intStp',
        key: '中断步骤',
        align: 'center',
        width: 120,
        ellipsis: true,
      },
      {
        title: '开户部门',
        dataIndex: 'custOrg',
        key: '开户部门',
        align: 'center',
        width: 120,
        ellipsis: true,
      },
      {
        title: '渠道',
        dataIndex: 'custChnl',
        key: '渠道',
        align: 'center',
        width: 120,
        ellipsis: true,
      },
      {
        title: ['3','4','5'].includes(intrptType) ? '产品推荐人' : '开户推荐人',
        dataIndex: 'rcmdr',
        key: ['3','4','5'].includes(intrptType) ? '产品推荐人' : '开户推荐人',
        align: 'center',
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: '状态',
        align: 'center',
        width: 120,
      },
      {
        title: '转办来源',
        dataIndex: 'transfer',
        key: '转办来源',
        align: 'center',
        width: 120,
        ellipsis: true,
      },
      {
        title: '执行部门',
        dataIndex: 'excDept',
        key: '执行部门',
        align: 'center',
        width: 120,
        ellipsis: true,
      },
      {
        title: '执行人员',
        dataIndex: 'excUser',
        key: '执行人员',
        align: 'center',
        width: 120,
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: '操作',
        align: 'center',
        width: 120,
        fixed: 'right',
        render: (text, record) => {
          const params = {
            custNo: record.intId,
            customerNo: record.custNo,
            type: Number(intrptType),
            status: record.status,
            note: data.uuid || '',
            updateFlag: record.updateFlag,
            fundType: record.fundType,
          };
          const paramsStr = JSON.stringify(params);
          return !['0'].includes(intrptType) ? <div onClick={()=>{window.open(`${window.origin}/#/single/incidentialServices/prodBreak/${EncryptBase64(paramsStr)}`);}} style={{ position: 'relative',color: '#244FFF' }}>详情{record.updateFlag === '是' && <span style={{ position: 'absolute',width: 8,height: 8,borderRadius: '50%' ,background: '#EC3A48' ,top: -3 }}></span>}</div> : <Link to={`${prefix}/single/incidentialServices/customerBreak/${EncryptBase64(paramsStr)}`} target="_blank" >详情</Link>;
        },
      },
    ];
    if(!['0'].includes(intrptType)){
      columns.unshift({
        title: '客户号',
        dataIndex: 'custNo',
        key: '客户号',
        align: 'center',
        width: 120,
      },);
      if(intrptType === '5'){
        columns.splice(3,0,{
          title: '客户类型',
          dataIndex: 'custTp',
          key: '客户类型',
          align: 'center',
          width: 120,
        },
        {
          title: '客户等级',
          dataIndex: 'custLv',
          key: '客户等级',
          align: 'center',
          width: 120,
        },);
        columns.splice(13,0,{
          title: '服务关系',
          dataIndex: 'fwgx',
          key: '服务关系',
          align: 'center',
          width: 120,
          ellipsis: true,
        },{
          title: '开发关系',
          dataIndex: 'kfgx',
          key: '开发关系',
          align: 'center',
          width: 120,
          ellipsis: true,
        },);
      }else if(['6','7'].includes(intrptType)){
        columns.splice(3,0,{
          title: '客户等级',
          dataIndex: 'custLv',
          key: '客户等级',
          align: 'center',
          width: 120,
        },);
        columns.splice(11,1);
        ['6'].includes(intrptType) ? columns.splice(5,0,{
          title: '入金失败金额(元)',
          dataIndex: 'bankAmt',
          key: '入金失败金额(元)',
          align: 'center',
          ellipsis: true,
          width: 130,
        },{
          title: '中断原因',
          dataIndex: 'custEr',
          key: '中断原因',
          align: 'center',
          ellipsis: true,
          width: 200,
        },) : columns.splice(5,0,{
          title: '业务类型',
          dataIndex: 'opsType',
          key: '业务类型',
          align: 'center',
          ellipsis: true,
          width: 150,
        });
      }else if(['8'].includes(intrptType)){
        columns.splice(3,0,{
          title: '策略组合类型',
          dataIndex: 'strategyType',
          key: '策略组合类型',
          align: 'center',
          ellipsis: true,
          width: 150,
        },{
          title: '客户等级',
          dataIndex: 'custLv',
          key: '客户等级',
          align: 'center',
          width: 120,
        },);
        columns.splice(5,1);
        columns.splice(11,1,{
          title: '基金投顾推荐人',
          dataIndex: 'reference',
          key: '基金投顾推荐人',
          align: 'center',
          ellipsis: true,
          width: 120,
        },);
      }
    }
    const tableProps = {
      className: 'm-Card-Table',
      loading,
      rowKey: 'intId',
      scroll: { x: 1800 },
      dataSource: this.fetchDataSource(),
      columns,
      rowSelection: {
        type: 'checkbox',
        fixed: true,
        crossPageSelect: total !== 0, // checkbox开启跨页全选
        columnWidth: '68px',
        selectAll, // 是否全选
        selectedRowKeys,
        onChange: this.onSelectChange, // 选择状态改变时的操作
      },
      bordered: true,
      pagination: {
        className: 'm-bss-paging',
        showTotal: totals => {
          if (Math.ceil(totals / pageSize) === current) {
            const num = totals % pageSize;
            if (num) {
              return `显示${num}条 总共${totals}条`;
            }
          }
          return `显示${pageSize}条 总共${totals}条`;
        },
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        total,
        current,
        pageSize,
        onChange: this.handlePagerChange,
        onShowSizeChange: this.handlePagerSizeChange,
      },
    };
    // 计算选中的记录条数
    let selectedCount = 0;
    if (selectAll) {
      selectedCount = total - selectedRowKeys.length;
    } else {
      selectedCount = selectedRowKeys.length;
    }
    const { valueSearch } = authorities;
    return (
      <React.Fragment>
        <div ref={this._setScrollElement} style={{ padding: '0 2rem', paddingBottom: total <= 5 ? '2rem' : '' }}>
          <Divider style={{ margin: '0 0 15px' }} />
          <Card className="m-card myCard theme-padding">
            {
              this.state.scrollElement ? (
                <React.Fragment>
                  <Affix
                    target={() => document.getElementById('htmlContent')}
                    offsetTop={46}
                  >
                    <div className="ant-bss-card-head tr">
                      {/* <div className="dis-fx"> */}
                      {/* 操作按钮 */}
                      {valueSearch && valueSearch.includes('asign') && (<CustomerDistribute type={1} data={data} selectedCount={selectedCount} selectAll={selectAll} selectedRowKeys={selectedRowKeys} refresh={this.refresh} zdlx={intrptType}/>)} {/*1.分配；2.转办*/}
                      {valueSearch && valueSearch.includes('retreat') && (<Manage data={data} selectedCount={selectedCount} selectAll={selectAll} selectedRowKeys={selectedRowKeys} refresh={this.refresh} />)} {/*撤回*/}
                      {valueSearch && valueSearch.includes('exchange') && (<CustomerDistribute type={2} data={data} selectedCount={selectedCount} selectAll={selectAll} selectedRowKeys={selectedRowKeys} refresh={this.refresh} zdlx={intrptType}/>)} {/*1.分配；2.转办*/}
                      {valueSearch && valueSearch.includes('excute') && (<Execute data={data} selectedCount={selectedCount} selectAll={selectAll} selectedRowKeys={selectedRowKeys} dictionary={dictionary} refresh={this.refresh} type={intrptType}/>)} {/*执行*/}
                      {valueSearch && valueSearch.includes('export') && (<Exports displayColumns={columns} queryParameter={payload} selectedCount={selectedCount} selectAll={selectAll} selectedRowKeys={selectedRowKeys} exportsType='intrptCustLst' />)} {/*导出*/}
                      {/* 最大化 */}
                      {/* <Icon onClick={!this.state.isHide ? () => { this.launchFullScreen(document.documentElement); } : () => { this.exitFullScreen(); }} type={`${this.state.isHide ? 'fullscreen-exit' : 'fullscreen'}`} theme="outlined" twoToneColor="#eb2f96" title={`${this.state.isHide ? '还原默认大小' : '最大化'}`} style={{ position: 'absolute', cursor: 'pointer', right: '0.866rem', top: '1.75rem', fontSize: '1.866rem', color: '#244FFF' }} /> */}
                      {/* </div> */}
                    </div>
                  </Affix>
                  {/* 表格 */}
                  <div className={`${styles.m_table}`} style={{ overflowX: 'hidden' }}>
                    {
                      loaded && columns.length > 0 ? <div><BasicDataTable {...tableProps} /></div> : <div style={{ textAlign: 'center', padding: '5rem' }}><Spin /></div>
                    }
                  </div>
                </React.Fragment>
              ) : <div style={{ textAlign: 'center', padding: '5rem' }}><Spin /></div>
            }
          </Card>
        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  global,
}))(DataTable);
