import { FC, useState, useEffect } from 'react';
import { message } from 'antd';
import { FetchQueryTradingClients } from '$services/customeranalysis';
import { unstable_batchedUpdates } from 'react-dom';
import BasicDataTable from '$common/BasicDataTable';

type Props = Readonly<{
  type?: number, // 账户类型
  yrid: string,
  belong: number, // 客户归属
  stockCode: string, // 证券代码
  startDate: number, // 开始日期
  endDate: number, // 结束日期
}>

// 分页
interface pageProps {
  pageSize: number,
  current: number,
  total: number,
}

const TradingCustomer: FC<Props> = (props) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [pagination, setPagination] = useState<pageProps>({ pageSize: 10, current: 1, total: 0, });

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(pagination)])

  // 查询table数据
  const fetchData = () => {
      const params: { [key: string]: any } = {
        queryHierarchy: 1,
        queryValue: props.yrid,
        custBelong: props.belong,
        stockCode: props.stockCode,
        accountType: props.type, // 账户类型 空｜合并账户；1｜普通账户；2｜信用账户
        startDate: props.startDate, // 开始日期
        endDate: props.endDate, // 结束日期
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      // console.log('params==========', params);
      FetchQueryTradingClients(params).then((response: any) => {
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
        title: '成交数量',
        dataIndex: 'numOfTransactions',
        key: '成交数量',
        sorter: (a: any, b: any) => a.numOfTransactions - b.numOfTransactions,
      },
      {
        title: '成交均价',
        dataIndex: 'avgOfTransactions',
        key: '成交均价',
        sorter: (a: any, b: any) => a.avgOfTransactions - b.avgOfTransactions,
      },
      {
        title: '成交金额(万)',
        dataIndex: 'transactionamount',
        key: '成交金额(万)',
        sorter: (a: any, b: any) => a.transactionamount - b.transactionamount,
      },
      {
        title: '买量',
        dataIndex: 'numOfBuy',
        key: '买量',
        sorter: (a: any, b: any) => a.numOfBuy - b.numOfBuy,
      },
      {
        title: '买均价',
        dataIndex: 'avgPriceOfBuy',
        key: '买均价',
        sorter: (a: any, b: any) => a.avgPriceOfBuy - b.avgPriceOfBuy,
      },
      {
        title: '卖量',
        dataIndex: 'numOfSell',
        key: '卖量',
        sorter: (a: any, b: any) => a.numOfSell - b.numOfSell,
      },
      {
        title: '卖均价',
        dataIndex: 'avgPriceOfSell',
        key: '卖均价',
        sorter: (a: any, b: any) => a.avgPriceOfSell - b.avgPriceOfSell,
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

export default TradingCustomer;