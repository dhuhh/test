import { FC, useState, useEffect } from 'react';
import { message } from 'antd';
import { FetchQueryAssetChangeHistory } from '$services/customeranalysis';
import { unstable_batchedUpdates } from 'react-dom';
import BasicDataTable from '$common/BasicDataTable';

type Props = Readonly<{
  type?: number, // 账户类型
  cusNo: string, // 客户号
  startDate: number, // 开始日期
  endDate: number, // 结束日期
}>

// 分页
interface pageProps {
  pageSize: number,
  current: number,
  total: number,
}

const AssetChange: FC<Props> = (props) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [pagination, setPagination] = useState<pageProps>({ pageSize: 10, current: 1, total: 0, });

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(pagination)])

  // 查询table数据
  const fetchData = () => {
      const params: { [key: string]: any } = {
        accountType: props.type, // 账户类型 空｜合并账户；1｜普通账户；2｜信用账户
        cusNo: props.cusNo, // 客户号
        startDate: props.startDate, // 开始日期
        endDate: props.endDate, // 结束日期
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      // console.log('params==========', params);
      FetchQueryAssetChangeHistory(params).then((response: any) => {
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
        title: '日期',
        dataIndex: 'dateTime',
        key: '日期',
      },
      {
        title: '动作',
        dataIndex: 'action',
        key: '动作',
      },
      {
        title: '币种',
        dataIndex: 'currency',
        key: '币种',
      },
      {
        title: '余额市值',
        dataIndex: 'balanceValue',
        key: '余额市值',
      },
      {
        title: '资金余额',
        dataIndex: 'balance',
        key: '资金余额',
      },
      {
        title: '摘要',
        dataIndex: 'summary',
        key: '摘要',
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

export default AssetChange;