import React from 'react';
import { Row, Col, Button } from 'antd';
// 省市选择组件
class CardContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
            
    };
  }

    onClick = (item) => {
      this.props.onClose(false);
      this.props.setData('sjsd', item.cityPro);
      this.props.setData('sjsdId', item.id);
    }

    fetchHtml = () => {
      const { data, sequence = '' } = this.props;
      const html = (
        <Row>
          {sequence !== '' ? <Col span={1} style={{ paddingTop: '.4rem', color: '#FF6E30' }}>{sequence}</Col> : ''}
          <Col span={sequence === '' ? 24 : 23}>
            {data.map((item) => {
              return <Col span={4}><Button type="text" className="m-bss-card-btn yhsl fs14" onClick={() => this.onClick(item)} title={item.cityPro} >{item.cityPro}</Button></Col>;
            })}
          </Col>
        </Row>
      );
      return html;
    }

    render() {
        
      return (
        this.fetchHtml()
      );
    }
}
export default CardContent;
