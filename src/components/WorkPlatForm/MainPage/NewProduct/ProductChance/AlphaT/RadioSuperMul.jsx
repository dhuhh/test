import React, { Component } from "react";
import "./radioSuper.css";

export default class RadioSuperMul extends Component {
  handClick = item => {
    this.props.handleClick(item.id, this.props.type);
  };

  render() {
    const { valueInName, select } = this.props;
    return (
      <div className="up-btn">
        {valueInName.map(item => (
          <div
            onClick={() => this.handClick(item)}
            className={select.includes(item.id) ? "active-btn" : "as-btn"}
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  }
}
