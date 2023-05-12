import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Tree, Input, Row, Col, Button, Empty, Spin } from 'antd';
import { connect } from 'dva';
import { cloneDeep, uniqBy } from 'lodash';
import { treeToFlat } from '../../utils/formatTree';
import { Scrollbars } from 'react-custom-scrollbars';
import EditContent from './editContent';
import styles from './index.less';


/**
 * 编辑标签-计算公式模块
 */
const operatorData = [
  { expsDescr: '+', expsNm: '+', calExpsRsol: '+', calExps: '+', regStr: '\\+', span: 6 },
  { expsDescr: '-', expsNm: '-', calExpsRsol: '-', calExps: '-', regStr: '\\-', span: 6 },
  { expsDescr: '*', expsNm: '×', calExpsRsol: '*', calExps: '*', regStr: '\\*', span: 6 },
  { expsDescr: '/', expsNm: '÷', calExpsRsol: '/', calExps: '/', regStr: '\\÷', span: 6 },
  { expsDescr: '>', expsNm: '>', calExpsRsol: '>', calExps: '>', regStr: '\\>', span: 6 },
  { expsDescr: '>=', expsNm: '≥', calExpsRsol: '>=', calExps: '>=', regStr: '\\>\\=', span: 6 },
  { expsDescr: '<', expsNm: '<', calExpsRsol: '<', calExps: '<', regStr: '\\<', span: 6 },
  { expsDescr: '<=', expsNm: '≤', calExpsRsol: '<=', calExps: '<=', regStr: '\\=\\<', span: 6 },
  { expsDescr: 'max', expsNm: '最大', calExpsRsol: 'max', calExps: 'GREATEST', regStr: '\\GREATEST', span: 12 },
  { expsDescr: 'min', expsNm: '最小', calExpsRsol: 'min', calExps: 'LEAST', regStr: '\\LEAST',span: 12 },
  { expsDescr: 'and', expsNm: '并且', calExpsRsol: ' and ', calExps: 'AND', regStr: '\\AND', span: 12 },
  { expsDescr: 'or', expsNm: '或者', calExpsRsol: ' or ', calExps: 'OR', regStr: '\\OR', span: 12 },
  { expsDescr: '!=', expsNm: '不等于', calExpsRsol: '!=', calExps: '!=', regStr: '\\!\\=', span: 12 },
  { expsDescr: 'when', expsNm: '当', calExpsRsol: ' when ', calExps: 'CASE WHEN THEN ELSE END', regStr: '\\CASE\\sWHEN\\sTHEN\\sELSE\\sEND', span: 12 },
  { expsDescr: 'like', expsNm: '类似', calExpsRsol: ' like ', calExps: 'LIKE \'%\'||||\'%\'', regStr: '\\LIKE\\s\\\'%\\\'\\|\\|\\|\\|\\\'%\\\'', span: 12 },
  { expsDescr: 'in ()', expsNm: '属于', calExpsRsol: ' in () ', calExps: 'IN()', regStr: '\\IN\\(\\)', span: 12 },
];
const { TreeNode } = Tree;
const CalCulation = ({ showWarn,editable, defaultValue = '', loading, calData = [], onChange, handleCalParamsChange }) => {

  const editRef = useRef();
  // const [indiArr, setIndiArr] = useState(calData);
  const [treeData, setTreeData] = useState([]);
  const [searchValue, setSearchValue] = useState('');//Tree搜索值
  const [expandedKeys, setKeys] = useState([]);//Tree展开值
  const [autoExpandParent, setAutoExpandParent] = useState(true);//Tree自动展开


  useEffect(()=> {
    if (searchValue) {
      const newData = [];
      calData.length && calData.forEach(item => {
        const { indiRecords = [] } = item;
        indiRecords.length > 0 && newData.push(...indiRecords);
      });
      setTreeData(newData);
    } else {
      const newData = cloneDeep(calData);
      newData.forEach(item => {
        item.indiCode = item.indiGrp;
        item.indiName = item.indiType;
      });
      setTreeData(newData);
    }
  }, [JSON.stringify(calData), searchValue]);

  const renderTreeNode = (treeData) => {
    return treeData && treeData.map((item, index) => {
      const { indiCode = '', indiName = '', indiRecords = [] } = item;
      if (indiRecords && indiRecords.length > 0) {
        return (
          <TreeNode key={indiCode} title={indiName} value={indiCode} index={index} selectable={false}>
            {renderTreeNode(indiRecords)}
          </TreeNode>
        );
      }
      return <TreeNode key={indiCode} title={indiName} value={indiCode} index={index}/>;
    });
  };

  /********************************** 数据格式化 ********************************/  
  // 构造正则表达式,转义特殊字符$ () {}
  const getRgeStr = (str) => {
    if(!str) return;
    let regStr = '';
    regStr = str.replace(new RegExp('\\$', 'g'), '\\$')
      .replace(new RegExp('\\(', 'g'), '\\(')
      .replace(new RegExp('\\)', 'g'), '\\)')
      .replace(new RegExp('\\{', 'g'), '\\{')
      .replace(new RegExp('\\}', 'g'), '\\}');
    if (regStr.startsWith('\\')) {
      return regStr;
    }
    return `\\${regStr}`;
  };
  // 所有值,构造正则表达式
  const getAllValue = () => {
    let indiData = treeToFlat(calData);
    const regData = [];
    operatorData.forEach((ele) => {
      regData.push(ele);
    });
    let obj; // 遍历生成正则表达式
    indiData.forEach((ele, index) => {
      obj = {
        valStr: `${ele.calExps}`,
        regStr: `${getRgeStr(ele.calExps)}`,
        expsDescr: ele.expsDescr,
      };
      regData.push(obj);
    });
    return regData;
  };

  /********************************** 操作逻辑 ********************************/

  //树型搜索
  const handleSearch = (value) => {
    setSearchValue(value);
    if (typeof handleCalParamsChange === 'function') {
      handleCalParamsChange({ keyWords: value });
    }
  };
  //树型展开
  const onExpand = (expandedKeys) => {
    setKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  // 点击树
  const onSelect = (selectedKeys, info) => {
    // const obj = {};
    // const data = getAllValue();
    const { value, title = '' } = info.node.props;
    // obj.expsDescr = '';
    // data.forEach((item) => {
    //   if (item.valStr === value) {
    //     obj.desc = item.expsDescr;
    //   }
    // });
    // obj.calExps = value;
    // obj.data = data;
    // obj.expsNm = title;
    editRef.current && editRef.current.handleAddElement({ value: title, key: value }, 'select');
  };
  // 按钮点击
  const handClick = (e, item) => {
    e?.preventDefault();
    const { calExps = '', expsDescr = '', expsNm = '' } = item || {};
    // const data = getAllValue();
    // const obj = {
    //   calExps,
    //   desc: expsDescr,
    //   expsNm: expsNm,
    // };
    // obj.data = data;
    editRef.current && editRef.current.handleAddElement({ value: expsNm, key: calExps }, 'btn');
  };

  return (
    <Fragment>
      <EditContent ref={editRef} defaultValue={defaultValue} editable={editable} onChange={onChange} showWarn={showWarn}/>
      <div className={styles['edit-container']}>
        <Spin spinning={loading}>
          <div className={styles['left-container']}>
            <div style={{ padding: '9px 8px 0', lineHeight: '0' }}>
              <Input.Search placeholder="请输入" onSearch={handleSearch} allowClear={true} />
            </div>
            <Scrollbars autoHide className={styles['scroll-container']}>
              {
                treeData.length > 0 ? (
                  <Tree
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={onSelect}
                  >
                    {
                      renderTreeNode(treeData) 
                    }
                  </Tree>
                ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
              }
            </Scrollbars>
          </div>
        </Spin>
        <div className={styles['right-container']}>
          <Row gutter={4}>
            {
              operatorData.map((item, index) => (
                <Col span={item.span}>
                  <Button
                    key={`${index}`}
                    value={item.expsDescr}
                    className={styles['row-btn']}
                    onClick={(e) => handClick(e, item)}
                  >
                    {item.expsNm}
                  </Button>
                </Col>
              ))
            }
          </Row>
        </div>
      </div>
      {/* {
        showWarn && <div style={{ position: 'absolute', bottom: '-31px', color: '#f5222d' }}>计算公式不能为空!</div>
      } */}
      {
        showWarn && <div style={{ height: '2rem', lineHeight: '2rem', color: '#f5222d' }}>计算公式不能为空!</div>
      }
    </Fragment>
  );
};

export default CalCulation;