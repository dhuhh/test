import React, { Component } from 'react';
import { Checkbox, Divider , Button  } from 'antd';
import styles from "./index.less";
class FilterDegree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedGroup: [],
      checked: false,
      changeClass: false ,
    };
  }

  // "全选"多选框改变
  handleCheckboxChange = () => {
    
    let { checked, checkedGroup = [] , changeClass } = this.state;
    const { IMP_ZTList } = this.props;
    checked = !checked;
    
    if (checked) {
      changeClass = true;
      IMP_ZTList.forEach(item=>{
        checkedGroup.push(item.id);
      });
    } else {
      changeClass = false;
      checkedGroup = [];
    }
    this.setState({ checked, checkedGroup , changeClass });

  }
  // 列筛选里多选框改变
  handleChange = (e,k) => {
    const { IMP_ZTList } = this.props;
    let { checked, checkedGroup = [] , changeClass } = this.state;
    if(e.target.checked){
      checkedGroup.push(k);
    }else{
      checkedGroup.splice(checkedGroup.indexOf(k),1);
    }
    if(checkedGroup.length > 0){
      checked = true;
    }else{
      checked = false;
    }

    if(IMP_ZTList.length === checkedGroup.length){
      changeClass = true;
    }else{
      changeClass = false;
    }
    this.setState({ checked, checkedGroup , changeClass });
  }

  //  状态筛选框--重置
  handleClear = () => {
    this.setState({
      checked: false, // 全选
      checkedGroup: [], // 多选框值
    });

  }
  //  状态筛选框确定
  handleOk = () =>{
    const { setDataParam ,confirm ,getData } = this.props ;
    const { checkedGroup } = this.state ;

    if(confirm){
      setDataParam(checkedGroup);
      confirm();
      getData();
    }

  }

  render() {
    const { IMP_ZTList } = this.props;
    const { checkedGroup , changeClass } = this.state;

    return (
      <div className={`${styles.pDropDownInput}`} style={{ width: '250px', position: 'relative'}}>
        <Checkbox checked={this.state.checked} onChange={this.handleCheckboxChange} style={{ padding: '10px 15px 15px 20px',color: '#4B516A' }} className={ changeClass ? styles.selectBoxAll : styles.selectBox }>全选</Checkbox>
        <Divider style={{ margin: 0 }} />
        <div className={styles.dealLevel} >
          {
            IMP_ZTList.map(m =>{
              return (
                <div className={`m-bss-select-checkbox  ${styles.dealDegreeCheck}`} key={m.name} >
                  <div className='m-bss-select-dropdown'>{m.name}</div> <Checkbox checked={checkedGroup.indexOf(m.id) > -1 ? true : false} onChange={(e)=>this.handleChange(e,m.id)}/>
                </div>
                
              );
            } )
          }
        </div>
        <div style={{ padding: '1px 14px 13px 14px', textAlign: 'right' }}>
          <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px',minWidth: '62px',height: '32px' }} onClick={this.handleClear}>重 置</Button>
          <Button className="m-btn-radius ax-btn-small m-btn-blue" style={{ minWidth: '62px',height: '32px' }} onClick={this.handleOk}>搜 索</Button>
        </div>
      </div>
    );
  }
}

export default FilterDegree;
