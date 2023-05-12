import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import {
  Tabs,
  Menu,
  Icon,
  Select,
  Button,
  Modal,
  TreeSelect,
  Input,
  message
} from "antd";
import styles from "./index.less";
import { useState } from "react";
import { func } from "prop-types";
import EmployeeIndi from "../EmployeeIndi/index"; //引入员工指标组件
import CustomerIndicators from "../CustomerIndicators/index"; //引入客户指标组件
import getIcon from "../../../../../assets/customer/CYC.png";
import getBlueIcon from "../../../../../assets/customer/blueCYC.png";
import isDown from "../../../../../assets/customer/isDown1.png";
import isUp from "../../../../../assets/customer/isUp1.png";
import isRightBlue from "../../../../../assets/customer/isRightBlue1.png";
import isRight from "../../../../../assets/customer/isRight1.png";
import editCustomer from "../../../../../assets/customer/editCustomer1.png";
import cuzzy from "../../../../../assets/customer/cuzzy.png";
import SuperSelect from "../SupperSelect";
import Down from "../../../../../assets/newProduct/chance/arrow_down.png";
import Up from "../../../../../assets/newProduct/chance/arrow_up.png";
import { FetchMenu } from "../../../../../services/amslb/user";
import {
  getTagTreeList,
  getDetail,
  getTagType,
  changeTag,
  saveEdit,
  getResponse,
  getValidationResp,
  deleteType,
  editType,
  addType
} from "../../../../../services/customer/customerTag";
import { fetchUserAuthorityDepartmentType } from "$services/commonbase/userAuthorityDepartment";
import { FetchExcStaffListCus } from "../../../../../services/incidentialServices";
const { Option } = Select;
const { TabPane } = Tabs;
const { SubMenu } = Menu;
const odd = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

const CustomerTags = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    changeTabs,
    state
  }));
  const [state, setState] = useState({
    tabList: [],
    selectedKeys: [],
    openKeys: [],
    activeKey: "1",
    tagType: "上架",
    maxMarginLeft: 0,
    // editVisible: false,
    value: [],
    detailList: {},
    editList: {},
    resetEdit: {}, //备份
    editTree: [],
    treeIsOpen: false,
    belongType: "",
    selectBelong: ""
  });
  const { TextArea } = Input;
  const [modalList, setModalList] = useState([]);
  const [allSelect, setAllSelect] = useState([]);
  const [editAllTree, setEditAllTree] = useState([]);
  const [editAllTreeInList, setEditAllTreeInList] = useState([]);
  const [editAllTreeType, setEditAllTreeType] = useState([]);
  const [editAllTreeDevp, setEditAllTreeDevp] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isErrorType, setIsErrorType] = useState("");
  const [hasRespon, setHasRespon] = useState(false);
  const [baoliu, setBaoliu] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [selectItem, setSelectItem] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [enter, setEnter] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [editModal, setEditModal] = useState("");
  const [visDel, setVisDel] = useState(false);
  const [delInModal, setDelInModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  useEffect(() => {
    getTagTreeList({
      tagState: state.tagType,
      searchField: props.value
    })
      .then(res => {
        // getDetail({
        //     tagId: res.records[0]?.children[0]?.originTagId,
        //     tagType: res.records[0]?.children[0]?.tagType
        // }).then((result) => {
        //     FetchExcStaffList({
        //         cxlx: '2',
        //         yyb: result.records[0].orgId,
        //         zt: '0',
        //     }).then((res) => {
        //         // editAllTree['allRequireMen'] = res.records
        //         console.log(res.records,'12333');
        //         setEditAllTree(res.records)
        //     })

        //     getTagType({}).then((res)=>{
        //         console.log(res,'999999');
        //         // editAllTree['tagType'] = res.records
        //         console.log(res.records,'45666');
        //         setEditAllTreeType(res.records)
        //     })

        //     fetchUserAuthorityDepartment({}).then((res)=>{
        //         console.log(res,'abcdefg');
        //         console.log(res.records,'78999');
        //         setEditAllTreeDevp(res.records)
        //     })

        // })
        setState({
          ...state,
          tabList: res.records
          // belongType:res.records[0]?.children[0]?.tagType,
          // selectedKeys: [res.records[0]?.children[0]?.originTagId],
          // openKeys: [res.records[0]?.tagType],
          // detailList: result.records[0],
          // value:result.records[0].tagApplyData,
        });
      })
      .catch(err => {
        console.log(err, "不会错");
      });

    getResponse({}).then(res => {
      if (res.records[0].result == "是") {
        setHasRespon(true);
      } else {
        setHasRespon(false);
      }
    });
  }, []);

  useEffect(() => {
    if (Object.keys(props.choic).length !== 0) {
      setState({
        ...state,
        selectedKeys: [props.choic.originTagId]
      });
      menuClick(props.choic, true);
      setSelectItem(props.choic.originTagId);
    }
  }, [props.choic]);

  useEffect(() => {
    console.log(
      document.getElementById("menuItem" + props.choic.originTagId),
      "为什么测试不跳转aaa"
    );
    if (document.getElementById("menuItem" + props.choic.originTagId)) {
      console.log("");
      scrollToAnchor("menuItem" + props.choic.originTagId);
    }
  }, [document.getElementById("menuItem" + props.choic.originTagId)]);

  const open = open => {
    // console.log(open,'open',open.pop());
    setState({
      ...state,
      openKeys: open
    });
  };
  //上下架切换
  const triaggit = type => {
    changeTag({
      tagType: state.belongType,
      tagId: state.selectedKeys[0],
      tagState: type
    }).then(res => {
      getNew();
    });
  };
  const changeTabs = val => {
    setState({
      ...state,
      activeKey: val
    });
  };
  //刷新全部页面数据
  const getNew = () => {
    getTagTreeList({
      tagState: state.tagType,
      searchField: props.value
    })
      .then(res => {
        getDetail({
          tagId: state.selectedKeys[0],
          tagType: state.belongType
        }).then(result => {
          FetchExcStaffListCus({
            cxlx: "2",
            yyb: "", //result.records[0].orgId
            zt: "0"
          }).then(res => {
            setEditAllTree(res.records);
            setEditAllTreeInList(res.records);
          });

          getTagType({}).then(res => {
            setEditAllTreeType(res.records);
          });

          fetchUserAuthorityDepartmentType({}).then(res => {
            setEditAllTreeDevp(res.records);
          });
          setState({
            ...state,
            tabList: res.records,
            detailList: result.records[0],
            value: result.records[0].tagApplyData
              ? JSON.parse(result.records[0].tagApplyData)
              : result.records[0].tagApplyData
          });
        });
      })
      .catch(err => {
        console.log(err, "不会错");
      });
  };

  const getChildList = (arrList, list) => {
    arrList.map(item => {
      list.push({
        label: item.props.title,
        value: item.props.value
      });
      if (item?.props?.children?.length > 0) {
        getChildList(item.props.children, list);
      }
    });
  };

  const getSearchList = (arrList, list) => {
    arrList.map(item => {
      list.push({
        label: item.title,
        value: item.value
      });
      if (item?.children?.length > 0) {
        getChildList(item.children, list);
      }
    });
  };

  const onChange = (newValue, _, node) => {
    if (!node.hasOwnProperty("allCheckedNodes")) {
      setState({
        ...state,
        value: [],
        editTree: []
      });
      return;
    }
    let newArr = [],
      valueArr = JSON.parse(JSON.stringify(newValue));
    // if(node.checked == true){
    //     let arr = []
    //     getChildList(node.triggerNode.props.children,arr)
    //     valueArr = valueArr.concat(arr)
    //     // while(){

    //     // }
    // }else if(node.checked == false){
    //    if(node.triggerNode.props.children.length>0){
    //     let arr = []
    //     getChildList(node.triggerNode.props.children,arr);
    //    let upArr =  arr.map((item)=>{
    //        return item.value
    //     })
    //     valueArr = valueArr.filter(item=>!upArr.includes(item.value));
    //     console.log(valueArr,'valueArr',upArr);
    //    }
    // }
    function getArrToOrigin(data) {
      data.forEach(item => {
        console.log(item, item.node);
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
        } else if (!item.node && item.props.children.length > 0) {
          getArrToOrigin(item.props.children);
        }
      });
    }

    getArrToOrigin(node.allCheckedNodes);
    setState({
      ...state,
      value: valueArr,
      editTree: arrayToTree(newArr, "root")
    });
  };

  const menuClick = (item, isChico) => {
    let tagTypeSend, tagIdSend, sendSelect;
    if (isChico) {
      tagTypeSend = item.tagType;
      tagIdSend = item.originTagId;
      sendSelect = [item.originTagId];
    } else {
      tagTypeSend = item.item.props.subMenuKey.split("-menu-")[0];
      tagIdSend = item.key;
      sendSelect = [item?.key];
      props.getProps();
    }
    // console.log(item.item.props.subMenuKey.split('-menu-')[0]);
    // if(tagTypeSend=='个人标签'){
    //     setState({
    //         ...state,
    //         belongType:tagTypeSend,
    //         detailList: {},
    //         selectedKeys: sendSelect,
    //         selectBelong:tagTypeSend,
    //         openKeys:isChico?[...state.openKeys,tagTypeSend]:[...state.openKeys]
    //     })
    // }else{
    getDetail({
      tagId: tagIdSend,
      tagType: tagTypeSend
    }).then(result => {
      FetchExcStaffListCus({
        cxlx: "2",
        yyb: "", //result.records[0].orgId
        zt: "0"
      }).then(res => {
        // editAllTree['allRequireMen'] = res.records
        setEditAllTree(res.records);
        setEditAllTreeInList(res.records);
      });

      getTagType({}).then(res => {
        // editAllTree['tagType'] = res.records
        setEditAllTreeType(res.records);
      });

      fetchUserAuthorityDepartmentType({}).then(res => {
        setEditAllTreeDevp(res.records);
      });
      // if(!Array.isArray(result.records[0].tagApplyData)){
      //     console.log(result.records[0].tagApplyData,'result.records[0].tagApplyData');
      // }
      setState({
        ...state,
        belongType: tagTypeSend,
        detailList: result.records[0],
        value: result.records[0].tagApplyData
          ? JSON.parse(result.records[0].tagApplyData)
          : result.records[0].tagApplyData,
        selectedKeys: sendSelect,
        selectBelong: tagTypeSend,
        openKeys:
          isChico && !state.openKeys.includes(props.choic.tagType)
            ? [...state.openKeys, tagTypeSend]
            : [...state.openKeys]
      });
    });
    // }
    //调用接口，获取右侧页面中的数据
  };
  //跳转至选中节点
  const scrollToAnchor = anchorName => {
    console.log("会不会进这个跳转节点方法", anchorName);
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      console.log(anchorElement, "anchorElement");
      if (anchorElement) {
        setTimeout(() => {
          anchorElement.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  };

  const arrayToTree = (arr, pid) => {
    return arr.reduce((res, current) => {
      if (current["fid"] === pid) {
        current.children = arrayToTree(arr, current["id"]);
        return res.concat(current);
      }
      return res;
    }, []);
  };

  const subOrMen = list => {
    let returnRes = list.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu
            key={item.tagType}
            // onOpenChange={open}
            className={styles.subTitle}
            // className='wsnbb'
            title={
              <span>
                {/* <Icon type="setting" /> */}
                <img
                  src={
                    state.openKeys.indexOf(item.tagType) > -1 ? isDown : isUp
                  }
                  style={{ width: "16px", marginTop: "-4px" }}
                />
                <span>{item.tagType}</span>
              </span>
            }
          >
            {subOrMen(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={item.originTagId}
            onClick={menuClick}
            id={"menuItem" + item.originTagId}
          >
            <span title={getTextWith(item.tagName) > 208 ? item.tagName : null}>
              {item.tagName}
            </span>
            <img
              src={
                state.selectedKeys[0] == item.originTagId
                  ? isRightBlue
                  : isRight
              }
              style={{ width: "16px", marginTop: "-2px" }}
            />
          </Menu.Item>
        );
      }
    });
    return returnRes;
  };

  function asideMenu() {
    return (
      <Menu
        // onClick={this.handleClick}
        style={{ width: 283, border: "none" }}
        selectedKeys={state.selectedKeys}
        openKeys={state.openKeys}
        onOpenChange={open}
        mode="inline"
      >
        {state.tabList.map(item => {
          return (
            <SubMenu
              key={item.tagType}
              // onOpenChange={open}
              className={styles.subTitle}
              // className='wsnbb'
              title={
                <span>
                  {/* <Icon type="setting" /> */}
                  <img
                    src={
                      state.openKeys.indexOf(item.tagType) > -1 ? isDown : isUp
                    }
                    style={{ marginTop: "-4px", width: "16px" }}
                  />
                  <span>{item.tagType}</span>
                </span>
              }
            >
              {subOrMen(item.children)
              // item.children.map((itemChild) => {
              //     return (
              //         <Menu.Item key={itemChild.originTagId} onClick={menuClick}>{itemChild.tagName}<img src={state.selectedKeys[0] == itemChild.tagType ? isRightBlue : isRight} /></Menu.Item>
              //     )
              // })
              }
            </SubMenu>
          );
        })}
      </Menu>
    );
  }

  function handleChange(value) {
    props.getType(value);
    getTagTreeList({
      tagState: value,
      searchField: props.value
    }).then(res => {
      setState({
        ...state,
        tagType: value,
        tabList: res.records
      });
    });
  }

  function getTextWith(text, fontStyle) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = fontStyle || "14px  PingFangSC-Regular, PingFang SC"; // 设置字体样式，当然，也可以在这里给一个默认值
    var dimension = context.measureText(text);
    return dimension.width;
  }
  //数据转成树结构
  // function buildTree(fid, id, root, resultRoot) {
  //     // 根节点
  //     let timestamp = Date.now();
  //     if (resultRoot['fid'] === undefined) {
  //         resultRoot['fid'] = fid
  //         resultRoot['id'] = 'root'
  //         resultRoot['value'] = 'root'
  //         resultRoot['title'] = 'root'
  //         resultRoot['children'] = []
  //         if (root['menu'] !== undefined) {
  //             for (let i = 0; i < root['menu']['item'].length; i++) {
  //                 buildTree(resultRoot['id'], root['menu']['item'][i], root['menu']['item'][i], resultRoot)
  //             }
  //         }
  //     } else {
  //         let result = {
  //             fid: fid,
  //             id: fid + "-" + root['title'][0]['text'],
  //             value: fid + "-" + root['title'][0]['text'],
  //             title: root['title'][0]['text'],
  //             children: []
  //         }
  //         resultRoot['children'].push(result)
  //         if (root['menu'] !== undefined) {
  //             for (let i = 0; i < root['menu']['item'].length; i++) {
  //                 buildTree(result['id'], root['menu']['item'][i], root['menu']['item'][i], result)
  //             }
  //         }
  //     }
  // }

  function buildTree(fid, id, root, resultRoot) {
    // 根节点
    if (resultRoot["fid"] === undefined) {
      resultRoot["fid"] = fid;
      resultRoot["id"] = "root";
      resultRoot["value"] = "root";
      resultRoot["title"] = "root";
      resultRoot["children"] = [];
      let idIndexMap = {};
      if (root["menu"] !== undefined) {
        for (let i = 0; i < root["menu"]["item"].length; i++) {
          buildTree(
            resultRoot["id"],
            root["menu"]["item"][i],
            root["menu"]["item"][i],
            resultRoot
          );
          if (idIndexMap[resultRoot["children"][i]["id"]] === undefined) {
            idIndexMap[resultRoot["children"][i]["id"]] = [i];
          } else {
            idIndexMap[resultRoot["children"][i]["id"]].push(i);
          }
        }
        let offset = 0;
        for (let key in idIndexMap) {
          if (idIndexMap[key].length > 1) {
            for (let j = 1; j < idIndexMap[key].length; j++) {
              if (
                resultRoot["children"][idIndexMap[key][j] - offset] ===
                undefined
              ) {
                continue;
              }
              // 如果第0个为空数组
              if (
                resultRoot["children"][idIndexMap[key][0] - offset] ===
                undefined
              ) {
                resultRoot["children"][idIndexMap[key][0] - offset] =
                  resultRoot["children"][idIndexMap[key][j] - offset];
              } else {
                resultRoot["children"][idIndexMap[key][0] - offset][
                  "children"
                ] = resultRoot["children"][idIndexMap[key][0] - offset][
                  "children"
                ].concat(
                  resultRoot["children"][idIndexMap[key][j] - offset][
                    "children"
                  ]
                );
              }
              resultRoot["children"].splice(idIndexMap[key][j] - offset, 1);
              offset++;
            }
          }
        }
      }
    } else {
      let result = {
        fid: fid,
        id: fid + "-" + root["title"][0]["text"],
        value: fid + "-" + root["title"][0]["text"],
        title: root["title"][0]["text"],
        children: []
      };
      resultRoot["children"].push(result);
      let idIndexMap = {};
      if (root["menu"] !== undefined) {
        for (let i = 0; i < root["menu"]["item"].length; i++) {
          buildTree(
            result["id"],
            root["menu"]["item"][i],
            root["menu"]["item"][i],
            result
          );
          if (idIndexMap[result["children"][i]["id"]] === undefined) {
            idIndexMap[result["children"][i]["id"]] = [i];
          } else {
            idIndexMap[result["children"][i]["id"]].push(i);
          }
        }
        let offset = 0;
        for (let key in idIndexMap) {
          if (idIndexMap[key].length > 1) {
            for (let j = 1; j < idIndexMap[key].length; j++) {
              if (
                result["children"][idIndexMap[key][j] - offset] === undefined
              ) {
                continue;
              }
              // 如果第0个为空数组
              if (
                result["children"][idIndexMap[key][0] - offset] === undefined
              ) {
                result["children"][idIndexMap[key][0] - offset] =
                  result["children"][idIndexMap[key][j] - offset];
              } else {
                result["children"][idIndexMap[key][0] - offset][
                  "children"
                ] = result["children"][idIndexMap[key][0] - offset][
                  "children"
                ].concat(
                  result["children"][idIndexMap[key][j] - offset]["children"]
                );
              }
              result["children"].splice(idIndexMap[key][j] - offset, 1);
              offset++;
            }
          }
        }
      }
    }
  }

  //获取当前轮次数据最大值
  const getLarge = (items, leave, parent) => {
    let maxLength = 0,
      solit = [],
      filInList = [];
    if (leave) {
      items.map(item => {
        maxLength = Math.max(maxLength, getTextWith(item.title) + 12);
      });
    } else {
      parent.map((item, index) => {
        let fliList =
          item?.children &&
          item.children.filter(itemChild => {
            return itemChild?.children && itemChild?.children.length > 0;
          });
        // &&filInList.concat(fliList)
        if (fliList && fliList.length > 0) {
          filInList = [...filInList, ...fliList];
        }
        filInList.map(fItem => {
          maxLength = Math.max(maxLength, getTextWith(fItem.title) + 12);
        });
      });
    }
    return maxLength;
  };

  //获取上边超出部分值
  const getSize = (items, leaver) => {
    let top = 0;
    items.map((item, index) => {
      if (index == 0) {
        top =
          item.children && item.children.length > 0
            ? item.children[0]?.children &&
              item.children[0]?.children.length > 0
              ? ((item.children.length - 1) * 28 +
                  (item.children.length - 2) * 8 +
                  getSize(item.children[0]?.children) * 2 +
                  16) /
                  2 -
                14
              : (item.children.length * 28 + (item.children.length - 1) * 8) /
                  2 -
                14
            : 0;
      }
    });
    if (leaver) {
      if (
        items[0]?.children[0]?.children &&
        items[0]?.children[0]?.children.length > 0
      ) {
        // console.log('执行这个');
        // top = top + (items[0]?.children[0]?.children.length * 28 + (items[0]?.children[0]?.children.length - 1) * 8) / 2
        let threeLength = 0;
        let list = 0;
        let arr = items[0]?.children.filter(item => {
          return item.children.length > 0;
        });
        arr.map(item => {
          threeLength = threeLength + (item.children.length - 1) * 36;
          //  if(item.children.length>1){
          list = list + item.children.length;
          //  }
        });
        threeLength = threeLength + arr.length * 8;
        top = top + threeLength / 2;
        if (
          items[0]?.children[items[0]?.children.length - 1]?.children &&
          items[0]?.children[items[0]?.children.length - 1]?.children.length > 0
        ) {
          top = top + 6;
        } else {
          top = top + 10;
        }
      } else if (
        items[0]?.children[0]?.children &&
        items[0]?.children[0]?.children.length == 0
      ) {
        let threeLength = 0;
        let arr = items[0]?.children.filter(item => {
          return item.children.length > 0;
        });
        arr.map(item => {
          threeLength = threeLength + (item.children.length - 1) * 36;
        });
        threeLength = threeLength + arr.length * 8;
        top = top + threeLength / 2;
      }
    }
    return top;
  };
  // 获取树形节点的最深层级
  const getMaxFloor = treeData => {
    let max = 0;
    function each(data, floor) {
      data.forEach(e => {
        e.floor = floor;
        if (floor > max) {
          max = floor;
        }
        if (e.children.length > 0) {
          each(e.children, floor + 1);
        }
      });
    }
    each(treeData, 1);
    return max;
  };

  const mapList = (list, k) => {
    list.map(item => {
      if (item.children.length > 1) {
        k.a = k.a + 1;
        item.children.map(child => {
          mapList(child.children, k);
        });
      }
      if (item.children.length == 1) {
        mapList(item.children[0].children, k);
      }
    });
    return k;
  };

  //上边区域超出部分
  const getTop = (items, leaver) => {
    let top = 0;
    let t = { a: 0 };
    function getTopSize(list) {
      // if(getMaxFloor([items[0]])>2&&getMaxFloor(list)==1&&list.length>1){
      //    top = top - 8
      // }
      if (items[0].id == list[0]?.fid && getMaxFloor([items[0]]) >= 4) {
        if (
          getMaxFloor([items[0].children[0]]) == 3 &&
          getMaxFloor([items[0].children[0].children[0]]) == 2
        ) {
          t.a = t.a - 4;
        }
        if (
          getMaxFloor([items[0].children[0]]) == 3 &&
          getMaxFloor([items[0].children[0].children[0]]) != 2
        ) {
          t.a = t.a - 3;
        }
        //    t = getMaxFloor([items[0]]) - 2
        items[0].children
          .filter(itemChild => itemChild.children.length > 0)
          .map(aItem => {
            if (aItem.children.length > 1) {
              t.a = t.a + 1;
              aItem.children.map(s => {
                mapList(s.children, t);
              });
              if (aItem.children.length == 1) {
                mapList(aItem.children[0].children, t);
              }
            }
          });
      }
      list.map((item, index) => {
        if (item?.children && item?.children?.length > 1) {
          top = top + 8;
          getTopSize(item.children);
        } else if (item?.children && item?.children?.length == 1) {
          getTopSize(item.children);
        } else {
          top = top + 36;
          // if(leaver&&items.length==1){
          //     console.log(getMaxFloor(items));
          //     t = getMaxFloor(items)-2
          // //    let up = items[0].children[0]
          // //    t = 0
          // //    while(up.children.length>1){
          // //     //   top = top -8
          // //       up = up.children[up.children.length-1]
          // //       t = t+1
          // //    }
          // }
        }
      });
    }
    getTopSize(items[0].children);
    top = top - 8 * t.a;
    return top == 0 ? 0 : (top - 36) / 2;
  };
  //下面超出
  const getSizeBot = items => {
    let bottom = 0;
    function getBottomSize(list) {
      // if(getMaxFloor([items[items.length-1]])>2&&getMaxFloor(list)==1&&list.length>1){
      //     bottom = bottom - 8
      //  }
      list.map(item => {
        if (item?.children && item?.children?.length > 1) {
          bottom = bottom + 8;
          getBottomSize(item.children);
        } else if (item?.children && item?.children?.length == 1) {
          getBottomSize(item.children);
        } else {
          bottom = bottom + 36;
        }
      });
    }

    getBottomSize(items[items.length - 1].children);
    // if(items[items.length-1].children&&items[items.length-1].children.length>1){
    //    bottom = bottom-8
    // }
    // if(getMaxFloor([items[items.length-1]])>2){
    //     bottom = bottom - 8*(getMaxFloor([items[items.length-1]])-2)
    // }

    return bottom == 0 ? bottom : (bottom - 36) / 2 - 1;
  };

  //获取上边超出部分值
  const getSizeBottom = (items, leaver) => {
    let bottom = 0;
    items.map((item, index) => {
      if (index == items.length - 1) {
        bottom =
          item.children && item.children.length > 0
            ? item.children[item.children.length - 1]?.children &&
              item.children[item.children.length - 1]?.children.length > 0
              ? ((item.children.length - 1) * 28 +
                  (item.children.length - 2) * 8 +
                  getSizeBottom(
                    item.children[item.children.length - 1]?.children
                  ) *
                    2 +
                  16) /
                  2 -
                14
              : (item.children.length * 28 + (item.children.length - 1) * 8) /
                  2 -
                14
            : 0;
      }
    });
    bottom = bottom - 1;
    if (leaver) {
      if (
        items[items.length - 1]?.children[
          items[items.length - 1]?.children.length - 1
        ]?.children &&
        items[items.length - 1]?.children[
          items[items.length - 1]?.children.length - 1
        ]?.children.length > 0
      ) {
        // bottom = bottom + (items[items.length - 1]?.children[items[items.length - 1]?.children.length - 1]?.children.length * 28 + (items[items.length - 1]?.children[items[items.length - 1]?.children.length - 1]?.children.length - 1) * 8) / 2 - 5
        let threeLength = 0;
        let arr = items[items.length - 1]?.children.filter(item => {
          return item.children.length > 0;
        });
        arr.map(item => {
          threeLength = threeLength + (item.children.length - 1) * 36;
        });
        threeLength = threeLength + arr.length * 8;
        bottom = bottom + threeLength / 2 + 7;
      } else if (
        !items[items.length - 1].children ||
        items[items.length - 1].children.length == 0
      ) {
        bottom = bottom - 9;
      } else if (
        items[items.length - 1]?.children[
          items[items.length - 1].children.length - 1
        ].children &&
        items[items.length - 1]?.children[
          items[items.length - 1].children.length - 1
        ].children.length == 0
      ) {
        let threeLength = 0;
        let arr = items[items.length - 1]?.children.filter(item => {
          return item.children.length > 0;
        });
        arr.map(item => {
          threeLength = threeLength + (item.children.length - 1) * 36;
        });
        threeLength = threeLength + arr.length * 8;
        bottom = bottom + threeLength / 2;
      }
    }
    return bottom;
  };

  function callback(key) {
    !key && props.history.push("/customer/enquire");
    key &&
      setState({
        ...state,
        activeKey: key
      });
  }

  const tagUser = (list, leaver, getLeft) => {
    return list.map((item, index) => {
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: `${leaver ? "18px" : ""}`
          }}
          className="tagTitle"
          key={index + "item.title"}
        >
          {item?.children?.length > 0 && (
            <span
              style={{
                height: "28px",
                lineHeight: "28px",
                background: "#F2F3F7",
                borderRadius: "2px",
                padding: "0 6px",
                fontWeight: "400",
                position: `${!leaver ? "relative" : "unset"}`
              }}
            >
              {item.title}
              {!leaver && (
                <li
                  style={{
                    position: "absolute",
                    height: "1px",
                    display: `${
                      index == list.length - 1 || index == 0 ? "none" : "block"
                    }`,
                    width: "35px",
                    left: "-35px",
                    top: "14px",
                    background: "#EAECF2"
                  }}
                ></li>
              )}
            </span>
          )}

          {item?.children?.length > 0 ? (
            <ul
              style={{
                display: "inline-block",
                marginLeft: `${
                  !leaver ? getLeft - getTextWith(item.title) - 12 + 60 : 60
                }px`
              }}
              className="adCarry"
            >
              <li
                style={{
                  position: "absolute",
                  height: "1px",
                  width: `${
                    !leaver ? getLeft - getTextWith(item.title) - 12 + 25 : 25
                  }px`,
                  borderTop: "1px solid #F2F3F7",
                  borderRadius: "2px 0 0 2px",
                  left: `${
                    !leaver ? -(getLeft - getTextWith(item.title) + 48) : -60
                  }px`,
                  top: "50%"
                }}
              ></li>
              <li
                style={{
                  position: "absolute",
                  height: `calc(100% - ${getTop(item.children, leaver) +
                    getSizeBot(item.children, leaver) +
                    28}px)`,
                  width: `${!leaver ? "35px" : "35px"}`,
                  border: "1px solid #EAECF2",
                  borderRight: "none",
                  borderRadius: "2px 0 0 2px",
                  left: `${!leaver ? "-35px" : "-35px"}`,
                  top: `${getTop(item.children, leaver) + 14}px`,
                  borderBottom: `${
                    item?.children?.length == 1 ? "none" : "1px solid #EAECF2"
                  }`
                }}
              ></li>
              {tagUser(
                item.children,
                false,
                getLarge(item.children, leaver, list)
              )}
            </ul>
          ) : (
            <ul style={{ position: "relative" }} className="zuihou">
              <li
                style={{
                  height: "28px",
                  lineHeight: "28px",
                  background: "#F2F3F7",
                  borderRadius: "2px",
                  padding: "0 6px",
                  marginBottom: `${
                    item.fid.split("-").length == 2 &&
                    list.filter(items => items.children.length > 0).length == 0
                      ? "0px"
                      : "-8px"
                  }`,
                  fontWeight: "400"
                }}
              >
                {item.title}
              </li>
              <li
                style={{
                  height: `${!leaver ? "1px" : 0}`,
                  display: `${index == list.length - 1 ? "none" : "block"}`,
                  width: "35px",
                  position: "absolute",
                  left: "-35px",
                  top: "14px",
                  background: "#EAECF2"
                }}
              ></li>
            </ul>
          )}
        </span>
      );
    });
  };

  const editTag = () => {
    let obj = { ...state.detailList };
    FetchMenu({
      project: "SYSTEM"
    })
      .then(res => {
        let result = {};
        buildTree(0, 1, res["data"]["menuTree"], result);
        //  setState({
        //     ...state,
        //     modalList:result.children
        //  })
        let arr = JSON.parse(JSON.stringify(result.children));
        let a = deep(arr);
        setModalList(result.children);
        setBaoliu([result]);
        setAllSelect(a);
      })
      .catch(err => {
        console.log(err);
      });
    setEditVisible(true);
    setState({
      ...state,
      editList: obj,
      resetEdit: obj
    });
  };

  const handleOk = () => {
    //调用成功的接口
    if (!state.editList.tagName) {
      setIsError(true);
      setIsErrorType("请填写标签名称");
    }

    if (!isError) {
      getValidationResp({
        tagName: state.editList.tagName,
        tagId: state.editList.originTagId
      }).then(cont => {
        if (cont.records[0].result == "是") {
          setIsError(true);
          setIsErrorType("该标签名已存在");
        } else if (cont.records[0].result == "否") {
          saveEdit({
            tagId: state.editList.tagId,
            tagName: state.editList.tagName,
            originTagId: state.editList.originTagId,
            tagType: state.editList.tagType,
            requirementDepartment:
              Object.prototype.toString.call(
                state.editList.requirementDepartmentId
              ) == "[object String]"
                ? state.editList.requirementDepartmentId
                : state.editList.requirementDepartmentId.join(","),
            requirementStaff:
              Object.prototype.toString.call(
                state.editList.requirementStaffId
              ) == "[object String]"
                ? state.editList.requirementStaffId
                : state.editList.requirementStaffId.join(","),
            tagCaliber: state.editList.tagCaliber,
            tagSource: state.editList.tagSource,
            tagApply:
              JSON.stringify(state.value) != "[]"
                ? state.editTree && state.editTree.length > 0
                  ? JSON.stringify(state.editTree)
                  : state.editList.tagApply || "[]"
                : "[]",
            tagApplyData: JSON.stringify(state.value)
          }).then(res => {
            setEditVisible(false);
            // tabList: res.records,
            getTagTreeList({
              tagState: state.tagType,
              searchField: props.value
            }).then(resT => {
              getDetail({
                tagId: state.selectedKeys[0],
                tagType: state.belongType
              }).then(result => {
                FetchExcStaffListCus({
                  cxlx: "2",
                  yyb: "", //result.records[0].orgId
                  zt: "0"
                }).then(res => {
                  setEditAllTree(res.records);
                  setEditAllTreeInList(res.records);
                });

                getTagType({}).then(res => {
                  setEditAllTreeType(res.records);
                });

                fetchUserAuthorityDepartmentType({}).then(res => {
                  setEditAllTreeDevp(res.records);
                });
                setState({
                  ...state,
                  detailList: result.records[0],
                  tabList: resT.records,
                  openKeys: [...state.openKeys, result.records[0].tagType],
                  value: result.records[0].tagApplyData
                    ? JSON.parse(result.records[0].tagApplyData)
                    : result.records[0].tagApplyData
                });
              });
            });
          });
        }
      });
    }
  };

  const handleCancel = e => {
    // console.log(state.resetEdit.tagApplyData);
    setIsError(false);
    setIsErrorType("");
    setState({
      ...state,
      editList: state.resetEdit,
      editTree: state.resetEdit.tagApply
        ? JSON.parse(state.resetEdit.tagApply)
        : [],
      value: state.resetEdit.tagApplyData
        ? JSON.parse(state.resetEdit.tagApplyData)
        : []
    });
    if (e.target.localName == "button") {
      console.log("重置了");
    } else {
      setEditVisible(false);
    }
  };
  //数组扁平化
  function deep(node) {
    let stack = node,
      data = [];
    while (stack.length != 0) {
      let pop = stack.pop();
      data.push({
        id: pop.id,
        title: pop.title,
        fid: pop.fid,
        value: pop.value
      });
      let children = pop.children;
      if (children) {
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push(children[i]);
        }
      }
    }
    return data;
  }

  //找出某个节点数据
  function deepQuery(tree, value) {
    var isGet = false;
    var retNode = null;
    function deepSearch(tree, value) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].children && tree[i].children.length > 0) {
          deepSearch(tree[i].children, value);
        }
        if (value === tree[i].value || isGet) {
          isGet || (retNode = tree[i]);
          isGet = true;
          break;
        }
      }
    }
    deepSearch(tree, value);
    return retNode;
  }
  //将选中数据转换成树结构
  function treeData(data) {
    let cloneData = JSON.parse(JSON.stringify(data));
    return cloneData.filter(parent => {
      let branchArr = cloneData.filter(child => parent["id"] == child["fid"]);
      branchArr.length > 0 ? (parent["children"] = branchArr) : "";
      return parent["fid"] == null;
    });
  }
  const show = () => {
    return <span>...等{state.value.length}项</span>;
  };
  const modalAdd = value => {
    let length = 0;
    if (value) {
      length = Array.isArray(value) ? value.length : value.split(",").length;
    }
    return <span>...等{length}项</span>;
  };

  const onFilter = value => {
    let selectsNew = [];
    //搜索查询需要保留树形结构，需判断当前元素或其子元素是否存在符合
    const render1 = (data, input) => {
      let flag = false;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];

        if (item.title.indexOf(input) > -1) {
          selectsNew.unshift(item.id);
          flag = true;
          if (
            item.children &&
            item.children.length &&
            render1(item.children, input)
          ) {
            selectsNew.unshift(item.id);
          }
        } else if (item.children && item.children.length) {
          if (render1(item.children, input)) {
            selectsNew.unshift(item.id);
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
        if (selectsNew.includes(item.id)) {
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
      return render2(initData, []);
    }
  };

  const onDropdownVisibleChange = open => {
    setState({
      ...state,
      treeIsOpen: open
    });
  };

  const everyOnce = (data, upArr) => {
    // console.log(data,upArr,'data');
    let a = data.every(item => {
      return upArr.includes(item.value);
    });
    return a;
  };

  // const onSearch = (value)=>{
  //     // let newTreeList = onFilter(value)||[];
  //     // let newValue = JSON.parse(JSON.stringify(state.value))
  //     // console.log(newValue,'newValue');
  //     // newValue.map((item,index)=>{
  //     //         let searchTree = JSON.parse(JSON.stringify(newTreeList));
  //     //         console.log(searchTree,'searchTree',deepQuery(searchTree,item.value));
  //     //         if(deepQuery(searchTree,item.value)&&deepQuery(searchTree,item.value).children&&deepQuery(searchTree,item.value).children.length>0){
  //     //             newValue.splice(index,1);
  //     //         }
  //     //     })
  //     //     setState({
  //     //         ...state,
  //     //         value:newValue
  //     //     })
  //     let upArr =  state.value.map((item)=>{
  //         return item.value
  //      })
  //     if(value){
  //         if(onFilter(value)){
  //             let inSearchArr = []
  //             upArr.map((item)=>{
  //                 deepQuery(JSON.parse(JSON.stringify(onFilter(value)[0].children)),item)&&inSearchArr.push(deepQuery(JSON.parse(JSON.stringify(onFilter(value)[0].children)),item))
  //              })
  //              inSearchArr.map((item)=>{
  //                 if(item.children.length>0){
  //                    if(!everyOnce(deep(item.children),upArr)){
  //                       state.value = state.value.filter(items=>items.value!=item.value)
  //                    }
  //                 }
  //              })
  //         }
  //         setState({
  //             ...state,
  //             value
  //          })
  //         onFilter(value)?setModalList(onFilter(value)[0].children):setModalList([])
  //     }else{
  //         let inSearchArr = []
  //         upArr.map((item)=>{
  //             deepQuery(JSON.parse(JSON.stringify(baoliu[0].children)),item)&&inSearchArr.push(deepQuery(JSON.parse(JSON.stringify(baoliu[0].children)),item))
  //          })
  //          inSearchArr.map((item)=>{
  //             if(item.children.length>0){
  //                if(!everyOnce(deep(item.children),upArr)){
  //                   state.value = state.value.filter(items=>items.value!=item.value)
  //                }
  //             }
  //          })
  //          setState({
  //             ...state,
  //             value
  //          })
  //         setModalList(baoliu[0].children)
  //     }
  //     // console.log(,'onFilter(value)');
  // }
  const getPopupContainer = () => {
    return document.getElementsByClassName("modal_tag")[0];
  };
  const onAddOk = () => {
    if (modalType == "") {
      setErrorTitle("标签内容不能为空");
      return;
    }
    if (modalTitle == "编辑标签") {
      editType({
        id: editModal,
        tagType: modalType
      }).then(resEdit => {
        console.log(resEdit.records[0].tagType, "res");
        if (resEdit.code == 2) {
          setErrorTitle("标签重复");
          return;
        } else {
          setEditModal("");
          setAddVisible(false);
          // if(resEdit.records[0].tagType==state.editList.tagType){
          getTagTreeList({
            tagState: state.tagType,
            searchField: props.value
          }).then(resT => {
            getDetail({
              tagId: state.selectedKeys[0],
              tagType: state.belongType
            }).then(result => {
              getTagType({}).then(res => {
                setEditAllTreeType(res.records);
              });
              if (resEdit.records[0].tagType == state.editList.tagType) {
                setState({
                  ...state,
                  detailList: result.records[0],
                  tabList: resT.records,
                  editList: { ...state.editList, tagType: modalType },
                  openKeys: [...state.openKeys, result.records[0].tagType]
                });
              } else {
                setState({
                  ...state,
                  detailList: result.records[0],
                  tabList: resT.records,
                  // editList:{...state.editList,tagType:modalType},
                  openKeys: [...state.openKeys, result.records[0].tagType]
                });
              }
            });
          });
          // }
        }
      });
    } else {
      addType({
        tagType: modalType
      }).then(res => {
        console.log(res, "add");
        if (res.code == 2) {
          setErrorTitle("该标签名已存在");
        } else if (res.code == 1) {
          getTagType({}).then(res => {
            setEditAllTreeType(res.records);
          });
          setAddVisible(false);
          setEditModal("");
          message.success("添加成功");
        }
      });
    }
  };
  const del = () => {
    deleteType({
      id: editModal
    }).then(res => {
      console.log(res, "112333");
      if (res.code == 2) {
        setVisDel(false);
        setDelInModal(true);
      } else {
        // setDelInModal(false);
        setVisDel(false);
        getTagType({}).then(resTitle => {
          setEditAllTreeType(resTitle.records);
        });
        message.success("删除成功");
      }
    });
  };
  const tagTypeList = menu => {
    // onChange={setState({...state,editList:{...state.editList,tagType:value}})}}
    return (
      <div>
        {editAllTreeType.map(item => {
          // console.log(item,'item',state.editList.tagType);
          return (
            <div
              className={[
                styles.tagTypeNewlist,
                state.editList.tagType == item.type ? styles.hasSelectItem : ""
              ].join(" ")}
              onClick={() =>
                setState({
                  ...state,
                  editList: { ...state.editList, tagType: item.type }
                })
              }
              style={{ cursor: "pointer" }}
              onMouseDown={e => e.preventDefault()}
            >
              {item.type}
              <span
                className="isShowInItem"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <span
                  className="btnInItem"
                  onClick={e => {
                    setAddVisible(true);
                    setModalTitle("编辑标签");
                    setModalType(item.type);
                    setEditModal(item.id);
                  }}
                >
                  编辑
                </span>
                <span
                  className="btnInItem"
                  onClick={e => {
                    setEditModal(item.id);
                    setVisDel(true);
                    setModalType(item.type);
                  }}
                >
                  删除
                </span>
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  const tProps = {
    allowClear: true,
    treeData: modalList,
    // treeDefaultExpandAll: true,
    // treeCheckStrictly:true,
    value: state.value || [],
    treeNodeFilterProp: "title",
    onChange,
    // onSearch,
    // getPopupContainer,
    onDropdownVisibleChange: onDropdownVisibleChange,
    showSearch: true,
    labelInValue: true,
    autoClearSearchValue: false,
    treeCheckable: true,
    treeDataSimpleMode: true,
    maxTagCount: 3,
    maxTagPlaceholder: show,
    showCheckedStrategy: "TreeSelect.SHOW_ALL",
    placeholder: "请选择",
    dropdownClassName: styles.dropInline,
    dropdownStyle: {
      height: "250px"
    },
    style: {
      width: "100%"
    }
  };
  return (
    <div className={styles.aside}>
      <Tabs
        defaultActiveKey="1"
        onChange={callback}
        activeKey={state.activeKey}
      >
        <TabPane
          tab={
            <div
              onClick={() => {
                props.changeTabType(1);
              }}
            >
              客户标签
            </div>
          }
          key="1"
        >
          <div className="left" style={{ paddingTop: "16px" }}>
            <div
              style={{
                marginLeft: "24px",
                marginBottom: "22px",
                position: "relative"
              }}
              className={styles.selectInpo}
            >
              <span style={{ color: "#1a2234" }}>标签类型</span>{" "}
              <Select
                value={state.tagType}
                onDropdownVisibleChange={open => {
                  setIsOpen(open);
                }}
                style={{ width: 171, height: 32, marginLeft: "4px", color: "" }}
                onChange={handleChange}
                suffixIcon={<img src={isOpen ? Up : Down} />}
              >
                {hasRespon && <Option value="全部">全部</Option>}
                <Option value="上架">上架</Option>
                {hasRespon && <Option value="下架">下架</Option>}
                {hasRespon && <Option value="标签系统">标签系统</Option>}
              </Select>
              <div
                style={{
                  position: "absolute",
                  top: "48px",
                  width: "calc(100% + 24px)",
                  left: "-24px",
                  height: "25px",
                  background:
                    "linear-gradient(360deg, rgba(255,255,255,0) 0%, #E5ECF7 100%)"
                }}
              ></div>
            </div>
            <div className={styles.content}>{asideMenu()}</div>
          </div>
          <div className="rightInTag" style={{ paddingTop: "16px" }}>
            <div className="topInTag">
              <img
                src={editCustomer}
                style={{ marginTop: "-2px", width: "24px" }}
              />
              <span className="tagTitle">{state.detailList.tagName}</span>
              {state.detailList.tagName && hasRespon ? (
                <span style={{ float: "right" }}>
                  {!state.detailList.tagState ||
                  state.detailList.tagState == "上架" ? (
                    <Button
                      className="tagButton"
                      onClick={() => {
                        triaggit("下架");
                      }}
                    >
                      下架标签
                    </Button>
                  ) : (
                    <Button
                      className="tagButton"
                      onClick={() => {
                        triaggit("上架");
                      }}
                    >
                      上架标签
                    </Button>
                  )}
                  <Button
                    className="tagButton"
                    style={{ marginLeft: "16px" }}
                    onClick={editTag}
                  >
                    编辑标签
                  </Button>
                </span>
              ) : (
                state.selectBelong == "个人标签" && (
                  <span style={{ float: "right" }}>
                    <Button
                      className="tagButton"
                      style={{ marginLeft: "16px" }}
                      onClick={editTag}
                    >
                      编辑标签
                    </Button>
                  </span>
                )
              )}
            </div>
            <div className="contentTag">
              <div className="tagStrong">
                <span style={{ color: "#1A2243" }}>标签状态 :</span>
                <span className={styles.fontSolid}>
                  {state.detailList.tagState ? state.detailList.tagState : "无"}
                </span>
              </div>
              <div className="tagStrong">
                <span style={{ color: "#1A2243" }}>标签类型 :</span>
                <span className={styles.fontSolid}>
                  {state.detailList.tagType ? state.detailList.tagType : "无"}
                </span>
              </div>
              <div className="tagStrong">
                <span style={{ color: "#1A2243" }}>标签来源 :</span>
                <span className={styles.fontSolid}>
                  {state.detailList.tagSource
                    ? state.detailList.tagSource
                    : "无"}
                </span>
              </div>
              <div className="tagStrong">
                <span style={{ color: "#1A2243" }}>标签需求部门 :</span>
                <span className={styles.fontSolid}>
                  {state.detailList.requirementDepartment
                    ? state.detailList.requirementDepartment
                    : "无"}
                </span>
              </div>
              <div className="tagStrong">
                <span style={{ color: "#1A2243" }}>标签需求人 :</span>
                <span className={styles.fontSolid}>
                  {state.detailList.requirementStaff
                    ? state.detailList.requirementStaff
                    : "无"}
                </span>
              </div>
              <div className="tagStrong" style={{ display: "flex" }}>
                <span style={{ color: "#1A2243" }}>标签说明 :</span>
                <span
                  className={styles.fontSolid}
                  style={{
                    whiteSpace: "pre-wrap",
                    flex: "none",
                    display: "inline-block",
                    width: "calc(100% - 90px)",
                    wordWrap: "break-word"
                  }}
                >
                  {state.detailList.requirementDescription
                    ? state.detailList.requirementDescription
                    : "无"}
                </span>
              </div>
              <div className="tagStrong">
                <span style={{ color: "#1A2243" }}>标签应用 :</span>
                {state.detailList.tagApply &&
                state.detailList.tagApply != "[]" ? (
                  <div className="appliant" style={{ paddingLeft: "64px" }}>
                    {state.detailList.tagApply &&
                      tagUser(
                        JSON.parse(state.detailList.tagApply) || [],
                        true,
                        0
                      )}
                  </div>
                ) : (
                  <span className={styles.fontSolid}>无</span>
                )}
              </div>
              {hasRespon && state.detailList.tagNo ? (
                <div
                  style={{
                    paddingTop: "16px",
                    borderTop: "1px solid #EAECF2 ",
                    marginTop: "16px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontFamily: "PingFangSC-Medium, PingFang SC",
                      fontWeight: 500,
                      color: "#1A2243",
                      marginBottom: "4px"
                    }}
                  >
                    标签系统原信息
                  </div>
                  <div className={styles.originTag}>
                    标签编号：{state.detailList.tagNo || "--"}
                  </div>
                  <div className={styles.originTag}>
                    标签分类：{state.detailList.tagClassify || "--"}
                  </div>
                  <div className={styles.originTag}>
                    标签类别名称：{state.detailList.tagClassifyName || "--"}
                  </div>
                  <div className={styles.originTag}>
                    标签值：{state.detailList.tagValue || "--"}
                  </div>
                  <div className={styles.originTag}>
                    取值范围：{state.detailList.range || "--"}
                  </div>
                  <div className={styles.originTag}>
                    业务定义：{state.detailList.buzDefine || "--"}
                  </div>
                  <div className={styles.originTag}>
                    标签状态：{state.detailList.buzState || "--"}
                  </div>
                </div>
              ) : (
                <div style={{ height: "140px" }}></div>
              )}
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              onClick={() => {
                props.changeTabType(2);
              }}
            >
              客户指标
            </div>
          }
          key="2"
        >
          <div className={styles.content}>
            <CustomerIndicators
              KHZBchoic={props.KHZBchoic}
              setCustomerIndicatorsChoseId={props.setCustomerIndicatorsChoseId}
              customerIndicatorsChoseId={props.customerIndicatorsChoseId}
              searchOrClick={props.searchOrClick}
              setSearchOrClick={props.setSearchOrClick}
              customerIndicatorsChosePId={props.customerIndicatorsChosePId}
              gouzi={props.gouzi}
              treeOpen={props.treeOpen}
              setTreeOpen={props.setTreeOpen}
            />
          </div>
        </TabPane>
        <TabPane
          tab={
            <div
              onClick={() => {
                props.changeTabType(3);
              }}
            >
              员工指标
            </div>
          }
          key="3"
        >
          <div className={styles.content}>
            <EmployeeIndi indiName={props.yuangongSearch}></EmployeeIndi>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span
              onMouseEnter={() => {
                setEnter(true);
              }}
              onMouseLeave={() => {
                setEnter(false);
              }}
            >
              <img
                src={enter ? getBlueIcon : getIcon}
                alt=""
                style={{ marginTop: "-4px", width: "20px" }}
              />
              {enter ? (
                <span style={{ color: "#244fff" }}>查一查</span>
              ) : (
                <span>查一查</span>
              )}
            </span>
          }
        ></TabPane>
      </Tabs>
      <Modal
        title="编辑标签"
        visible={editVisible}
        cancelText={"重置"}
        onOk={handleOk}
        maskClosable={false}
        destroyOnClose={true}
        className={styles.modal_tag}
        onCancel={handleCancel}
        width={640}
        // destroyOnClose
      >
        <div>
          <div
            style={{
              marginLeft: "18px",
              height: "32px",
              lineHeight: "32px",
              marginBottom: `${isError ? "" : "16px"}`
            }}
          >
            <span style={{ color: "red", marginRight: "3px" }}>*</span>
            <span style={{ color: "#1a2234" }}>标签名称</span>
            <Input
              value={state.editList.tagName}
              onChange={e => {
                console.log(e, "value");
                setState({
                  ...state,
                  editList: { ...state.editList, tagName: e.target.value }
                });
                if (!e.target.value) {
                  setIsError(true);
                  setIsErrorType("请填写标签名称");
                } else {
                  setIsError(false);
                  setIsErrorType("");
                }
              }}
              placeholder="请输入标签名称"
              maxLength={20}
              style={{
                width: "250px",
                height: "32px",
                marginLeft: "8px",
                border: `${isError ? "1px solid red" : "1px solid #d1d5e6"}`,
                borderRadius: "2px",
                color: "#61698C "
              }}
            />
          </div>
          {isError && (
            <div
              style={{ color: "red", marginLeft: "92px", marginBottom: "16px" }}
            >
              {isErrorType}
            </div>
          )}
          <div
            style={{
              marginLeft: "28px",
              height: "32px",
              lineHeight: "32px",
              marginBottom: "16px"
            }}
          >
            <span style={{ color: "#1a2234" }}>标签状态</span>
            <span style={{ marginLeft: "8px", color: "#61698C " }}>
              {state.editList.tagState}
            </span>
          </div>
          <div
            style={{
              marginLeft: "28px",
              height: "32px",
              lineHeight: "32px",
              marginBottom: "16px"
            }}
          >
            <span style={{ color: "#1a2234" }}>标签类型</span>
            <Select
              value={state.editList.tagType}
              dropdownRender={menu => tagTypeList(menu)}
              suffixIcon={<img src={modal1 ? Up : Down} />}
              onDropdownVisibleChange={open => {
                setModal1(open);
              }}
              style={{ width: "250px", height: "32px", marginLeft: "8px" }}
            >
              {editAllTreeType.map(item => (
                <Option value={item.type} key={item.type}>
                  {item.type}
                </Option>
              ))}
            </Select>
            <Button
              onClick={() => {
                setAddVisible(true);
                setModalTitle("添加标签");
                setModalType("");
              }}
              className={styles.addBtn}
            >
              添加
            </Button>
          </div>
          <div
            style={{
              marginLeft: "28px",
              height: "32px",
              lineHeight: "32px",
              marginBottom: "16px"
            }}
          >
            <span style={{ color: "#1a2234" }}>标签来源</span>
            <span style={{ marginLeft: "8px", color: "#61698C" }}>
              {state.editList.tagSource}
            </span>
          </div>
          <div
            style={{
              height: "32px",
              lineHeight: "32px",
              marginBottom: "16px",
              position: "relative",
              display: "inline-block"
            }}
          >
            <span style={{ color: "#1a2234" }}>标签需求部门</span>
            <SuperSelect
              dropdownClassName="hasMultiple"
              optionFilterProp="showName"
              mode="multiple"
              placeholder="请选择"
              allowClear={true}
              suffixIcon={<img src={modal2 ? Up : Down} />}
              maxTagTextLength={3}
              maxTagCount={3}
              maxTagPlaceholder={() =>
                modalAdd(state.editList.requirementDepartmentId)
              }
              showSearch
              onDropdownVisibleChange={open => {
                setModal2(open);
              }}
              value={
                Object.prototype.toString.call(
                  state.editList.requirementDepartmentId
                ) == "[object String]" &&
                state.editList.requirementDepartmentId != ""
                  ? state.editList.requirementDepartmentId.split(",")
                  : state.editList.requirementDepartmentId
              }
              onChange={value => {
                setState({
                  ...state,
                  editList: {
                    ...state.editList,
                    requirementDepartmentId: value
                  }
                });
              }}
              style={{ minWidth: "250px", height: "32px", marginLeft: "8px" }}
            >
              {editAllTreeDevp.map(item => (
                <Option
                  value={item.yybid}
                  key={item.yybid}
                  showName={item.yybmc}
                >
                  {item.yybmc}
                </Option>
              ))}
            </SuperSelect>
            <img
              src={modal2 ? Up : Down}
              style={{
                position: "absolute",
                right: "8px",
                top: "8px",
                width: "16px"
              }}
            />
          </div>
          <div
            style={{
              marginLeft: "14px",
              height: "32px",
              lineHeight: "32px",
              marginBottom: "16px",
              position: "relative",
              display: "inline-block"
            }}
          >
            <span style={{ color: "#1a2234" }}>标签需求人</span>
            <SuperSelect
              dropdownClassName="hasMultiple"
              optionFilterProp="showName"
              mode="multiple"
              placeholder="请选择"
              allowClear={true}
              suffixIcon={<img src={modal3 ? Up : Down} />}
              maxTagTextLength={3}
              maxTagCount={3}
              maxTagPlaceholder={() =>
                modalAdd(state.editList.requirementStaffId)
              }
              onDropdownVisibleChange={open => {
                setModal3(open);
              }}
              showSearch
              value={
                Object.prototype.toString.call(
                  state.editList.requirementStaffId
                ) == "[object String]" &&
                state.editList.requirementStaffId != ""
                  ? state.editList.requirementStaffId.split(",")
                  : state.editList.requirementStaffId
              }
              onChange={value => {
                setState({
                  ...state,
                  editList: { ...state.editList, requirementStaffId: value }
                });
              }}
              style={{ minWidth: "250px", height: "32px", marginLeft: "8px" }}
            >
              {editAllTree.map(item => (
                <Option
                  value={item.yhid}
                  key={item.yhid}
                  showName={item.yhxm + item.yhbh}
                >
                  {item.yhxm + "(" + item.yhbh + ")"}
                </Option>
              ))}
            </SuperSelect>
            <img
              src={modal3 ? Up : Down}
              style={{
                position: "absolute",
                right: "8px",
                top: "8px",
                width: "16px"
              }}
            />
          </div>
          <div
            style={{
              marginLeft: "28px",
              marginBottom: "16px",
              display: "flex"
            }}
          >
            <span style={{ color: "#1a2234" }}>标签说明</span>
            <TextArea
              maxLength={1000}
              placeholder="请输入"
              value={state.editList.tagCaliber}
              className={styles.textarea_className}
              style={{
                width: "352px",
                marginLeft: "8px",
                height: "101px",
                borderRadius: "2px",
                color: "#61698C",
                border: "1px solid #D1D5E6"
              }}
              onChange={e => {
                setState({
                  ...state,
                  editList: { ...state.editList, tagCaliber: e.target.value }
                });
              }}
            ></TextArea>
          </div>
          <div
            style={{
              position: "relative",
              marginLeft: "28px",
              height: "32px",
              lineHeight: "32px",
              marginBottom: "16px"
            }}
          >
            <span style={{ color: "#1a2234" }}>标签应用</span>
            <TreeSelect
              {...tProps}
              style={{ minWidth: "250px", marginLeft: "8px" }}
              className={styles.treeSelectTag}
            />
            {/* {state.treeIsOpen&&<div style={{position:'absolute',zIndex:99}}>
                            <Button></Button>
                            <Button></Button>
                        </div>} */}
          </div>
        </div>
      </Modal>
      <Modal
        visible={addVisible}
        title={modalTitle}
        onOk={onAddOk}
        onCancel={() => {
          setAddVisible(false);
          setEditModal("");
        }}
        className={styles.editModal}
        destroyOnClose={true}
      >
        <span>标签名称</span>
        <Input
          value={modalType}
          className={errorTitle != "" && "errorModal"}
          onChange={e => {
            setModalType(e.target.value);
            setErrorTitle("");
          }}
        />
        <div
          style={{
            display: `${errorTitle == "" ? "none" : "block"}`,
            marginLeft: "63px",
            color: "red"
          }}
        >
          {errorTitle}
        </div>
      </Modal>
      <Modal
        visible={visDel}
        footer={null}
        onCancel={() => {
          setVisDel(false);
          setEditModal("");
        }}
        style={{ height: "148px" }}
        width={470}
        className={styles.modalInToo}
      >
        <div className="fontInTag" style={{ display: "flex" }}>
          {/* {console.log(cuzzy,'cuzzy')} */}
          <div style={{ flex: "none" }}>
            <img src={cuzzy} style={{ marginTop: "-3px" }} />
          </div>
          <div style={{ marginLeft: "10px", display: "inline-block" }}>
            确定删除“{modalType}”标签类型，删除后无法恢复，是否继续删除
          </div>
        </div>
        <Button
          onClick={() => {
            setVisDel(false);
            setEditModal("");
          }}
          style={{
            margin: "16px 16px 0 285px",
            color: "#61698C",
            width: "60px",
            height: "32px",
            borderRadius: "2px",
            borderColor: "#D1D5E6"
          }}
        >
          取消
        </Button>
        <Button
          onClick={del}
          style={{
            background: "#244FFF",
            width: "60px",
            height: "32px",
            borderRadius: "2px"
          }}
        >
          删除
        </Button>
      </Modal>
      <Modal
        visible={delInModal}
        footer={null}
        style={{ height: "136px" }}
        width={300}
        className={styles.modalInToo}
      >
        <div className="fontInTag">
          <img src={cuzzy} style={{ marginTop: "-3px", marginRight: "2px" }} />
          该标签类型存在下属标签，暂无法删除
        </div>
        {/* <Button onClick={()=>{this.setState({label:'',visT1:false})}} style={{margin:'16px 16px 0 107px',color:'#61698C'}}>重置</Button> */}
        <Button
          onClick={() => {
            setDelInModal(false);
            setEditModal("");
          }}
          style={{
            margin: "16px 16px 0 188px",
            background: "#244FFF",
            width: "60px",
            height: "32px",
            borderRadius: "2px",
            border: "none"
          }}
        >
          确定
        </Button>
      </Modal>
      {/* list */}
    </div>
  );
});
export default CustomerTags;
