import { FC } from 'react';
import Tabs from '../../../Common/Tab';
import Stock from './Stock';
import OpenFunds from './OpenFunds';

type Props = Readonly<{
  type?: number, // 账户类型
  cusNo: string, // 客户号
  tabList: '股票' | '开放式基金' | '股票,开放式基金' , // tab显示类型
}>

const CustomerPosition: FC<Props> = (props) => {
  return (
    <>
      {
        props.tabList === '开放式基金' ? (
          <Tabs title={props.tabList.split(',')}>
            <OpenFunds cusNo={props.cusNo} />
            <div />
          </Tabs>
        ) : (
          <Tabs title={props.tabList.split(',')}>
            <Stock type={props.type} cusNo={props.cusNo} />
            <OpenFunds cusNo={props.cusNo} />
          </Tabs>
        )
      }
    </>
  );
}

export default CustomerPosition;