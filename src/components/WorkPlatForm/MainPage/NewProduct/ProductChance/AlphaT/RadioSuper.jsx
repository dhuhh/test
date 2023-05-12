import React, { Component } from "react";
import "./radioSuper.css";

export default class RadioSuper extends Component {
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
            className={item.id == select ? "active-btn" : "as-btn"}
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  }
}
