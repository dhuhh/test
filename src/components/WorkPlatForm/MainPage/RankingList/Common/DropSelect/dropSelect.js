import React from "react";
import ReactDOM from "react-dom";
import {
  Input,
  DatePicker,
  Select,
  Divider,
  Checkbox,
  Button,
  Empty,
  Modal,
  message,
  Spin
} from "antd";
import "antd/dist/antd.css";
import locale from "antd/lib/date-picker/locale/zh_CN";
import "./dropSelect.css";
import defaultImg from "$assets/newProduct/customerPortrait/defaultGraph@2x.png";
import closeImg from "$assets/newProduct/staff/icon_tongyong_close1@2x.png";
import styles
  from '@/components/WorkPlatForm/MainPage/RankingList/Staff/staff.less';

// import 'moment/locale/zh-cn';
// import moment from 'moment';
// moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const { Search } = Input;
class InputCom extends React.Component {
  constructor(props) {
    super(props);
    this.SelectRef = React.createRef();
  }
  state = {
    selectList: [],
    selectListBeiFen:[],
    value: [],
    valueBeiFen: [],
    mainList: [],
    mainListBeiFen: [],
    searchValue:'',
    spinLoading:false
  };
  componentDidMount() {
    console.log(this.props.select, "组件中的");
    let result = [];
    let result2 = [];
    this.props.select.forEach(res => {
      if (res.isDefault === "1") {
        const resIndexName = res.indexName;
        result.push(resIndexName);
        result2.push(res);
      }
    });
    console.log(result, "indexName");
    this.setState({
      selectList: this.props.select,
      selectListBeiFen: this.props.select,
      value: result,
      valueBeiFen: result,
      mainList: result2,
      mainListBeiFen: result2
    });
  }

  handleClick = item => {
    const { value, mainList } = this.state;
    let newValue = [...value];
    let newMainList = [...mainList];
    if (newValue.includes(item.indexName)) {
      newValue.splice(newValue.indexOf(item.indexName), 1);
      newMainList.splice(newMainList.indexOf(item), 1);
    } else {
      newValue.push(item.indexName);
      newMainList.push(item);
    }
    console.log(newMainList,'newMainList');
    console.log(newValue,'newValue');
    this.setState({
      value: newValue,
      mainList: newMainList
    });
    this.props.dropSelectCallback(newMainList);
  };

  handleClera = e => {
    const { value, mainList } = this.state;
    let clearValue = [...value];
    let clearMainList = [...mainList];
    clearValue.splice(clearValue.indexOf(e), 1);
    clearMainList.splice(clearValue.indexOf(e), 1);
    this.setState({
      value: clearValue,
      mainList: clearMainList
    });
    this.props.dropSelectCallback(clearMainList);
  };
  //清除全部
  handleAllClera = () => {
    this.setState({
      value: this.state.valueBeiFen,
      mainList: this.state.mainListBeiFen
    });
    this.props.clearCallback(this.state.mainListBeiFen);
  };
  handleSearch = value => {
    this.searchFun(value)
  };
  searchFun=(value)=>{
    let initList = this.props.select.filter(item => {
      return item.indexName.includes(value);
    });
    this.setState({
      selectList: initList
    });
  }
  maxTagPlaceholder = value => {
    //console.log(value);
    const num = value.length + 1;
    return <span style={{color:"#FF6E30"}}>...等{num}项</span>;
  };

  //点击搜索指标之后的回调
  clickSearch = value => {
    this.setState({
      spinLoading:true
    })
    //console.log(this.state.selectListBeiFen, "selectListBeiFen",value);
    //遍历selectList
    let result=[]
    this.state.selectListBeiFen.forEach((item) => {
      //console.log(indexName, "indexName");
      if (item.indexName.includes(value)) {
        console.log(item.indexName);
        result.push(item);
      }
    })
    //console.log(this.state.selectListBeiFen.filter(item=>!item.indexName.indexOf(value)));
    this.setState({
      //selectList:this.state.selectListBeiFen.filter(item=>!item.indexName.indexOf(value))
      selectList: result
    });
    this.setState({
      spinLoading:false
    })
  }
  render() {
    const { selectList = [], value,mainList } = this.state;
    return (
      <div>
        {/*<Select*/}
        {/*  //searchValue={this.state.searchValue}*/}
        {/*  //dropdownClassName="m-tb-selectTree"*/}
        {/*  className="treeSelect-dropSelect-tab"*/}
        {/*  onDropdownVisibleChange={(open)=>{*/}
        {/*    open? this.searchFun(''):null*/}
        {/*  }}*/}
        {/*  ref={this.SelectRef}*/}
        {/*  mode="multiple"*/}
        {/*  labelInvalue*/}
        {/*  style={{ minWidth: 350 }}*/}
        {/*  maxTagTextLength={7}*/}
        {/*  onSearch={this.handleSearch}*/}
        {/*  placeholder="请选择"*/}
        {/*  value={value}*/}
        {/*  onDeselect={this.handleClera}*/}
        {/*  maxTagCount={1}*/}
        {/*  showArrow={true}*/}
        {/*  //suffixIcon={<Icon component={down} ></Icon>}*/}
        {/*  showSearch={false}*/}
        {/*  maxTagPlaceholder={value => this.maxTagPlaceholder(value)}*/}
        {/*  //自定义下拉菜单样式*/}
        {/*  dropdownRender={menu => (*/}
        {/*    <div style={{ marginTop: "5px" }}>*/}
        {/*      <div*/}
        {/*        style={{ maxHeight: "250px", overflow: "auto" }}*/}
        {/*        className={"dropSelect-option"}*/}
        {/*      >*/}
        {/*        {selectList.length > 0 ? (*/}
        {/*          selectList.map(item => (*/}
        {/*            <div*/}
        {/*              key={item.indexCode}*/}
        {/*              className={"dropSelect-option-item"}*/}
        {/*              onClick={() => this.handleClick(item)}*/}
        {/*            >*/}
        {/*              <div>{item.indexName}</div>*/}
        {/*              <Checkbox*/}
        {/*                checked={value.includes(item.indexName)}*/}
        {/*                style={{ paddingRight: "10px", }}*/}
        {/*              />*/}
        {/*            </div>*/}
        {/*          ))*/}
        {/*        ) : (*/}
        {/*          <Empty*/}
        {/*            image={defaultImg}*/}
        {/*            description="暂无数据"*/}
        {/*            style={{*/}
        {/*              height: "auto",*/}
        {/*              paddingTop: "20px",*/}
        {/*              paddingBottom: "20px"*/}
        {/*            }}*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*  >*/}
        {/*</Select>*/}
        <div className={styles.NewIndicatorEditing}>
          <div className={styles.NewIndicatorEditing_left}>
            <div className={styles.NewIndicatorEditing_leftT}>
              <span>指标名称</span>
                <Search
                  placeholder="指标名称"
                  onSearch={value => this.clickSearch(value)}
                  allowClear
                />
            </div>
            <Divider style={{marginBottom:'0px',marginTop:'16px'}}/>
            <div className={styles.NewIndicatorEditing_leftB}>
              <Spin spinning={this.state.spinLoading}>
                <div className={'NewIndicatorEditing_leftB_scroll'}>
                  {selectList.length > 0 ? (
                    selectList.map(item => (
                      <div
                        key={item.indexCode}
                        className={"dropSelect-option-item"}
                        onClick={() => this.handleClick(item)}
                      >
                        <Checkbox
                          checked={value.includes(item.indexName)}
                          style={{ paddingRight: "10px", }}
                        />
                        <div>{item.indexName}</div>

                      </div>
                    ))
                  ) : (
                    <Empty
                      image={defaultImg}
                      description="暂无数据"
                      style={{
                        height: "auto",
                        paddingTop: "20px",
                        paddingBottom: "20px"
                      }}
                    />
                  )}
                </div>
              </Spin>
            </div>
          </div>
          <div className={styles.NewIndicatorEditing_right}>
            <span>已选择了{mainList.length}个指标</span>
            <Divider />
            <div className={'NewIndicatorEditing_right_scroll'} >
              {mainList.length > 0 ? (
                mainList.map(item => (
                  <div
                    key={item.indexCode}
                    className={"dropSelect-option-item2"}

                  >
                    <div>{item.indexName}</div>
                    <img src={closeImg} style={{ width: 20 ,marginRight:10}} onClick={() => this.handleClick(item)}></img>
                    {/*<Checkbox*/}
                    {/*  checked={value.includes(item.indexName)}*/}
                    {/*  style={{ paddingRight: "10px", }}*/}
                    {/*/>*/}
                  </div>
                ))
              ) : (
                <Empty
                  image={defaultImg}
                  description="暂无数据"
                  style={{
                    height: "auto",
                    paddingTop: "20px",
                    paddingBottom: "20px"
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InputCom;
