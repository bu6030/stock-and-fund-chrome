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

// 后台定时执行任务的函数
function performTask() {
    getData('stocks').then((stockArr) => {
        if (stockArr != null && stockArr != "[]") {
            monitorStockPrice(JSON.parse(stockArr));
        } else {
            monitorStockPrice(JSON.parse("[]"));
        }
    });
//    getData('funds').then((fundArr) => {
//        if (fundArr != null && fundArr != "[]") {
//            monitorFundCycleInvest(JSON.parse(fundArr));
//        } else {
//            monitorFundCycleInvest(JSON.parse("[]"));
//        }
//    });
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
            if ((typeof stockList[k].monitorLowPrice != 'undefined' && stockList[k].monitorHighPrice != '')
                || (typeof stockList[k].monitorLowPrice != 'undefined' && stockList[k].monitorLowPrice != '')) {
                stocks += stockList[k].code + ",";
            }
        }
        if(stocks == "") {
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
                            stockList[l].monitorHighPrice = '';
                            chrome.action.setBadgeText({ text: "1" });
                            var text = name + "涨破监控价格" + highPrice +"，达到" + now;
                            saveData("MONITOR_TEXT", text);
                            saveData('stocks', JSON.stringify(stockList));
                            console.log("================监控价格涨破", highPrice, "============");
                        }
                    }
                    if (typeof monitorStock.monitorLowPrice != 'undefined' && monitorStock.monitorLowPrice != '') {
                        var lowPrice = parseFloat(monitorStock.monitorLowPrice);
                        if (now < lowPrice) {
                            stockList[l].monitorLowPrice = '';
                            chrome.action.setBadgeText({ text: "1" });
                            var text = name + "跌破监控价格" + lowPrice +"，达到" + now;
                            saveData("MONITOR_TEXT", text);
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

// 后台监控突破价格并提示
function monitorFundCycleInvest(fundList) {
    var date = new Date();
    console.log("执行定投任务...", date.toLocaleString());
    var isCycleInvestTime = date.toLocaleTimeString() >= "16:45:00" && date.toLocaleTimeString() < "16:45:20";
    isCycleInvestTime = true;
    if (isCycleInvestTime) {
        console.log("执行定投任务1...");
        for (var k in fundList) {
            console.log("执行定投任务2..." + fundList[k].fundCode + "==" + fundList[k].fundCycleInvestType);
            if (typeof fundList[k].fundCycleInvestType != 'undefined' && fundList[k].fundCycleInvestType != ''
                && fundList[k].fundCycleInvestType != 'no') {

                console.log("执行定投任务3...")
                var fund = fundList[k];
                var newK = k;
                var fundListNew = fundList;
                fetch("http://fundgz.1234567.com.cn/js/" + fundListNew[newK].fundCode + ".js")
                    .then(response => response.text())
                    .then(data => {
                        console.log("定投1" + fundListNew[newK].fundCode + fundListNew[newK].fundCycleInvestType + fundListNew[newK].bonds + fundListNew[newK].costPrise);
                        var json = JSON.parse(data.substring(8, data.length - 2));
                        var gsz = parseFloat(json.gsz);
                        var fundCycleInvestValue = parseFloat(fundListNew[newK].fundCycleInvestValue);
                        var fundCycleInvestRate = parseFloat(fundListNew[newK].fundCycleInvestRate);
                        // 手续费
                        var fundCycleInvestFee = fundCycleInvestValue * fundCycleInvestRate;
                        console.log("手续费" + fundCycleInvestFee.toFixed(2));
                        var newInvestValue = fundCycleInvestValue - fundCycleInvestFee;
                        console.log("新买入金额" + newInvestValue.toFixed(2));
                        var newBonds = newInvestValue / gsz;
                        console.log("新持仓" + newBonds.toFixed(2));
                        var totalPrise = parseFloat(fundListNew[newK].costPrise) * parseFloat(fundListNew[newK].bonds);
                        console.log("定投2,总金额:" +totalPrise);
                        console.log("定投2,旧持仓:" +fundListNew[newK].bonds +";旧成本:"+ fundListNew[newK].costPrise);
                        fundListNew[newK].bonds = parseFloat(fundListNew[newK].bonds) + parseFloat(newBonds.toFixed(2));

                        fundListNew[newK].costPrise = ((totalPrise + parseFloat(newInvestValue.toFixed(2))) /parseFloat(fundListNew[newK].bonds)).toFixed(4);
                        console.log("定投3,新持仓:" +fundListNew[newK].bonds +";新成本:"+ fundListNew[newK].costPrise);
                        saveData('funds', JSON.stringify(fundListNew));
                    })
                .catch(error => {
                    // 处理请求错误
                    console.error(error);
                });
            }
        }
    }


}