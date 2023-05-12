import React, { useEffect, useState } from "react";
import { message } from "antd";
import Ebutton from "$components/eUi/Ebutton";
import Ebutton32 from "$components/eUi/Ebutton32";
import EbuttonS from "$components/eUi/EbuttonS";
import Epagination from "$components/eUi/Epagination";
import Einput from "$components/eUi/Einput";
import EtextArea from "$components/eUi/EtextArea";
import Emodal from "$components/eUi/Emodal";
// import Emessage from "$components/eUi/Emessage";
import EdatePicker from "$components/eUi/EdatePicker";
import EyearPicker from "$components/eUi/EyearPicker";
import EmonthPicker from "$components/eUi/EmonthPicker";
import ErangePicker from "$components/eUi/ErangePicker";
import ErangeMonthPicker from "$components/eUi/ErangeMonthPicker";
import Etable from "$components/eUi/Etable";
import EtableCheck from "$components/eUi/EtableCheck";
import EtableCheckBorder from "$components/eUi/EtableCheckBorder";
import EtableSmall from "$components/eUi/EtableSmall";
import EtreeSelectMul from "$components/eUi/EtreeSelectMul";
import EselectCheckAll from "$components/eUi/EselectCheckAll";
import EselectCheck from "$components/eUi/EselectCheck";
import Success from "$components/eUi/assets/success.svg";

const show = () => {
  return <img src={Success} alt="" />;
};
// message.success({ duration: 20 });

message.config({
  duration: 20,
});

export default function Eui(props) {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [selectAll, setSelectAll] = useState(false); // 全选
  const [show, setShow] = useState(false);
  const [treeValueMul, settreeValueM] = useState(["0-1", "打铁",'a']);
  const [selectValueMul, setSelectValueM] = useState(['3','1']);
  const [selectValue, setSelectValue] = useState(['4','5']);
  const [selectValueSing, setSelectValueS] = useState('3');

  const [loading, setLoading] = useState(false);

  const dataSource = [
    {
      fz: "雄狮组",
      jg: "私人财富中心(上海)",
      mbYxh: "3662",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "1245",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "928",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "1",
    },
    {
      fz: "雄狮组",
      jg: "私人财富中心(上海)",
      mbYxh: "1578",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "336",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "9198",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "2",
    },
    {
      fz: "雄狮组",
      jg: "深圳分公司",
      mbYxh: "5652",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "1024",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "9002",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "3",
    },
    {
      fz: "雄狮组",
      jg: "重庆分公司",
      mbYxh: "1205",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "177",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "9099",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "4",
    },
    {
      fz: "雄狮组",
      jg: "潮州分公司",
      mbYxh: "1826",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "618",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "929",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "5",
    },
    {
      fz: "雄狮组",
      jg: "北京分公司",
      mbYxh: "3274",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "588",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "9199",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "6",
    },
    {
      fz: "雄狮组",
      jg: "上海浦西分公司",
      mbYxh: "1694",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "246",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "9098",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "7",
    },
    {
      fz: "雄狮组",
      jg: "四川分公司",
      mbYxh: "2425",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "658",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "8970",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "8",
    },
    {
      fz: "雄狮组",
      jg: "汕头分公司",
      mbYxh: "2676",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "843",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "931",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "9",
    },
    {
      fz: "雄狮组",
      jg: "梅州分公司",
      mbYxh: "2923",
      wclMb: "0.0%",
      yxhZs: "0.0",
      pmKhs: "--",
      pmWcl: "--",
      khsYxh: "0",
      mbWxhjh: "1295",
      khsWxhjh: "0",
      khsWxhjhYxh: "0.0",
      yxhIb: "0",
      yxhAxgj: "0",
      name: "",
      jgId: "927",
      id: "",
      gxrq: "",
      rybh: "",
      ryxm: "",
      khh: "",
      khxm: "",
      khrq: "",
      zyxhSj: "",
      tzlx: "",
      ryid: "",
      xh: "10",
    },
  ];
  let columns = [
    {
      title: "序号",
      dataIndex: "xh",
      key: "序号",
      width: 70,
      align: "center",
    },
    {
      title: "组别",
      dataIndex: "fz",
      key: "组别",
      // width: 120
    },
    {
      title: "目标值(户)",
      dataIndex: "mbYxh",
      key: "目标值(户)",
      // width: 120
    },
    {
      title: "分支机构",
      dataIndex: "jg",
      key: "分支机构",
      // width: 230
    },
    {
      title: (
        <div>
          目标完
          <br />
          成率(%)
        </div>
      ),
      dataIndex: "wclMb",
      key: "目标完成率(%)",
      // width: 120
    },

    {
      title: (
        <div>
          新增有效户
          <br />
          数奖-排名
        </div>
      ),
      dataIndex: "pmKhs",
      key: "新增有效户数奖-排名",
      // width: 200
      // sorter: true
    },
    {
      title: (
        <div>
          新增有效户完
          <br />
          成率奖-排名
        </div>
      ),
      dataIndex: "pmWcl",
      key: "新增有效户完成率奖-排名",
      // width: 200
      // sorter: true
    },
  ];
  const treeData = [
    {
      title: "测试1",
      value: "1",
      children: [
        {
          title: "测试1-2",
          value: "1-2",
          children: [
            {
              title: "测试八个椎间盘美国文字",
              value: "0-1",
            },
            {
              title: "测试1-3-2",
              value: "AB",
            },
            {
              title: "测试1-3-3",
              value: "0-3",
            },
          ],
        },
        {
          title: "测试2-2",
          value: "2-2",
          children: [
            {
              title: "测试2-3-1",
              value: "0-4",
            },
            {
              title: "测试2-3-2",
              value: "打铁",
            },
            {
              title: "测试2-3-3",
              value: "0-6",
            },
          ],
        },
      ],
    },
    {
      title: "测试2",
      value: "2",
      children: [
        {
          title: "测试2-2",
          value: "2-2-1",
          children: [
            {
              title: "测试2-3-1",
              value: "0-7",
            },
            {
              title: "测试2-3-2",
              value: "xiao",
            },
            {
              title: "测试2-3-3",
              value: "0-9",
            },
          ],
        },
        {
          title: "测试2-2",
          value: "2-2-2",
          children: [
            {
              title: "测试2-3-1",
              value: "a",
            },
            {
              title: "测试2-3-2",
              value: "b",
            },
            {
              title: "测试2-3-3",
              value: "c",
            },
          ],
        },
      ],
    },
    {
      title: "测试2",
      value: "2-p",
      children: [
        {
          title: "测试2-2",
          value: "2-2-1-a",
          children: [
            {
              title: "测试2-3-1",
              value: "d",
            },
            {
              title: "测试2-3-2",
              value: "e",
            },
            {
              title: "测试2-3-3",
              value: "f",
            },
          ],
        },
        {
          title: "测试2-2",
          value: "2-2-2-a",
          children: [
            {
              title: "测试2-3-1",
              value: "g",
            },
            {
              title: "测试2-3-2",
              value: "h",
            },
            {
              title: "测试2-3-3",
              value: "u",
            },
          ],
        },
      ],
    },
  ];
  const dataList = [
    {
      name: "选项1中文8个字字",
      value: "1",
    },
    { name: "选项2", value: "2" },
    { name: "选项3", value: "3" },
    { name: "选项4", value: "4" },
    { name: "选项5", value: "5" },
    { name: "选项6", value: "6" },
    { name: "选项7", value: "7" },
  ];

  // 列表排序
  const onTableChange = (a, b, c) => {
    console.log("父组件", c);
  };

  const tableProps = {
    dataSource,
    columns,
    loading,
    scroll: { x: true },
    onChange: onTableChange,
  };
  const rowSelection = {
    type: "checkbox",
    crossPageSelect: true, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      setSelectAll(currentSelectAll);
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
    // getCheckboxProps: record => {
    //   return { disabled: record.auditingStatus !== "待审核" };
    // },
    fixed: true,
  };

  // 分页
  const handleTableChange = (pageSize, current) => {
    setCurrent(pageSize);
    true;
    setPageSize(current);
  };
  const treeChange = e => {
    console.log("父组件", e);
    settreeValueM(e);
  };
  const inputChangeM = e => {
    console.log("父组件", e);
    setSelectValueM(e);
  };
  const inputChange = e => {
    console.log("父组件", e);
    setSelectValue(e);
  };
  const inputChanges = e => {
    console.log("父组件", e);
    setSelectValueS(e);
  };
  const showModal = () => {
    setShow(true);
  };
  const showSuccess = () => {
    console.log("79879;lkl;");
    // Emessage.success("This is a normal message");
    // message.success("This is a normal message");
  };

  return (
    <React.Fragment>
      <div style={{ padding: "20px 20px" }}>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <Ebutton />
          <div style={{ marginLeft: 20 }}>
            <Ebutton types="main" />
          </div>
          <div style={{ marginLeft: 20 }}>
            <Ebutton
              text="次按钮"
              style={{ width: 112 }}
              options={{ disabled: true }}
            />
          </div>
          <div style={{ marginLeft: 20 }}>
            <Ebutton text="次按钮" style={{ width: 112 }} types="main" />
          </div>
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <Ebutton32 />
          <div style={{ marginLeft: 20 }}>
            <Ebutton32 options={{ disabled: true }} />
          </div>
          <div style={{ marginLeft: 20 }}>
            <Ebutton32 types="main" />
          </div>
          <div style={{ marginLeft: 20 }}>
            <Ebutton32 types="main" text="次按钮" />
          </div>
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <EbuttonS text="筛选按钮" />
          <div style={{ marginLeft: 20 }}>
            <EbuttonS text="筛选按钮" options={{ disabled: true }} />
          </div>
        </div>
        <div style={{ padding: "20px 0px" }}>
          <Epagination onChange={handleTableChange} options={{ total: 100 }} />
        </div>
        <div style={{ padding: "20px 0px" }}>
          <Epagination
            onChange={handleTableChange}
            options={{ size: "small", total: 80 }}
          />
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <div>
            <Einput onChange={inputChange} />
          </div>
          <div style={{ marginLeft: 20 }}>
            <EtextArea onChange={inputChange} />
          </div>
          <div style={{ marginLeft: 20 }}>
            <EtextArea onChange={inputChange} options={{ maxLength: 100 }} />
          </div>
          <div style={{ marginLeft: 40 }}>
            <div onClick={showModal}>点击弹窗Modal</div>
            <Emodal
              onChange={inputChange}
              visible={show}
              setVisible={setShow}
              options={{
                title: "提示内容",
                width: 500,
              }}
              content={"测试埃里克森决定了两款手机"}
            />
          </div>
          {/* <div style={{ marginLeft: 40 }}>
            <div onClick={showSuccess}>点击弹窗成功提示</div>
          </div> */}
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <div>
            <EdatePicker onChange={inputChange} options={{}} />
          </div>
          <div style={{ marginLeft: 20 }}>
            <EyearPicker onChange={inputChange} options={{}} />
          </div>
          <div style={{ marginLeft: 20 }}>
            <EmonthPicker onChange={inputChange} options={{}} />
          </div>
          <div style={{ marginLeft: 20 }}>
            <ErangePicker onChange={inputChange} options={{}} />
          </div>
          <div style={{ marginLeft: 20 }}>
            {/* <ErangeMonthPicker onChange={inputChange} options={{}} /> */}
          </div>
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <div>
            <EtreeSelectMul
              options={{
                multiple: true,
                treeCheckable: true,
                value: treeValueMul,
              }}
              treeData={treeData}
              onChange={treeChange}
            />
          </div>
          <div style={{ marginLeft: 20 }}>
            <EselectCheckAll
              options={{
                placeholder: "请选择你的内容",
                value: selectValueMul,
              }}
              onChange={inputChangeM}
              dataList={dataList}
            />
          </div>
          <div style={{ marginLeft: 20 }}>
            <EselectCheck
              options={{
                placeholder: "请选择你的内容",
                mode: "multiple",
                value: selectValue,
              }}
              onChange={inputChange}
              dataList={dataList}
            />
          </div>
          <div style={{ marginLeft: 20 }}>
            <EselectCheck
              options={{
                placeholder: "请选择你的内容",
                value: selectValueSing,
              }}
              onChange={inputChanges}
              dataList={dataList}
            />
          </div>
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <div style={{ width: 1500 }}>
            <Etable options={tableProps} />
          </div>
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <div style={{ width: 1500 }}>
            <EtableCheck
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
              rowKey={"mbYxh"}
            />
          </div>
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <div style={{ width: 1500 }}>
            <EtableCheckBorder
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
              rowKey={"mbYxh"}
            />
          </div>
        </div>
        <div style={{ padding: "20px 0px", display: "flex" }}>
          <div style={{ width: 1500 }}>
            <EtableSmall options={tableProps} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
