import React from 'react';
import { Menu, Tooltip, Icon } from 'antd';
import { fetcSeniorMenu } from '../../../../../services/customersenior';
import styles from '../LabelCom/index.less';

// 高级筛选弹出框 左菜单通用组件
const { SubMenu } = Menu;
class LeftMenu extends React.Component {
  state={
    current: '',
    openKeys: [],
    inputVal: '',
    hightLight: [],
    menuJson: [],
  }
  componentDidMount() { // 获取菜单
    const { seniorMenuService } = this.props;
    if (seniorMenuService) {
      seniorMenuService().then((response) => {
        const { seniorMenuInfoRecord = [] } = response;
        if (Array.isArray(seniorMenuInfoRecord)) {
          this.setState({
            menuJson: seniorMenuInfoRecord,
          });
        }
      });
    } else {
      fetcSeniorMenu({ enableSide: 0, entityType: '1' }).then((response) => {
        const { records: seniorMenuInfoRecord = [] } = response;
        if (Array.isArray(seniorMenuInfoRecord)) {
          this.setState({
            menuJson: seniorMenuInfoRecord,
          });
        }
      });
    }
  }
  onToggle = (info) => {
    this.setState({
      // openKeys: info.length > 0 ? [info[info.length - 1]] : [],
      openKeys: info,
    });
  }
  onSearch = (value) => {
    const { seniorMenuService } = this.props;
    if (seniorMenuService) {
      const keys = [];
      const openKeys = [];
      this.state.menuJson.forEach((element) => {
        const { name, seniorContentInfoRecord = [] } = element;
        seniorContentInfoRecord.forEach((item) => {
          const { code, name: subName } = item;
          if (value && subName.indexOf(value) >= 0) {
            keys.push(code);
            openKeys.push(name);
          }
        });
      });
      this.setState({
        openKeys,
        hightLight: keys,
      });
    } else {
      const { keys, openKeys } = this.Searchkey(this.state.menuJson, value);
      this.setState({
        openKeys,
        hightLight: keys,
      });
    }
  }
  Searchkey = (arr, value) => {
    const keys = [];
    const openKeys = [];
    let isSearch = false; // 表示当前层级是否有匹配项
    arr.forEach((element) => {
      const { type, indexName, indexCode, childIndex = [] } = element;
      if (type === '2') {
        if (value && indexName.indexOf(value) >= 0) {
          isSearch = true;
          keys.push(indexCode);
        }
      } else {
        const { keys: ckeys, openKeys: copenKeys, isSearch: cisSearch } = this.Searchkey(childIndex, value);
        if(cisSearch) { // 如果子层级有那么 递归将所有的父节点加入open
          isSearch = cisSearch;
          if (indexName && !openKeys.includes(indexName)) {
            openKeys.push(indexName);
          }
        }
        keys.push(...ckeys);
        openKeys.push(...copenKeys);
      }
    });
    return { keys, openKeys, isSearch };
  }

  handleClick = (e) => {
    const { onMenuClick } = this.props;
    if (onMenuClick) {
      onMenuClick(e.key);
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
  renderSubMenu = (arr) => {
    return arr.map((item) => {
      const { type, indexName, indexCode, childIndex = [], caliber = '' } = item;
      if (type === '2') {
        return (
          <Menu.Item key={indexCode}>
            <span style={{ color: this.state.hightLight.includes(indexCode) ? 'red' : '' }}>
               <span>{indexName}</span>
            </span>
            {
              caliber && (
                <React.Fragment>
                  <Tooltip placement="bottomLeft" title={<div dangerouslySetInnerHTML={{ __html: caliber.replace(/(\r\n|\n|\r)/gm, "<br />") }} />}>
                    <Icon style={{ marginRight: '1.5rem', marginLeft: '0.333rem' }} type="question-circle" />
                  </Tooltip>
                </React.Fragment>
              )
            }
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu
            key={indexName}
            title={
              <span>
                {/* {type === '1' && <i className="line" style={{ width: '.166rem', height: '1.666rem', background: '#54a9df', display: 'inline-block', position: 'relative', top: '.33rem', marginRight: '1rem' }}/>} */}
                <span className="hide-menu"><i className="ant-menu-submenu-arrow" style={{ position: 'relative' }} />{indexName}</span>
              </span>}
            >
            {this.renderSubMenu(childIndex)}
          </SubMenu>
        );
      }
    });
  }
  render() {
    const { menuJson = [] } = this.state;
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
          {
            this.props.seniorMenuService ? ( // props传进来的接口可能是老的格式
              <Menu
                className="m-menu m-menu-middle m-menu-line m-gjsx-menu"
                onClick={this.handleClick}
                style={{ width: '100%', height: '100%' }}
                openKeys={this.state.openKeys}
                onOpenChange={this.onToggle}
                selectedKeys={[this.state.current]}
                mode="inline"
              >
                {
                  menuJson.map((item) => {
                    const { name, seniorContentInfoRecord = [] } = item;
                    return (
                      <SubMenu key={name} title={<span><i className="line" /><span className="hide-menu">{name}</span><i className="ant-menu-submenu-arrow" /></span>}>
                        {seniorContentInfoRecord.map((sub) => {
                          const { code: subKey, name: subTitle } = sub;
                          return (
                            <Menu.Item key={subKey}>
                              <a style={{ color: this.state.hightLight.includes(subKey) ? 'red' : '' }} href="#" onClick={(e) => { e.preventDefault(); }}>
                                <span>{subTitle}</span>
                              </a>
                            </Menu.Item>
                          );
                        })}
                      </SubMenu>
                    );
                  })
                }
              </Menu>
            ) : (
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
                  this.renderSubMenu(menuJson)
                }
              </Menu>
            )
          }
        </div>
      </div>
    );
  }
}

export default LeftMenu;
