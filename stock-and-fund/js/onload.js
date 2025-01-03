// 在浏览器打开窗口时，触发通知重新启动 background 定时任务的消息通知
window.addEventListener("load", async (event) => {
    //启动时发送消息
    chrome.runtime.sendMessage({ 'message' : 'scheduleTask' });

});
// 启动时，获取同花顺/雪球/东方财富自选
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
                            || code.startsWith('HK') || code.startsWith('hk') || code.startsWith('US') || code.startsWith('us') || code.startsWith('hk'))) {
                        // console.log('code-tonghuashun:', code);
                        // 同花顺的股票编码不准确，需要去掉
                        code = codeTransform(code);
                        // console.log('code-tonghuashun1:', code);
                        stockCodes.push(code);
                    }
                }
            }
        }
        // 获取东方财富自选
        var dongfangcaifuElements = document.querySelectorAll('.ui-draggable-handle');
        if (dongfangcaifuElements.length > 0) {
            var checkboxes = document.querySelectorAll('.indexselect');

            // 遍历所有复选框，并打印出它们的 value 值
            checkboxes.forEach(function(checkbox) {
                let code = checkbox.value;
                if (code.length == 8 && code.startsWith("1")) {
                    code = "sh" + code.split(".")[1];
                    stockCodes.push(code);
                } else if (code.length == 8 && (code.startsWith("0"))) {
                    code = "sz" + code.split(".")[1];
                    stockCodes.push(code);
                } else if(code.length == 9 && code.startsWith("116")) {
                    code = "hk" + code.split(".")[1];
                    stockCodes.push(code);
                } else if (code.length == 6 && (code.startsWith("105") || code.startsWith("153") || code.startsWith("107") || code.startsWith("106"))) {
                    code = "us" + code.split(".")[1];
                    stockCodes.push(code);
                }
            });
            // for (let i = 0; i < dongfangcaifuElements.length; i++) {
            //     let codeType = dongfangcaifuElements[i].dataset.code.split('.')[0];
            //     let code = dongfangcaifuElements[i].dataset.code.split('.')[1];
            //     if (code != '' && code != null && code != undefined) {
            //         if (code.length == 6 && code.startsWith("6")) {
            //             code = "sh" + code;
            //             stockCodes.push(code);
            //         } else if (code.length == 6 && (code.startsWith("0") || code.startsWith("3"))) {
            //             code = "sz" + code;
            //             stockCodes.push(code);
            //         } else if (code.length == 6 && (code.startsWith("1") || code.startsWith("5"))) {
            //             // if (codeType == '0') { 
            //             //     code = "sz" + code;
            //             // } else {
            //                 code = "sh" + code;
            //             // }
            //             stockCodes.push(code);
            //         } else if(code.length == 5 && isNumeric(code)) {
            //             code = "hk" + code;
            //             stockCodes.push(code);
            //         } else {
            //             code = "us" + code;
            //             stockCodes.push(code); 
            //         }
            //     }
            // }
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
                            // console.log('code-xueqiu0:', code);
                            if (code != '' && code != null && code != undefined) {
                                code = codeTransform(code);
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
// 判断是否为数字
function isNumeric(str) {
    return str !== "" && !isNaN(Number(str));
}
// 股票编码处理
function codeTransform(code) {
    code = code.replace('SH', '').replace('sh', '')
    .replace('SZ', '').replace('sz', '')
    .replace('HK', '').replace('hk', '')
    .replace('USA', '').replace('usa', '')
    .replace('US', '').replace('us', '');
    if (code.length == 6 && code.startsWith("6")) {
        code = "sh" + code;
    } else if (code.length == 6 && (code.startsWith("0") || code.startsWith("3"))) {
        code = "sz" + code;
    } else if (code.length == 6 && (code.startsWith("1") || code.startsWith("5"))) {
        code = "sz" + code;
    } else if (code.length == 5 && isNumeric(code)) {
        code = "hk" + code;
    } else if (code.length == 4 && isNumeric(code)) {
        code = "hk0" + code;
    } else {
        code = "us" + code;
    }
    return code;
}