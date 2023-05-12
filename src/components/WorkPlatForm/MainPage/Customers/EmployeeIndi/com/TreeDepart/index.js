import React, { useState, useEffect } from "react";
import { TreeSelect, Icon } from "antd";
import { treeToFlat } from "../../utils/formatTree";
import styles from "./index.less";

/**
 * 涉及页面  treeSelect 多选
 */

const { TreeNode } = TreeSelect;

const TreeDepart = ({ defaultValue = "", treeData, onChange, style,allSelect }) => {
  //const allData = treeToFlat(treeData).map(item => item.value).filter(item => item !== 'all');//所有下拉数据(每一项的value)
  const [open, setOpen] = useState(false); //下拉菜单展开

  const [status, setStatus] = useState(0); // 0|空  1|非空且非全 2|全
  const [selectKeys, setSelectKeys] = useState(
    defaultValue ? JSON.parse(defaultValue) : []
  );
  /*  useEffect(() => {
    if(allData) {
      if (selectKeys.length === 0 ) {
        setStatus(0);
      } else if ( selectKeys.length < allData.length) {
        setStatus(1);
      } else {
        setStatus(2);
      }
    }
  }, [allData, selectKeys]); */

  /********************************** 渲染区域 ********************************/
  //根据value获取对应的节点
  const getNode = (list, value) => {
    for (let i in list) {
      if (list[i].value === value) {
        return [list[i]];
      }
      if (list[i].children) {
        let node = getNode(list[i].children, value);
        if (node !== undefined) {
          return node;
        }
      }
    }
  };
  //获取选中父节点下的子节点
  const getChildren = (list, childNode = []) => {
    for (let i in list) {
      childNode.push(list[i]);
      if (list[i].children) {
        getChildren(list[i].children, childNode);
      }
    }
    return childNode;
  };
  //获取选中的所有节点
  const getSelectNode = (selectKeys, tree) => {
    const selectNode = selectKeys.map(item => getNode(tree, item));
    const allNode = selectNode.map(item => getChildren(item));
    const allNodeId = [];
    allNode.forEach(item => {
      for (let i in item) {
        allNodeId.push(item[i].value);
      }
    });
    return [...new Set(allNodeId)];
  };
  // 渲染营业部树节点
  const renderTreeNode = treeData => {
    return (
      treeData &&
      treeData.map(item => {
        const { id: yybid = "", children = [], title = "",fid='' } = item;
        const style =
          yybid === "all"
            ? {
                paddingTop: "3px",
                paddingBottom: "4px",
                borderBottom: "1px solid #EBECF2"
              }
            : {};
        if (children && children.length > 0) {
          return (
            <TreeNode id={yybid} title={title} value={yybid} style={style} fid={fid}>
              {renderTreeNode(children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode id={yybid} title={title} value={yybid} style={style} fid={fid} />
        );
      })
    );
  };
  //隐藏 tag 时显示的内容
  const maxTagPlaceholder = () => {
    const allNode = getSelectNode(selectKeys, treeData);
    const len = selectKeys.length;
    return (
      <span style={{ color: "#FF6E30", background: "#fff", border: "none" }}>
        ...等{len-1}项
      </span>
    );
  };
  /********************************** 逻辑操作区域 ********************************/
  // 筛选
  const filterOption = (input, option) => {
    if (
      (option && option.key && option.key.includes(input)) ||
      (option.props && option.props.title && option.props.title.includes(input))
    ) {
      return option.props.value;
    }
  };
  const arrayToTree = (arr, pid) => {
    return arr.reduce((res, current) => {
      if (current['fid'] === pid) {
        current.children = arrayToTree(arr, current['id']);
        return res.concat(current);
      }
      return res;
    }, []);
  };
  const handleChange = (value, _, node) => {
    let newArr = [],
      valueArr = JSON.parse(JSON.stringify(value));

    function getArrToOrigin(data) {
      data.forEach(item => {
        let ar;
        if (!item.node) {
          ar = item.props.fid;
        } else {
          ar = item.node.props.fid;
        }

        while (ar != "root" && !newArr.map(item => item?.id).includes(ar)) {
          allSelect.filter(item => item.id == ar)[0] &&
            newArr.push(allSelect.filter(item => item.id == ar)[0]);
          ar = allSelect.filter(item => item.id == ar)[0].fid;
        }
        if (!item.node) {
          newArr.push({
            fid: item.props.fid,
            id: item.props.id,
            title: item.props.title,
            value: item.props.value
          });
        } else {
          newArr.push({
            fid: item.node.props.fid,
            id: item.node.props.id,
            title: item.node.props.title,
            value: item.node.props.value
          });
        }
        if (item.node && item.children) {
          getArrToOrigin(item.children);
        }
      });
    }
    getArrToOrigin(node.allCheckedNodes)
    /* 
    const filterData = value.filter(item => item !== 'all');
    let newData = value.includes('all') ? allData : filterData;
    if (status === 2 && filterData.length === allData.length ) {
      newData = [];
    }
    if (value.includes('all') || filterData.length === allData.length) {
      setStatus(2);
    } */
    setSelectKeys(value);
    onChange && onChange(value,arrayToTree(newArr,'root'));
  };
  const className = status ? (status === 1 ? "half-select" : "all-select") : "";
  return (
    <div className={styles["tree-container"]}>
      <TreeSelect
        labelInValue={true}
        placeholder="请选择"
        treeCheckable={true}
        //showCheckedStrategy
        // defaultValue={defaultValue.split(',')}
        value={selectKeys}
        style={style && style}
        dropdownStyle={{ maxHeight: 280, overflowY: "auto" }}
        dropdownClassName={`${styles["tree-select"]} ${styles[className]}`}
        //treeDefaultExpandAll //展开全部
        maxTagCount={1}
        maxTagTextLength={6}
        maxTagPlaceholder={() => maxTagPlaceholder()}
        onChange={handleChange}
        filterTreeNode={filterOption}
        onDropdownVisibleChange={status => setOpen(status)}
        getPopupContainer={triggerNode => triggerNode.parentNode}
      >
        {renderTreeNode(treeData)}
      </TreeSelect>
      <Icon
        className={styles["tree-icon"]}
        type="down"
        rotate={open ? "180" : "0"}
        style={{ color: "#4095FF" }}
      />
    </div>
  );
};

export default TreeDepart;
