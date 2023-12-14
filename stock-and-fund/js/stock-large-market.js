// 初始化首页大盘股数据
function initLargeMarketData() {
    var stocks = "sh000001,sz399001,sz399006,hkHSI"
    $.ajax({
        url: Env.GET_STOCK_FROM_GTIMG + "q=" + stocks,
        type: "get",
        data: {},
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var stoksArr = data.split("\n");
            var str = "";
            for (var k in stoksArr) {
                var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                var stockCode = stoksArr[k].substring(2, stoksArr[k].indexOf("="));
                if (dataStr == '' || dataStr == null) {
                    break;
                }
                var values = dataStr.split("~");
                var name = values[1] + "";
                var change = values[31] + "";
                var now = values[3] + "";
                var changePercent = values[32] + "";
                var aId = "id = 'large-market-" + stockCode + "'";
                var style = "style=\"font-size:11px;font-weight:600;"
                    + (change == 0 ? "\"" : (change >= 0 ? "color:" + redColor + ";\"" : "color:" + blueColor + ";\""));
                str += "<a " + style + aId + " >" + name + " " + now + "（" + change + "&nbsp;" + changePercent + "%） </a>";
            }
            if (largeMarketScroll == 'SCROOL') {
                str = '<span>' + str + '</span>';
            }
            $("#stock-large-market").html(str);
            setTimeout(function() {
                // html 渲染完毕后 1s 执行
                // 点击上证指数
                document.getElementById('large-market-sh000001').addEventListener('click', function () {
                    timeImageCode = "sh000001";
                    initLargeMarketClick();
                });
                // 点击深证成指
                document.getElementById('large-market-sz399001').addEventListener('click', function () {
                    timeImageCode = "sz399001";
                    initLargeMarketClick();
                });
                // 点击创业板指
                document.getElementById('large-market-sz399006').addEventListener('click', function () {
                    timeImageCode = "sz399006";
                    initLargeMarketClick();
                });
            }, 300);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// 初始化大盘指数 onclick 具体方法
function initLargeMarketClick() {
    timeImageType = "STOCK";
    let path = Env.GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA + timeImageCode + ".gif";
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

    $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}