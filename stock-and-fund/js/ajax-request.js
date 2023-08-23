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