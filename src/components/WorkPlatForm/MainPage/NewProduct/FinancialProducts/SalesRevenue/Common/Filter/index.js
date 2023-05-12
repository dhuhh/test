import { Button, Checkbox, Divider, message, Select, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';


const Filter = (props) => {
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetchData(props);
    return () => { setDataList([]); };
  }, [props]);

  useEffect(() => {
    const type = props.type;
    if (type === 'product_sub_type_name') {
      setCheckedList([]);
      setCheckAll(false);
      setIndeterminate(false);
    } 
  }, [props.type, props.saleAndIncomeListModel.productMajorType]);

  useEffect(() => {
    const { type } = props;
    if (type === 'transaction_behavior') {
      setCheckedList([]);
      setCheckAll(false);
      setIndeterminate(false);
    } 
  }, [props]);


  useEffect(() => {
    setCheckedList([]);
    setCheckAll(false);
    setIndeterminate(false);
  }, [props.saleAndIncomeListModel.department,
    props.saleAndIncomeListModel.staticalPeriodStartTime,
    props.saleAndIncomeListModel.staticalPeriodEndTime,
    props.saleAndIncomeListModel.productCode,
    props.saleAndIncomeListModel.customerName]);

  // "全选"多选框改变
  const handleCheckAllChange = () => {
    setCheckAll(!checkAll);
    setIndeterminate(false);
    if (checkAll) {
      setCheckedList([]);
    } else {
      setCheckedList([...new Array(dataList.length).keys()]);
    }
  };
    // checkbox改变
  const handleCheckBoxChange = (index) => {
    const temp = lodash.cloneDeep(checkedList);
    if (temp.indexOf(index) > -1) {
      temp.splice(temp.indexOf(index), 1);
    } else {
      temp.push(index);
    }
    setCheckedList(temp);
    if (temp.length === 0) {
      setCheckAll(false);
      setIndeterminate(false);
    } else if (temp.length === dataList.length) {
      setCheckAll(true);
      setIndeterminate(false);
    } else {
      setCheckAll(false);
      setIndeterminate(true);
    }
  };
  // 清空按钮
  const handleClear = () => {
    setCheckedList([]);
    setCheckAll(false);
    setIndeterminate(false);
  };
  // 确定按钮
  const handleOk = () => {
    const temp = [];
    checkedList.forEach(index => {
      temp.push(dataList[index].lx);
    });
    const { onChange, confirm } = props;
    onChange(temp.join(','));
    confirm();
  };
  // 查询数据
  const fetchData = (props) => {
    setLoading(true);
    let { saleAndIncomeListModel, type, api } = props;
    saleAndIncomeListModel.pagerModel = {
      builder: {},
      pageNo: 1,
      pageSize: 50,
    };
    if (type === 'product_major_type_name') {
      saleAndIncomeListModel.productMajorType = '';
      saleAndIncomeListModel.productSubType = '';
      saleAndIncomeListModel.productTypeConditionModels = [{
        builder: {},
        esCode: 'product_major_type_name',
        esValue: '',
        type: 1,
      }];
    } else if (type === 'product_sub_type_name') {
      saleAndIncomeListModel.productSubType = '';
      saleAndIncomeListModel.productTypeConditionModels = [{
        builder: {},
        esCode: 'product_sub_type_name',
        esValue: '',
        type: 1,
      }];
    } else {
      saleAndIncomeListModel.transactionBehavior = '';
      saleAndIncomeListModel.productTypeConditionModels = [{
        builder: {},
        esCode: 'transaction_behavior',
        esValue: '',
        type: 1,
      }];
    }
    api(saleAndIncomeListModel).then((response) => {
      const { data = [] } = response;
      setDataList(data);
      setLoading(false);
    }).catch((error) => {
      message.error(error.success ? error.note : error.message);
    });
  };
  return (
    <div style={{ width: '18rem', position: 'relative' }} className={`${styles.filter} m-bss-select-checkbox`}>
      <div className="m-bss-select-dropdown-title">
        <Checkbox className={styles.color} indeterminate={indeterminate} checked={checkAll} onChange={handleCheckAllChange}>全选</Checkbox>
      </div>
      <Divider style={{ margin: 0 }} />
      <Spin spinning={loading}>
        <Scrollbars style={{ height: '16rem' }}>
          {
            dataList.map((item, index) => {
              return (
                <div key={`filter${item.lx}`} style={{ padding: '10px 20px' }}>
                  <Checkbox className={`${styles.options} ${styles.color}`} checked={checkedList.includes(index) ? true : false} onChange={() => { handleCheckBoxChange(index); }}>{item.lx} ({item.count})</Checkbox>
                </div>
              );
            })
          }
        </Scrollbars>
      </Spin>
      <div style={{ padding: '10px 14px', textAlign: 'right', borderTop: '1px solid #EAEEF2' }}>
        <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px' }} onClick={handleClear}>清 空</Button>
        <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={handleOk}>确 定</Button>
      </div>
    </div>
  );
};

export default Filter;