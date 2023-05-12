import React from "react";
import styles from "./index.less";
import questionImg from "$assets/newProduct/customerPortrait/question-mark.png";
import { Progress, Popover } from "antd";
export default function ShowCard(props) {
  const changeFontsize2 = (indexValue, targetValue) => {
    if (targetValue == 0) {
      return "18px";
    } else if ((indexValue / targetValue) * 100 == 0) {
      return "18px";
    } else if (
      ((indexValue / targetValue) * 100).toFixed(2).toString().length <= 5
    ) {
      return "18px";
    } else {
      return (
        `${90 / (((indexValue / targetValue) * 100).toFixed(2).toString().length)}px`
      );
    }
  };
  const changeFontsize = (x, y) => {
    const z = x + y;
    if (z <= 8) {
      return "24px";
    }
    return `${250 / z}px`;
  };
  const keepTwoDecimalPlaces=(val) => {
    // 如果存在小数点，则四舍五入保留两位小数，如果是整数则直接显示整数
    let number =parseFloat(val);
    if (number && String(number).indexOf('.') !== -1) {
      number = number.toFixed(2);
    }
    return number
  }
  return (
    <div
      className={styles.cardItem}
      style={{
        fontWeight: "normal",
        border:
          props.borderC === props.indexId
            ? "1px solid #244FFF"
            : "1px solid #EAECF2"
      }}
      onClick={() => {
        //console.log(props.id,props.borderC)
        props.clecked({ ...props });
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              display: "flex",
              //justifyContent: "space-between",
              alignItems: "center",
              padding: 16
            }}
          >
            <span
              className={styles.spananame}
              style={{
                color: "#61698C",
                paddingRight: "4px",
                fontSize: 14
              }}
            >
              {props?.indexName||'--'}
            </span>
            {props.remark.length !== 0 ? (
              <Popover
                overlayClassName={styles.indexDetail}
                arrowPointAtCenter={true}
                content={
                  <div
                    style={{
                      background:'#474D64',
                      color: "#FFFFFF",
                      padding: 16,
                      width: 192,
                      boxSizing: "border-box"
                    }}
                  >
                    {props?.remark}
                  </div>
                }
                title={null}
                placement="bottomLeft"
                trigger="hover"
              >
                <img
                  style={{
                    width: 15,
                    marginTop: -2,
                    marginLeft: 2
                  }}
                  src={questionImg}
                  alt=""
                />
              </Popover>
            ) : null}
          </div>
          <div
            style={{
              //background: "pink",
              fontSize: 24,
              color: "#1A2243",
              fontFamily: "EssenceSansStd-Regular",
              padding: "0 16px",
              paddingTop: "8px",
              //marginBottom: 16,
              height: 21
            }}
          >
            <div
              className={styles.spananame}
              style={{
                paddingBottom: "3px",
                fontWeight: "600",
                color: "#1A2243",
                fontSize: changeFontsize(
                  props.indexValue.length,
                  props.targetValue.length
                )
              }}
            >
              {(props?.indexValue)||'--'}/{(props?.targetValue)||'--'}
            </div>
            <div
              className={styles.spananame}
              style={{
                fontSize: "14px",
                fontWeight: "400",
                color: "#959CBA"
              }}
            >
              完成值/目标值
            </div>
          </div>
        </div>
        <div
          style={{
            //background: "pink",
            //flex: "1",
            display: "flex",
            //alignItems: "center",
            justifyContent: "center"
            //marginLeft: "55px"
          }}
        >
          <div
            id="kaoHePie"
            style={{
              display: "flex",
              height: "86px",
              width: "86px",
              //background: "black",
              margin: "19px",
              //marginLeft: "35px",
              fontWeight: "600",
              fontSize: "18px"
              //border: "1px solid"
            }}
          >
            <Progress
              type="circle"
              percent={
                props.targetValue == 0
                  ? 0
                  : (props.indexValue / props.targetValue) * 100
              }
              format={() => (
                <span
                  style={{
                    color: "#1A2243",
                    fontWeight:600,
                    fontSize: changeFontsize2(
                      props.indexValue,
                      props.targetValue
                    )
                  }}
                >
                  {props.targetValue == 0
                    ? "0%"
                    : `${
                        (props.indexValue / props.targetValue) * 100 == 0
                          ? 0
                          : (
                              (props.indexValue / props.targetValue) *
                              100
                            ).toFixed(2)
                      }%`}
                </span>
              )}
              //percent={(props?.indexValue / props?.targetValue) * 100}
              //format={()=>`${(props?.indexValue / props?.targetValue) * 100}%`}
              width={86}
              strokeLinecap="butt"
              strokeWidth={11}
              strokeColor="#00B7FF"
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#F6FAFF",
          padding: "11px 16px",
          fontSize: "14px"
        }}
      >
        <span style={{ color: "#61698C" }} className={styles.spananame}>
          营业部排名：
          <span style={{ fontWeight: 600 }}>{props?.departRanking||'--'}</span>
          {/* {Number(Income?.tranStatus) < 0 ? "昨日减少" : "昨日新增"} */}
        </span>
        <span
          className={styles.spananame}
          style={{
            color: "#61698C"
          }}
        >
          考核系数：{" "}
          <span style={{ fontWeight: 600 }}>{props?.assCoefficient||'--'}</span>
        </span>
      </div>
    </div>
  );
}
