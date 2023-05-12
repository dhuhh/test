import { Card, Col, message, Pagination, Row, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import lodash from 'lodash';
import TableLocale from '../Common/TableLocale'
import { QueryOpenConformation, QuerySingleInformation } from '$services/customerPanorama';
import styles from './index.less';

const locale = { emptyText: <TableLocale emptyText='无记录' /> };

type Props = Readonly<{
  customerCode: string,
  setLoading: (loading: boolean) => void
}>

interface State {
  basicInfo: any,
  loading1: boolean,
  dataSource1: any[],
  current: number,
  pageSize: number,
  total: number,
}

const OptionsAccount: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    basicInfo: {},
    loading1: false,
    dataSource1: [],
    current: 1,
    pageSize: 10,
    total: 0,
  })

  useEffect(() => {
    props.setLoading(true);
    Promise.all([
      QueryOpenConformation({ loginAccount: props.customerCode }),
      QuerySingleInformation({ loginAccount: props.customerCode, paging: 1, current: state.current, pageSize: state.pageSize }),
    ]).then((res: any[]) => {
      props.setLoading(false);
      const [res1, res2] = res;
      const { records: records1 = [] } = res1;
      const basicInfo = lodash.get(records1, '[0]', {});
      const { records: records2 = [], total = 0 } = res2;
      setState({
        ...state,
        basicInfo,
        dataSource1: records2.map((item: any, index: number) => ({ ...item, key: index })),
        total,
      });
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])

  const handlePageChange = (current: number, pageSize: number | undefined = state.pageSize) => {
    setState({ ...state, current, pageSize });
    props.setLoading(true);
    QuerySingleInformation({ loginAccount: props.customerCode, paging: 1, current, pageSize }).then((res: any) => {
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

  const columns1: any[] = [
    { title: '股东号', dataIndex: 'holderNum' },
    { title: '账户类型', dataIndex: 'accountType' },
    { title: '签约日期', dataIndex: 'signDate' },
    { title: '结算类型', dataIndex: 'settlementType' },
    { title: '结算机构', dataIndex: 'settlementOrg' },
    { title: '交易所', dataIndex: 'exchange' },
  ];

  const { current, pageSize, total, basicInfo = {} } = state;

  return <div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '0 25px' }}
      title={<div className="ax-card-title">基本信息</div>}
    >
      <Row style={{ padding: '11px 0', borderBottom: '1px solid #EBECF2' }}>
        <Col span={8} className={styles.basicInfoCol}><span>开通营业部：</span><span>{basicInfo.holderNum || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>服务营业部：</span><span>{basicInfo.accountType || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>开通日期：</span><span>{basicInfo.openDate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>机构标志：</span><span>{basicInfo.orgType || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>投资者分类：</span><span>{basicInfo.investoKind || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>投资者级别：</span><span>{basicInfo.investoLevel || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>签约银行：</span><span>{basicInfo.signBank || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>资金规模上限：</span><span>{basicInfo.upperScale || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>客户状态：</span><span>{basicInfo.staffStatus || '--'}</span></Col>
      </Row>
    </Card>
    <div style={{ height: 12 }}></div>
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
export default OptionsAccount;
