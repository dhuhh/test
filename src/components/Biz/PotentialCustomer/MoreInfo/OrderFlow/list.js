import React from 'react';
import { Table } from 'antd';

class OrderFlowDataList extends React.Component {
  render() {
    const dataSource = [{
      key: 1, fsrq: '2018.01.02', cpmc: '稳健组合', czfs: '订制', czr: '张三三', bz: '订制【稳健组合】产品',
    }, {
      key: 2, fsrq: '2018.01.02', cpmc: '稳健组合', czfs: '订制', czr: '张三三', bz: '取消订制【稳健组合】产品',
    }, {
      key: 3, fsrq: '2018.01.02', cpmc: '稳健组合', czfs: '订制', czr: '张三三', bz: '订制【稳健组合】产品',
    }, {
      key: 4, fsrq: '2018.01.02', cpmc: '稳健组合', czfs: '订制', czr: '张三三', bz: '订制【稳健组合】产品',
    }];

    const columns = [
      {
        title: '发生日期',
        dataIndex: 'fsrq',
        key: 'fsrq',
      }, {
        title: '产品名称',
        dataIndex: 'cpmc',
        key: 'cpmc',
      }, {
        title: '操作方式',
        dataIndex: 'czfs',
        key: 'czfs',
      }, {
        title: '操作人',
        dataIndex: 'czr',
        key: 'czr',
      }, {
        title: '备注',
        dataIndex: 'bz',
        key: 'bz',
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

export default OrderFlowDataList;
