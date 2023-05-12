import React from 'react';
import { Select } from 'antd';

export default function Filter(props) {
  return (
    <Select
      style={{ width: 0, height: 0, visibility: 'hidden', position: 'relative', top: -6 }}
      value={props.value}
      onChange={props.onChange}
      open={props.visible}
      dropdownMatchSelectWidth={false}
    >
      { props.data.map((item, index) => <Select.Option key={item.key || index} value={item.key || index} style={props.value !== (item.key || index) && { color: '#1A2243' }}>{item.value || '-'}</Select.Option>) }
    </Select>
  );
}
