// 初始化首页大盘股数据
function initLargeMarketData() {
    var stocks = "sh000001,sz399001,sz399006"
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
                if(dataStr == '' || dataStr == null) {
                    break;
                }
                var values = dataStr.split("~");
                var name = values[1] + "";
                var change = values[31] + "";
                var now = values[3] + "";
                var changePercent = values[32] + "";
                var aId = "id = 'large-market-" + stockCode + "'";
                var style = "style=\"font-size: 9px;font-weight:600;"
                    + (change == 0 ? "" : (change >= 0?"color:#c12e2a;\"":"color:#3e8f3e;\""));
                str += "<a " + style + aId +" >" + name + " " + now + "（" + change + "&nbsp;&nbsp;" + changePercent +"%）   </a>";
            }
            $("#stock-large-market").html(str);

            let largeMarketSh000001 = document.getElementById('large-market-sh000001');
            largeMarketSh000001.addEventListener('click', function () {
                timeImageCode = "sh000001";
                let path = Env.GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA + timeImageCode + ".gif";
                $("#stock-modal").modal("hide");
                $("#time-image-day-button")[0].style.display  = 'block';
                $("#time-image-week-button")[0].style.display  = 'block';
                $("#time-image-month-button")[0].style.display  = 'block';
                $("#update-stock-fund-button")[0].style.display  = 'none';
                $("#time-image-modal").modal();
                $("#time-image").html('<img src="'+path+'" width="100%" length="100%" />');
            });
            let largeMarketSz399001 = document.getElementById('large-market-sz399001');
            largeMarketSz399001.addEventListener('click', function () {
                timeImageCode = "sz399001";
                let path = Env.GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA + timeImageCode + ".gif";
                $("#stock-modal").modal("hide");
                $("#time-image-day-button")[0].style.display  = 'block';
                $("#time-image-week-button")[0].style.display  = 'block';
                $("#time-image-month-button")[0].style.display  = 'block';
                $("#update-stock-fund-button")[0].style.display  = 'none';
                $("#time-image-modal").modal();
                $("#time-image").html('<img src="'+path+'" width="100%" length="100%" />');
            });
            let largeMarketSz399006 = document.getElementById('large-market-sz399006');
            largeMarketSz399006.addEventListener('click', function () {
                timeImageCode = "sz399006";
                let path = Env.GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA + timeImageCode + ".gif";
                $("#stock-modal").modal("hide");
                $("#time-image-day-button")[0].style.display  = 'block';
                $("#time-image-week-button")[0].style.display  = 'block';
                $("#time-image-month-button")[0].style.display  = 'block';
                $("#update-stock-fund-button")[0].style.display  = 'none';
                $("#time-image-modal").modal();
                $("#time-image").html('<img src="'+path+'" width="100%" length="100%" />');
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}