import { FC, useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import moment from 'moment';
import { unstable_batchedUpdates } from 'react-dom';
import { FetchQueryContributionRanking } from '$services/customeranalysis';
import BasicDataTable from '$common/BasicDataTable';
import SearchContent from '../Common/SearchContent';
import TableBtn from '../Common/TableBtn/index.js';

type Props = Readonly<{
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

const Contribute: FC<Props> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tableVisible, setTableVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [pagination, setPagination] = useState<pageProps>({ pageSize: 10, current: 1, total: 0, });
  const [selection, setSelection] = useState<selectProps>({ selectAll: false, selectedRowKeys: [], selectedRows: [] });
  const [md5, setMd5] = useState<string>('');
  const [allParams, setAllParams] = useState<any[]>([]); // 所有子组件参数
  const [fetchParams, setFetchParams] = useState<any>({}); // 所有查询字段参数
  const [queryMark, setQueryMark] = useState<number>(0); // 作为点击查询的标识

  useEffect(() => {
    fetchData();
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
        // queryLevel: 1, // 查询层级，默认为1
        // queryValue: props.userBasicInfo.ryid, // 人员id
        staffId: parseInt(props.userBasicInfo.id), // 用户id
        condition: getTypeValue('rankingConditions'), // 排名条件
        department: getTypeValue('accountOpeningDepartment').join(), // 开户营业部
        range: getTypeValue('customerAttribution'), // 客户范围
        cusLevel: getTypeValue('customerLever').join(), // 客户级别
        startDate: getTypeValue('monthSelection')[0]? Number(getTypeValue('monthSelection')[0].format('YYYYMM')) : (getTypeValue('transactionTime') === '1' ? Number(moment().subtract(2, 'year').format('YYYYMM')) : Number(moment().subtract(1, 'year').format('YYYYMM'))) , // 开始日期
        endDate: getTypeValue('monthSelection')[1]? Number(getTypeValue('monthSelection')[1].format('YYYYMM')) : (getTypeValue('transactionTime') === '1' ? Number(moment().subtract(1, 'year').format('YYYYMM')) : Number(moment().format('YYYYMM'))), // 结束日期
        cusGroup: getTypeValue('custGrup').join(), // 客户群
        label: getTypeValue('customerLabel').join(), // 客户标签
        order: getTypeValue('rankOrder'), // 排序
        top: getTypeValue('rankingRange'), // 排名范围
        source: getTypeValue('custSource'), // 客户来源
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      if(getTypeValue('custSource') === 1) { // 客户来源选择渠道
        params['channel'] = getTypeValue('channel').join();
      }
      setFetchParams(params);
      // console.log('params==========', params);
      FetchQueryContributionRanking(params).then((response: any) => {
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
        title: '开户营业部',
        dataIndex: 'department',
        key: '开户营业部',
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
        title: '客户级别',
        dataIndex: 'cusLevel',
        key: '客户级别',
        sorter: (a: any, b: any) => Number(a.cusLevel.charAt(1)) - Number(b.cusLevel.charAt(1)),
      },
      {
        title: '总贡献',
        dataIndex: 'contribution',
        key: '总贡献',
        sorter: (a: any, b: any) => a.contribution - b.contribution,
      },
      {
        title: '普通账户总贡献',
        dataIndex: 'normalContribution',
        key: '普通账户总贡献',
        sorter: (a: any, b: any) => a.normalContribution - b.normalContribution,
      },
      {
        title: '信用账户总贡献',
        dataIndex: 'creditContribution',
        key: '信用账户总贡献',
        sorter: (a: any, b: any) => a.creditContribution - b.creditContribution,
      },
       {
        title: '普通账户净佣金',
        dataIndex: 'normalNetCommission',
        key: '普通账户净佣金',
        sorter: (a: any, b: any) => a.normalNetCommission - b.normalNetCommission,
      },
       {
        title: '信用账户普通交易手续费',
        dataIndex: 'normalCommission',
        key: '信用账户普通交易手续费',
        sorter: (a: any, b: any) => a.normalCommission - b.normalCommission,
      },
       {
        title: '信用账户信用交易手续费',
        dataIndex: 'creditCommission',
        key: '信用账户信用交易手续费',
        sorter: (a: any, b: any) => a.creditCommission - b.creditCommission,
      },
       {
        title: '普通利差收入',
        dataIndex: 'marginInterest',
        key: '普通利差收入',
        sorter: (a: any, b: any) => a.marginInterest - b.marginInterest,
      },
    ];
  }

  const controlList = [
    { name: 'rankingConditions' },
    { name: 'accountOpeningDepartment' },
    { name: 'customerAttribution', label: '客户范围' },
    { name: 'custGrup' },
    { name: 'customerLever' },
    { name: 'customerLabel' },
    { name: 'monthSelection', dateLabel: '成交时间从' },
    { name: 'rankOrder' },
    { name: 'rankingRange', rankRangeDefaultValue: 50 },
    { name: 'custSource' }
  ];

  const btnProps = { type: 10, total: pagination.total, getColumns: getColumns, param: fetchParams, selectAll: selection.selectAll, selectedRows: selection.selectedRows, md5: md5 };

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
      <div style={{ padding: '8px 24px 24px', background: '#fff' }}>
        <SearchContent getAllParams={getAllParams} queryData={queryData} controlList={controlList} hasDateDefault={true} />
        {
          tableVisible && (
          <>
            <TableBtn {...btnProps}/>
            <BasicDataTable {...tableProps} style={{ marginBottom: 20 }} loading={loading}/>
          </>
          )
        }
      </div>
    </>
  );
}

export default connect(({ global }: any)=>({
  userBasicInfo: global.userBasicInfo,
}))(Contribute);