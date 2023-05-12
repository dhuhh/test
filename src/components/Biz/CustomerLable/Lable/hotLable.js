import React from 'react';
import { Row, Col, Tag, message } from 'antd';
import { FetchMyCusLable } from '../../../../services/customerbase/customerListHandle';

class HotLable extends React.Component {
  state={
    current: 1,
    hotCusLable: [],
  }
  componentDidMount() {
    FetchMyCusLable({
      paging: 1,
      current: 1,
      pageSize: 10,
      total: -1,
      sort: '',
      bqlx: 2,
    }).then((response) => {
      const { records = [] } = response;
      this.setState({
        hotCusLable: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handClick=(e) => {
    e.preventDefault();
    const { hotCusLable = {} } = this.props;
    const { total } = hotCusLable;
    const totalPage = total % 10 === 0 ? total / 10 : Math.ceil(total / 10);
    if (this.state.current + 1 > totalPage) {
      FetchMyCusLable({
        paging: 1,
        current: 1,
        pageSize: 10,
        total: -1,
        sort: '',
        bqlx: 2,
      }).then((response) => {
        const { records = [] } = response;
        this.setState({
          hotCusLable: records,
          current: 1,
        });
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else {
      FetchMyCusLable({
        paging: 1,
        current: this.state.current,
        pageSize: 10,
        total: -1,
        sort: '',
        bqlx: 2,
      }).then((response) => {
        const { records = [] } = response;
        this.setState({
          hotCusLable: records,
          current: this.state.current + 1,
        });
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }
  render() {
    const { selectedLable, handleTagSelect } = this.props;
    return (
      <div>
        <Row className="m-row-tag">
          <Col sm={24}>
            <div className="m-hot-label clearfix">
              <span className="hot-label-left">请添加属于客户的标签</span>
              {/* <a href="#" onClick={this.handClick} className="txt-d hot-label-right">换一换</a> */}
            </div>
          </Col>
          <Col sm={24}>
            {this.state.hotCusLable.map((item) => {
              const { bqid, bqmc } = item;
              return (
                <Tag.CheckableTag
                  className={`${selectedLable.includes(bqid) ? 'm-tag-popup m-tag-blue' : 'm-tag-popup'}`}
                  key={bqid}
                  checked={selectedLable.includes(bqid)}
                  onChange={checked => handleTagSelect(checked, bqid, bqmc)}
                >
                  <span className="ant-tag-text">
                    <span className="">{bqmc}</span>
                  </span>
                </Tag.CheckableTag>
              );
            })}
          </Col>
        </Row>
      </div>
    );
  }
}
export default HotLable;
