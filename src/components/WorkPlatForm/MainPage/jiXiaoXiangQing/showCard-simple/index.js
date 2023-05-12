import React from "react";
import styles from "./index.less";
import questionImg from "$assets/newProduct/customerPortrait/question-mark.png";
import {
  Divider,
  Popover,
} from "antd";
export default function ShowCardSimple(props) {
  const changeFontsize3=(x=0,y=0)=>{
    const z=x+y
    if(z<=7){
      return '36px'
    }
    return `${248 / z}px`;
  }
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
          height: "124px",
          border:
            props.borderD === props.indexId
              ? "1px solid #244FFF"
              : "1px solid #EAECF2"
        }}
        onClick={() => {
          //console.log(props.id,props.borderC)
          props.simpleClecked({ ...props });
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            height: "40%",
            alignItems: "center",
            fontSize: "14px",
            fontWeight: "400",
            color: "#61698C"
          }}
        >
          <div style={{flex:1,textAlign:'center'}}>
            <span>{props?.indexName||'--'}</span>
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
                    {props.remark}
                  </div>
                }
                title={null}
                placement="bottomLeft"
                trigger="hover"
              >
                <img
                  style={{
                    width: 15,
                    height:15,
                    marginTop: '-2px',
                    marginLeft: 2
                  }}
                  src={questionImg}
                  alt=""
                />
              </Popover>
            ) : null}
          </div>
          <div  style={{flex:1,display:'flex',justifyContent:'center'}}>
            <span>营业部排名</span>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            //background:'pink',
            display: "flex",
            height: "50%",
            alignItems: "center",
            justifyContent: "space-around",
            //fontSize: changeFontsize3(props.indexValue.length,props.departRanking.length),
            fontWeight: "400",
            color: "#1A2243"
          }}
        >
          <div className={styles.cardLeft} style={{ fontSize: changeFontsize3(props.indexValue.length)}}>
            <span >{(props?.indexValue)||'--'}</span>
          </div>
          <Divider type="vertical" style={{ height: "56px" }} />
          <div className={styles.cardRight} style={{fontSize: changeFontsize3(props.departRanking.length)}}>
            <span>{(props?.departRanking)||'--'}</span>
          </div>
        </div>
      </div>

  );
}
