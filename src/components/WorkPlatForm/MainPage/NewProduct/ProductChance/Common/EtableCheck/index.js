import React from "react";
import { Table, Checkbox } from "antd";
import styles from "./index.less";

export default class eTableCheck extends React.Component {
  state = {
    checkboxCache: {
      selectAll: false,
      selectedRowKeys: [],
    },
  };

  componentDidUpdate() {
    // if (
    //   this.props.specialTotal &&
    //   this.props.rowSelection.selectedRowKeys.length
    // ) {
    //   this.checkboxRef.childNodes[0].childNodes[0].className =
    //     "ant-checkbox ant-checkbox-indeterminate";
    //   // this.checkboxRef.childNodes[0].childNodes[0].setAttribute('class', 'ant-checkbox ant-checkbox-indeterminate');
    // }
  }

  // 有支持跨页全选的checkbox的时候, 选中选项的keys存起来
  checkboxCache = { selectAll: false, selectedRowKeys: [] };
  // 获取rowKey对应的每条数据的值
  rowKeyValue = record => {
    const { rowKey = "id" } = this.props;
    if (typeof rowKey === "string") {
      return record[rowKey];
    } else if (typeof rowKey === "function") {
      return rowKey(record);
    }
  };
  // 有支持跨页全选的checkbox的时候, 选中某一行
  handleSelect = (event, value) => {
    event.stopPropagation(); // 阻止事件冒泡
    const { checked: selected } = event.target; // 选中/取消选中 的状态\
    let {
      dataSource,
      rowSelection: {
        onSelect,
        selectAll = this.state.checkboxCache.selectAll,
        selectedRowKeys = this.state.checkboxCache.selectedRowKeys,
      },
    } = this.props;
    let record = false; // 当前 选中/取消选中 的记录
    let currentSelectedRowKeys = []; // 当前所有的 选中/取消选中 的key值
    let selectedRows = []; // 当前所有的 选中/取消选中 的记录
    if ((selectAll && selected) || (!selectAll && !selected)) {
      // 如果勾选了全选, 选中该项后需要将selectedRowKeys中的该项去掉; 如果未勾选全选, 取消勾选该项后,也需要将selectedRowKeys中的该项去掉
      currentSelectedRowKeys.push(...selectedRowKeys);
      const index = selectedRowKeys.findIndex(item => item === value);
      currentSelectedRowKeys.splice(index, 1);
    } else if ((selectAll && !selected) || (!selectAll && selected)) {
      // 如果勾选了全选, 取消勾选该项后需要在selectedRowKeys中加上该项; 如果未勾选全选, 勾选该项后,也需要在selectedRowKeys中加上该项
      currentSelectedRowKeys.push(...selectedRowKeys);
      currentSelectedRowKeys.push(value);
    }

    dataSource.forEach(item => {
      const key = this.rowKeyValue(item);
      // 获取当前的记录
      if (!record && key === value) {
        record = item;
      }
      // 获取所有 选中/取消选中 的记录
      const index = currentSelectedRowKeys.findIndex(val => val === key);
      if (index !== -1) {
        selectedRows.push(item);
      }
    });
    if (onSelect) {
      onSelect(record, selected, selectedRows);
    }
    this.handleSelectChange(currentSelectedRowKeys, selectedRows, selectAll);
  };
  // 有支持跨页全选的checkbox的时候, 全选表格记录
  handleSelectAll = event => {
    event.stopPropagation(); // 阻止事件冒泡
    const { checked: selected } = event.target; // 全选/取消全选 的状态
    const {
      dataSource,
      rowSelection: {
        onSelectAll,
        selectAll = this.state.checkboxCache.selectAll,
        selectedRowKeys = this.state.checkboxCache.selectedRowKeys,
      },
    } = this.props;
    const currentSelectedRowKeys = []; // 当前所有的 选中/取消选中 的key值
    const selectedRows = []; // 当前所有的 选中/取消选中 的记录, 一般为空数组
    const changeRows = []; // 相比上次, 选中/取消选中 的记录中发生改变的记录
    if ((selectAll && selected) || (!selectAll && selected)) {
      if (selectedRowKeys.length > 0) {
        dataSource.forEach(item => {
          const key = this.rowKeyValue(item);
          // 获取所有 选中/取消选中 的记录
          const index = selectedRowKeys.findIndex(val => val === key);
          if (index !== -1) {
            changeRows.push(item);
          }
        });
      }
    }
    if (onSelectAll) {
      onSelectAll(selected, selectedRows, changeRows);
    }
    this.handleSelectChange(currentSelectedRowKeys, selectedRows, selected);
  };
  handleSelectChange(currentSelectedRowKeys, selectedRows, selectAll) {
    this.setState({
      checkboxCache: {
        selectedRowKeys: currentSelectedRowKeys,
        selectAll,
        selectedRows,
      },
    });
    const {
      rowSelection: { onChange },
    } = this.props;
    if (onChange) {
      onChange(currentSelectedRowKeys, selectedRows, selectAll);
    }
  }

  render() {
    const {
      rowSelection,
      rowKey = "",
      columns,
      dataSource,
      loading,
      options,
    } = this.props;
    const finalColumns = [];
    // 如果是checkbox且需要支持"跨页全选"",那么就禁用默认的选择器,自定义checkbox选择器
    let confirmCrossPageSelect = false; // 判断是否是跨页全选
    const {
      type = "checkbox",
      crossPageSelect = false,
      fixed = "",
      width = 68,
    } = rowSelection || {};
    if (
      rowSelection &&
      type === "checkbox" &&
      crossPageSelect &&
      dataSource.length > 0
    ) {
      confirmCrossPageSelect = true;
      const {
        selectAll = this.state.checkboxCache.selectAll,
        selectedRowKeys = this.state.checkboxCache.selectedRowKeys,
      } = rowSelection;

      const _this = this;
      // 添加一列用于渲染checkbox选择框
      finalColumns[0] = {
        width,
        fixed,
        className: "ant-table-selection-column",
        title: (
          <div className="m-bss-select-checkbox">
            <div
              ref={el => (this.checkboxRef = el)}
              className={`m-bss-select-dropdown-title`}
              style={{
                borderBottom: "none",
                padding: "3px 6px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Checkbox
                indeterminate={selectedRowKeys.length > 0}
                checked={selectAll}
                onChange={_this.handleSelectAll}
              />
            </div>
          </div>
        ),
        dataIndex: "checkbox",
        key: "checkbox",
        render(val, record) {
          const value = _this.rowKeyValue(record);
          return (
            <a
              onClick={e => {
                e.stopPropagation(); /** 阻止事件冒泡,防止onRowClick先于checkbox的change事件执行 * */
              }}
            >
              <div className="m-bss-select-checkbox">
                <div
                  className={`m-bss-select-dropdown-title`}
                  style={{
                    borderBottom: "none",
                    padding: "3px 6px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Checkbox
                    value={value}
                    checked={
                      (selectAll && !selectedRowKeys.includes(value)) ||
                      (!selectAll && selectedRowKeys.includes(value))
                    }
                    onChange={event => _this.handleSelect(event, value)}
                  />
                </div>
              </div>
            </a>
          );
        },
      };
    }
    // 将其它列放到finalColumns中
    finalColumns.push(...columns);

    return (
      <Table
        className={styles.eTableCheck}
        rowKey={rowKey}
        columns={finalColumns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        {...options}
        rowSelection={
          confirmCrossPageSelect || dataSource.length === 0
            ? null
            : rowSelection
        }
      />
    );
  }
}
