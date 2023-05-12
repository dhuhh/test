import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Button, Checkbox, Col, Icon, Input, message, Row, Spin } from 'antd';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

export default forwardRef((props, ref) => {
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectRowKeys, setSelectRowKeys] = useState([]);
  const [inputValue, setInputValue] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        selectRowKeys,
        reset,
        setLoading,
      };
    },
    [selectRowKeys],
  );

  const data = useMemo(() => props.symbolDataSource || [], [props.symbolDataSource]);

  const reset = () => {
    setCheckAll(false);
    setIndeterminate(false);
    setSelectRowKeys([]);
    setInputValue(undefined);
  };

  const handleOk = () => {
    const { confirm, fetchData, setStepList, setCurrent } = props;
    // 根据已选条件筛选表格数据
    if (setStepList) {
      let value = selectRowKeys;
      setStepList(value);
    }
    setTimeout(() => {
      fetchData();
    });
    setCurrent();
    if (typeof confirm === 'function') confirm();
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCheckboxChange = (e, item) => {
    let selectRowKeysClone = lodash.cloneDeep(selectRowKeys);
    let flag = -1;
    selectRowKeysClone.forEach((value, index) => {
      if (item === value) {
        flag = index;
      }
    });
    if (flag === -1) {
      selectRowKeysClone.push(item);
    } else {
      selectRowKeysClone.splice(flag, 1);
    }
    setSelectRowKeys(selectRowKeysClone);
  };

  useEffect(() => {
    const selectData = data.filter(item => (item.indexOf(inputValue || '') > -1 || item.indexOf(inputValue || '') > -1));
    if (selectData.every(item => !selectRowKeys.includes(item))) {
      setCheckAll(false);
      setIndeterminate(false);
    } else if (selectData.every(item => selectRowKeys.includes(item))) {
      setCheckAll(true);
      setIndeterminate(false);
    } else {
      setCheckAll(false);
      setIndeterminate(true);
    }
  }, [data, inputValue, selectRowKeys]);

  const handleCheckAllChange = (e) => {
    const checkAll = e.target.checked;
    const selectRowKeysClone = lodash.cloneDeep(selectRowKeys);
    data.filter(item => (item.indexOf(inputValue || '') > -1 || item.indexOf(inputValue || '') > -1)).forEach(item => {
      if (checkAll) {
        if (!selectRowKeysClone.includes(item)) {
          selectRowKeysClone.push(item);
        }
      } else {
        if (selectRowKeysClone.includes(item)) {
          selectRowKeysClone.splice(selectRowKeysClone.indexOf(item), 1);
        }
      }
    });
    setIndeterminate(false);
    setCheckAll(checkAll);
    setSelectRowKeys(selectRowKeysClone);
  };

  return (
    <div style={{ width: 270, color: '#1A2243', fontSize: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 15px', borderBottom: '1px solid #EBECF2' }}>
        <div className='m-bss-select-checkbox'>
          <div className='m-bss-select-dropdown-title' style={{ borderBottom: 'none', padding: '3px 6px', display: 'flex', justifyContent: 'center' }}>
            <Checkbox checked={checkAll} indeterminate={indeterminate} onChange={handleCheckAllChange}>全选</Checkbox>
          </div>
        </div>
        <div style={{ color: '#959CBA' }}>{selectRowKeys.length}/{data.length}</div>
      </div>
      {/* {
        !props.noInput && (
          <div style={{ padding: '10px 20px' }}>
            <Input
              className={styles.input}
              style={{ height: 30 }}
              suffix={<Icon type="search" style={{ color: '#D1D5E6' }} />}
              placeholder='请输入'
              value={inputValue}
              onChange={handleChange}
              allowClear={true}
            />
          </div>
        )
      } */}

      <Scrollbars style={{ width: '100%', height: 200 }}>
        <Spin spinning={loading}>
          {data.filter(item => (item.indexOf(inputValue || '') > -1 || item.indexOf(inputValue || '') > -1)).map((item, index) => (
            <div onClick={(e) => handleCheckboxChange(e, item)} key={index} style={{ width: '100%', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
              <div style={{ cursor: 'default' }}>{item}</div>
              <Checkbox className={styles.options} checked={selectRowKeys.includes(item)} />
            </div>
          ))}
        </Spin>
      </Scrollbars>
      <div style={{ padding: '10px 20px' }}>
        <Button style={{ width: 60, height: 32 }} className='m-btn-radius ax-btn-small' type="button" onClick={reset} >重置</Button>
        <Button style={{ width: 60, height: 32 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={handleOk}>搜索</Button>
      </div>
    </div>
  );
});
