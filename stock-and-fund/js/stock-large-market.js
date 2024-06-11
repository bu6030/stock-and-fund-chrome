// 初始化首页大盘股数据
function initLargeMarketData() {
    var codes = largeMarketCode.join(',');
    let largetMarketTotalStr = '';
    if (largetMarketTotalDisplay) {
        largetMarketTotalStr = '<div class=\"stock-large-market-box\" id=\"larget-market-total\">' +
            '<p>持仓盈亏</p>' +
            '<p style=\"color:' + redColor + ';\">--</p>' +
            '<p style=\"color:' + redColor + ';\">--%</p>' +
        '</div>'
    }
    // 如果没设置大盘指数，则设置大盘指数DIV为空
    if (codes == "") {
        $("#stock-large-market").html('<div class=\"stock-large-market-container\">' + largetMarketTotalStr + '</div>');
        return;
    }
    var bigStocks = ajaxGetFundInvesterPositionDetail(codes);
    var str = "<div class=\"stock-large-market-container\">";
    str += largetMarketTotalStr;
    for(let k in bigStocks) {
        var name = bigStocks[k].f14;
        var change = bigStocks[k].f4;
        var now = parseFloat(bigStocks[k].f2).toFixed(2);
        var changePercent = parseFloat(bigStocks[k].f3).toFixed(2);
        var aId = "id = 'large-market-" + bigStocks[k].f12 + "'";
        var style = "style=\""
            + (change == 0 ? "\"" : (change >= 0 ? "color:" + redColor + ";\"" : "color:" + blueColor + ";\""));
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
        // 点击印台湾加权指数
        if(document.getElementById('large-market-TWII'))
        document.getElementById('large-market-TWII').addEventListener('click', function () {
            timeImageCode = "TWII";
            initLargeMarketClick();
        });
        // 点击印台湾加权指数
        if(document.getElementById('large-market-VNINDEX'))
        document.getElementById('large-market-VNINDEX').addEventListener('click', function () {
            timeImageCode = "VNINDEX";
            initLargeMarketClick();
        });
        // 点击沪深300指数
        if(document.getElementById('large-market-000300'))
        document.getElementById('large-market-000300').addEventListener('click', function () {
            timeImageCode = "sh000300";
            initLargeMarketClick();
        });
        // 点击中证500指数
        if(document.getElementById('large-market-399905'))
        document.getElementById('large-market-399905').addEventListener('click', function () {
            timeImageCode = "sz399905";
            initLargeMarketClick();
        });
        // 点击中证1000指数
        if(document.getElementById('large-market-000852'))
        document.getElementById('large-market-000852').addEventListener('click', function () {
            timeImageCode = "sh000852";
            initLargeMarketClick();
        });
        // 点击北证50指数
        if(document.getElementById('large-market-899050'))
        document.getElementById('large-market-899050').addEventListener('click', function () {
            timeImageCode = "899050";
            initLargeMarketClick();
        });
        // 点击科创50指数
        if(document.getElementById('large-market-000688'))
        document.getElementById('large-market-000688').addEventListener('click', function () {
            timeImageCode = "sh000688";
            initLargeMarketClick();
        });
        // 点击中证能源
        if(document.getElementById('large-market-000928'))
        document.getElementById('large-market-000928').addEventListener('click', function () {
            timeImageCode = "sh000928";
            initLargeMarketClick();
        });
        // 点击中证白酒
        if(document.getElementById('large-market-399997'))
        document.getElementById('large-market-399997').addEventListener('click', function () {
            timeImageCode = "sz399997";
            initLargeMarketClick();
        });
        // 点击中证医药
        if(document.getElementById('large-market-000933'))
        document.getElementById('large-market-000933').addEventListener('click', function () {
            timeImageCode = "sh000933";
            initLargeMarketClick();
        });
        // 点击中证中药
        if(document.getElementById('large-market-930641'))
        document.getElementById('large-market-930641').addEventListener('click', function () {
            timeImageCode = "930641";
            initLargeMarketClick();
        });
        // 点击中证央企
        if(document.getElementById('large-market-000926'))
        document.getElementById('large-market-000926').addEventListener('click', function () {
            timeImageCode = "sh000926";
            initLargeMarketClick();
        });
        // 点击中证有色
        if(document.getElementById('large-market-930708'))
        document.getElementById('large-market-930708').addEventListener('click', function () {
            timeImageCode = "930708";
            initLargeMarketClick();
        });
        // 点击中证医疗
        if(document.getElementById('large-market-399989'))
        document.getElementById('large-market-399989').addEventListener('click', function () {
            timeImageCode = "sz399989";
            initLargeMarketClick();
        });
        // 点击中证银行
        if(document.getElementById('large-market-399986'))
        document.getElementById('large-market-399986').addEventListener('click', function () {
            timeImageCode = "sz399986";
            initLargeMarketClick();
        });
        // 点击新能源
        if(document.getElementById('large-market-000941'))
        document.getElementById('large-market-000941').addEventListener('click', function () {
            timeImageCode = "sh000941";
            initLargeMarketClick();
        });
        // 点击人工智能
        if(document.getElementById('large-market-931071'))
        document.getElementById('large-market-931071').addEventListener('click', function () {
            timeImageCode = "931071";
            initLargeMarketClick();
        });
        // 点击数字经济
        if(document.getElementById('large-market-931582'))
        document.getElementById('large-market-931582').addEventListener('click', function () {
            timeImageCode = "931582";
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
    if (trendImageType == 'MINUTE') {
        showMinuteImage();
    } else if (trendImageType == 'DAY') {
        showDayImage();
    } else if (trendImageType == 'WEEK') {
        showWeekImage();
    } else if (trendImageType == 'MONTH') {
        showMonthImage();
    }
}

function largeMarketCodeSave() {
    // 使用 jQuery 选择所有选中的复选框
    let checkboxes = $('input#large-market-code-checkbox:checked');
    // 提取选中的值
    let selectedData = checkboxes.map(function() {
        return this.value;
    }).get();
    largeMarketCode = selectedData;
    saveCacheData('large-market-code', JSON.stringify(selectedData));
    $("#setting-modal").modal("hide");
    initLargeMarketData();
}