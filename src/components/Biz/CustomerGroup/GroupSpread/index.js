import React from 'react';
import { Button } from 'antd';

class GroupSpreadBtn extends React.Component {
  handleGroupSpreadClick = (val) => {
    const { changeShowGroupSpread } = this.props;
    if (changeShowGroupSpread && typeof changeShowGroupSpread === 'function') {
      changeShowGroupSpread(val);
    }
  }
  render() {
    const { showGroupSpread = false, disabled = false } = this.props;
    return (
      <React.Fragment>
        {
          showGroupSpread ? (
            <Button className="fcbtn m-btn-border m-btn-border-pink btn-1c" disabled={disabled} onClick={() => this.handleGroupSpreadClick(false)}>取消种群扩散</Button>
          ) : (
            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" disabled={disabled} onClick={() => this.handleGroupSpreadClick(true)}>种群扩散</Button>
          )
        }
      </React.Fragment>
    );
  }
}

export default GroupSpreadBtn;
