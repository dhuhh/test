import { FC, useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import moment from 'moment';
import { unstable_batchedUpdates } from 'react-dom';
import { FetchQueryPositionRanking } from '$services/customeranalysis';
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

const Securities: FC<Props> = (props) => {
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
    if(getTypeValue('inputBox') === '') {
      message.info('证券代码不能为空！');
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
        custGroup: getTypeValue('custGrup').join(), // 客户群
        depart: getTypeValue('accountOpeningDepartment').join(), // 开户营业部
        custBelong: getTypeValue('customerAttribution'), // 客户归属
        custLevel: getTypeValue('customerLever').join(), // 客户级别
        assetsmin: getTypeValue('intervalMin'), // 资产最小值
        assetsmax: getTypeValue('intervalMax'), // 资产最大值
        orderCondition: getTypeValue('rankConditions'), // 排行条件
        isOrder: getTypeValue('rankOrder'), // 排序
        offset: getTypeValue('rankingRange'), // 排名范围
        stockCode: getTypeValue('inputBox'), // 证券代码
        custSource: getTypeValue('custSource'), // 客户来源
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      if(getTypeValue('custSource') === 1) { // 客户来源选择渠道
        params['chnl'] = getTypeValue('channel').join();
      }
      setFetchParams(params);
      // console.log('params==========', params);
      FetchQueryPositionRanking(params).then((response: any) => {
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
        title: '排名',
        dataIndex: 'ranking',
        key: '排名',
      },
      {
        title: '分支代码',
        dataIndex: 'branchCode',
        key: '分支代码',
      },
      {
        title: '网点',
        dataIndex: 'assessmentDepart',
        key: '网点',
      },
      {
        title: '资金账号',
        dataIndex: 'fundsCode',
        key: '资金账号',
      },
      {
        title: '客户号',
        dataIndex: 'custCode',
        key: '客户号',
      },
      {
        title: '客户姓名',
        dataIndex: 'custName',
        key: '客户姓名',
        render: (text: string, record: any) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.custCode}`} target='_blank'>{text}</Link>,
      },
      {
        title: '客户级别',
        dataIndex: 'custLevel',
        key: '客户级别',
      },
      {
        title: '所属客户经理(服务关系)',
        dataIndex: 'serveRelation',
        key: '所属客户经理(服务关系)',
      },
      {
        title: '所属客户经理(开发关系)',
        dataIndex: 'developRelation',
        key: '所属客户经理(开发关系)',
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
        title: '持仓市值_普通(万)',
        dataIndex: 'positionOrdinary',
        key: '持仓市值_普通(万)',
      },
      {
        title: '持仓市值_信用(万)',
        dataIndex: 'positionCredit',
        key: '持仓市值_信用(万)',
      },
      {
        title: '合计市值(万)',
        dataIndex: 'totalMarketValue',
        key: '合计市值(万)',
      },
      {
        title: '持仓数量_普通(股)',
        dataIndex: 'nuOfPositionOrdinary',
        key: '持仓数量_普通(股)',
      },
      {
        title: '持仓数量_信用(股)',
        dataIndex: 'nuOfPositionCredit',
        key: '持仓数量_信用(股)',
      },
      {
        title: '合计持仓数量(股)',
        dataIndex: 'countOfPosition',
        key: '合计持仓数量(股)',
      },
      {
        title: '盈亏情况(元)',
        dataIndex: 'profitAndLoss',
        key: '盈亏情况(元)',
      },
    ];
  }

  const controlList = [
    { name: 'customerAttribution' },
    { name: 'rankConditions', selectItem: [{ name: '持股市值', value: 1 }, { name: '持股股数', value: 2 }] },
    { name: 'customerLever' },
    { name: 'custSource' },
    { name: 'inputBox', inputItem: { label: '证券代码' } },
    { name: 'accountOpeningDepartment' },
    { name: 'custGrup' },
    { name: 'interval', intervalLabel: '资产区间(万)' },
    { name: 'rankOrder' },
    { name: 'rankingRange' },
  ];

  const btnProps = { type: 13, isId: { name: 'id' }, total: pagination.total, getColumns: getColumns, param: fetchParams, selectAll: selection.selectAll, selectedRows: selection.selectedRows, md5: md5 };

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
}))(Securities);