let isCycleInvest = false;
let performTaskId;
// 定时执行任务的函数
function scheduleTask() {
    // 设置定时器，每隔一定时间执行 performTask 函数
    let performTaskId = setInterval(performTask, 20000); // 20s，您可以根据需要进行调整
    saveData("performTaskId", performTaskId);
}

// 当扩展程序安装时触发的事件
chrome.runtime.onInstalled.addListener(scheduleTask);
// 当浏览器打开时触发的事件
chrome.runtime.onStartup.addListener(scheduleTask);
// 在扩展程序的 background.js 文件中使用 chrome.runtime.onMessage 监听函数
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    // 在接收到消息时执行的操作
    console.log('收到消息:', message);
    let performTaskId = await getData("performTaskId");
    console.log('清理performTaskId:', performTaskId);
    clearInterval(performTaskId);
    scheduleTask();
    // 可选：发送响应消息给消息发送方
    sendResponse('已收到消息');
});

chrome.runtime.setUninstallURL("https://zhuanlan.zhihu.com/p/640002036");

// 后台定时执行任务的函数
function performTask() {
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
        if (fundArr != null && fundArr != "[]") {
            monitorFundCycleInvest(JSON.parse(fundArr));
        } else {
            monitorFundCycleInvest(JSON.parse("[]"));
        }
    });
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
// 后台监控突破价格并提示
function monitorStockPrice(stockList) {
    var date = new Date();
    console.log("执行突破价格监控任务...", date.toLocaleString());
    if (isTradingTime(date)) {
        console.log("交易时间，执行任务...");
        var stocks = "";
        for (let k in stockList) {
            if (stockList[k].monitorAlert == '1' || stockList[k].monitorAlert == '2') {
                continue;
            }
            if ((typeof stockList[k].monitorLowPrice != 'undefined' && stockList[k].monitorHighPrice != '')
                || (typeof stockList[k].monitorLowPrice != 'undefined' && stockList[k].monitorLowPrice != '')) {
                stocks += stockList[k].code + ",";
            }
        }
        if (stocks == "") {
            console.log("没有监控的股票，返回...");
            return;
        }

        fetch("http://qt.gtimg.cn/q=" + stocks)
            .then(response => response.text())
            .then(data => {
                // 在这里处理返回的数据
                var stoksArr = data.split("\n");
                for (let k in stoksArr) {
                    var monitorStock;
                    for (let l in stockList) {
                        if (stockList[l].code == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))) {
                            monitorStock = stockList[l];
                        }
                    }
                    var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                    var values = dataStr.split("~");
                    var name = monitorStock.name;
                    var now = parseFloat(values[3]);
                    if (typeof monitorStock.monitorHighPrice != 'undefined' && monitorStock.monitorHighPrice != '') {
                        var highPrice = parseFloat(monitorStock.monitorHighPrice);
                        if (now > highPrice) {
                            // monitorStock.monitorHighPrice = '';
                            monitorStock.monitorAlert = '1';
                            monitorStock.monitorAlertDate = Date.now();
                            chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
                            chrome.action.setBadgeBackgroundColor({ color: 'red' });
                            chrome.action.setBadgeText({ text: "" + now });
                            var text = name + "涨破监控价格" + highPrice + "，达到" + now;
                            // saveData("MONITOR_TEXT", text);
                            saveData('stocks', JSON.stringify(stockList));
                            saveData("MONITOR_STOCK_CODE", '');
                            showNotification("通知", text);
                            console.log("================监控价格涨破", highPrice, "============");
                        }
                    }
                    if (typeof monitorStock.monitorLowPrice != 'undefined' && monitorStock.monitorLowPrice != '') {
                        var lowPrice = parseFloat(monitorStock.monitorLowPrice);
                        if (now < lowPrice) {
                            // monitorStock.monitorLowPrice = '';
                            monitorStock.monitorAlert = '2';
                            monitorStock.monitorAlertDate = Date.now();
                            chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
                            chrome.action.setBadgeBackgroundColor({ color: 'green' });
                            chrome.action.setBadgeText({ text: "" + now });
                            var text = name + "跌破监控价格" + lowPrice + "，达到" + now;
                            // saveData("MONITOR_TEXT", text);
                            saveData('stocks', JSON.stringify(stockList));
                            saveData("MONITOR_STOCK_CODE", '');
                            showNotification("通知", text);
                            console.log("================监控价格跌破", lowPrice, "============");
                        }
                    }
                }
            })
            .catch(error => {
                // 处理请求错误
                console.error(error);
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
                        console.error(error);
                    });
                }
            }
        } else {
            console.log("没到定投时间16:45:00-16:45:20,停止执行任务...");
        }
    }
}

// 后台监控突破价格并提示
function monitorStock(code) {
    var date = new Date();
    console.log("执行监控股票实时价格任务...", date.toLocaleString());
    if (isTradingTime(date)) {
        console.log("交易时间，执行任务...");

        fetch("http://qt.gtimg.cn/q=" + code)
            .then(response => response.text())
            .then(data => {
                // 在这里处理返回的数据
                var stoksArr = data.split("\n");
                var dataStr = stoksArr[0].substring(stoksArr[0].indexOf("=") + 2, stoksArr[0].length - 2);
                var values = dataStr.split("~");
                var now = values[3];
                if (now.length >= 5) {
                    now = parseFloat(now.substring(0, 5));
                }
                chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
                chrome.action.setBadgeBackgroundColor({ color: 'blue' });
                chrome.action.setBadgeText({ text: "" + now });
            })
            .catch(error => {
                // 处理请求错误
                console.error(error);
            });
    } else {
        console.log("非交易时间，停止执行任务...");
    }
}
// 是否交易时间
function isTradingTime(date) {
    return (date.toLocaleTimeString() >= "09:15:00" && date.toLocaleTimeString() <= "11:31:00")
    || (date.toLocaleTimeString() >= "09:15:00 AM" && date.toLocaleTimeString() <= "11:31:00 AM")
    || (date.toLocaleTimeString() >= "13:00:00" && date.toLocaleTimeString() <= "16:01:00")
    || (date.toLocaleTimeString() >= "1:00:00 PM" && date.toLocaleTimeString() <= "1:01:00 PM")
    || (date.toLocaleTimeString() >= "21:30:00" && date.toLocaleTimeString() <= "23:59:59")
    || (date.toLocaleTimeString() >= "9:30:00 PM" && date.toLocaleTimeString() <= "11:59:59 PM")
    || (date.toLocaleTimeString() >= "00:00:00" && date.toLocaleTimeString() <= "04:01:00")
    || (date.toLocaleTimeString() >= "00:00:00 AM" && date.toLocaleTimeString() <= "04:01:00 AM");
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