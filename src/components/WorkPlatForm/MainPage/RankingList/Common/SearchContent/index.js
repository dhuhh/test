import React, { Component } from "react";
import {
  Col,
  Row,
  Form,
  Button,
  message,
  TreeSelect,
  DatePicker,
  Select,
} from 'antd';
import moment from "moment";
import lodash from "lodash";
import { fetchUserAuthorityDepartment } from "$services/commonbase/userAuthorityDepartment";
import { FetchExcStaffList } from "$services/incidentialServices";
import ExecutiveDepartment from "../../Common/ExecutiveDepartment";
import TreeUtils from "../../../../../../utils/treeUtils";
import styles from "./index.less";
const { RangePicker } = DatePicker;

class SearchContent extends Component {
  constructor(props) {
    super(props);
    this.FormRef = React.createRef();
    this.state = {
      khyyb: {
        // 营业部
        isloading: true,
        dataLoaded: false,
        searchValue: "",
        datas: [],
        selected: []
      },
      zxbm: {
        isloading: true,
        dataLoaded: false,
        searchValue: "",
        datas: [],
        selected: [

        ]
      }, // 执行部门
      zxry: {
        isloading: true,
        dataLoaded: false,
        searchValue: "",
        datas: [],
        selected: []
      }, // 执行人员
      allYYB: [], // 所有营业部，未分级
      mode: ["month", "month"],
      showNum: 4,
      searchValueTwo: "",
      searchValue: "",
      searchValueThree: "",
      department: undefined, // 开户营业部
      onClickYYB: {},
      zdlx: "0"
    };
    this.fetchExcStaffListDebounce = lodash.debounce(
      this.fetchExcStaffList,
      300
    );
  }

  componentDidMount() {
    this.fetchGxyybList();
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    console.log(this.state.zxbm, "zxbm");
    this.testmethod(this.state.zxbm.datas)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  //递归，确定默认员工营业部是否存在
  testmethod = (nodes = [], arr = []) => {
    console.log('开始执行？？？',nodes);
    for (let item of nodes) {
      console.log(item);
      if (item.children && item.children.length) this.testmethod(item.children, arr);
    }
    return arr
  };
  updateDimensions = () => {
    // 窗口大小改变的时候调整固定
    const { documentElement } = document;
    const [body] = document.getElementsByTagName("body");
    let width =
      window.innerWidth || documentElement.clientWidth || body.clientWidth;
    let showNum = 4;
    if (width >= 1200 && width < 1600) {
      showNum = 3;
    }
    this.setState({
      showNum
    });
  };

  // 获取管辖营业部的数据
  fetchGxyybList = (zxbm = this.state.zxbm) => {
    const gxyybCurrent = zxbm;
    fetchUserAuthorityDepartment({
      paging: 0,
      current: 1,
      pageSize: 10,
      total: -1,
      sort: ""
    })
      .then(result => {
        const { code = 0, records = [] } = result;
        console.log(
          "🚀 ~ file: index.js:97 ~ SearchContent ~ records",
          records
        );
        let filterRecords = records.filter(
          res => res.orgtype === "2" || res.orgtype === "3"
        );
        console.log(filterRecords,'filterRecords');

        if (code > 0) {
          const datas = TreeUtils.toTreeData(
            filterRecords,
            {
              keyName: "yybid",
              pKeyName: "fid",
              titleName: "yybmc",
              normalizeTitleName: "label",
              normalizeKeyName: "value"
            },
            true
          );
          gxyybCurrent.datas = [];
          datas.forEach(item => {
            const { children } = item;
            gxyybCurrent.datas.push(...children);
          });
          gxyybCurrent.dataLoaded = true;
          this.setState({
            khyyb: gxyybCurrent,
            zxbm: gxyybCurrent,
            allYYB: records
          });
          if(filterRecords.filter(item=>item.yybid===this.props.userBasicInfo.orgid).length>=1){
            this.setState({
              zxbm: {
                // 执行部门
                ...this.state.zxbm,
                selected: [
                  {
                    label: this.props.userBasicInfo.orgname,
                    value: this.props.userBasicInfo.orgid
                  }
                ]
              }
            })
            this.props.setDept([this.props.userBasicInfo.orgid])
          }else{
            this.setState({
              zxbm: {
                // 执行部门
                ...this.state.zxbm,
                selected: [

                ]
              }
            })
          }
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  maxTagPlaceholder = value => {
    const num = 1 + value.length;
    return <span style={{ color: "#FF6E30" }}>...等{num}项</span>;
  };

  setQdValue = value => {
    this.props.form.setFieldsValue({ qd: value });
  };

  handlePanelChange = (value, mode) => {
    this.setState({
      mode: [
        mode[0] === "date" ? "month" : mode[0],
        mode[1] === "date" ? "month" : mode[1]
      ]
    });
    this.props.form.setFieldsValue({ cxsjqj: value });
  };

  // 表单提交
  handleSubmit = e => {
    //console.log(e);
    // e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     const { handleSubmit } = this.props;
    //     const { zxbm, khyyb } = this.state;
    //     if (handleSubmit) {
    //       const kssj = moment(values.cxsjqj[0]).format("YYYYMMDD");
    //       const jssj = moment(values.cxsjqj[1]).format("YYYYMMDD");
    //       const bmid = [];
    //       zxbm.selected.forEach(item => {
    //         bmid.push(item.value);
    //       });
    //       const yybid = [];
    //       khyyb.selected.forEach(item => {
    //         yybid.push(item.value);
    //       });
    //       const payload = {
    //         zdlx: this.state.zdlx,
    //         chnl: values.qd !== "" ? values.qd.join(",") : "", // 渠道来源
    //         tjzq: `${kssj},${jssj}`, // 统计周期
    //         zxbm: bmid.join(","), // 执行部门
    //         zxry:
    //           values.zxry !== "" && values.zxry !== undefined
    //             ? values.zxry.join(",")
    //             : "", // 执行人员
    //         mode: "0", // 查询类型 0|明细，1|总计
    //         dept: yybid.join(",")
    //       };
    //       this.setState({ searchValue: "" });
    //       this.setState({ searchValueTwo: "" });
    //       handleSubmit(payload);
    //     }
    //   }
    // });
  };

  // 清空表单
  resetSearchForm = () => {
    this.FormRef.current.clearSearchValue();
    this.setState(
      {
        zxbm: {
          // 执行部门
          ...this.state.zxbm,
          selected: []
        },
        khyyb: {
          // 执行部门
          ...this.state.khyyb,
          selected: []
        },
        zxry: {
          isloading: true,
          dataLoaded: false,
          searchValue: "",
          datas: [],
          selected: []
        },
        searchValue: "",
        searchValueTwo: "",
        department: undefined,
        zdlx: "0"
      },
      () => {
        this.props.form.resetFields();
        this.fetchExcStaffList();
      }
    );
  };

  setData = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  // 改变执行部门时重置执行人员
  resetUserValue = () => {
    this.props.form.setFieldsValue({ zxry: [] });
  };

  handleTreeSelectSearch = value => {
    this.setState({ searchValue: value });
    if (!this.state.zxbm.selected.length) {
      this.fetchExcStaffListDebounce(value);
    }
  };

  fetchExcStaffList = value => {
    const { zxry } = this.state;
    const params = {
      cxlx: "2",
      yyb: "",
      zt: "0",
      cxbs: value,
      current: 1,
      pageSize: 50,
      total: -1,
      paging: 1
    };
    FetchExcStaffList(params)
      .then(result => {
        console.log(result,'resultresultresultresultresult');
        const { code = 0, records = [] } = result;
        if (code > 0) {
          const ryList = [];
          records.forEach(item => {
            const temp = JSON.parse(JSON.stringify(item));
            temp.yhxm = item.yhxm + "（" + item.yhbh + "）";
            ryList.push(temp);
          });
          const zxryCurrent = zxry;
          const datas = TreeUtils.toTreeData(
            ryList,
            {
              keyName: "yhid",
              pKeyName: "orgid",
              titleName: "yhxm",
              normalizeTitleName: "label",
              normalizeKeyName: "value"
            },
            true
          );
          zxryCurrent.datas = [];
          datas.forEach(item => {
            const { children } = item;
            zxryCurrent.datas.push(...children);
          });
          zxryCurrent.dataLoaded = true;
          this.setData("zxry", zxryCurrent);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYYB = [] } = this.state;
    const util = (fid, title) => {
      if (fid === "0") return false;
      for (let item of allYYB) {
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
  };
  getByFatherdId = (fid, result) => {
    const { allYYB } = this.state;
    let childerNodes = allYYB.filter(item => item.fid === fid);
    if (childerNodes.length > 0) {
      childerNodes.forEach(item => {
        result.push(item);
        result = this.getByFatherdId(item.yybid, result);
      });
    }
    return result;
  };
  handleYybChange = (value, label, extra) => {
    const { khyyb, allYYB, onClickYYB } = this.state;
    const newkhyyb = JSON.parse(JSON.stringify(khyyb));
    const { selected: OldYYBSelected = [] } = newkhyyb;
    let treeNode = [];
    const triggerValue = extra.triggerValue;
    let onClickTime = onClickYYB[triggerValue] || 0;
    if (extra.triggerValue === "1") {
      treeNode = allYYB;
    } else {
      treeNode = this.getByFatherdId(extra.triggerValue, treeNode);
    }
    // 选中的父节点
    let faNode = allYYB.find(i => i.yybid === extra.triggerValue);
    if (treeNode.length > 0) {
      switch (onClickTime) {
        case 0:
          treeNode.forEach(item => {
            const exist = value.filter(Item => Item.value === item.yybid);
            if (exist.length === 0) {
              const Item = {
                label: item.yybmc,
                value: item.yybid
              };
              value.push(Item);
            }
          });
          newkhyyb.selected = value;
          onClickTime = 1;
          break;
        case 1:
          treeNode.forEach(item => {
            value = value.filter(Item => Item.value !== item.yybid);
          });
          value.push({
            label: faNode.yybmc,
            value: faNode.yybid
          });
          value = value.filter((item, index) => {
            return (
              value.findIndex(item1 => item1.value === item.value) === index
            );
          });
          newkhyyb.selected = value;
          onClickTime = 2;
          break;
        case 2:
          treeNode.forEach(item => {
            value = value.filter(Item => Item.value !== item.yybid);
          });
          value = value.filter(Item => Item.value !== triggerValue);
          newkhyyb.selected = value;
          onClickTime = 0;
          break;
        default:
          break;
      }
    } else if (!extra.checked && treeNode.length > 0) {
      const newOldSelected = JSON.parse(JSON.stringify(OldYYBSelected));
      newOldSelected.forEach((Item, fatherIndex) => {
        if (Item.value === extra.triggerValue) {
          newOldSelected.splice(fatherIndex, 1);
        }
      });
      treeNode.forEach(item => {
        newOldSelected.forEach((Item, index) => {
          if (Item.value === item.yybid) {
            newOldSelected.splice(index, 1);
          }
        });
      });
      newkhyyb.selected = newOldSelected;
    } else {
      newkhyyb.selected = value;
    }
    onClickYYB[triggerValue] = onClickTime;
    this.setState({
      searchValueThree: this.state.searchValueThree,
      onClickYYB: onClickYYB,
      khyyb: newkhyyb
    });
  };

  // 获取父节点下的所有子节点key
  getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        this.getCheckedKeys(item.props.children, array);
      }
    });
  };

  // 格式化treeSelectValue
  formatValue = department => {
    const { allYYB = [] } = this.state;
    department = department ? department.split(",") : [];
    return department.map(val => ({
      value: val,
      label: allYYB.find(item => item.yybid === val)?.yybmc
    }));
  };

  // 搜索营业部变化
  handleYybSearch = value => {
    this.setState({
      searchValueThree: value
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      qdObj,
      zdlxObj = []
    } = this.props;
    const { zxbm, zxry, mode, showNum, allYYB, searchValueTwo } = this.state;
    const lastMounte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return (
      <div className='adwdawdawdawdawd'>
        <Form
          layout="inline"
          onSubmit={this.handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            paddingTop: "15px",
            paddingRight:'30px'
          }}
        >
          <Form.Item
            className="m-form-item m-form-bss-item "
            label="营业部"
            style={{ alignItems: "center", display: "flex" }}
          >
            <ExecutiveDepartment
              userBasicInfo={this.props.userBasicInfo}
              wrappedComponentRef={this.FormRef}
              yYBOnChange={val => {
                this.props.yYBOnChange(val);
              }}
              resetUserValue={this.resetUserValue}
              searchValueTwo={searchValueTwo}
              onSearch={value => {
                this.setState({ searchValueTwo: value });
              }}
              zxbm={zxbm}
              zxry={zxry}
              allYYB={allYYB}
              searchType={true}
              setData={this.setData}
              maxTagPlaceholder={this.maxTagPlaceholder}
            />
          </Form.Item>

          <Form.Item
            className="m-form-item m-form-bss-item maomao"
            label="员工类别"
            style={{ alignItems: "center", display: "flex", lineHeight:'32px'}}
          >
            <Select
              //allowClear={true}
              placeholder={'请选择'}
              className={styles.maomao}
              style={{ width: "225px",paddingBottom:'0px' }}
              value={this.props.employeeCategory}
              onChange={val => {
                this.props.setEmployeeCategory(val)
                //setSelect(val);
              }}
            >
              {this.props.employeeCategoryArr.map(item => (
                <Option value={item.ibm}>{item.note}</Option>
              ))}
            </Select>
            {/*<ExecutiveDepartment*/}
            {/*  userBasicInfo={this.props.userBasicInfo}*/}
            {/*  wrappedComponentRef={this.FormRef}*/}
            {/*  yYBOnChange={val => {*/}
            {/*    this.props.yYBOnChange(val);*/}
            {/*  }}*/}
            {/*  resetUserValue={this.resetUserValue}*/}
            {/*  searchValueTwo={searchValueTwo}*/}
            {/*  onSearch={value => {*/}
            {/*    this.setState({ searchValueTwo: value });*/}
            {/*  }}*/}
            {/*  zxbm={zxbm}*/}
            {/*  zxry={zxry}*/}
            {/*  allYYB={allYYB}*/}
            {/*  searchType={true}*/}
            {/*  setData={this.setData}*/}
            {/*  maxTagPlaceholder={this.maxTagPlaceholder}*/}
            {/*/>*/}
          </Form.Item>

          <Form.Item
            className="m-form-item m-form-bss-item "
            label="员工"
            style={{ display: "flex", textAlign: "center" }}
          >
            {getFieldDecorator(
              "zxry",
              {}
            )(
              <TreeSelect
                getPopupContainer={triggerNode =>
                  triggerNode.parentElement || document.body
                }
                className={styles.gouzi}
                showSearch={true}
                onChange={val => {
                  this.props.yGOnChange(val);
                }}
                style={{ minWidth: "225px", borderRadius: "2px" }}
                //value={zxbm.selected}
                treeData={zxry.datas}
                // dropdownMatchSelectWidth={false}
                dropdownStyle={{ maxHeight: 400, overflowY: "auto" }}
                treeNodeFilterProp="title"
                placeholder="请选择"
                allowClear
                multiple
                treeDefaultExpandAll
                maxTagCount={1}
                maxTagPlaceholder={value => this.maxTagPlaceholder(value)}
                maxTagTextLength={7}
                treeCheckable={true}
                searchValue={this.state.searchValue}
                onSearch={this.handleTreeSelectSearch}
                autoClearSearchValue={false} // 阻止treeSelect当前选中树节点变化时重置searchValue的默认操作
              ></TreeSelect>
            )}
          </Form.Item>

          {/* <Button className='m-btn ant-btn m-bss-btn mr14' type="button" onClick={this.resetSearchForm}>重置</Button>
            <Button className='m-btn ant-btn m-btn-blue m-bss-btn' type="button" htmlType="submit">查询</Button> */}
        </Form>
      </div>

    );
  }
}
export default Form.create()(SearchContent);
