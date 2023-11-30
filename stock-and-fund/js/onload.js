// 在浏览器打开窗口时，触发通知重新启动 background 定时任务的消息通知
window.addEventListener("load", async (event) => {
    //启动时发送消息
    chrome.runtime.sendMessage({ 'message' : 'scheduleTask' });

});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // 这里放置你想要在等待2秒后执行的代码，防止页面没有完全打开获取不到股票
        var tonghuashunElements = document.querySelectorAll('.code');
        var stockCodes = [];
        if (tonghuashunElements.length > 0) {
            for (let i = 0; i < tonghuashunElements.length; i++) {
                if (tonghuashunElements[i].outerHTML.startsWith('<span class=\"code\"')) {
                    let code = tonghuashunElements[i].textContent || tonghuashunElements[i].innerText;
                    if (code != '' && code != null && code != undefined) {
                        stockCodes.push(code);
                    }
                }
            }
        }
        // 获取 <div 元素>
        var xueqiuMore = document.querySelector('.optional__more');
        // 模拟点击事件
        xueqiuMore.click();
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
            }
        }, 1000); 
        if (stockCodes.length > 0) {
            chrome.runtime.sendMessage({ action: 'sendTonghuashunXueqiuStockCodes', content: stockCodes });
        }
    }, 2000); 
});