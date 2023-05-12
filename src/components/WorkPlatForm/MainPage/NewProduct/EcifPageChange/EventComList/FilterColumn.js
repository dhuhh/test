import React, { Component } from 'react';
import { Checkbox, Divider,Select, Button ,Icon } from 'antd';
import styles from "./index.less";
import { join } from 'lodash';
class FilterColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedGroup: [],
      checked: false,
      dropMarginTop: '0px',
    };
  }
  // "全选"多选框改变
  handleCheckboxChange = () => {
    let { checked, checkedGroup = [] } = this.state;
    const { DIS_ZTList } = this.props;
    let arr = [];
    let top = '0px';
    checked = !checked;
    if (checked) {
      DIS_ZTList.forEach(item=>{
        arr.push(item.id);
      });
      checkedGroup = [...new Set(arr) ];
      top = '25px';
    } else {
      checkedGroup = [];
      top = '0px';
    }
    this.setState({ checked, checkedGroup ,dropMarginTop: top });

  }
  // 列筛选里多选框改变
  handleChange = (e) => {

    const { DIS_ZTList } = this.props;
    let item = e[0];
    let itemName = '';
    let top = '0px';
    // 动态改变选框下面确定按钮的位置
    DIS_ZTList.forEach(i=>{if(i.id === item){itemName = i.name;}});
    if(e.length > 1 && itemName && itemName.length > 3){
      top = '25px';
    }else{
      top = '0px';
    }
    this.setState({ checkedGroup: e ,dropMarginTop: top });
  }
  maxTagPlaceholder = (value) => {
    const num = 1 + value.length;
    return <span>...等{num}项</span>;
  }
  //  状态筛选框--重置
  handleClear = () => {
    const { setDisorderly  } = this.props ;
    this.setState({
      checked: false, // 全选
      checkedGroup: [],  // 多选框值
      dropMarginTop: '0px',
    });
    setDisorderly('');
  }
  //  状态筛选框确定
  handleOk = () =>{

    const { setDisorderly ,confirm } = this.props ;
    const { checkedGroup } = this.state ;

    setDisorderly(join(checkedGroup));

    if(confirm){
      confirm();
    }
  }
 
  render() {
    const { DIS_ZTList } = this.props;
    const { checkedGroup,dropMarginTop } = this.state;
    return (
      <div  className={`${styles.pDropDownInput}`} style={{ width: '250px', position: 'relative'}}>
        <div style={{display:'flex',justifyItems:'center',justifyContent:'space-between',padding: '10px 15px 15px 20px',color: '#4B516A'}}>
          <Checkbox checked={this.state.checked} onChange={this.handleCheckboxChange}  className='m-bss-select-checkbox'>全选</Checkbox>
          <div style={{color: '#959CBA'}}>{checkedGroup.length}/{DIS_ZTList.length}</div>
        </div>
        <Divider style={{ margin: 0 }} />
        <div  style={{ height: '19rem' ,marginTop: '8px' }}>
          <Select
            mode='multiple'
            multiple
            allowClear
            dropdownClassName={styles.mSelectDropdown}
            maxTagCount={1}
            maxTagTextLength={7}
            maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
            value={checkedGroup}
            onChange={(e)=>{this.handleChange(e);}}
            filterOption={(input, option) => {
              return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            placeholder="请输入"
            menuItemSelectedIcon={e => {
              return DIS_ZTList.length > 0 && e.value !== 'NOT_FOUND' &&
                  (
                    <Checkbox checked={checkedGroup.filter(key => { return key === e.value; }).length > 0} />
                  );
            }}
            style={{ width: '100%' }}
            dropdownStyle={{ boxShadow: 'none' }}
            dropdownRender={menu => (
              <div className='m-bss-select-checkbox'>
                <div className='m-bss-select-dropdown'>{menu}</div>
              </div>
            )}
            dropdownMenuStyle={{ height: '15rem' }}
            dropdownMatchSelectWidth
            getPopupContainer={triggerNode => triggerNode.parentElement}
            open
          >
            {
              DIS_ZTList.map(m => <Select.Option key={m.id} title={m.name} value={m.id}>{m.name}</Select.Option>) 
            }
          </Select>
        </div>

        <div style={{ padding: '1px 14px 13px 14px', textAlign: 'right',marginTop: dropMarginTop }}>
          <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px',minWidth: '62px',height: '32px' }} onClick={this.handleClear}>重 置</Button>
          <Button className="m-btn-radius ax-btn-small m-btn-blue" style={{ minWidth: '62px',height: '32px' }} onClick={this.handleOk}>搜 索</Button>
        </div>
      </div>
    );
  }
}

export default FilterColumn;
