
import React ,{ useEffect, useState } from 'react' ;
import { Form ,message } from 'antd';
import BasicDataTable from '$common/BasicDataTable';
import { PaperClipOutlined , CaretDownOutlined } from '@ant-design/icons';
import { QueryEventTreatmentRecordList } from '$services/ecifEvent';
import styles from '../../index.less';

const Record = (props)=>{
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: '客户账户不规范情形',
      dataIndex: 'disorderlyName',
      key: 'disorderlyName',
      fixed: 'left',
      width: 230,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '事件描述',
      dataIndex: 'describe',
      key: 'describe',
      className: 'columnLine',
      width: 290,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '处理方式',
      dataIndex: 'treatmentWay',
      key: 'treatmentWay',
      className: 'columnLine',
      // width: 150,
      render: (text) => <div >{text === '1' ? '尽职调查' : text === '2' ? '通知' : '账户核查'}</div>,
    },
    {
      title: '服务方式',
      dataIndex: 'serviceWay',
      key: 'serviceWay',
      className: 'columnLine',
      width: 100,
      render: (text) => <div >{text}</div>,
    },
    {
      title: '服务内容',
      dataIndex: 'serviceContent',
      key: 'serviceContent',
      className: 'columnLine',
      width: 280,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      key: 'attachment',
      className: 'columnLine',
      render: (text,coulmn) => <a style={{cursor: 'pointer'}} target="blank" href={`${coulmn.attachment}`}><PaperClipOutlined />1个<CaretDownOutlined /> </a>,
    },
    {
      title: '执行人',
      dataIndex: 'treatmentPeople',
      key: 'treatmentPeople',
      className: 'columnLine',
      // width: 150,
      render: (text) => <div >{text}</div>,
    },
    {
      title: '名单状态',
      dataIndex: 'rosterStatus',
      key: 'rosterStatus',
      className: 'columnLine',
      // width: 150,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text === '1' ? '待分配' : text === '2' ? '待执行' : text === '3' ? '已完成' : ''}</div>,
    },
    {
      title: '审核状态',
      dataIndex: 'auditingStatus',
      key: 'auditingStatus',
      className: 'columnLine',
      // width: 150,
      render: (text) => <div style={{ cursor: 'pointer' }}>{text}</div>,
    },


  ];
  const tableProps = {
    scroll: { x: 1400 },
  };
  
  const getQueryEventTreatmentRecordList = () => {
    const param = {
      current: 1,
      custCode: props.custCode,
      eventId: props.eventId,
      eventInfoId: props.motId,
      importance: props.importance, // 重要程度--查询条件
      disorderlyCode: props.disorderlyCode, // 不规范情形编码--查询条件
      custCodeList: props.custCodeList, // 客户等级中的客户号--查询条件
      checkAll: 0,
      checkCust: props.motId,
      pageLength: 0,
      pageNo: 0,
      pageSize: 20,
      paging: 1,
      sort: "",
      total: -1,
      totalRows: 0 ,
    };
    QueryEventTreatmentRecordList(param).then(res=>{
      const { records } = res;
      setDataSource(records);
    }).catch((error) => {
      message.error(error.note || error.message);
    });;
  };

  useEffect(()=>{
    getQueryEventTreatmentRecordList();
    return ()=>{} ;
  },[]);

  return (
    <React.Fragment>
      <BasicDataTable {...tableProps } specialPageSize={5} columns={columns} dataSource={dataSource} className={`${styles.table}`} pagination={false} />
    </React.Fragment>
  );
};

export default Form.create()(Record);