declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'

declare module '*.json'

declare module '$services*'
declare module '$components*'
declare module '$config*'
declare module '$models*'
declare module '$routes*'
declare module '$themes*'
declare module '$utils*'
declare module '$pages*'
declare module '$assets*'
declare module '$common*'

declare module '*.js'

declare module 'react-custom-scrollbars'
declare module 'lodash'
declare module 'echarts'

declare interface IObject {
  [key: string]: any;
}