// 在浏览器打开窗口时，触发通知重新启动 background 定时任务的消息通知
window.addEventListener("load", async (event) => {
    //启动时发送消息
    chrome.runtime.sendMessage({ 'message' : 'scheduleTask' });

});

document.addEventListener('DOMContentLoaded', function() {
    // 这里放置你想要在等待2秒后执行的代码，防止页面没有完全打开获取不到股票
    setTimeout(function() {
        // 获取同花顺自选
        var tonghuashunElements = document.querySelectorAll('.code');
        var stockCodes = [];
        if (tonghuashunElements.length > 0) {
            for (let i = 0; i < tonghuashunElements.length; i++) {
                if (tonghuashunElements[i].outerHTML.startsWith('<span class=\"code\">')) {
                    let code = tonghuashunElements[i].textContent || tonghuashunElements[i].innerText;
                    if (code != '' && code != null && code != undefined && 
                    (code.startsWith('SZ') || code.startsWith('sz') || code.startsWith('SH') || code.startsWith('sh')
                    || code.startsWith('HK') || code.startsWith('hk'))) {
                        stockCodes.push(code);
                    }
                }
            }
        }
        // 获取东方财富自选
        var dongfangcaifuElements = document.querySelectorAll('.ui-draggable-handle');
        if (dongfangcaifuElements.length > 0) {
            for (let i = 0; i < dongfangcaifuElements.length; i++) {
                let codeType = dongfangcaifuElements[i].dataset.code.split('.')[0];
                let code = dongfangcaifuElements[i].dataset.code.split('.')[1];
                if (code != '' && code != null && code != undefined) {
                    if (code.length == 6 && code.startsWith("6")) {
                        code = "sh" + code;
                        stockCodes.push(code);
                    } else if (code.length == 6 && (code.startsWith("0") || code.startsWith("3"))) {
                        code = "sz" + code;
                        stockCodes.push(code);
                    } else if (code.length == 6 && (code.startsWith("1") || code.startsWith("5"))) {
                        if (codeType == '0') { 
                            code = "sz" + code;
                        } else {
                            code = "sh" + code;
                        }
                        stockCodes.push(code);
                    } else if(code.length == 5) {
                        code = "hk" + code;
                        stockCodes.push(code);
                    }
                }
            }
        }
        // 获取雪球自选
        var xueqiuMore = document.querySelector('.optional__more');
        if (xueqiuMore != null && xueqiuMore != '' && xueqiuMore!= undefined) {
            // 模拟点击事件
            if(xueqiuMore.lastElementChild.outerHTML.indexOf("<i class=\"iconfont\" style=\"\">") < 0) {
                xueqiuMore.click();
            }
            // 点击事件完成1秒后，确保股票全部展开
            setTimeout(function() {
                var xueqiuElements = document.querySelectorAll('.sortable');
                if (xueqiuElements.length > 0) {
                    for (let i = 0; i < xueqiuElements.length; i++) {
                        if(xueqiuElements[i].cells[0].innerHTML.startsWith('<a href=\"/S')) {
                            let code = xueqiuElements[i].cells[0].innerText.split('\n')[1];
                            if (code != '' && code != null && code != undefined) {
                                stockCodes.push(code);
                            }
                        }
                    }
                    if (stockCodes.length > 0) {
                        console.log('stockCodes.length=', stockCodes.length);
                        chrome.runtime.sendMessage({ action: 'sendTonghuashunXueqiuStockCodes', content: stockCodes });
                    }
                }
            }, 2000); 
        } else {
            if (stockCodes.length > 0) {
                console.log('stockCodes.length=', stockCodes.length);
                chrome.runtime.sendMessage({ action: 'sendTonghuashunXueqiuStockCodes', content: stockCodes });
            }
        }
    }, 2000); 
});