import React from 'react';
import { Card, Menu, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { funcManagingCusGroup } from '../../../../services/customerbase/managingCusGroup';
import MenuItem from './MenuItem';
import styles from './index.less';

class GroupInfo extends React.Component {
  constructor(props) {
    super(props);
    const { myCusGroup = [], departmentCusGroup = [] } = props;
    const openKeys = [];
    if (myCusGroup.length > 0) {
      openKeys.push('mine');
    } else if (departmentCusGroup.length > 0) {
      openKeys.push('share');
    } else {
      openKeys.push('mine');
    }
    this.state = {
      openKeys,
      searchValue: '',
      myCusGroup,
      departmentCusGroup,
      selectedKeys: [],
      inputVal: '',
    };
  }
  componentWillReceiveProps (nextProps) {
    const { selectedKey } = nextProps;
    if (selectedKey !== undefined) {
      this.setState({
        selectedKeys: [selectedKey],
      });
    }
  }
  onMenuOpenChange = (openKeys) => {
    const rootSubmenuKeys = ['share', 'mine'];
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  onMenuSelect = ({ item, key }) => {
    const { openKeys = [] } = item.props || {};
    const customerGroupType = openKeys[0] || '';
    const customerGroup = customerGroupType === 'mine' ? this.props.myCusGroup : this.props.departmentCusGroup || [];
    let customerGroupName = '';
    customerGroup.forEach((chiItem) => {
      if (chiItem.khqid === key) {
        customerGroupName = chiItem.khqmc;
      }
    });
    this.setState({
      selectedKeys: [key],
    });
    const { onSelecetedKeyChange } = this.props;
    if (onSelecetedKeyChange) {
      onSelecetedKeyChange(key, customerGroupType, customerGroupName);
    }
  }
  onInputSearth = (value) => {
    this.setState({ searchValue: value });
  }
  onDelClick = (e, key, khqmc, khqlx) => {
    funcManagingCusGroup({
      czlx: 3,
      khqlx,
      khqmc: '',
      khqid: key,
    }).then((result) => {
      const { note = '删除成功!' } = result;
      message.success(note);
      const { refreshCusGroupData } = this.props;
      if (refreshCusGroupData) {
        refreshCusGroupData();
      }
      const { selectedKey, onSelecetedKeyChange, myCusGroup, departmentCusGroup, handleDelete } = this.props;
      let nextSelectedKey = selectedKey;
      if (onSelecetedKeyChange) {
        if (myCusGroup.length > 1 && parseInt(khqlx, 10) === 1) {
          const firstKhqid = myCusGroup[0].khqid;
          nextSelectedKey = firstKhqid === key ? myCusGroup[1].khqid : firstKhqid;
        } else if (departmentCusGroup.length > 1 && parseInt(khqlx, 10) === 3) {
          const firstKhqid = departmentCusGroup[0].khqid;
          nextSelectedKey = firstKhqid === key ? departmentCusGroup[1].khqid : firstKhqid;
        } else {
          nextSelectedKey = '';
        }
        onSelecetedKeyChange(nextSelectedKey);
      }
      if (handleDelete) handleDelete(key, khqmc);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 创建/修改/删除客户群
  managingCusGroup = (params) => {
    funcManagingCusGroup(params).then((result) => {
      const { note = '删除成功!' } = result;
      message.success(note);
      const { refreshCusGroupData } = this.props;
      if (refreshCusGroupData) {
        refreshCusGroupData();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  handelEnter = (e) => {
    const { keyCode = 0, target: { value } } = e;
    if (keyCode === 13) {
      this.onInputSearth(value);
    }
  }

  handelSearch = () => {
    this.onInputSearth(this.state.inputVal);
  }

  handelChange = (e) => {
    const { target: { value } } = e;
    this.setState({
      inputVal: value,
    });
  }

  render() {
    const { selectedKeys, openKeys, searchValue, myCusGroup: myCusGroupInstate, departmentCusGroup: departmentCusGroupInstate } = this.state;
    const { myCusGroup: myCusGroupDatas = myCusGroupInstate, departmentCusGroup: departmentCusGroupData = departmentCusGroupInstate, authorities = {}, userBasicInfo, canOperate = true, menuClassType = 0 } = this.props; // menuClassType: 高级筛选--客群体系，菜单样式 1:高级筛选|0:客群管理
    // 根据筛选条件,只显示匹配的选项
    const myCusGroup = searchValue === '' ? myCusGroupDatas : myCusGroupDatas.filter(item => (item.khqmc && item.khqmc.includes(searchValue)));
    const departmentCusGroup = searchValue === '' ? departmentCusGroupData : departmentCusGroupData.filter(item => (item.khqmc && item.khqmc.includes(searchValue)));
    const { orgname = '--' } = userBasicInfo || {};

    // 判断是否有修改客户群名称和删除客户群的权限
    const { customerGroup = [] } = authorities;
    const canEdit = canOperate && customerGroup.includes('CusGroupUpdate');
    const canDel = canOperate && customerGroup.includes('CusGroupDelete');
    const stylesCss = menuClassType === 1 ? { paddingLeft: '.75rem', width: '100%', height: '100%' } : { border: '1px solid #ecedee', borderBottom: 'none' };
    return (
      <Card className="m-card default">
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
        {/* <Input.Search
          className="m-input-search-white"
          placeholder="群搜索"
          onSearch={this.onInputSearth}
        /> */}
        <Scrollbars
          autoHide
          style={{ marginTop: '1.333rem', width: '100%', height: '35rem' }}
        >
          <Menu
            mode="inline"
            // className="m-menu m-menu-middle m-menu-line"
            className={menuClassType === 1 ? `m-menu-middle m-menu-line m-gjsx-menu ${styles.m_Menu}` : 'm-menu m-menu-middle m-menu-line'}
            style={{ ...stylesCss  }}
            openKeys={openKeys}
            onOpenChange={this.onMenuOpenChange}
            selectedKeys={selectedKeys}
            onSelect={this.onMenuSelect}
          >
            {
              myCusGroup && myCusGroup.length > 0 ? (
                <Menu.SubMenu key="mine" title={<span><i className="line" /><span className="hide-menu">我的群</span><i className="ant-menu-submenu-arrow" /></span>}>
                  {
                    myCusGroup.map((item) => {
                      const { khqid = '', khqmc = '--' } = item;
                      return (
                        <Menu.Item key={khqid}>
                          <MenuItem canEdit={canEdit} canDel={canDel} khqid={khqid} khqlx="1" khqmc={khqmc} onDelClick={(e, key) => this.onDelClick(e, key, khqmc, 1)} />
                        </Menu.Item>
                      );
                    })
                  }
                </Menu.SubMenu>
              ) : ''
            }
            {
             Reflect.has(authorities, 'departmentCustomerRole') && departmentCusGroup && departmentCusGroup.length > 0 ? (
               <Menu.SubMenu key="share" title={<span><i className="line" /><span className="hide-menu">{orgname}</span><i className="ant-menu-submenu-arrow" /></span>}>
                 {
                    departmentCusGroup.map((item) => {
                      const { khqid = '', khqmc = '--' } = item;
                      return (
                        <Menu.Item key={khqid}>
                          <MenuItem canEdit={canEdit} canDel={canDel} khqid={khqid} khqlx="2" khqmc={khqmc} onDelClick={(e, key) => this.onDelClick(e, key, khqmc, 3)} />
                          {/* <a href="#" onClick={(e) => { e.preventDefault(); }} title={khqmc}><span>{khqmc}</span></a> */}
                        </Menu.Item>
                      );
                    })
                  }
               </Menu.SubMenu>
              ) : ''
            }
            {
              myCusGroup.length === 0 && departmentCusGroup.length === 0 ? (
                <Menu.Item key="noData">
                  <div style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                    暂无数据!
                  </div>
                </Menu.Item>
              ) : ''
            }
          </Menu>
        </Scrollbars>
      </Card>
    );
  }
}
export default GroupInfo;
