import React from "react";
import { Pagination } from "antd";
import styles from "./index.less";

export default function Epagination(props) {
  /*
   *props : {options:{} ,  onChange } （默认入参）
   *
   *options : 沿用antd自带api （组件默认带有以下属性）
   *
   *size | small小尺寸  默认不是小尺寸
   *
   */
  const { options = {}, onChange } = props;
  return (
    <Pagination
      {...options}
      showLessItems
      showQuickJumper
      className={
        options.size === "small" ? styles.EpaginationMini : styles.Epagination
      }
      showSizeChanger
      hideOnSinglePage={options?.total > 0 ? false : true}
      pageSizeOptions={["10", "20", "50", "100"]}
      total={options?.total}
      showTotal={() => `总共${options?.total}条`}
      onShowSizeChange={onChange}
      // size="small"
      onChange={onChange}
      itemRender={(current, type, originalElement) => {
        if (type === "prev") {
          return (
            <a className="ant-pagination-item-link prev-btn">
              <i aria-label="图标: left" className="anticon anticon-left">
                <svg
                  t="1667288761116"
                  viewBox="64 64 896 896"
                  p-id="2501"
                  data-icon="left"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  transform="rotate(90)"
                >
                  <path
                    d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z"
                    p-id="2502"
                  ></path>
                </svg>
              </i>
            </a>
          );
        } else if (type === "next") {
          return (
            <a className="ant-pagination-item-link next-btn">
              <i aria-label="图标: right" className="anticon anticon-right">
                <svg
                  t="1667288761116"
                  viewBox="64 64 896 896"
                  p-id="2501"
                  data-icon="right"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  transform="rotate(-90)"
                >
                  <path
                    d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z"
                    p-id="2502"
                  ></path>
                </svg>
              </i>
            </a>
          );
        }
        return originalElement;
      }}
    />
  );
}
