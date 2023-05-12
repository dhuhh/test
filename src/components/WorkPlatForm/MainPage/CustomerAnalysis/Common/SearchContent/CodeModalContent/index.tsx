import { FC, useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { cloneDeep } from 'lodash';
import BasicDataTable from '$common/BasicDataTable';
import { FetchQueryStockList } from '$services/customeranalysis';
import { unstable_batchedUpdates } from 'react-dom';
import styles from './index.less';
import leftArrow from '$assets/greenArrow.png';
import rightArrow from '$assets/redArrow.png';

type Props = Readonly<{
  getCodeList: Function, // 获取证券代码选中的值
  closeCodeModal: Function, // 关闭证券代码弹窗
}>

interface dataItem {
  stockCode: string, // 证券代码
  stockName: string // 名称
}

// 分页
interface pageProps {
  pageSize: number,
  current: number,
  total: number,
}

// 选择功能
interface selectProps {
  selectAll: boolean,
  selectedRowKeys: string[] | number[],
  selectedRows: any[],
}

interface dataItem {
  stockCode: string, // 证券代码
  stockName: string // 名称
}

const CodeModalContent: FC<Props> = (props) => {
  const [leftDataSource, setLeftDataSource] = useState<any>([]);
  const [leftPagination, setLeftPagination] = useState<pageProps>({ pageSize: 10, current: 1, total: 0, });
  const [leftSelection, setLeftSelection] = useState<selectProps>({ selectAll: false, selectedRowKeys: [], selectedRows: [] });

  const [rightDataSource, setRightDataSource] = useState<any>([]);
  const [rightPagination, setRightPagination] = useState<pageProps>({ pageSize: 10, current: 1, total: 0, });
  const [rightSelection, setRightSelection] = useState<selectProps>({ selectAll: false, selectedRowKeys: [], selectedRows: [] });

  const [loading, setLoading] = useState<boolean>(false);
  const [queryValue, setQueryValue] = useState<string>(''); // 搜索框内容
  const [paramValue, setParamValue] = useState<string>(''); // 搜索时的查询关键字

  useEffect(() => {
    fetchLeftData(paramValue);
  }, [JSON.stringify(leftPagination), JSON.stringify(rightDataSource)])

  // useEffect(() => {
  //   fetchRightData();
  // }, [JSON.stringify(rightPagination), JSON.stringify(rightDataSource)])

   // 查询左table数据
  const fetchLeftData = (value: string) => {
    setLoading(true);
    FetchQueryStockList({
      queryValue: value, // 查询关键字
      notInclude: rightDataSource.map((item: dataItem) => item.stockCode).join(), // 已选的代码
      paging: 1,
      current: leftPagination.current,
      pageSize: leftPagination.pageSize,
    }).then((response: any) => {
      const { records = [], total = 0 } = response || {};
      unstable_batchedUpdates(() => {
        setLoading(false);
        setLeftDataSource(records);
        setLeftPagination({...leftPagination, total: total});
        setLeftSelection({ selectAll: false, selectedRowKeys: [], selectedRows: [] });
        setRightSelection({ selectAll: false, selectedRowKeys: [], selectedRows: [] });
      })
    }).catch((error: any) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询右table数据
  // const fetchRightData = () => {
  //   setLoading(true);
  //   FetchQueryStockList({
  //     include: rightDataSource.map((item: dataItem) => item.stockCode).join(), // 已选的代码,
  //     paging: 1,
  //     current: rightPagination.current,
  //     pageSize: rightPagination.pageSize,
  //   }).then((response: any) => {
  //     const { records = [], total = 0 } = response || {};
  //     unstable_batchedUpdates(() => {
  //       setLoading(false);
  //       setRightDataSource(records);
  //       setRightPagination({...rightPagination, total: total});
  //       setRightSelection({ selectAll: false, selectedRowKeys: [], selectedRows: [] });
  //     })
  //   }).catch((error: any) => {
  //     message.error(!error.success ? error.message : error.note);
  //   });
  // }

  const getLeftColumns = () => {
    return [
      {
        title: '证券代码',
        dataIndex: 'stockCode',
        key: '证券代码',
      },
      {
        title: '名称',
        dataIndex: 'stockName',
        key: '名称',
      },
    ];
  }

  const getRightColumns = () => {
    return [
      {
        title: '证券代码',
        dataIndex: 'stockCode',
        key: '证券代码',
      },
      {
        title: '名称',
        dataIndex: 'stockName',
        key: '名称',
      },
    ];
  }

  const leftTableProps = {
    bordered: true,
    scroll: { x: true },
    rowKey: 'key',
    dataSource: leftDataSource.map((item: any, index: number) => {
      return { ...item, key: ((leftPagination.current - 1) * leftPagination.pageSize) + index + 1 };
    }),
    columns: getLeftColumns(),
    className: 'm-Card-Table',
    pagination: {
      size: 'small',
      className: 'm-bss-paging',
      showTotal: (totals: number) => {
        return `总共${totals}条`;
      },
      showLessItems: true,
      total: leftPagination.total,
      current: leftPagination.current,
      pageSize: leftPagination.pageSize,
      onChange: (current: number, pageSize: number) => {
        setLeftPagination({ ...leftPagination, current, pageSize });
      },
      onShowSizeChange:(current: number, pageSize: number) => {
        setLeftPagination({ ...leftPagination, current, pageSize });
      },
    },
    rowSelection: {
      type: 'checkbox',
      crossPageSelect: true, // checkbox默认开启跨页全选
      selectAll: leftSelection.selectAll,
      selectedRowKeys: leftSelection.selectedRowKeys,
      onChange: (currentSelectedRowKeys: string[] | number[], selectedRows: any[], currentSelectAll: boolean) => {
        setLeftSelection({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys, selectedRows });
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.status === 0, // Column configuration not to be checked
        name: record.status,
      }),
      fixed: true,
    },
  };

  const rightTableProps = {
    bordered: true,
    scroll: { x: true },
    rowKey: 'key',
    dataSource: rightDataSource.map((item: any, index: number) => {
      return { ...item, key: ((rightPagination.current - 1) * rightPagination.pageSize) + index + 1 };
    }),
    columns: getRightColumns(),
    className: 'm-Card-Table',
    pagination: {
      size: 'small',
      className: 'm-bss-paging',
      showTotal: (totals: number) => {
        return `总共${totals}条`;
      },
      showLessItems: true,
      total: rightPagination.total,
      current: rightPagination.current,
      pageSize: rightPagination.pageSize,
      onChange: (current: number, pageSize: number) => {
        setRightPagination({ ...rightPagination, current, pageSize });
      },
      onShowSizeChange:(current: number, pageSize: number) => {
        setRightPagination({ ...rightPagination, current, pageSize });
      },
    },
    rowSelection: {
      type: 'checkbox',
      crossPageSelect: true, // checkbox默认开启跨页全选
      selectAll: rightSelection.selectAll,
      selectedRowKeys: rightSelection.selectedRowKeys,
      onChange: (currentSelectedRowKeys: string[] | number[], selectedRows: any[], currentSelectAll: boolean) => {
        setRightSelection({ selectAll: currentSelectAll, selectedRowKeys: currentSelectedRowKeys, selectedRows });
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.status === 0, // Column configuration not to be checked
        name: record.status,
      }),
      fixed: true,
    },
  };

  const topTitle = (title: string) => {
    return (
      <div className={styles.title}>{title}</div>
    );
  }

  // 搜索
  const queryData = (queryValue: string) => {
    setParamValue(queryValue);
    fetchLeftData(queryValue);
    setLeftPagination({ ...leftPagination, current: 1 });
    setLeftSelection({ selectAll: false, selectedRowKeys: [], selectedRows: [] });
  }

  // 从已选中去除
  const deleteSelection = () => {
    if(rightSelection.selectedRows.length === 0 && !rightSelection.selectAll) {
      message.info('请选择要处理的记录');
    } else if(rightSelection.selectAll) {
      setRightDataSource([]);
    } else {
      const tmpData = cloneDeep(rightDataSource);
      rightDataSource.forEach((item: dataItem, index: number) => {
        if(rightSelection.selectedRows.some((opt: dataItem) => opt.stockCode === item.stockCode)) {
          tmpData.splice(index, 1);
        }
      })
      setRightDataSource(tmpData);
    }
  }

  // 可选添加到已选
  const addSelection = () => {
    if(leftSelection.selectedRows.length === 0 && !leftSelection.selectAll) {
      message.info('请选择要处理的记录');
    } else if(leftSelection.selectAll) {
      setRightDataSource([...rightDataSource, ...leftDataSource]);
    } else {
      setRightDataSource([...rightDataSource, ...leftSelection.selectedRows]);
    }
  }

  // 保存
  const saveFunc = () => {
    if(props.getCodeList) {
      props.getCodeList(rightDataSource)
    }
    if(props.closeCodeModal) props.closeCodeModal();
  }

  return (
    <div style={{ paddingBottom: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div className={styles.leftBox}>
          { topTitle('可选') }
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', padding: '5px 0' }}>
              <Input style={{ width: '200px' }} value={queryValue} onChange={(e: any) => { setQueryValue(e.target.value) }} />
              <Button className={styles.button} onClick={() => queryData(queryValue) }>搜索</Button>
            </div>
            <BasicDataTable {...leftTableProps} loading={loading} />
          </div>
        </div>
        <div className={styles.arrowBox}>
          <img src={rightArrow} className={styles.rightArrow} onClick={deleteSelection} />
          <img src={leftArrow} className={styles.leftArrow} onClick={addSelection} />
        </div>
        <div className={styles.rightBox}>
          { topTitle('已选') }
          <BasicDataTable {...rightTableProps} style={{ marginTop: '38px', paddingLeft: '10px' }} />
        </div>
      </div>
      <div style={{ marginRight: '20px' }}><Button className={`m-btn-radius ax-btn-small m-btn-blue ${styles.inquireButton}`} onClick={saveFunc}>保存</Button></div>
    </div>
  );
}

export default CodeModalContent;