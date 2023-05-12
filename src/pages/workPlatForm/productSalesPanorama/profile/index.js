import React, { Component } from 'react';
import { connect } from 'dva';
import Iframe from 'react-iframe';
import { encryptByDES } from '../../../../utils/bd_utils';
import moment from 'moment';
import lodash from 'lodash';
import { Empty } from 'antd';

class index extends Component {
  render() {
    const { sysParam = [], productCode } = this.props;
    const secretToke = encryptByDES(`3600#${moment().format('YYYYMMDD')}`, 'qfhzxcfg');

    // 获取ip
    const itemArr = sysParam.filter(i => i.csmc === 'system.c4.url');
    const ip = lodash.get(itemArr, '[0].csz', '');
    console.log(ip);
    // 拼接url
    const url = `${ip}/apps/pif/src/pif/login/imitate.html?secretToke=${secretToke}&procode=${productCode}`;
    return (
      <div style={{ height: 'calc(100vh)' }}>
        {
          ip ? (
            <Iframe
              url={url}
              width="100%"
              height="100%"
              id="myId"
              display="initial"
              position="relative"
              frameBorder ='0'
            />
          ) : <Empty />
        }
      </div>
    );
  }
}
export default index;
