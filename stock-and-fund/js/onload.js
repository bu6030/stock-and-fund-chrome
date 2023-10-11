// 在浏览器打开窗口时，触发通知重新启动 background 定时任务的消息通知
window.addEventListener("load", async (event) => {
    //启动时发送消息
    chrome.runtime.sendMessage({ 'message' : 'scheduleTask' });
});