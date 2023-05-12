import React from 'react';
import lodash from 'lodash';
import { Menu, message, Icon } from 'antd';
// import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import { fetchSeniorCusLabelCondition, fetchSeniorCusLabelCollection, fetchSeniorCusLabelCollect } from '../../../../../../services/customersenior';
import styles from '../index.less';

// 高级筛选弹出框 左菜单通用组件
const { SubMenu } = Menu;
class LabelLeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.levels = [];
    this.state = {
      current: '',
      openKeys: [],
      inputVal: '',
      hightLight: [],
      menuJson: [], // 所有
      collection: [], // 收藏
    }
  }

  componentDidMount() {
    this.fetchAlldata();
    this.fetchCusdata();
  }
  fetchCusdata = () => {
    fetchSeniorCusLabelCollection({
      entityType: '1',
    }).then((response) => {
      const { records = [] } = response;
      const arr = records.map((it) => {
        return { ...it, type: '3' };
      });
      this.setState({
        collection: arr,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  fetchAlldata = () => {
    fetchSeniorCusLabelCondition({
      entityType: '1',
    }).then((response) => {
      const { records = [] } = response;
      this.setState({
        menuJson: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  onToggle = (info) => {
    this.setState({
      // openKeys: info.length > 0 ? [info[info.length - 1]] : [],
      openKeys: info,
    });
  }
  onSearch = (value) => {
    const { menuJson = [], collection = [] } = this.state;
    const arr = [{ type: '4', name: '收藏夹', value: '', child: collection }];
    arr.push(...menuJson);
    const { keys, openKeys } = this.Searchkey(arr, value);
    this.setState({
      openKeys,
      hightLight: keys,
    });
  }
  Searchkey = (arr, value) => {
    const keys = [];
    const openKeys = [];
    let isSearch = false; // 表示当前层级是否有匹配项
    arr.forEach((element) => {
      const { type, name, value: code, child = [] } = element; // eslint-disable-line
      // 20200907 支持多个层级菜单同时搜索(之前只支持子菜单搜索)
      // if (type === '3') {
        if (value && name.indexOf(value) >= 0) {
          isSearch = true;
          keys.push(code);
        }
      // } else {
        if (child && child.length > 0) {
          const { keys: ckeys, openKeys: copenKeys, isSearch: cisSearch } = this.Searchkey(child, value);
          if (cisSearch) { // 如果子层级有那么 递归将所有的父节点加入open
            isSearch = cisSearch;
            if (name && !openKeys.includes(name)) {
              openKeys.push(name);
            }
          }
          keys.push(...ckeys);
          openKeys.push(...copenKeys);
        }
      // }
    });
    return { keys, openKeys, isSearch };
  }
  getobj = (arr, code) => {
    const objs = [];
    arr.forEach((element) => {
      const { type, value, child = [] } = element;
      if (type === '3') {
        if (code && value === code) {
          objs.push(element);
        }
      } else {
        const cobjs = this.getobj(child, code);
        objs.push(...cobjs);
      }
    });
    return objs;
  }

  // 查找所有父节点
  getParentID = (id, tree) => {
		for (let i = 0; i < tree.length; i++) {
		  const node = tree[i];
		  if (node.child && node.child.length > 0) {
        if (node.child.some(item => item.value === id)) {
          this.levels.push({ value: node.value, name: node.name });
          this.getParentID(node.value, this.state.menuJson);
          return;
        } else {
          this.getParentID(id, node.child);
        }
		  }
		}
	};

  handleClick = (e) => {
    const value = lodash.get(e, 'key', '');
    const keyPath = lodash.get(e, 'keyPath', []);
    let arr = [...keyPath];
    const objs = this.getobj(this.state.menuJson, value); // 根据conde去找条件
    const name = lodash.get(objs, '[0].name', []);
    this.node = null; // 清空层级信息
    this.parentNode = null;
    if(arr.includes('收藏夹')) {
      this.levels = [];
      this.getParentID(value, this.state.menuJson);
      this.levels.unshift({ value: value, name: name });
      arr = this.levels.map(item => item.name);
    } else {
      arr[0] = name;
    }
    const strFormat = arr.reverse().join(' —— ');
    const { onMenuClick } = this.props;
    if (onMenuClick) {
      onMenuClick({ value, strFormat, title: `<${name}>` });
    }
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1),
    });
  }
  handelEnter = (e) => {
    const { keyCode = 0, target: { value } } = e;
    if (keyCode === 13) {
      this.onSearch(value);
    }
  }
  handelSearch = () => {
    this.onSearch(this.state.inputVal);
  }
  handelChange = (e) => {
    const { target: { value } } = e;
    this.setState({
      inputVal: value,
    });
  }
  onClickHeart = (e, is, value) => {
    e.stopPropagation();
    fetchSeniorCusLabelCollect({
      value,
      entityType: '1',
    }).then((response) => { // eslint-disable-line
      this.fetchCusdata();
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  formatTitle = (text, max = 8) => {
    return (
      <span>
        {text && text.length > max && (
        <span title={text}>{text.substr(0, max)}...</span>
    )}
        {text && text.length <= max && (
      text
    )}
        {!text && (
    '--'
    )}
      </span>
    );
  }
  renderSubMenu = (arr) => {
    const { collection } = this.state;
    return arr.map((item) => {
      const { type, name, value, child = [] } = item;
      if (type === '3') {
        return (
          <Menu.Item key={value}>
            <a style={{ color: this.state.hightLight.includes(value) ? 'red' : '' }} href="#" onClick={(e) => { e.preventDefault(); }} title={name}>
              <span title={name}>{this.formatTitle(name)}</span>
            </a>
            {
                collection.map(it => it.value).includes(value) ?
                  <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" onClick={(e) => this.onClickHeart(e, false, value)} style={{ position: 'absolute', top: '1rem', right: '1rem' }} /> :
                  <Icon type="heart" theme="outlined" onClick={(e) => this.onClickHeart(e, true, value)} style={{ position: 'absolute', top: '1rem', right: '1rem' }} />
              }
          </Menu.Item>
        );
      }
      return (
        <SubMenu
          key={name}
          title={
            <span>
              <span className="hide-menu">
                <i className="ant-menu-submenu-arrow" style={{ position: 'relative' }} />
                <span style={{ color: this.state.hightLight.includes(value) ? 'red' : '' }} onClick={(e) => { e.preventDefault(); }} title={name}>{this.formatTitle(name)}</span>
                {/* {name} */}
              </span>
            </span>}
        >
          {this.renderSubMenu(child)}
        </SubMenu>
      );
    });
  }
  render() {
    const { menuJson = [], collection = [] } = this.state;
    const arr = [{ type: '4', name: '收藏夹', value: '', child: collection }];
    arr.push(...menuJson);
    return (
      <div>
        <div className="ant-row ant-form-item">
          <span className="m-input-search-form ant-input-search ant-input-search-enter-button ant-input-affix-wrapper">
            <input type="text" placeholder="" value={this.state.inputVal} onChange={this.handelChange} onKeyDown={this.handelEnter} className="ant-input" />
            <span className="ant-input-suffix" onClick={this.handelSearch} >
              <button className="m-btn-radius m-btn-radius-small ant-btn m-btn-gray ant-input-search-button">
                <i className="iconfont icon-search ant-input-search-icon" />
              </button>
            </span>
          </span>
        </div>
        <div className="scroll" style={{ height: '37rem' }}>
          <Menu
            className={`${styles.m_Menu} m-menu-middle m-menu-line m-gjsx-menu`}
            onClick={this.handleClick}
            inlineIndent={18}
            style={{ paddingLeft: '.75rem', width: '100%', height: '100%' }}
            openKeys={this.state.openKeys}
            onOpenChange={this.onToggle}
            selectedKeys={[this.state.current]}
            mode="inline"
          >
            {
              this.renderSubMenu(arr)
            }
          </Menu>
        </div>
      </div>
    );
  }
}

export default LabelLeftMenu;
