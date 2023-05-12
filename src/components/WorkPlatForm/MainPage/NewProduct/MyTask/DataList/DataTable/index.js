import { Button, message, Modal, Pagination, Spin } from 'antd';
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import moment from 'moment';
import { history, connect, Link } from 'umi';
import Scrollbars from 'react-custom-scrollbars';
import BasicDataTable from '$common/BasicDataTable';
import Filter from '../../../Work/Common/Filter';
import { QueryUserTaskListInformationDetails, SaveUserTaskStrikeOut } from '$services/newProduct';
import noticeIconEnclosure from '$assets/newProduct/notice_icon_enclosure.png';
import filter from '$assets/newProduct/filter.svg';
import filter_finished from '$assets/newProduct/filter_finished.svg';
import edit_icon from '$assets/newProduct/edit.png';
import delete_icon from '$assets/newProduct/delete.png';
import styles from '../../index.less';

const colorMap = {
  已处理: '#61698C',
  未处理: '#F68A00',
  已忽略: '#0079FF',
  未分配: '#E81919',
};

function reducer(state, action) {
  const newState = { ...state };
  newState[action.type] = action.value;
  return newState;
}

function DataTable(props) {
  const [status, setStatus] = useState('-1');
  const [summary, setSummary] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [filterVisible, dispatch] = useReducer(reducer, { visible1: false });

  // const detailType = props.activeList.replace(/[0-9]/g, '');

  useEffect(() => {
    const nodes = document.getElementsByClassName('ant-table-filter-dropdown');
    if (nodes && [...nodes].length && nodes[0].style.boxShadow !== 'none') {
      [...nodes].forEach(item => {item.style.background = 'transparent', item.style.boxShadow = 'none';});
    }
    return () => {
      [...nodes].forEach(item => {item.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'; item.style.background = '#FFF';});
    };
  });

  const statusData = [
    { key: '-1', value: '全部' },
    { key: '0', value: '未分配' },
    { key: '1', value: '未处理' },
    { key: '2', value: '已处理' },
    { key: '3', value: '已忽略' },
  ];

  const columns = [
    {
      title: '级别',
      dataIndex: 'custRank',
      key: 'custRank',
      // align: 'center',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '客户',
      dataIndex: 'custName',
      key: 'custName',
      // align: 'center',
      render: (_, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.custNo}`} target='_blank'><div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }} className={styles.hover}>{record.custName}({record.custNo})</div></Link> ,
    },
    {
      title: '营业部',
      dataIndex: 'custOrg',
      key: 'custOrg',
      // align: 'center',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '手机号',
      dataIndex: 'custPhone',
      key: 'custPhone',
      // align: 'center',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '处理人',
      dataIndex: 'name',
      key: 'name',
      // align: 'center',
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text || '无'}</div>,
    },
    {
      title: '状态',
      dataIndex: 'opetate',
      // align: 'center',
      // fixed: 'right',
      render: (text) => <span style={{ color: colorMap[text] || '#244FFF', wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</span>,
      filterIcon: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><img src={status !== '-1' ? filter_finished : filter} alt='' style={{ width: 10, height: 10 }} /></div>,
      filterDropdown: ({ confirm }) => <Filter visible={filterVisible.visible1} value={status} onChange={(value) => { setStatus(value); setCurrent(1); dispatch({ type: 'visible1', value: false }); confirm(); }} data={statusData} />,
      onFilterDropdownVisibleChange: (visible) => dispatch({ type: 'visible1', value: visible }),
    },
  ];
  const getData = useCallback(
    () => {
      setLoading(true);
      const params = {
        paging: 1,
        current,
        pageSize,
        total: -1,
        srcId: Number(status),
        taskId: Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.taskId) || 0,
        // taskId: 53,
      };
      QueryUserTaskListInformationDetails(params).then((response) => {
        setLoading(false);
        const summary = {
          custCount: response.custCount + '',
          custAccom: response.custAccom + '',
          rate: response.custRate + '',
          custOver: response.custOver + '',
          oprUser: response.oprUser + '',
        };
        const { records = [], total = 0 } = response;
        setSummary(summary);
        setDataSource(records);
        setTotal(total);
      }).catch((error) => {
        message.error(error.note || error.message);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, pageSize, props.activeList, status],
  );
  useEffect(() => {
    getData();
  }, [getData]);

  const download = () => {
    const { sysParam } = props;
    console.log("🚀 ~ file: index.js:144 ~ download ~ props", props)
    const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
    window.open(`${serverName}/OperateProcessor?Column=FJ&Table=TB_TASK&operate=Download&Type=Attachment&ID=${props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskId}`);
  };

  const computed = (type) => {
    if (type === 'lookAttac') {
      return props.activeList.replace(/[0-9]/g, '') === 'task' && props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.dealType ? 'visible' : 'hidden';
    } else if (type === 'taskPeriod') {
      return props.activeList.replace(/[0-9]/g, '') === 'task' ? 'visible' : 'hidden';
    }
  };

  const handlePageChange = (current, pageSize) => {
    setCurrent(current);
    setPageSize(pageSize);
  };

  const handleDeleteClick = (taskId) => {
    Modal.confirm({
      title: '确认删除该任务吗？',
      onOk() {
        setLoading(true);
        SaveUserTaskStrikeOut({ oprTp: 3, taskId }).then((res) => {
          const { note = '操作成功' } = res;
          message.success(note);
          props.queryBackLogList().then((response) => {
            setLoading(false);
            const listData = response.records || [];
            props.setListData(listData);
            if (listData.length) {
              props.setActiveList('task0');
            }
          });
        }).catch((error) => {
          setLoading(false);
          message.error(error.note || error.message);
        });
      },
    });
  };

  const toEditTask = () => {
    const taskId = props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.taskId || '0';
    const url = `/iframe/bss/ncrm/work/customerService/page/addCustomer.sdo?rwid=${taskId}`;
    return url;
  };
  return (
    <Spin spinning={loading}>
      <div style={{ height: 52, borderBottom: '1px solid #e8e8e8', padding: '0 22px 0 16px', display: 'flex', alignItems: 'center', fontSize: 12, position: 'relative' }}>
        <div style={{ marginRight: 32 }}>
          <div>任务周期</div>
          <div>{moment(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.beginTime).format('YYYY.MM.DD')}-{moment(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.endTime).format('YYYY.MM.DD')}</div>
        </div>
        <div style={{ color: '#61698C' }}>
          <div>
            <span>已服务客户</span>
            <span style={{ color: '#FF6E30' }}>{summary?.rate || '-'}</span>
            <span> / 完成率</span>
            <span style={{ color: '#FF6E30' }}>{summary?.custOver || '-'}</span>
          </div>
          <div>
            <span>待服务客户</span>
            <span style={{ color: '#FF6E30' }}>{summary?.custCount || '-'}/{summary?.custAccom || '-'}</span>
            <span> / 已忽略客户</span>
            <span style={{ color: '#FF6E30' }}>{summary?.oprUser || '-'}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '22px' }}>
          { props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.userId === `${JSON.parse(sessionStorage.user).id}` && (
            <Link to={toEditTask} style={{ marginRight: '14px' }}>
              <Button style={{ borderRadius: '1px', border: 'none', color: '#244FFF', minWidth: 108, height: 32 }} className={`m-btn-radius ${styles.button}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={edit_icon} style={{ width: 16, height: 16 }} alt='' />
                  <span style={{ marginLeft: 2 }}>编辑任务</span>
                </div>
              </Button>
            </Link>
          )}
          <Button onClick={() => handleDeleteClick(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.taskId)} style={{ borderRadius: '1px', border: 'none', color: '#EA0000', minWidth: 108, height: 32 }} className={`m-btn-radius ${styles.button}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={delete_icon} style={{ width: 16, height: 16 }} alt='' />
              <span style={{ marginLeft: 2 }}>删除任务</span>
            </div>
          </Button>
        </div>
      </div>
      <Scrollbars autoHide style={{ height: 'calc(100vh - 252px)' }}>
        <div style={{ margin: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 0' }}>
            <div style={{ flex: '1' }}>
              <div dangerouslySetInnerHTML={{ __html: props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskSbj || '-' }} title={props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskSbj || '-'} style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }} />
              <div dangerouslySetInnerHTML={{ __html: props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskCntnt || '-' }} style={{ color: '#4B516A', wordBreak: 'break-all' }} />
              {
                props.activeList.replace(/[0-9]/g, '') === 'task' && props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.strategy &&
                <div>策略：{props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.strategy || '-'}</div>
              }
            </div>
            <div onClick={download} className={styles.hover} style={{ display: 'flex', width: '62px', alignItems: 'center', color: '#5779ff', fontSize: 12, visibility: computed('lookAttac') }}>
              <div>
                <img style={{ width: 14, height: 14 }} src={noticeIconEnclosure} alt='' />
              </div>
              <span>查看附件</span>
            </div>
          </div>
          <BasicDataTable rowKey='custNo' columns={columns} dataSource={dataSource} className={`m-table-customer ${styles.table}`} pagination={false} />
        </div>
      </Scrollbars>

      <div style={{ width: 'calc(100% - 374px)', height: 40, background: '#FFF', borderTop: '1px solid #e8e8e8', position: 'fixed', bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <Pagination
          size='small'
          showLessItems
          showQuickJumper
          showSizeChanger
          className={`${styles.pagination} ${styles.smallPagination}`}
          pageSizeOptions={['20', '50', '100']}
          pageSize={pageSize}
          current={current}
          total={total}
          onChange={handlePageChange}
          onShowSizeChange={(current,pageSize) => handlePageChange(1, pageSize)}
        />
      </div>
      {/* <div style={{ paddingBottom: 22 }}>
        <span style={{ padding: '0 10px 0 0' }}>{props.activeList.replace(/[0-9]/g, '') === 'task' ? '状态' : '排序规则'}</span>
        <Select
          style={{ width: '27%', color: '#1A2243' }}
          value={status}
          onChange={(value) => { setStatus(value); setCurrent(1); }}
        >
          <Select.Option key='-1' value='-1'>全部</Select.Option>
          <Select.Option key='0' value='0'>未分配</Select.Option>
          <Select.Option key='1' value='1'>未处理</Select.Option>
          <Select.Option key='2' value='2'>已处理</Select.Option>
          <Select.Option key='3' value='3'>已忽略</Select.Option>
        </Select>
        
      </div> */}
      {/* <Pagination {...pagination} /> */}
    </Spin>
  );
}

export default connect(({ global }) => ({
  // authorities: global.authorities,
  // dictionary: global.dictionary,
  sysParam: global.sysParam,
  // theme: global.theme,
}))(DataTable);