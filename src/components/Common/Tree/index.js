/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable indent */
/* eslint-disable no-debugger */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Tree } from 'antd';
import TreeUtils from '../../../utils/treeUtils';
import img from '../../../assets/nodata.png';

const { TreeNode } = Tree;

class TreeItemList extends Component {
  constructor(props) {
    super(props);
    const { keyName = 'id', pKeyName = 'pid', titleName = 'name', dataSource = [] } = props;
    const treeDatasTemp = TreeUtils.toTreeData(dataSource, { keyName, pKeyName, titleName, normalizeTitleName: 'title', normalizeKeyName: 'key' });
    let treeNodesData = [];
    if (treeDatasTemp && treeDatasTemp[0] && treeDatasTemp[0].children && treeDatasTemp[0].children.length > 0) {
      treeNodesData = treeDatasTemp[0].children;
    }
    this.state = {
      treeNodesData,
      searchValue: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      keyName = 'id', pKeyName = 'pid', titleName = 'name',
      dataSource: nextDataSource = [] } = nextProps;
    const { treeNodesData: treeNodesDataInstate } = prevState || {};
    if (treeNodesDataInstate.length === 0) {
      const treeDatasTemp = TreeUtils.toTreeData(nextDataSource, { keyName, pKeyName, titleName, normalizeTitleName: 'title', normalizeKeyName: 'key' });
      let treeNodesData = [];
      if (treeDatasTemp && treeDatasTemp[0] && treeDatasTemp[0].children && treeDatasTemp[0].children.length > 0) {
        treeNodesData = treeDatasTemp[0].children;
      }
      return {
        dataSource: nextDataSource,
        treeNodesData,
      };
    }
    // 默认不改动 state
    return null;
  }

  // 递归获取输入搜索条件之后的树的节点数据
  getSearchNodesData = (nodes, searchValue) => {
    const nodesData = [];
    nodes.forEach((node) => {
      const { title, children } = node;
      if (children) { // 若为父节点,递归检查其子节点
        const tempData = this.getSearchNodesData(children, searchValue);
        if (tempData && tempData.length > 0) {
          nodesData.push({
            ...node,
            children: tempData,
          });
        }
      } else if (title.includes(searchValue)) { // 若为叶子节点,直接判断是否包含搜索条件的字符
        nodesData.push(node);
      }
    });
    return nodesData;
  }

  // 递归获取所有的节点的JSX结构
  getTreeNode = (nodes) => {
    return nodes.map((node) => {
      const { key, title, children } = node;
      // 叶子节点
      if (!children) {
        return <TreeNode key={key} title={title} />;
      }
      // 非叶子节点
      return (
        <TreeNode key={key} title={title}>
          {
            this.getTreeNode(children)
          }
        </TreeNode>
      );
    });
  }

  // 选中树的checkbox
  onSelect = (checkedKeys, e) => {
    const { onSelect } = this.props;
    onSelect(checkedKeys, e);
  }

  render() {
    const { treeNodesData, searchValue = '' } = this.state;
    let treeDatas = [];
    if (searchValue !== '') {
      treeDatas = this.getSearchNodesData(treeNodesData, searchValue);
    } else {
      treeDatas = [...treeNodesData];
    }
    return (
      <div>
        { treeDatas.length === 0 && <div style={{ textAlign: 'center', marginTop: '2rem' }}><img src={img} alt="" style={{ width: '15rem' }} /></div> }
        { treeDatas.length > 0 && (
          <Tree
            className="m-tree"
            draggable
            autoExpandParent
            defaultSelectedKey={[treeDatas[0].key]}
            defaultExpandedKeys={treeDatas[0].children[0] ? [treeDatas[0].children[0].key] : []}
            onSelect={this.onSelect}
          >
            { this.getTreeNode(treeDatas) }
          </Tree>
        )}
      </div>
    );
  }
}

export default TreeItemList;
