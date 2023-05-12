import React,{ useState,useCallback } from 'react';
import ProductTypeSelect from './ProductTypeSelect';
import './index.less';
//用于记录key值与tab标题之间的映射关系
const tabMap = {
  '0': '增值产品',
  '1': '理财产品',
};
export default function ProductChance(props) {
  const { typeTab = '0' } = props;
  const [tab,usetab] = useState(typeTab);
  const onChangeTab = useCallback((key)=>{
    console.log(key);
    usetab(key);
  }); 
  return (
    <div className='addProduct'>
      <ProductTypeSelect 
        tab={tab}
        onChangeTab={onChangeTab}
      />
    </div>
    
  );
}
