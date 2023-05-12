import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  Button,
  Modal,
  Table,
  Input,
  Popover,
  Select,
  Checkbox,
  message,
  Alert,
} from "antd";
import RadioSelect from "../Common/RadioSelect";
import TableBtn from "../Common/Export/exportIndex";
import { Link } from "umi";
import NewTreeSelect from "../Common/NewTreeSelect";
import DeptmentList from "../Common/DeptmentList";
import IconSure from "$assets/newProduct/staff/问号.png";
import BasicDataTable from "$common/BasicDataTable";
import {
  QueryStaffIndexValue, //员工排行
  GetAIGridStockPool, //股票池
  QueryCustomerStockPool, //个人持仓
} from "$services/newProduct";
import {
  options,
  options1,
  options2,
  options3,
  tree1,
  custom,
  isPro,
  interruptFlag,
} from "./listData.js";
import TableBn from "../Common/TableBn";
import {
  AddedProducted,
  GetProductTree,
  GetCustomerContractWillResponse,
  GetCustomerSubscriptionProductResponse,
} from "$services/productChance";
import { QueryTag, QueryCustomerGroup } from "$services/newProduct";

import "./index.css";
const { Search } = Input;
//用于映射单选数据和type类型
const mapDataToType = {
  customerRange: options, //客户范围
  contractIntent: options1, //签约意愿
  commissionContractIntent: options3, //全提佣签约潜力
  commissionContractContribute: options2, //预估全提佣签约潜力
  contractedProductFlag: isPro,
  interruptFlag: interruptFlag,
};

const SelectAll = React.memo(() => {
  //初始展示内容
  const baseData = {
    customerRange: "直属",
    commissionContractContribute: "全部",
    contractIntent: "全部",
    commissionContractIntent: "全部",
    contractedProductFlag: "全部",
    interruptFlag: "全部",
    productIdList: undefined,
    riskEvaluationIdList: undefined,
    customerLevelIdList: undefined,
    tagIdList: undefined,
    customerGroupIdList: undefined,
    dept: [],
    deptSearch: "",
  };
  //初始搜索传递给后端的值
  const baseSearchData = {
    customerRange: "1",
    commissionContractContribute: "0",
    contractIntent: "0",
    commissionContractIntent: "0",
    contractedProductFlag: "0",
    interruptFlag: "0",
    productIdList: [],
    riskEvaluationIdList: [],
    customerLevelIdList: [],
    tagIdList: [],
    customerGroupIdList: [],
    departNo: "",
  };
  const [selectData, useSelectData] = useState(baseData); //传递给子组件用于展示的数据
  const [showTable, setShowTable] = useState(false); //用于判断是否点击查询
  const [total, setTotal] = useState(0); //结果展示区域数据条数
  const [pageSize, setPageSize] = useState(10); //分页页面数量
  const [current, setCurrent] = useState(1); //分页页码
  const [loading, setLoading] = useState(false); //等待状态
  const [selectAll, setSelectAll] = useState(false); //是否全选
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //选中行的key值
  const [selectedRows, setSelectedRows] = useState([]); //选中行数据
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalList, setModalList] = useState({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [searchListData, setSearchListData] = useState(baseSearchData);
  const [customerGroupIdList, setCustomerGroupIdList] = useState([]);
  const [tagIdList, setTagIdList] = useState([]);
  const [productTree, setProductTree] = useState([]);
  const [listData, setListData] = useState([]);
  const [modaListData, setModaListData] = useState([]);
  const [md5, setMd5] = useState();
  const [modalOn, setModalOn] = useState();
  const [productLength, setProductLength] = useState(0);
  const [modalLoading, setModalLoading] = useState(true);
  const [customerValueSele, setCustomerValueSele] = useState("");
  const [icClick, setIsClick] = useState(false);
  const [selectCustomer, setSelectCustomer] = useState();
  const [selectLeval, setSelectLeval] = useState();
  //创建计算属性，用来判断股票池是否可选
  const stockPoolModalShowOrHid = useMemo(() => {
    // 判断searchListData中的productIdList数组的长度是否为1，且第一个元素的第一个字符串是1974219
    return (
      searchListData?.productIdList[0]?.length === 1 &&
      searchListData?.productIdList[0][0] === "1974219"
    );
  }, [searchListData?.productIdList]);

  //股票池弹出modal表格表头(lyq)
  const stockPoolTableColumns = [
    {
      title: "股票名称",
      dataIndex: "name",
      //sorter: true,
      width: 211,
    },
    {
      title: "股票代码",
      dataIndex: "code",
      sorter: true,
      width: 150,
      defaultSortOrder: 'ascend',
    },
    {
      title: "最低参与资产",
      dataIndex: "minValue",
      sorter: true,
      width: 150,
    },
    {
      title: "AI回测年化收益率",
      dataIndex: "profitAnnual",
      sorter: true,
      render: (text, record) => {
        //console.log(typeof text, record, "text, record");
        return (
          <span
            style={{
              color: text === "" ? "" : text >= 0 ? "#DF2A2A" : "#2AAC13",
            }}
          >
            {text ? `${(text * 100).toFixed(2)}%` : "--"}
          </span>
        );
      },
    },
  ];
  //个人持仓表格表头(lyq)
  const ChiCang = [
    {
      title: "序号",
      dataIndex: "no",
      //sorter: true,
      width: 68,
      align: "center",
    },
    {
      title: "股票名称",
      dataIndex: "name",
      //sorter: true,
      width: 150,
    },
    {
      title: "股票代码",
      dataIndex: "code",
      sorter: true,
      width: 150,

    },
    {
      title: "持仓股票市值",
      dataIndex: "value",
      sorter: true,
      width: 150,
    },
    {
      title: "持仓天数",
      dataIndex: "day",
      sorter: true,
      width: 150,
    },
    {
      title: "AI回测年化收益率",
      dataIndex: "profitAnnual",
      sorter: true,
      render: (text, record) => {
        console.log(typeof text, record, "text, record");
        return (
          <span style={{ color: text >= 0 ? "#DF2A2A" : "#2AAC13" }}>
            {(text * 100).toFixed(2)}%
          </span>
        );
      },
    },
  ];
  //新增的增值产品股票池已选中数据（在多选框里显示的）(lyq)
  const [stockPool, setStockPool] = useState([]);
  //控制股票池弹出Modal的显隐(lyq)
  const [stockPoolModalVis, setStockPoolModalVis] = useState(false);
  //控制股票池弹出Modal(模拟数据)(lyq)
  const [stockPoolModalData, setStockPoolModalData] = useState([]);
  //股票池更新时间字段
  const [stockPoolModalUpdate, setStockPoolModalUpdate] = useState("");
  //控制股票池弹出Modal(Loading)(lyq)
  const [stockPoolModalLoading, setStockPoolModalLoading] = useState(false);
  //用来双向绑定搜索字段
  const [stockPoolModalSearch, setStockPoolModalSearch] = useState("");
  //双向绑定排序字段
  const [stockPoolModalSortField, setStockPoolModalSortField] = useState("code");
  //双向绑定排序方式
  const [stockPoolModalSortType, setStockPoolModalSortType] = useState("asc");
  //双向绑定当前页数量
  const [stockPoolModalpageSize, setStockPoolModalpageSize] = useState(10);
  //双向绑定当前页
  const [stockPoolModalpageNo, setStockPoolModalpageNo] = useState(1);
  //股票池表格多选项已选中(lyq)
  const [stockPoolModalSel, setStockPoolModalSel] = useState([]);
  //股票池表格多选项已选中(name)(lyq)
  const [stockPoolModalSeName, setStockPoolModalSelName] = useState([]);
  //股票池表格数据total(lyq)
  const [stockPoolModalTotal, setStockPoolModalTotal] = useState(0);
  const [stockPoolModalTotal2, setStockPoolModalTotal2] = useState(0);
  //股票池表格是否为默认全部选中状态（true为默认全选，false为用户自定义选择）(lyq)
  const [stockPoolTableAllSel, setStockPoolTableAllSel] = useState(false);
  //定义状态来控制股票池表格是可选择还是仅仅展示(true可选择/false仅展示)(lyq)
  const [stockPoolModalCanControl, setStockPoolModalCanControl] = useState(
    true
  );
  //此选项来控制股票池全选按钮禁用
  const [controlAllSel, setControlAllSell] = useState(false);
  //股票池弹出modal表格多选逻辑(lyq)
  //在这里保存当前的客户持仓查询参数
  const [MyCustomerNo, setMyCustomerNo] = useState("");
  const [MyqueryAllStockPool, setMyqueryAllStockPool] = useState("1");
  const [MystockPollList, setMystockPollList] = useState([]);
  const [MyTestList, setMyTestList] = useState([]);
  const rowSelectionzz = {
    //自定义全选按钮
    columnTitle: controlAllSel ? null : () => {
      return (
        <Checkbox
          disabled={controlAllSel}
          checked={stockPoolTableAllSel}
          onChange={() => setStockPoolTableAllSel(data => !data)}
        />
      );
    },
    hideDefaultSelections: true, // 去掉全选
    crossPageSelect: true,
    selectedRowKeys: stockPoolModalSel,
    selections: false,
    onChange: (selectedRowKeys, selectedRows) => {
      //console.log(selectedRowKeys, selectedRows);
      if (selectedRowKeys.length > 5) {
        message.warning("单选具体股票，选择范围为1-5只股票");
      } else {
        setStockPoolModalSel(selectedRowKeys);
        setStockPoolModalSelName(() => {
          let res = selectedRows.map(item => item.name);
          return res;
        });
      }
    },
    getCheckboxProps: record => ({
      disabled: stockPoolTableAllSel, // Column configuration not to be checked
      //name: record.status
    }),
  };
  //对当前是否全选的状态进行监听(lyq)
  useEffect(() => {
    //如果是true,就将当前列表的数据全部选中
    if (stockPoolTableAllSel) {
      const result = stockPoolModalData.map(item => item.code);
      setStockPoolModalSel(result);
      setStockPoolModalSelName(() => stockPoolModalData.map(item => item.name));
    } else {
      //否则就进行清空
      setStockPoolModalSel([]);
      setStockPoolModalSelName([]);
    }
  }, [stockPoolTableAllSel]);

  //对当前增值产品的选中项进行监听，如果为ai智能网格，则进行股票池接口的选择(lyq)
  useEffect(() => {
    //为ai智能网格就发起数据请求
    if (stockPoolModalShowOrHid) {
      GetstockPoolModalData2({
        pageSize: stockPoolModalpageSize, //每页显示的股票数量
        searchWord: stockPoolModalSearch, //搜索的股票名称
        pageNo: stockPoolModalpageNo, //当前页码
        sortField: stockPoolModalSortField, //排序字段
        sortType: stockPoolModalSortType //排序方式
      });
      console.log(stockPoolModalTotal2, "GetstockPoolModalData2");
      setTimeout(() => {
        setStockPoolTableAllSel(true);
      }, 500);
    } else {
      //否则就进行清空
      setStockPoolModalSel([]);
      setStockPoolModalSelName([]);
      MyStockReset();
      setStockPoolTableAllSel(false);
    }
  }, [searchListData]);

  useEffect(() => {
    queryCustomerGroup();
    queryTag();
    getProductTree();
    document.getElementsByTagName("body")[0].addEventListener("click", e => {});
    setSelectCustomer(custom);
    setSelectLeval(tree1);
    // GetstockPoolModalData2({
    //   pageSize: stockPoolModalpageSize, //每页显示的股票数量
    //   searchWord: stockPoolModalSearch, //搜索的股票名称
    //   pageNo: stockPoolModalpageNo, //当前页码
    //   sortField: stockPoolModalSortField, //排序字段
    //   sortType: stockPoolModalSortType //排序方式
    // });
  }, []);
  const GetstockPoolModalData = async (requestData, type = 1) => {
    type === 2 ? setStockPoolTableAllSel(false) : setStockPoolTableAllSel(true);
    setStockPoolModalData([]);
    setStockPoolModalLoading(true);
    try {
      const { records, total } = await GetAIGridStockPool(requestData);
      setStockPoolModalTotal(total);
      const result2 = records.reduce((acc, item) => {
        if (!acc.some(({ code }) => code === item.code)) {
          acc.push(item);
        }
        return acc;
      }, MyTestList);
      console.log(result2, "result2");
      setMyTestList(result2);
      setStockPoolModalUpdate(
        records[0].updateTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
      );
      setStockPoolModalData(records);
      setStockPoolModalLoading(false);
      if (stockPoolTableAllSel && type === 1) {
        setStockPoolModalSel(selectedRowKeys => [
          ...selectedRowKeys,
          ...records.map(item => item.code),
        ]);
      }
    } catch (error) {
      setStockPoolModalLoading(false);
      //message.error(!error.success ? error.message : error.note);
    }
  };
  const GetstockPoolModalData2 = async requestData => {
    try {
      const { records, total } = await GetAIGridStockPool(requestData);
      setStockPoolModalTotal2(total);
      setStockPoolModalData(records);
      const result2 = records.reduce((acc, item) => {
        if (!acc.some(({ code }) => code === item.code)) {
          acc.push(item);
        }
        return acc;
      }, MyTestList);
      console.log(result2, "result2");
      setMyTestList(result2);
    } catch (error) {
      //setStockPoolModalLoading(false);
      //message.error(!error.success ? error.message : error.note);
    }
  };

  //获取股票池列表数据(lyq)
  // const GetstockPoolModalData = requestData => {
  //   setStockPoolModalData([]);
  //   // 设置股票池模态框加载状态为true
  //   setStockPoolModalLoading(true);
  //   // 调用查询员工索引值函数，获取股票池模态框数据
  //   GetAIGridStockPool(requestData).then(({ records, total }) => {
  //     if (records.length > 0) {
  //       const result2 = MyTestList;
  //       records.forEach(item => {
  //         if (result2.filter(items => items.code === item.code).length > 0) {
  //         } else {
  //           result2.push(item);
  //         }
  //       });
  //       setMyTestList(result2);
  //       //setMyTestList(MyTestList=>[...MyTestList,records])
  //       setStockPoolModalUpdate(
  //         records[0].updateTime.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
  //       );
  //       // 设置股票池模态框数据
  //       setStockPoolModalData(records);
  //       // 设置股票池模态框总数
  //       setStockPoolModalTotal(total);
  //       // 设置股票池模态框加载状态为false
  //       setStockPoolModalLoading(false);
  //       // 如果股票池表格所有选择
  //       if (stockPoolTableAllSel) {
  //         // 设置股票池模态框选择的行键
  //         setStockPoolModalSel(selectedRowKeys => [
  //           ...selectedRowKeys,
  //           ...records.map(item => item.code)
  //         ]);
  //         //设置股票池模态框选择的名称
  //         setStockPoolModalSelName(selectedRowKeys => [
  //           ...selectedRowKeys,
  //           ...records.map(item => item.name)
  //         ]);
  //       }
  //     }
  //   });
  // };
  //获取个人持仓数据
  const GetQueryCustomerStockPool = requestData => {
    setStockPoolModalData([]);
    setStockPoolModalLoading(true);
    QueryCustomerStockPool(requestData).then(({ records, total }) => {
      console.log(records, total);
      // 设置股票池模态框数据
      setStockPoolModalData(records);
      // 设置股票池模态框总数
      setStockPoolModalTotal(total);
      // 设置股票池模态框加载状态为false
      setStockPoolModalLoading(false);
    });
  };
  /* 这段代码是一个React函数组件中的一个useCallback hook，它定义了一个名为getRadioSelect的函数。
  这个函数接受两个参数：type和value。在函数内部，它首先定义了一个名为getRadio的数组，
  其中包含了一些特定的字符串。然后，它创建了两个新的对象newData和newSearchList，
  这两个对象都是通过展开selectData和searchListData对象来创建的。接下来，它检查type是否在getRadio数组中
  ，如果是，则将newSearchList对象中的type属性设置为mapDataToType[type]数组中value属性等于value参数的第
  一个元素的searchValue属性。否则，它将newSearchList对象中的type属性设置为value参数的值。最后，
  它将newData对象中的type属性设置为value参数的值，并调用setSearchListData和useSelectData函数更新状态。 */
  const getRadioSelect = useCallback(
    (type, value) => {
      let getRadio = [
        "customerRange",
        "contractIntent",
        "commissionContractIntent",
        "commissionContractContribute",
        "contractedProductFlag",
        "interruptFlag",
      ];
      let newData = { ...selectData },
        newSearchList = { ...searchListData };
      if (getRadio.indexOf(type) >= 0) {
        newSearchList = {
          ...newSearchList,
          [type]: mapDataToType[type].find(item => item.value === value)
            ?.searchValue,
        };
      } else {
        value[0] === "all"
          ? (newSearchList[type] = ["0"])
          : (newSearchList[type] = value);
      }
      newData[type] = value;
      setSearchListData(newSearchList);
      useSelectData(newData);
    },
    [selectData]
  );

  const queryCustomerGroup = keyword => {
    QueryCustomerGroup({
      pageNo: 1,
      pageSize: 100,
      keyword,
    }).then(res => {
      setCustomerGroupIdList(res.records);
    });
  };

  const getProductTree = keyword => {
    GetProductTree().then(res => {
      setTimeout(() => {
        setProductTree(productTreeList(res.records[0].children));
        setProductLength(getCheckedKeysLength(res.records[0].children, []));
      }, 500);
    });
  };

  // 搜索营业部变化
  const handleYybSearch = value => {
    // this.setState({
    //   deptSearch: value,
    // });
    useSelectData({
      ...selectData,
      deptSearch: value,
    });
  };

  const setStateChange = upList => {
    const { dept = [], isChange = false } = upList;
    // this.setState({
    //   ...state,
    // });
    if (!isChange) {
      useSelectData({
        ...selectData,
        ...upList,
      });
    } else {
      useSelectData({
        ...selectData,
        ...upList,
      });
      setSearchListData({
        ...searchListData,
        departNo: dept.join(","),
      });
    }
  };

  // 获取父节点下的所有子节点key
  const getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        getCheckedKeys(item.props.children, array);
      }
    });
  };

  // 选中营业部变化
  const handleYybChange = (value, label, extra) => {
    let { dept } = selectData;
    if (value.length) {
      const array = [];
      array.push(extra.triggerValue);
      getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (dept.indexOf(item) === -1) dept.push(item);
        });
      } else {
        array.forEach(item => {
          if (dept.indexOf(item) > -1) dept.splice(dept.indexOf(item), 1);
        });
      }
    } else {
      dept = [];
    }
    // this.setState({ deptSearch: this.state.deptSearch, dept });
    useSelectData({ ...selectData, deptSearch: selectData.deptSearch, dept });
    setSearchListData({ ...searchListData, departNo: dept.join(",") });
  };
  //获取接口中的数据数量
  const getCheckedKeysLength = (triggerNodes, arr) => {
    triggerNodes.forEach(item => {
      arr.push(item.name);
      if (item.children.length) {
        getCheckedKeysLength(item.children, arr);
      }
    });
    return arr.length;
  };
  //标签数据查询方法
  const queryTag = () => {
    QueryTag().then(res => {
      let data = res.records[0];
      let tagsData = [];
      Object.keys(data).forEach(item => {
        if (item === "activityTag") {
          let arr = data[item].map(item1 => {
            return { ...item1, type: 1 };
          });
          tagsData = [...tagsData, ...arr];
        } else if (item === "companyTag") {
          let arr = data[item].map(item1 => {
            return { ...item1, type: 2 };
          });
          tagsData = [...tagsData, ...arr];
        } else if (item === "staffTag") {
          let arr = data[item].map(item1 => {
            return { ...item1, type: 3 };
          });
          tagsData = [...tagsData, ...arr];
        }
      });
      setTagIdList(tagsData);
    });
  };
  //增值产品数据处理方法
  const productTreeList = list => {
    let productTree = list.map(item => {
      return {
        searchValue: item.id,
        value: item.name + item.id,
        title: item.name,
        key: "preductTreeAs" + item.id,
        children: item.children.length > 0 ? productTreeList(item.children) : [],
      };
    });
    return productTree;
  };
  //重置方法
  const reset = () => {
    useSelectData(baseData);
    setSearchListData(baseSearchData);
    setCustomerValueSele("");
    setIsClick(true);
    setStockPoolModalSel([]);
    setStockPoolModalSelName([]);
  };
  const MyStockReset = () => {
    setControlAllSell(false);
    setStockPoolModalSearch("");
    setStockPoolModalSortField("code");
    setStockPoolModalSortType("asc");
    setStockPoolModalpageSize(10);
    setStockPoolModalpageNo(1);
  };
  //展示弹框方法
  const showModal = (type, text, record) => {
    if (type === 1) {
      setModalTitle("签约意愿(APP行为)");
      let textIn = text.split("、");
      textIn = textIn.map(item => {
        let list = item.split("_");
        return {
          productCode: list[0],
          productName: list[1],
          contractWill: list[2],
        };
      });
      let modal = Object.assign({}, modalList, { total: textIn.length });
      setModalList(modal);
      setModaListData(textIn);
      setModalLoading(false);
    } else {
      setModalTitle("订阅中的策略工具");
      GetCustomerSubscriptionProductResponse({
        pageNo: modalList.current,
        pageSize: modalList.pageSize,
        customerNO: record.customerNo,
      }).then(res => {
        let modal = Object.assign({}, modalList, { total: res.total });
        setModalList(modal);
        setModaListData(res.records);
        setModalLoading(false);
      });
    }
    setIsModalVisible(true);
    setModalOn(record.customerNo);
  };
  //查询数据方法
  const getCloumn = (page, pageS) => {
    console.log(stockPoolModalSel, "股票池子");
    setSelectAll(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    if (Object.prototype.toString.call(page) === "[object Object]") {
      setCurrent(1);
    }
    let toSearchList = { ...searchListData };
    (toSearchList.staffTagIdList = searchListData.tagIdList.staffTag || []),
    (toSearchList.companyTagIdList =
        searchListData.tagIdList.companyTag || []),
    (toSearchList.activityTagIdList =
        searchListData.tagIdList.activityTag || []),
    (toSearchList.productIdList = searchListData.productIdList[0] || []),
    (toSearchList.pageNo =
        Object.prototype.toString.call(page) === "[object Object]" ? 1 : page);
    toSearchList.pageSize = pageS || pageSize;
    delete toSearchList.tagIdList;
    setLoading(true);

    // let ab = {...toSearchList,
    //   productType:'1'}
    console.log(
      JSON.stringify({
        ...toSearchList,
        productType: "1",
        searchField: customerValueSele,
      }),
      "测试数据"
    );
    AddedProducted({
      ...toSearchList,
      productType: "1",
      stockPoolList: stockPoolTableAllSel ? [] : stockPoolModalSel,
      queryAllStockPool: stockPoolTableAllSel ? "1" : "2",
      searchField: customerValueSele,
    })
      .then(res => {
        setMd5(res.note);
        setLoading(false);
        setListData(res.records);
        setTotal(res.total);
      })
      .catch(err => {
        console.log(err);
      });
    setShowTable(true);
  };
  // const handleOk = () => {
  //   setIsModalVisible(false);
  //   setModalOn()
  // };
  //弹框关闭方法
  const handleCancel = () => {
    setIsModalVisible(false);
    setModalList({ pageSize: 10, current: 1, total: 0 });
    setModalOn();
    setModaListData([]);
    setModalLoading(true);
  };
  //弹框页面table
  const columnsModal = [
    {
      title: "序号",
      dataIndex: "productCode",
      key: "序号",
      render: (text, record, index) => {
        return (
          <span>
            {(modalList.current - 1) * modalList.pageSize + index + 1}
          </span>
        );
      },
      width: 77,
    },
    {
      title: "产品名称",
      dataIndex: "productName",
      key: "产品名称",
      render: (text, record) => {
        return (
          <div>
            <span>({record.productCode})</span>
            {record.productName}
            <span
              style={{
                color: "#FF663D",
                display: `${record.contractWill ? "inline-block" : "none"}`,
              }}
            >
              ({record.contractWill})
            </span>
          </div>
        );
      },
    },
  ];
  //弹框页面更改方法
  const modalOnchange = (page, pageSize) => {
    if (modalTitle == "签约意愿(APP行为)") {
      let modal = Object.assign({}, modalList, {
        current: page,
        pageSize: pageSize,
      });
      setModalList(modal);
      setModalLoading(false);
    } else {
      GetCustomerSubscriptionProductResponse({
        pageNo: page,
        pageSize: pageSize,
        customerNO: modalOn,
      }).then(res => {
        let modal = Object.assign({}, modalList, {
          total: res.total,
          current: page,
          pageSize: pageSize,
        });
        setModalList(modal);
        setModaListData(res.records);
        setModalLoading(false);
      });
    }
  };
  //用于增值产品下拉框取消搜索时展示全量数据
  const productList = tree => {
    setProductTree(tree);
  };
  //客户搜索框
  const customerValue = e => {
    setCustomerValueSele(e.target.value);
  };
  //弹框分页方法页码更改
  const modalSizeChange = (current, size) => {
    if (modalTitle == "签约意愿(APP行为)") {
      let modal = Object.assign({}, modalList, {
        current: current,
        pageSize: size,
      });
      setModalList(modal);
      setModalLoading(false);
    } else {
      GetCustomerSubscriptionProductResponse({
        pageNo: current,
        pageSize: size,
        customerNO: modalOn,
      }).then(res => {
        let modal = Object.assign({}, modalList, {
          total: res.total,
          current: current,
          pageSize: size,
        });
        setModalList(modal);
        setModaListData(res.records);
        setModalLoading(false);
      });
    }
    // setModalList(newList)
  };
  //传递给快捷服务的数据
  const getParam = () => {
    let toSearchList = { ...searchListData };
    (toSearchList.staffTagIdList = searchListData.tagIdList.staffTag || []),
    (toSearchList.companyTagIdList =
        searchListData.tagIdList.companyTag || []),
    (toSearchList.activityTagIdList =
        searchListData.tagIdList.activityTag || []),
    (toSearchList.productIdList = searchListData.productIdList[0]);
    // toSearchList.pageNo = current
    // toSearchList.pageSize = pageSize
    delete toSearchList.tagIdList;
    delete toSearchList.pageNo;
    delete toSearchList.pageSize;
    return {
      ...toSearchList,
      productType: "1",
      searchField: customerValueSele,
      stockPoolList: stockPoolTableAllSel ? [] : stockPoolModalSel,
      queryAllStockPool: stockPoolTableAllSel ? "1" : "2",
    };
  };

  const resetInput = () => {
    setIsClick(false);
  };

  // function getTextWith(text, fontStyle) {
  //   var canvas = document.createElement('canvas')
  //   var context = canvas.getContext('2d')
  //   context.font = fontStyle || '14px' // 设置字体样式，当然，也可以在这里给一个默认值
  //   var dimension = context.measureText(text)
  //   return dimension.width
  // }

  const getColumns = () => {
    return [
      {
        title: "客户姓名",
        dataIndex: "customerName",
        key: "姓名",
        width: 111,
        render: (text, record) => (
          <Link
            to={`/customerPanorama/customerInfo?customerCode=${record.customerNo}`}
            target="_blank"
          >
            {text}
          </Link>
        ),
      },
      {
        title: "客户号",
        dataIndex: "customerNo",
        key: "客户号",
        width: 184,
      },
      {
        title: "客户级别",
        dataIndex: "customerLevel",
        key: "客户级别",
        width: 110,
      },
      {
        title: "开户营业部",
        dataIndex: "department",
        key: "开户营业部",
        width: 180,
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "手机号",
        width: 180,
      },
      {
        title: "净资产",
        dataIndex: "netAssets",
        key: "净资产",
        width: 180,
      },
      {
        title: "客户持仓",
        dataIndex: "stockPool",
        key: "客户持仓",
        width: 200,
        render: (text, record) => {
          let textIn = text.split(",");
          textIn =
            textIn.length > 3
              ? textIn.slice(0, 3).join("、") + "...等" + textIn.length + "项"
              : textIn.join("、");
          return text ? (
            <Button
              onClick={() => {
                setMyCustomerNo(record.customerNo);
                setMyqueryAllStockPool(record.queryAllStockPool);
                setMystockPollList(record.stockPollList);
                setStockPoolModalCanControl(false);
                setStockPoolModalVis(true);
                console.log(
                  record.queryAllStockPool,
                  record.stockPollList,
                  record.customerNo
                );
                GetQueryCustomerStockPool({
                  customerNo: record.customerNo,
                  pageNo: stockPoolModalpageNo,
                  pageSize: stockPoolModalpageSize,
                  queryAllStockPool: record.queryAllStockPool,
                  stockPoolList: record.stockPollList,
                  sortField: stockPoolModalSortField,
                  sortType: stockPoolModalSortType,
                });
              }}
              style={{
                color: "#244FFF",
                background: "transparent",
                border: "none",
                whiteSpace: "normal",
              }}
            >
              {textIn}
            </Button>
          ) : (
            "--"
          );
        },
      },
      {
        title: () => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>签约意愿(APP行为)</div>
              <Popover
                placement="bottomRight"
                //getPopupContainer={() => document.getElementById("isWant")}
                //overlayClassName="isShowPover"
                overlayClassName="isShowPover2"
                content={
                  <span
                    style={{
                      background: "#474D64",
                      color: "#FFFFFF",
                      padding: 16,
                      width: 192,
                      boxSizing: "border-box",
                      display: "block",
                    }}
                  >
                    该签约意愿值依据客户对所选产品的浏览行为次数、停留时长，依照时间衰减规则进行评估，分值越高代表浏览时间距现在越近、浏览次数和停留时长越高
                  </span>
                }
                trigger="click"
              >
                <span
                  id="isWant"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "16px",
                    left: "-12px",
                    margin: "0 4px",
                  }}
                >
                  <img
                    className="iconSure"
                    src={IconSure}
                    alt=""
                    style={{ top: "-8px" }}
                  />
                </span>
              </Popover>
            </div>
          );
        },
        dataIndex: "productAndContractIntent",
        key: "签约意愿(APP行为)",
        width: 180,
        render: (text, record) => {
          let textIn = text.split("、");
          textIn = textIn.map(item => {
            let list = item.split("_");
            return list[1] + "(" + list[2] + ")";
          });
          textIn =
            textIn.length > 4
              ? textIn.slice(0, 4).join("、") + "...等" + textIn.length + "项"
              : textIn.join("、");
          return (
            text && (
              <Button
                onClick={() => showModal(1, text, record)}
                style={{
                  color: "#244FFF",
                  background: "transparent",
                  border: "none",
                  whiteSpace: "normal",
                }}
              >
                {textIn}
              </Button>
            )
          );
        },
      },
      {
        title: () => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>全提佣签约潜力</div>
              <Popover
                placement="bottomRight"
                //getPopupContainer={() => document.getElementById("isWant")}
                //overlayClassName="isShowPover"
                overlayClassName="isShowPover2"
                content={
                  <span
                    style={{
                      background: "#474D64",
                      color: "#FFFFFF",
                      padding: 16,
                      width: 192,
                      boxSizing: "border-box",
                      display: "block",
                    }}
                  >
                    全提佣潜力模型依据客户近一年的交易行为、交易风格、风险偏好等数据进行客户签约潜力打分，分值越高代表客户进行全提佣签约可能性越大，最高为1
                  </span>
                }
                trigger="click"
              >
                <span
                  id="isWant"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "16px",
                    left: "-12px",
                    margin: "0 4px",
                  }}
                >
                  <img
                    className="iconSure"
                    src={IconSure}
                    alt=""
                    style={{ top: "-8px" }}
                  />
                </span>
              </Popover>
            </div>
          );
        },
        dataIndex: "commissionPotential",
        key: "全提佣签约潜力",
        width: 180,
      },
      {
        title: "预估签约月贡献",
        dataIndex: "contractCommission",
        key: "预估签约月贡献",
        width: 180,
      },
      {
        title: "订阅中策略工具",
        dataIndex: "subscriptionProduct",
        key: "订阅中策略工具",
        width: 180,
        render: (text, record) => {
          let textIn = text.split("、");
          textIn =
            textIn.length > 4
              ? textIn.slice(0, 4).join("、") + "...等" + textIn.length + "项"
              : textIn.join("、");
          return (
            text && (
              <Button
                onClick={() => showModal(2, text, record)}
                style={{
                  color: "#244FFF",
                  background: "transparent",
                  border: "none",
                  whiteSpace: "normal",
                }}
              >
                {textIn}
              </Button>
            )
          );
        },
      },
      {
        title: "开发关系",
        dataIndex: "relationOfDev",
        key: "开发关系",
        width: 180,
      },
      {
        title: "服务关系",
        dataIndex: "relationOfService",
        key: "服务关系",
        width: 180,
      },
      {
        title: "是否当前断点客户",
        dataIndex: "interruptFlag",
        key: "是否当前断点客户",
        width: 180,
      },
    ];
  };
  const tableProps = {
    bordered: true,
    scroll: { x: true },
    rowKey: "key",
    dataSource: listData.map((item, index) => {
      return { ...item, key: (current - 1) * pageSize + index + 1 };
    }),
    columns: getColumns(),
    className: "m-Card-Table",
    pagination: {
      className: "m-bss-paging",
      showTotal: totals => {
        return `总共${totals}条`;
      },
      showLessItems: true,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      total,
      current,
      pageSize,
      onChange: (current, pageSize) => {
        setCurrent(current);
        setPageSize(pageSize);
        getCloumn(current, pageSize);
      },
      onShowSizeChange: (current, pageSize) => {
        (() => {
          setCurrent(current);
          setPageSize(pageSize), getCloumn(current, pageSize);
        })();
      },
    },
    rowSelection: {
      type: "checkbox",
      crossPageSelect: true, // checkbox默认开启跨页全选
      selectAll: selectAll,
      selectedRowKeys: selectedRowKeys,
      onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
        if (currentSelectedRowKeys.length === total) {
          currentSelectAll = true;
          currentSelectedRowKeys = [];
          selectedRows = [];
        }
        setSelectAll(currentSelectAll);
        setSelectedRowKeys(currentSelectedRowKeys);
        setSelectedRows(selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.status === 0, // Column configuration not to be checked
        name: record.status,
      }),
      fixed: true,
    },
    // onChange: this.handleTableChange,
  };

  return (
    <>
      <div style={{ padding: "22px 24px 0px 24px", background: "#fff" }}>
        <div className="selectArea">
          <span
            style={{ marginRight: "10px", color: "#1A2243", fontWeight: "500" }}
          >
            客户范围
          </span>
          <RadioSelect
            type="customerRange"
            plainOptions={options}
            showValue={selectData.customerRange}
            getRadioSelect={getRadioSelect}
          />
        </div>
        <div className="selectArea">
          <span
            style={{ marginRight: "8px", color: "#1A2243", fontWeight: "500" }}
          >
            客户
          </span>
          <Input
            placeholder="客户号/客户姓名/手机号"
            style={{
              width: "250px",
              height: "32px",
              lineHeight: "32px",
              borderRadius: "2px",
            }}
            value={customerValueSele}
            onChange={customerValue}
          />
        </div>
        <div
          className="NewSelectArea"
          style={{ marginTop: "-4px", marginRight: "36px" }}
        >
          <span
            style={{ marginRight: "8px", color: "#1A2243", fontWeight: "500" }}
          >
            增值产品
          </span>

          <NewTreeSelect
            minWidth='130px'
            tree={productTree}
            icClick={icClick}
            resetInput={resetInput}
            productLength={productLength}
            productList={productList}
            getRadioSelect={getRadioSelect}
            showValue={selectData.productIdList}
            type="productIdList"
          />
          <div
            className="MySelectArea"
            onClick={() => {
              console.log({
                pageSize: stockPoolModalpageSize, //每页显示的股票数量
                searchWord: stockPoolModalSearch, //搜索的股票名称
                pageNo: stockPoolModalpageNo, //当前页码
                sortField: stockPoolModalSortField, //排序字段
                sortType: stockPoolModalSortType, //排序方式
              });
              if (stockPoolModalShowOrHid) {
                setStockPoolModalVis(true);
                setStockPoolModalCanControl(true);
                GetstockPoolModalData({
                  pageSize: stockPoolModalpageSize, //每页显示的股票数量
                  searchWord: stockPoolModalSearch, //搜索的股票名称
                  pageNo: stockPoolModalpageNo, //当前页码
                  sortField: stockPoolModalSortField, //排序字段
                  sortType: stockPoolModalSortType, //排序方式
                });
              }
            }}
            style={{
              display: "inline-block",
              position: "relative",
              top: -1,
              left: 10,
            }}
          >
            {!stockPoolModalShowOrHid ? (
              <Popover
                placement="bottomLeft"
                getPopupContainer={() => document.getElementById("isWant2")}
                overlayClassName="isShowPover3"
                content={<span>仅在AI智能网格下可编辑股票池</span>}
                trigger="hover"
              >
                <div id="isWant2" style={{ height: "30px" }}>
                  <Select
                    loading={stockPoolModalLoading}
                    disabled={!stockPoolModalShowOrHid}
                    searchValue=""
                    allowClear={stockPoolTableAllSel ? false : true}
                    maxTagPlaceholder={value => (
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#FF6E30",
                          background: "transparent",
                        }}
                      >
                        {stockPoolTableAllSel
                          ? `...等${stockPoolModalTotal2}项`
                          : `...等${stockPoolModalSel.length}项`}
                      </span>
                    )}
                    placeholder="股票池"
                    mode="multiple"
                    //defaultValue="lucy"
                    style={{ minWidth: 120 }}
                    onChange={val => {
                      console.log(val, "val111");
                      if (val.length === 0) {
                        setStockPoolModalSel([]);
                        setStockPoolModalSelName([]);
                      }
                      //setStockPoolModalSel(val);
                    }}
                    maxTagCount={1}
                    maxTagTextLength={1}
                    value={stockPoolModalSel}
                    open={false}
                  >
                    {MyTestList.map(item => (
                      <Option key={item.code}>{item.name}</Option>
                    ))}
                  </Select>
                </div>
              </Popover>
            ) : (
              <Select
                loading={stockPoolModalLoading}
                disabled={!stockPoolModalShowOrHid}
                searchValue=""
                allowClear={stockPoolTableAllSel ? false : true}
                maxTagPlaceholder={value => (
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#FF6E30",
                      background: "transparent",
                    }}
                  >
                    {stockPoolTableAllSel
                      ? `...等${stockPoolModalTotal2}项`
                      : `...等${stockPoolModalSel.length}项`}
                  </span>
                )}
                placeholder="股票池"
                mode="multiple"
                //defaultValue="lucy"
                style={{ minWidth: 120 }}
                onChange={val => {
                  console.log(val, "val111");
                  if (val.length === 0) {
                    setStockPoolModalSel([]);
                    setStockPoolModalSelName([]);
                  }
                  //setStockPoolModalSel(val);
                }}
                maxTagCount={1}
                maxTagTextLength={1}
                value={stockPoolModalSel}
                open={false}
              >
                {MyTestList.map(item => (
                  <Option key={item.code}>{item.name}</Option>
                ))}
              </Select>
            )}
          </div>
        </div>
        <div
          className="selectArea"
          id="isDeptment"
          style={{ marginRight: "36px" }}
        >
          <span style={{ color: "#1A2243", fontWeight: "500" }}>
            开户营业部
          </span>
          <DeptmentList
            getPopupContainer={() => document.getElementById("isDeptment")}
            dept={selectData.dept}
            deptSearch={selectData.deptSearch}
            handleYybChange={handleYybChange}
            handleYybSearch={handleYybSearch}
            setStateChange={setStateChange}
          />
        </div>
        <div className="selectArea">
          <span style={{ color: "#1A2243", fontWeight: "500" }}>签约意愿</span>
          <Popover
            placement="bottomLeft"
            getPopupContainer={() => document.getElementById("isWant")}
            overlayClassName="isShowPover"
            content={
              <span>
                该签约意愿值依据客户对所选产品的浏览行为次数、停留时长，依照时间衰减规则进行评估，分值越高代表浏览时间距现在越近、浏览次数和停留时长越高
              </span>
            }
            trigger="click"
          >
            <span
              id="isWant"
              style={{
                position: "relative",
                display: "inline-block",
                width: "16px",
                left: "-12px",
                margin: "0 4px",
              }}
            >
              <img className="iconSure" src={IconSure} alt="" />
            </span>
          </Popover>
          <RadioSelect
            type="contractIntent"
            showValue={selectData.contractIntent}
            plainOptions={options1}
            getRadioSelect={getRadioSelect}
          />
        </div>
        {/* <div className="selectArea">
          <span style={{ color: "#1A2243", fontWeight: "500" }}>
            全提佣签约潜力
          </span>
          <Popover
            placement="bottomLeft"
            getPopupContainer={() => document.getElementById("isStrong")}
            overlayClassName="isShowPover"
            content={
              <span>
                全提佣潜力模型依据客户近一年的交易行为、交易风格、风险偏好等数据进行客户签约潜力打分，分值越高代表客户进行全提佣签约可能性越大，最高为1
              </span>
            }
            trigger="click"
          >
            <span
              id="isStrong"
              style={{
                position: "relative",
                display: "inline-block",
                width: "16px",
                left: "-12px",
                margin: "0 4px",
              }}
            >
              <img className="iconSure" src={IconSure} alt="" />
            </span>
          </Popover>
          <RadioSelect
            type="commissionContractIntent"
            plainOptions={options3}
            showValue={selectData.commissionContractIntent}
            getRadioSelect={getRadioSelect}
          />
        </div> */}
        <div className="selectArea" style={{ marginBottom: "0" }}>
          <span
            style={{
              display: "inline-block",
              width: "72px",
              lineHeight: "20px",
              color: "#1A2243",
              fontWeight: "500",
            }}
          >
            预估全提佣签约月贡献
          </span>
          <Popover
            placement="bottomLeft"
            getPopupContainer={() => document.getElementById("propVer")}
            overlayClassName="isShowPover iscommissionContractContribute"
            content={
              <span>
                预估值计算逻辑：取该客户近三个月的月均交易金额（含普通账号和信用账户），乘以所选产品的提佣率得到
              </span>
            }
            trigger="click"
          >
            <span
              id="propVer"
              style={{
                position: "relative",
                display: "inline-block",
                height: "10px",
                width: "16px",
                left: "-12px",
                margin: "0 4px",
              }}
            >
              <img className="iconSure" src={IconSure} alt="" />
            </span>
          </Popover>
          <span style={{ position: "relative", top: "-10px" }}>
            <RadioSelect
              type="commissionContractContribute"
              plainOptions={options2}
              showValue={selectData.commissionContractContribute}
              getRadioSelect={getRadioSelect}
            />
          </span>
        </div>
        <div
          className="selectArea"
          style={{ marginTop: "-4px", marginRight: "36px" }}
        >
          <span
            style={{ marginRight: "8px", color: "#1A2243", fontWeight: "500" }}
          >
            客户风险评级
          </span>
          <NewTreeSelect
            tree={tree1}
            isRight={true}
            resetInput={resetInput}
            icClick={icClick}
            showAllSel={false}
            showValue={selectData.riskEvaluationIdList}
            getRadioSelect={getRadioSelect}
            type="riskEvaluationIdList"
          />
        </div>
        <div className="selectArea" style={{ marginTop: "-4px" }}>
          <span
            style={{ marginRight: "8px", color: "#1A2243", fontWeight: "500" }}
          >
            客户级别
          </span>
          <NewTreeSelect
            tree={custom}
            isRight={true}
            resetInput={resetInput}
            icClick={icClick}
            showAllSel={false}
            showValue={selectData.customerLevelIdList}
            getRadioSelect={getRadioSelect}
            type="customerLevelIdList"
          />
        </div>
        <div
          className="selectArea"
          style={{ marginTop: "-4px", marginRight: "36px" }}
        >
          <span
            style={{ marginRight: "8px", color: "#1A2243", fontWeight: "500" }}
          >
            客户标签
          </span>
          <NewTreeSelect
            tree={tagIdList}
            isRight={true}
            resetInput={resetInput}
            icClick={icClick}
            showValue={selectData.tagIdList}
            getRadioSelect={getRadioSelect}
            type="tagIdList"
          />
        </div>
        <div
          className="selectArea"
          style={{ marginTop: "-4px", marginRight: "36px" }}
        >
          <span
            style={{ marginRight: "8px", color: "#1A2243", fontWeight: "500" }}
          >
            客户群
          </span>
          <NewTreeSelect
            tree={customerGroupIdList}
            resetInput={resetInput}
            icClick={icClick}
            showAllSel={false}
            isRight={true}
            showValue={selectData.customerGroupIdList}
            getRadioSelect={getRadioSelect}
            type="customerGroupIdList"
          />
        </div>
        <div className="selectArea">
          <span
            style={{ marginRight: "10px", color: "#1A2243", fontWeight: "500" }}
          >
            是否有全提佣签约产品
          </span>
          <RadioSelect
            type="contractedProductFlag"
            plainOptions={isPro}
            showValue={selectData.contractedProductFlag}
            getRadioSelect={getRadioSelect}
          />
        </div>
        <div className="selectArea">
          <span
            style={{
              marginRight: "10px",
              color: "#1A2243",
              fontWeight: "500",
              fontFamily: "PingFangSC-Medium, PingFang SC",
            }}
          >
            是否中断客户
          </span>
          <RadioSelect
            type="interruptFlag"
            plainOptions={isPro}
            showValue={selectData.interruptFlag}
            getRadioSelect={getRadioSelect}
          />
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: "4px",
            marginBottom: "24px",
          }}
        >
          <Button
            id="resetPro"
            style={{
              marginRight: "16px",
              width: "60px",
              height: "32px",
              borderRadius: "2px",
              border: "1px solid #D1D5E6 ",
              padding: 0,
            }}
            onClick={reset}
          >
            重置
          </Button>
          <Button
            style={{
              background: "#244FFF",
              color: "#fff",
              width: "60px",
              height: "32px",
              borderRadius: "2px",
              padding: 0,
            }}
            onClick={getCloumn}
          >
            查询
          </Button>
        </div>
      </div>
      {showTable ? (
        <div
          id="table-selectAll"
          style={{ padding: "0 24px 24px 24px", background: "#fff" }}
        >
          <TableBn
            total={total}
            selectAll={selectAll}
            selectedRows={selectedRows}
            getColumns={getColumns}
            param={getParam}
            md5={md5}
          />
          <BasicDataTable {...tableProps} loading={loading} />
          <Modal
            title={modalTitle}
            destroyOnClose
            centered
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            className="modalLink"
          >
            <div
              className="scrollBar-table"
              style={{ overflowY: "auto", maxHeight: "336px" }}
            >
              <Table
                columns={columnsModal}
                bordered
                className="modal-table"
                rowKey={(record, index) => {
                  return index;
                }}
                loading={modalLoading}
                dataSource={modaListData}
                pagination={{
                  current: modalList.current,
                  pageSize: modalList.pageSize,
                  total: modalList.total,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  // hideOnSinglePage:true,
                  onChange: modalOnchange,
                  onShowSizeChange: modalSizeChange,
                }}
              />
            </div>
          </Modal>
        </div>
      ) : (
        <div
          style={{
            height: "275px",
            background: "#f3f4f7",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", background: "red" }}></div>
        </div>
      )}
      <Modal
        className="zhiBiaoModal"
        destroyOnClose={true}
        maskClosable={false}
        width={960}
        title={
          <div className="stockPoolModalTitle">
            {stockPoolModalCanControl
              ? "AI智能网格股票池"
              : "客户持仓与所选股票池匹配的股票"}
            {stockPoolModalCanControl && (
              <span>（更新时间{stockPoolModalUpdate}）</span>
            )}
          </div>
        }
        visible={stockPoolModalVis}
        onCancel={() => {
          //在关闭的时候进行判断，如果什么都没选并且表格全选状态为false
          if (
            stockPoolModalSel.length === 0 &&
            stockPoolTableAllSel === false &&
            !stockPoolModalLoading
          ) {
            //就将状态转换
            setStockPoolTableAllSel(true);
            setStockPoolModalVis(false);
            MyStockReset();
          } else {
            setStockPoolModalVis(false);
            MyStockReset();
          }
        }}
        footer={
          stockPoolModalCanControl && [
            <Button
              style={{ borderRadius: "2px" }}
              key="back"
              onClick={() => {
                //在关闭的时候进行判断，如果什么都没选并且表格全选状态为false
                if (
                  stockPoolModalSel.length === 0 &&
                  stockPoolTableAllSel === false &&
                  !stockPoolModalLoading
                ) {
                  //就将状态转换
                  setStockPoolTableAllSel(true);
                  setStockPoolModalVis(false);
                  MyStockReset();
                } else {
                  setStockPoolModalVis(false);
                  MyStockReset();
                }
              }}
            >
              取消
            </Button>,
            <Button
              style={{ background: "#244FFF", borderRadius: "2px" }}
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => {
                //在关闭的时候进行判断，如果什么都没选并且表格全选状态为false
                if (
                  stockPoolModalSel.length === 0 &&
                  stockPoolTableAllSel === false &&
                  !stockPoolModalLoading
                ) {
                  //就将状态转换
                  setStockPoolTableAllSel(true);
                  setStockPoolModalVis(false);
                  MyStockReset();
                } else {
                  setStockPool(stockPoolModalSel);
                  setStockPoolModalVis(false);
                  MyStockReset();
                }
              }}
            >
              确定
            </Button>,
          ]
        }
      >
        {stockPoolModalCanControl && (
          <div className="maxStockPoolTop">
            <div className="stockPoolTop">
              <Search
                onChange={val => {
                  setStockPoolModalSearch(val.target.value);
                }}
                allowClear={true}
                placeholder="请输入"
                onSearch={value => {
                  value ? setControlAllSell(true) : setControlAllSell(false);
                  //setControlAllSell(true)
                  setStockPoolModalpageNo(1);
                  setStockPoolModalSearch(value);
                  GetstockPoolModalData(
                    {
                      pageSize: stockPoolModalpageSize, //每页显示的股票数量
                      searchWord: value, //搜索的股票名称
                      pageNo: 1, //当前页码
                      sortField: stockPoolModalSortField, //排序字段
                      sortType: stockPoolModalSortType, //排序方式
                    },
                    2
                  );
                }}
                style={{ width: 250 }}
              />
              <div
                className="stockPoolTopBtn"
                onClick={() => {
                  stockPoolModalSearch ? setControlAllSell(true) : setControlAllSell(false);
                  setStockPoolModalpageNo(1);
                  console.log(stockPoolModalSearch);
                  GetstockPoolModalData(
                    {
                      pageSize: stockPoolModalpageSize, //每页显示的股票数量
                      searchWord: stockPoolModalSearch, //搜索的股票名称
                      pageNo: 1, //当前页码
                      sortField: stockPoolModalSortField, //排序字段
                      sortType: stockPoolModalSortType, //排序方式
                    },
                    2
                  );
                }}
              >
                <span style={{ cursor: "default" }}>搜索</span>
              </div>
            </div>
          <>
          {/* <Button onClick={()=>setStockPoolTableAllSel(data => !data)}>
            {stockPoolTableAllSel?'选中全部股票池数据':'取消全部选中'}
          </Button> */}
          <TableBtn
            type={2}
            total={stockPoolModalTotal2}
            getColumns={()=>stockPoolTableColumns}
            param={()=>{
              return{
                pageSize: stockPoolModalpageSize, //每页显示的股票数量
                searchWord: stockPoolModalSearch, //搜索的股票名称
                pageNo: stockPoolModalpageNo, //当前页码
                sortField: stockPoolModalSortField, //排序字段
                sortType: stockPoolModalSortType, //排序方式
              };
            }}
          ></TableBtn>
          </>

          </div>
        )}

        {/* <Table
          rowSelection={rowSelection}
          //selectedRowKeys={stockPoolModalSel}
          onChange={val => {
            console.log(val);
          }}
          columns={stockPoolTableColumns}
          dataSource={stockPoolModalData}
          pagination={{
            showQuickJumper: true,
            defaultCurrent: 1,
            total: stockPoolModalTotal,
            showSizeChanger:true,
            onChange: (page, pageSize) => {
              console.log(page, pageSize,'page, pageSize');
              GetstockPoolModalData({
                annual: '2023',
                paging: 1,
                current: page,
                pageSize: 10,
                //sort:tablesort,
                depart: [],
                indexs: '[{"indexCode":"YE_RJ_XY","indexName":"日均两融余额","isDefault":"1","remark":"时点月份的所有客户状态的信用账户月度日均融资融券负债","importFlag":""},{"indexCode":"BYZC_JJTG_QM","indexName":"基金投顾期末保有市值","isDefault":"1","remark":"","importFlag":""},{"indexCode":"BYL_RJ_LC","indexName":"日均理财产品保有量","isDefault":"1","remark":"客户日均理财产品持仓市值（含报价回购、收益凭证、安信资管、私募等产品类型）","importFlag":""},{"indexCode":"QYH_TG_QMBY","indexName":"投顾签约期末保有户数","isDefault":"1","remark":"","importFlag":""},{"indexCode":"XSE_LCCP","indexName":"理财产品销售额","isDefault":"1","remark":"理财产品产品销售额","importFlag":""},{"indexCode":"SR_ZYYW","indexName":"主营业务净收入","isDefault":"1","remark":"","importFlag":""},{"indexCode":"KHS_ZDFY_QM","indexName":"期末中端富裕客户数","isDefault":"1","remark":"","importFlag":""},{"indexCode":"JZC_RJ","indexName":"日均净资产","isDefault":"1","remark":"时点月份的所有客户状态的客户的普通+信用+衍生品账户日均净资产（保证金+市值、不含信用账户负债）","importFlag":""}]',
                category:2,
                sort:"日均两融余额"
                //employee: popSelect,
                //category: Number(employeeCategory)
              });
            },
            onShowSizeChange:(current, size)=>{console.log(current, size,'current, size');},
          }}
        /> */}
        <div className="stockPoolModalTable">
          <Table
            scroll={{ y: 600 }}
            loading={stockPoolModalLoading}
            onChange={(data1, data2, data3) => {
              console.log("触发了ONchange");
              const soltType =
                data3.order === "ascend"
                  ? "asc"
                  : data3.order === "descend"
                    ? "desc"
                    : "";
              //同步当前的排序信息和分页信息
              setStockPoolModalSortField(data3.field); //排序字段
              setStockPoolModalSortType(soltType); //排序方式
              setStockPoolModalpageSize(data1.pageSize); //当前页数量
              setStockPoolModalpageNo(data1.current); //当前页
              if (stockPoolModalCanControl) {
                GetstockPoolModalData({
                  pageSize: data1.pageSize, //每页显示的股票数量
                  searchWord: stockPoolModalSearch, //搜索的股票名称
                  pageNo: data1.current, //当前页码
                  sortField: data3.field, //排序字段
                  sortType: soltType, //排序方式
                });
              } else {
                GetQueryCustomerStockPool({
                  customerNo: MyCustomerNo,
                  pageNo: data1.current,
                  pageSize: data1.pageSize,
                  queryAllStockPool: MyqueryAllStockPool,
                  stockPoolList: MystockPollList,
                  sortField: data3.field,
                  sortType: soltType,
                });
              }
            }}
            bordered
            rowKey={record => record.code}
            rowSelection={stockPoolModalCanControl ? rowSelectionzz : null}
            columns={stockPoolModalCanControl ? stockPoolTableColumns : ChiCang}
            dataSource={stockPoolModalData}
            pagination={{
              showQuickJumper: true,
              current: stockPoolModalpageNo,
              total: stockPoolModalTotal,
              pageSize: stockPoolModalpageSize,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                // console.log('触发了ONchangeFenye');
                // setStockPoolModalpageNo(page);
                // setStockPoolModalpageSize(pageSize);
                // console.log(page, pageSize, "page, pageSize");
                // if (stockPoolModalCanControl) {
                //   GetstockPoolModalData({
                //     pageSize: pageSize, //每页显示的股票数量
                //     searchWord: stockPoolModalSearch, //搜索的股票名称
                //     pageNo: page, //当前页码
                //     sortField: stockPoolModalSortField, //排序字段
                //     sortType: stockPoolModalSortType //排序方式
                //   });
                // } else {
                //   GetQueryCustomerStockPool({
                //     customerNo: MyCustomerNo,
                //     pageNo: page,
                //     pageSize: pageSize,
                //     queryAllStockPool: MyqueryAllStockPool,
                //     stockPollList: MystockPollList,
                //     sortField: stockPoolModalSortField,
                //     sortType: stockPoolModalSortType
                //   });
                // }
              },
              onShowSizeChange: (current, size) => {
                console.log(current, size, "current, size");
              },
            }}
          />
        </div>
      </Modal>
    </>
  );
});

export default SelectAll;
