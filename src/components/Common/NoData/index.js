import React, { Component } from 'react';
import PropTypes from 'prop-types';
import imgs from '@/assets/nodata.png';


class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  static propTypes = {
    height: PropTypes.string, // 高度
    img: PropTypes.string, // 图片
    imgWidth: PropTypes.string, // 图片宽度
    title: PropTypes.string, // 标题
    titleColor: PropTypes.string,
  }
  static defaultProps = {
    height: '240px',
    img: imgs,
    imgWidth: '146px',
    title: '暂无数据',
    titleColor: 'rgba(0, 0, 0, 0.25)',
  }
  render() {
    const { height, img, imgWidth, title, titleColor } = this.props;
    return (
      <div style={{ height, textAlign: 'center' }} className="dis-fx alc flex-direction noData">
        <img src={img} alt={title} title={title} style={{ width: imgWidth }} />
        <div style={{ textAlign: 'center', color: titleColor, fontSize: '14px' }}>{title}</div>
      </div>
    );
  }
}
export default index;
