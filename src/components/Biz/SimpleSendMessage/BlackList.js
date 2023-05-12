import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

class BlackList extends React.Component {
  assembleColumns = () => {
    const columns = [{
      title: '客户姓名',
      dataIndex: 'khxm',
      render: text => text || '--',
    }, {
      title: '客户号',
      dataIndex: 'khh',
      render: text => text || '--',
    }, {
      title: '服务类别',
      dataIndex: 'fwlb',
      render: text => text || '--',
    }];
    return columns;
  }
  render() {
    const { dataSource = [] } = this.props;
    return (
      <Table
        rowKey="id"
        className={styles.blackListTable}
        dataSource={dataSource}
        columns={this.assembleColumns()}
        size="small"
        pagination={{
          hideOnSinglePage: true,
          defaultCurrent: 1,
          pageSize: 5,
          total: dataSource.length,
        }}
      />
    );
  }
}

export default BlackList;
