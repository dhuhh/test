import React, { useState, useEffect, useRef } from "react";
import { TreeSelect } from "antd";
import "./index.css";
import Down from "../../../../../../../assets/newProduct/chance/arrow_down.png";
import Up from "../../../../../../../assets/newProduct/chance/arrow_up.png";
import Close from "../../../../../../../assets/newProduct/chance/close.png";
const { SHOW_ALL, SHOW_PARENT } = TreeSelect;
const NewTreeSelect = React.memo(props => {
  const [value, setValue] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const [isOrigin, setIsOrigin] = useState([]);
  const [isStraff, setIsStraff] = useState(true); //判断下拉框三角图标向上还是向下
  const [treeList, setTreeList] = useState([]); //用于处理客户群和客户标签数据
  const [isValue, setIsValue] = useState(false); //判断是否正在搜索
  const [inputSelect, setInputSelect] = useState("");
  const [baoliu, setBaoliu] = useState([]);
  // const [searchList,setSearchList] = useState([])
  const box = useRef(); //设置ref用于聚焦搜索框
  // const dropdown = useRef()

  const {
    tree,
    minWidth = "250px",
    getRadioSelect,
    type,
    filterTreeNode,
    showAllSel = true,
    isRight = false,
    showValue,
    icClick,
    resetInput
  } = props;
  useEffect(() => {
    showValue === undefined && setValue([]);
    if (type === "productIdList") {
      if (!baoliu.length) {
        let beifen = JSON.parse(JSON.stringify(tree));
        setBaoliu(beifen);
      }
      setIsOrigin(tree);
    }
    if (type == "customerGroupIdList" && tree && tree.length > 0) {
      let newTree = [...tree];
      newTree = newTree.map(item => {
        return {
          title: item.name,
          value: item.name,
          key: `keyNum${item.id}`,
          searchValue: item.id
        };
      });
      setTreeList(newTree);
      setIsOrigin(newTree);
    } else if (type == "tagIdList") {
      let newTree = [...tree];
      newTree = newTree.map(item => {
        return {
          title: item.tag,
          value: item.tag,
          key: `keyNum${item.tagId}`,
          searchValue: item.tagId,
          type: item.type,
          tagFlag: true
        };
      });
      setTreeList(newTree);
      setIsOrigin(newTree);
    }
  }, [showValue, tree]);

  useEffect(() => {
    if (icClick) {
      setInputSelect("");
      resetInput();
      setIsValue(false);
      props.productList && props.productList(baoliu);
    }
  }, [icClick]);

  const treeData = [
    {
      value: "all",
      key: "all",
      title: "全选",
      searchValue: "all",
      id: "allData",
      children: treeList.length !== 0 ? treeList : tree
    }
  ];

  //判断是否展开下拉框
  const onDropdown = open => {
    if (open) {
      setIsStraff(false);
    } else {
      type !== "productIdList" && (setInputSelect(""), setIsValue(false));
      setIsStraff(true);
    }
  };

  const onFilter = value => {
    let selectsNew = [];
    //搜索查询需要保留树形结构，需判断当前元素或其子元素是否存在符合
    const render1 = (data, input) => {
      let flag = false;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.title.indexOf(input) > -1) {
          selectsNew.unshift(item.searchValue);
          flag = true;
        } else if (item.children && item.children.length) {
          if (render1(item.children, input)) {
            selectsNew.unshift(item.searchValue);
            flag = true;
          }
        }
      }
      // setSelects(selectsNew)
      return flag;
    };
    //用于模糊查询，选出对应的数据
    const render2 = (data, newData) => {
      data.forEach(item => {
        if (selectsNew.includes(item.searchValue)) {
          if (item.children && item.children.length) {
            item.children = render2(item.children, []);
          }
          newData.push(item);
        }
      });
      return newData;
    };

    let initData = JSON.parse(JSON.stringify(baoliu));
    if (render1(initData, value)) {
      //  render2(initData,[])
      props.productList(render2(initData, []));
      // setIsOrigin(render2(baoliu,[]))
    }
  };

  //判断是否输入搜索内容
  const onSearch = value => {
    setInputSelect(value);
    if (value) {
      onFilter(value);
      setIsValue(true);
    } else {
      props.productList && props.productList(baoliu);
      setIsValue(false);
    }
  };

  const productTreeList = (list, input) => {
    let productTree = list.map(item => {
      return item.props.title.includes(input) ? item : productTreeList();
    });
    return productTree;
  };

  // 获取父节点下的所有子节点key
  const getCheckedKeys = (triggerNodes, array, valueList) => {
    triggerNodes.forEach(item => {
      array.push(item.props.searchValue);
      valueList.push({
        value: item.props.value,
        label: item.props.title,
        searchValueData: item.props.searchValue
      });
      if (item.props.children.length) {
        getCheckedKeys(item.props.children, array, valueList);
      }
    });
    return { array: array, valueList: valueList };
  };

  //数组去重
  const removedup = (arr, batch) => {
    if (!Array.isArray(arr)) {
      return arr;
    }
    if (arr.length == 0) {
      return [];
    }
    let obj = {};
    let uniqueArr = arr.reduce(function(total, item) {
      obj[item[batch]] ? "" : (obj[item[batch]] = true && total.push(item));
      return total;
    }, []);
    return uniqueArr;
  };

  const sure = (arr1, arr2) => {
    let data = [];
    arr1.map((el, index) => {
      if (!arr2.find(item => item.value == el.value)) {
        data.push(arr1[index]);
      }
    });
    return data;
  };

  const getSearchdata = arr => {
    let searchList = [];
    arr.map(item => {
      searchList.push(item.searchValueData);
    });
    return searchList;
  };

  const exist = (arr, str) => {
    let onFil = arr.filter(item => {
      return item.value === str;
    });
    return onFil.length > 0;
  };

  const getPopupContainer = () => {
    return document.getElementsByClassName("ant-tabs-line")[1];
  };

  const onClose = event => {
    getRadioSelect(type, []);
    setValue([]);
    setIsAll(false);
    event.stopPropagation();
  };

  //用于选中取消下拉框中的内容
  const onChange = (newValue, _, node) => {
    //判断是否点击全选
    if (newValue.includes("all") || exist(newValue, "all")) {
      setIsAll(true);
    } else {
      setIsAll(false);
    }
    let searchValue = [],
      activityTag = [],
      companyTag = [],
      staffTag = [];
    if (node?.allCheckedNodes) {
      let upList =
        type === "productIdList" ? [node.triggerNode] : node?.allCheckedNodes;
      searchValue = upList.map(item => {
        if (item?.node?.props?.tagFlag || item?.props?.tagFlag) {
          //客户标签内容判断 1为活动标签 2为公司标签
          let caseKey = item.node ? item.node.props?.type : item.props.type;
          switch (caseKey) {
            case 1:
              activityTag.push(
                item.node
                  ? item.node.props?.searchValue
                  : item.props.searchValue
              );
              break;
            case 2:
              companyTag.push(
                item.node
                  ? item.node.props?.searchValue
                  : item.props.searchValue
              );
              break;
            case 3:
              staffTag.push(
                item.node
                  ? item.node.props?.searchValue
                  : item.props.searchValue
              );
              break;
            default:
          }
        } else {
          if (type === "productIdList") {
            //当为增值产品时
            let newValue = [...value];
            let search;
            let flag = false;
            node.triggerValue == "all" &&
              newValue.length === props.productLength + 1 &&
              !node.hasOwnProperty("checked") &&
              (flag = true);
            let mapList = getCheckedKeys([node.triggerNode], [], []).valueList;
            if (
              exist(newValue, node.triggerValue) &&
              node.triggerNode.props.children.length > 0 &&
              !flag
            ) {
              //当前点击节点已经选中且有子节点
              let inputValue = sure(newValue, mapList);
              search = getSearchdata(inputValue);
              if (search.indexOf("all") > -1) {
                // search.splice(search.indexOf(undefined),1);
                inputValue = sure(inputValue, [
                  { value: "all", label: "全选", searchValueData: "all" }
                ]);
                search = getSearchdata(inputValue);
                setIsAll(false);
              }
              setValue(inputValue);
            } else if (
              !exist(newValue, node.triggerValue) &&
              node.triggerNode.props.children.length > 0
            ) {
              let catchArr = newValue.concat(mapList);
              let value = removedup(catchArr, "value");
              setValue(value);
              search = getSearchdata(value);
              console.log(
                search.length,
                props.productLength,
                search.indexOf("all")
              );
              props.productLength === search.length &&
                search.indexOf("all") === -1 &&
                (setIsAll(true),
                setValue(
                  [
                    { value: "all", label: "全选", searchValueData: "all" }
                  ].concat(value)
                ));
            } else if (
              (exist(newValue, node.triggerValue) &&
                node.triggerNode.props.children.length === 0) ||
              flag
            ) {
              if (flag) {
                mapList = getCheckedKeys(
                  [node.allCheckedNodes[node.allCheckedNodes.length - 1]],
                  [],
                  []
                ).valueList;
              }
              let inputValue = sure(newValue, mapList);
              search = getSearchdata(inputValue);
              if (search.indexOf("all") > -1) {
                // search.splice(search.indexOf(undefined),1);
                inputValue = sure(inputValue, [
                  { value: "all", label: "全选", searchValueData: "all" }
                ]);
                search = getSearchdata(inputValue);
                setIsAll(false);
              }
              setValue(inputValue);
            } else {
              let value = [
                ...newValue,
                {
                  value: node.triggerNode.props.value,
                  label: node.triggerNode.props.title,
                  searchValueData: node.triggerNode.props.searchValue
                }
              ];
              setValue(value);
              search = getSearchdata(value);
              console.log(
                search.length,
                props.productLength,
                search.indexOf("all"),
                "2660"
              );
              props.productLength === search.length &&
                search.indexOf("all") === -1 &&
                (setIsAll(true),
                setValue(
                  [
                    { value: "all", label: "全选", searchValueData: "all" }
                  ].concat(value)
                ));
            }
            // console.log(search,'search');
            return (props.productLength === search.length &&
              search.indexOf("all") === -1) ||
              search.indexOf("all") > -1
              ? []
              : search;
          }
          return item.node
            ? item.node.props.searchValue
            : item.props.searchValue; //选中后删除时内部node不存在，需判断
        }
      });
      searchValue =
        type === "tagIdList"
          ? { activityTag, companyTag, staffTag }
          : searchValue;
      box.current.focus();
    }
    if (type !== "productIdList" || newValue.length === 0) {
      setValue(newValue);
      type === "productIdList" && props.productList(baoliu);
    }
    getRadioSelect(type, searchValue);
  };

  //选中数量超出部分展示
  const chance = value => {
    return type === "productIdList" && isAll ? (
      <span
        style={{ position: "relative", display: "inline-block", width: "46px" }}
      >
        <img
          alt=""
          className="closePro"
          onClick={onClose}
          src={Close}
          style={{
            marginLeft: "12px",
            position: "absolute",
            right: 0,
            width: "12px",
            top: "4px"
          }}
        />
        全部
      </span>
    ) : (
      <span style={{ fontWeight: 400, color: "#FF6E30" }}>
        ...等{3 + value.length}项
      </span>
    );
  };
  const tProps = {
    treeData:
      showAllSel && !isValue
        ? treeData
        : treeList.length !== 0
        ? treeList
        : tree,
    value: value,
    onChange,
    onSearch,
    getPopupContainer,
    // filterTreeNode:false,
    treeCheckable: true,
    treeDefaultExpandAll: true,
    showCheckedStrategy: isAll ? SHOW_PARENT : SHOW_ALL,
    dropdownMatchSelectWidth: type !== "productIdList" ? true : false,
    searchValue: inputSelect,
    autoClearSearchValue: false,
    dropdownStyle: {
      maxHeight: "289px",
      overflowY: "auto",
      maxWidth: "600px",
      minWidth: "150px",
      zIndex: "2"
    },
    placeholder: "请选择",
    allowClear: true,
    treeCheckStrictly: type === "productIdList",
    treeNodeFilterProp: "title",
    // ref:dropdown,
    maxTagTextLength: 1,
    // showArrow: true,
    dropdownClassName: `${!isValue ? "allTree" : ""} ${
      isRight ? "speedToRig" : ""
    } ${
      showAllSel
        ? type === "tagIdList" && isValue
          ? "allInRig"
          : "allInLef"
        : "allInRig"
    } ${type === "productIdList" ? type : "cantProduct"}`
  };
  return (
    <div
      id="down"
      style={{
        display: "inline-block",
        position: "relative",
        verticalAlign: "super"
      }}
    >
      <TreeSelect
        size="small"
        ref={box}
        className={`newTreeSelect ${type} ${isAll ? "allSele" : ""}`}
        filterTreeNode={filterTreeNode}
        onDropdownVisibleChange={onDropdown}
        maxTagPlaceholder={chance}
        style={{
          minWidth: minWidth,
          verticalAlign: "revert",
          borderRadius: "2px"
        }}
        maxTagCount={type === "productIdList" && isAll ? 0 : 3}
        {...tProps}
      />
      <img
        src={isStraff ? Down : Up}
        alt=""
        style={{
          position: "absolute",
          width: "16px",
          top: "17px",
          right: "10px"
        }}
      />
    </div>
  );
});
export default NewTreeSelect;
