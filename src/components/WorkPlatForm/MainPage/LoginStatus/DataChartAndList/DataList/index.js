import React from 'react';
import { Row } from 'antd';
import BasicDataTable from '../../../../../Common/BasicDataTable';

class DataList extends React.Component {
  state = {
  }

  getColumns = () => {
    const columns = [
      {
        dataIndex: 'rq',
        title: '日期',
        key: 'rq',
      },
      {
        dataIndex: 'dlrs',
        title: '登录人数',
        key: 'dlrs',
      },
      {
        dataIndex: 'dlrc',
        title: '登录人次',
        key: 'dlrc',
      },
    ];
    return columns;
  }


  render() {
    const { dataSource = [] } = this.props;
    const tableProps = {
      columns: this.getColumns(),
    };
    return (
      <Row className="m-row-form" style={{ margin: '2rem' }}>
        <BasicDataTable
          className="m-table-customer"
          {...tableProps}
          dataSource={dataSource}
        />
      </Row>
    );
  }
}
export default DataList;
