import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';

export const getPdf = (title, querySelector, ref = document.body) => {
  let el = document.querySelector(querySelector);
  let contentWidth = el.clientWidth;
  let contentHeight = el.clientHeight;
  let canvas = document.createElement('canvas');
  // let scale = 2; // 解决清晰度问题，先放大2倍
  // canvas.width = contentWidth * scale;
  // canvas.height = contentHeight * scale;
  // canvas.getContext('2d').scale(scale, scale);

  let opts = {
    // scale: scale,
    // canvas: canvas,
    width: contentWidth,
    height: contentHeight,
    useCORS: true,
    allowTaint: true,
    // x: 0,
    // y: 0,
    scrollX: 0,
    scrollY: 0,
  };

  html2Canvas(el, opts).then(canvas => {
    let pageData = canvas.toDataURL('image/jpeg', 1.0);
    let PDF;
    let limit = 14400; // jspdf 单页面最大宽高限制为14400
    if (contentHeight <= limit) {
      PDF = new JsPDF('', 'px', [contentWidth, contentHeight]);
      PDF.addImage(pageData, 'JPEG', 0, 0, contentWidth, contentHeight);
    } else {
      let pageHeight = contentWidth / 552.28 * 841.89;
      let leftHeight = contentHeight;
      let position = 0;
      let imgWidth = 555.28;
      let imgHeight = imgWidth / contentWidth * contentHeight;
      PDF = new JsPDF('', 'px', 'a4');
      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }
    }
    PDF.save(title + '.pdf');
  });
};