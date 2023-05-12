import { Col, message, Modal, Popover, Row, Table, Tooltip } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { QueryCustomerComRate } from '$services/customerPanorama';
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
      QueryCustomerComRate({ accountType: mode, accounts: account }).then((res: any) => {
         const { records = [] } = res;
         setDataSource(records.map((item: any, index: number) => {
           return { ...item, key: index };
         }));
         setLoading(false);
      }).catch((err: any) => message.error(err.note || err.message));
    }
  }, [visible])

  const getColumns = (): any[] => {
    let columns: any[] = [
      {
        title: '市场板块',
        dataIndex: 'marketBoard',
        filters: [...(new Set(dataSource.map((item: any) => item.marketBoard)))].map((item: any) => ({ text: item, value: item })),
        onFilter: (value: string, record: any) => record.marketBoard === value,
      },
      {
        title: '证券类别',
        dataIndex: 'secuClass',
        width: 200,
        // filters: [...(new Set(state.dataSource.map((item: any) => item.SECU_CLS2NAME)))].map((item: any) => ({ text: item, value: item })),
        // onFilter: (value: string, record: any) => record.SECU_CLS2NAME === value,
        render : (text:any) =>(
          <Tooltip title={text} placement='bottom'>
            {showText14(text)}
          </Tooltip>
        ),
      },
      {
        title: '交易渠道',
        dataIndex: 'channels',
        width: 200,
        render: (text: any) => (
          <Tooltip title={text} placement='bottom'>
            {showText14(text)}
          </Tooltip>
        ),
      },
      {
        title: '交易类别',
        dataIndex: 'trades',
        width: 200,
        render: (text: any) => (
          <Tooltip title={text} placement='bottom'>
            {showText14(text)}
          </Tooltip>
        ),
      },
      {
        title: '基础费率‰',
        dataIndex: 'basicRate',
      },
      {
        title: '实际费率‰',
        dataIndex: 'actualRate',
      },
    ];
    return columns;
  }


  const showText14 = (text:any)=>{

    let newText = ''

    if(text && text.length>14){
      newText=text.slice(0,12) + '...'
    }else{
      newText = text
    }
    return newText
  }

  return <Modal
    visible={visible}
    title={<div style={{ color: '#1A2243' }}>费率</div>}
    footer={null}
    onCancel={() => { setVisible(false); }}
    width={document.body.clientWidth > 952 ? 950 : document.body.clientWidth - 80}
    bodyStyle={{ padding: '20px 0' }}
    destroyOnClose
  >
    <Row type='flex' justify='space-between' align='middle' style={{ margin: '0 24px 20px' }}>
      <Col style={{ display: 'flex' }}>
        {/* <div>
          <span style={{ marginRight: 15 }}>客户：{customerCode}</span>
          <span>{KHXM}</span>
        </div> */}
        <div>资金账号：{account}</div>
      </Col>
      {/* <Col style={{ fontSize: 12, color: '#959CBA' }}>数据时间：{SJ}</Col> */}
    </Row>
    <Scrollbars autoHide style={{ height: height }}>
      <div style={{ padding: '0 24px' }}>
        <Table rowKey='key' loading={loading} columns={getColumns()} dataSource={dataSource} className={`m-table-customer ${styles.table}`} pagination={false} />
      </div>
    </Scrollbars>
  </Modal>
}

export default RateModal;