import React, { Component } from 'react';
import { Tag } from 'antd';
import Title from '../Common/Title';
import { QueryCusLabel } from '$services/newProduct';
import styles from './index.less';

export default class Business extends Component {
  state = {
    cusLabel: [],
  }
  componentDidMount() {
    QueryCusLabel({
      cusNo: this.props.cusCode,
      userId: 0,
    }).then(res => {
      const { records } = res;
      let cusLabel = records.filter((item, index) => item.type === '4');
      this.setState({
        cusLabel: cusLabel,
      });
    });
  }
  render() {
    return (
      <div className={styles.business}>
        <Title title='已开通业务' />
        <div className={styles.tag}>
          {
            this.state.cusLabel.map((item, index) => (
              <Tag key={index}>{item.name}</Tag>
            ))
          }
        </div>
      </div>
    );
  }
}
