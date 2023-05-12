import React from 'react';
import { Table, message } from 'antd';
import styles from '../index.less';
// import { Scrollbars } from 'react-custom-scrollbars';
import { FetchQueryAIPDeductionDetailst } from '$services/newProduct';

class DataTable extends React.Component {
  state = {
    dataSource: [],
    loading: true,
  }

  componentDidMount(){
    const { protocol } = this.props;
    this.fetchQueryAIPDeductionDetailst({
      pdId: protocol,
    });
  }

  fetchQueryAIPDeductionDetailst = (payload) => {
    FetchQueryAIPDeductionDetailst({
      ...payload,
    }).then((response) => {
      const { records, code = 0 } = response;
      if (code > 0) {
        this.setState({
          dataSource: records,
          loading: false,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  render() {
    const { dataSource, loading } = this.state;
    const columns = [
      {
        title: '扣款日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        // width: '30rem',
      },
      {
        title: '扣款金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        // width: '30rem',
      },
      {
        title: '扣款状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        // width: '30rem',
      },
    ];
    const tableProps = {
      className: styles.m_table,
      style: { padding: '2rem 2rem 4rem 2rem' },
      loading,
      dataSource,
      columns,
      bordered: true,
      pagination: false,
    };
    return (
      // <Scrollbars autoHide autoHeight autoHeightMin={'20rem'} autoHeightMax={'55rem'} style={{ width: '100%' }} >
      <Table {...tableProps} scroll={{ y: dataSource.length > 8 ? 480 : '' }} />
      // </Scrollbars>
    );
  }

}
export default DataTable;
