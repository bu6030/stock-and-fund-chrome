// 初始化首页大盘股数据
function initLargeMarketData() {
    var codes = largeMarketCode.join(',');
    var bigStocks = ajaxGetFundInvesterPositionDetail(codes);
    var str = "<div class=\"stock-large-market-container\">";
    for(let k in bigStocks) {
        var name = bigStocks[k].f14;
        var change = bigStocks[k].f4;
        var now = parseFloat(bigStocks[k].f2).toFixed(2);
        var changePercent = parseFloat(bigStocks[k].f3).toFixed(2);
        var aId = "id = 'large-market-" + bigStocks[k].f12 + "'";
        var style = "style=\""
            + (change == 0 ? "\"" : (change >= 0 ? "color:" + redColor + ";\"" : "color:" + blueColor + ";\""));
            // str += "<a " + style + aId + " >" + name + " " + now + "（" + change + "&nbsp;" + changePercent + "%） </a>";
        str = str + 
            '<div class=\"stock-large-market-box\"' + aId + '>' +
                '<p>' + name +'</p>' +
                '<p ' + style + '>' + now + '</p>' +
                '<p ' + style + '>' + changePercent + '%</p>' +
            '</div>';
    }
    str = str + '</div>';
    $("#stock-large-market").html(str);
    setTimeout(function() {
        // html 渲染完毕后 1s 执行
        // 点击上证指数
        if(document.getElementById('large-market-000001'))
        document.getElementById('large-market-000001').addEventListener('click', function () {
            timeImageCode = "sh000001";
            initLargeMarketClick();
        });
        // 点击深证成指
        if(document.getElementById('large-market-399001'))
        document.getElementById('large-market-399001').addEventListener('click', function () {
            timeImageCode = "sz399001";
            initLargeMarketClick();
        });
        // 点击创业板指
        if(document.getElementById('large-market-399006'))
        document.getElementById('large-market-399006').addEventListener('click', function () {
            timeImageCode = "sz399006";
            initLargeMarketClick();
        });
        // 点击恒生指数
        if(document.getElementById('large-market-HSI'))
        document.getElementById('large-market-HSI').addEventListener('click', function () {
            timeImageCode = "hkHSI";
            initLargeMarketClick();
        });
        // 点击纳斯达克指数
        if(document.getElementById('large-market-NDX'))
        document.getElementById('large-market-NDX').addEventListener('click', function () {
            timeImageCode = "usNDX";
            initLargeMarketClick();
        });
        // 点击道琼斯指数
        if(document.getElementById('large-market-DJIA'))
        document.getElementById('large-market-DJIA').addEventListener('click', function () {
            timeImageCode = "usDJIA";
            initLargeMarketClick();
        });
        // 点击标普500指数
        if(document.getElementById('large-market-SPX'))
        document.getElementById('large-market-SPX').addEventListener('click', function () {
            timeImageCode = "usSPX";
            initLargeMarketClick();
        });
        // 点击日经225指数
        if(document.getElementById('large-market-N225'))
        document.getElementById('large-market-N225').addEventListener('click', function () {
            timeImageCode = "N225";
            initLargeMarketClick();
        });
        // 点击韩国KOSPI指数
        if(document.getElementById('large-market-KS11'))
        document.getElementById('large-market-KS11').addEventListener('click', function () {
            timeImageCode = "KS11";
            initLargeMarketClick();
        });
        // 点击英国富时100指数
        if(document.getElementById('large-market-FTSE'))
        document.getElementById('large-market-FTSE').addEventListener('click', function () {
            timeImageCode = "FTSE";
            initLargeMarketClick();
        });
        // 点击德国DAX30指数
        if(document.getElementById('large-market-GDAXI'))
        document.getElementById('large-market-GDAXI').addEventListener('click', function () {
            timeImageCode = "GDAXI";
            initLargeMarketClick();
        });
        // 点击法国CAC40指数
        if(document.getElementById('large-market-FCHI'))
        document.getElementById('large-market-FCHI').addEventListener('click', function () {
            timeImageCode = "FCHI";
            initLargeMarketClick();
        });
        // 点击印度孟买SENSEX指数
        if(document.getElementById('large-market-SENSEX'))
        document.getElementById('large-market-SENSEX').addEventListener('click', function () {
            timeImageCode = "SENSEX";
            initLargeMarketClick();
        });
    }, 300);
}

// 初始化大盘指数 onclick 具体方法
function initLargeMarketClick() {
    timeImageType = "STOCK";
    $("#stock-code").val(timeImageCode);
    $("#stock-modal").modal("hide");
    $("#time-image-day-button")[0].style.display = 'block';
    $("#time-image-week-button")[0].style.display = 'block';
    $("#time-image-month-button")[0].style.display = 'block';
    $("#update-stock-fund-button")[0].style.display = 'none';
    $("#stock-fund-delete-button")[0].style.display = 'none';
    $("#stock-fund-monitor-button")[0].style.display = 'none';
    $("#fund-invers-position-button-3")[0].style.display = 'none';
    $("#fund-net-diagram-button-3")[0].style.display = 'none';
    $("#stock-fund-monitor-button")[0].style.display = 'block';
    $("#set-top-button-3")[0].style.display = 'none';
    $("#show-buy-or-sell-button-2")[0].style.display = 'none';
    showMinuteImage();
}

function largeMarketCodeSave() {
    // 使用 jQuery 选择所有选中的复选框
    let checkboxes = $('input#large-market-code-checkbox:checked');
    // 提取选中的值
    let selectedData = checkboxes.map(function() {
        return this.value;
    }).get();
    // 输出选中的数据
    console.log('=========',selectedData);
    largeMarketCode = selectedData;
    saveCacheData('large-market-code', JSON.stringify(selectedData));
    $("#setting-modal").modal("hide");
    // reloadDataAndHtml();
    initLargeMarketData();
}