var stockTotalIncome;
var fundTotalIncome;
var stockDayIncome;
var fundDayIncome;
var stockTotalmarketValue;
var fundTotalmarketValue;
var stockTotalCostValue;
var fundTotalCostValue;
var totalMarketValue;
var fundList;
var stockList;
var blueColor = '#3e8f3e';
var redColor = '#c12e2a';
var cheatMeFlag = false;
var showStockOrFundOrAll = 'all';
var windowSize = 'NORMAL'; // 窗口大小
var marketValueDisplay = 'DISPLAY';
var marketValuePercentDisplay = 'DISPLAY';
var costPriceDisplay = 'DISPLAY';
var incomePercentDisplay = 'DISPLAY';
var addtimePriceDisplay = 'DISPLAY';

// 整个程序的初始化
window.addEventListener("load", async (event) => {
    let password = await readCacheData('password');
    // 如果 password 存在，需要验证密码
    if (password != null && password != '') {
        // 展示password-check-modal
        $('#password-check-modal').modal('show');
        // 隐藏密码保护按钮
        $("#show-password-protect-button")[0].style.display = 'none';
        $("#data-export-button")[0].style.display = 'none';
        $("#import-from-local-springboot")[0].style.display = 'none';
    } else {
        // 没有密码直接展示
        initLoad();
    }
});

// 初始化加载基金股票，各种开关缓存
async function initLoad() {
    blueColor = await readCacheData('blueColor');
    if (blueColor == null) {
        blueColor = '#3e8f3e';
    }
    redColor = await readCacheData('redColor');
    if (redColor == null) {
        redColor = '#c12e2a';
    }
    cheatMeFlag = await readCacheData('cheatMeFlag');
    if (cheatMeFlag == null) {
        cheatMeFlag = false;
    } else if(cheatMeFlag == "true") {
        cheatMeFlag = true;
    } else {
        cheatMeFlag = false;
    }
    showStockOrFundOrAll = await readCacheData('showStockOrFundOrAll');
    if (showStockOrFundOrAll == null) {
        showStockOrFundOrAll = 'all';
    }
    windowSize = await readCacheData('window-size');
    if (windowSize == null) {
        windowSize = 'NORMAL';
    }
    marketValueDisplay = await readCacheData('market-value-display');
    if (marketValueDisplay == null || marketValueDisplay == 'DISPLAY') {
        marketValueDisplay = 'DISPLAY';
        $("#market-value-display-checkbox").prop("checked", true);
    } else {
        marketValueDisplay = 'HIDDEN';
        $("#market-value-display-checkbox").prop("checked", false);
    }
    marketValuePercentDisplay = await readCacheData('market-value-percent-display');
    if (marketValuePercentDisplay == null || marketValuePercentDisplay == 'DISPLAY') {
        marketValuePercentDisplay = 'DISPLAY';
        $("#market-value-percent-display-checkbox").prop("checked", true);
    } else {
        marketValuePercentDisplay = 'HIDDEN';
        $("#market-value-percent-display-checkbox").prop("checked", false);
    }
    costPriceDisplay = await readCacheData('cost-price-display');
    if (costPriceDisplay == null || costPriceDisplay == 'DISPLAY') {
        costPriceDisplay = 'DISPLAY';
        $("#cost-price-display-checkbox").prop("checked", true);
    } else {
        costPriceDisplay = 'HIDDEN';
        $("#cost-price-display-checkbox").prop("checked", false);
    }
    incomePercentDisplay = await readCacheData('income-percent-display');
    if (incomePercentDisplay == null || incomePercentDisplay == 'DISPLAY') {
        incomePercentDisplay = 'DISPLAY';
        $("#income-percent-display-checkbox").prop("checked", true);
    } else {
        incomePercentDisplay = 'HIDDEN';
        $("#income-percent-display-checkbox").prop("checked", false);
    }
    addtimePriceDisplay = await readCacheData('addtime-price-display');
    if (addtimePriceDisplay == null || addtimePriceDisplay == 'DISPLAY') {
        addtimePriceDisplay = 'DISPLAY';
        $("#addtime-price-display-checkbox").prop("checked", true);
    } else {
        addtimePriceDisplay = 'HIDDEN';
        $("#addtime-price-display-checkboxx").prop("checked", false);
    }
    var funds = await readCacheData('funds');
    if (funds == null) {
        fundList = [];
    } else {
        fundList = jQuery.parseJSON(funds);
    }

    var stocks = await readCacheData('stocks');
    if (stocks == null) {
        stockList = [];
    } else {
        stockList = jQuery.parseJSON(stocks);
    }
    // 展示密码保护按钮
    $("#show-password-protect-button")[0].style.display = 'inline';
    $("#data-export-button")[0].style.display = 'inline';
    initHtml();
    initData();
    initLargeMarketData();
    // 20s刷新
    setInterval(autoRefresh, 20000);
}

// 20s自动刷新
function autoRefresh() {
    var date = new Date();
    if (isTradingTime(date)) {
        initData();
        initLargeMarketData();
    }
}

// 初始化 Html 页面
async function initHtml() {
    if (develop) {
        document.getElementById('import-from-local-springboot').classList.remove('fade');
    }
    // 股票标题
    var stockHead = " <tr > " +
        " <th >股票名称</th> " +
        " <th >当日盈利</th> " +
        " <th >涨跌幅</th> " +
        " <th >当前价</th> " +
        " <th >成本价</th> " +
        " <th >持仓</th> " +
        (marketValueDisplay == 'DISPLAY' ? " <th >市值/金额</th> " : "") + 
        (marketValuePercentDisplay == 'DISPLAY' ? " <th >持仓占比</th> " : "") + 
        (costPriceDisplay == 'DISPLAY' ? " <th >成本</th> " : "") + 
        (incomePercentDisplay == 'DISPLAY' ? " <th >收益率</th> " : "") + 
        " <th >收益</th> " +
        (addtimePriceDisplay == 'DISPLAY' ? " <th >自选价格</th> " : "") + 
        " </tr>";
    // 基金标题
    var fundHead = " <tr >" +
        " <th >基金名称</th>" +
        " <th >当日盈利</th>" +
        " <th >涨跌幅</th>" +
        " <th >估算净值</th>" +
        " <th >持仓成本</th>" +
        " <th >持有份额</th>" +
        (marketValueDisplay == 'DISPLAY' ? " <th >市值/金额</th> " : "") + 
        (marketValuePercentDisplay == 'DISPLAY' ? " <th >持仓占比</th> " : "") + 
        (costPriceDisplay == 'DISPLAY' ? " <th >成本</th> " : "") + 
        (incomePercentDisplay == 'DISPLAY' ? " <th >收益率</th> " : "") + 
        " <th >收益</th> " +
        (addtimePriceDisplay == 'DISPLAY' ? " <th >自选价格</th> " : "") + 
        " </tr>";
    // 持仓明细标题
    var fundInversPositionHead = " <tr >" +
        " <th >股票名称（代码）</th>" +
        " <th >价格</th>" +
        " <th >涨跌幅</th>" +
        " <th >持仓占比</th>"
        " </tr>";
    $("#fund-invers-position-head").html(fundInversPositionHead);
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        $("#fund-head").html(fundHead);
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        $("#stock-head").html(stockHead);
    }
    // 在页面顶部显示一些监控信息，重要信息
    // initNotice();
    initFontStyle();
}

// 按钮监听事件
document.addEventListener(
    'DOMContentLoaded',
    function () {
        // 首页，导入数据按钮点击展示导入数据页面
        document.getElementById('show-import-data').addEventListener('click', showImportData);
        // 首页，导出数据按钮点击展导出 txt 文件
        document.getElementById('data-export-button').addEventListener('click', dataExport);
        // 导入数据页面，导入文件选择 txt 文件导入数据
        document.getElementById('file-input').addEventListener('change', fileInput);
        // 基金编辑页面，点击保存按钮
        document.getElementById('fund-save-button').addEventListener('click', function () {
            saveFund();
        });
        // 股票编辑页面，点击保存按钮
        document.getElementById('stock-save-button').addEventListener('click', function () {
            saveStock();
        });
        // 首页，自己开发时方便从 SpringBoot 项目直接导入数据
        if (develop) {
            document.getElementById('import-from-local-springboot').addEventListener('click', function () {
                let result = ajaxGetStockAndFundFromLocalService();
                if (result != null && result != '' && result != undefined) {
                    saveCacheData('stocks', JSON.stringify(result.stocks));
                    saveCacheData('funds', JSON.stringify(result.funds));
                    location.reload();
                }
            });
        }
        // 股票编辑页面，点击删除按钮
        document.getElementById('stock-delete-button').addEventListener('click', async function () {
            var stocks = await readCacheData('stocks');
            stocks = jQuery.parseJSON(stocks);
            var code = $("#stock-code").val();
            for (var k in stocks) {
                if (stocks[k].code == code) {
                    // delete stocks[k];
                    stocks.splice(k, 1)
                    break;
                }
            }
            saveCacheData('stocks', JSON.stringify(stocks));
            $("#stock-modal").modal("hide");
            location.reload();
        });
        // 基金编辑页面，点击删除按钮
        document.getElementById('fund-delete-button').addEventListener('click', async function () {
            var funds = await readCacheData('funds');
            funds = jQuery.parseJSON(funds);
            var code = $("#fund-code").val();
            for (var k in funds) {
                if (funds[k].fundCode == code) {
                    funds.splice(k, 1)
                    break;
                }
            }
            saveCacheData('funds', JSON.stringify(funds));
            $("#fund-modal").modal("hide");
            location.reload();
        });
        // 走势图页面，点击股票基金按钮
        document.getElementById('stock-fund-delete-button').addEventListener('click', async function () {
            if (timeImageType == "FUND") {
                var funds = await readCacheData('funds');
                funds = jQuery.parseJSON(funds);
                for (var k in funds) {
                    if (funds[k].fundCode == timeImageCode) {
                        // delete funds[k];
                        funds.splice(k, 1)
                        break;
                    }
                }
                saveCacheData('funds', JSON.stringify(funds));
                $("#time-image-modal").modal("hide");
                location.reload();
            } else {
                var stocks = await readCacheData('stocks');
                stocks = jQuery.parseJSON(stocks);
                for (var k in stocks) {
                    if (stocks[k].code == timeImageCode) {
                        // delete stocks[k];
                        stocks.splice(k, 1)
                        break;
                    }
                }
                saveCacheData('stocks', JSON.stringify(stocks));
                $("#time-image-modal").modal("hide");
                location.reload();
            }
        });
        // 基金编辑页面，点击走势图按钮
        document.getElementById('fund-show-time-image-button').addEventListener('click', function () {
            let fundCode = $("#fund-code").val();
            timeImageCode = fundCode;
            timeImageType = "FUND";
            showMinuteImage();
        });
        // 股票编辑页面，点击走势图按钮
        document.getElementById('stock-show-time-image-button').addEventListener('click', function () {
            let stockCode = $("#stock-code").val();
            timeImageCode = stockCode;
            timeImageType = "STOCK";
            showMinuteImage();
        });
        // 走势图页面，点击分时图按钮
        document.getElementById('time-image-minute-button').addEventListener('click', function () {
            showMinuteImage();
        });
        // 走势图页面，日线图按钮点击
        document.getElementById('time-image-day-button').addEventListener('click', function () {
            showDayImage();
        });
        // 走势图页面，周线图按钮点击
        document.getElementById('time-image-week-button').addEventListener('click', function () {
            showWeekImage();
        });
        // 走势图页面，月线图按钮点击
        document.getElementById('time-image-month-button').addEventListener('click', function () {
            showMonthImage();
        });
        // 首页，清理数据按钮点击
        document.getElementById('remove-all-data-button').addEventListener('click', removeAllData);
        // 首页，在股票搜索名称输入框中点击回车
        document.getElementById('input-stock-name-search').addEventListener('keydown', async function () {
            if (event.key === 'Enter') {
                searchFundAndStock();
            }
        });
        // 首页，在基金搜索名称输入框中点击回车
        document.getElementById('input-fund-name-search').addEventListener('keydown', async function () {
            if (event.key === 'Enter') {
                searchFundAndStock();
            }
        });
        // 首页，输入股票名称后点击搜索股票/基金按钮
        document.getElementById('stock-fund-name-search-button').addEventListener('click', async function () {
            searchFundAndStock();
        });
        // 搜索股票页面，股票列表点击选择
        document.getElementById('search-stock-select').addEventListener('change', function () {
            let stockCode = $("#search-stock-select").val();
            $("#stock-code").val(stockCode);
            $("#stock-name").val('');
            saveStock();
        });
        // 搜索基金页面，基金列表点击选择
        document.getElementById('search-fund-select').addEventListener('change', function () {
            let fundCode = $("#search-fund-select").val();
            $("#fund-code").val(fundCode);
            $("#fund-name").val('');
            saveFund();
        });
        // 首页，使用说明按钮点击
        document.getElementById('help-document-button').addEventListener('click', helpDocument);
        document.getElementById('help-document-alert').addEventListener('click', helpDocument);
        // 走势图页面，点击编辑按钮
        document.getElementById('update-stock-fund-button').addEventListener('click', function () {
            $("#time-image-modal").modal("hide");
            if (timeImageType == "FUND") {
                $("#fund-modal").modal();
            } else {
                $("#stock-modal").modal();
            }
        });
        // 首页，点击加入微信群
        document.getElementById('show-wechat-group-button').addEventListener('click', function () {
            let timestamp = Date.now();
            let path = Env.WECHAT_GROUP_QR_CODE + "?date=" + timestamp;
            $("#wechat-group-qr-code-image").html('<img src="' + path + '" width="60%" length="60%" />');
            $("#wechat-group-modal").modal();
        });
        // 首页，点击全屏按钮
        document.getElementById('full-screen-button').addEventListener('click', fullScreen);
        document.getElementById('full-screen-button-2').addEventListener('click', fullScreen);
        // 首页，点击样式切换
        document.getElementById('font-change-button').addEventListener('click', changeFontStyle);
        document.getElementById('font-change-button-2').addEventListener('click', changeFontStyle);
        // 首页，show-passwrod-protect-button点击，展示password-protect-modal
        document.getElementById('show-password-protect-button').addEventListener('click', showPasswordProtect);
        document.getElementById('show-password-protect-button-2').addEventListener('click', showPasswordProtect);
        // 密码保护页面，password-save-button点击，缓存密码
        document.getElementById('password-save-button').addEventListener('click', async function () {
            saveCacheData('password', $("#password").val());
            $("#password-protect-modal").modal("hide");
        });
        // 验证密码页面，password-check-button点击，验证密码
        document.getElementById('password-check-button').addEventListener('click', async function () {
            if ($("#password-check").val() == await readCacheData('password')) {
                $("#password-check-modal").modal("hide");
                initLoad();
            }
        });
        // 首页，点击展示隐藏迷你分时图
        document.getElementById('show-minute-image-mini').addEventListener('click', setMinuteImageMini);
        document.getElementById('show-minute-image-mini-2').addEventListener('click', setMinuteImageMini);
        // 首页，点击刷新按钮
        document.getElementById('refresh-button').addEventListener('click', async function () {
            initData();
        });
        // 设置页面，点击颜色切换按钮
        document.getElementById('change-blue-red-button').addEventListener('click', async function () {
            $("#setting-modal").modal("hide");
            changeBlueRed();
        });
        // 设置页面，点击忽悠自己按钮
        document.getElementById('cheat-me-button').addEventListener('click', async function () {
            $("#setting-modal").modal("hide");
            cheatMe();
        });
        // 首页，点击设置按钮
        document.getElementById('show-setting-button').addEventListener('click', async function () {
            $("#setting-modal").modal();
        });
        // 首页，底部全部按钮，股票基金全部显示
        document.getElementById('show-all-button').addEventListener('click', async function () {
            changeShowStockOrFundOrAll('all');
        });
        // 首页，底部股票按钮，只展示股票
        document.getElementById('show-stock-button').addEventListener('click', async function () {
            changeShowStockOrFundOrAll('stock');
        });
        // 首页，底部基金按钮，只展示基金
        document.getElementById('show-fund-button').addEventListener('click', async function () {
            changeShowStockOrFundOrAll('fund');
        });
        // 分时图页面，点击监控股票价格
        document.getElementById('stock-fund-monitor-button').addEventListener('click', stockMonitor);
        // 股票编辑页面，点击监控股票价格
        document.getElementById('stock-monitor-button').addEventListener('click', stockMonitor);
        // 首页，点击清除角标
        document.getElementById('remove-badgetext-button').addEventListener('click', removeBadgeText);
        // 分时图页面，股票/基金编辑页面，点击查看持仓明细
        document.getElementById('fund-invers-position-button-1').addEventListener('click', getFundInversPosition);
        document.getElementById('fund-invers-position-button-2').addEventListener('click', getFundInversPosition);
        document.getElementById('fund-invers-position-button-3').addEventListener('click', getFundInversPosition);
        // 分时图页面，股票/基金编辑页面，点击查看历史净值
        document.getElementById('fund-net-diagram-button-3').addEventListener('click', async function () {
            setFundNetDiagram('MONTH');
        });
        // 历史净值页面，点击月
        document.getElementById('fund-net-diagram-month-button').addEventListener('click',  async function () {
            setFundNetDiagram('MONTH');
        });
        // 历史净值页面，点击季
        document.getElementById('fund-net-diagram-3month-button').addEventListener('click',  async function () {
            setFundNetDiagram('3MONTH');
        });
        // 历史净值页面，点击半年
        document.getElementById('fund-net-diagram-6month-button').addEventListener('click',  async function () {
            setFundNetDiagram('6MONTH');
        });
        // 历史净值页面，点击年
        document.getElementById('fund-net-diagram-year-button').addEventListener('click',  async function () {
            setFundNetDiagram('YEAR');
        });
        // 历史净值页面，点击三年
        document.getElementById('fund-net-diagram-3year-button').addEventListener('click',  async function () {
            setFundNetDiagram('3YEAR');
        });
        // 历史净值页面，点击五年
        document.getElementById('fund-net-diagram-5year-button').addEventListener('click',  async function () {
            setFundNetDiagram('5YEAR');
        });
        // 历史净值页面，点击上市以来
        document.getElementById('fund-net-diagram-allyear-button').addEventListener('click',  async function () {
            setFundNetDiagram('ALLYEAR');
        });
        // 设置页面，页面大小按钮点击
        document.getElementById('window-size-change-button').addEventListener('click',  changeWindowSize);
        // 设置页面，隐藏/展示页面展示项，市值/金额
        document.getElementById("market-value-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，持仓占比
        document.getElementById("market-value-percent-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，成本
        document.getElementById("cost-price-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，收益率
        document.getElementById("income-percent-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，自选价格
        document.getElementById("addtime-price-display-checkbox").addEventListener('change', setDisplayTr);
    }
);

// 股票搜索后，接口返回为 unicode 编码，转换为中文
function A2U(str) {
    return unescape(str.replace(/\\u/gi, '%u'));
}

// 初始化首页股票列表数据
function initData() {
    initFirstInstall();
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        var stocks = "";
        for (var k in stockList) {
            stocks += stockList[k].code + ",";
        }
        let result = ajaxGetStockFromGtimg(stocks);
        var stoksArr = result.split("\n");
        for (var k in stoksArr) {
            for (var l in stockList) {
                if (stockList[l].code == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))) {
                    var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                    var values = dataStr.split("~");
                    stockList[l].name = values[1] + "";
                    stockList[l].now = values[3] + "";
                    if (cheatMeFlag && parseFloat(values[31]) < 0) {
                        var change = 0 - parseFloat(values[31]);
                        var changePercent = 0 - parseFloat(values[32]);
                        stockList[l].change = change + "";
                        stockList[l].changePercent = changePercent + "";
                    } else {
                        stockList[l].change = values[31] + "";
                        stockList[l].changePercent = values[32] + "";
                    }

                    stockList[l].time = values[30] + "";
                    stockList[l].max = values[33] + "";
                    stockList[l].min = values[34] + "";
                    // stockList[l].buyOrSellStockRequestList = [];

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
    }
    initFund();
}

// 初始化首页基金列表数据
function initFund() {
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        for (var l in fundList) {
            var fundCode = fundList[l].fundCode;
            let result = ajaxGetFundFromTiantianjijin(fundList[l].fundCode);
            if (result == "" || result == null || result == undefined) {
                // 有些基金找不到接口会报 404 报错，调用另外一个接口
                for (var k in fundList) {
                    if (fundList[k].fundCode == fundCode) {
                        let fund = checkFundExsitFromEastMoney(fundCode);
                        fundList[k].dwjz = fund.dwjz;
                        fundList[k].gsz = fund.dwjz;
                        fundList[k].gszzl = fund.gszzl;
                        fundList[k].income = "0";
                        fundList[k].incomePercent = "0";
                        fundList[k].name = fund.name;
                        var costPrice = new BigDecimal(fundList[k].costPrise + "");
                        var now = new BigDecimal(fund.dwjz + "");
                        var incomeDiff = now.add(costPrice.negate());
                        if (costPrice <= 0) {
                            fundList[k].incomePercent = "0";
                        } else {
                            let incomePercent = incomeDiff.divide(costPrice, 8, MathContext.ROUND_HALF_UP)
                                .multiply(BigDecimal.TEN)
                                .multiply(BigDecimal.TEN)
                                .setScale(3, MathContext.ROUND_HALF_UP);
                            let bonds = new BigDecimal(fundList[k].bonds + "");
                            let income = incomeDiff.multiply(bonds)
                                .setScale(2, MathContext.ROUND_HALF_UP);
                            fundList[k].income = income + "";
                            fundList[k].incomePercent = incomePercent + "";
                        }
                    }
                }
            } else {
                for (var k in fundList) {
                    if (fundList[k].fundCode == fundCode) {
                        if (result != "jsonpgz();") {
                            var json = jQuery.parseJSON(result.substring(8, result.length - 2));
                            fundList[k].name = json.name + "";
                            fundList[k].dwjz = json.dwjz + "";
                            fundList[k].jzrq = json.jzrq + "";
                            fundList[k].gsz = json.gsz + "";
                            fundList[k].gztime = json.gztime + "";
                            var gsz = new BigDecimal(json.gsz + "");
                            var dwjz = new BigDecimal(json.dwjz + "");

                            if (cheatMeFlag && parseFloat(json.gszzl) < 0) {
                                var gszzl = 0 - parseFloat(json.gszzl);
                                fundList[k].gszzl = gszzl + "";
                            } else {
                                fundList[k].gszzl = json.gszzl + "";
                            }

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
                        } else {
                            let fund = checkFundExsitFromEastMoney(fundCode);
                            fundList[k].dwjz = fund.dwjz;
                            fundList[k].gsz = fund.dwjz;
                            fundList[k].gszzl = "0";
                            fundList[k].income = "0";
                            fundList[k].incomePercent = "0";
                            fundList[k].name = fund.name;
                            var costPrice = new BigDecimal(fundList[k].costPrise + "");
                            var now = new BigDecimal(fund.dwjz + "");
                            var incomeDiff = now.add(costPrice.negate());
                            if (costPrice <= 0) {
                                fundList[k].incomePercent = "0";
                            } else {
                                let incomePercent = incomeDiff.divide(costPrice, 8, MathContext.ROUND_HALF_UP)
                                    .multiply(BigDecimal.TEN)
                                    .multiply(BigDecimal.TEN)
                                    .setScale(3, MathContext.ROUND_HALF_UP);
                                let bonds = new BigDecimal(fundList[k].bonds + "");
                                let income = incomeDiff.multiply(bonds)
                                    .setScale(2, MathContext.ROUND_HALF_UP);
                                fundList[k].income = income + "";
                                fundList[k].incomePercent = incomePercent + "";
                            }

                        }
                    }
                }
            }
        }
    }
    initStockAndFundHtml();
}

// 检查基金是否存在
function checkFundExsit(code) {
    var fund = {};
    let result = ajaxGetFundFromTiantianjijin(code);
    if (result == "" || result == null || result == undefined || result == "jsonpgz();") {
        fund.checkReuslt = false;
    } else {
        var json = jQuery.parseJSON(result.substring(8, result.length - 2));
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
    }
    return fund;
}

// 调用接口或缓存检查基金是否存在
function checkFundExsitFromEastMoney(code) {
    let fund = ajaxGetFundFromEastMoney(code);
    if (fund.name != '' && fund.name != undefined) {
        fund.checkReuslt = true;
    } else {
        fund.checkReuslt = false;
    }
    return fund;
}

// 检查股票是否存在
function checkStockExsit(code) {
    let stock = {};
    let result = ajaxGetStockFromGtimg(code);
    let stoksArr = result.split("\n");
    let dataStr = stoksArr[0].substring(stoksArr[0].indexOf("=") + 2, stoksArr[0].length - 2);
    let values = dataStr.split("~");
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
    } else {
        stock.checkReuslt = false;
    }
    return stock;
}

// 股票基金列表获取完毕后，初始化 html 页面
async function initStockAndFundHtml() {
    var marketValue = new BigDecimal("0");
    totalMarketValue = new BigDecimal("0");
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        for (var k = stockList.length - 1; k >= 0; k--) {
            marketValue = (new BigDecimal(stockList[k].now)).multiply(new BigDecimal(stockList[k].bonds));
            totalMarketValue = totalMarketValue.add(marketValue);
        }
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        for (var k = fundList.length - 1; k >= 0; k--) {
            marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz + "")).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
            totalMarketValue = totalMarketValue.add(marketValue);
        }
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        var str1 = await getStockTableHtml(stockList, totalMarketValue);
        $("#stock-nr").html(str1);
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        var str2 = await getFundTableHtml(fundList, totalMarketValue);
        $("#fund-nr").html(str2);
    }
    if (showStockOrFundOrAll == 'all') {
        var str3 = await getTotalTableHtml(totalMarketValue);
        $("#total-nr").html(str3);
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        for (k in stockList) {
            let stockTr = document.getElementById('stock-tr-' + k);
            stockTr.addEventListener('click', function () {
                $("#stock-name").val(stockList[this.sectionRowIndex].name);
                $("#stock-name").attr("disabled", "disabled");
                $("#stock-code").val(stockList[this.sectionRowIndex].code);
                $("#stock-costPrise").val(stockList[this.sectionRowIndex].costPrise);
                $("#stock-bonds").val(stockList[this.sectionRowIndex].bonds);
                $("#stock-monitor-high-price").val(stockList[this.sectionRowIndex].monitorHighPrice);
                $("#stock-monitor-low-price").val(stockList[this.sectionRowIndex].monitorLowPrice);
                $("#stock-show-time-image-button")[0].style.display = 'inline';
                $("#stock-fund-delete-button")[0].style.display = 'inline';
                $("#stock-fund-monitor-button")[0].style.display = 'inline';
                if ((stockList[this.sectionRowIndex].code + "").includes('sh5') || (stockList[this.sectionRowIndex].code + "").includes('sz5') ||
                (stockList[this.sectionRowIndex].code + "").includes('sz1') || (stockList[this.sectionRowIndex].code + "").includes('sh1')) {
                    $("#fund-invers-position-button-3")[0].style.display = 'inline';
                    $("#fund-invers-position-button-2")[0].style.display = 'inline';
                    $("#fund-invers-position-button-1")[0].style.display = 'inline';
                    $("#fund-net-diagram-button-3")[0].style.display = 'inline';
                    $("#fund-net-diagram-button-2")[0].style.display = 'inline';
                    $("#fund-net-diagram-button-1")[0].style.display = 'inline';
                } else {
                    $("#fund-invers-position-button-3")[0].style.display = 'none';
                    $("#fund-invers-position-button-2")[0].style.display = 'none';
                    $("#fund-invers-position-button-1")[0].style.display = 'none';
                    $("#fund-net-diagram-button-3")[0].style.display = 'none';
                    $("#fund-net-diagram-button-2")[0].style.display = 'none';
                    $("#fund-net-diagram-button-1")[0].style.display = 'none';
                }
                let stockCode = $("#stock-code").val();
                if (stockCode.startsWith("us") || stockCode.startsWith("US") ||
                    stockCode.startsWith("hk") || stockCode.startsWith("HK")) {
                    $("#stock-show-time-image-button")[0].style.display = 'none';
                } else {
                    $("#stock-show-time-image-button")[0].style.display = 'inline';
                }
                
                timeImageCode = stockCode;
                timeImageType = "STOCK";
                showMinuteImage();
            });
        }
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        for (k in fundList) {
            let fundTr = document.getElementById('fund-tr-' + k);
            fundTr.addEventListener('click', function () {
                $("#fund-name").val(fundList[this.sectionRowIndex].name);
                $("#fund-name").attr("disabled", "disabled");
                $("#fund-code").val(fundList[this.sectionRowIndex].fundCode);
                $("#fund-costPrise").val(fundList[this.sectionRowIndex].costPrise);
                $("#fund-bonds").val(fundList[this.sectionRowIndex].bonds);
                if (isCycleInvest) {
                    $("#fund-cycle-invest-type").val(fundList[this.sectionRowIndex].fundCycleInvestType);
                    $("#fund-cycle-invest-date").val(fundList[this.sectionRowIndex].fundCycleInvestDate);
                    $("#fund-cycle-invest-value").val(fundList[this.sectionRowIndex].fundCycleInvestValue);
                    $("#fund-cycle-invest-rate").val(fundList[this.sectionRowIndex].fundCycleInvestRate);
                    $("#fund-cycle-invest")[0].style.display = "block";
                } else {
                    $("#fund-cycle-invest")[0].style.display = "none";
                }
                $("#fund-show-time-image-button")[0].style.display = 'inline';
                $("#stock-fund-delete-button")[0].style.display = 'inline';
                $("#stock-fund-monitor-button")[0].style.display = 'none';
                $("#fund-invers-position-button-3")[0].style.display = 'inline';
                $("#fund-net-diagram-button-3")[0].style.display = 'inline';
                let fundCode = $("#fund-code").val();
                timeImageCode = fundCode;
                timeImageType = "FUND";
                showMinuteImage();
            });
        }
    }

    // 初始化迷你走势图
    let showMinuteImageMini = await readCacheData('show-minute-image-mini');
    if (showMinuteImageMini == 'open') {
        if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
            setStockMinitesImageMini();
        }
        if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
            setFundMinitesImageMini();
        }
    }
}

// 拼接股票 html
async function getStockTableHtml(result, totalMarketValueResult) {
    var str = "";
    stockTotalIncome = new BigDecimal("0");
    stockDayIncome = new BigDecimal("0");
    stockTotalmarketValue = new BigDecimal("0");
    stockTotalCostValue = new BigDecimal("0");
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
        let changePercent = parseFloat(result[k].changePercent);
        var dayIncomeStyle = changePercent == 0 ? "" : (changePercent > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income >= 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
        let addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" + result[k].addTime + ")";
        // 计算股票总成本
        var costPrice = new BigDecimal(result[k].costPrise + "");
        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(result[k].bonds))).toFixed(2));
        stockTotalCostValue = stockTotalCostValue.add(costPriceValue);
        
        let showMinuteImageMini = await readCacheData('show-minute-image-mini');
        let minuteImageMiniDiv = "";
        if (showMinuteImageMini == 'open') {
            minuteImageMiniDiv  = "<div id=\"minute-image-mini-" + result[k].code + "\" class=\"my-echart\"></div>"
        }
        let nowTimestamp = Date.now();
        let monitorAlertDate = result[k].monitorAlertDate;
        let alertStyle = "";
        if ((nowTimestamp - monitorAlertDate) <= Env.TIME_CACHED_ONE_DAY) {
            if (result[k].monitorAlert == '1') {
                alertStyle = "<span style=\"color: " + redColor + "; font-weight: bold\">(涨破最高价格提醒" + result[k].monitorHighPrice + ")</span>";
            } else if(result[k].monitorAlert == '2') {
                alertStyle = "<span style=\"color: " + blueColor + "; font-weight: bold\">(跌破最低价格提醒" + result[k].monitorLowPrice + ")</span>";
            }
        }
        let stockName = result[k].name;
        if (result[k].code.startsWith('us') || result[k].code.startsWith('US')) {
            stockName = result[k].name + "(美股)";
        }
        if (result[k].code.startsWith('hk') || result[k].code.startsWith('HK')) {
            stockName = result[k].name + "(港股)";
        }
        str += "<tr id=\"stock-tr-" + k + "\">"
            + "<td>" + stockName + alertStyle + minuteImageMiniDiv + "</td>"
            + "<td " + dayIncomeStyle + ">" + dayIncome.setScale(2)
            + "<td " + dayIncomeStyle + ">" + result[k].changePercent + "%" + "</td>"
            + "<td>" + result[k].now + "</td>"
            + "<td>" + result[k].costPrise + "</td>"
            + "<td>" + result[k].bonds + "</td>"
            + (marketValueDisplay == 'DISPLAY' ? "<td>" + marketValue.setScale(2) + "</td>" : "")
            + (marketValuePercentDisplay == 'DISPLAY' ? "<td>" + marketValuePercent + "%</td>" : "")
            + (costPriceDisplay == 'DISPLAY' ? "<td>" + costPriceValue + "</td>" : "")
            + (incomePercentDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].incomePercent + "%</td>" : "")
            + "<td " + totalIncomeStyle + ">" + result[k].income + "</td>"
            + (addtimePriceDisplay == 'DISPLAY' ? "<td >" + addTimePrice + "</td>" : "")
            + "</tr>";
        stockTotalIncome = stockTotalIncome.add(new BigDecimal(result[k].income));
        stockDayIncome = stockDayIncome.add(dayIncome);
        stockTotalmarketValue = stockTotalmarketValue.add(marketValue);
    }
    var stockDayIncomePercent = new BigDecimal("0");
    var stockTotalIncomePercent = new BigDecimal("0");
    if (stockTotalmarketValue > 0) {
        stockDayIncomePercent = stockDayIncome.multiply(new BigDecimal("100")).divide(stockTotalmarketValue.subtract(stockDayIncome), 4);
    }
    if (stockTotalCostValue > 0) {
        stockTotalIncomePercent = stockTotalIncome.multiply(new BigDecimal("100")).divide(stockTotalCostValue, 4);
    }
    var stockDayIncomePercentStyle = stockDayIncome == 0 ? "" : (stockDayIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    var stockTotalIncomePercentStyle = stockTotalIncome == 0 ? "" : (stockTotalIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    str += "<tr>" +
        + "<td>合计</td>"
        + "<td " + stockDayIncomePercentStyle + ">" + stockDayIncome.setScale(2) + "</td>"
        + "<td " + stockDayIncomePercentStyle + ">" + stockDayIncomePercent.setScale(2, 4) + "%</td>"
        + "<td colspan='3'></td>"
        + (marketValueDisplay == 'DISPLAY' ? "<td>" + stockTotalmarketValue.setScale(2) + "</td>" : "") 
        + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
        + (costPriceDisplay == 'DISPLAY' ? "<td>" + stockTotalCostValue + "</td>" : "") 
        + (incomePercentDisplay == 'DISPLAY' ? "<td " + stockTotalIncomePercentStyle + ">" + stockTotalIncomePercent + "%</td>" : "") 
        + "<td " + stockTotalIncomePercentStyle + ">" + stockTotalIncome + "</td>" +
        + (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
        + "</tr>";
    return str;
}

// 拼接基金 html
async function getFundTableHtml(result, totalMarketValueResult) {
    var str = "";
    fundTotalIncome = new BigDecimal("0");
    fundDayIncome = new BigDecimal("0");
    fundTotalmarketValue = new BigDecimal("0");
    fundTotalCostValue = new BigDecimal("0");
    var dayIncome = new BigDecimal("0");
    var marketValue = new BigDecimal("0");
    var marketValuePercent = new BigDecimal("0");
    for (var k in result) {
        dayIncome = new BigDecimal(parseFloat((new BigDecimal(result[k].gszzl)).multiply((new BigDecimal(result[k].dwjz))).multiply(new BigDecimal(result[k].bonds + "")).divide(new BigDecimal("100"))).toFixed(2));
        marketValue = new BigDecimal(parseFloat((new BigDecimal(result[k].gsz)).multiply(new BigDecimal(result[k].bonds + ""))).toFixed(2));
        if (totalMarketValueResult.compareTo(new BigDecimal("0")) != 0) {
            marketValuePercent = marketValue.multiply(new BigDecimal("100")).divide(totalMarketValueResult, 4);
        }
        let gszzl = parseFloat(result[k].gszzl);
        var dayIncomeStyle = gszzl == 0 ? "" : (gszzl > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
        let addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" + result[k].addTime + ")";
        // 计算基金总成本
        var costPrice = new BigDecimal(result[k].costPrise + "");
        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(result[k].bonds + ""))).toFixed(2));
        fundTotalCostValue = fundTotalCostValue.add(costPriceValue);

        let showMinuteImageMini = await readCacheData('show-minute-image-mini');
        let minuteImageMiniDiv = "";
        if (showMinuteImageMini == 'open') {
            minuteImageMiniDiv  = "<div id=\"minute-image-mini-" + result[k].fundCode + "\" class=\"my-echart\"></div>"
        }
        str += "<tr id=\"fund-tr-" + k + "\">"
            + "<td>" + result[k].name + minuteImageMiniDiv + "</td>"
            + "<td " + dayIncomeStyle + ">" + dayIncome
            + "<td " + dayIncomeStyle + ">" + result[k].gszzl + "%</td>"
            + "<td>" + result[k].gsz + "</td>"
            + "<td>" + result[k].costPrise + "</td>"
            + "<td>" + result[k].bonds + "</td>"
            + (marketValueDisplay == 'DISPLAY' ? "<td>" + marketValue + "</td>" : "")
            + (marketValuePercentDisplay == 'DISPLAY' ? "<td>" + marketValuePercent + "%</td>" : "")
            + (costPriceDisplay == 'DISPLAY' ? "<td>" + costPriceValue + "</td>" : "")
            + (incomePercentDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].incomePercent + "%</td>" : "")
            + "<td " + totalIncomeStyle + ">" + result[k].income + "</td>"
            + (addtimePriceDisplay == 'DISPLAY' ? "<td>" + addTimePrice + "</td>" : "")
            + "</tr>";
        fundTotalIncome = fundTotalIncome.add(new BigDecimal(result[k].income));
        fundDayIncome = fundDayIncome.add(dayIncome);
        fundTotalmarketValue = fundTotalmarketValue.add(marketValue);
    }
    var fundDayIncomePercent = new BigDecimal("0");
    var fundTotalIncomePercent = new BigDecimal("0");
    if (fundTotalmarketValue > 0) {
        fundDayIncomePercent = fundDayIncome.multiply(new BigDecimal("100")).divide(fundTotalmarketValue.subtract(fundDayIncome), 4);
    }
    if (fundTotalCostValue > 0) {
        fundTotalIncomePercent = fundTotalIncome.multiply(new BigDecimal("100")).divide(fundTotalCostValue, 4);
    }
    var fundDayIncomePercentStyle = fundDayIncome == 0 ? "" : (fundDayIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    var fundTotalIncomePercentStyle = fundTotalIncome == 0 ? "" : (fundTotalIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    str += "<tr>"
        + "<td>合计</td>"
        + "<td " + fundDayIncomePercentStyle + ">" + fundDayIncome + "</td>"
        + "<td colspan='2' " + fundDayIncomePercentStyle + ">" + fundDayIncomePercent + "%</td>"
        + "<td colspan='2'></td>"
        + (marketValueDisplay == 'DISPLAY' ? "<td>" + fundTotalmarketValue + "</td>" : "") 
        + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" )
        + (costPriceDisplay == 'DISPLAY' ? "<td>" + fundTotalCostValue + "</td>" : "") 
        + (incomePercentDisplay == 'DISPLAY' ? "<td " + fundTotalIncomePercentStyle + ">" + fundTotalIncomePercent + "%</td>" : "") 
        + "<td " + fundTotalIncomePercentStyle + ">" + fundTotalIncome + "</td>"
        + (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
        + "</tr>";

    return str;
}

// 拼接汇总 html
function getTotalTableHtml(totalMarketValueResult) {
    var str = "";
    var allDayIncome = fundDayIncome.add(stockDayIncome);
    var allTotalIncome = fundTotalIncome.add(stockTotalIncome);
    var allDayIncomePercent = new BigDecimal("0");
    var allTotalIncomePercent = new BigDecimal("0");
    var totalCostPrice = fundTotalCostValue.add(stockTotalCostValue);
    if (totalMarketValueResult != 0) {
        allDayIncomePercent = allDayIncome.multiply(new BigDecimal("100")).divide(totalMarketValueResult.add(allDayIncome), 4);
    }
    if (totalCostPrice > 0) {
        allTotalIncomePercent = allTotalIncome.multiply(new BigDecimal("100")).divide(totalCostPrice, 4);
    }
    var allDayIncomePercentStyle = allDayIncome == 0 ? "" : (allDayIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    var allTotalIncomePercentStyle = allTotalIncome == 0 ? "" : (allTotalIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");

    str += "<tr>"
        + "<td>汇总合计</td>"
        + "<td " + allDayIncomePercentStyle + ">" + allDayIncome.setScale(2) + "</td>"
        + "<td colspan='2' " + allDayIncomePercentStyle + ">" + allDayIncomePercent.setScale(2, 4) + "%</td>"
        + "<td colspan='2'></td>" 
        + (marketValueDisplay == 'DISPLAY' ? "<td>" + totalMarketValueResult.setScale(2) + "</td>" : "" )
        + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
        + (costPriceDisplay == 'DISPLAY' ? "<td>" + totalCostPrice + "</td>" : "" ) 
        + (incomePercentDisplay == 'DISPLAY' ? "<td " + allTotalIncomePercentStyle + ">" + allTotalIncomePercent + "%</td>" : "" ) 
        + "<td " + allTotalIncomePercentStyle + ">" + allTotalIncome + "</td>" 
        + (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
        + "</tr>";

    return str;
}

// 通过股票名称搜索股票列表
function searchStockByName(name) {
    if (name.indexOf("sh") != -1 || name.indexOf("sz") != -1 || name.indexOf("us") != -1
        || name.indexOf("SH") != -1 || name.indexOf("SZ") != -1 || name.indexOf("US") != -1) {
        name = name.substring(2, name.length);
    }
    var stocksArr;
    let result = ajaxGetStockCodeByNameFromGtimg(name);
    if (result.indexOf("v_hint=\"N\";") != -1) {
        alertMessage("不存在该股票");
        $("#stock-name").val("");
        return;
    }
    if (result.indexOf("v_cate_hint") != -1) {
        result = result.substring(result.indexOf("\n") + 1);
    }
    result = result.replace("v_hint=\"", "").replace(" ", "");
    stocksArr = result.split("^");
    return stocksArr;
}

// 通过基金名称搜索基金列表
async function searchFundByName(name) {
    var fundsArrs = [];
    var allFundArr = await readCacheData('all_fund_arr');
    var timeCached = await readCacheData('all_fund_arr_time_cached');
    var nowTimestamp = Date.now();
    if (timeCached == null || (nowTimestamp - timeCached) >= Env.TIME_CACHED_ONE_DAY) {
        console.log("缓存超过 1 天，重新调用接口");
        allFundArr = null;
    }
    if (allFundArr != null) {
        var fundsArr = jQuery.parseJSON(allFundArr);
        for (var i = 0; i < fundsArr.length; i++) {
            // 通过名字或者基金编码查询
            if (fundsArr[i][2].indexOf(name) != -1 || fundsArr[i][0].indexOf(name) != -1) {
                var fund = {
                    "fundCode": fundsArr[i][0],
                    "fundName": fundsArr[i][2]
                };
                fundsArrs.push(fund);
            }
        }
        if (fundsArrs.length == 0) {
            // alert("未搜索到该基金");
            alertMessage("未搜索到该基金");
        }
    } else {
        let result = ajaxGetFundCodeFromTiantianjijin();
        var fundsArr = jQuery.parseJSON(result);
        var timestamp = Date.now();
        // 减少所有基金的搜索频率，缓存数据
        saveCacheData('all_fund_arr', JSON.stringify(fundsArr));
        saveCacheData('all_fund_arr_time_cached', timestamp);
        for (var i = 0; i < fundsArr.length; i++) {
            // 通过名字或者基金编码查询
            if (fundsArr[i][2].indexOf(name) != -1 || fundsArr[i][0].indexOf(name) != -1) {
                var fund = {
                    "fundCode": fundsArr[i][0],
                    "fundName": fundsArr[i][2]
                };
                fundsArrs.push(fund);
            }
        }
        if (fundsArrs.length == 0) {
            // alert("未搜索到该基金");
            alertMessage("未搜索到该基金");
        }
    }
    return fundsArrs;
}

// 保存股票
async function saveStock() {
    var costPrise = $("#stock-costPrise").val();
    var bonds = $("#stock-bonds").val();
    var monitorHighPrice = $("#stock-monitor-high-price").val();
    var monitorLowPrice = $("#stock-monitor-low-price").val();
    var code = $("#stock-code").val();
    if (code == null || code == '') {
        // alert("请添加股票编码或通过股票名称搜索");
        alertMessage("请添加股票编码或通过股票名称搜索");
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
        "monitorHighPrice": monitorHighPrice,
        "monitorLowPrice": monitorLowPrice,
    }
    var stocks = await readCacheData('stocks');
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
            stocks[k].monitorHighPrice = stock.monitorHighPrice;
            stocks[k].monitorLowPrice = stock.monitorLowPrice;
            stocks[k].monitorAlert = '';
            if (stocks[k].addTimePrice == null || stocks[k].addTimePrice == '') {
                let checkStockExsitResult = checkStockExsit(stocks[k].code);
                stocks[k].addTimePrice = checkStockExsitResult.now;
                stocks[k].addTime = getCurrentDate();
            }
            saveCacheData('stocks', JSON.stringify(stocks));
            stockList = stocks;
            $("#stock-modal").modal("hide");
            $("#search-stock-modal").modal("hide");
            initData();
            return;
        }
    }
    let checkStockExsitResult = checkStockExsit(stock.code);
    if (!checkStockExsitResult.checkReuslt) {
        // alert("不存在该股票");
        alertMessage("不存在该股票");
        $("#stock-modal").modal("hide");
        $("#search-stock-modal").modal("hide");
        return;
    }
    stock.addTimePrice = checkStockExsitResult.now;
    stock.addTime = getCurrentDate();
    stocks.push(stock);
    saveCacheData('stocks', JSON.stringify(stocks));
    stockList = stocks;
    $("#stock-modal").modal("hide");
    $("#search-stock-modal").modal("hide");
    initData();
}

// 保存基金
async function saveFund() {
    var costPrise = $("#fund-costPrise").val();
    var bonds = $("#fund-bonds").val();
    if (isCycleInvest) {
        var fundCycleInvestType = $("#fund-cycle-invest-type").val();
        var fundCycleInvestDate = $("#fund-cycle-invest-date").val();
        var fundCycleInvestValue = $("#fund-cycle-invest-value").val();
        var fundCycleInvestRate = $("#fund-cycle-invest-rate").val();
        // 当fundCycleInvestType存在时检测fundCycleInvestDate，fundCycleInvestValue，fundCycleInvestRate不能为空
        if (fundCycleInvestType != '' && fundCycleInvestType != 'no') {
            if (fundCycleInvestDate == null || fundCycleInvestDate == '') {
                alert("请选择基金周期投资日期");
                return;
            }
            if (fundCycleInvestValue == null || fundCycleInvestValue == '') {
                alert("请选择基金周期投资金额");
                return;
            }
            if (fundCycleInvestRate == null || fundCycleInvestRate == '') {
                alert("请选择基金周期投资收益率");
                return;
            }
        }
    }

    var code = $("#fund-code").val();
    if (code == null || code == '') {
        alertMessage("请添加基金编码或通过基金名称搜索");
        return;
    }
    if (costPrise == null || costPrise == '') {
        costPrise = "0";
    }
    if (bonds == null || bonds == '') {
        bonds = "0";
    }
    var fund;
    if (isCycleInvest) {
        fund = {
            "fundCode": code,
            "costPrise": costPrise,
            "bonds": bonds,
            "fundCycleInvestType": fundCycleInvestType,
            "fundCycleInvestDate": fundCycleInvestDate,
            "fundCycleInvestValue": fundCycleInvestValue,
            "fundCycleInvestRate": fundCycleInvestRate,
        }
    } else {
        fund = {
            "fundCode": code,
            "costPrise": costPrise,
            "bonds": bonds,
        }
    }
    var funds = await readCacheData('funds');
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
            if (isCycleInvest) {
                funds[k].fundCycleInvestType = fund.fundCycleInvestType;
                funds[k].fundCycleInvestDate = fund.fundCycleInvestDate;
                funds[k].fundCycleInvestValue = fund.fundCycleInvestValue;
                funds[k].fundCycleInvestRate = fund.fundCycleInvestRate;
            }
            if (funds[k].addTimePrice == null || funds[k].addTimePrice == '') {
                let checkFundExsitReuslt = checkFundExsit(funds[k].fundCode);
                funds[k].addTimePrice = checkFundExsitReuslt.now;
                funds[k].addTime = getCurrentDate();
            }
            saveCacheData('funds', JSON.stringify(funds));
            fundList = funds;
            $("#fund-modal").modal("hide");
            $("#search-fund-modal").modal("hide");
            initData();
            return;
        }
    }
    let checkFundExsitReuslt = checkFundExsit(fund.fundCode);
    if (!checkFundExsitReuslt.checkReuslt) {
        checkFundExsitReuslt = checkFundExsitFromEastMoney(fund.fundCode);
        if (!checkFundExsitReuslt.checkReuslt) {
            $("#fund-modal").modal("hide");
            $("#search-fund-modal").modal("hide");
            return;
        }
    }
    fund.addTimePrice = checkFundExsitReuslt.now;
    fund.addTime = getCurrentDate();
    funds.push(fund);
    saveCacheData('funds', JSON.stringify(funds));
    fundList = funds;
    $("#fund-modal").modal("hide");
    $("#search-fund-modal").modal("hide");
    initData();
}

// 导出文件方法
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

// 统一存储缓存
function saveCacheData(key, value) {
    localStorage.setItem(key, value);
    saveData(key, value);
}

// 统一读取缓存，写一个异步方法
async function readCacheData(key) {
    var result = await getData(key);
    // 对于老版本，getData 没有获取到则从 localStorage 中获取
    if (result == null || result == undefined || result == 'undefined' || result == '[]') {
        result = localStorage.getItem(key);
    }
    console.log("readCacheData key = " + key + ", value = " + result);
    return result;
}

// 首页点击股票基金搜索或者在股票基金名称输入框点击回车
async function searchFundAndStock() {
    $("#search-fund-select").find("option").remove();
    $("#search-stock-select").find("option").remove();
    let stockName = $("#input-stock-name-search").val();
    let fundName = $("#input-fund-name-search").val();
    if (showStockOrFundOrAll == 'stock' && (stockName == "" || stockName == null)) {
        stockName = fundName;
        fundName = "";
    }
    if (showStockOrFundOrAll == 'fund' && (fundName == "" || fundName == null)) {
        fundName = stockName;
        stockName = "";
    }
    if (stockName != "" && stockName != null) {
        var stocksArr = searchStockByName(stockName);
        for (var k in stocksArr) {
            var values = stocksArr[k].split("~");
            var market = "";
            if (values[0] == 'sh') {
                market = "沪A"
            } else if (values[0] == 'sz') {
                market = "深A"
            } else if (values[0] == 'hk') {
                market = "港股"
            } else if (values[0] == 'us') {
                market = "美股"
            } else {
                market = "其他"
            }
            var option = $("<option></option>").val(values[0] + values[1].replace('.oq','').toUpperCase()).text(A2U(values[2]) + " " + values[0] + values[1] + " （" + market + "）");
            $("#search-stock-select").append(option);
        }
        if (stocksArr != null && stocksArr != '' && stocksArr != undefined && stocksArr.length > 0) {
            $("#search-stock-modal").modal();
        }
    }

    if (fundName != "" && fundName != null) {
        var fundsArr = await searchFundByName(fundName);
        for (var k in fundsArr) {
            var option = $("<option></option>").val(fundsArr[k].fundCode).text(fundsArr[k].fundName + " " + fundsArr[k].fundCode);
            $("#search-fund-select").append(option);
        }
        if (fundsArr.length > 0) {
            $("#search-fund-modal").modal();
        }
    }
    $("#input-fund-name-search").val("");
    $("#input-stock-name-search").val("");
}

async function changeWindowSize() {
    $("#setting-modal").modal("hide");
    // 添加class样式
    if (windowSize == "NORMAL") {
        saveCacheData('window-size', 'SMALL');
        windowSize = 'SMALL';
    } else {
        saveCacheData('window-size', 'NORMAL');
        windowSize = 'NORMAL';
    }
    initFontStyle();
}

// 初始化页面是，股票基金数据字体样式设定
async function initFontStyle() {
    let fontChangeStyle = await readCacheData('font-change-style');
    var stockNr = document.getElementById('stock-nr');
    var fundNr = document.getElementById('fund-nr');
    var totalNr = document.getElementById('total-nr');
    if ('bolder' == fontChangeStyle) {
        stockNr.classList.add('my-table-tbody-font');
        fundNr.classList.add('my-table-tbody-font');
        totalNr.classList.add('my-table-tbody-font');
    } else {
        stockNr.classList.remove('my-table-tbody-font');
        fundNr.classList.remove('my-table-tbody-font');
        totalNr.classList.remove('my-table-tbody-font');
    }
    if (windowSize == 'SMALL') {
        let myDiv = document.getElementById('my-div');
        let myInputGroup = document.getElementById('my-input-group');
        let stockLargeMarket = document.getElementById('stock-large-market');
        let footer = document.getElementById('footer');
        let myHeader = document.getElementById('my-header');
        let myBody = document.getElementById('my-body');
        let monitorText = document.getElementById('monitor-text');
        let alertContent = document.getElementById('alert-content');
        let helpDocumentAlert = document.getElementById('help-document-alert');

        myDiv.classList.remove('my-div');
        myDiv.classList.add('my-div-small');
        myDiv.style.width = '600px';
        myInputGroup.classList.remove('my-input-group');
        myInputGroup.classList.add('my-input-group-small');
        stockLargeMarket.classList.remove('stock-large-market');
        stockLargeMarket.classList.add('stock-large-market-small');
        footer.classList.remove('footer');
        footer.classList.add('footer-small');
        myHeader.classList.remove('my-header');
        myHeader.classList.add('my-header-small');
        myBody.classList.remove('my-body');
        myBody.classList.add('my-body-small');
        monitorText.classList.remove('my-monitor-text');
        monitorText.classList.add('my-monitor-text-small');
        alertContent.classList.remove('my-alert');
        alertContent.classList.add('my-alert-small');
        helpDocumentAlert.classList.remove('my-large-alert');
        helpDocumentAlert.classList.add('my-large-alert-small');
    } else {
        let displaySize = 7;
        if (marketValueDisplay == 'DISPLAY') {
            displaySize++;
        }
        if (marketValuePercentDisplay == 'DISPLAY') {
            displaySize++;
        }
        if (costPriceDisplay == 'DISPLAY') {
            displaySize++;
        }
        if (incomePercentDisplay == 'DISPLAY') {
            displaySize++;
        }
        if (addtimePriceDisplay == 'DISPLAY') {
            displaySize++;
        }
        let myDivWidth = 80 * displaySize;
        if (myDivWidth <= 800) {
            myDivWidth = 800;
        }
        let myDiv = document.getElementById('my-div');
        let myInputGroup = document.getElementById('my-input-group');
        let stockLargeMarket = document.getElementById('stock-large-market');
        let footer = document.getElementById('footer');
        let myHeader = document.getElementById('my-header');
        let myBody = document.getElementById('my-body');
        let monitorText = document.getElementById('monitor-text');
        let alertContent = document.getElementById('alert-content');
        let helpDocumentAlert = document.getElementById('help-document-alert');

        myDiv.classList.add('my-div');
        myDiv.classList.remove('my-div-small');
        myDiv.style.width = myDivWidth + 'px';
        myInputGroup.classList.add('my-input-group');
        myInputGroup.classList.remove('my-input-group-small');
        stockLargeMarket.classList.add('stock-large-market');
        stockLargeMarket.classList.remove('stock-large-market-small');
        footer.classList.add('footer');
        footer.classList.remove('footer-small');
        myHeader.classList.add('my-header');
        myHeader.classList.remove('my-header-small');
        myBody.classList.add('my-body');
        myBody.classList.remove('my-body-small');
        monitorText.classList.add('my-monitor-text');
        monitorText.classList.remove('my-monitor-text-small');
        alertContent.classList.add('my-alert');
        alertContent.classList.remove('my-alert-small');
        helpDocumentAlert.classList.add('my-large-alert');
        helpDocumentAlert.classList.remove('my-large-alert-small');
    }
}

// 样式切换，股票基金数据字体加粗加大
async function changeFontStyle() {
    $("#setting-modal").modal("hide");
    var stockNr = document.getElementById('stock-nr');
    // 添加class样式
    if (stockNr.classList.contains('my-table-tbody-font')) {
        saveCacheData('font-change-style', 'normal');
    } else {
        saveCacheData('font-change-style', 'bolder');
    }
    initFontStyle();
}

// 展示隐藏分时图
async function setMinuteImageMini() {
    $("#setting-modal").modal("hide");
    let showMinuteImageMini = await readCacheData('show-minute-image-mini');
    if (showMinuteImageMini == 'open') {
        saveCacheData('show-minute-image-mini', 'close');
    } else {
        saveCacheData('show-minute-image-mini', 'open');
    }
    initData();
}

// 各种告警提示
function alertMessage(message) {
    $("#alert-content").html(message);
    $("#alert-container").show();
    setTimeout(function () {
        $("#alert-container").hide();
    }, 2000);
}

// 第一次安装后没有数据，展示使用说明
function initFirstInstall() {
    if (stockList.length == 0 && fundList.length == 0) {
        $("#help-document-alert")[0].style.display = 'block';
    } else {
        $("#help-document-alert")[0].style.display = 'none';
    }
}

// 遍历股票，展示主页迷你分时图
function setStockMinitesImageMini(){
    for (k in stockList) {
        let elementId = 'minute-image-mini-' + stockList[k].code;
        let result = ajaxGetStockTimeImageMinuteMini(stockList[k].code);
        let dataStr = [];
        let now;
        if (result.data == null){
            return;
        }
        for (var k = 0; k < result.data.trends.length; k++) {
            let str = result.data.trends[k];
            dataStr.push(parseFloat(str.split(",")[1]));
            if (k == result.data.trends.length - 1) {
                now = dataStr[k];
            }
        }
        if(dataStr.length == 0){
            return;
        }
        let color;
        if (parseFloat(now) >= parseFloat(result.data.preClose)) {
            color = redColor;
        } else {
            color = blueColor;
        }
        setDetailChart(elementId, dataStr, color);
    }
}

// 遍历基金，展示主页迷你分时图
function setFundMinitesImageMini(){
    for (k in fundList) {
        let elementId = 'minute-image-mini-' + fundList[k].fundCode;
        let result = ajaxGetFundTimeImageMinuteMini(fundList[k].fundCode);
        let dataStr = [];
        let now;
        if (result.data == null){
            return;
        }
        for (var k = 0; k < result.data.trends.length; k++) {
            let str = result.data.trends[k];
            dataStr.push(parseFloat(str.split(",")[1]));
            if (k == result.data.trends.length - 1) {
                now = dataStr[k];
            }
        }
        let color;
        if (parseFloat(now) >= parseFloat(result.data.preClose)) {
            color = redColor;
        } else {
            color = blueColor;
        }
        setDetailChart(elementId, dataStr, color, result.data.preClose);
    }
}

// 展示首页迷你分时图
function setDetailChart(elementId, dataStr, color, preClose) {
    // 如果分时数据长度小于240填充空值
    if (dataStr.length < 241) {
        const diffLength = 241 - dataStr.length;
        const emptyData = Array(diffLength).fill(null); // 使用 null 填充空数据
        dataStr = dataStr.concat(emptyData);
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(elementId));
    option = {
        // resize: true,
        lineStyle: {
            color: color, // 设置线的颜色
            // 其他样式配置
            width: 1,
            opacity: 0.5
        },
        xAxis: {
            axisLabel: {
                show: false // 隐藏x轴坐标标签
              },
              axisTick: {
                show: false // 隐藏x轴刻度线
              },
              axisLine: {
                show: false // 隐藏x轴轴线
            },
            type: 'category',
        },
        yAxis: {
            scale: true,
            type: 'value',
            axisLabel: {
                show: false // 隐藏x轴坐标标签
            },
            axisTick: {
                show: false // 隐藏x轴刻度线
            },
            axisLine: {
                show: false // 隐藏x轴轴线
            },
            splitLine: {
                show: false // 隐藏背景的横隔线
            }
        },
        grid: {
            left: '0%',
            right: '0%',
            top: '0%',
            bottom: '0%',
            width: '100%',
            height: '100%'
        },
        series: [
            {
                data: dataStr,
                type: 'line',
                smooth: true,
            }
        ]
    };
    myChart.setOption(option);
}

// 修改涨跌蓝绿颜色
async function changeBlueRed() {
    if (blueColor == '#3e8f3e') {
        blueColor = '#c12e2a';
    } else if (blueColor == '#c12e2a') {
        blueColor = '#3e8f3e';
    }
    if (redColor == '#c12e2a') {
        redColor = '#3e8f3e';
    } else if (redColor == '#3e8f3e') {
        redColor = '#c12e2a';
    }
    saveCacheData('redColor', redColor);
    saveCacheData('blueColor', blueColor);
    initData();
    initLargeMarketData();
}

// 欺骗自己，愣是把当日亏损变成盈利
async function cheatMe() {
    if(cheatMeFlag) {
        cheatMeFlag = false;
    } else if(!cheatMeFlag) {
        cheatMeFlag = true;
    }
    await saveCacheData('cheatMeFlag', cheatMeFlag);
    initData();
}

// 切换展示股票/基金/全部
async function changeShowStockOrFundOrAll(type) {
    await saveCacheData('showStockOrFundOrAll', type);
    showStockOrFundOrAll = type;
    location.reload();
}

// 展示数据导入页面
function showImportData() {
    $("#setting-modal").modal("hide");
    $("#data-import-modal").modal();
}

// 数据导出
function dataExport() {
    var data = {};
    data.stocks = stockList;
    data.funds = fundList;
    downloadJsonOrTxt('股票基金神器.txt', JSON.stringify(data));
}

// 清除所有数据
function removeAllData() {
    let stocksRemove = [];
    let fundsRemove = [];
    saveCacheData('stocks', JSON.stringify(stocksRemove));
    saveCacheData('funds', JSON.stringify(fundsRemove));
    location.reload();
}

// 打开使用说明文档
function helpDocument () {
    chrome.tabs.create({ url: Env.GET_HELP_DOCUMENT });
}

// 全屏展示
async function fullScreen() {
    $("#setting-modal").modal("hide");
    chrome.tabs.create({ url: "popup.html" });
}

// 展示密码保护页面
async function showPasswordProtect () {
    $("#setting-modal").modal("hide");
    $("#password-protect-modal").modal();
}

// 第一次点击监控股价设定角标，再次点击取消角标
async function stockMonitor () {
    let code = $("#stock-code").val();
    let monitorStockCode = await readCacheData("MONITOR_STOCK_CODE");
    if (monitorStockCode != null && monitorStockCode != '' 
    && monitorStockCode != undefined && monitorStockCode != 'undefined' && monitorStockCode == code) {
        saveCacheData("MONITOR_STOCK_CODE", '');
        chrome.action.setBadgeText({ text: '' });
        return;
    }
    let stock = checkStockExsit(code);
    chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
    chrome.action.setBadgeBackgroundColor({ color: 'blue' });
    chrome.action.setBadgeText({ text: "" + stock.now });
    saveCacheData("MONITOR_STOCK_CODE", code);
}

// 清理角标
async function removeBadgeText() {
    chrome.action.setBadgeText({ text: '' });
}

// 获取基金持仓明细
async function getFundInversPosition() {
    let code = timeImageCode;
    // if (code == '' || code == null) {
    //     code = $("#fund-code").val();
    // }
    code = code.replace('sz','').replace('sh','');
    let fundStocks = ajaxGetFundInvesterPosition(code);
    if (fundStocks == null || fundStocks == '' || fundStocks == []) {
        return;
    }
    let fundStocksArr;
    for (k in fundStocks) {
        fundStocksArr = fundStocksArr + fundStocks[k].NEWTEXCH + "." + fundStocks[k].GPDM + ",";
    }
    let fundStocksDetail = ajaxGetFundInvesterPositionDetail(fundStocksArr);
    let str = "";
    for(k in fundStocksDetail) {
        let currentStock;
        for(l in fundStocks) {
            if (fundStocksDetail[k].f12 == fundStocks[l].GPDM) {
                currentStock = fundStocks[l];
                break;
            }
        }
        let fundStocksDetailStyle = parseFloat(fundStocksDetail[k].f3) == 0 ? "" : (parseFloat(fundStocksDetail[k].f3) > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
        str += "<tr>"
        + "<td >" + fundStocksDetail[k].f14 + "(" + fundStocksDetail[k].f12 + ")" 
        + "</td><td>" + parseFloat(fundStocksDetail[k].f2).toFixed(2)
        + "</td><td " + fundStocksDetailStyle + ">" + parseFloat(fundStocksDetail[k].f3).toFixed(2) + "%"
        + "</td><td>" + parseFloat(currentStock.JZBL).toFixed(2) + "%"
        + "</td></tr>";
    }
    $("#fund-invers-position-nr").html(str);
    $("#fund-invers-position-modal").modal();
    $("#stock-modal").modal("hide");
    $("#fund-modal").modal("hide");
    $("#time-image-modal").modal("hide");
}

// 展示历史净值
async function setFundNetDiagram(type) {
    let code = timeImageCode;
    // if (code == '' || code == null) {
    //     code = $("#fund-code").val();
    // }
    code = code.replace('sz','').replace('sh','');
    let fundNetDiagram = ajaxGetFundNetDiagram(code, type);
    let dataDwjz = [];
    let dataLJJZ = [];
    let dataAxis = [];
    for (let k = 0; k < fundNetDiagram.length; k++) {
        dataDwjz.push(parseFloat(fundNetDiagram[k].DWJZ));
        dataLJJZ.push(parseFloat(fundNetDiagram[k].LJJZ));
        dataAxis.push(fundNetDiagram[k].FSRQ);
    }
    let interval = 6;
    if (type == 'MONTH') {
        interval = 6;
    } else if (type == '3MONTH') {
        interval = 18;
    } else if (type == '6MONTH') {
        interval = 36;
    } else if (type == 'YEAR') {
        interval = 72;
    } else if (type == '3YEAR') {
        interval = 216;
    } else if (type == '5YEAR') {
        interval = 360;
    } else if (type == 'ALLYEAR') {
        interval = Math.floor(fundNetDiagram.length / 4);
    }

    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("fund-net-diagram"));
    option = {
        legend: {
            data: ['单位净值', '累计净值']
        },
        xAxis: {
            data: dataAxis,
            type: 'category',
            axisLabel: {
                interval: interval // 调整刻度显示间隔
            },
        },
        yAxis: {
            scale: true,
            type: 'value',
        },
        series: [
            {
                name: '单位净值',
                data: dataDwjz,
                type: 'line',
                smooth: true,
                color: 'blue',
            },
            {
                name: '累计净值',
                data: dataLJJZ,
                type: 'line',
                smooth: true,
                color: 'red',
            }
        ]
    };
    myChart.setOption(option);
    $("#fund-net-diagram-modal").modal();
    $("#stock-modal").modal("hide");
    $("#fund-modal").modal("hide");
    $("#time-image-modal").modal("hide");
}

// 设定股票/基金详情隐藏/展示某些列
async function setDisplayTr(event){
    let type = event.target.id;
    let dispaly;
    if (event.target.checked) {
        dispaly = 'DISPLAY';
    } else {
        dispaly = 'HIDDEN';
    }
    if (type == 'market-value-display-checkbox') {
        marketValueDisplay = dispaly;
        saveCacheData('market-value-display', dispaly);
    } else if(type == 'market-value-percent-display-checkbox') {
        marketValuePercentDisplay = dispaly;
        saveCacheData('market-value-percent-display', dispaly);
    } else if(type == 'cost-price-display-checkbox') {
        costPriceDisplay = dispaly;
        saveCacheData('cost-price-display', dispaly);
    } else if(type == 'income-percent-display-checkbox') {
        incomePercentDisplay = dispaly;
        saveCacheData('income-percent-display', dispaly);
    } else if(type == 'addtime-price-display-checkbox') {
        addtimePriceDisplay = dispaly;
        saveCacheData('addtime-price-display', dispaly);
    }
    initHtml();
    initData();
}
// 抽象文件导入方法
async function fileInput (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        var json = JSON.parse(contents);
        // 在这里处理您的 JSON 数据
        saveCacheData('stocks', JSON.stringify(json.stocks));
        saveCacheData('funds', JSON.stringify(json.funds));
        $("#data-import-modal").modal("hide");
        location.reload();
    };
    reader.readAsText(file);
}