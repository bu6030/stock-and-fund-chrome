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
                $("#time-image").html('');
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
    // if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
    //     timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
    //     toEditPage();
    // }
    let path = "";
    if (timeImageType == "FUND") {
        let timestamp = (Date.now() + "").substring(0, 10);
        path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_DAY_FROM_SINA + timeImageCode + ".gif";
        $("#stock-modal").modal("hide");
        $("#time-image-modal").modal();
        if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
            timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
                setStockImage('DAY');
                $("#time-image-new").show();
                $("#time-image").html('');
                return;
        } else {
            $("#time-image-new").hide();
            $("#time-image").show();
        }
    }
    // 隐藏time-image-new这个div
    $("#time-image-new").hide();
    $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 展示周线图
function showWeekImage() {
    // if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
    //     timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
    //     toEditPage();
    // }
    let path = "";
    if (timeImageType == "FUND") {
        let timestamp = (Date.now() + "").substring(0, 10);
        path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=W&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_WEEK_FROM_SINA + timeImageCode + ".gif";
        $("#stock-modal").modal("hide");
        $("#time-image-modal").modal();
        if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
            timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
                setStockImage('WEEK');
                $("#time-image-new").show();
                $("#time-image").html('');
                return;
        } else {
            $("#time-image-new").hide();
            $("#time-image").show();
        }
    }
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 展示月线图
function showMonthImage() {
    // if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
    //     timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
    //     toEditPage();
    // }
    let path = "";
    if (timeImageType == "FUND") {
        let timestamp = (Date.now() + "").substring(0, 10);
        path = Env.GET_FUND_TIME_IMAGE_FROM_DFCFW + "?nid=0." + timeImageCode + "&type=M&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=" + timestamp;
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_MONTH_FROM_SINA + timeImageCode + ".gif";
        $("#stock-modal").modal("hide");
        $("#time-image-modal").modal();
        if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US") ||
            timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
                setStockImage('MONTH');
                $("#time-image-new").show();
                $("#time-image").html('');
                return;
        } else {
            $("#time-image-new").hide();
            $("#time-image").show();
        }
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
    let changePercent = Math.ceil((maxPrice - minPrice) / maxPrice * 1000);
    let centerPrice = (maxPrice + minPrice) / 2;
    maxPrice = Math.ceil(centerPrice * (1000 + changePercent) / 1000);
    minPrice = Math.floor(centerPrice * (1000 - changePercent) / 1000);
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
    let interval = 29;
    if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US")) {
        interval = 59;
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
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
// 展示日线图
function setStockImage(type) {
    $("#time-image").html('');
    let elementId = 'time-image-new';
    let result = ajaxGetStockTimeImage(timeImageCode, type);
    let stockName;
    for (k in stockList) {
        if(timeImageCode == stockList[k].code){
            stockName = stockList[k].name;
            break;
        }
    }
    if (result.data == null) {
        return;
    }
    // 提取数据
    const echartsData = transformData(result);
    const data0 = splitData(echartsData);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(elementId));
    myChart.clear();
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
                data: data0.values
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

    // option = {
    //     title: {
    //         text: stockName,
    //         left: 0
    //     },
    //     tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'cross'
    //         }
    //     },
    //     legend: {
    //         data: [kType, 'MA5', 'MA10', 'MA20', 'MA30']
    //     },
    //     grid: {
    //         left: '10%',
    //         right: '10%',
    //         bottom: '15%'
    //     },
    //     xAxis: {
    //         type: 'category',
    //         data: data0.categoryData,
    //         boundaryGap: false,
    //         axisLine: { onZero: false },
    //         splitLine: { show: false },
    //         min: 'dataMin',
    //         max: 'dataMax'
    //     },
    //     yAxis: {
    //         scale: true,
    //         splitArea: {
    //             show: true
    //         }
    //     },
    //     dataZoom: [
    //         {
    //             type: 'inside',
    //             start: 50,
    //             end: 100
    //         },
    //         {
    //             show: true,
    //             type: 'slider',
    //             top: '90%',
    //             start: 50,
    //             end: 100
    //         }
    //     ],
    //     series: [
    //         {
    //             name: kType,
    //             type: 'candlestick',
    //             data: data0.values,
    //             itemStyle: {
    //                 color: upColor,
    //                 color0: downColor,
    //                 borderColor: upBorderColor,
    //                 borderColor0: downBorderColor
    //             },
    //             markPoint: {
    //             label: {
    //                 formatter: function (param) {
    //                 return param != null ? Math.round(param.value) + '' : '';
    //                 }
    //             },
    //             data: [
    //                 {
    //                     name: 'Mark',
    //                     coord: ['2013/5/31', 2300],
    //                     value: 2300,
    //                     itemStyle: {
    //                         color: 'rgb(41,60,85)'
    //                     }
    //                 },
    //                 {
    //                     name: 'highest value',
    //                     type: 'max',
    //                     valueDim: 'highest'
    //                 },
    //                 {
    //                     name: 'lowest value',
    //                     type: 'min',
    //                     valueDim: 'lowest'
    //                 },
    //                 {
    //                     name: 'average value on close',
    //                     type: 'average',
    //                     valueDim: 'close'
    //                 }
    //             ],
    //             tooltip: {
    //                     formatter: function (param) {
    //                         return param.name + '<br>' + (param.data.coord || '');
    //                 }
    //             }
    //         },
    //         markLine: {
    //             symbol: ['none', 'none'],
    //             data: 
    //                 [
    //                     [
    //                         {
    //                             name: 'from lowest to highest',
    //                             type: 'min',
    //                             valueDim: 'lowest',
    //                             symbol: 'circle',
    //                             symbolSize: 10,
    //                             label: {
    //                                 show: false
    //                             },
    //                             emphasis: {
    //                                 label: {
    //                                     show: false
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             type: 'max',
    //                             valueDim: 'highest',
    //                             symbol: 'circle',
    //                             symbolSize: 10,
    //                             label: {
    //                                 show: false
    //                             },
    //                             emphasis: {
    //                                 label: {
    //                                     show: false
    //                                 }
    //                             }
    //                         }
    //                     ],
    //                         {
    //                             name: 'min line on close',
    //                             type: 'min',
    //                             valueDim: 'close'
    //                         },
    //                         {
    //                             name: 'max line on close',
    //                             type: 'max',
    //                             valueDim: 'close'
    //                         }
    //                     ]
    //                 }
    //             },
    //             {
    //                 name: 'MA5',
    //                 type: 'line',
    //                 data: calculateMA(5, data0),
    //                 smooth: true,
    //                 lineStyle: {
    //                     opacity: 0.5
    //                 }
    //             },
    //             {
    //             name: 'MA10',
    //             type: 'line',
    //             data: calculateMA(10, data0),
    //             smooth: true,
    //             lineStyle: {
    //                 opacity: 0.5
    //             }
    //         },
    //         {
    //             name: 'MA20',
    //             type: 'line',
    //             data: calculateMA(20, data0),
    //             smooth: true,
    //             lineStyle: {
    //                 opacity: 0.5
    //             }
    //         },
    //         {
    //             name: 'MA30',
    //             type: 'line',
    //             data: calculateMA(30, data0),
    //             smooth: true,
    //             lineStyle: {
    //                 opacity: 0.5
    //             }
    //         }
    //     ]
    // };
    myChart.setOption(option);
}

function calculateMA(dayCount, data0) {
    var result = [];
    for (var i = 0, len = data0.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += +data0.values[i - j][1];
        }
        result.push((sum / dayCount).toFixed(2));
    }
    return result;
}

function transformData(apiData) {
    const klines = apiData.data.klines;
    const transformedData = klines.map((kline) => {
        const [date, open, close, high, low, volume, money, change] = kline.split(",");
        return [date, parseFloat(open), parseFloat(close), parseFloat(low), parseFloat(high), parseFloat(volume), parseFloat(money), parseFloat(change)];
    });
    return transformedData;
}

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