import { Col, message, Modal, Popover, Row, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { QueryDockingCommissionRateInfo, QueryHistoricalRateInformation } from '$services/customerPanorama';
import arrow_down from '$assets/newProduct/arrow_down.svg';
import arrow_up from '$assets/newProduct/arrow_up.svg';
import styles from './index.less';

type Props = Readonly<{
  account: string, // 资金账号
  mode: number, // 1|普通, 2|信用
  visible: boolean,
  setVisible: (visible: boolean) => void,
}>

const RateModal: FC<Props> = (props) => {
  const [customerCode, setCustomerCode] = useState<string>('');
  const [KHXM, setKHXM] = useState<string>('');
  const [SJ, setSJ] = useState<string>('');
  const [height, setHeight] = useState<number>(document.body.offsetHeight < 540 ? document.body.offsetHeight - 180 : 360);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [iconIndex, setIconIndex] = useState<number>(-1);
  const [historyData, setHistoryData] = useState<any[]>([]);

  const { account = '', mode = 1, visible = false, setVisible } = props;

  useEffect(() => {
    if (visible) {
      setLoading(true);
      QueryDockingCommissionRateInfo({ accnNo: account, accnType: mode }).then((res: any) => {
        const { records = {} } = res;
        const { DATA = [], KHXM = '', SJ = '', KHH = '' } = records;
        setDataSource(DATA.map((item: any, index: number) => ({ ...item, key: index }))); setKHXM(KHXM); setSJ(SJ); setLoading(false); setCustomerCode(KHH);
      }).catch((err: any) => message.error(err.note || err.message));
    }
  }, [visible])

  const getColumns = (): any[] => {
    let columns: any[] = [
      {
        title: '市场板块',
        dataIndex: 'MARKETBOARDNAME',
        filters: [...(new Set(dataSource.map((item: any) => item.MARKETBOARDNAME)))].map((item: any) => ({ text: item, value: item })),
        onFilter: (value: string, record: any) => record.MARKETBOARDNAME === value,
      },
      {
        title: '证券类型',
        dataIndex: 'SECU_CLS2NAME',
        // filters: [...(new Set(state.dataSource.map((item: any) => item.SECU_CLS2NAME)))].map((item: any) => ({ text: item, value: item })),
        // onFilter: (value: string, record: any) => record.SECU_CLS2NAME === value,
      },
      {
        title: '业务品种',
        dataIndex: 'BUSI_CLS_NAME',
        // filters: [...(new Set(state.dataSource.map((item: any) => item.BUSI_CLS_NAME)))].map((item: any) => ({ text: item, value: item })),
        // onFilter: (value: string, record: any) => record.BUSI_CLS_NAME === value,
      },
      {
        title: '交易行为',
        dataIndex: 'TRADESNAME',
        ellipsis: true,
        // width: '14.2%',
        // filters: function() {
        //   let result = new Set();
        //   state.dataSource.forEach((item: any) => {
        //     const datas = item.TRADESNAME.split(',');
        //     result = new Set([...result, ...datas]);
        //   });
        //   return [...result].map((item: any) => ({ text: item, value: item }));
        // }(),
        // onFilter: (value: string, record: any) => record.TRADESNAME.indexOf(value) > -1,
      },
      {
        title: '交易渠道',
        dataIndex: 'CHANNELSNAME',
        ellipsis: true,
      },
      // {
      //   title: '日期',
      //   dataIndex: 'TIME',
      //   // render: () => moment().format('YYYY-MM-DD HH:mm:ss'),
      // },
      {
        // title: '实际费率',
        title: '实际费率(‰)',
        // dataIndex: 'FEE_RATIO',
        dataIndex: 'FEE_RATIO_TEMP',
        render: (text: string, record: any) => <div>
          <span style={{ paddingRight: 4 }}>{text}</span>
          <Popover
            trigger='click'
            onVisibleChange={(visible: boolean) => {
              if (visible) {
                setIconIndex(record.key);
                QueryHistoricalRateInformation({ accnNo: account, accnType: mode }).then((res: any) => {
                  const { records = [] } = res;
                  setHistoryData(records);
                }).catch((err: any) => message.error(err.note || err.message));
              } else {
                setIconIndex(-1);
              }
            }}
            content={<div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <div style={{ paddingRight: 25 }}>日期</div>
                <div>实际费率(‰)</div>
              </div>
              {
                historyData.map((item: any, index: number) => <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <div style={{ paddingRight: 25 }}>{item.date || '-'}</div>
                  <div>{item.rate}</div>
                </div>)
              }
            </div>}
          >
            <img style={{ cursor: 'pointer' }} src={iconIndex === record.key ? arrow_up : arrow_down} />
          </Popover>
        </div>
      },
    ];
    if (mode === 2) {
      columns.splice(4, 0, { title: '委托类型', dataIndex: 'ORDER_TYPESNAME' });
      columns = columns.map((item: any) => ({ ...item, width: '14.2%' }))
    } else {
      columns = columns.map((item: any) => ({ ...item, width: '12.5%' }))
    }
    return columns;
  }

  return <Modal
    visible={visible}
    title={<div style={{ color: '#1A2243' }}>费率</div>}
    footer={null}
    onCancel={() => { setVisible(false); }}
    width={document.body.clientWidth > 952 ? 852 : document.body.clientWidth - 100}
    bodyStyle={{ padding: '20px 0' }}
    destroyOnClose
  >
    <Row type='flex' justify='space-between' align='middle' style={{ margin: '0 24px 20px' }}>
      <Col style={{ display: 'flex' }}>
        <div>
          <span style={{ marginRight: 15 }}>客户：{customerCode}</span>
          <span>{KHXM}</span>
        </div>
        <div style={{ marginLeft: 50 }}>资金账号：{account}</div>
      </Col>
      <Col style={{ fontSize: 12, color: '#959CBA' }}>数据时间：{SJ}</Col>
    </Row>
    <Scrollbars autoHide style={{ height: height }}>
      <div style={{ padding: '0 24px' }}>
        <Table rowKey='key' loading={loading} columns={getColumns()} dataSource={dataSource} className={`m-table-customer ${styles.table}`} pagination={false} />
      </div>
    </Scrollbars>
  </Modal>
}

export default RateModal;