import { FC } from 'react';
import Tabs from '../Common/Tab';
import MergeAccounts from './MergeAccounts';
import NormalAccounts from './NormalAccounts';
import CreditAccounts from './CreditAccounts';

const CustomerAssets: FC = () => {
  return (
    <Tabs title={['合并账户', '普通账户', '信用账户']}>
      <MergeAccounts tabKey='0' />
      <NormalAccounts tabKey='1' />
      <CreditAccounts tabKey='2' />
    </Tabs>
  );
}

export default CustomerAssets;