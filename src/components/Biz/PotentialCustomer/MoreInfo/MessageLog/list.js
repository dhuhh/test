import React from 'react';
import { Table } from 'antd';

class MessageLogDataList extends React.Component {
  render() {
    const dataSource = [{
      key: 1, fasj: '2018.01.02', xxlx: '节日祝福', fszt: '成功', fsr: '张三三', bt: '元旦快乐',
    }, {
      key: 2, fasj: '2018.01.02', xxlx: '节日祝福', fszt: '成功', fsr: '张三三', bt: '元旦快乐',
    }, {
      key: 3, fasj: '2018.01.02', xxlx: '节日祝福', fszt: '成功', fsr: '张三三', bt: '元旦快乐',
    }, {
      key: 4, fasj: '2018.01.02', xxlx: '节日祝福', fszt: '成功', fsr: '张三三', bt: '元旦快乐',
    }];

    const columns = [
      {
        title: '发送时间',
        dataIndex: 'fasj',
        key: 'fasj',
      }, {
        title: '信息类型',
        dataIndex: 'xxlx',
        key: 'xxlx',
      }, {
        title: '发送状态',
        dataIndex: 'fszt',
        key: 'fszt',
      }, {
        title: '发送人',
        dataIndex: 'fsr',
        key: 'fsr',
      }, {
        title: '标题',
        dataIndex: 'bt',
        key: 'bt',
      },
    ];
    return (
      <div>
        <Table
          className="m-table-customer"
          dataSource={dataSource}
          columns={columns}
          pagination={{
            className: 'm-paging',
            hideOnSinglePage: true,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `共${total}条`,
            defaultCurrent: 1,
            total: 80,
          }}
        />
      </div>
    );
  }
}

export default MessageLogDataList;
