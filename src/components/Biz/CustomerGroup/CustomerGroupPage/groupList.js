import React from 'react';
import classnames from 'classnames';
import { Card, Button, Pagination, message, Modal as AntdModal } from 'antd';
import { Link } from 'dva/router';
import BasicDataTable from '../../../Common/BasicDataTable';
import { getCusGroupCusList } from '../../../../services/customerbase/cusGroupCusList';
import { addCusGroupSeniorFunc } from '../../../../services/customersenior/addCusGroupSenior';
import SendMessage from '../../../WorkPlatForm/MainPage/Customer/MyCustomer/Buttons/SendMessage';
import CreatGroup from './CreatGroup';
import AddCustomer from './AddCustomer';
import styles from './index.less';
import { EncryptBase64 } from '../../../Common/Encrypt';

class GroupList extends React.Component {
  // constructor() {
  //   super();
  //   this.handleDelete = this.handleDelete.bind(this);
  // }
  state = {
    loading: false,
    pager: {
      current: 0,
      pageSize: 10,
    },
    selectDatas: {
      selectAll: false,
      selectedRowKeys: [],
    },
    dataSource: [],
    total: 0,
  }
  componentDidMount() {
    const { selectedKey = '' } = this.props;
    if (selectedKey !== '') {
      this.fetchTableDatas({ pager: { current: 1, pageSize: 10 }, selectedKey });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { selectedKey: lastSelectedKey = '' } = this.props;
    const { selectedKey: nextSelectedKey = '' } = nextProps;
    if (nextSelectedKey === '') {
      // 如果选中的客户群为空,那么就清空table数据
      this.setState({
        loading: false,
        pager: {
          current: 0,
          pageSize: 10,
        },
        selectDatas: {
          selectAll: false,
          selectedRowKeys: [],
        },
        dataSource: [],
        total: 0,
      });
    } else if (nextSelectedKey !== lastSelectedKey) {
      // 如果选中的客户群发生改变,那么选中信息清空,并且重新重新查询数据
      this.setState({
        loading: true,
        pager: {
          current: 1,
          pageSize: 10,
        },
        selectDatas: {
          selectAll: false,
          selectedRowKeys: [],
        },
        dataSource: [],
      });
      this.fetchTableDatas({ pager: { current: 1, pageSize: 10 }, selectedKey: nextSelectedKey });
    }
  }
  fetchTableDatas = ({
    pager: {
      current = this.state.pager.current,
      pageSize = this.state.pager.pageSize,
    },
    selectedKey = this.props.selectedKey,
  }) => {
    // 获取我的客户群客户列表数据
    this.setState({ loading: true });
    getCusGroupCusList({ paging: 1, current, pageSize, total: -1, sort: '', khqid: selectedKey }).then((result) => {
      const { records = [], total = 0 } = result;
      this.setState({
        loading: false,
        pager: {
          current,
          pageSize,
        },
        dataSource: records,
        total,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 从群中移除勾选客户
  handleDelete = (customerGroupType = 'mine') => {
    const { total, selectDatas: { selectAll, selectedRowKeys = [] } } = this.state;
    // 计算选中的记录条数
    let selectedCount = 0;
    if (selectAll) {
      selectedCount = total - selectedRowKeys.length;
    } else {
      selectedCount = selectedRowKeys.length;
    }
    if (selectedCount === 0) {
      message.error('请至少选择一个客户！');
      return;
    }
    const { pager } = this.state;
    const { selectedKey } = this.props;
    const _this = this;
    AntdModal.confirm({
      title: '从群中移除',
      content: <p>确定要移除{selectedCount}个客户吗</p>,
      onOk() {
        _this.setState({ loading: true });
        addCusGroupSeniorFunc({
          // customerQueryType: customerGroupType === 'mine' ? 1 : 3,
          // keyword: '',
          // stockCode: '',
          // financialProductCode: '',
          // totalAssetsStart: '',
          // totalAssetsEnd: '',
          // customerGroups: _this.props.selectedKey,
          // customerTags: '',
          // logicOrCondition: [],
          // quickOrCondition: [],
          // departmentIds: [],
          // czlx: 2,
          // khqmc: '',
          // isAllSel: selectAll ? 1 : 0,
          // unSelectCusCodes: selectedRowKeys.join(','),
          // cusGroupCodes: _this.props.selectedKey,
          // khqlx: 1,
          customerGroupManageModel: {
            czlx: 2, // 1.加入群；2.从群中删除；3.添加到新群
            khqid: _this.props.selectedKey,
            khqlx: 1,
            khqmc: '',
          },
          customerListBasicModel: {
            customerGroups: _this.props.selectedKey,
            customerQueryType: customerGroupType === 'mine' ? 1 : 3,
            customerTags: '',
            departmentIds: [],
            financialProductCode: '',
            keyword: '',
            stockCode: '',
            totalAssetsEnd: '',
            totalAssetsStart: '',
          },
          customerListSeniorAndQuickModel: {
            logicOrCondition: [],
            quickOrCondition: [],
          },
          operateButtonSelModel: {
            selectAll: selectAll ? 1 : 0,
            selectCode: selectedRowKeys.join(','),
          },
        }).then(() => {
          _this.fetchTableDatas({ pager, selectedKey });
          const selectDatas = {
            selectAll: false,
            selectedRowKeys: [],
          };
          _this.setState({ loading: false, selectDatas });
        }).catch((error) => {
          // 执行失败
          const selectDatas = {
            selectAll: false,
            selectedRowKeys: [],
          };
          _this.setState({ loading: false, selectDatas });
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() {},
    });
  }
  // 给选中客户发送消息
  handleSendMessages = () => {

  }
  // 给勾选客户推荐产品
  handleRecommendProducts = () => {

  }
  // 选择状态改变时的操作
  handleSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
    // 处理当前的选择状态效果
    const { selectDatas } = this.state;
    selectDatas.selectAll = currentSelectAll;
    selectDatas.selectedRowKeys = currentSelectedRowKeys;
    this.setState({ selectDatas });
  }
  handleCurentPageChange = (current, pageSize) => {
    this.fetchTableDatas({ pager: { current, pageSize } });
  }
  handlePageSizeChange = (current, pageSize) => {
    this.fetchTableDatas({ pager: { current: 1, pageSize } });
  }
  handleNumberFormat = (num) => {
    if (!num || num === '') return 0;
    const flag = Number.parseFloat(num, 10);
    let number = 0;
    if (flag) number = (flag / 10000).toFixed(2);
    return number;
  }
  // 组装表头数据
  assembleColumns = () => {
    const colums = [
      {
        dataIndex: 'khh',
        title: '客户',
        align: 'center',
        render: (text, record) => {
          return (
            <div className="m-customer-wrapper">
              <div style={{ textAlign: 'center', fontSize: '1rem' }}>
                <Link to={`/customerPanorama/index/${EncryptBase64(record.khid)}`} className="txt-d" target="_blank">{text}</Link>
                <div>{record.khxm}</div>
              </div>
            </div>
          );
        },
      },
      // { dataIndex: 'khxm', title: '姓名', render: (text, record) => <Link to={`/customerPanorama/index/${EncryptBase64(record.khid)}`} target="_blank" style={{ color: '#1890ff' }}>{text}</Link> },
      { dataIndex: 'bnyj', title: '本年佣金(元)', align: 'center', render: text => <div style={{ textAlign: 'center' }}>{text || 0}</div> },
      { dataIndex: 'bnjyl', title: '本年交易量(万)', align: 'center', render: text => <div style={{ textAlign: 'center' }}>{this.handleNumberFormat(text)}</div> },
      { dataIndex: 'bnzzl', title: '本年周转率', align: 'center', render: text => <div title={text} style={{ textAlign: 'center' }}>{text}</div> },
      { dataIndex: 'yybmc', title: '营业部', align: 'center', render: text => <div className={styles.overflow} title={text}>{text}</div> },
      { dataIndex: 'ltsz', title: '流通市值(万)', align: 'center', render: text => <div style={{ textAlign: 'center' }}>{this.handleNumberFormat(text)}</div> },
    ];
    return colums;
  }
  renderFooter = () => {
    const { pager, total, selectDatas: { selectAll, selectedRowKeys } } = this.state;
    const pagination = {
      className: 'm-paging',
      showTotal: () => `共${total}条`,
      onChange: this.handleCurentPageChange,
      onShowSizeChange: this.handlePageSizeChange,
      showLessItems: true,
      showSizeChanger: true,
      showQuickJumper: true,
      ...pager,
      total,
    };
    let selectedCount = 0;
    if (selectAll) {
      selectedCount = total - selectedRowKeys.length;
    } else {
      selectedCount = selectedRowKeys.length;
    }
    return (
      <div className={classnames('m-table-blue-footer clearfix')} style={{ display: `${total > 0 ? 'block' : 'none'}` }}>
        <span style={{ visibility: `${selectedCount > 0 ? 'visible' : 'hidden'}` }}><i>{selectedCount}</i>个客户被选中</span>
        <Pagination {...pagination} />
      </div>
    );
  }
  render() {
    const { loading, total, selectDatas, dataSource, selectDatas: { selectAll, selectedRowKeys } } = this.state;
    const { refreshCusGroupData } = this.props;
    const tableProps = {
      rowKey: 'khid',
      loading,
      columns: this.assembleColumns(),
      dataSource,
      rowSelection: {
        type: 'checkbox',
        crossPageSelect: true, // checkbox默认开启跨页全选
        ...selectDatas,
        onChange: this.handleSelectChange, // 选择状态改变时的操作
      },
    };
    let selectedCount = 0;
    if (selectAll) {
      selectedCount = total - selectedRowKeys.length;
    } else {
      selectedCount = selectedRowKeys.length;
    }
    const { authorities, dictionary, selectedKey, customerGroupType, queryParameter, selectedName, userBasicInfo, khfwDatas } = this.props;

    // 判断是否有各个按钮的权限
    const { customerGroup = [], customerList = [] } = authorities;

    return (
      <Card className="m-card default">
        <div className="btn-list-header" style={{ textAlign: 'left', padding: '0 0 1rem 1rem' }}>
          {customerGroup.includes('GroupCusDelete') && <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => { this.handleDelete(customerGroupType); }}>删除</Button>}
          { customerGroup.includes('GroupCusImport') && <AddCustomer fetchTableDatas={this.fetchTableDatas} selectedName={selectedName} customerGroupType={customerGroupType} selectedKey={selectedKey} queryParameter={queryParameter} /> }
          { customerGroup.includes('CusGroupAdd') && <CreatGroup dictionary={dictionary} khfwDatas={khfwDatas} userBasicInfo={userBasicInfo} customerGroupType={customerGroupType} refreshCusGroupData={refreshCusGroupData} /> }
          { customerList.includes('SendMessage') && <SendMessage className="fcbtn m-btn-border m-btn-border-headColor btn-1c" fsType={1} dictionary={dictionary} queryParameter={{ customerGroups: selectedKey, customerQueryType: 3, keyword: '', stockCode: '', financialProductCode: '', totalAssetsEnd: '', totalAssetsStart: '', customerTags: '', departmentsIds: '', logicOrCondition: [] }} selectedCount={selectedCount} opeType={0} selectAll={selectDatas.selectAll} selectedRowKeys={selectDatas.selectedRowKeys} /> }
        </div>
        <div className="m-hr" style={{ marginBottom: '0' }} />
        <Card className="m-card myCard theme-padding">
          <div className={styles.tableContent} style={{ overflowX: 'auto', paddingLeft: '1px' }}>
            <BasicDataTable
              {...tableProps}
              pagination={false}
              footer={this.renderFooter}
            />
          </div>
        </Card>
      </Card>
    );
  }
}
export default GroupList;
