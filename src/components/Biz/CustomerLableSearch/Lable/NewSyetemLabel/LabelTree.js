import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tree } from 'antd';
import lodash from 'lodash';
import styles from './index.less';

const { TreeNode } = Tree;
const dataList = [];

export default class LabelTree extends Component {
    constructor(props){
        super(props);
        const { selectedLable = [] } = this.props;
        this.state = {
            selectedKeys: selectedLable,
            expandedKeys: [],
            autoExpandParent: false,
        }
    }
    componentDidMount(){
        const { datas = [] } = this.props;
        this.generateList(datas);
    }

    componentWillReceiveProps(nextProps){
        const { selectedLable = [], checked = false } = nextProps;
        if(!checked){
            this.setState({
                selectedKeys: selectedLable,
            })
        }
    }
    onExpand = (expandedKeys) => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    };
    handleSelect = (selectedKeys, info) => {
        const { selectedKeys: oldKeys = [] } = this.state;
        this.setState({
            selectedKeys,
        })
        const { selected } = info;
        // const { title: name = '' } = node.props;
        const newSelectedKeys = JSON.parse(JSON.stringify(selectedKeys)); // 深克隆
        const keyArr = this.getDifferentArrs(newSelectedKeys, oldKeys);
        const index = dataList.findIndex(item => item.key === keyArr[0]);
        const { handleTagSelect } = this.props;
        if(handleTagSelect){
            handleTagSelect(selected, keyArr[0], lodash.get(dataList, `[${index}].title`));
        }
    };
    // 取出两个数组的不同元素
    getDifferentArrs=(newArr, oldarr)=>{
        const data = [];
        newArr.forEach(item => {
            if(!oldarr.includes(item)){
                data.push(item)
            }
        })
        oldarr.forEach(item => {
            if(!newArr.includes(item)){
                data.push(item)
            }
        })
        return data;
    }
    generateList = (data) => {
        data.forEach(item => {
            const { value, name, child = [] } = item;
            dataList.push({key: value, title: name});
            if(child.length > 0){
                this.generateList(child);
            }
        });
    };

    getParentKey = (key, tree) => {
        let parentKey;
        tree.forEach(item => {
            const { value, child } = item;
            if(child.length > 0){
                if(child.some(ele => ele.value === key)){
                    parentKey = value;
                } else if(this.getParentKey(key, child)){
                    parentKey = this.getParentKey(key, child);
                }
            }
        })
        return parentKey;
    };
    renderTitle=(searchValue, title)=>{
        debugger;
        const index = title.indexOf(searchValue);
        const beforeStr = title.substr(0, index);
        const afterStr = title.substr(index + searchValue.length);
        const mtitle =
          (index > -1) ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{title}</span>
          );
        return mtitle;
    }
    onChange = (value) => {
        const { datas = [] } = this.props;
        const expandedKeys = dataList.map(item => {
            if (item.title.indexOf(value) > -1) {
              return this.getParentKey(item.key, datas);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
          expandedKeys,
          autoExpandParent: true,
        });
    };
    render() {
        const { datas = [], searchText = ''  } = this.props;
        const { selectedKeys = [], expandedKeys = [], autoExpandParent } = this.state;

        const renderTreeNode = (data, searchValue = '') => {
            return(
                data.map(item => {
                    const { type } = item;
                    const title = this.renderTitle(searchValue,item.name);
                    if (item.child.length > 0){
                        return (
                            <TreeNode selectable={type === '3' ? true: false} key={item.value} title={title} className={ type === '3' ? styles.treeNode : ''}>
                                {renderTreeNode(item.child, searchValue)}
                            </TreeNode>)
                    } else {
                        return <TreeNode selectable={type === '3' ? true: false} key={item.value} title={title} className={ type === '3' ? styles.treeNode : ''} />
                    }
                })
            )
        }
        return (
            <React.Fragment>
                <Scrollbars autoHide style={{ width: '100%', height: '20rem', marginLeft: '2rem' }} >
                    <Tree
                        onSelect={this.handleSelect}
                        multiple
                        // defaultExpandAll={true}
                        blockNode={true}
                        className={styles.m_tree}
                        autoExpandParent={autoExpandParent}
                        selectedKeys={selectedKeys}
                        expandedKeys={expandedKeys}
                        onExpand={this.onExpand}
                    >
                        {renderTreeNode(datas, searchText)}
                    </Tree>
                </Scrollbars>
            </React.Fragment>
        )
    }
}
