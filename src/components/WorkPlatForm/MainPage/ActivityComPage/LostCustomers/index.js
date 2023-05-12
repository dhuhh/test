import React, { useState, useEffect } from 'react';
import { message, Pagination, Card, Divider } from 'antd';
import styles from './index.less';
import { Link } from 'umi';
import ExportTab from './exportTab';
import SearchFrom from './searchFrom';
import TableLocale from './tableLocale';
import BasicDataTable from '$common/BasicDataTable';
import { QueryLossList } from '$services/activityComPage';
import config from '$utils/config';

const { ftq } = config;
const { activityComPage: { exportPotentialCustLossList } } = ftq;
export default function Person (props) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [department, setDepartment] = useState(''); //营业部  -- 查询条件
  const [custCode, setCustCode] = useState(''); //客户  -- 查询条件
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [selectAll, setSelectAll] = useState(false); // 全选

  useEffect(() => {
    getData();
  }, [pageSize, pageNo]);

  // 列表
  const getData = () => {
    setLoading(true);
    const prams = {
      pageSize: pageSize,
      pageNo: pageNo,
      departmentIds: department,
      customer: custCode ,
    };
    QueryLossList(prams).then(res => {
      setLoading(false);
      const { records = [], total = 0 } = res;
      setDataSource(records);
      setTotal(total);

    }).catch(err => message.error(err.note || err.message));
  };

  const handleTableChange = (p, c, s) => {
    setPageNo(p);
    setPageSize(c);

  };
  const rowSelection = {
    type: 'checkbox',
    crossPageSelect: true, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      setSelectAll(currentSelectAll);
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
    fixed: true,
  };

  const getColumns = [

    {
      title: '客户',
      dataIndex: 'customerName',
      align: 'center',
      key: 'customerName',
      render: (text,record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.customerNo}`} target='_blank'><div style={{ color: '#244fff', cursor: 'pointer',wordBreak: 'break-all', whiteSpace: 'normal' }}>{text || '--'}</div></Link>,
    },
    {
      title: '客户号',
      dataIndex: 'customerNo',
      align: 'center',
      key: 'customerNo',
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: '开户营业部',
      dataIndex: 'departmentName',
      align: 'center',
      key: 'departmentName',
      render: text => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: '本月资产净流入',
      align: 'center',
      dataIndex: 'assetInflow',
      key: 'assetInflow',
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: '本月交易量(全账户)',
      align: 'center',
      dataIndex: 'tradingVolume',
      key: 'tradingVolume',
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: '总资产',
      dataIndex: 'totalAssets',
      align: 'center',
      key: 'totalAssets',
      render: text => <div className={styles.columnsTtxt}>{text || '--'}</div>,
    },
    {
      title: '总市值',
      align: 'center',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: text => <div className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: '服务关系',
      align: 'center',
      dataIndex: 'serviceRelation',
      key: 'serviceRelation',
      render: text => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: '开发关系',
      align: 'center',
      dataIndex: 'developRelation',
      key: 'developRelation',
      render: text => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.columnsTtxt} >{text || '--'}</div>,
    },
    {
      title: '无效户激活关系',
      align: 'center',
      dataIndex: 'activationRelation',
      key: 'activationRelation',
      render: text => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.columnsTtxt} >{text || '--'}</div>,
    },
  ];

  const locale = { emptyText: <TableLocale emptyText='抱歉，没有客户信息' /> };
  const tableProps = {
    scroll: { x: 1730 },
    loading,
    bordered: true,
    pagination: false,
  };
  const tableHeaderCodes = getColumns.map(item => item.dataIndex).join(',');
  const tableHeaderNames = getColumns.map(item => item.title).join(',');

  const queryModel = {
    departmentIds: department,
    customer: custCode,
    pageNo: 0,
    pageSize: 0,
  };

  const exportPayload = JSON.stringify({
    queryModel,
    tableHeaderNames,
    tableHeaderCodes,
    selectIds: selectedRowKeys.join(','),
    selectAll: !selectAll && !selectedRowKeys.length ? 1 : selectAll ? 1 : 0,
  });

  let exportTotal = selectAll && !selectedRowKeys.length ? total : selectAll ? (total - selectedRowKeys.length) : !selectAll && !selectedRowKeys.length ? total : (selectedRowKeys.length);
  return (
    <React.Fragment>
      <Card className="ax-card" bodyStyle={{ padding: '10px 24px', minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
        <SearchFrom
          department={department}
          setDepartment={setDepartment}
          setCustCode={setCustCode}
          custCode={custCode}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectedRows={setSelectedRows}
          setSelectAll={setSelectAll}
          getData={getData}
          handleTableChange={handleTableChange}
        />
        <Divider style={{ margin: '3px 0 24px' }} />
        <div className={`${styles.texts}`}>
          <span className={`${styles.tip}`}></span>
          <span className={`${styles.ml}`}>查询结果</span>
        </div>
        <ExportTab total={exportTotal} exportPayload={exportPayload} action={exportPotentialCustLossList} />
        <BasicDataTable {...tableProps} rowSelection={rowSelection} specialPageSize={5} locale={locale} columns={getColumns} dataSource={dataSource} className={`${styles.tabelHasPerColor}`} pagination={false} rowKey={'id'} />
        <Pagination
          showLessItems
          className={`${styles.o_pagination}`}
          showQuickJumper
          showSizeChanger
          pageSizeOptions={['10', '50', '100']}
          pageSize={pageSize}
          current={pageNo}
          total={total}
          showTotal={() => `总共${total}条`}
          onShowSizeChange={(current, pageSize) => handleTableChange(1, pageSize)}
          onChange={handleTableChange}
        />
      </Card>
    </React.Fragment>
  );

}