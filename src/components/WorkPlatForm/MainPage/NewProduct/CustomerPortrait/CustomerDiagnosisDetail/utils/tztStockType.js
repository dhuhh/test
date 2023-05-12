/* eslint-disable */
/*******************************************************************************
 * Copyright (c)2016, 杭州中焯信息技术股份有限公司
 * All rights reserved.
 *
 * 文件名称：tztStockType.js
 * 文件标识：
 * 摘   要：行情市场分类
 *
 * 当前版本：
 * 作    者：九指神丐
 * 完成日期：2016.9.21
 *
 * 备    注：
 *
 * 修改记录：
 *
 *******************************************************************************/

var
SH_KIND_INDEX  = 16,                        //国内股票-上证证券: 上证指数16 $1100,  上证指数
SZ_KIND_INDEX  = 32,                        //国内股票-深证证券：深证指数32    $1200,  深证指数
WP_INDEX       = 90,                        //国际指数90    $5100,
QH_FUTURES_MARKET= 70,                      //期货开始
HS_KIND_STOCKA = 210,                       //沪深A股210   $1101,  上证Ａ股
HS_KIND_STOCKB = 211,                       //沪深B股211   $1102,  上证Ｂ股
BLOCK_INDEX_HY = 51,                        //板块指数-行业   $4661,
BLOCK_INDEX_GN = 52,                        //板块指数-概念   $4662,
WH_FOREIGN_MARKET = 80,                     //外汇开始
WP_MARKET      = 90,                        //外盘开始
HK_MARKET      = 110,                       //港股
HK_KIND_FUTURES_INDEX = 112,
HK_KIND_Option = 112,
QH_HT_STOCKFUND= 113, // //华泰股票型基金113	$4601,
QH_HT_BONDFUND = 114, // //华泰债券型型基金114	$4602,
QH_HT_HUNHEFUND= 115, // //华泰混合型基金115	$4603,
QH_HT_MONEYFUND= 116; // //华泰货币型基金116	$4604,
var
HQ_STOCK_MARKET = 0X1000,                   //股票
    HQ_SH_BOURSE         = 0x0100,          //上海
    HQ_SZ_BOURSE         = 0x0200,          //深圳
    HQ_SYSBK_BOURSE      = 0x0400,          //系统板块
    HQ_USERDEF_BOURSE    = 0x0800,          //自定义（自选股或者自定义板块）
        HQ_KIND_INDEX             = 0x0000, //指数
        HQ_KIND_STOCKA            = 0x0001, //A股
        HQ_KIND_STOCKB            = 0x0002, //B股
        HQ_KIND_BOND              = 0x0003, //债券
        HQ_KIND_FUND              = 0x0004, //基金
        HQ_KIND_THREEBOAD         = 0x0005, //三板
        HQ_KIND_SMALLSTOCK        = 0x0006, //中小盘股
        HQ_KIND_PLACE             = 0x0007, //配售
        HQ_KIND_LOF               = 0x0008, //LOF
        HQ_KIND_ETF               = 0x0009, //ETF
        HQ_KIND_QuanZhen          = 0x000A, //权证
        HQ_KIND_CYBLOCK           = 0x000B, //创业板
        HQ_KIND_FXBlock           = 0x000C, //风险警示板
        HQ_KIND_OtherIndex        = 0x000E, //第三方行情分类，如:中信指数
        HQ_KIND_USERDEFINE        = 0x0010, //自定义指数
//港股市场
HQ_HK_MARKET   = 0x2000,                    //港股分类
    HQ_HK_BOURSE         = 0x0100,          //主板市场
    HQ_GE_BOURSE         = 0x0200,          //创业板市场(Growth Enterprise Market)
    HQ_INDEX_BOURSE      = 0x0300,          //指数市场
        HQ_HK_KIND_INDEX          = 0x0000, //港指
        HQ_HK_KIND_FUTURES_INDEX  = 0x0001, //港指
    HQ_SYSBK_BOURSE      = 0x0400,          //港股板块(H股指数成份股，恒生指数成份股）。
    HQ_USERDEF_BOURSE    = 0x0800,          //自定义（自选股或者自定义板块）
        HQ_HK_KIND_BOND           = 0x0000, //债券
        HQ_HK_KIND_MulFund        = 0x0001, //一揽子认股证
        HQ_HK_KIND_FUND           = 0x0002, //基金
        HQ_KIND_WARRANTS          = 0x0003, //认股证
        HQ_KIND_JR                = 0x0004, //金融
        HQ_KIND_ZH                = 0x0005, //综合
        HQ_KIND_DC                = 0x0006, //地产
        HQ_KIND_LY                = 0x0007, //旅游
        HQ_KIND_GY                = 0x0008, //工业
        HQ_KIND_GG                = 0x0009, //公用
        HQ_KIND_QT                = 0x000A, //其它
//期货大类
HQ_FUTURES_MARKET   = 0x4000,               //期货
    HQ_DALIAN_BOURSE     = 0x0100,          //大连
        HQ_KIND_BEAN              = 0x0001, //大连豆类
        HQ_KIND_YUMI              = 0x0002, //大连玉米
        HQ_KIND_SHIT              = 0x0003, //大宗食糖
        HQ_KIND_DZGY              = 0x0004, //大宗工业1
        HQ_KIND_DZGY2             = 0x0005, //大宗工业2
        HQ_KIND_DOUYOU            = 0x0006, //大连豆油
        HQ_KIND_ZLYOU             = 0x0007, //棕榈油
        HQ_KIND_JYX               = 0x0008, //聚乙烯
        HQ_KIND_JLYX              = 0x0009, //聚氯乙烯
    HQ_SHANGHAI_BOURSE   = 0x0200,          //上海
    HQ_ZHENGZHOU_BOURSE  = 0x0300,          //郑州
    HQ_HUANGJIN_BOURSE   = 0x0400,          //黄金交易所
    HQ_GUZHI_BOURSE      = 0x0500,          //股指期货
    HQ_SELF_BOURSE       = 0x0600,          //自定义数据
    HQ_KIND_OutFund      = 0x0600,          //开放式基金
        HQ_DZGT_BOURSE            = 0x0610, //大宗钢铁数据
        HQ_DLTL_BOURSE            = 0x0620, //大连套利
        HQ_YSJS_BOURSE            = 0x0630, //有色金属
        HQ_KIND_Block_Index       = 0x0660, //板块指数
    HQ_DynamicSelf_BOURSE= 0x0700,          //动态数据类型自定义数据

//外盘大类
HQ_WP_MARKET        = 0x5000,               //外盘
    HQ_WP_INDEX          = 0x0100,          // 国际指数 // 不用了
    HQ_WP_LME            = 0x0200,          // LME // 不用了
        HQ_WP_LME_CLT             = 0x0210, //场内铜
        HQ_WP_LME_CLL             = 0x0220, //场内铝
        HQ_WP_LME_CLM             = 0x0230, //场内镍
        HQ_WP_LME_CLQ             = 0x0240, //场内铅
        HQ_WP_LME_CLX             = 0x0250, //场内锌
        HQ_WP_LME_CWT             = 0x0260, //场内铝
        HQ_WP_LME_CW              = 0x0270, //场外
            HQ_WP_LME_Market      = 0x000F, //LME市场
        HQ_WP_LME_SUB             = 0x0000, //场外

        HQ_WP_CBOT                = 0x0300, //CBOT
        HQ_WP_NYMEX               = 0x0400, //NYMEX
        HQ_WP_NYMEX_YY            = 0x0000, //原油
        HQ_WP_NYMEX_RY            = 0x0001, //燃油
        HQ_WP_NYMEX_QY            = 0x0002, //汽油

        HQ_WP_COMEX               = 0x0500, //COMEX
        HQ_WP_TOCOM               = 0x0600, //COMEX
        HQ_WP_IPE                 = 0x0700, //IPE
        HQ_WP_NYBOT               = 0x0800, //NYBOT
        HQ_WP_NOBLE_METAL         = 0x0800, //贵金属
            HQ_WP_NOBLE_METAL_XH  = 0x0000, //现货
            HQ_WP_NOBLE_METAL_HJ  = 0x0001, //黄金
            HQ_WP_NOBLE_METAL_BY  = 0x0002, //白银

        HQ_WP_FUTURES_INDEX       = 0x0a00, //期指
        HQ_WP_SICOM               = 0x0b00, //SICOM
        HQ_WP_LIBOR               = 0x0c00, //LIBOR
        HQ_WP_NYSE                = 0x0d00, //NYSE
        HQ_WP_CEC                 = 0x0e00, //CEC

        HQ_WP_Self_1              = 0x0E10, //ICE1
        HQ_WP_Self_2              = 0x0E20, //ICE2
        HQ_WP_Self_3              = 0x0E30, //CME
        HQ_WP_Self_4              = 0x0E40, //ICE1
        HQ_WP_Self_5              = 0x0E50, //ICE1
        HQ_WP_Self_6              = 0x0E60, //ICE1
        HQ_WP_Self_7              = 0x0E70, //ICE1
        HQ_WP_Self_8              = 0x0E80, //ICE1
        HQ_WP_Self_9              = 0x0E90, //ICE1
        HQ_WP_Self_A              = 0x0EA0, //ICE1
        HQ_WP_Self_Begin          = HQ_WP_Self_1, //
        HQ_WP_Self_End            = HQ_WP_Self_A, //

        HQ_WP_Other_TZTHuanjin    = 0x0F10,
        HQ_WP_Other_JinKaiXun     = 0x0F20,
        HQ_WP_JKX                 = HQ_WP_Other_JinKaiXun,
        HQ_WP_XJP                 = 0x0F30,
        HQ_WP_LYSEE               = 0x0F40,

        HQ_WP_INDEX_AZ            = 0x0110, //澳洲
        HQ_WP_INDEX_OZ            = 0x0120, //欧洲
        HQ_WP_INDEX_MZ            = 0x0130, //美洲
        HQ_WP_INDEX_TG            = 0x0140, //泰国
        HQ_WP_INDEX_YL            = 0x0150, //印尼
        HQ_WP_INDEX_RH            = 0x0160, //日韩
        HQ_WP_INDEX_XHP           = 0x0170, //新加坡
        HQ_WP_INDEX_FLB           = 0x0180, //菲律宾
        HQ_WP_INDEX_CCN           = 0x0190, //中国大陆
        HQ_WP_INDEX_TW            = 0x01a0, //中国台湾
        HQ_WP_INDEX_MLX           = 0x01b0, //马来西亚
        HQ_WP_INDEX_SUB           = 0x0000, //


//个股期权分类
HQ_GGQQ_MARKET      = 0x6000,               //个股期权
    HQ_GGQQ_KINDA        = 0x0100,          //

//外汇大类
HQ_FOREIGN_MARKET   = 0x8000,               //外汇
    HQ_WH_BASE_RATE      = 0x0100,          //基本汇率
    HQ_WH_ACROSS_RATE    = 0x0200,          //交叉汇率
        HQ_FX_TYPE_AU             = 0x0000, //AU    澳元
        HQ_FX_TYPE_CA             = 0x0001, //CA    加元
        HQ_FX_TYPE_CN             = 0x0002, //CN    人民币
        HQ_FX_TYPE_DM             = 0x0003, //DM    马克
        HQ_FX_TYPE_ER             = 0x0004, //ER    欧元
        HQ_FX_TYPE_HK             = 0x0005, //HK    港币
        HQ_FX_TYPE_SF             = 0x0006, //SF    瑞士
        HQ_FX_TYPE_UK             = 0x0007, //UK    英镑
        HQ_FX_TYPE_YN             = 0x0008, //YN    日元
    HQ_WH_FUTURES_RATE   = 0x0300;          //期汇

function MakeMarket(x){
return (x & 0xF000);
}

function MakeMainMarket(x){
return (x & 0xFFF0);
}

function MakeMidMarket(x){
return (x & 0x0F00);
}

function MakeSubMarket(x){
return (x & 0x000F);
}

function MakeIndexMarketHQ(x){
return ( (MakeMarket(x) == HQ_STOCK_MARKET) &&
        (MakeMidMarket(x) != 0) &&
        ((MakeSubMarket(x) == HQ_KIND_INDEX) ||
         (MakeSubMarket(x) == HQ_KIND_OtherIndex)));
}

//美股
const MakeUSMarket = function(x){
return (MakeMainMarket(x) == (HQ_WP_MARKET|HQ_WP_LYSEE));
}
//沪深
const MakeHSMarket = function(x){
return (MakeMarket(x) == HQ_STOCK_MARKET);
}

//指数
const MakeIndexMarket = function(x){
return ( x == SH_KIND_INDEX ||
         x == SZ_KIND_INDEX ||
         x == WP_INDEX ||
        MakeIndexMarketHQ(x));
}

//深证指数
const MakeSZIndexMarket = function(x){
return (MakeIndexMarketHQ(x));
}

//股票
const MakeStockMarket = function(x){
return (( x >= 0 &&
        x < QH_FUTURES_MARKET) ||
        x == HS_KIND_STOCKA ||
        x == HS_KIND_STOCKB ||
        (MakeMarket(x) == HQ_STOCK_MARKET)
        );
}

//个股期权
const MakeGGQQMarket = function(x){
return ((MakeMarket(x) == HQ_GGQQ_MARKET) && MakeMidMarket(x) == HQ_GGQQ_KINDA);
}

//沪深个股
const MakeStockMarketStock = function(x){
return (MakeStockMarket(x)
        && x != SH_KIND_INDEX
        && x != SZ_KIND_INDEX
        && x != BLOCK_INDEX_HY
        && x != BLOCK_INDEX_GN
        && (MakeSubMarket(x) != HQ_KIND_INDEX)
        && (MakeSubMarket(x) != HQ_KIND_USERDEFINE)
        && (MakeSubMarket(x) != HQ_KIND_OtherIndex)
        );
}

//板块指数
const MakeBlockIndex = function(x){
return (MakeMainMarket(x) == (HQ_FUTURES_MARKET|HQ_SELF_BOURSE|0x0060));
}

//股票板块
const MakeStockBlock = function(x){
return ((x >= 0 &&
         (x == BLOCK_INDEX_HY ||
         x == BLOCK_INDEX_GN)
         ));
}

//期货
const MakeQHMarket = function(x){
return ( ((x >= QH_FUTURES_MARKET && x < WH_FOREIGN_MARKET) ||
        (MakeMarket(x) == HQ_FUTURES_MARKET)) && (MakeMidMarket(x) != HQ_KIND_OutFund));
}

//外汇
const MakeWHMarket = function(x){
return ( (x >= WH_FOREIGN_MARKET && x < WP_MARKET) ||
        (MakeMarket(x) == HQ_FOREIGN_MARKET));
}

//外盘
const MakeWPMarket = function(x){
return ( (x >= WP_MARKET && x < HK_MARKET) ||
        (MakeMarket(x) == HQ_WP_MARKET));
}

//三板
const MakeThreeBordMarket = function(x){
return (MakeMarket(x) == HQ_STOCK_MARKET && MakeSubMarket(x) == HQ_KIND_THREEBOAD);
}

//港股
const MakeHKMarket = function(x){
return ( (x >= HK_MARKET && x < 113) ||
        MakeMarket(x) == HQ_HK_MARKET);
}

//港股个股
const MakeHKMarketStock = function (x) {
return (MakeHKMarket(x)
        && MakeMidMarket(x) != HQ_INDEX_BOURSE);
}

const MakeHTFundMarket = function(x)
{
return (( x >= QH_HT_STOCKFUND && x <= QH_HT_MONEYFUND)
||(MakeMainMarket(x) == (HQ_FUTURES_MARKET|HQ_KIND_OutFund)
)
);
}

const getMarketNameByType = function (nMarketType) {
var strValue = '';
switch (MakeMarket(nMarketType))
{
case HQ_STOCK_MARKET:
{
  switch (MakeSubMarket(nMarketType))
  {
    case HQ_KIND_INDEX:
      strValue = "指数";
      break;
    case HQ_KIND_STOCKA:
      strValue = "A股";
      break;
    case HQ_KIND_STOCKB:
      strValue = "B股";
      break;
    case HQ_KIND_BOND:
      strValue = "债券";
      break;
    case HQ_KIND_FUND:
      strValue = "基金";
      break;
    case HQ_KIND_THREEBOAD:
      strValue = "股转";
      break;
    case HQ_KIND_SMALLSTOCK:
      strValue = "中小";
      break;
    case HQ_KIND_LOF:
      strValue = "LOF";
      break;
    case HQ_KIND_ETF:
      strValue = "ETF";
      break;
    case HQ_KIND_QuanZhen:
      strValue = "权证";
      break;
    case HQ_KIND_CYBLOCK:
      strValue = "创业板";
      break;
    case HQ_KIND_FXBlock:
      strValue = "警示板";
      break;
    default:
      strValue = "沪深";
      break;
  }

}
  break;
case HQ_HK_MARKET:
  strValue = "港股";
  break;
case HQ_WP_MARKET:
{
  if (MakeUSMarket(nMarketType))
    strValue = "美股";
  else
    strValue = "外盘";
}
  break;
case HQ_FOREIGN_MARKET:
  strValue = "外汇";
  break;
case HQ_FUTURES_MARKET:
{
  //板块指数
  if (MakeMainMarket(nMarketType) == (HQ_KIND_Block_Index|HQ_FUTURES_MARKET))
  {
    strValue = "指数";
  }
  else
  {
    if (MakeHTFundMarket(nMarketType))
      strValue = "基金";
    else
      strValue = "期货";
  }
}
  break;
case HQ_GGQQ_MARKET:
  strValue = "期权";
  break;

default:
  break;
}
return strValue;
}

export default {
MakeUSMarket:MakeUSMarket,
MakeIndexMarket:MakeIndexMarket,
MakeStockMarket:MakeStockMarket,
MakeGGQQMarket:MakeGGQQMarket,
MakeBlockIndex:MakeBlockIndex,
MakeStockMarketStock:MakeStockMarketStock,
MakeStockBlock:MakeStockBlock,
MakeQHMarket:MakeQHMarket,
MakeWHMarket:MakeWHMarket,
MakeWPMarket:MakeWPMarket,
MakeThreeBordMarket:MakeThreeBordMarket,
MakeHKMarket:MakeHKMarket,
MakeSZIndexMarket:MakeSZIndexMarket,
MakeHKMarketStock:MakeHKMarketStock,
MakeMarket:MakeMarket,
MakeSubMarket:MakeSubMarket,
MakeMainMarket:MakeMainMarket,
MakeHTFundMarket:MakeHTFundMarket,
getMarketNameByType:getMarketNameByType,
MakeHSMarket:MakeHSMarket
}
