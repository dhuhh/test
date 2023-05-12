import { Card, Col, message, Pagination, Row, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import TableLocale from '../Common/TableLocale'
import { QueryNormalAccountInformation, QueryCapitalAccountInformation, QueryMasterBankInformation } from '$services/customerPanorama';
import lodash from 'lodash';
import styles from './index.less';

const locale = { emptyText: <TableLocale emptyText='无记录' /> };

type Props = Readonly<{
  customerCode: string,
  setLoading: (loading: boolean) => void
}>

interface State {
  loading1: boolean,
  dataSource1: any[],
  basicInfo: any,
  loading2: boolean,
  dataSource2: any[],
  loading3: boolean,
  dataSource3: any[],
  loading4: boolean,
  dataSource4: any[],
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

const GeneralAccount: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    loading1: false,
    dataSource1: [],
    basicInfo: {},
    loading2: false,
    dataSource2: [],
    loading3: false,
    dataSource3: [],
    loading4: false,
    dataSource4: [],
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
      QueryNormalAccountInformation({ custNo: props.customerCode }),
      QueryCapitalAccountInformation({ custNo: props.customerCode, accountType: '0', paging: 1, current: state.current1, pageSize: state.pageSize1 }),
      QueryMasterBankInformation({ custNo: props.customerCode, type: '1', paging: 1, current: state.current2, pageSize: state.pageSize2 }),
      QueryMasterBankInformation({ custNo: props.customerCode, type: '2', paging: 1, current: state.current3, pageSize: state.pageSize3 }),
    ]).then((res: any[]) => {
      props.setLoading(false);
      const [res1, res2, res3, res4] = res;
      const { records: records1 = [], beginService = [] } = res1;
      const basicInfo = lodash.get(records1, '[0]', {});
      const { records: records2 = [], total: total1 = 0 } = res2;
      const { records: records3 = [], total: total2 = 0 } = res3;
      const { records: records4 = [], total: total3 = 0 } = res4;
      setState({
        ...state,
        basicInfo,
        dataSource1: beginService.map((item: any, index: number) => ({ ...item, key: index })),
        dataSource2: records2.map((item: any, index: number) => ({ ...item, key: index })),
        dataSource3: records3.map((item: any, index: number) => ({ ...item, key: index })),
        dataSource4: records4.map((item: any, index: number) => ({ ...item, key: index })),
        total1,
        total2,
        total3,
      })
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])

  const handlePageChange1 = (current: number, pageSize: number | undefined = state.pageSize1) => {
    setState({ ...state, current1: current, pageSize1: pageSize });
    props.setLoading(true);
    QueryCapitalAccountInformation({ custNo: props.customerCode, accountType: '0', paging: 1, current, pageSize }).then((res: any) => {
      props.setLoading(false);
      const { records = [], total = 0 } = res;
      setState({
        ...state,
        dataSource2: records.map((item: any, index: number) => ({ ...item, key: index })),
        total1: total,
        current1: current,
        pageSize1: pageSize,
      });
    })
  }

  const handlePageChange2 = (current: number, pageSize: number | undefined = state.pageSize2) => {
    setState({ ...state, current2: current, pageSize2: pageSize });
    props.setLoading(true);
    QueryMasterBankInformation({ custNo: props.customerCode, type: '1', paging: 1, current, pageSize }).then((res: any) => {
      props.setLoading(false);
      const { records = [], total = 0 } = res;
      setState({
        ...state,
        dataSource3: records.map((item: any, index: number) => ({ ...item, key: index })),
        total2: total,
        current2: current,
        pageSize2: pageSize,
      });
    })
  }

  const handlePageChange3 = (current: number, pageSize: number | undefined = state.pageSize3) => {
    setState({ ...state, current3: current, pageSize3: pageSize });
    props.setLoading(true);
    QueryMasterBankInformation({ custNo: props.customerCode, type: '2', paging: 1, current, pageSize }).then((res: any) => {
      props.setLoading(false);
      const { records = [], total = 0 } = res;
      setState({
        ...state,
        dataSource4: records.map((item: any, index: number) => ({ ...item, key: index })),
        total3: total,
        current3: current,
        pageSize3: pageSize,
      });
    })
  }

  const columns1: any[] = [
    { title: '开通业务', dataIndex: 'openService' },
    { title: '开通日期', dataIndex: 'openDate' },
  ];
  const columns2: any[] = [
    { title: '客户号', dataIndex: 'khh' },
    { title: '是否主账户', dataIndex: 'masterAccount' },
    { title: '资金账户', dataIndex: 'fundAccount' },
    { title: '账户状态', dataIndex: 'status' },
    { title: '账户姓名', dataIndex: 'name' },
    { title: '上日余额(万元)', dataIndex: 'monthBalance' },
    { title: '账户余额(万元)', dataIndex: 'staffBalance' },
    { title: '币种', dataIndex: 'bankStatus' },
    { title: '营业部', dataIndex: 'dept' },
  ];
  const columns3: any[] = [
    { title: '资金账户', dataIndex: 'khh' },
    { title: '银行名称', dataIndex: 'masterAccount' },
    { title: '银行账户', dataIndex: 'fundAccount' },
    { title: '币种', dataIndex: 'status' },
    { title: '账户状态', dataIndex: 'name' },
    { title: '登记日期', dataIndex: 'monthBalance' },
    { title: '注销日期', dataIndex: 'staffBalance' },
    { title: '营业部', dataIndex: 'dept' },
  ];
  const columns4: any[] = [
    { title: '资金账户', dataIndex: 'khh' },
    { title: '银行名称', dataIndex: 'masterAccount' },
    { title: '银行账户', dataIndex: 'fundAccount' },
    { title: '币种', dataIndex: 'status' },
    { title: '账户状态', dataIndex: 'name' },
    { title: '登记日期', dataIndex: 'monthBalance' },
    { title: '注销日期', dataIndex: 'staffBalance' },
    { title: '营业部', dataIndex: 'dept' },
  ];

  const { basicInfo = {}, current1, current2, current3, pageSize1, pageSize2, pageSize3, total3, total2, total1 } = state;
  return <div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '0 25px' }}
      title={<div className="ax-card-title">基本信息</div>}
    >
      <Row style={{ padding: '11px 0', borderBottom: '1px solid #EBECF2' }}>
        <Col span={8} className={styles.basicInfoCol}><span>开户营业部：</span><span>{basicInfo.dept || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>服务营业部：</span><span>{basicInfo.serviceDept || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>开户日期：</span><span>{basicInfo.accountDate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>客户状态：</span><span>{basicInfo.status || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>佣金率：</span><span>{basicInfo.rate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>销户日期：</span><span>{basicInfo.tChannel || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>存管银行：</span><span>{basicInfo.bank || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>存管状态：</span><span>{basicInfo.bankStatus || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span style={{ visibility: 'hidden' }}>-</span><span></span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>委托方式：</span><span>{basicInfo.way || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>近一个月主要委托方式：</span><span>{basicInfo.monthWay || '--'}</span></Col>
      </Row>
      <Row style={{ padding: '19px 0 14px' }}>已开通业务：</Row>
      <Table
        rowKey='key'
        loading={state.loading1}
        columns={columns1}
        dataSource={state.dataSource1}
        className={`m-table-customer ${styles.table}`}
        pagination={false}
        locale={locale}
      />
    </Card>
    <div style={{ height: 12 }}></div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '18px 25px' }}
      title={<div className="ax-card-title">资金账户</div>}
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
      title={<div className="ax-card-title">主存管银行</div>}
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
      title={<div className="ax-card-title">辅助存管银行</div>}
    >
      <Table
        rowKey='key'
        loading={state.loading4}
        columns={columns4}
        dataSource={state.dataSource4}
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
export default GeneralAccount;
