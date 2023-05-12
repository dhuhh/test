import { FC, useState, useEffect } from 'react';
import { TreeSelect, message } from 'antd';
import { cloneDeep } from 'lodash';
import styles from '../index.less';
import TreeUtils from '$utils/treeUtils';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import { TreeNode } from 'antd/lib/tree-select';
import { TreeNodeValue } from 'antd/lib/tree-select/interface';

interface yyb {
  fid: string,
  yybmc: string,
  [propName: string]: unknown
}

// 开户营业部涉及数据
interface yybData {
  allYyb: yyb[], // 接口获取的营业部数据
  departments: TreeNode[], // 树状结构
  deptSearch: string, // 搜索框的值
}

type Props = Readonly<{
  selectDept: string[], // 选择营业部
  selectDeptChange: Function, // 选择营业部变化
}>

const AccountDepartment: FC<Props> = (props) => {
  const [yybState, setYybState] = useState<yybData>({ allYyb: [], departments: [], deptSearch: '' });

  useEffect(() => { getDepartments(); }, [])

  // 格式化treeSelectValue
  const formatValue = (dept: string[]) => {
    return dept.map(val => ({ value: val, label: yybState.allYyb.find(item => item.yybid === val)?.yybmc }));
  }

  // 搜索营业部变化
  const handleYybSearch = (value: string) => {
    setYybState({ ...yybState, deptSearch: value });
  }

  // 获取父节点下的所有子节点key
  const getCheckedKeys = (triggerNodes: any[], array: string[]) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        getCheckedKeys(item.props.children, array);
      }
    });
  }

  // 选中营业部变化
  const handleYybChange = (value: any, label: object, extra: any) => {
    let dept = cloneDeep(props.selectDept);
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
    if(props.selectDeptChange) {
      props.selectDeptChange(dept);
    }
  }

  // 获取管辖营业部的数据
  const getDepartments = (): void => {
    fetchUserAuthorityDepartment().then((result: any) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments: TreeNode[] = [];
      datas.forEach((item: any) => {
        const { children } = item;
        departments.push(...children);
      });
      setYybState({ ...yybState, departments, allYyb: records } );
    }).catch((error: any) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 根据输入项进行筛选
  const filterTreeNode = (inputValue: string, treeNode: any): boolean => {
    // 方式一
    const util = (fid: string, title?: string): boolean => {
      if (fid === '0') return false;
      for (let item of yybState.allYyb) {
        if (item.yybid === fid) {
          if (item.yybmc.indexOf(inputValue) > -1) {
            return true;
          } else {
            util(item.fid);
          }
          break;
        }
      }
      return false;
    };
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    } else {
      return util(treeNode.props.fid, treeNode.props.title);
    }
  }

  // 隐藏 tag 时显示的内容
  const maxTagPlaceholder = (value: any) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  return (
    <>
      <span className={styles.label}>开户营业部</span>
      <TreeSelect
        showSearch
        className={styles.treeSelect}
        value={formatValue(props.selectDept) as unknown as TreeNodeValue}
        treeData={yybState.departments}
        // dropdownMatchSelectWidth={false}
        dropdownClassName='m-bss-treeSelect'
        style={{ marginLeft: 8 }}
        dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
        filterTreeNode={filterTreeNode}
        placeholder="请选择"
        allowClear
        multiple
        searchValue={yybState.deptSearch}
        // autoClearSearchValue={false}
        treeDefaultExpandAll
        maxTagCount={3}
        maxTagPlaceholder={(value) => maxTagPlaceholder(value)}
        // maxTagTextLength={5}
        treeCheckable={true}
        onChange={handleYybChange}
        onSearch={handleYybSearch}
        treeCheckStrictly={true}
        // showCheckedStrategy={TreeSelect.SHOW_ALL}
      />
    </>
  );
}

export default AccountDepartment;