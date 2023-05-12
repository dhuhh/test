import { Card, message, Pagination, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import TableLocale from '../Common/TableLocale'
import { QueryFinaceTaInformation, QueryDeptAccountInformation, QueryElectronicInformation } from '$services/customerPanorama';
import styles from './index.less';

const locale = { emptyText: <TableLocale emptyText='无记录' /> };

type Props = Readonly<{
  customerCode: string,
  setLoading: (loading: boolean) => void
}>

interface State {
  loading1: boolean,
  dataSource1: any[],
  loading2: boolean,
  dataSource2: any[],
  loading3: boolean,
  dataSource3: any[],
  current1: number,
  pageSize1: number,
  total1: number,
  current2: number,
  pageSize2: number,
  total2: number,
  current3: number,
  pageSize3: number,
  total3: number,
}

const FinancialAccount: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    loading1: false,
    dataSource1: [],
    loading2: false,
    dataSource2: [],
    loading3: false,
    dataSource3: [],
    current1: 1,
    pageSize1: 10,
    total1: 0,
    current2: 1,
    pageSize2: 10,
    total2: 0,
    current3: 1,
    pageSize3: 10,
    total3: 0,
  })

  useEffect(() => {
    props.setLoading(true);
    Promise.all([
      QueryFinaceTaInformation({ loginAccount: props.customerCode, paging: 1, current: state.current1, pageSize: state.pageSize1 }),
      QueryDeptAccountInformation({ loginAccount: props.customerCode, paging: 1, current: state.current2, pageSize: state.pageSize2 }),
      QueryElectronicInformation({ loginAccount: props.customerCode, paging: 1, current: state.current3, pageSize: state.pageSize3 }),
    ]).then((res: any[]) => {
      props.setLoading(false);
      const [res1, res2, res3] = res;
      const { records: records1 = [], total: total1 = 0 } = res1;
      const { records: records2 = [], total: total2 = 0 } = res2;
      const { records: records3 = [], total: total3 = 0 } = res3;
      setState({
        ...state,
        dataSource1: records1.map((item: any, index: number) => ({ ...item, key: index })),
        dataSource2: records2.map((item: any, index: number) => ({ ...item, key: index })),
        dataSource3: records3.map((item: any, index: number) => ({ ...item, key: index })),
        total1,
        total2,
        total3,
      });
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])

  const handlePageChange1 = (current: number, pageSize: number | undefined = state.pageSize1) => {
    setState({ ...state, current1: current, pageSize1: pageSize });
    props.setLoading(true);
    QueryFinaceTaInformation({ loginAccount: props.customerCode, paging: 1, current, pageSize }).then((res1: any) => {
      props.setLoading(false);
      const { records: records1 = [], total: total1 = 0 } = res1;
      setState({
        ...state,
        dataSource1: records1.map((item: any, index: number) => ({ ...item, key: index })),
        total1,
        current1: current,
        pageSize1: pageSize,
      });
    })
  }
  const handlePageChange2 = (current: number, pageSize: number | undefined = state.pageSize2) => {
    setState({ ...state, current2: current, pageSize2: pageSize });
    props.setLoading(true);
    QueryDeptAccountInformation({ loginAccount: props.customerCode, paging: 1, current, pageSize }).then((res2: any) => {
      props.setLoading(false);
      const { records: records2 = [], total: total2 = 0 } = res2;
      setState({
        ...state,
        dataSource2: records2.map((item: any, index: number) => ({ ...item, key: index })),
        total2,
        current2: current,
        pageSize2: pageSize,
      });
    })
  }
  const handlePageChange3 = (current: number, pageSize: number | undefined = state.pageSize3) => {
    setState({ ...state, current3: current, pageSize3: pageSize });
    props.setLoading(true);
    QueryElectronicInformation({ loginAccount: props.customerCode, paging: 1, current, pageSize }).then((res3: any) => {
      props.setLoading(false);
      const { records: records3 = [], total: total3 = 0 } = res3;
      setState({
        ...state,
        dataSource3: records3.map((item: any, index: number) => ({ ...item, key: index })),
        total3,
        current3: current,
        pageSize3: pageSize,
      });
    })
  }

  const columns1: any[] = [
    { title: '基金公司代码', dataIndex: 'finaceCode' },
    { title: '基金公司名称', dataIndex: 'finaceName' },
    { title: '基金账户', dataIndex: 'finaceAccount' },
    { title: '状态说明', dataIndex: 'status' },
    { title: '开户日期', dataIndex: 'openDate' },
  ];

  const columns2: any[] = [
    { title: '银行代码', dataIndex: 'bankCode' },
    { title: '银行名称', dataIndex: 'bankName' },
    { title: '银行账户', dataIndex: 'bankAccount' },
    { title: '开通状态', dataIndex: 'openStatus' },
    { title: '开户日期', dataIndex: 'openDate' },
  ];

  const columns3: any[] = [
    { title: '产品代码', dataIndex: 'productCode' },
    { title: '产品名称', dataIndex: 'productName' },
    { title: '电子合同状态', dataIndex: 'contractStatus' },
    { title: '合同签署日期', dataIndex: 'signDate' },
    { title: '风险揭示书状态', dataIndex: 'bookStatus' },
    { title: '电子合同序号', dataIndex: 'contractSeria' },
    { title: '产品公司名称', dataIndex: 'companyName' },
  ];

  const { current1, current2, current3, pageSize1, pageSize2, pageSize3, total1, total2, total3 } = state;

  return <div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '18px 25px' }}
      title={<div className="ax-card-title">开通的基金公司TA账户</div>}
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
          pageSize={pageSize1}
          current={current1}
          total={total1}
          onChange={handlePageChange1}
          onShowSizeChange={(current, pageSize) => handlePageChange1(1, pageSize)}
        />
      </div>
    </Card>
    <div style={{ height: 12 }}></div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '18px 25px' }}
      title={<div className="ax-card-title">开通的银行理财账户</div>}
    >
      <Table
        rowKey='key'
        loading={state.loading2}
        columns={columns2}
        dataSource={state.dataSource2}
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
          pageSize={pageSize2}
          current={current2}
          total={total2}
          onChange={handlePageChange2}
          onShowSizeChange={(current, pageSize) => handlePageChange2(1, pageSize)}
        />
      </div>
    </Card>
    <div style={{ height: 12 }}></div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '18px 25px' }}
      title={<div className="ax-card-title">资管产品电子合同签署情况</div>}
    >
      <Table
        rowKey='key'
        loading={state.loading3}
        columns={columns3}
        dataSource={state.dataSource3}
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
          pageSize={pageSize3}
          current={current3}
          total={total3}
          onChange={handlePageChange3}
          onShowSizeChange={(current, pageSize) => handlePageChange3(1, pageSize)}
        />
      </div>
    </Card>
  </div>
}
export default FinancialAccount;
