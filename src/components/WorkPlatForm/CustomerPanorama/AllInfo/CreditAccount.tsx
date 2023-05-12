import { Card, Col, message, Pagination, Row, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { QueryNormalAndContractInformation, QueryGuAccountInformation, QueryCapitalAccountInformation } from '$services/customerPanorama';
import lodash from 'lodash';
import TableLocale from '../Common/TableLocale'
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
  loading2: boolean,
  dataSource2: any[],
  current1: number,
  pageSize1: number,
  total1: number,
  current2: number,
  pageSize2: number,
  total2: number,
}

const CreditAccount: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    basicInfo: {},
    loading1: false,
    dataSource1: [],
    loading2: false,
    dataSource2: [],
    current1: 1,
    pageSize1: 10,
    total1: 0,
    current2: 1,
    pageSize2: 10,
    total2: 0,
  })

  useEffect(() => {
    props.setLoading(true);
    Promise.all([
      QueryNormalAndContractInformation({ custNo: props.customerCode }),
      QueryGuAccountInformation({ loginAccount: props.customerCode, paging: 1, current: state.current1, pageSize: state.pageSize1 }),
      QueryCapitalAccountInformation({ custNo: props.customerCode, accountType: '1', paging: 1, current: state.current2, pageSize: state.pageSize2 }),
    ]).then((res: any[]) => {
      props.setLoading(false);
      const [res1, res2, res3] = res;
      const { records: records1 = [] } = res1;
      const basicInfo = lodash.get(records1, '[0]', {});
      const { records: records2 = [], total: total1 = 0 } = res2;
      const { records: records3 = [], total: total2 = 0 } = res3;
      setState({
        ...state,
        basicInfo,
        dataSource1: records2.map((item: any, index: number) => ({ ...item, key: index })),
        dataSource2: records3.map((item: any, index: number) => ({ ...item, key: index })),
        total1,
        total2,
      });
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])

  const handlePageChange1 = (current: number, pageSize: number | undefined = state.pageSize1) => {
    setState({ ...state, current1: current, pageSize1: pageSize });
    props.setLoading(true);
    QueryGuAccountInformation({ loginAccount: props.customerCode, paging: 1, current, pageSize }).then((res2: any) => {
      props.setLoading(false);
      const { records: records2 = [], total: total1 = 0 } = res2;
      setState({
        ...state,
        dataSource1: records2.map((item: any, index: number) => ({ ...item, key: index })),
        total1,
        current1: current,
        pageSize1: pageSize,
      });
    })
  }

  const handlePageChange2 = (current: number, pageSize: number | undefined = state.pageSize2) => {
    setState({ ...state, current2: current, pageSize2: pageSize });
    props.setLoading(true);
    QueryCapitalAccountInformation({ custNo: props.customerCode, accountType: '1', paging: 1, current, pageSize }).then((res3: any) => {
      props.setLoading(false);
      const { records: records3 = [], total: total2 = 0 } = res3;
      setState({
        ...state,
        dataSource2: records3.map((item: any, index: number) => ({ ...item, key: index })),
        total2,
        current2: current,
        pageSize2: pageSize,
      });
    })
  }

  const { basicInfo = {}, current1, pageSize1, total1, current2, pageSize2, total2 } = state;

  const columns1: any[] = [
    { title: '交易所', dataIndex: 'khh' },
    { title: '股东号', dataIndex: 'holder' },
    { title: '股东姓名', dataIndex: 'holderName' },
    { title: '服务项目', dataIndex: 'holderApp' },
    { title: '股东身份证号', dataIndex: 'holderCard' },
    { title: '登记日期', dataIndex: 'registerDate' },
    { title: '股东状态', dataIndex: 'holderStatus' },
    { title: '结算币种', dataIndex: 'currency' },
    { title: '股东属性', dataIndex: 'attribute' },
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
        <Col span={8} className={styles.basicInfoCol}><span>开户日期：</span><span>{basicInfo.openDate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>佣金率：</span><span>{basicInfo.rate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>担保比率：</span><span>{basicInfo.guarantRate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>销户日期：</span><span>{basicInfo.cancelDate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>信用级别：</span><span>{basicInfo.creditRating || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>信用评分：</span><span>{basicInfo.creditScore || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>评级日期：</span><span>{basicInfo.ratDate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>授信申请融资额度(万元)：</span><span>{basicInfo.finanzLimit || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>授信申请融券额度(万元)：</span><span>{basicInfo.finanjLimit || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>额度使用率：</span><span>{basicInfo.quotaRate || '--'}</span></Col>
      </Row>
    </Card>
    <div style={{ height: 12 }}></div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '0 25px' }}
      title={<div className="ax-card-title">合同信息</div>}
    >
      <Row style={{ padding: '11px 0', borderBottom: '1px solid #EBECF2' }}>
        <Col span={8} className={styles.basicInfoCol}><span>合同编号：</span><span>{basicInfo.contractNum || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>币种：</span><span>{basicInfo.currency || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>计息方式：</span><span>{basicInfo.calMethod || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>合同融资额度(万元)：</span><span>{basicInfo.contractQuota || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>授信融资额度(万元)：</span><span>{basicInfo.xinzQuota || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>融资日利率：</span><span>{basicInfo.dayRate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>合同融券额度(万元)：</span><span>{basicInfo.conQuota || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>授信融券额度(万元)：</span><span>{basicInfo.xinjQuota || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>融券日利率：</span><span>{basicInfo.volumeRate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>登记日期：</span><span>{basicInfo.gradeDate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>合同开始日期：</span><span>{basicInfo.beginDate || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>合同终止日期：</span><span>{basicInfo.endDate || '--'}</span></Col>
      </Row>
    </Card>
    <div style={{ height: 12 }}></div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '18px 25px' }}
      title={<div className="ax-card-title">股东账户</div>}
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
          pageSize={pageSize2}
          current={current2}
          total={total2}
          onChange={handlePageChange2}
          onShowSizeChange={(current, pageSize) => handlePageChange2(1, pageSize)}
        />
      </div>
    </Card>
  </div>
}
export default CreditAccount;
