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
var blueColor = '#093';
var redColor = '#ee2500';
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
var changeDisplay = 'DISPLAY';
var updateTimeDisplay = 'DISPLAY';
var turnOverRateDisplay = 'DISPLAY';
var largetMarketTotalDisplay;
var monitorPriceOrPercent = 'PRICE';
var monitorTop20Stock = false;
var lastSort;
var huilvConvert = false;
var s2nDate;
var n2sDate;
var bigStockMoneyDate;
var timeImageNewOrOld;
var columnOrder;
var columnOrderTemp;
var largeMarketCode;
var groups;
var currentGroup;
var mainPageRefreshTime;
var stockColumnNames = {
    "name-th": "股票名称",
    "mini-image-th": "迷你分时图",
    "day-income-th": "当日盈利",
    "change-percent-th": "涨跌幅",
    "turn-over-rate-th": "换手率",
    "change-th": "涨跌",
    "price-th": "当前价",
    "cost-price-th": "成本价",
    "bonds-th": "持仓",
    "market-value-th": "市值/金额",
    "market-value-percent-th": "持仓占比",
    "cost-price-value-th": "成本",
    "income-percent-th": "收益率",
    "income-th": "收益",
    "update-time-th": "更新时间",
    "addtime-price-th": "自选价格"
};
var fundColumnNames = {
    "name-th": "基金名称",
    "mini-image-th": "迷你分时图",
    "day-income-th": "当日盈利",
    "change-percent-th": "涨跌幅",
    "turn-over-rate-th": "换手率",
    "change-th": "涨跌",
    "price-th": "估算净值",
    "cost-price-th": "持仓成本单价",
    "bonds-th": "持有份额",
    "market-value-th": "市值/金额",
    "market-value-percent-th": "持仓占比",
    "cost-price-value-th": "成本",
    "income-percent-th": "收益率",
    "income-th": "收益",
    "update-time-th": "更新时间",
    "addtime-price-th": "自选价格"
};
const defaultIconPath = {
    "16": "img/128.png",
    "48": "img/128.png",
    "128": "img/128.png"
};
const hiddenIconPath = {
    "16": "img/128_hidden.png",
    "48": "img/128_hidden.png",
    "128": "img/128_hidden.png"
};
// 初始状态为默认图标
var defaultIcon;
var stockApi;

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
        blueColor = '#093';
    }
    redColor = await readCacheData('redColor');
    if (redColor == null) {
        redColor = '#ee2500';
    }
    cheatMeFlag = await readCacheData('cheatMeFlag');
    if (cheatMeFlag == null) {
        cheatMeFlag = false;
    } else if(cheatMeFlag == "true") {
        cheatMeFlag = true;
    } else if(cheatMeFlag == "false") {
        cheatMeFlag = false;
    }
    huilvConvert = await readCacheData('huilvConvert');
    if (huilvConvert == null) {
        huilvConvert = false;
    } else if(huilvConvert == "true") {
        huilvConvert = true;
    } else if(huilvConvert == "false") {
        huilvConvert = false;
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
    } else {
        marketValueDisplay = 'HIDDEN';
    }
    marketValuePercentDisplay = await readCacheData('market-value-percent-display');
    if (marketValuePercentDisplay == null || marketValuePercentDisplay == 'DISPLAY') {
        marketValuePercentDisplay = 'DISPLAY';
    } else {
        marketValuePercentDisplay = 'HIDDEN';
    }
    costPriceValueDisplay = await readCacheData('cost-price-value-display');
    if (costPriceValueDisplay == null || costPriceValueDisplay == 'DISPLAY') {
        costPriceValueDisplay = 'DISPLAY';
    } else {
        costPriceValueDisplay = 'HIDDEN';
    }
    incomePercentDisplay = await readCacheData('income-percent-display');
    if (incomePercentDisplay == null || incomePercentDisplay == 'DISPLAY') {
        incomePercentDisplay = 'DISPLAY';
    } else {
        incomePercentDisplay = 'HIDDEN';
    }
    addtimePriceDisplay = await readCacheData('addtime-price-display');
    if (addtimePriceDisplay == null || addtimePriceDisplay == 'DISPLAY') {
        addtimePriceDisplay = 'DISPLAY';
    } else {
        addtimePriceDisplay = 'HIDDEN';
    }
    dayIncomeDisplay = await readCacheData('day-income-display');
    if (dayIncomeDisplay == null || dayIncomeDisplay == 'DISPLAY') {
        dayIncomeDisplay = 'DISPLAY';
    } else {
        dayIncomeDisplay = 'HIDDEN';
    }
    costPriceDisplay = await readCacheData('cost-price-display');
    if (costPriceDisplay == null || costPriceDisplay == 'DISPLAY') {
        costPriceDisplay = 'DISPLAY';
    } else {
        costPriceDisplay = 'HIDDEN';
    }
    bondsDisplay = await readCacheData('bonds-display');
    if (bondsDisplay == null || bondsDisplay == 'DISPLAY') {
        bondsDisplay = 'DISPLAY';
    } else {
        bondsDisplay = 'HIDDEN';
    }
    incomeDisplay = await readCacheData('income-display');
    if (incomeDisplay == null || incomeDisplay == 'DISPLAY') {
        incomeDisplay = 'DISPLAY';
    } else {
        incomeDisplay = 'HIDDEN';
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
    changeDisplay = await readCacheData('change-display');
    if (changeDisplay == null || changeDisplay == 'HIDDEN') {
        changeDisplay = 'HIDDEN';
    } else {
        changeDisplay = 'DISPLAY';
    }
    updateTimeDisplay = await readCacheData('update-time-display');
    if (updateTimeDisplay == null || updateTimeDisplay == 'DISPLAY') {
        updateTimeDisplay = 'DISPLAY';
    } else {
        updateTimeDisplay = 'HIDDEN';
    }
    turnOverRateDisplay = await readCacheData('turn-over-rate-display');
    if (turnOverRateDisplay == null || turnOverRateDisplay == 'DISPLAY') {
        turnOverRateDisplay = 'DISPLAY';
    } else {
        turnOverRateDisplay = 'HIDDEN';
    }
    monitorPriceOrPercent = await readCacheData('monitor-price-or-percent');
    if (monitorPriceOrPercent == null) {
        monitorPriceOrPercent = 'PRICE';
    }
    monitorTop20Stock  = await readCacheData('monitor-top-20-stock');
    if (monitorTop20Stock == null) {
        monitorTop20Stock = false;
    } else if(monitorTop20Stock == "true") {
        monitorTop20Stock = true;
    } else if(monitorTop20Stock == "false") {
        monitorTop20Stock = false;
    }
    timeImageNewOrOld = await readCacheData('time-image-new-or-old');
    if (timeImageNewOrOld == null) {
        timeImageNewOrOld = 'OLD';
    }
    defaultIcon = await readCacheData('default-icon');
    if (defaultIcon == null || defaultIcon == "true") {
        defaultIcon = true;
    } else if(defaultIcon == "false") {
        defaultIcon = false;
    }
    stockApi = await readCacheData('stock-api');
    if (stockApi == null || stockApi == '') {
        stockApi = 'GTIMG';
    }
    largetMarketTotalDisplay = await readCacheData('larget-market-total-display');
    if (largetMarketTotalDisplay == null || largetMarketTotalDisplay == "false") {
        largetMarketTotalDisplay = false;
    } else if(largetMarketTotalDisplay == "true") {
        largetMarketTotalDisplay = true;
    }
    lastSort = await readCacheData('last-sort');
    if (lastSort == null) {
        lastSort = {
            'stock' : {
                'targetId' : '',
                'sortType' : 'order'
            },
            'fund' : {
                'targetId' : '',
                'sortType' : 'order'
            }
        };
    }
    largeMarketCode = await readCacheData('large-market-code');
    if (largeMarketCode == null) {
        largeMarketCode = ['1.000001','0.399001','0.399006','100.HSI'];
    } else {
        largeMarketCode = jQuery.parseJSON(largeMarketCode)
    }
    columnOrder = await readCacheData('column-order');
    if (columnOrder == null) {
        columnOrder = [
            {"name-th": 0},
            {"mini-image-th": 0},
            {"day-income-th": 0},
            {"change-percent-th": 0},
            {"turn-over-rate-th": 0},
            {"change-th": 0},
            {"price-th": 0},
            {"cost-price-th": 0},
            {"bonds-th": 0},
            {"market-value-th": 0},
            {"market-value-percent-th": 0},
            {"cost-price-value-th": 0},
            {"income-percent-th": 0},
            {"income-th": 0},
            {"update-time-th": 0},
            {"addtime-price-th": 0},
        ];
    }
    columnOrderTemp = columnOrder;
    var groupsCache = await readCacheData('groups');
    if (groupsCache == null || groupsCache == '' || groupsCache == undefined
        || groupsCache == 'undefined') {
        groups = {
            'default-group': '默认分组' // 预设一个默认分组
        };
    } else {
        groups = groupsCache;
    }
    currentGroup  = await readCacheData('current-group');
    if (currentGroup == null || currentGroup == '' || currentGroup == undefined
        || currentGroup == 'undefined') {
        currentGroup = 'default-group';
    }
    if (currentGroup == 'default-group') {
        var funds = await readCacheData('funds');
        if (funds == null || funds == 'null') {
            fundList = [];
        } else {
            fundList = jQuery.parseJSON(funds);
        }
        var stocks = await readCacheData('stocks');
        if (stocks == null || stocks == 'null') {
            stockList = [];
        } else {
            stockList = jQuery.parseJSON(stocks);
        }
    } else if(currentGroup == 'all-group') {
        await changeAllGroup();
    } else {
        var funds = await readCacheData(currentGroup + '_funds');
        console.log('=====funds=', funds);
        if (funds == null || funds == 'null') {
            fundList = [];
        } else {
            fundList = jQuery.parseJSON(funds);
            console.log('=====fundList=', fundList);
        }
        var stocks = await readCacheData(currentGroup + '_stocks');
        if (stocks == null || stocks == 'null') {
            stockList = [];
        } else {
            stockList = jQuery.parseJSON(stocks);
        }
    }

    mainPageRefreshTime = await readCacheData('main-page-refresh-time');
    if (mainPageRefreshTime == null || mainPageRefreshTime == '' || mainPageRefreshTime == undefined
        || mainPageRefreshTime == 'undefined') {
        mainPageRefreshTime = 20000;
    }
    // 展示密码保护按钮
    $("#show-password-protect-button")[0].style.display = 'inline';
    $("#data-export-button")[0].style.display = 'inline';
    initWindowsSize();
    initHtml();
    initData();
    initLargeMarketData();
    initGroupButton();
    // 默认20s刷新，通过mainPageRefreshTime获取
    setInterval(autoRefresh, mainPageRefreshTime);
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
    // 旧顺序拼接TH行HTML
    // 股票标题
    // var stockHead = " <tr id=\"stock-tr-title\"> " +
    //     " <th id=\"stock-name-th\" class=\"order\">股票名称</th> " +
    //     (dayIncomeDisplay == 'DISPLAY' ? " <th id=\"stock-day-income-th\" class=\"order\">当日盈利</th> " : "") + 
    //     " <th id=\"stock-change-percent-th\" class=\"order\">涨跌幅</th> " +
    //     (changeDisplay == 'DISPLAY' ? " <th id=\"stock-change-th\" class=\"order\">涨跌</th>" : "") + 
    //     " <th id=\"stock-price-th\" class=\"order\">当前价</th> " +
    //     (costPriceDisplay == 'DISPLAY' ? " <th id=\"stock-cost-price-th\" class=\"order\">成本价</th> " : "") + 
    //     (bondsDisplay == 'DISPLAY' ? " <th id=\"stock-bonds-th\" class=\"order\">持仓</th> " : "") + 
    //     (marketValueDisplay == 'DISPLAY' ? " <th id=\"stock-market-value-th\" class=\"order\">市值/金额</th> " : "") + 
    //     (marketValuePercentDisplay == 'DISPLAY' ? " <th id=\"stock-market-value-percent-th\" class=\"order\">持仓占比</th> " : "") + 
    //     (costPriceValueDisplay == 'DISPLAY' ? " <th id=\"stock-cost-price-value-th\" class=\"order\">成本</th> " : "") + 
    //     (incomePercentDisplay == 'DISPLAY' ? " <th id=\"stock-income-percent-th\" class=\"order\">收益率</th> " : "") + 
    //     (incomeDisplay == 'DISPLAY' ? " <th id=\"stock-income-th\" class=\"order\">收益</th> " : "") + 
    //     (addtimePriceDisplay == 'DISPLAY' ? " <th id=\"stock-addtime-price-th\">自选价格</th> " : "") + 
    //     " </tr>";

    // 基金标题
    // var fundHead = " <tr id=\"fund-tr-title\">" +
    //     " <th id=\"fund-name-th\" class=\"order\">基金名称</th>" +
    //     (dayIncomeDisplay == 'DISPLAY' ? " <th id=\"fund-day-income-th\" class=\"order\">当日盈利</th>" : "") + 
    //     " <th id=\"fund-change-percent-th\" class=\"order\">涨跌幅</th>" +
    //     (changeDisplay == 'DISPLAY' ? " <th id=\"fund-change-th\" class=\"order\">涨跌</th>" : "") + 
    //     " <th id=\"fund-price-th\" class=\"order\">估算净值</th>" +
    //     (costPriceDisplay == 'DISPLAY' ? " <th id=\"fund-cost-price-th\" class=\"order\">持仓成本单价</th>" : "") + 
    //     (bondsDisplay == 'DISPLAY' ? " <th id=\"fund-bonds-th\" class=\"order\">持有份额</th>" : "") + 
    //     (marketValueDisplay == 'DISPLAY' ? " <th id=\"fund-market-value-th\" class=\"order\">市值/金额</th> " : "") + 
    //     (marketValuePercentDisplay == 'DISPLAY' ? " <th id=\"fund-market-value-percent-th\" class=\"order\">持仓占比</th> " : "") + 
    //     (costPriceValueDisplay == 'DISPLAY' ? " <th id=\"fund-cost-price-value-th\" class=\"order\">成本</th> " : "") + 
    //     (incomePercentDisplay == 'DISPLAY' ? " <th id=\"fund-income-percent-th\" class=\"order\">收益率</th> " : "") + 
    //     (incomeDisplay == 'DISPLAY' ? " <th id=\"fund-income-th\" class=\"order\">收益</th> " : "") + 
    //     (addtimePriceDisplay == 'DISPLAY' ? " <th id=\"fund-addtime-price-th\">自选价格</th> " : "") + 
    //     " </tr>";

    // 新顺序拼接TH行HTML
    // 股票标题
    var stockHeadOrder = columnOrder.map(function (column) {
        var columnName = Object.keys(column)[0];
        return getThColumnHtml(columnName, 'STOCK');
    }).join("");
    var stockHead = " <tr id=\"stock-tr-title\"> " + stockHeadOrder + " </tr>";
    // 基金标题
    var fundHeadOrder = columnOrder.map(function (column) {
        var columnName = Object.keys(column)[0];
        return getThColumnHtml(columnName, 'FUND');
    }).join("");
    var fundHead = " <tr id=\"fund-tr-title\"> " + fundHeadOrder + " </tr>";

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
        // 监听基金的TH行点击事件，点击后排序
        if(document.getElementById('fund-name-th'))
            document.getElementById('fund-name-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-day-income-th'))
            document.getElementById('fund-day-income-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-change-percent-th'))
            document.getElementById('fund-change-percent-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-price-th'))
            document.getElementById('fund-price-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-cost-price-th'))
            document.getElementById('fund-cost-price-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-bonds-th'))
            document.getElementById('fund-bonds-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-market-value-th'))
            document.getElementById('fund-market-value-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-market-value-percent-th'))
            document.getElementById('fund-market-value-percent-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-cost-price-value-th'))
            document.getElementById('fund-cost-price-value-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-income-percent-th'))
            document.getElementById('fund-income-percent-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('fund-income-th'))
            document.getElementById('fund-income-th').addEventListener('click', clickSortStockAndFund);
        if (lastSort.fund.targetId != null && lastSort.fund.targetId != '' && document.getElementById(lastSort.fund.targetId)) {
            if (document.getElementById(lastSort.fund.targetId).classList.contains('order')) {
                document.getElementById(lastSort.fund.targetId).classList.remove('order');
            }
            if (document.getElementById(lastSort.fund.targetId).classList.contains('desc')) {
                document.getElementById(lastSort.fund.targetId).classList.remove('desc');
            }
            if (document.getElementById(lastSort.fund.targetId).classList.contains('asc')) {
                document.getElementById(lastSort.fund.targetId).classList.remove('asc');
            }
            document.getElementById(lastSort.fund.targetId).classList.add(lastSort.fund.sortType);
        }
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        $("#stock-head").html(stockHead);
        // 监听股票的TH行点击事件，点击后排序
        if(document.getElementById('stock-name-th'))
            document.getElementById('stock-name-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-day-income-th'))
            document.getElementById('stock-day-income-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-change-percent-th'))
            document.getElementById('stock-change-percent-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-turn-over-rate-th'))
            document.getElementById('stock-turn-over-rate-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-price-th'))
            document.getElementById('stock-price-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-cost-price-th'))
            document.getElementById('stock-cost-price-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-bonds-th'))
            document.getElementById('stock-bonds-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-market-value-th'))
            document.getElementById('stock-market-value-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-market-value-percent-th'))
            document.getElementById('stock-market-value-percent-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-cost-price-value-th'))
            document.getElementById('stock-cost-price-value-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-income-percent-th'))
            document.getElementById('stock-income-percent-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-income-th'))
            document.getElementById('stock-income-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-change-th'))
            document.getElementById('stock-change-th').addEventListener('click', clickSortStockAndFund);
        if (lastSort.stock.targetId != null && lastSort.stock.targetId != '' && document.getElementById(lastSort.stock.targetId)) {
            if (document.getElementById(lastSort.stock.targetId).classList.contains('order')) {
                document.getElementById(lastSort.stock.targetId).classList.remove('order');
            }
            if (document.getElementById(lastSort.stock.targetId).classList.contains('desc')) {
                document.getElementById(lastSort.stock.targetId).classList.remove('desc');
            }
            if (document.getElementById(lastSort.stock.targetId).classList.contains('asc')) {
                document.getElementById(lastSort.stock.targetId).classList.remove('asc');
            }
            document.getElementById(lastSort.stock.targetId).classList.add(lastSort.stock.sortType);
        }
    }
    if (showStockOrFundOrAll == 'fund') {
        $("#stock-head").html('');
        $("#stock-nr").html('');
        $("#total-nr").html('');
    } else if (showStockOrFundOrAll == 'stock') {
        $("#fund-head").html('');
        $("#fund-nr").html('');
        $("#total-nr").html('');
    }
    // 在页面顶部显示一些监控信息，重要信息
    // initNotice();
    initFontStyle();
    changeBlackButton();
}

// 按钮监听事件
document.addEventListener(
    'DOMContentLoaded',
    function () {
        // 首页，点击设置按钮
        document.getElementById('show-setting-button').addEventListener('click', async function () {
            $("#setting-modal").modal();
            generateColumnList();
            selectLargeMarketCodeCheckbox();
        });
        // 首页，底部全部按钮，股票基金全部显示
        document.getElementById('show-all-button').addEventListener('click', changeShowStockOrFundOrAll);
        // 首页，底部股票按钮，只展示股票
        document.getElementById('show-stock-button').addEventListener('click', changeShowStockOrFundOrAll);
        // 首页，底部基金按钮，只展示基金
        document.getElementById('show-fund-button').addEventListener('click', changeShowStockOrFundOrAll);
        // 首页，点击数据中心
        document.getElementById('show-data-center-button').addEventListener('click', showDataCenter);
        // 首页，点击分组
        // document.getElementById('show-group-button').addEventListener('click', showGroup);
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
            $("#wechat-group-modal-title").html('扫码加入微信群');
            $("#wechat-group-modal-content").html('您使用中的各种问题或者错误进群联系我帮您解决，提出您的需求，如果合理我会尽快实现～');
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
        // 首页，点击小程序按钮
        document.getElementById('show-wechat-mini-button').addEventListener('click', function () {
            $("#wechat-group-modal-title").html('扫码进入微信小程序');
            $("#wechat-group-modal-content").html('首次扫描二维码会进入股票基金神器页面，之后可以在小程序列表中的“编程面试题”进入首页，底部“股票基金神器”链接进入～');
            $("#wechat-group-qr-code-image").html('<img src="/img/wechat-mini-qr-code.jpg" width="60%" length="60%" />');
            $("#wechat-group-modal").modal();
        });

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
        document.getElementById('update-stock-fund-button').addEventListener('click', async function () {
            $("#time-image-modal").modal("hide");
            if (timeImageType == "FUND") {
                // 初始化页面的belong-group
                $("#fund-belong-group-select").find("option").remove();
                Object.keys(groups).forEach(id => {
                    const groupName = groups[id];
                    var option = $("<option></option>").val(id).text(groupName);
                    $("#fund-belong-group-select").append(option);
                });
                if (currentGroup == 'all-group') {
                    let belongGroup = '';
                    for (var k in fundList) {
                        if(fundList[k].fundCode == timeImageCode) {
                            belongGroup = fundList[k].belongGroup;
                            break;
                        }
                    }
                    $("#fund-belong-group-select").val(belongGroup);
                } else {
                    $("#fund-belong-group-select").val(currentGroup);
                }
                $("#fund-modal").modal();
            } else {
                // 初始化页面的belong-group
                $("#stock-belong-group-select").find("option").remove();
                Object.keys(groups).forEach(id => {
                    const groupName = groups[id];
                    var option = $("<option></option>").val(id).text(groupName);
                    $("#stock-belong-group-select").append(option);
                });
                if (currentGroup == 'all-group') {
                    let belongGroup = '';
                    for (var k in stockList) {
                        if(stockList[k].code == timeImageCode) {
                            belongGroup = stockList[k].belongGroup;
                            break;
                        }
                    }
                    $("#stock-belong-group-select").val(belongGroup);
                } else {
                    $("#stock-belong-group-select").val(currentGroup);
                }
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
        // 走势图页面，点击东方财富走势图
        document.getElementById('go-to-eastmoney-button').addEventListener('click', goToEastMoney);
        // 走势图页面，切换新旧走势图
        document.getElementById('time-image-new-button').addEventListener('click', changeTimeImage);
        document.getElementById('time-image-old-button').addEventListener('click', changeTimeImage);
        // 走势图页面，分时图关闭监听
        $("#time-image-modal").on("hidden.bs.modal", clearTimeImageTimeout);
        // 走势图页面，点击添加自选
        document.getElementById('add-stock-button').addEventListener('click', addStock);

        // 搜索股票页面，股票列表点击选择
        document.getElementById('search-stock-select').addEventListener('change', async function () {
            let stockCode = $("#search-stock-select").val();
            for (var k in stockCode) {
                let existInStockList = false;
                let index;
                for (let l in stockList) {
                    if (stockList[l].code == stockCode) {
                        existInStockList = true;
                        index = l;
                        break;
                    }
                }
                if (existInStockList) {
                    alertMessage("您已经添加过" + stockCode);
                    scrollToTableRow(index, 'STOCK');
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
                $("#new-buy-checkbox").prop("checked", false);
                await saveStock();
            }
        });
        // 搜索基金页面，基金列表点击选择
        document.getElementById('search-fund-select').addEventListener('change', async function () {
            let fundCode = $("#search-fund-select").val();
            for (var k in fundCode) {
                let existInFundList = false;
                let index;
                for (let l in fundList) {
                    if (fundList[l].fundCode == fundCode) {
                        index = l;
                        existInFundList = true;
                        break;
                    }
                }
                if (existInFundList) {
                    alertMessage("您已经添加过" + fundCode);
                    scrollToTableRow(index, 'FUND');
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
        // // 设置页面，隐藏/展示页面展示项，编码
        // document.getElementById("code-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，市值/金额
        // document.getElementById("market-value-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，持仓占比
        // document.getElementById("market-value-percent-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，成本
        // document.getElementById("cost-price-value-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，收益率
        // document.getElementById("income-percent-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，自选价格
        // document.getElementById("addtime-price-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，当日盈利
        // document.getElementById("day-income-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，成本价/持仓成本单价
        // document.getElementById("cost-price-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，持仓/持有份额
        // document.getElementById("bonds-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，收益
        // document.getElementById("income-display-checkbox").addEventListener('change', setDisplayTr);
        // // 设置页面，隐藏/展示页面展示项，涨跌
        // document.getElementById("change-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，隐藏/展示页面展示项，一键全选
        document.getElementById("all-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，点击打赏按钮
        document.getElementById("show-donate-button").addEventListener('click',  showDonate);
        document.getElementById("show-donate-button-2").addEventListener('click',  showDonate);
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
        // 设置页面，点击切换汇率按钮
        document.getElementById('huilv-convert-change-button').addEventListener('click', changeHuilvConvert);
        document.getElementById('huilv-dont-convert-change-button').addEventListener('click', changeHuilvConvert);
        // 设置页面，点击恢复默认顺序按钮
        document.getElementById('column-order-recovery-button').addEventListener('click', recoveryColumnOrder);
        // 设置页面，点击保存顺序按钮
        document.getElementById('column-order-save-button').addEventListener('click', saveColumnOrder);
        // 设置页面，点击实时价格按钮
        document.getElementById('monitor-price-change-button').addEventListener('click', changeMonitorPriceOrPercent);
        // 设置页面，点击涨跌幅按钮
        document.getElementById('monitor-percent-change-button').addEventListener('click', changeMonitorPriceOrPercent);
        // 设置页面，点击当日总收益按钮
        document.getElementById('monitor-day-income-change-button').addEventListener('click', changeMonitorPriceOrPercent);
        // 设置页面，点击展示/不展示前5个股票价格
        document.getElementById('monitor-dont-top-20-stock-change-button').addEventListener('click', changemonitorTop20Stock);
        document.getElementById('monitor-top-20-stock-change-button').addEventListener('click', changemonitorTop20Stock);
        // 设置页面，点击切换隐蔽/默认图标按钮
        document.getElementById('change-icon-default-button').addEventListener('click', changeIcon);
        document.getElementById('change-icon-hidden-button').addEventListener('click', changeIcon);
        // 设置页面，点击保存大盘指数
        document.getElementById('large-market-code-save-button').addEventListener('click', largeMarketCodeSave);
        // 设置页面，点击反馈建议按钮
        document.getElementById('show-advice-button').addEventListener('click', showAdvice);
        // 设置页面，点击在大盘指数位置展示/不展示持仓盈亏
        document.getElementById('larget-market-total-display-change-button').addEventListener('click', changeLargeMarketTotalDisplay);
        document.getElementById('larget-market-total-dont-display-change-button').addEventListener('click', changeLargeMarketTotalDisplay);
        // 设置页面，点击首页数据自动刷新时间间隔按钮，20秒/10秒/5秒/3秒
        document.getElementById('main-page-refresh-time-20s-button').addEventListener('click', changeMainPageRefreshTime);
        document.getElementById('main-page-refresh-time-10s-button').addEventListener('click', changeMainPageRefreshTime);
        document.getElementById('main-page-refresh-time-5s-button').addEventListener('click', changeMainPageRefreshTime);
        document.getElementById('main-page-refresh-time-3s-button').addEventListener('click', changeMainPageRefreshTime);
        // 设置页面，点击切换新旧获取股票信息接口
        document.getElementById('stock-api-gtimg-button').addEventListener('click', changeStockApi);
        document.getElementById('stock-api-eastmoney-button').addEventListener('click', changeStockApi);

        // 云同步页面，向服务器同步数据/从服务器同步数据
        document.getElementById('sync-data-to-cloud-button').addEventListener('click', syncDataToCloud);
        document.getElementById('sync-data-from-cloud-button').addEventListener('click', syncDataFromCloud);

        // // 打赏页面，点击微信
        // document.getElementById("wechat-pay-button").addEventListener('click',  showDonate);
        // // 打赏页面，点击支付宝
        // document.getElementById("ali-pay-button").addEventListener('click',  showDonate);

        // 买/卖股票页面，点击买/卖
        document.getElementById("buy-or-sell-button").addEventListener('click',  buyOrSell);

        // 数据中心页面，点击大盘资金
        document.getElementById('big-stock-money-button').addEventListener('click', showDataCenter);
        // 数据中心页面，点击北向资金
        document.getElementById('beixiang-money-button').addEventListener('click', showBeiXiang);
        // 数据中心页面，点击南向资金
        document.getElementById('nanxiang-money-button').addEventListener('click', showNanXiang);
        // 数据中心页面，点击行业板块
        document.getElementById('hangye-bankuai-money-button').addEventListener('click', showHangYeBanKuai);
        // 数据中心页面，点击每日盈利
        document.getElementById('day-income-history-button').addEventListener('click', showDayIncomeHistory);
        // 数据中心页面，点击涨跌分布
        document.getElementById('up-down-counts-button').addEventListener('click', showUpDownCounts);

        // 反馈建议页面，点击保存
        document.getElementById('save-advice-button').addEventListener('click', saveAdvice);

        // 分组页面，点击新建分组
        document.getElementById('add-group-button').addEventListener('click', addGroup);
    }
);

// 股票搜索后，接口返回为 unicode 编码，转换为中文
function A2U(str) {
    return unescape(str.replace(/\\u/gi, '%u'));
}

// 初始化首页股票列表数据
async function initData() {
    initFirstInstall();
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        // 走GTIMG获取股票接口
        if (stockApi == 'GTIMG') {
            var stocks = "";
            for (var k in stockList) {
                stocks += stockList[k].code.replace('.oq','').replace('.ps','').replace('.n','').replace('.OQ','').replace('.PS','').replace('.N','') + ",";
            }
            let huilvHK;
            let huilvUS;
            // 只有切换了汇率才获取汇率接口数据
            if(huilvConvert){
                if (stocks.indexOf('hk') || stocks.indexOf('HK')) {
                    huilvHK = await getHuilv('HKD');
                }
                if (stocks.indexOf('us') || stocks.indexOf('US')) {
                    huilvUS = await getHuilv('USD');
                }
            }
            let result = "";
            // 没有股票不调用接口请求
            if (stocks != "") {
                result = ajaxGetStockFromGtimg(stocks);
            }
            var stoksArr = result.split("\n");
            turnOverRate = "";
            for (var k in stoksArr) {
                for (var l in stockList) {
                    console.log(stockList[l].code ,"===", stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("=")))
                    if (stockList[l].code.replace('.oq','').replace('.ps','').replace('.n','').replace('.OQ','').replace('.PS','').replace('.N','') == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))) {
                        var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                        var values = dataStr.split("~");
                        stockList[l].name = values[1] + "";
                        stockList[l].gztime = changeTimeFormate(values[30]) + "";
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
                        if (huilvConvert) {
                            if (stockList[l].code.indexOf("hk") >= 0 || stockList[l].code.indexOf("HK") >= 0) {
                                income = parseFloat((new BigDecimal(income + "")).multiply(new BigDecimal(huilvHK + ""))).toFixed(2);
                            } else if (stockList[l].code.indexOf("us") >= 0 || stockList[l].code.indexOf("US") >= 0) {
                                income = parseFloat((new BigDecimal(income + "")).multiply(new BigDecimal(huilvUS + ""))).toFixed(2);
                            }
                        }
                        stockList[l].income = income + "";
                        // 计算股票中的部分值
                        var buyOrSells = stockList[l].buyOrSellStockRequestList;
                        var todayBuyIncom = new BigDecimal("0");
                        var todaySellIncom = new BigDecimal("0");
                        var dayIncome = new BigDecimal("0");
                        var marketValue = new BigDecimal("0");
                        var maxBuyOrSellBonds = 0;
                        //当天新买，计算当日收益，（最新价格-成本价格）*持仓数
                        if (stockList[l].newBuy && stockList[l].newBuyDate == getBeijingDate()) {
                            dayIncome = (now.add(costPrise.negate())).multiply(new BigDecimal(stockList[l].bonds));
                        //不是当天新买
                        } else {
                            for (var g in buyOrSells) {
                                let beijingDate = getBeijingDate();
                                // 当天购买过
                                if (buyOrSells[g].type == "1" && beijingDate == buyOrSells[g].date) {
                                    maxBuyOrSellBonds = maxBuyOrSellBonds + buyOrSells[g].bonds;
                                    var buyIncome = (new BigDecimal(stockList[l].now))
                                        .subtract(new BigDecimal(buyOrSells[g].price + ""))
                                        .multiply(new BigDecimal(buyOrSells[g].bonds + ""))
                                        .subtract(new BigDecimal(buyOrSells[g].cost + ""));
                                    todayBuyIncom = todayBuyIncom.add(buyIncome);
                                }
                                // 当天卖出过
                                if (buyOrSells[g].type == "2" && beijingDate == buyOrSells[g].date) {
                                    todaySellIncom = todaySellIncom.add(new BigDecimal(buyOrSells[g].income + ""));
                                }
                            }
                            if (maxBuyOrSellBonds < stockList[l].bonds) {
                                var restBonds = (new BigDecimal(stockList[l].bonds)).subtract(new BigDecimal(maxBuyOrSellBonds + ""));
                                dayIncome = (new BigDecimal(stockList[l].change)).multiply(restBonds);
                            } else {
                                dayIncome = new BigDecimal("0");
                            }
                            dayIncome = dayIncome.add(todayBuyIncom).add(todaySellIncom);
                        }
                        if (huilvConvert) {
                            if (stockList[l].code.indexOf("hk") >= 0 || stockList[l].code.indexOf("HK") >= 0) {
                                dayIncome = parseFloat(dayIncome.multiply(new BigDecimal(huilvHK + ""))).toFixed(2);
                            } else if (stockList[l].code.indexOf("us") >= 0 || stockList[l].code.indexOf("US") >= 0) {
                                dayIncome = parseFloat(dayIncome.multiply(new BigDecimal(huilvUS + ""))).toFixed(2);
                            }
                        }
                        stockList[l].dayIncome = dayIncome + "";
                        marketValue = (new BigDecimal(stockList[l].now)).multiply(new BigDecimal(stockList[l].bonds));
                        if (huilvConvert) {
                            if (stockList[l].code.indexOf("hk") >= 0 || stockList[l].code.indexOf("HK") >= 0) {
                                marketValue = parseFloat(marketValue.multiply(new BigDecimal(huilvHK + ""))).toFixed(2);
                            } else if (stockList[l].code.indexOf("us") >= 0 || stockList[l].code.indexOf("US") >= 0) {
                                marketValue = parseFloat(marketValue.multiply(new BigDecimal(huilvUS + ""))).toFixed(2);
                            }
                        }
                        stockList[l].marketValue = marketValue + "";
                        var costPrice = new BigDecimal(stockList[l].costPrise + "");
                        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(stockList[l].bonds))).toFixed(2));
                        if (huilvConvert) {
                            if (stockList[l].code.indexOf("hk") >= 0 || stockList[l].code.indexOf("HK") >= 0) {
                                costPriceValue = parseFloat(costPriceValue.multiply(new BigDecimal(huilvHK + ""))).toFixed(2);
                            } else if (stockList[l].code.indexOf("us") >= 0 || stockList[l].code.indexOf("US") >= 0) {
                                costPriceValue = parseFloat(costPriceValue.multiply(new BigDecimal(huilvUS + ""))).toFixed(2);
                            }
                        }
                        stockList[l].costPriceValue = costPriceValue + "";
                        // 设置换手率
                        turnOverRate += stockList[l].code + '~' + values[38] + '-';
                        stockList[l].turnOverRate = values[38];
                    }
                }
            }
        // 走东方财富获取股票接口
        } else {
            var stocks = "";
            var secIdStockArr = '';
            for (var k in stockList) {
                stocks += stockList[k].code + ",";
                let code = stockList[k].code;
                secIdStockArr += getSecid(code) + '.' + stockList[k].code.replace('sh', '').replace('sz', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.', '_') + ',';
            }
            let huilvHK;
            let huilvUS;
            // 只有切换了汇率才获取汇率接口数据
            if(huilvConvert){
                if (stocks.indexOf('hk') || stocks.indexOf('HK')) {
                    huilvHK = await getHuilv('HKD');
                }
                if (stocks.indexOf('us') || stocks.indexOf('US')) {
                    huilvUS = await getHuilv('USD');
                }
            }
            let result = "";
            let stoksArr = [];
            // 没有股票不调用接口请求
            if (stocks != "") {
                result = ajaxGetStockFromEastMoney(secIdStockArr);
                console.log('ajaxGetStockFromEastMoney=', result.data.diff);
                stoksArr = result.data.diff;
            }
            turnOverRate = "";
            for (var k in stoksArr) {
                let stock = {};
                for (var l in stockList) {
                    if (stoksArr[k].f12 == stockList[l].code.replace('sh', '').replace('sz', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.', '_')) {
                        let toFixedVolume = 2;
                        stock = stockList[l];
                        // 本来想这里break出去，结果会导致一些数据undefined，继续遍历吧
                        stock.name = stoksArr[k].f14 + "";
                        if (stock.name.indexOf('ETF') >= 0) {
                            toFixedVolume = 3;
                        }
                        stock.gztime = '--';
                        // 可转债上市前加格默认为 0
                        if (parseFloat(stoksArr[k].f2) == 0 && (stoksArr[k].f14.indexOf("发债") != -1 || stoksArr[k].f14.indexOf("转债") != -1)) {
                            stock.now = "100.00";
                        } else {
                            stock.now = parseFloat(stoksArr[k].f2 + "").toFixed(toFixedVolume);
                        }
                        if (cheatMeFlag && parseFloat(stoksArr[k].f4) < 0) {
                            var change = 0 - parseFloat(stoksArr[k].f4);
                            var changePercent = 0 - parseFloat(stoksArr[k].f3);
                            stock.change = change.toFixed(toFixedVolume)
                            stock.changePercent = changePercent.toFixed(2);
                        } else {
                            stock.change = parseFloat(stoksArr[k].f4).toFixed(toFixedVolume)
                            stock.changePercent = parseFloat(stoksArr[k].f3 + "").toFixed(2);
                        }
                        stock.time = '--';
                        // stockList[l].max = values[33] + "";
                        // stockList[l].min = values[34] + "";
                        // stockList[l].buyOrSellStockRequestList = [];
                        var now = new BigDecimal(stock.now + "");
                        var costPrise = new BigDecimal(stock.costPrise + "")
                        var incomeDiff = now.add(costPrise.negate());
                        if (costPrise <= 0) {
                            stock.incomePercent = 0 + "";
                        } else {
                            var incomePercent = incomeDiff.divide(costPrise, 5, 4)
                                .multiply(BigDecimal.TEN)
                                .multiply(BigDecimal.TEN)
                                .setScale(3);
                                stock.incomePercent = incomePercent + "";
                        }
                        var bonds = new BigDecimal(stock.bonds);
                        var income = parseFloat(incomeDiff.multiply(bonds) + "").toFixed(2);
                        if (huilvConvert) {
                            if (stock.code.indexOf("hk") >= 0 || stock.code.indexOf("HK") >= 0) {
                                income = parseFloat((new BigDecimal(income + "")).multiply(new BigDecimal(huilvHK + ""))).toFixed(2);
                            } else if (stock.code.indexOf("us") >= 0 || stock.code.indexOf("US") >= 0) {
                                income = parseFloat((new BigDecimal(income + "")).multiply(new BigDecimal(huilvUS + ""))).toFixed(2);
                            }
                        }
                        stock.income = income + "";
                        // 计算股票中的部分值
                        var buyOrSells = stock.buyOrSellStockRequestList;
                        var todayBuyIncom = new BigDecimal("0");
                        var todaySellIncom = new BigDecimal("0");
                        var dayIncome = new BigDecimal("0");
                        var marketValue = new BigDecimal("0");
                        var maxBuyOrSellBonds = 0;
                        //当天新买，计算当日收益，（最新价格-成本价格）*持仓数
                        if (stock.newBuy && stock.newBuyDate == getBeijingDate()) {
                            dayIncome = (now.add(costPrise.negate())).multiply(new BigDecimal(stock.bonds));
                        //不是当天新买
                        } else {
                            for (var g in buyOrSells) {
                                let beijingDate = getBeijingDate();
                                // 当天购买过
                                if (buyOrSells[g].type == "1" && beijingDate == buyOrSells[g].date) {
                                    maxBuyOrSellBonds = maxBuyOrSellBonds + buyOrSells[g].bonds;
                                    var buyIncome = (new BigDecimal(stock.now))
                                        .subtract(new BigDecimal(buyOrSells[g].price + ""))
                                        .multiply(new BigDecimal(buyOrSells[g].bonds + ""))
                                        .subtract(new BigDecimal(buyOrSells[g].cost + ""));
                                    todayBuyIncom = todayBuyIncom.add(buyIncome);
                                }
                                // 当天卖出过
                                if (buyOrSells[g].type == "2" && beijingDate == buyOrSells[g].date) {
                                    todaySellIncom = todaySellIncom.add(new BigDecimal(buyOrSells[g].income + ""));
                                }
                            }
                            if (maxBuyOrSellBonds < stock.bonds) {
                                var restBonds = (new BigDecimal(stock.bonds)).subtract(new BigDecimal(maxBuyOrSellBonds + ""));
                                dayIncome = (new BigDecimal(stock.change)).multiply(restBonds);
                            } else {
                                dayIncome = new BigDecimal("0");
                            }
                            dayIncome = dayIncome.add(todayBuyIncom).add(todaySellIncom);
                        }
                        if (huilvConvert) {
                            if (stock.code.indexOf("hk") >= 0 || stock.code.indexOf("HK") >= 0) {
                                dayIncome = parseFloat(dayIncome.multiply(new BigDecimal(huilvHK + ""))).toFixed(2);
                            } else if (stock.code.indexOf("us") >= 0 || stock.code.indexOf("US") >= 0) {
                                dayIncome = parseFloat(dayIncome.multiply(new BigDecimal(huilvUS + ""))).toFixed(2);
                            }
                        }
                        stock.dayIncome = dayIncome + "";
                        marketValue = (new BigDecimal(stock.now)).multiply(new BigDecimal(stock.bonds));
                        if (huilvConvert) {
                            if (stock.code.indexOf("hk") >= 0 || stock.code.indexOf("HK") >= 0) {
                                marketValue = parseFloat(marketValue.multiply(new BigDecimal(huilvHK + ""))).toFixed(2);
                            } else if (stock.code.indexOf("us") >= 0 || stock.code.indexOf("US") >= 0) {
                                marketValue = parseFloat(marketValue.multiply(new BigDecimal(huilvUS + ""))).toFixed(2);
                            }
                        }
                        stock.marketValue = marketValue + "";
                        var costPrice = new BigDecimal(stock.costPrise + "");
                        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(stock.bonds))).toFixed(2));
                        if (huilvConvert) {
                            if (stock.code.indexOf("hk") >= 0 || stock.code.indexOf("HK") >= 0) {
                                costPriceValue = parseFloat(costPriceValue.multiply(new BigDecimal(huilvHK + ""))).toFixed(2);
                            } else if (stock.code.indexOf("us") >= 0 || stock.code.indexOf("US") >= 0) {
                                costPriceValue = parseFloat(costPriceValue.multiply(new BigDecimal(huilvUS + ""))).toFixed(2);
                            }
                        }
                        stock.costPriceValue = costPriceValue + "";
                        // 设置换手率
                        turnOverRate += stock.code + '~' + stoksArr[k].f8 + '-';
                        stock.turnOverRate = parseFloat(stoksArr[k].f8 + '').toFixed(2);
                    }
                }
            }
        }
    }
    await initFund();
}

// 初始化首页基金列表数据
async function initFund() {
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
                        fundList[k].gztime = fund.gztime;
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
                        // 计算其他属性
                        let dayIncome = new BigDecimal("0");
                        let marketValue = new BigDecimal("0");
                        // 获取到当日净值已出
                        let currentDayNetDiagramDate = await readCacheData('current_day_jingzhi_date_' + fundCode);
                        let gztime = fundList[k].gztime;
                        if (gztime != null && gztime != '' && gztime != undefined && gztime.length >= 10){
                            gztime = gztime.substring(0, 10).replaceAll('-', '')
                        }
                        if (currentDayNetDiagramDate == gztime) {
                            let previousDayJingzhi = await readCacheData('previous_day_jingzhi_' + fundCode);
                            let currentDayJingzhi = await readCacheData('current_day_jingzhi_' + fundCode);
                            fundList[k].gsz = currentDayJingzhi;
                            fundList[k].existJZ = true;
                            dayIncome = new BigDecimal(parseFloat(((new BigDecimal(currentDayJingzhi + "")).subtract(new BigDecimal(previousDayJingzhi + ""))).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                            marketValue = new BigDecimal(parseFloat((new BigDecimal(currentDayJingzhi + "")).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                            console.log("=========", dayIncome + "", marketValue +"");
                        } else {
                            fundList[k].existJZ = false;
                            dayIncome = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gszzl)).multiply((new BigDecimal(fundList[k].dwjz))).multiply(new BigDecimal(fundList[k].bonds + "")).divide(new BigDecimal("100"))).toFixed(2));
                            marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz)).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                        }
                        fundList[k].dayIncome = dayIncome + "";
                        fundList[k].marketValue = marketValue + "";
                        var costPrice = new BigDecimal(fundList[k].costPrise + "");
                        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                        fundList[k].costPriceValue = costPriceValue + "";
                        break;
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
                            fundList[k].gztime = fund.gztime;
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
                        // 计算其他属性
                        let dayIncome = new BigDecimal("0");
                        let marketValue = new BigDecimal("0");
                        // 获取到当日净值已出
                        let currentDayNetDiagramDate = await readCacheData('current_day_jingzhi_date_' + fundCode);
                        let gztime = fundList[k].gztime;
                        if (gztime != null && gztime != '' && gztime != undefined && gztime.length >= 10){
                            gztime = gztime.substring(0, 10).replaceAll('-', '')
                        }
                        if (currentDayNetDiagramDate == gztime) {
                            let previousDayJingzhi = await readCacheData('previous_day_jingzhi_' + fundCode);
                            let currentDayJingzhi = await readCacheData('current_day_jingzhi_' + fundCode);
                            fundList[k].gsz = currentDayJingzhi;
                            fundList[k].existJZ = true;
                            dayIncome = new BigDecimal(parseFloat(((new BigDecimal(currentDayJingzhi + "")).subtract(new BigDecimal(previousDayJingzhi + ""))).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                            marketValue = new BigDecimal(parseFloat((new BigDecimal(currentDayJingzhi + "")).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                            console.log("=========", dayIncome + "", marketValue +"");
                        } else {
                            fundList[k].existJZ = false;
                            dayIncome = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gszzl)).multiply((new BigDecimal(fundList[k].dwjz))).multiply(new BigDecimal(fundList[k].bonds + "")).divide(new BigDecimal("100"))).toFixed(2));
                            marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz)).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                        }
                        fundList[k].dayIncome = dayIncome + "";
                        fundList[k].marketValue = marketValue + "";
                        var costPrice = new BigDecimal(fundList[k].costPrise + "");
                        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                        fundList[k].costPriceValue = costPriceValue + "";
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
        stock.openPrice = values[4] + "";
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
        try{
            for (var k = stockList.length - 1; k >= 0; k--) {
                marketValue = (new BigDecimal(stockList[k].now)).multiply(new BigDecimal(stockList[k].bonds));
                totalMarketValue = totalMarketValue.add(marketValue);
            }
        } catch (e) {
            console.warn("股票列表获取完毕后，初始化 html 页面出错", e);
            alertMessage('切换新接口后，部分美股数据报错，请切换回旧接口删除重新添加即可！');
        }
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        for (var k = fundList.length - 1; k >= 0; k--) {
            marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz + "")).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
            totalMarketValue = totalMarketValue.add(marketValue);
        }
    }
    // 获取完totalMarketValue再排序
    await sortStockAndFund(totalMarketValue);
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
                if (stockList[this.sectionRowIndex].newBuy == true && stockList[this.sectionRowIndex].newBuyDate == getBeijingDate()) {
                    $("#new-buy-checkbox").prop("checked", true);
                } else {
                    $("#new-buy-checkbox").prop("checked", false);
                }
                $("#stock-monitor-upper-percent").val(stockList[this.sectionRowIndex].monitorUpperPercent);
                $("#stock-monitor-lower-percent").val(stockList[this.sectionRowIndex].monitorLowerPercent);
                $("#stock-show-time-image-button")[0].style.display = 'inline';
                $("#stock-fund-delete-button")[0].style.display = 'inline';
                $("#stock-fund-monitor-button")[0].style.display = 'inline';
                $("#go-to-eastmoney-button")[0].style.display = 'inline';
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
            // stockTr.addEventListener('contextmenu', function (event) {
            //     event.preventDefault();
            //     let stockName = stockList[this.sectionRowIndex].name;
            //     console.log("右键了", stockName);
            // });
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
                $("#go-to-eastmoney-button")[0].style.display = 'none';
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
    for (var k in result) {
        try {
            let changePercent = parseFloat(result[k].changePercent);
            var changePercentStyle = changePercent == 0 ? "" : (changePercent > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income >= 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
            var incomePercent = parseFloat(result[k].incomePercent);
            var incomePercentStyle = incomePercent == 0 ? "" : (incomePercent >= 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
            let addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" + result[k].addTime + ")";
            stockTotalCostValue = stockTotalCostValue.add(new BigDecimal(result[k].costPriceValue + ""));
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
                    alertStyle = "<span style=\"color: " + redColor + "; font-weight: bold\">(涨破" + result[k].monitorHighPrice + ")</span>";
                } else if(result[k].monitorAlert == '2') {
                    alertStyle = "<span style=\"color: " + blueColor + "; font-weight: bold\">(跌破" + result[k].monitorLowPrice + ")</span>";
                } else if(result[k].monitorAlert == '3') {
                    alertStyle = "<span style=\"color: " + redColor + "; font-weight: bold\">(日涨幅" + result[k].monitorUpperPercent + "%)</span>";
                } else if(result[k].monitorAlert == '4') {
                    alertStyle = "<span style=\"color: " + blueColor + "; font-weight: bold\">(日跌幅" + result[k].monitorLowerPercent + "%)</span>";
                }
            }
            let stockName = result[k].name;
            let dayIncome = parseFloat(result[k].dayIncome + "").toFixed(2);
            var dayIncomeStyle = parseFloat(result[k].dayIncome + "") == 0 ? "" : (parseFloat(result[k].dayIncome + "") > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            let now = result[k].now;
            let costPrise = result[k].costPrise;
            let marketValue = parseFloat(result[k].marketValue + "").toFixed(2);
            let costPriceValue = result[k].costPriceValue;
            let income = result[k].income;
            if (result[k].code.startsWith('us') || result[k].code.startsWith('US')) {
                stockName = result[k].name + "(美股)";
                now = now + "(美元)";
                costPrise = costPrise + "(美元)";
                if (huilvConvert) {
                    marketValue = marketValue + "(人民币)";
                    costPriceValue = costPriceValue + "(人民币)";
                    income = income + "(人民币)";
                    dayIncome = dayIncome + "(人民币)";
                } else {
                    marketValue = marketValue + "(美元)";
                    costPriceValue = costPriceValue + "(美元)";
                    income = income + "(美元)";
                    dayIncome = dayIncome + "(美元)";
                }
            }
            if (result[k].code.startsWith('hk') || result[k].code.startsWith('HK')) {
                stockName = result[k].name + "(港股)";
                now = now + "(港币)";
                costPrise = costPrise + "(港币)";
                if (huilvConvert) {
                    marketValue = marketValue + "(人民币)";
                    costPriceValue = costPriceValue + "(人民币)";
                    income = income + "(人民币)";
                    dayIncome = dayIncome + "(人民币)";
                } else {
                    marketValue = marketValue + "(港币)";
                    costPriceValue = costPriceValue + "(港币)";
                    income = income + "(港币)";
                    dayIncome = dayIncome + "(港币)";
                }
            }
            // 新顺序拼接TR行HTML
            var stockStrOrder = columnOrder.map(function (column) {
                var columnName = Object.keys(column)[0];
                var html;
                if (columnName == 'name-th') {
                    html = "<td class=\"stock-fund-name-and-code\">" + stockName + alertStyle + (codeDisplay == 'DISPLAY' ? "<br>" + result[k].code + "" : "") + "</td>"
                } else if (columnName == 'mini-image-th') {
                    html = "<td>" + minuteImageMiniDiv + "</td>";
                } else if(columnName == 'day-income-th') {
                    html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + dayIncome + "</td>" : "");
                } else if(columnName == 'change-percent-th') {
                    html = "<td " + changePercentStyle + ">" + result[k].changePercent + "%" + "</td>";
                } else if(columnName == 'change-th') {
                    html = (changeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + result[k].change + "</td>" : "");
                } else if(columnName == 'turn-over-rate-th') {
                    html = (turnOverRateDisplay == 'DISPLAY' ? "<td>" + result[k].turnOverRate + "%</td>" : "");
                } else if(columnName == 'price-th') {
                    html = "<td>" + now + "</td>";
                } else if(columnName == 'cost-price-th') {
                    html = (costPriceDisplay == 'DISPLAY' ? "<td>" + costPrise + "</td>" : "");
                } else if(columnName == 'bonds-th') {
                    html = (bondsDisplay == 'DISPLAY' ? "<td>" + result[k].bonds + "</td>" : "");
                } else if(columnName == 'market-value-th') {
                    html = (marketValueDisplay == 'DISPLAY' ? "<td>" + marketValue + "</td>" : "");
                } else if(columnName == 'market-value-percent-th') {
                    html = (marketValuePercentDisplay == 'DISPLAY' ? "<td>" + result[k].marketValuePercent + "%</td>" : "");
                } else if(columnName == 'cost-price-value-th') {
                    html = (costPriceValueDisplay == 'DISPLAY' ? "<td>" + costPriceValue + "</td>" : "");
                } else if(columnName == 'income-percent-th') {
                    html = (incomePercentDisplay == 'DISPLAY' ? "<td " + incomePercentStyle + ">" + result[k].incomePercent + "%</td>" : "");
                } else if(columnName == 'income-th') {
                    html = (incomeDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + income + "</td>" : "");
                } else if(columnName == 'addtime-price-th') {
                    html = (addtimePriceDisplay == 'DISPLAY' ? "<td >" + addTimePrice + "</td>" : "");
                } else if(columnName == 'update-time-th'){
                    html = (updateTimeDisplay == 'DISPLAY' ? "<td >" + result[k].gztime + "</td>" : "");
                }
                return html;
            }).join("");
            str += "<tr draggable=\"true\" id=\"stock-tr-" + k + "\">" + stockStrOrder + "</tr>";

            // 旧顺序拼接TR行HTML
            // str += "<tr draggable=\"true\" id=\"stock-tr-" + k + "\">"
                // + "<td class=\"stock-fund-name-and-code\">" + stockName + alertStyle + (codeDisplay == 'DISPLAY' ? "<br>" + result[k].code + "" : "") +  minuteImageMiniDiv + "</td>"
                // + (dayIncomeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + dayIncome + "</td>" : "")
                // + "<td " + dayIncomeStyle + ">" + result[k].changePercent + "%" + "</td>"
                // + (changeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + result[k].change + "</td>" : "")
                // + "<td>" + now + "</td>"
                // + (costPriceDisplay == 'DISPLAY' ? "<td>" + costPrise + "</td>" : "")
                // + (bondsDisplay == 'DISPLAY' ? "<td>" + result[k].bonds + "</td>" : "")
                // + (marketValueDisplay == 'DISPLAY' ? "<td>" + marketValue + "</td>" : "")
                // + (marketValuePercentDisplay == 'DISPLAY' ? "<td>" + result[k].marketValuePercent + "%</td>" : "")
                // + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + costPriceValue + "</td>" : "")
                // + (incomePercentDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].incomePercent + "%</td>" : "")
                // + (incomeDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + income + "</td>" : "")
                // + (addtimePriceDisplay == 'DISPLAY' ? "<td >" + addTimePrice + "</td>" : "")
                // + "</tr>";
            stockTotalIncome = stockTotalIncome.add(new BigDecimal(result[k].income));
            stockDayIncome = stockDayIncome.add(new BigDecimal(result[k].dayIncome + ""));
            stockTotalmarketValue = stockTotalmarketValue.add(new BigDecimal(result[k].marketValue + ""));
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
    // 新顺序拼接TR行HTML
    var stockTotalStrOrder = columnOrder.map(function (column) {
        var columnName = Object.keys(column)[0];
        var html;
        if (columnName == 'name-th') {
            html = "<td>合计</td>";
        } else if (columnName == 'mini-image-th') {
            html = "<td></td>";
        } else if(columnName == 'day-income-th') {
            html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + stockDayIncomePercentStyle + ">" + parseFloat(stockDayIncome + "").toFixed(2) + "</td>" : "");
        } else if(columnName == 'change-percent-th') {
            html = "<td " + stockDayIncomePercentStyle + ">" + parseFloat(stockDayIncomePercent + "").toFixed(2) + "%</td>";
        } else if(columnName == 'change-th') {
            html = (changeDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'turn-over-rate-th') {
            html = (turnOverRateDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'price-th') {
            html = "<td></td>";
        } else if(columnName == 'cost-price-th') {
            html = (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'bonds-th') {
            html = (bondsDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'market-value-th') {
            html = (marketValueDisplay == 'DISPLAY' ? "<td>" + parseFloat(stockTotalmarketValue + "").toFixed(2) + "</td>" : "");
        } else if(columnName == 'market-value-percent-th') {
            html = (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" );
        } else if(columnName == 'cost-price-value-th') {
            html = (costPriceValueDisplay == 'DISPLAY' ? "<td>" + stockTotalCostValue + "</td>" : "");
        } else if(columnName == 'income-percent-th') {
            html = (incomePercentDisplay == 'DISPLAY' ? "<td " + stockTotalIncomePercentStyle + ">" + stockTotalIncomePercent + "%</td>" : "");
        } else if(columnName == 'income-th') {
            html = (incomeDisplay == 'DISPLAY' ? "<td " + stockTotalIncomePercentStyle + ">" + stockTotalIncome + "</td>" : "");
        } else if(columnName == 'addtime-price-th') {
            html = (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'update-time-th'){
            html = (updateTimeDisplay == 'DISPLAY' ? "<td ></td>" : "");
        }
        return html;
    }).join("");
    str += "<tr id=\"stock-tr-total\">" + stockTotalStrOrder + "</tr>";

    // 旧顺序拼接TR行HTML
    // str += "<tr id=\"stock-tr-total\">"
        // + "<td>合计</td>"
        // + (dayIncomeDisplay == 'DISPLAY' ? "<td " + stockDayIncomePercentStyle + ">" + parseFloat(stockDayIncome + "").toFixed(2) + "</td>" : "") 
        // + "<td " + stockDayIncomePercentStyle + ">" + parseFloat(stockDayIncomePercent + "").toFixed(2) + "%</td>"
        // + (changeDisplay == 'DISPLAY' ? "<td></td>" : "")
        // + "<td></td>"
        // + (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
        // + (bondsDisplay == 'DISPLAY' ? "<td></td>" : "") 
        // + (marketValueDisplay == 'DISPLAY' ? "<td>" + parseFloat(stockTotalmarketValue + "").toFixed(2) + "</td>" : "") 
        // + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
        // + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + stockTotalCostValue + "</td>" : "") 
        // + (incomePercentDisplay == 'DISPLAY' ? "<td " + stockTotalIncomePercentStyle + ">" + stockTotalIncomePercent + "%</td>" : "") 
        // + (incomeDisplay == 'DISPLAY' ? "<td " + stockTotalIncomePercentStyle + ">" + stockTotalIncome + "</td>" : "") 
        // + (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
        // + "</tr>";
    return str;
}

// 拼接基金 html
async function getFundTableHtml(result, totalMarketValueResult) {
    var str = "";
    fundTotalIncome = new BigDecimal("0");
    fundDayIncome = new BigDecimal("0");
    fundTotalmarketValue = new BigDecimal("0");
    fundTotalCostValue = new BigDecimal("0");
    for (var k in result) {
        try {
            let gszzl = parseFloat(result[k].gszzl);
            var gszzlStyle = gszzl == 0 ? "" : (gszzl > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            var dayIncome = parseFloat(result[k].dayIncome);
            var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            var incomePercent = parseFloat(result[k].incomePercent);
            var incomePercentStyle = incomePercent == 0 ? "" : (incomePercent > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
            let addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" + result[k].addTime + ")";
            // 计算基金总成本
            fundTotalCostValue = fundTotalCostValue.add(new BigDecimal(result[k].costPriceValue + ""));
            let showMinuteImageMini = await readCacheData('show-minute-image-mini');
            let minuteImageMiniDiv = "";
            if (showMinuteImageMini == 'open') {
                minuteImageMiniDiv  = "<div id=\"minute-image-mini-" + result[k].fundCode + "\" class=\"my-echart\"></div>"
            }
            var exsitJZStr = result[k].existJZ !== null && result[k].existJZ !== undefined
                && result[k].existJZ ? '(实)' : '(估)';
            // 新顺序拼接TR行HTML
            var fundStrOrder = columnOrder.map(function (column) {
                var columnName = Object.keys(column)[0];
                var html;
                if (columnName == 'name-th') {
                    html = "<td class=\"stock-fund-name-and-code\">" + result[k].name + (codeDisplay == 'DISPLAY' ? "<br>" + result[k].fundCode + "" : "") + "</td>";
                } else if (columnName == 'mini-image-th') {
                    html = "<td>" + minuteImageMiniDiv + "</td>";
                } else if(columnName == 'day-income-th') {
                    html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + result[k].dayIncome + exsitJZStr + "</td>" : "");
                } else if(columnName == 'change-percent-th') {
                    html = "<td " + gszzlStyle + ">" + result[k].gszzl + "%</td>";
                } else if(columnName == 'change-th') {
                    html = (changeDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'turn-over-rate-th') {
                    html = (turnOverRateDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'price-th') {
                    html = "<td>" + result[k].gsz + exsitJZStr + "</td>";
                } else if(columnName == 'cost-price-th') {
                    html = (costPriceDisplay == 'DISPLAY' ? "<td>" + result[k].costPrise + "</td>" : "");
                } else if(columnName == 'bonds-th') {
                    html = (bondsDisplay == 'DISPLAY' ? "<td>" + result[k].bonds + "</td>" : "");
                } else if(columnName == 'market-value-th') {
                    html = (marketValueDisplay == 'DISPLAY' ? "<td>" + result[k].marketValue + "</td>" : "");
                } else if(columnName == 'market-value-percent-th') {
                    html = (marketValuePercentDisplay == 'DISPLAY' ? "<td>" + result[k].marketValuePercent + "%</td>" : "");
                } else if(columnName == 'cost-price-value-th') {
                    html = (costPriceValueDisplay == 'DISPLAY' ? "<td>" + result[k].costPriceValue + "</td>" : "");
                } else if(columnName == 'income-percent-th') {
                    html = (incomePercentDisplay == 'DISPLAY' ? "<td " + incomePercentStyle + ">" + result[k].incomePercent + "%</td>" : "");
                } else if(columnName == 'income-th') {
                    html = (incomeDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].income + "</td>" : "");
                } else if(columnName == 'addtime-price-th') {
                    html = (addtimePriceDisplay == 'DISPLAY' ? "<td>" + addTimePrice + "</td>" : "");
                } else if(columnName == 'update-time-th'){
                    html = (updateTimeDisplay == 'DISPLAY' ? "<td >" + result[k].gztime + "</td>" : "");
                }
                return html;
            }).join("");
            str += "<tr draggable=\"true\" id=\"fund-tr-" + k + "\">" + fundStrOrder + "</tr>";

            // 旧顺序拼接TR行HTML
            // str += "<tr draggable=\"true\" id=\"fund-tr-" + k + "\">"
            //     + "<td class=\"stock-fund-name-and-code\">" + result[k].name + (codeDisplay == 'DISPLAY' ? "<br>" + result[k].fundCode + "" : "") + minuteImageMiniDiv + "</td>"
            //     + (dayIncomeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + result[k].dayIncome + "</td>" : "")
            //     + "<td " + dayIncomeStyle + ">" + result[k].gszzl + "%</td>"
            //     + (changeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">--</td>" : "")
            //     + "<td>" + result[k].gsz + "</td>"
            //     + (costPriceDisplay == 'DISPLAY' ? "<td>" + result[k].costPrise + "</td>" : "")
            //     + (bondsDisplay == 'DISPLAY' ? "<td>" + result[k].bonds + "</td>" : "")
            //     + (marketValueDisplay == 'DISPLAY' ? "<td>" + result[k].marketValue + "</td>" : "")
            //     + (marketValuePercentDisplay == 'DISPLAY' ? "<td>" + result[k].marketValuePercent + "%</td>" : "")
            //     + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + result[k].costPriceValue + "</td>" : "")
            //     + (incomePercentDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].incomePercent + "%</td>" : "")
            //     + (incomeDisplay == 'DISPLAY' ? "<td " + totalIncomeStyle + ">" + result[k].income + "</td>" : "")
            //     + (addtimePriceDisplay == 'DISPLAY' ? "<td>" + addTimePrice + "</td>" : "")
            //     + "</tr>";
            fundTotalIncome = fundTotalIncome.add(new BigDecimal(result[k].income));
            fundDayIncome = fundDayIncome.add(new BigDecimal(result[k].dayIncome + ""));
            fundTotalmarketValue = fundTotalmarketValue.add(new BigDecimal(result[k].marketValue + ""));
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
    // 新顺序拼接TR行HTML
    var fundTotalStrOrder = columnOrder.map(function (column) {
        var columnName = Object.keys(column)[0];
        var html;
        if (columnName == 'name-th') {
            html = "<td>合计</td>";
        } else if (columnName == 'mini-image-th') {
            html = "<td></td>";
        } else if(columnName == 'day-income-th') {
            html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + fundDayIncomePercentStyle + ">" + fundDayIncome + "</td>" : "");
        } else if(columnName == 'change-percent-th') {
            html = "<td " + fundDayIncomePercentStyle + ">" + fundDayIncomePercent + "%</td>"
        } else if(columnName == 'change-th') {
            html = (changeDisplay == 'DISPLAY' ? "<td></td>" : "")
        } else if(columnName == 'turn-over-rate-th') {
            html = (turnOverRateDisplay == 'DISPLAY' ? "<td></td>" : "")
        } else if(columnName == 'price-th') {
            html = "<td></td>";
        } else if(columnName == 'cost-price-th') {
            html = (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
        } else if(columnName == 'bonds-th') {
            html = (bondsDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'market-value-th') {
            html = (marketValueDisplay == 'DISPLAY' ? "<td>" + fundTotalmarketValue + "</td>" : "") 
        } else if(columnName == 'market-value-percent-th') {
            html = (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" );
        } else if(columnName == 'cost-price-value-th') {
            html = (costPriceValueDisplay == 'DISPLAY' ? "<td>" + fundTotalCostValue + "</td>" : "");
        } else if(columnName == 'income-percent-th') {
            html = (incomePercentDisplay == 'DISPLAY' ? "<td " + fundTotalIncomePercentStyle + ">" + fundTotalIncomePercent + "%</td>" : "");
        } else if(columnName == 'income-th') {
            html = (incomeDisplay == 'DISPLAY' ? "<td " + fundTotalIncomePercentStyle + ">" + fundTotalIncome + "</td>" : "");
        } else if(columnName == 'addtime-price-th') {
            html = (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'update-time-th'){
            html = (updateTimeDisplay == 'DISPLAY' ? "<td ></td>" : "");
        }
        return html;
    }).join("");
    str += "<tr id=\"fund-tr-total\">" + fundTotalStrOrder + "</tr>";

    // 旧顺序拼接TR行HTML
    // str += "<tr id=\"fund-tr-total\">"
    //     + "<td>合计</td>"
    //     + (dayIncomeDisplay == 'DISPLAY' ? "<td " + fundDayIncomePercentStyle + ">" + fundDayIncome + "</td>" : "") 
    //     + "<td colspan='2' " + fundDayIncomePercentStyle + ">" + fundDayIncomePercent + "%</td>"
    //     + (changeDisplay == 'DISPLAY' ? "<td></td>" : "")
    //     + (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
    //     + (bondsDisplay == 'DISPLAY' ? "<td></td>" : "")
    //     + (marketValueDisplay == 'DISPLAY' ? "<td>" + fundTotalmarketValue + "</td>" : "") 
    //     + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" )
    //     + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + fundTotalCostValue + "</td>" : "") 
    //     + (incomePercentDisplay == 'DISPLAY' ? "<td " + fundTotalIncomePercentStyle + ">" + fundTotalIncomePercent + "%</td>" : "") 
    //     + (incomeDisplay == 'DISPLAY' ? "<td " + fundTotalIncomePercentStyle + ">" + fundTotalIncome + "</td>" : "") 
    //     + (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "") 
    //     + "</tr>";
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
        allDayIncomePercent = allDayIncome.multiply(new BigDecimal("100")).divide(totalMarketValueResult.subtract(allDayIncome), 4);
    }
    if (totalCostPrice > 0) {
        allTotalIncomePercent = allTotalIncome.multiply(new BigDecimal("100")).divide(totalCostPrice, 4);
    }
    var allDayIncomePercentStyle = allDayIncome == 0 ? "" : (allDayIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    var allTotalIncomePercentStyle = allTotalIncome == 0 ? "" : (allTotalIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    // 新顺序拼接TR行HTML
    var totalStrOrder = columnOrder.map(function (column) {
        var columnName = Object.keys(column)[0];
        var html;
        if (columnName == 'name-th') {
            html = "<td>汇总合计</td>";
        } else if (columnName == 'mini-image-th') {
            html = "<td></td>";
        } else if(columnName == 'day-income-th') {
            html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + allDayIncomePercentStyle + ">" + parseFloat(allDayIncome + "").toFixed(2) + "</td>" : "" );
        } else if(columnName == 'change-percent-th') {
            html = "<td " + allDayIncomePercentStyle + ">" + parseFloat(allDayIncomePercent + "").toFixed(2) + "%</td>";
        } else if(columnName == 'change-th') {
            html = (changeDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'turn-over-rate-th') {
            html = (turnOverRateDisplay == 'DISPLAY' ? "<td></td>" : "")
        } else if(columnName == 'price-th') {
            html = "<td></td>";
        } else if(columnName == 'cost-price-th') {
            html = (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "" );
        } else if(columnName == 'bonds-th') {
            html = (bondsDisplay == 'DISPLAY' ? "<td></td>" : "" );
        } else if(columnName == 'market-value-th') {
            html = (marketValueDisplay == 'DISPLAY' ? "<td>" + parseFloat(totalMarketValueResult + "").toFixed(2) + "</td>" : "" );
        } else if(columnName == 'market-value-percent-th') {
            html = (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" );
        } else if(columnName == 'cost-price-value-th') {
            html = (costPriceValueDisplay == 'DISPLAY' ? "<td>" + totalCostPrice + "</td>" : "" );
        } else if(columnName == 'income-percent-th') {
            html = (incomePercentDisplay == 'DISPLAY' ? "<td " + allTotalIncomePercentStyle + ">" + allTotalIncomePercent + "%</td>" : "" );
        } else if(columnName == 'income-th') {
            html = (incomeDisplay == 'DISPLAY' ? "<td " + allTotalIncomePercentStyle + ">" + allTotalIncome + "</td>" : "" );
        } else if(columnName == 'addtime-price-th') {
            html = (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "" );
        } else if(columnName == 'update-time-th'){
            html = (updateTimeDisplay == 'DISPLAY' ? "<td ></td>" : "");
        }
        return html;
    }).join("");
    str += "<tr id=\"total-tr-total\">" + totalStrOrder + "</tr>";
    if (largetMarketTotalDisplay) {
        let str2 = '<p>持仓盈亏</p>' +
            '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncome + '</p>' +
            '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncomePercent + '%</p>';
        $("#larget-market-total").html(str2);
    }
    // 旧顺序拼接TR行HTML
    // str += "<tr id=\"total-tr-total\">"
    //     + "<td>汇总合计</td>"
    //     + (dayIncomeDisplay == 'DISPLAY' ? "<td " + allDayIncomePercentStyle + ">" + parseFloat(allDayIncome + "").toFixed(2) + "</td>" : "" )
    //     + "<td colspan='2' " + allDayIncomePercentStyle + ">" + parseFloat(allDayIncomePercent + "").toFixed(2) + "%</td>"
    //     + (changeDisplay == 'DISPLAY' ? "<td></td>" : "")
    //     + (costPriceDisplay == 'DISPLAY' ? "<td></td>" : "" )
    //     + (bondsDisplay == 'DISPLAY' ? "<td></td>" : "" )
    //     + (marketValueDisplay == 'DISPLAY' ? "<td>" + parseFloat(totalMarketValueResult + "").toFixed(2) + "</td>" : "" )
    //     + (marketValuePercentDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
    //     + (costPriceValueDisplay == 'DISPLAY' ? "<td>" + totalCostPrice + "</td>" : "" ) 
    //     + (incomePercentDisplay == 'DISPLAY' ? "<td " + allTotalIncomePercentStyle + ">" + allTotalIncomePercent + "%</td>" : "" ) 
    //     + (incomeDisplay == 'DISPLAY' ? "<td " + allTotalIncomePercentStyle + ">" + allTotalIncome + "</td>" : "" ) 
    //     + (addtimePriceDisplay == 'DISPLAY' ? "<td></td>" : "" ) 
    //     + "</tr>";
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
    if (timeCached == null || (nowTimestamp - timeCached) >= Env.TIME_CACHED_SEVEN_DAY) {
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
    var belongGroup = $("#stock-belong-group-select").val();
    console.log('belongGroup=',belongGroup,';currentGroup=',currentGroup);
    var costPrise = $("#stock-costPrise").val();
    var bonds = $("#stock-bonds").val();
    var monitorHighPrice = $("#stock-monitor-high-price").val();
    var monitorLowPrice = $("#stock-monitor-low-price").val();
    var monitorUpperPercent = $("#stock-monitor-upper-percent").val();
    var monitorLowerPercent = $("#stock-monitor-lower-percent").val();
    var newBuy = $("#new-buy-checkbox").prop("checked");
    var newBuyDate = getBeijingDate();
    
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
        "monitorUpperPercent": monitorUpperPercent,
        "monitorLowerPercent": monitorLowerPercent,
        "newBuy": newBuy,
        "newBuyDate": newBuyDate,
    }
    // var stocks = await readCacheData('stocks');
    // if (stocks == null) {
    //     stocks = [];
    // } else {
    //     stocks = jQuery.parseJSON(stocks);
    // }
    for (var k in stockList) {
        if (stockList[k].code == stock.code) {
            stockList[k].code = stock.code;
            stockList[k].costPrise = stock.costPrise;
            stockList[k].bonds = stock.bonds;
            stockList[k].monitorHighPrice = stock.monitorHighPrice;
            stockList[k].monitorLowPrice = stock.monitorLowPrice;
            stockList[k].monitorUpperPercent = stock.monitorUpperPercent;
            stockList[k].monitorLowerPercent = stock.monitorLowerPercent;
            stockList[k].newBuy = stock.newBuy;
            stockList[k].newBuyDate = stock.newBuyDate;
            stockList[k].monitorAlert = '';
            if (stockList[k].addTimePrice == null || stockList[k].addTimePrice == '') {
                let checkStockExsitResult = checkStockExsit(stockList[k].code);
                stockList[k].addTimePrice = checkStockExsitResult.now;
                stockList[k].addTime = getCurrentDate();
            }
            // 当前是全部分组，需要特殊处理
            if (currentGroup == 'all-group') {
                alertMessage('全部分组时无法编辑，请切换到指定分组后再编辑～');
                $("#stock-modal").modal("hide");
                $("#search-stock-modal").modal("hide");
                return;
            // 如果新设置的group是currentGroup则默认保存，实际上就是分组不变
            } else if (belongGroup == currentGroup) {
                // 同样都是默认group
                if (currentGroup == 'default-group') {
                    saveCacheData('stocks', JSON.stringify(stockList));
                // 同样都是非默认分组，保存到对应分组
                } else {
                    saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
                }
            // 如果新设置的group不是currentGroup需要特殊处理，也就是分组变化了
            } else {
                // 如果当前分组是默认分组，则需要先保存到新的其他分组中，再从默认分组删除
                if (currentGroup == 'default-group') {
                    // 保存到新的group中
                    var stocks = await readCacheData(belongGroup + '_stocks');
                    if (stocks == null) {
                        stocks = [];
                    } else {
                        stocks = jQuery.parseJSON(stocks);
                    }
                    for (var l in stocks) {
                        if (stocks[l].code == stockList[k].code) {
                            alertMessage("新的分组中包含该股票");
                            return;
                        }
                    }
                    stocks.push(stockList[k]);
                    saveCacheData(belongGroup + '_stocks', JSON.stringify(stocks));
                    // 从默认分组删除
                    for (var l in stockList) {
                        if (stockList[l].code == stockList[k].code) {
                            stockList.splice(l, 1)
                            break;
                        }
                    }
                    saveCacheData('stocks', JSON.stringify(stockList));
                // 如果当前分组不是默认分组，并且新分组是默认分组，则需要先保存到默认分组，再从其他分组删除
                } else if(belongGroup == 'default-group') {
                    // 保存到默认分组
                    var stocks = await readCacheData('stocks');
                    if (stocks == null) {
                        stocks = [];
                    } else {
                        stocks = jQuery.parseJSON(stocks);
                    }
                    for (var l in stocks) {
                        if (stocks[l].code == stockList[k].code) {
                            alertMessage("新的分组中包含该股票");
                            return;
                        }
                    }
                    stocks.push(stockList[k]);
                    saveCacheData('stocks', JSON.stringify(stocks));
                    // 从其他分组删除
                    for (var l in stockList) {
                        if (stockList[l].code == stockList[k].code) {
                            stockList.splice(l, 1)
                            break;
                        }
                    }
                    saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
                // 如果当前分组不是默认分组，并且新分组也不是默认分组，则需要先保存到新的其他分组，再从旧的其他分组删除
                } else {
                    // 保存到新的其他分组
                    var stocks = await readCacheData(belongGroup + '_stocks');
                    if (stocks == null) {
                        stocks = [];
                    } else {
                        stocks = jQuery.parseJSON(stocks);
                    }
                    for (var l in stocks) {
                        if (stocks[l].code == stockList[k].code) {
                            alertMessage("新的分组中包含该股票");
                            return;
                        }
                    }
                    stocks.push(stockList[k]);
                    saveCacheData(belongGroup + '_stocks', JSON.stringify(stocks));
                    // 从旧的其他分组删除
                    for (var l in stockList) {
                        if (stockList[l].code == stockList[k].code) {
                            stockList.splice(l, 1)
                            break;
                        }
                    }
                    saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
                }
            }
            // saveCacheData('stocks', JSON.stringify(stockList));
            // stockList = stocks;
            $("#stock-modal").modal("hide");
            $("#search-stock-modal").modal("hide");
            initData();
            return;
        }
    }
    let checkStockExsitResult = checkStockExsit(stock.code.replace('.oq','').replace('.ps','').replace('.n','').replace('.OQ','').replace('.PS','').replace('.N',''));
    if (!checkStockExsitResult.checkReuslt) {
        alertMessage("不存在该股票");
        $("#stock-modal").modal("hide");
        $("#search-stock-modal").modal("hide");
        return;
    }
    stock.addTimePrice = checkStockExsitResult.now;
    stock.addTime = getCurrentDate();
    stockList.push(stock);
    if (currentGroup == 'default-group' || currentGroup == 'all-group') {
        saveCacheData('stocks', JSON.stringify(stockList));
    } else {
        saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
    }
    // saveCacheData('stocks', JSON.stringify(stockList));
    // stockList = stocks;
    $("#stock-modal").modal("hide");
    $("#search-stock-modal").modal("hide");
    initData();
}

// 保存基金
async function saveFund() {
    var belongGroup = $("#fund-belong-group-select").val();
    console.log('belongGroup:',belongGroup,"currentGroup:",currentGroup);
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
    // var funds = await readCacheData('funds');
    // if (funds == null) {
    //     funds = [];
    // } else {
    //     funds = jQuery.parseJSON(funds);
    // }
    for (var k in fundList) {
        if (fundList[k].fundCode == fund.fundCode) {
            fundList[k].fundCode = fund.fundCode;
            fundList[k].costPrise = fund.costPrise;
            fundList[k].bonds = fund.bonds;
            if (isCycleInvest) {
                fundList[k].fundCycleInvestType = fund.fundCycleInvestType;
                fundList[k].fundCycleInvestDate = fund.fundCycleInvestDate;
                fundList[k].fundCycleInvestValue = fund.fundCycleInvestValue;
                fundList[k].fundCycleInvestRate = fund.fundCycleInvestRate;
            }
            if (fundList[k].addTimePrice == null || fundList[k].addTimePrice == '') {
                let checkFundExsitReuslt = checkFundExsit(fundList[k].fundCode);
                fundList[k].addTimePrice = checkFundExsitReuslt.now;
                fundList[k].addTime = getCurrentDate();
            }
            // 当前是全部分组，需要特殊处理
            if(currentGroup == 'all-group'){
                alertMessage('全部分组时无法编辑，请切换到指定分组后再编辑～');
                $("#fund-modal").modal("hide");
                $("#search-fund-modal").modal("hide");
                return;
            // 如果新设置的group是currentGroup则默认保存，实际上就是分组不变
            } else if (belongGroup == currentGroup) {
                if (currentGroup == 'default-group') {
                    saveCacheData('funds', JSON.stringify(fundList));
                } else {
                    saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
                }
            // 如果新设置的group不是currentGroup需要特殊处理，也就是分组变化了
            } else {
                // 如果当前分组是默认分组，则需要先保存到新的其他分组中，再从默认分组删除
                if (currentGroup == 'default-group') {
                    // 保存到新的group中
                    var funds = await readCacheData(belongGroup + '_funds');
                    if (funds == null) {
                        funds = [];
                    } else {
                        funds = jQuery.parseJSON(funds);
                    }
                    for (var l in funds) {
                        if (funds[l].fundCode == fundList[k].fundCode) {
                            alertMessage("新的分组中包含该基金");
                            return;
                        }
                    }
                    funds.push(fundList[k]);
                    saveCacheData(belongGroup + '_funds', JSON.stringify(funds));
                    // 从默认分组删除
                    for (var l in fundList) {
                        if (fundList[l].fundCode == fundList[k].fundCode) {
                            fundList.splice(l, 1)
                            break;
                        }
                    }
                    saveCacheData('funds', JSON.stringify(fundList));
                // 如果当前分组不是默认分组，并且新分组是默认分组，则需要先保存到默认分组，再从其他分组删除
                } else if(belongGroup == 'default-group') {
                    // 保存到默认分组
                    var funds = await readCacheData('funds');
                    if (funds == null) {
                        funds = [];
                    } else {
                        funds = jQuery.parseJSON(funds);
                    }
                    for (var l in funds) {
                        if (funds[l].fundCode == fundList[k].fundCode) {
                            alertMessage("新的分组中包含该基金");
                            return;
                        }
                    }
                    funds.push(fundList[k]);
                    saveCacheData('funds', JSON.stringify(funds));
                    // 从其他分组删除
                    for (var l in fundList) {
                        if (fundList[l].fundCode == fundList[k].fundCode) {
                            fundList.splice(l, 1)
                            break;
                        }
                    }
                    saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
                // 如果当前分组不是默认分组，并且新分组也不是默认分组，则需要先保存到新的其他分组，再从旧的其他分组删除
                } else {
                    // 保存到新的其他分组
                    var funds = await readCacheData(belongGroup + '_funds');
                    if (funds == null) {
                        funds = [];
                    } else {
                        funds = jQuery.parseJSON(funds);
                    }
                    for (var l in funds) {
                        if (funds[l].fundCode == fundList[k].fundCode) {
                            alertMessage("新的分组中包含该基金");
                            return;
                        }
                    }
                    funds.push(fundList[k]);
                    saveCacheData(belongGroup + '_funds', JSON.stringify(funds));
                    // 从旧的其他分组删除
                    for (var l in fundList) {
                        if (fundList[l].fundCode == fundList[k].fundCode) {
                            fundList.splice(l, 1)
                            break;
                        }
                    }
                    saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
                }
            }
            // if (currentGroup == 'default-group') {
            //     saveCacheData('funds', JSON.stringify(fundList));
            // } else {
            //     saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
            // }
            // fundList = funds;
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
    fundList.push(fund);
    if (currentGroup == 'default-group' || currentGroup == 'all-group') {
        saveCacheData('funds', JSON.stringify(fundList));
    } else {
        saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
    }
    // saveCacheData('funds', JSON.stringify(funds));
    // fundList = funds;
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
            } else if(values[0] == 'jj') {
                continue;
            } else {
                market = "其他"
            }
            // var option = $("<option></option>").val(values[0] + values[1].replace('.oq','').replace('.ps','').replace('.n','').toUpperCase()).text(A2U(values[2]) + " " + values[0] + values[1] + " （" + market + "）");
            var option = $("<option></option>").val(values[0] + values[1].toUpperCase()).text(A2U(values[2]) + " " + values[0] + values[1] + " （" + market + "）");
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
    console.log('改变windowsSize');
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
    let showBuyOrSellButton = document.getElementById('show-buy-or-sell-button');
    let showBuyOrSellButton2 = document.getElementById('show-buy-or-sell-button-2');
    let showWechatGroupButton = document.getElementById('show-wechat-group-button');
    let showDataCenterButton = document.getElementById('show-data-center-button');
    let timeImageDialog = document.getElementById('time-image-dialog');
    let timeImageNew = document.getElementById('time-image-new');
    let volumnImageEchart = document.getElementById('volumn-image-echart');
    let timeImageBody = document.getElementById('time-image-body');
    let groupMenuButton = document.getElementById('group-menu-button');
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
        showBuyOrSellButton.style.display = "inline";
        showBuyOrSellButton2.style.display = "inline";
        showDataCenterButton.style.display = "inline";
        groupMenuButton.style.display = "inline";
        timeImageDialog.style.maxWidth = '630px';
        timeImageDialog.style.maxHeight = '430px';
        timeImageNew.style.width = '600px';
        timeImageNew.style.height = '360px';
        volumnImageEchart.style.width = '600px';
        volumnImageEchart.style.height = '80px';
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
        helpDocumentButton.style.display = "none";
        fullScreenButton2.style.display = "inline";
        showBuyOrSellButton.style.display = "inline";
        showBuyOrSellButton2.style.display = "inline";
        showDataCenterButton.style.display = "inline";
        groupMenuButton.style.display = "inline";
        timeImageDialog.style.maxWidth = '600px';
        timeImageNew.style.width = '580px';
        timeImageNew.style.height = '300px';
        volumnImageEchart.style.width = '580px';
        volumnImageEchart.style.height = '60px';
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
        showBuyOrSellButton.style.display = "none";
        showBuyOrSellButton2.style.display = "none";
        showDataCenterButton.style.display = "none";
        groupMenuButton.style.display = "none";
        timeImageDialog.style.maxWidth = '400px';
        timeImageNew.style.width = '380px';
        timeImageNew.style.height = '280px';
        volumnImageEchart.style.width = '380px';
        volumnImageEchart.style.height = '80px';
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
        let preClose = parseFloat(result.data.preClose);
        let maxPrice = preClose;
        let minPrice = preClose;
        for (var k = 0; k < result.data.trends.length; k++) {
            let str = result.data.trends[k];
            let price = parseFloat(str.split(",")[1]);
            dataStr.push(price);
            if (k == result.data.trends.length - 1) {
                now = dataStr[k];
            }
            if (price > maxPrice) {
                maxPrice = price;
            }
            if (price < minPrice) {
                minPrice = price;
            }
        }
        if(dataStr.length == 0){
            continue;
        }
        let color;
        if (parseFloat(now) >= preClose) {
            color = redColor;
        } else {
            color = blueColor;
        }
        if (preClose >= maxPrice) {
            maxPrice = parseFloat(maxPrice) * 1.01;
        }
        if (preClose <= minPrice) {
            minPrice = parseFloat(minPrice) * 0.99;
        }
        let toFixedVolume = 2;
        if (preClose <= 5) {
            toFixedVolume = 3;
        }
        maxPrice = maxPrice.toFixed(toFixedVolume);
        minPrice = minPrice.toFixed(toFixedVolume);
        setDetailChart(elementId, dataStr, color, preClose, maxPrice, minPrice, toFixedVolume);
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
        let preClose = parseFloat(result.data.preClose);
        let maxPrice = preClose;
        let minPrice = preClose;
        for (var k = 0; k < result.data.trends.length; k++) {
            let str = result.data.trends[k];
            let price = parseFloat(str.split(",")[1]);
            dataStr.push(price);
            if (k == result.data.trends.length - 1) {
                now = dataStr[k];
            }
            if (price > maxPrice) {
                maxPrice = price;
            }
            if (price < minPrice) {
                minPrice = price;
            }
        }
        let color;
        if (parseFloat(now) >= preClose) {
            color = redColor;
        } else {
            color = blueColor;
        }
        if (preClose >= maxPrice) {
            maxPrice = parseFloat(maxPrice) * 1.01;
        }
        if (preClose <= minPrice) {
            minPrice = parseFloat(minPrice) * 0.99;
        }
        let toFixedVolume = 2;
        if (preClose <= 5) {
            toFixedVolume = 3;
        }
        maxPrice = maxPrice.toFixed(toFixedVolume);
        minPrice = minPrice.toFixed(toFixedVolume);
        setDetailChart(elementId, dataStr, color, preClose, maxPrice, minPrice, toFixedVolume);
    }
}

// 展示首页迷你分时图
function setDetailChart(elementId, dataStr, color, preClose, maxPrice, minPrice, toFixedVolume) {
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
        // lineStyle: {
        //     color: color, // 设置线的颜色
        //     // 其他样式配置
        //     width: 0.1
        // },
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
            min: minPrice,
            max: maxPrice,
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
                lineStyle: {
                    color: color, // 设置线的颜色
                    width: 1,
                },
                markLine: {
                    symbol: 'none',
                    label: {
                        show: false,  // 设置为 false，使标签上的文字不显示
                    },
                    lineStyle: {
                        color: 'gray',
                        width: 0.8,
                        type: 'dashed'
                    },
                    data: [
                        {
                            yAxis: parseFloat(preClose).toFixed(toFixedVolume)  // 在 y 轴上的 150 处添加一条横线
                        }
                    ],
                    silent: true,  // 禁用鼠标事件
                },
            }
        ]
    };
    myChart.setOption(option);
}

// 修改涨跌蓝绿颜色
async function changeBlueRed(event) {
    let targetId = event.target.id;
    if (targetId == 'change-blue-red-button') {
        if (blueColor == '#093') {
            blueColor = '#ee2500';
        } else if (blueColor == '#ee2500') {
            blueColor = '#093';
        } else { // 隐身模式下，变为红绿模式
            blueColor = '#093'; 
        }
        if (redColor == '#ee2500') {
            redColor = '#093';
        } else if (redColor == '#093') {
            redColor = '#ee2500';
        } else { // 隐身模式下，变为红绿模式
            redColor = '#ee2500';
        }
    } else if (targetId == 'change-black-button'){
        if (blueColor == '#545454') {// 已经是隐身模式了点击变更为红绿模式
            blueColor = '#093'; 
            redColor = '#ee2500';
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
    initHtml();
    initData();
}

// 展示数据导入页面
function showImportData() {
    $("#setting-modal").modal("hide");
    $("#data-import-modal").modal();
}

// 数据导出
async function dataExport() {
    var data = {};
    data.stocks = jQuery.parseJSON(await readCacheData('stocks'));
    data.funds = jQuery.parseJSON(await readCacheData('funds'));
    data.groups = await readCacheData('groups');
    // 遍历json.groups获取所有value
    await Promise.all(Object.keys(groups).map(async (id) => {
        if (id == 'default-group') return;
        data[id + '_stocks'] = jQuery.parseJSON(await readCacheData(id + '_stocks'));
        data[id + '_funds'] = jQuery.parseJSON(await readCacheData(id + '_funds'));
    }));
    downloadJsonOrTxt('股票基金神器.txt', JSON.stringify(data));
}

// 清除所有数据
function removeAllData() {
    let stocksRemove = [];
    let fundsRemove = [];
    if (currentGroup == 'default-group') {
        saveCacheData('stocks', JSON.stringify(stocksRemove));
        saveCacheData('funds', JSON.stringify(fundsRemove));
    } else {
        saveCacheData(currentGroup + '_stocks', JSON.stringify(stocksRemove));
        saveCacheData(currentGroup + '_funds', JSON.stringify(fundsRemove));
    }
    stockList = [];
    fundList = [];
    $("#setting-modal").modal("hide");
    reloadDataAndHtml();
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
        sendChromeBadge('#FFFFFF', '#FFFFFF', '');
        return;
    }
    let stock = checkStockExsit(code);
    let now = stock.now;
    let openPrice = stock.openPrice;
    let badgeBackgroundColor;
    if (parseFloat(now) >= parseFloat(openPrice)) {
        badgeBackgroundColor = '#ee2500';
    } else {
        badgeBackgroundColor = '#093';
    }
    if (now.length >= 5) {
        now = parseFloat(now.substring(0, 5));
    }
    if (monitorPriceOrPercent == null || monitorPriceOrPercent == 'PRICE'
        || monitorPriceOrPercent == 'DAY_INCOME') {
        sendChromeBadge('#FFFFFF', badgeBackgroundColor, "" + now);
        if (monitorPriceOrPercent == null || monitorPriceOrPercent == 'DAY_INCOME') {
            let param = {target:{id:'monitor-price-change-button'}};
            changeMonitorPriceOrPercent(param);
        }
    } else {
        let changePercent = parseFloat(stock.changePercent);
        if(changePercent < 0) {
            changePercent = 0 - changePercent;
        }
        sendChromeBadge('#FFFFFF', badgeBackgroundColor, "" + changePercent.toFixed(2));
    }
    saveCacheData("MONITOR_STOCK_CODE", code);
}

// 清理角标
async function removeBadgeText() {
    saveCacheData("MONITOR_STOCK_CODE", '');
    sendChromeBadge('#FFFFFF', '#FFFFFF', '');
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
    let fundOrStockName = getFundOrStockNameByTimeImageCode(timeImageCode, timeImageType);
    $("#fund-invers-position-name").html(fundOrStockName);
    // 设置监听点击持仓明细事件
    for (k in fundStocksDetail) {
        let fundStocksDetailTr = document.getElementById('fund-stock-detail-tr-' + k);
        fundStocksDetailTr.addEventListener('click', async function () {
            let stockCode = fundStocksDetail[this.sectionRowIndex].f12;
            let secid = fundStocksDetail[this.sectionRowIndex].f13;
            if (stockCode.length == 6 && stockCode.startsWith("6")) {
                stockCode = "sh" + stockCode;
            } else if (stockCode.length == 6 && (stockCode.startsWith("0") || stockCode.startsWith("3"))) {
                stockCode = "sz" + stockCode;
            } else if(stockCode.length == 5 || secid == 116) {
                stockCode = "hk" + stockCode;
            } else if(secid == 105 || secid == 106 || secid == 153) {
                stockCode = "us" + stockCode;
            }
            timeImageCode = stockCode;
            timeImageSecid = secid;
            timeImageType = "STOCK";
            timeImageName = fundStocksDetail[this.sectionRowIndex].f14;
            showMinuteImage();
            // var result = confirm("是否添加" + fundStocksDetail[this.sectionRowIndex].f14 + "?");
            // if (result) {
            //     let stockCode = fundStocksDetail[this.sectionRowIndex].f12;
            //     if (stockCode.length == 6 && stockCode.startsWith("6")) {
            //         stockCode = "sh" + stockCode;
            //     } else if (stockCode.length == 6 && (stockCode.startsWith("0") || stockCode.startsWith("3"))) {
            //         stockCode = "sz" + stockCode;
            //     } else if(stockCode.length == 5) {
            //         stockCode = "hk" + stockCode;
            //     }
            //     $("#stock-code").val(stockCode);
            //     $("#stock-costPrise").val('');
            //     $("#stock-bonds").val('');
            //     $("#stock-monitor-high-price").val('');
            //     $("#stock-monitor-low-price").val('');
            //     $("#new-buy-checkbox").prop("checked", false);
            //     await saveStock();
            //     $("#stock-code").val('');
            //     $("#fund-invers-position-modal").modal("hide");
            // }
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
    let fundNetDiagramName = getFundOrStockNameByTimeImageCode(timeImageCode, timeImageType);
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
                showSymbol: false,  // 不显示小圆点
            },
            {
                name: '累计净值',
                data: dataLJJZ,
                type: 'line',
                smooth: true,
                color: 'red',
                showSymbol: false,  // 不显示小圆点
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
        graphic: [
            {
                type: 'line',
                shape: {
                    x1: '10%', y1: '10%',
                    x2: '90%', y2: '10%'
                },
                style: {
                    stroke: 'green',
                    lineWidth: 2
                },
                elements: [
                    {
                        type: 'text',
                        left: '5%',
                        top: '5%',
                        style: {
                            text: fundNetDiagramName,
                            textAlign: 'left',
                            fill: '#333',
                            fontSize: 14
                        }
                    }
                ]
            }
        ],
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
    if (type != 'all-display-checkbox' && dispaly == 'HIDDEN') {
        allDisplay = dispaly;
        $("#all-display-checkbox").prop("checked", false);
        saveCacheData('all-display', dispaly);
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
    } else if(type == 'change-display-checkbox') {
        changeDisplay = dispaly;
        saveCacheData('change-display', dispaly);
    } else if(type == 'turn-over-rate-display-checkbox') {
        turnOverRateDisplay = dispaly;
        saveCacheData('turn-over-rate-display', dispaly);
    } else if(type == 'update-time-display-checkbox') {
        updateTimeDisplay = dispaly;
        saveCacheData('update-time-display', dispaly);
    } else if(type == 'all-display-checkbox') {
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
        changeDisplay = dispaly;
        updateTimeDisplay = dispaly;
        turnOverRateDisplay = dispaly;
        allDisplay = dispaly;
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
        saveCacheData('change-display', dispaly);
        saveCacheData('update-time-display', dispaly);
        saveCacheData('turn-over-rate-display', dispaly);
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
            $("#change-display-checkbox").prop("checked", true);
            $("#update-time-display-checkbox").prop("checked", true);
            $("#turn-over-rate-display-checkbox").prop("checked", true);
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
            $("#change-display-checkbox").prop("checked", false);
            $("#update-time-display-checkbox").prop("checked", false);
            $("#turn-over-rate-display-checkbox").prop("checked", false);
        }
    }
    initHtml();
    initData();
}

// 抽象文件导入方法
async function fileInput (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    let fileName = file.name;
    reader.onload = function (e) {
        var contents = e.target.result;
        try {
            var json = JSON.parse(contents);
            if (json.stocks == null || json.stocks == '' || json.stocks == "null"
                || json.stocks == undefined || json.stocks == 'undefined') {
                json.stocks = [];
            }
            if (json.funds == null || json.funds == '' || json.funds == "null"
                || json.funds == undefined || json.funds == 'undefined') {
                json.funds = [];
            }
            if (json.groups == null || json.groups == '' || json.groups == "null"
            || json.groups == undefined || json.groups == 'undefined') {
                json.groups = {"default-group":"默认分组"};
            }
            // 在这里处理您的 JSON 数据
            saveCacheData('stocks', JSON.stringify(json.stocks));
            saveCacheData('funds', JSON.stringify(json.funds));
            saveCacheData('groups', json.groups);
            // 遍历json.groups获取所有value
            Object.keys(groups).forEach(id => {
                if (id == 'default-group') return;
                if (json[id + '_stocks'] == null || json[id + '_stocks'] == '' 
                    || json[id + '_stocks'] == undefined || json[id + '_stocks'] == 'undefined'){
                    json[id + '_stocks'] = [];
                }
                if (json[id + '_funds'] == null || json[id + '_funds'] == '' 
                    || json[id + '_funds'] == undefined || json[id + '_funds'] == 'undefined'){
                    json[id + '_funds'] = [];
                }
                saveCacheData(id + '_stocks', JSON.stringify(json[id + '_stocks']));
                saveCacheData(id + '_funds', JSON.stringify(json[id + '_funds']));
            });
            if (currentGroup == 'default-group') {
                stockList = json.stocks;
                fundList = json.funds;
            } else if (currentGroup in json.groups) {
                stockList = json[currentGroup + '_stocks'];
                fundList = json[currentGroup + '_funds'];
            }
            groups = json.groups;
        } catch(error) {
            // 文本格式非json，需要单独处理，contents文本的每一行只有code读取到stocks中
            if (fileName.indexOf('FUND') >= 0 || fileName.indexOf('fund') >= 0) {
                var lines = contents.split('\n');
                lines.forEach(function(line) {
                    // 假设每行文本包含一个股票代码，可以根据需要添加额外的逻辑来处理每行的数据
                    var code = line.trim(); // 去除每行开头和结尾的空白字符
                    if (code !== '') {
                        let fund = {
                            "fundCode": code,
                            "costPrise":"0",
                            "bonds":"0"
                        }
                        fundList.push(fund);
                    }
                });
                saveCacheData('funds', JSON.stringify(fundList));
            } else {
                var lines = contents.split('\n');
                lines.forEach(function(line) {
                    // 假设每行文本包含一个股票代码，可以根据需要添加额外的逻辑来处理每行的数据
                    var code = line.trim(); // 去除每行开头和结尾的空白字符
                    if (code !== '') {
                        let stock = {
                            "code": code,
                            "costPrise":"0",
                            "bonds":"0"
                        }
                        stockList.push(stock);
                    }
                });
                saveCacheData('stocks', JSON.stringify(stockList));
            }
        }
        $("#data-import-modal").modal("hide");
        reloadDataAndHtml();
    };
    reader.readAsText(file);
}

// 从本地 SpringBoot 项目获取数据
async function getStockAndFundFromLocalService () {
    let result = ajaxGetStockAndFundFromLocalService();
    if (result != null && result != '' && result != undefined) {
        if (currentGroup == 'default-group') {
            saveCacheData('stocks', JSON.stringify(result.stocks));
            saveCacheData('funds', JSON.stringify(result.funds));
        } else {
            saveCacheData(currentGroup + '_stocks', JSON.stringify(result.stocks));
            saveCacheData(currentGroup + '_funds', JSON.stringify(result.funds));
        }
        if (result.dayIncomeHistorys != null && result.dayIncomeHistorys != ''
            && result.dayIncomeHistorys != []) {
            let filteredData = result.dayIncomeHistorys.map(item => {
                return {
                    date: item.date.replaceAll('-', ''),
                    stockDayIncome: item.stockDayIncome,
                    fundDayIncome: item.fundDayIncome
                };
            });
            filteredData.sort((a, b) => {
                if (a.date > b.date) {
                    return 1;
                }
                if (a.date < b.date) {
                    return -1;
                }
                return 0;
            });
            saveCacheData('DAY_INCOME_HISTORY', filteredData);
        }
        stockList = result.stocks;
        fundList = result.funds;
        reloadDataAndHtml();
        $("#setting-modal").modal("hide");
    }
}

// 删除基金或股票
async function deleteStockAndFund() {
    var checkResult = confirm("是否确认删除？");
    if (!checkResult) {
        return;
    }
    if (timeImageType == "FUND") {
        for (var k in fundList) {
            if (fundList[k].fundCode == timeImageCode) {
                // delete funds[k];
                fundList.splice(k, 1)
                break;
            }
        }
        if (currentGroup == 'default-group') {
            saveCacheData('funds', JSON.stringify(fundList));
        } else {
            saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
        }
        $("#time-image-modal").modal("hide");
        $("#fund-modal").modal("hide");
    } else {
        for (var k in stockList) {
            if (stockList[k].code == timeImageCode) {
                // delete stocks[k];
                stockList.splice(k, 1)
                break;
            }
        }
        if (currentGroup == 'default-group') {
            saveCacheData('stocks', JSON.stringify(stockList));
        } else {
            saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
        }
        $("#time-image-modal").modal("hide");
        $("#stock-modal").modal("hide");
    }
    reloadDataAndHtml();
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
async function showDonate() {
    $("#donate-modal").modal();
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
        let currentFund;
        for (var k in fundList) {
            if (fundList[k].fundCode == timeImageCode) {
                currentFund = fundList[k];
                fundList.splice(k, 1)
                break;
            }
        }
        fundList.unshift(currentFund);
        if (currentGroup == 'default-group') {
            saveCacheData('funds', JSON.stringify(fundList));
        } else {
            saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
        }
    // 股票编辑页面/股票分时图页面点击置顶
    } else {
        let currentStock;
        for (var k in stockList) {
            if (stockList[k].code == timeImageCode) {
                currentStock = stockList[k];
                stockList.splice(k, 1)
                break;
            }
        }
        stockList.unshift(currentStock);
        if (currentGroup == 'default-group') {
            saveCacheData('stocks', JSON.stringify(stockList));
        } else {
            saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
        }
    }
    $("#time-image-modal").modal("hide");
    $("#stock-modal").modal("hide");
    reloadDataAndHtml();
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
            if (result.groups != null && result.groups != undefined
                 && result.groups != '' && result.groups != 'null') {
                groups = result.groups;
                saveCacheData('groups', result.groups);
                // 遍历json.groups获取所有value
                Object.keys(groups).forEach(id => {
                    if (id == 'default-group') return;
                    // console.log('json[id + _stocks]', json[id + '_stocks']);
                    saveCacheData(id + '_stocks', JSON.stringify(result[id + '_stocks']));
                    saveCacheData(id + '_funds', JSON.stringify(result[id + '_funds']));
                });
            } else {
                groups = [];
                saveCacheData('groups', groups);
            }
            if (currentGroup == 'default-group') {
                stockList = result.stocks;
                fundList = result.funds;
            } else if((currentGroup + '_stocks') in result && (currentGroup + '_funds') in result) {
                stockList = result[currentGroup + '_stocks'];
                fundList = result[currentGroup + '_funds'];
            }
            reloadDataAndHtml();
            $("#sync-data-cloud-modal").modal('hide');
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
    let stockListCache = jQuery.parseJSON(await readCacheData('stocks'));
    for (k in stockListCache) {
        let syncStock = {
            "code" : stockListCache[k].code,
            "costPrise" : stockListCache[k].costPrise,
            "bonds" : stockListCache[k].bonds,
            "monitorHighPrice" : stockListCache[k].monitorHighPrice,
            "monitorLowPrice" : stockListCache[k].monitorLowPrice,
            "monitorUpperPercent" : stockListCache[k].monitorUpperPercent,
            "monitorLowerPercent" : stockListCache[k].monitorLowerPercent,
        }
        syncStocks.push(syncStock);
    }
    let fundListCache = jQuery.parseJSON(await readCacheData('funds'));
    for (k in fundListCache) {
        let syncFund = {
            "fundCode" : fundListCache[k].fundCode,
            "costPrise" : fundListCache[k].costPrise,
            "bonds" : fundListCache[k].bonds
        }
        syncFunds.push(syncFund);
    }
    data.stocks = syncStocks;
    data.funds = syncFunds;
    data.updateTime = getBeijingTime();
    data.groups = groups;
    // 遍历json.groups获取所有value
    await Promise.all(Object.keys(groups).map(async (id) => {
        if (id == 'default-group') return;
        data[id + '_stocks'] = jQuery.parseJSON(await readCacheData(id + '_stocks'));
        data[id + '_funds'] = jQuery.parseJSON(await readCacheData(id + '_funds'));
    }));
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

// 获取北京时间格式的日期时间，2023/01/01 00:00:00格式
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

// 获取北京时间格式的日期，2023-01-01格式
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

// 获取北京时间格式的日期，20230101格式
function getBeijingDateNoSlash() {
    let date = new Date();
    let options = {
      timeZone: 'Asia/Shanghai',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    let formattedDate = date.toLocaleString('zh-CN', options);
    return formattedDate.replace(/\//g, '');
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
    if (currentGroup == 'default-group') {
        saveCacheData('stocks', JSON.stringify(stockList));
    } else {
        saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
    }
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
                if (currentGroup == 'default-group') {
                    saveCacheData('funds', JSON.stringify(fundList));
                } else {
                    saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
                }
                if (lastSort.fund.targetId.indexOf('fund') >= 0) {
                    lastSort.fund.targetId = '';
                    lastSort.fund.sortType = 'order';
                    saveCacheData('last-sort', lastSort);
                }
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
                if (currentGroup == 'default-group') {
                    saveCacheData('stocks', JSON.stringify(stockList));
                } else {
                    saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
                }
                if (lastSort.stock.targetId.indexOf('stock') >= 0) {
                    lastSort.stock.targetId = '';
                    lastSort.stock.sortType = 'order';
                    saveCacheData('last-sort', lastSort);
                }
            }
            initHtml();
            initData();
        });
    }
}

// 从同花顺/雪球/东方财富导入
async function addStockFromTonghuashunXueqiu() {
    let data = await readCacheData('tonghuashun-xueqiu-stock');
    console.log('从同花顺/雪球/东方财富导入的数据：', data );
    for (let k in data) {
        let code = data[k];
        let stock = {
            "code": code,
            "costPrise": "0",
            "bonds": "0"
        }
        let existInStockList = false;
        for (let l in stockList) {
            if (stockList[l].code == stock.code) {
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
        stockList.push(stock);
    }
    if (currentGroup == 'default-group') {
        saveCacheData('stocks', JSON.stringify(stockList));
    } else {
        saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
    }
    $("#setting-modal").modal("hide");
    initData();
}

// 切换隐身模式
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

    document.getElementById('show-data-center-button').classList.remove(btnInfoCss);
    document.getElementById('show-data-center-button').classList.remove(btnLightCss);
    document.getElementById('show-data-center-button').classList.add(blackCss);

    document.getElementById('refresh-button').classList.remove(btnInfoCss);
    document.getElementById('refresh-button').classList.remove(btnLightCss);
    document.getElementById('refresh-button').classList.add(blackCss);

    document.getElementById('group-menu-button').classList.remove(btnInfoCss);
    document.getElementById('group-menu-button').classList.remove(btnLightCss);
    document.getElementById('group-menu-button').classList.add(blackCss);

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
async function clickSortStockAndFund(event) {
    let targetId = event.target.id;
    // 第一次未排序时候点击，按正序排列，并把之前未排序的顺序保存起来
    if (document.getElementById(targetId).classList.contains('order')) {
        if (targetId.indexOf('stock-') >= 0) {
            lastSort.stock.sortType = 'asc';
            lastSort.stock.targetId = targetId;
        } else {
            lastSort.fund.sortType = 'asc';
            lastSort.fund.targetId = targetId;
        }
    // 第二次点击，之前已经正序排序，这次按倒序排列
    } else if(document.getElementById(targetId).classList.contains('asc')) {
        if (targetId.indexOf('stock-') >= 0) {
            lastSort.stock.sortType = 'desc';
            lastSort.stock.targetId = targetId;
        } else {
            lastSort.fund.sortType = 'desc';
            lastSort.fund.targetId = targetId;
        }
    // 第三次点击，之前已经倒序排序，这次恢复第一次未排序的顺序
    } else {
        if (targetId.indexOf('stock-') >= 0) {
            lastSort.stock.sortType = 'order';
            lastSort.stock.targetId = '';
            var stocks;
            if (currentGroup == 'default-group') {
                stocks = await readCacheData('stocks');
            }
            if (currentGroup != 'default-group') {
                stocks = await readCacheData(currentGroup + '_stocks');
            }
            stockList = jQuery.parseJSON(stocks);
        } else {
            lastSort.fund.sortType = 'order';
            lastSort.fund.targetId = '';
            var funds;
            if (currentGroup == 'default-group') {
                funds = await readCacheData('funds');
            }
            if (currentGroup != 'default-group') {
                funds = await readCacheData(currentGroup + '_funds');
            }
            fundList = jQuery.parseJSON(funds);
        }
    }
    saveCacheData("last-sort", lastSort);
    initHtml();
    initData();
}

// 对股票/基金按照点击的列进行排序
async function sortStockAndFund(totalMarketValue) {
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        stockList.forEach(function (stock) {
            if (totalMarketValue.compareTo(new BigDecimal("0")) != 0) {
                let marketValuePercent = (new BigDecimal(stock.marketValue + "")).multiply(new BigDecimal("100")).divide(totalMarketValue, 4);
                stock.marketValuePercent = marketValuePercent + "";
            } else {
                stock.marketValuePercent = "0.00";
            }
        });
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        fundList.forEach(function (fund) {
            if (totalMarketValue.compareTo(new BigDecimal("0")) != 0) {
                let marketValuePercent = (new BigDecimal(fund.marketValue + "")).multiply(new BigDecimal("100")).divide(totalMarketValue, 4);
                fund.marketValuePercent = marketValuePercent + "";
            } else {
                fund.marketValuePercent = "0.00";
            }
        });
    }
    if ((showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') && lastSort.stock != null && lastSort.stock.sortType != 'order') {
        stockList.sort(function (a, b) {
            let targetId = lastSort.stock.targetId;
            if (targetId == 'stock-name-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            } else if (targetId == 'stock-day-income-th') {
                if(lastSort.stock.sortType == 'asc') {
                    return parseFloat(a.dayIncome + "") - parseFloat(b.dayIncome + "");
                } else {
                    return parseFloat(b.dayIncome + "") - parseFloat(a.dayIncome + "");
                }
            } else if (targetId == 'stock-change-percent-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.changePercent + "") - parseFloat(b.changePercent + "");
                } else {
                    return parseFloat(b.changePercent + "") - parseFloat(a.changePercent + "");
                }
            } else if (targetId == 'stock-turn-over-rate-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.turnOverRate + "") - parseFloat(b.turnOverRate + "");
                } else {
                    return parseFloat(b.turnOverRate + "") - parseFloat(a.turnOverRate + "");
                }
            } else if (targetId == 'stock-change-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.change + "") - parseFloat(b.change + "");
                } else {
                    return parseFloat(b.change + "") - parseFloat(a.change + "");
                }
            } else if (targetId == 'stock-price-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.now + "") - parseFloat(b.now + "");
                } else {
                    return parseFloat(b.now + "") - parseFloat(a.now + "");
                }
            } else if (targetId == 'stock-cost-price-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.costPrise + "") - parseFloat(b.costPrise + "");
                } else {
                    return parseFloat(b.costPrise + "") - parseFloat(a.costPrise + "");
                }
            } else if (targetId == 'stock-bonds-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.bonds + "") - parseFloat(b.bonds + "");
                } else {
                    return parseFloat(b.bonds + "") - parseFloat(a.bonds + "");
                }
            } else if (targetId == 'stock-market-value-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.marketValue + "") - parseFloat(b.marketValue + "");
                } else {
                    return parseFloat(b.marketValue + "") - parseFloat(a.marketValue + "");
                }
            } else if (targetId == 'stock-market-value-percent-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.marketValuePercent + "") - parseFloat(b.marketValuePercent + "");
                } else {
                    return parseFloat(b.marketValuePercent + "") - parseFloat(a.marketValuePercent + "");
                }
            } else if (targetId == 'stock-cost-price-value-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.costPriceValue + "") - parseFloat(b.costPriceValue + "");
                } else {
                    return parseFloat(b.costPriceValue + "") - parseFloat(a.costPriceValue + "");
                }
            } else if (targetId == 'stock-income-percent-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.incomePercent + "") - parseFloat(b.incomePercent + "");
                } else {
                    return parseFloat(b.incomePercent + "") - parseFloat(a.incomePercent + "");
                }
            } else if (targetId == 'stock-income-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.income + "") - parseFloat(b.income + "");
                } else {
                    return parseFloat(b.income + "") - parseFloat(a.income + "");
                }
            } else {
                return 0;
            }
        })
    } 
    if ((showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') && lastSort.fund != null && lastSort.fund.sortType != 'order') {
        let targetId = lastSort.fund.targetId;
        fundList.sort(function (a, b) {
            if (targetId == 'fund-name-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            } else if (targetId == 'fund-day-income-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.dayIncome + "") - parseFloat(b.dayIncome + "");
                } else {
                    return parseFloat(b.dayIncome + "") - parseFloat(a.dayIncome + "");
                }
            } else if (targetId == 'fund-change-percent-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.gszzl + "") - parseFloat(b.gszzl + "");
                } else {
                    return parseFloat(b.gszzl + "") - parseFloat(a.gszzl + "");
                }
            } else if (targetId == 'fund-price-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.gsz + "") - parseFloat(b.gsz + "");
                } else {
                    return parseFloat(b.gsz + "") - parseFloat(a.gsz + "");
                }
            } else if (targetId == 'fund-cost-price-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.costPrise + "") - parseFloat(b.costPrise + "");
                } else {
                    return parseFloat(b.costPrise + "") - parseFloat(a.costPrise + "");
                }
            } else if (targetId == 'fund-bonds-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.bonds + "") - parseFloat(b.bonds + "");
                } else {
                    return parseFloat(b.bonds + "") - parseFloat(a.bonds + "");
                }
            } else if (targetId == 'fund-market-value-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.marketValue + "") - parseFloat(b.marketValue + "");
                } else {
                    return parseFloat(b.marketValue + "") - parseFloat(a.marketValue + "");
                }
            } else if (targetId == 'fund-market-value-percent-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.marketValuePercent + "") - parseFloat(b.marketValuePercent + "");
                } else {
                    return parseFloat(b.marketValuePercent + "") - parseFloat(a.marketValuePercent + "");
                }
            } else if (targetId == 'fund-cost-price-value-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.costPriceValue + "") - parseFloat(b.costPriceValue + "");
                } else {
                    return parseFloat(b.costPriceValue + "") - parseFloat(a.costPriceValue + "");
                }
            } else if (targetId == 'fund-income-percent-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.incomePercent + "") - parseFloat(b.incomePercent + "");
                } else {
                    return parseFloat(b.incomePercent + "") - parseFloat(a.incomePercent + "");
                }
            } else if (targetId == 'fund-income-th') {
                if(lastSort.fund.sortType == 'asc'){
                    return parseFloat(a.income + "") - parseFloat(b.income + "");
                } else {
                    return parseFloat(b.income + "") - parseFloat(a.income + "");
                }
            } else {
                return 0;
            }
        })
    }
}

// 展示数据中心
async function showDataCenter() {
    $('#data-center-modal').modal('show');
    showBigStockMoney();
}

// 展示大盘资金图表
async function showBigStockMoney() {
    let result = ajaxGetBigStockMoney();
    let elementId = 'data-center-chart';
    let dataZhuLiJingLiuRu = [];
    let dataXiaoDanJingLiuRu = [];
    let dataZhongDanJingLiuRu = [];
    let dataDaDanJingLiuRu = [];
    let dataChaoDaDanJingLiuRu = [];
    let dataAxis = [];
    if (result.data == null || result.data.klines == null){
        return;
    }
    let oneHundredMillion = new BigDecimal("100000000");
    dataAxis.push("09:30");
    dataZhuLiJingLiuRu.push(parseFloat("0"));
    dataXiaoDanJingLiuRu.push(parseFloat("0"));
    dataZhongDanJingLiuRu.push(parseFloat("0"));
    dataDaDanJingLiuRu.push(parseFloat("0"));
    dataChaoDaDanJingLiuRu.push(parseFloat("0"));
    for (var k = 0; k < result.data.klines.length; k++) {
        let str = result.data.klines[k];
        let zhuLiJingLiuRu = new BigDecimal(str.split(",")[1] + "");
        zhuLiJingLiuRu = zhuLiJingLiuRu.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
        let xiaoDanJingLiuRu = new BigDecimal(str.split(",")[2] + "");
        xiaoDanJingLiuRu = xiaoDanJingLiuRu.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP)
        let zhongDanJingLiuRu = new BigDecimal(str.split(",")[3] + "");
        zhongDanJingLiuRu = zhongDanJingLiuRu.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP)
        let daDanJingLiuRu = new BigDecimal(str.split(",")[4] + "");
        daDanJingLiuRu = daDanJingLiuRu.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP)
        let chaoDaDanJingLiuRu = new BigDecimal(str.split(",")[5] + "");
        chaoDaDanJingLiuRu = chaoDaDanJingLiuRu.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP)

        dataZhuLiJingLiuRu.push(parseFloat(zhuLiJingLiuRu + ""));
        dataXiaoDanJingLiuRu.push(parseFloat(xiaoDanJingLiuRu + ""));
        dataZhongDanJingLiuRu.push(parseFloat(zhongDanJingLiuRu + ""));
        dataDaDanJingLiuRu.push(parseFloat(daDanJingLiuRu + ""));
        dataChaoDaDanJingLiuRu.push(parseFloat(chaoDaDanJingLiuRu + ""));
        dataAxis.push(str.split(",")[0].split(" ")[1]);
        bigStockMoneyDate = str.split(",")[0].split(" ")[0] + " ";
    }
    if(dataZhuLiJingLiuRu.length == 0) {
        return;
    }
    let lastZhuLiJingLiuRu = dataZhuLiJingLiuRu[dataZhuLiJingLiuRu.length-1];
    let lastXiaoDanJingLiuRu = dataXiaoDanJingLiuRu[dataXiaoDanJingLiuRu.length-1];
    let lastZhongDanJingLiuRu = dataZhongDanJingLiuRu[dataZhongDanJingLiuRu.length-1];
    let lastDaDanJingLiuRu = dataDaDanJingLiuRu[dataDaDanJingLiuRu.length-1];
    let lastChaoDaDanJingLiuRu = dataChaoDaDanJingLiuRu[dataChaoDaDanJingLiuRu.length-1];
    let contentHtml = "主力净流入: <font color=" + (parseFloat(lastZhuLiJingLiuRu) >= 0 ? "red" : "green")+ ">" + lastZhuLiJingLiuRu + "</font> 亿元";
    contentHtml += "  小单净流入: <font color=" + (parseFloat(lastXiaoDanJingLiuRu) >= 0 ? "red" : "green")+ ">" + lastXiaoDanJingLiuRu + "</font> 亿元";
    contentHtml += "  中单净流入: <font color=" + (parseFloat(lastZhongDanJingLiuRu) >= 0 ? "red" : "green")+ ">" + lastZhongDanJingLiuRu + "</font> 亿元<br>";
    contentHtml += "大单净流入: <font color=" + (parseFloat(lastDaDanJingLiuRu) >= 0 ? "red" : "green")+ ">" + lastDaDanJingLiuRu + "</font> 亿元";
    contentHtml += "  超大单净流入: <font color=" + (parseFloat(lastChaoDaDanJingLiuRu) >= 0 ? "red" : "green")+ ">" + lastChaoDaDanJingLiuRu + "</font> 亿元<br>";
    let wholeTwoMarketMoney = ajaxGetWholeTwoMarketMoney();
    if (wholeTwoMarketMoney != null && wholeTwoMarketMoney.data.diff != null) {
        let shen = wholeTwoMarketMoney.data.diff[0];
        let hu = wholeTwoMarketMoney.data.diff[1];
        let totalMoney = (new BigDecimal(shen.f6 + "")).add(new BigDecimal(hu.f6 + ""));
        totalMoney = totalMoney.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
        contentHtml += "沪深两市总成交额: " + totalMoney + " 亿元";
        let up = parseInt(shen.f104) + parseInt(hu.f104);
        let down = parseInt(shen.f105) + parseInt(hu.f105);
        let ping = parseInt(shen.f106) + parseInt(hu.f106);
        contentHtml += " 上涨: <font color=red>" + up + "</font> 平盘: " + ping + " 下跌: <font color=green>" + down + "</font>";
    }
    $("#data-center-content").html(contentHtml);
    if (dataZhuLiJingLiuRu.length < 241) {
        const diffLength = 241 - dataZhuLiJingLiuRu.length;
        const emptyData = Array(diffLength).fill(''); // 使用 null 填充空数据
        dataZhuLiJingLiuRu = dataZhuLiJingLiuRu.concat(emptyData);
        dataXiaoDanJingLiuRu = dataXiaoDanJingLiuRu.concat(emptyData);
        dataZhongDanJingLiuRu = dataZhongDanJingLiuRu.concat(emptyData);
        dataDaDanJingLiuRu = dataDaDanJingLiuRu.concat(emptyData);
        dataChaoDaDanJingLiuRu = dataChaoDaDanJingLiuRu.concat(emptyData);
        dataAxis = dataAxis.concat(emptyData);
    }
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    option = {
        title: {
            text: '大盘资金（沪深）资金流入', // 设置整个图表的标题
            left: 'center', // 标题水平居中
            top: 0 // 标题距离图表顶部的距离
        },
        legend: {
            data: ['主力净流入', '小单净流入', '中单净流入', '大单净流入', '超大单净流入'],
            top: 30
        },
        // resize: true,
        lineStyle: {
            // color: color, // 设置线的颜色
            // 其他样式配置
            width: 1,
            opacity: 0.5
        },
        xAxis: {
            data: dataAxis,
            type: 'category',
            axisLabel: {
                interval: 29 // 调整刻度显示间隔
            },
            min: "09:30",
        },
        yAxis: {
            scale: true,
            type: 'value',
        },
        series: [
            {
                name: '主力净流入',
                data: dataZhuLiJingLiuRu,
                type: 'line',
                smooth: true,
            },
            {
                name: '小单净流入',
                data: dataXiaoDanJingLiuRu,
                type: 'line',
                smooth: true,
            },
            {
                name: '中单净流入',
                data: dataZhongDanJingLiuRu,
                type: 'line',
                smooth: true,
            },
            {
                name: '大单净流入',
                data: dataDaDanJingLiuRu,
                type: 'line',
                smooth: true,
            },
            {
                name: '超大单净流入',
                data: dataChaoDaDanJingLiuRu,
                type: 'line',
                smooth: true,
            },
        ],
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
                return "时间：" + bigStockMoneyDate + params[0].name + "<br>" 
                    + "主力净流入: " + params[0].value + " 亿元<br>"
                    + "小单净流入: " + params[1].value + " 亿元<br>"
                    + "中单净流入: " + params[2].value + " 亿元<br>"
                    + "大单净流入: " + params[3].value + " 亿元<br>"
                    + "超大单净流入: " + params[4].value + " 亿元<br>"
                    ;
            }
        },
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: '5%',
                    top: '3%',
                    style: {
                        text: '单位: 亿元',
                        textAlign: 'left',
                        fill: '#333',
                        fontSize: 14
                    }
                }
            ]
        }
    };
    myChart.setOption(option);
}

// 展示南向资金图表
async function showNanXiang() {
    let result = ajaxGetNanBeiXiangMoney();
    let elementId = 'data-center-chart';
    let dataNanXiangMoney = [];
    let dataGangGuTongHu = [];
    let dataGangGuTongShen = [];
    let dataAxis = [];
    if (result.data == null || result.data.n2s == null) {
        return;
    }
    let oneHundredMillion = new BigDecimal("10000");
    let lastNanXiangMoney;
    let lastGangGuTongHu;
    let lastGangGuTongHuYuE;
    let lastGangGuTongShen;
    let lastGangGuTongShenYuE;
    for (var k = 0; k < result.data.n2s.length; k++) {
        let str = result.data.n2s[k];
        if(str.split(",")[1] == '-') {
            dataNanXiangMoney.push("");
            dataGangGuTongHu.push("");
            dataGangGuTongShen.push("");
            dataAxis.push(str.split(",")[0]);
        } else {
            let nanXiangMoney = new BigDecimal(str.split(",")[5] + "");
            nanXiangMoney = nanXiangMoney.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
            let gangGuTongHu = new BigDecimal(str.split(",")[1] + "");
            gangGuTongHu = gangGuTongHu.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP)
            let gangGuTongShen = new BigDecimal(str.split(",")[3] + "");
            gangGuTongShen = gangGuTongShen.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP)

            dataNanXiangMoney.push(parseFloat(nanXiangMoney + ""));
            dataGangGuTongHu.push(parseFloat(gangGuTongHu + ""));
            dataGangGuTongShen.push(parseFloat(gangGuTongShen + ""));
            dataAxis.push(str.split(",")[0]);
            lastNanXiangMoney = nanXiangMoney + "";
            lastGangGuTongHu = gangGuTongHu + "";
            lastGangGuTongShen = gangGuTongShen + "";
            let gangGuTongHuYuE = new BigDecimal(str.split(",")[2] + "");
            gangGuTongHuYuE = gangGuTongHuYuE.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
            lastGangGuTongHuYuE = gangGuTongHuYuE + "";
            let gangGuTongShenYuE = new BigDecimal(str.split(",")[4] + "");
            gangGuTongShenYuE = gangGuTongShenYuE.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
            lastGangGuTongShenYuE = gangGuTongShenYuE + "";
        }
    }
    let contentHtml = "港股通（沪） 当日净流入: <font color=" + (parseFloat(lastGangGuTongHu) >= 0 ? "red" : "green")+ ">" + lastGangGuTongHu + "</font> 亿元 余额: <font color=red>" + lastGangGuTongHuYuE + "</font> 亿元<br>";
    contentHtml += "港股通（深） 当日净流入: <font color=" + (parseFloat(lastGangGuTongShen) >= 0 ? "red" : "green")+ ">" + lastGangGuTongShen + "</font> 亿元 余额: <font color=red>" + lastGangGuTongShenYuE + "</font> 亿元<br>";
    contentHtml += "南向资金 当日净流入: <font color=" + (parseFloat(lastNanXiangMoney) >= 0 ? "red" : "green")+ ">" + lastNanXiangMoney + "</font> 亿元<br>";
    $("#data-center-content").html(contentHtml);
    if(dataNanXiangMoney.length == 0) {
        return;
    }
    if (dataNanXiangMoney.length < 241) {
        const diffLength = 241 - dataZhuLiJingLiuRu.length;
        const emptyData = Array(diffLength).fill(''); // 使用 null 填充空数据
        dataNanXiangMoney = dataNanXiangMoney.concat(emptyData);
        dataGangGuTongHu = dataGangGuTongHu.concat(emptyData);
        dataGangGuTongShen = dataGangGuTongShen.concat(emptyData);
        dataAxis = dataAxis.concat(emptyData);
    }
    s2nDate = result.data.s2nDate;
    n2sDate = result.data.n2sDate;
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    option = {
        title: {
            text: '南向资金', // 设置整个图表的标题
            left: 'center', // 标题水平居中
            top: 0 // 标题距离图表顶部的距离
        },
        legend: {
            data: ['南向资金', '港股通（沪）', '港股通（深）'],
            top: 30
        },
        // resize: true,
        lineStyle: {
            // color: color, // 设置线的颜色
            // 其他样式配置
            width: 1,
            opacity: 0.5
        },
        xAxis: {
            data: dataAxis,
            type: 'category',
            axisLabel: {
                interval: 29 // 调整刻度显示间隔
            },
            min: "09:30",
        },
        yAxis: {
            scale: true,
            type: 'value',
        },
        series: [
            {
                name: '南向资金',
                data: dataNanXiangMoney,
                type: 'line',
                smooth: true,
            },
            {
                name: '港股通（沪）',
                data: dataGangGuTongHu,
                type: 'line',
                smooth: true,
            },
            {
                name: '港股通（深）',
                data: dataGangGuTongShen,
                type: 'line',
                smooth: true,
            }
        ],
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
                return "时间: " + n2sDate + " " + params[0].name + "<br>" 
                    + "南向资金: " + params[0].value + " 亿元<br>"
                    + "港股通（沪）: " + params[1].value + " 亿元<br>"
                    + "港股通（深）: " + params[2].value + " 亿元<br>"
                    ;
            }
        },
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: '5%',
                    top: '5%',
                    style: {
                        text: '单位：亿元',
                        textAlign: 'left',
                        fill: '#333',
                        fontSize: 14
                    }
                }
            ]
        }
    };
    myChart.setOption(option);
}

// 展示北向资金图表
async function showBeiXiang() {
    let result = ajaxGetNanBeiXiangMoney();
    let elementId = 'data-center-chart';
    let dataBeiXiangMoney = [];
    let dataHuGuTong = [];
    let dataShenGuTong = [];
    let dataAxis = [];
    if (result.data == null || result.data.s2n == null) {
        return;
    }
    let oneHundredMillion = new BigDecimal("10000");
    let lastBeiXiangMoney;
    let lastHuGuTong;
    let lastHuGuTongYuE;
    let lastShenGuTong;
    let lastShenGuTongYuE;
    for (var k = 0; k < result.data.s2n.length; k++) {
        let str = result.data.s2n[k];
        if(str.split(",")[1] == '-') {
            dataBeiXiangMoney.push("");
            dataHuGuTong.push("");
            dataShenGuTong.push("");
            dataAxis.push(str.split(",")[0]);
        } else {
            let beiXiangMoney = new BigDecimal(str.split(",")[5] + "");
            beiXiangMoney = beiXiangMoney.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
            let huGuTong = new BigDecimal(str.split(",")[1] + "");
            huGuTong = huGuTong.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
            let shenGuTong = new BigDecimal(str.split(",")[3] + "");
            shenGuTong = shenGuTong.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);

            dataBeiXiangMoney.push(parseFloat(beiXiangMoney + ""));
            dataHuGuTong.push(parseFloat(huGuTong + ""));
            dataShenGuTong.push(parseFloat(shenGuTong + ""));
            dataAxis.push(str.split(",")[0]);

            lastBeiXiangMoney = beiXiangMoney + "";
            lastHuGuTong = huGuTong + "";
            lastShenGuTong = shenGuTong + "";
            let huGuTongYuE = new BigDecimal(str.split(",")[2] + "");
            huGuTongYuE = huGuTongYuE.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
            lastHuGuTongYuE = huGuTongYuE + "";
            let shenGuTongYuE = new BigDecimal(str.split(",")[4] + "");
            shenGuTongYuE = shenGuTongYuE.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
            lastShenGuTongYuE = shenGuTongYuE + "";
        }
    }
    let contentHtml = "沪股通 当日净流入: <font color=" + (parseFloat(lastHuGuTong) >= 0 ? "red" : "green")+ ">" + lastHuGuTong + "</font> 亿元 余额: <font color='red'>" + lastHuGuTongYuE + "</font> 亿元<br>";
    contentHtml += "深股通 当日净流入: <font color=" + (parseFloat(lastShenGuTong) >= 0 ? "red" : "green")+ ">" + lastShenGuTong + "</font> 亿元 余额: <font color='red'>" + lastShenGuTongYuE + "</font> 亿元<br>";
    contentHtml += "北向资金 当日净流入: <font color=" + (parseFloat(lastBeiXiangMoney) >= 0 ? "red" : "green")+ ">" + lastBeiXiangMoney + "</font> 亿元<br>";
    $("#data-center-content").html(contentHtml);
    if(dataBeiXiangMoney.length == 0) {
        return;
    }
    if (dataBeiXiangMoney.length < 241) {
        const diffLength = 241 - dataZhuLiJingLiuRu.length;
        const emptyData = Array(diffLength).fill(''); // 使用 null 填充空数据
        dataBeiXiangMoney = dataBeiXiangMoney.concat(emptyData);
        dataHuGuTong = dataHuGuTong.concat(emptyData);
        dataShenGuTong = dataShenGuTong.concat(emptyData);
        dataAxis = dataAxis.concat(emptyData);
    }
    s2nDate = result.data.s2nDate;
    n2sDate = result.data.n2sDate;
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    option = {
        title: {
            text: '北向资金', // 设置整个图表的标题
            left: 'center', // 标题水平居中
            top: 0 // 标题距离图表顶部的距离
        },
        legend: {
            data: ['北向资金', '沪股通', '深股通'],
            top: 30
        },
        // resize: true,
        lineStyle: {
            // color: color, // 设置线的颜色
            // 其他样式配置
            width: 1,
            opacity: 0.5
        },
        xAxis: {
            data: dataAxis,
            type: 'category',
            axisLabel: {
                interval: 29 // 调整刻度显示间隔
            },
            min: "09:30",
        },
        yAxis: {
            scale: true,
            type: 'value',
        },
        series: [
            {
                name: '北向资金',
                data: dataBeiXiangMoney,
                type: 'line',
                smooth: true,
            },
            {
                name: '沪股通',
                data: dataHuGuTong,
                type: 'line',
                smooth: true,
            },
            {
                name: '深股通',
                data: dataShenGuTong,
                type: 'line',
                smooth: true,
            }
        ],
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
                return "时间: " + s2nDate + " " + params[0].name + "<br>" 
                    + "北向资金: " + params[0].value + " 亿元<br>"
                    + "沪股通: " + params[1].value + " 亿元<br>"
                    + "深股通: " + params[2].value + " 亿元<br>"
                    ;
            }
        },
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: '5%',
                    top: '5%',
                    style: {
                        text: '单位：亿元',
                        textAlign: 'left',
                        fill: '#333',
                        fontSize: 14
                    }
                }
            ]
        }
    };
    myChart.setOption(option);
}

// 展示行业板块图表
async function showHangYeBanKuai() {
    let result = ajaxGetHangYeBanKuaiMoney();
    let elementId = 'data-center-chart';
    let data = [];
    let dataAxis = [];
    if (result.data == null || result.data.diff == null) {
        return;
    }
    let oneHundredMillion = new BigDecimal("100000000");
    for (var k = 0; k < result.data.diff.length; k++) {
        dataAxis.push(result.data.diff[k].f14);
        let moeny = new BigDecimal(result.data.diff[k].f62 + "");
        moeny = moeny.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
        data.push(moeny + "");
    }
    $("#data-center-content").html("");
    if(data.length == 0) {
        return;
    }
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    option = {
        grid: {
            left: '10%',   // 调整图表左边距离容器的距离
            right: '10%',  // 调整图表右边距离容器的距离
            bottom: '30%' // 调整图表底部距离容器的距离
        },
        title: {
            text: '行业板块', // 设置整个图表的标题
            left: 'center', // 标题水平居中
            top: 0 // 标题距离图表顶部的距离
        },
        xAxis: {
            data: dataAxis,
            type: 'category',
            axisLabel: {
                rotate: 0,  // 设置整体不旋转
                interval: 0, // 设置标签项全部显示
                formatter: function(value) {
                    // 使用 CSS 样式设置文字旋转
                    return '{a|' + value.split('').join('\n') + '}';
                },
                rich: {
                    a: {
                        lineHeight: 12,  // 行高
                        align: 'center', // 对齐方式
                        verticalAlign: 'middle', // 垂直对齐方式
                        padding: [0, 0, 10, 0], // 内边距
                        textBorderColor: 'transparent' // 文字描边颜色
                    }
                }
            }
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '行业板块',
                data: data,
                type: 'bar',
                itemStyle: {
                    color: function(params) {
                        // 根据数据的正负来设置颜色
                        return params.value >= 0 ? 'red' : 'green';
                    }
                }
            }
        ],
        tooltip: {
            trigger: 'axis',  // 触发类型，可以是 'item'（单项）或 'axis'（坐标轴）
            axisPointer: {     // 坐标轴指示器配置项
                type: 'shadow'  // 使用阴影表示坐标轴指示器
            },
            formatter: function(params) {
                // params 中包含了鼠标悬停位置的信息
                var dataIndex = params[0].dataIndex;  // 获取柱子的索引
                var value = params[0].data;           // 获取柱子的值
                return params[0].axisValue + '<br />'
                        + value + '亿元';
            }
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'  // 设置为 'none' 表示只控制 x 轴
                },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [
            {
                type: 'slider',  // 滑动条型选择框
                show: true,
                xAxisIndex: [0],  // 表示控制第一个 x 轴
                start: 0,
                end: 30
            },
            {
                type: 'inside',  // 内置型选择框
                xAxisIndex: [0],  // 表示控制第一个 x 轴
                start: 0,
                end: 30
            }
        ],
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: '5%',
                    top: '5%',
                    style: {
                        text: '单位：亿元',
                        textAlign: 'left',
                        fill: '#333',
                        fontSize: 14
                    }
                }
            ]
        }
    };
    myChart.setOption(option);
    // 监听 dataZoom 缩放事件
    myChart.on('dataZoom', function (params) {
        // 获取缩放程度和总数据量
        var zoomStart = params.start;
        var zoomEnd = params.end;
        var totalDataCount = myChart.getOption().xAxis[0].data.length;
        // 根据缩放程度和总数据量计算新的 interval
        var interval = calculateInterval(zoomStart, zoomEnd, totalDataCount);
        // 更新 x 轴标签的 interval
        myChart.setOption({
            xAxis: {
                axisLabel: {
                    interval: interval
                }
            }
        });
    });
}

// 根据缩放程度计算新的标签显示间隔
function calculateInterval(start, end, totalDataCount) {
    // 当数据量小于等于 30 时，全部显示
    if (totalDataCount <= 30) {
        return 0;
    }
    // 当数据量超过 30 个时，默认显示 30 个
    var defaultVisibleCount = 30;
    // 计算当前显示的数据量
    var visibleDataCount = totalDataCount * (end - start) / 100;
    // 当显示的数据量小于默认显示数量时，直接全部显示
    if (visibleDataCount <= defaultVisibleCount) {
        return 0;
    }
    // 计算新的 interval
    return Math.ceil(visibleDataCount / defaultVisibleCount);
}

// 获取换算汇率
async function getHuilv(type) {
    let huilv;
    var timeCached = await readCacheData(type + '_time_cached');
    var huilvCached = await readCacheData(type + '_huilv_cached');
    var nowTimestamp = Date.now();
    if (timeCached == null || (nowTimestamp - timeCached) >= Env.TIME_CACHED_ONE_HOUR) {
        console.log('汇率缓存超过1小时');
        huilvCached = null;
    }
    if (huilvCached != null) {
        huilv = huilvCached;
        console.log('从缓存取汇率');
    } else {
        console.log('从接口取汇率');
        var timestamp = Date.now();
        huilv = ajaxGetHuiLv(type).dangqianhuilv;
        // 减少所有基金的搜索频率，缓存数据
        saveCacheData(type + '_huilv_cached', huilv);
        saveCacheData(type + '_time_cached', timestamp);
    }
    return huilv;
}

// 点击汇率切换按钮
async function changeHuilvConvert(event) {
    let targetId = event.target.id;
    if (targetId == 'huilv-convert-change-button') {
        huilvConvert = true;
    } else {
        huilvConvert = false;
    }
    saveCacheData('huilvConvert', huilvConvert);
    $("#setting-modal").modal("hide");
    initData();
}

// 去东方财富看走势图
async function goToEastMoney() {
    let market;
    let url;
    if(timeImageCode.startsWith('sh') || timeImageCode.startsWith('SH')){
        market = "1";
        let code = timeImageCode.substring(2, timeImageCode.length);
        url = Env.GO_TO_EASTMONEY_1_URL + "?code=" + code + "&market=" + market;
    } else if(timeImageCode.startsWith('sz') || timeImageCode.startsWith('SZ')) {
        market = "0";
        let code = timeImageCode.substring(2, timeImageCode.length);
        url = Env.GO_TO_EASTMONEY_1_URL + "?code=" + code + "&market=" + market;
    } else if(timeImageCode.startsWith('hk') || timeImageCode.startsWith('HK')) {
        let code = timeImageCode.substring(2, timeImageCode.length);
        url = Env.GO_TO_EASTMONEY_2_URL + "/hk/" + code + ".html#fullScreenChart"; 
    } else if(timeImageCode.startsWith('us') || timeImageCode.startsWith('US')) {
        let code = timeImageCode.substring(2, timeImageCode.length);
        url = Env.GO_TO_EASTMONEY_2_URL + "/us/" + code + ".html#fullScreenChart"; 
    }
    chrome.tabs.create({ url: url });
}

// 重新加载页面
async function reloadDataAndHtml() {
    initHtml();
    initData();
}

// 获取市场id
function getSecid(code) {
    let secid;
    if(code.startsWith('sh') || code.startsWith('SH')){
        secid = '1';
    } else if(code.startsWith('sz') || code.startsWith('SZ')) {
        secid = '0';
    } else if(code.startsWith('hk') || code.startsWith('HK')) {
        secid = '116';
        if (code == 'hkHSI') {
            secid = '100';
        }
    } else if(code.startsWith('us') || code.startsWith('US')) {
        try {
            let stock;
            for (k in stockList) {
                if(code == stockList[k].code){
                    stock = stockList[k];
                    break;
                }
            }
            if (stock != null && stock != undefined) {
                let name = stock.name != null ? stock.name : stock.code;
            
                let result = ajaxGetStockCodeByNameFromGtimg(name);
                let sec = result.split("^")[0].split('~')[1];
                if(sec == undefined || sec == 'undefined'){
                    if (stock.code.endsWith('.oq') || stock.code.endsWith('.OQ')) {
                        secid = '105';
                    }else if (stock.code.endsWith('.ps') || stock.code.endsWith('.PS')) {
                        secid = '153';
                    } else {
                        secid = '106';
                    }
                } else {
                    if (sec.endsWith('.oq')) {
                        secid = '105';
                    }else if (sec.endsWith('.ps')) {
                        secid = '153';
                    } else {
                        secid = '106';
                    }
                }
            } else if(code == 'usNDX' || code == 'usDJIA' || code == 'usSPX') {
                secid = '100';
            }
        } catch (error) {
            console.warn(error);
            secid = '106';
        }
    } else if(code.startsWith('9')) {
        secid = '2';
    } else {
        secid = '0';
        if(code == 'N225' || code == 'KS11' || code =='FTSE' || code == 'GDAXI' || code =='FCHI' || code == 'SENSEX'){
            secid = '100';
        }
    }
    return secid;
}

// 切换新旧走势图
async function changeTimeImage(event) {
    let targetId = event.target.id;
    if (targetId == 'time-image-old-button') {
        timeImageNewOrOld = 'OLD';
    } else {
        timeImageNewOrOld = 'NEW';
    }
    saveCacheData('time-image-new-or-old', timeImageNewOrOld);
    showMinuteImage();
}

// 根据顺序拼接html信息
function getThColumnHtml(columnId, type) {
    // 这里可以根据需要定义每个列的显示名称
    var html;
    if (columnId == 'day-income-th' && dayIncomeDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'change-th' && changeDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'cost-price-th' && costPriceDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'turn-over-rate-th' && turnOverRateDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'bonds-th' && bondsDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'market-value-th' && marketValueDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'market-value-percent-th' && marketValuePercentDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'cost-price-value-th' && costPriceValueDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'income-percent-th' && incomePercentDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'income-th' && incomeDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'addtime-price-th' && addtimePriceDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'update-time-th' && updateTimeDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'mini-image-th') {
        html = "<th></th>";
    } else {
        html = type == 'STOCK' ? 
            " <th id=\"stock-" + columnId + "\" class=\"order\">" + stockColumnNames[columnId] || columnId + "</th> " :
            " <th id=\"fund-" + columnId + "\" class=\"order\">" + fundColumnNames[columnId] || columnId + "</th> ";
    }
    return html;
}
// 拼接拖拽可以修改列展示顺序的列表
function generateColumnList() {
    var columnList = document.getElementById('sortable-column-table');
    columnList.innerHTML = '';
    columnOrder.forEach(function (column) {
        var columnName = Object.keys(column)[0];
        var listItem = document.createElement('li');

        // Create checkbox
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = '';
        checkbox.id = columnName.replace('-th', '') + '-display-checkbox';
        if (columnName == 'name-th' || columnName == 'change-percent-th' || columnName == 'price-th' || columnName == 'mini-image-th') {
            checkbox.disabled = true;
        }
        // Create label for checkbox
        var label = document.createElement('label');
        label.htmlFor = columnName.replace('-th', '') + '-display-checkbox';
        label.textContent = stockColumnNames[columnName] == fundColumnNames[columnName] ? stockColumnNames[columnName] : stockColumnNames[columnName] + "/" + fundColumnNames[columnName];

        // Create outer div
        var outerDiv = document.createElement('div');
        outerDiv.className = 'input-group-prepend';

        // Create inner div for the input group text
        var innerDiv = document.createElement('div');
        innerDiv.className = 'input-group-text-new';

        // Append the label and checkbox to the inner div
        innerDiv.appendChild(checkbox);
        innerDiv.appendChild(label);


        // Append the inner div to the outer div
        outerDiv.appendChild(innerDiv);

        // Append the outer div to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(label);

        listItem.setAttribute('draggable', 'true');
        listItem.setAttribute('data-column', columnName);
        columnList.appendChild(listItem);
    });
    addDragAndDropListeners();
}
// 可以拖拽改列展示顺序的列表的事件监听
function addDragAndDropListeners() {
    var columnList = document.getElementById('sortable-column-table');
    if (!columnList.hasDragstartListener) {
        columnList.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('drage-column-order-start', e.target.dataset.column);
        });
        columnList.hasDragstartListener = true; // 标记为已添加
    }
    if (!columnList.hasDragoverListener) {
        columnList.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        columnList.hasDragoverListener = true; // 标记为已添加
    }
    if (!columnList.hasDropListener) {
        columnList.addEventListener('drop', function (e) {
            e.preventDefault();
            var draggedColumn = e.dataTransfer.getData('drage-column-order-start');
            var newIndex = Array.from(columnList.children).indexOf(e.target);
            if(newIndex == -1) newIndex = Array.from(columnList.children).indexOf(e.target.parentNode);
            columnOrderTemp = arrayMove(columnOrderTemp, columnOrderTemp.findIndex(col => col[draggedColumn] !== undefined), newIndex);
            generateColumnList();
        });
        columnList.hasDropListener = true; // 标记为已添加
    }
    if (allDisplay == null || allDisplay == 'DISPLAY') {
        allDisplay = 'DISPLAY';
        $("#all-display-checkbox").prop("checked", true);
    } else {
        allDisplay = 'HIDDEN';
        $("#all-display-checkbox").prop("checked", false);
    }
    if (marketValueDisplay == null || marketValueDisplay == 'DISPLAY') {
        marketValueDisplay = 'DISPLAY';
        $("#market-value-display-checkbox").prop("checked", true);
    } else {
        marketValueDisplay = 'HIDDEN';
        $("#market-value-display-checkbox").prop("checked", false);
    }
    if (marketValuePercentDisplay == null || marketValuePercentDisplay == 'DISPLAY') {
        marketValuePercentDisplay = 'DISPLAY';
        $("#market-value-percent-display-checkbox").prop("checked", true);
    } else {
        marketValuePercentDisplay = 'HIDDEN';
        $("#market-value-percent-display-checkbox").prop("checked", false);
    }
    if (costPriceValueDisplay == null || costPriceValueDisplay == 'DISPLAY') {
        costPriceValueDisplay = 'DISPLAY';
        $("#cost-price-value-display-checkbox").prop("checked", true);
    } else {
        costPriceValueDisplay = 'HIDDEN';
        $("#cost-price-value-display-checkbox").prop("checked", false);
    }
    if (incomePercentDisplay == null || incomePercentDisplay == 'DISPLAY') {
        incomePercentDisplay = 'DISPLAY';
        $("#income-percent-display-checkbox").prop("checked", true);
    } else {
        incomePercentDisplay = 'HIDDEN';
        $("#income-percent-display-checkbox").prop("checked", false);
    }
    if (addtimePriceDisplay == null || addtimePriceDisplay == 'DISPLAY') {
        addtimePriceDisplay = 'DISPLAY';
        $("#addtime-price-display-checkbox").prop("checked", true);
    } else {
        addtimePriceDisplay = 'HIDDEN';
        $("#addtime-price-display-checkbox").prop("checked", false);
    }
    if (dayIncomeDisplay == null || dayIncomeDisplay == 'DISPLAY') {
        dayIncomeDisplay = 'DISPLAY';
        $("#day-income-display-checkbox").prop("checked", true);
    } else {
        dayIncomeDisplay = 'HIDDEN';
        $("#day-income-display-checkbox").prop("checked", false);
    }
    if (costPriceDisplay == null || costPriceDisplay == 'DISPLAY') {
        costPriceDisplay = 'DISPLAY';
        $("#cost-price-display-checkbox").prop("checked", true);
    } else {
        costPriceDisplay = 'HIDDEN';
        $("#cost-price-display-checkbox").prop("checked", false);
    }
    if (bondsDisplay == null || bondsDisplay == 'DISPLAY') {
        bondsDisplay = 'DISPLAY';
        $("#bonds-display-checkbox").prop("checked", true);
    } else {
        bondsDisplay = 'HIDDEN';
        $("#bonds-display-checkbox").prop("checked", false);
    }
    if (incomeDisplay == null || incomeDisplay == 'DISPLAY') {
        incomeDisplay = 'DISPLAY';
        $("#income-display-checkbox").prop("checked", true);
    } else {
        incomeDisplay = 'HIDDEN';
        $("#income-display-checkbox").prop("checked", false);
    }
    if (allDisplay == null || allDisplay == 'DISPLAY') {
        allDisplay = 'DISPLAY';
        $("#all-display-checkbox").prop("checked", true);
    } else {
        allDisplay = 'HIDDEN';
        $("#all-display-checkbox").prop("checked", false);
    }
    if (codeDisplay == null || codeDisplay == 'HIDDEN') {
        codeDisplay = 'HIDDEN';
        $("#code-display-checkbox").prop("checked", false);
    } else {
        codeDisplay = 'DISPLAY';
        $("#code-display-checkbox").prop("checked", true);
    }
    if (changeDisplay == null || changeDisplay == 'HIDDEN') {
        changeDisplay = 'HIDDEN';
        $("#change-display-checkbox").prop("checked", false);
    } else {
        changeDisplay = 'DISPLAY';
        $("#change-display-checkbox").prop("checked", true);
    }
    if (updateTimeDisplay == null || updateTimeDisplay == 'HIDDEN') {
        updateTimeDisplay = 'HIDDEN';
        $("#update-time-display-checkbox").prop("checked", false);
    } else {
        updateTimeDisplay = 'DISPLAY';
        $("#update-time-display-checkbox").prop("checked", true);
    }
    if (turnOverRateDisplay == null || turnOverRateDisplay == 'HIDDEN') {
        turnOverRateDisplay = 'HIDDEN';
        $("#turn-over-rate-display-checkbox").prop("checked", false);
    } else {
        turnOverRateDisplay = 'DISPLAY';
        $("#turn-over-rate-display-checkbox").prop("checked", true);
    }
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
    // 设置页面，隐藏/展示页面展示项，涨跌
    document.getElementById("change-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，更新时间
    document.getElementById("update-time-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，换手率
    document.getElementById("turn-over-rate-display-checkbox").addEventListener('change', setDisplayTr);
}

// 拖拽完成后切换列表的顺序
function arrayMove(arr, oldIndex, newIndex) {
    var element = arr[oldIndex];
    arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, element);
    return arr;
}

// 恢复默认列顺序
function recoveryColumnOrder() {
    columnOrder = [
        {"name-th": 0},
        {"day-income-th": 0},
        {"change-percent-th": 0},
        {"change-th": 0},
        {"turn-over-rate-th": 0},
        {"price-th": 0},
        {"cost-price-th": 0},
        {"bonds-th": 0},
        {"market-value-th": 0},
        {"market-value-percent-th": 0},
        {"cost-price-value-th": 0},
        {"income-percent-th": 0},
        {"income-th": 0},
        {"addtime-price-th": 0},
    ];
    columnOrderTemp = columnOrder;
    saveCacheData('column-order', columnOrder);
    $("#setting-modal").modal("hide");
    reloadDataAndHtml();
}

// 保存页面展示项顺序
function saveColumnOrder() {
    columnOrder = columnOrderTemp;
    saveCacheData('column-order', columnOrder);
    $("#setting-modal").modal("hide");
    reloadDataAndHtml();
}

// 修改角标显示监控实时价格/涨跌幅
async function changeMonitorPriceOrPercent(event) {
    let targetId = event.target.id;
    if (targetId == 'monitor-price-change-button') {
        monitorPriceOrPercent = 'PRICE';
    } else if (targetId == 'monitor-percent-change-button') {
        monitorPriceOrPercent = 'PERCENT';
    } else {
        monitorPriceOrPercent = 'DAY_INCOME';
    }
    saveCacheData('monitor-price-or-percent', monitorPriceOrPercent);
    $("#setting-modal").modal("hide");
    reloadDataAndHtml();
}

// 修改鼠标悬停扩展程序图标，展示/不展示前5只股票
async function changemonitorTop20Stock(event) {
    let targetId = event.target.id;
    if (targetId == 'monitor-top-20-stock-change-button') {
        monitorTop20Stock = true;
    } else {
        monitorTop20Stock = false;
        setChromeTitle('股票基金神器');
    }
    saveCacheData('monitor-top-20-stock', monitorTop20Stock);
    $("#setting-modal").modal("hide");
    reloadDataAndHtml();
}

// 清理分时图timeout，不再刷新分时图
async function clearTimeImageTimeout() {
    if(timerId != undefined && timerId != '') {
        console.log("清理分时图timeId=", timerId);
        clearTimeout(timerId);
    }
}

// 切换隐蔽/默认图标
async function changeIcon(event) {
    let targetId = event.target.id;
    let iconPath = defaultIconPath;
    if (targetId == 'change-icon-default-button') {
        iconPath = defaultIconPath;
        defaultIcon = true;
    } else {
        iconPath = hiddenIconPath;
        defaultIcon = false;
    }
    chrome.action.setIcon({path: iconPath});
    saveCacheData('default-icon', defaultIcon);
}

// 获取基金/股票名称
function getFundOrStockNameByTimeImageCode(timeImageCode, timeImageType) {
    let name = '';
    if (timeImageType == "FUND") {
        for (var k in fundList) {
            if (fundList[k].fundCode == timeImageCode) {
                name = fundList[k].name;
                break;
            }
        }
    } else {
        for (var k in stockList) {
            if (stockList[k].code == timeImageCode) {
                name = stockList[k].name;
                break;
            }
        }
    }
    if (name == '') {
        switch(timeImageCode) {
            case 'sh000001':
                name = '上证指数'
                break;
            case 'sz399001':
                name = '深证成指'
                break;
            case 'sz399006':
                name = '创业板指'
                break;
            case 'hkHSI':
                name = '恒生指数'
                break;
            case 'usNDX':
                name = '纳斯达克'
                break;
            case 'usDJIA':
                name = '道琼斯';
                break;
            case 'usSPX':
                name = '标普500';
                break;
            case 'N225':
                name = '日经225';
                break;
            case 'KS11':
                name = '韩国KOSPI';
                break;
            case 'FTSE':
                name = '英国富时100';
                break;
            case 'KS11':
                name = '韩国KOSPI';
                break;
            case 'GDAXI':
                name = '德国DAX30';
                break;
            case 'FCHI':
                name = '法国CAC40';
                break;
            case 'SENSEX':
                name = '印度孟买SENSEX';
                break;
            case 'sh000300':
                name = '沪深300';
                break;
            case 'sz399905':
                name = '中证500';
                break;
            case 'sh000852':
                name = '中证1000';
                break;
            case '899050':
                name = '北证50';
                break;
            case 'sh000688':
                name = '科创50';
                break;
            case 'sh000928':
                name = '中证能源';
                break;
            case 'sz399997':
                name = '中证白酒';
                break;
            case 'sh000933':
                name = '中证医药';
                break;
            case '930641':
                name = '中证中药';
                break;
            case 'sh000926':
                name = '中证央企';
                break;
            case '930708':
                name = '中证有色';
                break;
            case 'sz399989':
                name = '中证医疗';
                break;
            case 'sz399986':
                name = '中证银行';
                break;
            case 'sh000941':
                name = '新能源';
                break;
            case '931071':
                name = '人工智能';
                break;
            case '931582':
                name = '数字经济';
                break;
            default:
                name = timeImageCode;
                break;
        }
    }
    return name;
}

async function selectLargeMarketCodeCheckbox() {
    // 遍历 checkboxGroupList 数组
    largeMarketCode.forEach(function(value) {
        // 使用属性选择器选择对应值的复选框，并将其设置为选中状态
        $('input#large-market-code-checkbox[value="' + value + '"]').prop('checked', true);
    });
}

// 展示反馈建议页面
function showAdvice() {
    $("#advice-content").val('');
    $("#advice-modal").modal();
    ajaxGetAdvice();
}

// 保存反馈建议
async function saveAdvice() {
    let adviceContent = $("#advice-content").val();
    let result = ajaxPostAdvice(adviceContent);
    $("#advice-modal").modal('hide');
    if (result == "00000000") {
        alertMessage('保存成功');
    } else {
        alertMessage('保存失败');
    }
}

// ajax获取反馈建议后，异步回调设置列表
function setAdviceUl(advices) {
    var columnList = document.getElementById('advice-list-ul');
    columnList.innerHTML = '';
    advices.forEach(function (advice) {
        var listItem = document.createElement('li');
        // Create label for checkbox
        var adviceDevelopVersion = advice.adviceDevelopVersion == null ? '' : ' 计划修改版本：' + advice.adviceDevelopVersion;
        var textContent = advice.adviceContent + '\n 提交时间：' + advice.date + adviceDevelopVersion;
        listItem.innerText = textContent;
        columnList.appendChild(listItem);
    });
}

// 展示分组页面
function showGroup() {
    updateGroupList();
    $("#group-modal").modal();
}

// 展示分组页面
function showAllGroup() {
    currentGroup = 'all-group';
    saveCacheData('current-group', currentGroup);
    changeGroup('all-group');
}

// 新增分组
async function addGroup() {
    const groupNameInput = document.getElementById('group-name');
    const groupName = groupNameInput.value.trim();
    if (groupName && !Object.values(groups).includes(groupName)) {
        const groupId = Date.now().toString();
        groups[groupId] = groupName; // 添加新分组
        updateGroupList(); // 更新分组列表
        groupNameInput.value = ''; // 清空输入框
        saveCacheData('groups', groups);
        initGroupButton();
    } else {
        alert('请输入有效的分组名');
    }
}

// 更新分组列表数据
function updateGroupList() {
    const groupList = document.getElementById('group-list');
    const groupTemplate = document.getElementById('group-template').innerHTML;
    groupList.innerHTML = ''; // 清空当前的分组列表
    Object.keys(groups).forEach(id => {
        const groupName = groups[id];
        const groupHtml = groupTemplate.replace(/{id}/g, id).replace(/{name}/g, groupName);
        groupList.innerHTML += groupHtml;
    });
    document.querySelectorAll('.delete-group').forEach(button => {
        button.addEventListener('click', function(event) {
            const groupId = this.getAttribute('data-id');
            if (groupId !== 'default-group') { // 防止删除默认分组
                delete groups[groupId];
                saveCacheData('groups', groups);
                updateGroupList(); // 更新分组列表
                initGroupButton();
            }
            event.stopPropagation(); // 阻止冒泡，避免触发分组切换逻辑
        });
    });
    document.querySelectorAll('.group-button').forEach(button => {
        button.addEventListener('click', async function(){
            let groupId = this.getAttribute('data-id');
            changeGroup(groupId);
        });
    });
}

async function showDayIncomeHistory() {
    $("#day-income-history-modal").modal();
    $("#data-center-modal").modal('hide');
    // $("#data-center-modal").modal();
    let dayIncomeHistory = await readCacheData('DAY_INCOME_HISTORY');
    // dayIncomeHistory数组倒序排列
    dayIncomeHistory = dayIncomeHistory.reverse();
    // 每日盈利标题
    var dayIncomeHistoryHead = " <tr >" +
        " <th >日期</th>" +
        " <th >基金盈利</th>" +
        " <th >股票盈利</th>" +
        " <th >当日总盈利</th>" +
        " </tr>";
    $("#day-income-history-head").html(dayIncomeHistoryHead);
    let str = "";
    // 遍历 dayIncomeHistory 数组
    if (dayIncomeHistory != null && dayIncomeHistory != '' && dayIncomeHistory != undefined)
    dayIncomeHistory.forEach((item, index) => {
        let dayIncome = parseFloat(item.fundDayIncome) + parseFloat(item.stockDayIncome);
        // 对于数组中的每个项目，拼接一个表格行
        str += "<tr id='day-income-history-tr-" + index + "'>"
            + "<td>" + item.date + "</td>"
            + "<td>" + item.fundDayIncome + "</td>"
            + "<td>" + item.stockDayIncome + "</td>"
            + "<td>" + dayIncome.toFixed(2) + "</td>"
            + "</tr>";
    });
    $("#day-income-history-nr").html(str);
    let dataStockStr = [];
    let dataFundStr = [];
    let dataAxis = [];
    dayIncomeHistory.forEach((item, index) => {
        dataStockStr.push(parseFloat(item.stockDayIncome));
        dataFundStr.push(parseFloat(item.fundDayIncome));
        dataAxis.push(item.date);
        let dayIncomeHistoryTr = document.getElementById('day-income-history-tr-' + index);
        dayIncomeHistoryTr.addEventListener('click', async function () {
            var result = confirm('是否删除了日期：' + item.date);
            if (result) {
                console.log('您删除了第' + (index + 1) + '行，日期：' + item.date);
                let dayIncomeHistory = await readCacheData('DAY_INCOME_HISTORY');
                for (var k in dayIncomeHistory) {
                    if (dayIncomeHistory[k].date == item.date) {
                        // delete funds[k];
                        dayIncomeHistory.splice(k, 1)
                        break;
                    }
                }
                saveCacheData('DAY_INCOME_HISTORY', dayIncomeHistory);
                showDayIncomeHistory();
            }
        });
    });
    let elementId = 'day-income-image';
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    var series = [
        {
            data: dataStockStr,
            type: 'bar',
            stack: 'a',
            name: '股票盈利',
            // itemStyle: {
            //     color: '#17a2b8'
            // },
        },
        {
            data: dataFundStr,
            type: 'bar',
            stack: 'a',
            name: '基金盈利',
            // itemStyle: {
            //     color: '#007bff'
            // },
        }
    ];
    const stackInfo = {};
    for (let i = 0; i < series[0].data.length; ++i) {
        for (let j = 0; j < series.length; ++j) {
          const stackName = series[j].stack;
          if (!stackName) {
            continue;
          }
          if (!stackInfo[stackName]) {
            stackInfo[stackName] = {
              stackStart: [],
              stackEnd: []
            };
          }
          const info = stackInfo[stackName];
          const data = series[j].data[i];
          if (data && data !== '-') {
            if (info.stackStart[i] == null) {
              info.stackStart[i] = j;
            }
            info.stackEnd[i] = j;
          }
        }
    }
    // 数据量小于等于 20 条时，不启用 dataZoom，数据量大于 20 条时，启用 dataZoom，并计算end
    if (series[0].data.length <= 20) { 
        dataZoomOption = [];
    } else {
        let endPercent = (20 / series[0].data.length) * 100;
        dataZoomOption = [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: endPercent
            }
        ];
    }
    option = {
        xAxis: {
            type: 'category',
            data: dataAxis,
            axisLabel: {
                interval: 0,
                rotate: 45, // 旋转角度
            },
        },
        yAxis: {
            type: 'value'
        },
        series: series,
        tooltip: {
            formatter: function(params) {
                let dataIndex = params.dataIndex;  // 获取柱子的索引
                let stockIncome = parseFloat(series[0].data[dataIndex]);
                let fundIncome = parseFloat(series[1].data[dataIndex]);
                let totalIncome = parseFloat(stockIncome) + parseFloat(fundIncome);
                return "<br>日期：" + params.name + "<br>股票盈利：" + stockIncome.toFixed(2)
                    + "<br>基金盈利：" + fundIncome.toFixed(2) + "<br>合计：" + totalIncome.toFixed(2);
            }
        },
        dataZoom: dataZoomOption,
    };
    myChart.setOption(option);
}

// 切换/隐藏持仓盈亏
async function changeLargeMarketTotalDisplay(event) {
    let targetId = event.target.id;
    if (targetId == 'larget-market-total-display-change-button') {
        largetMarketTotalDisplay = true;
    } else {
        largetMarketTotalDisplay = false;
    }
    saveCacheData('larget-market-total-display', largetMarketTotalDisplay);
    $("#setting-modal").modal('hide');
    reloadDataAndHtml();
    initLargeMarketData();
}

// 滚动到指定行
function scrollToTableRow(rowIndex, type) {
    // 获取表格元素
    var table = document.getElementById("sortable-table");
    // 获取表格所有行
    var rows = table.getElementsByTagName("tr");
    if (type == 'FUND' && showStockOrFundOrAll == 'all') {
        rowIndex = parseInt(rowIndex) + stockList.length + 2;
    }
    // 滚动到指定行
    rows[rowIndex].scrollIntoView();
}

// 格式化日期
function changeTimeFormate(dateTime) {
    if (dateTime == null || dateTime == '' || dateTime == undefined || dateTime.length < 8) {
        return '--';
    // dateTime格式为2024-05-08 10:05:25，不需要格式化
    } else if(dateTime.indexOf('-') >= 0 && dateTime.indexOf(':') >= 0) {
        return dateTime;
    // dateTime格式为2024/05/08 10:05:25，替换/为-
    } else if(dateTime.indexOf('/') >= 0 && dateTime.indexOf(':') >= 0) {
        return dateTime.replaceAll('/', '-');
    // dateTime格式为20240508100525，格式化为2024-05-08 10:05:25
    } else if(dateTime.length > 8) {
        return dateTime.substring(0,4) + "-" + dateTime.substring(4,6) 
            + "-" + dateTime.substring(6,8) + " " + dateTime.substring(8,10) 
            + ":" + dateTime.substring(10,12) + ":" + dateTime.substring(12,14);
    // dateTime格式为20240508，格式化为2024-05-08
    } else {
        return dateTime.substring(0,4) + "-" + dateTime.substring(4,6) 
            + "-" + dateTime.substring(6,8);
    }
}

// 初始化首页分组按钮一键切换
function initGroupButton() {
    // 清空下拉菜单，以防重复添加
    $("#group-menu").empty();
    var option = $("<a class='dropdown-item'></a>").attr("id", "show-all-group-button").text("全部分组");
    $("#group-menu").append(option);
    // 遍历 groups 对象，为每个组名创建一个下拉菜单选项
    Object.keys(groups).forEach(id => {
        const groupName = groups[id];
        var option = $("<a class='dropdown-item'></a>").attr("id", "group-" + id).text(groupName);
        $("#group-menu").append(option);
    });
    option = $("<a class='dropdown-item'></a>").attr("id", "show-group-button").text("编辑分组");
    $("#group-menu").append(option);
    document.getElementById('show-group-button').addEventListener('click', showGroup);
    document.getElementById('show-all-group-button').addEventListener('click', showAllGroup);
    Object.keys(groups).forEach(id => {
        document.getElementById("group-" + id).addEventListener('click', async function(){
            changeGroup(id);
        });
    });
}

async function changeGroup(groupId) {
    // 这里可以添加切换分组的逻辑
    if (groupId == 'default-group' && currentGroup == 'default-group') {
        console.log('未切换分组'); // 这里可以添加切换分组的逻辑
        return;
    }
    currentGroup = groupId;
    saveCacheData('current-group', currentGroup);
    // 切换回默认分组
    if (currentGroup == 'default-group') {
        var funds = await readCacheData('funds');
        if (funds == null || funds == 'null') {
            fundList = [];
        } else {
            fundList = jQuery.parseJSON(funds);
        }
        var stocks = await readCacheData('stocks');
        if (stocks == null || stocks == 'null') {
            stockList = [];
        } else {
            stockList = jQuery.parseJSON(stocks);
        }
    }
    if (currentGroup != 'default-group') {
        // 切换到全部分组，展示全部分组数据
        if (currentGroup == 'all-group') {
           await changeAllGroup();
        } else {
            var funds = await readCacheData(currentGroup + '_funds');
            if (funds == null || funds == 'null') {
                fundList = [];
            } else {
                fundList = jQuery.parseJSON(funds);
            }
            var stocks = await readCacheData(currentGroup + '_stocks');
            if (stocks == null || stocks == 'null') {
                stockList = [];
            } else {
                stockList = jQuery.parseJSON(stocks);
            }
        }
    }
    $("#group-modal").modal('hide');
    reloadDataAndHtml();
}

async function changeAllGroup() {
    fundList = [];
    stockList = [];
    // 遍历所有group
    for (const id of Object.keys(groups)) {
        if (id == 'default-group') {
            var funds = await readCacheData('funds');
            if (funds == null || funds == 'null') {
                
            } else {
                jQuery.parseJSON(funds).forEach(item => {
                    item.belongGroup = 'default-group';
                    fundList.push(item);
                })
            }
            var stocks = await readCacheData('stocks');
            if (stocks == null || stocks == 'null') {
                
            } else {
                jQuery.parseJSON(stocks).forEach(item => {
                    item.belongGroup = 'default-group';
                    stockList.push(item);
                })
            }
        } else {
            var funds = await readCacheData(id + '_funds');
            if (funds == null || funds == 'null') {
                
            } else {
                jQuery.parseJSON(funds).forEach(item => {
                    item.belongGroup = id;
                    fundList.push(item);
                })
            }
            var stocks = await readCacheData(id + '_stocks');
            if (stocks == null || stocks == 'null') {
                
            } else {
                jQuery.parseJSON(stocks).forEach(item => {
                    item.belongGroup = id;
                    stockList.push(item);
                })
            }
        }
    };
}
// 展示涨跌分布图表
async function showUpDownCounts() {
    let result = ajaxGetUpDownCounts();
    let upDownCountsDate = changeTimeFormate(result.data.qdate + "");
    var fenbuValues = [];
    // 将对象转换为数组并排序
    var sortedFenbu = result.data.fenbu.map(obj => {
        var key = Object.keys(obj)[0]; // 获取对象的键
        var value = obj[key]; // 获取对象的值
        return { key: parseInt(key), value: value }; // 返回包含键值对的新对象
    }).sort((a, b) => {
        return a.key - b.key; // 按键值排序
    });
    sortedFenbu.forEach(item => {
        fenbuValues.push(item.value);
    });
    let elementId = 'data-center-chart';
    $("#data-center-content").html("");
    if(fenbuValues.length == 0) {
        return;
    }
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    option = {
        title: {
            text: upDownCountsDate + ' 涨跌分布', // 设置整个图表的标题
            left: 'center', // 标题水平居中
            top: 0 // 标题距离图表顶部的距离
        },
        xAxis: {
            type: 'category',
            data: ['跌停', '-10%', '-9%', '-8%', '-7%', '-6%', '-5%', '-4%', '-3%', '-2%', '-1%', '0%', '1%', '2%', '3%', '4%', '5%', '6%', '7%', '8%', '9%', '10%', '涨停'],
            axisLabel: {
                interval: 0,
                rotate: 45, // 旋转角度
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: fenbuValues,
                type: 'bar',
                label: {
                    show: true, // 显示标签
                    position: 'top' // 标签位置，可根据需要调整
                },
                itemStyle: {
                    color: function(params) {
                        // 判断条件：前 10 个绿色，后 10 个微红色
                        if (params.dataIndex < 11) {
                            return blueColor; // 绿色
                        } else if(params.dataIndex == 11) {
                            return "#545454"; // 灰色
                        } else {
                            return redColor; // 红色
                        }
                    }
                },
            }
        ],
        tooltip: {
            trigger: 'axis',  // 触发类型，可以是 'item'（单项）或 'axis'（坐标轴）
            axisPointer: {     // 坐标轴指示器配置项
                type: 'shadow'  // 使用阴影表示坐标轴指示器
            },
            formatter: function(params) {
                let desc = "";
                if (params[0].axisValue == "跌停") {
                    desc = "跌停 ";
                } else if (params[0].axisValue == "涨停") {
                    desc = "涨停 ";
                } else if (params[0].axisValue.startsWith("-")) {
                    desc = "下跌 " + params[0].axisValue;
                } else if(params[0].axisValue == "0%") {
                    desc = "平盘 ";
                } else {
                    desc = "上涨 " + params[0].axisValue;
                }
                return desc + "<br> 共有："  + params[0].data+ '家';
            }
        },
    };
    myChart.setOption(option);
    let contentHtml = "上涨: <font color=red>" + fenbuValues.slice(12, 22).reduce((a, b) => a + b, 0)+ "</font>";
    contentHtml += "  下跌: <font color=green>" + fenbuValues.slice(1, 11).reduce((a, b) => a + b, 0) + "</font>";
    contentHtml += "  平盘:" + fenbuValues[11] + "</font><br>";
    contentHtml += "涨停: <font color=red>" + fenbuValues[fenbuValues.length - 1] + "</font>";
    contentHtml += "  跌停: <font color=green>" + fenbuValues[0] + "</font>";
    $("#data-center-content").html(contentHtml);
}

// 持仓明细弹出的分时图添加股票
async function addStock() {
    var result = confirm("是否添加" + timeImageName + "?");
    if (result) {
        $("#stock-code").val(timeImageCode);
        $("#stock-costPrise").val('');
        $("#stock-bonds").val('');
        $("#stock-monitor-high-price").val('');
        $("#stock-monitor-low-price").val('');
        $("#new-buy-checkbox").prop("checked", false);
        await saveStock();
        $("#stock-code").val('');
        $("#time-image-modal").modal("hide");
    }
}

// 修改首页自动刷新时间
async function changeMainPageRefreshTime(event) {
    let targetId = event.target.id;
    if (targetId == 'main-page-refresh-time-20s-button') {
        mainPageRefreshTime = 20000;
    } else if (targetId == 'main-page-refresh-time-10s-button') {
        mainPageRefreshTime = 10000;
    } else if (targetId == 'main-page-refresh-time-5s-button') {
        mainPageRefreshTime = 5000;
    } else if (targetId == 'main-page-refresh-time-3s-button') {
        mainPageRefreshTime = 3000;
    }
    $("#setting-modal").modal("hide");
    saveCacheData('main-page-refresh-time', mainPageRefreshTime);
    location.reload();
}

// 点击切换新旧获取股票信息接口
async function changeStockApi(event) {
    let targetId = event.target.id;
    if (targetId == 'stock-api-gtimg-button') {
        stockApi = 'GTIMG';
    } else {
        stockApi = 'EASTMONEY';
    }
    $("#setting-modal").modal("hide");
    saveCacheData('stock-api', stockApi);
    location.reload();
}