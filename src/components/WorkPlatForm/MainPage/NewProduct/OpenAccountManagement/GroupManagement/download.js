import React, { Component } from 'react';
import { history as router } from 'umi';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { message } from 'antd';
import { GetMyQRCode, GetMyQrCodeWithLogo } from '$services/newProduct';
import { Button, Icon, Row, Checkbox } from 'antd';
// import red from '$assets/newProduct/channel/红色@2x.png';
// import gold from '$assets/newProduct/channel/金色@2x.png';
// import blue from '$assets/newProduct/channel/蓝色@2x.png';
import red from '$assets/newProduct/channel/redCard@2x.png';
import gold from '$assets/newProduct/channel/goldCard@2x.png';
import blue from '$assets/newProduct/channel/blueCard@2x.png';
import redbank from "$assets/newProduct/channel/redbank.png";
import bluebank from "$assets/newProduct/channel/bluebank.png";
import goldbank from "$assets/newProduct/channel/goldbank.png";
import phone from '$assets/newProduct/channel/编组 13.png';
import styles from './addGroup.less';

class download extends Component {
  state = {
    colorKey: 0,
    showLogo: true,
    codeInfo: {},
  }
  $refs = {}
  componentDidMount() {
    this.getMyQRCode();
  }
  componentDidUpdate(preProps) {
    if (preProps.location.download !== this.props.location.download) {
      this.getMyQRCode();
    }
  }
  getMyQRCode = () => {
    GetMyQRCode({
      "applSc": 0,
      "grpId": this.props.location.state.grpId * 1,
      "isDflt": 0,
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          codeInfo: res.records[0],
        });
        // this.getBase64Image(res.records[0].usrPhoto, 'usrPhoto');
        GetMyQrCodeWithLogo({ resultUrl: this.state.codeInfo.url }).then(res => {
          this.setState({
            codeWithLogo: `data:image/png;base64,${res.data}`,
          });
        });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //第一个参数是图片的URL地址，第二个是转换成base64地址后要赋值给的img标签
  getBase64Image = (url, ref) => {
    let image = new Image();
    image.src = url; // 处理缓存
    image.crossOrigin = '*'; // 支持跨域图片
    image.onLoad = function () {
      let base64 = this.drawBase64Image(image);
      this.$refs[ref].src = base64;
    };
  }
  drawBase64Image(img) {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }
  copyLink = (e) => {
    let copyDOM = document.getElementById("link"); //需要复制文字的节点
    let range = document.createRange(); //创建一个range
    window.getSelection().removeAllRanges(); //清楚页面中已有的selection
    range.selectNode(copyDOM); // 选中需要复制的节点
    window.getSelection().addRange(range); // 执行选中元素
    var successful = document.execCommand('copy'); // 执行 copy 操作
    if (successful) {
      document.getElementById("copyBtn").innerHTML = '复制成功';
      document.getElementById("link").style.background = '#D9DFF7';
    }
    // 移除选中的元素
    window.getSelection().removeAllRanges();
  }
  download = () => {
    html2canvas(document.getElementById('qrCode')).then(function (canvas) {
      var imgUrl = canvas.toDataURL();
      var dom = document.createElement('a');
      dom.setAttribute("href", imgUrl);
      dom.setAttribute("download", "二维码");
      dom.click();
    });
  }
  logoShow = (e) => {
    if (e.target.value === 'false') {
      this.setState({
        showLogo: !this.state.showLogo,
      });
    }
  }
  render() {
    console.log(this.props.location.state);

    const qrcode = { position: "absolute" ,left: "79px",top: "118px" };
    const qrcodelogo = { position: "absolute", left: "79px", top: "118px" ,width: '142px' };
    const qrcodebank = { position: "absolute", left: "84px", top: "97px" ,width: '133px' };
    const codeImg = [blue, red, gold];
    const codeImgbank = [bluebank, redbank, goldbank];
    const { colorKey, showLogo, codeInfo, codeWithLogo } = this.state;
    return (
      <div className={styles.addTable}>
        <div className={styles.title}>
          <Button type="primary" onClick={() => router.push('/merge/account/personal')}>
            <Icon type="arrow-left" />
            返回上层
          </Button>
          <span className={styles.titleText}>下载二维码</span>
        </div>
        <div className={styles.codeInfo}>
          <div className={styles.code}>
            <div>
              {/* <div style={{ height: '21px' }}>{codeInfo?.chnlNm}</div> */}
              <div id='qrCode'>
                <div className={styles.info}>
                  <div>
                    <span>{codeInfo.grpTpId === '1' ? codeInfo.usrNm : codeInfo?.chnlNm}</span>
                    <span style={{ padding: "0px 5px" }}>{codeInfo.acctDept}</span>
                    <span>{codeInfo.grpTpId === '1' ? codeInfo.phone : ''}</span>
                  </div>
                </div>
                <div className={styles.tips} style={{ 
                  left: this.props.location.state.busTp === '开户' ? '62px' : '96px',
                  top: this.props.location.state.isBank === "1" ? '285px' : '275px',
                }}>
                  {
                    this.props.location.state.isBank === '1' ? (
                      <>
                        <span className={styles.triangleBan} 
                          style={{ 
                            borderBottomColor: colorKey === 1 ? '#914134' : colorKey === 2 ? '#906600' : '#3F5E90',
                          }}>
                        </span>
                        <span className={styles.tipsInfoBan}
                          style={{
                            color: colorKey === 1 ? '#914134' : colorKey === 2 ? '#906600' : '#3F5E90',
                          }}>
                          扫一扫上面二维码，立即开户
                        </span>
                        <span className={styles.triangleBan}
                          style={{ 
                            borderBottomColor: colorKey === 1 ? '#914134' : colorKey === 2 ? '#906600' : '#3F5E90',
                          }}>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles.triangle}></span>
                        <span className={styles.tipsInfo}>{this.props.location.state.busTp === '开户' ? '扫一扫上面二维码，立即开户' : '扫码开通港股通'}</span>
                        <span className={styles.triangle}></span>
                      </>
                    )
                  }
                </div>
                {
                  showLogo ? <img style={this.props.location.state.isBank === "1" ? { ...qrcodebank } : { ...qrcodelogo }} alt='' src={codeWithLogo}></img> : (
                    <QRCode
                      value={codeInfo?.url} //value参数为生成二维码的链接
                      size={this.props.location.state.isBank === "1" ? 133 : 142}//二维码的宽高尺寸
                      fgColor="#000000" //二维码的颜色
                      // style={{ position: 'absolute', left: '79px', top: '118px' }}
                      style={ this.props.location.state.isBank === "1" ? { ...qrcodebank } : { ...qrcode } }
                    />
                  )}
                {this.props.location.state.isBank === "1" ? (
                  <img src={codeImgbank[this.state.colorKey]} alt=""></img>
                ) : (
                  <img src={codeImg[this.state.colorKey]} alt=""></img>
                )}
              </div>
            </div>
          </div>
          <div className={styles.link}>
            <div className={styles.colors}>
              <div onClick={() => this.setState({ colorKey: 0 })} style={{ border: colorKey === 0 ? '1px solid #244FFF' : '' }}>
                <div></div>
              </div>
              <div onClick={() => this.setState({ colorKey: 1 })} style={{ border: colorKey === 1 ? '1px solid #244FFF' : '' }}>
                <div></div>
              </div>
              <div onClick={() => this.setState({ colorKey: 2 })} style={{ border: colorKey === 2 ? '1px solid #244FFF' : '' }}>
                <div></div>
              </div>
            </div>
            <div className={styles.logoSelect}>
              <div>logo</div>
              <div>
                <Checkbox value={showLogo} checked={showLogo} onClick={this.logoShow}>有</Checkbox>
                <Checkbox value={!showLogo} checked={!showLogo} onClick={this.logoShow}>无</Checkbox>
              </div>
            </div>
            <div className={styles.linkUrl}>
              <div>链接</div>
              <div className={styles.url}>
                <div id='link'>
                  {codeInfo.url}
                </div>
              </div>
              <div>
                <Button className={styles.cancelBtn} onClick={this.copyLink} id='copyBtn'>复制链接</Button>
              </div>
            </div>
          </div>
        </div>
        <Row type='flex' className={styles.submit}>
          <Button className={styles.submitBtn} onClick={this.download}>下载</Button>
          <Button className={styles.cancelBtn} onClick={() => router.push('/merge/account/personal')}>取消</Button>
        </Row>
      </div >
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(download);
