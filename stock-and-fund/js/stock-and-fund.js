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
var costPriceValueDisplay = 'DISPLAY';
var incomePercentDisplay = 'DISPLAY';
var addtimePriceDisplay = 'DISPLAY';
var dayIncomeDisplay = 'DISPLAY';
var costPriceDisplay = 'DISPLAY';
var bondsDisplay = 'DISPLAY';
var incomeDisplay = 'DISPLAY';
var allDisplay = 'DISPLAY';
var codeDisplay = 'HIDDEN';
var largeMarketScroll = 'STOP';
var sortType = 'ASC';

// 整个程序的初始化
window.addEventListener("load", async (event) => {
    // //启动时发送消息
    // chrome.runtime.sendMessage({ 'message' : 'scheduleTask' });
    let password = await readCacheData('password');
    // 如果 password 存在，需要验证密码
    if (password != null && password != '') {
        // 展示password-check-modal
        $('#password-check-modal').modal('show');
        // 隐藏密码保护按钮
        $("#show-password-protect-button")[0].style.display = 'none';
        $("#data-export-button")[0].style.display = 'none';
        document.getElementById('import-from-local-springboot-div').style.display = 'none';
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
    } else if(cheatMeFlag == "false") {
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
    costPriceValueDisplay = await readCacheData('cost-price-value-display');
    if (costPriceValueDisplay == null || costPriceValueDisplay == 'DISPLAY') {
        costPriceValueDisplay = 'DISPLAY';
        $("#cost-price-value-display-checkbox").prop("checked", true);
    } else {
        costPriceValueDisplay = 'HIDDEN';
        $("#cost-price-value-display-checkbox").prop("checked", false);
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
        $("#addtime-price-display-checkbox").prop("checked", false);
    }
    dayIncomeDisplay = await readCacheData('day-income-display');
    if (dayIncomeDisplay == null || dayIncomeDisplay == 'DISPLAY') {
        dayIncomeDisplay = 'DISPLAY';
        $("#day-income-display-checkbox").prop("checked", true);
    } else {
        dayIncomeDisplay = 'HIDDEN';
        $("#day-income-display-checkbox").prop("checked", false);
    }
    costPriceDisplay = await readCacheData('cost-price-display');
    if (costPriceDisplay == null || costPriceDisplay == 'DISPLAY') {
        costPriceDisplay = 'DISPLAY';
        $("#cost-price-display-checkbox").prop("checked", true);
    } else {
        costPriceDisplay = 'HIDDEN';
        $("#cost-price-display-checkbox").prop("checked", false);
    }
    bondsDisplay = await readCacheData('bonds-display');
    if (bondsDisplay == null || bondsDisplay == 'DISPLAY') {
        bondsDisplay = 'DISPLAY';
        $("#bonds-display-checkbox").prop("checked", true);
    } else {
        bondsDisplay = 'HIDDEN';
        $("#bonds-display-checkbox").prop("checked", false);
    }
    incomeDisplay = await readCacheData('income-display');
    if (incomeDisplay == null || incomeDisplay == 'DISPLAY') {
        incomeDisplay = 'DISPLAY';
        $("#income-display-checkbox").prop("checked", true);
    } else {
        incomeDisplay = 'HIDDEN';
        $("#income-display-checkbox").prop("checked", false);
    }
    allDisplay = await readCacheData('all-display');
    if (allDisplay == null || allDisplay == 'DISPLAY') {
        allDisplay = 'DISPLAY';
        $("#all-display-checkbox").prop("checked", true);
    } else {
        allDisplay = 'HIDDEN';
        $("#all-display-checkbox").prop("checked", false);
    }
    codeDisplay = await readCacheData('code-display');
    if (codeDisplay == null || codeDisplay == 'HIDDEN') {
        codeDisplay = 'HIDDEN';
        $("#code-display-checkbox").prop("checked", false);
    } else {
        codeDisplay = 'DISPLAY';
        $("#code-display-checkbox").prop("checked", true);
    }
    largeMarketScroll = await readCacheData('large-market-scrool');
    if (largeMarketScroll == null) {
        largeMarketScroll = 'STOP';
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
        document.getElementById('import-from-local-springboot-div').style.display = 'block';
    } else {
        document.getElementById('import-from-local-springboot-div').style.display = 'none';
    }
    // 股票标题
    var stockHead = " <tr id=\"stock-tr-title\"> " +
        " <th id=\"stock-name-th\">股票名称（点击排序）</th> " +
        (dayIncomeDisplay == 'DISPLAY' ? " <th id=\"stock-day-income-th\">当日盈利</th> " : "") + 
        " <th id=\"stock-change-th\">涨跌幅</th> " +
        " <th id=\"stock-price-th\">当前价</th> " +
        (costPriceDisplay == 'DISPLAY' ? " <th id=\"stock-cost-price-th\">成本价</th> " : "") + 
        (bondsDisplay == 'DISPLAY' ? " <th id=\"stock-bonds-th\">持仓</th> " : "") + 
        (marketValueDisplay == 'DISPLAY' ? " <th id=\"stock-market-value-th\">市值/金额</th> " : "") + 
        (marketValuePercentDisplay == 'DISPLAY' ? " <th id=\"stock-market-value-percent-th\">持仓占比</th> " : "") + 
        (costPriceValueDisplay == 'DISPLAY' ? " <th id=\"stock-cost-price-value-th\">成本</th> " : "") + 
        (incomePercentDisplay == 'DISPLAY' ? " <th id=\"stock-income-percent-th\">收益率</th> " : "") + 
        (incomeDisplay == 'DISPLAY' ? " <th id=\"stock-income-th\">收益</th> " : "") + 
        (addtimePriceDisplay == 'DISPLAY' ? " <th >自选价格</th> " : "") + 
        " </tr>";
    // 基金标题
    var fundHead = " <tr id=\"fund-tr-title\">" +
        " <th id=\"fund-name-th\">基金名称（点击排序）</th>" +
        (dayIncomeDisplay == 'DISPLAY' ? " <th id=\"fund-day-income-th\">当日盈利</th>" : "") + 
        " <th id=\"fund-change-th\">涨跌幅</th>" +
        " <th id=\"fund-price-th\">估算净值</th>" +
        (costPriceDisplay == 'DISPLAY' ? " <th id=\"fund-cost-price-th\">持仓成本单价</th>" : "") + 
        (bondsDisplay == 'DISPLAY' ? " <th id=\"fund-bonds-th\">持有份额</th>" : "") + 
        (marketValueDisplay == 'DISPLAY' ? " <th id=\"fund-market-value-th\">市值/金额</th> " : "") + 
        (marketValuePercentDisplay == 'DISPLAY' ? " <th id=\"fund-market-value-percent-th\">持仓占比</th> " : "") + 
        (costPriceValueDisplay == 'DISPLAY' ? " <th id=\"fund-cost-price-value-th\">成本</th> " : "") + 
        (incomePercentDisplay == 'DISPLAY' ? " <th id=\"fund-income-percent-th\">收益率</th> " : "") + 
        (incomeDisplay == 'DISPLAY' ? " <th id=\"fund-income-th\">收益</th> " : "") + 
        (addtimePriceDisplay == 'DISPLAY' ? " <th id=\"fund-addtime-price-th\">自选价格</th> " : "") + 
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
    initWindowsSize();
    changeBlackButton();
    // 监听股票和基金的TH行点击事件，点击后排序
    document.getElementById('stock-name-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-day-income-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-change-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-price-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-cost-price-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-bonds-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-market-value-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-market-value-percent-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-cost-price-value-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-income-percent-th').addEventListener('click', sortStockAndFund);
    document.getElementById('stock-income-th').addEventListener('click', sortStockAndFund);

    document.getElementById('fund-name-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-day-income-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-change-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-price-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-cost-price-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-bonds-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-market-value-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-market-value-percent-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-cost-price-value-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-income-percent-th').addEventListener('click', sortStockAndFund);
    document.getElementById('fund-income-th').addEventListener('click', sortStockAndFund);
}

// 按钮监听事件
document.addEventListener(
    'DOMContentLoaded',
    function () {
        // 首页，点击设置按钮
        document.getElementById('show-setting-button').addEventListener('click', async function () {
            $("#setting-modal").modal();
        });
        // 首页，底部全部按钮，股票基金全部显示
        document.getElementById('show-all-button').addEventListener('click', changeShowStockOrFundOrAll);
        // 首页，底部股票按钮，只展示股票
        document.getElementById('show-stock-button').addEventListener('click', changeShowStockOrFundOrAll);
        // 首页，底部基金按钮，只展示基金
        document.getElementById('show-fund-button').addEventListener('click', changeShowStockOrFundOrAll);
        // 首页，在股票搜索名称输入框中点击回车
        document.getElementById('input-stock-name-search').addEventListener('keydown', clickSearchFundAndStockButton);
        // 首页，在基金搜索名称输入框中点击回车
        document.getElementById('input-fund-name-search').addEventListener('keydown', clickSearchFundAndStockButton);
        // 首页，输入股票名称后点击搜索股票/基金按钮
        document.getElementById('stock-fund-name-search-button').addEventListener('click', searchFundAndStock);
        // 首页，使用说明按钮点击
        document.getElementById('help-document-button').addEventListener('click', helpDocument);
        document.getElementById('help-document-alert').addEventListener('click', helpDocument);
        // 首页，点击加入微信群
        document.getElementById('show-wechat-group-button').addEventListener('click', function () {
            let timestamp = Date.now();
            let path = Env.WECHAT_GROUP_QR_CODE + "?date=" + timestamp;
            $("#wechat-group-qr-code-image").html('<img src="' + path + '" width="60%" length="60%" />');
            $("#wechat-group-modal").modal();
        });
        // 首页，点击刷新按钮
        document.getElementById('refresh-button').addEventListener('click', initData);
        // 首页，点击清除角标按钮
        document.getElementById('remove-badgetext-button').addEventListener('click', removeBadgeText);
        // 首页，点击全屏显示按钮
        document.getElementById('full-screen-button-2').addEventListener('click', fullScreen);
        // 首页，点击读取自选股
        document.getElementById('add-stock-from-tonghuashun-xueqiu').addEventListener('click', addStockFromTonghuashunXueqiu);

        // 导入数据页面，导入文件选择 txt 文件导入数据
        document.getElementById('file-input').addEventListener('change', fileInput);

        // 基金编辑页面，点击保存按钮
        document.getElementById('fund-save-button').addEventListener('click', saveFund);
        // 基金编辑页面，点击删除按钮
        document.getElementById('fund-delete-button').addEventListener('click', deleteStockAndFund);
        // 基金编辑页面，点击走势图按钮
        document.getElementById('fund-show-time-image-button').addEventListener('click', showTimeImage);

        // 股票编辑页面，点击保存按钮
        document.getElementById('stock-save-button').addEventListener('click', saveStock);
        // 股票编辑页面，点击删除按钮
        document.getElementById('stock-delete-button').addEventListener('click', deleteStockAndFund);
        // 股票编辑页面，点击走势图按钮
        document.getElementById('stock-show-time-image-button').addEventListener('click', showTimeImage);
        // 股票编辑页面，点击监控股票价格
        document.getElementById('stock-monitor-button').addEventListener('click', stockMonitor);
        
        // 走势图页面，点击分时图按钮
        document.getElementById('time-image-minute-button').addEventListener('click', showMinuteImage);
        // 走势图页面，日线图按钮点击
        document.getElementById('time-image-day-button').addEventListener('click', showDayImage);
        // 走势图页面，周线图按钮点击
        document.getElementById('time-image-week-button').addEventListener('click', showWeekImage);
        // 走势图页面，月线图按钮点击
        document.getElementById('time-image-month-button').addEventListener('click', showMonthImage);
        // 走势图页面，点击股票基金按钮
        document.getElementById('stock-fund-delete-button').addEventListener('click', deleteStockAndFund);
        // 走势图页面，点击编辑按钮
        document.getElementById('update-stock-fund-button').addEventListener('click', function () {
            $("#time-image-modal").modal("hide");
            if (timeImageType == "FUND") {
                $("#fund-modal").modal();
            } else {
                $("#stock-modal").modal();
            }
        });
        // 走势图页面，点击监控股票价格
        document.getElementById('stock-fund-monitor-button').addEventListener('click', stockMonitor);
        // 走势图页面，股票/基金编辑页面，点击查看持仓明细
        document.getElementById('fund-invers-position-button-1').addEventListener('click', getFundInversPosition);
        document.getElementById('fund-invers-position-button-2').addEventListener('click', getFundInversPosition);
        document.getElementById('fund-invers-position-button-3').addEventListener('click', getFundInversPosition);
        // 走势图页面，股票/基金编辑页面，点击查看历史净值
        document.getElementById('fund-net-diagram-button-1').addEventListener('click', setFundNetDiagram);
        document.getElementById('fund-net-diagram-button-2').addEventListener('click', setFundNetDiagram);
        document.getElementById('fund-net-diagram-button-3').addEventListener('click', setFundNetDiagram);
        // 走势图页面，股票/基金编辑页面，点击置顶按钮
        document.getElementById('set-top-button').addEventListener('click', setTop);
        document.getElementById('set-top-button-2').addEventListener('click', setTop);
        document.getElementById('set-top-button-3').addEventListener('click', setTop);
        // 走势图页面，股票/基金编辑页面，点击买/卖股票
        document.getElementById('show-buy-button').addEventListener('click', showBuyOrSell);
        document.getElementById('show-buy-button-2').addEventListener('click', showBuyOrSell);
        document.getElementById('show-sell-button').addEventListener('click', showBuyOrSell);
        document.getElementById('show-sell-button-2').addEventListener('click', showBuyOrSell);

        // 搜索股票页面，股票列表点击选择
        document.getElementById('search-stock-select').addEventListener('change', async function () {
            let stockCode = $("#search-stock-select").val();
            for (var k in stockCode) {
                let existInStockList = false;
                for (let l in stockList) {
                    if (stockList[l].code == stockCode) {
                        existInStockList = true;
                        break;
                    }
                }
                if (existInStockList) {
                    alertMessage("您已经添加过" + stockCode);
                    $("#search-stock-modal").modal("hide");
                    continue;
                }
                $("#stock-code").val(stockCode[k]);
                $("#stock-name").val('');
                // 清理之前表单记录
                $("#stock-costPrise").val('');
                $("#stock-bonds").val('');
                $("#stock-monitor-high-price").val('');
                $("#stock-monitor-low-price").val('');
                await saveStock();
            }
        });
        // 搜索基金页面，基金列表点击选择
        document.getElementById('search-fund-select').addEventListener('change', async function () {
            let fundCode = $("#search-fund-select").val();
            for (var k in fundCode) {
                let existInFundList = false;
                for (let l in fundList) {
                    if (fundList[l].fundCode == fundCode) {
                        existInFundList = true;
                        break;
                    }
                }
                if (existInFundList) {
                    alertMessage("您已经添加过" + fundCode);
                    $("#search-fund-modal").modal("hide");
                    continue;
                }
                $("#fund-code").val(fundCode[k]);
                $("#fund-name").val('');
                // 清理之前表单记录
                $("#fund-costPrise").val('');
                $("#fund-bonds").val('');
                $("#fund-cycle-invest-type").val('');
                $("#fund-cycle-invest-date").val('');
                $("#fund-cycle-invest-value").val('');
                $("#fund-cycle-invest-rate").val('');
                await saveFund();
            }
        });

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

        // 历史净值页面，点击月
        document.getElementById('fund-net-diagram-month-button').addEventListener('click',  setFundNetDiagram);
        // 历史净值页面，点击季
        document.getElementById('fund-net-diagram-3month-button').addEventListener('click',  setFundNetDiagram);
        // 历史净值页面，点击半年
        document.getElementById('fund-net-diagram-6month-button').addEventListener('click',  setFundNetDiagram);
        // 历史净值页面，点击年
        document.getElementById('fund-net-diagram-year-button').addEventListener('click',  setFundNetDiagram);
        // 历史净值页面，点击三年
        document.getElementById('fund-net-diagram-3year-button').addEventListener('click',  setFundNetDiagram);
        // 历史净值页面，点击五年
        document.getElementById('fund-net-diagram-5year-button').addEventListener('click',  setFundNetDiagram);
        // 历史净值页面，点击上市以来
        document.getElementById('fund-net-diagram-allyear-button').addEventListener('click',  setFundNetDiagram);

        // 设置页面，页面大小按钮点击
        document.getElementById('window-normal-size-change-button').addEventListener('click',  changeWindowSize);
        document.getElementById('window-small-size-change-button').addEventListener('click',  changeWindowSize);
        document.getElementById('window-mini-size-change-button').addEventListener('click',  changeWindowSize);
        // 设置页面，隐藏/展示页面展示项，编码
        document.getElementById("code-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，市值/金额
        document.getElementById("market-value-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，持仓占比
        document.getElementById("market-value-percent-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，成本
        document.getElementById("cost-price-value-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，收益率
        document.getElementById("income-percent-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，自选价格
        document.getElementById("addtime-price-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，当日盈利
        document.getElementById("day-income-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，成本价/持仓成本单价
        document.getElementById("cost-price-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，持仓/持有份额
        document.getElementById("bonds-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，收益
        document.getElementById("income-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，一键全选
        document.getElementById("all-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，点击打赏按钮
        document.getElementById("show-donate-button").addEventListener('click',  showDonate);
        document.getElementById("show-donate-button-2").addEventListener('click',  showDonate);
        // 设置页面，点击滚动/停止
        document.getElementById("large-market-scrool-button").addEventListener('click', largeMarketScrollChange);
        document.getElementById("large-market-stop-button").addEventListener('click', largeMarketScrollChange);
        // 设置页面，点击分时图按钮
        document.getElementById('show-minute-image-mini').addEventListener('click', setMinuteImageMini);
        // 设置页面，点击颜色切换按钮
        document.getElementById('change-blue-red-button').addEventListener('click', changeBlueRed);
        // 设置黑暗，点击隐身模式
        document.getElementById('change-black-button').addEventListener('click', changeBlueRed);
        // 设置页面，点击忽悠自己按钮
        document.getElementById('cheat-me-button').addEventListener('click', cheatMe);
        // 设置页面，点击全屏按钮
        document.getElementById('full-screen-button').addEventListener('click', fullScreen);
        // 设置页面，点击样式切换
        document.getElementById('font-change-button').addEventListener('click', changeFontStyle);
        // 设置页面，show-passwrod-protect-button点击，展示password-protect-modal
        document.getElementById('show-password-protect-button').addEventListener('click', showPasswordProtect);
        // 设置页面，自己开发时方便从 SpringBoot 项目直接导入数据
        if (develop) {
            document.getElementById('import-from-local-springboot').addEventListener('click', getStockAndFundFromLocalService);
        }
        // 设置页面，清理数据按钮点击
        document.getElementById('remove-all-data-button').addEventListener('click', removeAllData);
        // 设置页面，导入数据按钮点击展示导入数据页面
        document.getElementById('show-import-data').addEventListener('click', showImportData);
        // 设置页面，导出数据按钮点击展导出 txt 文件
        document.getElementById('data-export-button').addEventListener('click', dataExport);
        // 设置页面，价格监控提醒是否允许发送浏览器通知
        document.getElementById('send-chrome-notice-enable-button').addEventListener('click', enableChromeNotice);
        document.getElementById('send-chrome-notice-disable-button').addEventListener('click', enableChromeNotice);
        // 设置页面，点击云同步按钮
        document.getElementById('show-sync-data-button').addEventListener('click', showSyncData);
        
        // 云同步页面，向服务器同步数据/从服务器同步数据
        document.getElementById('sync-data-to-cloud-button').addEventListener('click', syncDataToCloud);
        document.getElementById('sync-data-from-cloud-button').addEventListener('click', syncDataFromCloud);

        // 打赏页面，点击微信
        document.getElementById("wechat-pay-button").addEventListener('click',  showDonate);
        // 打赏页面，点击支付宝
        document.getElementById("ali-pay-button").addEventListener('click',  showDonate);

        // 买/卖股票页面，点击买/卖
        document.getElementById("buy-or-sell-button").addEventListener('click',  buyOrSell);
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
                    // 可转债上市前加格默认为 0
                    if (parseFloat(values[3]) == 0 && (values[1].indexOf("发债") != -1 || values[1].indexOf("转债") != -1)) {
                        stockList[l].now = "100.00";
                    } else {
                        stockList[l].now = values[3] + "";
                    }
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
                    var income = parseFloat(incomeDiff.multiply(bonds) + "").toFixed(2);
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
                        if (fund.gszzl == "--" || fund.gszzl == '' || fund.gszzl == undefined || fund.gszzl == null) {
                            fundList[k].gszzl = "0";
                        } else if(cheatMeFlag && parseFloat(fund.gszzl) < 0) {
                            var gszzl = 0 - parseFloat(fund.gszzl);
                            fundList[k].gszzl = gszzl + "";
                        } else {
                            fundList[k].gszzl = fund.gszzl + "";
                        }
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
                            if (cheatMeFlag && parseFloat(fund.gszzl) < 0) {
                                var gszzl = 0 - parseFloat(fund.gszzl);
                                fundList[k].gszzl = gszzl + "";
                            } else {
                                fundList[k].gszzl = fund.gszzl + "";
                            }
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
                let currentURL = window.location.href;
                if (windowSize == 'MINI' && currentURL.indexOf('full-screen.html') == -1) {
                    $("#time-image-minute-button")[0].style.display = 'none';
                    $("#time-image-day-button")[0].style.display = 'none';
                    $("#time-image-week-button")[0].style.display = 'none';
                    $("#time-image-month-button")[0].style.display = 'none';
                    $("#stock-show-time-image-button")[0].style.display = 'none';
                    $("#show-buy-or-sell-button-2")[0].style.display = 'none';
                } else {
                    $("#time-image-minute-button")[0].style.display = 'inline';
                    $("#time-image-day-button")[0].style.display = 'inline';
                    $("#time-image-week-button")[0].style.display = 'inline';
                    $("#time-image-month-button")[0].style.display = 'inline';
                    $("#stock-show-time-image-button")[0].style.display = 'inline';
                    $("#show-buy-or-sell-button-2")[0].style.display = 'inline';
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
                $("#show-buy-or-sell-button-2")[0].style.display = 'none';
                let fundCode = $("#fund-code").val();
                timeImageCode = fundCode;
                timeImageType = "FUND";
                let currentURL = window.location.href;
                if (windowSize == 'MINI' && currentURL.indexOf('full-screen.html') == -1) {
                    $("#time-image-minute-button")[0].style.display = 'none';
                    $("#time-image-day-button")[0].style.display = 'none';
                    $("#time-image-week-button")[0].style.display = 'none';
                    $("#time-image-month-button")[0].style.display = 'none';
                } else {
                    $("#time-image-minute-button")[0].style.display = 'inline';
                    $("#time-image-day-button")[0].style.display = 'inline';
                    $("#time-image-week-button")[0].style.display = 'inline';
                    $("#time-image-month-button")[0].style.display = 'inline';
                }
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
    // 增加拖拽
    sortedByDrag();
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
        try {
            var buyOrSells = result[k].buyOrSellStockRequestList;
            var todayBuyIncom = new BigDecimal("0");
            var todaySellIncom = new BigDecimal("0");
            var maxBuyOrSellBonds = 0;
            for (var l in buyOrSells) {
                let beijingDate = getBeijingDate();
                // 当天购买过
                if (buyOrSells[l].type == "1" && beijingDate == buyOrSells[l].date) {
                    maxBuyOrSellBonds = maxBuyOrSellBonds + buyOrSells[l].bonds;
                    var buyIncome = (new BigDecimal(result[k].now))
                        .subtract(new BigDecimal(buyOrSells[l].price + ""))
                        .multiply(new BigDecimal(buyOrSells[l].bonds + ""))
                        .subtract(new BigDecimal(buyOrSells[l].cost + ""));
                    todayBuyIncom = todayBuyIncom.add(buyIncome);
                }
                // 当天卖出过
                if (buyOrSells[l].type == "2" && beijingDate == buyOrSells[l].date) {
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
            // 设置一下每个票的值，为了后边排序使用
            result[k].dayIncome = dayIncome + "";
            result[k].marketValue = marketValue + "";
            result[k].marketValuePercent = marketValuePercent + "";
            result[k].costPriceValue = costPriceValue + "";
            str += "<tr draggable=\"true\" id=\"stock-tr-" + k + "\">"
                + "<td class=\"stock-fund-name-and-code\">" + stockName + alertStyle + (codeDisplay == 'DISPLAY' ? "<br>" + result[k].code + "" : "") +  minuteImageMiniDiv + "</td>"
                + (dayIncomeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + parseFloat(dayIncome + "").toFixed(2) + "</td>" : "")
                + "<td " + dayIncomeStyle + ">" + result[k].changePercent + "%" + "</td>"
                + "<td>" + result[k].now + "</td>"
                + (costPriceDisplay == 'DISPLAY' ? "<td>" + result[k].costPrise + "</td>" : "")
                + (bondsDisplay == 'DISPLAY' ? "<td>" + result[k].bonds + "</td>" : "")
                + (marketValueDisplay == 'DISPLAY' ? "<td>" + parseFloat(marketValue + "").toFixed(2) + "</td>" : "")
                + (marketValuePercentDisplay == 'DISPLAY' ? "<td>" + marketValuePercent + "%</td>" : "")
                + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + costPriceValue + "</td>" : "")
                + (incomePercentDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].incomePercent + "%</td>" : "")
                + (incomeDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].income + "</td>" : "")
                + (addtimePriceDisplay == 'DISPLAY' ? "<td >" + addTimePrice + "</td>" : "")
                + "</tr>";
            stockTotalIncome = stockTotalIncome.add(new BigDecimal(result[k].income));
            stockDayIncome = stockDayIncome.add(dayIncome);
            stockTotalmarketValue = stockTotalmarketValue.add(marketValue);
        } catch (error) {
            console.error(error);
        }
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
    str += "<tr id=\"stock-tr-total\">"
        + "<td>合计</td>"
        + (dayIncomeDisplay == 'DISPLAY' ? "<td " + stockDayIncomePercentStyle + ">" + parseFloat(stockDayIncome + "").toFixed(2) + "</td>" : "") 
        + "<td " + stockDayIncomePercentStyle + ">" + parseFloat(stockDayIncomePercent + "").toFixed(2) + "%</td>"
        + "<td></td>"
        + (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
        + (bondsDisplay == 'DISPLAY' ? "<td></td>" : "") 
        + (marketValueDisplay == 'DISPLAY' ? "<td>" + parseFloat(stockTotalmarketValue + "").toFixed(2) + "</td>" : "") 
        + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
        + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + stockTotalCostValue + "</td>" : "") 
        + (incomePercentDisplay == 'DISPLAY' ? "<td " + stockTotalIncomePercentStyle + ">" + stockTotalIncomePercent + "%</td>" : "") 
        + (incomeDisplay == 'DISPLAY' ? "<td " + stockTotalIncomePercentStyle + ">" + stockTotalIncome + "</td>" : "") 
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
        try {
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
            // 设置一下每个基金的值，为了后边排序使用
            result[k].dayIncome = dayIncome + "";
            result[k].marketValue = marketValue + "";
            result[k].marketValuePercent = marketValuePercent + "";
            result[k].costPriceValue = costPriceValue + "";
            str += "<tr draggable=\"true\" id=\"fund-tr-" + k + "\">"
                + "<td class=\"stock-fund-name-and-code\">" + result[k].name + (codeDisplay == 'DISPLAY' ? "<br>" + result[k].fundCode + "" : "") + minuteImageMiniDiv + "</td>"
                + (dayIncomeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + dayIncome + "</td>" : "")
                + "<td " + dayIncomeStyle + ">" + result[k].gszzl + "%</td>"
                + "<td>" + result[k].gsz + "</td>"
                + (costPriceDisplay == 'DISPLAY' ? "<td>" + result[k].costPrise + "</td>" : "")
                + (bondsDisplay == 'DISPLAY' ? "<td>" + result[k].bonds + "</td>" : "")
                + (marketValueDisplay == 'DISPLAY' ? "<td>" + marketValue + "</td>" : "")
                + (marketValuePercentDisplay == 'DISPLAY' ? "<td>" + marketValuePercent + "%</td>" : "")
                + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + costPriceValue + "</td>" : "")
                + (incomePercentDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].incomePercent + "%</td>" : "")
                + (incomeDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].income + "</td>" : "")
                + (addtimePriceDisplay == 'DISPLAY' ? "<td>" + addTimePrice + "</td>" : "")
                + "</tr>";
            fundTotalIncome = fundTotalIncome.add(new BigDecimal(result[k].income));
            fundDayIncome = fundDayIncome.add(dayIncome);
            fundTotalmarketValue = fundTotalmarketValue.add(marketValue);
        } catch (error) {
            console.error(error);
        }
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
    str += "<tr id=\"fund-tr-total\">"
        + "<td>合计</td>"
        + (dayIncomeDisplay == 'DISPLAY' ? "<td " + fundDayIncomePercentStyle + ">" + fundDayIncome + "</td>" : "") 
        + "<td colspan='2' " + fundDayIncomePercentStyle + ">" + fundDayIncomePercent + "%</td>"
        + (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
        + (bondsDisplay == 'DISPLAY' ? "<td></td>" : "")
        + (marketValueDisplay == 'DISPLAY' ? "<td>" + fundTotalmarketValue + "</td>" : "") 
        + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" )
        + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + fundTotalCostValue + "</td>" : "") 
        + (incomePercentDisplay == 'DISPLAY' ? "<td " + fundTotalIncomePercentStyle + ">" + fundTotalIncomePercent + "%</td>" : "") 
        + (incomeDisplay == 'DISPLAY' ? "<td " + fundTotalIncomePercentStyle + ">" + fundTotalIncome + "</td>" : "") 
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
    str += "<tr id=\"total-tr-total\">"
        + "<td>汇总合计</td>"
        + (dayIncomeDisplay == 'DISPLAY' ? "<td " + allDayIncomePercentStyle + ">" + parseFloat(allDayIncome + "").toFixed(2) + "</td>" : "" )
        + "<td colspan='2' " + allDayIncomePercentStyle + ">" + parseFloat(allDayIncomePercent + "").toFixed(2) + "%</td>"
        + (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "" )
        + (bondsDisplay == 'DISPLAY' ? "<td></td>" : "" )
        + (marketValueDisplay == 'DISPLAY' ? "<td>" + parseFloat(totalMarketValueResult + "").toFixed(2) + "</td>" : "" )
        + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
        + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + totalCostPrice + "</td>" : "" ) 
        + (incomePercentDisplay == 'DISPLAY' ? "<td " + allTotalIncomePercentStyle + ">" + allTotalIncomePercent + "%</td>" : "" ) 
        + (incomeDisplay == 'DISPLAY' ? "<td " + allTotalIncomePercentStyle + ">" + allTotalIncome + "</td>" : "" ) 
        + (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
        + "</tr>";
    return str;
}

// 判断是否为纯数字
function isNumeric(str) {
    return str !== "" && !isNaN(Number(str));
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
        // 搜索可转债
        if (isNumeric(name)) {
            let stock = checkStockExsit("sh" + name);
            result =  "v_hint=\"";

            if (stock.checkReuslt) {
                result = result + "sh~" + name + "~" +stock.name;
            }
            stock = checkStockExsit("sz" + name);
            if (stock.checkReuslt) {
                if (result == "v_hint=\"") {
                    result = result + "sz~" + name + "~" +stock.name ;
                } else {
                    result = result  + "^" + "sz~" + name + "~" +stock.name ;
                }
            }
            if (result == "v_hint=\"") {
                alertMessage("不存在该股票");
                $("#stock-name").val("");
                return;
            }
        } else {
            alertMessage("不存在该股票");
            $("#stock-name").val("");
            return;
        }
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
        console.log("缓存超过 7 天，重新调用接口");
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
                alertMessage("请选择基金周期投资日期");
                return;
            }
            if (fundCycleInvestValue == null || fundCycleInvestValue == '') {
                alertMessage("请选择基金周期投资金额");
                return;
            }
            if (fundCycleInvestRate == null || fundCycleInvestRate == '') {
                alertMessage("请选择基金周期投资收益率");
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
    console.log("读取缓存 key = " + key + ", value = " + result);
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
            var option = $("<option></option>").val(values[0] + values[1].replace('.oq','').replace('.ps','').replace('.n','').toUpperCase()).text(A2U(values[2]) + " " + values[0] + values[1] + " （" + market + "）");
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

// 修改窗口大小
async function changeWindowSize(event) {
    let targetId = event.target.id;
    $("#setting-modal").modal("hide");
    var currentURL = window.location.href;
    if (currentURL.indexOf('full-screen.html') > 0) {
        alertMessage("当前在全屏，无法设置窗口大小");
        return;
    }
    // 添加class样式
    if (targetId == 'window-normal-size-change-button') {
        saveCacheData('window-size', 'NORMAL');
        windowSize = 'NORMAL';
    } else if (targetId == 'window-small-size-change-button') {
        saveCacheData('window-size', 'SMALL');
        windowSize = 'SMALL';
    } else {
        saveCacheData('window-size', 'MINI');
        windowSize = 'MINI';
    }
    initWindowsSize();
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
}

// 修改窗口大小，普通/缩小/迷你
async function initWindowsSize() {
    var currentURL = window.location.href;
    if (currentURL.indexOf('full-screen.html') > 0) {
        return;
    }
    let myDiv = document.getElementById('my-div');
    let myInputGroup = document.getElementById('my-input-group');
    let stockLargeMarket = document.getElementById('stock-large-market');
    let footer = document.getElementById('footer');
    let myHeader = document.getElementById('my-header');
    let myBody = document.getElementById('my-body');
    let alertContent = document.getElementById('alert-content');
    let helpDocumentAlert = document.getElementById('help-document-alert');
    let myMainContent = document.getElementById('my-main-content');
    let myWindows = document.getElementById('my-widnwos');
    let footerDesc = document.getElementById('footer-desc');
    let helpDocumentButton = document.getElementById('help-document-button');
    let fundNetDiagramDiv = document.getElementById('fund-net-diagram');
    let fullScreenButton2 = document.getElementById('full-screen-button-2');
    // let timeImageButton = document.getElementById('time-image-button');
    let showBuyOrSellButton = document.getElementById('show-buy-or-sell-button');
    let showBuyOrSellButton2 = document.getElementById('show-buy-or-sell-button-2');
    let showWechatGroupButton = document.getElementById('show-wechat-group-button');
    if (windowSize == 'NORMAL') {
        // 设置首页各项内容宽度 800px
        myWindows.style.width = '800px';
        myHeader.style.width = '800px';
        footer.style.width = '800px';
        stockLargeMarket.style.width = '800px';
        myInputGroup.style.width = '800px';
        myDiv.style.width = '800px';
        myBody.style.width = '800px';
        myMainContent.style.width = '800px';
        myMainContent.style.height = '100%';
        myDiv.style.height = '450px';
        helpDocumentAlert.style.width = '800px';
        fundNetDiagramDiv.style.width = '540px';
        fundNetDiagramDiv.style.height = '350px';
        helpDocumentButton.style.display = "inline";
        fullScreenButton2.style.display = "inline";
        // timeImageButton.style.display = "inline";
        showBuyOrSellButton.style.display = "inline";
        showBuyOrSellButton2.style.display = "inline";
    } else if (windowSize == 'SMALL') {
        // 设置首页各项内容宽度 600px
        myWindows.style.width = '600px';
        myHeader.style.width = '600px';
        footer.style.width = '600px';
        stockLargeMarket.style.width = '600px';
        myInputGroup.style.width = '600px';
        myDiv.style.width = '600px';
        myBody.style.width = '600px';
        myMainContent.style.width = '600px';
        myMainContent.style.height = '450px';
        myDiv.style.height = '450px';
        helpDocumentAlert.style.width = '600px';
        fundNetDiagramDiv.style.width = '540px';
        fundNetDiagramDiv.style.height = '350px';
        helpDocumentButton.style.display = "inline";
        fullScreenButton2.style.display = "inline";
        // timeImageButton.style.display = "inline";
        showBuyOrSellButton.style.display = "inline";
        showBuyOrSellButton2.style.display = "inline";
    } else if (windowSize == 'MINI') {
        // 设置首页各项内容宽度 400px
        myWindows.style.width = '400px';
        myHeader.style.width = '400px';
        footer.style.width = '400px';
        stockLargeMarket.style.width = '400px';
        myInputGroup.style.width = '400px';
        myDiv.style.width = '400px';
        myBody.style.width = '400px';
        myMainContent.style.width = '400px';
        myMainContent.style.height = '450px';
        myDiv.style.height = '450px';
        helpDocumentAlert.style.width = '400px';
        fundNetDiagramDiv.style.width = '400px';
        fundNetDiagramDiv.style.height = '200px';
        helpDocumentButton.style.display = "none";
        fullScreenButton2.style.display = "none";
        // timeImageButton.style.display = "none";
        showBuyOrSellButton.style.display = "none";
        showBuyOrSellButton2.style.display = "none";
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
            continue;
        }
        for (var k = 0; k < result.data.trends.length; k++) {
            let str = result.data.trends[k];
            dataStr.push(parseFloat(str.split(",")[1]));
            if (k == result.data.trends.length - 1) {
                now = dataStr[k];
            }
        }
        if(dataStr.length == 0){
            continue;
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
            continue;
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
async function changeBlueRed(event) {
    let targetId = event.target.id;
    if (targetId == 'change-blue-red-button') {
        if (blueColor == '#3e8f3e') {
            blueColor = '#c12e2a';
        } else if (blueColor == '#c12e2a') {
            blueColor = '#3e8f3e';
        } else { // 隐身模式下，变为红绿模式
            blueColor = '#3e8f3e'; 
        }
        if (redColor == '#c12e2a') {
            redColor = '#3e8f3e';
        } else if (redColor == '#3e8f3e') {
            redColor = '#c12e2a';
        } else { // 隐身模式下，变为红绿模式
            redColor = '#c12e2a';
        }
    } else if (targetId == 'change-black-button'){
        if (blueColor == '#545454') {// 已经是隐身模式了点击变更为红绿模式
            blueColor = '#3e8f3e'; 
            redColor = '#c12e2a';
        } else { // 红绿模式下点击变更为隐身模式
            blueColor = '#545454'; 
            redColor = '#545454';
        }
        changeBlackButton();
    }
    $("#setting-modal").modal("hide");
    saveCacheData('redColor', redColor);
    saveCacheData('blueColor', blueColor);
    initData();
    initLargeMarketData();
}

// 欺骗自己，愣是把当日亏损变成盈利
async function cheatMe() {
    $("#setting-modal").modal("hide");
    if(cheatMeFlag) {
        cheatMeFlag = false;
    } else if(!cheatMeFlag) {
        cheatMeFlag = true;
    }
    await saveCacheData('cheatMeFlag', cheatMeFlag);
    initData();
}

// 切换展示股票/基金/全部
async function changeShowStockOrFundOrAll(event) {
    let type;
    if (event.target.id == 'show-all-button') {
        type = 'all';
    } else if (event.target.id == 'show-stock-button') {
        type = 'stock';
    } else if (event.target.id == 'show-fund-button') {
        type = 'fund';
    }
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
    chrome.tabs.create({ url: "full-screen.html" });
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
    let now = stock.now;
    if (now.length >= 5) {
        now = parseFloat(now.substring(0, 5));
    }
    chrome.action.setBadgeText({ text: "" + now });
    saveCacheData("MONITOR_STOCK_CODE", code);
}

// 清理角标
async function removeBadgeText() {
    saveCacheData("MONITOR_STOCK_CODE", '');
    chrome.action.setBadgeText({ text: '' });
}

// 获取基金持仓明细
async function getFundInversPosition() {
    let code = timeImageCode;
    code = code.replace('sz','').replace('sh','');
    let fundStocks = ajaxGetFundInvesterPosition(code);
    if (fundStocks == null || fundStocks == '' || fundStocks == []) {
        fundStocks = ajaxGetFundPositionList(code);
        for (k in fundStocks) {
            fundStocks[k].GPDM = fundStocks[k].ShareCode;
            fundStocks[k].JZBL = fundStocks[k].ShareProportion;
        }
        if (fundStocks == null || fundStocks == '' || fundStocks == []) {
            return;
        }
    }
    let fundStocksArr = '';
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
        str += "<tr id=\"fund-stock-detail-tr-" + k + "\">"
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
    // 设置监听点击持仓明细事件
    for (k in fundStocksDetail) {
        let fundStocksDetailTr = document.getElementById('fund-stock-detail-tr-' + k);
        fundStocksDetailTr.addEventListener('click', async function () {
            var result = confirm("是否添加" + fundStocksDetail[this.sectionRowIndex].f14 + "?");
            if (result) {
                let stockCode = fundStocksDetail[this.sectionRowIndex].f12;
                if (stockCode.length == 6 && stockCode.startsWith("6")) {
                    stockCode = "sh" + stockCode;
                } else if (stockCode.length == 6 && (stockCode.startsWith("0") || stockCode.startsWith("3"))) {
                    stockCode = "sz" + stockCode;
                } else if(stockCode.length == 5) {
                    stockCode = "hk" + stockCode;
                }
                $("#stock-code").val(stockCode);
                $("#stock-costPrise").val('');
                $("#stock-bonds").val('');
                $("#stock-monitor-high-price").val('');
                $("#stock-monitor-low-price").val('');
                await saveStock();
                $("#stock-code").val('');
                $("#fund-invers-position-modal").modal("hide");
            }
        });
    }
}

// 展示历史净值
async function setFundNetDiagram(event) {
    let targetId = event.target.id;
    let type = 'MONTH';
    let interval = 6;
    if (targetId == 'fund-net-diagram-month-button') {
        type = 'MONTH';
        interval = 6;
    } else if (targetId == 'fund-net-diagram-3month-button') {
        type = '3MONTH';
        interval = 18;
    } else if (targetId == 'fund-net-diagram-6month-button') {
        type = '6MONTH';
        interval = 36;
    } else if (targetId == 'fund-net-diagram-year-button') {
        type = 'YEAR';
        interval = 72;
    } else if (targetId == 'fund-net-diagram-3year-button') {
        type = '3YEAR';
        interval = 216;
    } else if (targetId == 'fund-net-diagram-5year-button') {
        type = '5YEAR';
        interval = 360;
    } else if (targetId == 'fund-net-diagram-allyear-button') {
        type = 'ALLYEAR';
    }
    let code = timeImageCode;
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
    if (targetId == 'fund-net-diagram-allyear-button') {
        interval = Math.floor(fundNetDiagram.length / 3);
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
        ],
        // 添加事件监听器，鼠标放在上面显示横纵坐标值
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#999999',
                width: 1,
                type: 'solid'
            }
            },
            formatter: function(params) {
            if (params.length > 0) {
                var outputContent = "";
                if(params.length > 1) {
                    outputContent = "日期：" + params[0].name + "<br>" + params[0].seriesName + "：" + params[0].value + "<br>" + params[1].seriesName + "：" + params[1].value;
                } else {
                    outputContent = "日期：" + params[0].name + "<br>" + params[0].seriesName + "：" + params[0].value;
                }
                return outputContent;
            }
            return '';
            }
        },
    };
    myChart.setOption(option);
    $("#fund-net-diagram-modal").modal();
    $("#stock-modal").modal("hide");
    $("#fund-modal").modal("hide");
    $("#time-image-modal").modal("hide");
}

// 设定股票/基金详情隐藏/展示某些列
async function setDisplayTr(event) {
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
    } else if(type == 'code-display-checkbox') {
        codeDisplay = dispaly;
        saveCacheData('code-display', dispaly);
    } else if(type == 'cost-price-value-display-checkbox') {
        costPriceValueDisplay = dispaly;
        saveCacheData('cost-price-value-display', dispaly);
    } else if(type == 'income-percent-display-checkbox') {
        incomePercentDisplay = dispaly;
        saveCacheData('income-percent-display', dispaly);
    } else if(type == 'addtime-price-display-checkbox') {
        addtimePriceDisplay = dispaly;
        saveCacheData('addtime-price-display', dispaly);
    } else if(type == 'day-income-display-checkbox') {
        dayIncomeDisplay = dispaly;
        saveCacheData('day-income-display', dispaly);
    } else if(type == 'cost-price-display-checkbox') {
        costPriceDisplay = dispaly;
        saveCacheData('cost-price-display', dispaly);
    } else if(type == 'bonds-display-checkbox') {
        bondsDisplay = dispaly;
        saveCacheData('bonds-display', dispaly);
    } else if(type == 'income-display-checkbox') {
        incomeDisplay = dispaly;
        saveCacheData('income-display', dispaly);
    } else if(type == 'all-display-checkbox'){
        $("#setting-modal").modal("hide");
        marketValueDisplay = dispaly;
        marketValuePercentDisplay = dispaly;
        costPriceValueDisplay = dispaly;
        incomePercentDisplay = dispaly;
        addtimePriceDisplay = dispaly;
        dayIncomeDisplay = dispaly;
        costPriceDisplay = dispaly;
        bondsDisplay = dispaly;
        incomeDisplay = dispaly;
        codeDisplay = dispaly;
        saveCacheData('all-display', dispaly);
        saveCacheData('code-display', dispaly);
        saveCacheData('market-value-display', dispaly);
        saveCacheData('market-value-percent-display', dispaly);
        saveCacheData('cost-price-value-display', dispaly);
        saveCacheData('income-percent-display', dispaly);
        saveCacheData('addtime-price-display', dispaly);
        saveCacheData('day-income-display', dispaly);
        saveCacheData('cost-price-display', dispaly);
        saveCacheData('bonds-display', dispaly);
        saveCacheData('income-display', dispaly);
        if(dispaly == 'DISPLAY') {
            $("#all-display-checkbox").prop("checked", true);
            $("#code-display-checkbox").prop("checked", true);
            $("#market-value-display-checkbox").prop("checked", true);
            $("#market-value-percent-display-checkbox").prop("checked", true);
            $("#cost-price-value-display-checkbox").prop("checked", true);
            $("#income-percent-display-checkbox").prop("checked", true);
            $("#addtime-price-display-checkbox").prop("checked", true);
            $("#day-income-display-checkbox").prop("checked", true);
            $("#cost-price-display-checkbox").prop("checked", true);
            $("#bonds-display-checkbox").prop("checked", true);
            $("#income-display-checkbox").prop("checked", true);
        } else {
            $("#all-display-checkbox").prop("checked", false);
            $("#code-display-checkbox").prop("checked", false);
            $("#market-value-display-checkbox").prop("checked", false);
            $("#market-value-percent-display-checkbox").prop("checked", false);
            $("#cost-price-value-display-checkbox").prop("checked", false);
            $("#income-percent-display-checkbox").prop("checked", false);
            $("#addtime-price-display-checkbox").prop("checked", false);
            $("#day-income-display-checkbox").prop("checked", false);
            $("#cost-price-display-checkbox").prop("checked", false);
            $("#bonds-display-checkbox").prop("checked", false);
            $("#income-display-checkbox").prop("checked", false);
        }
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

// 从本地 SpringBoot 项目获取数据
function getStockAndFundFromLocalService () {
    let result = ajaxGetStockAndFundFromLocalService();
    if (result != null && result != '' && result != undefined) {
        saveCacheData('stocks', JSON.stringify(result.stocks));
        saveCacheData('funds', JSON.stringify(result.funds));
        location.reload();
    }
}

// 删除基金或股票
async function deleteStockAndFund() {
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
        $("#fund-modal").modal("hide");
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
        $("#stock-modal").modal("hide");
        location.reload();
    }
}

// 展示分时图
function showTimeImage(event) {
    let targetId = event.target.id;
    if (targetId == 'fund-show-time-image-button') {
        timeImageCode = $("#fund-code").val();
        timeImageType = "FUND";
    } else {
        timeImageCode = $("#stock-code").val();
        timeImageType = "STOCK";
    }
    showMinuteImage();
}

// 搜索股票基金输入框，点击回车搜索股票基金
async function clickSearchFundAndStockButton(event) {
    if (event.key === 'Enter') {
        searchFundAndStock();
    }
}

// 展示打赏码
async function showDonate(event) {
    let path;
    let targetId = event.target.id;
    if (targetId == 'ali-pay-button') {
        path = Env.ALI_PAY_QR_CODE;
    } else {
        path = Env.WECHAT_PAY_QR_CODE;
    }
    $("#donate-qr-code-image").html('<img src="' + path + '" width="60%" length="60%" />');
    $("#setting-modal").modal('hide');
    $("#donate-modal").modal();
}

// 大盘滚动/停止设定
async function largeMarketScrollChange(event) {
    let targetId = event.target.id;
    if (targetId == 'large-market-scrool-button') {
        largeMarketScroll = 'SCROOL';
    } else {
        largeMarketScroll = 'STOP';
    }
    saveCacheData('large-market-scrool', largeMarketScroll);
    $("#fund-modal").modal("hide");
    location.reload();
}

// 监控价格是否允许推送浏览器通知
async function enableChromeNotice(event) {
    let targetId = event.target.id;
    if (targetId == 'send-chrome-notice-enable-button') {
        saveCacheData('send-chrome-notice-enable', true);
    } else {
        saveCacheData('send-chrome-notice-enable', false);
    }
    $("#setting-modal").modal("hide");
}

// 置顶股票基金
async function setTop() {
    // 基金编辑页面/基金分时图页面点击置顶
    if (timeImageType == 'FUND') {
        var funds = await readCacheData('funds');
        funds = jQuery.parseJSON(funds);
        let currentFund;
        for (var k in funds) {
            if (funds[k].fundCode == timeImageCode) {
                currentFund = funds[k];
                funds.splice(k, 1)
                break;
            }
        }
        funds.unshift(currentFund);
        saveCacheData('funds', JSON.stringify(funds));
    // 股票编辑页面/股票分时图页面点击置顶
    } else {
        var stocks = await readCacheData('stocks');
        stocks = jQuery.parseJSON(stocks);
        let currentStock;
        for (var k in stocks) {
            if (stocks[k].code == timeImageCode) {
                currentStock = stocks[k];
                stocks.splice(k, 1)
                break;
            }
        }
        stocks.unshift(currentStock);
        saveCacheData('stocks', JSON.stringify(stocks));
    }
    $("#time-image-modal").modal("hide");
    $("#stock-modal").modal("hide");
    location.reload();
}

// 从云服务器获取数据
async function syncDataFromCloud() {
    let syncDataCloudUuid = $("#sync-data-cloud-uuid").val();
    if (syncDataCloudUuid == null || syncDataCloudUuid == '') {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("请输入云同步唯一标识");
        return;
    }
    saveCacheData('sync-data-cloud-uuid', syncDataCloudUuid);
    let result = ajaxSyncDataFromCloud(syncDataCloudUuid);
    if (result != null && result != '' && result != undefined) {
        var checkResult = confirm("这些云同步数据是在" + result.updateTime + "同步的，是否确认是您本人同步的数据？");
        if (checkResult) {
            saveCacheData('stocks', JSON.stringify(result.stocks));
            saveCacheData('funds', JSON.stringify(result.funds));
            location.reload();
        } else {
            $("#sync-data-cloud-modal").modal('hide');
            alertMessage("您取消了云同步");
        }
    } else {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("云同步数据不存在!");
    }
}

// 向云服务器存储数据
async function syncDataToCloud() {
    var checkResult = confirm("您是否要同步数据到云服务器？");
    if (!checkResult) {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("您取消了云同步");
        return;
    }
    let syncDataCloudUuid = $("#sync-data-cloud-uuid").val();
    if (syncDataCloudUuid == null || syncDataCloudUuid == '') {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("请输入云同步唯一标识");
        return;
    }
    saveCacheData('sync-data-cloud-uuid', syncDataCloudUuid);
    var data = {};
    let syncStocks = [];
    let syncFunds = [];
    for (k in stockList) {
        let syncStock = {
            "code" : stockList[k].code,
            "costPrise" : stockList[k].costPrise,
            "bonds" : stockList[k].bonds,
            "monitorHighPrice" : stockList[k].monitorHighPrice,
            "monitorLowPrice" : stockList[k].monitorLowPrice
        }
        syncStocks.push(syncStock);
    }
    for (k in fundList) {
        let syncFund = {
            "fundCode" : fundList[k].fundCode,
            "costPrise" : fundList[k].costPrise,
            "bonds" : fundList[k].bonds
        }
        syncFunds.push(syncFund);
    }
    data.stocks = syncStocks;
    data.funds = syncFunds;
    data.updateTime = getBeijingTime();
    let result = ajaxSyncDataToCloud(JSON.stringify(data), syncDataCloudUuid);
    saveCacheData('sync-data-cloud-uuid', syncDataCloudUuid);
    if (result == 'fail') {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("云同步失败，请检查网络是否可以访问云服务器");
    } else {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("云同步成功");
    }
}

// 展示云同步页面
async function showSyncData() {
    let syncDataCloudUuid = await readCacheData('sync-data-cloud-uuid');
    if (syncDataCloudUuid !='' && syncDataCloudUuid != null && syncDataCloudUuid != undefined) {
        $("#sync-data-cloud-uuid").val(syncDataCloudUuid);
    } else {
        $("#sync-data-cloud-uuid").val(generateRandomUUID());
    }
    $("#setting-modal").modal('hide');
    $("#sync-data-cloud-modal").modal();
}

// 生成uuid
function generateRandomUUID() {
    var chars = '0123456789abcdef';
    var uuid = '';
    for (var i = 0; i < 32; i++) {
        var randomIndex = Math.floor(Math.random() * 16);
        uuid += chars[randomIndex];
        if (i === 7 || i === 11 || i === 15 || i === 19) {
          uuid += '-';
        }
    }
    return uuid;
}

// 获取北京时间格式的日期时间
function getBeijingTime() {
    var date = new Date();
    var options = {
      timeZone: 'Asia/Shanghai',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return date.toLocaleString('zh-CN', options);
}

// 获取北京时间格式的日期
function getBeijingDate() {
    let date = new Date();
    let options = {
      timeZone: 'Asia/Shanghai',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    let formattedDate = date.toLocaleString('zh-CN', options);
    return formattedDate.replace(/\//g, '-');
}

// 展示买/卖股票页面
async function showBuyOrSell(event) {
    let targetId = event.target.id;
    if (targetId == 'show-buy-button' || targetId == 'show-buy-button-2') {
        $("#buy-or-sell-type").val("1");
    } else {
        $("#buy-or-sell-type").val("2");
    }
    let stockCode = timeImageCode;
    let stockName = '';
    for (var k in stockList) {
        if (stockList[k].code == stockCode) {
            stockName = stockList[k].name;
            break;
        }
    }
    $("#buy-or-sell-name").val(stockName);
    if (stockName.endsWith('ETF')) {
        $("#buy-or-sell-cost").val(0);
    } else {
        $("#buy-or-sell-cost").val(5);
    }
    $("#buy-or-sell-price").val('');
    $("#buy-or-sell-handle-bonds").val('100');
    $("#time-image-modal").modal("hide");
    $("#stock-modal").modal("hide");
    $("#buy-or-sell-modal").modal();
}

// 买/卖股票计算该笔操作盈亏以及设定新成本，新持仓数等
async function buyOrSell() {
    let stock;
    let stockCode = timeImageCode;
    let type = $("#buy-or-sell-type").val();
    let handleBonds = $("#buy-or-sell-handle-bonds").val();
    let price = $("#buy-or-sell-price").val();
    let cost = $("#buy-or-sell-cost").val();
    for (var k in stockList) {
        if (stockList[k].code == stockCode) {
            stock = stockList[k];
            break;
        }
    }
    // 卖出时判断是否有足够的仓位
    if (type == '2' && parseFloat(handleBonds) > parseFloat(stock.bonds)) {
        $("#buy-or-sell-modal").modal("hide");
        alertMessage('超出可以卖的股数！');
    }
    // 保存buyOrSell
    let buyOrSell = {};
    let buyDate = getBeijingDate();
    buyOrSell.date = buyDate;
    buyOrSell.bonds = handleBonds;
    buyOrSell.price = price;
    buyOrSell.cost = cost;
    buyOrSell.type = type;
    if (type == '2') {
        let stockNow = checkStockExsit(stockCode);
        let now = new BigDecimal(stockNow.now + "");
        let change = new BigDecimal(stockNow.change + "");
        let openPrice = now.subtract(change);
        let income = (new BigDecimal(price + "")).subtract(openPrice)
            .multiply(new BigDecimal(handleBonds + "")).subtract(new BigDecimal(cost + ""));
        buyOrSell.income = income + "";
    } else {
        buyOrSell.income = 0;
    }
    let buyOrSellStockRequestList = stock.buyOrSellStockRequestList;
    if (buyOrSellStockRequestList == null || buyOrSellStockRequestList == [] || buyOrSellStockRequestList == undefined) {
        buyOrSellStockRequestList = [];
    }
    buyOrSellStockRequestList.push(buyOrSell);
    stock.buyOrSellStockRequestList = buyOrSellStockRequestList;
    // 买入重新计算成本以及持仓
    if(type == '1') {
        let restBound;
        let newCostPrice;
        // 之前未持有
        if(parseInt(stock.bonds) == 0) {
            restBound = parseInt(handleBonds);
            newCostPrice = (new BigDecimal(buyOrSell.price + "")).multiply(new BigDecimal(buyOrSell.bonds + ""))
            .add(new BigDecimal(cost + ""))
            .divide(new BigDecimal(restBound + ""), 3, BigDecimal.ROUND_DOWN);
        } else { // 之前持有
            restBound = parseInt(stock.bonds) + parseInt(handleBonds);
            let newBuyTotalFee = (new BigDecimal(buyOrSell.price + "")).multiply(new BigDecimal(buyOrSell.bonds + ""))
                .add(new BigDecimal(buyOrSell.cost + ""));
            newCostPrice = new BigDecimal(stock.costPrise + "").multiply(new BigDecimal(stock.bonds + "")).add(newBuyTotalFee)
                .divide(new BigDecimal(restBound + ""), 3, BigDecimal.ROUND_DOWN);
        }
        stock.bonds = restBound + "";
        stock.costPrise = newCostPrice + "";
    } else {// 卖出重新计算成本以及持仓
        let restBound = parseInt(stock.bonds) - parseInt(handleBonds);
        let newSellTotalFee = (new BigDecimal(buyOrSell.price + "")).multiply(new BigDecimal(buyOrSell.bonds + ""))
            .subtract(new BigDecimal(buyOrSell.cost + ""));
        let newCostPrice = new BigDecimal("0");
        if (restBound != 0) {
            newCostPrice = (new BigDecimal(stock.costPrise + "")).multiply(new BigDecimal(stock.bonds + ""))
                .subtract(newSellTotalFee).divide(new BigDecimal(restBound + ""), 3, BigDecimal.ROUND_DOWN);
        }
        stock.bonds = restBound + "";
        stock.costPrise = newCostPrice + "";
    }
    saveCacheData('stocks', JSON.stringify(stockList));
    $("#buy-or-sell-modal").modal("hide");
    initData();
}

// 拖拽股票基金后，调整位置
function sortedByDrag() {
    var sortableTable = document.getElementById("sortable-table");
    var rows = sortableTable.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("dragSrouceId", event.target.id);
        });
        rows[i].addEventListener("dragover", function(event) {
            event.preventDefault();
        });
        rows[i].addEventListener("drop", function(event) {
            var sourceId = event.dataTransfer.getData("dragSrouceId").split('-');
            var targetId = event.currentTarget.id.split('-');
            let dragType = sourceId[0];
            let sourceIndex = sourceId[2];
            let targetIndex = targetId[2];
            let dragTargetType = targetId[0];
            if (targetIndex == '' || targetIndex == null || targetIndex == undefined) {
                console.log("位置有问题");
                return;
            }
            if (dragType == 'fund') {
                if (dragTargetType == 'stock' || targetIndex == 'title') {
                    targetIndex = 0;
                } else if (targetIndex == 'total') {
                    targetIndex = fundList.length - 1;
                }
                let currentFund = fundList[sourceIndex];
                fundList.splice(sourceIndex, 1);
                fundList.splice(targetIndex, 0, currentFund);
                saveCacheData('funds', JSON.stringify(fundList));
            } else {
                if (dragTargetType == 'stock'  && targetIndex == 'title') {
                    targetIndex = 0;
                }
                if (dragTargetType == 'fund' || targetIndex == 'total') {
                    targetIndex = stockList.length - 1;
                } 
                let currentStock = stockList[sourceIndex];
                stockList.splice(sourceIndex, 1);
                stockList.splice(targetIndex, 0, currentStock);
                saveCacheData('stocks', JSON.stringify(stockList));
            }
            initData();
        });
    }
}

async function addStockFromTonghuashunXueqiu() {
    let data = await readCacheData('tonghuashun-xueqiu-stock');
    console.log('从同花顺/雪球/东方财富导入的数据：', data );
    let stocks = await readCacheData('stocks');
    if (stocks == null) {
        stocks = [];
    } else {
        stocks = jQuery.parseJSON(stocks);
    }
    for (let k in data) {
        let code = data[k];
        let stock = {
            "code": code,
            "costPrise": "0",
            "bonds": "0"
        }
        let existInStockList = false;
        for (let l in stocks) {
            if (stocks[l].code == stock.code) {
                existInStockList = true;
                break;
            }
        }
        if (existInStockList) {
            continue;
        }
        let checkStockExsitResult = checkStockExsit(stock.code);
        if (!checkStockExsitResult.checkReuslt) {
            alertMessage("不存在该股票" + stock.code);
            continue;
        }
        stock.addTimePrice = checkStockExsitResult.now;
        stock.addTime = getCurrentDate();
        stocks.push(stock);
    }
    saveCacheData('stocks', JSON.stringify(stocks));
    stockList = stocks;
    $("#setting-modal").modal("hide");
    initData();
}

function changeBlackButton() {
    let btnLightCss = 'btn-light';
    let btnOutlinePrimaryCss = 'btn-outline-primary';
    let btnInfoCss = 'btn-info';
    let blackCss = '';
    let blackOutlineCss = '';
    if (blueColor == '#545454') {
        blackCss = btnLightCss;
        blackOutlineCss = btnLightCss;
    } else {
        blackCss = btnInfoCss;
        blackOutlineCss = btnOutlinePrimaryCss;
    }
    document.getElementById('show-all-button').classList.remove(btnInfoCss);
    document.getElementById('show-all-button').classList.remove(btnLightCss);
    document.getElementById('show-all-button').classList.add(blackCss);

    document.getElementById('show-stock-button').classList.remove(btnInfoCss);
    document.getElementById('show-stock-button').classList.remove(btnLightCss);
    document.getElementById('show-stock-button').classList.add(blackCss);

    document.getElementById('show-fund-button').classList.remove(btnInfoCss);
    document.getElementById('show-fund-button').classList.remove(btnLightCss);
    document.getElementById('show-fund-button').classList.add(blackCss);

    document.getElementById('refresh-button').classList.remove(btnInfoCss);
    document.getElementById('refresh-button').classList.remove(btnLightCss);
    document.getElementById('refresh-button').classList.add(blackCss);

    document.getElementById('remove-badgetext-button').classList.remove(btnInfoCss);
    document.getElementById('remove-badgetext-button').classList.remove(btnLightCss);
    document.getElementById('remove-badgetext-button').classList.add(blackCss);

    document.getElementById('show-setting-button').classList.remove(btnOutlinePrimaryCss);
    document.getElementById('show-setting-button').classList.remove(btnLightCss);
    document.getElementById('show-setting-button').classList.add(blackOutlineCss);

    document.getElementById('full-screen-button-2').classList.remove(btnOutlinePrimaryCss);
    document.getElementById('full-screen-button-2').classList.remove(btnLightCss);
    document.getElementById('full-screen-button-2').classList.add(blackOutlineCss);

    document.getElementById('show-wechat-group-button').classList.remove(btnOutlinePrimaryCss);
    document.getElementById('show-wechat-group-button').classList.remove(btnLightCss);
    document.getElementById('show-wechat-group-button').classList.add(blackOutlineCss);

    document.getElementById('help-document-button').classList.remove(btnOutlinePrimaryCss);
    document.getElementById('help-document-button').classList.remove(btnLightCss);
    document.getElementById('help-document-button').classList.add(blackOutlineCss);

    document.getElementById('show-donate-button-2').classList.remove(btnOutlinePrimaryCss);
    document.getElementById('show-donate-button-2').classList.remove(btnLightCss);
    document.getElementById('show-donate-button-2').classList.add(blackOutlineCss);

}

// 对股票/基金的某一列排序
function sortStockAndFund(event) {
    let targetId = event.target.id;
    if (sortType == 'ASC') {
        sortType = 'DESC';
    } else {
        sortType = 'ASC';
    }
    if (targetId.indexOf('stock-') >= 0) {
        stockList.sort(function (a, b) {
            if (targetId == 'stock-name-th') {
                if(sortType == 'ASC'){
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            } else if (targetId == 'stock-day-income-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.dayIncome + "") - parseFloat(b.dayIncome + "");
                } else {
                    return parseFloat(b.dayIncome + "") - parseFloat(a.dayIncome + "");
                }
            } else if (targetId == 'stock-change-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.changePercent + "") - parseFloat(b.changePercent + "");
                } else {
                    return parseFloat(b.changePercent + "") - parseFloat(a.changePercent + "");
                }
            } else if (targetId == 'stock-price-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.now + "") - parseFloat(b.now + "");
                } else {
                    return parseFloat(b.now + "") - parseFloat(a.now + "");
                }
            } else if (targetId == 'stock-cost-price-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.costPrise + "") - parseFloat(b.costPrise + "");
                } else {
                    return parseFloat(b.costPrise + "") - parseFloat(a.costPrise + "");
                }
            } else if (targetId == 'stock-bonds-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.bonds + "") - parseFloat(b.bonds + "");
                } else {
                    return parseFloat(b.bonds + "") - parseFloat(a.bonds + "");
                }
            } else if (targetId == 'stock-market-value-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.marketValue + "") - parseFloat(b.marketValue + "");
                } else {
                    return parseFloat(b.marketValue + "") - parseFloat(a.marketValue + "");
                }
            } else if (targetId == 'stock-market-value-percent-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.marketValuePercent + "") - parseFloat(b.marketValuePercent + "");
                } else {
                    return parseFloat(b.marketValuePercent + "") - parseFloat(a.marketValuePercent + "");
                }
            } else if (targetId == 'stock-cost-price-value-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.costPriceValue + "") - parseFloat(b.costPriceValue + "");
                } else {
                    return parseFloat(b.costPriceValue + "") - parseFloat(a.costPriceValue + "");
                }
            } else if (targetId == 'stock-income-percent-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.incomePercent + "") - parseFloat(b.incomePercent + "");
                } else {
                    return parseFloat(b.incomePercent + "") - parseFloat(a.incomePercent + "");
                }
            } else if (targetId == 'stock-income-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.income + "") - parseFloat(b.income + "");
                } else {
                    return parseFloat(b.income + "") - parseFloat(a.income + "");
                }
            } else {
                return 0;
            }
        })
        saveCacheData('stocks', JSON.stringify(stockList));
    } else {
        fundList.sort(function (a, b) {
            if (targetId == 'fund-name-th') {
                if(sortType == 'ASC'){
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            } else if (targetId == 'fund-day-income-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.dayIncome + "") - parseFloat(b.dayIncome + "");
                } else {
                    return parseFloat(b.dayIncome + "") - parseFloat(a.dayIncome + "");
                }
            } else if (targetId == 'fund-change-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.gszzl + "") - parseFloat(b.gszzl + "");
                } else {
                    return parseFloat(b.gszzl + "") - parseFloat(a.gszzl + "");
                }
            } else if (targetId == 'fund-price-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.gsz + "") - parseFloat(b.gsz + "");
                } else {
                    return parseFloat(b.gsz + "") - parseFloat(a.gsz + "");
                }
            } else if (targetId == 'fund-cost-price-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.costPrise + "") - parseFloat(b.costPrise + "");
                } else {
                    return parseFloat(b.costPrise + "") - parseFloat(a.costPrise + "");
                }
            } else if (targetId == 'fund-bonds-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.bonds + "") - parseFloat(b.bonds + "");
                } else {
                    return parseFloat(b.bonds + "") - parseFloat(a.bonds + "");
                }
            } else if (targetId == 'fund-market-value-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.marketValue + "") - parseFloat(b.marketValue + "");
                } else {
                    return parseFloat(b.marketValue + "") - parseFloat(a.marketValue + "");
                }
            } else if (targetId == 'fund-market-value-percent-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.marketValuePercent + "") - parseFloat(b.marketValuePercent + "");
                } else {
                    return parseFloat(b.marketValuePercent + "") - parseFloat(a.marketValuePercent + "");
                }
            } else if (targetId == 'fund-cost-price-value-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.costPriceValue + "") - parseFloat(b.costPriceValue + "");
                } else {
                    return parseFloat(b.costPriceValue + "") - parseFloat(a.costPriceValue + "");
                }
            } else if (targetId == 'fund-income-percent-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.incomePercent + "") - parseFloat(b.incomePercent + "");
                } else {
                    return parseFloat(b.incomePercent + "") - parseFloat(a.incomePercent + "");
                }
            } else if (targetId == 'fund-income-th') {
                if(sortType == 'ASC'){
                    return parseFloat(a.income + "") - parseFloat(b.income + "");
                } else {
                    return parseFloat(b.income + "") - parseFloat(a.income + "");
                }
            } else {
                return 0;
            }
        })
        saveCacheData('funds', JSON.stringify(fundList));
    }
    initData();
}