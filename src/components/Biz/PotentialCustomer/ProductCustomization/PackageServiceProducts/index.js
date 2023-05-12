import React from 'react';
import { Button } from 'antd';
import BasicDataTable from '../../../../../components/Common/BasicDataTable';

class PackageServiceProducts extends React.PureComponent {
  render() {
    const dataSource = [{
      key: '1', cpmc: '产品1', cpfx: '高', qd: '',
    }, {
      key: '2', cpmc: '产品2', cpfx: '高', qd: '',
    }];

    const columns = [
      {
        title: '产品名称',
        dataIndex: 'cpmc',
        key: 'cpmc',
      }, {
        title: '产品风险',
        dataIndex: 'cpfx',
        key: 'cpfx',
      }, {
        title: '渠道',
        dataIndex: 'qd',
        key: 'qd',
        render: () => {
          return (
            <Button type="primary" ghost size="small">订阅</Button>
          );
        },
      }];
    return (
      <BasicDataTable
        className="m-table-blue m-table-blue-small"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        locale={{ emptyText: '暂无数据' }}
        size="middle"
      />
    );
  }
}

export default PackageServiceProducts;
