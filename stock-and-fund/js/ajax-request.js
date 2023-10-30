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
function ajaxGetStockTimeImageMinuteMini(code){
    code = code.replace('sh','').replace('sz','');
    let result;
    $.ajax({
        url: Env.GET_STOCK_TIME_IMAGE_MINUTE_MINI + "?secid=1."+ code +"&fields1=f1,f2,f8&fields2=f51,f53,f56,f58&iscr=0&iscca=0&ndays=1",
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
    if (result.data == null || result.data == "null") {
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
    }
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


