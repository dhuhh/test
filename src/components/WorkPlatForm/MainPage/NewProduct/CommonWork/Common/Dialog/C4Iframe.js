import React, { Component } from 'react';
import { connect } from 'dva';
import getIframeSrc from '$utils/getIframeSrc';
import Iframe from 'react-iframe';
import styles from '../index.less';

class C4Iframe extends Component {
  // componentDidMount() {
  //   console.log('objectobjectobjectobjectobjectobjectobjectobject');
  //   window.addEventListener('message', (e) => {
  //     const { page, action, success } = e.data;
  //     console.log(e.data, '=======================');
  //   });
  // }

  render() {
    const { sysParam = [], } = this.props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    return(
      <Iframe src={getIframeSrc(this.props.tokenAESEncode, this.props.src, server)} width='100%' height='600px' className={styles.iframe} />
    );
  }
}

export default connect(({global}) => ({
  sysParam: global.sysParam,
  tokenAESEncode: global.tokenAESEncode,
}))(C4Iframe);