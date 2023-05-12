import React, { Component } from 'react';
import { Col, Icon, Row, Table, Tooltip } from 'antd';
import styles from '../index.less';
import { formatThousands } from '../../ManageCusList/Common/Utils';
import lodash from 'lodash';
class TableCollectContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 20,
      // total: 0,
      sort: [],
      filter: [],
      columnKey: '',
      order: '',
    };
  }

  // 重写部分表格头
  reWriteTitle = (title) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', marginLeft: 20 }}>{title}</span>
        </div>
        <span style={{ marginRight: 28 }}>占比</span>
      </div>
    );
  }

  // 表格列
  getColumns = () => {
    const gsxscs = '销售收入=手续费收入+佣金收入+销售服务费收入+其他收入(其中部分收入是以查询时间周期保有金额进行统计)';
    const gsxsjl = '销售奖励=销售收入*对应科目奖励比例。';
    return [
      {
        title: '序号',
        dataIndex: 'no',
        width: 68,
        key: 'no', 
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '分支号',
        dataIndex: 'customer_department_id',
        // onHeaderCell: () => ({ style: { minWidth: 93, maxWidth: 133 } }),
        // onCell: () => ({ style: { minWidth: 93, maxWidth: 133 } }),
        width: 120,
        key: 'customer_department_id',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '分支机构/营业部',
        dataIndex: 'customer_department',
        key: 'customer_department',
        className: 'm-black',
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: () => this.reWriteTitle('销售额(万)'),
        dataIndex: 'salesVolumeProName',
        onHeaderCell: () => ({ style: { minWidth: 247, maxWidth: 335 } }),
        onCell: () => ({ style: { minWidth: 247, maxWidth: 335 } }),
        key: 'salesVolumeProName',
        className: `${styles.rewriteShortCol} m-black`,
        sorter: true,
        render: text => {
          const splitArr = text ? text.split(' ') : [];
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }} className='m-darkgray'>
              <span style={{ marginLeft: 20 }}>{splitArr.length ? splitArr[0] : '--'}</span>
              <span style={{ fontWeight: 'bold', marginRight: 20 }}>{splitArr.length ? splitArr[splitArr.length - 1] : '--'}</span>
            </div>
          );
        },
      },
      {
        title: () => this.reWriteTitle('考核销量(万)'),
        dataIndex: 'evaluateSalesVolumeProName',
        onHeaderCell: () => ({ style: { minWidth: 247, maxWidth: 337 } }),
        onCell: () => ({ style: { minWidth: 247, maxWidth: 337 } }),
        key: 'evaluateSalesVolumeProName',
        className: `${styles.rewriteCol} m-black`,
        sorter: true,
        render: text => {
          const splitArr = text ? text.split(' ') : [];
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }} className='m-darkgray'>
              <span style={{ marginLeft: 20 }}>{splitArr.length ? splitArr[0] : '--'}</span>
              <span style={{ fontWeight: 'bold', marginRight: 20 }}>{splitArr.length ? splitArr[splitArr.length - 1] : '--'}</span>
            </div>
          );
        },
      },
      {
        title: 
        <span style={{ fontWeight: 'bold' }}>估算销售创收(元)
          <Tooltip title={gsxscs}>
            <Icon style={{ marginLeft: 5, color: '#959cba' }} type="question-circle" />
          </Tooltip>
        </span>,
        dataIndex: 'evaluateSalesRevenue',
        onHeaderCell: () => ({ style: { minWidth: 184, maxWidth: 336 } }),
        onCell: () => ({ style: { minWidth: 184, maxWidth: 336 } }),
        key: 'evaluateSalesRevenue',
        className: 'm-black',
        sorter: true,
        align: 'left',
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: 
        <span style={{ fontWeight: 'bold' }}>
            估算销售奖励(元)
          <Tooltip title={gsxsjl}>
            <Icon style={{ marginLeft: 5, color: '#959cba' }} type="question-circle" />
          </Tooltip>
        </span>,
        dataIndex: 'evaluateSalesReward',
        onHeaderCell: () => ({ style: { minWidth: 184, maxWidth: 336 } }),
        onCell: () => ({ style: { minWidth: 184, maxWidth: 336 } }),
        key: 'evaluateSalesReward',
        className: 'm-black',
        align: 'left',
        sorter: true,
        render: text => <div className='m-darkgray'>{text || '--'}</div>,
      },
      {
        title: '查看明细',
        dataIndex: 'cx',
        width: 98,
        key: 'cx',
        align: 'left',
        className: 'm-black',
        render: (_, record) => (
          record.customer_department && <div className='fs14' style={{ color: '#244fff', cursor: 'pointer' }} onClick={() => this.props.handleSelectKey('2', { department: record.customer_department_id }, true)}>查看</div>
        ),
      },
    ];
  }

  // 格式化数据/单位
  formatValue = (value) => {
    let dw = '元';
    value = (parseFloat(value) / 10000).toFixed(2);
    return { value, dw };
  }

  // 分页、筛选、排序发生变化
  onTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { handleTableChange } = this.props;
    let { columnKey, order = 'desc' } = sorter;
    console.log(order, '???????');
    switch(columnKey) {
      case 'salesVolumeProName':
        columnKey = 'salesVolume';
        break;
      case 'evaluateSalesVolumeProName':
        columnKey = 'evaluateSalesVolume';
        break;
      default:
        break;
    }
    this.setState({
      columnKey,
      order,
    });
    const key = columnKey;
    const val = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    const sort = [{}];
    if (key && val) {
      sort[0][key] = val;
    }
    if (handleTableChange) {
      handleTableChange(current, pageSize, sort);
    }
    this.setState({ current, pageSize, sort });
  }

  render () {
    const { current = 1, pageSize = 20  } = this.state;
    const { dataSource = [], summary = [], count = 0, loading } = this.props;
    let evaluateVolumeAll = 0.00, rewardAll = 0.00, revenueAll = 0.00, volumeAll = 0.00;
    summary.length > 0 && summary.forEach(i => {
      switch(i.showName) {
        case 'evaluateSalesVolumeAll':
          evaluateVolumeAll = i.value;
          break;
        case 'evaluateSalesRewardAll':
          rewardAll = i.value;
          break;
        case 'evaluateSalesRevenueAll':
          revenueAll = i.value;
          break;
        case 'salesVolumeAll':
          volumeAll = i.value;
          break;
        default:
          break;
      }
    });
    evaluateVolumeAll = this.formatValue(evaluateVolumeAll);
    rewardAll = this.formatValue(rewardAll);
    revenueAll = this.formatValue(revenueAll);
    volumeAll = this.formatValue(volumeAll);
    const maxCount = count > 10000 ? 10000 : count;
    const tableProps = {
      className: `${styles.rewriteTable} ${styles.m_table} m-table-customer`,
      loading,
      scroll: { x: 1127, y: dataSource.length > 0 ? window.screen.availHeight - 450 : 0 },
      rowKey: 'custNo',
      dataSource,
      columns: this.getColumns(),
      onChange: this.onTableChange,
      bordered: true,
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: () => `总共${count}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'],
        total: maxCount,
        current,
        pageSize,
      },
    };

    return (
      <React.Fragment>
        <Row style={{ padding: '0', zIndex: '2' }}>
          <Col>
            <Table {...tableProps} columns={this.getColumns()}></Table>
          </Col>
        </Row>
        <Row style={{ position: 'relative', top: '-45px', zIndex: '1' }}>
          <Col span={18} style={{ color: '#61698C' }}>
            <span className="ax-tjsj-name">统计数据：</span>
            <span style={{ marginRight: '2rem' }}>销售额：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(volumeAll, 'value', '--'))}</span> 万</span>
            <span style={{ marginRight: '2rem' }}>考核销量：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(evaluateVolumeAll, 'value', '--'))}</span> 万</span>
            <span style={{ marginRight: '2rem' }}>估算销售创收：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(revenueAll, 'value', '--'))}</span> 万</span>
            <span style={{ marginRight: '2rem' }}>估算销售奖励：<span style={{ color: '#FF6E2F' }}>{formatThousands(lodash.get(rewardAll, 'value', '--'))}</span> 万</span>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default TableCollectContent;
