/* eslint-disable array-callback-return */
import React from 'react';
import { Select, Checkbox, Spin, Pagination } from 'antd';
const { Option } = Select;

class SelectCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  componentDidMount() {

  }
  componentDidUpdate() {

  }


  /*   componentWillReceiveProps(nextProps) {
    const { value = '' } = this.props;
    const { value: nextValue = '' } = nextProps;
    if (value !== nextValue) {
      this.setState({
        checkedList: nextValue === '' ? [] : nextValue,
      });
    }
  } */


  onChange = (checkedList) => {
    const { setValue } = this.props;
    this.setState({
      inputValue: '',
    });
    if (setValue) {
      setValue(checkedList);
    }
  };

  onCheckAllChange = (e) => {
    let { data, setValue } = this.props;
    const key = [];
    if (this.state.inputValue) data = data.filter((item) => item.ryxm.indexOf(this.state.inputValue) > -1);
    data.map(item => {
      key.push(`${item.ryid}/${item.ryxm}/${item.rybh}`);
    });
    if (setValue) {
      setValue(e.target.checked ? key : [], 'all');
    }
  };

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  render() {
    const { data = [], placeholder, checkedList } = this.props;
    const { indeterminate, checkAll, current, total, handlePagerChange, searchAdmin, loading } = this.props;
    const PaginationProps = {
      showQuickJumper: true,
      current: current,
      onChange: handlePagerChange,
      total: total,
    };
    return (
      <Select
        placeholder={placeholder}
        onSearch={searchAdmin}
        showArrow={checkedList.length === 0}
        allowClear={true}
        mode='multiple'
        defaultActiveFirstOption={false}
        maxTagCount={3}
        maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)
        }
        maxTagTextLength={7}
        menuItemSelectedIcon={e => {
          return data.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={checkedList.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
        }}
        onChange={(e) => this.onChange(e)}
        value={checkedList}

        dropdownRender={menu => (
          <div className='m-bss-select-checkbox'>
            {data.length > 0 && (
              <div className='m-bss-select-dropdown-title' id='test1'>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={(e) => this.onCheckAllChange(e)}
                  checked={checkAll}
                >
                  全选
                </Checkbox>
              </div>
            )}
            <Spin spinning={loading}>
              <div className='m-bss-select-dropdown' >{menu}</div>
            </Spin>
            <div style={{ marginTop: '3px', marginBottom: '3px', textAlign: 'right' }}>
              <Pagination {...PaginationProps} simple />
            </div>
          </div>
        )}
      // open
      >
        { data.map(item => <Option key={`${item.ryid}/${item.ryxm}`} value={`${item.ryid}/${item.ryxm}/${item.rybh}`} >{item.ryxm}</Option>)}
      </Select >
    );
  }
}
export default SelectCheckbox;
