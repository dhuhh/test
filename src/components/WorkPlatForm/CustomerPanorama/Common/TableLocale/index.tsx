import React from 'react'

type Props = Readonly<{
  emptyText?: string,
}>

export default function (props: Props) {
  return <div style={{ textAlign: 'center', padding: '34px 0 20px' }}>
    <div style={{ color: '#61698C' }}>{props.emptyText || '无记录'}</div>
  </div>
}
