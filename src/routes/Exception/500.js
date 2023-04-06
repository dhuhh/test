import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'dva/router';

export default () => (
  <Result
    status="500"
    subTitle="抱歉，服务器出错了"
    extra={<Button type="primary" ><Link to="/index">返回首页</Link></Button>}
  />
);
