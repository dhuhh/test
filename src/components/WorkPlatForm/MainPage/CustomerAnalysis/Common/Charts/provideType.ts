/**
 * 约定的一些公共类型
 */

// 柱状图
export type barProps = Readonly<{
  xData: string[], // X轴数据
  yName?: string, // Y轴顶部显示的单位
  seriesData: number[], // 每项数据
}>

export interface lineItemObject {
  name: string,
  data: number[],
  color: string, // 对应十六进制颜色
  rgbaColor: string, // 传入rgba(_, _, _, 0.2)类型的颜色，作为渐变背景色
}

// 折线图
export type lineProps = Readonly<{
  xData: string[], // X轴数据
  yName?: string, // Y轴顶部显示的单位
  seriesData: lineItemObject[], // 多个折线图的数据
}>

export interface pieItemObject {
  name: string,
  data: number,
  color: string, // 每一项对应的颜色
}

// 饼图
export type pieProps = Readonly<{
  data: pieItemObject[], // 饼图每一项的数据
  label?: string, // 饼状图的series标题
}>

