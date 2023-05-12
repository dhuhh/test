import { FC, useEffect, useState } from 'react';
import styles from './index.less';

type SubtitleProps = Readonly<{
  text: string, // 文本内容
}>

export const Subtitle: FC<SubtitleProps> = (props) => {
  return (
    <div className={styles.titleBox}>
      <div className={styles.rectangle}></div>
      <span className={styles.titleText}>{props.text}</span>
    </div>
  );
}


interface selectOption {
  name: string, // 名称
  value: string | number, // 选择对应的值
}

type CusSelectProps = Readonly<{
  isMultiple?: boolean, // 是否多选
  isSinReset?: boolean, // 单选是否可取消
  isDefaultValue?: boolean, // 强制默认初始值为第一个
  name: string, // 组件标识名
  label: string, // 标签
  selectItem: selectOption[], // 选择项
  isReset: number, // 是否重置
  getCusSelectValue?: Function, // 父组件获取值
}>

export const CustomizeSelect: FC<CusSelectProps> = (props) => {
  const [cusSelectValue, setCusSelectValue] = useState<string | number | undefined>((props.isSinReset && !props.isDefaultValue) ? undefined : props.selectItem[0]?.value); // 单选
  const [selectedList, setSelectedList] = useState<(string | number)[]>(props.isDefaultValue ? [props.selectItem[0]?.value] : []); // 多选时选择的数据

  useEffect(() => {
    if(props.getCusSelectValue) {
      props.getCusSelectValue(props.isMultiple ? { name: props.name, value: selectedList } : { name: props.name, value: cusSelectValue });
    }
  }, [cusSelectValue, JSON.stringify(selectedList)])

  useEffect(() => {
    if(props.isReset) { // 初始时为0不重置, isReset发生变化表明点击了重置按钮
      reset();
    }
  }, [props.isReset])

  const reset = () => {
    if(props.isMultiple) {
      setSelectedList([]);
    } else {
      if(props.isSinReset) { 
        setCusSelectValue(undefined)
      } else {
        setCusSelectValue(props.selectItem[0].value);
      } 
    }
  }

  const judgeIsActive = (item: selectOption): boolean => {
    if(props.isMultiple) {
      return selectedList.includes(item.value)
    } else {
      return item.value === cusSelectValue
    }
  }

  const handleClick = (item: selectOption, index: number): void => {
    if(props.isMultiple) {
      const tmpList = [...selectedList]; // 一层数据拷贝
      if(selectedList.includes(item.value)) { // 已选中
        tmpList.splice(selectedList.indexOf(item.value), 1);
        setSelectedList(tmpList);
      } else { // 未选中
        tmpList.push(item.value);
        setSelectedList(tmpList);
      }
    } else {
      if(props.isSinReset) {
        if(item.value === cusSelectValue) {
          setCusSelectValue(undefined);
        } else {
          setCusSelectValue(props.selectItem[index].value);
        }
      } else {
        setCusSelectValue(props.selectItem[index].value);
      }
    }
  }
  return (
    <>
      <span className={styles.label}>{ props.label }</span>
      {
        props.selectItem.map((item, index) => {
          return(
            <div key={item.name} className={`${ judgeIsActive(item) ? styles.activeButton : ''}`} onClick={()=>{ handleClick(item, index) }}>{item.name}</div>
          );
        })
      }
    </>
  );
}

type DividerProps = Readonly<{
  color: string,
  width?: number,
  height: number, 
}>

export const CustomizeDivider: FC<DividerProps> = (props) => {
  return (
    <div style={{ width: `${props.width}px` || '100%', height: `${props.height}px`, background: props.color }} ></div>
  );
}
