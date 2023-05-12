import React from 'react';
import { Row, Col, Input, Tag } from 'antd';

const { Search } = Input;

class MyGroup extends React.Component {
  state={
    searchText: '',
  }
  handelSearch = (value) => {
    this.setState({
      searchText: value,
    });
  }
  searchChange =(e) => {
    const { value } = e.target;
    this.setState({
      searchText: value,
    });
  }
  render() {
    const { selectedLable = [], handleTagSelect, groups = [] } = this.props;
    return (
      <div>
        <Row className="m-row-tag">
          <Col sm={24} lg={8}>
            <Search
              placeholder=""
              className="m-input-search-white"
              onChange={this.searchChange}
              onSearch={value => this.handelSearch(value)}
              style={{ width: '30rem', marginBottom: '1.333rem' }}
            />
          </Col>
          <Col sm={24}>
            {
              groups.map((item) => {
                const { khqid, khqmc } = item;
                let tempClassName = `${selectedLable.includes(khqid) ? 'm-tag-popup m-tag-blue' : 'm-tag-popup'}`;
                if (this.state.searchText && khqmc.indexOf(this.state.searchText) >= 0) {
                  tempClassName = `${tempClassName} m-tag-orange`;
                }
                return (
                  <Tag.CheckableTag
                    className={tempClassName}
                    key={khqid}
                    checked={selectedLable.includes(khqid)}
                    onChange={checked => handleTagSelect(checked, khqid, khqmc)}
                  >
                    <span className="ant-tag-text">
                      <span className="">{khqmc}</span>
                    </span>
                  </Tag.CheckableTag>
                );
              })
            }
          </Col>
        </Row>
      </div>
    );
  }
}
export default MyGroup;
