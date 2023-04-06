/* eslint-disable no-debugger */
import React from 'react';
import { Dropdown, Menu, message } from 'antd';
import { FetchUserMenuProject, FetchUserProjectUpdate } from '../../../../../../services/commonbase';
import { FetchAes } from '../../../../../../services/tool';

class SwitchMenu extends React.Component {
  state = {
    isHide: true,
    names: [],
    describes: [],
    notes: [],
    selectMenu: '',
  }

  componentDidMount() {
    // 获取默认菜单方案
    this.fetchProject();
  }

  fetchProject = async () => {
    // 获取默认菜单方案
    await FetchUserMenuProject().then((response1) => {
      const { records: records1 = [] } = response1 || {};
      if (Array.isArray(records1)) {
        const names = [];
        const describes = [];
        const notes = [];
        records1.forEach((item) => {
          const { name = '', describe = '', note } = item;
          if (name && describe) {
            names.push(name);
            describes.push(describe);
            notes.push(note);
          }
        });
        const { location: { pathname, search } } = this.props;
        this.handleChange(names[0], pathname.concat(search), notes[0]);
        this.setState({
          names,
          describes,
          notes,
          selectMenu: names[0] || '',
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleClick = () => {
    this.setState({
      isHide: !this.state.isHide,
    });
  }

  handleChange = async (name, path = '', note = '') => {
    const { fetchMenuDatas } = this.props;
    if (note !== '') {
      const linkObj = JSON.parse(note);
      const { WINDOWTYPE = 'SELF', URL = '', ISAUTH = '1' } = linkObj; // WINDOWTYPE 弹窗类型 SELF：当前页面打开|PAGE:新页面打开 ISAUTH 是否需要auth认证 0:需要|1:不需要
      const { host } = window.location;
      if (!URL.includes(host) && !host.includes('localhost') && !host.includes('127.0.0.1')) {
        await FetchUserProjectUpdate({
          zjfa: name,
        }).then((res) => {
          const { code } = res;
          if (code > 0) {
            if (WINDOWTYPE === 'SELF') {
              if (ISAUTH === '0') {
                this.getUrl(URL, WINDOWTYPE);
              } else {
                window.location.href = URL;
              }
            } else if (ISAUTH === '0') {
              this.getUrl(URL, WINDOWTYPE);
            } else {
              window.open(URL);
            }
          }
        });
        return;
      }
    }
    this.setState({
      selectMenu: name,
    });
    FetchUserProjectUpdate({
      zjfa: name,
    });
    if (path) {
      fetchMenuDatas(name, false, path); // 从别的地址刷新页面
    } else {
      fetchMenuDatas(name, true); // 从登陆页面进入菜单
    }
  }

  getUrl = async (url, urlType) => {
    const { userBasicInfo = {} } = this.props;
    await FetchAes({
      optType: 'encode',
      content: JSON.stringify({ userName: userBasicInfo.userid || '', timestamp: new Date().getTime() }),
    }).then((ret) => {
      const { code = 0, note = '', data = '' } = ret;
      if (code > 0) {
        if (urlType === 'SELF') {
          window.location.href = `${url}&token=${data}`;
        } else {
          window.open(`${url}&token=${data}`);
        }
      } else {
        message.error(note);
      }
    });
  }

  render() {
    const { names, notes, describes, isHide, selectMenu } = this.state;
    return (
      <div>
        {
          names.length > 1 ? (
            <Dropdown
              trigger={['click']}
              onClick={this.handleClick}
              title="系统切换"
              overlay={
                <Menu
                  className="m-dropdown-nav"
                  onSelect={this.handleChange}
                >
                  {
                    names.map((name, index) => {
                      return (
                        <Menu.Item key={`${name}-${index}`} className={selectMenu === name ? 'current' : ''} >
                          <a href="#" onClick={(e) => { e.preventDefault(); this.handleChange(name, '', notes[index]); }} style={{ color: '#666', textAlign: 'center', display: 'block', padding: '1rem' }}>
                            <span>{describes[index]}</span>
                          </a>
                        </Menu.Item>
                      );
                    })
                  }
                </Menu>
              }
            >
              <ul className="m-menu-horizontal ant-menu ant-menu-dark ant-menu-root ant-menu-inline" style={{ padding: 0, background: 'transparent', width: 'auto', margin: '0 0.5rem' }}>
                <li className="ant-menu-submenu ant-menu-submenu-inline">
                  <div className="ant-menu-submenu-title" style={{ padding: ' 0 1rem' }} title={describes[names.findIndex((temp) => { return temp === selectMenu; })] || '方案选择'}>
                    <span style={{ color: '#FFF' }}>
                      <span className="hide-menu inoneline" style={{ width: '8.666rem', float: 'left' }} ><i className="iconfont icon-profile" />&nbsp;{describes[names.findIndex((temp) => { return temp === selectMenu; })] || '方案选择'}</span>
                      <i className={`iconfont ${isHide ? 'icon-down-solid-arrow' : 'icon-up-solid-arrow'}`} style={{ fontSize: '1rem', paddingLeft: '0.5rem' }} />
                    </span><div className="m-waves-ripple" />
                  </div>
                </li>
              </ul>
            </Dropdown>
          ) : ''
        }
      </div>
    );
  }
}
export default SwitchMenu;
