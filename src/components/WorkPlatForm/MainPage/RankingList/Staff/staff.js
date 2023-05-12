import React, { useEffect, useState, useRef } from "react";
import questionImg from "$assets/newProduct/customerPortrait/question-mark.png";
import {
  Select,
  Table,
  TreeSelect,
  message,
  Modal,
  Button,
  Divider,
  Popover,
  Input
} from "antd";
import { connect } from "dva";
import moment from "moment";
/* import {
  StarOutlined,
  StarFilled,
  StarTwoTone,
  DownOutlined
} from "@ant-design/icons"; */
import { EncryptBase64 } from "../../../../Common/Encrypt/index";
import TableBtn from "../Common/Export/exportIndex";
import TreeUtils from "$utils/treeUtils";
import InputCom from "../Common/DropSelect/dropSelect";
import { fetchUserAuthorityDepartment } from "$services/commonbase/userAuthorityDepartment";
import SearchContent from "../Common/SearchContent";
import {
  //QueryEmpInfo,
  QueryStaffIndexValue, //员工排行
  QueryIndex
} from "$services/newProduct";
import styles from "./staff.less";
import "./staff.less";
import top1Img from "$assets/newProduct/staff/icon_my_top1@2x.png";
import top2Img from "$assets/newProduct/staff/icon_my_top2@2x.png";
import top3Img from "$assets/newProduct/staff/icon_my_top3@2x.png";
// import test from "../test";
import { Link } from "umi";
const topImg = [top1Img, top2Img, top3Img];
const { Option } = Select;
const { Search } = Input;

//const { TreeNode } = TreeSelect;

const Department = ({ dictionary, userBasicInfo }) => {
  //console.log(userBasicInfo,'userBasicInfo');
  const fixedColumns = [
    {
      title: "排名",
      dataIndex: "RANKING",
      key: "STAFFID",
      fixed: "left",
      align: "center",
      width: 187,
      render: (_, record) => {
        const { RANKING } = record;
        const NpaiMing = Number(RANKING);
        //目前根据mock数据判断，后续根据接口判断
        return (
          <>
            {NpaiMing < 4 ? (
              <img src={topImg[NpaiMing - 1]} style={{ width: 30 }} />
            ) : (
              <span>{NpaiMing}</span>
            )}
          </>
        );
      }
    },
    {
      title: "员工",
      dataIndex: "STAFFNAME",
      width: 187,
      fixed: "left",
      align: "center",
      render: (item, record) => {
        //console.log(item,record);
        /* return <span>{item}({record.MKTGNO})</span> */
        return (
          <Link
            className={styles.testLink}
            target={"_blank"}
            to={`/newProduct/xqing/${EncryptBase64(
              JSON.stringify({
                id: record.USERID,
                year: select,
                name: record.STAFFNAME
              })
            )}`}
          >
            {item}({record.MKTGNO})
          </Link>
        );
      }
    },
    {
      title: "营业部",
      dataIndex: "DEPARTNAME",
      width: 187,
      fixed: "left",
      align: "center"
    }
  ];
  //备用本地员工类别
  const employeeCategoryData = [
    {
      ibm: "1",
      note: "经纪人"
    },
    {
      ibm: "2",
      note: "财富顾问"
    },
    {
      ibm: "3",
      note: "投资顾问"
    },
    {
      ibm: "4",
      note: "其他"
    }
  ]; //员工类别数组
  const [current, setCurrent] = useState(1); //当前页码
  const [pageSize, setPageSize] = useState(10); //当前页长
  const [total, setTotal] = useState(); //总行数
  const [tableLoading, setTableLoading] = useState(false); //考核年度选择参数
  const [tablesort, setTablesort] = useState(""); //排序参数
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState(null);
  const [select, setSelect] = useState(moment().format("YYYY")); //考核年度
  const [popSelect, setPopSelect] = useState(); //员工
  const [employeeCategory, setEmployeeCategory] = useState("2"); //员工类别
  const [dept, setDept] = useState([]); //营业部营业部当前选中的值
  const [departments, setDepartments] = useState([]); //转换之后组件读取的树状数据
  const [visible, setVisible] = useState(false);
  const [allYyb, setAllYyb] = useState(); //初始树状数据
  const [selectChild, setSelectChild] = useState([]); //员工可选指标列表（全部）
  const [defaultSelectChild, setDefaultSelectChild] = useState([]); //员工可选指标列表（默认）
  const [yearSelectVal, setYearSelectVal] = useState(moment()); //考核年度
  const dateArr = dictionary["TPRFM_YEAR"] || []; //年份字典
  //员工类别，若获取不到就启用本地员工类别数据
  const employeeCategoryArr = dictionary["TPRFM_RYLB"] || employeeCategoryData;
  const InputComRef = useRef();
  const FormRef = useRef();

  //组件渲染完成的时候请求树状数据
  useEffect(() => {
    getDepartments();
    console.log(employeeCategoryArr, "employeeCategoryArr");
  }, []);

  //请求员工可选指标列表
  useEffect(() => {
    QueryIndex({ annual: select })
      .then(res => {
        const { records = [] } = res;
        console.log(records, "records");
        //过滤出为空的无效指标
        setSelectChild(records.filter(res => res.indexName !== ""));
        //过滤出默认指标
        setDefaultSelectChild(filterSelectChild(records));
      })
      .catch(res => {
        //console.log(res, "可选指标出错了");
      });
  }, []);
  //列表数据请求
  const getListData = requestData => {
    setTableLoading(true);
    QueryStaffIndexValue(requestData)
      .then(res => {
        const { records = [], total = 0 } = res;
        setTableData(records);
        setTotal(total);
        setTableLoading(false);
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
        setTableLoading(false);
      });
  };
  //过滤器函数，作用是将员工指标列表中的可选项过滤出来
  const filterSelectChild = data => {
    const result = data.filter(res => res.isDefault === "1");
    return result;
  };
  //递归，确定默认员工营业部是否存在
  const testmethod = (nodes = [], arr = []) => {
    for (let item of nodes) {
      console.log(item);
      if (item.children && item.children.length)
        this.testmethod(item.children, arr);
    }
    return arr;
  };
  //动态生成列的方法
  const getColumnList = (arr = []) => {
    const newCol = arr.map((item, index) => {
      return {
        title: () => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "nowrap"
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>{item.indexName}</span>
              {item.remark.length ? (
                <Popover
                  overlayClassName={styles.indexDetail}
                  arrowPointAtCenter={true}
                  content={
                    <div
                      style={{
                        background: "#474D64",
                        color: "#FFFFFF",
                        padding: 16,
                        width: 192,
                        boxSizing: "border-box"
                      }}
                    >
                      {item.remark}
                    </div>
                  }
                  title={null}
                  placement="bottomLeft"
                  trigger="hover"
                >
                  <img
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: "-2px",
                      marginLeft: 2
                    }}
                    src={questionImg}
                    alt=""
                  />
                </Popover>
              ) : (
                ""
              )}
            </div>
          );
        },
        render: renderItem => {
          if (item.importFlag)
            return renderItem ? <span>{renderItem}</span> : <span>-</span>;
          else return renderItem ? <span>{renderItem}</span> : <span>0</span>;
        },
        dataIndex: item.indexName,
        key: item.indexCode,
        width: arr.length - 1 === index ? "auto" : 230,
        align: "center",
        sorter: true,
        sortDirections: ["descend"]
      };
    });
    const newJJ = [...fixedColumns, ...newCol]; //合并动态表格
    setColumns(newJJ); //更新表格格式
  };

  const getDepartments = () => {
    fetchUserAuthorityDepartment()
      .then(result => {
        const { records = [] } = result;
        const datas = TreeUtils.toTreeData(
          records,
          {
            keyName: "yybid",
            pKeyName: "fid",
            titleName: "yybmc",
            normalizeTitleName: "title",
            normalizeKeyName: "value"
          },
          true
        );
        let departments = [];
        datas.forEach(item => {
          const { children } = item;
          departments.push(...children);
        });
        setDepartments(departments);
        setAllYyb(records);
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };
  // 格式化treeSelectValue
  /*   const formatValue = dept => {
    return dept.map(val => ({
      value: val,
      label: allYyb.find(item => item.yybid === val)?.yybmc
    }));
  }; */
  /* const filterTreeNode = (inputValue, treeNode) => {
    const util = (fid, title) => {
      if (fid === "0") return false;
      for (let item of allYyb) {
        if (item.yybid === fid) {
          if (item.yybmc.indexOf(inputValue) > -1) {
            return true;
          } else {
            util(item.fid);
          }
          break;
        }
      }
    };
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    } else {
      return util(treeNode.props.fid, treeNode.props.title);
    }
  }; */
  // 选中营业部变化
  /* const handleYybChange = (value, label, extra) => {
    let valueList = [...valueBak];
    if (value.length) {
      const array = [];
      array.push(extra.triggerValue);
      getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        //console.log(array, "array", valueList);
        array.forEach(item => {
          if (valueList.indexOf(item) === -1) valueList.push(item);
        });
      } else {
        array.forEach(item => {
          if (valueList.indexOf(item) > -1)
            valueList.splice(valueList.indexOf(item), 1);
        });
      }
    } else {
      valueList = [];
    }
    // this.props.setStateChange({ deptSearch: this.props.deptSearch, dept });
    setDept(valueList);
    setValueBak(valueList);
    setDeptSearch(deptSearch);
  }; */
  /* const maxTagPlaceholder = value => {
    const num = 1 + value.length;
    return <span>...等{num}项</span>;
  }; */

  // 获取父节点下的所有子节点key
  const getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        getCheckedKeys(item.props.children, array);
      }
    });
  };
  //表格分页操作的回调
  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { field = "", order = "" } = sorter;
    setTablesort(field);
    setCurrent(current);
    setPageSize(pageSize);
    const queryObj = {
      annual: select,
      paging: 1,
      current,
      pageSize,
      depart: dept,
      indexs: JSON.stringify(defaultSelectChild),
      employee: popSelect,
      category: Number(employeeCategory)
    };
    if (field !== "" && order === "descend") {
      queryObj.sort = field;
    } else if (defaultSelectChild.length > 0) {
      queryObj.sort = defaultSelectChild[0].indexName;
    } else if (selectChild.length > 0) {
      queryObj.sort = selectChild[0].indexName;
    } else {
      queryObj.sort = "";
    }
    getListData(queryObj);
  };
  //此方法为清空所有查询参数
  const clearAllQueryData = () => {
    setYearSelectVal(moment());
    setSelect(moment().format("YYYY"));
    setDept([]);
    setPopSelect();
    setEmployeeCategory("2");
  };
  /* const handleYearPanelChange = value => {
    setYearSelect(false);
    setYearSelectVal(value);
    setSelect(value.format("YYYY"));
  }; */
  const getColumns = () => {
    const copyColumns = [...columns];
    return copyColumns;
  };
  const param = () => {
    const queryObj = {
      annual: select,
      current: current,
      pageSize: 0,
      indexs: JSON.stringify(defaultSelectChild),
      depart: dept,
      employee: popSelect,
      category: Number(employeeCategory)
    };
    if (tablesort) {
      queryObj.sort = tablesort;
    } else if (defaultSelectChild.length > 0) {
      queryObj.sort = defaultSelectChild[0].indexName;
    } else if (selectChild.length > 0) {
      queryObj.sort = selectChild[0].indexName;
    } else {
      queryObj.sort = "";
    }
    return queryObj;
  };

  return (
    <div className="staff-m-list">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: 80,
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex" }}>
          <div className={styles.staff_input} id="myStaffInput">
            <span className="font-color">考核年度</span>
            <Select
              style={{ width: "225px" }}
              value={select}
              onChange={val => {
                setSelect(val);
              }}
            >
              {dateArr.map(item => (
                <Option value={item.note}>{item.note}</Option>
              ))}
            </Select>
          </div>

          {/*员工类别选择框*/}
          {/*<div className={styles.staff_input} id="myStaffInput">
            <span className="font-color">考核年度</span>
            <Select
              style={{ width: "225px" }}
              value={select}
              onChange={val => {
                setSelect(val);
              }}
            >
              {dateArr.map(item => (
                <Option value={item.note}>{item.note}</Option>
              ))}
            </Select>
          </div>*/}

          <SearchContent
            yGOnChange={val => {
              setPopSelect(val);
            }}
            yYBOnChange={val => {
              let test = [];
              test = val.map(item => item.value);
              setDept(test);
            }}
            employeeCategoryData={employeeCategoryData}
            employeeCategory={employeeCategory}
            setEmployeeCategory={setEmployeeCategory}
            userBasicInfo={userBasicInfo}
            wrappedComponentRef={FormRef}
            setDept={setDept}
            employeeCategoryArr={employeeCategoryArr}
          />
        </div>
        {/* 编辑指标和导出按钮 */}
        <div
          style={
            {
              // marginLeft: 46,
            }
          }
        >
          <Button
            className={styles.resetButton}
            style={{ marginRight: 16, borderRadius: "1px" }}
            onClick={() => {
              FormRef.current.resetSearchForm();
              clearAllQueryData();
            }}
          >
            重置
          </Button>
          <Button
            style={{
              background: "#244FFF",
              borderRadius: "2px",
              borderColor: "#244FFF"
            }}
            type="primary"
            onClick={() => {
              //点击查询时首先根据当前默认指标构建表格结构
              getColumnList(defaultSelectChild);
              const queryObj = {
                annual: select,
                paging: 1,
                current: current,
                pageSize: pageSize,
                //sort:tablesort,
                depart: dept,
                indexs: JSON.stringify(defaultSelectChild),
                employee: popSelect,
                category: Number(employeeCategory)
              };
              if (tablesort) {
                queryObj.sort = tablesort;
              } else if (defaultSelectChild.length > 0) {
                queryObj.sort = defaultSelectChild[0].indexName;
              } else if (selectChild.length > 0) {
                queryObj.sort = selectChild[0].indexName;
              } else {
                queryObj.sort = "";
              }
              getListData(queryObj);
            }}
          >
            查询
          </Button>
        </div>
      </div>
      <Divider className="MyDriver" />
      <div className="kaoheTable_top">
        <div style={{ display: "flex", textAlign: "center" }}>
          <span className="kaohe_after"></span>
          <span className="kaoheTitle">考核排行</span>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <Button
              className={styles.bianjiButton}
              onClick={() => {
                setVisible(true);
              }}
            >
              编辑指标
            </Button>
            <TableBtn
              type={2}
              total={total}
              getColumns={getColumns}
              param={param}
            ></TableBtn>
          </div>
        </div>
      </div>
      <div className={styles.modalTable}>
        <Table
          loading={tableLoading}
          rowClassName={(_, index) => (index % 2 == 0 ? "even" : "odd")} //动态决定类名
          scroll={{ x: "max-content" }}
          bordered={true} //边框
          columns={columns} //表格结构定义
          dataSource={tableData} //表格数据
          pagination={{
            current: current,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `总共${total}条`,
            pageSize: pageSize,
            total: total
          }}
          onChange={handleTableChange} //表格操作回调
        />
      </div>

      {/* 指标编辑模块*/}
      <Modal
        wrapClassName={styles.zhiBiaoModal}
        maskClosable={false}
        bodyStyle={{ background: "#F2F3F7" }}
        width="653px"
        title="编辑指标"
        centered={true}
        visible={visible}
        onCancel={() => {
          if (defaultSelectChild.length === 0) {
            message.warning("默认指标不能为空！");
          } else if (defaultSelectChild.length > 20) {
            message.warning("同时展示的默认指标不能大于20个！");
          } else {
            setVisible(false);
          }
        }}
        footer={[
          <Button
            style={{ marginRight: 16, borderRadius: "1px" }}
            //onClick={() => InputComRef.current.handleAllClera()}
            onClick={() => {
              if (defaultSelectChild.length === 0) {
                message.warning("默认指标不能为空！");
              } else if (defaultSelectChild.length > 20) {
                message.warning("同时展示的默认指标不能大于20个！");
              } else {
                setVisible(false);
              }
            }}
          >
            &nbsp;取消&nbsp;
          </Button>,
          <Button
            style={{ background: "#244FFF", borderRadius: "1px" }}
            type="primary"
            onClick={() => {
              if (defaultSelectChild.length === 0) {
                message.warning("默认指标不能为空！");
              } else if (defaultSelectChild.length > 20) {
                message.warning("同时展示的默认指标不能大于20个！");
              } else {
                setVisible(false);
                getColumnList(defaultSelectChild);
                const queryObj = {
                  annual: select,
                  paging: 1,
                  current: current,
                  pageSize: pageSize,
                  depart: dept,
                  indexs: JSON.stringify(defaultSelectChild),
                  employee: popSelect,
                  category: Number(employeeCategory)
                };
                if (tablesort) {
                  queryObj.sort = tablesort;
                } else if (defaultSelectChild.length > 0) {
                  queryObj.sort = defaultSelectChild[0].indexName;
                } else if (selectChild.length > 0) {
                  queryObj.sort = selectChild[0].indexName;
                } else {
                  queryObj.sort = "";
                }
                getListData(queryObj);
              }
            }}
          >
            &nbsp;确定&nbsp;
          </Button>
        ]}
      >
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/*<span style={{ marginRight: "8px", marginLeft: "25px" }}>指标</span>*/}
            <InputCom
              select={selectChild}
              ref={InputComRef}
              dropSelectCallback={res => {
                setDefaultSelectChild(res);
              }}
              clearCallback={(res = []) => {
                setDefaultSelectChild(res);
              }}
            />
          </div>
        </>
      </Modal>
    </div>
  );
};
export default connect(({ global }) => ({
  authorities: global.authorities, //获取用户功能权限点
  dictionary: global.dictionary, //字典信息
  userBasicInfo: global.userBasicInfo //用户基本信息
}))(Department);
