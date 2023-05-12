// C4免登录认证路由拼接
import { FetchTokenAESEncode } from '../services/commonbase';

function getIframeSrc(code = '', u, server, isTab = true) {
  // isTab表明从menuMergePage调用该方法的，与iframeContent组件区分，防止两个组件公用同一个token，变化时互相影响
  const getTmpSrc = async () => {
    const response = await FetchTokenAESEncode();
    const { tokenAESEncode = '' } = response;
    if(isTab){
      sessionStorage.setItem('iframeTabToken', tokenAESEncode);
    }else {
      sessionStorage.setItem('iframeToken', tokenAESEncode);
    }
  };
  // 如果code不存在(即iframeContent组件调用改方法),才在改方法内调用token，防止重复请求token
  if(!code && sessionStorage.getItem('iframeToken') && sessionStorage.getItem('iframeTabToken')) getTmpSrc();
  if(server){
    const tmpSrc = `${server}/loginServlet?token=${code}&callBackUrl=${encodeURIComponent(encodeURIComponent(u))}`;
    return tmpSrc;
  }
}

export default getIframeSrc;