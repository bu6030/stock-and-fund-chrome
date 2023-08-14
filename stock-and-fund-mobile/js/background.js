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