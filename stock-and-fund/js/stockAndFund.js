var filteredApp = "ALL";
var stockTotalIncome;
var fundTotalIncome;
var stockDayIncome;
var fundDayIncome;
var stockTotalmarketValue;
var fundTotalmarketValue;
var totalMarketValue;
var fundList;
var stockList;

var appList = [
    {
        "type": "APP",
        "code": "DFCF",
        "name": "东方财富"
    },
    {
        "type": "APP",
        "code": "ZFB",
        "name": "支付宝"
    },
    {
        "type": "APP",
        "code": "DFZQ",
        "name": "东方证券"
    },
    {
        "type": "APP",
        "code": "ZGYH",
        "name": "中国银行"
    },
    {
        "type": "APP",
        "code": "PAYH",
        "name": "平安银行"
    }
];

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
});

function initHtml(){
    var fundHead = " <tr > " +
        " <th >APP</th> " +
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
    var stockHead = " <tr >\n" +
        " <th >APP</th>\n" +
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
    function() {
        let showFundDialog = document.getElementById('showFundDialog');
        showFundDialog.addEventListener('click',function() {
                $("#fund-name").val('');
                $("#fund-code").val('');
                $("#fund-costPrise").val('');
                $("#fund-bonds").val('');
                $("#fund-app").val('');
                $("#fund-modal").modal();
            }
        );
        let showStockDialog = document.getElementById('showStockDialog');
        showStockDialog.addEventListener('click',function() {
                $("#stock-name").val('');
                $("#stock-code").val('');
                $("#stock-costPrise").val('');
                $("#stock-bonds").val('100');
                $("#stock-app").val('');
                $("#stock-modal").modal();
            }
        );
        let showImportDataDialog = document.getElementById('showImportDataDialog');
        showImportDataDialog.addEventListener('click',function() {
                $("#data-import-modal").modal();
            }
        );
        let showExportDataDialog = document.getElementById('showExportDataDialog');
        showExportDataDialog.addEventListener('click',function() {
                $("#data-export-modal").modal();
                var data = {};
                data.stocks = stockList;
                data.funds = fundList;
                $("#export-data").val(JSON.stringify(data));
            }
        );

        let dataImportButton = document.getElementById('data-import-button');
        dataImportButton.addEventListener('click',function() {
                var data = $("#import-data").val();
                var json = jQuery.parseJSON(data);
                localStorage.setItem('stocks',JSON.stringify(json.stocks));
                localStorage.setItem('funds',JSON.stringify(json.funds));
                $("#data-import-modal").modal( "hide" );
                location.reload();
            }
        );
        let fundSaveButton = document.getElementById('fund-save-button');
        fundSaveButton.addEventListener('click',function() {
                var code =$("#fund-code").val();
                var costPrise =$("#fund-costPrise").val();
                var bonds =$("#fund-bonds").val();
                var app = $("#fund-app").val();
                if(code==null||code==''||
                    costPrise==null||costPrise==''||
                    bonds==null||bonds==''||
                    app==null||app==''){
                    alert("请添加必要信息");
                    return;
                }
                var fund = {
                    "fundCode": code,
                    "fundName": "华宝中证医疗ETF",
                    "costPrise": costPrise,
                    "bonds": bonds,
                    "app": app
                }
                var funds = localStorage.getItem('funds');
                if (funds == null) {
                    funds = [];
                } else {
                    funds = jQuery.parseJSON(funds);
                }
                for (var k in funds) {
                    if(funds[k].fundCode == fund.fundCode) {
                        alert("已添加该基金");
                        $("#fund-modal").modal( "hide" );
                        return;
                    }
                }
                if (!checkFundExsit(fund.fundCode)) {
                    alert("不存在该基金");
                    $("#fund-modal").modal( "hide" );
                    return;
                }
                funds.push(fund);
                localStorage.setItem('funds',JSON.stringify(funds));
                $("#fund-modal").modal( "hide" );
                location.reload();
            }
        );
        let stockSaveButton = document.getElementById('stock-save-button');
        stockSaveButton.addEventListener('click',function() {
                var code =$("#stock-code").val();
                var costPrise =$("#stock-costPrise").val();
                var bonds =$("#stock-bonds").val();
                var app = $("#stock-app").val();
                if (code==null||code==''||
                    costPrise==null||costPrise==''||
                    bonds==null||bonds==''||
                    app==null||app=='') {
                    alert("请添加必要信息");
                    return;
                }
                var stock = {
                    "code": code,
                    "costPrise": costPrise,
                    "bonds": bonds,
                    "app": app
                }
                var stocks = localStorage.getItem('stocks');
                if (stocks == null) {
                    stocks = [];
                } else {
                    stocks = jQuery.parseJSON(stocks);
                }
                for (var k in stocks) {
                    if(stocks[k].code == stock.code) {
                        alert("已添加该股票");
                        $("#stock-modal").modal( "hide" );
                        return;
                    }
                }
                if (!checkStockExsit(stock.code)) {
                    alert("不存在该股票");
                    $("#stock-modal").modal( "hide" );
                    return;
                }
                stocks.push(stock);
                localStorage.setItem('stocks',JSON.stringify(stocks));
                $("#stock-modal").modal( "hide" );
                location.reload();
            }
        );
    }
);

function initData() {

    var stockApp = $("#stock-app");
    var fundApp = $("#fund-app");
    stockApp.find('option').remove();
    stockApp.append("<option value=''>请选择</option>");
    for(var k in appList) {
        var opt = $("<option></option>").text(appList[k].name).val(appList[k].code);
        stockApp.append(opt);
    }
    fundApp.find('option').remove();
    fundApp.append("<option value=''>请选择</option>");
    for(var k in appList) {
        var opt = $("<option></option>").text(appList[k].name).val(appList[k].code);
        fundApp.append(opt);
    }

    var stocks = "";
    for(var k in stockList) {
        stocks += stockList[k].code+",";
    }

    $.ajax({
        url:"http://qt.gtimg.cn/q="+stocks,
        type:"get",
        data :{
        },
        dataType:'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var stoksArr = data.split("\n");

            for(var k in stoksArr) {
                for(var l in stockList) {
                    if(stockList[l].code ==stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))){
                        var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                        var values = dataStr.split("~");
                        stockList[l].name = values[1]+"";
                        stockList[l].now = values[3]+"";
                        stockList[l].change = values[31]+"";
                        stockList[l].changePercent = values[32]+"";
                        stockList[l].time = values[30]+"";
                        stockList[l].max = values[33]+"";
                        stockList[l].min = values[34]+"";
                        stockList[l].buyOrSellStockRequestList = [];

                        var now = new BigDecimal(stockList[l].now+"");
                        var costPrise = new BigDecimal(stockList[l].costPrise+"")
                        var incomeDiff = now.add(costPrise.negate());
                        if (costPrise <= 0) {
                            stockList[l].incomePercent = 0 + "";
                        } else {
                            var incomePercent = incomeDiff.divide(costPrise, 5)
                                .multiply(BigDecimal.TEN)
                                .multiply(BigDecimal.TEN)
                                .setScale(3);
                            stockList[l].incomePercent = incomePercent+"";
                        }

                        var bonds = new BigDecimal(stockList[l].bonds);
                        var income = incomeDiff.multiply(bonds)
                            .setScale(2);
                        stockList[l].income = income + "";
                        stockList[l].hide = false;
                    }
                }
            }
            initFund();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

function initFund() {
    for(var l in fundList) {
        var fundCode = fundList[l].fundCode;
        $.ajax({
            url:"http://fundgz.1234567.com.cn/js/"+fundList[l].fundCode+".js",
            type:"get",
            data :{
            },
            async: false,
            dataType:'text',
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
                            fundList[k].gszzl = gsz.subtract(dwjz).divide(gsz).multiply(new BigDecimal("100")).setScale(2) + "";

                            var now = new BigDecimal(json.gsz + "");
                            var costPrice = new BigDecimal(fundList[k].costPrise + "");
                            var incomeDiff = now.add(costPrice.negate());
                            if (costPrice <= 0) {
                                fundList[k].incomePercent = "0";
                            } else {
                                var incomePercent = incomeDiff.divide(costPrice)
                                    .multiply(BigDecimal.TEN)
                                    .multiply(BigDecimal.TEN)
                                    .setScale(3);
                                fundList[k].incomePercent = incomePercent + "";
                            }
                            var bonds = new BigDecimal(fundList[k].bonds + "");
                            var income = incomeDiff.multiply(bonds)
                                .setScale(2);
                            fundList[k].income = income + "";
                        }
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
    }
    initStockAndFundHtml();
}

function getFundBySelfService(fund) {
    // 下面这个地址可以通过本地启动stock-and-fund项目
    // github地址为：https://github.com/bu6030/stock-and-fund
    $.ajax({
        url:"http://127.0.0.1:8080/chrome/fund?fundCode="+ fund.fundCode + "&costPrise=" + fund.costPrise + "&bonds=" + fund.bonds + "&app=" + fund.app,
        type:"get",
        data :{
        },
        async: false,
        dataType:'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            // alert(data.value.fundName+"");
            fund.name = data.value.fundName+"";
            fund.jzrq = data.value.jzrq+"";
            fund.dwjz = data.value.dwjz+"";
            fund.gsz = data.value.gsz+"";
            fund.gszzl = data.value.gszzl+"";
            fund.gztime = data.value.gztime+"";
            fund.incomePercent = data.value.incomePercent+"";
            fund.income = data.value.income+"";
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

function checkFundExsit(code) {
    var checkReuslt = false;
    $.ajax({
        url:"http://fundgz.1234567.com.cn/js/"+code+".js",
        type:"get",
        data :{
        },
        async: false,
        dataType:'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var json = jQuery.parseJSON(data.substring(8, data.length - 2));
            var fund = {};
            fund.name = json.name+"";
            fund.dwjz = json.dwjz+"";
            fund.jzrq = json.jzrq+"";
            fund.gsz = json.gsz+"";
            fund.gztime = json.gztime+"";
            var gsz = new BigDecimal(json.gsz+"");
            var dwjz = new BigDecimal(json.dwjz+"");
            fund.gszzl = gsz.subtract(dwjz).divide(gsz).multiply(new BigDecimal("100")).setScale(2) + "";
            var now = new BigDecimal(json.gsz+"");
            checkReuslt = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
        url:"http://qt.gtimg.cn/q="+code,
        type:"get",
        data :{
        },
        async: false,
        dataType:'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var stoksArr = data.split("\n");

            var dataStr = stoksArr[0].substring(stoksArr[0].indexOf("=") + 2, stoksArr[0].length - 2);
            var values = dataStr.split("~");
            var stock = {};
            stock.name = values[1]+"";
            stock.now = values[3]+"";
            stock.change = values[31]+"";
            stock.changePercent = values[32]+"";
            stock.time = values[30]+"";
            stock.max = values[33]+"";
            stock.min = values[34]+"";
            stock.buyOrSellStockRequestList = [];
            checkReuslt = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return checkReuslt;
}

function initStockAndFundHtml(){
    var marketValue = new BigDecimal("0");
    totalMarketValue = new BigDecimal("0");
    for(var k in stockList){
        marketValue = (new BigDecimal(stockList[k].now)).multiply(new BigDecimal(stockList[k].bonds));
        totalMarketValue = totalMarketValue.add(marketValue);
    }

    for(var k in fundList){
        marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz)).multiply(new BigDecimal(fundList[k].bonds))).toFixed(2));
        totalMarketValue = totalMarketValue.add(marketValue);
    }

    var str1 = getStockTableHtml(stockList, totalMarketValue);
    $("#stock-nr").html(str1);

    var str2 = getFundTableHtml(fundList, totalMarketValue);
    $("#fund-nr").html(str2);
}

function getStockTableHtml(result, totalMarketValueResult){
    var str = "";
    stockTotalIncome = new BigDecimal("0");
    stockDayIncome = new BigDecimal("0");
    stockTotalmarketValue = new BigDecimal("0");
    var dayIncome = new BigDecimal("0");
    var marketValue = new BigDecimal("0");
    var marketValuePercent = new BigDecimal("0");
    for(var k in result) {
        var buyOrSells = result[k].buyOrSellStockRequestList;
        var todayBuyIncom = new BigDecimal("0");
        var todaySellIncom = new BigDecimal("0");
        var maxBuyOrSellBonds = 0;
        for(var l in buyOrSells) {
            // 当天购买过
            if(buyOrSells[l].type == "1") {
                maxBuyOrSellBonds = maxBuyOrSellBonds + buyOrSells[l].bonds;
                console.log("买入价格"+buyOrSells[l].price);
                console.log("当前价格"+result[k].now);
                var buyIncome = (new BigDecimal(result[k].now))
                    .subtract(new BigDecimal(buyOrSells[l].price+""))
                    .multiply(new BigDecimal(buyOrSells[l].bonds+""));
                todayBuyIncom = todayBuyIncom.add(buyIncome);
                console.log("买入收益："+todayBuyIncom);
            }
            // 当天卖出过
            if(buyOrSells[l].type == "2") {
                todaySellIncom = todaySellIncom.add(new BigDecimal(buyOrSells[l].income+""));
                console.log("卖出收益："+todaySellIncom);
            }
        }
        console.log("买卖最大数"+maxBuyOrSellBonds);
        if (maxBuyOrSellBonds < result[k].bonds) {
            var restBonds = (new BigDecimal(result[k].bonds)).subtract(new BigDecimal(maxBuyOrSellBonds+""));
            console.log("剩余股数："+restBonds);
            dayIncome = (new BigDecimal(result[k].change)).multiply(restBonds);
        } else {
            dayIncome = new BigDecimal("0");
        }
        console.log(result[k].name+"计算当日买卖前："+ dayIncome);
        console.log(result[k].name+"计算："+ dayIncome.add(todayBuyIncom).add(todaySellIncom));
        dayIncome = dayIncome.add(todayBuyIncom).add(todaySellIncom);
        console.log(result[k].name+"计算当日买卖后："+ dayIncome);
        marketValue = (new BigDecimal(result[k].now)).multiply(new BigDecimal(result[k].bonds));
        if (totalMarketValueResult.compareTo(new BigDecimal("0")) != 0) {
            marketValuePercent = marketValue.multiply(new BigDecimal("100")).divide(totalMarketValueResult);
        }
        var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome >= 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income >= 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");

        str += "<tr>"
            + "<td><a onclick=\"filterApp('" + result[k].app + "')\">" + getAppName(result[k].app) + "</a>"
            + "</td><td style=\"width: 200px;\">" +result[k].name
            // + "</td><td " + dayIncomeStyle + ">" + result[k].change
            + "</td><td " + dayIncomeStyle + ">" + dayIncome
            + "</td><td " + dayIncomeStyle + ">" + result[k].changePercent +"%"
            + "</td><td>" + result[k].now
            + "</td><td>" + result[k].costPrise
            + "</td><td>" + result[k].bonds
            + "</td><td>" + marketValue
            + "</td><td>" + marketValuePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].incomePercent +"%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].income
            +"</td></tr>";
        stockTotalIncome = stockTotalIncome.add(new BigDecimal(result[k].income));
        stockDayIncome = stockDayIncome.add(dayIncome);
        stockTotalmarketValue = stockTotalmarketValue.add(marketValue);
    }
    var stockDayIncomePercent = new BigDecimal("0");
    var stockTotalIncomePercent = new BigDecimal("0");
    if (stockTotalmarketValue != 0) {
        stockDayIncomePercent = stockDayIncome.multiply(new BigDecimal("100")).divide(stockTotalmarketValue);
        stockTotalIncomePercent = stockTotalIncome.multiply(new BigDecimal("100")).divide(stockTotalmarketValue);
    }
    var stockDayIncomePercentStyle = stockDayIncome == 0 ? "" : (stockDayIncome > 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");
    var stockTotalIncomePercentStyle = stockTotalIncome == 0 ? "" : (stockTotalIncome > 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");
    str += "<tr><td>合计</td><td></td><td " + stockDayIncomePercentStyle + ">" + stockDayIncome + "</td><td " + stockDayIncomePercentStyle + ">" + stockDayIncomePercent + "%</td><td colspan='3'></td><td colspan='2'>" + stockTotalmarketValue + "</td><td " + stockTotalIncomePercentStyle + ">" + stockTotalIncomePercent + "%</td><td " + stockTotalIncomePercentStyle + ">" + stockTotalIncome
        +"</td></tr>";
    return str;
}

function getFundTableHtml(result, totalMarketValueResult){
    var str = "";
    fundTotalIncome = new BigDecimal("0");
    fundDayIncome = new BigDecimal("0");
    fundTotalmarketValue = new BigDecimal("0");
    var dayIncome = new BigDecimal("0");
    var marketValue = new BigDecimal("0");
    var marketValuePercent = new BigDecimal("0");
    for(var k in result) {
        dayIncome = new BigDecimal(parseFloat((new BigDecimal(result[k].gszzl)).multiply((new BigDecimal(result[k].dwjz))).multiply(new BigDecimal(result[k].bonds)).divide(new BigDecimal("100"))).toFixed(2));
        marketValue = new BigDecimal(parseFloat((new BigDecimal(result[k].gsz)).multiply(new BigDecimal(result[k].bonds))).toFixed(2));
        if (totalMarketValueResult.compareTo(new BigDecimal("0")) != 0) {
            marketValuePercent = marketValue.multiply(new BigDecimal("100")).divide(totalMarketValueResult);
        }
        var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome > 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income > 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");

        str += "<tr>"
            + "<td><a onclick=\"filterApp('" + result[k].app + "')\">" + getAppName(result[k].app) + "</a>"
            + "</td><td style=\"width: 200px;\">" +result[k].fundName
            // + "</td><td>"
            + "</td><td " + dayIncomeStyle + ">" + dayIncome
            + "</td><td " + dayIncomeStyle + ">" +result[k].gszzl + "%"
            + "</td><td>" + result[k].gsz
            + "</td><td>" + result[k].costPrise
            + "</td><td>" + result[k].bonds
            + "</td><td>" + marketValue
            + "</td><td>" + marketValuePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].incomePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].income
            +"</td></tr>";
        fundTotalIncome = fundTotalIncome.add(new BigDecimal(result[k].income));
        fundDayIncome = fundDayIncome.add(dayIncome);
        fundTotalmarketValue = fundTotalmarketValue.add(marketValue);
    }
    var fundDayIncomePercent = new BigDecimal("0");
    var fundTotalIncomePercent = new BigDecimal("0");
    if (fundTotalmarketValue != 0) {
        fundDayIncomePercent = fundDayIncome.multiply(new BigDecimal("100")).divide(fundTotalmarketValue);
        fundTotalIncomePercent = fundTotalIncome.multiply(new BigDecimal("100")).divide(fundTotalmarketValue);
    }
    var fundDayIncomePercentStyle = fundDayIncome == 0 ? "" : (fundDayIncome > 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");
    var fundTotalIncomePercentStyle = fundTotalIncome == 0 ? "" : (fundTotalIncome > 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");
    str += "<tr><td>合计</td><td></td><td " + fundDayIncomePercentStyle + ">" + fundDayIncome + "</td><td colspan='2' " + fundDayIncomePercentStyle + ">" + fundDayIncomePercent + "%</td><td colspan='2'></td><td colspan='2'>" + fundTotalmarketValue + "</td><td " + fundTotalIncomePercentStyle + ">" + fundTotalIncomePercent + "%</td><td " + fundTotalIncomePercentStyle + ">" + fundTotalIncome
        +"</td></tr>";

    var allDayIncome = fundDayIncome.add(stockDayIncome);
    var allTotalIncome = fundTotalIncome.add(stockTotalIncome);
    var allDayIncomePercent = new BigDecimal("0");
    var allTotalIncomePercent = new BigDecimal("0");
    if (totalMarketValueResult != 0) {
        allDayIncomePercent = allDayIncome.multiply(new BigDecimal("100")).divide(totalMarketValueResult);
        allTotalIncomePercent = allTotalIncome.multiply(new BigDecimal("100")).divide(totalMarketValueResult);
    }
    var allDayIncomePercentStyle = allDayIncome == 0 ? "" : (allDayIncome > 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");
    var allTotalIncomePercentStyle = allTotalIncome == 0 ? "" : (allTotalIncome > 0?"style=\"color:#c12e2a\"":"style=\"color:#3e8f3e\"");

    str += "<tr><td>汇总合计</td><td></td><td " + allDayIncomePercentStyle + ">" + allDayIncome + "</td><td colspan='2' " + allDayIncomePercentStyle + ">" + allDayIncomePercent + "%</td><td colspan='2'></td><td colspan='2'>" + totalMarketValueResult + "</td><td " + allTotalIncomePercentStyle + ">" + allTotalIncomePercent + "%</td><td " + allTotalIncomePercentStyle + ">" + allTotalIncome
        +"</td></tr>";

    return str;
}

function getAppName(app){
    for(var k in appList) {
        if(app == appList[k].code){
            return appList[k].name;
        }
    }
    return app;
}

function filterApp(app) {
    filteredApp = app;
    getData();
}

function enableFilterHideChanged() {
    initData();
}