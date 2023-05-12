import React ,{ useState } from 'react' ;
import { Checkbox, Divider , Button ,Tree } from 'antd';
import styles from "./index.less";
import { join } from 'lodash';



export default function FilterLevel(props){

  const [levelDate , setLevelDates] = useState([]); //客户级别-ECIF
  const [checked , setChecked] = useState (false);
  const [changeClass , setChangeClass] = useState(false);

  // "全选"多选框改变
  const handleCheckboxChange = () => {
    const data = props.treeData;
    const tt = [];
    setChecked(!checked);
    
    if(!checked){
      setChangeClass(true);
      for(var i = 0 ; i < data.length;i++){
        for(var j = 0 ; j < data[i].children.length;j++){
          tt.push(data[i].children[j].key);
        }
      }
      setLevelDates(tt);
    }else{
      setChangeClass(false);
      setLevelDates([]);
    }

  };
  // 列筛选里多选框改变
  const handleCheck = (e,k) => {
    let arr = [] ;
    if(e.length > 0){
      setChecked(true);
    }else{
      setChecked(false);
    }
    e.map((item,index) => {
      if(item.indexOf('V') < 0){
        arr.push(item);
      }
    });

    if(arr.length === props.levelDateLength){
      setChangeClass(true);
    }else{
      setChangeClass(false);
    }
    setLevelDates(arr);
  };


  //  状态筛选框--重置
  const handleClear = (e) => {
    setChecked(false);
    setLevelDates([]);
  };
  //  状态筛选框确定
  const handleOk = () =>{

    props.setCusCode(join(levelDate));
    if(props.confirm){
      props.confirm();
    }
  };
 
  const treeDatas = props.treeData ;
  return (
    <div className={`${styles.pDropDownInput}`} style={{ width: '260px', position: 'relative' }}>
      <Checkbox checked={checked} onChange={()=>{handleCheckboxChange() } } style={{ padding: '10px 15px 15px 20px',color: '#4B516A' }} className={ changeClass ? styles.selectBoxAll : styles.selectBox } >全选</Checkbox>
      <Divider style={{ margin: 0 }} />
      <div className={styles.dealLevel}>
        {
          <div style={{ padding: '0 0 0 10px' }}>
            <Tree
              treeData={treeDatas ? treeDatas : []}
              checkable
              onCheck={handleCheck}
              checkedKeys = {levelDate}
            /> 
          </div>

        }
      </div>
      <div style={{ padding: '1px 14px 13px 14px', textAlign: 'right' }}>
        <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px',minWidth: '62px',height: '32px' }} onClick={()=>{handleClear()}}>重 置</Button>
        <Button className="m-btn-radius ax-btn-small m-btn-blue" style={{ minWidth: '62px',height: '32px' }} onClick={()=>{handleOk()}}>搜 索</Button>
      </div>
    </div>
  );
  
}

 
