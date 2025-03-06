// 接口调用
function ajaxGetStockAndFundFromLocalService() {
    var result;
    $.ajax({
        url: Env.GET_STOCK_AND_FUND_FROM_LOCAL_SERVICE,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data.value;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetFundFromEastMoney(code) {
    let fund = {};
    $.ajax({
        url: Env.GET_FUND_FROM_EAST_MONEY + code + ".json",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var json = data.JJXQ.Datas;
            fund.name = json.SHORTNAME + "";
            fund.dwjz = json.DWJZ + "";
            fund.now = json.DWJZ + "";
            fund.gszzl = json.RZDF + "";
            fund.gztime = "--";
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return fund;
}

// 接口调用
function ajaxGetFundFromEastMoneyAsync(code, last) {
    let fund = {};
    $.ajax({
        url: Env.GET_FUND_FROM_EAST_MONEY + code + ".json",
        timeout: 10000, // 设置超时时间为10000毫秒（10秒）
        type: "get",
        data: {},
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var json = data.JJXQ.Datas;
            fund.fundCode = code;
            fund.name = json.SHORTNAME + "";
            fund.dwjz = json.DWJZ + "";
            fund.now = json.DWJZ + "";
            fund.gszzl = json.RZDF + "";
            fund.gsz = fund.dwjz;
            fund.gztime = "--";
            ajaxGetFundFromTiantianjijinAsyncCallBack(fund, last);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// 接口调用
function ajaxGetFundCodeFromTiantianjijin() {
    let result;
    $.ajax({
        url: Env.GET_FUND_CODE_BY_NAME_FROM_TIANTIANJIJIN,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data.replace("var r = ", "").replace(";", "");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetStockCodeByNameFromGtimg(name) {
    let result;
    $.ajax({
        url: Env.GET_STOCK_CODE_BY_NAME_FROM_GTIMG + "?v=2&t=all&c=1&q=" + name,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetStockCodeByNameFromDFCFW(name) {
    let result;
    $.ajax({
        url: Env.GET_STOCK_CODE_BY_NAME_FROM_CFCFW + "?client=web&clientType=webSuggest&clientVersion=lastest&keyword=" + name + "&pageIndex=1&pageSize=5",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            // data 转成 json
            var data = JSON.parse(data);
            result = data.result;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetStockFromGtimg(code) {
    let result;
    $.ajax({
        url: Env.GET_STOCK_FROM_GTIMG + "q=" + code,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetStockFromGtimgAsync(code, stocks) {
    $.ajax({
        url: Env.GET_STOCK_FROM_GTIMG + "q=" + code,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            // result = data;
            initStockGtimgCallBack(data, stocks);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// 接口调用
function ajaxGetStockFromEastMoney(code, stocks) {
    $.ajax({
        url: Env.GET_STOCK_FROM_EAST_MONEY_URL
          + "?fltt=2&fields=f12,f13,f19,f15,f16,f14,f139,f148,f124,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f88,f145,f153&secids="
          + code,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            stoksArr = data.data.diff;
            initStockEastMoneyCallBack(stoksArr, stocks);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// 接口调用
function ajaxGetFundFromTiantianjijin(code) {
    let result;
    let timestamp = Date.now();
    var FUND_URL = Env.GET_FUND_FROM_TIANTIANJIJIN + '?' + timestamp;
    FUND_URL = FUND_URL.replace('{CODE}', code);
    $.ajax({
        url: FUND_URL,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetFundFromTiantianjijinAsync(code, last) {
    let timestamp = Date.now();
    var FUND_URL = Env.GET_FUND_FROM_TIANTIANJIJIN + '?' + timestamp;
    FUND_URL = FUND_URL.replace('{CODE}', code);
    $.ajax({
        url: FUND_URL,
        timeout: 10000, // 设置超时时间为10000毫秒（10秒）
        type: "get",
        data: {},
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            if (data != "jsonpgz();") {
                var fund = jQuery.parseJSON(data.substring(8, data.length - 2));
                fund.fundCode = code;
                ajaxGetFundFromTiantianjijinAsyncCallBack(fund, last);
            } else {
                ajaxGetFundFromEastMoneyAsync(code, last);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
            ajaxGetFundFromEastMoneyAsync(code, last);
        }
    });
}

// 接口调用
function ajaxGetStockTimeImageMinuteMini(code) {
    let secid = getSecid(code);
    let oldCode = code;
    if (secid == null || secid == '' || secid == undefined) {
        secid = timeImageSecid;
    }
    code = code.replace('sh','').replace('sz','').replace('bj','').replace('us','').replace('hk','').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_');
    let result;
    $.ajax({
        url: Env.GET_STOCK_TIME_IMAGE_MINUTE_MINI + "?secid=" + secid + "."+ code +"&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f53,f56,f58&iscr=0&iscca=0&ndays=1",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
            setStockMinitesImageMini(result, oldCode);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}


// 接口调用
function ajaxGetStockTimeImageMinute(code) {
    let oldCode = code;
    let secid = getSecid(code);
    if (secid == null || secid == '' || secid == undefined) {
        secid = timeImageSecid;
    }
    code = code.replace('sh','').replace('sz','').replace('bj','').replace('us','').replace('hk','').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_');
    let result;
    $.ajax({
        url: Env.GET_STOCK_TIME_IMAGE_MINUTE_MINI + "?secid=" + secid + "."+ code +"&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f53,f56,f58&iscr=0&iscca=0&ndays=1",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        // async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            setStockMinitesImageCallBack(data, 1, oldCode);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetStockTimeImageMinuteHis(code, ndays) {
    let oldCode = code;
    let secid = getSecid(code);
    if (secid == null || secid == '' || secid == undefined) {
        secid = timeImageSecid;
    }
    if (ndays == null || ndays == '' || ndays == undefined) {
        ndays = 5;
    }
    code = code.replace('sh','').replace('sz','').replace('bj','').replace('us','').replace('hk','').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_');
    let result;
    $.ajax({
        url: Env.GET_STOCK_TIME_IMAGE_MINUTE_HIS + "?secid=" + secid + "."+ code +"&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f53,f56,f58&iscr=0&iscca=0&ndays=" + ndays,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            setStockMinitesImageCallBack(data, 5, oldCode);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetFundTimeImageMinuteMini(code) {
    let result;
    $.ajax({
        url: Env.GET_STOCK_TIME_IMAGE_MINUTE_MINI + "?secid=0."+ code +"&fields1=f1,f2,f8&fields2=f51,f53,f56,f58&iscr=0&iscca=0&ndays=1",
        type: "get",
        data: {},
        // async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
            setFundMinitesImageMini(result, code);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    // return result;
}

// 接口调用
function ajaxGetStockTimeImage(code, type, end) {
    let klt;
    if (type == 'DAY') {
        klt = 101;
    } else if (type == 'WEEK'){
        klt = 102;
    } else if (type == 'MONTH'){
        klt = 103;
    } else if (type == '1MIN') {
        klt = 1;
    } else if (type == '5MIN') {
        klt = 5;
    } else if (type == '15MIN') {
        klt = 15;
    } else if (type == '30MIN') {
        klt = 30;
    } else if (type == '60MIN') {
        klt = 60;
    } else if (type == '120MIN') {
        klt = 120;
    }
    let secid = getSecid(code);
    if (secid == null || secid == '' || secid == undefined) {
        secid = timeImageSecid;
    }
    code = code.replace('sh','').replace('sz','').replace('bj','').replace('us','').replace('hk','').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_');
    let result;
    $.ajax({
        url: Env.GET_STOCK_TIME_IMAGE_FROM_EASTMONEY + "?secid=" + secid + "."+ code + "&klt=" + klt + "&fqt=1&lmt=400&end=" + end + "&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf59&forcect=1",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetFundInvesterPosition(code) {
    let result;
    let timestamp = Date.now();
    $.ajax({
        url: Env.GET_FUND_INVERST_POSITION + "?FCODE="+ code +"&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=" + timestamp,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data.Datas.fundStocks;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetFundPositionList(code) {
    let result;
    let timestamp = Date.now();
    $.ajax({
        url: Env.GET_FUND_POSITION_LIST + "?pageIndex=1&pageSize=10&deviceid=1234567.py.service&version=4.3.0&product=Eastmoney&plat=Web&FCODE="+ code +"&_=" + timestamp,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data.Datas;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetFundInvesterPositionDetail(code) {
    let result;
    $.ajax({
        url: Env.GET_FUND_INVERST_POSITION_DETAIL + "?fields=f1,f2,f3,f4,f12,f13,f14,f292&fltt=2&secids="+ code +"&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data.data.diff;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetLargeMarketData(code) {
    let result;
    $.ajax({
        url: Env.GET_STOCK_FROM_EAST_MONEY_URL + "?fields=f1,f2,f15,f16,f3,f4,f12,f13,f14,f292&fltt=2&secids="+ code +"&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        // async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data.data.diff;
            initLargeMarketDataCallBack(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// 接口调用
function ajaxGetFundNetDiagram(code, type) {
    let result;
    let range;
    if (type == "MONTH") {
        range = "y";
    } else if(type == "3MONTH") {
        range = "3y";
    } else if(type == "6MONTH") {
        range = "6y";
    } else if(type == "YEAR") {
        range = "n";
    } else if(type == "3YEAR") {
        range = "3n";
    } else if(type == "5YEAR") {
        range = "5n";
    } else if(type == "ALLYEAR") {
        range = "ln";
    }
    $.ajax({
        url: Env.GET_FUND_NET_DIAGRAM + "?FCODE=" + code + "&RANGE=" + range + "&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data.Datas;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxSyncDataFromCloud(syncDataCloudUuid) {
    let result;
    $.ajax({
        url: Env.CLOUD_SERVER_DATA_SYNC + syncDataCloudUuid + ".json",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        headers: {
            "Authorization" : Env.CLOUD_SERVER_DATA_SYNC_BASIC_AUTH
        },
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxSyncDataToCloud(data, syncDataCloudUuid) {
    let result;
    $.ajax({
        url: Env.CLOUD_SERVER_DATA_SYNC + syncDataCloudUuid + ".json",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "put",
        data: data,
        headers: {
            "Authorization" : Env.CLOUD_SERVER_DATA_SYNC_BASIC_AUTH
        },
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
            result = "fail";
        }
    });
    return result;
}

// 接口调用
function ajaxGetBigStockMoney() {
    let result;
    var url = Env.GET_BIG_STOCK_MONEY_URL + "?lmt=0&klt=1&secid=1.000001&secid2=0.399001&fields1=f1,f2,f3,f7&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63";
    $.ajax({
        url: url,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetNanBeiXiangMoney() {
    let result;
    var url = Env.GET_NANBEI_XIANG_MONEY_URL + "?fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55,f56";
    $.ajax({
        url: url,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetBanKuaiMoney(type, day) {
    let dayParam = "";
    let gaiNianParam = "";
    if (day == '1') {
        dayParam = "f62&fid=f62";
    } else if (day == '5') {
        dayParam = "f164&fid=f164";
    } else if (day == '10') {
        dayParam = "f174&fid=f174";
    }
    if (type == 'HANGYE') {
        gaiNianParam = '&fs=m:90+t:2';
    } else if (type == 'GAINIAN') {
        gaiNianParam = '&fs=m:90+t:3';
    } else if (type == 'DIYU') {
        gaiNianParam = '&fs=m:90+t:1';
    }
    let result;
    var url = Env.GET_BANKUAI_MONEY_URL + "?pn=1&pz=500&po=1&np=1&fields=f12,f13,f14," + dayParam + gaiNianParam;
    $.ajax({
        url: url,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetWholeTwoMarketMoney() {
    let result;
    var url = Env.GET_WHOLE_TWO_MARKET_MONEY_URL + "?fltt=2&secids=1.000001,0.399001&fields=f1,f2,f3,f4,f6,f12,f13,f104,f105,f106";
    $.ajax({
        url: url,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetHuiLv(type) {
    let result;
    var url = Env.GET_HUILV_URL + "?num=100&chiyouhuobi=" + type + "&duihuanhuobi=CNY&type=1&callback=jisuanjieguo";
    $.ajax({
        url: url,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            data = data.substring(13, data.length - 2);
            result = JSON.parse(data);
            if (result == null || result == undefined || result == 'undefined'
                || result.dangqianhuilv == null || result.dangqianhuilv == '') {
                    result = {
                        "dangqianhuilv" : "1"
                    };
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
            result = {
                "dangqianhuilv" : "1"
            }
        }
    });
    return result;
}

// 接口调用
function ajaxPostAdvice(adviceContent) {
    let result;
    let request = {
        'adviceContent' : adviceContent
    }
    $.ajax({
        url: Env.ADVICE_URL,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "post",
        data: JSON.stringify(request),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            result = data.code;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
            result = "-1";
        }
    });
    return result;
}

// 接口调用
async function ajaxGetAdvice() {
    $.ajax({
        url: Env.ADVICE_URL,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            setAdviceUl(data.value);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// 接口调用
function ajaxGetUpDownCounts() {
    var result = null;
    $.ajax({
        url: Env.GET_UP_DOWN_COUNTS_URL + "?cb=callbackdata7930743&ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wz.ztzt",
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            // 使用正则表达式提取 JSON 数据部分
            var jsonStart = data.indexOf('(') + 1;
            var jsonEnd = data.lastIndexOf(')');
            var jsonData = data.substring(jsonStart, jsonEnd);
            // 将提取出的 JSON 字符串转换为 JSON 对象
            result = JSON.parse(jsonData);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

// 接口调用
function ajaxGetStockFromEastMoneyNoAsync(code) {
    let stocksArr;
    $.ajax({
        url: Env.GET_STOCK_FROM_EAST_MONEY_URL
          + "?fltt=2&fields=f12,f13,f19,f15,f16,f14,f139,f148,f124,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f88,f145,f153&secids="
          + code,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            stocksArr = data.data.diff;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return stocksArr;
}

// 接口调用
async function ajaxGetStockListFromEastMoney() {
    $.ajax({
        url: Env.GET_ALL_STOCK_LIST_FROM_EAST_MONEY_URL,
        timeout: 5000, // 设置超时时间为5000毫秒（5秒）
        type: "get",
        data: {},
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            showRiseFallCallback(data.data.diff);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}