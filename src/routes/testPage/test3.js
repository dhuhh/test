import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

class Test3 extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    setTimeout(() => {
      dispatch({
        type: 'test3/changeTextAction',
        payload: { text: '55555' },
      });
    }, 2000);
  }
  // componentWillReceiveProps(nextProps) {
  //   console.info(nextProps);
  // }
  onClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'test3/changeTextAction',
      payload: { text: '444444' },
    });
  }
  render() {
    const { text } = this.props;
    return (
      <div>
        <Button onClick={this.onClick}>按钮</Button>
        {text}
      </div>
    );
  }
}

export default connect(({ test3 }) => ({ text: test3.text }))(Test3);
