import React from 'react';
import { Table } from 'antd';

class InformationUpdateLogDataList extends React.Component {
  render() {
    const dataSource = [{
      key: 1, xgrq: '2018.01.02', xgxm: '地址', jz: '武汉', xz: '福州', czr: '张德',
    }, {
      key: 2, xgrq: '2018.01.02', xgxm: '电话', jz: '18028287721', xz: '13982821128', czr: '张德',
    }, {
      key: 3, xgrq: '2018.01.02', xgxm: '地址', jz: '徐州', xz: '武昌', czr: '张德',
    }, {
      key: 4, xgrq: '2018.01.02', xgxm: '地址', jz: '武汉', xz: '福州', czr: '张德',
    }];

    const columns = [
      {
        title: '修改日期',
        dataIndex: 'xgrq',
        key: 'xgrq',
      }, {
        title: '修改项目',
        dataIndex: 'xgxm',
        key: 'xgxm',
      }, {
        title: '旧值',
        dataIndex: 'jz',
        key: 'jz',
      }, {
        title: '新值',
        dataIndex: 'xz',
        key: 'xz',
      }, {
        title: '操作人',
        dataIndex: 'czr',
        key: 'czr',
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

export default InformationUpdateLogDataList;
