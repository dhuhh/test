import React from 'react'
import nulldata from '$assets/nulldata.png';
type Props = Readonly<{
  emptyText?: string,
}>

export default function (props: Props) {
  return <div style={{ textAlign: 'center', padding: '34px 0 20px' }}>
    <img src={nulldata} alt="" />
    <div style={{ color: '#61698C' }}>{props.emptyText || '抱歉，没有客户信息'}</div>
  </div>
}
