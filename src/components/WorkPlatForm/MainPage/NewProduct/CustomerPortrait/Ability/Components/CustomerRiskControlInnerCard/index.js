import React, { Component } from 'react';
import styles from './index.less';

class CustomerRiskControlInnerCard extends Component {
  static defaultProps = {
    title: '',
    number: '',
    levels: [],
    type: 'sm',
    selectedLevel: 0,
  };

  render() {
    return (
      <div className={styles.card} style={this.props.style ? this.props.style : {}}>
        <div className={styles.title}>
          {(this.props.type || 'sm') == 'sm' ? (
            <img
              src={require("$assets/newProduct/customerPortrait/risk-control-sm-header.png")}
              alt=''
            />
          ) : (
              <img
                src={require("$assets/newProduct/customerPortrait/risk-control-sm-header.png")}
                alt=''
              />
            )}
          <div className={styles.titleContext}>
            {this.props.title}
          </div>
        </div>
        { this.props.children || (
          <div className={styles.main}>
            { this.props.number}
          </div>
        )}
        <div className={styles.barContainers}>
          <div
            className={styles.barContainer}
            style={{ marginRight: 2 }}
          >
            <div className={`${styles.bar} ${this.props.selectedLevel === 0 ? styles.left : ''}`} />
            <div className={styles.barContext, this.props.selectedLevel === 0 ? styles.selectedContext : ''}>
              {this.props.levels[0]}
            </div>
          </div>
          <div className={styles.barContainer}>
            <div className={`${styles.bar} ${this.props.selectedLevel === 1 ? styles.center : ''}`} />
            <div className={styles.barContext, this.props.selectedLevel === 1 ? styles.selectedContext : ''}>
              {this.props.levels[1]}
            </div>
          </div>
          <div
            className={styles.barContainer}
            style={{ marginLeft: 2 }}
          >
            <div className={`${styles.bar} ${this.props.selectedLevel === 2 ? styles.right : ''}`} />
            <div className={styles.barContext, this.props.selectedLevel === 2 ? styles.selectedContext : ''}>
              {this.props.levels[2]}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerRiskControlInnerCard;
