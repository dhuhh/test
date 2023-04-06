/* eslint-disable react/no-unused-state */
import React from 'react';
import { Icon } from 'antd';

class Logo extends React.PureComponent {
  state = {
  }

  render() {
    const { collapsed, toggleCollapsed } = this.props;
    return (
      <div>
        <div className="left aLink" onClick={toggleCollapsed}>
          <a className="" style={{ padding: '0 1.25rem', lineHeight: '4.666rem' }}>
            <span >
              {!collapsed ?
                <Icon type="menu-unfold" style={{ marginRight: '0', fontSize: '1.5rem' }} /> :
                <Icon type="menu-fold" style={{ marginRight: '0', fontSize: '1.5rem' }} /> }
            </span>
          </a>
        </div>
      </div>
    );
  }
}
export default Logo;
