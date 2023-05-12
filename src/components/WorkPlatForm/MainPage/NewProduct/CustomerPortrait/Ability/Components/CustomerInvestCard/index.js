import React, { Component } from 'react';
import styles from './index.less';

class CustomerInvestCard extends Component {
  static defaultProps = {
    bottomText: '',
    headerTitle: '',
    headerDefeatNumber: '',
    headerDefeatText: '',
    headerDialogText: '',
  };

  render() {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          {this.props.children && this.props.children.length ? this.props.children.filter(item => item.props.name === 'headerIcon') : this.props.children}
          {this.props.headerTitle}
        </div>
        <div className={styles.cardScoreContainer}>
          <img src={require('$assets/newProduct/customerPortrait/profit-ability-blue-header.png')} alt='' />
          <div className={styles.cardScoreRow} id={this.props.headerTitle !== '盈利能力' ? styles.createLine : ''}>
            <div className={styles.cardScoreNum}>
              {this.props.headerDefeatNumber > 0 ? '+' : ''}
              {this.props.headerDefeatNumber}
              <span className={styles.cardScoreSub}>分</span>
            </div>
            <div className={styles.cardScoreContext}>
              {this.props.headerDefeatText}
            </div>
          </div>
          <div className={styles.cardScoreLine}></div>
          {this.props.headerDialogText ? (
            <div
              className={styles.cardScoreContainerDialog}
            >
              <img
                className={styles.left_quote}
                src={require("$assets/newProduct/customerPortrait/left-quote.png")}
                alt=''
              />
              <img
                className={styles.right_quote}
                src={require("$assets/newProduct/customerPortrait/right-quote.png")}
                alt=''
              />
              <div className={styles.dialog_container}>
                {this.props.headerDialogText}
              </div>
            </div>
          ) : ''
          }
        </div>
        { this.props.children && this.props.children.length ? this.props.children.filter(item => item.props.name === 'main') : this.props.children}
        {/* <!-- <div className={styles.bottomDate">
        <div className={styles.date">
          {{ minDate }}
        </div>
        <div className={styles.date">
          {{ maxDate }}
        </div>
      </div> --> */}
        <div className={styles.bottomDescription}>
          <img src={require("$assets/newProduct/customerPortrait/exclamation-mark.png")} alt='' />
          {this.props.bottomText}
        </div>
      </div>
    );
  }
}

export default CustomerInvestCard;
