/* eslint-disable array-callback-return */
import React from 'react';
import { Select, Checkbox } from 'antd';
import styles from './index.less';
const { Option } = Select;

class SelectCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: props.value || [],
      indeterminate: false,
      checkAll: false,
      inputValue: '',
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { value = '' } = this.props;
    const { value: nextValue = '' } = nextProps;
    if (value !== nextValue) {
      this.setState({
        checkedList: nextValue === '' ? [] : nextValue,
      });
    }
  }

  onChange = (checkedList) => {
    const { data, setValue } = this.props;
    this.setState({
      checkedList: checkedList,
      indeterminate: !!checkedList.length && checkedList.length < data.length,
      checkAll: checkedList.length === data.length,
      inputValue: '',
    });
    if (setValue) {
      setValue(checkedList);
    }
  };

  onCheckAllChange = (e) => {
    console.log(e);
    let { data, setValue } = this.props;
    const key = [];
    if (this.state.inputValue) data = data.filter((item) => item.note.indexOf(this.state.inputValue) > -1);
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
        className={styles.select}
        filterOption={(input, option) => option.key.indexOf(input) >= 0}
        onSearch={value => { this.state.inputValue = value; }}
        showArrow={checkedList.length === 0}
        allowClear={true}
        mode='multiple'
        defaultActiveFirstOption={false}
        maxTagCount={3}
        maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
        maxTagTextLength={7}
        menuItemSelectedIcon={e => {
          return data.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={checkedList.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
        }}
        onChange={(e) => this.onChange(e)}
        value={checkedList}
        dropdownRender={menu => (
          <div className='m-bss-select-checkbox'>
            {data.length > 0 && (
              <div className='m-bss-select-dropdown-title'>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={(e) => this.onCheckAllChange(e)}
                  checked={checkAll}
                >
                  全选
                </Checkbox>
              </div>
            )}
            <div className='m-bss-select-dropdown'>{menu}</div>
          </div>
        )}
      // open
      >
        {data.map(item => <Option key={item.note} value={item.ibm} title={item.note}>{item.note}</Option>)}
      </Select>
    );
  }
}
export default SelectCheckbox;
