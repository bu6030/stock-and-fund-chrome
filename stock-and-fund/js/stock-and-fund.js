var stockTotalIncome;
var fundTotalIncome;
var stockDayIncome;
var fundDayIncome;
var stockTotalmarketValue;
var fundTotalmarketValue;
var stockTotalCostValue;
var fundTotalCostValue;
var totalMarketValue;
var fundList;
var stockList;

// 整个程序的初始化
window.addEventListener("load", async (event) => {
    let password = await readCacheData('password');
    // 如果 password 存在，需要验证密码
    if (password != null && password != '') {
        // 展示password-check-modal
        $('#password-check-modal').modal('show');
        // 隐藏密码保护按钮
        $("#show-password-protect-button")[0].style.display = 'none';
        $("#data-export-button")[0].style.display = 'none';
        $("#import-from-local-springboot")[0].style.display = 'none';
    } else {
        // 没有密码直接展示
        initLoad();
    }
});

// 初始化加载基金股票缓存
async function initLoad() {
    var funds = await readCacheData('funds');
    if (funds == null) {
        fundList = [];
    } else {
        fundList = jQuery.parseJSON(funds);
    }

    var stocks = await readCacheData('stocks');
    if (stocks == null) {
        stockList = [];
    } else {
        stockList = jQuery.parseJSON(stocks);
    }
    // 展示密码保护按钮
    $("#show-password-protect-button")[0].style.display = 'inline';
    $("#data-export-button")[0].style.display = 'inline';
    initHtml();
    initData();
    initLargeMarketData();
    // 20s刷新
    setInterval(autoRefresh, 20000);
}

// 20s自动刷新
function autoRefresh() {
    var date = new Date();
    var isTradingTime = (date.toLocaleTimeString() >= "09:15:00" && date.toLocaleTimeString() <= "11:31:00")
        || (date.toLocaleTimeString() >= "13:00:00" && date.toLocaleTimeString() <= "15:01:00");
    if (isTradingTime) {
        initData();
        initLargeMarketData();
    }
}

// 初始化 Html 页面
function initHtml() {
    if (develop) {
        document.getElementById('import-from-local-springboot').classList.remove('fade');
    }
    var stockHead = " <tr > " +
        " <th >股票名称</th> " +
        " <th >当日盈利</th> " +
        " <th >涨跌幅</th> " +
        " <th >当前价</th> " +
        " <th >成本价</th> " +
        " <th >持仓</th> " +
        " <th >市值/金额</th> " +
        " <th >持仓占比</th> " +
        " <th >成本</th> " +
        " <th >收益率</th> " +
        " <th >收益</th> " +
        " <th >自选价格</th> " +
        " </tr>";
    var fundHead = " <tr >" +
        " <th >基金名称</th>" +
        " <th >当日盈利</th>" +
        " <th >涨跌幅</th>" +
        " <th >估算净值</th>" +
        " <th >持仓成本</th>" +
        " <th >持有份额</th>" +
        " <th >市值/金额</th>" +
        " <th >持仓占比</th>" +
        " <th >成本</th> " +
        " <th >收益率</th>" +
        " <th >收益</th>" +
        " <th >自选价格</th> " +
        " </tr>";
    $("#fund-head").html(fundHead);
    $("#stock-head").html(stockHead);
    // 在页面顶部显示一些监控信息，重要信息
    initNotice();
    initFontStyle();
}

// 按钮监听事件
document.addEventListener(
    'DOMContentLoaded',
    function () {
        // 首页，导入数据按钮点击展示导入数据页面
        document.getElementById('show-import-data').addEventListener('click', function () {
            $("#data-import-modal").modal();
        }
        );
        // 首页，导出数据按钮点击展导出 txt 文件
        document.getElementById('data-export-button').addEventListener('click', function () {
            var data = {};
            data.stocks = stockList;
            data.funds = fundList;
            downloadJsonOrTxt('股票基金神器.txt', JSON.stringify(data));
        }
        );
        // 导入数据页面，导入文件选择 txt 文件导入数据
        document.getElementById('file-input').addEventListener('change', async function (e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var contents = e.target.result;
                var json = JSON.parse(contents);
                // 在这里处理您的 JSON 数据
                saveCacheData('stocks', JSON.stringify(json.stocks));
                saveCacheData('funds', JSON.stringify(json.funds));
                $("#data-import-modal").modal("hide");
                location.reload();
            };
            reader.readAsText(file);
        });
        // 基金编辑页面，点击保存按钮
        document.getElementById('fund-save-button').addEventListener('click', function () {
            saveFund();
        }
        );
        // 股票编辑页面，点击保存按钮
        document.getElementById('stock-save-button').addEventListener('click', function () {
            saveStock();
        }
        );
        // 首页，自己开发时方便从 SpringBoot 项目直接导入数据
        if (develop) {
            document.getElementById('import-from-local-springboot').addEventListener('click', function () {
                let result = ajaxGetStockAndFundFromLocalService();
                if (result != null && result != '' && result != undefined) {
                    saveCacheData('stocks', JSON.stringify(result.stocks));
                    saveCacheData('funds', JSON.stringify(result.funds));
                    location.reload();
                }
            });
        }
        // 股票编辑页面，点击删除按钮
        document.getElementById('stock-delete-button').addEventListener('click', async function () {
            var stocks = await readCacheData('stocks');
            stocks = jQuery.parseJSON(stocks);
            var code = $("#stock-code").val();
            for (var k in stocks) {
                if (stocks[k].code == code) {
                    // delete stocks[k];
                    stocks.splice(k, 1)
                    break;
                }
            }
            saveCacheData('stocks', JSON.stringify(stocks));
            $("#stock-modal").modal("hide");
            location.reload();
        }
        );
        // 基金编辑页面，点击删除按钮
        document.getElementById('fund-delete-button').addEventListener('click', async function () {
            var funds = await readCacheData('funds');
            funds = jQuery.parseJSON(funds);
            var code = $("#fund-code").val();
            for (var k in funds) {
                if (funds[k].fundCode == code) {
                    funds.splice(k, 1)
                    break;
                }
            }
            saveCacheData('funds', JSON.stringify(funds));
            $("#fund-modal").modal("hide");
            location.reload();
        }
        );
        // 走势图页面，点击股票基金按钮
        document.getElementById('stock-fund-delete-button').addEventListener('click', async function () {
            if (timeImageType == "FUND") {
                var funds = await readCacheData('funds');
                funds = jQuery.parseJSON(funds);
                for (var k in funds) {
                    if (funds[k].fundCode == timeImageCode) {
                        // delete funds[k];
                        funds.splice(k, 1)
                        break;
                    }
                }
                saveCacheData('funds', JSON.stringify(funds));
                $("#time-image-modal").modal("hide");
                location.reload();
            } else {
                var stocks = await readCacheData('stocks');
                stocks = jQuery.parseJSON(stocks);
                for (var k in stocks) {
                    if (stocks[k].code == timeImageCode) {
                        // delete stocks[k];
                        stocks.splice(k, 1)
                        break;
                    }
                }
                saveCacheData('stocks', JSON.stringify(stocks));
                $("#time-image-modal").modal("hide");
                location.reload();
            }
        })
        // 基金编辑页面，点击走势图按钮
        document.getElementById('fund-show-time-image-button').addEventListener('click', function () {
            let fundCode = $("#fund-code").val();
            timeImageCode = fundCode;
            timeImageType = "FUND";
            showMinuteImage();
        }
        );
        // 股票编辑页面，点击走势图按钮
        document.getElementById('stock-show-time-image-button').addEventListener('click', function () {
            let stockCode = $("#stock-code").val();
            timeImageCode = stockCode;
            timeImageType = "STOCK";
            showMinuteImage();
        }
        );
        // 走势图页面，点击分时图按钮
        document.getElementById('time-image-minute-button').addEventListener('click', function () {
            showMinuteImage();
        }
        );
        // 走势图页面，日线图按钮点击
        document.getElementById('time-image-day-button').addEventListener('click', function () {
            showDayImage();
        }
        );
        // 走势图页面，周线图按钮点击
        document.getElementById('time-image-week-button').addEventListener('click', function () {
            showWeekImage();
        }
        );
        // 走势图页面，月线图按钮点击
        document.getElementById('time-image-month-button').addEventListener('click', function () {
            showMonthImage();
        }
        );
        // 首页，清理数据按钮点击
        document.getElementById('remove-all-data-button').addEventListener('click', function () {
            let stocksRemove = [];
            let fundsRemove = [];
            saveCacheData('stocks', JSON.stringify(stocksRemove));
            saveCacheData('funds', JSON.stringify(fundsRemove));
            location.reload();
        }
        );
        // 首页，在股票搜索名称输入框中点击回车
        document.getElementById('input-stock-name-search').addEventListener('keydown', async function () {
            if (event.key === 'Enter') {
                searchFundAndStock();
            }
        });
        // 首页，在基金搜索名称输入框中点击回车
        document.getElementById('input-fund-name-search').addEventListener('keydown', async function () {
            if (event.key === 'Enter') {
                searchFundAndStock();
            }
        });
        // 首页，输入股票名称后点击搜索股票/基金按钮
        document.getElementById('stock-fund-name-search-button').addEventListener('click', async function () {
            searchFundAndStock();
        });
        // 搜索股票页面，股票列表点击选择
        document.getElementById('search-stock-select').addEventListener('change', function () {
            let stockCode = $("#search-stock-select").val();
            $("#stock-code").val(stockCode);
            $("#stock-name").val('');
            saveStock();
        }
        );
        // 搜索基金页面，基金列表点击选择
        document.getElementById('search-fund-select').addEventListener('change', function () {
            let fundCode = $("#search-fund-select").val();
            $("#fund-code").val(fundCode);
            $("#fund-name").val('');
            saveFund();
        }
        );
        // 首页，使用说明按钮点击
        document.getElementById('help-document-button').addEventListener('click', function () {
            chrome.tabs.create({ url: Env.GET_HELP_DOCUMENT });
        });
        document.getElementById('help-document-alert').addEventListener('click', function () {
            chrome.tabs.create({ url: Env.GET_HELP_DOCUMENT });
        });
        // 走势图页面，点击编辑按钮
        document.getElementById('update-stock-fund-button').addEventListener('click', function () {
            $("#time-image-modal").modal("hide");
            if (timeImageType == "FUND") {
                $("#fund-modal").modal();
            } else {
                $("#stock-modal").modal();
            }
        }
        );
        // 首页，点击加入微信群
        document.getElementById('show-wechat-group-button').addEventListener('click', function () {
            let timestamp = Date.now();
            let path = Env.WECHAT_GROUP_QR_CODE + "?date=" + timestamp;
            $("#wechat-group-qr-code-image").html('<img src="' + path + '" width="60%" length="60%" />');
            $("#wechat-group-modal").modal();
        }
        );
        // 首页，点击全屏按钮
        document.getElementById('full-screen-button').addEventListener('click', async function () {
            chrome.tabs.create({ url: "popup.html" });
        })
        // 首页，点击样式切换
        document.getElementById('font-change-button').addEventListener('click', async function () {
            changeFontStyle();
        })
        // 首页，show-passwrod-protect-button点击，展示password-protect-modal
        document.getElementById('show-password-protect-button').addEventListener('click', async function () {
            $("#password-protect-modal").modal();
        })
        // 密码保护页面，password-save-button点击，缓存密码
        document.getElementById('password-save-button').addEventListener('click', async function () {
            saveCacheData('password', $("#password").val());
            $("#password-protect-modal").modal("hide");
        })
        // 验证密码页面，password-check-button点击，验证密码
        document.getElementById('password-check-button').addEventListener('click', async function () {
            if ($("#password-check").val() == await readCacheData('password')) {
                $("#password-check-modal").modal("hide");
                initLoad();
            }
        })
    }
);

// 股票搜索后，接口返回为 unicode 编码，转换为中文
function A2U(str) {
    return unescape(str.replace(/\\u/gi, '%u'));
}

// 初始化首页股票列表数据
function initData() {
    initFirstInstall();
    var stocks = "";
    for (var k in stockList) {
        stocks += stockList[k].code + ",";
    }
    let result = ajaxGetStockFromGtimg(stocks);
    var stoksArr = result.split("\n");
    for (var k in stoksArr) {
        for (var l in stockList) {
            if (stockList[l].code == stoksArr[k].substring(stoksArr[k].indexOf("_") + 1, stoksArr[k].indexOf("="))) {
                var dataStr = stoksArr[k].substring(stoksArr[k].indexOf("=") + 2, stoksArr[k].length - 2);
                var values = dataStr.split("~");
                stockList[l].name = values[1] + "";
                stockList[l].now = values[3] + "";
                stockList[l].change = values[31] + "";
                stockList[l].changePercent = values[32] + "";
                stockList[l].time = values[30] + "";
                stockList[l].max = values[33] + "";
                stockList[l].min = values[34] + "";
                // stockList[l].buyOrSellStockRequestList = [];

                var now = new BigDecimal(stockList[l].now + "");
                var costPrise = new BigDecimal(stockList[l].costPrise + "")
                var incomeDiff = now.add(costPrise.negate());
                if (costPrise <= 0) {
                    stockList[l].incomePercent = 0 + "";
                } else {
                    var incomePercent = incomeDiff.divide(costPrise, 5, 4)
                        .multiply(BigDecimal.TEN)
                        .multiply(BigDecimal.TEN)
                        .setScale(3);
                    stockList[l].incomePercent = incomePercent + "";
                }

                var bonds = new BigDecimal(stockList[l].bonds);
                var income = incomeDiff.multiply(bonds)
                    .setScale(2);
                stockList[l].income = income + "";
            }
        }
    }
    initFund();
}

// 初始化首页基金列表数据
function initFund() {
    for (var l in fundList) {
        var fundCode = fundList[l].fundCode;
        let result = ajaxGetFundFromTiantianjijin(fundList[l].fundCode);
        if (result == "" || result == null || result == undefined) {
            // 有些基金找不到接口会报 404 报错，调用另外一个接口
            for (var k in fundList) {
                if (fundList[k].fundCode == fundCode) {
                    let fund = checkFundExsitFromEastMoney(fundCode);
                    fundList[k].dwjz = fund.dwjz;
                    fundList[k].gsz = fund.dwjz;
                    fundList[k].gszzl = "0";
                    fundList[k].income = "0";
                    fundList[k].incomePercent = "0";
                    fundList[k].name = fund.name;
                    var costPrice = new BigDecimal(fundList[k].costPrise + "");
                    var now = new BigDecimal(fund.dwjz + "");
                    var incomeDiff = now.add(costPrice.negate());
                    if (costPrice <= 0) {
                        fundList[k].incomePercent = "0";
                    } else {
                        let incomePercent = incomeDiff.divide(costPrice, 8, MathContext.ROUND_HALF_UP)
                            .multiply(BigDecimal.TEN)
                            .multiply(BigDecimal.TEN)
                            .setScale(3, MathContext.ROUND_HALF_UP);
                        let bonds = new BigDecimal(fundList[k].bonds + "");
                        let income = incomeDiff.multiply(bonds)
                            .setScale(2, MathContext.ROUND_HALF_UP);
                        fundList[k].income = income + "";
                        fundList[k].incomePercent = incomePercent + "";
                    }
                }
            }
        } else {
            for (var k in fundList) {
                if (fundList[k].fundCode == fundCode) {
                    if (result != "jsonpgz();") {
                        var json = jQuery.parseJSON(result.substring(8, result.length - 2));
                        fundList[k].name = json.name + "";
                        fundList[k].dwjz = json.dwjz + "";
                        fundList[k].jzrq = json.jzrq + "";
                        fundList[k].gsz = json.gsz + "";
                        fundList[k].gztime = json.gztime + "";
                        var gsz = new BigDecimal(json.gsz + "");
                        var dwjz = new BigDecimal(json.dwjz + "");
                        fundList[k].gszzl = json.gszzl + "";

                        var now = new BigDecimal(json.gsz + "");
                        var costPrice = new BigDecimal(fundList[k].costPrise + "");
                        var incomeDiff = now.add(costPrice.negate());
                        if (costPrice <= 0) {
                            fundList[k].incomePercent = "0";
                        } else {
                            var incomePercent = incomeDiff.divide(costPrice, 8, MathContext.ROUND_HALF_UP)
                                .multiply(BigDecimal.TEN)
                                .multiply(BigDecimal.TEN)
                                .setScale(3, MathContext.ROUND_HALF_UP);
                            fundList[k].incomePercent = incomePercent + "";
                        }
                        var bonds = new BigDecimal(fundList[k].bonds + "");
                        var income = incomeDiff.multiply(bonds)
                            .setScale(2, MathContext.ROUND_HALF_UP);
                        fundList[k].income = income + "";
                    } else {
                        let fund = checkFundExsitFromEastMoney(fundCode);
                        fundList[k].dwjz = fund.dwjz;
                        fundList[k].gsz = fund.dwjz;
                        fundList[k].gszzl = "0";
                        fundList[k].income = "0";
                        fundList[k].incomePercent = "0";
                        fundList[k].name = fund.name;
                        var costPrice = new BigDecimal(fundList[k].costPrise + "");
                        var now = new BigDecimal(fund.dwjz + "");
                        var incomeDiff = now.add(costPrice.negate());
                        if (costPrice <= 0) {
                            fundList[k].incomePercent = "0";
                        } else {
                            let incomePercent = incomeDiff.divide(costPrice, 8, MathContext.ROUND_HALF_UP)
                                .multiply(BigDecimal.TEN)
                                .multiply(BigDecimal.TEN)
                                .setScale(3, MathContext.ROUND_HALF_UP);
                            let bonds = new BigDecimal(fundList[k].bonds + "");
                            let income = incomeDiff.multiply(bonds)
                                .setScale(2, MathContext.ROUND_HALF_UP);
                            fundList[k].income = income + "";
                            fundList[k].incomePercent = incomePercent + "";
                        }

                    }
                }
            }
        }
    }
    initStockAndFundHtml();
}

// 检查基金是否存在
function checkFundExsit(code) {
    var fund = {};
    let result = ajaxGetFundFromTiantianjijin(code);
    if (result == "" || result == null || result == undefined || result == "jsonpgz();") {
        fund.checkReuslt = false;
    } else {
        var json = jQuery.parseJSON(result.substring(8, result.length - 2));
        fund.name = json.name + "";
        fund.dwjz = json.dwjz + "";
        fund.jzrq = json.jzrq + "";
        fund.gsz = json.gsz + "";
        fund.gztime = json.gztime + "";
        var gsz = new BigDecimal(json.gsz + "");
        var dwjz = new BigDecimal(json.dwjz + "");
        fund.gszzl = gsz.subtract(dwjz).divide(gsz, 4).multiply(new BigDecimal("100")).setScale(2) + "";
        var now = new BigDecimal(json.gsz + "");
        fund.checkReuslt = true;
        fund.now = now + "";
    }
    return fund;
}

// 调用接口或缓存检查基金是否存在
function checkFundExsitFromEastMoney(code) {
    let fund = ajaxGetFundFromEastMoney(code);
    if (fund.name != '' && fund.name != undefined) {
        fund.checkReuslt = true;
    } else {
        fund.checkReuslt = false;
    }
    return fund;
}

// 检查股票是否存在
function checkStockExsit(code) {
    let stock = {};
    let result = ajaxGetStockFromGtimg(code);
    let stoksArr = result.split("\n");
    let dataStr = stoksArr[0].substring(stoksArr[0].indexOf("=") + 2, stoksArr[0].length - 2);
    let values = dataStr.split("~");
    if (values.length > 5) {
        stock.name = values[1] + "";
        stock.now = values[3] + "";
        stock.change = values[31] + "";
        stock.changePercent = values[32] + "";
        stock.time = values[30] + "";
        stock.max = values[33] + "";
        stock.min = values[34] + "";
        stock.buyOrSellStockRequestList = [];
        stock.checkReuslt = true;
    } else {
        stock.checkReuslt = false;
    }
    return stock;
}

// 股票基金列表获取完毕后，初始化 html 页面
function initStockAndFundHtml() {
    var marketValue = new BigDecimal("0");
    totalMarketValue = new BigDecimal("0");
    for (var k = stockList.length - 1; k >= 0; k--) {
        marketValue = (new BigDecimal(stockList[k].now)).multiply(new BigDecimal(stockList[k].bonds));
        totalMarketValue = totalMarketValue.add(marketValue);
    }

    for (var k = fundList.length - 1; k >= 0; k--) {
        marketValue = new BigDecimal(parseFloat((new BigDecimal(fundList[k].gsz + "")).multiply(new BigDecimal(fundList[k].bonds + ""))).toFixed(2));
        totalMarketValue = totalMarketValue.add(marketValue);
    }

    var str1 = getStockTableHtml(stockList, totalMarketValue);
    $("#stock-nr").html(str1);

    var str2 = getFundTableHtml(fundList, totalMarketValue);
    $("#fund-nr").html(str2);

    var str3 = getTotalTableHtml(totalMarketValue);
    $("#total-nr").html(str3);

    for (k in stockList) {
        let stockTr = document.getElementById('stock-tr-' + k);
        stockTr.addEventListener('click', function () {
            $("#stock-name").val(stockList[this.sectionRowIndex].name);
            $("#stock-name").attr("disabled", "disabled");
            $("#stock-code").val(stockList[this.sectionRowIndex].code);
            $("#stock-costPrise").val(stockList[this.sectionRowIndex].costPrise);
            $("#stock-bonds").val(stockList[this.sectionRowIndex].bonds);
            $("#stock-monitor-high-price").val(stockList[this.sectionRowIndex].monitorHighPrice);
            $("#stock-monitor-low-price").val(stockList[this.sectionRowIndex].monitorLowPrice);
            $("#stock-show-time-image-button")[0].style.display = 'inline';
            $("#stock-fund-delete-button")[0].style.display = 'inline';
            let stockCode = $("#stock-code").val();
            timeImageCode = stockCode;
            timeImageType = "STOCK";
            showMinuteImage();
        });
    }

    for (k in fundList) {
        let fundTr = document.getElementById('fund-tr-' + k);
        fundTr.addEventListener('click', function () {
            $("#fund-name").val(fundList[this.sectionRowIndex].name);
            $("#fund-name").attr("disabled", "disabled");
            $("#fund-code").val(fundList[this.sectionRowIndex].fundCode);
            $("#fund-costPrise").val(fundList[this.sectionRowIndex].costPrise);
            $("#fund-bonds").val(fundList[this.sectionRowIndex].bonds);
            if (isCycleInvest) {
                $("#fund-cycle-invest-type").val(fundList[this.sectionRowIndex].fundCycleInvestType);
                $("#fund-cycle-invest-date").val(fundList[this.sectionRowIndex].fundCycleInvestDate);
                $("#fund-cycle-invest-value").val(fundList[this.sectionRowIndex].fundCycleInvestValue);
                $("#fund-cycle-invest-rate").val(fundList[this.sectionRowIndex].fundCycleInvestRate);
                $("#fund-cycle-invest")[0].style.display = "block";
            } else {
                $("#fund-cycle-invest")[0].style.display = "none";
            }
            $("#fund-show-time-image-button")[0].style.display = 'inline';
            $("#stock-fund-delete-button")[0].style.display = 'inline';
            let fundCode = $("#fund-code").val();
            timeImageCode = fundCode;
            timeImageType = "FUND";
            showMinuteImage();
        });
    }
}

// 拼接股票 html
function getStockTableHtml(result, totalMarketValueResult) {
    var str = "";
    stockTotalIncome = new BigDecimal("0");
    stockDayIncome = new BigDecimal("0");
    stockTotalmarketValue = new BigDecimal("0");
    stockTotalCostValue = new BigDecimal("0");
    var dayIncome = new BigDecimal("0");
    var marketValue = new BigDecimal("0");
    var marketValuePercent = new BigDecimal("0");
    for (var k in result) {
        var buyOrSells = result[k].buyOrSellStockRequestList;
        var todayBuyIncom = new BigDecimal("0");
        var todaySellIncom = new BigDecimal("0");
        var maxBuyOrSellBonds = 0;
        for (var l in buyOrSells) {
            // 当天购买过
            if (buyOrSells[l].type == "1") {
                maxBuyOrSellBonds = maxBuyOrSellBonds + buyOrSells[l].bonds;
                var buyIncome = (new BigDecimal(result[k].now))
                    .subtract(new BigDecimal(buyOrSells[l].price + ""))
                    .multiply(new BigDecimal(buyOrSells[l].bonds + ""));
                todayBuyIncom = todayBuyIncom.add(buyIncome);
            }
            // 当天卖出过
            if (buyOrSells[l].type == "2") {
                todaySellIncom = todaySellIncom.add(new BigDecimal(buyOrSells[l].income + ""));
            }
        }
        if (maxBuyOrSellBonds < result[k].bonds) {
            var restBonds = (new BigDecimal(result[k].bonds)).subtract(new BigDecimal(maxBuyOrSellBonds + ""));
            dayIncome = (new BigDecimal(result[k].change)).multiply(restBonds);
        } else {
            dayIncome = new BigDecimal("0");
        }
        dayIncome = dayIncome.add(todayBuyIncom).add(todaySellIncom);
        marketValue = (new BigDecimal(result[k].now)).multiply(new BigDecimal(result[k].bonds));
        if (totalMarketValueResult.compareTo(new BigDecimal("0")) != 0) {
            marketValuePercent = marketValue.multiply(new BigDecimal("100")).divide(totalMarketValueResult, 4);
        }
        var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome >= 0 ? "style=\"color:#c12e2a;\"" : "style=\"color:#3e8f3e;\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income >= 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
        let addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" + result[k].addTime + ")";
        // 计算股票总成本
        var costPrice = new BigDecimal(result[k].costPrise + "");
        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(result[k].bonds))).toFixed(2));
        stockTotalCostValue = stockTotalCostValue.add(costPriceValue);

        str += "<tr id=\"stock-tr-" + k + "\">"
            + "<td >" + result[k].name
            + "</td><td " + dayIncomeStyle + ">" + dayIncome.setScale(2)
            + "</td><td " + dayIncomeStyle + ">" + result[k].changePercent + "%"
            + "</td><td>" + result[k].now
            + "</td><td >" + result[k].costPrise
            + "</td><td>" + result[k].bonds
            + "</td><td >" + marketValue.setScale(2)
            + "</td><td >" + marketValuePercent + "%"
            + "</td><td >" + costPriceValue
            + "</td><td " + totalIncomeStyle + ">" + result[k].incomePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].income
            + "</td><td >" + addTimePrice
            + "</td></tr>";
        stockTotalIncome = stockTotalIncome.add(new BigDecimal(result[k].income));
        stockDayIncome = stockDayIncome.add(dayIncome);
        stockTotalmarketValue = stockTotalmarketValue.add(marketValue);
    }
    var stockDayIncomePercent = new BigDecimal("0");
    var stockTotalIncomePercent = new BigDecimal("0");
    if (stockTotalmarketValue > 0) {
        stockDayIncomePercent = stockDayIncome.multiply(new BigDecimal("100")).divide(stockTotalmarketValue.subtract(stockDayIncome), 4);
    }
    if (stockTotalCostValue > 0) {
        stockTotalIncomePercent = stockTotalIncome.multiply(new BigDecimal("100")).divide(stockTotalCostValue, 4);
    }
    var stockDayIncomePercentStyle = stockDayIncome == 0 ? "" : (stockDayIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    var stockTotalIncomePercentStyle = stockTotalIncome == 0 ? "" : (stockTotalIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    str += "<tr><td>合计</td><td " + stockDayIncomePercentStyle + ">" + stockDayIncome.setScale(2) + "</td><td " + stockDayIncomePercentStyle + ">" + stockDayIncomePercent.setScale(2, 4) + "%</td><td colspan='3'></td><td colspan='2'>" + stockTotalmarketValue.setScale(2) + "</td><td>" + stockTotalCostValue + "</td><td " + stockTotalIncomePercentStyle + ">" + stockTotalIncomePercent + "%</td><td " + stockTotalIncomePercentStyle + ">" + stockTotalIncome
        + "</td><td></td></tr>";
    return str;
}

// 拼接基金 html
function getFundTableHtml(result, totalMarketValueResult) {
    var str = "";
    fundTotalIncome = new BigDecimal("0");
    fundDayIncome = new BigDecimal("0");
    fundTotalmarketValue = new BigDecimal("0");
    fundTotalCostValue = new BigDecimal("0");
    var dayIncome = new BigDecimal("0");
    var marketValue = new BigDecimal("0");
    var marketValuePercent = new BigDecimal("0");
    for (var k in result) {
        dayIncome = new BigDecimal(parseFloat((new BigDecimal(result[k].gszzl)).multiply((new BigDecimal(result[k].dwjz))).multiply(new BigDecimal(result[k].bonds + "")).divide(new BigDecimal("100"))).toFixed(2));
        marketValue = new BigDecimal(parseFloat((new BigDecimal(result[k].gsz)).multiply(new BigDecimal(result[k].bonds + ""))).toFixed(2));
        if (totalMarketValueResult.compareTo(new BigDecimal("0")) != 0) {
            marketValuePercent = marketValue.multiply(new BigDecimal("100")).divide(totalMarketValueResult, 4);
        }
        var dayIncomeStyle = dayIncome == 0 ? "" : (dayIncome > 0 ? "style=\"color:#c12e2a;\"" : "style=\"color:#3e8f3e;\"");
        var totalIncomeStyle = result[k].income == 0 ? "" : (result[k].income > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
        let addTimePrice = !result[k].addTimePrice ? "--" : result[k].addTimePrice + "(" + result[k].addTime + ")";
        // 计算基金总成本
        var costPrice = new BigDecimal(result[k].costPrise + "");
        var costPriceValue = new BigDecimal(parseFloat(costPrice.multiply(new BigDecimal(result[k].bonds + ""))).toFixed(2));
        fundTotalCostValue = fundTotalCostValue.add(costPriceValue);

        str += "<tr id=\"fund-tr-" + k + "\">"
            + "<td >" + result[k].name
            + "</td><td " + dayIncomeStyle + ">" + dayIncome
            + "</td><td " + dayIncomeStyle + ">" + result[k].gszzl + "%"
            + "</td><td>" + result[k].gsz
            + "</td><td >" + result[k].costPrise
            + "</td><td>" + result[k].bonds
            + "</td><td >" + marketValue
            + "</td><td >" + marketValuePercent + "%"
            + "</td><td >" + costPriceValue
            + "</td><td " + totalIncomeStyle + ">" + result[k].incomePercent + "%"
            + "</td><td " + totalIncomeStyle + ">" + result[k].income
            + "</td><td >" + addTimePrice
            + "</td></tr>";
        fundTotalIncome = fundTotalIncome.add(new BigDecimal(result[k].income));
        fundDayIncome = fundDayIncome.add(dayIncome);
        fundTotalmarketValue = fundTotalmarketValue.add(marketValue);
    }
    var fundDayIncomePercent = new BigDecimal("0");
    var fundTotalIncomePercent = new BigDecimal("0");
    if (fundTotalmarketValue > 0) {
        fundDayIncomePercent = fundDayIncome.multiply(new BigDecimal("100")).divide(fundTotalmarketValue.subtract(fundDayIncome), 4);
    }
    if (fundTotalCostValue > 0) {
        fundTotalIncomePercent = fundTotalIncome.multiply(new BigDecimal("100")).divide(fundTotalCostValue, 4);
    }
    var fundDayIncomePercentStyle = fundDayIncome == 0 ? "" : (fundDayIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    var fundTotalIncomePercentStyle = fundTotalIncome == 0 ? "" : (fundTotalIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    str += "<tr><td>合计</td><td " + fundDayIncomePercentStyle + ">" + fundDayIncome + "</td><td colspan='2' " + fundDayIncomePercentStyle + ">" + fundDayIncomePercent + "%</td><td colspan='2'></td><td colspan='2'>" + fundTotalmarketValue + "</td><td>" + fundTotalCostValue + "</td><td " + fundTotalIncomePercentStyle + ">" + fundTotalIncomePercent + "%</td><td " + fundTotalIncomePercentStyle + ">" + fundTotalIncome
        + "</td><td></td></tr>";

    return str;
}

// 拼接汇总 html
function getTotalTableHtml(totalMarketValueResult) {
    var str = "";
    var allDayIncome = fundDayIncome.add(stockDayIncome);
    var allTotalIncome = fundTotalIncome.add(stockTotalIncome);
    var allDayIncomePercent = new BigDecimal("0");
    var allTotalIncomePercent = new BigDecimal("0");
    var totalCostPrice = fundTotalCostValue.add(stockTotalCostValue);
    if (totalMarketValueResult != 0) {
        allDayIncomePercent = allDayIncome.multiply(new BigDecimal("100")).divide(totalMarketValueResult.add(allDayIncome), 4);
    }
    if (totalCostPrice > 0) {
        allTotalIncomePercent = allTotalIncome.multiply(new BigDecimal("100")).divide(totalCostPrice, 4);
    }
    var allDayIncomePercentStyle = allDayIncome == 0 ? "" : (allDayIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");
    var allTotalIncomePercentStyle = allTotalIncome == 0 ? "" : (allTotalIncome > 0 ? "style=\"color:#c12e2a\"" : "style=\"color:#3e8f3e\"");

    str += "<tr><td>汇总合计</td><td " + allDayIncomePercentStyle + ">" + allDayIncome.setScale(2) + "</td><td colspan='2' " + allDayIncomePercentStyle + ">" + allDayIncomePercent.setScale(2, 4) + "%</td><td colspan='2'></td><td colspan='2'>" + totalMarketValueResult.setScale(2) + "</td><td>" + totalCostPrice + "</td><td " + allTotalIncomePercentStyle + ">" + allTotalIncomePercent + "%</td><td " + allTotalIncomePercentStyle + ">" + allTotalIncome
        + "</td><td></td></tr>";

    return str;
}

// 通过股票名称搜索股票列表
function searchStockByName(name) {
    if (name.indexOf("sh") != -1 || name.indexOf("sz") != -1
        || name.indexOf("SH") != -1 || name.indexOf("SZ") != -1) {
        name = name.substring(2, name.length);
    }
    var stocksArr;
    let result = ajaxGetStockCodeByNameFromGtimg(name);
    if (result.indexOf("v_hint=\"N\";") != -1) {
        alertMessage("不存在该股票");
        $("#stock-name").val("");
        return;
    }
    if (result.indexOf("v_cate_hint") != -1) {
        result = result.substring(result.indexOf("\n") + 1);
    }
    result = result.replace("v_hint=\"", "").replace(" ", "");
    stocksArr = result.split("^");
    return stocksArr;
}

// 通过基金名称搜索基金列表
async function searchFundByName(name) {
    var fundsArrs = [];
    var allFundArr = await readCacheData('all_fund_arr');
    var timeCached = await readCacheData('all_fund_arr_time_cached');
    var nowTimestamp = Date.now();
    if (timeCached == null || (nowTimestamp - timeCached) >= Env.TIME_CACHED_ONE_DAY) {
        console.log("缓存超过 1 天，重新调用接口");
        allFundArr = null;
    }
    if (allFundArr != null) {
        var fundsArr = jQuery.parseJSON(allFundArr);
        for (var i = 0; i < fundsArr.length; i++) {
            // 通过名字或者基金编码查询
            if (fundsArr[i][2].indexOf(name) != -1 || fundsArr[i][0].indexOf(name) != -1) {
                var fund = {
                    "fundCode": fundsArr[i][0],
                    "fundName": fundsArr[i][2]
                };
                fundsArrs.push(fund);
            }
        }
        if (fundsArrs.length == 0) {
            // alert("未搜索到该基金");
            alertMessage("未搜索到该基金");
        }
    } else {
        let result = ajaxGetFundCodeFromTiantianjijin();
        var fundsArr = jQuery.parseJSON(result);
        var timestamp = Date.now();
        // 减少所有基金的搜索频率，缓存数据
        saveCacheData('all_fund_arr', JSON.stringify(fundsArr));
        saveCacheData('all_fund_arr_time_cached', timestamp);
        for (var i = 0; i < fundsArr.length; i++) {
            // 通过名字或者基金编码查询
            if (fundsArr[i][2].indexOf(name) != -1 || fundsArr[i][0].indexOf(name) != -1) {
                var fund = {
                    "fundCode": fundsArr[i][0],
                    "fundName": fundsArr[i][2]
                };
                fundsArrs.push(fund);
            }
        }
        if (fundsArrs.length == 0) {
            // alert("未搜索到该基金");
            alertMessage("未搜索到该基金");
        }
    }
    return fundsArrs;
}

// 保存股票
async function saveStock() {
    var costPrise = $("#stock-costPrise").val();
    var bonds = $("#stock-bonds").val();
    var monitorHighPrice = $("#stock-monitor-high-price").val();
    var monitorLowPrice = $("#stock-monitor-low-price").val();
    var code = $("#stock-code").val();
    if (code == null || code == '') {
        // alert("请添加股票编码或通过股票名称搜索");
        alertMessage("请添加股票编码或通过股票名称搜索");
        return;
    }
    if (costPrise == null || costPrise == '') {
        costPrise = "0";
    }
    if (bonds == null || bonds == '') {
        bonds = "0";
    }
    var stock = {
        "code": code,
        "costPrise": costPrise,
        "bonds": bonds,
        "monitorHighPrice": monitorHighPrice,
        "monitorLowPrice": monitorLowPrice,
    }
    var stocks = await readCacheData('stocks');
    if (stocks == null) {
        stocks = [];
    } else {
        stocks = jQuery.parseJSON(stocks);
    }
    for (var k in stocks) {
        if (stocks[k].code == stock.code) {
            stocks[k].code = stock.code;
            stocks[k].costPrise = stock.costPrise;
            stocks[k].bonds = stock.bonds;
            stocks[k].monitorHighPrice = stock.monitorHighPrice;
            stocks[k].monitorLowPrice = stock.monitorLowPrice;
            if (stocks[k].addTimePrice == null || stocks[k].addTimePrice == '') {
                let checkStockExsitResult = checkStockExsit(stocks[k].code);
                stocks[k].addTimePrice = checkStockExsitResult.now;
                stocks[k].addTime = getCurrentDate();
            }
            saveCacheData('stocks', JSON.stringify(stocks));
            stockList = stocks;
            $("#stock-modal").modal("hide");
            $("#search-stock-modal").modal("hide");
            initData();
            return;
        }
    }
    let checkStockExsitResult = checkStockExsit(stock.code);
    if (!checkStockExsitResult.checkReuslt) {
        // alert("不存在该股票");
        alertMessage("不存在该股票");
        $("#stock-modal").modal("hide");
        $("#search-stock-modal").modal("hide");
        return;
    }
    stock.addTimePrice = checkStockExsitResult.now;
    stock.addTime = getCurrentDate();
    stocks.push(stock);
    saveCacheData('stocks', JSON.stringify(stocks));
    stockList = stocks;
    $("#stock-modal").modal("hide");
    $("#search-stock-modal").modal("hide");
    initData();
}

// 保存基金
async function saveFund() {
    var costPrise = $("#fund-costPrise").val();
    var bonds = $("#fund-bonds").val();
    if (isCycleInvest) {
        var fundCycleInvestType = $("#fund-cycle-invest-type").val();
        var fundCycleInvestDate = $("#fund-cycle-invest-date").val();
        var fundCycleInvestValue = $("#fund-cycle-invest-value").val();
        var fundCycleInvestRate = $("#fund-cycle-invest-rate").val();
        // 当fundCycleInvestType存在时检测fundCycleInvestDate，fundCycleInvestValue，fundCycleInvestRate不能为空
        if (fundCycleInvestType != '' && fundCycleInvestType != 'no') {
            if (fundCycleInvestDate == null || fundCycleInvestDate == '') {
                alert("请选择基金周期投资日期");
                return;
            }
            if (fundCycleInvestValue == null || fundCycleInvestValue == '') {
                alert("请选择基金周期投资金额");
                return;
            }
            if (fundCycleInvestRate == null || fundCycleInvestRate == '') {
                alert("请选择基金周期投资收益率");
                return;
            }
        }
    }

    var code = $("#fund-code").val();
    if (code == null || code == '') {
        alertMessage("请添加基金编码或通过基金名称搜索");
        return;
    }
    if (costPrise == null || costPrise == '') {
        costPrise = "0";
    }
    if (bonds == null || bonds == '') {
        bonds = "0";
    }
    var fund;
    if (isCycleInvest) {
        fund = {
            "fundCode": code,
            "costPrise": costPrise,
            "bonds": bonds,
            "fundCycleInvestType": fundCycleInvestType,
            "fundCycleInvestDate": fundCycleInvestDate,
            "fundCycleInvestValue": fundCycleInvestValue,
            "fundCycleInvestRate": fundCycleInvestRate,
        }
    } else {
        fund = {
            "fundCode": code,
            "costPrise": costPrise,
            "bonds": bonds,
        }
    }
    var funds = await readCacheData('funds');
    if (funds == null) {
        funds = [];
    } else {
        funds = jQuery.parseJSON(funds);
    }
    for (var k in funds) {
        if (funds[k].fundCode == fund.fundCode) {
            funds[k].fundCode = fund.fundCode;
            funds[k].costPrise = fund.costPrise;
            funds[k].bonds = fund.bonds;
            if (isCycleInvest) {
                funds[k].fundCycleInvestType = fund.fundCycleInvestType;
                funds[k].fundCycleInvestDate = fund.fundCycleInvestDate;
                funds[k].fundCycleInvestValue = fund.fundCycleInvestValue;
                funds[k].fundCycleInvestRate = fund.fundCycleInvestRate;
            }
            if (funds[k].addTimePrice == null || funds[k].addTimePrice == '') {
                let checkFundExsitReuslt = checkFundExsit(funds[k].fundCode);
                funds[k].addTimePrice = checkFundExsitReuslt.now;
                funds[k].addTime = getCurrentDate();
            }
            saveCacheData('funds', JSON.stringify(funds));
            fundList = funds;
            $("#fund-modal").modal("hide");
            $("#search-fund-modal").modal("hide");
            initData();
            return;
        }
    }
    let checkFundExsitReuslt = checkFundExsit(fund.fundCode);
    if (!checkFundExsitReuslt.checkReuslt) {
        checkFundExsitReuslt = checkFundExsitFromEastMoney(fund.fundCode);
        if (!checkFundExsitReuslt.checkReuslt) {
            $("#fund-modal").modal("hide");
            $("#search-fund-modal").modal("hide");
            return;
        }
    }
    fund.addTimePrice = checkFundExsitReuslt.now;
    fund.addTime = getCurrentDate();
    funds.push(fund);
    saveCacheData('funds', JSON.stringify(funds));
    fundList = funds;
    $("#fund-modal").modal("hide");
    $("#search-fund-modal").modal("hide");
    initData();
}

// 导出文件方法
function downloadJsonOrTxt(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

// 统一存储缓存
function saveCacheData(key, value) {
    localStorage.setItem(key, value);
    saveData(key, value);
}

// 统一读取缓存，写一个异步方法
async function readCacheData(key) {
    var result = localStorage.getItem(key);
    // var result = await getData(key);
    console.log("readCacheData key = " + key + ", value = " + result);
    return result;
}

// 首页通知展示
async function initNotice() {
    var text = await readCacheData('MONITOR_TEXT');
    $("#monitor-text").html(text);
    saveCacheData('MONITOR_TEXT', '搜索输入股票基金编码或名称后点击回车即可搜索！！！')
    chrome.action.setBadgeText({ text: "" });
}

// 首页点击股票基金搜索或者在股票基金名称输入框点击回车
async function searchFundAndStock() {
    $("#search-fund-select").find("option").remove();
    $("#search-stock-select").find("option").remove();
    let stockName = $("#input-stock-name-search").val();
    if (stockName != "" && stockName != null) {
        var stocksArr = searchStockByName(stockName);
        for (var k in stocksArr) {
            var values = stocksArr[k].split("~");
            var market = "";
            if (values[0] == 'sh') {
                market = "沪A"
            } else if (values[0] == 'sz') {
                market = "深A"
            } else if (values[0] == 'hk') {
                market = "港股"
            } else {
                market = "其他"
            }
            var option = $("<option></option>").val(values[0] + values[1]).text(A2U(values[2]) + " " + values[0] + values[1] + " （" + market + "）");
            $("#search-stock-select").append(option);
        }
        $("#input-stock-name-search").val("");
        if (stocksArr != null && stocksArr != '' && stocksArr != undefined && stocksArr.length > 0) {
            $("#search-stock-modal").modal();
        }
    }
    let fundName = $("#input-fund-name-search").val();
    if (fundName != "" && fundName != null) {
        var fundsArr = await searchFundByName(fundName);
        for (var k in fundsArr) {
            var option = $("<option></option>").val(fundsArr[k].fundCode).text(fundsArr[k].fundName + " " + fundsArr[k].fundCode);
            $("#search-fund-select").append(option);
        }
        $("#input-fund-name-search").val("");
        if (fundsArr.length > 0) {
            $("#search-fund-modal").modal();
        }
    }
}

// 初始化页面是，股票基金数据字体样式设定
async function initFontStyle() {
    let fontChangeStyle = await readCacheData('font-change-style');
    var stockNr = document.getElementById('stock-nr');
    var fundNr = document.getElementById('fund-nr');
    var totalNr = document.getElementById('total-nr');
    if ('bolder' == fontChangeStyle) {
        stockNr.classList.add('my-table-tbody-font');
        fundNr.classList.add('my-table-tbody-font');
        totalNr.classList.add('my-table-tbody-font');
    } else {
        stockNr.classList.remove('my-table-tbody-font');
        fundNr.classList.remove('my-table-tbody-font');
        totalNr.classList.remove('my-table-tbody-font');
    }
}

// 样式切换，股票基金数据字体加粗加大
async function changeFontStyle() {
    var stockNr = document.getElementById('stock-nr');
    // 添加class样式
    if (stockNr.classList.contains('my-table-tbody-font')) {
        saveCacheData('font-change-style', 'normal');
    } else {
        saveCacheData('font-change-style', 'bolder');
    }
    initFontStyle();
}

// 各种告警提示
function alertMessage(message) {
    $("#alert-content").html(message);
    $("#alert-container").show();
    setTimeout(function () {
        $("#alert-container").hide();
    }, 2000);
}

// 第一次安装后没有数据，展示使用说明
function initFirstInstall() {
    if (stockList.length == 0 && fundList.length == 0) {
        $("#help-document-alert")[0].style.display = 'block';
    } else {
        $("#help-document-alert")[0].style.display = 'none';
    }
}

