import React ,{ useState,useEffect }from 'react';
import { Select } from 'antd';
import arrowDown from '$assets/newProduct/chance/arrow_down.png';
import arrowUp from '$assets/newProduct/chance/arrow_up.png';
import styles from './index.less';

export default function SingleSelect(props) {
  const [visible,setVisible] = useState(false);
  const { data,setValue,value } = props;
  return (
    <Select className={styles.singleSelect} value={value} defaultActiveFirstOption={false} onChange={(value)=>setValue(value)} suffixIcon={<img alt='' src={visible ? arrowUp : arrowDown}/>} placeholder='请选择' onDropdownVisibleChange={(open)=>setVisible(open)}>
      {
        data.map((item,index)=><Select.Option key={item.value} value={item.value} title={item.name}>{item.name}</Select.Option>)
      }
    </Select>
  );
}
