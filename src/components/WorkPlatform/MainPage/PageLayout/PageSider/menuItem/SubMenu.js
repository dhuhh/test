import React from 'react';
import classnames from 'classnames';
import lodash from 'lodash';

class SubMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuKeys: this.props.selectedMenuKeys,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.editExpendKey(nextProps.selectedMenuKeys);
  }
  editExpendKey = (selectedMenuKeys) => {
    this.setState({
      selectedMenuKeys,
    });
  }
  menuLangKey = (item = {}) => {
    const langKeys = lodash.get(item, 'title', []).filter(m => lodash.get(m, 'lang') === 'en') || [];
    if (langKeys.length > 0) {
      return lodash.get(langKeys, '[0].text', '');
    }
    return lodash.get(item, 'title[0].text', '');
  }
  render() {
    const { menuData = {}, location = {} } = this.props; // eslint-disable-line
    const { selectedMenuKeys = [] } = this.state;
    const menuClass = selectedMenuKeys && selectedMenuKeys.includes(this.menuLangKey(menuData)) ? 'ant-menu-item-selected' : '';
    return (
      <li className={classnames('ant-menu-submenu ant-menu-submenu-vertical', menuClass)}>
        <div className="ant-menu-submenu-title">
          <span>
            <i className={`iconfont ${lodash.get(menuData, 'iconUrl', '')}`} />
            <span className="hide-menu">{lodash.get(menuData, 'title[0].text', '')}</span>
          </span>
          <i className="ant-menu-submenu-arrow" />
        </div>
      </li>
    );
  }
}
export default SubMenu;
