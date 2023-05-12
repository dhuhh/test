import React, { useEffect, useState, useRef } from "react";
import {
  Select,
  Table,
  TreeSelect,
  message,
  Modal,
  Button,
  Space,
  Icon,
  Divider,
  DatePicker
} from "antd";
import TableBtn from "../Common/Export/exportIndex";
import {
  QueryIndex,
  QueryDepartIndexValue //营业部排行
} from "$services/newProduct";
import styles from './department.less'
import "./department.less";
import moment from "moment";
import top1Img from "$assets/newProduct/staff/icon_my_top1@2x.png";
import top2Img from "$assets/newProduct/staff/icon_my_top2@2x.png";
import top3Img from "$assets/newProduct/staff/icon_my_top3@2x.png";
const topImg = [top1Img, top2Img, top3Img];
const { Option, OptGroup } = Select;

const fixedColumns = [
  {
    title: "排名",
    dataIndex: "RANKING",
    key: "RANKING",
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
    title: "营业部",
    dataIndex: "DEPARTNAME",
    width: 187,
    fixed: "left",
    align: "center"
  }
];
export default function Department() {
  const [current, setCurrent] = useState(1); //当前页码
  const [pageSize, setPageSize] = useState(10); //当前页长
  const [total, setTotal] = useState(); //总行数
  const [tableLoading, setTableLoading] = useState(false); //考核年度选择参数
  const [tablesort, setTablesort] = useState(""); //排序参数
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState(null);
  const [dropList, setDropList] = useState([]); //指标
  const [select, setSelect] = useState(moment().format("YYYY")); //考核年度
  const [yearSelect, setYearSelect] = useState(false); //考核年度
  const [yearSelectVal, setYearSelectVal] = useState(moment()); //考核年度
  //初始树状数据
  const [selectChild, setSelectChild] = useState([]);

  //页面开始请求列表数据
  useEffect(() => {
    const queryObj = {
      annual: select,
      paging: 1,
      current: current,
      pageSize: pageSize
    };
    getListData(queryObj);
  }, []);
  //请求员工可选指标列表
  useEffect(() => {
    QueryIndex({ annual: select })
      .then(res => {
        console.log("员工可选指标", res);
        const { records = [] } = res;
        setSelectChild(records);
        getColumnList(records);
      })
      .catch(res => {
        console.log(res);
      });
  }, []);
  //列表数据请求
  const getListData = requestData => {
    setTableLoading(true);
    QueryDepartIndexValue(requestData)
      .then(res => {
        const { records = [], total = 0 } = res;
        setTableData(records);
        setTotal(total);
        console.log(res);
        setTableLoading(false);
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
        setTableLoading(false);
      });
  };
  //动态生成列的方法
  const getColumnList = arr => {
    const newCol = arr.map((item, index) => {
      return {
        title: item.indexName,
        dataIndex: item.indexName,
        key: item.indexCode,
        width: arr.length - 1 === index ? "auto" : 210,
        align: "center",
        sorter: true,
        sortDirections: ["descend"]
      };
    });
    const newJJ = [...fixedColumns, ...newCol]; //合并动态表格
    setColumns(newJJ); //更新表格格式
  };

  //表格分页操作的回调
  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { field = "", order } = sorter;
    setTablesort(field);
    setCurrent(current);
    setPageSize(pageSize);
    const queryObj = {
      annual: select,
      paging: 1,
      current,
      pageSize,
      sort: field
    };
    if (order !== "descend") {
      delete queryObj.sort;
    }
    getListData(queryObj);
  };

  const getColumns = () => {
    const copyColumns = [...columns];
    return copyColumns;
  };
  const param = () => {
    const queryObj = {
      annual: select,
      current: current,
      pageSize: 0,
      indexs: JSON.stringify(dropList)
    };
    if (tablesort) {
      queryObj.sort = tablesort;
    } else if (dropList.length > 0) {
      queryObj.sort = dropList[0].indexName;
    } else if(selectChild.length>0) {
      queryObj.sort = selectChild[0].indexName;
    }else{
      queryObj.sort=''
    }
    return queryObj;
  };
  const handleYearOpenChange = status =>
    status ? setYearSelect(true) : setYearSelect(false);
  const handleYearPanelChange = value => {
      //queryStaffEfficiency({ annual: value.format("YYYY") });
      setYearSelect(false);
      setYearSelectVal(value);
      setSelect(value.format("YYYY"));
    };
  return (
    <div className="staff-m-list">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 80
        }}
      >
        <div style={{ display: "flex" }}>
          <div className="staff_input">
            <span className="font-color">考核年度</span>
            <DatePicker
            allowClear={false}
                className={styles.dateapaker}
                value={yearSelectVal}
                open={yearSelect}
                mode="year"
                placeholder={"请选择年份"}
                format="YYYY"
                onOpenChange={handleYearOpenChange}
                onPanelChange={handleYearPanelChange}
              />
          </div>
        </div>
        <div
          style={{
            marginLeft: 46
          }}
        >
          <Button
            style={{ marginRight: 16,borderRadius:'1px' }}
            onClick={() => {
              setYearSelectVal(moment())
              setSelect(moment().format("YYYY"));
            }}
          >
            重置
          </Button>
          <Button
            style={{ background: "#244FFF",borderRadius:'1px' }}
            type="primary"
            onClick={() => {
              const queryObj = {
                annual: select,
                paging: 1,
                current: current,
                pageSize: pageSize,
                indexs: JSON.stringify(dropList)
              };
              if (tablesort) {
                queryObj.sort = tablesort;
              } else if (dropList.length > 0) {
                console.log(dropList);
                queryObj.sort = dropList[0].indexName;
              } else if(selectChild.length>0) {
                queryObj.sort = selectChild[0].indexName;
              }else{
                queryObj.sort=''
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
        <div style={{display:'flex',textAlign:'center',marginTop:'20px'}}>
          <span className="kaohe_after"></span>
          <span className="kaoheTitle">考核排行</span>
        </div>
        <div>
          <div style={{ display: "flex" }}>
          <TableBtn
            type={1}
            total={total}
            getColumns={getColumns}
            param={param}
          ></TableBtn>
        </div>
        </div>
      </div>
      <div>
        <Table
          rowKey={record => record.ROW_ID}
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
            showTotal: (total, range) => `总共${total}条`,
            pageSize: pageSize,
            total: total
          }}
          onChange={handleTableChange} //表格操作回调
        />
      </div>
    </div>
  );
}
