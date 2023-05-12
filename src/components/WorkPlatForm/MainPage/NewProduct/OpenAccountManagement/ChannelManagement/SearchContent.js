import React, { Component } from "react";
import { Form, Button, DatePicker, Select } from "antd";
import moment from "moment";
import SearchInput from "../Common/SearchInput";
import TreeUtils from "../../../../../../utils/treeUtils";
import SelectCheckbox from "../Common/SelectCheckbox";
import styles from "./index.less";

const { RangePicker } = DatePicker;

class SearchContent extends Component {
  state = {};
  componentDidMount() {}
  render() {
    const {
      channelValue,
      typeValue,
      dateValue,
      typeChange,
      dateChange,
      channelChange,
      searchInfo,
      searchByInfo,
      clearInputInfo,
      dictionary
    } = this.props;
    const channelTypeInfo = dictionary["CHNL_GLFL"] || [];
    return (
      <div className={styles.form}>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>渠道</div>
          <SearchInput
            channelValue={channelValue}
            channelChange={channelChange}
          />
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>分类</div>
          <Select
            className={styles.selectHeight}
            value={typeValue}
            defaultActiveFirstOption={false}
            onChange={typeChange}
            style={{ width: "160px" }}
          >
            <Select.Option key="全部" value="">
              全部
            </Select.Option>
            {channelTypeInfo.map(item => (
              <Select.Option key={item.ibm} value={item.ibm}>
                {item.note}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>创建日期从</div>
          <RangePicker
            value={dateValue}
            className={styles.selectHeight}
            dropdownClassName={`${styles.calendar} m-bss-range-picker`}
            style={{ width: "264px" }}
            placeholder={["开始日期", "结束日期"]}
            format="YYYY-MM-DD"
            separator="至"
            disabledDate={current => current && current > moment().endOf("day")}
            onChange={dateChange}
          />
        </div>
        <div className={styles.formItem}>
          <Button
            style={{ minWidth: 62 }}
            className="m-btn-radius ax-btn-small"
            type="button"
            onClick={clearInputInfo}
          >
            重置
          </Button>
          <Button
            style={{ minWidth: 62 }}
            className="m-btn-radius ax-btn-small m-btn-blue"
            type="button"
            onClick={searchByInfo}
          >
            查询
          </Button>
        </div>
      </div>
    );
  }
}
export default Form.create()(SearchContent);
