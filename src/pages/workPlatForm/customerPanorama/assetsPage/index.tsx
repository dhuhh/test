import React, { FC } from 'react';
import { connect } from 'umi';
import AssetsPage from '$components/WorkPlatForm/CustomerPanorama/AssetsPage'
import styles from './index.less';

type Props = Readonly<{
  sysParam: any[],
  location: any,
}>

const Assets: FC<Props> = (props) => {
  const { sysParam = [], location: { query: { customerCode = '' } } } = props;
  const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
  return <AssetsPage customerCode={customerCode} />
}

export default connect(({ global }: any) => ({ sysParam: global.sysParam, }))(Assets);
