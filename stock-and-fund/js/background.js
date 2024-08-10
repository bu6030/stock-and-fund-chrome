let isCycleInvest = false;
let performTaskId;
let count = 0;
let isFirefox = false;
// 检测是否为 Firefox
if (typeof browser !== "undefined" && typeof browser.runtime !== "undefined") {
    // Firefox 环境中，映射 chrome 到 browser
    chrome = browser;
    isFirefox = true;
}
// 定时执行任务的函数
function scheduleTask() {
    // 设置定时器，每隔一定时间执行 performTask 函数
    performTaskId = setInterval(performTask, 20000); // 20s，您可以根据需要进行调整
    changeDefaultIcon();
}

// 当扩展程序安装时触发的事件
chrome.runtime.onInstalled.addListener(scheduleTask);
// 当浏览器打开时触发的事件
chrome.runtime.onStartup.addListener(scheduleTask);
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
            if (fundArr != null && fundArr != "[]") {
                monitorFundCycleInvest(JSON.parse(fundArr));
            } else {
                monitorFundCycleInvest(JSON.parse("[]"));
            }
        });
        getData('monitor-top-20-stock').then((monitoTop20Stock) => {
            if (count % 3 == 0) {
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
// 后台监控突破价格并提示
function monitorStockPrice(stockList) {
    var date = new Date();
    console.log("执行突破价格监控任务...", date.toLocaleString());
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
                || (typeof stockList[k].monitorLowerPercent != 'undefined' && stockList[k].monitorLowerPercent != '')) {
                // stocks += stockList[k].code + ",";
                stocks += getSecidBack(stockList[k].code) + '.' + stockList[k].code.replace('sh', '').replace('sz', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_') + ',';
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
                        if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色正常
                            blueColor = '#093'; 
                            redColor = '#ee2500';
                        }
                        // 在这里处理返回的数据
                        // var stoksArr = data.split("\n");
                        var stoksArr = response.data.diff;
                        for (let k in stoksArr) {
                            var monitorStock;
                            for (let l in stockList) {
                                // if (stockList[l].code == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))) {
                                if(stoksArr[k].f12 == stockList[l].code.replace('sh', '').replace('sz', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_')){
                                    monitorStock = stockList[l];
                                }
                            }
                            // var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                            // var values = dataStr.split("~");
                            // var name = monitorStock.name;
                            // var now = parseFloat(values[3]);
                            var name = stoksArr[k].f14 + "";
                            var now = parseFloat(stoksArr[k].f2 + "");
                            if (typeof monitorStock.monitorHighPrice != 'undefined' && monitorStock.monitorHighPrice != '') {
                                var highPrice = parseFloat(monitorStock.monitorHighPrice);
                                if (now > highPrice) {
                                    monitorStock.monitorAlert = '1';
                                    monitorStock.monitorAlertDate = Date.now();
                                    sendChromeBadge('#FFFFFF', redColor, "" + now);
                                    var text = name + "涨破监控价格" + highPrice + "，达到" + now;
                                    saveData('stocks', JSON.stringify(stockList));
                                    saveData("MONITOR_STOCK_CODE", '');
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
                                    saveData("MONITOR_STOCK_CODE", '');
                                    showNotification("通知", text);
                                    console.log("================监控价格跌破", lowPrice, "============");
                                }
                            }
                            // 日涨幅提醒
                            if (typeof monitorStock.monitorUpperPercent != 'undefined' && monitorStock.monitorUpperPercent != '') {
                                var upperPercent = parseFloat(monitorStock.monitorUpperPercent);
                                // var openPrice = parseFloat(values[4]);
                                var openPrice = parseFloat(stoksArr[k].f18 + "");
                                let currentPercent = (now - openPrice) / openPrice * 100;
                                if (currentPercent >= upperPercent) {
                                    monitorStock.monitorAlert = '3';
                                    monitorStock.monitorAlertDate = Date.now();
                                    sendChromeBadge('#FFFFFF', redColor, upperPercent + "%");
                                    var text = name + "涨幅超过" + upperPercent + "%，达到" + currentPercent + "%";
                                    saveData('stocks', JSON.stringify(stockList));
                                    saveData("MONITOR_STOCK_CODE", '');
                                    showNotification("通知", text);
                                    console.log("================日涨幅提醒", upperPercent, "%============");
                                }
                            }
                            // 日跌幅提醒
                            if (typeof monitorStock.monitorLowerPercent != 'undefined' && monitorStock.monitorLowerPercent != '') {
                                var lowerPercent = parseFloat(monitorStock.monitorLowerPercent);
                                // var openPrice = parseFloat(values[4]);
                                var openPrice = parseFloat(stoksArr[k].f18 + "");
                                let currentPercent = (openPrice - now) / openPrice * 100;
                                if (currentPercent >= lowerPercent) {
                                    monitorStock.monitorAlert = '4';
                                    monitorStock.monitorAlertDate = Date.now();
                                    sendChromeBadge('#FFFFFF', blueColor, lowerPercent + "%");
                                    var text = name + "跌幅超过" + lowerPercent + "%，达到" + currentPercent + "%";
                                    saveData('stocks', JSON.stringify(stockList));
                                    saveData("MONITOR_STOCK_CODE", '');
                                    showNotification("通知", text);
                                    console.log("================日跌幅提醒", lowerPercent, "%============");
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
        let secIdStock = getSecidBack(code) + '.' + code.replace('sh', '').replace('sz', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_') + ',';
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
                        if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色正常
                            blueColor = '#093'; 
                            redColor = '#ee2500';
                        }
                        // const decoder = new TextDecoder('GBK');
                        // data = decoder.decode(data);
                        // 在这里处理返回的数据
                        // var stoksArr = data.split("\n");
                        // var dataStr = stoksArr[0].substring(stoksArr[0].indexOf("=") + 2, stoksArr[0].length - 2);
                        // var values = dataStr.split("~");
                        let stock = response.data.diff[0];
                        // var name = values[1];
                        // var now = values[3];
                        // var openPrice = values[4];
                        var name = stock.f14 + "";
                        var now = stock.f2 + "";
                        var openPrice = parseFloat(stock.f18 + "");
                        var badgeBackgroundColor;
                        // var changePercent = parseFloat(values[32]);
                        var changePercent = parseFloat(stock.f3).toFixed(2);
                        if (parseFloat(now) >= parseFloat(openPrice)) {
                            // badgeBackgroundColor = '#ee2500';
                            badgeBackgroundColor = redColor
                        } else {
                            // badgeBackgroundColor = '#093';
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
                                sendChromeBadge('#FFFFFF', badgeBackgroundColor, "" + changePercent.toFixed(2));
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
// async function monitorTop20StockChromeTitle(monitoTop20Stock) {
//     var date = new Date();
//     console.log("执行扩展程序图标鼠标悬停后展示前20个股票价格任务...", date.toLocaleString());
//     if (isTradingTime(date)) {
//         console.log("交易时间，执行任务...");
//         let stockArr = await getData('stocks');
//         if (stockArr == null || stockArr == undefined) {
//             stockArr = '[]';
//         }
//         var stockList = JSON.parse(stockArr);
//         var stocks = "sh000001,sz399001,sz399006,hkHSI,";
//         for (let k in stockList) {
//             stocks += stockList[k].code.replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','') + ",";
//         }
//         let response;
//         try {
//             response = await fetch("http://qt.gtimg.cn/q=" + stocks);
//         } catch (error) {
//             console.warn("监控前20个股票以及计算盈亏获取股票数据错误: ", error);
//             return;
//         }
//         let data = await response.arrayBuffer();
//         var count = 0;
//         const decoder = new TextDecoder('GBK');
//         data = decoder.decode(data);
//         // 在这里处理返回的数据
//         var title = '';
//         var stoksArr = data.split("\n");
//         var stockDayIncome = 0.00;
//         // var stockTotalIncome = 0.00;
//         var date = '';
//         for (let k in stoksArr) {
//             try {
//                 // console.log('stoksArr[k]=', stoksArr[k]);
//                 var stock = undefined;
//                 for (let l in stockList) {
//                     if(stockList[l].code.replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','') == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))){
//                         stock = stockList[l];
//                         break;
//                     }
//                 }
//                 // console.log('stock=', stock);
//                 var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
//                 var values = dataStr.split("~");
//                 var name = values[1];
//                 var code = values[2];
//                 if (name == undefined) {
//                     continue;
//                 }
//                 var now = parseFloat(values[3]);
//                 var changePercent = parseFloat(values[32]).toFixed(2);
//                 var dayIncome = 0.00;
//                 if (stock != undefined) {
//                     if (stock.code.indexOf('hk') >= 0 || stock.code.indexOf('HK') >= 0) {
//                         dayIncome = await getHuilvDayIncome(parseFloat(values[31]) * parseFloat(stock.bonds), 'HK');
//                     } else if (stock.code.indexOf('us') >= 0 || stock.code.indexOf('US') >= 0) {
//                         dayIncome = await getHuilvDayIncome(parseFloat(values[31]) * parseFloat(stock.bonds), 'US');
//                     } else {
//                         dayIncome = parseFloat(values[31]) * parseFloat(stock.bonds);
//                     }
//                     // console.log('dayIncome=',stock.name, dayIncome);
//                     // stockTotalIncome += (now - parseFloat(stock.costPrise)) * parseFloat(stock.bonds);
//                 }
//                 stockDayIncome += dayIncome;
//                 if (count <= 24) {
//                     var kongge = '';
//                         switch(name.length) {
//                             case 3: 
//                                 kongge = '         ';
//                                 break;
//                             case 4: 
//                                 kongge = '     ';
//                                 break;
//                             case 5: 
//                                 kongge = '     ';
//                                 break;
//                             case 6: 
//                                 kongge = '  ';
//                                 break;
//                         }
//                     if (code == '000001' || code =='399001' || code =='399006' || code == 'HSI' 
//                         || (monitoTop20Stock != null && monitoTop20Stock == true)) {
//                         title += (name + kongge + now + '(' + changePercent + "%)\n");
//                     }
//                 }
//                 var value30 = values[30].replaceAll('/','').replaceAll('-','').replaceAll(' ','').replaceAll(':','');
//                 if (value30.substring(0, 8) > date) {
//                     // 如果当前日期大于之前存储的最大日期，则更新最大日期
//                     date = values[30].substring(0, 8);
//                 }
//                 count++;
//             } catch (error) {
//                 console.warn("监控前20个股票以及计算盈亏股票处理错误: ", error);
//             }
//         }
//         title = title.substring(0, title.length - 1);
//         let funcIncome = await getFundIncome(date);
//         if (funcIncome == null) {
//             return;
//         }
//         let funcDayIncome = funcIncome.fundDayIncome;
//         // let fundTotalIncome = funcIncome.fundTotalIncome;
//         let totalDayIncome = funcDayIncome + stockDayIncome;
//         // let totalIncome = fundTotalIncome + stockTotalIncome;
//         title += '\n\n当日股票收益：' + stockDayIncome.toFixed(2);
//         title += '\n当日基金收益：' + funcDayIncome.toFixed(2);
//         title += '\n当日总收益：' + totalDayIncome.toFixed(2);
//         let blueColor = await getData('blueColor');
//         if (blueColor == null) {
//             blueColor = '#093';
//         }
//         let redColor = await getData('redColor');
//         if (redColor == null) {
//             redColor = '#ee2500';
//         }
//         if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色正常
//             blueColor = '#093'; 
//             redColor = '#ee2500';
//         }
//         let monitorPriceOrPercent =  await getData('monitor-price-or-percent');
//         if (monitorPriceOrPercent == 'DAY_INCOME') {
//             let color = totalDayIncome > 0 ? redColor : blueColor;
//             if (totalDayIncome < 0) {
//                 totalDayIncome = 0 - totalDayIncome;
//             }
//             if (totalDayIncome > 9999.99) {
//                 totalDayIncome = Math.floor(totalDayIncome/10000*10)/10 + "w";
//             } else if (totalDayIncome > 99.99) {
//                 totalDayIncome = Math.floor(totalDayIncome);
//             } else if (totalDayIncome > 9.99) {
//                 totalDayIncome = Math.floor(totalDayIncome * 10) / 10;
//             } else {
//                 totalDayIncome = totalDayIncome.toFixed(2);
//             }
//             sendChromeBadge('#FFFFFF', color, totalDayIncome + "");
//         }
//         saveDayIncomehistory(stockDayIncome.toFixed(2), funcDayIncome.toFixed(2), date);
//         setChromeTitle(title);
//     }
// }
// 扩展程序图标鼠标悬停后展示前20个股票价格
async function monitorTop20StockChromeTitle(monitoTop20Stock) {
    var date = new Date();
    console.log("执行扩展程序图标鼠标悬停后展示前20个股票价格任务...", date.toLocaleString());
    if (isTradingTime(date)) {
        console.log("交易时间，执行任务...");
        let stockArr = await getData('stocks');
        if (stockArr == null || stockArr == undefined) {
            stockArr = '[]';
        }
        var stockList = JSON.parse(stockArr);
        var secIdStockArr = '1.000001,0.399001,0.399006,100.HSI,';
        for (var k in stockList) {
            let code = stockList[k].code;
            secIdStockArr += getSecidBack(code) + '.' + stockList[k].code.replace('sh', '').replace('sz', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_') + ',';
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
        let stoksArr = response.data.diff;
        // 在这里处理返回的数据
        var title = '';
        var stockDayIncome = 0.00;
        var date = '';
        for (let k in stoksArr) {
            try {
                var stock = undefined;
                for (let l in stockList) {
                    if(stoksArr[k].f12 == stockList[l].code.replace('sh', '').replace('sz', '').replace('hk', '').replace('us', '').replace('.oq','').replace('.ps','').replace('.n','').replace('.am','').replace('.OQ','').replace('.PS','').replace('.N','').replace('.AM','').replace('.', '_')){
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
                var changePercent = parseFloat(stoksArr[k].f3).toFixed(2);
                var dayIncome = 0.00;
                if (stock != undefined) {
                    if (stock.code.indexOf('hk') >= 0 || stock.code.indexOf('HK') >= 0) {
                        dayIncome = await getHuilvDayIncome(parseFloat(stoksArr[k].f4 + "") * parseFloat(stock.bonds), 'HK');
                    } else if (stock.code.indexOf('us') >= 0 || stock.code.indexOf('US') >= 0) {
                        dayIncome = await getHuilvDayIncome(parseFloat(stoksArr[k].f4 + "") * parseFloat(stock.bonds), 'US');
                    } else {
                        dayIncome = parseFloat(stoksArr[k].f4 + "") * parseFloat(stock.bonds);
                    }
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
                var value30 = getDateStrFromTimestamp(stoksArr[k].f124*1000).replaceAll('/','').replaceAll('-','').replaceAll(' ','').replaceAll(':','');
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
        title += '\n\n当日股票收益：' + stockDayIncome.toFixed(2);
        title += '\n当日基金收益：' + funcDayIncome.toFixed(2);
        title += '\n当日总收益：' + totalDayIncome.toFixed(2);
        let blueColor = await getData('blueColor');
        if (blueColor == null) {
            blueColor = '#093';
        }
        let redColor = await getData('redColor');
        if (redColor == null) {
            redColor = '#ee2500';
        }
        if (redColor == '#545454' || blueColor == '#545454') {// 已经是隐身模式了角标红绿颜色正常
            blueColor = '#093'; 
            redColor = '#ee2500';
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
// 统计基金当日盈利
async function getFundIncome(date) {
    let fundList = await getData('funds');
    if (fundList == null || fundList == '' || fundList == undefined || fundList == 'undefined') {
        fundList = [];
    } else {
        fundList = JSON.parse(fundList);
    }
    let fundDayIncome = parseFloat("0");
    let fundTotalIncome = parseFloat("0");
    let isFailed = false;
    let promises = fundList.map(async (fund) => {
        try {
            if (fund.bonds !== null && parseFloat(fund.bonds) > 0) {
                let fundNetDiagramResponse = await fetch(`https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx?FCODE=${fund.fundCode}&RANGE=y&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=`);
                let fundNetDiagramData = await fundNetDiagramResponse.text();
                let fundNetDiagramJson = JSON.parse(fundNetDiagramData);
                let currentDayNetDiagram = null;
                for (let i = 0; i < fundNetDiagramJson.Datas.length; i++) {
                    if (fundNetDiagramJson.Datas[i].FSRQ.replaceAll('-', '') == date) {
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
                    saveData('previous_day_jingzhi_' + fund.fundCode, previousDayNetDiagram.DWJZ);
                    saveData('current_day_jingzhi_' + fund.fundCode, currentDayNetDiagram.DWJZ);
                    saveData('current_day_jingzhi_date_' + fund.fundCode, date);
                } else {
                    let response = await fetch(`http://fundgz.1234567.com.cn/js/${fund.fundCode}.js`);
                    let data = await response.text();
                    if (data != 'jsonpgz();') {
                        var json = JSON.parse(data.substring(8, data.length - 2));
                        let gztime = json.gztime.substring(0, 10).replaceAll('-', '');
                        // 如果日期不一致不在计算
                        if (date != gztime) return;
                        let dayIncome = parseFloat(json.gszzl) * parseFloat(json.dwjz) * parseFloat(fund.bonds) / 100;
                        fundDayIncome = fundDayIncome + dayIncome;
                        let totalIncome = (parseFloat(json.gsz) - parseFloat(fund.costPrise)) * parseFloat(fund.bonds);
                        fundTotalIncome = fundTotalIncome + totalIncome;
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
        "fundTotalIncome" : fundTotalIncome
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
    // console.log('huilv',huilv);
    if (huilvConvert) {
        newDayIncome = parseFloat(dayIncome + "") * parseFloat(huilv + "");
        // console.log('newDayIncome',newDayIncome);
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
    } else if(code.startsWith('sz') || code.startsWith('SZ')) {
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
        }
    } else if(code.startsWith('9')) {
        secid = '2';
    } else {
        secid = '0';
        if(code == 'N225' || code == 'KS11' || code =='FTSE' || code == 'GDAXI' || code =='FCHI' || code == 'SENSEX' || code == 'TWII' || code == 'HSI' || code == 'VNINDEX' || code == 'N100' || code == 'N300' || code == 'N500' || code == 'N1000' || code == 'N2000' || code == 'N3000' || code == 'N5000'){
            secid = '100';
        } else if(code == 'HSTECH'){
            secid = '124';
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