var stockTotalIncome;
var fundTotalIncome;
var stockDayIncome;
var fundDayIncome;
var stockTotalmarketValue;
var fundTotalmarketValue;
var totalMarketValue;
var fundList;
var stockList;
//分时图/日线/周线/月线使用
let timeImageCode;
let timeImageType;

window.addEventListener("load", (event) => {
    var funds = localStorage.getItem('funds');
    if (funds == null) {
        fundList = [];
    } else {
        fundList = jQuery.parseJSON(funds);
    }

    var stocks = localStorage.getItem('stocks');
    if (stocks == null) {
        stockList = [];
    } else {
        stockList = jQuery.parseJSON(stocks);
    }
    initHtml();
    initData();
    initLargeMarketData();
});

function initHtml() {
    if (!develop) {
        $("#importFromLocalSpringBoot")[0].style.display = "none";
    }
    var stockHead = " <tr > " +
        " <th >股票名称</th> " +
        " <th >当日盈利</th> " +
        " <th >涨跌幅</th> " +
        " <th >当前价</th> " +
        " <th >成本价</th> " +
        " <th >持仓</th> " +
        " <th >市值/金额</th> " +
        " <th >持仓占比</th> " +
        " <th >收益率</th> " +
        " <th >收益</th> " +
        " <th >自选价格</th> " +
        " </tr>";
    var fundHead = " <tr >" +
        " <th >基金名称</th>" +
        " <th >当日盈利</th>" +
        " <th >涨跌幅</th>" +
        " <th >估算净值</th>" +
        " <th >持仓成本</th>" +
        " <th >持有份额</th>" +
        " <th >市值/金额</th>" +
        " <th >持仓占比</th>" +
        " <th >收益率</th>" +
        " <th >收益</th>" +
        " <th >自选价格</th> " +
        " </tr>";
    $("#fund-head").html(fundHead);
    $("#stock-head").html(stockHead);
}

document.addEventListener(
    'DOMContentLoaded',
    function () {
        let showFundDialog = document.getElementById('showFundDialog');
        showFundDialog.addEventListener('click', function () {
                $("#fund-name").val('');
                $("#fund-name").removeAttr("disabled");
                $("#fund-code").val('');
                $("#fund-costPrise").val('');
                $("#fund-bonds").val('');
                $("#fund-delete-button")[0].style.display = "none";
                $("#fund-search-button")[0].style.display  = 'inline';
                $("#fund-show-time-image-button")[0].style.display  = 'none';
                $("#fund-modal").modal();
            }
        );
        let showStockDialog = document.getElementById('showStockDialog');
        showStockDialog.addEventListener('click', function () {
                $("#stock-name").val('');
                $("#stock-name").removeAttr("disabled");
                $("#stock-code").val('');
                $("#stock-costPrise").val('');
                $("#stock-bonds").val('100');
                $("#stock-delete-button")[0].style.display = "none";
                $("#stock-search-button")[0].style.display  = 'inline';
                $("#stock-show-time-image-button")[0].style.display  = 'none';
                $("#stock-modal").modal();
            }
        );
        let showImportDataDialog = document.getElementById('showImportDataDialog');
        showImportDataDialog.addEventListener('click', function () {
                $("#data-import-modal").modal();
            }
        );
        let showExportDataDialog = document.getElementById('showExportDataDialog');
        showExportDataDialog.addEventListener('click', function () {
                $("#data-export-modal").modal();
                var data = {};
                data.stocks = stockList;
                data.funds = fundList;
                $("#export-data").val(JSON.stringify(data));
            }
        );
        let dataExportButton = document.getElementById('data-export-button');
        dataExportButton.addEventListener('click', function () {
                var data = {};
                data.stocks = stockList;
                data.funds = fundList;
                downloadJsonOrTxt('股票基金神器.txt', JSON.stringify(data));
            }
        );
        let dataImportButton = document.getElementById('data-import-button');
        dataImportButton.addEventListener('click', function () {
                var data = $("#import-data").val();
                var json = jQuery.parseJSON(data);
                localStorage.setItem('stocks', JSON.stringify(json.stocks));
                localStorage.setItem('funds', JSON.stringify(json.funds));
                $("#data-import-modal").modal("hide");
                location.reload();
            }
        );
        let fundSaveButton = document.getElementById('fund-save-button');
        fundSaveButton.addEventListener('click', function () {
                var code = $("#fund-code").val();
                var costPrise = $("#fund-costPrise").val();
                var bonds = $("#fund-bonds").val();
                if (code == null || code == '') {
                    alert("请添加基金编码");
                    return;
                }
                if (costPrise == null || costPrise == '') {
                    costPrise = "0";
                }
                if (bonds == null || bonds == '') {
                    bonds = "0";
                }
                var fund = {
                    "fundCode": code,
                    "costPrise": costPrise,
                    "bonds": bonds,
                }
                var funds = localStorage.getItem('funds');
                if (funds == null) {
                    funds = [];
                } else {
                    funds = jQuery.parseJSON(funds);
                }
                for (var k in funds) {
                    if (funds[k].fundCode == fund.fundCode) {
                        funds[k].fundCode = fund.fundCode;
                        funds[k].costPrise = fund.costPrise;
                        funds[k].bonds = fund.bonds;
                        if (funds[k].addTimePrice == null || funds[k].addTimePrice == '') {
                            let checkFundExsitReuslt = checkFundExsit(funds[k].fundCode);
                            funds[k].addTimePrice = checkFundExsitReuslt.now;
                            funds[k].addTime = getCurrentDate();
                        }
                        localStorage.setItem('funds', JSON.stringify(funds));
                        $("#fund-modal").modal("hide");
                        location.reload();
                        return;
                    }
                }
                let checkFundExsitReuslt = checkFundExsit(fund.fundCode);
                if (!checkFundExsitReuslt.checkReuslt) {
                    alert("不存在该基金");
                    $("#fund-modal").modal("hide");
                    return;
                }
                fund.addTimePrice = checkFundExsitReuslt.now;
                fund.addTime = getCurrentDate();
                funds.push(fund);
                localStorage.setItem('funds', JSON.stringify(funds));
                $("#fund-modal").modal("hide");
                location.reload();
            }
        );
        let stockSaveButton = document.getElementById('stock-save-button');
        stockSaveButton.addEventListener('click', function () {
                var code = $("#stock-code").val();
                var costPrise = $("#stock-costPrise").val();
                var bonds = $("#stock-bonds").val();
                if (code == null || code == '') {
                    alert("请添加股票编码");
                    return;
                }
                if (costPrise == null || costPrise == '') {
                    costPrise = "0";
                }
                if (bonds == null || bonds == '') {
                    bonds = "0";
                }
                var stock = {
                    "code": code,
                    "costPrise": costPrise,
                    "bonds": bonds,
                }
                var stocks = localStorage.getItem('stocks');
                if (stocks == null) {
                    stocks = [];
                } else {
                    stocks = jQuery.parseJSON(stocks);
                }
                for (var k in stocks) {
                    if (stocks[k].code == stock.code) {
                        stocks[k].code = stock.code;
                        stocks[k].costPrise = stock.costPrise;
                        stocks[k].bonds = stock.bonds;
                        if (stocks[k].addTimePrice == null || stocks[k].addTimePrice == '') {
                            let checkStockExsitResult = checkStockExsit(stocks[k].code);
                            stocks[k].addTimePrice = checkStockExsitResult.now;
                            stocks[k].addTime = getCurrentDate();
                        }
                        localStorage.setItem('stocks', JSON.stringify(stocks));
                        $("#stock-modal").modal("hide");
                        location.reload();
                        return;
                    }
                }
                let checkStockExsitResult = checkStockExsit(stock.code);
                if (!checkStockExsitResult.checkReuslt) {
                    alert("不存在该股票");
                    $("#stock-modal").modal("hide");
                    return;
                }
                stock.addTimePrice = checkStockExsitResult.now;
                stock.addTime = getCurrentDate();
                stocks.push(stock);
                localStorage.setItem('stocks', JSON.stringify(stocks));
                $("#stock-modal").modal("hide");
                location.reload();
            }
        );
        let importFromLocalSpringBoot = document.getElementById('importFromLocalSpringBoot');
        importFromLocalSpringBoot.addEventListener('click', function () {
                $.ajax({
                    url: Env.GET_STOCK_AND_FUND_FROM_LOCAL_SERVICE,
                    type: "get",
                    data: {},
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded',
                    success: function (data) {
                        localStorage.setItem('stocks', JSON.stringify(data.value.stocks));
                        localStorage.setItem('funds', JSON.stringify(data.value.funds));
                        location.reload();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest.status);
                        console.log(XMLHttpRequest.readyState);
                        console.log(textStatus);
                    }
                });

            }
        );
        let stockDeleteButton = document.getElementById('stock-delete-button');
        stockDeleteButton.addEventListener('click', function () {
                var stocks = localStorage.getItem('stocks');
                stocks = jQuery.parseJSON(stocks);
                var code = $("#stock-code").val();
                for (var k in stocks) {
                    if (stocks[k].code == code) {
                        // delete stocks[k];
                        stocks.splice(k, 1)
                        break;
                    }
                }
                localStorage.setItem('stocks', JSON.stringify(stocks));
                $("#stock-modal").modal("hide");
                location.reload();
            }
        );
        let fundDeleteButton = document.getElementById('fund-delete-button');
        fundDeleteButton.addEventListener('click', function () {
                var funds = localStorage.getItem('funds');
                funds = jQuery.parseJSON(funds);
                var code = $("#fund-code").val();
                for (var k in funds) {
                    if (funds[k].fundCode == code) {
                        funds.splice(k, 1)
                        break;
                    }
                }
                localStorage.setItem('funds', JSON.stringify(funds));
                $("#fund-modal").modal("hide");
                location.reload();
            }
        );
        let stockSearchButton = document.getElementById('stock-search-button');
        stockSearchButton.addEventListener('click', function () {
                var stockName = $("#stock-name").val();
                if(stockName == "" || stockName == null){
                    alert("请输入股票名称");
                    return;
                }
                searchStockByName(stockName);
            }
        );
        let fundSearchButton = document.getElementById('fund-search-button');
        fundSearchButton.addEventListener('click', function () {
                var fundName = $("#fund-name").val();
                if(fundName == "" || fundName == null){
                    alert("请输入基金名称");
                    return;
                }
                searchFundByName(fundName);
            }
        );
        let fundShowTimeImageButton = document.getElementById('fund-show-time-image-button');
        fundShowTimeImageButton.addEventListener('click', function () {
                let fundCode = $("#fund-code").val();
                timeImageCode = fundCode;
                timeImageType = "FUND";
                showMinuteImage();
            }
        );

        let stockShowTimeImageButton = document.getElementById('stock-show-time-image-button');
        stockShowTimeImageButton.addEventListener('click', function () {
                let stockCode = $("#stock-code").val();
                timeImageCode = stockCode;
                timeImageType = "STOCK";
                showMinuteImage();
            }
        );
        //分时图按钮点击
        let timeImageMinuteButton = document.getElementById('time-image-minute-button');
        timeImageMinuteButton.addEventListener('click', function () {
            showMinuteImage();
            }
        );
        //日线图按钮点击
        let timeImageDayButton = document.getElementById('time-image-day-button');
        timeImageDayButton.addEventListener('click', function () {
                showDayImage();
            }
        );
        //周线图按钮点击
        let timeImageWeekButton = document.getElementById('time-image-week-button');
        timeImageWeekButton.addEventListener('click', function () {
                showWeekImage();
            }
        );
        //月线图按钮点击
        let timeImageMonthButton = document.getElementById('time-image-month-button');
        timeImageMonthButton.addEventListener('click', function () {
                showMonthImage();
            }
        );
        //清理数据按钮点击
        let removeAllDataButton = document.getElementById('remove-all-data-button');
        removeAllDataButton.addEventListener('click', function () {
                let stocksRemove = [];
                let fundsRemove = [];
                localStorage.setItem('stocks', JSON.stringify(stocksRemove));
                localStorage.setItem('funds', JSON.stringify(fundsRemove));
                location.reload();
            }
        );
    }
);

function initData() {
    var stocks = "";
    for (var k in stockList) {
        stocks += stockList[k].code + ",";
    }

    $.ajax({
        url: Env.GET_STOCK_FROM_GTIMG + "q=" + stocks,
        type: "get",
        data: {},
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var stoksArr = data.split("\n");

            for (var k in stoksArr) {
                for (var l in stockList) {
                    if (stockList[l].code == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))) {
                        var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                        var values = dataStr.split("~");
                        stockList[l].name = values[1] + "";
                        stockList[l].now = values[3] + "";
                        stockList[l].change = values[31] + "";
                        stockList[l].changePercent = values[32] + "";
                        stockList[l].time = values[30] + "";
                        stockList[l].max = values[33] + "";
                        stockList[l].min = values[34] + "";
                        stockList[l].buyOrSellStockRequestList = [];

                        var now = new BigDecimal(stockList[l].now + "");
                        var costPrise = new BigDecimal(stockList[l].costPrise + "")
                        var incomeDiff = now.add(costPrise.negate());
                        if (costPrise <= 0) {
                            stockList[l].incomePercent = 0 + "";
                        } else {
                            var incomePercent = incomeDiff.divide(costPrise, 5, 4)
                                .multiply(BigDecimal.TEN)
                                .multiply(BigDecimal.TEN)
                                .setScale(3);
                            stockList[l].incomePercent = incomePercent + "";
                        }

                        var bonds = new BigDecimal(stockList[l].bonds);
                        var income = incomeDiff.multiply(bonds)
                            .setScale(2);
                        stockList[l].income = income + "";
                    }
                }
            }
            initFund();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

function initFund() {
    for (var l in fundList) {
        var fundCode = fundList[l].fundCode;
        $.ajax({
            url: Env.GET_FUND_FROM_TIANTIANJIJIN + fundList[l].fundCode + ".js",
            type: "get",
            data: {},
            async: false,
            dataType: 'text',
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                for (var k in fundList) {
                    if (fundList[k].fundCode == fundCode) {
                        if (data == "jsonpgz();") {
                            getFundBySelfService(fundList[k]);
                        } else {
                            var json = jQuery.parseJSON(data.substring(8, data.length - 2));
                            fundList[k].name = json.name + "";
                            fundList[k].dwjz = json.dwjz + "";
                            fundList[k].jzrq = json.jzrq + "";
                            fundList[k].gsz = json.gsz + "";
                            fundList[k].gztime = json.gztime + "";
                            var gsz = new BigDecimal(json.gsz + "");
                            var dwjz = new BigDecimal(json.dwjz + "");
                            fundList[k].gszzl = json.gszzl + "";

                            var now = new BigDecimal(json.gsz + "");
                            var costPrice = new BigDecimal(fundList[k].costPrise + "");
                            var incomeDiff = now.add(costPrice.negate());
                            if (costPrice <= 0) {
                                fundList[k].incomePercent = "0";
                            } else {
                                var incomePercent = incomeDiff.divide(costPrice, 8, MathContext.ROUND_HALF_UP)
                                    .multiply(BigDecimal.TEN)
                                    .multiply(BigDecimal.TEN)
                                    .setScale(3, MathContext.ROUND_HALF_UP);
                                fundList[k].incomePercent = incomePercent + "";
                            }
                            var bonds = new BigDecimal(fundList[k].bonds + "");
                            var income = incomeDiff.multiply(bonds)
                                .setScale(2, MathContext.ROUND_HALF_UP);
                            fundList[k].income = income + "";
                        }
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
    }
    initStockAndFundHtml();
}

function getFundBySelfService(fund) {
    $.ajax({
        url: Env.GET_FUND_FROM_LOCAL_SERVICE + "?fundCode=" + fund.fundCode + "&costPrise=" + fund.costPrise + "&bonds=" + fund.bonds + "&app=" + fund.app,
        type: "get",
        data: {},
        async: false,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            // alert(data.value.fundName+"");
            fund.name = data.value.fundName + "";
            fund.jzrq = data.value.jzrq + "";
            fund.dwjz = data.value.dwjz + "";
            fund.gsz = data.value.gsz + "";
            fund.gszzl = data.value.gszzl + "";
            fund.gztime = data.value.gztime + "";
            fund.incomePercent = data.value.incomePercent + "";
            fund.income = data.value.income + "";
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

function checkFundExsit(code) {
    var fund = {};
    fund.checkReuslt = false;
    $.ajax({
        url: Env.GET_FUND_FROM_TIANTIANJIJIN + code + ".js",
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var json = jQuery.parseJSON(data.substring(8, data.length - 2));

            fund.name = json.name + "";
            fund.dwjz = json.dwjz + "";
            fund.jzrq = json.jzrq + "";
            fund.gsz = json.gsz + "";
            fund.gztime = json.gztime + "";
            var gsz = new BigDecimal(json.gsz + "");
            var dwjz = new BigDecimal(json.dwjz + "");
            fund.gszzl = gsz.subtract(dwjz).divide(gsz, 4).multiply(new BigDecimal("100")).setScale(2) + "";
            var now = new BigDecimal(json.gsz + "");
            fund.checkReuslt = true;
            fund.now = now + "";
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return fund;
}

function checkStockExsit(code) {
    var stock = {};
    stock.checkReuslt = false;
    $.ajax({
        url: Env.GET_STOCK_FROM_GTIMG + "q=" + code,
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var stoksArr = data.split("\n");
            var dataStr = stoksArr[0].substring(stoksArr[0].indexOf("=") + 2, stoksArr[0].length - 2);
            var values = dataStr.split("~");
            if (values.length > 5) {
                stock.name = values[1] + "";
                stock.now = values[3] + "";
                stock.change = values[31] + "";
                stock.changePercent = values[32] + "";
                stock.time = values[30] + "";
                stock.max = values[33] + "";
                stock.min = values[34] + "";
                stock.buyOrSellStockRequestList = [];
                stock.checkReuslt = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return stock;
}

function initStockAndFundHtml() {
    var marketValue = new BigDecimal("0");
    totalMarketValue = new BigDecimal("0");
    for (var k = stockList.length - 1; k >= 0; k--) {
        marketValue = (new BigDecimal(stockList[k].now)).multiply(new BigDecimal(stockList[k].bonds));
        totalMarketValue = totalMarketValue.add(marketValue);
    }

    for (var k = fundList.length - 1; k >= 0; k--) {
        marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz)).multiply(new BigDecimal(fundList[k].bonds))).toFixed(2));
        totalMarketValue = totalMarketValue.add(marketValue);
    }

    var str1 = getStockTableHtml(stockList, totalMarketValue);
    $("#stock-nr").html(str1);

    var str2 = getFundTableHtml(fundList, totalMarketValue);
    $("#fund-nr").html(str2);

    for (k in stockList) {
        let stockTr = document.getElementById('stock-tr-' + k);
        stockTr.addEventListener('click', function () {
            $("#stock-name").val(stockList[this.sectionRowIndex].name);
            $("#stock-name").attr("disabled", "disabled");
            $("#stock-code").val(stockList[this.sectionRowIndex].code);
            $("#stock-costPrise").val(stockList[this.sectionRowIndex].costPrise);
            $("#stock-bonds").val(stockList[this.sectionRowIndex].bonds);
            $("#stock-delete-button")[0].style.display  = 'block';
            $("#stock-search-button")[0].style.display  = 'none';
            $("#stock-show-time-image-button")[0].style.display  = 'inline';
            $("#stock-modal").modal();
        });
    }

    for (k in fundList) {
        let fundTr = document.getElementById('fund-tr-' + k);
        fundTr.addEventListener('click', function () {
            $("#fund-name").val(fundList[this.sectionRowIndex].name);
            $("#fund-name").attr("disabled", "disabled");
            $("#fund-code").val(fundList[this.sectionRowIndex].fundCode);
            $("#fund-costPrise").val(fundList[this.sectionRowIndex].costPrise);
            $("#fund-bonds").val(fundList[this.sectionRowIndex].bonds);
            $("#fund-delete-button")[0].style.display  = 'block';
            $("#fund-search-button")[0].style.display  = 'none';
            $("#fund-show-time-image-button")[0].style.display  = 'inline';
            $("#fund-modal").modal();
        });
    }
}

function getStockTableHtml(result, totalMarketValueResult) {
    var str = "";
    stockTotalIncome = new BigDecimal("0");
    stockDayIncome = new BigDecimal("0");
    stockTotalmarketValue = new BigDecimal("0");
    var dayIncome = new BigDecimal("0");
    var marketValue = new BigDecimal("0");
    var marketValuePercent = new BigDecimal("0");
    for (var k in result) {
        var buyOrSells = result[k].buyOrSellStockRequestList;
        var todayBuyIncom = new BigDecimal("0");
        var todaySellIncom = new BigDecimal("0");
        var maxBuyOrSellBonds = 0;
        for (var l in buyOrSells) {
            // 当天购买过
            if (buyOrSells[l].type == "1") {
                maxBuyOrSellBonds = maxBuyOrSellBonds + buyOrSells[l].bonds;
                var buyIncome = (new BigDecimal(result[k].now))
                    .subtract(new BigDecimal(buyOrSells[l].price + ""))
                    .multiply(new BigDecimal(buyOrSells[l].bonds + ""));
                todayBuyIncom = todayBuyIncom.add(buyIncome);
            }
            // 当天卖出过
            if (buyOrSells[l].type == "2") {
                todaySellIncom = todaySellIncom.add(new BigDecimal(buyOrSells[l].income + ""));
            }
        }
        if (maxBuyOrSellBonds < result[k].bonds) {
            var restBonds = (new BigDecimal(result[k].bonds)).subtract(new BigDecimal(maxBuyOrSellBonds + ""));
            dayIncome = (new BigDecimal(result[k].change)).multiply(restBonds);
        } else {
            dayIncome = new BigDecimal("0");
        }
        dayIncome = dayIncome.add(todayBuyIncom).add(todaySellIncom);
        marketValue = (new BigDecimal(result[k].now)).multiply(new BigDecimal(result[k].bonds));
        if (totalMarketValueResult.compareTo(new BigDecimal("0")) != 0) {
            marketValuePercent = marketValue.multiply(new BigDecimal("100")).divide(totalMarketValueResult, 4);
        }
        var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome >= 0 ? "style=\"color:#c12e2a;width: 65px;\"" : "style=\"color:#3e8f3e;width: 65px;\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income >= 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
        let addTimePrice =  !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" +result[k].addTime + ")"
        str += "<tr id=\"stock-tr-" + k + "\">"
            + "<td style=\"width: 170px;\">" + result[k].name
            + "</td><td " + dayIncomeStyle + ">" + dayIncome.setScale(2)
            + "</td><td " + dayIncomeStyle + ">" + result[k].changePercent + "%"
            + "</td><td>" + result[k].now
            + "</td><td style=\"width: 60px;\">" + result[k].costPrise
            + "</td><td>" + result[k].bonds
            + "</td><td style=\"width: 70px;\">" + marketValue.setScale(2)
            + "</td><td style=\"width: 65px;\">" + marketValuePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].incomePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].income
            + "</td><td style=\"width: 140px;\">" + addTimePrice
            + "</td></tr>";
        stockTotalIncome = stockTotalIncome.add(new BigDecimal(result[k].income));
        stockDayIncome = stockDayIncome.add(dayIncome);
        stockTotalmarketValue = stockTotalmarketValue.add(marketValue);
    }
    var stockDayIncomePercent = new BigDecimal("0");
    var stockTotalIncomePercent = new BigDecimal("0");
    if (stockTotalmarketValue != 0) {
        stockDayIncomePercent = stockDayIncome.multiply(new BigDecimal("100")).divide(stockTotalmarketValue, 4);
        stockTotalIncomePercent = stockTotalIncome.multiply(new BigDecimal("100")).divide(stockTotalmarketValue, 4);
    }
    var stockDayIncomePercentStyle = stockDayIncome == 0 ? "" : (stockDayIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    var stockTotalIncomePercentStyle = stockTotalIncome == 0 ? "" : (stockTotalIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    str += "<tr><td>合计</td><td " + stockDayIncomePercentStyle + ">" + stockDayIncome.setScale(2) + "</td><td " + stockDayIncomePercentStyle + ">" + stockDayIncomePercent.setScale(2, 4) + "%</td><td colspan='3'></td><td colspan='2'>" + stockTotalmarketValue.setScale(2) + "</td><td " + stockTotalIncomePercentStyle + ">" + stockTotalIncomePercent + "%</td><td " + stockTotalIncomePercentStyle + ">" + stockTotalIncome
        + "</td><td></td></tr>";
    return str;
}

function getFundTableHtml(result, totalMarketValueResult) {
    var str = "";
    fundTotalIncome = new BigDecimal("0");
    fundDayIncome = new BigDecimal("0");
    fundTotalmarketValue = new BigDecimal("0");
    var dayIncome = new BigDecimal("0");
    var marketValue = new BigDecimal("0");
    var marketValuePercent = new BigDecimal("0");
    for (var k in result) {
        dayIncome = new BigDecimal(parseFloat((new BigDecimal(result[k].gszzl)).multiply((new BigDecimal(result[k].dwjz))).multiply(new BigDecimal(result[k].bonds)).divide(new BigDecimal("100"))).toFixed(2));
        marketValue = new BigDecimal(parseFloat((new BigDecimal(result[k].gsz)).multiply(new BigDecimal(result[k].bonds))).toFixed(2));
        if (totalMarketValueResult.compareTo(new BigDecimal("0")) != 0) {
            marketValuePercent = marketValue.multiply(new BigDecimal("100")).divide(totalMarketValueResult, 4);
        }
        var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome > 0 ? "style=\"color:#c12e2a;width: 65px;\"" : "style=\"color:#3e8f3e;width: 65px;\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
        let addTimePrice =  !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" +result[k].addTime + ")"
        str += "<tr id=\"fund-tr-" + k + "\">"
            + "<td style=\"width: 170px;\">" + result[k].name
            + "</td><td " + dayIncomeStyle + ">" + dayIncome
            + "</td><td " + dayIncomeStyle + ">" + result[k].gszzl + "%"
            + "</td><td>" + result[k].gsz
            + "</td><td style=\"width: 60px;\">" + result[k].costPrise
            + "</td><td>" + result[k].bonds
            + "</td><td style=\"width: 70px;\">" + marketValue
            + "</td><td style=\"width: 65px;\">" + marketValuePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].incomePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].income
            + "</td><td style=\"width: 140px;\">" + addTimePrice
            + "</td></tr>";
        fundTotalIncome = fundTotalIncome.add(new BigDecimal(result[k].income));
        fundDayIncome = fundDayIncome.add(dayIncome);
        fundTotalmarketValue = fundTotalmarketValue.add(marketValue);
    }
    var fundDayIncomePercent = new BigDecimal("0");
    var fundTotalIncomePercent = new BigDecimal("0");
    if (fundTotalmarketValue != 0) {
        fundDayIncomePercent = fundDayIncome.multiply(new BigDecimal("100")).divide(fundTotalmarketValue, 4);
        fundTotalIncomePercent = fundTotalIncome.multiply(new BigDecimal("100")).divide(fundTotalmarketValue, 4);
    }
    var fundDayIncomePercentStyle = fundDayIncome == 0 ? "" : (fundDayIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    var fundTotalIncomePercentStyle = fundTotalIncome == 0 ? "" : (fundTotalIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    str += "<tr><td>合计</td><td " + fundDayIncomePercentStyle + ">" + fundDayIncome + "</td><td colspan='2' " + fundDayIncomePercentStyle + ">" + fundDayIncomePercent + "%</td><td colspan='2'></td><td colspan='2'>" + fundTotalmarketValue + "</td><td " + fundTotalIncomePercentStyle + ">" + fundTotalIncomePercent + "%</td><td " + fundTotalIncomePercentStyle + ">" + fundTotalIncome
        + "</td><td></td></tr>";

    var allDayIncome = fundDayIncome.add(stockDayIncome);
    var allTotalIncome = fundTotalIncome.add(stockTotalIncome);
    var allDayIncomePercent = new BigDecimal("0");
    var allTotalIncomePercent = new BigDecimal("0");
    if (totalMarketValueResult != 0) {
        allDayIncomePercent = allDayIncome.multiply(new BigDecimal("100")).divide(totalMarketValueResult, 4);
        allTotalIncomePercent = allTotalIncome.multiply(new BigDecimal("100")).divide(totalMarketValueResult, 4);
    }
    var allDayIncomePercentStyle = allDayIncome == 0 ? "" : (allDayIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    var allTotalIncomePercentStyle = allTotalIncome == 0 ? "" : (allTotalIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");

    str += "<tr><td>汇总合计</td><td " + allDayIncomePercentStyle + ">" + allDayIncome.setScale(2) + "</td><td colspan='2' " + allDayIncomePercentStyle + ">" + allDayIncomePercent.setScale(2, 4) + "%</td><td colspan='2'></td><td colspan='2'>" + totalMarketValueResult.setScale(2) + "</td><td " + allTotalIncomePercentStyle + ">" + allTotalIncomePercent + "%</td><td " + allTotalIncomePercentStyle + ">" + allTotalIncome
        + "</td><td></td></tr>";

    return str;
}

function searchStockByName(name) {
    $.ajax({
        url: Env.GET_STOCK_CODE_BY_NAME_FROM_GTIMG + "?v=2&t=all&c=1&q=" + name,
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            if (data.indexOf("v_hint=\"N\";") != -1) {
                alert("不存在该股票");
                return;
            }
            data = data.replace("v_hint=\"", "").replace(" ", "");
            var stocksArr = data.split("^");
            var values = stocksArr[0].split("~");
            var stockCode = values[0] + values[1];
            $("#stock-code").val(stockCode);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

function searchFundByName(name) {
    $.ajax({
        url: Env.GET_FUND_CODE_BY_NAME_FROM_TIANTIANJIJIN,
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            data = data.replace("var r = ", "").replace(";", "");
            var fundsArr = jQuery.parseJSON(data);
            var fundCode = "";
            var fundName = "";
            for (var i = 0; i < fundsArr.length; i++) {
                if (fundsArr[i][2].indexOf(name) != -1) {
                    fundCode = fundsArr[i][0];
                    fundName = fundsArr[i][2];
                    break;
                }
            }
            $("#fund-code").val(fundCode);
            $("#fund-name").val(fundName);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

function showMinuteImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
        $("#fund-modal").modal("hide");
        $("#time-image-day-button")[0].style.display  = 'none';
        $("#time-image-week-button")[0].style.display  = 'none';
        $("#time-image-month-button")[0].style.display  = 'none';
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA + timeImageCode +".gif";
        $("#stock-modal").modal("hide");
        $("#time-image-day-button")[0].style.display  = 'block';
        $("#time-image-week-button")[0].style.display  = 'block';
        $("#time-image-month-button")[0].style.display  = 'block';
    }
    $("#time-image-modal").modal();
    $("#time-image").html('<img src="'+path+'" width="100%" length="100%" />');
}

function showDayImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_DAY_FROM_SINA + timeImageCode + ".gif";
    }
    $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}

function showWeekImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_WEEK_FROM_SINA + timeImageCode + ".gif";
    }
    // $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}

function showMonthImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_MONTH_FROM_SINA + timeImageCode + ".gif";
    }
    // $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}

function getCurrentDate() {
    var date = new Date();
    var year= date.getFullYear() ; // 得到当前年份
    var month = date.getMonth()  + 1; // 得到当前月份（0-11月份，+1是当前月份）
    month = month >= 10 ? month :'0' + month; // 补零
    var day = date.getDate(); // 得到当前天数
    day = day >= 10 ? day :'0' + day; // 补零
    return year + '-' + month + '-' + day; // 这里传入的是字符串
}

function downloadJsonOrTxt(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}