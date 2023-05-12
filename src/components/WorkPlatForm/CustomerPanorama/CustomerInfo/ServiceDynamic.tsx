import React, { FC, useEffect, useState } from 'react';
import { QueryServiceDynamicsList } from '$services/customerPanorama';
import dobule_right_arrow from '$assets/newProduct/customerPanorama/dobule_right_arrow.png';
import TableLocale from '../Common/TableLocale'
import styles from './index.less';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import { Card, message, Table } from 'antd';
import { history } from 'umi';

const locale = { emptyText: <TableLocale emptyText='无记录' /> };

type Props = Readonly<{
  customerCode: string,
  clickSensors: (ax_button_name: string) => void,
}>

interface State {
  loading: boolean,
  dataSource: any[],
}

const ServiceDynamic: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    loading: false,
    dataSource: [],
  });

  useEffect(() => {
    QueryServiceDynamicsList({ custNo: customerCode, typeId: 5, paging: 1, current: 1, pageSize: 5 }).then((res: any) => {
      const { records = [] } = res;
      setState({ ...state, dataSource: records.map((item: any, index: number) => ({ ...item, key: index })) });
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])

  const columns: any[] = [
    { title: '服务类型', dataIndex: 'serviceType' },
    { title: '服务主题', dataIndex: 'serviceTopic' },
    { title: '服务时间', dataIndex: 'serviceTime' },
    { title: '服务方式', dataIndex: 'serviceWay' },
    { title: '服务人员', dataIndex: 'serviceMan' },
    { title: '服务事件内容', dataIndex: 'serviceCon' },
  ];

  const { customerCode = ''} = props;

  return (
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '0 20px 20px', color: '#1A2243' }}
      title={<div className="ax-card-title" style={{ color: '#1A2243' }}>服务动态</div>}
      extra={<div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#1A2243' }} onClick={() => { 
        newClickSensors({
          third_module: "客户概况",
          ax_button_name: "服务入口点击次数",
        }); 
       history.push(`/customerPanorama/serviceInfo?customerCode=${customerCode}`); }}>
        <span style={{ marginRight: 4 }}>更多</span>
        <img src={dobule_right_arrow} alt='' />
      </div>}
    >
      <Table
        rowKey='key'
        loading={state.loading}
        columns={columns}
        dataSource={state.dataSource}
        className={`m-table-customer ${styles.table}`}
        pagination={false}
        locale={locale}
      />
    </Card>
  );
};
export default ServiceDynamic;
