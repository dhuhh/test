import { FC, useState, useEffect } from 'react';
import { message } from 'antd';
import { FetchQuerystockHoldings } from '$services/customeranalysis';
import { unstable_batchedUpdates } from 'react-dom';
import BasicDataTable from '$common/BasicDataTable';

type Props = Readonly<{
  type?: number, // 账户类型
  cusNo: string, // 客户号
}>

// 分页
interface pageProps {
  pageSize: number,
  current: number,
  total: number,
}

const Stock: FC<Props> = (props) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [pagination, setPagination] = useState<pageProps>({ pageSize: 10, current: 1, total: 0, });

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(pagination)])

  // 查询table数据
  const fetchData = () => {
      const params: { [key: string]: any } = {
        accountType: props.type, // 账户类型 1｜合并账户；2｜普通账户；3｜信用账户
        khh: props.cusNo, // 客户号
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      // console.log('params==========', params);
      FetchQuerystockHoldings(params).then((response: any) => {
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
        title: '交易所',
        dataIndex: 'exchange',
        key: '交易所',
      },
      {
        title: '证券代码',
        dataIndex: 'stockCode',
        key: '证券代码',
      },
      {
        title: '证券名称',
        dataIndex: 'stockName',
        key: '证券名称',
      },
      {
        title: '持仓数量',
        dataIndex: 'numberOfPositions',
        key: '持仓数量',
      },
      {
        title: '持仓市值',
        dataIndex: 'marketOfPositions',
        key: '持仓市值',
      },
      {
        title: '最新价',
        dataIndex: 'latestPrice',
        key: '最新价',
      },
      {
        title: '盈亏',
        dataIndex: 'profitAndLoss',
        key: '盈亏',
      },
      {
        title: '成本价',
        dataIndex: 'costPrice',
        key: '成本价',
      },
      {
        title: '账户类型',
        dataIndex: 'accountType',
        key: '账户类型',
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

export default Stock;