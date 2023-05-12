import { FC, useState } from 'react';
import { DatePicker, Button  } from 'antd';
import moment from 'moment';
import styles from '../index.less';
import { RangePickerPresetRange } from 'antd/lib/date-picker/interface';

const { RangePicker } = DatePicker;

type Props = Readonly<{
  type: 'date' | 'month',
  dateValue?: any,
  monthValue?: any,
  dateChange?: Function,
  monthChange?: Function,
  defaultValue?: any[],
}>

interface rangeData { [range: string]: RangePickerPresetRange };

const CustomizeRangePicker: FC<Props> = (props) => {
  const [mode, setMode] = useState<string[]>(props.type === 'date' ? ['date', 'date'] : ['month', 'month']);
  const [open, setOpen] = useState<boolean>(false);

  const dateRanges: rangeData = {
    '本日': [moment(), moment()],
    '本周': [moment().startOf('week'), moment()],
    '本月': [moment().startOf('month'), moment()],
    '本年': [moment().startOf('year'), moment()],
    '近一月': [moment().subtract(1, 'month'), moment()],
    '近三月': [moment().subtract(3, 'month'), moment()],
    '近一年': [moment().subtract(1, 'year'), moment()],
  };

  const monthRanges: rangeData = {
    '本月': [moment().startOf('month'), moment()],
    '本年': [moment().startOf('year'), moment()],
    '近一月': [moment().subtract(1, 'month'), moment()],
    '近三月': [moment().subtract(3, 'month'), moment()],
    '近一年': [moment().subtract(1, 'year'), moment()],
  };

  // 禁用一年前时间选择
  const disabledDate = (current: any) => {
    return current < moment().subtract(1, 'year');
  }

  return (
    <>
      <RangePicker
        ranges={ props.type === 'date' ? dateRanges : monthRanges }
        mode={mode}
        allowClear={true}
        value={props.type === 'date' ? props.dateValue : props.monthValue}
        className={`${styles.rangePicker} ${styles.monthAdd}`}
        dropdownClassName={`${styles.calendar} m-bss-range-picker`}
        style={{ width: '250px' }}
        placeholder={['开始日期', '结束日期']}
        format={ props.type === 'date' ? "YYYY-MM-DD" : "YYYY-MM" }
        separator='至'
        open={open}
        onOpenChange={(open)=>{setOpen(open)}}
        renderExtraFooter={props.type === 'date' ? undefined : () => <Button style={{ minWidth: 50, height: 25, width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' ,borderRadius: 2,boxShadow: 'none' }}
         onClick={()=>{setOpen(false)}} className='m-btn-radius ax-btn-small m-btn-blue'>确定</Button>}
        onChange={value => {
          if(props.type === 'date' && props.dateChange) props.dateChange(value);
          if(props.type === 'month' && props.monthChange) props.monthChange(value);
        }}
        onPanelChange={(value, mode) => {
          if(props.type === 'month' && props.monthChange) {
            props.monthChange(value);
            setMode(['month', 'month']);
          }
        }}
      />
    </>
  );
}

export default CustomizeRangePicker;