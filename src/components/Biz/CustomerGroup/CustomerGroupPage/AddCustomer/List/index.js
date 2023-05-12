import React from 'react';
import { connect } from 'dva';
import { Table, message } from 'antd';
import Buttons from './Buttons';
import ScatterCircle from '../../../../../Biz/Digital/ScatterCircle';
import { FetchCusListDisplayColumn } from '../../../../../../services/customerbase/customerListHandle';
import { FetchCustomerList } from '../../../../../../services/customersenior/simpleCustomerList';
import CustomizedColumn from './TreeSelectTransfer';

class ImportCrowdList extends React.Component {
  state = {
    showScatter: false, // 是否展示散点圈人组件
    scatterCircleCusIds: [], // 散点圈的客户号数组
    queryParams: {}, // 查询条件
    cusListDisplayColumnDatas: [], // 所有可展示列
    dataSource: [], // 列表数据

    // 交易客户列表定义
    columns: [
      { title: '客户号', dataIndex: 'customer_no', key: 'customer_no', render: text => text || '--' },
      { title: '客户姓名', dataIndex: 'customer_name', key: 'customer_name', render: text => text || '--' },
      { title: '总净资产', dataIndex: '', key: '', render: text => text || '--' },
      { title: '柜台手机', dataIndex: '', key: '', render: text => text || '--' },
      { title: '开发关系', dataIndex: '', key: '', render: text => text || '--' },
      { title: '服务关系', dataIndex: '', key: '', render: text => text || '--' },
      { title: '无效户激活', dataIndex: '', key: '', render: text => text || '--' },
      { title: '营业部', dataIndex: '', key: '', render: text => text || '--' },
    ],

    fieldsCode: ['customer_no', 'customer_name'], // 交易客户FetchCustomerList接口所需入参
  }

  // 改变散点圈人展示状态
  changeShowScatter = () => {
    const { showScatter = false } = this.state;
    // 取消圈人，清空已圈数据
    if (showScatter) {
      this.updateCircleCusIds([]);
    }
    this.setState({ showScatter: !showScatter });
  }

  // 更新散点圈人客户号数据
  updateCircleCusIds = (arr) => {
    this.setState({ scatterCircleCusIds: arr });
  }

  componentDidMount() {
    // 获取所有可显示列
    FetchCusListDisplayColumn({
      ywlx: 0, // 业务类型 TODO..
      xtjs: this.props.userBusinessRole,
      paging: -1,
      current: 1,
    }).then((response) => {
      const { records = [] } = response;
      this.setState({
        cusListDisplayColumnDatas: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });

    // 第一次进入页面调用接口获取列表数据
    const { fieldsCode, columns } = this.state;
    this.handleSearch(fieldsCode, columns);
  }

  // 获取列表数据
  handleSearch = (fieldsCode, columns) => {
    // 调用端口获取客户列表
    FetchCustomerList({
      customerListBasicModel: {
        // stockCode: this.state.queryParameter.stockCode, // 股票代码
        // customerGroups: this.state.queryParameter.customerGroups, // 客户群代码
        customerQueryType: 1, // 查询类型
        // customerTags: this.state.queryParameter.customerTags, // 标签
        // financialProductCode: this.state.queryParameter.financialProductCode, // 持仓代码
        // keyword: this.state.queryParameter.keyword ? `${this.state.queryParameter.lx}||${this.state.queryParameter.keyword}` : '',
        // totalAssetsEnd: !isNaN(parseFloat(this.state.queryParameter.totalAssetsEnd)) ? this.state.queryParameter.totalAssetsEnd * 10000 : '',
        // totalAssetsStart: isNaN(parseFloat(this.state.queryParameter.totalAssetsStart)) ? '' : this.state.queryParameter.totalAssetsStart * 10000, // 总资产下限
        // departmentIds: this.state.queryParameter.departmentIds, // 部门id
        // aggIndicators: this.state.queryParameter.aggIndicators,
        attrConditionModels: [{ type: 0, escode: 'customer_no', esValue: this.props.khhList.length > 0 ? this.props.khhList.length : '' }],
      },
      customerListSeniorAndQuickModel: {
        // quickOrCondition: this.state.queryParameter.quickOrCondition,
        // logicOrCondition: this.state.queryParameter.logicOrCondition,
      },
      customerListSaveLogModel: {
        // cxfy: this.state.queryParameter.cxfy,
        // faid: '',
        // fieldsId: Array.isArray(fieldsId) ? fieldsId.join(',') : fieldsId,
      },
      fieldsCode,
      customerListPagerModel: {
        // pageNo: this.state.tableDatas.pagination.current,
        // pageSize: this.state.tableDatas.pagination.pageSize,
      },
      // sort: this.state.queryParameter.sort,
    }).then((response) => {
      const { records = [] } = response || {};
      const dataSource = [];
      // 拼装数据
      records.forEach((element) => {
        const tempObject = {};
        if (element instanceof Object) {
          const keys = Object.keys(element);
          keys.forEach((key) => {
            if (Array.isArray(element[key])) { // 是数组的话，解析为字符串
              tempObject[key] = element[key].join(',');
            } else if (typeof element[key] === 'string' || typeof element[key] === 'number') { // 是对象的话，处理二级数组
              tempObject[key] = element[key];
            } else {
              const secondKeys = Object.keys(element[key]);
              secondKeys.forEach((secondKey) => {
                if (Array.isArray(element[key][secondKey])) { // 是数组的话，解析为字符串
                  tempObject[`${key}.${secondKey}`] = element[key][secondKey].join(',');
                } else {
                  tempObject[`${key}.${secondKey}`] = element[key][secondKey];
                }
              });
            }
          });
          dataSource.push(tempObject);
        }
      });
      this.setState({
        columns,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { queryParams, selectAll, selectedRowKeys, showScatter = false, scatterCircleCusIds = [], cusListDisplayColumnDatas, dataSource, columns } = this.state;
    const { userBusinessRole } = this.props;
    const selectedCount = 0;
    return (
      <div className="m-szyx-cont">
        {/* 按钮 */}
        <Buttons queryParams={queryParams} showPointGraph={this.state.showPointGraph} changeShwPointGraph={this.changeShwPointGraph} selectAll={selectAll} selectedRowKeys={selectedRowKeys} selectedCount={selectedCount} showScatter={showScatter} changeShowScatter={this.changeShowScatter} scatterCircleCusIds={scatterCircleCusIds} />
        <CustomizedColumn
          handleSearch={this.handleSearch} // 获取列表数据
          cusListDisplayColumnDatas={cusListDisplayColumnDatas} // 所有可展示列
          userBusinessRole={userBusinessRole}
        />
        {/* 列表 */}
        <div style={{ display: (showScatter) ? 'none' : 'unset' }}>
          <Table
            className="m-table-customer m-table-bortop"
            dataSource={dataSource}
            columns={columns}
            rowSelection={{}}
          />
        </div>
        {/* 散点圈人 */}
        {
          showScatter && <ScatterCircle params={queryParams} scatterCircleCusIds={scatterCircleCusIds} updateCircleCusIds={this.updateCircleCusIds} />
        }
      </div>
    );
  }
}
export default connect(({ global }) => ({
  userBusinessRole: global.userBusinessRole,
  dictionary: global.dictionary,
}))(ImportCrowdList);
