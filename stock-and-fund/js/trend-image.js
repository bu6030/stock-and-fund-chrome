//分时图/日线/周线/月线使用
let timeImageCode;
let timeImageType;
let timeImageName;
let timeImageSecid;
var timerId;
let turnOverRate = '';
// 展示分时图
function showMinuteImage() {
    clearTimeImageTimeout();
    let path = "";
    if (timeImageCode != "sh000001" && timeImageCode != "sz399001" && timeImageCode != "sz399006"
        && timeImageCode != 'N225' && timeImageCode != 'KS11' && timeImageCode != 'FTSE'
        && timeImageCode != 'GDAXI' && timeImageCode != 'FCHI' && timeImageCode != 'SENSEX'
        && timeImageCode != 'sh000300' && timeImageCode != 'usNDX' && timeImageCode != 'hkHSI'
        && timeImageCode != 'usSPX' && timeImageCode != 'usDJIA' && timeImageCode != 'sz399905'
        && timeImageCode != 'sh000852' && timeImageCode != 'sh000688' && timeImageCode != 'sh000928'
        && timeImageCode != 'sz399997' && timeImageCode != 'sh000933' && timeImageCode != 'sh000926'
        && timeImageCode != 'sz399989' && timeImageCode != 'sz399986' && timeImageCode != 'sh000941'
        && timeImageCode != '899050' && timeImageCode != '930641' && timeImageCode != '930708'
        && timeImageCode != '931071' && timeImageCode != '931582') {
        $("#update-stock-fund-button")[0].style.display = 'block';
        $("#set-top-button-3")[0].style.display = 'block';
        if (timeImageType == "STOCK") {
            $("#show-buy-or-sell-button-2")[0].style.display = 'block';
        }
    }
    fundInvesterPositionSetButton();
    if (timeImageNewOrOld == 'OLD' && !timeImageCode.startsWith("us") && !timeImageCode.startsWith("US") 
        && !timeImageCode.startsWith("hk") && !timeImageCode.startsWith("HK")
        && timeImageCode != 'N225' && timeImageCode != 'KS11' && timeImageCode != 'FTSE'
        && timeImageCode != 'GDAXI' && timeImageCode != 'FCHI' && timeImageCode != 'SENSEX'
        && timeImageCode != 'sh000300' && timeImageCode != 'usNDX' && timeImageCode != 'hkHSI'
        && timeImageCode != 'usSPX' && timeImageCode != 'usDJIA' && timeImageCode != 'sz399905'
        && timeImageCode != 'sh000852' && timeImageCode != 'sh000688' && timeImageCode != 'sh000928'
        && timeImageCode != 'sz399997' && timeImageCode != 'sh000933' && timeImageCode != 'sh000926'
        && timeImageCode != 'sz399989' && timeImageCode != 'sz399986' && timeImageCode != 'sh000941'
        && timeImageCode != '899050' && timeImageCode != '930641' && timeImageCode != '930708'
        && timeImageCode != '931071' && timeImageCode != '931582') {
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
    clearTimeImageTimeout();
    let path = "";
    fundInvesterPositionSetButton();
    if (timeImageNewOrOld == 'OLD' && !timeImageCode.startsWith("us") && !timeImageCode.startsWith("US") 
        && !timeImageCode.startsWith("hk") && !timeImageCode.startsWith("HK")
        && timeImageCode != 'N225' && timeImageCode != 'KS11' && timeImageCode != 'FTSE'
        && timeImageCode != 'GDAXI' && timeImageCode != 'FCHI' && timeImageCode != 'SENSEX'
        && timeImageCode != 'sh000300' && timeImageCode != 'usNDX' && timeImageCode != 'hkHSI'
        && timeImageCode != 'usSPX' && timeImageCode != 'usDJIA' && timeImageCode != 'sz399905'
        && timeImageCode != 'sh000852' && timeImageCode != 'sh000688' && timeImageCode != 'sh000928'
        && timeImageCode != 'sz399997' && timeImageCode != 'sh000933' && timeImageCode != 'sh000926'
        && timeImageCode != 'sz399989' && timeImageCode != 'sz399986' && timeImageCode != 'sh000941'
        && timeImageCode != '899050' && timeImageCode != '930641' && timeImageCode != '930708'
        && timeImageCode != '931071' && timeImageCode != '931582') {
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
        && !timeImageCode.startsWith("hk") && !timeImageCode.startsWith("HK")
        && timeImageCode != 'N225' && timeImageCode != 'KS11' && timeImageCode != 'FTSE'
        && timeImageCode != 'GDAXI' && timeImageCode != 'FCHI' && timeImageCode != 'SENSEX'
        && timeImageCode != 'sh000300' && timeImageCode != 'usNDX' && timeImageCode != 'hkHSI'
        && timeImageCode != 'usSPX' && timeImageCode != 'usDJIA' && timeImageCode != 'sz399905'
        && timeImageCode != 'sh000852' && timeImageCode != 'sh000688' && timeImageCode != 'sh000928'
        && timeImageCode != 'sz399997' && timeImageCode != 'sh000933' && timeImageCode != 'sh000926'
        && timeImageCode != 'sz399989' && timeImageCode != 'sz399986' && timeImageCode != 'sh000941'
        && timeImageCode != '899050' && timeImageCode != '930641' && timeImageCode != '930708'
        && timeImageCode != '931071' && timeImageCode != '931582') {
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
    clearTimeImageTimeout();
    let path = "";
    if (timeImageNewOrOld == 'OLD' && !timeImageCode.startsWith("us") && !timeImageCode.startsWith("US") 
        && !timeImageCode.startsWith("hk") && !timeImageCode.startsWith("HK")
        && timeImageCode != 'N225' && timeImageCode != 'KS11' && timeImageCode != 'FTSE'
        && timeImageCode != 'GDAXI' && timeImageCode != 'FCHI' && timeImageCode != 'SENSEX'
        && timeImageCode != 'sh000300' && timeImageCode != 'usNDX' && timeImageCode != 'hkHSI'
        && timeImageCode != 'usSPX' && timeImageCode != 'usDJIA' && timeImageCode != 'sz399905'
        && timeImageCode != 'sh000852' && timeImageCode != 'sh000688' && timeImageCode != 'sh000928'
        && timeImageCode != 'sz399997' && timeImageCode != 'sh000933' && timeImageCode != 'sh000926'
        && timeImageCode != 'sz399989' && timeImageCode != 'sz399986' && timeImageCode != 'sh000941'
        && timeImageCode != '899050' && timeImageCode != '930641' && timeImageCode != '930708'
        && timeImageCode != '931071' && timeImageCode != '931582') {
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
    myChart.dispose();
    myChart = echarts.init(document.getElementById(elementId));
    setEchartsSize(myChart);
    $("#time-image").html('');
    let result = ajaxGetStockTimeImageMinuteMini(timeImageCode);
    let dataStr = [];
    let dataAverageStr = [];
    let dataVolumnStr = [];
    let dataAxis = [];
    let now;
    let imageTextSize = 12;
    if (windowSize == 'MINI') {
        imageTextSize = 8;
    }
    if (result.data == null) {
        alertMessage('无法提供该股票/基金的走势图信息');
        return;
    }
    var preClose = parseFloat(result.data.preClose);
    let toFixedVolume = 2;
    if (preClose <= 5) {
        toFixedVolume = 3;
    }
    let maxPrice = preClose;
    let minPrice = preClose;
    let totalVolumn = 0;
    for (var k = 0; k < result.data.trends.length; k++) {
        let str = result.data.trends[k];
        let price = parseFloat(str.split(",")[1]);
        let volumn = parseFloat(str.split(",")[2]);
        let averagePrice = parseFloat(str.split(",")[3]);
        totalVolumn = totalVolumn + volumn;
        if (price > maxPrice) {
            maxPrice = price;
        }
        if (price < minPrice) {
            minPrice = price;
        }
        if (averagePrice > maxPrice) {
            maxPrice = averagePrice;
        }
        if (averagePrice < minPrice) {
            minPrice = averagePrice;
        }
        dataStr.push(price);
        dataAverageStr.push(averagePrice);
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
        dataAverageStr = dataAverageStr.concat(emptyData);
        dataAxis = dataAxis.concat(emptyData);
        dataVolumnStr = dataVolumnStr.concat(emptyData);
    }
    let interval = 29;
    if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US")) {
        interval = 59;
    }
    let fundOrStockName = getFundOrStockNameByTimeImageCode(timeImageCode, timeImageType);
    // 说明该基金是从持仓明细进入的
    if (fundOrStockName == timeImageCode) {
        fundOrStockName = timeImageName;
    }
    if (preClose >= maxPrice) {
        maxPrice = parseFloat(maxPrice) * 1.01;
    }
    if (preClose <= minPrice) {
        minPrice = parseFloat(minPrice) * 0.99;
    }
    maxPrice = maxPrice.toFixed(toFixedVolume);
    minPrice = minPrice.toFixed(toFixedVolume);
    setTotalVolumnAndTurnOverRate(totalVolumn);
    option = {
        xAxis: {
            data: dataAxis,
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontSize: imageTextSize // 调小字体大小使其适应空间
                },
                interval: interval, // 调整刻度显示间隔
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
                    textStyle: {
                        fontSize: imageTextSize // 调小字体大小使其适应空间
                    },
                    formatter: function(value) {
                        let price = parseFloat(value).toFixed(toFixedVolume);  // 左侧 Y 轴刻度显示价格
                        if (price > preClose) {
                            return '{a|' + price + '}';
                        } else if (price < preClose) {
                            return '{b|' + price + '}';
                        } else {
                            return price;
                        }
                    },
                    rich: {
                        a: {
                            color: redColor,
                            fontWeight: 'bold'
                        },
                        b: {
                            color: blueColor,
                            fontWeight: 'bold'
                        }
                    }
                },

            },
            {
                scale: true,
                type: 'value',
                position: 'right',  // 右侧 Y 轴
                min: minPrice,
                max: maxPrice,
                axisLabel: {
                    textStyle: {
                        fontSize: imageTextSize // 调小字体大小使其适应空间
                    },
                    formatter: function(value) {
                        // 计算涨跌比例，假设初始价格为 prePrice
                        var changePercent = ((value - preClose) / preClose * 100);
                        if (changePercent > 0) {
                            return '{a|' + changePercent.toFixed(2) + '%' + '}';
                        } else if (changePercent < 0) {
                            return '{b|' + changePercent.toFixed(2) + '%' + '}';
                        } else {
                            return changePercent.toFixed(2) + '%';
                        }
                    },
                    rich: {
                        a: {
                            color: redColor,
                            fontWeight: 'bold'
                        },
                        b: {
                            color: blueColor,
                            fontWeight: 'bold'
                        }
                    }
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
                lineStyle: {
                    color: color, // 设置线的颜色
                    width: 1.3,
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    label: {
                        show: true,  // 设置为 true，使标签一开始就可见
                        position: 'middle',  // 调整标签位置，可以根据需要调整
                        color: 'darkblue',  // 标签文本颜色
                        fontWeight: 'bold',  // 标签文本粗细
                        formatter : function() {
                            return "昨日收盘：" + parseFloat(preClose).toFixed(toFixedVolume);
                        },
                    },
                    lineStyle: {
                        color: 'darkblue',
                        width: 1,
                        type: 'dotted'
                    },
                    data: [
                        {
                            yAxis: parseFloat(preClose).toFixed(toFixedVolume)  // 在 y 轴上的 150 处添加一条横线
                        }
                    ]
                },
            },
            {
                data: dataStr,
                type: 'line',
                smooth: true,
                yAxisIndex: 1,  // 关联侧 Y 轴
                showSymbol: false,  // 不显示小圆点
                lineStyle: {
                    color: color, // 设置线的颜色
                    width: 1.3,
                },
            },
            {
                data: dataAverageStr,
                type: 'line',
                smooth: true,
                yAxisIndex: 1,  // 关联侧 Y 轴
                showSymbol: false,  // 不显示小圆点
                lineStyle: {
                    color: '#FFD700', // 设置线的颜色
                    width: 1.5,
                },
            },
        ],
        graphic: [
            {
                elements: [
                    {
                        type: 'text',
                        left: '5%',
                        top: '5%',
                        style: {
                            text: fundOrStockName + "（最新：" + now + "）",
                            textAlign: 'left',
                            fill: '#333',
                            fontSize: 14
                        }
                    }
                ]
            },
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
    // 20s刷新
    timerId = setTimeout(function () {
        console.log('20s执行');
        setStockMinitesImage();
    }, 20000);
    console.log("下一次分时图timerId:", timerId);
}
// 展示日线/周线/月线图
function setStockImage(type) {
    setTotalVolumnAndTurnOverRate(0);
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
    let fundOrStockName = getFundOrStockNameByTimeImageCode(timeImageCode, timeImageType);
    // 说明该基金是从持仓明细进入的
    if (fundOrStockName == timeImageCode) {
        fundOrStockName = timeImageName;
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
                        text: fundOrStockName,
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

function setEchartsSize(myChart) {
    console.log('改变echartSize');
    // 设置容器的宽度和高度
    if (windowSize == 'NORMAL') {
        myChart.getDom().style.width = '650px';
        myChart.getDom().style.height = '430px';
    } else if (windowSize == 'SMALL') {
        myChart.getDom().style.width = '530px';
        myChart.getDom().style.height = '400px';
    } else if (windowSize == 'MINI') {
        myChart.getDom().style.width = '380px';
        myChart.getDom().style.height = '280px';
    }
}
// 设置成交量
function setTotalVolumnAndTurnOverRate(totalVolumn) {
    let contentHtml = "";
    if (totalVolumn != 0) {
        totalVolumn = (totalVolumn / 10000).toFixed(2) + " 万";
        contentHtml = "成交量: " + totalVolumn + "";
        if (turnOverRate != undefined && turnOverRate != '') {
            let turnOverRateArr = turnOverRate.split("-");
            for (let i = 0; i < turnOverRateArr.length; i++) {
                if (turnOverRateArr[i].split("~")[0] == timeImageCode) {
                    contentHtml += "&nbsp;&nbsp;&nbsp;&nbsp;换手率: " + turnOverRateArr[i].split("~")[1] + "%";
                }
            }
        }
    }
    $("#time-image-content").html(contentHtml);
}

// 持仓明细进入的隐藏部分按钮
function fundInvesterPositionSetButton() {
    let fundOrStockName = getFundOrStockNameByTimeImageCode(timeImageCode, timeImageType);
    // 说明该基金是从持仓明细进入的
    if (fundOrStockName == timeImageCode) {
        $("#set-top-button-3")[0].style.display = 'none';
        $("#stock-fund-monitor-button")[0].style.display = 'none';
        $("#fund-invers-position-button-3")[0].style.display = 'none';
        $("#fund-net-diagram-button-3")[0].style.display = 'none';
        $("#update-stock-fund-button")[0].style.display = 'none';
        $("#show-buy-or-sell-button-2")[0].style.display = 'none';
        $("#stock-fund-delete-button")[0].style.display = 'none';
        $("#add-stock-button")[0].style.display = 'inline';
    } else {
        $("#stock-fund-monitor-button")[0].style.display = 'inline';
        $("#add-stock-button")[0].style.display = 'none';
    }
}