import { FC, useState, useEffect } from 'react';
import moment from 'moment';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import styles from '../../Common/SearchContent/index.less';
import { unstable_batchedUpdates } from 'react-dom';
import { FetchQueryStockTransactionRanking } from '$services/customeranalysis';
import BasicDataTable from '$common/BasicDataTable';
import SearchContent from '../../Common/SearchContent';
import TableBtn from '../../Common/TableBtn/index.js';
import TradingCustomer from '../../Common/OperateModal/TradingCustomer';
import TradingFlow from '../../Common/OperateModal/TradingFlow';

type Props = Readonly<{
  tabKey: string,
  userBasicInfo: any,
}>

interface selectProps {
  selectAll: boolean,
  selectedRowKeys: string[] | number[],
  selectedRows: any[],
}

interface pageProps {
  pageSize: number,
  current: number,
  total: number,
}

const NormalAccounts: FC<Props> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tableVisible, setTableVisible] = useState<boolean>(false);
  const [openLeftVisible, setOpenLeftVisible] = useState<boolean>(false); // table操作部分左侧点击弹窗
  const [openRightVisible, setOpenRightVisible] = useState<boolean>(false); // table操作部分右侧点击弹窗
  const [dataSource, setDataSource] = useState<any>([]);
  const [pagination, setPagination] = useState<pageProps>({ pageSize: 10, current: 1, total: 0, });
  const [selection, setSelection] = useState<selectProps>({ selectAll: false, selectedRowKeys: [], selectedRows: [] });
  const [md5, setMd5] = useState<string>('');
  const [allParams, setAllParams] = useState<any[]>([]); // 所有子组件参数
  const [fetchParams, setFetchParams] = useState<any>({}); // 所有查询字段参数
  const [queryMark, setQueryMark] = useState<number>(0); // 作为点击查询的标识

  const [stockCode, setStockCode] = useState<string>(''); // 选中的证券代码

  useEffect(() => {
    if(getTypeValue('transactionTime') === '0' && getTypeValue('dateSelection')[0] && Number(getTypeValue('monthSelection')[0].format('YYYYMM')) < Number(moment().subtract(1, 'year').format('YYYYMM'))) {
      message.info(`近期查询可查询时间区间为：${moment().subtract(1, 'year').format('YYYYMM')}--上一交易日的信息!`);
    } else if(getTypeValue('transactionTime') === '1' && getTypeValue('dateSelection')[1] && Number(getTypeValue('monthSelection')[1].format('YYYYMM')) > Number(moment().subtract(1, 'year').format('YYYYMM'))) {
      message.info(`历史查询可查询时间区间为：归档日${moment().subtract(1, 'year').format('YYYYMM')}之前的历史信息!`);
    } else {
      fetchData();
    }
  }, [JSON.stringify(pagination), queryMark])

  // 根据标识名获取组件值
  const getTypeValue = (typeName: string) => {
    return allParams.find(item => item.name === typeName)?.value;
  }

  // 查询table数据
  const fetchData = () => {
    if(allParams.length > 0) {
      setLoading(true);
      const params: { [key: string]: any } = {
        queryLevel: 1, // 查询层级，默认为1
        queryValue: props.userBasicInfo.ryid, // 人员id
        belong: getTypeValue('customerAttribution'), // 客户归属
        department: getTypeValue('accountOpeningDepartment').join(), // 开户营业部
        startDate: getTypeValue('dateSelection')[0]? Number(getTypeValue('dateSelection')[0].format('YYYYMMDD')) : (getTypeValue('transactionTime') === '1' ? Number(moment().subtract(2, 'year').format('YYYYMMDD')) : Number(moment().subtract(1, 'year').format('YYYYMMDD'))) , // 开始日期
        endDate: getTypeValue('dateSelection')[1]? Number(getTypeValue('dateSelection')[1].format('YYYYMMDD')) : (getTypeValue('transactionTime') === '1' ? Number(moment().subtract(1, 'year').format('YYYYMMDD')) : Number(moment().format('YYYYMMDD'))), // 结束日期
        order: getTypeValue('rankOrder'), // 排序
        top: getTypeValue('rankingRange'), // 排名范围
        stockCode: getTypeValue('securitiesCode').join(), // 证券代码
        type: 1, // 账户类型 0｜合并账户；1｜普通账户；2｜信用账户
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      setFetchParams(params);
      // console.log('params==========', params);
      FetchQueryStockTransactionRanking(params).then((response: any) => {
        const { records = [] } = response || {};
        unstable_batchedUpdates(() => {
          setLoading(false);
          setMd5(response.note);
          setDataSource(records);
          setPagination({...pagination, total: response.total});
        })
      }).catch((error: any) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  const queryData = () => {
    setTableVisible(true);
    setPagination({ ...pagination, current: 1 });
    setSelection({ selectAll: false, selectedRowKeys: [], selectedRows: [] });
    setQueryMark(queryMark + 1);
  }

  // 获取所有组件值
  const getAllParams = (paramsList: any[]) => {
    setAllParams(paramsList);
  }

  const getColumns = () => {
    return [
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
        dataIndex: 'transactionsNum',
        key: '成交数量',
        sorter: (a: any, b: any) => a.transactionsNum - b.transactionsNum,
      },
      {
        title: '成交金额(万)',
        dataIndex: 'transactionsAmount',
        key: '成交金额(万)',
        sorter: (a: any, b: any) => a.transactionsAmount - b.transactionsAmount,
      },
      {
        title: '买入数量',
        dataIndex: 'purchaseNum',
        key: '买入数量',
        sorter: (a: any, b: any) => a.purchaseNum - b.purchaseNum,
      },
      {
        title: '买入金额(万)',
        dataIndex: 'purchaseAmount',
        key: '买入金额(万)',
        sorter: (a: any, b: any) => a.purchaseAmount - b.purchaseAmount,
      },
      {
        title: '卖出数量',
        dataIndex: 'soldNum',
        key: '卖出数量',
        sorter: (a: any, b: any) => a.soldNum - b.soldNum,
      },
      {
        title: '卖出金额(万)',
        dataIndex: 'soldAmount',
        key: '卖出金额(万)',
        sorter: (a: any, b: any) => a.soldAmount - b.soldAmount,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: '操作',
        render: (text: string, record: any) => <div><span onClick={() => { setStockCode(record.stockCode); setOpenLeftVisible(true); }} style={{ marginRight: '20px', fontSize: 14, color: '#244FFF' }}>交易客户</span><span onClick={() => { setStockCode(record.stockCode); setOpenRightVisible(true) }} style={{ fontSize: 14, color: '#244FFF' }}>交易流水</span></div>,
      },
    ];
  }

  const controlList = [
    { name: 'transactionTime' },
    { name: 'dateSelection', dateLabel: '成交日期', isDescribe: true },
    { name: 'securitiesCode' },
    { name: 'accountOpeningDepartment' },
    { name: 'customerAttribution' },
    { name: 'rankOrder' },
    { name: 'rankingRange' },
  ];

  const btnProps = { type: 3, total: pagination.total, getColumns: getColumns, param: fetchParams, selectAll: selection.selectAll, selectedRows: selection.selectedRows, md5: md5 };

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
      pageSizeOptions: ['10', '20', '50', '100'],
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
    rowSelection: {
      type: 'checkbox',
      crossPageSelect: true, // checkbox默认开启跨页全选
      selectAll: selection.selectAll,
      selectedRowKeys: selection.selectedRowKeys,
      onChange: (currentSelectedRowKeys: string[] | number[], selectedRows: any[], currentSelectAll: boolean) => {
        setSelection({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys, selectedRows });
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.status === 0, // Column configuration not to be checked
        name: record.status,
      }),
      fixed: true,
    },
  };

  return (
    <>
      <div style={{ padding: '8px 24px 24px' }}>
        <SearchContent getAllParams={getAllParams} queryData={queryData} controlList={controlList} hasDateDefault={true} />
        {
          tableVisible && (
          <>
            <TableBtn {...btnProps}/>
            <BasicDataTable {...tableProps} style={{ marginBottom: 20 }} loading={loading}/>
            <Modal
              title='交易客户'
              visible={openLeftVisible}
              className={styles.codeModal}
              onCancel={() => { setOpenLeftVisible(false) }}
              width="860px"
              destroyOnClose
              footer={null}
            >
              <TradingCustomer type={1} yrid={props.userBasicInfo.ryid} belong={fetchParams?.belong} stockCode={stockCode} startDate={fetchParams?.startDate} endDate={fetchParams?.endDate} />
            </Modal>
            <Modal
              title='交易流水'
              visible={openRightVisible}
              className={styles.codeModal}
              onCancel={() => { setOpenRightVisible(false) }}
              width="1000px"
              destroyOnClose
              footer={null}
            >
              <TradingFlow type={1} stockCode={stockCode} queryValue={props.userBasicInfo.ryid} startDate={fetchParams?.startDate} endDate={fetchParams?.endDate} custBelong={fetchParams?.belong} />
            </Modal>
          </>
          )
        }
      </div>
    </>
  );
}

export default connect(({ global }: any)=>({
  userBasicInfo: global.userBasicInfo,
}))(NormalAccounts);