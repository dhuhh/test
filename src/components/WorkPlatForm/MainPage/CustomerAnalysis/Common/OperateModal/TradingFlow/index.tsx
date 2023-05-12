import { FC, useState, useEffect } from 'react';
import { message } from 'antd';
import { FetchQuerytransactionFlow } from '$services/customeranalysis';
import { unstable_batchedUpdates } from 'react-dom';
import BasicDataTable from '$common/BasicDataTable';

type Props = Readonly<{
  type?: number, // 账户类型
  queryValue: number, // 查询值, 默认人员id
  cusNo?: string, // 客户号
  startDate: number, // 开始日期
  endDate: number, // 结束日期
  stockCode?: string, // 证券代码
  custBelong: number, // 客户归属
}>

// 分页
interface pageProps {
  pageSize: number,
  current: number,
  total: number,
}

const TradingFlow: FC<Props> = (props) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [pagination, setPagination] = useState<pageProps>({ pageSize: 10, current: 1, total: 0, });

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(pagination)])

  // 查询table数据
  const fetchData = () => {
      const params: { [key: string]: any } = {
        accountType: props.type, // 账户类型 根据具体页面规则来
        queryHierarchy: 1, // 1-->人员;2-->团队;3-->营业部
        queryValue: props.queryValue, // 1-->人员id;2-->团队id;3-->营业部id
        khh: props.cusNo, // 客户号
        stockCode: props.stockCode, // 证券代码
        custBelong: props.custBelong, // 客户归属
        startTime: props.startDate, // 开始日期
        endTime: props.endDate, // 结束日期
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      // console.log('params==========', params);
      FetchQuerytransactionFlow(params).then((response: any) => {
        const { records = [] } = response || {};
        unstable_batchedUpdates(() => {
          setDataSource(records);
          setPagination({...pagination, total: response.total});
        })
      }).catch((error: any) => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  const getColumns = () => {
    return [
      {
        title: '账户类型',
        dataIndex: 'accountType',
        key: '账户类型',
        sorter: (a: any, b: any) => a.accountType.length - b.accountType.length,
      },
      {
        title: '成交日期',
        dataIndex: 'closinDate',
        key: '成交日期',
        sorter: (a: any, b: any) => a.closinDate - b.closinDate,
      },
      {
        title: '成交时间',
        dataIndex: 'transactionTime',
        key: '成交时间',
        sorter: (a: any, b: any) => a.transactionTime.length - b.transactionTime.length,
      },
      {
        title: '客户号',
        dataIndex: 'custCode',
        key: '客户号',
        sorter: (a: any, b: any) => a.custCode - b.custCode,
      },
      {
        title: '客户姓名',
        dataIndex: 'custName',
        key: '客户姓名',
        sorter: (a: any, b: any) => a.custName.length - b.custName.length,
      },
      {
        title: '证券代码',
        dataIndex: 'stockCode',
        key: '证券代码',
        sorter: (a: any, b: any) => a.stockCode - b.stockCode,
      },
      {
        title: '证券名称',
        dataIndex: 'stockName',
        key: '证券名称',
        sorter: (a: any, b: any) => a.stockName.length - b.stockName.length,
      },
      {
        title: '买卖方式',
        dataIndex: 'buyingAndSelling',
        key: '买卖方式',
        sorter: (a: any, b: any) => a.buyingAndSelling.length - b.buyingAndSelling.length,
      },
      {
        title: '成交价格',
        dataIndex: 'dealPrice',
        key: '成交价格',
        sorter: (a: any, b: any) => a.dealPrice - b.dealPrice,
      },
      {
        title: '成交数量',
        dataIndex: 'numberOfTransactions',
        key: '成交数量',
        sorter: (a: any, b: any) => a.numberOfTransactions - b.numberOfTransactions,
      },
      {
        title: '成交金额',
        dataIndex: 'turnover',
        key: '成交金额',
        sorter: (a: any, b: any) => a.turnover - b.turnover,
      },
      {
        title: '佣金',
        dataIndex: 'commission',
        key: '佣金',
        sorter: (a: any, b: any) => a.commission - b.commission,
      },
    ];
  }

  const tableProps = {
    bordered: true,
    scroll: { x: true },
    rowKey: 'key',
    dataSource: dataSource.map((item: any, index: number) => {
      return { ...item,key: ((pagination.current - 1) * pagination.pageSize) + index + 1 };
    }),
    columns: getColumns(),
    className: 'm-Card-Table',
    pagination: {
      className: 'm-bss-paging',
      showTotal: (totals: number) => {
        return `总共${totals}条`;
      },
      showLessItems: true,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['5', '10', '20', '30', '50'],
      total: pagination.total,
      paging: 1,
      current: pagination.current,
      pageSize: pagination.pageSize,
      onChange: (current: number, pageSize: number) => {
        setPagination({ ...pagination, current, pageSize });
      },
      onShowSizeChange: (current: number, pageSize: number) => {
        setPagination({ ...pagination, current, pageSize });
      },
    },
  };

  return (
    <BasicDataTable {...tableProps} style={{ margin: '10px 10px 20px' }} />
  );
}

export default TradingFlow;