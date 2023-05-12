import React from 'react'
import nulldata from "../Common/assets/nullDate.png";
type Props = Readonly<{
  emptyText?: string,
}>

export default function (props: Props) {
  return <div style={{ textAlign: 'center', padding: '34px 0 20px' }}>
    <img src={nulldata} alt="" style={{width:275}}/>
    <div style={{ color: '#61698C' }}>{props.emptyText || '抱歉，没有信息'}</div>
  </div>
}
