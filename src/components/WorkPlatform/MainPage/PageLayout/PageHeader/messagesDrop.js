/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Badge } from 'antd';
import { routerRedux, Link } from 'dva/router';
import DropdownBox from '../../../../Common/DropdownBox';
import BasicDataTable from '../../../../../components/Common/BasicDataTable'; // 引入公共表格处理组件
// import { FetchProductType } from '../../../../../services/home/home';


export default class MessagesDrop extends React.PureComponent {
  state = {
    loading: false,
    tableData: [],
    visible: false,
    // 分页参数
    pagination: {
      paging: 1,
      current: 1,
      pageSize: 5,
      total: -1,
      sort: '',
    },
  }

  componentDidMount() {
    this.getMsgNum();
    // 每隔3分钟执行一次,刷新一下数字
    this.timer = setInterval(() => {
      this.getMsgNum();
    }, 3 * 60 * 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getMsgNum = () => {
    // 调用端口获取客户列表
    // this.setState({ loading: true });
    // const { pagination } = this.state;
    // FetchProductType({
    //   ...pagination,
    //   pageSize: pagination.pageSize,
    //   qryType: 1,
    //   isAlreadyRead: 0, // 是否已读
    // }).then((response) => {
    //   const { records = [], total } = response || {};
    //   const count = total;
    //   this.setState({
    //     loading: false,
    //     tableData: records,
    //     pagination: {
    //       ...pagination,
    //       total: count > 2000 ? 2000 : count,
    //     },
    //   });
    // }).catch((error) => {
    //   message.error(!error.success ? error.message : error.note);
    // });
  }

  // 页面表格定义
  assembleColumnsIndividualCusTable = () => {
    const columns = [{
      title: '消息类型',
      dataIndex: 'messageType',
    },
    {
      title: '主题',
      dataIndex: 'theme',
      width: 300,
      render: (_, record) => (
        <Link to="/" className="txt-d" target="_blank" rel="noopener noreferrer" >
          {record.theme && record.theme.length > 10 && (
          <p title={record.theme}>{record.theme.substring(0, 10)}...</p>)
          }
          {record.theme && record.theme.length <= 10 && (
            record.theme)
          }
          {!record.theme && (
            '--'
          )
          }
        </Link>
      ),
    }, {
      title: '发送人',
      dataIndex: 'sender',
    }, {
      title: '发送时间',
      dataIndex: 'sendTime',
    }];
    return columns;
  };

  onVisibleChange = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  handleHide = () => {
    this.setState((prevState) => {
      return { visible: !prevState.visible };
    });
    this.props.dispatch(routerRedux.push('/myMessage'));
  }

  render() {
    const { tableData = [], loading, pagination, pagination: { current = 1, total } } = this.state;
    // FetchDataTable 传入参数
    const tableProps4IndividualCus = {
      rowKey: record => record.id,
      columns: this.assembleColumnsIndividualCusTable(),
      dataSource: tableData,
      loading,
      // 分页参数
      pagination: {
        ...pagination,
        className: 'm-paging',
        total,
        current,
        showTotal: () => `共${total}条`,
        onChange: this.onChangePag,
        hideOnSinglePage: false,
        showQuickJumper: false,
        showSizeChanger: false,
        defaultCurrent: 1,
        defaultPageSize: 10,
      },
      isPagination: false,
    };

    return (
      <DropdownBox
        id="message"
        visible={this.state.visible}
        onVisibleChange={this.onVisibleChange}
        title={
          <a style={{ display: 'inline-block', width: '100%', height: '100%' }} title="消息提醒">
            {
            total >= 1 ?
              <Badge status="processing" text={<i className="iconfont icon-bell-line" style={{ fontSize: '1.5rem' }} />} />
              :
              <i className="iconfont icon-bell-line" style={{ fontSize: '1.5rem' }} />
           }
          </a>
        }
        dropbox={
          <div>
            <BasicDataTable
              className="m-table-customer"
              {...tableProps4IndividualCus}
            />
            {
              tableData.length > 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center' }}>
                  <a onClick={this.handleHide} className="m-mcolor-link">更多消息</a>
                </div>
                ) : ''
            }
          </div>
        }
      />
    );
  }
}
