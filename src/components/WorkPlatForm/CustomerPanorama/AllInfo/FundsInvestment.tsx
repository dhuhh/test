import { Card, message, Pagination, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import TableLocale from '../Common/TableLocale'
import { QuerySignProformation } from '$services/customerPanorama';
import styles from './index.less';

const locale = { emptyText: <TableLocale emptyText='无记录' /> };

interface State {
  loading1: boolean,
  dataSource1: any[],
  current: number,
  pageSize: number,
  total: number,
}

type Props = Readonly<{
  customerCode: string,
  setLoading: (loading: boolean) => void
}>

const FundsInvestment: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    loading1: false,
    dataSource1: [],
    current: 1,
    pageSize: 10,
    total: 0,
  })

  useEffect(() => {
    props.setLoading(true);
    QuerySignProformation({ loginAccount: props.customerCode, paging: 1, current: state.current, pageSize: state.pageSize }).then((res: any) => {
      props.setLoading(false);
      const { records = [], total = 0 } = res;
      setState({ ...state, dataSource1: records.map((item: any, index: number) => ({ ...item, key: index })), total });
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])

  const columns1: any[] = [
    { title: '策略名称', dataIndex: 'productName' },
    { title: '策略代码', dataIndex: 'productCode' },
    { title: '财富子账户', dataIndex: 'contractStatus' },
    { title: '状态', dataIndex: 'bookStatus' },
    { title: '签约时间', dataIndex: 'signDate' },
    { title: '解约时间', dataIndex: 'contractSeria' },
  ];

  const { current, pageSize, total } = state;

  const handlePageChange = (current: number, pageSize: number | undefined = state.pageSize) => {
    setState({ ...state, current, pageSize });
    props.setLoading(true);
    QuerySignProformation({ loginAccount: props.customerCode, paging: 1, current, pageSize }).then((res: any) => {
      props.setLoading(false);
      const { records = [], total = 0 } = res;
      setState({
        ...state,
        dataSource1: records.map((item: any, index: number) => ({ ...item, key: index })),
        total,
        current,
        pageSize,
      });
    })
  }

  return <div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '18px 25px' }}
      title={<div className="ax-card-title">开通合约账户列表</div>}
    >
      <Table
        rowKey='key'
        loading={state.loading1}
        columns={columns1}
        dataSource={state.dataSource1}
        className={`m-table-customer ${styles.table}`}
        pagination={false}
        locale={locale}
      />
      <div style={{ textAlign: 'right' }}>
        <Pagination
          style={{ margin: '20px 0 0' }}
          size='small'
          showLessItems
          showQuickJumper
          showSizeChanger
          className={`${styles.pagination}`}
          pageSizeOptions={['10', '20', '40']}
          showTotal={(total) => <div style={{ fontSize: 12 }}>{`总共${total}条`}</div>}
          pageSize={pageSize}
          current={current}
          total={total}
          onChange={handlePageChange}
          onShowSizeChange={(current, pageSize) => handlePageChange(1, pageSize)}
        />
      </div>
    </Card>
  </div>
}
export default FundsInvestment;
