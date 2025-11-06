let isCycleInvest = false;
let performTaskId;
let count = 0;
let isFirefox = false;
let lightBlue = [144, 238, 144, 255];
let lightRed = [255, 192, 203, 255];
// 检测是否为 Firefox
if (typeof browser !== "undefined" && typeof browser.runtime !== "undefined") {
    // Firefox 环境中，映射 chrome 到 browser
    chrome = browser;
    isFirefox = true;
}
// 定时执行任务的函数
function scheduleTask() {
    // 设置定时器，每隔一定时间执行 performTask 函数
    performTaskId = setInterval(performTask, 10000); // 10s，您可以根据需要进行调整
    changeDefaultIcon();
}

// 当扩展程序安装时触发的事件
chrome.runtime.onInstalled.addListener(async function() {
    // 设置定时器，每隔一定时间执行 performTask 函数
    performTaskId = setInterval(performTask, 10000); // 10s，您可以根据需要进行调整
    changeDefaultIcon();
 });
// 当浏览器打开时触发的事件
chrome.runtime.onStartup.addListener(async function() {
    // 设置定时器，每隔一定时间执行 performTask 函数
    performTaskId = setInterval(performTask, 10000); // 10s，您可以根据需要进行调整
    changeDefaultIcon();
});
// 在扩展程序的 background.js 文件中使用 chrome.runtime.onMessage 监听函数
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    try {
        // 在接收到消息时执行的操作
        console.log('收到消息:', message);
        if(message.message == "scheduleTask") {
            console.log('清理performTaskId:', performTaskId);
            clearInterval(performTaskId);
            scheduleTask();
            // 可选：发送响应消息给消息发送方
            sendResponse('已收到消息');
        } else if(message.action == 'sendTonghuashunXueqiuStockCodes') {
            let stockCodes = message.content;
            saveData("tonghuashun-xueqiu-stock", stockCodes);
        }
    } catch (error) {
        console.warn("chrome.runtime.onMessage error: ", error);
    }
});

chrome.runtime.setUninstallURL("https://zhuanlan.zhihu.com/p/688413206");

// 后台定时执行任务的函数
function performTask() {
    try {
        getData('MONITOR_STOCK_CODE').then((monitorStockCode) => {
            if (monitorStockCode != null && monitorStockCode != '') {
                monitorStock(monitorStockCode);
            }
        });
        getData('stocks').then((stockArr) => {
            if (stockArr != null && stockArr != "[]") {
                monitorStockPrice(JSON.parse(stockArr));
            } else {
                monitorStockPrice(JSON.parse("[]"));
            }
        });
        getData('funds').then((fundArr) => {
            // 去掉定投，增加监控基金净值
            // if (fundArr != null && fundArr != "[]") {
            //     monitorFundCycleInvest(JSON.parse(fundArr));
            // } else {
            //     monitorFundCycleInvest(JSON.parse("[]"));
            // }
            if (fundArr != null && fundArr != "[]") {
                monitorFundPrice(JSON.parse(fundArr));
            } else {
                monitorFundPrice(JSON.parse("[]"));
            }
        });
        getData('monitor-top-20-stock').then((monitoTop20Stock) => {
            if (count % 2 == 0) {
                if (monitoTop20Stock == null || monitoTop20Stock == undefined) {
                    monitoTop20Stock = false;
                }
                count = 0;
                monitorTop20StockChromeTitle(monitoTop20Stock);
            }
        });
        count++;
    } catch (error) {
        console.warn("performTask error: ", error);
    }
}
// 从 chrome 本地缓存获取数据
function getData(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}
// 向 chrome 本地缓存存储数据
function saveData(key, value) {
    chrome.storage.local.set({ [key]: value });
}
// 后台监控股票突破价格并提示
function monitorStockPrice(stockList) {
    var date = new Date();
    console.log("执行突破股票价格监控任务...", date.toLocaleString());
    if (isTradingTime(date)) {
        console.log("交易时间，执行任务...");
        var stocks = "";
        for (let k in stockList) {
            if (stockList[k].monitorAlert == '1' || stockList[k].monitorAlert == '2' 
                || stockList[k].monitorAlert == '3'|| stockList[k].monitorAlert == '4') {
                continue;
            }
            if ((typeof stockList[k].monitorLowPrice != 'undefined' && stockList[k].monitorHighPrice != '')
                || (typeof stockList[k].monitorLowPrice != 'undefined' && stockList[k].monitorLowPrice != '')
                || (typeof stockList[k].monitorUpperPercent != 'undefined' && stockList[k].monitorUpperPercent != '')
                || (typeof stockList[k].monitorLowerPercent != 'undefined' && stockList[k].monitorLowerPercent != '')
                || (typeof stockList[k].monitorMA20 != 'undefined' && stockList[k].monitorMA20 != '' && stockList[k].monitorMA20)) {
                stocks += getSecidBack(stockList[k].code) + '.' + stockList[k].code.replace('sh', '').replace('sz', '').replace('bj', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_') + ',';
            }
        }
        if (stocks == "") {
            console.log("没有监控的股票，返回...");
            return;
        }

        fetch("https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f12,f13,f19,f14,f139,f148,f124,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f88,f153&secids=" + stocks)
            .then(response => response.text())
            .then(repsonse => JSON.parse(repsonse))
            .then(response => {
                getData('blueColor').then((blueColor) => {
                    if (blueColor == null) {
                        blueColor = '#093';
                    }
                    getData('redColor').then((redColor) => {
                        if (redColor == null) {
                            redColor = '#ee2500';
                        }
                        if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色变淡，更隐蔽
                            blueColor = lightBlue;
                            redColor = lightRed;
                        }
                        // 在这里处理返回的数据
                        var stoksArr = response.data.diff;
                        for (let k in stoksArr) {
                            var monitorStock;
                            for (let l in stockList) {
                                if(stoksArr[k].f12 == stockList[l].code.replace('sh', '').replace('sz', '').replace('bj', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_')){
                                    monitorStock = stockList[l];
                                }
                            }
                            var name = stoksArr[k].f14 + "";
                            var now = parseFloat(stoksArr[k].f2 + "");
                            // 9点至9点15分，股票价格如果为0就取昨日收盘价格
                            if (now == 0) {
                                now = parseFloat(stoksArr[k].f18 + "");
                            }
                            if (typeof monitorStock.monitorHighPrice != 'undefined' && monitorStock.monitorHighPrice != '') {
                                var highPrice = parseFloat(monitorStock.monitorHighPrice);
                                if (now > highPrice) {
                                    monitorStock.monitorAlert = '1';
                                    monitorStock.monitorAlertDate = Date.now();
                                    sendChromeBadge('#FFFFFF', redColor, "" + now);
                                    var text = name + "涨破监控价格" + highPrice + "，达到" + now;
                                    saveData('stocks', JSON.stringify(stockList));
                                    showNotification("通知", text);
                                    console.log("================监控价格涨破", highPrice, "============");
                                }
                            }
                            if (typeof monitorStock.monitorLowPrice != 'undefined' && monitorStock.monitorLowPrice != '') {
                                var lowPrice = parseFloat(monitorStock.monitorLowPrice);
                                if (now < lowPrice) {
                                    monitorStock.monitorAlert = '2';
                                    monitorStock.monitorAlertDate = Date.now();
                                    sendChromeBadge('#FFFFFF', blueColor, "" + now);
                                    var text = name + "跌破监控价格" + lowPrice + "，达到" + now;
                                    saveData('stocks', JSON.stringify(stockList));
                                    showNotification("通知", text);
                                    console.log("================监控价格跌破", lowPrice, "============");
                                }
                            }
                            // 日涨幅提醒
                            if (typeof monitorStock.monitorUpperPercent != 'undefined' && monitorStock.monitorUpperPercent != '') {
                                var upperPercent = parseFloat(monitorStock.monitorUpperPercent);
                                var openPrice = parseFloat(stoksArr[k].f18 + "");
                                let currentPercent = (now - openPrice) / openPrice * 100;
                                if (currentPercent >= upperPercent) {
                                    monitorStock.monitorAlert = '3';
                                    monitorStock.monitorAlertDate = Date.now();
                                    sendChromeBadge('#FFFFFF', redColor, upperPercent + "%");
                                    var text = name + "涨幅超过" + upperPercent + "%，达到" + currentPercent + "%";
                                    saveData('stocks', JSON.stringify(stockList));
                                    showNotification("通知", text);
                                    console.log("================日涨幅提醒", upperPercent, "%============");
                                }
                            }
                            // 日跌幅提醒
                            if (typeof monitorStock.monitorLowerPercent != 'undefined' && monitorStock.monitorLowerPercent != '') {
                                var lowerPercent = parseFloat(monitorStock.monitorLowerPercent);
                                var openPrice = parseFloat(stoksArr[k].f18 + "");
                                let currentPercent = (openPrice - now) / openPrice * 100;
                                if (currentPercent >= lowerPercent) {
                                    monitorStock.monitorAlert = '4';
                                    monitorStock.monitorAlertDate = Date.now();
                                    sendChromeBadge('#FFFFFF', blueColor, lowerPercent + "%");
                                    var text = name + "跌幅超过" + lowerPercent + "%，达到" + currentPercent + "%";
                                    saveData('stocks', JSON.stringify(stockList));
                                    showNotification("通知", text);
                                    console.log("================日跌幅提醒", lowerPercent, "%============");
                                }
                            }
                            // 20日均线提醒
                            if (monitorStock.monitorMA20) {
                                try {
                                    let klt = 101;
                                    if(monitorStock.code.startsWith('sh') || monitorStock.code.startsWith('SH')){
                                        secid = '1';
                                    } else if(monitorStock.code.startsWith('sz') || monitorStock.code.startsWith('SZ') || monitorStock.code.startsWith('bj') || monitorStock.code.startsWith('BJ')) {
                                        secid = '0';
                                    } else {
                                        secid = '2';
                                    }
                                    let code = monitorStock.code.replace('sh', '').replace('sz', '').replace('bj', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_');
                                    let end = getBeijingDateNoSlash();
                                    // now
                                    fetch("https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=" + secid + "."+ code + "&klt=" + klt + "&fqt=1&lmt=100&end=" + end + "&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf59&forcect=1")
                                    .then(response => response.text())
                                    .then(repsonse => JSON.parse(repsonse))
                                    .then(data => {
                                        const klines = data.data.klines;
                                        let stockName = data.data.name;
                                        const transformedData = klines.map((kline) => {
                                            const [date, open, close, high, low, volume, money, change] = kline.split(",");
                                            return [date, parseFloat(open), parseFloat(close), parseFloat(low), parseFloat(high), parseFloat(volume), parseFloat(money), parseFloat(change)];
                                        });
                                        const categoryData = [];
                                        const volumnData = [];
                                        const priceData = [];
                                        const values = [];
                                        const changes = [];
                                        for (var i = 0; i < transformedData.length; i++) {
                                            categoryData.push(transformedData[i].splice(0, 1)[0]);
                                            values.push(transformedData[i]);
                                            volumnData.push(transformedData[i][4]);
                                            priceData.push(transformedData[i][3]);
                                            changes.push(transformedData[i][6]);
                                        }
                                        const data0 = {
                                            categoryData: categoryData,
                                            volumnData: volumnData,
                                            priceData: priceData,
                                            values: values,
                                            changes: changes,
                                        };
                                        let ma20List = calculateMA(20, data0.values);
                                        let ma20 = ma20List[ma20List.length - 1];
                                        const currentPrice = data0.values[data0.values.length - 1][1];
                                        let text = '';
                                        let monitorAlert = '';
                                        if (currentPrice > ma20) {
                                            monitorAlert = '5';
                                            text = '股票：' + stockName + '，当前价格' + currentPrice + '，大于20日均线' + ma20 + '，可以买入';
                                        } else if (currentPrice < ma20) {
                                            monitorAlert = '6';
                                            text = '股票：' + stockName + '，当前价格' + currentPrice + '，小于20日均线' + ma20 + '，需要卖出';
                                        }
                                        updateStocksMA20(data.data.code, monitorAlert);
                                        console.log(text);
                                    });
                                } catch (error) {
                                    console.warn("执行20日均线提醒任务:", error);
                                }
                            }
                        }
                    });
                });
            })
            .catch(error => {
                // 处理请求错误
                console.warn("执行突破价格监控任务:", error);
            });
    } else {
        console.log("非交易时间，停止执行任务...");
    }
}
// 基金定投
function monitorFundCycleInvest(fundList) {
    var date = new Date();
    if (isCycleInvest) {
        console.log("执行定投任务...", date.toLocaleString());
        var isCycleInvestTime = date.toLocaleTimeString() >= "16:45:00" && date.toLocaleTimeString() < "16:45:20";
        if (isCycleInvestTime) {
            for (let k in fundList) {
                if (typeof fundList[k].fundCycleInvestType != 'undefined' && fundList[k].fundCycleInvestType != ''
                    && fundList[k].fundCycleInvestType != 'no') {
                    // 获取 date 的星期，与配置中的星期不同，则当日不定投
                    var dayOfWeek = date.getDay();
                    console.log("dayOfWeek===", dayOfWeek);
                    if (fundList[k].fundCycleInvestType == 'week' && dayOfWeek != fundList[k].fundCycleInvestDate) {
                        continue;
                    }
                    // 获取 date 的日期，与配置中的日不同，则当日不定投
                    var day = date.toDateString().substring(8, 10);
                    console.log("day===", day);
                    if (fundList[k].fundCycleInvestType == 'month' && parseInt(day) != fundList[k].fundCycleInvestDate) {
                        continue;
                    }
                    console.log("执行定投任务基金编码", fundList[k].fundCode);
                    var fundListNew = fundList;
                    fetch("http://fundgz.1234567.com.cn/js/" + fundListNew[k].fundCode + ".js")
                        .then(response => response.text())
                        .then(data => {
                            console.log("定投1" + fundListNew[k].fundCode + fundListNew[k].fundCycleInvestType + fundListNew[k].bonds + fundListNew[k].costPrise);
                            var json = JSON.parse(data.substring(8, data.length - 2));
                            var gsz = parseFloat(json.gsz);
                            var fundCycleInvestValue = parseFloat(fundListNew[k].fundCycleInvestValue);
                            var fundCycleInvestRate = parseFloat(fundListNew[k].fundCycleInvestRate);
                            // 手续费
                            var fundCycleInvestFee = fundCycleInvestValue * fundCycleInvestRate / 100;
                            console.log("手续费" + fundCycleInvestFee.toFixed(2));
                            var newInvestValue = fundCycleInvestValue - fundCycleInvestFee;
                            console.log("新买入金额" + newInvestValue.toFixed(2));
                            var newBonds = newInvestValue / gsz;
                            console.log("新增持仓" + newBonds.toFixed(2));
                            var totalPrise = parseFloat(fundListNew[k].costPrise) * parseFloat(fundListNew[k].bonds);
                            console.log("总金额:" +totalPrise);
                            console.log("旧持仓:" +fundListNew[k].bonds +";旧成本:"+ fundListNew[k].costPrise);
                            fundListNew[k].bonds = parseFloat(parseFloat(fundListNew[k].bonds) + parseFloat(newBonds)).toFixed(2);
                            fundListNew[k].costPrise = ((parseFloat(totalPrise) + parseFloat(newInvestValue)) / parseFloat(fundListNew[k].bonds)).toFixed(4);
                            console.log("新持仓:" +fundListNew[k].bonds +";新成本:"+ fundListNew[k].costPrise);
                            saveData('funds', JSON.stringify(fundListNew));
                        })
                    .catch(error => {
                        // 处理请求错误
                        console.warn("执行定投任务报错:", error);
                    });
                }
            }
        } else {
            console.log("没到定投时间16:45:00-16:45:20,停止执行任务...");
        }
    }
}

// 后台监控实时价格并在角标实时显示
function monitorStock(code) {
    var date = new Date();
    console.log("执行监控股票实时价格任务...", date.toLocaleString());
    if (isTradingTime(date)) {
        console.log("交易时间，执行任务...");
        let secIdStock = getSecidBack(code) + '.' + code.replace('sh', '').replace('sz', '').replace('bj', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_') + ',';
        fetch("https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f12,f13,f19,f14,f139,f148,f124,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f88,f153&secids=" + secIdStock)
            .then(response => response.text())
            .then(repsonse => JSON.parse(repsonse))
            .then(response => {
                getData('blueColor').then((blueColor) => {
                    if (blueColor == null) {
                        blueColor = '#093';
                    }
                    getData('redColor').then((redColor) => {
                        if (redColor == null) {
                            redColor = '#ee2500';
                        }
                        if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色变淡，更隐蔽
                            blueColor = lightBlue;
                            redColor = lightRed;
                        }
                        let stock = response.data.diff[0];
                        var name = stock.f14 + "";
                        var now = stock.f2 + "";
                        // 9点至9点15分，股票价格如果为0就取昨日收盘价格
                        if (parseFloat(now) == 0) {
                            now = stock.f18 + "";
                        }
                        var openPrice = parseFloat(stock.f18 + "");
                        var badgeBackgroundColor;
                        var changePercent = parseFloat(stock.f3).toFixed(2);
                        if (parseFloat(now) >= parseFloat(openPrice)) {
                            badgeBackgroundColor = redColor
                        } else {
                            badgeBackgroundColor = blueColor;
                        }
                        if (now.length >= 5) {
                            now = parseFloat(now.substring(0, 5));
                        }
                        getData('monitor-price-or-percent').then((monitorPriceOrPercent) => {
                            if (monitorPriceOrPercent == null || monitorPriceOrPercent == "PRICE") {
                                sendChromeBadge('#FFFFFF', badgeBackgroundColor, "" + now);
                            } else if (monitorPriceOrPercent == "PERCENT") {
                                if(changePercent < 0) {
                                    changePercent = 0 - changePercent;
                                }
                                sendChromeBadge('#FFFFFF', badgeBackgroundColor, "" + changePercent);
                            }
                        });
                    });
                });
            })
            .catch(error => {
                // 处理请求错误
                console.warn("执行监控股票实时价格任务:", error);
            });
    } else {
        console.log("非交易时间，停止执行任务...");
    }
}
// 是否交易时间
function isTradingTime(date) {
    // return (date.toLocaleTimeString() >= "09:15:00" && date.toLocaleTimeString() <= "11:31:00")
    // || (date.toLocaleTimeString() >= "09:15:00 AM" && date.toLocaleTimeString() <= "11:31:00 AM")
    // || (date.toLocaleTimeString() >= "13:00:00" && date.toLocaleTimeString() <= "16:01:00")
    // || (date.toLocaleTimeString() >= "1:00:00 PM" && date.toLocaleTimeString() <= "4:01:00 PM")
    // || (date.toLocaleTimeString() >= "21:30:00" && date.toLocaleTimeString() <= "23:59:59")
    // || (date.toLocaleTimeString() >= "9:30:00 PM" && date.toLocaleTimeString() <= "11:59:59 PM")
    // || (date.toLocaleTimeString() >= "00:00:00" && date.toLocaleTimeString() <= "04:01:00")
    // || (date.toLocaleTimeString() >= "0:00:00 AM" && date.toLocaleTimeString() <= "4:01:00 AM");
    return true;
}
// 发送 chrome 通知
async function showNotification(title, body) {
    let sendCrhomeNoticeEnable = await getData('send-chrome-notice-enable');
    console.log("发送浏览器通知开关：", sendCrhomeNoticeEnable);
    if (sendCrhomeNoticeEnable == true || sendCrhomeNoticeEnable == 'true') {
        chrome.notifications.create({
            type: "basic",
            title: title,
            message: body,
            iconUrl: "/img/128.png"
        }, function(notificationId) {
            // 通知创建完成后的回调函数
            if (chrome.runtime.lastError) {
                console.log("创建通知失败: " + chrome.runtime.lastError.message);
            } else {
                console.log("通知已创建，ID: " + notificationId);
            }
        });
    } else {
        console.log("不允许发送浏览器通知");
    }
}
// 统一发送chrome角标
function sendChromeBadge(badgeTextColor, badgeBackgroundColor, badgeText) {
    if (isFirefox) {
        try {
            chrome.browserAction.setBadgeTextColor({ color: badgeTextColor });
        } catch (error) {
            console.warn("BadgeTextColor Error: ", error);
        }
        chrome.browserAction.setBadgeBackgroundColor({ color: badgeBackgroundColor });
        chrome.browserAction.setBadgeText({ text: badgeText });
    } else {
        try {
            chrome.action.setBadgeTextColor({ color: badgeTextColor });
        } catch (error) {
            console.warn("BadgeTextColor Error: ", error);
        }
        chrome.action.setBadgeBackgroundColor({ color: badgeBackgroundColor });
        chrome.action.setBadgeText({ text: badgeText });
    }
}
// 统一设置chrome标题
function setChromeTitle(title) {
    if (isFirefox) {
        try {
            chrome.browserAction.setTitle({ 
                title: title
            });
        } catch (error) {
            console.warn("setChromeTitle Error: ", error);
        }
    } else {
        try {
            chrome.action.setTitle({ 
                title: title
            });
        } catch (error) {
            console.warn("setChromeTitle Error: ", error);
        }
    }
}
// 扩展程序图标鼠标悬停后展示前20个股票价格
async function monitorTop20StockChromeTitle(monitoTop20Stock) {
    let mainPageRefreshTime = await getData('main-page-refresh-time');
    if (mainPageRefreshTime == null || mainPageRefreshTime == '' || mainPageRefreshTime == undefined
        || mainPageRefreshTime == 'undefined') {
        mainPageRefreshTime = 20000;
    }
    if (mainPageRefreshTime == 1000000000) {
        console.log('设定后台不刷新');
        return;
    }
    var date = new Date();
    console.log("执行扩展程序图标鼠标悬停后展示前20个股票价格任务...", date.toLocaleString());
    if (isTradingTime(date)) {
        console.log("交易时间，执行任务...");
        
        // 检查是否启用所有分组收益统计
        let calculateAllGroupIncome = await getData('calculate-all-group-income');
        if (calculateAllGroupIncome == null) {
            calculateAllGroupIncome = false;
        } else if(calculateAllGroupIncome == "true") {
            calculateAllGroupIncome = true;
        } else if(calculateAllGroupIncome == "false") {
            calculateAllGroupIncome = false;
        }
        
        var stockList;
        if (calculateAllGroupIncome) {
            // 从所有分组获取股票数据
            stockList = await getAllStocksFromAllGroups();
        } else {
            // 只从默认分组获取股票数据
            let stockArr = await getData('stocks');
            if (stockArr == null || stockArr == undefined) {
                stockArr = '[]';
            }
            stockList = JSON.parse(stockArr);
        }
        var secIdStockArr = '';
        let monitorShowMore = await getData('monitor-show-more');
        if (monitorShowMore == null) {
            monitorShowMore = true;
        } else if(monitorShowMore == "true") {
            monitorShowMore = true;
        } else if(monitorShowMore == "false") {
            monitorShowMore = false;
        }
        if (monitorShowMore) {
            secIdStockArr = '1.000001,0.399001,0.399006,100.HSI,';
        }
        for (var k in stockList) {
            let code = stockList[k].code;
            secIdStockArr += getSecidBack(code) + '.' + stockList[k].code.replace('sh', '').replace('sz', '').replace('bj', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_') + ',';
        }
        let response;
        try {
            response = await fetch("https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f12,f13,f19,f14,f139,f148,f124,f2,f4,f1,f125,f18,f3,f152,f5,f30,f31,f32,f6,f8,f7,f10,f22,f9,f112,f100,f88,f153&secids=" + secIdStockArr);
        } catch (error) {
            console.warn("监控前20个股票以及计算盈亏获取股票数据错误: ", error);
            return;
        }
        response = await response.text();
        response = JSON.parse(response);
        // 检查 response.data 是否为 null，如果为 null 则设置为空列表
        let stoksArr = (response.data && response.data.diff) ? response.data.diff : [];
        // 在这里处理返回的数据
        var title = '';
        var stockDayIncome = 0.00;
        var stockMarketValue = 0.00;
        var date = '';
        for (let k in stoksArr) {
            try {
                var stock = undefined;
                for (let l in stockList) {
                    if(stoksArr[k].f12 == stockList[l].code.replace('sh', '').replace('sz', '').replace('bj', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_')){
                        stock = stockList[l];
                        break;
                    }
                }
                var name = stoksArr[k].f14 + "";
                var code = stoksArr[k].f12 + "";
                if (name == undefined) {
                    continue;
                }
                var now = parseFloat(stoksArr[k].f2 + "");
                // 9点至9点15分，股票价格如果为0就取昨日收盘价格
                if (now == 0) {
                    now = parseFloat(stoksArr[k].f18 + "");
                }
                var changePercent = parseFloat(stoksArr[k].f3).toFixed(2);
                var dayIncome = 0.00;
                if (stock != undefined) {
                    // 当天新买入
                    if (stock.newBuy && stock.newBuyDate == getBeijingDate()) {
                        dayIncome = (now - parseFloat(stock.costPrise + ""))*(parseFloat(stock.bonds));
                    // 不是当天新买
                    } else {
                        dayIncome = parseFloat(stoksArr[k].f4 + "") * parseFloat(stock.bonds)
                    }
                    if (stock.code.indexOf('hk') >= 0 || stock.code.indexOf('HK') >= 0) {
                        dayIncome = await getHuilvDayIncome(dayIncome, 'HK');
                    } else if (stock.code.indexOf('us') >= 0 || stock.code.indexOf('US') >= 0) {
                        dayIncome = await getHuilvDayIncome(dayIncome, 'US');
                    }
                    stockMarketValue += now * parseFloat(stock.bonds);
                }
                stockDayIncome += dayIncome;
                if (count <= 24) {
                    var kongge = '';
                        switch(name.length) {
                            case 3: 
                                kongge = '         ';
                                break;
                            case 4: 
                                kongge = '     ';
                                break;
                            case 5: 
                                kongge = '     ';
                                break;
                            case 6: 
                                kongge = '  ';
                                break;
                        }
                    if (code == '000001' || code =='399001' || code =='399006' || code == 'HSI' 
                        || (monitoTop20Stock != null && monitoTop20Stock == true)) {
                        title += (name + kongge + now + '(' + changePercent + "%)\n");
                    }
                }
                var value30 = getDateStrFromTimestamp(stoksArr[k].f124*1000).replace(/\//g,'').replace(/-/g,'').replace(/\s/g,'').replace(/:/g,'');
                if (value30.substring(0, 8) > date) {
                    // 如果当前日期大于之前存储的最大日期，则更新最大日期
                    date = value30.substring(0, 8);
                }
                count++;
            } catch (error) {
                console.warn("监控前20个股票以及计算盈亏股票处理错误: ", error);
            }
        }
        title = title.substring(0, title.length - 1);
        let funcIncome = await getFundIncome(date);
        if (funcIncome == null) {
            return;
        }
        let funcDayIncome = funcIncome.fundDayIncome;
        let totalDayIncome = funcDayIncome + stockDayIncome;
        let fundMarketValue = funcIncome.fundMarketValue;
        if (monitorShowMore) {
            title += '\n\n当日股票收益：' + stockDayIncome.toFixed(2);
            title += '\n当日基金收益：' + funcDayIncome.toFixed(2);
            title += '\n当日总收益：' + totalDayIncome.toFixed(2);
        }
        let blueColor = await getData('blueColor');
        if (blueColor == null) {
            blueColor = '#093';
        }
        let redColor = await getData('redColor');
        if (redColor == null) {
            redColor = '#ee2500';
        }
        if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色变淡，更隐蔽
            blueColor = lightBlue;
            redColor = lightRed;
        }
        let monitorPriceOrPercent =  await getData('monitor-price-or-percent');
        if (monitorPriceOrPercent == 'DAY_INCOME') {
            let color = totalDayIncome > 0 ? redColor : blueColor;
            if (totalDayIncome < 0) {
                totalDayIncome = 0 - totalDayIncome;
            }
            if (totalDayIncome > 9999.99) {
                totalDayIncome = Math.floor(totalDayIncome/10000*10)/10 + "w";
            } else if (totalDayIncome > 99.99) {
                totalDayIncome = Math.floor(totalDayIncome);
            } else if (totalDayIncome > 9.99) {
                totalDayIncome = Math.floor(totalDayIncome * 10) / 10;
            } else {
                totalDayIncome = totalDayIncome.toFixed(2);
            }
            sendChromeBadge('#FFFFFF', color, totalDayIncome + "");
        } else if (monitorPriceOrPercent == 'DAY_INCOME_PERCENT') {
            let color = totalDayIncome > 0 ? redColor : blueColor;
            let totalDayIncomePercent = (totalDayIncome / (fundMarketValue + stockMarketValue - totalDayIncome) * 100);
            totalDayIncomePercent = totalDayIncomePercent >= 0 ? totalDayIncomePercent.toFixed(2) : (0 - totalDayIncomePercent).toFixed(2);
            console.log('fundMarketValue + stockMarketValue:',(fundMarketValue + stockMarketValue),';totalDayIncome:',totalDayIncome);
            sendChromeBadge('#FFFFFF', color, totalDayIncomePercent + "");
        }
        saveDayIncomehistory(stockDayIncome.toFixed(2), funcDayIncome.toFixed(2), date);
        setChromeTitle(title);
    }
}
// 统计每日盈利
async function saveDayIncomehistory(stockDayIncome, fundDayIncome, date) {
    let dayIncomeHistory = await getData('DAY_INCOME_HISTORY');
    if (dayIncomeHistory == null || dayIncomeHistory == undefined) {
        dayIncomeHistory = [];
    }
    let existingEntryIndex = dayIncomeHistory.findIndex(entry => entry.date === date);
    if (existingEntryIndex !== -1) {
        // 如果存在，更新该条目的 dayIncome
        dayIncomeHistory[existingEntryIndex].stockDayIncome = stockDayIncome;
        dayIncomeHistory[existingEntryIndex].fundDayIncome = fundDayIncome;
    } else {
        // 如果不存在，创建新的条目并添加到数组中
        let dayIncome = {
            'date': date,
            'stockDayIncome': stockDayIncome,
            'fundDayIncome': fundDayIncome
        };
        dayIncomeHistory.push(dayIncome);
    }
    saveData('DAY_INCOME_HISTORY', dayIncomeHistory);
}
// 获取前一个工作日的日期，格式为 20250924
function getPreviousWorkingDay() {
    let date = new Date();
    // 设置为北京时间
    let options = {
        timeZone: 'Asia/Shanghai',
        hour12: false
    };
    // 向前推一天
    date.setDate(date.getDate() - 1);
    // 如果是周日，再向前推两天到周五
    if (date.getDay() === 0) {
        date.setDate(date.getDate() - 2);
    }
    // 如果是周六，向前推一天到周五
    else if (date.getDay() === 6) {
        date.setDate(date.getDate() - 1);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}${month}${day}`;
}
// 统计基金当日盈利
async function getFundIncome(date) {
    // 如果 date 为 null 或空字符串，获取前一个工作日的日期
    if (!date || date === '') {
        date = getPreviousWorkingDay();
        console.log('date 为空，使用前一个工作日日期：', date);
    }
    
    // 检查是否启用所有分组收益统计
    let calculateAllGroupIncome = await getData('calculate-all-group-income');
    if (calculateAllGroupIncome == null) {
        calculateAllGroupIncome = false;
    } else if(calculateAllGroupIncome == "true") {
        calculateAllGroupIncome = true;
    } else if(calculateAllGroupIncome == "false") {
        calculateAllGroupIncome = false;
    }
    
    let fundList;
    if (calculateAllGroupIncome) {
        // 从所有分组获取基金数据
        fundList = await getAllFundsFromAllGroups();
    } else {
        // 只从默认分组获取基金数据
        fundList = await getData('funds');
        if (fundList == null || fundList == '' || fundList == undefined || fundList == 'undefined') {
            fundList = [];
        } else {
            fundList = JSON.parse(fundList);
        }
    }
    let fundDayIncome = parseFloat("0");
    let fundTotalIncome = parseFloat("0");
    let fundMarketValue = parseFloat("0");
    let isFailed = false;
    let promises = fundList.map(async (fund) => {
        try {
            if (fund.bonds !== null && parseFloat(fund.bonds) > 0) {
                let fundNetDiagramResponse = await fetch(`https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx?FCODE=${fund.fundCode}&RANGE=y&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=`);
                let fundNetDiagramData = await fundNetDiagramResponse.text();
                let fundNetDiagramJson = JSON.parse(fundNetDiagramData);
                let currentDayNetDiagram = null;
                for (let i = 0; i < fundNetDiagramJson.Datas.length; i++) {
                    if (fundNetDiagramJson.Datas[i].FSRQ.replace(/-/g, '') == date) {
                        currentDayNetDiagram = fundNetDiagramJson.Datas[i];
                        break;
                    }
                }
                if (currentDayNetDiagram != null) {
                    // 找到前一个交易日的index，通过index取出前一个交易日的净值
                    let currentDayNetDiagramIndex = fundNetDiagramJson.Datas.indexOf(currentDayNetDiagram);
                    let previousDayNetDiagramIndex = currentDayNetDiagramIndex - 1;
                    let previousDayNetDiagram = fundNetDiagramJson.Datas[previousDayNetDiagramIndex];
                    let dayIncome = (parseFloat(currentDayNetDiagram.DWJZ) - parseFloat(previousDayNetDiagram.DWJZ))
                        * parseFloat(fund.bonds);
                    fundDayIncome = fundDayIncome + dayIncome;
                    let totalIncome = (parseFloat(currentDayNetDiagram.DWJZ) - parseFloat(fund.costPrise)) * parseFloat(fund.bonds);
                    fundTotalIncome = fundTotalIncome + totalIncome;
                    fundMarketValue += parseFloat(currentDayNetDiagram.DWJZ) * parseFloat(fund.bonds);
                    saveData('previous_day_jingzhi_' + fund.fundCode, previousDayNetDiagram.DWJZ);
                    saveData('current_day_jingzhi_' + fund.fundCode, currentDayNetDiagram.DWJZ);
                    saveData('current_day_jingzhi_date_' + fund.fundCode, date);
                } else {
                    let response = await fetch(`http://fundgz.1234567.com.cn/js/${fund.fundCode}.js`);
                    let data = await response.text();
                    if (data != 'jsonpgz();') {
                        var json = JSON.parse(data.substring(8, data.length - 2));
                        let gztime = json.gztime.substring(0, 10).replace(/-/g, '');
                        // 如果日期不一致不在计算
                        if (date != gztime) return;
                        let dayIncome = parseFloat(json.gszzl) * parseFloat(json.dwjz) * parseFloat(fund.bonds) / 100;
                        fundDayIncome = fundDayIncome + dayIncome;
                        let totalIncome = (parseFloat(json.gsz) - parseFloat(fund.costPrise)) * parseFloat(fund.bonds);
                        fundTotalIncome = fundTotalIncome + totalIncome;
                        fundMarketValue += parseFloat(json.gsz) * parseFloat(fund.bonds);
                    }
                }
            }
        } catch (error) {
            console.warn(`Error fetching data for fund ${fund.fundCode}: ${error}`);
            isFailed = true;
        }
    });
    // 等待所有基金的收益计算完成
    await Promise.all(promises);
    let result = {
        "fundDayIncome" : fundDayIncome,
        "fundTotalIncome" : fundTotalIncome,
        "fundMarketValue": fundMarketValue
    }
    if (isFailed) {
        return null;
    }
    return result;
}
// 汇率计算当日盈利
async function getHuilvDayIncome(dayIncome, type) {
    let newDayIncome = dayIncome;
    let huilvConvert = await getData('huilvConvert');
    // console.log('huilvConvert',huilvConvert);
    let huilv = 1;
    if (huilvConvert == null) {
        huilvConvert = false;
    } else if(huilvConvert == "true") {
        huilvConvert = true;
    } else if(huilvConvert == "false") {
        huilvConvert = false;
    }
    if (huilvConvert && type == 'HK') {
        huilv = await getData('HKD_huilv_cached');
    } else if (huilvConvert && type == 'US') {
        huilv = await getData('USD_huilv_cached');
    }
    if (huilvConvert) {
        newDayIncome = parseFloat(dayIncome + "") * parseFloat(huilv + "");
        return newDayIncome;
    } else {
        return dayIncome;
    }
}
//后台修改默认图标为隐蔽图标
async function changeDefaultIcon() {
    try {
        let defaultIcon = await getData('default-icon');
        if (defaultIcon == 'false' || defaultIcon == false) {
            let iconPath = {
                "16": "/img/128_hidden.png",
                "48": "/img/128_hidden.png",
                "128": "/img/128_hidden.png"
            }
            chrome.action.setIcon({path: iconPath});
            console.log('设定隐蔽图标后，重启浏览器再次设定隐蔽图标');
        }
    } catch (error) {
        console.warn(`Change default icon : ${error}`);
    }
}
// 获取市场id
function getSecidBack(code) {
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
        if (code.endsWith('.oq') || code.endsWith('.OQ')) {
            secid = '105';
        } else if (code.endsWith('.ps') || code.endsWith('.PS')) {
            secid = '153';
        } else if (code.endsWith('.am') || code.endsWith('.AM')) {
            secid = '107';
        } else {
            secid = '106';
        }
        if (code == 'usNDX' || code == 'usDJIA' || code == 'usSPX') {
            secid = '100';
        } else if(code === 'USDCNH') {
            secid = '133';
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
        } else if(code.startsWith('BK')){
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
// 将时间戳转换为日期字符串
function getDateStrFromTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 确保月份总是两位数
        const day = String(date.getDate()).padStart(2, '0'); // 确保日期总是两位数
        const hours = String(date.getHours()).padStart(2, '0'); // 确保小时总是两位数
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 确保分钟总是两位数
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 确保秒总是两位数
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch(error) {
        return '1970-01-01 00:00:00';
    }
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
// 自定义函数，计算五日均线数据
function calculateMA(dayCount, data) {
    let toFixedVolume = 2;
    if (parseFloat(data[0]) <= 5) {
        toFixedVolume = 3;
    }
    let result = [];
    for (let i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
            sum += parseFloat(data[i - j][1]); // 这里假设收盘价在数据中的索引为 1
        }
        result.push((sum / dayCount).toFixed(toFixedVolume));
    }
    return result;
}
// 更新监控的MA20股票数据
async function updateStocksMA20(code, monitorAlert) {
    let stockArr = await getData('stocks');
    if (stockArr == null || stockArr == undefined) {
        stockArr = '[]';
    }
    var stockList = JSON.parse(stockArr);
    for (let i = 0; i < stockList.length; i++) {
        if (stockList[i].code.replace('sh', '').replace('sz', '').replace('bj', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_') == code) {
            stockList[i].monitorAlert = monitorAlert;
            stockList[i].monitorAlertDate = Date.now();
            break;
        }
    }
    saveData('stocks', JSON.stringify(stockList));
}
// 后台监控基金突破价格并提示
async function monitorFundPrice(fundList) {
    var date = new Date();
    console.log("执行基金突破价格监控任务...", date.toLocaleString());
    if (!isTradingTime(date)) {
        return;
    }
    console.log("交易时间，执行任务...");
    var funds = [];
    for (let k in fundList) {
        if (fundList[k].monitorAlert == '1' || fundList[k].monitorAlert == '2' 
            || fundList[k].monitorAlert == '3'|| fundList[k].monitorAlert == '4') {
            continue;
        }
        if ((typeof fundList[k].monitorLowPrice != 'undefined' && fundList[k].monitorHighPrice != '')
            || (typeof fundList[k].monitorLowPrice != 'undefined' && fundList[k].monitorLowPrice != '')
            || (typeof fundList[k].monitorUpperPercent != 'undefined' && fundList[k].monitorUpperPercent != '')
            || (typeof fundList[k].monitorLowerPercent != 'undefined' && fundList[k].monitorLowerPercent != '')) {
            funds.push(fundList[k]);
        }
    }
    if (funds == "") {
        console.log("没有监控的基金，返回...");
        return;
    }
    var blueColor = await getData('blueColor');
    if (blueColor == null) {
        blueColor = '#093';
    }
    var redColor = await getData('redColor');
    if (redColor == null) {
        redColor = '#ee2500';
    }
    if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色变淡，更隐蔽
        blueColor = lightBlue;
        redColor = lightRed;
    }
    // 在这里处理返回的数据
    for (let k in funds) {
        try {
            let now = '';
            let fundNetDiagramResponse = await fetch(`https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx?FCODE=${funds[k].fundCode}&RANGE=y&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=`);
            let fundNetDiagramData = await fundNetDiagramResponse.text();
            let fundNetDiagramJson = JSON.parse(fundNetDiagramData);
            let currentDayNetDiagram = null;
            for (let i = 0; i < fundNetDiagramJson.Datas.length; i++) {
                if (fundNetDiagramJson.Datas[i].FSRQ.replace(/-/g, '') == getBeijingDateNoSlash()) {
                    currentDayNetDiagram = fundNetDiagramJson.Datas[i];
                    break;
                }
            }
            if (currentDayNetDiagram != null) {
                now = parseFloat(currentDayNetDiagram.DWJZ + '');
            } else {
                let response = await fetch(`http://fundgz.1234567.com.cn/js/${funds[k].fundCode}.js`);
                let data = await response.text();
                if (data != 'jsonpgz();') {
                    var json = JSON.parse(data.substring(8, data.length - 2));
                    now = parseFloat(json.dwjz + '');
                }
            }
            // 没获取估值和净值，跳过
            if (now == '') {
                continue;
            }
            if (typeof funds[k].monitorHighPrice != 'undefined' && funds[k].monitorHighPrice != '') {
                var highPrice = parseFloat(funds[k].monitorHighPrice);
                if (now > highPrice) {
                    funds[k].monitorAlert = '1';
                    funds[k].monitorAlertDate = Date.now();
                    sendChromeBadge('#FFFFFF', redColor, "" + now);
                    saveData('funds', JSON.stringify(fundList));
                    var text = funds[k].fundName + "涨破监控价格" + highPrice + "，达到" + now;
                    showNotification("通知", text);
                    console.log("================监控价格涨破", highPrice, "============");
                }
            }
            if (typeof funds[k].monitorLowPrice != 'undefined' && funds[k].monitorLowPrice != '') {
                var lowPrice = parseFloat(funds[k].monitorLowPrice);
                if (now < lowPrice) {
                    funds[k].monitorAlert = '2';
                    funds[k].monitorAlertDate = Date.now();
                    sendChromeBadge('#FFFFFF', blueColor, "" + now);
                    saveData('funds', JSON.stringify(fundList));
                    var text = funds[k].fundName + "跌破监控价格" + lowPrice + "，达到" + now;
                    showNotification("通知", text);
                    console.log("================监控价格跌破", lowPrice, "============");
                }
            }
        } catch (error) {
            console.warn(`Error fetching data for fund ${fund.fundCode}: ${error}`);
        }
    }
}

// 获取所有分组的股票数据
async function getAllStocksFromAllGroups() {
    // 首先获取所有分组信息
    let groups = await getData('groups');
    if (groups == null || groups == '' || groups == undefined || groups == 'undefined') {
        groups = {
            'default-group': '默认分组'
        };
    }
    
    let allStocks = [];
    
    // 遍历所有group
    for (const id of Object.keys(groups)) {
        if (id == 'default-group') {
            var stocks = await getData('stocks');
            if (stocks != null && stocks != '' && stocks != undefined && stocks != 'undefined' && stocks != '[]') {
                JSON.parse(stocks).forEach(item => {
                    item.belongGroup = 'default-group';
                    allStocks.push(item);
                });
            }
        } else {
            var stocks = await getData(id + '_stocks');
            if (stocks != null && stocks != '' && stocks != undefined && stocks != 'undefined' && stocks != '[]') {
                JSON.parse(stocks).forEach(item => {
                    item.belongGroup = id;
                    allStocks.push(item);
                });
            }
        }
    }
    
    return allStocks;
}

// 获取所有分组的基金数据
async function getAllFundsFromAllGroups() {
    // 首先获取所有分组信息
    let groups = await getData('groups');
    if (groups == null || groups == '' || groups == undefined || groups == 'undefined') {
        groups = {
            'default-group': '默认分组'
        };
    }
    
    let allFunds = [];
    
    // 遍历所有group
    for (const id of Object.keys(groups)) {
        if (id == 'default-group') {
            var funds = await getData('funds');
            if (funds != null && funds != '' && funds != undefined && funds != 'undefined' && funds != '[]') {
                JSON.parse(funds).forEach(item => {
                    item.belongGroup = 'default-group';
                    allFunds.push(item);
                });
            }
        } else {
            var funds = await getData(id + '_funds');
            if (funds != null && funds != '' && funds != undefined && funds != 'undefined' && funds != '[]') {
                JSON.parse(funds).forEach(item => {
                    item.belongGroup = id;
                    allFunds.push(item);
                });
            }
        }
    }
    
    return allFunds;
}
