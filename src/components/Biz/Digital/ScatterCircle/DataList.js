import React from 'react';
import { message } from 'antd';
import { FetchCustomerList } from '../../../../services/customersenior/simpleCustomerList';
import BasicDataTable from '../../../Common/BasicDataTable';

class DataList extends React.Component {
  state = {
    tableDatas: {
      dataSource: [],
      pagination: {
        current: 1,
        total: 0,
      },
    },
  }

  componentDidMount() {
    const { scatterCircleCusIds = [] } = this.props;
    this.fetchData(scatterCircleCusIds);
  }

  componentWillReceiveProps(nextProps) {
    const { scatterCircleCusIds: preIds = [] } = this.props;
    const { scatterCircleCusIds: aftIds = [] } = nextProps;
    if (JSON.stringify(preIds) !== JSON.stringify(aftIds)) {
      this.fetchData(aftIds);
    }
  }

  onChangePage = (page) => {
    const { tableDatas } = this.state;
    this.setState({
      tableDatas: {
        ...tableDatas,
        pagination: {
          ...tableDatas.pagination,
          current: page,
        },
      },
    });
  }

  assenmbleColumns = () => {
    const columns = [{
      title: '客户',
      dataIndex: 'customer_name',
      render: (_, record) => (
        <React.Fragment>
          <a className="blue-link">{record.customer_name}</a>
          <div className="gray">{record.customer_no}</div>
        </React.Fragment>
      ),
    }, {
      title: '最近一次行为事件',
      dataIndex: 'zjycxwsj',
      render: (_, record) => (
        <React.Fragment>
          <div>{record.xwmc || '--'}</div>
          <div className="gray">{record.xwsj || '--'}</div>
        </React.Fragment>
      ),
    }, {
      title: '客户标签',
      dataIndex: 'khbq',
    }, {
      title: '客户级别',
      dataIndex: 'khjb',
    }, {
      title: '营业部编码',
      dataIndex: 'department',
    }];
    return columns;
  }

  fetchData = (ids = []) => {
    const { tableDatas = {} } = this.state;
    const { params: { customerListBasicModel = {}, customerListSeniorAndQuickModel = {} } } = this.props;
    FetchCustomerList({
      customerListBasicModel: {
        customerQueryType: '3', // 查询类型
        keyword: ids.length > 0 ? `3||${ids.join(',')}` : '',
        departmentIds: customerListBasicModel.departmentIds, // 部门id
      },
      customerListSeniorAndQuickModel: {
        logicOrCondition: customerListSeniorAndQuickModel.logicOrCondition,
      },
      customerListSaveLogModel: {
      },
      fieldsCode: ['customer_no', 'customer_name', 'customer_id', 'department', 'customer_level_name'],
      customerListPagerModel: {
        pageNo: tableDatas.pagination.current,
        pageSize: 10,
      },
    }).then((response) => {
      const { count, data = [] } = response || {};
      const dataSource = [];
      // 拼装数据
      data.forEach((element) => {
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
        tableDatas: {
          ...tableDatas,
          dataSource,
          pagination: {
            ...tableDatas.pagination,
            total: count,
          },
        },
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { tableDatas: { dataSource, pagination: { total, current } } } = this.state;
    const maxPagers = total > 10 * 100 ? 10 * 100 : total;
    const tableProps = {
      rowKey: 'customer_id',
      className: 'm-table-customer m-table-bortop',
      columns: this.assenmbleColumns(),
      dataSource,
      rowSelection: null,
      pagination: {
        className: 'm-paging m-paging-szyx',
        showTotal: () => `共${total}条`,
        showLessItems: true,
        showSizeChanger: false,
        showQuickJumper: true,
        total: maxPagers,
        current,
        pageSize: 10,
        onChange: this.onChangePage,
      },
    };
    return (
      <BasicDataTable
        {...tableProps}
      />
    );
  }
}

export default DataList;
