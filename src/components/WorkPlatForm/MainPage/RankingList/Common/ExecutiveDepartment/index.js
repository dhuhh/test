/* eslint-disable array-callback-return */
import React from 'react';
import { Form, TreeSelect, message } from 'antd';
import lodash from 'lodash';
import TreeUtils from '../../../../../../utils/treeUtils';
import { FetchOptionalUserList, FetchExcStaffList } from '../../../../../../services/incidentialServices';
import TipModal from '../TipModal';
import styles from './index.less'
class ExecutiveDepartment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      content: '',
      onClickYYB: {},
      searchValueTwo: '',

    };
  }
  componentDidMount() {
    const { zxbm, setData, special = 0,userBasicInfo } = this.props;
    if (!special) {
      setTimeout(() => {
        if (!zxbm.selected.length) {
          const { datas = [] } = zxbm;
          if (datas.length) {
            console.log(this.props.userBasicInfo.orgid,'userBasicInfo');
            this.queryRecords([this.props.userBasicInfo.orgid]);
          }
        }
      }, 1000);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { zxbm } = prevProps;
    if (zxbm) {
      if (!prevProps.zxbm.datas.length && this.props.zxbm.datas.length) {
        this.queryRecords([], 1);
      }
    }
  }

  getByFatherdId = (fid, result) => {
    const { allYYB } = this.props;
    let childerNodes = allYYB.filter(item => item.fid === fid);
    if (childerNodes.length > 0) {
      childerNodes.forEach((item) => {
        result.push(item);
        result = this.getByFatherdId(item.yybid, result);
      });
    }
    return result;
  }

  onChange = (value, label, extra) => {
    let arr=[]
    value.forEach(item=>{
      arr.push(item.value)
    })
    const { visible, onClickYYB } = this.state;
    const { zxbm, allYYB, setData, searchType = false, resetUserValue } = this.props;
    if (resetUserValue) resetUserValue();
    const newZxbm = JSON.parse(JSON.stringify(zxbm));
    const { selected: OldSelected = [] } = newZxbm;
    const triggerValue = extra.triggerValue;
    let onClickTime = onClickYYB[triggerValue] || 0;
    let treeNode = [];
    if (extra.triggerValue === '1') {
      treeNode = allYYB;
    } else {
      treeNode = this.getByFatherdId(extra.triggerValue, treeNode);
    }
    // 选中的父节点
    let faNode = allYYB.find((i) => i.yybid === extra.triggerValue);
    if (treeNode.length > 0) {
      // treeNode.forEach((item) => {
      //   const exist = value.filter(Item => Item.value === item.yybid);
      //   if (exist.length === 0) {
      //     const Item = {
      //       label: item.yybmc,
      //       value: item.yybid,
      //     };
      //     value.push(Item);
      //   }
      // });
      // newZxbm.selected = value;
      switch (onClickTime) {
        case 0:
          treeNode.forEach((item) => {
            const exist = value.filter(Item => Item.value === item.yybid);
            if (exist.length === 0) {
              const Item = {
                label: item.yybmc,
                value: item.yybid,
              };
              value.push(Item);
            }
          });
          newZxbm.selected = value;
          onClickTime = 1;
          break;
        case 1:
          treeNode.forEach((item) => {
            value = value.filter(Item => Item.value !== item.yybid);
          });
          value.push({
            label: faNode.yybmc,
            value: faNode.yybid,
          });
          value = value.filter((item, index) => {
            return value.findIndex(item1 => item1.value === item.value) === index;
          });
          newZxbm.selected = value;
          onClickTime = 2;
          break;
        // case 2:
        //   treeNode.forEach((item) => {
        //     const exist = value.findIndex(Item => Item.value === item.yybid);
        //     if (exist < 0) {
        //       const Item = {
        //         label: item.yybmc,
        //         value: item.yybid,
        //       };
        //       value.push(Item);
        //     }
        //   });
        //   value = value.filter(Item => Item.value !== triggerValue);
        //   newZxbm.selected = value;
        //   onClickTime = 3;
        //   break;
        case 2:
          treeNode.forEach((item) => {
            value = value.filter(Item => Item.value !== item.yybid);
          });
          value = value.filter(Item => Item.value !== triggerValue);
          newZxbm.selected = value;
          onClickTime = 0;
          break;
        default:
          break;
      }
    } else if (!extra.checked && treeNode.length > 0) {
      const newOldSelected = JSON.parse(JSON.stringify(OldSelected));
      newOldSelected.forEach((Item, fatherIndex) => {
        if (Item.value === extra.triggerValue) {
          newOldSelected.splice(fatherIndex, 1);
        }
      });
      treeNode.forEach((item) => {
        newOldSelected.forEach((Item, index) => {
          if (Item.value === item.yybid) {
            newOldSelected.splice(index, 1);
          }
        });
      });
      newZxbm.selected = newOldSelected;
    } else {
      newZxbm.selected = value;
    }
    if (newZxbm.selected.length > 10000) {
      this.setState({
        visible: !visible,
        content: '选中的数据一次不允许超过一百个！',
      });
      onClickTime = undefined;
    } else if (OldSelected.length !== newZxbm.selected.length && setData) { // 判断两次的值是否有变
      setData('zxbm', newZxbm);
      if (searchType) {
        const yybid = [];
        newZxbm.selected.forEach((item) => {
          yybid.push(item.value);
        });
        newZxbm.selected.length !== 0 && this.queryRecords(yybid);
        if (zxbm.datas.length) {
          newZxbm.selected.length === 0 && this.queryRecords([], 1);
        } else {
          newZxbm.selected.length === 0 && setData('zxry', {});
        }
      }
    }
    this.setState({
      searchValueTwo:this.state.searchValueTwo
    })
    onClickYYB[triggerValue] = onClickTime;
    //console.log(newZxbm.selected,'newZxbmnewZxbmnewZxbmnewZxbm');
    this.props.yYBOnChange(newZxbm.selected)
    this.setState({
      zxbm: newZxbm,
      onClickYYB: onClickYYB,
    }, () => {
      // form.setFieldsValue({ [orgId]: newZxbm.selected });
    });
  }

  // 获取员工列表
  queryRecords = async (params, special = 0) => { // 获取执行部门下对应人员列表
    const { allYYB, zxry, setData } = this.props;
    let recentParams = {
      cxlx: '2',
      yyb: params.join(','),
      zt: '0',
    };
    if (special && !params.length) {
      const pagination = { current: 1, pageSize: 0, total: -1, paging: 1 };
      recentParams = { ...recentParams, ...pagination };
    }
    FetchExcStaffList(recentParams).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0 && setData) {
        const ryList = [];
        if (!special) {
          params.forEach((key) => {
            allYYB.forEach((item) => {
              if (item.yybid === key) {
                const Item = {
                  yhid: item.yybid,
                  orgid: item.fid,
                  yhxm: item.yybmc,
                  ...item,
                };
                ryList.push(Item);
              }
            });
            records.forEach((item) => {
              if (item.orgid === key) {
                const temp = JSON.parse(JSON.stringify(item));
                temp.yhxm = item.yhxm + '（' + item.yhbh + '）';
                ryList.push(temp);
              }
            });
          });
          params.forEach((key) => {
            const ryData = ryList.filter(item => { return item.orgid === key; });
            if (ryData.length === 0) {
              const ryListTemp = lodash.cloneDeep(ryList);
              ryListTemp.forEach((Item, index) => {
                if (Item.yhid === key) {
                  ryList.splice(index, 1);
                }
              });
            }
          });
        } else {
          if (params.length > 0) {
            params.forEach((key) => {
              records.forEach((item) => {
                if (item.orgid === key) {
                  const temp = JSON.parse(JSON.stringify(item));
                  temp.yhxm = item.yhxm + '（' + item.yhbh + '）';
                  ryList.push(temp);
                }
              });
            });
          } else {
            records.forEach((item) => {
              const temp = JSON.parse(JSON.stringify(item));
              temp.yhxm = item.yhxm + '（' + item.yhbh + '）';
              ryList.push(temp);
            });
          }
        }
        const zxryCurrent = zxry;
        const datas = TreeUtils.toTreeData(ryList, { keyName: 'yhid', pKeyName: 'orgid', titleName: 'yhxm', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        zxryCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          zxryCurrent.datas.push(...children);
        });
        zxryCurrent.dataLoaded = true;
        setData('zxry', zxryCurrent);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleCancel = () => {
    // 取消按钮的操作
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      content: '',
    });
  }
  clearSearchValue=()=>{
    this.setState({searchValueTwo:''})
  }
  //返回指定的营业部数据结构
  returnMyTreeData=(data)=>{
    if(data&&data.length>0){
      return data[0].children.filter(res=>res.value==='7504')[0]?.children
    }
    //return data
  }
  //返回指定的选中营业部
  returnMyChoise=(data,sel=[])=>{
    if(data&&data.length>0){
      const allStr=JSON.stringify(data)
      if(sel.length>0){
        return allStr.search(`${sel[0].label}`)===-1?[]:sel
      }else{
        return sel
      }

    }
  }
  render() {
    const { zxbm, onSearch } = this.props;
    const { visible, content, searchValueTwo } = this.state;
    return (
      <div>
        <TreeSelect
          getPopupContainer={triggerNode => (triggerNode.parentElement || document.body)}
          showSearch
          className={styles.gouzi}
          style={{minWidth:'225px'}}
          //value={this.returnMyChoise(zxbm.datas,zxbm.selected)}
          value={zxbm.selected}
          treeData={zxbm.datas}
          dropdownStyle={{ maxHeight: 400, overflowY: 'auto', display: visible ? 'none' : '' }}
          treeNodeFilterProp="title"
          placeholder="请选择"
          allowClear
          multiple
          treeDefaultExpandAll
          maxTagCount={1}
          maxTagPlaceholder={(value) => this.props.maxTagPlaceholder(value)}
          maxTagTextLength={5}
          treeCheckable={true}
          onChange={(value, label, extra) => {
            this.onChange(value, label, extra)
          }}
          treeCheckStrictly={true}
          searchValue={searchValueTwo}
          onSearch={value=>{
            this.setState({searchValueTwo:value})
          }}
        />
        <TipModal visible={visible} content={content} onCancel={this.handleCancel} />
      </div>
    );
  }
}
export default Form.create()(ExecutiveDepartment);
