import { FC, useState, useEffect } from 'react';
import { message } from 'antd';
import { FetchQueryOpenFund } from '$services/customeranalysis';
import { unstable_batchedUpdates } from 'react-dom';
import BasicDataTable from '$common/BasicDataTable';

type Props = Readonly<{
  cusNo: string, // 客户号
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
        khh: props.cusNo, // 客户号
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      // console.log('params==========', params);
      FetchQueryOpenFund(params).then((response: any) => {
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
        title: '基金代码',
        dataIndex: 'fundCode',
        key: '基金代码',
      },
      {
        title: '基金名称',
        dataIndex: 'fundName',
        key: '基金名称',
      },
      {
        title: '持有份额',
        dataIndex: 'share',
        key: '持有份额',
      },
      {
        title: '基金市值',
        dataIndex: 'marketValue',
        key: '基金市值',
      },
      {
        title: '单位净值',
        dataIndex: 'netWorth',
        key: '单位净值',
      },
      {
        title: '持有成本',
        dataIndex: 'cost',
        key: '持有成本',
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