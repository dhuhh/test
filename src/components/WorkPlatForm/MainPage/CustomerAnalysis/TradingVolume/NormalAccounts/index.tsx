import { FC, useState, useEffect } from 'react';
import moment from 'moment';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import styles from '../../Common/SearchContent/index.less';
import { Link } from 'umi';
import { unstable_batchedUpdates } from 'react-dom';
import { FetchQueryTradingOrdinaryAccount } from '$services/customeranalysis';
import { CustomizeDivider } from '../../Common/UniversalTool';
import BasicDataTable from '$common/BasicDataTable';
import SearchContent from '../../Common/SearchContent';
import TableBtn from '../../Common/TableBtn/index.js';
import TradingFlow from '../../Common/OperateModal/TradingFlow';
import CustomerPosition from '../../Common/OperateModal/CustomerPosition';

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

  const [cusNo, setCusNo] = useState<string>(''); // 选中的客户号

  useEffect(() => {
    if(getTypeValue('transactionTime') === '0' && getTypeValue('monthSelection')[0] && Number(getTypeValue('monthSelection')[0].format('YYYYMM')) < Number(moment().subtract(1, 'year').format('YYYYMM'))) {
      message.info(`近期查询可查询时间区间为：${moment().subtract(1, 'year').format('YYYYMM')}--本月的信息!`);
    } else if(getTypeValue('transactionTime') === '1' && getTypeValue('monthSelection')[1] && Number(getTypeValue('monthSelection')[1].format('YYYYMM')) > Number(moment().subtract(1, 'year').format('YYYYMM'))) {
      message.info(`历史查询可查询时间区间为：${moment().subtract(1, 'year').format('YYYYMM')}之前的历史信息!`);
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
        queryHierarchy: 1, // 查询层级，默认为1
        queryValue: props.userBasicInfo.ryid, // 人员id
        custLeve: getTypeValue('customerLever').join(), // 客户级别
        custGroup: getTypeValue('custGrup').join(), // 客户群
        custBelong: getTypeValue('customerAttribution'), // 客户归属
        depart: getTypeValue('accountOpeningDepartment').join(), // 开户营业部
        custSource: getTypeValue('custSource'), // 客户来源
        startMonth: getTypeValue('monthSelection')[0]? Number(getTypeValue('monthSelection')[0].format('YYYYMM')) : (getTypeValue('transactionTime') === '1' ? Number(moment().subtract(2, 'year').format('YYYYMM')) : Number(moment().subtract(1, 'year').format('YYYYMM'))) , // 开始日期
        endMonth: getTypeValue('monthSelection')[1]? Number(getTypeValue('monthSelection')[1].format('YYYYMM')) : (getTypeValue('transactionTime') === '1' ? Number(moment().subtract(1, 'year').format('YYYYMM')) : Number(moment().format('YYYYMM'))), // 结束日期
        isOrder: getTypeValue('rankOrder'), // 排序
        offset: getTypeValue('rankingRange'), // 排名范围
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      if(getTypeValue('custSource') === 1) { // 客户来源选择渠道
        params['chnl'] = getTypeValue('channel').join();
      }
      setFetchParams(params);
      // console.log('params==========', params);
      FetchQueryTradingOrdinaryAccount(params).then((response: any) => {
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
        render: (text: string, record: any) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.custCode}`} target='_blank'>{text}</Link>,
      },
      {
        title: '所在营业部',
        dataIndex: 'custDepart',
        key: '所在营业部',
        sorter: (a: any, b: any) => a.custDepart.length - b.custDepart.length,
      },
      {
        title: '交易量(元)',
        dataIndex: 'tradingVolume',
        key: '交易量(元)',
        sorter: (a: any, b: any) => a.tradingVolume - b.tradingVolume,
      },
      {
        title: '净佣金(元)',
        dataIndex: 'netCommission',
        key: '净佣金(元)',
        sorter: (a: any, b: any) => a.netCommission - b.netCommission,
      },
      {
        title: '交易笔数(元)',
        dataIndex: 'tradeCount',
        key: '交易笔数(元)',
        sorter: (a: any, b: any) => a.tradeCount - b.tradeCount,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: '操作',
        render: (text: string, record: any) => <div><span onClick={() => { setCusNo(record.custCode); setOpenLeftVisible(true); }} style={{ marginRight: '20px', fontSize: 14, color: '#244FFF' }}>交易流水</span><span onClick={() => { setCusNo(record.custCode); setOpenRightVisible(true) }} style={{ fontSize: 14, color: '#244FFF' }}>客户持仓</span></div>,
      },
    ];
  }

  const controlList = [
    { name: 'transactionTime' },
    { name: 'customerLever' },
    { name: 'customerAttribution' },
    { name: 'accountOpeningDepartment' },
    { name: 'custGrup' },
    { name: 'custSource' },
    { name: 'monthSelection', dateLabel: '日期', isDescribe: true },
    { name: 'rankOrder' },
    { name: 'rankingRange' },
  ];

  const btnProps = { type: 5, iskhh: true, total: pagination.total, getColumns: getColumns, param: fetchParams, selectAll: selection.selectAll, selectedRows: selection.selectedRows, md5: md5 };

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
        <SearchContent getAllParams={getAllParams} queryData={queryData} controlList={controlList} />
        {
          tableVisible && (
          <>
            <TableBtn {...btnProps}/>
            <BasicDataTable {...tableProps} style={{ marginBottom: 20 }} loading={loading}/>
            <Modal
              title='交易流水'
              visible={openLeftVisible}
              className={styles.codeModal}
              onCancel={() => { setOpenLeftVisible(false) }}
              width="1000px"
              destroyOnClose
              footer={null}
            >
              <TradingFlow type={1} cusNo={cusNo} queryValue={props.userBasicInfo.ryid} startDate={fetchParams?.startMonth} endDate={fetchParams?.endMonth} custBelong={fetchParams?.custBelong} />
            </Modal>
            <Modal
              title='客户持仓'
              visible={openRightVisible}
              className={styles.codeModal}
              onCancel={() => { setOpenRightVisible(false) }}
              width="860px"
              destroyOnClose
              footer={null}
            >
              <CustomerPosition type={1} cusNo={cusNo} tabList={'股票'} />
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