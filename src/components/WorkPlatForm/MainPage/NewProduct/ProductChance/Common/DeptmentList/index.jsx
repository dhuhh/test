import React, { Component } from 'react'
import { TreeSelect,message } from 'antd';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import TreeUtils from '$utils/treeUtils';
import styles from './index.less'

export default class DeptmentList extends Component {
    state = {
        departments: [],
    }
    componentDidMount(){
        this.getDepartments();
      }
    // 格式化treeSelectValue
    formatValue = (dept) => {
        const { allYyb = [] } = this.state;
        return dept.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val)?.yybmc }));
    }

    // 搜索营业部变化
    handleYybSearch = (value) => {
        this.props.setStateChange({
            deptSearch: value,
        });
    }

      // 获取管辖营业部的数据
getDepartments = () => {
    fetchUserAuthorityDepartment().then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments = [];
      datas.forEach((item) => {
        const { children } = item;
        departments.push(...children);
      });
      console.log(departments,'departments');
      this.setState({ departments, allYyb: records });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

      // 获取父节点下的所有子节点key
      getCheckedKeys = (triggerNodes, array) => {
        triggerNodes.forEach(item => {
          array.push(item.key);
          if (item.props.children.length) {
            this.getCheckedKeys(item.props.children, array);
          }
        });
      }

    // 选中营业部变化
    handleYybChange = (value, label, extra) => {
        let { dept } = this.props;
        if (value.length) {
            const array = [];
            array.push(extra.triggerValue);
            this.getCheckedKeys(extra.triggerNode.props.children, array);
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
        this.props.setStateChange({ deptSearch: this.props.deptSearch, dept,isChange:true });
    }

    maxTagPlaceholder = (value) => {
        const num = 3 + value.length;
        return <span>...等{num}项</span>;
    }

    filterTreeNode = (inputValue, treeNode) => {
        // 方式一
        const { allYyb = [] } = this.state;
        const util = (fid, title) => {
            if (fid === '0') return false;
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
    }

    render() {
        const { departments, } = this.state;
        const { dept, deptSearch,getPopupContainer } = this.props
        return (
            <div style={{display:'inline-block'}}>
                <TreeSelect
                    showSearch
                    className={styles.treeSelect}
                    getPopupContainer={getPopupContainer}
                    value={this.formatValue(dept)}
                    treeData={departments}
                    // dropdownMatchSelectWidth={false}
                    dropdownClassName='m-bss-treeSelect'
                    style={{ marginLeft: 8 }}
                    dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                    filterTreeNode={this.filterTreeNode}
                    placeholder="营业部"
                    allowClear
                    multiple
                    searchValue={deptSearch}
                    // autoClearSearchValue={false}
                    treeDefaultExpandAll
                    maxTagCount={3}
                    maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                    maxTagTextLength={5}
                    treeCheckable={true}
                    onChange={this.handleYybChange}
                    onSearch={this.handleYybSearch}
                    treeCheckStrictly={true}
                // showCheckedStrategy={TreeSelect.SHOW_ALL}
                />
            </div>
        )
    }
}
