import React, { Component } from 'react';
import { Checkbox, Divider,Select, Button } from 'antd';
import styles from "../index.less";
class FilterColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedGroup: [],
      checked: false,
      dropMarginTop: '0px',
      show: false ,
    };
  }
  // "全选"多选框改变
  handleCheckboxChange = () => {
    let { checked, checkedGroup = [] } = this.state;
    const { YWLC_ZTList } = this.props;
    let arr = [];
    let top = '0px';
    checked = !checked;
    if (checked) {
      YWLC_ZTList.forEach(item=>{
        arr.push(item.id);
      });
      checkedGroup = [...new Set(arr) ];
      top = '25px' ;
    } else {
      checkedGroup = [];
      top = '0px';
    }
    this.setState({ checked, checkedGroup , dropMarginTop: top });

  }
  // 列筛选里多选框改变
  handleChange = (e) => {
    const { YWLC_ZTList } = this.props;
    let item = e[0];
    let itemName = '';
    let top = '0px';
    // 动态改变选框下面确定按钮的位置
    YWLC_ZTList.forEach(i=>{if(i.id === item){itemName = i.name;}});
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
    const { setData } = this.props;
    this.setState({
      checked: false, // 全选
      checkedGroup: [], // 多选框值
      dropMarginTop: '0px',
    },()=>{  
      if(setData) {
        setData('');
      }});
  }
  //  状态筛选框确定
  handleOk = () =>{
    const { confirm , setData } = this.props;
    const { checkedGroup } = this.state;
    if(setData) {
      setData(checkedGroup.join(','));
    }
    if(confirm){
      confirm();
    }
  }
 
  render() {
    const { YWLC_ZTList } = this.props;
    const { checkedGroup,dropMarginTop } = this.state;
    return (
      <div className={`${styles.pDropDownInput}`} style={{ width: '250px', position: 'relative' }}>
        <Checkbox checked={this.state.checked} onChange={this.handleCheckboxChange} style={{ padding: '10px 15px 15px 20px',color: '#4B516A' }} className='m-bss-select-checkbox'>全选</Checkbox>
        <Divider style={{ margin: 0 }} />
        <div style={{ height: '20rem' ,marginTop: '8px' }}>
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
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            placeholder="请输入"
            menuItemSelectedIcon={e => {
              return YWLC_ZTList.length > 0 && e.value !== 'NOT_FOUND' &&
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
            dropdownMenuStyle={{ height: '16rem' }}
            dropdownMatchSelectWidth
            getPopupContainer={triggerNode => triggerNode.parentElement}
            open
          >
            {
              YWLC_ZTList.map(m => <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>) 
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
