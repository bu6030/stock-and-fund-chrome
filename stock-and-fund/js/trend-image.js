//分时图/日线/周线/月线使用
let timeImageCode;
let timeImageType;
let timeImageName;
let timeImageSecid;
var timerId;
let turnOverRate = '';
// 展示分时图
function showMinuteImage(ndays) {
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
        && timeImageCode != '931071' && timeImageCode != '931582' && timeImageCode != 'TWII'
        && timeImageCode != 'VNINDEX' && timeImageCode != 'hkHSTECH') {
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
        && timeImageCode != '931071' && timeImageCode != '931582' && timeImageCode != 'TWII'
        && timeImageCode != 'VNINDEX' && timeImageCode != 'hkHSTECH') {
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
        setStockMinitesImage(ndays);
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
        && timeImageCode != '931071' && timeImageCode != '931582' && timeImageCode != 'TWII'
        && timeImageCode != 'VNINDEX' && timeImageCode != 'hkHSTECH') {
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
        && timeImageCode != '931071' && timeImageCode != '931582' && timeImageCode != 'TWII'
        && timeImageCode != 'VNINDEX' && timeImageCode != 'hkHSTECH') {
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
        && timeImageCode != '931071' && timeImageCode != '931582' && timeImageCode != 'TWII'
        && timeImageCode != 'VNINDEX' && timeImageCode != 'hkHSTECH') {
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
function setStockMinitesImage(type) {
    if (type == '1DAY') {
        ajaxGetStockTimeImageMinute(timeImageCode);
    } else if (type == '5DAY') {
        ajaxGetStockTimeImageMinuteHis(timeImageCode, 5);
    }
}
function setStockMinitesImageCallBack(result, ndays, code) {
    // 基于准备好的dom，初始化echarts实例
    let elementId = 'time-image-new';
    let volumnElementId = 'volumn-image-echart';
    var myChart = echarts.init(document.getElementById(elementId));
    let volumnChart = echarts.init(document.getElementById(volumnElementId)); 
    myChart.dispose();
    volumnChart.dispose();
    myChart = echarts.init(document.getElementById(elementId));
    volumnChart = echarts.init(document.getElementById(volumnElementId)); 
    setEchartsSize(myChart, volumnChart);
    $("#time-image").html('');
    // let result = ajaxGetStockTimeImageMinute(timeImageCode);
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
    var preCloseList = [];
    if (ndays == 5) {
        preCloseList.push(parseFloat(result.data.trends[0].split(",")[1]));
    }
    let toFixedVolume = 2;
    if (preClose <= 5) {
        toFixedVolume = 3;
    }
    let maxPrice = preClose;
    let minPrice = preClose;
    let ndaysMarkLineSet = [];
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
        let axis = str.split(",")[0].split(" ")[1];
        if (ndays == 5) {
            axis = str.split(",")[0];
            if ((code.startsWith('us') || code.startsWith('US')) && axis.endsWith('21:30')) {
                ndaysMarkLineSet.push(axis);
            } else if (axis.endsWith('09:30')) {
                ndaysMarkLineSet.push(axis);
            }
            if ((code.startsWith('us') || code.startsWith('US')) && axis.endsWith('04:00')) {
                preCloseList.push(price);
            } else if ((code.startsWith('hk') || code.startsWith('HK')) && axis.endsWith('16:00')) {
                preCloseList.push(price);
            } else if (!code.startsWith('us') && !code.startsWith('US') && !code.startsWith('hk') && !code.startsWith('HK') && axis.endsWith('15:00')) {
                preCloseList.push(price);
            }
        }
        dataAxis.push(axis);
        dataVolumnStr.push(volumn);
        if (k == result.data.trends.length - 1) {
            now = dataStr[k];
        }
    }
    // 美股进入夏令时，开盘时间改成22:30-05:00时，无法取到21:30的数据修改
    if (ndaysMarkLineSet.length == 0 && ndays == 5 && (code.startsWith('us') || code.startsWith('US'))) {
        preCloseList = [];
        preCloseList.push(parseFloat(result.data.trends[0].split(",")[1]));
        for (var k = 0; k < result.data.trends.length; k++) {
            let str = result.data.trends[k];
            let price = parseFloat(str.split(",")[1]);
            let axis = str.split(",")[0];
            if (axis.endsWith('22:30')) {
                ndaysMarkLineSet.push(axis);
            }
            if (axis.endsWith('05:00')) {
                preCloseList.push(price);
            }
        }
    }
    let markLineData = [];
    if (ndays == 5) {
        for (var k = 0; k < ndaysMarkLineSet.length; k++) {
            markLineData.push({
                 xAxis: ndaysMarkLineSet[k],
                 lineStyle: {
                    color: 'gray',
                    width: 1,
                    type: 'dashed'
                },
                label: { show: false },
            })
        }
    } else {
        markLineData = [
            {
                yAxis: parseFloat(preClose).toFixed(toFixedVolume),  // 在 y 轴上的 150 处添加一条横线
                label: {
                    show: true,  // 设置为 true，使标签一开始就可见
                    position: 'middle',  // 调整标签位置，可以根据需要调整
                    color: 'gray',  // 标签文本颜色
                    fontWeight: 'bold',  // 标签文本粗细
                    formatter : function() {
                        return "昨日收盘：" + parseFloat(preClose).toFixed(toFixedVolume);
                    },
                },
                lineStyle: {
                    color: 'gray',
                    width: 1,
                    type: 'dashed'
                },
            }
        ]
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
    // A股分时线中每个周期241条数据，港股每个周期331条数据，美股每个周期391条数据
    let ndaysInterval = 241;
    if (code.startsWith('us') || code.startsWith('US')) {
        ndaysInterval = 391;
    } else if (code.startsWith('hk') || code.startsWith('HK')) {
        ndaysInterval = 331;
    }
    if (dataStr.length < ndaysInterval && ndays == 1) {
        const diffLength = ndaysInterval - dataStr.length;
        const emptyData = Array(diffLength).fill(''); // 使用 null 填充空数据
        dataStr = dataStr.concat(emptyData);
        dataAverageStr = dataAverageStr.concat(emptyData);
        dataAxis = dataAxis.concat(emptyData);
        dataVolumnStr = dataVolumnStr.concat(emptyData);
    } else if (dataStr.length < ndaysInterval * 5 && ndays == 5) {
        const diffLength = ndaysInterval * 5 - dataStr.length;
        const emptyData = Array(diffLength).fill(''); // 使用 null 填充空数据
        dataStr = dataStr.concat(emptyData);
        dataAverageStr = dataAverageStr.concat(emptyData);
        dataAxis = dataAxis.concat(emptyData);
        dataVolumnStr = dataVolumnStr.concat(emptyData);
    }
    let interval = 29;
    if (ndays == 5) {
        interval = 240;
        if (timeImageCode.startsWith("us") || timeImageCode.startsWith("US")) {
            interval = 390;
        } else if (timeImageCode.startsWith("hk") || timeImageCode.startsWith("HK")) {
            interval = 330;
        }
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
        grid: {
            bottom: '7%',   // 距离容器底部的距离
        },
        xAxis: {
            data: dataAxis,
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontSize: imageTextSize // 调小字体大小使其适应空间
                },
                interval: interval, // 调整刻度显示间隔
                formatter: function (value) {
                    if (ndays == 5) {
                        value = value.split(' ')[0];
                    }
                    return value;
                }
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
                    width: 1,
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    data: markLineData
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
                    width: 1,
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
                var changePercent = "";
                if (ndays == 5) {
                    const index = Math.floor(dataIndex / ndaysInterval); // 计算 preCloseList 的索引
                    if (index >= 4) {
                        changePercent = ((params[0].value - preClose) / preClose * 100).toFixed(2);
                    } else {
                        changePercent = ((params[0].value - preCloseList[index]) / preCloseList[index] * 100).toFixed(2);
                    }
                } else {
                    changePercent = ((params[0].value - preClose) / preClose * 100).toFixed(2);
                }
                return result.data.name + "<br>时间：" + params[0].name + "<br>价格：" + params[0].value
                     + "<br>涨跌幅：" + changePercent + "%<br>成交量：" + volumn + "万";
            }
        },
    };
    myChart.setOption(option);
    // 画成交量图
    var volumnOption = {
        xAxis: {
            data: dataAxis,  // X 轴数据，与主图相同
            type: 'category',
            boundaryGap: true,
            axisLabel: {
                textStyle: {
                    fontSize: imageTextSize // 调小字体大小使其适应空间
                },
                interval: interval, // 调整刻度显示间隔
                formatter: function (value) {
                    if (ndays == 5) {
                        value = value.split(' ')[0];
                    }
                    return value;
                }
            },
        },
        yAxis: {
            type: 'value',
            position: 'right',
            axisLabel: {
                show: false, // 不显示 Y 轴坐标数字
                textStyle: {
                    fontSize: imageTextSize // 调小字体大小使其适应空间
                },
            },
        },
        series: [
            {
                data: dataVolumnStr, // 成交量数据
                type: 'bar',
                itemStyle: {
                    color: function(params) {
                        var dataIndex = params.dataIndex;
                        // 获取主图的数据
                        var currentPrice = dataStr[dataIndex];
                        var lastMinitePrice = dataIndex > 1 ? dataStr[dataIndex - 1] : dataStr[dataIndex];
                        // 设置不同的颜色
                        if (currentPrice >= lastMinitePrice) {
                            return redColor; // 比主图线高时的颜色
                        } else {
                            return blueColor; // 比主图线低时的颜色
                        }
                    },
                },
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
                return "时间：" + params[0].name + "<br>成交量：" + volumn + "万";
            }
        },
    };
    // 使用配置项设置成交量图
    volumnChart.setOption(volumnOption);
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
    let imageTextSize = 12;
    if (windowSize == 'MINI') {
        imageTextSize = 8;
    }
    setTotalVolumnAndTurnOverRate(0);
    // 基于准备好的dom，初始化echarts实例
    let elementId = 'time-image-new';
    let volumnElementId = 'volumn-image-echart';
    var myChart = echarts.init(document.getElementById(elementId));
    let volumnChart = echarts.init(document.getElementById(volumnElementId)); 
    myChart.dispose();
    volumnChart.dispose();
    myChart = echarts.init(document.getElementById(elementId));
    volumnChart = echarts.init(document.getElementById(volumnElementId)); 
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
    let now = data0.values[data0.values.length-1][1];
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
    let zoomStart = 80;
    let interval = 12;
    if (data0.values.length <= 30) {
        interval = 0;
        zoomStart = 0;
    } else if (data0.values.length <= 60) {
        interval = 1;
        zoomStart = 40;
    } else if (data0.values.length <= 120) {
        interval = 4;
        zoomStart = 60;
    } else if (data0.values.length <= 240) {
        interval = 8;
        zoomStart = 80;
    } else {
        interval = 12;
        zoomStart = 90;
    }
    let optionSeries = [
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
        },
        {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5, data0.values), // 使用自定义函数计算五日均线数据
            smooth: true, // 是否平滑曲线
            showSymbol: false, // 不显示圆点
            lineStyle: {
                width: 1, // 线宽
            },
        },
        {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10, data0.values), // 使用自定义函数计算五日均线数据
            smooth: true, // 是否平滑曲线
            showSymbol: false, // 不显示圆点
            lineStyle: {
                width: 1, // 线宽
            },
        },
        {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20, data0.values), // 使用自定义函数计算五日均线数据
            smooth: true, // 是否平滑曲线
            showSymbol: false, // 不显示圆点
            lineStyle: {
                width: 1, // 线宽
            },
        },
        {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30, data0.values), // 使用自定义函数计算五日均线数据
            smooth: true, // 是否平滑曲线
            showSymbol: false, // 不显示圆点
            lineStyle: {
                width: 1, // 线宽
            },
        },
        {
            name: 'MA50',
            type: 'line',
            data: calculateMA(50, data0.values), // 使用自定义函数计算五日均线数据
            smooth: true, // 是否平滑曲线
            showSymbol: false, // 不显示圆点
            lineStyle: {
                width: 1, // 线宽
            },
        },
        {
            name: 'MA250',
            type: 'line',
            data: calculateMA(250, data0.values), // 使用自定义函数计算五日均线数据
            smooth: true, // 是否平滑曲线
            showSymbol: false, // 不显示圆点
            lineStyle: {
                width: 1, // 线宽
            },
        }
    ];
    let legendData = ['K 线图', 'MA5', 'MA10', 'MA20', 'MA30', 'MA50', 'MA250'];
    if (!klineMA5Display) {
        legendData = legendData.filter(item => item !== 'MA5');
        optionSeries = optionSeries.filter(item => item.name !== 'MA5');
    }
    if (!klineMA10Display) {
        legendData = legendData.filter(item => item !== 'MA10');
        optionSeries = optionSeries.filter(item => item.name !== 'MA10');
    }
    if (!klineMA20Display) {
        legendData = legendData.filter(item => item !== 'MA20');
        optionSeries = optionSeries.filter(item => item.name !== 'MA20');
    }
    if (!klineMA30Display) {
        legendData = legendData.filter(item => item !== 'MA30');
        optionSeries = optionSeries.filter(item => item.name !== 'MA30');
    }
    if (!klineMA50Display) {
        legendData = legendData.filter(item => item !== 'MA50');
        optionSeries = optionSeries.filter(item => item.name !== 'MA50');
    }
    if (!klineMA250Display) {
        legendData = legendData.filter(item => item !== 'MA250');
        optionSeries = optionSeries.filter(item => item.name !== 'MA250');
    }
    for (const item of klineMAListDisplay) {
        if (item.display) {
            legendData.push(item.ma);
            optionSeries.push({
                name: item.ma,
                type: 'line',
                data: calculateMA(parseInt(item.ma.replace('MA', '')), data0.values), // 使用自定义函数计算均线数据
                smooth: true, // 是否平滑曲线
                showSymbol: false, // 不显示圆点
                lineStyle: {
                    width: 1, // 线宽
                },
            });
        }
    }
    option = {
        legend: {
            data: legendData,
            top: 30
        },
        grid: {
            bottom: '7%',   // 距离容器底部的距离
        },
        xAxis: {
            data: data0.categoryData,
            axisLabel: {
                interval: interval, // 调整刻度显示间隔
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
                start: zoomStart,
                end: 100
            },
            {
                id: 'dataZoom1',
                show: true,
                type: 'slider',
                top: '90%',
                start: zoomStart,
                end: 100
            }
        ],
        series: optionSeries,
        graphic: {
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
                let ma5 = null;
                let ma10 = null;
                let ma20 = null;
                let ma30 = null;
                let ma50 = null;
                let ma250 = null;
                let maOthers = [];
                params.forEach(function(param) {
                    switch (param.seriesName) {
                        case 'MA5':
                            ma5 = param.value;
                            break;
                        case 'MA10':
                            ma10 = param.value;
                            break;
                        case 'MA20':
                            ma20 = param.value;
                            break;
                        case 'MA30':
                            ma30 = param.value;
                            break;
                        case 'MA50':
                            ma50 = param.value;
                            break;
                        case 'MA250':
                            ma250 = param.value;
                            break;
                        default:
                            for (const item of klineMAListDisplay) {
                                if (item.display && param.seriesName == item.ma) {
                                    maOthers.push({
                                        ma: param.seriesName,
                                        value: param.value
                                    });
                                    break;
                                }
                            }
                    }
                });
                let formatContext = result.data.name + "<br>时间：" + params[0].name
                + "<br>开盘：" + values[1] + "&nbsp;&nbsp;收盘：" + values[2] 
                + "<br>最低：" + values[3] + "&nbsp;&nbsp;最高：" + values[4]
                + "<br>成交量：" + volumn + "万"
                + "<br>成交额：" + money + "亿" 
                + "<br>涨跌幅：" + values[7] + "%<br>";
                // + (ma5 !== null ? "MA5：" + ma5 + "&nbsp;&nbsp;" : "")
                // + (ma10 !== null ? "MA10：" + ma10 + "&nbsp;&nbsp;" : "")
                // + (ma20 !== null ? "<br>MA20：" + ma20 + "&nbsp;&nbsp;" : "")
                // + (ma30 !== null ? "MA30：" + ma30 + "&nbsp;&nbsp;" : "")
                // + (ma50 !== null ? "<br>MA50：" + ma50 + "&nbsp;&nbsp;" : "")
                // + (ma250 !== null ? "MA250：" + ma250 + "&nbsp;&nbsp;" : "");
                let maValues = [
                        { value: ma5, label: "MA5：" },
                        { value: ma10, label: "MA10：" },
                        { value: ma20, label: "MA20：" },
                        { value: ma30, label: "MA30：" },
                        { value: ma50, label: "MA50：" },
                        { value: ma250, label: "MA250：" }
                    ];
                if (!klineMA5Display) {
                    maValues = maValues.filter(item => item.label !== 'MA5：');
                }
                if (!klineMA10Display) {
                    maValues = maValues.filter(item => item.label !== 'MA10：');
                }
                if (!klineMA20Display) {
                    maValues = maValues.filter(item => item.label !== 'MA20：');
                }
                if (!klineMA30Display) {
                    maValues = maValues.filter(item => item.label !== 'MA30：');
                }
                if (!klineMA50Display) {
                    maValues = maValues.filter(item => item.label !== 'MA50：');
                }
                if (!klineMA250Display) {
                    maValues = maValues.filter(item => item.label !== 'MA250：');
                }
                for (const item of klineMAListDisplay) {
                    if (item.display) {
                        for(const maOther of maOthers) {
                            if (maOther.ma == item.ma) {
                                maValues.push({
                                    value: maOther.value,
                                    label: item.ma +'：'
                               });
                               break;
                            }
                        }
                    }
                }
                let count = 0;
                maValues.forEach((ma, index) => {
                    if (ma.value !== null) {
                        formatContext += ma.label + ma.value + "&nbsp;&nbsp;";
                        count++;
                        if (count % 2 === 0 && index < maValues.length - 1) {
                            formatContext += "<br>";
                        }
                    }
                });
                return formatContext;
            }
        },
    };
    myChart.setOption(option);
    // 画成交量图
    var volumnOption = {
        dataZoom: [
            {
                type: 'inside',
                start: zoomStart,
                end: 100
            },
            {
                id: 'dataZoom2',
                show: true,
                type: 'slider',
                top: '90%',
                start: zoomStart,
                end: 100
            }
        ],
        xAxis: {
            data: data0.categoryData,  // X 轴数据，与主图相同
            type: 'category',
            axisLabel: {
                textStyle: {
                    fontSize: imageTextSize // 调小字体大小使其适应空间
                },
                interval: interval, // 调整刻度显示间隔
            },
        },
        yAxis: {
            type: 'value',
            position: 'right',
            axisLabel: {
                show: false, // 不显示 Y 轴坐标数字
                textStyle: {
                    fontSize: imageTextSize // 调小字体大小使其适应空间
                },
            },
        },
        series: [
            {
                data: data0.volumnData, // 成交量数据
                type: 'bar',
                itemStyle: {
                    color: function(params) {
                        var dataIndex = params.dataIndex;
                        // 获取主图的数据
                        var change = data0.changes[dataIndex];
                        // 设置不同的颜色
                        if (parseFloat(change + '') >= 0) {
                            return redColor; // 比主图线高时的颜色
                        } else {
                            return blueColor; // 比主图线低时的颜色
                        }
                    },
                },
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
                var volumn = parseFloat(data0.volumnData[dataIndex] / 10000).toFixed(2);
                return "时间：" + params[0].name + "<br>成交量：" + volumn + "万";
            }
        },
    };
    // 使用配置项设置成交量图
    volumnChart.setOption(volumnOption);
    echarts.connect([volumnChart],[myChart])

    // 监听 dataZoom 事件
    myChart.on('dataZoom', function (event) {
        if (event.batch) {
            // 批量操作时，不再次触发
            let zoomInfo = event.batch[0];
            volumnChart.dispatchAction({
                type: 'dataZoom',
                start: zoomInfo.start,
                end: zoomInfo.end
            });
            return;
        }
        // 根据 event.dataZoomId 判断是哪个图表发生了缩放
        if (event.dataZoomId === 'dataZoom1') {
            volumnChart.dispatchAction({
                type: 'dataZoom',
                start: event.start,
                end: event.end
            });
        }
    });
    // 监听 dataZoom 事件
    volumnChart.on('dataZoom', function (event) {
        if (event.batch) {
            let zoomInfo = event.batch[0];
            myChart.dispatchAction({
                type: 'dataZoom',
                start: zoomInfo.start,
                end: zoomInfo.end
            });
            return;
        }
        // 根据 event.dataZoomId 判断是哪个图表发生了缩放
        if (event.dataZoomId === 'dataZoom2') {
            myChart.dispatchAction({
                type: 'dataZoom',
                start: event.start,
                end: event.end
            });
        }
    });

}
// 自定义函数，计算五日均线数据
function calculateMA(dayCount, data) {
    let toFixedVolume = 2;
    if (parseFloat(data[0]) <= 5) {
        toFixedVolume = 3;
    }
    let result = [];
    for (let i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
            sum += parseFloat(data[i - j][1]); // 这里假设收盘价在数据中的索引为 1
        }
        result.push((sum / dayCount).toFixed(toFixedVolume));
    }
    return result;
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
    const volumnData = [];
    const priceData = [];
    const values = [];
    const changes = [];
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
        volumnData.push(rawData[i][4]);
        priceData.push(rawData[i][3]);
        changes.push(rawData[i][6]);
    }
    return {
        categoryData: categoryData,
        volumnData: volumnData,
        priceData: priceData,
        values: values,
        changes: changes,
    };
}
// 每次初始化修改分时图图表大小
function setEchartsSize(myChart, volumnChart) {
    console.log('改变echartSize');
    // 设置容器的宽度和高度
    if (windowSize == 'NORMAL') {
        myChart.getDom().style.width = '630px';
        myChart.getDom().style.height = '360px';
        volumnChart.getDom().style.width = '630px';
    } else if (windowSize == 'SMALL') {
        myChart.getDom().style.width = '580px';
        myChart.getDom().style.height = '300px';
        volumnChart.getDom().style.width = '580px';
    } else if (windowSize == 'MINI') {
        myChart.getDom().style.width = '380px';
        myChart.getDom().style.height = '280px';
        volumnChart.getDom().style.width = '380px';
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
                    break;
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