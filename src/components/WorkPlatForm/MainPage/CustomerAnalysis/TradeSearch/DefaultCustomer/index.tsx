import { FC, useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import moment from 'moment';
import { unstable_batchedUpdates } from 'react-dom';
import { FetchQueryMidRangeAffluenceAnalyse } from '$services/customeranalysis';
import BasicDataTable from '$common/BasicDataTable';
import SearchContent from '../../Common/SearchContent';
import TableBtn from '../../Common/TableBtn/index.js';

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

const DefaultCustomer: FC<Props> = (props) => {
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
        queryType: 0, // 查询类型  查询类型  0|查询 1|潜在 2|日增 3| 日减 4| 年增 5| 年减
        custBelong: getTypeValue('customerAttribution'), // 客户归属
        queryDate: Number(getTypeValue('datePicker')?.format('YYYYMMDD')) || Number(moment().subtract(1, 'days').format('YYYYMMDD')), // 查询日期
        depart: getTypeValue('accountOpeningDepartment').join(), // 开户营业部
        custsource: getTypeValue('custSource'), // 客户来源
        custInfo: getTypeValue('inputBox'), // 客户信息
        paging: 1,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      if(getTypeValue('custSource') === 1) { // 客户来源选择渠道
        params['chnl'] = getTypeValue('channel').join();
      }
      setFetchParams(params);
      // console.log('params==========', params);
      FetchQueryMidRangeAffluenceAnalyse(params).then((response: any) => {
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
        title: '日期',
        dataIndex: 'data',
        key: '日期',
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
        title: '开户营业部',
        dataIndex: 'accountDepart',
        key: '开户营业部',
      },
      {
        title: '当日总资产',
        dataIndex: 'tatalAssets',
        key: '当日总资产',
      },
    ];
  }

  const controlList = [
    { name: 'customerAttribution' },
    { name: 'datePicker' },
    { name: 'inputBox', inputItem: { label: '快速查询', tipContent: '客户号/客户名称' } },
    { name: 'accountOpeningDepartment' },
    { name: 'custSource' }
  ];

  const btnProps = { type: 11, isId: { name: 'ID' }, total: pagination.total, getColumns: getColumns, param: fetchParams, selectAll: selection.selectAll, selectedRows: selection.selectedRows, md5: md5 };

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
}))(DefaultCustomer);