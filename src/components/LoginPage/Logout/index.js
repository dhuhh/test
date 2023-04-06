import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';

// 注销按钮,在需要的时候可以调用,需要传入一个dispatch方法
const Logout = ({ dispatch }) => {
  const enterLogout = () => {
    if (dispatch) {
      dispatch({ type: 'global/logout' });
    }
  };
  const { className } = this.props;
  return (
    <span className={classNames(className)} key="logout" title="登出">
      <Icon type="logout" onClick={enterLogout} />
    </span >
  );
};

export default Logout;
