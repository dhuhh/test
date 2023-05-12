import { FC } from 'react';
import Tabs from '../Common/Tab';
import MergeAccounts from './MergeAccounts';
import NormalAccounts from './NormalAccounts';
import CreditAccounts from './CreditAccounts';
import FinancialAccounts from './FinancialAccounts';
import StockOptionAccounts from './StockOptionAccounts';

// 账户类型 空｜合并账户；1｜普通账户；2｜信用账户；3｜理财账户；5｜股票期权账户
const TradingVolume: FC = () => {
  return (
    <Tabs title={['合并账户', '普通账户', '信用账户', '理财账户', '股票期权账户']}>
      <MergeAccounts tabKey='0' />
      <NormalAccounts tabKey='1' />
      <CreditAccounts tabKey='2' />
      <FinancialAccounts tabKey='3' />
      <StockOptionAccounts tabKey='4' />
    </Tabs>
  );
}

export default TradingVolume;