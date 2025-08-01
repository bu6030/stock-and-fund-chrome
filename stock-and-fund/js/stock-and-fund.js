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
var quantityRelativeRatioDisplay = 'DISPLAY';
var priceDisplay = 'DISPLAY';
var belongGroupDisplay = 'DISPLAY';
var amplitudeDisplay = 'DISPLAY';
var upSpeedDisplay = 'DISPLAY';
var maxDisplay = 'DISPLAY';
var minDisplay = 'DISPLAY';
var starDisplay = 'HIDDEN';
var starDescDisplay = 'HIDDEN';
var zjlDisplay = 'HIDDEN';
var mainDeleteButtonDisplay;
var largetMarketTotalDisplay;
var largetMarketCountDisplay;
var banKuaiDisplay;
var klineMA5Display;
var klineMA10Display;
var klineMA20Display;
var klineMA30Display;
var klineMA50Display;
var klineMA250Display;
var klineMAList;
let klineMAListDisplay = [];
var monitorPriceOrPercent = 'PRICE';
var monitorTop20Stock = false;
var monitorShowMore = true;
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
var trendImageType;
var stockColumnNames = {
    "name-th": "股票(含ETF)名称",
    "mini-image-th": "迷你分时图",
    "belong-group-th": "所属分组",
    "day-income-th": "当日盈利",
    "change-percent-th": "涨跌幅",
    "turn-over-rate-th": "换手率",
    "quantity-relative-ratio-th": "量比",
    "change-th": "涨跌",
    "amplitude-th": "振幅",
    "price-th": "当前价",
    "zjl-th": "折价率",
    "cost-price-th": "成本价",
    "up-speed-th": "涨速",
    "max-th":"最高价",
    "min-th":"最低价",
    "bonds-th": "持仓",
    "market-value-th": "市值/金额",
    "market-value-percent-th": "持仓占比",
    "cost-price-value-th": "成本",
    "income-percent-th": "收益率",
    "income-th": "收益",
    "update-time-th": "更新时间",
    "addtime-price-th": "自选价格",
    "star-th": "星级",
    "star-desc-th": "备注"
};
var fundColumnNames = {
    "name-th": "场外基金名称",
    "mini-image-th": "迷你分时图",
    "belong-group-th": "所属分组",
    "day-income-th": "当日盈利",
    "change-percent-th": "涨跌幅",
    "turn-over-rate-th": "换手率",
    "quantity-relative-ratio-th": "量比",
    "change-th": "涨跌",
    "amplitude-th": "振幅",
    "price-th": "估算净值",
    "zjl-th": "折价率",
    "cost-price-th": "持仓成本单价",
    "up-speed-th": "涨速",
    "max-th":"最高价",
    "min-th":"最低价",
    "bonds-th": "持有份额",
    "market-value-th": "市值/金额",
    "market-value-percent-th": "持仓占比",
    "cost-price-value-th": "成本",
    "income-percent-th": "收益率",
    "income-th": "收益",
    "update-time-th": "更新时间",
    "addtime-price-th": "自选价格",
    "star-th": "星级",
    "star-desc-th": "备注"
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
let hangYeOrGaiNian;
var allTotalIncome = '--';
var allTotalIncomePercent = '--';
var allTotalIncomePercentStyle = '';
var autoSync = false;
var syncDataCloudUuid = '';
var opacityPercent;
var showHelpButton = true;
var showBatchDeleteButton = true;
var kLineNumbers = 0;
var addtimePriceNewline = false;
var riseFallSort = 0;

// 整个程序的初始化
window.addEventListener("load", async (event) => {
    //启动时发送消息
    chrome.runtime.sendMessage({ 'message' : 'scheduleTask' });
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
    belongGroupDisplay = await readCacheData('belong-group-display');
    if (belongGroupDisplay == null || belongGroupDisplay == 'DISPLAY') {
        belongGroupDisplay = 'DISPLAY';
    } else {
        belongGroupDisplay = 'HIDDEN';
    }
    upSpeedDisplay = await readCacheData('up-speed-display');
    if (upSpeedDisplay == null || upSpeedDisplay == 'DISPLAY') {
        upSpeedDisplay = 'DISPLAY';
    } else {
        upSpeedDisplay = 'HIDDEN';
    }
    maxDisplay = await readCacheData('max-display');
    if (maxDisplay == null || maxDisplay == 'DISPLAY') {
        maxDisplay = 'DISPLAY';
    } else {
        maxDisplay = 'HIDDEN';
    }
    minDisplay = await readCacheData('min-display');
    if (minDisplay == null || minDisplay == 'DISPLAY') {
        minDisplay = 'DISPLAY';
    } else {
        minDisplay = 'HIDDEN';
    }
    starDescDisplay = await readCacheData('star-desc-display');
    if (starDescDisplay == null || starDescDisplay == 'HIDDEN') {
        starDescDisplay = 'HIDDEN';
    } else {
        starDescDisplay = 'DISPLAY';
    }
    starDisplay = await readCacheData('star-display');
    if (starDisplay == null || starDisplay == 'HIDDEN') {
        starDisplay = 'HIDDEN';
    } else {
        starDisplay = 'DISPLAY';
    }
    zjlDisplay = await readCacheData('zjl-display');
    if (zjlDisplay == null || zjlDisplay == 'HIDDEN') {
        zjlDisplay = 'HIDDEN';
    } else {
        zjlDisplay = 'DISPLAY';
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
    amplitudeDisplay = await readCacheData('amplitude-display');
    if (amplitudeDisplay == null || amplitudeDisplay == 'DISPLAY') {
        amplitudeDisplay = 'DISPLAY';
    } else {
        amplitudeDisplay = 'HIDDEN';
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
    quantityRelativeRatioDisplay = await readCacheData('quantity-relative-ratio-display');
    if (quantityRelativeRatioDisplay == null || quantityRelativeRatioDisplay == 'DISPLAY') {
        quantityRelativeRatioDisplay = 'DISPLAY';
    } else {
        quantityRelativeRatioDisplay = 'HIDDEN';
    }
    priceDisplay = await readCacheData('price-display');
    if (priceDisplay == null || priceDisplay == 'DISPLAY') {
        priceDisplay = 'DISPLAY';
    } else {
        priceDisplay = 'HIDDEN';
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
    monitorShowMore  = await readCacheData('monitor-show-more');
    if (monitorShowMore == null) {
        monitorShowMore = true;
    } else if(monitorShowMore == "true") {
        monitorShowMore = true;
    } else if(monitorShowMore == "false") {
        monitorShowMore = false;
    }
    timeImageNewOrOld = await readCacheData('time-image-new-or-old');
    if (timeImageNewOrOld == null) {
        timeImageNewOrOld = 'NEW';
    }
    defaultIcon = await readCacheData('default-icon');
    if (defaultIcon == null || defaultIcon == "true") {
        defaultIcon = true;
    } else if(defaultIcon == "false") {
        defaultIcon = false;
    }
    stockApi = await readCacheData('stock-api');
    if (stockApi == null || stockApi == '') {
        stockApi = 'EASTMONEY';
    }
    trendImageType = await readCacheData('trend-image-type');
    if (trendImageType == null || trendImageType == '') {
        trendImageType = 'MINUTE';
    }
    autoSync = await readCacheData('auto-sync');
    if (autoSync == null || autoSync == '' || autoSync == "false") {
        autoSync = false;
    } else if(autoSync == "true") {
        autoSync = true;
    }
    showBatchDeleteButton = await readCacheData('show-batch-delete-button');
    if (showBatchDeleteButton == null || showBatchDeleteButton == "false") {
        showBatchDeleteButton = false;
    } else if(showBatchDeleteButton == "true") {
        showBatchDeleteButton = true;
    }
    addtimePriceNewline = await readCacheData('addtime-price-newline');
    if (addtimePriceNewline == null || addtimePriceNewline == "false") {
        addtimePriceNewline = false;
    } else if(addtimePriceNewline == "true") {
        addtimePriceNewline = true;
    }
    largetMarketTotalDisplay = await readCacheData('larget-market-total-display');
    if (largetMarketTotalDisplay == null || largetMarketTotalDisplay == "false") {
        largetMarketTotalDisplay = false;
    } else if(largetMarketTotalDisplay == "true") {
        largetMarketTotalDisplay = true;
    }
    banKuaiDisplay = await readCacheData('bankuai-display');
    if (banKuaiDisplay == null || banKuaiDisplay == "false") {
        banKuaiDisplay = false;
    } else if(banKuaiDisplay == "true") {
        banKuaiDisplay = true;
    }
    largetMarketCountDisplay = await readCacheData('larget-market-count-display');
    if (largetMarketCountDisplay == null || largetMarketCountDisplay == "true") {
        largetMarketCountDisplay = true;
    } else if(largetMarketCountDisplay == "false") {
        largetMarketCountDisplay = false;
    }
    klineMAList = await readCacheData('kline-ma-list');
    if (klineMAList == null || klineMAList == '' || klineMAList == undefined || klineMAList == 'undefined') {
        klineMAList = [];
    }
    for (const ma of klineMAList) {
        let klineMADisplay = await readCacheData('kline-' + ma.toLowerCase() + '-display');
        if (klineMADisplay == null || klineMADisplay == false || klineMADisplay == "false") {
            klineMADisplay = false;
        } else {
            klineMADisplay = true;
        }
        klineMAListDisplay.push({
            ma: ma,
            display: klineMADisplay
        });
    }
    klineMA5Display = await readCacheData('kline-ma5-display');
    if (klineMA5Display == null || klineMA5Display == "true") {
        klineMA5Display = true;
        $("#kline-ma5-display-checkbox").prop("checked", true);
    } else if(klineMA5Display == "false") {
        klineMA5Display = false;
        $("#kline-ma5-display-checkbox").prop("checked", false);
    }
    klineMA10Display = await readCacheData('kline-ma10-display');
    if (klineMA10Display == null || klineMA10Display == "true") {
        klineMA10Display = true;
        $("#kline-ma10-display-checkbox").prop("checked", true);
    } else if(klineMA10Display == "false") {
        klineMA10Display = false;
        $("#kline-ma10-display-checkbox").prop("checked", false);
    }
    klineMA20Display = await readCacheData('kline-ma20-display');
    if (klineMA20Display == null || klineMA20Display == "true") {
        klineMA20Display = true;
        $("#kline-ma20-display-checkbox").prop("checked", true);
    } else if(klineMA20Display == "false") {
        klineMA20Display = false;
        $("#kline-ma20-display-checkbox").prop("checked", false);
    }
    klineMA30Display = await readCacheData('kline-ma30-display');
    if (klineMA30Display == null || klineMA30Display == "true") {
        klineMA30Display = true;
        $("#kline-ma30-display-checkbox").prop("checked", true);
    } else if(klineMA30Display == "false") {
        klineMA30Display = false;
        $("#kline-ma30-display-checkbox").prop("checked", false);
    }
    klineMA50Display = await readCacheData('kline-ma50-display');
    if (klineMA50Display == null || klineMA50Display == "true") {
        klineMA50Display = true;
        $("#kline-ma50-display-checkbox").prop("checked", true);
    } else if(klineMA50Display == "false") {
        klineMA50Display = false;
        $("#kline-ma50-display-checkbox").prop("checked", false);
    }
    klineMA250Display = await readCacheData('kline-ma250-display');
    if (klineMA250Display == null || klineMA250Display == "true") {
        klineMA250Display = true;
        $("#kline-ma250-display-checkbox").prop("checked", true);
    } else if(klineMA250Display == "false") {
        klineMA250Display = false;
        $("#kline-ma250-display-checkbox").prop("checked", false);
    }
    mainDeleteButtonDisplay = await readCacheData('main-delete-button-display');
    if (mainDeleteButtonDisplay == null || mainDeleteButtonDisplay == "false") {
        mainDeleteButtonDisplay = false;
    } else if(mainDeleteButtonDisplay == "true") {
        mainDeleteButtonDisplay = true;
    }
    showHelpButton = await readCacheData('show-help-button');
    if (showHelpButton == null || showHelpButton == "true") {
        showHelpButton = true;
    } else if(showHelpButton == "false") {
        showHelpButton = false;
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
            {"belong-group-th": 0},
            {"day-income-th": 0},
            {"change-percent-th": 0},
            {"amplitude-th": 0},
            {"turn-over-rate-th": 0},
            {"quantity-relative-ratio-th": 0},
            {"change-th": 0},
            {"price-th": 0},
            {"zjl-th": 0},
            {"cost-price-th": 0},
            {"up-speed-th": 0},
            {"max-th": 0},
            {"min-th": 0},
            {"bonds-th": 0},
            {"market-value-th": 0},
            {"market-value-percent-th": 0},
            {"cost-price-value-th": 0},
            {"income-percent-th": 0},
            {"income-th": 0},
            {"update-time-th": 0},
            {"addtime-price-th": 0},
            {"star-desc-th": 0},
            {"star-th": 0},
        ];
    } else {
        try {
            // 遍历stockColumnNames中的所有键，检查是否存在于columnOrder中，如果不存在则添加
            for (let key in stockColumnNames) {
                const exists = columnOrder.some(column => column.hasOwnProperty(key));
                if (!exists) {
                    const newColumn = {};
                    newColumn[key] = 0;
                    columnOrder.push(newColumn);
                }
            }
        } catch (e) {
            console.warn('处理columnOrder异常：', e);
        }
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
    await initStockAndFundFromCache();
    kLineNumbers = await readCacheData('k-line-numbers');
    if (kLineNumbers == null || kLineNumbers == '' || kLineNumbers == undefined) {
        kLineNumbers = 0;
    }
    syncDataCloudUuid = await readCacheData('sync-data-cloud-uuid');
    if (syncDataCloudUuid == null || syncDataCloudUuid == '') {
        syncDataCloudUuid = generateRandomUUID();
        $("#sync-data-cloud-uuid").val(syncDataCloudUuid);
        saveCacheData('sync-data-cloud-uuid', syncDataCloudUuid);
    } else {
        $("#sync-data-cloud-uuid").val(syncDataCloudUuid);
    }
    mainPageRefreshTime = await readCacheData('main-page-refresh-time');
    if (mainPageRefreshTime == null || mainPageRefreshTime == '' || mainPageRefreshTime == undefined
        || mainPageRefreshTime == 'undefined') {
        mainPageRefreshTime = 20000;
    }
    opacityPercent = await readCacheData('opacity-percent');
    if (opacityPercent == null || opacityPercent == '' || opacityPercent == undefined
        || opacityPercent == 'undefined') {
            opacityPercent = "1";
    }
    initOpacity();
    // 展示密码保护按钮
    $("#show-password-protect-button")[0].style.display = 'inline';
    $("#data-export-button")[0].style.display = 'inline';
    initWindowsSize();
    initHtml();
    initData();
    initLargeMarketData();
    initGroupButton();
    initStockOrFundOrAllButton();
    settingButtonInit();
    initKlineCheckbox();
    // 默认20s刷新，通过mainPageRefreshTime获取
    setInterval(autoRefresh, mainPageRefreshTime);
    if (autoSync) {
        syncDataFromCloud();
    }
}

// 20s自动刷新
function autoRefresh() {
    var date = new Date();
    if (isTradingTime(date)) {
        initData();
        initLargeMarketData();
    }
}

async function initStockAndFundFromCache() {
    if (currentGroup == 'default-group') {
        var funds = await readCacheData('funds');
        if (funds == null || funds == 'null') {
            fundList = [];
        } else {
            fundList = jQuery.parseJSON(funds);
            fundList.forEach(item => {
                item.belongGroup = currentGroup;
            })
        }
        var stocks = await readCacheData('stocks');
        if (stocks == null || stocks == 'null') {
            stockList = [];
        } else {
            stockList = jQuery.parseJSON(stocks);
            stockList.forEach(item => {
                item.belongGroup = currentGroup;
            })
        }
    } else if(currentGroup == 'all-group') {
        await changeAllGroup();
    } else {
        var funds = await readCacheData(currentGroup + '_funds');
        if (funds == null || funds == 'null') {
            fundList = [];
        } else {
            fundList = jQuery.parseJSON(funds);
            fundList.forEach(item => {
                item.belongGroup = currentGroup;
            })
        }
        var stocks = await readCacheData(currentGroup + '_stocks');
        if (stocks == null || stocks == 'null') {
            stockList = [];
        } else {
            stockList = jQuery.parseJSON(stocks);
            stockList.forEach(item => {
                item.belongGroup = currentGroup;
            })
        }
    }
}

// 初始化 Html 页面
async function initHtml() {
    if (develop) {
        document.getElementById('stock-monitor-ma20-div').style.display = 'block';
        document.getElementById('import-from-local-springboot-div').style.display = 'block';
    } else {
        document.getElementById('stock-monitor-ma20-div').style.display = 'none';
        document.getElementById('import-from-local-springboot-div').style.display = 'none';
    }
    // 股票标题
    var stockHeadOrder = columnOrder.map(function (column) {
        var columnName = Object.keys(column)[0];
        return getThColumnHtml(columnName, 'STOCK');
    }).join("");
    let deleteButton;
    if (mainDeleteButtonDisplay) {
        deleteButton = '<th></th>';
    } else {
        deleteButton = '';
    }
    let batchDeleteHtml = '';
    if (showBatchDeleteButton) {
        batchDeleteHtml = '<th>批量删除</th>';
    }
    var stockHead = " <tr id=\"stock-tr-title\"> " + batchDeleteHtml + stockHeadOrder + deleteButton + " </tr>";
    // 基金标题
    var fundHeadOrder = columnOrder.map(function (column) {
        var columnName = Object.keys(column)[0];
        return getThColumnHtml(columnName, 'FUND');
    }).join("");
    var fundHead = " <tr id=\"fund-tr-title\"> " + batchDeleteHtml + fundHeadOrder + deleteButton + " </tr>";

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
        if(document.getElementById('stock-up-speed-th'))
            document.getElementById('stock-up-speed-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-quantity-relative-ratio-th'))
            document.getElementById('stock-quantity-relative-ratio-th').addEventListener('click', clickSortStockAndFund);
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
        if(document.getElementById('stock-amplitude-th'))
            document.getElementById('stock-amplitude-th').addEventListener('click', clickSortStockAndFund);
        if(document.getElementById('stock-zjl-th'))
            document.getElementById('stock-zjl-th').addEventListener('click', clickSortStockAndFund);
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
        // 初始化时获取模态框的ID，url中传递模态框直接显示
        const params = new URLSearchParams(window.location.search);
        const modalId = params.get('modal');
        if (modalId) {
            $("#" + modalId).modal();
        }
        // 首页，点击设置按钮
        document.getElementById('show-setting-button').addEventListener('click', async function () {
            $("#setting-modal").modal();
            $("#k-line-numbers").val(kLineNumbers);
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
        document.getElementById('show-wechat-group-button').addEventListener('click', showQrCodeModal);
        // 首页，点击刷新按钮
        document.getElementById('refresh-button').addEventListener('click', autoRefresh);
        // 首页，点击清除角标按钮
        document.getElementById('remove-badgetext-button').addEventListener('click', removeBadgeText);
        // 首页，点击全屏显示按钮
        document.getElementById('full-screen-button-2').addEventListener('click', fullScreen);
        // 首页，点击弹窗展示按钮
        document.getElementById('popup-windows-button').addEventListener('click', popupWindows);
        // 首页，点击读取自选股
        document.getElementById('add-stock-from-tonghuashun-xueqiu').addEventListener('click', addStockFromTonghuashunXueqiu);
        // 首页，点击小程序按钮
        document.getElementById('show-wechat-mini-button').addEventListener('click', showQrCodeModal);
        // 首页，点击批量删除
        document.getElementById('batch-delete-button').addEventListener('click', batchDelete);
        // 首页，点击滚动到底部
        document.getElementById('scroll-button').addEventListener('click', scrollToBottomOrTop);
        // 首页，点击快速定位
        document.getElementById('stock-name-search-position').addEventListener('change', stockNameSearchPosition);

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
        document.getElementById('time-image-minute-button').addEventListener('click', async function () {
            showMinuteImage('1DAY');
        });
        document.getElementById('time-image-minute-button2').addEventListener('click', async function () {
            showMinuteImage('1DAY');
        });
        // 走势图页面，点击分时图按钮
        document.getElementById('time-image-minute-5day-button').addEventListener('click', async function () {
            showMinuteImage('5DAY');
        });
        document.getElementById('time-image-minute-5day-button2').addEventListener('click', async function () {
            showMinuteImage('5DAY');
        });
        // 走势图页面，日线图按钮点击
        document.getElementById('time-image-day-button').addEventListener('click', showDayImage);
        document.getElementById('time-image-day-button2').addEventListener('click', showDayImage);
        // 走势图页面，周线图按钮点击
        document.getElementById('time-image-week-button').addEventListener('click', showWeekImage);
        document.getElementById('time-image-week-button2').addEventListener('click', showWeekImage);
        // 走势图页面，月线图按钮点击
        document.getElementById('time-image-month-button').addEventListener('click', showMonthImage);
        document.getElementById('time-image-month-button2').addEventListener('click', showMonthImage);
        // 走势图页面，1分钟线图按钮点击
        document.getElementById('time-image-1min-button').addEventListener('click', click1or5or15or30or60MinutesImage);
        // 走势图页面，5分钟线图按钮点击
        document.getElementById('time-image-5min-button').addEventListener('click', click1or5or15or30or60MinutesImage);
        // 走势图页面，15分钟线图按钮点击
        document.getElementById('time-image-15min-button').addEventListener('click', click1or5or15or30or60MinutesImage);
        // 走势图页面，30分钟线图按钮点击
        document.getElementById('time-image-30min-button').addEventListener('click', click1or5or15or30or60MinutesImage);
        // 走势图页面，60分钟线图按钮点击
        document.getElementById('time-image-60min-button').addEventListener('click', click1or5or15or30or60MinutesImage);
        // 走势图页面，120分钟线图按钮点击
        document.getElementById('time-image-120min-button').addEventListener('click', click1or5or15or30or60MinutesImage);
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
                if (currentGroup == 'all-group') {
                    $("#fund-belong-group-select").prop("disabled", true);
                } else {
                    $("#fund-belong-group-select").prop("disabled", false);
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
                if (currentGroup == 'all-group') {
                    $("#stock-belong-group-select").prop("disabled", true);
                } else {
                    $("#stock-belong-group-select").prop("disabled", false);
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
        document.getElementById('set-top-button').addEventListener('click', setTopOrEnd);
        document.getElementById('set-end-button').addEventListener('click', setTopOrEnd);
        // document.getElementById('set-top-button-2').addEventListener('click', setTop);
        // document.getElementById('set-top-button-3').addEventListener('click', setTop);
        // 走势图页面，股票/基金编辑页面，点击买/卖股票
        document.getElementById('show-buy-button').addEventListener('click', showBuyOrSell);
        document.getElementById('show-buy-button-2').addEventListener('click', showBuyOrSell);
        document.getElementById('show-sell-button').addEventListener('click', showBuyOrSell);
        document.getElementById('show-sell-button-2').addEventListener('click', showBuyOrSell);
        // 走势图页面，点击东方财富走势图
        document.getElementById('go-to-eastmoney-button').addEventListener('click', goToEastMoney);
        // 走势图页面，点击东方财富查看详细信息
        document.getElementById('go-to-eastmoney-detail-button').addEventListener('click', goToEastMoneyDetail);
        // 走势图页面，切换新旧走势图
        document.getElementById('time-image-new-button').addEventListener('click', changeTimeImage);
        document.getElementById('time-image-old-button').addEventListener('click', changeTimeImage);
        // 走势图页面，分时图关闭监听
        $("#time-image-modal").on("hidden.bs.modal", clearTimeImageTimeout);
        // 走势图页面，点击添加自选
        document.getElementById('add-stock-button').addEventListener('click', addStock);
        // 走势图页面，点击上一个下一个
        document.getElementById('time-image-pre-button').addEventListener('click', timeImagePreNext);
        document.getElementById('time-image-next-button').addEventListener('click', timeImagePreNext);
        // 走势图页面，点击天天基金查看详细信息
        document.getElementById('go-to-tiantianjijin-detail-button').addEventListener('click', goToTiantianjijinDetail);
        // 走势图页面，点击F10查看详细信息
        document.getElementById('go-to-tonghuashunf10-detail-button').addEventListener('click', goToTonghushunF10Detail);
        document.getElementById('go-to-guba-detail-button').addEventListener('click', goToGubaDetail);
        document.getElementById('go-to-wencai-detail-button').addEventListener('click', goToWencaiDetail);

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
                $("#fund-desc").val('');
                $("#fund-cycle-invest-type").val('');
                $("#fund-cycle-invest-date").val('');
                $("#fund-cycle-invest-value").val('');
                $("#fund-cycle-invest-rate").val('');
                await saveFund();
            }
        });

        // 密码保护页面，password-save-button点击，缓存密码
        document.getElementById('password-save-button').addEventListener('click', savePassword);
        // 密码保护页面，在密码输入框中点击回车
        document.getElementById('password').addEventListener('keydown', async function (event) {
            if (event.key === 'Enter') {
                await savePassword();
            }
        });
        // 验证密码页面，password-check-button点击，验证密码
        document.getElementById('password-check-button').addEventListener('click', checkPassword);
        // 验证密码页面，在密码输入框中点击回车
        document.getElementById('password-check').addEventListener('keydown',  async function (event) {
            if (event.key === 'Enter') {
                await checkPassword();
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
        // 设置页面，隐藏/展示页面展示项，一键全选
        document.getElementById("all-display-checkbox").addEventListener('change', setDisplayTr);
        // 设置页面，点击打赏按钮
        document.getElementById("show-donate-button").addEventListener('click',  showQrCodeModal);
        document.getElementById("show-donate-button-2").addEventListener('click',  showQrCodeModal);
        // 设置页面，点击展示/隐藏分时图按钮
        document.getElementById('show-minute-image-mini').addEventListener('click', setMinuteImageMini);
        document.getElementById('hide-minute-image-mini').addEventListener('click', setMinuteImageMini);
        // 设置页面，点击颜色切换按钮
        document.getElementById('change-blue-red-button').addEventListener('click', changeBlueRed);
        // document.getElementById('change-red-blue-button').addEventListener('click', changeBlueRed);
        // 设置页面，点击隐身模式
        document.getElementById('change-black-button').addEventListener('click', changeBlueRed);
        // document.getElementById('disable-change-black-button').addEventListener('click', changeBlueRed);
        // 设置页面，点击黄蓝模式
        document.getElementById('change-yellow-button').addEventListener('click', changeBlueRed);
        // 设置页面，点击忽悠自己按钮
        document.getElementById('cheat-me-button').addEventListener('click', cheatMe);
        document.getElementById('disable-cheat-me-button').addEventListener('click', cheatMe);
        // 设置页面，点击全屏按钮
        document.getElementById('full-screen-button').addEventListener('click', fullScreen);
        // 设置页面，点击样式切换
        document.getElementById('font-change-button').addEventListener('click', changeFontStyle);
        document.getElementById('bolder-font-change-button').addEventListener('click', changeFontStyle);
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
        // document.getElementById('column-order-save-button').addEventListener('click', saveColumnOrder);
        // 设置页面，点击实时价格按钮
        document.getElementById('monitor-price-change-button').addEventListener('click', changeMonitorPriceOrPercent);
        // 设置页面，点击涨跌幅按钮
        document.getElementById('monitor-percent-change-button').addEventListener('click', changeMonitorPriceOrPercent);
        // 设置页面，点击当日总收益按钮
        document.getElementById('monitor-day-income-change-button').addEventListener('click', changeMonitorPriceOrPercent);
        // 设置页面，点击当日总收益涨跌幅按钮
        document.getElementById('monitor-day-income-percent-change-button').addEventListener('click', changeMonitorPriceOrPercent);
        // 设置页面，点击扩展程序图标鼠标悬停后展示/不展示前5个股票价格
        document.getElementById('monitor-dont-top-20-stock-change-button').addEventListener('click', changemonitorTop20Stock);
        document.getElementById('monitor-top-20-stock-change-button').addEventListener('click', changemonitorTop20Stock);
        // 设置页面，点击扩展程序图标鼠标悬停后展示/不展示大盘指数和收益汇总
        document.getElementById('monitor-dont-show-more-button').addEventListener('click', changeMonitorShowMore);
        document.getElementById('monitor-show-more-button').addEventListener('click', changeMonitorShowMore);
        // 设置页面，点击切换隐蔽/默认图标按钮
        document.getElementById('change-icon-default-button').addEventListener('click', changeIcon);
        document.getElementById('change-icon-hidden-button').addEventListener('click', changeIcon);
        // 设置页面，点击保存大盘指数
        // document.getElementById('large-market-code-save-button').addEventListener('click', largeMarketCodeSave);
        // 设置页面，点击反馈建议按钮
        document.getElementById('show-advice-button').addEventListener('click', showAdvice);
        // 设置页面，点击在大盘指数位置展示/不展示持仓盈亏
        document.getElementById('larget-market-total-display-change-button').addEventListener('click', changeLargeMarketTotalDisplay);
        document.getElementById('larget-market-total-dont-display-change-button').addEventListener('click', changeLargeMarketTotalDisplay);
        // 设置页面，点击在大盘指数位置展示/不展示涨跌值
        document.getElementById('larget-market-count-display-change-button').addEventListener('click', changeLargeMarketCountDisplay);
        document.getElementById('larget-market-count-dont-display-change-button').addEventListener('click', changeLargeMarketCountDisplay);
        // 设置页面，点击在首页股票名字后展示/不展示沪/京/深/科创板/创业板
        document.getElementById('bankuai-display-change-button').addEventListener('click', changeBanKuaiDisplay);
        document.getElementById('bankuai-dont-display-change-button').addEventListener('click', changeBanKuaiDisplay);
        // 设置页面，点击在K线图展示/不展示MA5/MA250
        document.getElementById("kline-ma5-display-checkbox").addEventListener('change', changeKlineDisplay);
        document.getElementById("kline-ma10-display-checkbox").addEventListener('change', changeKlineDisplay);
        document.getElementById("kline-ma20-display-checkbox").addEventListener('change', changeKlineDisplay);
        document.getElementById("kline-ma30-display-checkbox").addEventListener('change', changeKlineDisplay);
        document.getElementById("kline-ma50-display-checkbox").addEventListener('change', changeKlineDisplay);
        document.getElementById("kline-ma250-display-checkbox").addEventListener('change', changeKlineDisplay);
        // 设置页面，点击首页数据自动刷新时间间隔按钮，20秒/10秒/5秒/3秒
        document.getElementById('main-page-refresh-time-20s-button').addEventListener('click', changeMainPageRefreshTime);
        document.getElementById('main-page-refresh-time-10s-button').addEventListener('click', changeMainPageRefreshTime);
        document.getElementById('main-page-refresh-time-5s-button').addEventListener('click', changeMainPageRefreshTime);
        // document.getElementById('main-page-refresh-time-3s-button').addEventListener('click', changeMainPageRefreshTime);
        document.getElementById('main-page-refresh-time-dont-button').addEventListener('click', changeMainPageRefreshTime);
        // 设置页面，点击切换新旧获取股票信息接口
        document.getElementById('stock-api-gtimg-button').addEventListener('click', changeStockApi);
        document.getElementById('stock-api-eastmoney-button').addEventListener('click', changeStockApi);
        // 设置页面，点击切换默认展示分时图/日线图/周线图/月线图
        document.getElementById('trend-image-type-minute-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-minute-5day-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-day-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-week-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-month-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-1min-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-5min-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-15min-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-30min-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-60min-button').addEventListener('click', changeTrendImageType);
        document.getElementById('trend-image-type-120min-button').addEventListener('click', changeTrendImageType);
        // 设置页面，点击自定义MA按钮
        document.getElementById('show-kline-ma-button').addEventListener('click', showKlineMA);
        // 设置页面，点击首页展示/隐藏删除按钮
        document.getElementById('main-delete-button-dont-display-change-button').addEventListener('click', changeMainDeleteButton);
        document.getElementById('main-delete-button-display-change-button').addEventListener('click', changeMainDeleteButton);
        // 设置页面，点击开启/关闭自动同步
        document.getElementById('close-auto-sync-button').addEventListener('click', changeAutoSync);
        document.getElementById('open-auto-sync-button').addEventListener('click', changeAutoSync);
        // 设置页面，变更透明度
        document.getElementById('opacity-control-range').addEventListener('click', changeOpacity);
        // 设置页面，点击隐藏使用说明按钮
        document.getElementById('close-help-button').addEventListener('click', changeShowHelpButton);
        // 设置页面，点击首页展示/隐藏批量删除按钮
        document.getElementById('batch-delete-button-dont-display-change-button').addEventListener('click', changeBatchDeleteButton);
        document.getElementById('batch-delete-button-display-change-button').addEventListener('click', changeBatchDeleteButton);
        // 设置页面，点击保存K线图显示日期个数按钮
        document.getElementById('k-line-numbers-save-button').addEventListener('click', saveKLineNumbers);
        // 设置页面，点击开启/关闭自选价格日期换行
        document.getElementById("open-addtime-price-newline-button").addEventListener('click', changeAddtimePriceNewlineButton);
        document.getElementById("close-addtime-price-newline-button").addEventListener('click', changeAddtimePriceNewlineButton);

        // 云同步页面，向服务器同步数据/从服务器同步数据/向服务器同步配置/从云服务器同步配置
        document.getElementById('sync-data-to-cloud-button').addEventListener('click', syncDataToCloud);
        document.getElementById('sync-data-from-cloud-button').addEventListener('click', syncDataFromCloud);
        document.getElementById('sync-config-to-cloud-button').addEventListener('click', syncConfigToCloud);
        document.getElementById('sync-config-from-cloud-button').addEventListener('click', syncConfigFromCloud);

        // 打赏页面，点击微信
        document.getElementById("wechat-pay-button").addEventListener('click',  showQrCodeModal);
        // 打赏页面，点击支付宝
        document.getElementById("ali-pay-button").addEventListener('click',  showQrCodeModal);

        // 买/卖股票页面，点击买/卖
        document.getElementById("buy-or-sell-button").addEventListener('click',  buyOrSell);

        // 数据中心页面，点击大盘资金
        document.getElementById('big-stock-money-button').addEventListener('click', showDataCenter);
        // 数据中心页面，点击北向资金
        document.getElementById('beixiang-money-button').addEventListener('click', showBeiXiang);
        document.getElementById('beixiang-money-button').style.display = 'none';
        // 数据中心页面，点击南向资金
        document.getElementById('nanxiang-money-button').addEventListener('click', showNanXiang);
        document.getElementById('nanxiang-money-button').style.display = 'none';
        // 数据中心页面，点击每日盈利
        document.getElementById('day-income-history-button').addEventListener('click', showDayIncomeHistory);
        // 数据中心页面，点击涨跌分布
        document.getElementById('up-down-counts-button').addEventListener('click', showUpDownCounts);
        // 数据中心页面，点击行业/概念板块
        document.getElementById('hangye-bankuai-money-button').addEventListener('click', showHangYeBanKuai);
        document.getElementById('gainian-bankuai-money-button').addEventListener('click', showGaiNianBanKuai);
        document.getElementById('diyu-bankuai-money-button').addEventListener('click', showDiYuBanKuai);
        document.getElementById('bankuai-money-1day-button').addEventListener('click', function() {
            showBanKuai(hangYeOrGaiNian, '1');
        });
        document.getElementById('bankuai-money-5days-button').addEventListener('click', function() {
            showBanKuai(hangYeOrGaiNian, '5');
        });
        document.getElementById('bankuai-money-10days-button').addEventListener('click', function() {
            showBanKuai(hangYeOrGaiNian, '10');
        });
        // 数据中心页面，点击涨跌幅榜
        document.getElementById('show-rise-fall-button').addEventListener('click', showRiseFall);

        // 反馈建议页面，点击保存
        document.getElementById('save-advice-button').addEventListener('click', saveAdvice);

        // 分组页面，点击新建分组
        document.getElementById('add-group-button').addEventListener('click', addGroup);

        // 自定义MA页面，点击保存
        document.getElementById('kline-ma-save-button').addEventListener('click', saveKlineMa);
    }
);

// 股票搜索后，接口返回为 unicode 编码，转换为中文
function A2U(str) {
    return unescape(str.replace(/\\u/gi, '%u'));
}

// 初始化首页股票列表数据
async function initData() {
    await initStockAndFundFromCache();
    initFirstInstall();
    var stocks = "";
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        // 走GTIMG获取股票接口
        if (stockApi == 'GTIMG') {
            for (var k in stockList) {
                stocks += stockList[k].code.replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','') + ",";
            }
            // 没有股票不调用接口请求
            if (stocks != "") {
                ajaxGetStockFromGtimgAsync(stocks, stocks);
            }
        // 走东方财富获取股票接口
        } else {
            var secIdStockArr = '';
            for (var k in stockList) {
                stocks += stockList[k].code + ",";
                let code = stockList[k].code;
                secIdStockArr += getSecid(code) + '.' + stockList[k].code.replace('sh', '').replace('sz', '').replace('bj','').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_') + ',';
            }
            // let result = "";
            // let stoksArr = [];
            // 没有股票不调用接口请求
            if (stocks != "") {
                ajaxGetStockFromEastMoney(secIdStockArr, stocks);
            }
        }
    }
    if (stocks == "") {
        initFund();
    }
}

async function initStockGtimgCallBack(result, stocks) {
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
    var stoksArr = result.split("\n");
    turnOverRate = "";
    stockMaxs = "";
    stockMins = "";
    for (var k in stoksArr) {
        for (var l in stockList) {
            // console.log(stockList[l].code ,"===", stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("=")))
            if (stockList[l].code.replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','') == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))) {
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
                // 9点至9点15分，股票价格如果为0就取昨日收盘价格
                if (parseFloat(stockList[l].now) == 0) {
                    stockList[l].now = values[4] + "";
                }
                // 计算折价率
                if (stockList[l].name.indexOf('ETF') >= 0 || stockList[l].name.indexOf('LOF') >= 0) {
                    // let realJZ = parseFloat(values[78] + "");
                    // console.log('=============',realJZ);
                    // // 通过实际净值realJZ和now的价格比较，计算折价率
                    // stockList[l].zjl = parseFloat((realJZ - parseFloat(stockList[l].now + "")) / parseFloat(stockList[l].now + "") * 100 + "").toFixed(2);
                    // console.log(stockList[l].name, '折价率', stockList[l].zjl);
                    stockList[l].zjl = 0;
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
                stockList[l].upSpeed = "--";
                stockList[l].amplitude = values[43];
                stockList[l].costPriceValue = costPriceValue + "";
                // 设置换手率
                turnOverRate += stockList[l].code + '~' + values[38] + '-';
                stockList[l].turnOverRate = values[38];
                stockMaxs += stockList[l].code + '~' + stockList[l].max + '-';
                stockMins += stockList[l].code + '~' + stockList[l].min + '-';
                stockList[l].quantityRelativeRatio = values[49];
            }
        }
    }
    await initFund();
}

async function initStockEastMoneyCallBack(stoksArr, stocks) {
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
    turnOverRate = "";
    stockMaxs = "";
    stockMins = "";
    for (var k in stoksArr) {
        let stock = {};
        for (var l in stockList) {
            if (stoksArr[k].f12 == stockList[l].code.replace('sh', '').replace('sz', '').replace('bj','').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_')) {
                let toFixedVolume = 2;
                stock = stockList[l];
                // 本来想这里break出去，结果会导致一些数据undefined，继续遍历吧
                stock.name = stoksArr[k].f14 + "";
                if (stock.name.indexOf('ETF') >= 0 || stock.name.indexOf('LOF') >= 0) {
                    toFixedVolume = 3;
                }
                stock.gztime = getDateStrFromTimestamp(stoksArr[k].f124*1000);
                // 可转债上市前加格默认为 0
                if (parseFloat(stoksArr[k].f2) == 0 && (stoksArr[k].f14.indexOf("发债") != -1 || stoksArr[k].f14.indexOf("转债") != -1)) {
                    stock.now = "100.00";
                } else {
                    stock.now = parseFloat(stoksArr[k].f2 + "").toFixed(toFixedVolume);
                }
                stock.max = parseFloat(stoksArr[k].f15 + "").toFixed(toFixedVolume);
                stock.min = parseFloat(stoksArr[k].f16 + "").toFixed(toFixedVolume);
                // 计算折价率
                if (stock.name.indexOf('ETF') >= 0 || stock.name.indexOf('LOF') >= 0) {
                    let realJZ = parseFloat(stoksArr[k].f145 + "");
                    // console.log('=============',realJZ);
                    // 通过实际净值realJZ和now的价格比较，计算折价率
                    stock.zjl = parseFloat((realJZ - parseFloat(stock.now + "")) / parseFloat(stock.now + "") * 100 + "").toFixed(2);;
                    // console.log(stock.name, '折价率', stock.zjl);
                }
                // 9点至9点15分，股票价格如果为0就取昨日收盘价格
                if (parseFloat(stock.now) == 0) {
                    stock.now = parseFloat(stoksArr[k].f18 + "").toFixed(toFixedVolume);
                    stock.max = parseFloat(stoksArr[k].f18 + "").toFixed(toFixedVolume);
                    stock.min = parseFloat(stoksArr[k].f18 + "").toFixed(toFixedVolume);
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
                stock.time = getDateStrFromTimestamp(stoksArr[k].f124*1000);
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
                stock.upSpeed = parseFloat(stoksArr[k].f22 + '').toFixed(2);
                stock.amplitude = stoksArr[k].f7;
                stock.costPriceValue = costPriceValue + "";
                // 设置换手率
                turnOverRate += stock.code + '~' + stoksArr[k].f8 + '-';
                stock.turnOverRate = parseFloat(stoksArr[k].f8 + '').toFixed(2);
                stockMaxs += stock.code + '~' + stock.max + '-';
                stockMins += stock.code + '~' + stock.min + '-';
                stockList[l].quantityRelativeRatio = parseFloat(stoksArr[k].f10 + '').toFixed(2);
            }
        }
    }
    await initFund();
}

// // 异步初始化首页基金列表数据
// async function initFund() {
//     if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
//         for (var l in fundList) {
//             var fundCode = fundList[l].fundCode;
//             var last = false;
//             if (l == fundList.length - 1) {
//                 last = true;
//             }
//             ajaxGetFundFromTiantianjijinAsync(fundCode, last);
//         }
//     }
// }

// // 基金异步回调方法
// async function ajaxGetFundFromTiantianjijinAsyncCallBack(fund, last) {
//     for (var k in fundList) {
//         if (fundList[k].fundCode == fund.fundCode) {
            
//             fundList[k].name = fund.name + "";
//             fundList[k].dwjz = fund.dwjz + "";
//             fundList[k].jzrq = fund.jzrq + "";
//             fundList[k].gsz = fund.gsz + "";
//             fundList[k].gztime = fund.gztime + "";
//             var gsz = new BigDecimal(fund.gsz + "");
//             var dwjz = new BigDecimal(fund.dwjz + "");
//             if (cheatMeFlag && parseFloat(fund.gszzl) < 0) {
//                 var gszzl = 0 - parseFloat(fund.gszzl);
//                 fundList[k].gszzl = gszzl + "";
//             } else {
//                 fundList[k].gszzl = fund.gszzl + "";
//             }
//             var now = new BigDecimal(fund.gsz + "");
//             if (fund.gszzl == "--" || fund.gszzl == '' || fund.gszzl == undefined || fund.gszzl == null) {
//                 fundList[k].gszzl = "0";
//             } else if(cheatMeFlag && parseFloat(fund.gszzl) < 0) {
//                 var gszzl = 0 - parseFloat(fund.gszzl);
//                 fundList[k].gszzl = gszzl + "";
//             } else {
//                 fundList[k].gszzl = fund.gszzl + "";
//             }
//             fundList[k].income = "0";
//             fundList[k].incomePercent = "0";
//             fundList[k].name = fund.name;
//             var costPrice = new BigDecimal(fundList[k].costPrise + "");
//             var now = new BigDecimal(fund.dwjz + "");
//             var incomeDiff = now.add(costPrice.negate());
//             if (costPrice <= 0) {
//                 fundList[k].incomePercent = "0";
//             } else {
//                 let incomePercent = incomeDiff.divide(costPrice, 8, MathContext.ROUND_HALF_UP)
//                     .multiply(BigDecimal.TEN)
//                     .multiply(BigDecimal.TEN)
//                     .setScale(3, MathContext.ROUND_HALF_UP);
//                 let bonds = new BigDecimal(fundList[k].bonds + "");
//                 let income = incomeDiff.multiply(bonds)
//                     .setScale(2, MathContext.ROUND_HALF_UP);
//                 fundList[k].income = income + "";
//                 fundList[k].incomePercent = incomePercent + "";
//             }
//             // 计算其他属性
//             let dayIncome = new BigDecimal("0");
//             let marketValue = new BigDecimal("0");
//             // 获取到当日净值已出
//             let currentDayNetDiagramDate = await readCacheData('current_day_jingzhi_date_' + fund.fundCode);
//             let gztime = fundList[k].gztime;
//             if (gztime != null && gztime != '' && gztime != undefined && gztime.length >= 10){
//                 // gztime = gztime.substring(0, 10).replaceAll('-', '')
//                 gztime = gztime.substring(0, 10).replace(/-/g, '')
//             }
//             var costPrice = new BigDecimal(fundList[k].costPrise + "");
//             var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
//             fundList[k].costPriceValue = costPriceValue + "";
//             if (currentDayNetDiagramDate == gztime) {
//                 let previousDayJingzhi = await readCacheData('previous_day_jingzhi_' + fund.fundCode);
//                 let currentDayJingzhi = await readCacheData('current_day_jingzhi_' + fund.fundCode);
//                 fundList[k].gsz = currentDayJingzhi;
//                 fundList[k].existJZ = true;
//                 dayIncome = new BigDecimal(parseFloat(((new BigDecimal(currentDayJingzhi + "")).subtract(new BigDecimal(previousDayJingzhi + ""))).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
//                 marketValue = new BigDecimal(parseFloat((new BigDecimal(currentDayJingzhi + "")).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
//                 fundList[k].gszzl = parseFloat((new BigDecimal(currentDayJingzhi + "")).subtract(new BigDecimal(previousDayJingzhi + "")).multiply(new BigDecimal("100")).divide(new BigDecimal(previousDayJingzhi + ""), 2) + "").toFixed(2);
//                 fundList[k].income = marketValue.subtract(costPriceValue) + "";
//                 if (costPrice <= 0) {
//                     fundList[k].incomePercent = "0";
//                 } else {
//                     fundList[k].incomePercent = marketValue.subtract(costPriceValue).multiply(new BigDecimal("100")).divide(costPriceValue) + "";
//                 }
//             } else {
//                 fundList[k].existJZ = false;
//                 dayIncome = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gszzl)).multiply((new BigDecimal(fundList[k].dwjz))).multiply(new BigDecimal(fundList[k].bonds + "")).divide(new BigDecimal("100"))).toFixed(2));
//                 marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz)).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
//             }
//             fundList[k].dayIncome = dayIncome + "";
//             fundList[k].marketValue = marketValue + "";
//             break;
//         }
//     }
//     if(last){
//         setTimeout(function () {
//             initStockAndFundHtml();
//         }, 1000);
//     }
// }

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
                            // gztime = gztime.substring(0, 10).replaceAll('-', '')
                            gztime = gztime.substring(0, 10).replace(/-/g, '')
                        }
                        var costPrice = new BigDecimal(fundList[k].costPrise + "");
                        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                        fundList[k].costPriceValue = costPriceValue + "";
                        if (currentDayNetDiagramDate == gztime) {
                            let previousDayJingzhi = await readCacheData('previous_day_jingzhi_' + fundCode);
                            let currentDayJingzhi = await readCacheData('current_day_jingzhi_' + fundCode);
                            fundList[k].gsz = currentDayJingzhi;
                            fundList[k].existJZ = true;
                            dayIncome = new BigDecimal(parseFloat(((new BigDecimal(currentDayJingzhi + "")).subtract(new BigDecimal(previousDayJingzhi + ""))).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                            marketValue = new BigDecimal(parseFloat((new BigDecimal(currentDayJingzhi + "")).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                            fundList[k].gszzl = parseFloat((new BigDecimal(currentDayJingzhi + "")).subtract(new BigDecimal(previousDayJingzhi + "")).multiply(new BigDecimal("100")).divide(new BigDecimal(previousDayJingzhi + ""), 2) + "").toFixed(2);
                            fundList[k].income = marketValue.subtract(costPriceValue) + "";
                            if (costPrice <= 0) {
                                fundList[k].incomePercent = "0";
                            } else {
                                fundList[k].incomePercent = marketValue.subtract(costPriceValue).multiply(new BigDecimal("100")).divide(costPriceValue) + "";
                            }
                        } else {
                            fundList[k].existJZ = false;
                            dayIncome = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gszzl)).multiply((new BigDecimal(fundList[k].dwjz))).multiply(new BigDecimal(fundList[k].bonds + "")).divide(new BigDecimal("100"))).toFixed(2));
                            marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz)).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                        }
                        fundList[k].dayIncome = dayIncome + "";
                        fundList[k].marketValue = marketValue + "";
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
                            if (json.gszzl == '--') {
                                fundList[k].gszzl = "0";
                            } else if (cheatMeFlag && parseFloat(json.gszzl) < 0) {
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
                            if (fund.dwjz == '--') {
                                fundList[k].dwjz = "0";
                            }
                            fundList[k].gsz = fund.dwjz;
                            if (fund.dwjz == '--') {
                                fundList[k].gsz = "0";
                            }
                            fundList[k].gztime = fund.gztime;
                            if (fund.gszzl == '--') {
                                fundList[k].gszzl = "0";
                            } else if (cheatMeFlag && parseFloat(fund.gszzl) < 0) {
                                var gszzl = 0 - parseFloat(fund.gszzl);
                                fundList[k].gszzl = gszzl + "";
                            } else {
                                fundList[k].gszzl = fund.gszzl + "";
                            }
                            fundList[k].income = "0";
                            fundList[k].incomePercent = "0";
                            fundList[k].name = fund.name;
                            var costPrice = new BigDecimal(fundList[k].costPrise + "");
                            var now = new BigDecimal(fundList[k].dwjz + "");
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
                            // gztime = gztime.substring(0, 10).replaceAll('-', '')
                            gztime = gztime.substring(0, 10).replace(/-/g, '')
                        }
                        var costPrice = new BigDecimal(fundList[k].costPrise + "");
                        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                        fundList[k].costPriceValue = costPriceValue + "";
                        if (currentDayNetDiagramDate == gztime) {
                            let previousDayJingzhi = await readCacheData('previous_day_jingzhi_' + fundCode);
                            let currentDayJingzhi = await readCacheData('current_day_jingzhi_' + fundCode);
                            fundList[k].gsz = currentDayJingzhi;
                            fundList[k].existJZ = true;
                            dayIncome = new BigDecimal(parseFloat(((new BigDecimal(currentDayJingzhi + "")).subtract(new BigDecimal(previousDayJingzhi + ""))).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                            marketValue = new BigDecimal(parseFloat((new BigDecimal(currentDayJingzhi + "")).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                            fundList[k].gszzl = parseFloat((new BigDecimal(currentDayJingzhi + "")).subtract(new BigDecimal(previousDayJingzhi + "")).multiply(new BigDecimal("100")).divide(new BigDecimal(previousDayJingzhi + ""), 2) + "").toFixed(2);
                            fundList[k].income = marketValue.subtract(costPriceValue) + "";
                            if (costPrice <= 0) {
                                fundList[k].incomePercent = "0";
                            } else {
                                fundList[k].incomePercent = marketValue.subtract(costPriceValue).multiply(new BigDecimal("100")).divide(costPriceValue) + "";
                            }
                        } else {
                            fundList[k].existJZ = false;
                            dayIncome = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gszzl)).multiply((new BigDecimal(fundList[k].dwjz))).multiply(new BigDecimal(fundList[k].bonds + "")).divide(new BigDecimal("100"))).toFixed(2));
                            marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz)).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
                        }
                        fundList[k].dayIncome = dayIncome + "";
                        fundList[k].marketValue = marketValue + "";
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
        let errorStockCode = '';
        try {
            for (var k = stockList.length - 1; k >= 0; k--) {
                errorStockCode = stockList[k].code;
                if (stockList[k].marketValue) {
                    marketValue = new BigDecimal(stockList[k].marketValue);
                    totalMarketValue = totalMarketValue.add(marketValue);
                }
            }
        } catch (e) {
            console.warn("股票列表获取完毕后，初始化 html 页面出错", e);
            alertMessage('切换新接口后，股票编码：' + errorStockCode + ' 数据报错，请切换回旧接口删除重新添加即可！');
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
    stockTotalIncome = new BigDecimal("0");
    stockDayIncome = new BigDecimal("0");
    stockTotalmarketValue = new BigDecimal("0");
    stockTotalCostValue = new BigDecimal("0");
    fundTotalIncome = new BigDecimal("0");
    fundDayIncome = new BigDecimal("0");
    fundTotalmarketValue = new BigDecimal("0");
    fundTotalCostValue = new BigDecimal("0");
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        var str1 = await getStockTableHtml(stockList, totalMarketValue);
        $("#stock-nr").html(str1);
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        var str2 = await getFundTableHtml(fundList, totalMarketValue);
        $("#fund-nr").html(str2);
    }
    allTotalIncome = fundTotalIncome.add(stockTotalIncome);
    allTotalIncomePercent = new BigDecimal("0");
    var totalCostPrice = fundTotalCostValue.add(stockTotalCostValue);
    if (totalCostPrice > 0) {
        allTotalIncomePercent = allTotalIncome.multiply(new BigDecimal("100")).divide(totalCostPrice, 4);
    }
    allTotalIncomePercentStyle = allTotalIncome == 0 ? "" : (allTotalIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    if (largetMarketTotalDisplay) {
        let str2 = '<p>持仓盈亏</p>' +
            '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncome + '</p>' +
            '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncomePercent + '%</p>';
        $("#larget-market-total").html(str2);
    }
    if (showStockOrFundOrAll == 'all') {
        var str3 = await getTotalTableHtml(totalMarketValue);
        $("#total-nr").html(str3);
    }  
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        if (showBatchDeleteButton) {
            $('.batch-delete-stock-checkbox').on('click', function(event) {
                event.stopPropagation();
            });
        }
        for (k in stockList) {
            if (mainDeleteButtonDisplay) {
                let deleteButton = document.getElementById('stock-delete-button-' + k);
                deleteButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    let buttonId = this.id; // 获取按钮的id
                    let buttonIndex = buttonId.split('-').pop(); // 从id中提取编号
                    console.log(stockList[buttonIndex].name);
                    timeImageCode = stockList[buttonIndex].code;
                    timeImageType = 'STOCK';
                    deleteStockAndFund();
                });
                let editButton = document.getElementById('stock-edit-button-' + k);
                editButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    let buttonId = this.id; // 获取按钮的id
                    let buttonIndex = buttonId.split('-').pop(); // 从id中提取编号
                    console.log(stockList[buttonIndex].name);
                    timeImageCode = stockList[buttonIndex].code;
                    timeImageType = 'STOCK';
                    $("#stock-name").val(stockList[buttonIndex].name);
                    $("#stock-name").attr("disabled", "disabled");
                    $("#stock-code").val(stockList[buttonIndex].code);
                    $("#stock-costPrise").val(stockList[buttonIndex].costPrise);
                    $("#stock-bonds").val(stockList[buttonIndex].bonds);
                    $("#stock-monitor-high-price").val(stockList[buttonIndex].monitorHighPrice);
                    $("#stock-monitor-low-price").val(stockList[buttonIndex].monitorLowPrice);
                    $("#stock-desc").val(stockList[buttonIndex].desc);
                    $("#stock-star-desc").val(stockList[buttonIndex].starDesc);
                    $("#stock-star").val(stockList[buttonIndex].star);
                    if (stockList[buttonIndex].monitorMA20) {
                        $("#stock-monitor-ma20-checkbox").prop("checked", true);
                    } else {
                        $("#stock-monitor-ma20-checkbox").prop("checked", false);
                    }
                    if (stockList[buttonIndex].newBuy == true && stockList[buttonIndex].newBuyDate == getBeijingDate()) {
                        $("#new-buy-checkbox").prop("checked", true);
                    } else {
                        $("#new-buy-checkbox").prop("checked", false);
                    }
                    $("#stock-monitor-upper-percent").val(stockList[buttonIndex].monitorUpperPercent);
                    $("#stock-monitor-lower-percent").val(stockList[buttonIndex].monitorLowerPercent);
                
                    $("#stock-modal").modal();
                });
            }
            let stockTr = document.getElementById('stock-tr-' + k);
            stockTr.addEventListener('click', function () {
                $("#stock-name").val(stockList[this.sectionRowIndex].name);
                $("#stock-name").attr("disabled", "disabled");
                $("#stock-code").val(stockList[this.sectionRowIndex].code);
                $("#stock-costPrise").val(stockList[this.sectionRowIndex].costPrise);
                $("#stock-bonds").val(stockList[this.sectionRowIndex].bonds);
                $("#stock-monitor-high-price").val(stockList[this.sectionRowIndex].monitorHighPrice);
                $("#stock-monitor-low-price").val(stockList[this.sectionRowIndex].monitorLowPrice);
                $("#stock-desc").val(stockList[this.sectionRowIndex].desc);
                $("#stock-star-desc").val(stockList[this.sectionRowIndex].starDesc);
                $("#stock-star").val(stockList[this.sectionRowIndex].star);
                if (stockList[this.sectionRowIndex].monitorMA20) {
                    $("#stock-monitor-ma20-checkbox").prop("checked", true);
                } else {
                    $("#stock-monitor-ma20-checkbox").prop("checked", false);
                }
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
                $("#go-to-eastmoney-detail-button")[0].style.display = 'inline';
                $("#go-to-tonghuashunf10-detail-button")[0].style.display = 'inline';
                $("#go-to-wencai-detail-button")[0].style.display = 'inline';
                $("#go-to-guba-detail-button")[0].style.display = 'inline';
                $("#go-to-tiantianjijin-detail-button")[0].style.display = 'none';
                $("#time-image-pre-button")[0].style.display = 'inline';
                $("#time-image-next-button")[0].style.display = 'inline';
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
                    $("#time-image-minute-5day-button")[0].style.display = 'none';
                    $("#time-image-day-button")[0].style.display = 'none';
                    $("#time-image-week-button")[0].style.display = 'none';
                    $("#time-image-month-button")[0].style.display = 'none';
                    
                    $("#time-image-minute-button2")[0].style.display = 'inline';
                    $("#time-image-minute-5day-button2")[0].style.display = 'inline';
                    $("#time-image-day-button2")[0].style.display = 'inline';
                    $("#time-image-week-button2")[0].style.display = 'inline';
                    $("#time-image-month-button2")[0].style.display = 'inline';

                    $("#time-image-minute-button2-line")[0].style.display = 'block';
                    $("#time-image-minute-5day-button2-line")[0].style.display = 'block';
                    $("#time-image-day-button2-line")[0].style.display = 'block';
                    $("#time-image-week-button2-line")[0].style.display = 'block';

                    $("#stock-show-time-image-button")[0].style.display = 'none';
                    $("#show-buy-or-sell-button-2")[0].style.display = 'none';
                    // $("#show-time-image-5min15min30min60min-button")[0].style.display = 'inline';
                } else {
                    $("#time-image-minute-button")[0].style.display = 'inline';
                    $("#time-image-minute-5day-button")[0].style.display = 'inline';
                    $("#time-image-day-button")[0].style.display = 'inline';
                    $("#time-image-week-button")[0].style.display = 'inline';
                    $("#time-image-month-button")[0].style.display = 'inline';

                    $("#time-image-minute-button2")[0].style.display = 'none';
                    $("#time-image-minute-5day-button2")[0].style.display = 'none';
                    $("#time-image-day-button2")[0].style.display = 'none';
                    $("#time-image-week-button2")[0].style.display = 'none';
                    $("#time-image-month-button2")[0].style.display = 'none';

                    $("#time-image-minute-button2-line")[0].style.display = 'none';
                    $("#time-image-minute-5day-button2-line")[0].style.display = 'none';
                    $("#time-image-day-button2-line")[0].style.display = 'none';
                    $("#time-image-week-button2-line")[0].style.display = 'none';

                    $("#stock-show-time-image-button")[0].style.display = 'inline';
                    $("#show-buy-or-sell-button-2")[0].style.display = 'inline';
                    // $("#show-time-image-5min15min30min60min-button")[0].style.display = 'inline';
                }
                timeImageCode = stockCode;
                timeImageType = "STOCK";
                if (trendImageType == 'MINUTE') {
                    showMinuteImage('1DAY');
                } else if (trendImageType == '5DAY') {
                    showMinuteImage('5DAY');
                } else if (trendImageType == 'DAY') {
                    showDayImage();
                } else if (trendImageType == 'WEEK') {
                    showWeekImage();
                } else if (trendImageType == 'MONTH') {
                    showMonthImage();
                } else if (trendImageType == '1MIN') {
                    show1or5or15or30or60MinutesImage('1MIN');
                } else if (trendImageType == '5MIN') {
                    show1or5or15or30or60MinutesImage('5MIN');
                } else if (trendImageType == '15MIN') {
                    show1or5or15or30or60MinutesImage('15MIN');
                } else if (trendImageType == '30MIN') {
                    show1or5or15or30or60MinutesImage('30MIN');
                } else if (trendImageType == '60MIN') {
                    show1or5or15or30or60MinutesImage('60MIN');
                } else if (trendImageType == '120MIN') {
                    show1or5or15or30or60MinutesImage('120MIN');
                }
            });
        }
    }
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
        if (showBatchDeleteButton) {
            $('.batch-delete-fund-checkbox').on('click', function(event) {
                event.stopPropagation();
            });
        }
        for (k in fundList) {
            if (mainDeleteButtonDisplay) {
                let deleteButton = document.getElementById('fund-delete-button-' + k);
                deleteButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    let buttonId = this.id; // 获取按钮的id
                    let buttonIndex = buttonId.split('-').pop(); // 从id中提取编号
                    console.log(fundList[buttonIndex].name);
                    timeImageCode = fundList[buttonIndex].fundCode;
                    timeImageType = 'FUND';
                    deleteStockAndFund();
                });
                let editButton = document.getElementById('fund-edit-button-' + k);
                editButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    let buttonId = this.id; // 获取按钮的id
                    let buttonIndex = buttonId.split('-').pop(); // 从id中提取编号
                    console.log(fundList[buttonIndex].name);
                    timeImageCode = fundList[buttonIndex].fundCode;
                    timeImageType = 'FUND';
                    $("#fund-name").val(fundList[buttonIndex].name);
                    $("#fund-name").attr("disabled", "disabled");
                    $("#fund-code").val(fundList[buttonIndex].fundCode);
                    $("#fund-costPrise").val(fundList[buttonIndex].costPrise);
                    $("#fund-bonds").val(fundList[buttonIndex].bonds);
                    $("#fund-desc").val(fundList[buttonIndex].desc);
                    $("#fund-star-desc").val(fundList[buttonIndex].starDesc);
                    $("#fund-star").val(fundList[buttonIndex].star);
                    $("#fund-monitor-high-price").val(fundList[this.sectionRowIndex].monitorHighPrice);
                    $("#fund-monitor-low-price").val(fundList[this.sectionRowIndex].monitorLowPrice);
                    $("#fund-modal").modal();
                });
            }
            let fundTr = document.getElementById('fund-tr-' + k);
            fundTr.addEventListener('click', function () {
                $("#fund-name").val(fundList[this.sectionRowIndex].name);
                $("#fund-name").attr("disabled", "disabled");
                $("#fund-code").val(fundList[this.sectionRowIndex].fundCode);
                $("#fund-costPrise").val(fundList[this.sectionRowIndex].costPrise);
                $("#fund-bonds").val(fundList[this.sectionRowIndex].bonds);
                $("#fund-desc").val(fundList[this.sectionRowIndex].desc);
                $("#fund-star-desc").val(fundList[this.sectionRowIndex].starDesc);
                $("#fund-star").val(fundList[this.sectionRowIndex].star);
                $("#fund-monitor-high-price").val(fundList[this.sectionRowIndex].monitorHighPrice);
                $("#fund-monitor-low-price").val(fundList[this.sectionRowIndex].monitorLowPrice);
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
                $("#go-to-eastmoney-detail-button")[0].style.display = 'none';
                $("#go-to-tonghuashunf10-detail-button")[0].style.display = 'none';
                $("#go-to-wencai-detail-button")[0].style.display = 'none';
                $("#go-to-guba-detail-button")[0].style.display = 'none';
                $("#go-to-tiantianjijin-detail-button")[0].style.display = 'inline';
                $("#time-image-pre-button")[0].style.display = 'inline';
                $("#time-image-next-button")[0].style.display = 'inline';
                let fundCode = $("#fund-code").val();
                timeImageCode = fundCode;
                timeImageType = "FUND";
                let currentURL = window.location.href;
                if (windowSize == 'MINI' && currentURL.indexOf('full-screen.html') == -1) {
                    $("#time-image-minute-button")[0].style.display = 'none';
                    $("#time-image-minute-5day-button")[0].style.display = 'none';
                    $("#time-image-day-button")[0].style.display = 'none';
                    $("#time-image-week-button")[0].style.display = 'none';
                    $("#time-image-month-button")[0].style.display = 'none';
                    
                    $("#time-image-minute-button2")[0].style.display = 'inline';
                    $("#time-image-minute-5day-button2")[0].style.display = 'inline';
                    $("#time-image-day-button2")[0].style.display = 'inline';
                    $("#time-image-week-button2")[0].style.display = 'inline';
                    $("#time-image-month-button2")[0].style.display = 'inline';

                    $("#time-image-minute-button2-line")[0].style.display = 'block';
                    $("#time-image-minute-5day-button2-line")[0].style.display = 'block';
                    $("#time-image-day-button2-line")[0].style.display = 'block';
                    $("#time-image-week-button2-line")[0].style.display = 'block';
                } else {
                    $("#time-image-minute-button")[0].style.display = 'inline';
                    $("#time-image-minute-5day-button")[0].style.display = 'inline';
                    $("#time-image-day-button")[0].style.display = 'inline';
                    $("#time-image-week-button")[0].style.display = 'inline';
                    $("#time-image-month-button")[0].style.display = 'inline';

                    $("#time-image-minute-button2")[0].style.display = 'none';
                    $("#time-image-minute-5day-button2")[0].style.display = 'none';
                    $("#time-image-day-button2")[0].style.display = 'none';
                    $("#time-image-week-button2")[0].style.display = 'none';
                    $("#time-image-month-button2")[0].style.display = 'none';

                    $("#time-image-minute-button2-line")[0].style.display = 'none';
                    $("#time-image-minute-5day-button2-line")[0].style.display = 'none';
                    $("#time-image-day-button2-line")[0].style.display = 'none';
                    $("#time-image-week-button2-line")[0].style.display = 'none';
                }
                if (trendImageType == 'MINUTE') {
                    showMinuteImage('1DAY');
                } else if (trendImageType == '5DAY') {
                    showMinuteImage('5DAY');
                } else if (trendImageType == 'DAY') {
                    showDayImage();
                } else if (trendImageType == 'WEEK') {
                    showWeekImage();
                } else if (trendImageType == 'MONTH') {
                    showMonthImage();
                } else if (trendImageType == '1MIN') {
                    show1or5or15or30or60MinutesImage('1MIN');
                } else if (trendImageType == '5MIN') {
                    show1or5or15or30or60MinutesImage('5MIN');
                } else if (trendImageType == '15MIN') {
                    show1or5or15or30or60MinutesImage('15MIN');
                } else if (trendImageType == '30MIN') {
                    show1or5or15or30or60MinutesImage('30MIN');
                } else if (trendImageType == '60MIN') {
                    show1or5or15or30or60MinutesImage('60MIN');
                } else if (trendImageType == '120MIN') {
                    show1or5or15or30or60MinutesImage('120MIN');
                }
            });
        }
    }
    // 监听右键事件以删除的行
    // document.addEventListener('contextmenu', (event) => {
    //     let target = event.target;
    //     // 向上查找最近的tr元素
    //     while (target && target.tagName !== 'TR' && target.tagName !== 'HTML') {
    //         target = target.parentElement;
    //     }
        
    //     if (target && target.tagName === 'TR') {
    //         let id = target.id;
    //         // id格式为 stock-tr-0，截取id0
    //         if (id.indexOf('stock-tr-') == 0) {
    //             let stockIndex = id.substring(9);
    //             // 从stockList中获取对应的股票信息
    //             let stock = stockList[stockIndex];
    //             timeImageCode = stock.code;
    //             timeImageType = 'STOCK';
    //             deleteStockAndFund();
    //         }
    //         if (id.indexOf('fund-tr-') == 0) {
    //             let fundIndex = id.substring(8);
    //             let fund = fundList[fundIndex];
    //             timeImageCode = fund.fundCode;
    //             timeImageType = 'FUND';
    //             deleteStockAndFund();
    //         }
    //     }
    // }, true);
    // 增加拖拽
    sortedByDrag();
    // 首页面你走势图
    initMinitesImageMini();
}

async function initMinitesImageMini() {
    // 初始化迷你走势图
    let showMinuteImageMini = await readCacheData('show-minute-image-mini');
    if (showMinuteImageMini == 'open') {
        if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
            for (const indexK in stockList) {
                ajaxGetStockTimeImageMinuteMini(stockList[indexK].code);
            }
        }
        if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'fund') {
            for (const indexL in fundList) {
                ajaxGetFundTimeImageMinuteMini(fundList[indexL].fundCode);
            }
        }
    }
}

// 拼接股票 html
async function getStockTableHtml(result, totalMarketValueResult) {
    var str = "";
    // stockTotalIncome = new BigDecimal("0");
    // stockDayIncome = new BigDecimal("0");
    // stockTotalmarketValue = new BigDecimal("0");
    // stockTotalCostValue = new BigDecimal("0");
    for (var k in result) {
        try {
            let changePercent = parseFloat(result[k].changePercent);
            var changePercentStyle = changePercent == 0 ? "" : (changePercent > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income >= 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
            var incomePercent = parseFloat(result[k].incomePercent);
            var incomePercentStyle = incomePercent == 0 ? "" : (incomePercent >= 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
            let addTimePrice = "--";
            if (addtimePriceNewline) {
                addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "<br>" + result[k].addTime + "";
            } else {
                addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" + result[k].addTime + ")";
            }
            
            if (result[k].costPriceValue) {
                stockTotalCostValue = stockTotalCostValue.add(new BigDecimal(result[k].costPriceValue + ""));
            }
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
                } else if(result[k].monitorAlert == '5') {
                    alertStyle = "<span style=\"color: " + redColor + "; font-weight: bold\">(20日均线以上)</span>";
                } else if(result[k].monitorAlert == '6') {
                    alertStyle = "<span style=\"color: " + blueColor + "; font-weight: bold\">(20日均线以下)</span>";
                }
            }
            let stockName = result[k].name ? result[k].name : result[k].code;
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
                var nameOrDesc = result[k].desc ? result[k].desc : stockName;
                if (banKuaiDisplay) {
                    if (nameOrDesc.indexOf('ETF') >= 0 || nameOrDesc.indexOf('LOF') >= 0) {
                        nameOrDesc =  nameOrDesc;
                    } else if (result[k].code.startsWith('sh688') || result[k].code.startsWith('SH688')) {
                        nameOrDesc =  nameOrDesc + "(科创板)";
                    } else if (result[k].code.startsWith('sz300') || result[k].code.startsWith('SZ300')) {
                        nameOrDesc = nameOrDesc + "(创业板)";
                    } else if (result[k].code.startsWith('sh') || result[k].code.startsWith('SH')) {
                        nameOrDesc =  nameOrDesc + "(沪)";
                    } else if (result[k].code.startsWith('sz') || result[k].code.startsWith('SZ')) {
                        nameOrDesc =  nameOrDesc + "(深)";
                    } else if (result[k].code.startsWith('bj') || result[k].code.startsWith('BJ')) {
                        nameOrDesc = nameOrDesc + "(京)";
                    }
                }
                let zjl = result[k].zjl + "%";
                if ((nameOrDesc.indexOf('ETF') < 0 && nameOrDesc.indexOf('LOF') < 0)) {
                    zjl = '--';
                }
                if (columnName == 'name-th') {
                    var batchDeleteHtml = showBatchDeleteButton ? "<td><input type=\"checkbox\" value=\""+result[k].code+"\" id=\"batch-delete-stock-checkbox\" class=\"batch-delete-stock-checkbox\" /></td>" : "";
                    html = batchDeleteHtml + "<td class=\"stock-fund-name-and-code\"" + dayIncomeStyle + ">" + nameOrDesc + alertStyle + (codeDisplay == 'DISPLAY' ? "<br>" + result[k].code + "" : "") + "</td>"
                } else if (columnName == 'mini-image-th') {
                    html = "<td>" + minuteImageMiniDiv + "</td>";
                } else if(columnName == 'belong-group-th') {
                    html = (belongGroupDisplay == 'DISPLAY' ? "<td>" + groups[result[k].belongGroup] + "</td>": "");
                } else if(columnName == 'up-speed-th') {
                    html = (upSpeedDisplay == 'DISPLAY' ? "<td>" + result[k].upSpeed + "%</td>": "");
                } else if(columnName == 'max-th') {
                    html = (maxDisplay == 'DISPLAY' ? "<td>" + result[k].max + "</td>": "");
                } else if(columnName == 'min-th') {
                    html = (minDisplay == 'DISPLAY' ? "<td>" + result[k].min + "</td>": "");
                } else if(columnName == 'star-desc-th') {
                    var starDesc = result[k].starDesc ? result[k].starDesc : "";
                    html = (starDescDisplay == 'DISPLAY' ? "<td>" + starDesc + "</td>": "");
                } else if(columnName == 'star-th') {
                    var star = result[k].star ? result[k].star + "星;" : "未知星;";
                    html = (starDisplay == 'DISPLAY' ? "<td>" + star + "</td>": "");
                } else if(columnName == 'zjl-th') {
                    html = (zjlDisplay == 'DISPLAY' ? "<td>" + zjl + "</td>": "");
                } else if(columnName == 'day-income-th') {
                    html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + dayIncome + "</td>" : "");
                } else if(columnName == 'change-percent-th') {
                    html = "<td " + changePercentStyle + ">" + result[k].changePercent + "%" + "</td>";
                } else if(columnName == 'change-th') {
                    html = (changeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + result[k].change + "</td>" : "");
                } else if(columnName == 'amplitude-th') {
                    html = (amplitudeDisplay == 'DISPLAY' ? "<td>" + result[k].amplitude + "%</td>" : "");
                } else if(columnName == 'turn-over-rate-th') {
                    html = (turnOverRateDisplay == 'DISPLAY' ? "<td>" + result[k].turnOverRate + "%</td>" : "");
                } else if(columnName == 'quantity-relative-ratio-th') {
                    html = (quantityRelativeRatioDisplay == 'DISPLAY' ? "<td>" + result[k].quantityRelativeRatio + "</td>" : "");
                } else if(columnName == 'price-th') {
                    html = (priceDisplay == 'DISPLAY' ? "<td>" + now + "</td>": "");
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
            let deleteButton;
            if (mainDeleteButtonDisplay) {
                deleteButton = '<td><button type="button" class="btn btn-primary" id="stock-delete-button-' + k + '">删除</button> <button type="button" class="btn btn-primary" id="stock-edit-button-' + k + '">编辑</button></td>';
            } else {
                deleteButton = '';
            }
            str += "<tr draggable=\"true\" id=\"stock-tr-" + k + "\">" + stockStrOrder + deleteButton + "</tr>";
            if (result[k].income) {
                stockTotalIncome = stockTotalIncome.add(new BigDecimal(result[k].income));
            }
            if (result[k].dayIncome) {
                stockDayIncome = stockDayIncome.add(new BigDecimal(result[k].dayIncome + ""));
            }
            if (result[k].marketValue) {
                stockTotalmarketValue = stockTotalmarketValue.add(new BigDecimal(result[k].marketValue + ""));
            }
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
            var batchDeleteHtml = showBatchDeleteButton ? "<td></td>" : "";
            html = batchDeleteHtml + "<td>合计</td>";
        } else if (columnName == 'mini-image-th') {
            html = "<td></td>";
        } else if (columnName == 'belong-group-th') {
            html = (belongGroupDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'up-speed-th') {
            html = (upSpeedDisplay == 'DISPLAY' ? "<td></td>": "");
        }  else if (columnName == 'max-th') {
            html = (maxDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if (columnName == 'min-th') {
            html = (minDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'star-desc-th') {
            html = (starDescDisplay == 'DISPLAY' ? "<td></td>": "");
        } else if(columnName == 'star-th') {
            html = (starDisplay == 'DISPLAY' ? "<td></td>": "");
        } else if(columnName == 'day-income-th') {
            html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + stockDayIncomePercentStyle + ">" + parseFloat(stockDayIncome + "").toFixed(2) + "</td>" : "");
        } else if(columnName == 'zjl-th') {
            html = (zjlDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'change-percent-th') {
            html = "<td " + stockDayIncomePercentStyle + ">" + parseFloat(stockDayIncomePercent + "").toFixed(2) + "%</td>";
        } else if(columnName == 'change-th') {
            html = (changeDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'amplitude-th') {
            html = (amplitudeDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'turn-over-rate-th') {
            html = (turnOverRateDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'quantity-relative-ratio-th') {
            html = (quantityRelativeRatioDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'price-th') {
            html = (priceDisplay == 'DISPLAY' ? "<td></td>" : "");
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
    let deleteButton;
    if (mainDeleteButtonDisplay) {
        deleteButton = '<td></td>';
    } else {
        deleteButton = '';
    }
    str += "<tr id=\"stock-tr-total\">" + stockTotalStrOrder + deleteButton + "</tr>";
    return str;
}

// 拼接基金 html
async function getFundTableHtml(result, totalMarketValueResult) {
    var str = "";
    // fundTotalIncome = new BigDecimal("0");
    // fundDayIncome = new BigDecimal("0");
    // fundTotalmarketValue = new BigDecimal("0");
    // fundTotalCostValue = new BigDecimal("0");
    for (var k in result) {
        try {
            let gszzl = parseFloat(result[k].gszzl);
            var gszzlStyle = gszzl == 0 ? "" : (gszzl > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            var dayIncome = parseFloat(result[k].dayIncome);
            var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            var incomePercent = parseFloat(result[k].incomePercent);
            var incomePercentStyle = incomePercent == 0 ? "" : (incomePercent > 0 ? "style=\"color:" + redColor + ";\"" : "style=\"color:" + blueColor + ";\"");
            var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
            let addTimePrice = "--";
            if (addtimePriceNewline) {
                addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "<br>" + result[k].addTime + "";
            } else {
                addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" + result[k].addTime + ")";
            }
            // 计算基金总成本
            fundTotalCostValue = fundTotalCostValue.add(new BigDecimal(result[k].costPriceValue + ""));
            let showMinuteImageMini = await readCacheData('show-minute-image-mini');
            let minuteImageMiniDiv = "";
            if (showMinuteImageMini == 'open') {
                minuteImageMiniDiv  = "<div id=\"minute-image-mini-" + result[k].fundCode + "\" class=\"my-echart\"></div>"
            }
            var exsitJZStr = result[k].existJZ !== null && result[k].existJZ !== undefined
                && result[k].existJZ ? '(实)' : '(估)';
            var nameOrDesc = result[k].desc ? result[k].desc : result[k].name;
            let nowTimestamp = Date.now();
            let monitorAlertDate = result[k].monitorAlertDate;
            let alertStyle = "";
            if ((nowTimestamp - monitorAlertDate) <= Env.TIME_CACHED_ONE_DAY) {
                if (result[k].monitorAlert == '1') {
                    alertStyle = "<span style=\"color: " + redColor + "; font-weight: bold\">(涨破" + result[k].monitorHighPrice + ")</span>";
                } else if(result[k].monitorAlert == '2') {
                    alertStyle = "<span style=\"color: " + blueColor + "; font-weight: bold\">(跌破" + result[k].monitorLowPrice + ")</span>";
                }
            }
            // 新顺序拼接TR行HTML
            var fundStrOrder = columnOrder.map(function (column) {
                var columnName = Object.keys(column)[0];
                var html;
                if (columnName == 'name-th') {
                    var batchDeleteHtml = showBatchDeleteButton ? "<td><input type=\"checkbox\" value=\""+result[k].fundCode+"\" id=\"batch-delete-fund-checkbox\" class=\"batch-delete-fund-checkbox\"/></td>" : "";
                    html = batchDeleteHtml + "<td class=\"stock-fund-name-and-code\"" + dayIncomeStyle + ">" + nameOrDesc + alertStyle + (codeDisplay == 'DISPLAY' ? "<br>" + result[k].fundCode + "" : "") + "</td>";
                } else if (columnName == 'mini-image-th') {
                    html = "<td>" + minuteImageMiniDiv + "</td>";
                } else if(columnName == 'belong-group-th'){
                    html = (belongGroupDisplay == 'DISPLAY' ? "<td>" + groups[result[k].belongGroup] + "</td>" : "");
                } else if(columnName == 'up-speed-th') {
                    html = (upSpeedDisplay == 'DISPLAY' ? "<td>--</td>": "");
                }  else if(columnName == 'max-th'){
                    html = (maxDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'min-th'){
                    html = (minDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'star-desc-th') {
                    var starDesc = result[k].starDesc ? result[k].starDesc : "";
                    html = (starDescDisplay == 'DISPLAY' ? "<td>" + starDesc + "</td>": "");
                } else if(columnName == 'star-th') {
                    var star = result[k].star ? result[k].star + "星;" : "未知星;";
                    html = (starDisplay == 'DISPLAY' ? "<td>" + star + "</td>": "");
                } else if(columnName == 'zjl-th') {
                    html = (zjlDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'day-income-th') {
                    html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + dayIncomeStyle + ">" + result[k].dayIncome + exsitJZStr + "</td>" : "");
                } else if(columnName == 'change-percent-th') {
                    html = "<td " + gszzlStyle + ">" + result[k].gszzl + "%</td>";
                } else if(columnName == 'change-th') {
                    html = (changeDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'amplitude-th') {
                    html = (amplitudeDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'turn-over-rate-th') {
                    html = (turnOverRateDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'quantity-relative-ratio-th') {
                    html = (quantityRelativeRatioDisplay == 'DISPLAY' ? "<td>--</td>" : "");
                } else if(columnName == 'price-th') {
                    html = (priceDisplay == 'DISPLAY' ? "<td>" + result[k].gsz + exsitJZStr + "</td>" : "");
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
            let deleteButton;
            if (mainDeleteButtonDisplay) {
                deleteButton = '<td><button type="button" class="btn btn-primary" id="fund-delete-button-' + k + '">删除</button> <button type="button" class="btn btn-primary" id="fund-edit-button-' + k + '">编辑</button></td>';
            } else {
                deleteButton = '';
            }
            str += "<tr draggable=\"true\" id=\"fund-tr-" + k + "\">" + fundStrOrder + deleteButton + "</tr>";

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
            var batchDeleteHtml = showBatchDeleteButton ? "<td></td>" : "";
            html = batchDeleteHtml + "<td>合计</td>";
        } else if (columnName == 'mini-image-th') {
            html = "<td></td>";
        } else if(columnName == 'belong-group-th') {
            html = (belongGroupDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'up-speed-th') {
            html = (upSpeedDisplay == 'DISPLAY' ? "<td></td>": "");
        }  else if(columnName == 'max-th'){
            html = (maxDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'min-th'){
            html = (minDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'star-desc-th') {
            html = (starDescDisplay == 'DISPLAY' ? "<td></td>": "");
        } else if(columnName == 'star-th') {
            html = (starDisplay == 'DISPLAY' ? "<td></td>": "");
        } else if(columnName == 'zjl-th') {
            html = (zjlDisplay == 'DISPLAY' ? "<td></td>": "");
        } else if(columnName == 'day-income-th') {
            html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + fundDayIncomePercentStyle + ">" + fundDayIncome + "</td>" : "");
        } else if(columnName == 'change-percent-th') {
            html = "<td " + fundDayIncomePercentStyle + ">" + fundDayIncomePercent + "%</td>"
        } else if(columnName == 'change-th') {
            html = (changeDisplay == 'DISPLAY' ? "<td></td>" : "")
        } else if(columnName == 'amplitude-th') {
            html = (amplitudeDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'turn-over-rate-th') {
            html = (turnOverRateDisplay == 'DISPLAY' ? "<td></td>" : "")
        } else if(columnName == 'quantity-relative-ratio-th') {
            html = (quantityRelativeRatioDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'price-th') {
            html = (priceDisplay == 'DISPLAY' ? "<td></td>" : "");
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
    let deleteButton;
    if (mainDeleteButtonDisplay) {
        deleteButton = '<td></td>';
    } else {
        deleteButton = '';
    }
    str += "<tr id=\"fund-tr-total\">" + fundTotalStrOrder + deleteButton + "</tr>";
    return str;
}

// 拼接汇总 html
function getTotalTableHtml(totalMarketValueResult) {
    var str = "";
    var allDayIncome = fundDayIncome.add(stockDayIncome);
    // allTotalIncome = fundTotalIncome.add(stockTotalIncome);
    var allDayIncomePercent = new BigDecimal("0");
    // allTotalIncomePercent = new BigDecimal("0");
    var totalCostPrice = fundTotalCostValue.add(stockTotalCostValue);
    if (totalMarketValueResult != 0) {
        allDayIncomePercent = allDayIncome.multiply(new BigDecimal("100")).divide(totalMarketValueResult.subtract(allDayIncome), 4);
    }
    // if (totalCostPrice > 0) {
    //     allTotalIncomePercent = allTotalIncome.multiply(new BigDecimal("100")).divide(totalCostPrice, 4);
    // }
    var allDayIncomePercentStyle = allDayIncome == 0 ? "" : (allDayIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    // allTotalIncomePercentStyle = allTotalIncome == 0 ? "" : (allTotalIncome > 0 ? "style=\"color:" + redColor + "\"" : "style=\"color:" + blueColor + "\"");
    // 新顺序拼接TR行HTML
    var totalStrOrder = columnOrder.map(function (column) {
        var columnName = Object.keys(column)[0];
        var html;
        if (columnName == 'name-th') {
            var batchDeleteHtml = showBatchDeleteButton ? "<td></td>" : "";
            html = batchDeleteHtml + "<td>汇总合计</td>";
        } else if (columnName == 'mini-image-th') {
            html = "<td></td>";
        } else if(columnName == 'belong-group-th') {
            html = (belongGroupDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'up-speed-th') {
            html = (upSpeedDisplay == 'DISPLAY' ? "<td></td>": "");
        }  else if(columnName == 'max-th'){
            html = (maxDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'min-th'){
            html = (minDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'star-desc-th') {
            html = (starDescDisplay == 'DISPLAY' ? "<td></td>": "");
        } else if(columnName == 'star-th') {
            html = (starDisplay == 'DISPLAY' ? "<td></td>": "");
        } else if(columnName == 'zjl-th') {
            html = (zjlDisplay == 'DISPLAY' ? "<td></td>": "");
        } else if(columnName == 'day-income-th') {
            html = (dayIncomeDisplay == 'DISPLAY' ? "<td " + allDayIncomePercentStyle + ">" + parseFloat(allDayIncome + "").toFixed(2) + "</td>" : "" );
        } else if(columnName == 'change-percent-th') {
            html = "<td " + allDayIncomePercentStyle + ">" + parseFloat(allDayIncomePercent + "").toFixed(2) + "%</td>";
        } else if(columnName == 'change-th') {
            html = (changeDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'amplitude-th') {
            html = (amplitudeDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'turn-over-rate-th') {
            html = (turnOverRateDisplay == 'DISPLAY' ? "<td></td>" : "")
        } else if(columnName == 'quantity-relative-ratio-th') {
            html = (quantityRelativeRatioDisplay == 'DISPLAY' ? "<td></td>" : "");
        } else if(columnName == 'price-th') {
            html = (priceDisplay == 'DISPLAY' ?  "<td></td>" : "");
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
    let deleteButton;
    if (mainDeleteButtonDisplay) {
        deleteButton = '<td></td>';
    } else {
        deleteButton = '';
    }
    str += "<tr id=\"total-tr-total\">" + totalStrOrder + deleteButton + "</tr>";
    // if (largetMarketTotalDisplay) {
    //     let str2 = '<p>持仓盈亏</p>' +
    //         '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncome + '</p>' +
    //         '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncomePercent + '%</p>';
    //     $("#larget-market-total").html(str2);
    // }
    return str;
}

// 判断是否为纯数字
function isNumeric(str) {
    return str !== "" && !isNaN(Number(str));
}

// 通过股票名称搜索股票列表
function searchStockByName(name) {
    if (name.indexOf("sh") == 0 || name.indexOf("sz") == 0 || name.indexOf("us") == 0 || name.indexOf("bj") == 0 
        || name.indexOf("SH") == 0 || name.indexOf("SZ") == 0 || name.indexOf("US") == 0 || name.indexOf("BJ") == 0) {
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
            stock = checkStockExsit("bj" + name);
            if (stock.checkReuslt) {
                if (result == "v_hint=\"") {
                    result = result + "bj~" + name + "~" +stock.name ;
                } else {
                    result = result  + "^" + "bj~" + name + "~" +stock.name ;
                }
            }
            if (result == "v_hint=\"") {
                alertMessage("不存在该股票");
                $("#stock-name").val("");
                return;
            }
        // gtimg 找不到，换一个接着找
        } else {
            let arr = ajaxGetStockCodeByNameFromDFCFW(name);
            console.log(arr);
            if (arr == [] || arr.length == 0) {
                alertMessage("不存在该股票");
                $("#stock-name").val("");
                return;
            } else {
                result = "";
                arr.forEach(item => {
                    if (item.securityTypeName == '京A') {
                        if (result == "") {
                            result = result + "bj~" + item.code + "~" +item.shortName;
                        } else {
                            result = result  + "^" + "bj~" + item.code + "~" +item.shortName;
                        }
                    }
                });
            }
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
    // 当前是全部分组，需要特殊处理
    // if (currentGroup == 'all-group') {
    //     alertMessage('全部分组时无法编辑/添加，请切换到指定分组后再编辑/添加～');
    //     $("#stock-modal").modal("hide");
    //     $("#search-stock-modal").modal("hide");
    //     return;
    // }
    var belongGroup = $("#stock-belong-group-select").val();
    var costPrise = $("#stock-costPrise").val();
    var bonds = $("#stock-bonds").val();
    var monitorHighPrice = $("#stock-monitor-high-price").val();
    var monitorLowPrice = $("#stock-monitor-low-price").val();
    var monitorUpperPercent = $("#stock-monitor-upper-percent").val();
    var monitorLowerPercent = $("#stock-monitor-lower-percent").val();
    var desc = $("#stock-desc").val();
    var newBuy = $("#new-buy-checkbox").prop("checked");
    var starDesc = $("#stock-star-desc").val();
    var star = $("#stock-star").val();
    var newBuyDate = getBeijingDate();
    var monitorMA20 = $("#stock-monitor-ma20-checkbox").prop("checked");
    
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
        "desc": desc,
        "starDesc": starDesc,
        "star": star,
        "monitorMA20": monitorMA20
    }
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
            stockList[k].desc = stock.desc;
            stockList[k].starDesc = stock.starDesc;
            stockList[k].star = stock.star;
            stockList[k].monitorMA20 = stock.monitorMA20;

            if (stockList[k].addTimePrice == null || stockList[k].addTimePrice == '') {
                let checkStockExsitResult = checkStockExsit(stockList[k].code);
                stockList[k].addTimePrice = checkStockExsitResult.now;
                stockList[k].addTime = getCurrentDate();
            }
            // 当前是全部分组，需要特殊处理
            if (currentGroup == "all-group") {
                // alertMessage('全部分组时无法编辑，请切换到指定分组后再编辑～');
                // $("#stock-modal").modal("hide");
                // $("#search-stock-modal").modal("hide");
                // return;
                // 默认group，更新默认分组
                if (belongGroup == "default-group") {
                    var stocks = await readCacheData('stocks');
                    if (stocks == null) {
                        stocks = [];
                    } else {
                        stocks = jQuery.parseJSON(stocks);
                    }
                    for (var l in stocks) {
                        if (stocks[l].code == stockList[k].code) {
                            stocks[l] = stockList[k];
                            saveCacheData('stocks', JSON.stringify(stocks));
                        }
                    }
                // 非默认分组，更新该分组
                } else {
                    var stocks = await readCacheData(belongGroup + '_stocks');
                    if (stocks == null) {
                        stocks = [];
                    } else {
                        stocks = jQuery.parseJSON(stocks);
                    }
                    for (var l in stocks) {
                        if (stocks[l].code == stockList[k].code) {
                            stocks[l] = stockList[k];
                            saveCacheData(belongGroup + '_stocks', JSON.stringify(stocks));
                        }
                    }
                }
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
            $("#stock-modal").modal("hide");
            $("#search-stock-modal").modal("hide");
            initData();
            if (autoSync) {
                syncDataToCloud();
            }
            return;
        }
    }
    let checkStockExsitResult = checkStockExsit(stock.code
        .replace('.oq','').replace('.ps','').replace('.n','').replace('.am','')
        .replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM',''));
    if (!checkStockExsitResult.checkReuslt) {
        alertMessage("不存在该股票");
        $("#stock-modal").modal("hide");
        $("#search-stock-modal").modal("hide");
        return;
    }
    stock.addTimePrice = checkStockExsitResult.now;
    stock.addTime = getCurrentDate();
    stock.belongGroup = currentGroup;
    stockList.push(stock);
    if (currentGroup == 'default-group' || currentGroup == 'all-group') {
        saveCacheData('stocks', JSON.stringify(stockList));
    } else {
        saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
    }
    $("#stock-modal").modal("hide");
    $("#search-stock-modal").modal("hide");
    if (autoSync) {
        syncDataToCloud();
    }
    initData();
}

// 保存基金
async function saveFund() {
    // 当前是全部分组，需要特殊处理
    // if (currentGroup == 'all-group') {
    //     alertMessage('全部分组时无法编辑/添加，请切换到指定分组后再编辑/添加～');
    //     $("#fund-modal").modal("hide");
    //     $("#search-fund-modal").modal("hide");
    //     return;
    // }
    var belongGroup = $("#fund-belong-group-select").val();
    var costPrise = $("#fund-costPrise").val();
    var bonds = $("#fund-bonds").val();
    var desc = $("#fund-desc").val();
    var starDesc = $("#fund-star-desc").val();
    var star = $("#fund-star").val();
    var monitorHighPrice = $("#fund-monitor-high-price").val();
    var monitorLowPrice = $("#fund-monitor-low-price").val();
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
            "desc": desc,
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
            "desc": desc,
            "starDesc": starDesc,
            "star": star,
            "monitorHighPrice": monitorHighPrice,
            "monitorLowPrice": monitorLowPrice,
        }
    }
    for (var k in fundList) {
        if (fundList[k].fundCode == fund.fundCode) {
            fundList[k].fundCode = fund.fundCode;
            fundList[k].costPrise = fund.costPrise;
            fundList[k].bonds = fund.bonds;
            fundList[k].desc = fund.desc;
            fundList[k].starDesc = fund.starDesc;
            fundList[k].star = fund.star;
            fundList[k].monitorHighPrice = fund.monitorHighPrice;
            fundList[k].monitorLowPrice = fund.monitorLowPrice;
            fundList[k].monitorAlert = '';
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
            if(currentGroup == 'all-group') {
                // alertMessage('全部分组时无法编辑，请切换到指定分组后再编辑～');
                // $("#fund-modal").modal("hide");
                // $("#search-fund-modal").modal("hide");
                // return;
                // 默认group，更新默认分组
                if (belongGroup == "default-group") {
                    var funds = await readCacheData('funds');
                    if (funds == null) {
                        funds = [];
                    } else {
                        funds = jQuery.parseJSON(funds);
                    }
                    for (var l in funds) {
                        if (funds[l].fundCode == fundList[k].fundCode) {
                            funds[l] = fundList[k];
                            saveCacheData('funds', JSON.stringify(funds));
                        }
                    }
                // 非默认分组，更新该分组
                } else {
                    var funds = await readCacheData(belongGroup + '_funds');
                    if (funds == null) {
                        funds = [];
                    } else {
                        funds = jQuery.parseJSON(funds);
                    }
                    for (var l in funds) {
                        if (funds[l].fundCode == fundList[k].fundCode) {
                            funds[l] = fundList[k];
                            saveCacheData(belongGroup + '_funds', JSON.stringify(funds));
                        }
                    }
                }
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
            $("#fund-modal").modal("hide");
            $("#search-fund-modal").modal("hide");
            initData();
            if (autoSync) {
                syncDataToCloud();
            }
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
    fund.belongGroup = currentGroup;
    fundList.push(fund);
    if (currentGroup == 'default-group' || currentGroup == 'all-group') {
        saveCacheData('funds', JSON.stringify(fundList));
    } else {
        saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
    }
    $("#fund-modal").modal("hide");
    $("#search-fund-modal").modal("hide");
    if (autoSync) {
        syncDataToCloud();
    }
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
    // console.log("读取缓存 key = " + key + ", value = " + result);
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
            } else if (values[0] == 'bj') {
                market = "京A"
            } else if (values[0] == 'hk') {
                market = "港股"
            } else if (values[0] == 'us') {
                market = "美股"
            } else if(values[0] == 'jj') {
                continue;
            } else {
                market = "其他"
            }
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
    settingButtonInit();
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
    let showBuyOrSellButton = document.getElementById('show-buy-or-sell-button');
    let showBuyOrSellButton2 = document.getElementById('show-buy-or-sell-button-2');
    let showWechatGroupButton = document.getElementById('show-wechat-group-button');
    let showDataCenterButton = document.getElementById('show-data-center-button');
    let timeImageDialog = document.getElementById('time-image-dialog');
    let timeImageNew = document.getElementById('time-image-new');
    let volumnImageEchart = document.getElementById('volumn-image-echart');
    let timeImageBody = document.getElementById('time-image-body');
    let groupMenuButton = document.getElementById('group-menu-button');
    let fullScreenMenuButton = document.getElementById('full-screen-menu-button');
    if (largeMarketCode == null || largeMarketCode == '' || largeMarketCode == []) {
        myInputGroup.style.marginTop='1px';
        myHeader.style.height = '0px';
        stockLargeMarket.style.height = '0px';
        myBody.style.marginTop='40px';
    } else {
        myInputGroup.style.marginTop='10px';
        myHeader.style.height = '80px';
        stockLargeMarket.style.height = '50px';
        myBody.style.marginTop='90px';
    }
    if (currentURL.indexOf('full-screen.html') > 0) {
        return;
    }
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
        showBuyOrSellButton.style.display = "inline";
        showBuyOrSellButton2.style.display = "inline";
        showDataCenterButton.style.display = "inline";
        groupMenuButton.style.display = "inline";
        fullScreenMenuButton.style.display = "inline";
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
        myMainContent.style.height = '100%';
        myDiv.style.height = '450px';
        helpDocumentAlert.style.width = '600px';
        fundNetDiagramDiv.style.width = '540px';
        fundNetDiagramDiv.style.height = '350px';
        helpDocumentButton.style.display = "none";
        showBuyOrSellButton.style.display = "inline";
        showBuyOrSellButton2.style.display = "inline";
        showDataCenterButton.style.display = "inline";
        groupMenuButton.style.display = "inline";
        fullScreenMenuButton.style.display = "inline";
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
        myMainContent.style.height = '100%';
        myDiv.style.height = '450px';
        helpDocumentAlert.style.width = '400px';
        fundNetDiagramDiv.style.width = '400px';
        fundNetDiagramDiv.style.height = '200px';
        helpDocumentButton.style.display = "none";
        showBuyOrSellButton.style.display = "none";
        showBuyOrSellButton2.style.display = "none";
        showDataCenterButton.style.display = "none";
        groupMenuButton.style.display = "none";
        fullScreenMenuButton.style.display = "none";
        timeImageDialog.style.maxWidth = '400px';
        timeImageNew.style.width = '380px';
        timeImageNew.style.height = '280px';
        volumnImageEchart.style.width = '380px';
        volumnImageEchart.style.height = '80px';
    }
}

function initOpacity() {
    document.getElementById('opacity-control-range').value = opacityPercent * 100;
    document.body.style.opacity = opacityPercent;
}

function changeOpacity() {
    let opacity = parseFloat(document.getElementById('opacity-control-range').value + "");
    opacityPercent = (opacity/100).toFixed(2);
    document.body.style.opacity = opacityPercent;
    saveCacheData('opacity-percent', opacityPercent);
}

// 样式切换，股票基金数据字体加粗加大
async function changeFontStyle(event) {
    let targetId = event.target.id;
    if (targetId == 'font-change-button') {
        saveCacheData('font-change-style', 'normal');
    } else {
        saveCacheData('font-change-style', 'bolder');
    }
    $("#setting-modal").modal("hide");
    initFontStyle();
    settingButtonInit();
}

// 展示隐藏分时图
async function setMinuteImageMini(event) {
    let targetId = event.target.id;
    if (targetId == 'show-minute-image-mini') {
        saveCacheData('show-minute-image-mini', 'open');
    } else {
        saveCacheData('show-minute-image-mini', 'close');
    }
    $("#setting-modal").modal("hide");
    initData();
    settingButtonInit();
}

// 各种告警提示
function alertMessage(message) {
    $("#alert-content").html(message);
    $("#alert-container").show();
    setTimeout(function () {
        $("#alert-container").hide();
    }, 3000);
}

// 第一次安装后没有数据，展示使用说明
function initFirstInstall() {
    if (showHelpButton && stockList.length == 0 && fundList.length == 0) {
        $("#help-document-alert")[0].style.display = 'block';
    } else {
        $("#help-document-alert")[0].style.display = 'none';
    }
}

// 遍历股票，展示主页迷你分时图
async function setStockMinitesImageMini(result, code) {
    console.log('========== setStockMinitesImageMini');
    // for (k in stockList) {
        let elementId = 'minute-image-mini-' + code;
        let dataStr = [];
        let now;
        if (result.data == null){
            return;
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
            return;
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
    // }
    console.log('========== 完成 ' + code);
}

// 遍历基金，展示主页迷你分时图
async function setFundMinitesImageMini(result, fundCode) {
    // console.log('========== setStockMinitesImageMini');
    // for (k in fundList) {
        let elementId = 'minute-image-mini-' + fundCode;
        // let result = ajaxGetFundTimeImageMinuteMini(fundCode);
        let dataStr = [];
        let now;
        if (result.data == null){
            return;
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
    // }
    // console.log('========== 完成 ' + code);
}

// 展示首页迷你分时图
async function setDetailChart(elementId, dataStr, color, preClose, maxPrice, minPrice, toFixedVolume) {
    // 如果分时数据长度小于240填充空值
    if (dataStr.length < 241) {
        const diffLength = 241 - dataStr.length;
        const emptyData = Array(diffLength).fill(null); // 使用 null 填充空数据
        dataStr = dataStr.concat(emptyData);
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(elementId));
    option = {
        animation: false, // 禁用动画
        animationDuration: 0, // 动画时长为 0，立即显示
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
    } else if (targetId == 'change-yellow-button'){
        if (blueColor == '#0000FF') {// 已经是隐身模式了点击变更为红绿模式
            blueColor = '#093'; 
            redColor = '#ee2500';
        } else { // 红绿模式下点击变更为隐身模式
            blueColor = '#0000FF'; 
            redColor = '#FFD700';
        }
        changeBlackButton();
    }
    $("#setting-modal").modal("hide");
    saveCacheData('redColor', redColor);
    saveCacheData('blueColor', blueColor);
    initData();
    initLargeMarketData();
    settingButtonInit();
}

// 欺骗自己，愣是把当日亏损变成盈利
async function cheatMe(event) {
    // let type;
    if (event.target.id == 'disable-cheat-me-button') {
        cheatMeFlag = false;
    } else {
        cheatMeFlag = true;
    } 
    $("#setting-modal").modal("hide");
    await saveCacheData('cheatMeFlag', cheatMeFlag);
    initData();
    settingButtonInit();
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
    initStockOrFundOrAllButton();
}

// 展示数据导入页面
function showImportData() {
    // 如果是火狐需要弹出全屏窗口展示导入页面
    if (isFirefox) {
        chrome.tabs.create({ url: "full-screen.html?modal=data-import-modal" });
        window.close();
    } else {
        $("#setting-modal").modal("hide");
        $("#data-import-modal").modal();
    }
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

// 弹出窗口展示
async function popupWindows() {
    $("#setting-modal").modal("hide");
    chrome.windows.create({
        url: chrome.runtime.getURL("full-screen.html"),
        type: "popup",
        width: 800,
        height: 600
    });
    window.close();
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
    let secId = getSecid(code);
    let codeNoPre = code.replace('SH','').replace('sh','').replace('SZ','').replace('sz','').replace('BJ','').replace('bj','').replace('HK','').replace('hk','').replace('US','').replace('us','');
    if (code == 'USDCNH') {
        codeNoPre = code;
    }
    let stock = ajaxGetStockFromEastMoneyNoAsync(secId + '.' + codeNoPre);
    let now = stock[0].f2 + "";
    let openPrice = stock[0].f18 + "";
    let badgeBackgroundColor;
    if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色变淡，更隐蔽
        if (parseFloat(now) >= parseFloat(openPrice)) {
            badgeBackgroundColor = lightRed;
        } else {
            badgeBackgroundColor = lightBlue;
        }
    } else {
        if (parseFloat(now) >= parseFloat(openPrice)) {
            // badgeBackgroundColor = '#ee2500';
            badgeBackgroundColor = redColor;
        } else {
            // badgeBackgroundColor = '#093';
            badgeBackgroundColor = blueColor;
        }
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
        let changePercent = parseFloat(stock[0].f3 + "");
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
    code = code.replace('sz','').replace('sh','').replace('bj','');
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
            } else if (stockCode.length == 6 && (stockCode.startsWith("8"))) {
                stockCode = "bj" + stockCode;
            } else if(stockCode.length == 5 || secid == 116) {
                stockCode = "hk" + stockCode;
            } else if(secid == 105 || secid == 106 || secid == 153) {
                stockCode = "us" + stockCode;
            }
            timeImageCode = stockCode;
            timeImageSecid = secid;
            timeImageType = "STOCK";
            timeImageName = fundStocksDetail[this.sectionRowIndex].f14;
            showMinuteImage('1DAY');
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
    code = code.replace('sz','').replace('sh','').replace('bj','');
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
    let imageTextSize = 8; 
    let toFixedVolume = 3;
    let preCloseDWJZ = dataDwjz[0];
    let preCloseLJJZ = dataLJJZ[0];
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
        yAxis: [
            {
                scale: true,
                type: 'value',
                position: 'left',  // 左侧 Y 轴
                axisLabel: {
                    textStyle: {
                        fontSize: imageTextSize // 调小字体大小使其适应空间
                    },
                    formatter: function(value) {
                        let price = parseFloat(value).toFixed(toFixedVolume);  // 左侧 Y 轴刻度显示价格
                        return price;
                    },
                    rich: {
                        a: {
                            color: redColor,
                            fontWeight: 'bold'
                        },
                        b: {
                            color: blueColor,
                            fontWeight: 'bold'
                        }
                    }
                },

            },
            {
                scale: true,
                type: 'value',
                position: 'right',  // 右侧 Y 轴
                axisLabel: {
                    textStyle: {
                        fontSize: imageTextSize // 调小字体大小使其适应空间
                    },
                    formatter: function(value) {
                        // 计算涨跌比例，假设初始价格为 prePrice
                        var changePercent = ((value - preCloseDWJZ) / preCloseDWJZ * 100);
                        return changePercent.toFixed(2) + '%';
                    },
                    rich: {
                        a: {
                            color: redColor,
                            fontWeight: 'bold'
                        },
                        b: {
                            color: blueColor,
                            fontWeight: 'bold'
                        }
                    }
                },
            },
        ],
        series: [
            {
                name: '单位净值',
                data: dataDwjz,
                type: 'line',
                smooth: false,
                yAxisIndex: 0,  // 关联侧 Y 轴
                color: 'blue',
                showSymbol: false,  // 不显示小圆点
            },
            {
                name: '累计净值',
                data: dataLJJZ,
                type: 'line',
                yAxisIndex: 0,  // 关联侧 Y 轴
                smooth: false,
                color: 'red',
                showSymbol: false,  // 不显示小圆点
            },
            {
                data: dataDwjz,
                type: 'line',
                smooth: false,
                yAxisIndex: 1,  // 关联侧 Y 轴
                showSymbol: false,  // 不显示小圆点
                lineStyle: {
                    opacity: 0, // 设置透明度为 0，隐藏线条
                },
                itemStyle: {
                    opacity: 0, // 设置数据点透明度为 0，隐藏数据点
                },
            },
            {
                data: dataLJJZ,
                type: 'line',
                smooth: false,
                yAxisIndex: 1,  // 关联侧 Y 轴
                showSymbol: false,  // 不显示小圆点
                lineStyle: {
                    opacity: 0, // 设置透明度为 0，隐藏线条
                },
                itemStyle: {
                    opacity: 0, // 设置数据点透明度为 0，隐藏数据点
                },
            },
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
                    let changePercent;
                    let dwjzContent = "";
                    let ljjzContent = "";
                    if (params[1].dataIndex == 0) {
                        changePercent = 0;
                    } else {
                        changePercent = ((dataDwjz[params[0].dataIndex] - dataDwjz[params[0].dataIndex-1]) / dataDwjz[params[0].dataIndex-1] * 100).toFixed(2);
                    }
                    for (let k = 0; k < params.length; k++) {
                        if (params[k].seriesName == '单位净值') {
                            let totalChangePercent1 = ((params[k].value - preCloseDWJZ) / preCloseDWJZ * 100).toFixed(2);
                            dwjzContent = params[k].seriesName + "：" + params[k].value + "<br>单日涨幅：" + changePercent + "%  累计涨幅：" + totalChangePercent1 + "%<br>";
                        } else if (params[k].seriesName == '累计净值') {
                            let totalChangePercent2 = ((params[k].value - preCloseLJJZ) / preCloseLJJZ * 100).toFixed(2);
                            ljjzContent = params[k].seriesName + "：" + params[k].value + "<br>单日涨幅：" + changePercent + "%  累计涨幅：" + totalChangePercent2 + "%";
                        }
                    }
                    outputContent = "日期：" + params[0].name + "<br>" + dwjzContent + ljjzContent;
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
    } else if(type == 'belong-group-display-checkbox') {
        belongGroupDisplay = dispaly;
        saveCacheData('belong-group-display', dispaly);
    } else if(type == 'up-speed-display-checkbox') {
        upSpeedDisplay = dispaly;
        saveCacheData('up-speed-display', dispaly);
    } else if(type == 'max-display-checkbox') {
        maxDisplay = dispaly;
        saveCacheData('max-display', dispaly);
    } else if(type == 'min-display-checkbox') {
        minDisplay = dispaly;
        saveCacheData('min-display', dispaly);
    } else if(type == 'star-desc-display-checkbox') {
        starDescDisplay = dispaly;
        saveCacheData('star-desc-display', dispaly);
    } else if(type == 'star-display-checkbox') {
        starDisplay = dispaly;
        saveCacheData('star-display', dispaly);
    } else if(type == 'zjl-display-checkbox') {
        zjlDisplay = dispaly;
        saveCacheData('zjl-display', dispaly);
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
    } else if(type =='amplitude-display-checkbox') {
        amplitudeDisplay = dispaly;
        saveCacheData('amplitude-display', dispaly);
    } else if(type == 'turn-over-rate-display-checkbox') {
        turnOverRateDisplay = dispaly;
        saveCacheData('turn-over-rate-display', dispaly);
    } else if(type == 'quantity-relative-ratio-display-checkbox') {
        quantityRelativeRatioDisplay = dispaly;
        saveCacheData('quantity-relative-ratio-display', dispaly);
    } else if(type == 'price-display-checkbox') {
        priceDisplay = dispaly;
        saveCacheData('price-display', dispaly);
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
        belongGroupDisplay = dispaly;
        upSpeedDisplay = dispaly;
        maxDisplay = dispaly;
        minDisplay = dispaly;
        starDescDisplay = dispaly;
        starDisplay = dispaly;
        zjlDisplay = dispaly;
        costPriceDisplay = dispaly;
        bondsDisplay = dispaly;
        incomeDisplay = dispaly;
        codeDisplay = dispaly;
        changeDisplay = dispaly;
        amplitudeDisplay = dispaly;
        updateTimeDisplay = dispaly;
        turnOverRateDisplay = dispaly;
        quantityRelativeRatioDisplay = dispaly;
        priceDisplay = dispaly;
        allDisplay = dispaly;
        saveCacheData('all-display', dispaly);
        saveCacheData('code-display', dispaly);
        saveCacheData('market-value-display', dispaly);
        saveCacheData('market-value-percent-display', dispaly);
        saveCacheData('cost-price-value-display', dispaly);
        saveCacheData('income-percent-display', dispaly);
        saveCacheData('addtime-price-display', dispaly);
        saveCacheData('day-income-display', dispaly);
        saveCacheData('belong-group-display', dispaly);
        saveCacheData('up-speed-display', dispaly);
        saveCacheData('max-display', dispaly);
        saveCacheData('min-display', dispaly);
        saveCacheData('zjl-display', dispaly);
        saveCacheData('star-desc-display', dispaly);
        saveCacheData('star-display', dispaly);
        saveCacheData('cost-price-display', dispaly);
        saveCacheData('bonds-display', dispaly);
        saveCacheData('income-display', dispaly);
        saveCacheData('change-display', dispaly);
        saveCacheData('amplitude-display', dispaly);
        saveCacheData('update-time-display', dispaly);
        saveCacheData('turn-over-rate-display', dispaly);
        saveCacheData('quantity-relative-ratio-display', dispaly);
        saveCacheData('price-display', dispaly);
        if(dispaly == 'DISPLAY') {
            $("#all-display-checkbox").prop("checked", true);
            $("#code-display-checkbox").prop("checked", true);
            $("#market-value-display-checkbox").prop("checked", true);
            $("#market-value-percent-display-checkbox").prop("checked", true);
            $("#cost-price-value-display-checkbox").prop("checked", true);
            $("#income-percent-display-checkbox").prop("checked", true);
            $("#addtime-price-display-checkbox").prop("checked", true);
            $("#belong-group-display-checkbox").prop("checked", true);
            $("#up-speed-display-checkbox").prop("checked", true);
            $("#max-display-checkbox").prop("checked", true);
            $("#min-display-checkbox").prop("checked", true);
            $("#zjl-checkbox").prop("checked", true);
            $("#star-desc-display-checkbox").prop("checked", false);
            $("#star-display-checkbox").prop("checked", false);
            $("#day-income-display-checkbox").prop("checked", true);
            $("#cost-price-display-checkbox").prop("checked", true);
            $("#bonds-display-checkbox").prop("checked", true);
            $("#income-display-checkbox").prop("checked", true);
            $("#change-display-checkbox").prop("checked", true);
            $("#amplitude-display-checkbox").prop("checked", true);
            $("#update-time-display-checkbox").prop("checked", true);
            $("#turn-over-rate-display-checkbox").prop("checked", true);
            $("#quantity-relative-ratio-display-checkbox").prop("checked", true);
            $("#price-display-checkbox").prop("checked", true);
        } else {
            $("#all-display-checkbox").prop("checked", false);
            $("#code-display-checkbox").prop("checked", false);
            $("#market-value-display-checkbox").prop("checked", false);
            $("#market-value-percent-display-checkbox").prop("checked", false);
            $("#cost-price-value-display-checkbox").prop("checked", false);
            $("#income-percent-display-checkbox").prop("checked", false);
            $("#addtime-price-display-checkbox").prop("checked", false);
            $("#belong-group-display-checkbox").prop("checked", false);
            $("#up-speed-display-checkbox").prop("checked", false);
            $("#max-display-checkbox").prop("checked", false);
            $("#min-display-checkbox").prop("checked", false);
            $("#zjl-display-checkbox").prop("checked", false);
            $("#star-desc-display-checkbox").prop("checked", false);
            $("#star-display-checkbox").prop("checked", false);
            $("#day-income-display-checkbox").prop("checked", false);
            $("#cost-price-display-checkbox").prop("checked", false);
            $("#bonds-display-checkbox").prop("checked", false);
            $("#income-display-checkbox").prop("checked", false);
            $("#change-display-checkbox").prop("checked", false);
            $("#amplitude-display-checkbox").prop("checked", false);
            $("#update-time-display-checkbox").prop("checked", false);
            $("#turn-over-rate-display-checkbox").prop("checked", false);
            $("#quantity-relative-ratio-display-checkbox").prop("checked", false);
            $("#price-display-checkbox").prop("checked", false);
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
            json.stocks.forEach(item => {
                item.code = item.code.replace('SH','sh').replace('SZ','sz').replace('BJ','bj').replace('HK','hk');
            })
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
                json[id + '_stocks'].forEach(item => {
                    item.code = item.code.replace('SH','sh').replace('SZ','sz').replace('BJ','bj').replace('HK','hk');
                })
                saveCacheData(id + '_stocks', JSON.stringify(json[id + '_stocks']));
                saveCacheData(id + '_funds', JSON.stringify(json[id + '_funds']));
            });
            if (currentGroup == 'default-group') {
                stockList = json.stocks;
                fundList = json.funds;
                stockList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
                fundList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
            } else if (currentGroup in json.groups) {
                stockList = json[currentGroup + '_stocks'];
                fundList = json[currentGroup + '_funds'];
                stockList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
                fundList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
            }
            groups = json.groups;
        } catch(error) {
            // 文本格式非json，需要单独处理，contents文本的每一行只有code读取到stocks中
            if (fileName.indexOf('FUND') >= 0 || fileName.indexOf('fund') >= 0) {
                var lines = contents.split('\n');
                if (lines[0].length > 20) {
                    $("#data-import-modal").modal("hide");
                    alertMessage("导入数据格式错误，请检查数据格式是否正确");
                    return;
                }
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
                if (lines[0].length > 20) {
                    $("#data-import-modal").modal("hide");
                    alertMessage("导入数据格式错误，请检查数据格式是否正确");
                    return;
                }
                lines.forEach(function(line) {
                    // 假设每行文本包含一个股票代码，可以根据需要添加额外的逻辑来处理每行的数据
                    var code = line.trim(); // 去除每行开头和结尾的空白字符
                    if (code !== '') {
                        code = code.replace('SH','sh').replace('SZ','sz').replace('BJ','bj').replace('HK','hk');
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
        if(autoSync) {
            syncDataToCloud();
        }
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
                    // date: item.date.replaceAll('-', ''),
                    date: item.date.replace(/-/g, ''),
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
        if(autoSync) {
            syncDataToCloud();
        }
        $("#setting-modal").modal("hide");
    }
}

// 删除基金或股票
async function deleteStockAndFund() {
    var checkResult = confirm("是否确认删除？");
    if (!checkResult) {
        return;
    }
    if (currentGroup == 'all-group') {
        alertMessage('全部分组时无法编辑，请切换到指定分组后再编辑～');
        $("#time-image-modal").modal("hide");
        $("#stock-modal").modal("hide");
        $("#fund-modal").modal("hide");
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
    if(autoSync) {
        syncDataToCloud();
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
    if (trendImageType == 'MINUTE') {
        showMinuteImage('1DAY');
    } else if (trendImageType == '5DAY') {
        showMinuteImage('5DAY');
    } else if (trendImageType == 'DAY') {
        showDayImage();
    } else if (trendImageType == 'WEEK') {
        showWeekImage();
    } else if (trendImageType == 'MONTH') {
        showMonthImage();
    }
}

// 搜索股票基金输入框，点击回车搜索股票基金
async function clickSearchFundAndStockButton(event) {
    if (event.key === 'Enter') {
        searchFundAndStock();
    }
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
    settingButtonInit();
}

// 置顶股票基金
async function setTopOrEnd(event) {
    let targetId = event.target.id;
    if (targetId == 'set-top-button') {
        // 基金分时图页面点击置顶
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
        // 股票分时图页面点击置顶
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
    } else {
        // 基金分时图页面点击置顶
        if (timeImageType == 'FUND') {
            let currentFund;
            for (var k in fundList) {
                if (fundList[k].fundCode == timeImageCode) {
                    currentFund = fundList[k];
                    fundList.splice(k, 1)
                    break;
                }
            }
            fundList.push(currentFund);
            if (currentGroup == 'default-group') {
                saveCacheData('funds', JSON.stringify(fundList));
            } else {
                saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
            }
        // 股票分时图页面点击置顶
        } else {
            let currentStock;
            for (var k in stockList) {
                if (stockList[k].code == timeImageCode) {
                    currentStock = stockList[k];
                    stockList.splice(k, 1)
                    break;
                }
            }
            stockList.push(currentStock);
            if (currentGroup == 'default-group') {
                saveCacheData('stocks', JSON.stringify(stockList));
            } else {
                saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
            }
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
    let syncDataLocalTime = await readCacheData('sync-data-local-time');
    if (syncDataLocalTime == null || syncDataLocalTime == '') {
        syncDataLocalTime = '1970/01/01 00:00:00';
    }
    let result = ajaxSyncDataFromCloud(syncDataCloudUuid);
    if (result != null && result != '' && result != undefined) {
        var checkResult = false;
        if (autoSync) {
            console.log('syncDataLocalTime=' + syncDataLocalTime + ';result.updateTime=' + result.updateTime + ';result.updateTime <= syncDataLocalTime=' + (result.updateTime + '' <= syncDataLocalTime + ''));
            if (result.updateTime + '' <= syncDataLocalTime + '') {
                // alertMessage('已经是最新不需要同步');
                $("#sync-data-cloud-modal").modal('hide');
                return;
            }
            // alertMessage('这就同步了');
            checkResult = true;
        } else {
            checkResult = confirm("这些云同步数据是在" + result.updateTime + "同步的，是否确认是您本人同步的数据？");
        }
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
                stockList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
                fundList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
            } else if((currentGroup + '_stocks') in result && (currentGroup + '_funds') in result) {
                stockList = result[currentGroup + '_stocks'];
                fundList = result[currentGroup + '_funds'];
                stockList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
                fundList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
            }
            syncDataLocalTime = result.updateTime;
            saveCacheData('sync-data-local-time', syncDataLocalTime);
            reloadDataAndHtml();
            $("#sync-data-cloud-modal").modal('hide');
            // alertMessage("云同步成功");
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
    var checkResult = false;
    if (autoSync) {
        checkResult = true;
    } else {
        checkResult = confirm("您是否要同步数据到云服务器？");
    }
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
            "desc" : stockListCache[k].desc,
            "starDesc" : stockListCache[k].starDesc
        }
        syncStocks.push(syncStock);
    }
    let fundListCache = jQuery.parseJSON(await readCacheData('funds'));
    for (k in fundListCache) {
        let syncFund = {
            "fundCode" : fundListCache[k].fundCode,
            "costPrise" : fundListCache[k].costPrise,
            "bonds" : fundListCache[k].bonds,
            "desc" : fundListCache[k].desc,
            "starDesc" : fundListCache[k].starDesc
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
    saveCacheData('sync-data-local-time', data.updateTime);
    if (result == 'fail') {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("云同步失败，请检查网络是否可以访问云服务器");
    } else {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("云同步成功");
    }
}

// 从云服务器获取数据
async function syncConfigFromCloud() {
    let syncDataCloudUuid = $("#sync-data-cloud-uuid").val();
    if (syncDataCloudUuid == null || syncDataCloudUuid == '') {
        $("#sync-data-cloud-modal").modal('hide');
        alertMessage("请输入云同步唯一标识");
        return;
    }
    saveCacheData('sync-data-cloud-uuid', syncDataCloudUuid);
    let result = ajaxSyncDataFromCloud(syncDataCloudUuid + '_CONFIG');
    if (result != null && result != '' && result != undefined) {
        var checkResult = confirm("这些云同步数据是在" + result.updateTime + "同步的，是否确认是您本人同步的数据？");
        if (checkResult) {
            blueColor = result.blueColor;
            saveCacheData('blueColor', blueColor);
            redColor = result.redColor;
            saveCacheData('redColor', redColor);
            cheatMeFlag = result.cheatMeFlag;
            saveCacheData('cheatMeFlag', cheatMeFlag);
            showStockOrFundOrAll = result.showStockOrFundOrAll;
            saveCacheData('showStockOrFundOrAll', showStockOrFundOrAll);
            windowSize = result.windowSize;
            saveCacheData('window-size', windowSize);
            marketValueDisplay = result.marketValueDisplay;
            saveCacheData('market-value-display', marketValueDisplay);
            marketValuePercentDisplay = result.marketValuePercentDisplay;
            saveCacheData('market-value-percent-display', marketValuePercentDisplay);
            costPriceValueDisplay = result.costPriceValueDisplay;
            saveCacheData('cost-price-value-display', costPriceValueDisplay);
            incomePercentDisplay = result.incomePercentDisplay;
            saveCacheData('income-percent-display', incomePercentDisplay);
            addtimePriceDisplay = result.addtimePriceDisplay;
            saveCacheData('addtime-price-display', addtimePriceDisplay);
            dayIncomeDisplay = result.dayIncomeDisplay;
            saveCacheData('day-income-display', dayIncomeDisplay);
            costPriceDisplay = result.costPriceDisplay;
            saveCacheData('cost-price-display', costPriceDisplay);
            bondsDisplay = result.bondsDisplay;
            saveCacheData('bonds-display', bondsDisplay);
            incomeDisplay = result.incomeDisplay;
            saveCacheData('income-display', incomeDisplay);
            allDisplay = result.allDisplay;
            saveCacheData('all-display', allDisplay);
            codeDisplay = result.codeDisplay;
            saveCacheData('code-display', codeDisplay);
            changeDisplay = result.changeDisplay;
            saveCacheData('change-display', changeDisplay);
            updateTimeDisplay = result.updateTimeDisplay;
            saveCacheData('update-time-display', updateTimeDisplay);
            turnOverRateDisplay = result.turnOverRateDisplay;
            saveCacheData('turn-over-rate-display', turnOverRateDisplay);
            quantityRelativeRatioDisplay = result.quantityRelativeRatioDisplay;
            saveCacheData('quantity-relative-ratio-display', quantityRelativeRatioDisplay);
            priceDisplay = result.priceDisplay;
            saveCacheData('price-display', priceDisplay);
            belongGroupDisplay = result.belongGroupDisplay;
            saveCacheData('belong-group-display', belongGroupDisplay);
            amplitudeDisplay = result.amplitudeDisplay;
            saveCacheData('amplitude-display', amplitudeDisplay);
            upSpeedDisplay = result.upSpeedDisplay;
            saveCacheData('up-speed-display', upSpeedDisplay);
            maxDisplay = result.maxDisplay;
            saveCacheData('max-display', maxDisplay);
            minDisplay = result.minDisplay;
            saveCacheData('min-display', minDisplay);
            starDisplay = result.starDisplay;
            saveCacheData('star-display', starDisplay);
            starDescDisplay = result.starDescDisplay;
            saveCacheData('star-desc-display', starDescDisplay);
            zjlDisplay = result.zjlDisplay;
            saveCacheData('zjl-display', zjlDisplay);
            mainDeleteButtonDisplay = result.mainDeleteButtonDisplay;
            saveCacheData('main-delete-button-display', mainDeleteButtonDisplay);
            largetMarketTotalDisplay = result.largetMarketTotalDisplay;
            saveCacheData('larget-market-total-display', largetMarketTotalDisplay);
            largetMarketCountDisplay = result.largetMarketCountDisplay;
            saveCacheData('larget-market-count-display', largetMarketCountDisplay);
            banKuaiDisplay = result.banKuaiDisplay;
            saveCacheData('bankuai-display', banKuaiDisplay);
            klineMA5Display = result.klineMA5Display;
            saveCacheData('kline-ma5-display', klineMA5Display);
            klineMA10Display = result.klineMA10Display;
            saveCacheData('kline-ma10-display', klineMA10Display);
            klineMA20Display = result.klineMA20Display;
            saveCacheData('kline-ma20-display', klineMA20Display);
            klineMA30Display = result.klineMA30Display;
            saveCacheData('kline-ma30-display', klineMA30Display);
            klineMA50Display = result.klineMA50Display;
            saveCacheData('kline-ma50-display', klineMA50Display);
            klineMA250Display = result.klineMA250Display;
            saveCacheData('kline-ma250-display', klineMA250Display);
            // klineMAList = result.klineMAList;
            // klineMAListDisplay = result.klineMAListDisplay;
            monitorPriceOrPercent = result.monitorPriceOrPercent;
            saveCacheData('monitor-price-or-percent', monitorPriceOrPercent);
            monitorTop20Stock = result.monitorTop20Stock;
            saveCacheData('monitor-top-20-stock', monitorTop20Stock);
            monitorShowMore = result.monitorShowMore;
            saveCacheData('monitor-show-more', monitorShowMore);
            huilvConvert = result.huilvConvert;
            saveCacheData('huilvConvert', huilvConvert);
            defaultIcon = result.defaultIcon;
            saveCacheData('default-icon', defaultIcon);
            stockApi = result.stockApi;
            saveCacheData('stock-api', stockApi);
            hangYeOrGaiNian = result.hangYeOrGaiNian;
            showHelpButton = result.showHelpButton;
            saveCacheData('show-help-button', showHelpButton);
            showBatchDeleteButton = result.showBatchDeleteButton;
            saveCacheData('show-batch-delete-button', showBatchDeleteButton);
            kLineNumbers = result.kLineNumbers;
            saveCacheData('k-line-numbers', kLineNumbers);
            addtimePriceNewline = result.addtimePriceNewline;
            saveCacheData('addtime-price-newline', addtimePriceNewline);
            riseFallSort = result.riseFallSort;
            opacityPercent = result.opacityPercent;
            saveCacheData('opacity-percent', opacityPercent);
            largeMarketCode = result.largeMarketCode;
            saveCacheData('large-market-code', JSON.stringify(largeMarketCode));
            initHtml();
            initLargeMarketData();
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

// 向云服务器存储配置
async function syncConfigToCloud() {
    var checkResult = false;
    if (autoSync) {
        checkResult = true;
    } else {
        checkResult = confirm("您是否要同步配置到云服务器？");
    }
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
    data.blueColor = blueColor;
    data.redColor = redColor;
    data.cheatMeFlag = cheatMeFlag;
    data.showStockOrFundOrAll = showStockOrFundOrAll;
    data.windowSize = windowSize;
    data.marketValueDisplay = marketValueDisplay;
    data.marketValuePercentDisplay = marketValuePercentDisplay;
    data.costPriceValueDisplay = costPriceValueDisplay;
    data.incomePercentDisplay = incomePercentDisplay;
    data.addtimePriceDisplay = addtimePriceDisplay;
    data.dayIncomeDisplay = dayIncomeDisplay;
    data.costPriceDisplay = costPriceDisplay;
    data.bondsDisplay = bondsDisplay;
    data.incomeDisplay = incomeDisplay;
    data.allDisplay = allDisplay;
    data.codeDisplay = codeDisplay;
    data.changeDisplay = changeDisplay;
    data.updateTimeDisplay = updateTimeDisplay;
    data.turnOverRateDisplay = turnOverRateDisplay;
    data.quantityRelativeRatioDisplay = quantityRelativeRatioDisplay;
    data.priceDisplay = priceDisplay;
    data.belongGroupDisplay = belongGroupDisplay;
    data.amplitudeDisplay = amplitudeDisplay;
    data.upSpeedDisplay = upSpeedDisplay;
    data.maxDisplay = maxDisplay;
    data.minDisplay = minDisplay;
    data.starDisplay = starDisplay;
    data.starDescDisplay = starDescDisplay;
    data.zjlDisplay = zjlDisplay;
    data.mainDeleteButtonDisplay = mainDeleteButtonDisplay;
    data.largetMarketTotalDisplay = largetMarketTotalDisplay;
    data.largetMarketCountDisplay = largetMarketCountDisplay;
    data.banKuaiDisplay = banKuaiDisplay;
    data.klineMA5Display = klineMA5Display;
    data.klineMA10Display = klineMA10Display;
    data.klineMA20Display = klineMA20Display;
    data.klineMA30Display = klineMA30Display;
    data.klineMA50Display = klineMA50Display;
    data.klineMA250Display = klineMA250Display;
    data.klineMAList = klineMAList;
    data.klineMAListDisplay = klineMAListDisplay;
    data.monitorPriceOrPercent = monitorPriceOrPercent;
    data.monitorTop20Stock = monitorTop20Stock;
    data.monitorShowMore = monitorShowMore;
    data.huilvConvert = huilvConvert;
    data.defaultIcon = defaultIcon;
    data.stockApi = stockApi;
    data.hangYeOrGaiNian = hangYeOrGaiNian;
    data.showHelpButton = showHelpButton;
    data.showBatchDeleteButton = showBatchDeleteButton;
    data.kLineNumbers = kLineNumbers;
    data.addtimePriceNewline = addtimePriceNewline;
    data.riseFallSort = riseFallSort;
    data.opacityPercent = opacityPercent;
    data.largeMarketCode = largeMarketCode;
    data.updateTime = getBeijingTime();
    let result = ajaxSyncDataToCloud(JSON.stringify(data), syncDataCloudUuid + '_CONFIG');
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
    // let syncDataCloudUuid = await readCacheData('sync-data-cloud-uuid');
    // if (syncDataCloudUuid !='' && syncDataCloudUuid != null && syncDataCloudUuid != undefined) {
        $("#sync-data-cloud-uuid").val(syncDataCloudUuid);
    // } else {
    //     $("#sync-data-cloud-uuid").val(generateRandomUUID());
    // }
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
    if (stockName.endsWith('ETF') || stockName.endsWith('LOF')) {
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
    if (currentGroup == 'all-group') {
        alertMessage('全部分组时无法编辑/添加/买卖，请切换到指定分组后再编辑/添加/买卖～');
        $("#buy-or-sell-modal").modal("hide");
        return;
    }
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
        stockCode = stockCode.replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','')
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
    if (autoSync) {
        syncDataToCloud();
    }
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
                if (currentFund != null) {
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
                }
            } else {
                if (dragTargetType == 'stock'  && targetIndex == 'title') {
                    targetIndex = 0;
                }
                if (dragTargetType == 'fund' || targetIndex == 'total') {
                    targetIndex = stockList.length - 1;
                } 
                let currentStock = stockList[sourceIndex];
                if (currentStock != null) {
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

    document.getElementById('full-screen-menu-button').classList.remove(btnInfoCss);
    document.getElementById('full-screen-menu-button').classList.remove(btnLightCss);
    document.getElementById('full-screen-menu-button').classList.add(blackCss);

    document.getElementById('show-wechat-group-button').classList.remove(btnOutlinePrimaryCss);
    document.getElementById('show-wechat-group-button').classList.remove(btnLightCss);
    document.getElementById('show-wechat-group-button').classList.add(blackOutlineCss);

    document.getElementById('show-wechat-mini-button').classList.remove(btnOutlinePrimaryCss);
    document.getElementById('show-wechat-mini-button').classList.remove(btnLightCss);
    document.getElementById('show-wechat-mini-button').classList.add(blackOutlineCss);
    
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
            lastSort.stock.sortType = 'desc';
            lastSort.stock.targetId = targetId;
        } else {
            lastSort.fund.sortType = 'desc';
            lastSort.fund.targetId = targetId;
        }
    // 第二次点击，之前已经正序排序，这次按倒序排列
    } else if(document.getElementById(targetId).classList.contains('desc')) {
        if (targetId.indexOf('stock-') >= 0) {
            lastSort.stock.sortType = 'asc';
            lastSort.stock.targetId = targetId;
        } else {
            lastSort.fund.sortType = 'asc';
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
            if (currentGroup != 'all-group') {
                stockList = jQuery.parseJSON(stocks);
                stockList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
            }
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
            if (currentGroup != 'all-group') {
                fundList = jQuery.parseJSON(funds);
                fundList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
            }
        }
    }
    saveCacheData("last-sort", lastSort);
    if (currentGroup == 'all-group') {
        changeGroup('all-group');
    } else {
        initHtml();
        initData();
    }
}

// 对股票/基金按照点击的列进行排序
async function sortStockAndFund(totalMarketValue) {
    if (showStockOrFundOrAll == 'all' || showStockOrFundOrAll == 'stock') {
        stockList.forEach(function (stock) {
            if (stock.marketValue && totalMarketValue.compareTo(new BigDecimal("0")) != 0) {
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
            } else if (targetId == 'stock-up-speed-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.upSpeed + "") - parseFloat(b.upSpeed + "");
                } else {
                    return parseFloat(b.upSpeed + "") - parseFloat(a.upSpeed + "");
                }
            } else if (targetId == 'stock-quantity-relative-ratio-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.quantityRelativeRatio + "") - parseFloat(b.quantityRelativeRatio + "");
                } else {
                    return parseFloat(b.quantityRelativeRatio + "") - parseFloat(a.quantityRelativeRatio + "");
                }
            } else if (targetId == 'stock-change-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.change + "") - parseFloat(b.change + "");
                } else {
                    return parseFloat(b.change + "") - parseFloat(a.change + "");
                }
            } else if (targetId == 'stock-amplitude-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.amplitude + "") - parseFloat(b.amplitude + "");
                } else {
                    return parseFloat(b.amplitude + "") - parseFloat(a.amplitude + "");
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
            } else if (targetId == 'stock-zjl-th') {
                if(lastSort.stock.sortType == 'asc'){
                    return parseFloat(a.zjl + "") - parseFloat(b.zjl + "");
                } else {
                    return parseFloat(b.zjl + "") - parseFloat(a.zjl + "");
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
    displayBankuaiMoney("none");
    showBigStockMoney();
}

function displayBankuaiMoney(display) {
    document.getElementById('bankuai-money-1day-button').style.display = display;
    document.getElementById('bankuai-money-5days-button').style.display = display;
    document.getElementById('bankuai-money-10days-button').style.display = display;
}

// 展示大盘资金图表
async function showBigStockMoney() {
    displayBankuaiMoney("none");
    $("#day-income-history-head").html("");
    $("#day-income-history-nr").html("");
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
    displayBankuaiMoney("none");
    $("#day-income-history-head").html("");
    $("#day-income-history-nr").html("");
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
    displayBankuaiMoney("none");
    $("#day-income-history-head").html("");
    $("#day-income-history-nr").html("");
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

function showHangYeBanKuai() {
    hangYeOrGaiNian = 'HANGYE';
    showBanKuai('HANGYE', '1');
}

function showGaiNianBanKuai() {
    hangYeOrGaiNian = 'GAINIAN';
    showBanKuai('GAINIAN', '1');
}

function showDiYuBanKuai() {
    hangYeOrGaiNian = 'DIYU';
    showBanKuai('DIYU', '1');
}

// 展示行业板块图表
async function showBanKuai(type, day) {
    let dataZoomEnd = 30;
    let chartTitle = '行业板块';
    if (type == 'GAINIAN') {
        dataZoomEnd = 6;
        chartTitle = '概念板块';
    } else if (type == 'DIYU') {
        dataZoomEnd = 100;
        chartTitle = '地域板块';
    }
    displayBankuaiMoney("inline");
    $("#day-income-history-head").html("");
    $("#day-income-history-nr").html("");
    let result = ajaxGetBanKuaiMoney(type, day);
    let elementId = 'data-center-chart';
    let data = [];
    let dataAxis = [];
    if (result.data == null || result.data.diff == null) {
        return;
    }
    let oneHundredMillion = new BigDecimal("100000000");
    for (var k = 0; k < result.data.diff.length; k++) {
        dataAxis.push(result.data.diff[k].f14);
        let money;
        if (day == '1') {
            money = new BigDecimal(result.data.diff[k].f62 + "");
        } else if(day == '5') {
            money = new BigDecimal(result.data.diff[k].f164 + "");
        } else if(day == '10') {
            money = new BigDecimal(result.data.diff[k].f174 + "");
        }
        money = money.divide(oneHundredMillion, 2, BigDecimal.ROUND_HALF_UP);
        data.push(money + "");
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
            text: chartTitle, // 设置整个图表的标题
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
                name: chartTitle,
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
                end: dataZoomEnd
            },
            {
                type: 'inside',  // 内置型选择框
                xAxisIndex: [0],  // 表示控制第一个 x 轴
                start: 0,
                end: dataZoomEnd
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
    if (huilvCached == "1") {
        console.log('汇率比率为1，几乎不可能说明上次接口调用问题');
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
    settingButtonInit();
}

// 去东方财富看走势图
async function goToEastMoney() {
    let market;
    let url;
    if(timeImageCode.startsWith('sh') || timeImageCode.startsWith('SH')){
        market = "1";
        let code = timeImageCode.substring(2, timeImageCode.length);
        url = Env.GO_TO_EASTMONEY_1_URL + "?code=" + code + "&market=" + market;
    } else if(timeImageCode.startsWith('sz') || timeImageCode.startsWith('SZ') || timeImageCode.startsWith('bj') || timeImageCode.startsWith('BJ')) {
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

// 去东方财富查看股票详情
async function goToEastMoneyDetail() {
    let url;
    if(timeImageCode.startsWith('sh') || timeImageCode.startsWith('SH')){
        let code = timeImageCode;
        url = Env.GO_TO_EASTMONEY_2_URL + "/" + code + ".html";
    } else if(timeImageCode.startsWith('sz') || timeImageCode.startsWith('SZ') || timeImageCode.startsWith('bj') || timeImageCode.startsWith('BJ')) {
        let code = timeImageCode;
        url = Env.GO_TO_EASTMONEY_2_URL + "/" + code + ".html";
    } else if(timeImageCode.startsWith('hk') || timeImageCode.startsWith('HK')) {
        let code = timeImageCode.substring(2, timeImageCode.length);
        url = Env.GO_TO_EASTMONEY_2_URL + "/hk/" + code + ".html"; 
    } else if(timeImageCode.startsWith('us') || timeImageCode.startsWith('US')) {
        let code = timeImageCode.substring(2, timeImageCode.length).replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','')
        url = Env.GO_TO_EASTMONEY_2_URL + "/us/" + code + ".html"; 
    }
    chrome.tabs.create({ url: url });
}

// 去天天基金查看股票详情
async function goToTiantianjijinDetail() {
    let url = Env.GO_TO_TIANTIANJIJIN_URL + "/" + timeImageCode + ".html";
    chrome.tabs.create({ url: url });
}

// 去同花顺F10查看股票详情
async function goToTonghushunF10Detail() {
    let url = Env.GO_TO_TONGHUASHUN_F10 + "/" + timeImageCode.replace('sh','').replace('SH','').replace('sz','').replace('SZ','').replace('bj','').replace('BJ','') + "/";
    chrome.tabs.create({ url: url });
}

// 去股吧查看股票详情
async function goToGubaDetail() {
    let url = Env.GO_TO_GUBA + timeImageCode.replace('sh','').replace('SH','').replace('sz','').replace('SZ','').replace('bj','').replace('BJ','') + ".html";
    chrome.tabs.create({ url: url });
}

// 去同花顺F10查看股票详情
async function goToWencaiDetail() {
    let url = Env.GO_TO_WENCAI + timeImageCode.replace('sh','').replace('SH','').replace('sz','').replace('SZ','').replace('bj','').replace('BJ','');
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
    } else if(code.startsWith('sz') || code.startsWith('SZ') || code.startsWith('bj') || code.startsWith('BJ')) {
        secid = '0';
    } else if(code.startsWith('hk') || code.startsWith('HK')) {
        secid = '116';
        if (code == 'hkHSI') {
            secid = '100';
        } else if(code == 'hkHSTECH') {
            secid = '124';
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
                    } else if (stock.code.endsWith('.ps') || stock.code.endsWith('.PS')) {
                        secid = '153';
                    } else if (stock.code.endsWith('.am') || stock.code.endsWith('.AM')) {
                        secid = '107';
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
            } else if(code === 'USDCNH') {
                secid = '133';
            } 
        } catch (error) {
            console.warn(error);
            secid = '106';
        }
    } else if(code.startsWith('9')) {
        secid = '2';
    } else {
        secid = '0';
        if(code == 'N225' || code == 'KS11' || code =='FTSE' || code == 'GDAXI' || code =='FCHI' || code == 'SENSEX' || code == 'TWII' || code == 'HSI' || code == 'VNINDEX' || code == 'N100' || code == 'N300' || code == 'N500' || code == 'N1000' || code == 'N2000' || code == 'N3000' || code == 'N5000'){
            secid = '100';
        } else if(code == 'HSTECH'){
            secid = '124';
        } else if(code == 'CN00Y'){
            secid = '104';
        } else if(code == 'BK1158'){
            secid = '90';
        } else if(code == 'GC00Y'){
            secid = '101';
        } else if(code == 'UDI'){
            secid = '100';
        } else if(code == 'CL00Y'){
            secid = '102';
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
    } else if (columnId == 'belong-group-th' && belongGroupDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'up-speed-th' && upSpeedDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'max-th' && maxDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'min-th' && minDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'star-desc-th' && starDescDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'star-th' && starDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'zjl-th' && zjlDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'change-th' && changeDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'amplitude-th' && amplitudeDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'cost-price-th' && costPriceDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'turn-over-rate-th' && turnOverRateDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'quantity-relative-ratio-th' && quantityRelativeRatioDisplay != 'DISPLAY') {
        html = "";
    } else if (columnId == 'price-th' && priceDisplay != 'DISPLAY') {
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
        if (columnName == 'name-th' || columnName == 'change-percent-th' || columnName == 'mini-image-th') {
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
            saveColumnOrder();
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
    if (belongGroupDisplay == null || belongGroupDisplay == 'DISPLAY') {
        belongGroupDisplay = 'DISPLAY';
        $("#belong-group-display-checkbox").prop("checked", true);
    } else {
        belongGroupDisplay = 'HIDDEN';
        $("#belong-group-display-checkbox").prop("checked", false);
    }
    if (upSpeedDisplay == null || upSpeedDisplay == 'DISPLAY') {
        upSpeedDisplay = 'DISPLAY';
        $("#up-speed-display-checkbox").prop("checked", true);
    } else {
        upSpeedDisplay = 'HIDDEN';
        $("#up-speed-display-checkbox").prop("checked", false);
    }
    if (maxDisplay == null || maxDisplay == 'DISPLAY') {
        maxDisplay = 'DISPLAY';
        $("#max-display-checkbox").prop("checked", true);
    } else {
        maxDisplay = 'HIDDEN';
        $("#max-display-checkbox").prop("checked", false);
    }
    if (minDisplay == null || minDisplay == 'DISPLAY') {
        minDisplay = 'DISPLAY';
        $("#min-display-checkbox").prop("checked", true);
    } else {
        minDisplay = 'HIDDEN';
        $("#min-display-checkbox").prop("checked", false);
    }
    if (starDescDisplay == null || starDescDisplay == 'HIDDEN') {
        starDescDisplay = 'HIDDEN';
        $("#star-desc-display-checkbox").prop("checked", false);
    } else {
        starDescDisplay = 'DISPLAY';
        $("#star-desc-display-checkbox").prop("checked", true);
    }
    if (starDisplay == null || starDisplay == 'HIDDEN') {
        starDisplay = 'HIDDEN';
        $("#star-display-checkbox").prop("checked", false);
    } else {
        starDisplay = 'DISPLAY';
        $("#star-display-checkbox").prop("checked", true);
    }
    if (zjlDisplay == null || zjlDisplay == 'HIDDEN') {
        zjlDisplay = 'HIDDEN';
        $("#zjl-display-checkbox").prop("checked", false);
    } else {
        zjlDisplay = 'DISPLAY';
        $("#zjl-display-checkbox").prop("checked", true);
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
    if (amplitudeDisplay == null || amplitudeDisplay == 'HIDDEN') {
        amplitudeDisplay = 'HIDDEN';
        $("#amplitude-display-checkbox").prop("checked", false);
    } else {
        amplitudeDisplay = 'DISPLAY';
        $("#amplitude-display-checkbox").prop("checked", true);
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
    if (quantityRelativeRatioDisplay == null || quantityRelativeRatioDisplay == 'HIDDEN') {
        quantityRelativeRatioDisplay = 'HIDDEN';
        $("#quantity-relative-ratio-display-checkbox").prop("checked", false);
    } else {
        quantityRelativeRatioDisplay = 'DISPLAY';
        $("#quantity-relative-ratio-display-checkbox").prop("checked", true);
    }
    if (priceDisplay == null || priceDisplay == 'HIDDEN') {
        priceDisplay = 'HIDDEN';
        $("#price-display-checkbox").prop("checked", false);
    } else {
        priceDisplay = 'DISPLAY';
        $("#price-display-checkbox").prop("checked", true);
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
    // 设置页面，隐藏/展示页面展示项，所属分组
    document.getElementById("belong-group-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，当前价格
    document.getElementById("price-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，涨速
    document.getElementById("up-speed-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，最高价
    document.getElementById("max-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，最低价
    document.getElementById("min-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，成本价/持仓成本单价
    document.getElementById("cost-price-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，持仓/持有份额
    document.getElementById("bonds-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，收益
    document.getElementById("income-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，涨跌
    document.getElementById("change-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，振幅
    document.getElementById("amplitude-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，更新时间
    document.getElementById("update-time-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，换手率
    document.getElementById("turn-over-rate-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，量比
    document.getElementById("quantity-relative-ratio-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，备注
    document.getElementById("star-desc-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，星级
    document.getElementById("star-display-checkbox").addEventListener('change', setDisplayTr);
    // 设置页面，隐藏/展示页面展示项，折价率
    document.getElementById("zjl-display-checkbox").addEventListener('change', setDisplayTr);
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
        {"mini-image-th": 0},
        {"belong-group-th": 0},
        {"day-income-th": 0},
        {"change-percent-th": 0},
        {"amplitude-th": 0},
        {"turn-over-rate-th": 0},
        {"quantity-relative-ratio-th": 0},
        {"change-th": 0},
        {"price-th": 0},
        {"zjl-th": 0},
        {"cost-price-th": 0},
        {"up-speed-th": 0},
        {"max-th": 0},
        {"min-th": 0},
        {"bonds-th": 0},
        {"market-value-th": 0},
        {"market-value-percent-th": 0},
        {"cost-price-value-th": 0},
        {"income-percent-th": 0},
        {"income-th": 0},
        {"update-time-th": 0},
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
    // $("#setting-modal").modal("hide");
    reloadDataAndHtml();
}

// 修改角标显示监控实时价格/涨跌幅
async function changeMonitorPriceOrPercent(event) {
    let targetId = event.target.id;
    if (targetId == 'monitor-price-change-button') {
        monitorPriceOrPercent = 'PRICE';
    } else if (targetId == 'monitor-percent-change-button') {
        monitorPriceOrPercent = 'PERCENT';
    } else if (targetId == 'monitor-day-income-change-button') {
        monitorPriceOrPercent = 'DAY_INCOME';
    } else {
        monitorPriceOrPercent = 'DAY_INCOME_PERCENT';
    }
    saveCacheData('monitor-price-or-percent', monitorPriceOrPercent);
    $("#setting-modal").modal("hide");
    reloadDataAndHtml();
    settingButtonInit();
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
    settingButtonInit();
}

// 修改鼠标悬停扩展程序图标，展示/不展示前5只股票
async function changeMonitorShowMore(event) {
    let targetId = event.target.id;
    if (targetId == 'monitor-show-more-button') {
        monitorShowMore = true;
    } else {
        monitorShowMore = false;
    }
    saveCacheData('monitor-show-more', monitorShowMore);
    $("#setting-modal").modal("hide");
    settingButtonInit();
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
    settingButtonInit();
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
            case 'hkHSTECH':
                name = '恒生科技指数'
                break;
            case 'CN00Y':
                name = 'A50期指'
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
            case 'TWII':
                name = '台湾加权指数';
                break;
            case 'VNINDEX':
                name = '越南胡志明指数';
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
            case 'BK1158':
                name = '微盘股';
                break;
            case 'GC00Y':
                name = 'COMEX黄金';
                break;
            case 'USDCNH':
                name = '美元离岸人民币';
                break;
            case 'UDI':
                name = '美元指数';
                break;
            case 'CL00Y':
                name = 'NYMEX原油';
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
    addLargeMarketCheckEvent();
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
        listItem.className = 'advice-list-li';
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
    displayBankuaiMoney("none");
    $("#day-income-history-head").html("");
    $("#day-income-history-nr").html("");
    $("#data-center-content").html("");
    // $("#day-income-history-modal").modal();
    // $("#data-center-modal").modal('hide');
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
    let elementId = 'data-center-chart';
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    var series = [
        {
            data: dataStockStr,
            type: 'bar',
            stack: 'a',
            name: '股票盈利',
        },
        {
            data: dataFundStr,
            type: 'bar',
            stack: 'a',
            name: '基金盈利',
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
        title: {
            text: '每日盈利（点击数据弹出提示：确认是否删除？）', // 设置整个图表的标题
            left: 'center', // 标题水平居中
            top: 0 // 标题距离图表顶部的距离
        },
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
    settingButtonInit();
}

// 切换/隐藏MA5/MA10/MA20/MA30/MA50/MA250
async function changeKlineDisplay(event) {
    let targetId = event.target.id;
    if (targetId == 'kline-ma5-display-checkbox') {
        if (event.target.checked) {
            klineMA5Display = true;
        } else {
            klineMA5Display = false;
        }
        saveCacheData('kline-ma5-display', klineMA5Display);
    } else if (targetId == 'kline-ma10-display-checkbox') {
        if (event.target.checked) {
            klineMA10Display = true;
        } else {
            klineMA10Display = false;
        }
        saveCacheData('kline-ma10-display', klineMA10Display);
    } else if (targetId == 'kline-ma20-display-checkbox') {
        if (event.target.checked) {
            klineMA20Display = true;
        } else {
            klineMA20Display = false;
        }
        saveCacheData('kline-ma20-display', klineMA20Display);
    } else if (targetId == 'kline-ma30-display-checkbox') {
        if (event.target.checked) {
            klineMA30Display = true;
        } else {
            klineMA30Display = false;
        }
        saveCacheData('kline-ma30-display', klineMA30Display);
    } else if (targetId == 'kline-ma50-display-checkbox') {
        if (event.target.checked) {
            klineMA50Display = true;
        } else {
            klineMA50Display = false;
        }
        saveCacheData('kline-ma50-display', klineMA50Display);
    } else if (targetId == 'kline-ma250-display-checkbox') {
        if (event.target.checked) {
            klineMA250Display = true;
        } else {
            klineMA250Display = false;
        }
        saveCacheData('kline-ma250-display', klineMA250Display);
    } else {
        const maType = targetId.split('-')[1];
        klineMAListDisplay.filter(item => {
            if(item.ma == maType.toUpperCase()) {
                item.display = event.target.checked;
            }
        });
        saveCacheData('kline-' + maType + '-display', event.target.checked);
    }
    // $("#setting-modal").modal('hide');
    reloadDataAndHtml();
    initLargeMarketData();
    settingButtonInit();
}

// 切换/隐藏大盘涨跌值
async function changeLargeMarketCountDisplay(event) {
    let targetId = event.target.id;
    if (targetId == 'larget-market-count-display-change-button') {
        largetMarketCountDisplay = true;
    } else {
        largetMarketCountDisplay = false;
    }
    saveCacheData('larget-market-count-display', largetMarketCountDisplay);
    $("#setting-modal").modal('hide');
    reloadDataAndHtml();
    initLargeMarketData();
    settingButtonInit();
}

// 切换/隐藏名字后显示沪/京/深/科创板/创业板
async function changeBanKuaiDisplay(event) {
    let targetId = event.target.id;
    if (targetId == 'bankuai-display-change-button') {
        banKuaiDisplay = true;
    } else {
        banKuaiDisplay = false;
    }
    saveCacheData('bankuai-display', banKuaiDisplay);
    $("#setting-modal").modal('hide');
    reloadDataAndHtml();
    settingButtonInit();
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
        // return dateTime.replaceAll('/', '-');
        return dateTime.replace(/\//g, '-');
        
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
    if (currentGroup == 'all-group') {
        document.getElementById("group-menu-button").innerHTML = '全部分组';
    } else {
        document.getElementById("group-menu-button").innerHTML = groups[currentGroup];
    }
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
            fundList.forEach(item => {
                item.belongGroup = currentGroup;
            })
        }
        var stocks = await readCacheData('stocks');
        if (stocks == null || stocks == 'null') {
            stockList = [];
        } else {
            stockList = jQuery.parseJSON(stocks);
            stockList.forEach(item => {
                item.belongGroup = currentGroup;
            })
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
                fundList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
            }
            var stocks = await readCacheData(currentGroup + '_stocks');
            if (stocks == null || stocks == 'null') {
                stockList = [];
            } else {
                stockList = jQuery.parseJSON(stocks);
                stockList.forEach(item => {
                    item.belongGroup = currentGroup;
                })
            }
        }
    }
    $("#group-modal").modal('hide');
    reloadDataAndHtml();
    initGroupButton();
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
    displayBankuaiMoney("none");
    $("#day-income-history-head").html("");
    $("#day-income-history-nr").html("");
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
            text: upDownCountsDate + ' 涨跌分布（不包含ST股）', // 设置整个图表的标题
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
    // } else if (targetId == 'main-page-refresh-time-3s-button') {
    //     mainPageRefreshTime = 3000;
    } else if (targetId == 'main-page-refresh-time-dont-button') {
        mainPageRefreshTime = 1000000000;
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

// 设置页面按钮组展示是否生效的样式
async function settingButtonInit(){
    if (windowSize == 'NORMAL') {
        document.getElementById('window-normal-size-change-button').classList.add('active');
        document.getElementById('window-small-size-change-button').classList.remove('active');
        document.getElementById('window-mini-size-change-button').classList.remove('active');
    } else if (windowSize == 'SMALL') {
        document.getElementById('window-normal-size-change-button').classList.remove('active');
        document.getElementById('window-small-size-change-button').classList.add('active');
        document.getElementById('window-mini-size-change-button').classList.remove('active');
    } else {
        document.getElementById('window-normal-size-change-button').classList.remove('active');
        document.getElementById('window-small-size-change-button').classList.remove('active');
        document.getElementById('window-mini-size-change-button').classList.add('active');
    }
    let sendChromeNoticeEnable = await readCacheData('send-chrome-notice-enable');
    if (sendChromeNoticeEnable == 'true' || sendChromeNoticeEnable == true) {
        document.getElementById('send-chrome-notice-disable-button').classList.remove('active');
        document.getElementById('send-chrome-notice-enable-button').classList.add('active');
    } else {
        document.getElementById('send-chrome-notice-disable-button').classList.add('active');
        document.getElementById('send-chrome-notice-enable-button').classList.remove('active');
    }
    if (huilvConvert) {
        document.getElementById('huilv-convert-change-button').classList.add('active');
        document.getElementById('huilv-dont-convert-change-button').classList.remove('active');
    } else {
        document.getElementById('huilv-convert-change-button').classList.remove('active');
        document.getElementById('huilv-dont-convert-change-button').classList.add('active');
    }
    if (monitorPriceOrPercent == 'PRICE') {
        document.getElementById('monitor-price-change-button').classList.add('active');
        document.getElementById('monitor-percent-change-button').classList.remove('active');
        document.getElementById('monitor-day-income-change-button').classList.remove('active');
        document.getElementById('monitor-day-income-percent-change-button').classList.remove('active');
    } else if(monitorPriceOrPercent == 'PERCENT') {
        document.getElementById('monitor-price-change-button').classList.remove('active');
        document.getElementById('monitor-percent-change-button').classList.add('active');
        document.getElementById('monitor-day-income-change-button').classList.remove('active');
        document.getElementById('monitor-day-income-percent-change-button').classList.remove('active');
    } else if(monitorPriceOrPercent == 'DAY_INCOME') {
        document.getElementById('monitor-price-change-button').classList.remove('active');
        document.getElementById('monitor-percent-change-button').classList.remove('active');
        document.getElementById('monitor-day-income-change-button').classList.add('active');
        document.getElementById('monitor-day-income-percent-change-button').classList.remove('active');
    } else {
        document.getElementById('monitor-price-change-button').classList.remove('active');
        document.getElementById('monitor-percent-change-button').classList.remove('active');
        document.getElementById('monitor-day-income-change-button').classList.remove('active');
        document.getElementById('monitor-day-income-percent-change-button').classList.add('active');
    }
    if (monitorTop20Stock) {
        document.getElementById('monitor-dont-top-20-stock-change-button').classList.remove('active');
        document.getElementById('monitor-top-20-stock-change-button').classList.add('active');
    } else {
        document.getElementById('monitor-dont-top-20-stock-change-button').classList.add('active');
        document.getElementById('monitor-top-20-stock-change-button').classList.remove('active');
    }
    if (monitorShowMore) {
        document.getElementById('monitor-show-more-button').classList.add('active');
        document.getElementById('monitor-dont-show-more-button').classList.remove('active');
    } else {
        document.getElementById('monitor-show-more-button').classList.remove('active');
        document.getElementById('monitor-dont-show-more-button').classList.add('active');
    }
    if (largetMarketTotalDisplay) {
        document.getElementById('larget-market-total-dont-display-change-button').classList.remove('active');
        document.getElementById('larget-market-total-display-change-button').classList.add('active');
    } else {
        document.getElementById('larget-market-total-dont-display-change-button').classList.add('active');
        document.getElementById('larget-market-total-display-change-button').classList.remove('active');
    }
    if (largetMarketCountDisplay) {
        document.getElementById('larget-market-count-dont-display-change-button').classList.remove('active');
        document.getElementById('larget-market-count-display-change-button').classList.add('active');
    } else {
        document.getElementById('larget-market-count-dont-display-change-button').classList.add('active');
        document.getElementById('larget-market-count-display-change-button').classList.remove('active');
    }
    if (banKuaiDisplay) {
        document.getElementById('bankuai-dont-display-change-button').classList.remove('active');
        document.getElementById('bankuai-display-change-button').classList.add('active');
    } else {
        document.getElementById('bankuai-dont-display-change-button').classList.add('active');
        document.getElementById('bankuai-display-change-button').classList.remove('active');
    }
    if (defaultIcon) {
        document.getElementById('change-icon-default-button').classList.add('active');
        document.getElementById('change-icon-hidden-button').classList.remove('active');
    } else {
        document.getElementById('change-icon-default-button').classList.remove('active');
        document.getElementById('change-icon-hidden-button').classList.add('active');
    }
    if (mainPageRefreshTime == 20000) {
        document.getElementById('main-page-refresh-time-20s-button').classList.add('active');
        document.getElementById('main-page-refresh-time-10s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-5s-button').classList.remove('active');
        // document.getElementById('main-page-refresh-time-3s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-dont-button').classList.remove('active');
    } else if(mainPageRefreshTime == 10000) {
        document.getElementById('main-page-refresh-time-20s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-10s-button').classList.add('active');
        document.getElementById('main-page-refresh-time-5s-button').classList.remove('active');
        // document.getElementById('main-page-refresh-time-3s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-dont-button').classList.remove('active');
    }  else if(mainPageRefreshTime == 5000) {
        document.getElementById('main-page-refresh-time-20s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-10s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-5s-button').classList.add('active');
        // document.getElementById('main-page-refresh-time-3s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-dont-button').classList.remove('active');
    } else if(mainPageRefreshTime == 3000) {
        document.getElementById('main-page-refresh-time-20s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-10s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-5s-button').classList.remove('active');
        // document.getElementById('main-page-refresh-time-3s-button').classList.add('active');
        document.getElementById('main-page-refresh-time-dont-button').classList.remove('active');
    } else {
        document.getElementById('main-page-refresh-time-20s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-10s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-5s-button').classList.remove('active');
        // document.getElementById('main-page-refresh-time-3s-button').classList.remove('active');
        document.getElementById('main-page-refresh-time-dont-button').classList.add('active');
    }
    if (stockApi == 'GTIMG') {
        document.getElementById('stock-api-gtimg-button').classList.add('active');
        document.getElementById('stock-api-eastmoney-button').classList.remove('active');
    } else {
        document.getElementById('stock-api-gtimg-button').classList.remove('active');
        document.getElementById('stock-api-eastmoney-button').classList.add('active');
    }
    let showMinuteImageMini = await readCacheData('show-minute-image-mini');
    if (showMinuteImageMini == 'open') {
        document.getElementById('show-minute-image-mini').classList.add('active');
        document.getElementById('hide-minute-image-mini').classList.remove('active');
    } else {
        document.getElementById('show-minute-image-mini').classList.remove('active');
        document.getElementById('hide-minute-image-mini').classList.add('active');
    }
    let fontChangeStyle = await readCacheData('font-change-style');
    if (fontChangeStyle == null || fontChangeStyle == undefined || fontChangeStyle == '' || fontChangeStyle == 'normal') {
        document.getElementById('font-change-button').classList.add('active');
        document.getElementById('bolder-font-change-button').classList.remove('active');
    } else {
        document.getElementById('font-change-button').classList.remove('active');
        document.getElementById('bolder-font-change-button').classList.add('active');
    }
    if (cheatMeFlag) {
        document.getElementById('cheat-me-button').classList.add('active');
        document.getElementById('disable-cheat-me-button').classList.remove('active');
    } else {
        document.getElementById('cheat-me-button').classList.remove('active');
        document.getElementById('disable-cheat-me-button').classList.add('active');
    }
    if (mainDeleteButtonDisplay) {
        document.getElementById('main-delete-button-display-change-button').classList.add('active');
        document.getElementById('main-delete-button-dont-display-change-button').classList.remove('active');
    } else {
        document.getElementById('main-delete-button-display-change-button').classList.remove('active');
        document.getElementById('main-delete-button-dont-display-change-button').classList.add('active');
    }
    if (trendImageType == 'MINUTE') {
        document.getElementById('trend-image-type-minute-button').classList.add('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == '5DAY') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.add('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == 'DAY') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.add('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == 'WEEK') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.add('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == 'MONTH') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.add('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == '1MIN') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.add('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == '5MIN') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.add('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == '15MIN') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.add('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == '30MIN') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.add('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == '60MIN') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.add('active');
        document.getElementById('trend-image-type-120min-button').classList.remove('active');
    } else if (trendImageType == '120MIN') {
        document.getElementById('trend-image-type-minute-button').classList.remove('active');
        document.getElementById('trend-image-type-minute-5day-button').classList.remove('active');
        document.getElementById('trend-image-type-day-button').classList.remove('active');
        document.getElementById('trend-image-type-week-button').classList.remove('active');
        document.getElementById('trend-image-type-month-button').classList.remove('active');
        document.getElementById('trend-image-type-1min-button').classList.remove('active');
        document.getElementById('trend-image-type-5min-button').classList.remove('active');
        document.getElementById('trend-image-type-15min-button').classList.remove('active');
        document.getElementById('trend-image-type-30min-button').classList.remove('active');
        document.getElementById('trend-image-type-60min-button').classList.remove('active');
        document.getElementById('trend-image-type-120min-button').classList.add('active');
    }
    if (autoSync) {
        document.getElementById('close-auto-sync-button').classList.remove('active');
        document.getElementById('open-auto-sync-button').classList.add('active');
    } else {
        document.getElementById('close-auto-sync-button').classList.add('active');
        document.getElementById('open-auto-sync-button').classList.remove('active');
    }
    if (showBatchDeleteButton) {
        $("#batch-delete-button")[0].style.display = 'block';
        document.getElementById('batch-delete-button-dont-display-change-button').classList.remove('active');
        document.getElementById('batch-delete-button-display-change-button').classList.add('active');
    } else {
        $("#batch-delete-button")[0].style.display = 'none';
        document.getElementById('batch-delete-button-dont-display-change-button').classList.add('active');
        document.getElementById('batch-delete-button-display-change-button').classList.remove('active');
    }
    if (addtimePriceNewline) {
        document.getElementById('close-addtime-price-newline-button').classList.remove('active');
        document.getElementById('open-addtime-price-newline-button').classList.add('active');
    } else {
        document.getElementById('close-addtime-price-newline-button').classList.add('active');
        document.getElementById('open-addtime-price-newline-button').classList.remove('active');
    }
}

// 设置全部/股票/基金按钮激活显示状态
async function initStockOrFundOrAllButton() {
    if (showStockOrFundOrAll == 'all') {
        document.getElementById('show-all-button').classList.add('active');
        document.getElementById('show-stock-button').classList.remove('active');
        document.getElementById('show-fund-button').classList.remove('active');
    } else if (showStockOrFundOrAll == 'stock') {
        document.getElementById('show-all-button').classList.remove('active');
        document.getElementById('show-stock-button').classList.add('active');
        document.getElementById('show-fund-button').classList.remove('active');
    } else if (showStockOrFundOrAll == 'fund') {
        document.getElementById('show-all-button').classList.remove('active');
        document.getElementById('show-stock-button').classList.remove('active');
        document.getElementById('show-fund-button').classList.add('active');
    }
}

async function changeTrendImageType(event) {
    let targetId = event.target.id;
    if (targetId == 'trend-image-type-minute-button') {
        trendImageType = 'MINUTE';
    } else if (targetId == 'trend-image-type-minute-5day-button') {
        trendImageType = '5DAY';
    } else if (targetId == 'trend-image-type-day-button') {
        trendImageType = 'DAY';
    } else if (targetId == 'trend-image-type-week-button') {
        trendImageType = 'WEEK';
    } else if (targetId == 'trend-image-type-month-button') {
        trendImageType = 'MONTH';
    } else if (targetId == 'trend-image-type-1min-button') {
        trendImageType = '1MIN';
    } else if (targetId == 'trend-image-type-5min-button') {
        trendImageType = '5MIN';
    } else if (targetId == 'trend-image-type-15min-button') {
        trendImageType = '15MIN';
    } else if (targetId == 'trend-image-type-30min-button') {
        trendImageType = '30MIN';
    } else if (targetId == 'trend-image-type-60min-button') {
        trendImageType = '60MIN';
    } else if (targetId == 'trend-image-type-120min-button') {
        trendImageType = '120MIN';
    }
    saveCacheData('trend-image-type', trendImageType);
    settingButtonInit();
}

// 展示各种二维码页面
async function showQrCodeModal (event) {
    let targetId = event.target.id;
    if (targetId == 'show-wechat-group-button') {
        $("#qr-code-modal-title").html('扫码加入微信群');
        $("#qr-code-modal-content").html('您使用中的各种问题或者错误进群联系我帮您解决，提出您的需求，如果合理我会尽快实现～');
        let timestamp = Date.now();
        let path = Env.WECHAT_GROUP_QR_CODE + "?date=" + timestamp;
        $("#qr-code-image").html('<img src="' + path + '" width="60%" length="60%" />');
        $("#wechat-pay-button")[0].style.display = 'none';
        $("#ali-pay-button")[0].style.display = 'none';
    } else if (targetId == 'show-wechat-mini-button') {
        $("#qr-code-modal-title").html('扫码进入微信小程序');
        $("#qr-code-modal-content").html('首次扫描二维码会进入股票基金神器页面，之后可以在小程序列表中的“编程面试题”进入首页，底部“股票基金神器”链接进入～');
        $("#qr-code-image").html('<img src="/img/wechat-mini-qr-code.jpg" width="60%" length="60%" />');
        $("#wechat-pay-button")[0].style.display = 'none';
        $("#ali-pay-button")[0].style.display = 'none';
    } else if (targetId == 'ali-pay-button') {
        path = Env.ALI_PAY_QR_CODE;
        $("#qr-code-modal-title").html('打赏');
        $("#qr-code-modal-content").html('如果您觉得我的插件对您在股市的探索有帮助，您可以支付宝扫一扫打赏或者到插件市场给我五星好评～');
        $("#qr-code-image").html('<img src="' + path + '" width="60%" length="60%" />');
        $("#wechat-pay-button")[0].style.display = 'inline';
        $("#ali-pay-button")[0].style.display = 'inline';
    } else if (targetId == 'wechat-pay-button' || targetId == 'show-donate-button' || targetId == 'show-donate-button-2') {
        path = Env.WECHAT_PAY_QR_CODE;
        $("#qr-code-modal-title").html('打赏');
        $("#qr-code-modal-content").html('如果您觉得我的插件对您在股市的探索有帮助，您可以微信扫一扫打赏或者到插件市场给我五星好评～');
        $("#qr-code-image").html('<img src="' + path + '" width="60%" length="60%" />');
        $("#wechat-pay-button")[0].style.display = 'inline';
        $("#ali-pay-button")[0].style.display = 'inline';
    }
    $("#qr-code-modal").modal();
}

async function initKlineCheckbox() {
    const klineMATable = document.getElementById('kline-ma-table');
    let innerHTML = '';
    // 遍历klineMAList数组并生成<input>元素
    klineMAList.forEach(ma => {
        innerHTML += `<input type="checkbox" value="" id="kline-${ma.toLowerCase()}-display-checkbox">${ma}展示/隐藏`;
    });
    klineMATable.innerHTML = innerHTML;
    klineMAList.forEach(ma => {
        let klineDisplay = false;
        for(item of klineMAListDisplay){
            if(item.ma == ma) {
                klineDisplay = item.display;
                break;
            }
        }
        document.getElementById(`kline-${ma.toLowerCase()}-display-checkbox`).addEventListener('change', changeKlineDisplay);
        $("#kline-" + ma.toLowerCase() + "-display-checkbox").prop("checked", klineDisplay);
    });
}

async function showKlineMA() {
    let klineMATextCache = await readCacheData('kline-ma-list');
    let klineMAText;
    if (klineMATextCache == null || klineMATextCache == '' || klineMATextCache == undefined || klineMATextCache == 'undefined') {
        klineMAText = '[]';
    } else {
        klineMAText = JSON.stringify(klineMATextCache);
    }
    $("#kline-ma-text").val(klineMAText);
    $("#kline-ma-modal").modal();
}

async function saveKlineMa() {
    try {
        let klineMAText = $("#kline-ma-text").val();
        klineMAList = JSON.parse(klineMAText.replace(/'/g, '"'));
        saveCacheData('kline-ma-list', klineMAList);
    } catch(error) {
        console.error('保存MA线', error);
        klineMAList = [];
        saveCacheData('kline-ma-list', klineMAList);
    }
    klineMAListDisplay = [];
    for (const ma of klineMAList) {
        let klineMADisplay = await readCacheData('kline-' + ma.toLowerCase() + '-display');
        if (klineMADisplay == null || klineMADisplay == false || klineMADisplay == "false") {
            klineMADisplay = false;
        } else {
            klineMADisplay = true;
        }
        klineMAListDisplay.push({
            ma: ma,
            display: klineMADisplay
        });
    }
    initKlineCheckbox();
    $("#kline-ma-modal").modal("hide");
    $("#setting-modal").modal("hide");
}

async function changeMainDeleteButton (event) {
    let targetId = event.target.id;
    if (targetId == 'main-delete-button-dont-display-change-button') {
        mainDeleteButtonDisplay = false;
    } else {
        mainDeleteButtonDisplay = true;
    }
    saveCacheData('main-delete-button-display', mainDeleteButtonDisplay);
    settingButtonInit();
    reloadDataAndHtml();
}

async function changeAutoSync(event) {
    let targetId = event.target.id;
    if (targetId == 'close-auto-sync-button') {
        autoSync = false;
    } else {
        autoSync = true;
    }
    saveCacheData('auto-sync', autoSync);
    settingButtonInit();
}

// 点击保存密码
async function savePassword() {
    saveCacheData('password', $("#password").val());
    $("#password-protect-modal").modal("hide");
}

// 点击验证密码
async function checkPassword() {
    if ($("#password-check").val() == await readCacheData('password')) {
        $("#password-check-modal").modal("hide");
        initLoad();
    }
}

// 点击隐藏使用说明
async function changeShowHelpButton() {
    showHelpButton = false;
    saveCacheData('show-help-button', showHelpButton);
}

async function batchDelete() {
    if (currentGroup == 'all-group') {
        alertMessage('全部分组时无法批量删除，请切换到指定分组后再批量删除～');
        return;
    }
    // 使用 jQuery 选择所有选中的复选框
    let checkboxesStock = $('input#batch-delete-stock-checkbox:checked');
    // 提取选中的值
    let selectedDataStock = checkboxesStock.map(function() {
        return this.value;
    }).get();

    // 使用 jQuery 选择所有选中的复选框
    let checkboxesFund = $('input#batch-delete-fund-checkbox:checked');
    // 提取选中的值
    let selectedDataFund = checkboxesFund.map(function() {
        return this.value;
    }).get();
    // 删除基金
    for (let k = fundList.length - 1; k >= 0; k--) {
        if (selectedDataFund.includes(fundList[k].fundCode)) {
            // delete funds[k];
            fundList.splice(k, 1)
        }
    }
    if (currentGroup == 'default-group') {
        saveCacheData('funds', JSON.stringify(fundList));
    } else {
        saveCacheData(currentGroup + '_funds', JSON.stringify(fundList));
    }
    // 删除基金
    for (let k = stockList.length - 1; k >= 0; k--) {
        if (selectedDataStock.includes(stockList[k].code)) {
            // delete funds[k];
            stockList.splice(k, 1)
        }
    }
    if (currentGroup == 'default-group') {
        saveCacheData('stocks', JSON.stringify(stockList));
    } else {
        saveCacheData(currentGroup + '_stocks', JSON.stringify(stockList));
    }
    reloadDataAndHtml();
}


async function changeBatchDeleteButton (event) {
    let targetId = event.target.id;
    if (targetId == 'batch-delete-button-dont-display-change-button') {
        showBatchDeleteButton = false;
    } else {
        showBatchDeleteButton = true;
    }
    saveCacheData('show-batch-delete-button', showBatchDeleteButton);
    settingButtonInit();
    reloadDataAndHtml();
}

async function saveKLineNumbers() {
    kLineNumbers = $("#k-line-numbers").val();
    if (kLineNumbers == '' || kLineNumbers == null || kLineNumbers == undefined) {
        kLineNumbers = 0;
    }
    saveCacheData('k-line-numbers', kLineNumbers);
}

async function changeAddtimePriceNewlineButton(event) {
    let targetId = event.target.id;
    if (targetId == 'close-addtime-price-newline-button') {
        addtimePriceNewline = false;
    } else {
        addtimePriceNewline = true;
    }
    saveCacheData('addtime-price-newline', addtimePriceNewline);
    $("#setting-modal").modal('hide');
    settingButtonInit();
    reloadDataAndHtml();
}

async function timeImagePreNext(event) {
    let targetId = event.target.id;
    if (targetId == 'time-image-pre-button') {
        // 遍历股票或者基金
        if(timeImageType == 'STOCK') {
            for (let i = stockList.length - 1; i >= 0; i--) {
                if (stockList[i].code == timeImageCode) {
                    if (i == 0) {
                        timeImageCode = stockList[stockList.length - 1].code;
                    } else {
                        timeImageCode = stockList[i - 1].code;
                    }
                    break;
                }
            }
        } else {
            for (let i = fundList.length - 1; i >= 0; i--) {
                if (fundList[i].fundCode == timeImageCode) {
                    if (i == 0) {
                        timeImageCode = fundList[fundList.length - 1].fundCode;
                    } else {
                        timeImageCode = fundList[i - 1].fundCode;
                    }
                    break;
                }
            }
        }
    } else if (targetId == 'time-image-next-button') {
        // 遍历股票或者基金
        if(timeImageType == 'STOCK') {
            for (let i = 0; i < stockList.length; i++) {
                if (stockList[i].code == timeImageCode) {
                    if (i == stockList.length - 1) {
                        timeImageCode = stockList[0].code;
                    } else {
                        timeImageCode = stockList[i + 1].code;
                    }
                    break;
                }
            }
        } else {
            for (let i = 0; i < fundList.length; i++) {
                if (fundList[i].fundCode == timeImageCode) {
                    if (i == fundList.length - 1) {
                        timeImageCode = fundList[0].fundCode;
                    } else {
                        timeImageCode = fundList[i + 1].fundCode;
                    }
                    break;
                }
            }
        }
    }
    if (trendImageType == 'MINUTE') {
        showMinuteImage('1DAY');
    } else if (trendImageType == '5DAY') {
        showMinuteImage('5DAY');
    } else if (trendImageType == 'DAY') {
        showDayImage();
    } else if (trendImageType == 'WEEK') {
        showWeekImage();
    } else if (trendImageType == 'MONTH') {
        showMonthImage();
    } else if (trendImageType == '1MIN') {
        show1or5or15or30or60MinutesImage('1MIN');
    } else if (trendImageType == '5MIN') {
        show1or5or15or30or60MinutesImage('5MIN');
    } else if (trendImageType == '15MIN') {
        show1or5or15or30or60MinutesImage('15MIN');
    } else if (trendImageType == '30MIN') {
        show1or5or15or30or60MinutesImage('30MIN');
    } else if (trendImageType == '60MIN') {
        show1or5or15or30or60MinutesImage('60MIN');
    } else if (trendImageType == '120MIN') {
        show1or5or15or30or60MinutesImage('120MIN');
    }
}

// 滚动到底部或顶部函数
function scrollToBottomOrTop() {
    const content = document.getElementById('my-div');
    const scrollTop = content.scrollTop; // 当前滚动距离
    const scrollHeight = content.scrollHeight; // 内容总高度
    const clientHeight = content.clientHeight; // 可见区域高度
    // 判断是否已经在底部
    if (scrollTop + clientHeight >= scrollHeight - 1) {
        // 滚动到顶部
        content.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动效果
        });
    } else {
        // 滚动到底部
        content.scrollTo({
            top: scrollHeight,
            behavior: 'smooth' // 平滑滚动效果
        });
    }
}

// 展示涨跌幅榜
async function showRiseFall() {
    ajaxGetStockListFromEastMoney();
}
// 展示涨跌幅榜
async function showRiseFallCallback(result) {
    var dayIncomeHistoryHead = " <tr id = 'rise-fall-head'>" +
        " <th >股票名称</th>" +
        " <th >最新</th>" +
        " <th >涨/跌幅（点击切换）</th>" +
        " <th >板块</th>" +
        " </tr>";
    $("#day-income-history-head").html(dayIncomeHistoryHead);
    let str = "";
    // 遍历 dayIncomeHistory 数组
    if (result != null && result != '' && result != undefined) {
        if (riseFallSort == 0) {
            for (let index = 0; index < result.length; index++) {
                // 对于数组中的每个项目，拼接一个表格行
                let item = result[index];
                let styleColor = parseFloat(item.f3 + "") >= 0 ? redColor : blueColor; // 根据涨跌幅决定颜色
                str += "<tr id='day-income-history-tr-" + index + "'>"
                    + "<td>" + item.f14 + "</td>"
                    + "<td><span style='color:" + styleColor + ";'>" + parseFloat(item.f2+'').toFixed(2) + "</span></td>"
                    + "<td><span style='color:" + styleColor + ";'>" + parseFloat(item.f3+'').toFixed(2) + "%</span></td>"
                    + "<td>" + item.f100 + "</td>"
                    + "</tr>";
            }
        } else {
            for (let index = result.length -1; index > 0; index--) {
                // 对于数组中的每个项目，拼接一个表格行
                let item = result[index];
                let styleColor = parseFloat(item.f3 + "") >= 0 ? redColor : blueColor; // 根据涨跌幅决定颜色
                str += "<tr id='day-income-history-tr-" + index + "'>"
                    + "<td>" + item.f14 + "</td>"
                    + "<td><span style='color:" + styleColor + ";'>" + parseFloat(item.f2+'').toFixed(2)  + "</span></td>"
                    + "<td><span style='color:" + styleColor + ";'>" + parseFloat(item.f3+'').toFixed(2) + "%</span></td>"
                    + "<td>" + item.f100 + "</td>"
                    + "</tr>";
            }
        }
    }
    $("#day-income-history-nr").html(str);
    // rise-fall-head点击事件，点击后倒叙
    $("#rise-fall-head").click(function () {
        if (riseFallSort == 0) {
            riseFallSort = 1;
            showRiseFallCallback(result);
        } else {
            riseFallSort = 0;
            showRiseFallCallback(result);
        }
    });
}

async function stockNameSearchPosition() {
    let stockNameSearchText = $("#stock-name-search-position").val();
    $("#stock-name-search-position").val('');
    const tableRows = document.querySelectorAll('#sortable-table tbody tr');
    // 遍历表格行
    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const fundName = row.querySelector('.stock-fund-name-and-code')?.textContent.trim();
        // 如果找到匹配的行
        if (fundName && fundName.includes(stockNameSearchText)) {
            // 滚动到匹配行
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 高亮匹配行
            row.classList.add('highlight');
            setTimeout(() => {
                row.classList.remove('highlight');
            }, 2000); // 2秒后移除高亮
            return; // 找到后停止搜索
        }
    }
}