import React from 'react';
import { Tag } from 'antd';

const { CheckableTag } = Tag;
class TagChecked extends React.Component {
  state = {
    selectedTags: [],
  };
  handleChange(tag, checked) {
    const nextSelectedTag = [];
    if (checked) {
      nextSelectedTag.push(tag);
    }
    this.setState({ selectedTags: nextSelectedTag });
    const { onChange } = this.props;
    if (onChange) {
      onChange({ nextSelectedTag });
    }
  }
  render() {
    const { selectedTags } = this.state;
    const { recentRequirementType } = this.props;
    return (
      <div>
        <h6 style={{ marginRight: 8, display: 'inline' }}>Categories:</h6>
        {recentRequirementType.map(tag => (
          <CheckableTag
            className="m-tag-line"
            key={tag.flid}
            checked={selectedTags.indexOf(tag.flid) > -1}
            onChange={checked => this.handleChange(tag.flid, checked)}
          >
            {tag.flmc}
          </CheckableTag>
        ))}
      </div>
    );
  }
}
export default TagChecked;
