import { FC } from 'react';
import Tabs from '../Common/Tab';
import DefaultCustomer from './DefaultCustomer';
import PotentialCustomer from './PotentialCustomer';
import DayAddCustomer from './DayAddCustomer';
import DayReduceCustomer from './DayReduceCustomer';
import YearAddCustomer from './YearAddCustomer';
import YearReduceCustomer from './YearReduceCustomer';

const TradeSearch: FC = () => {
  return (
    <Tabs title={['中端富裕客户', '潜在中端富裕客户', '当日新增中端富裕客户', '当日减少中端富裕客户', '当年新增中端富裕客户', '当年减少中端富裕客户']}>
      <DefaultCustomer />
      <PotentialCustomer />
      <DayAddCustomer />
      <DayReduceCustomer />
      <YearAddCustomer />
      <YearReduceCustomer />
    </Tabs>
  );
}

export default TradeSearch;