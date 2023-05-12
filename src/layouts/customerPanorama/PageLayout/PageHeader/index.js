import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import logo from '$assets/logo.svg';
import styles from './index.less';

export default class PageHeader extends PureComponent {
  render () {
    return (
      <Layout.Header className={styles.header}>
        <div>
          <img src={logo} alt='' />
        </div>
        <div className={styles.line} />
        <div className={styles.title}>CRM (客户360)</div>
      </Layout.Header>
    );
  }
}
