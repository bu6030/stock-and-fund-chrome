// 初始化首页大盘股数据
function initLargeMarketData() {
    var codes = largeMarketCode.join(',');
    let largetMarketTotalStr = '';
    // 如果没设置大盘指数，则设置大盘指数DIV为空
    if (codes == "") {
        $("#stock-large-market").html('<div class=\"stock-large-market-container\">' + largetMarketTotalStr + '</div>');
        return;
    }
    ajaxGetLargeMarketData(codes);
}
// 初始化首页大盘股数据回调方法
async function initLargeMarketDataCallBack(bigStocks) {
    let largetMarketTotalStr = '';
    largeMarketStockMaxs = '';
    largeMarketStockMins = '';
    var str = "<div class=\"stock-large-market-container\">";
    str += largetMarketTotalStr;
    for(let k in bigStocks) {
        var name = bigStocks[k].f14;
        if (bigStocks[k].f12 == 'CN00Y') {
            name = 'A50期指';
        }
        var change = bigStocks[k].f4;
        var now = parseFloat(bigStocks[k].f2).toFixed(2);
        if (bigStocks[k].f12 == 'USDCNH') {
            now = parseFloat(bigStocks[k].f2).toFixed(4);
        }
        var changePercent = parseFloat(bigStocks[k].f3).toFixed(2);
        var aId = "id = 'large-market-" + bigStocks[k].f12 + "'";
        largeMarketStockMaxs += bigStocks[k].f12 + '~' + bigStocks[k].f15 + '-';
        largeMarketStockMins += bigStocks[k].f12 + '~' + bigStocks[k].f16 + '-';
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
        // 点击恒生科技指数
        if(document.getElementById('large-market-HSTECH'))
        document.getElementById('large-market-HSTECH').addEventListener('click', function () {
            timeImageCode = "hkHSTECH";
            initLargeMarketClick();
        });
        // 点击A50期指指数
        if(document.getElementById('large-market-CN00Y'))
        document.getElementById('large-market-CN00Y').addEventListener('click', function () {
            timeImageCode = "CN00Y";
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
        // 点击微盘股
        if(document.getElementById('large-market-BK1158'))
        document.getElementById('large-market-BK1158').addEventListener('click', function () {
            timeImageCode = "BK1158";
            initLargeMarketClick();
        });
        // 点击COMEX黄金
        if(document.getElementById('large-market-GC00Y'))
            document.getElementById('large-market-GC00Y').addEventListener('click', function () {
                timeImageCode = "GC00Y";
                initLargeMarketClick();
        });
        // 点击美元离岸人民币
        if(document.getElementById('large-market-USDCNH'))
            document.getElementById('large-market-USDCNH').addEventListener('click', function () {
                timeImageCode = "USDCNH";
                initLargeMarketClick();
        });
        // 点击美元指数
        if(document.getElementById('large-market-UDI'))
            document.getElementById('large-market-UDI').addEventListener('click', function () {
                timeImageCode = "UDI";
                initLargeMarketClick();
        });
        // 点击NYMEX原油
        if(document.getElementById('large-market-CL00Y'))
            document.getElementById('large-market-CL00Y').addEventListener('click', function () {
                timeImageCode = "CL00Y";
                initLargeMarketClick();
        });
    }, 300);
}

// 初始化大盘指数 onclick 具体方法
function initLargeMarketClick() {
    timeImageType = "STOCK";
    $("#stock-code").val(timeImageCode);
    $("#stock-modal").modal("hide");
    $("#time-image-minute-button")[0].style.display = 'block';
    $("#time-image-minute-5day-button")[0].style.display = 'block';
    $("#time-image-day-button")[0].style.display = 'block';
    $("#time-image-week-button")[0].style.display = 'block';
    $("#time-image-month-button")[0].style.display = 'block';
    $("#update-stock-fund-button")[0].style.display = 'none';
    $("#stock-fund-delete-button")[0].style.display = 'none';
    $("#stock-fund-monitor-button")[0].style.display = 'none';
    $("#fund-invers-position-button-3")[0].style.display = 'none';
    $("#fund-net-diagram-button-3")[0].style.display = 'none';
    $("#stock-fund-monitor-button")[0].style.display = 'block';
    $("#show-set-top-or-end-button")[0].style.display = 'none';
    $("#show-buy-or-sell-button-2")[0].style.display = 'none';
    $("#time-image-pre-button")[0].style.display = 'none';
    $("#time-image-next-button")[0].style.display = 'none';
    $("#go-to-tiantianjijin-detail-button")[0].style.display = 'none';
    if (trendImageType == 'MINUTE') {
        showMinuteImage('1DAY');
    } else if (trendImageType == '5DAY') {
        showMinuteImage('5DAY');
    } else if (trendImageType == 'DAY') {
        showDayImage();
    } else if (trendImageType == 'WEEK') {
        showWeekImage();
    } else if (trendImageType == 'MONTH') {
        showMonthImage();
    } else if (trendImageType == '1MIN') {
        show1or5or15or30or60MinutesImage('1MIN');
    } else if (trendImageType == '5MIN') {
        show1or5or15or30or60MinutesImage('5MIN');
    } else if (trendImageType == '15MIN') {
        show1or5or15or30or60MinutesImage('15MIN');
    } else if (trendImageType == '30MIN') {
        show1or5or15or30or60MinutesImage('30MIN');
    } else if (trendImageType == '60MIN') {
        show1or5or15or30or60MinutesImage('60MIN');
    } else if (trendImageType == '120MIN') {
        show1or5or15or30or60MinutesImage('120MIN');
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
    // $("#setting-modal").modal("hide");
    initWindowsSize();
    initLargeMarketData();
}

function getlargetMarketTotalHtml (){
    let str = '<div class=\"stock-large-market-box\" id=\"larget-market-total\">' +
        '<p>持仓盈亏</p>' +
        '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncome + '</p>' +
        '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncomePercent + '%</p>' +
        '</div>';
    return str;
}

async function addLargeMarketCheckEvent() {
    $('input#large-market-code-checkbox[value="1.000001"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399001"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399006"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.HSI"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="124.HSTECH"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="104.CN00Y"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.SPX"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.DJIA"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.NDX"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.N225"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.KS11"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.FTSE"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.GDAXI"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.FCHI"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.SENSEX"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.TWII"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.VNINDEX"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000928"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000933"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000300"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399905"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000852"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.899050"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000688"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399997"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000926"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="2.930641"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="2.930708"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399989"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399986"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000941"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="2.931071"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="2.931582"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="90.BK1158"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="101.GC00Y"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="133.USDCNH"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.UDI"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="102.CL00Y"]').on('change', largeMarketCodeSave);
}