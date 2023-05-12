import { FC, useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import { unstable_batchedUpdates } from 'react-dom';
import { FetchQueryAssetRanking } from '$services/customeranalysis';
import BasicDataTable from '$common/BasicDataTable';
import SearchContent from '../../Common/SearchContent';
import TableBtn from '../../Common/TableBtn/index.js';

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

const MergeAccounts: FC<Props> = (props) => {
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
        queryLevel: 1, // 查询层级，默认为1
        queryValue: props.userBasicInfo.ryid, // 人员id
        type: getTypeValue('relationshipType'), // 关系类型
        cusLevel: getTypeValue('customerLever').join(), // 客户级别
        belong: getTypeValue('customerAttribution'), // 客户归属
        department: getTypeValue('accountOpeningDepartment').join(), // 开户营业部
        queryType: 1, // 查询方式   1 明细 2 统计
        custGroup: getTypeValue('custGrup').join(), // 客户群
        label: getTypeValue('customerLabel').join(), // 客户标签
        cusNo: getTypeValue('inputBox'), // 客户号
        source: getTypeValue('custSource'), // 客户来源
        order: getTypeValue('rankOrder'), // 排序
        top: getTypeValue('rankingRange'), // 排名范围
        accountType: 0, // 账户类型 0｜合并账户；1｜普通账户；2｜信用账户; 3 | 股票期权账户
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      if(getTypeValue('custSource') === 1) { // 客户来源选择渠道
        params['channel'] = getTypeValue('channel').join();
      }
      setFetchParams(params);
      // console.log('params==========', params);
      FetchQueryAssetRanking(params).then((response: any) => {
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
        title: '总资产(万元)',
        dataIndex: 'assets',
        key: '总资产(万元)',
        sorter: (a: any, b: any) => a.assets - b.assets,
      },
      {
        title: '资金余额(万元)',
        dataIndex: 'balance',
        key: '资金余额(万元)',
        sorter: (a: any, b: any) => a.balance - b.balance,
      },
      {
        title: '证券市值(万元)',
        dataIndex: 'marketValue',
        key: '证券市值(万元)',
        sorter: (a: any, b: any) => a.marketValue - b.marketValue,
      },
      {
        title: '总负债(万元)',
        dataIndex: 'liabilities',
        key: '总负债(万元)',
        sorter: (a: any, b: any) => a.liabilities - b.liabilities,
      },
    ];
  }

  const controlList = [
    { name: 'customerLever' },
    { name: 'relationshipType' },
    { name: 'customerAttribution' },
    // { name: 'queryMethod' },
    { name: 'accountOpeningDepartment' },
    { name: 'custGrup' },
    { name: 'custSource' },
    { name: 'customerLabel' },
    { name: 'inputBox', inputItem:{ label: '客户号' } },
    { name: 'rankOrder' },
    { name: 'rankingRange' },
  ];

  const btnProps = { type: 9, iscusNoList: true, total: pagination.total, getColumns: getColumns, param: fetchParams, selectAll: selection.selectAll, selectedRows: selection.selectedRows, md5: md5 };

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
          </>
          )
        }
      </div>
    </>
  );
}

export default connect(({ global }: any)=>({
  userBasicInfo: global.userBasicInfo,
}))(MergeAccounts);