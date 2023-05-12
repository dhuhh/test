import React from 'react';
import { Icon, message, Modal } from 'antd';
import { FetchSaveSearchScheme, FetchMySearchScheme } from '../../../../../services/customerbase/mySearchScheme';

// 高级筛选弹出框 左菜单通用组件
class LeftMenu extends React.Component {
  state={
    inputVal: '',
    hightLight: [],
    menuDatas: [],
  }
  componentDidMount() {
    const { currentKey, userBusinessRole, queryParameter } = this.props;
    this.fetchMySearchScheme(currentKey, userBusinessRole, queryParameter);
  }
  componentWillReceiveProps(nextProps) {
    const { currentKey, userBusinessRole, queryParameter } = nextProps;
    if (currentKey !== this.props.currentKey) {
      this.fetchMySearchScheme(currentKey, userBusinessRole, queryParameter);
    }
  }
  onSearch = (value) => {
    const { menuDatas } = this.state;
    const keys = [];
    menuDatas.forEach((element) => {
      const { faid, famc } = element;
      if (value && famc.indexOf(value) >= 0) {
        keys.push(faid);
      }
    });
    this.setState({
      hightLight: keys,
    });
  }
  fetchMySearchScheme(currentKey, userBusinessRole, queryParameter) {
    const khfw = queryParameter.customerQueryType;
    const { mySearchSchemeService } = this.props;
    (mySearchSchemeService || FetchMySearchScheme)({
      falx: currentKey,
      xtjs: userBusinessRole,
      khfw,
    }).then((datas) => {
      const { records = [] } = datas;
      this.setState({
        menuDatas: records,
      });
    });
  }
  handleClick = (key, famc) => {
    const { onPlanClick } = this.props;
    if (onPlanClick) {
      onPlanClick(key, famc);
    }
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
  deletPlan = (faid, famc) => {
    const { userBusinessRole, queryParameter, currentKey, onSaveScheme } = this.props;
    const _this = this;
    const modal = Modal.confirm({
      title: '删除方案',
      content: <p>确定要删除方案【{famc}】吗</p>,
      onOk() {
        return FetchSaveSearchScheme({
          faid,
          czlx: 3,
        }).then(() => {
          _this.fetchMySearchScheme(currentKey, userBusinessRole, queryParameter);
          // 外部保存后调用的方法
          if (onSaveScheme) {
            onSaveScheme();
          }
        }).catch((error) => {
          modal.destroy();
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() {},
    });
  }
  render() {
    const { menuDatas } = this.state;
    const { currentKey, faid: fjfaid } = this.props;
    return (
      <div>
        <div className="ant-row ant-form-item">
          <span className="m-input-search-form ant-input-search ant-input-search-enter-button ant-input-affix-wrapper">
            <input type="text" placeholder="" value={this.state.inputVal} onChange={this.handelChange} onKeyDown={this.handelEnter} className="ant-input" />
            <span className="ant-input-suffix" onClick={this.handelSearch} >
              <button className="m-btn-radius m-btn-radius-small ant-btn m-btn-white ant-input-search-button">
                <i className="iconfont icon-search ant-input-search-icon" />
              </button>
            </span>
          </span>
        </div>
        <ul className="ant-menu m-menu m-menu-middle m-menu-line ant-menu-light ant-menu-root ant-menu-inline" style={{ width: '100%', height: '28rem', overflowY: 'auto' }}>
          {menuDatas.map((item) => {
            const { faid, famc = '' } = item;
            let color = '';
            let classNm = '';
            if (parseInt(fjfaid, 10) === parseInt(faid, 10)) {
              color = '';
              classNm = 'm-color';
            }
            if (this.state.hightLight.includes(faid)) {
              color = 'red';
            }
            const tempFamc = famc;
           return (
             <li onClick={() => this.handleClick(faid, famc)} key={faid} className="ant-menu-item wbcd-menu" role="menuitem" style={{ paddingLeft: '24px' }}>
               <span style={{ color }} className={ classNm }>
                 <span title={famc}>{tempFamc}</span>
                 <Icon onClick={(e) => { e.preventDefault(); this.deletPlan(faid, famc); }} style={{ display: currentKey === '2' ? '' : 'none', cursor: 'pointer', color: 'red', position: 'absolute', right: '0', top: '1.083rem' }} type="close" />
               </span>
             </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default LeftMenu;
