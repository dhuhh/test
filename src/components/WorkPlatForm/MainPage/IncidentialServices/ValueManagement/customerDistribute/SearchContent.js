import React, { Component } from 'react';
import { Row, Col, Form, Button, message, TreeSelect } from 'antd';
import lodash from 'lodash';
import { fetchUserAuthorityDepartment } from '../../../../../../services/commonbase/userAuthorityDepartment';
import { FetchOptionalUserList, FetchExcStaffList } from '../../../../../../services/incidentialServices';
import TreeUtils from '../../../../../../utils/treeUtils';
import TipModal from '../../Common/TipModal';

class SearchContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onClickYYB: {},
      zxbm: {
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      },
      zxry: {
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      },
      allYYB: [], // 所有营业部，未分级
      allRY: [], // 所有人员，未分级
      visible: false,
      content: '',
      searchValue: '',
      searchValueYyb: '',
    };
    this.fetchExcStaffListDebounce = lodash.debounce(this.fetchExcStaffList, 300);
  }

  componentDidMount() {
    this.fetchGxyybList();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tabKey !== nextProps.tabKey) {
      this.onClean();
    }
  }
  onSearchYyb = (value) => {
    this.setState({
      searchValueYyb: value,
    });
  }
  // 获取管辖营业部的数据
  fetchGxyybList = (zxbm = this.state.zxbm) => {
    const gxyybCurrent = zxbm;
    fetchUserAuthorityDepartment({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '' }).then((result) => {
      let { code = 0, records = [] } = result;
      if(this.props.zdlx === '5'){
        records = records.filter(item=>item.yybid !== '20111');
      }
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        gxyybCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          gxyybCurrent.datas.push(...children);
        });
        gxyybCurrent.dataLoaded = true;
        this.setState({ zxbm: gxyybCurrent, allYYB: records });
        const { datas: cdatas = [] } = gxyybCurrent;
        if (cdatas.length) {
          this.queryRecords([], 1);
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  getByFatherdId = (fid, result) => {
    const { allYYB } = this.state;
    let childerNodes = allYYB.filter(item => item.fid === fid);
    if (childerNodes.length > 0) {
      childerNodes.forEach((item) => {
        result.push(item);
        result = this.getByFatherdId(item.yybid, result);
      });
    }
    return result;
  }

  onChangeBm = (value, label, extra) => {
    if (this.props.form.getFieldValue('zxr')) this.props.form.setFieldsValue({ 'zxr': [] });
    const { zxbm, allYYB, visible, onClickYYB } = this.state;
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

    if (newZxbm.selected.length > 100) {
      this.setState({
        visible: !visible,
        content: '选中的数据一次不允许超过一百个！',
      });
      onClickTime = undefined;
    } else if (OldSelected.length !== newZxbm.selected.length && newZxbm.selected.length <= 100) {// 判断两次的值是否有变
      setTimeout(() => {
        this.props.form.setFieldsValue({ zxbm: newZxbm.selected });
      }, 0);
      this.setState({
        zxbm: newZxbm,
      }, () => {
        const yybid = [];
        newZxbm.selected.forEach((item) => {
          yybid.push(item.value);
        });
        newZxbm.selected.length !== 0 ? this.queryRecords(yybid) : this.queryRecords([],1);
      });
    }else{
      !triggerValue ? this.queryRecords([],1) : this.queryRecords([triggerValue]) ;
    }
    onClickYYB[triggerValue] = onClickTime;
    this.setState({
      searchValueYyb: this.state.searchValueYyb,
      onClickYYB: onClickYYB,
    });

  }

  // 获取员工列表
  queryRecords = async (params, special = 0) => { // 获取执行部门下对应人员列表
    const { allYYB, zxry } = this.state;
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
      let { code = 0, records = [] } = result;
      if(this.props.zdlx === '5'){
        records = records.filter(item=>item.yhbh !== 'ai_cc');
      }
      if (code > 0) {
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
          params.forEach(key => {
            const ryData = ryList.filter(item => { return item.orgid === key; });
            if (ryData.length === 0) {
              ryList.forEach((Item, index) => {
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
        this.setState({ zxry: zxryCurrent, allRY: records });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { tabKey, handleSubmit } = this.props;
        const { allYYB, allRY } = this.state;
        if (tabKey === '1') {
          values.zxr.forEach(key => {
            allRY.forEach((item) => {
              if (item.yhid === key) {
                handleSubmit(item);
              }
            });
          });
        } else {
          values.zxbm.forEach((item) => {
            allYYB.forEach((Item) => {
              if (Item.yybid === item.value) {
                handleSubmit(Item);
              }
            });
          });
        }
        this.onClean();
      }
    });
  }

  onClean = () => {
    const { zxbm } = this.state;
    zxbm.selected = [];
    const zxry = {
      isloading: true,
      dataLoaded: false,
      searchValue: '',
      datas: [],
      selected: [],
    };
    this.props.form.setFieldsValue({ zxbm: undefined });
    this.props.form.setFieldsValue({ zxr: undefined });
    this.setState({ zxbm, zxry, allRY: [], searchValue: '' });
    this.queryRecords([], 1);
  }

  handleCancel = () => {
    // 取消按钮的操作
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      content: '',
    });
  }

  normalize = (value, prevValue = []) => {
    if (value && value.length >= 100) {
      return [];
    } else {
      return value;
    }
  };

  handleTreeSelectSearch = (value) => {
    this.setState({ searchValue: value });
    if (!this.state.zxbm.selected.length) {
      this.fetchExcStaffListDebounce(value);
    }
  }

  fetchExcStaffList = (value) => {
    const { zxry } = this.state;
    const params = {
      cxlx: '2',
      yyb: '',
      zt: '0',
      cxbs: value,
      current: 1, pageSize: 100, total: -1, paging: 1,
    };
    FetchExcStaffList(params).then((result) => {
      let { code = 0, records = [] } = result;
      if(this.props.zdlx === '5'){
        records = records.filter(item=>item.yhbh !== 'ai_cc');
      }
      if (code > 0) {
        const ryList = [];
        records.forEach((item) => {
          const temp = JSON.parse(JSON.stringify(item));
          temp.yhxm = item.yhxm + '（' + item.yhbh + '）';
          ryList.push(temp);
        });
        const zxryCurrent = zxry;
        const datas = TreeUtils.toTreeData(ryList, { keyName: 'yhid', pKeyName: 'orgid', titleName: 'yhxm', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        zxryCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          zxryCurrent.datas.push(...children);
        });
        zxryCurrent.dataLoaded = true;
        this.setState({ zxry: zxryCurrent, allRY: records });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { form: { getFieldDecorator }, tabKey, dataSource } = this.props;
    const { zxbm, zxry, visible, content } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} className="m-form-default ant-advanced-search-form ant-bss-distribute-form" layout="inline">
        <Row style={{ marginLeft: '308px', width: '840px', paddingBottom: '16px' }}>
          {tabKey === '2' && <Col span={10}></Col>}
          <Col span={10} id={`m-bss-zxbm${tabKey}`}>
            <Form.Item label="部门" className="m-form-item m-form-bss-item">
              {
                getFieldDecorator('zxbm', { normalize: this.normalize, rules: [{ required: tabKey === '2' ? true : false, message: '请选择部门' }] })(<TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  treeData={zxbm.datas}
                  dropdownClassName='m-bss-treeSelect'
                  dropdownStyle={{ maxHeight: dataSource.length === 0 ? 220 : dataSource.length <= 5 ? (dataSource.length * 60) + 60 : 360, display: visible ? 'none' : '' }}
                  treeNodeFilterProp="title"
                  allowClear
                  multiple
                  treeDefaultExpandAll
                  maxTagCount={3}
                  maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                  maxTagTextLength={7}
                  treeCheckable={true}
                  onChange={(value, label, extra) => this.onChangeBm(value, label, extra)}
                  treeCheckStrictly={true}
                  getPopupContainer={triggerNode => document.getElementById(`m-bss-zxbm${tabKey}`)}
                  searchValue={this.state.searchValueYyb}
                  onSearch={this.onSearchYyb}
                />)
              }
            </Form.Item>
          </Col>
          {tabKey === '1' && (
            <Col span={10} id='m-bss-zxr'>
              <Form.Item label="执行人" className="m-form-item m-form-bss-item">
                {
                  getFieldDecorator('zxr', { rules: [{ required: true, message: '请选择执行人' }] })(<TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    treeData={zxry.datas}
                    dropdownClassName='m-bss-treeSelect'
                    dropdownStyle={{ maxHeight: dataSource.length === 0 ? 220 : dataSource.length <= 5 ? (dataSource.length * 60) + 60 : 360, overflowY: 'auto' }}
                    treeNodeFilterProp="title"
                    allowClear
                    multiple
                    treeDefaultExpandAll
                    maxTagCount={3}
                    maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                    maxTagTextLength={7}
                    treeCheckable={true}
                    getPopupContainer={triggerNode => document.getElementById('m-bss-zxr')}
                    autoClearSearchValue={false} // 阻止treeSelect当前选中树节点变化时重置searchValue的默认操作
                    searchValue={this.state.searchValue}
                    onSearch={this.handleTreeSelectSearch}
                  >
                  </TreeSelect>)
                }
              </Form.Item>
            </Col>
          )}
          <Col span={4}>
            <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c fs14 ml10' style={{ border: 'none', height: '40px', width: '130px' }} htmlType="submit">{tabKey === '1' ? '添加执行人' : '添加部门'}</Button>
          </Col>
        </Row>
        <TipModal visible={visible} content={content} onCancel={this.handleCancel} />
      </Form>
    );
  }
}
export default Form.create()(SearchContent);