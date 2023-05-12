import { FC } from 'react';
import Tabs from '../Common/Tab';
import MergeAccounts from './MergeAccounts';
import NormalAccounts from './NormalAccounts';
import CreditAccounts from './CreditAccounts';
import StockOptionAccounts from './StockOptionAccounts';

const StockTransactions: FC = () => {
  return (
    <Tabs title={['合并账户', '普通账户', '信用账户', '股票期权账户']}>
      <MergeAccounts tabKey='0' />
      <NormalAccounts tabKey='1' />
      <CreditAccounts tabKey='2' />
      <StockOptionAccounts tabKey='3' />
    </Tabs>
  );
}

export default StockTransactions;