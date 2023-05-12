import React, { FC } from 'react';
import Iframe from 'react-iframe';
import getIframeSrc from '$utils/getIframeSrc';
import { connect } from 'umi';
import styles from './index.less';

type Props = Readonly<{
  sysParam: any[],
  location: any,
  tokenAESEncode: string,
}>

const AdequacyDetail: FC<Props> = (props) => {
  const { sysParam = [], location: { query: { customerCode = '' } } } = props;
  const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
  return <Iframe url={getIframeSrc(props.tokenAESEncode, `${server}/bss/ncrm/ncustomer/nPanorama/nInvestorDetail/page/indexForC5.sdo?customerCode=${customerCode}`, server)} height={`${document.body.clientHeight - 120}px`} className={styles.iframe} />
}

export default connect(({ global }: any) => ({ sysParam: global.sysParam, tokenAESEncode: global.tokenAESEncode, }))(AdequacyDetail);
