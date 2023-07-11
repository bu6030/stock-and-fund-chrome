// 定时执行任务的函数
function scheduleTask() {
    // 设置定时器，每隔一定时间执行 performTask 函数
    setInterval(performTask, 60000); // 1 分钟，您可以根据需要进行调整
}

// 当扩展程序安装时触发的事件
chrome.runtime.onInstalled.addListener(function () {
    // 在扩展程序安装后立即执行一次任务
    // performTask();

    // 开始定时执行任务
    scheduleTask();
});

// 后台定时执行任务的函数
function performTask() {
    // 在这里编写您的任务逻辑
    console.log("执行任务...");
    var stocks;
    getData('stocks').then((stockArr) => {
        stocks = stockArr;
        if (stocks == null) {
            stockList = [];
        } else {
            stockList = JSON.parse(stocks);
        }
        monitorStockPrice(stockList);
    });
}

function getData(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

function saveData(key, value) {
    chrome.storage.local.set({ [key]: value });
}

function monitorStockPrice(stockList) {
    var stocks = "";
    for (var k in stockList) {
        if (stockList[k].monitorHighPrice != '') {
            stocks += stockList[k].code + ",";
        }
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
                var highPrice = parseFloat(monitorStock.monitorHighPrice);
                if (now > highPrice) {
                    stockList[l].monitorHighPrice = '';
                    chrome.action.setBadgeText({ text: "1" });
                    var text = name + "突破监控价格" + highPrice +"，达到" + now;
                    saveData("MONITOR_TEXT", text);
                    saveData('stocks', JSON.stringify(stockList));
                    console.log("================监控价格超过", highPrice, "============");
                }
            }
        })
        .catch(error => {
            // 处理请求错误
            console.error(error);
        });
}