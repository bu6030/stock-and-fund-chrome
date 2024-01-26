// 初始化首页大盘股数据
function initLargeMarketData() {
    var codes = "1.000001,0.399001,0.399006,100.HSI,100.SPX,100.DJIA,100.NDX";
    var bigStocks = ajaxGetFundInvesterPositionDetail(codes);
    var str = "<div class=\"stock-large-market-container\">";
    for(let k in bigStocks) {
        var name = bigStocks[k].f14;
        var change = bigStocks[k].f4;
        var now = bigStocks[k].f2;
        var changePercent = bigStocks[k].f3;
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
        document.getElementById('large-market-000001').addEventListener('click', function () {
            timeImageCode = "sh000001";
            initLargeMarketClick();
        });
        // 点击深证成指
        document.getElementById('large-market-399001').addEventListener('click', function () {
            timeImageCode = "sz399001";
            initLargeMarketClick();
        });
        // 点击创业板指
        document.getElementById('large-market-399006').addEventListener('click', function () {
            timeImageCode = "sz399006";
            initLargeMarketClick();
        });
        // 点击恒生指数
        document.getElementById('large-market-HSI').addEventListener('click', function () {
            timeImageCode = "hkHSI";
            initLargeMarketClick();
        });
        // 点击纳斯达克指数
        document.getElementById('large-market-NDX').addEventListener('click', function () {
            timeImageCode = "usNDX";
            initLargeMarketClick();
        });
        // 点击道琼斯指数
        document.getElementById('large-market-DJIA').addEventListener('click', function () {
            timeImageCode = "usDJIA";
            initLargeMarketClick();
        });
        // 点击标普500指数
        document.getElementById('large-market-SPX').addEventListener('click', function () {
            timeImageCode = "usSPX";
            initLargeMarketClick();
        });
    }, 300);
    // var stocks = "sh000001,sz399001,sz399006,hkHSI";
    // $.ajax({
    //     url: Env.GET_STOCK_FROM_GTIMG + "q=" + stocks,
    //     type: "get",
    //     data: {},
    //     dataType: 'text',
    //     contentType: 'application/x-www-form-urlencoded',
    //     success: function (data) {
    //         var stoksArr = data.split("\n");
    //         var str = "<div class=\"stock-large-market-container\">";
    //         for (var k in stoksArr) {
    //             var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
    //             var stockCode = stoksArr[k].substring(2, stoksArr[k].indexOf("="));
    //             if (dataStr == '' || dataStr == null) {
    //                 break;
    //             }
    //             var values = dataStr.split("~");
    //             var name = values[1] + "";
    //             var change = values[31] + "";
    //             var now = values[3] + "";
    //             var changePercent = values[32] + "";
    //             var aId = "id = 'large-market-" + stockCode + "'";
    //             var style = "style=\""
    //                 + (change == 0 ? "\"" : (change >= 0 ? "color:" + redColor + ";\"" : "color:" + blueColor + ";\""));
    //             // str += "<a " + style + aId + " >" + name + " " + now + "（" + change + "&nbsp;" + changePercent + "%） </a>";
    //             str = str + 
    //                 '<div class=\"stock-large-market-box\"' + aId + '>' +
    //                     '<p>' + name +'</p>' +
    //                     '<p ' + style + '>' + now + '</p>' +
    //                     '<p ' + style + '>' + changePercent + '%</p>' +
    //                 '</div>';
    //         }
    //         str = str + '</div>';
    //         // if (largeMarketScroll == 'SCROOL') {
    //         //     str = '<span>' + str + '</span>';
    //         // }
    //         $("#stock-large-market").html(str);
    //         setTimeout(function() {
    //             // html 渲染完毕后 1s 执行
    //             // 点击上证指数
    //             document.getElementById('large-market-sh000001').addEventListener('click', function () {
    //                 timeImageCode = "sh000001";
    //                 initLargeMarketClick();
    //             });
    //             // 点击深证成指
    //             document.getElementById('large-market-sz399001').addEventListener('click', function () {
    //                 timeImageCode = "sz399001";
    //                 initLargeMarketClick();
    //             });
    //             // 点击创业板指
    //             document.getElementById('large-market-sz399006').addEventListener('click', function () {
    //                 timeImageCode = "sz399006";
    //                 initLargeMarketClick();
    //             });
    //             // 点击恒生指数
    //             document.getElementById('large-market-hkHSI').addEventListener('click', function () {
    //                 timeImageCode = "hkHSI";
    //                 initLargeMarketClick();
    //             });
    //         }, 300);
    //     },
    //     error: function (XMLHttpRequest, textStatus, errorThrown) {
    //         console.log(XMLHttpRequest.status);
    //         console.log(XMLHttpRequest.readyState);
    //         console.log(textStatus);
    //     }
    // });
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