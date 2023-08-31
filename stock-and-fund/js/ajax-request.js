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
    $.ajax({
        url: Env.GET_FUND_FROM_TIANTIANJIJIN + code + ".js",
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