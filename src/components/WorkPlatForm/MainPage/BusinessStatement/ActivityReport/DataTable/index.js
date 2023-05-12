import React from 'react';
import { Table, message } from 'antd';
import styles from '../../index.less';
import { getActivityDetail } from '$services/businessStatement';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      total: '',
      current: 1,
      pageSize: 10,
    };
  }
  componentDidMount(){
    this.fetchData();
  }

  fetchData = () => {
    const { protocol ,payloadDate } = this.props;
    const { current = 1 , pageSize = 10 } = this.state;
    const payload = { 
      current,
      department: protocol.id,
      dimension: payloadDate.dimension, // 汇总维度
      pageLength: 0,
      pageSize,
      paging: 1, // 是否分页
      sort: "", // 排序
      total: -1,
      totalRows: 0 };
    this.setState({ loading: true });

    getActivityDetail(payload).then((response) => {
      const { records, code = 0 ,total } = response;
      records.forEach((item,index)=>{
        item.no = (((current - 1) * pageSize) + index + 1) + '';
      });
      if (code > 0) {
        this.setState({
          dataSource: records,
          loading: false,
          total,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 分页、筛选、排序发生变化
  handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    this.setState({ current, pageSize },(()=>{this.fetchData();}));
  }

  render() {
    const { dataSource, loading ,total,current = 1, pageSize = 10 } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
        className: 'm-black',
        key: 'no',
        fixed: 'left',
        width: 65,
        render: text => <div  className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '客户',
        dataIndex: 'cusName',
        className: 'columnLine m-black',
        key: 'cusName',
        fixed: 'left',
        width: 130,
        render: text => <div className='m-darkgray-g'  >{text || '--'}</div>,
      },
      {
        title: '客户号',
        dataIndex: 'cusCode',
        className: 'columnLine m-black',
        key: 'cusCode',
        // width: 120,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '开通港股通日期',
        className: 'columnLine m-black',
        dataIndex: 'KTGGTRQ',
        key: 'KTGGTRQ',
        // width: 220,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '期间港股通月日保有量',
        className: 'columnLine m-black',
        dataIndex: 'QJGGTYRBYL',
        key: 'QJGGTYRBYL',
        // width: 220,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '期间港股通交易量',
        className: 'columnLine m-black',
        dataIndex: 'QJGGTJYL',
        key: 'QJGGTJYL',
        // width: 220,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '期间港股通净佣金贡献',
        className: 'columnLine m-black',
        dataIndex: 'QJGGTJYJ',
        key: 'QJGGTJYJ',
        // width: 220,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '客户所属机构',
        className: 'columnLine m-black',
        dataIndex: 'YYB',
        key: 'YYB',
        width: 260,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '当年港股通交易量',
        className: 'columnLine m-black',
        dataIndex: 'DNGGTJYL',
        key: 'DNGGTJYL',
        // width: 200,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '当年港股通净佣金贡献',
        className: 'columnLine m-black',
        dataIndex: 'DNGGTJYJ',
        key: 'DNGGTJYJ',
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
    ];
    const tableProps = {
      className: 'm-Card-Table-g',
      style: { padding: '2rem 2rem 4rem 2rem' },
      scroll: { x: dataSource.length > 0 ? window.screen.availWidth - 300 : 0,y: dataSource.length > 0 ? document.body.clientHeight - 280  : 0 },
      loading,
      dataSource,
      onChange: this.handleTableChange,
      columns,
      // bordered: true,
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: () => `总共${total}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '50', '100'],
        total,
        current,
        pageSize,
      },
    };
    return (
      <Table {...tableProps}   />
    );
  }

}
export default DataTable;
