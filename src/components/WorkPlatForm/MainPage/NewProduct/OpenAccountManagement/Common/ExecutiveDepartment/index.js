/* eslint-disable array-callback-return */
import React from 'react';
import { Form, TreeSelect, message } from 'antd';
import lodash from 'lodash';
import TreeUtils from '../../../../../../../utils/treeUtils';
import { FetchOptionalUserList, FetchExcStaffList } from '../../../../../../../services/incidentialServices';
import TipModal from '../TipModal';

class ExecutiveDepartment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      content: '',
    };
  }

  componentDidMount() {
    const { zxbm, setData, special = 0 } = this.props;
    if (!special) {
      setTimeout(() => {
        if (!zxbm.selected.length) {
          const { datas = [] } = zxbm;
          if (datas.length) {
            this.queryRecords([], 1);
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

  // handler = () => {
  //   const { zxbm, setData, special = 0 } = this.props;
  //   if (!special) {
  //     if (zxbm) {
  //       const { datas = [] } = zxbm;
  //       if (datas.length) {
  //         this.queryRecords(datas.map(item => item.value), 1);
  //       }
  //     }
  //   }
  // }

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
    const { visible } = this.state;
    const { zxbm, allYYB, setData, searchType = false, resetUserValue } = this.props;
    if (resetUserValue) resetUserValue();
    const newZxbm = JSON.parse(JSON.stringify(zxbm));
    const { selected: OldSelected = [] } = newZxbm;
    let treeNode = [];
    if (extra.triggerValue === '1') {
      treeNode = allYYB;
    } else {
      treeNode = this.getByFatherdId(extra.triggerValue, treeNode);
    }
    if (extra.checked && treeNode.length > 0) {
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
    if (newZxbm.selected.length > 100) {
      this.setState({
        visible: !visible,
        content: '选中的数据一次不允许超过一百个！',
      });
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
      const pagination = { current: 1, pageSize: 100, total: -1, paging: 1 };
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

  render() {
    const { zxbm, searchValueTwo, onSearch } = this.props;
    const { visible, content } = this.state;
    // if (!zxbm.selected.length) this.handler();
    return (
      <div>
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          value={zxbm.selected}
          treeData={zxbm.datas}
          // dropdownMatchSelectWidth={false}
          dropdownClassName='m-bss-treeSelect'
          dropdownStyle={{ maxHeight: 400, overflowY: 'auto', display: visible ? 'none' : '' }}
          treeNodeFilterProp="title"
          placeholder="开户执行部门"
          allowClear
          multiple
          treeDefaultExpandAll
          maxTagCount={3}
          maxTagPlaceholder={(value) => this.props.maxTagPlaceholder(value)}
          maxTagTextLength={7}
          treeCheckable={true}
          onChange={(value, label, extra) => this.onChange(value, label, extra)}
          treeCheckStrictly={true}
          searchValue={searchValueTwo}
          onSearch={onSearch}
        />
        <TipModal visible={visible} content={content} onCancel={this.handleCancel} />
      </div>
    );
  }
}
export default Form.create()(ExecutiveDepartment);
