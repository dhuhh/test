import { FC, useState, useEffect } from 'react';
import moment from 'moment';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import styles from '../../Common/SearchContent/index.less';
import Chart from '../Chart';
import { Link } from 'umi';
import { unstable_batchedUpdates } from 'react-dom';
import { FetchQueryAssetTrend, FetchQueryAssetInflowAndOutflow } from '$services/customeranalysis';
import { lineItemObject } from '../../Common/Charts/provideType';
import { CustomizeDivider } from '../../Common/UniversalTool';
import BasicDataTable from '$common/BasicDataTable';
import SearchContent from '../../Common/SearchContent';
import TableBtn from '../../Common/TableBtn/index.js';
import AssetChange from '../../Common/OperateModal/AssetChange';
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
  const [xBarData, setXBarData] = useState<string[]>([]);
  const [seriesBarData, setSeriesBarData] = useState<number[]>([]);
  const [xLineData, setXLineData] = useState<string[]>([]);
  const [seriesLineData, setSeriesLineData] = useState<lineItemObject[]>([]);
  const [inFlowData, setInFlowData] = useState<lineItemObject>({ name: '净流入客户', color: '#1389F4', rgbaColor: 'rgba(19, 137, 244, 0.2)', data: [] });
  const [outFlowData, setOutFlowData] = useState<lineItemObject>({ name: '净流出客户', color: '#F6C34F', rgbaColor: 'rgba(246, 195, 79, 0.2)', data: [] });

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

  useEffect(() => {
    fetchEchartsData(1);
    fetchEchartsData(2);
    fetchEchartsData(3);
  }, [])

  useEffect(() => {
    setSeriesLineData([inFlowData, outFlowData]);
  }, [JSON.stringify(inFlowData), JSON.stringify(outFlowData)])

  // 根据标识名获取组件值
  const getTypeValue = (typeName: string) => {
    return allParams.find(item => item.name === typeName)?.value;
  }

  // 查询图表数据
  const fetchEchartsData = (type: number) => {
    FetchQueryAssetTrend({ 
      queryLevel: 1, // 查询层级，默认为1
      queryValue: props.userBasicInfo.ryid, // 人员id
      type, // 查询类型，1|月末账户资产分布趋势;2|净流入趋势分析;3|净流出趋势分析;4|账户盈亏趋势5|月度交易量趋势变化6|平均佣金率变化趋势
      accountType: 2, // 账户类型 1｜合并账户；2｜普通账户；3｜信用账户
     }).then((response: any) => {
      const { records = [] } = response || {};
      if(type === 1) {
        let xData: string[] = [];
        let yData: number[] = [];
        records.forEach((item: any) => {
          xData.push(item.month);
          yData.push(Number(item.asset));
        });
        setXBarData(xData);
        setSeriesBarData(yData);
      } else if(type === 2) {
        let xData: string[] = [];
        let inData: number[] = [] // 净流入客户
        records.forEach((item: any) => {
          xData.push(item.month);
          inData.push(item.netInflowCustomer);
        });
        setXLineData(xData);
        setInFlowData({ ...inFlowData, data: inData })
      } else if(type === 3) {
        let outData: number[] = [] // 净流出客户
        records.forEach((item: any) => {
          outData.push(item.netOutflowCustomer);
        });
        setOutFlowData({ ...outFlowData, data: outData });
      }
    }).catch((error: any) => {
      message.error(!error.success ? error.message : error.note);
    });
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
        source: getTypeValue('custSource'), // 客户来源
        openStartDate: getTypeValue('dateSelection')[0]? Number(getTypeValue('dateSelection')[0].format('YYYYMMDD')) : 19000101, // 开户开始日期
        openEndDate: getTypeValue('dateSelection')[1]? Number(getTypeValue('dateSelection')[1].format('YYYYMMDD')) : 30000101, // 开户结束日期
        startDate: getTypeValue('monthSelection')[0]? Number(getTypeValue('monthSelection')[0].format('YYYYMM')) : (getTypeValue('transactionTime') === '1' ? Number(moment().subtract(2, 'year').format('YYYYMM')) : Number(moment().subtract(1, 'year').format('YYYYMM'))) , // 开始日期
        endDate: getTypeValue('monthSelection')[1]? Number(getTypeValue('monthSelection')[1].format('YYYYMM')) : (getTypeValue('transactionTime') === '1' ? Number(moment().subtract(1, 'year').format('YYYYMM')) : Number(moment().format('YYYYMM'))), // 结束日期
        type: getTypeValue('assetFlow'), // 查询类型, 1 净流入 2 流入 3 流出
        order: getTypeValue('rankOrder'), // 排序
        top: getTypeValue('rankingRange'), // 排名范围
        accountType: 2, // 账户类型 1｜合并账户；2｜普通账户；3｜信用账户
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      if(getTypeValue('custSource') === 1) { // 客户来源选择渠道
        params['channel'] = getTypeValue('channel').join();
      }
      if(getTypeValue('assetFlow') === 1) {
        params['netInflowFloor'] = getTypeValue('intervalMin'); // 净流入下限
        params['netInflowTopLimit'] = getTypeValue('intervalMax'); // 净流入上限
      } else if(getTypeValue('assetFlow') === 2) {
        params['inflowFloor'] = getTypeValue('intervalMin'); // 流入下限
        params['inflowTopLimit'] = getTypeValue('intervalMax'); // 流入上限
      } else if(getTypeValue('assetFlow') === 3) {
        params['outflowFloor'] = getTypeValue('intervalMin'); // 流出下限
        params['outflowTopLimit'] = getTypeValue('intervalMax'); // 流出上限
      }
      setFetchParams(params);
      // console.log('params==========', params);
      FetchQueryAssetInflowAndOutflow(params).then((response: any) => {
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

  const assetFlowTitle =  [
    {
      title: '净资产流入(万)',
      dataIndex: 'netInflow',
      key: '净资产流入(万)',
      sorter: (a: any, b: any) => a.netInflow - b.netInflow,
    },
    {
      title: '资产流入(万)',
      dataIndex: 'inflow',
      key: '资产流入(万)',
      sorter: (a: any, b: any) => a.inflow - b.inflow,
    },
    {
      title: '资产流出(万)',
      dataIndex: 'outflow',
      key: '资产流出(万)',
      sorter: (a: any, b: any) => a.outflow - b.outflow,
    }
  ];

  const getColumns = () => {
    const tmpColumns = [
      {
        title: '客户营业部',
        dataIndex: 'department',
        key: '客户营业部',
        sorter: (a: any, b: any) => a.department.length - b.department.length,
      },
      {
        title: '客户号',
        dataIndex: 'cusNo',
        key: '客户号',
        sorter: (a: any, b: any) => a.cusNo - b.cusNo,
      },
      {
        title: '客户姓名',
        dataIndex: 'cusName',
        key: '客户姓名',
        sorter: (a: any, b: any) => a.cusName.length - b.cusName.length,
        render: (text: string, record: any) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.cusNo}`} target='_blank'>{text}</Link>,
      },
      {
        title: '上日资产(万)',
        dataIndex: 'previousAssets',
        key: '上日资产(万)',
        sorter: (a: any, b: any) => a.previousAssets - b.previousAssets,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: '操作',
        render: (text: string, record: any) => <div><span onClick={() => { setCusNo(record.cusNo); setOpenLeftVisible(true); }} style={{ marginRight: '20px', fontSize: 14, color: '#244FFF' }}>资产变动</span><span onClick={() => { setCusNo(record.cusNo); setOpenRightVisible(true) }} style={{ fontSize: 14, color: '#244FFF' }}>客户持仓</span></div>,
      },
    ];
    if(fetchParams?.type) tmpColumns.splice(-2, 0, assetFlowTitle[fetchParams?.type - 1]);
    return tmpColumns;
  }

  const controlList = [
    { name: 'transactionTime' },
    { name: 'customerAttribution' },
    { name: 'accountOpeningDepartment' },
    { name: 'custSource' },
    { name: 'dateSelection', dateLabel: '开户日期' },
    { name: 'monthSelection', dateLabel: '月份', isDescribe: true },
    { name: 'assetFlow' },
    { name: 'rankOrder' },
    { name: 'rankingRange' },
    { name: 'interval' },
  ];

  const btnProps = { type: 2, total: pagination.total, getColumns: getColumns, param: fetchParams, selectAll: selection.selectAll, selectedRows: selection.selectedRows, md5: md5 };

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
      <Chart tabKey={props.tabKey} xBarData={xBarData} seriesBarData={seriesBarData} xLineData={xLineData} seriesLineData={seriesLineData} />
      <CustomizeDivider color='#F3F4F7' height={8} />
      <div style={{ padding: '8px 24px 24px' }}>
        <SearchContent getAllParams={getAllParams} queryData={queryData} controlList={controlList} />
        {
          tableVisible && (
          <>
            <TableBtn {...btnProps}/>
            <BasicDataTable {...tableProps} style={{ marginBottom: 20 }} loading={loading}/>
            <Modal
              title='资产变动'
              visible={openLeftVisible}
              className={styles.codeModal}
              onCancel={() => { setOpenLeftVisible(false) }}
              width="860px"
              destroyOnClose
              footer={null}
            >
              <AssetChange type={1} cusNo={cusNo} startDate={fetchParams?.startDate} endDate={fetchParams?.endDate} />
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