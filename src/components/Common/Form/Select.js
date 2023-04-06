import React from 'react';
import { Input, Cascader, Select } from 'antd';

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    const { value = '' } = this.props;
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(props) {
    if ('value' in props) {
      const { value } = props;
      this.setState({
        value,
      });
    }
  }

  isCascader = (datas = []) => {
    let hasChildren = false;
    if (Array.isArray(datas)) {
      datas.every((item) => {
        const { children } = item;
        if (children && children.length > 0) {
          hasChildren = true;
          return false;
        }
        return true;
      });
      return hasChildren;
    }
    return false;
  }

  handleChange=(value) => {
    this.triggerChange(value);
  }

  triggerChange = (changedValue) => {
    // 将值改变传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render() {
    const { required, labelName, titleKey = 'label', rowKey = 'value', datas = [], width = '100%', placeholder = '请选择', ...restProps } = this.props;
    const isCascader = this.isCascader(datas); // 判断是否是级联选择(根据是否有有效的children来判断)
    if (Array.isArray(datas) && datas.length > 0) {
      if (labelName) {
        return (
          <Input.Group className="m-input-group" style={{ display: 'block', width }} compact>
            <span className="ant-input-group-addon" style={{ display: '' }}>
              {required && <span style={{ color: 'red' }}>*</span>}{labelName}
            </span>
            {
              isCascader ? (
                <Cascader notFoundContent="暂无数据" className="m-cascader-picker" value={this.state.value} onChange={this.handleChange} options={datas} placeholder={placeholder} {...restProps} />
              ) : (
                <Select className="m-select m-select-default" value={this.state.value} onSelect={this.handleChange} placeholder={placeholder} {...restProps}>
                  {
                    datas.map((item) => {
                      return <Select.Option key={item[rowKey]} value={item[rowKey]} >{item[titleKey]}</Select.Option>;
                    })
                  }

                </Select>
              )
            }
          </Input.Group>
        );
      } else if (isCascader) {
        return <Cascader notFoundContent="暂无数据" className="m-cascader-picker" value={this.state.value} onChange={this.handleChange} options={datas} placeholder={placeholder} {...restProps} />;
      }
      return (
        <Select className="m-select m-select-default" value={this.state.value} onSelect={this.handleChange} placeholder={placeholder} {...restProps}>
          {
            datas.map((item) => {
              return <Select.Option key={item[rowKey]} value={item[rowKey]} >{item[titleKey]}</Select.Option>;
            })
          }

        </Select>
      );
    }
    return (
      <Select className="m-select m-select-default" value="" placeholder={placeholder} {...restProps} />
    );
  }
}

export default SearchInput;
