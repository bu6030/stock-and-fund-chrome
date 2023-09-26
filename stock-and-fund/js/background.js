let isCycleInvest = false;
// 定时执行任务的函数
function scheduleTask() {
    // 设置定时器，每隔一定时间执行 performTask 函数
    setInterval(performTask, 20000); // 20s，您可以根据需要进行调整
}

// 当扩展程序安装时触发的事件
chrome.runtime.onInstalled.addListener((details) => {
    // 开始定时执行任务
    scheduleTask();
});

// 当浏览器打开时触发的事件
chrome.runtime.onStartup.addListener(function () {
    // 开始定时执行任务
    scheduleTask();
});

chrome.runtime.setUninstallURL("https://zhuanlan.zhihu.com/p/640002036");

// 后台定时执行任务的函数
function performTask() {
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
    console.log("执行任务...", date.toLocaleString());
    var isTradingTime = (date.toLocaleTimeString() >= "09:15:00" && date.toLocaleTimeString() <= "11:31:00")
        || (date.toLocaleTimeString() >= "13:00:00" && date.toLocaleTimeString() <= "15:01:00");
    if (isTradingTime) {
        console.log("交易时间，执行任务...");
        var stocks = "";
        for (var k in stockList) {
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
                for (var k in stoksArr) {
                    var monitorStock;
                    for (var l in stockList) {
                        if (stockList[l].code == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))) {
                            monitorStock = stockList[l];
                        }
                    }
                    var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                    var values = dataStr.split("~");
                    var name = stockList[l].name;
                    var now = parseFloat(values[3]);
                    if (typeof monitorStock.monitorHighPrice != 'undefined' && monitorStock.monitorHighPrice != '') {
                        var highPrice = parseFloat(monitorStock.monitorHighPrice);
                        if (now > highPrice) {
                            // stockList[l].monitorHighPrice = '';
                            stockList[l].monitorAlert = '1';
                            stockList[l].monitorAlertDate = Date.now();
                            chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
                            chrome.action.setBadgeBackgroundColor({ color: 'red' });
                            chrome.action.setBadgeText({ text: "" + now });
                            // var text = name + "涨破监控价格" + highPrice + "，达到" + now;
                            // saveData("MONITOR_TEXT", text);
                            saveData('stocks', JSON.stringify(stockList));
                            console.log("================监控价格涨破", highPrice, "============");
                        }
                    }
                    if (typeof monitorStock.monitorLowPrice != 'undefined' && monitorStock.monitorLowPrice != '') {
                        var lowPrice = parseFloat(monitorStock.monitorLowPrice);
                        if (now < lowPrice) {
                            // stockList[l].monitorLowPrice = '';
                            stockList[l].monitorAlert = '2';
                            stockList[l].monitorAlertDate = Date.now();
                            chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
                            chrome.action.setBadgeBackgroundColor({ color: 'green' });
                            chrome.action.setBadgeText({ text: "" + now });
                            // var text = name + "跌破监控价格" + lowPrice + "，达到" + now;
                            // saveData("MONITOR_TEXT", text);
                            saveData('stocks', JSON.stringify(stockList));
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