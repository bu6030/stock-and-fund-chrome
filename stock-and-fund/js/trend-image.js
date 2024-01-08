//分时图/日线/周线/月线使用
let timeImageCode;
let timeImageType;
// 展示分时图
function showMinuteImage() {
    let path = "";
    if (timeImageCode != "sh000001" && timeImageCode != "sz399001" && timeImageCode != "sz399006") {
        $("#update-stock-fund-button")[0].style.display = 'block';
        $("#set-top-button-3")[0].style.display = 'block';
        if (timeImageType == "STOCK") {
            $("#show-buy-or-sell-button-2")[0].style.display = 'block';
        }
    }
    if (timeImageNewOrOld == 'OLD' && !timeImageCode.startsWith("us") && !timeImageCode.startsWith("US") 
        && !timeImageCode.startsWith("hk") && !timeImageCode.startsWith("HK")) {
        if (timeImageType == "FUND") {
            path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
            $("#fund-modal").modal("hide");
            $("#time-image-new").hide();
            $("#time-image").show();
        } else {
            path = Env.GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA + timeImageCode + ".gif";
            $("#stock-modal").modal("hide");
            $("#time-image-new").hide();
            $("#time-image").show();
        }
        $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
        $("#time-image-modal").modal();
    } else {
        $("#time-image-modal").modal();
        $("#time-image-new").show();
        $("#time-image").html('');
        setStockMinitesImage();
    }

}
// 展示日线图
function showDayImage() {
    let path = "";
    if (timeImageNewOrOld == 'OLD' && !timeImageCode.startsWith("us") && !timeImageCode.startsWith("US") 
        && !timeImageCode.startsWith("hk") && !timeImageCode.startsWith("HK")) {
        if (timeImageType == "FUND") {
            let timestamp = (Date.now() + "").substring(0, 10);
            path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
        } else {
            path = Env.GET_STOCK_TIME_IMAGE_DAY_FROM_SINA + timeImageCode + ".gif";
            $("#stock-modal").modal("hide");
            $("#time-image-new").hide();
            $("#time-image").show();
        }
        // 隐藏time-image-new这个div
        $("#time-image-new").hide();
        $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
    } else {
        setStockImage('DAY');
        $("#time-image-new").show();
        $("#time-image").html('');
    }
    $("#time-image-modal").modal();
}
// 展示周线图
function showWeekImage() {
    let path = "";
    if (timeImageNewOrOld == 'OLD' && !timeImageCode.startsWith("us") && !timeImageCode.startsWith("US") 
        && !timeImageCode.startsWith("hk") && !timeImageCode.startsWith("HK")) {
        if (timeImageType == "FUND") {
            let timestamp = (Date.now() + "").substring(0, 10);
            path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=W&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
        } else {
            path = Env.GET_STOCK_TIME_IMAGE_WEEK_FROM_SINA + timeImageCode + ".gif";
            $("#stock-modal").modal("hide");
            $("#time-image-new").hide();
            $("#time-image").show();
        }
        $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
    } else {
        setStockImage('WEEK');
        $("#time-image-new").show();
        $("#time-image").html('');
    }
    $("#time-image-modal").modal();
}
// 展示月线图
function showMonthImage() {
    let path = "";
    if (timeImageNewOrOld == 'OLD' && !timeImageCode.startsWith("us") && !timeImageCode.startsWith("US") 
        && !timeImageCode.startsWith("hk") && !timeImageCode.startsWith("HK")) {
        if (timeImageType == "FUND") {
            let timestamp = (Date.now() + "").substring(0, 10);
            path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=M&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
        } else {
            path = Env.GET_STOCK_TIME_IMAGE_MONTH_FROM_SINA + timeImageCode + ".gif";
            $("#stock-modal").modal("hide");
            $("#time-image-new").hide();
            $("#time-image").show();
        }
        $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
    } else {
        setStockImage('MONTH');
        $("#time-image-new").show();
        $("#time-image").html('');
    }
    $("#time-image-modal").modal();
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
    // 基于准备好的dom，初始化echarts实例
    let elementId = 'time-image-new';
    var myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    $("#time-image").html('');
    let result = ajaxGetStockTimeImageMinuteMini(timeImageCode);
    let dataStr = [];
    let dataVolumnStr = [];
    let dataAxis = [];
    let now;
    if (result.data == null) {
        alertMessage('无法提供该股票/基金的走势图信息');
        return;
    }
    var preClose = parseFloat(result.data.preClose);
    let maxPrice = preClose;
    let minPrice = preClose;
    for (var k = 0; k < result.data.trends.length; k++) {
        let str = result.data.trends[k];
        let price = parseFloat(str.split(",")[1]);
        let volumn = parseFloat(str.split(",")[2]);
        if (price > maxPrice) {
            maxPrice = price;
        }
        if (price < minPrice) {
            minPrice = price;
        }
        dataStr.push(price);
        dataAxis.push(str.split(",")[0].split(" ")[1]);
        dataVolumnStr.push(volumn);
        if (k == result.data.trends.length - 1) {
            now = dataStr[k];
        }
    }
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
        dataVolumnStr = dataVolumnStr.concat(emptyData);
    }
    let interval = 29;
    if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US")) {
        interval = 59;
    }
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
                interval: interval, // 调整刻度显示间隔
            },
        },
        yAxis: [
            {
                scale: true,
                type: 'value',
                position: 'left',  // 左侧 Y 轴
                axisLabel: {
                    formatter: '{value}',  // 左侧 Y 轴刻度显示价格
                },

            },
            {
                scale: true,
                type: 'value',
                position: 'right',  // 右侧 Y 轴
                axisLabel: {
                    formatter: function(value) {
                        // 计算涨跌比例，假设初始价格为 prePrice
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
                showSymbol: false,  // 不显示小圆点
            },
            {
                data: dataStr,
                type: 'line',
                smooth: true,
                yAxisIndex: 1,  // 关联侧 Y 轴
                showSymbol: false,  // 不显示小圆点
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
                },
                elements: [
                    {
                        type: 'text',
                        left: '5%',
                        top: '5%',
                        style: {
                            text: result.data.name,
                            textAlign: 'left',
                            fill: '#333',
                            fontSize: 14
                        }
                    }
                ]
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
                if (params[0].value == '') {
                    return "";
                }
                var dataIndex = params[0].dataIndex;
                var volumn = parseFloat(dataVolumnStr[dataIndex] / 10000).toFixed(2);
                var changePercent = ((params[0].value - preClose) / preClose * 100).toFixed(2);
                return result.data.name + "<br>时间：" + params[0].name + "<br>价格：" + params[0].value
                     + "<br>涨跌幅：" + changePercent + "%<br>成交量：" + volumn + "万";
            }
        },
    };
    myChart.setOption(option);
    $("#time-image-modal").modal();
}
// 展示日线/周线/月线图
function setStockImage(type) {
    // 基于准备好的dom，初始化echarts实例
    let elementId = 'time-image-new';
    var myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
    $("#time-image").html('');
    let end = getBeijingDateNoSlash();
    let result = ajaxGetStockTimeImage(timeImageCode, type, end);
    for (k in stockList) {
        if(timeImageCode == stockList[k].code){
            stockName = stockList[k].name;
            break;
        }
    }
    if (result.data == null) {
        alertMessage('无法提供该股票/基金的走势图信息');
        return;
    }
    // 提取数据
    const echartsData = transformDayData(result);
    const data0 = splitData(echartsData);
    let kType;
    if (type == 'DAY') {
        kType = '日K';
    } else if (type == 'WEEK'){
        kType = '周K';
    } else if (type == 'MONTH'){
        kType = '月K';
    }
    option = {
        xAxis: {
            data: data0.categoryData,
            axisLabel: {
                interval: 6, // 调整刻度显示间隔
            },
        },
        yAxis: {
            scale: true,
            splitArea: {
                show: true
            }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 50,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '90%',
                start: 50,
                end: 100
            }
        ],
        series: [
            {
                type: 'candlestick',
                data: data0.values,
                // 配置涨的颜色和跌的颜色
                itemStyle: {
                    color: redColor, // 涨的颜色
                    color0: blueColor, // 跌的颜色
                    borderColor: null, // 边框颜色，null 表示使用涨跌颜色
                    borderColor0: null, // 跌的边框颜色，null 表示使用涨跌颜色
                },
            }
        ],
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: '5%',
                    top: '5%',
                    style: {
                        text: result.data.name,
                        textAlign: 'left',
                        fill: '#333',
                        fontSize: 14
                    }
                }
            ]
        },
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
                let values = params[0].value;
                let volumn = (parseFloat(values[5]) / 10000).toFixed(2);
                let money = (parseFloat(values[6]) / 100000000).toFixed(2);
                return result.data.name + "<br>时间：" + params[0].name + "<br>开盘：" + values[1]
                    + "<br>收盘：" + values[2] + "<br>最低：" + values[3]
                    + "<br>最高：" + values[4] + "<br>成交量：" + volumn
                    + "万<br>成交额：" + money + "亿<br>涨跌幅：" + values[7] + "%";
            }
        },
    };
    myChart.setOption(option);
}
// 处理分时线数据
function transformMinuteData(apiData) {
    const trends = apiData.data.trends;
    const transformedData = trends.map((trends) => {
        const [date, open, volume, close] = trends.split(",");
        return [date, parseFloat(open), parseFloat(volume), parseFloat(close)];
    });
    return transformedData;
}
// 处理日线/周线/月线数据
function transformDayData(apiData) {
    const klines = apiData.data.klines;
    const transformedData = klines.map((kline) => {
        const [date, open, close, high, low, volume, money, change] = kline.split(",");
        return [date, parseFloat(open), parseFloat(close), parseFloat(low), parseFloat(high), parseFloat(volume), parseFloat(money), parseFloat(change)];
    });
    return transformedData;
}
// 处理分时线数据
function splitData(rawData) {
    const categoryData = [];
    const values = [];
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
    }
    return {
        categoryData: categoryData,
        values: values
    };
}