import React from 'react';
import { Row, Col, Tree, message, Transfer, Table, Input, Collapse, Icon } from 'antd';
import lodash from 'lodash';
import difference from 'lodash/difference';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import TreeUtils from '$utils/treeUtils';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import { getOptionalStaffList } from '$services/staffrelationship/common';
import styles from './index.less';

const { TreeNode } = Tree;
const { Search } = Input;
const { Panel } = Collapse;
/**
 * TableTransfer 吧表格封装进穿梭框 实现分页
 */
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSearch showSelectAll={false}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const dataList = [];

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.value === key)) {
        parentKey = node.value;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class DGroupShare extends React.Component {
  state = {
    shareType: this.props.gxlx ? this.props.gxlx.toString() : lodash.get(this.shareTypes, '[0].value', '1'),
    gxyyb: {
      isloading: true,
      dataLoaded: false,
      searchValue: '',
      datas: [],
    },
    dataSource: [], // 人员/营业部列表
    allStaffDataSource: [], // 所有营业部人员
    targetTranKeys: this.props.selectedKeys || [], // 已勾选人员
    yybCheckedKeys: [], // 选中的营业部
    firstYybid: '', // 默认的营业部
    expandedKeys: [],
    autoExpandParent: true,
    searchValue: '', // 搜索框值
    allYYB: [], // 所有营业部，未分级
    yybDatas: [],
  }
  componentDidMount() {
    this.fetchMember();
    this.fetchGxyybList();
  }
  shareTypes = [{ value: '1', label: '人员' }, { value: '2', label: '营业部' }]; // 9-6/去掉人员类
  handleShareChange = (key) => {
    this.setState({
      // shareType: e.target.value,
      shareType: key,
      targetTranKeys: [], // 清空选项
      dataSource: [], // 清空数据源
      allStaffDataSource: [],
    });
    const { onChangeGXLX, onhandleGXLX } = this.props;
    if (onChangeGXLX) {
      onChangeGXLX(parseInt(key, 10));
    }
    if (onhandleGXLX) {
      onhandleGXLX(parseInt(key, 10));
    }
  }
  /** 人员 */
  handleChange = (nextTargetKeys, direction, moveKeys) => { // eslint-disable-line
    const { handleRemeberSelected } = this.props;
    if (handleRemeberSelected) {
      handleRemeberSelected(nextTargetKeys, this.getNameByKey(nextTargetKeys));
    }
    this.setState({ targetTranKeys: nextTargetKeys });
  };
  // 通过id查询人员姓名
  getNameByKey = (keys = []) => {
    const titles = [];
    const { allStaffDataSource = [] } = this.state;
    keys.forEach((id) => {
      const temp = allStaffDataSource.filter(item => item.key === id);
      if (temp.length > 0) {
        titles.push(lodash.get(temp, '[0].ryxm'));
      }
    });
    return titles;
  }
  // 查询人员列表数据
  fetchMember = async (shareType = '1', gxlx = '', branchId = '') => { // shareType:共享类型 1:人员|2:营业部 gxlx:关系类型
    const commonParam = { paging: 0, current: 1, pageSize: 10, total: -1, sort: '' };
    const params = shareType === '2' ? {
      ...commonParam,
      gxlx,
    } : {
      ...commonParam,
      yyb: branchId,
    };
    await getOptionalStaffList({ ...params }).then((ret) => {
      const { code = 0, note = '', records = [] } = ret;
      if (code > 0) {
        const result = records.map((item) => {
          return {
            ...item,
            key: item.ryid,
            label: item.ryxm,
          };
        });

        this.setState({
          dataSource: result,
        });
      } else {
        message.error(note);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 获取管辖营业部的数据
  fetchGxyybList = async (gxyyb = this.state.gxyyb) => {
    const gxyybCurrent = gxyyb;
    await fetchUserAuthorityDepartment({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '' }).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        gxyybCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          gxyybCurrent.datas.push(...children);
        });
        gxyybCurrent.dataLoaded = true;
        this.getDefaultSelectedKey(datas);
        this.setState({ gxyyb: gxyybCurrent, firstYybid: records[0].yybid, allYYB: records, yybDatas: records });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });

    const commonParam = { paging: 0, current: 1, pageSize: 10, total: -1, sort: '' };
    await getOptionalStaffList({
      ...commonParam,
      yyb: '',
    }).then((ret) => {
      const { code = 0, note = '', records = [] } = ret;
      if (code > 0) {
        const result = records.map((item) => {
          return {
            ...item,
            key: item.ryid,
            label: item.ryxm,
          };
        });
        this.setState({
          allStaffDataSource: result,
        });
      } else {
        message.error(note);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  getDefaultSelectedKey = (datas) => {
    if (datas[0].children && datas[0].children.length) {
      this.getDefaultSelectedKey(lodash.get(datas, '[0].children', []));
    }
  }
  /** 人员 */
  filterOption = (inputValue, option) => option.ryxm.indexOf(inputValue) > -1;
  /** 营业部 */
  yybFilterOption = (inputValue, option) => option.yybmc.indexOf(inputValue) > -1;

  /**
   * 关系选中变化
   */
  onCheck = (relationCheckedKeys) => {
    this.onSelectMember(relationCheckedKeys);
  };

  onSelectMember = (relationCheckedKeys) => { // eslint-disable-line
    const { firstYybid } = this.state;
    const gxlx = Array.isArray(relationCheckedKeys) ? relationCheckedKeys.join(',') : '';
    this.fetchMember(this.state.shareType, gxlx, firstYybid);
  }
  /**
   * 营业部选中变化
   */
  // onyybCheck = (yybCheckedKeys) => {
  //   this.setState({ yybCheckedKeys });
  //   this.onSelectBranch(yybCheckedKeys);
  // };
  onyybCheck = (yybCheckedKeys) => {
    const { handleRemeberSelected } = this.props;
    if (yybCheckedKeys) {
      handleRemeberSelected(yybCheckedKeys, this.getYybmcByKey(yybCheckedKeys));
    }
    this.setState({ yybCheckedKeys });
  };
  /** 营业部 */
  handleChangeyyb = (nextTargetKeys) => { // eslint-disable-line
    const { handleRemeberSelected } = this.props;
    if (handleRemeberSelected) {
      handleRemeberSelected(nextTargetKeys, this.getYybmcByKey(nextTargetKeys));
    }
    this.setState({ targetTranKeys: nextTargetKeys });
  };
  getYybmcByKey=(keys) => {
    const titles = [];
    const { allYYB = [] } = this.state;
    keys.forEach((id) => {
      const temp = allYYB.filter(item => item.yybid === id);
      if (temp.length > 0) {
        titles.push(lodash.get(temp, '[0].yybmc'));
      }
    });
    return titles;
  }
  onSelectBranch = (yybCheckedKeys) => { // eslint-disable-line
    const { firstYybid } = this.state;
    const branchId = Array.isArray(yybCheckedKeys) ? yybCheckedKeys.join(',') : firstYybid;
    this.fetchMember(this.state.shareType, '', branchId);
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e) => {
    const { gxyyb: { datas } } = this.state;
    const { value } = e.target;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, datas);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      searchValue: value,
      expandedKeys,
      autoExpandParent: true,
    });
  };
  render() {
    console.info('gxlx', this.props.gxlx);
    const tableColumns = [
      {
        dataIndex: 'ryxm',
        title: '人员姓名',
      },
    ];
    const yybtableColumns = [
      {
        dataIndex: 'yybmc',
        title: '营业部名称',
      },
    ];
    const { gxyyb, dataSource, targetTranKeys, searchValue, shareType, yybDatas } = this.state;
    console.info('targetTranKeys', targetTranKeys);
    const yybDataSource = [];
    yybDatas.forEach((item) => {
      yybDataSource.push({
        ...item,
        key: item.yybid,
        label: item.yybmc,
      });
    });

    const { expandedKeys, autoExpandParent } = this.state;
    const loop = data =>
      data.map((item) => {
        const index = item.label.indexOf(searchValue);
        const beforeStr = item.label.substr(0, index);
        const afterStr = item.label.substr(index + searchValue.length);
        const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.label}</span>
        );
        if (item.children && item.children.length) {
          return (
            <TreeNode className={styles.forTreeNode} key={item.value} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.value} title={title} />;
      });

    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { value, label } = node;
        dataList.push({ key: value, title: label });
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(gxyyb.datas);

    return (
      <React.Fragment>
        <Row className="m-row-form" style={{ minHeight: '31rem', marginTop: '1rem' }}>
          <Col sm={7} md={7} xxl={7}>
            <Collapse activeKey={shareType} accordion bordered={false} onChange={this.handleShareChange} >
              <Panel header="人员" key="1">
                <Scrollbars autoHide style={{ width: '100%', height: '41rem' }} >
                  <Search style={{ marginBottom: 8 }} placeholder="搜索营业部" onChange={this.onChange} />
                  { gxyyb.dataLoaded && gxyyb.datas.length > 0 && (
                    <Tree
                      heckedKeys={this.state.yybCheckedKeys}
                      onCheck={this.onyybCheck}
                      onSelect={(selectedTeeKeys, e) => { this.onSelectBranch(selectedTeeKeys, e); }}
                      expandAction="click"
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      defaultSelectedKeys="2"
                    >
                      {loop(gxyyb.datas)}
                    </Tree>
                  )}
                </Scrollbars>
              </Panel>
              <Panel header="营业部" key="2">
                <span style={{ color: '#40a9ffad', margin: '0 2rem 0' }}>请在右侧选择营业部<Icon type="double-right" /></span>
              </Panel>
            </Collapse>
          </Col>
          <Col sm={17} md={17} xxl={17}>
            {shareType === 1 || shareType === '1' && (
              <TableTransfer
                dataSource={dataSource}
                listStyle={{ height: '50rem' }}
                showSearch
                filterOption={this.filterOption}
                targetKeys={targetTranKeys}
                onChange={this.handleChange}
                leftColumns={tableColumns}
                rightColumns={tableColumns}
              />
            )}
            {shareType === 2 || shareType === '2' && (
            // <Scrollbars autoHide style={{ width: '100%', height: '48rem' }} >
            //   <Search style={{ marginBottom: 8 }} placeholder="搜索营业部" onChange={this.onChange} />
            //   { gxyyb.dataLoaded && gxyyb.datas.length > 0 && (
            //   <Tree
            //     checkable
            //     heckedKeys={this.state.yybCheckedKeys}
            //     onCheck={this.onyybCheck}
            //     onSelect={(selectedTeeKeys, e) => { this.onSelectBranch(selectedTeeKeys, e); }}
            //     expandAction="click"
            //     onExpand={this.onExpand}
            //     expandedKeys={expandedKeys}
            //     autoExpandParent={autoExpandParent}
            //   >
            //     {loop(gxyyb.datas)}
            //   </Tree>
            //   )}
            // </Scrollbars>
              <TableTransfer
                dataSource={yybDataSource}
                listStyle={{ height: '50rem' }}
                showSearch
                filterOption={this.yybFilterOption}
                targetKeys={targetTranKeys}
                onChange={this.handleChangeyyb}
                leftColumns={yybtableColumns}
                rightColumns={yybtableColumns}
              />
            )}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(DGroupShare);
