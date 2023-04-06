/* eslint-disable react/forbid-prop-types */
/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { EncryptBase64 } from '@/components/Common/Encrypt';


class Links extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static propTypes = {
    // id: PropTypes.number || PropTypes.string, // id
    name: PropTypes.string, // 名称
    target: PropTypes.string, // 打开方式
    className: PropTypes.string, // 样式名称
    style: PropTypes.object,
    productType: PropTypes.string, // 产品类型
    children: PropTypes.object, // 产品类型
  }
  static defaultProps = {
    target: '_blank',
    url: '/single/product/details',
    // url: '/productPanorama/index',
  }
  render() {
    const { id, name, target, style, className, productType, children, url } = this.props;
    return (
      <Link
        to={`${url}?${EncryptBase64(id)}`}
        className={className}
        title={name}
        style={{ ...style }}
        target={target}
      >
        { children ? children : name}
      </Link>
    );
  }
}
export default Links;
