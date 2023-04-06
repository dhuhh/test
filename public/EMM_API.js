/* eslint-disable */
/**
 * 注：“成功输出”指的是接口执行成功回调函数的入参，“失败输出”指的是接口执行失败回调函数的入参
 *      失败输出统一为：
 *          {"msg":"失败信息"}
 * Created by CHENHUI on 2018/04/25.
 * */

/*
 * JS API最终执行函数，JavaScript和原生功能交互桥梁
 *
 * @param apiName:字符串，接口名
 * @param param:字符串或JSON，调用接口需要传递的参数
 * @param oncallback:字符串，接口调用成功回调函数名
 * @param errorcallback:字符串，接口调用失败回调函数名
 * */
function _execute(invokeID, apiName, param, successCallBackName, failedCallBackName) {
    try {
        if (param && typeof param !== "string") {
            param = JSON.stringify(param);
        }
    } catch (e) {
        throw new Error(e.message);
    }
    var src = "emm-services://?action=jsfunction"
    + "&invokeID=" + (invokeID || "")
    + "&apiname=" + (apiName || "")
    + "&param=" + encodeURIComponent(param || "")
    + "&oncallback=" + (successCallBackName || "")
    + "&errorcallback=" + (failedCallBackName || "");
    var element = document.createElement("iframe");
    element.setAttribute("src", src);
    element.setAttribute("style", "display:none");
    element.setAttribute("width", "0px");
    element.setAttribute("height", "0px");
    element.setAttribute("frameborder", "0px");
    document.body.appendChild(element);
    element.parentNode.removeChild(element);

    console.info("successCallBackName", successCallBackName);
    console.info("failedCallBackName", failedCallBackName);
    console.info("invokeID", invokeID);
}

/*
 * 定义全局变量，接口回调函数的引用皆保存于此
 * */
window.JQAPICallBack = {
callBackObjects: {},
    //接口执行成功回调
successCallBack: function (invokeID, data) {
    this.callBackObjects[invokeID].successCallBack(data);
    delete  this.callBackObjects[invokeID];
},
    //接口执行失败回调
failedCallBack: function (invokeID, data) {
    this.callBackObjects[invokeID].failedCallBack(data);
    delete  this.callBackObjects[invokeID];
}
};

/*
 * JS API创建工厂，JS API每被调用一次，创建一个实例，该实例保存API回调函数的引用
 * */
function JQAPIFactory(invokeID, APIName, param, successCallBack, failedCallBack) {
    if (typeof  successCallBack !== "function" || typeof  failedCallBack !== "function") {
        throw new Error("callback must be a function.");
    }
    this.successCallBack = successCallBack;
    this.failedCallBack = failedCallBack;
    _execute(invokeID, APIName, param, "JQAPICallBack.successCallBack", "JQAPICallBack.failedCallBack");
}

window.JQAPI = {
    /*
     * 获取SSOToken
     *
     * 输入：
     *   {"ISAID":"业务系统ID"}
     * 成功输出：
     *   {"SSOToken":SSOToken字典（Map）对象}
     * */
getSSOToken: function (param, successCallBack, failedCallBack) {
    var invokeID = "getSSOToken" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getSSOToken", param, successCallBack, failedCallBack);
},

    /*
     * 获取用户信息
     *
     * 成功输出：（返回字段供参考）
     *   {
     *       "loginName":"登录名",
     *       "password":"登录密码",
     *       "name":"中文名字",
     *       "imei":"imei",
     *       "os":"手机系统和版本"
     *   }
     * */
getUserInfo: function (successCallBack, failedCallBack) {
    var invokeID = "getUserInfo" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getUserInfo", "", successCallBack, failedCallBack);
},

    /*
     * 获取经纬度
     *
     * 成功输出：
     *       {"latitude":"纬度","longitude":"经度","addrname":"湖南省长沙市岳麓区枫林二路","poinamelist":["蓝山大厦","向日葵写字楼","丽景苑"]}
     * */
getLocation: function (successCallBack, failedCallBack) {
    var invokeID = "getLocation" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getLocation", "", successCallBack, failedCallBack);
},

    /*
     * 文件下载
     *
     * 输入：
     *       {"url":"下载地址","fileName":"文件名称（带后缀）","requestHeaders":{"token":"jeshfh01927"},"requestParam":{}}
     * */
fileDownload: function (param, successCallBack, failedCallBack) {
    var invokeID = "fileDownload" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "fileDownload", param, successCallBack, failedCallBack);
},

    /*
     * 文件上传（可多文件上传）
     *
     * 输入：
     *      {"file":["文件1URI","文件2URI"...],"url":"接口地址","requestHeaders":{"token":"jeshfh01927"},"requestParam":{}}
     * 成功输出：
     *
     * */
fileUpload: function (param, successCallBack, failedCallBack) {
    var invokeID = "fileUpload" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "fileUpload", param, successCallBack, failedCallBack);
},

    /*
     * 获取相片（打开相机拍摄或打开相册选取）
     *
     * 输入：
     *     {"sourceType":"相片来源（相机或相册）","maxNum":"按时间最新排序获取最大相片张数"}
     *     sourceType：0-相册，1-相机
     * 成功输出：JSON数组
     *      [{"path":"相片在文件系统中的绝度路径","base64":"相片base64表示"}]
     * */
getPicture: function (param, successCallBack, failedCallBack) {
    var invokeID = "getPicture" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getPicture", param, successCallBack, failedCallBack);
},

    /*
     * 关闭当前WebView
     * */
close: function () {
    var invokeID = "close" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "close", "", function () {
                                                               }, function (msg) {
                                                               throw new Error(msg);
                                                               });
},

    /*
     * 图片查看（可保存图片）
     *
     * 输入：
     *   {"pictures":[图片URI数组],"position":"当前显示图片位置","allowSave":"是否允许保存相片"}
     *   示例：{"pictures":["1.png","2.png"],"position":2,"allowSave":true}
     * */
viewPicture: function (param) {
    var invokeID = "viewPicture" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "viewPicture", param, function () {
                                                               }, function (msg) {
                                                               throw new Error(msg);
                                                               });
},

    /*
     * 在浏览器中打开指定URL
     *
     * 输入：
     *   {"url":"需要打开的url（绝对路径，未URI编码）"}
     *
     * 成功输出：（返回字段供参考）
     *   {
     *       "msg":"操作成功。"
     *   }
     * */
openUrlInBrowser: function (param,successCallBack, failedCallBack) {
    var invokeID = "openUrlInBrowser" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "openUrlInBrowser", param, successCallBack, failedCallBack);
},

    /*
     * 在浏览器中打开指定URL
     *
     * 成功输出：（返回字段供参考）
     *   {
     *       "content":"content...."
     *   }
     * */
openQRCode: function (successCallBack, failedCallBack) {
    var invokeID = "openQRCode" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "openQRCode", "", successCallBack, failedCallBack);
},

    /*
     * 拨打电话
     *
     * 输入：{"phoneNumber":"13612341234"}
     *
     * */
callPhone: function (param) {
    var invokeID = "callPhone" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "callPhone", param, function () {
    }, function (msg) {
    throw new Error(msg);
    });
},

    /*
     * 发送短信
     *
     * 输入：{"phoneNumbers":["13612341234","13612341234"}
     *
     * */
messageTo: function (param) {
    var invokeID = "messageTo" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "messageTo", param, function () {
    }, function (msg) {
    throw new Error(msg);
    });
},


    /*
     * 加密存储
     *
     * 输入：{"key":"username","value":"zhangsan"}
     *
     * */
saveDataValue: function (param, successCallBack, failedCallBack) {
    var invokeID = "saveDataValue" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "saveDataValue", param, successCallBack, failedCallBack);
},

    /*
     * 获取加密数据
     *
     * 输入：{"key":"username"}
     *
     * */
getDataValue: function (param, successCallBack, failedCallBack) {
    var invokeID = "getDataValue" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "getDataValue", param, successCallBack, failedCallBack);
},

	/*
     * 打开应用程序
     *
     * 输入：{"appCode":"com.emm.thirdapp","arguments":"用户自定义传参数据"}
     *
     * */
openApplicationWithArguments: function (param, successCallBack, failedCallBack) {
    var invokeID = "openApplicationWithArguments" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID, "openApplicationWithArguments", param, successCallBack, failedCallBack);
},

    /**
     * 是否监听系统返回键
     * true时，接管手机自带返回键操作
     * 输入：{"value":true}
     */
onBackPressed: function (param,successCallBack,failedCallBack){
    var invokeID = "onBackPressed" + new Date().getTime();
    JQAPICallBack.callBackObjects[invokeID] = new JQAPIFactory(invokeID,"onBackPressed",param,successCallBack,failedCallBack);
}
};
