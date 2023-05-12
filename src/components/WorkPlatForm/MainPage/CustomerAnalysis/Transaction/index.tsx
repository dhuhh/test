import { FC } from 'react';
import Tabs from '../Common/Tab';
import NormalAccounts from './NormalAccounts';
import CreditAccounts from './CreditAccounts';

const StockTransactions: FC = () => {
  return (
    <Tabs title={['普通账户', '信用账户']}>
      <NormalAccounts tabKey='1' />
      <CreditAccounts tabKey='2' />
    </Tabs>
  );
}

export default StockTransactions;