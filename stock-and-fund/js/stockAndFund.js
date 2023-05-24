var stockTotalIncome;
var fundTotalIncome;
var stockDayIncome;
var fundDayIncome;
var stockTotalmarketValue;
var fundTotalmarketValue;
var totalMarketValue;
var fundList;
var stockList;

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
        " </tr>";
    var fundHead = " <tr >\n" +
        " <th >基金名称</th>\n" +
        " <th >当日盈利</th>\n" +
        " <th >涨跌幅</th>\n" +
        " <th >估算净值</th>\n" +
        " <th >持仓成本</th>\n" +
        " <th >持有份额</th>\n" +
        " <th >市值/金额</th>\n" +
        " <th >持仓占比</th>\n" +
        " <th >收益率</th>\n" +
        " <th >收益</th>\n" +
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
                if (code == null || code == '' ||
                    costPrise == null || costPrise == '' ||
                    bonds == null || bonds == '') {
                    alert("请添加必要信息");
                    return;
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
                        funds[k] = fund;
                        localStorage.setItem('funds', JSON.stringify(funds));
                        $("#fund-modal").modal("hide");
                        location.reload();
                        return;
                    }
                }
                if (!checkFundExsit(fund.fundCode)) {
                    alert("不存在该基金");
                    $("#fund-modal").modal("hide");
                    return;
                }
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
                if (code == null || code == '' ||
                    costPrise == null || costPrise == '' ||
                    bonds == null || bonds == '') {
                    alert("请添加必要信息");
                    return;
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
                        stocks[k] = stock;
                        localStorage.setItem('stocks', JSON.stringify(stocks));
                        $("#stock-modal").modal("hide");
                        location.reload();
                        return;
                    }
                }
                if (!checkStockExsit(stock.code)) {
                    alert("不存在该股票");
                    $("#stock-modal").modal("hide");
                    return;
                }
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
    var checkReuslt = false;
    $.ajax({
        url: Env.GET_FUND_FROM_TIANTIANJIJIN + code + ".js",
        type: "get",
        data: {},
        async: false,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var json = jQuery.parseJSON(data.substring(8, data.length - 2));
            var fund = {};
            fund.name = json.name + "";
            fund.dwjz = json.dwjz + "";
            fund.jzrq = json.jzrq + "";
            fund.gsz = json.gsz + "";
            fund.gztime = json.gztime + "";
            var gsz = new BigDecimal(json.gsz + "");
            var dwjz = new BigDecimal(json.dwjz + "");
            fund.gszzl = gsz.subtract(dwjz).divide(gsz, 4).multiply(new BigDecimal("100")).setScale(2) + "";
            var now = new BigDecimal(json.gsz + "");
            checkReuslt = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return checkReuslt;
}

function checkStockExsit(code) {
    var checkReuslt = false;
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
            var stock = {};
            stock.name = values[1] + "";
            stock.now = values[3] + "";
            stock.change = values[31] + "";
            stock.changePercent = values[32] + "";
            stock.time = values[30] + "";
            stock.max = values[33] + "";
            stock.min = values[34] + "";
            stock.buyOrSellStockRequestList = [];
            checkReuslt = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return checkReuslt;
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
                console.log("买入价格" + buyOrSells[l].price);
                console.log("当前价格" + result[k].now);
                var buyIncome = (new BigDecimal(result[k].now))
                    .subtract(new BigDecimal(buyOrSells[l].price + ""))
                    .multiply(new BigDecimal(buyOrSells[l].bonds + ""));
                todayBuyIncom = todayBuyIncom.add(buyIncome);
                console.log("买入收益：" + todayBuyIncom);
            }
            // 当天卖出过
            if (buyOrSells[l].type == "2") {
                todaySellIncom = todaySellIncom.add(new BigDecimal(buyOrSells[l].income + ""));
                console.log("卖出收益：" + todaySellIncom);
            }
        }
        console.log("买卖最大数" + maxBuyOrSellBonds);
        if (maxBuyOrSellBonds < result[k].bonds) {
            var restBonds = (new BigDecimal(result[k].bonds)).subtract(new BigDecimal(maxBuyOrSellBonds + ""));
            console.log("剩余股数：" + restBonds);
            dayIncome = (new BigDecimal(result[k].change)).multiply(restBonds);
        } else {
            dayIncome = new BigDecimal("0");
        }
        console.log(result[k].name + "计算当日买卖前：" + dayIncome);
        console.log(result[k].name + "计算：" + dayIncome.add(todayBuyIncom).add(todaySellIncom));
        dayIncome = dayIncome.add(todayBuyIncom).add(todaySellIncom);
        console.log(result[k].name + "计算当日买卖后：" + dayIncome);
        marketValue = (new BigDecimal(result[k].now)).multiply(new BigDecimal(result[k].bonds));
        if (totalMarketValueResult.compareTo(new BigDecimal("0")) != 0) {
            marketValuePercent = marketValue.multiply(new BigDecimal("100")).divide(totalMarketValueResult, 4);
        }
        var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome >= 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income >= 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");

        str += "<tr id=\"stock-tr-" + k + "\">"
            + "<td style=\"width: 200px;\">" + result[k].name
            // + "</td><td " + dayIncomeStyle + ">" + result[k].change
            + "</td><td " + dayIncomeStyle + ">" + dayIncome
            + "</td><td " + dayIncomeStyle + ">" + result[k].changePercent + "%"
            + "</td><td>" + result[k].now
            + "</td><td>" + result[k].costPrise
            + "</td><td>" + result[k].bonds
            + "</td><td>" + marketValue
            + "</td><td>" + marketValuePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].incomePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].income
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
    str += "<tr><td>合计</td><td " + stockDayIncomePercentStyle + ">" + stockDayIncome + "</td><td " + stockDayIncomePercentStyle + ">" + stockDayIncomePercent + "%</td><td colspan='3'></td><td colspan='2'>" + stockTotalmarketValue + "</td><td " + stockTotalIncomePercentStyle + ">" + stockTotalIncomePercent + "%</td><td " + stockTotalIncomePercentStyle + ">" + stockTotalIncome
        + "</td></tr>";
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
        var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");

        str += "<tr id=\"fund-tr-" + k + "\">"
            + "<td style=\"width: 200px;\">" + result[k].name
            // + "</td><td>"
            + "</td><td " + dayIncomeStyle + ">" + dayIncome
            + "</td><td " + dayIncomeStyle + ">" + result[k].gszzl + "%"
            + "</td><td>" + result[k].gsz
            + "</td><td>" + result[k].costPrise
            + "</td><td>" + result[k].bonds
            + "</td><td>" + marketValue
            + "</td><td>" + marketValuePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].incomePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].income
            + "</td></tr>";
        // alert(result[k].income);
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
        + "</td></tr>";

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

    str += "<tr><td>汇总合计</td><td " + allDayIncomePercentStyle + ">" + allDayIncome + "</td><td colspan='2' " + allDayIncomePercentStyle + ">" + allDayIncomePercent + "%</td><td colspan='2'></td><td colspan='2'>" + totalMarketValueResult + "</td><td " + allTotalIncomePercentStyle + ">" + allTotalIncomePercent + "%</td><td " + allTotalIncomePercentStyle + ">" + allTotalIncome
        + "</td></tr>";

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
            console.log("股票code为", stockCode);
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
                    console.log(name, "==找到的结果", fundsArr[i]);
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
