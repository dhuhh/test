/* eslint-disable array-callback-return */
import React from 'react';
import { Select, Checkbox } from 'antd';
const { Option } = Select;

class SelectCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      indeterminate: false,
      checkAll: false,
    };
  }

  componentDidMount() {
  }

    onChange = (checkedList) => {
      const { data, setValue } = this.props;
      this.setState({
        checkedList: checkedList,
        indeterminate: !!checkedList.length && checkedList.length < data.length,
        checkAll: checkedList.length === data.length,
      });
      if (setValue) {
        setValue(checkedList);
      }
    };

    onCheckAllChange = (e) => {
      const { data, setValue } = this.props;
      const key = [];
      data.map(item => {
        key.push(item.ibm);
      });
      this.setState({
        checkedList: e.target.checked ? key : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      if (setValue) {
        setValue(e.target.checked ? key : []);
      }
    };

    maxTagPlaceholder = (value) => {
      const num = 3 + value.length;
      return <span>...等{num}项</span>;
    }

    render() {
      const { data = [], placeholder } = this.props;
      const { checkedList = [], indeterminate, checkAll } = this.state;
      return (
        <Select
          placeholder={placeholder}
          filterOption={(input, option) => option.key.indexOf(input) >= 0}
          showArrow
          allowClear={true}
          mode='multiple'
          multiple
          maxTagCount={3}
          maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
          maxTagTextLength={7}
          menuItemSelectedIcon={e => {
            return data.length > 0 && <Checkbox checked={checkedList.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
          }}
          onChange={(e) => this.onChange(e)}
          value={checkedList}
          dropdownRender={menu => (
            <div>
              {data.length > 0 && (
                <div style={{ borderBottom: '1px solid #EAECF2', width: '100%', padding: '10px 20px', display: 'flex', flexWrap: 'nowrap' }}>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={(e) => this.onCheckAllChange(e)}
                    checked={checkAll}
                  >
                                全选
                  </Checkbox>
                </div>
              )}
              {menu}
            </div>
          )}
        >
          {data.map(item => <Option key={item.note} value={item.ibm} className='m-bss-select-checkbox'>{item.note}</Option>)}
        </Select>
      );
    }
}
export default SelectCheckbox;
