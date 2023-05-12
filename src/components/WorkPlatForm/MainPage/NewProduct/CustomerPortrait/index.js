import React, { Component } from 'react';
import Profile from './Profile';
import Perceive from './Perceive';
import Business from './Business';
import Ability from './Ability';
import Diagnosis from './Diagnosis';
import Propriety from './Propriety';
import styles from './index.less';
class CustomerPortrait extends Component {
  render() {
    let { cusCode } = this.props;
    if (cusCode === ':customerCode') {
      cusCode = 1232541;
    }
    return (
      <div className={styles.customerPortrait}>
        <div className={styles.left}>
          <Profile cusCode={cusCode} />
          <Perceive cusCode={cusCode} />
          <Business cusCode={cusCode} />
        </div>
        <div className={styles.right}>
          <Ability cusCode={cusCode} />
          <Diagnosis cusCode={cusCode} />
          <Propriety cusCode={cusCode} />
        </div>
      </div>
    );
  }
}
export default CustomerPortrait;