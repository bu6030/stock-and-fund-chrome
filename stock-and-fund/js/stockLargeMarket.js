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
            console.log("=====" + stoksArr);
            var str = "";
            for (var k in stoksArr) {
                var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                if(dataStr == '' || dataStr == null){
                    break;
                }
                console.log("dataStr=====" + dataStr);
                var values = dataStr.split("~");
                var name = values[1] + "";
                var change = values[31] + "";
                var now = values[3] + "";
                var changePercent = values[32] + "";
                var style = "style=\"font-size: 9px;font-weight:600;"
                    + (change == 0 ? "" : (change >= 0?"color:#c12e2a;\"":"color:#3e8f3e;\""));
                str += "<a " + style + ">" + name + " " + now + "（" + change + "&nbsp;&nbsp;" + changePercent +"%）   </a>";
            }
            $("#stock-large-market").html(str);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}