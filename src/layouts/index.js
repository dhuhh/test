import LoginPageLayout from './login';
import MainPageLayout from './workPlatForm/PageLayout/index';
import SinglePageLayout from './single/PageLayout/index';
import IconFontLayouts from './iconFont/index';
import CustomerPanoramaLayout from './customerPanorama/PageLayout/index';
// import ProductSalesPanoramaLayout from './productSalesPanorama/PageLayout/index';
// import customerPortraitLayout from './customerPortrait/PageLayout/PageHeader';

function BasicLayout (props) {
  const { location: { pathname = '' } } = props;
  //console.log("😅 => file: index.js:11 => BasicLayout => pathname", pathname)
  if (pathname.startsWith('/customerPortrait')) {
    return (
      <div style={{ height: '100%' }}>
        <customerPortraitLayout {...props} />
      </div>
    );
  } else if (pathname.startsWith('/login')) {
    return (
      <div style={{ height: '100%' }}>
        <LoginPageLayout {...props} />
      </div>
    );
  } else if (pathname.startsWith('/iconFont')) {
    return (
      <div style={{ height: '100%' }}>
        <IconFontLayouts {...props} />
      </div>
    );
  } else if (pathname.startsWith('/customerPanorama')) {
    return (
      <div style={{ height: '100%' }}>
        <CustomerPanoramaLayout {...props} />
      </div>
    );
  } else if (pathname.startsWith('/single')) {
    return (
      <div style={{ height: '100%' }}>
        <SinglePageLayout {...props} />
      </div>
    );
  } else {
    return (
      <div style={{ height: '100%' }}>
        <MainPageLayout {...props} />
      </div>
    );
  }
}

export default BasicLayout;
