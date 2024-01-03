//分时图/日线/周线/月线使用
let timeImageCode;
let timeImageType;
// 展示分时图
function showMinuteImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
        $("#fund-modal").modal("hide");
        $("#time-image-new").hide();
        $("#time-image").show();
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA + timeImageCode + ".gif";
        $("#stock-modal").modal("hide");
        $("#time-image-modal").modal();
        if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
            timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
                setStockMinitesImage();
                $("#time-image-new").show();
                $("#time-image").hide();
                return;
        } else {
            $("#time-image-new").hide();
            $("#time-image").show();
        }
    }
    if (timeImageCode != "sh000001" && timeImageCode != "sz399001" && timeImageCode != "sz399006") {
        $("#update-stock-fund-button")[0].style.display = 'block';
        $("#set-top-button-3")[0].style.display = 'block';
        if (timeImageType == "STOCK") {
            $("#show-buy-or-sell-button-2")[0].style.display = 'block';
        }
    }
    $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 展示日线图
function showDayImage() {
    if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
        timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
        toEditPage();
    }
    let path = "";
    if (timeImageType == "FUND") {
        let timestamp = (Date.now() + "").substring(0, 10);
        path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_DAY_FROM_SINA + timeImageCode + ".gif";
    }
    // 隐藏time-image-new这个div
    $("#time-image-new").hide();
    $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 展示周线图
function showWeekImage() {
    if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
        timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
        toEditPage();
    }
    let path = "";
    if (timeImageType == "FUND") {
        let timestamp = (Date.now() + "").substring(0, 10);
        path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=W&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_WEEK_FROM_SINA + timeImageCode + ".gif";
    }
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 展示月线图
function showMonthImage() {
    if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
        timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
        toEditPage();
    }
    let path = "";
    if (timeImageType == "FUND") {
        let timestamp = (Date.now() + "").substring(0, 10);
        path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=M&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_MONTH_FROM_SINA + timeImageCode + ".gif";
    }
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 获取当前日期，年-月-日格式
function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear(); // 得到当前年份
    var month = date.getMonth() + 1; // 得到当前月份（0-11月份，+1是当前月份）
    month = month >= 10 ? month : '0' + month; // 补零
    var day = date.getDate(); // 得到当前天数
    day = day >= 10 ? day : '0' + day; // 补零
    return year + '-' + month + '-' + day; // 这里传入的是字符串
}
// 美股/港股没有分时图，不展示分时图
function toEditPage() {
    $("#time-image-modal").modal("hide");
    $("#stock-modal").modal();
}
// 展示分时图
function setStockMinitesImage() {
    $("#time-image").html('');
    let elementId = 'time-image-new';
    let result = ajaxGetStockTimeImageMinuteMini(timeImageCode);
    let dataStr = [];
    let dataAxis = [];
    let now;
    if (result.data == null) {
        return;
    }
    var preClose = parseFloat(result.data.preClose);
    let maxPrice = preClose;
    let minPrice = preClose;
    for (var k = 0; k < result.data.trends.length; k++) {
        let str = result.data.trends[k];
        let price = parseFloat(str.split(",")[1]);
        if (price > maxPrice) {
            maxPrice = price;
        }
        if (price < minPrice) {
            minPrice = price;
        }
        dataStr.push(price);
        dataAxis.push(str.split(",")[0].split(" ")[1]);
        if (k == result.data.trends.length - 1) {
            now = dataStr[k];
        }
    }
    if (preClose == maxPrice) {
        maxPrice = preClose - minPrice + preClose;
    } else if (preClose == minPrice) {
        minPrice = minPrice - (maxPrice - minPrice);
    } else {
        if ((maxPrice - preClose) > (preClose - minPrice)) {
            minPrice = preClose - (maxPrice - preClose);
        } else {
            maxPrice = preClose + (preClose - minPrice);
        }
    }
    console.log('maxPrice=',maxPrice,'minPrice=',minPrice);
    if(dataStr.length == 0) {
        return;
    }
    let color;
    if (parseFloat(now) >= preClose) {
        color = redColor;
    } else {
        color = blueColor;
    }
    if (dataStr.length < 241) {
        const diffLength = 241 - dataStr.length;
        const emptyData = Array(diffLength).fill(''); // 使用 null 填充空数据
        dataStr = dataStr.concat(emptyData);
        dataAxis = dataAxis.concat(emptyData);
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(elementId));
    option = {
        // resize: true,
        lineStyle: {
            color: color, // 设置线的颜色
            // 其他样式配置
            width: 0.05,
            opacity: 0.5
        },
        xAxis: {
            data: dataAxis,
            type: 'category',
            axisLabel: {
                interval: 29, // 调整刻度显示间隔
            },
        },
        yAxis: [
            {
                scale: true,
                type: 'value',
                position: 'left',  // 左侧 Y 轴
                min: minPrice,
                max: maxPrice,
                axisLabel: {
                    formatter: '{value}',  // 左侧 Y 轴刻度显示价格
                },

            },
            {
                scale: true,
                type: 'value',
                position: 'right',  // 右侧 Y 轴
                min: minPrice,
                max: maxPrice,
                axisLabel: {
                    formatter: function(value) {
                        // 计算涨跌比例，假设初始价格为 prePrice
                        // var prePrice = 100;  // 你的实际初始价格
                        var changePercent = ((value - preClose) / preClose * 100).toFixed(2) + '%';
                        return changePercent;
                    },
                },
            },
        ],
        series: [
            {
                data: dataStr,
                type: 'line',
                smooth: true,
                yAxisIndex: 0,  // 关联左侧 Y 轴
            },
            {
                data: dataStr,
                type: 'line',
                smooth: true,
                yAxisIndex: 1,  // 关联侧 Y 轴
            }  
        ],
        graphic: [
            {
                type: 'line',
                shape: {
                    x1: '10%', y1: '10%',
                    x2: '90%', y2: '10%'
                },
                style: {
                    stroke: 'green',
                    lineWidth: 2
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#999999',
                    width: 1,
                    type: 'solid'
                }
            },
            formatter: function(params) {
                var changePercent = ((params[0].value - preClose) / preClose * 100).toFixed(2) + '%';
                return result.data.name + "<br>时间：" + params[0].name + "<br>价格：" + params[0].value + "<br>涨跌幅：" + changePercent;
            }
        },
    };
    myChart.setOption(option);
}

function customRound(number) {
    if (number >= 0) {
        // 对正数向上取整
        return Math.ceil(number);
    } else {
        // 对负数向下取整
        return Math.floor(number);
    }
}
