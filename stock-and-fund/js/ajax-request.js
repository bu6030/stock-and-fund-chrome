// 接口调用
function ajaxGetStockAndFundFromLocalService() {
    var result;
    $.ajax({
        url: Env.GET_STOCK_AND_FUND_FROM_LOCAL_SERVICE,
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
function ajaxGetFundCodeFromTiantianjijin() {
    let result;
    $.ajax({
        url: Env.GET_FUND_CODE_BY_NAME_FROM_TIANTIANJIJIN,
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
function ajaxGetStockFromGtimg(code) {
    let result;
    $.ajax({
        url: Env.GET_STOCK_FROM_GTIMG + "q=" + code,
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
function ajaxGetFundFromTiantianjijin(code) {
    let result;
    var FUND_URL = Env.GET_FUND_FROM_TIANTIANJIJIN;
    FUND_URL = FUND_URL.replace('{CODE}', code);
    $.ajax({
        url: FUND_URL,
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
function ajaxGetStockTimeImageMinuteMini(code) {
    let secid = getSecid(code);
    code = code.replace('sh','').replace('sz','').replace('us','').replace('hk','').replace('.', '_');
    let result;
    $.ajax({
        url: Env.GET_STOCK_TIME_IMAGE_MINUTE_MINI + "?secid=" + secid + "."+ code +"&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f53,f56,f58&iscr=0&iscca=0&ndays=1",
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
function ajaxGetFundTimeImageMinuteMini(code) {
    let result;
    $.ajax({
        url: Env.GET_STOCK_TIME_IMAGE_MINUTE_MINI + "?secid=0."+ code +"&fields1=f1,f2,f8&fields2=f51,f53,f56,f58&iscr=0&iscca=0&ndays=1",
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
function ajaxGetStockTimeImage(code, type, end) {
    let klt;
    if (type == 'DAY') {
        klt = 101;
    } else if (type == 'WEEK'){
        klt = 102;
    } else if (type == 'MONTH'){
        klt = 103;
    }
    let secid = getSecid(code);
    code = code.replace('sh','').replace('sz','').replace('us','').replace('hk','').replace('.', '_');
    let result;
    $.ajax({
    url: Env.GET_STOCK_TIME_IMAGE_FROM_EASTMONEY + "?secid=" + secid + "."+ code + "&klt=" + klt + "&fqt=1&lmt=80&end=" + end + "&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf59&forcect=1",
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
function ajaxGetHangYeBanKuaiMoney() {
    let result;
    var url = Env.GET_HANGYE_BANKUAI_MONEY_URL + "?pn=1&pz=500&po=1&np=1&fields=f12,f13,f14,f62&fid=f62&fs=m:90+t:2";
    $.ajax({
        url: url,
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
        type: "get",
        data: {},
        async: false,
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