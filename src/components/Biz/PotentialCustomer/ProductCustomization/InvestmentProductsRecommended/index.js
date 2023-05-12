import React from 'react';
import { Checkbox } from 'antd';
import BasicDataTable from '../../../../../components/Common/BasicDataTable';

class InvestmentProductsRecommended extends React.PureComponent {
  render() {
    const dataSource = [{
      key: '1', cpmc: '产品1', cpfx: '高', qd: '',
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
            <div>
              <Checkbox checked>电话</Checkbox>
              <Checkbox checked>电子渠道</Checkbox>
              <Checkbox>短信</Checkbox>
            </div>
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

export default InvestmentProductsRecommended;
