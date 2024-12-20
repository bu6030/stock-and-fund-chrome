let Env = {
    GET_STOCK_FROM_GTIMG: "http://qt.gtimg.cn/",
    GET_STOCK_CODE_BY_NAME_FROM_GTIMG: "https://smartbox.gtimg.cn/s3/",
    GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA: "http://image.sinajs.cn/newchart/min/n/",
    GET_STOCK_TIME_IMAGE_DAY_FROM_SINA: "http://image.sinajs.cn/newchart/daily/n/",
    GET_STOCK_TIME_IMAGE_FROM_EASTMONEY: "https://push2his.eastmoney.com/api/qt/stock/kline/get",
    GET_STOCK_TIME_IMAGE_WEEK_FROM_SINA: "http://image.sinajs.cn/newchart/weekly/n/",
    GET_STOCK_TIME_IMAGE_MONTH_FROM_SINA: "http://image.sinajs.cn/newchart/monthly/n/",
    GET_STOCK_TIME_IMAGE_MINUTE_MINI: "https://push2.eastmoney.com/api/qt/stock/trends2/get",
    GET_STOCK_TIME_IMAGE_MINUTE_HIS: "https://push2his.eastmoney.com/api/qt/stock/trends2/get",
    GET_BIG_STOCK_MONEY_URL: "https://push2.eastmoney.com/api/qt/stock/fflow/kline/get",
    GET_NANBEI_XIANG_MONEY_URL: "https://push2.eastmoney.com/api/qt/kamt.rtmin/get",
    GET_BANKUAI_MONEY_URL: "http://push2.eastmoney.com/api/qt/clist/get",
    GET_WHOLE_TWO_MARKET_MONEY_URL: "https://push2.eastmoney.com/api/qt/ulist.np/get",
    GET_STOCK_FROM_EAST_MONEY_URL: "https://push2.eastmoney.com/api/qt/ulist.np/get",
    GET_HUILV_URL: "https://webapi.huilv.cc/api/exchange",
    GET_FUND_FROM_TIANTIANJIJIN: "http://fundgz.1234567.com.cn/js/{CODE}.js",
    GET_FUND_CODE_BY_NAME_FROM_TIANTIANJIJIN: "http://fund.eastmoney.com/js/fundcode_search.js",
    GET_FUND_TIME_IMAGE_FROM_DFCFW: "http://webquoteklinepic.eastmoney.com/GetPic.aspx",
    GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW: "http://j4.dfcfw.com/charts/pic7/",
    GET_FUND_FROM_EAST_MONEY: "https://j5.fund.eastmoney.com/sc/tfs/qt/v2.0.1/",
    GET_FUND_INVERST_POSITION: "https://fundmobapi.eastmoney.com/FundMNewApi/FundMNInverstPosition",
    GET_FUND_INVERST_POSITION_DETAIL: "https://push2.eastmoney.com/api/qt/ulist.np/get",
    GET_FUND_NET_DIAGRAM: "https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx",
    GET_FUND_POSITION_LIST: "https://fundwebapi.eastmoney.com/FundMEApi/FundPositionList",
    GO_TO_EASTMONEY_1_URL: "https://quote.eastmoney.com/basic/h5chart-iframe.html",
    GET_UP_DOWN_COUNTS_URL: "https://push2ex.eastmoney.com/getTopicZDFenBu",
    GO_TO_EASTMONEY_2_URL: "https://quote.eastmoney.com",
    ADVICE_URL: "http://110.40.187.161:8080/chrome/advice",
    CLOUD_SERVER_DATA_SYNC: "https://dav.jianguoyun.com/dav/stock-and-fund/",
    CLOUD_SERVER_DATA_SYNC_BASIC_AUTH: "Basic YnV4dWVzb25nQGZveG1haWwuY29tOmF1ZGZoeXNzcmg4bWlmc2U=",
    // 下面这两个地址可以通过本地启动stock-and-fund项目
    // github地址为：https://github.com/bu6030/stock-and-fund
    // GET_FUND_FROM_LOCAL_SERVICE: "http://127.0.0.1:8080/chrome/fund",
    GET_HELP_DOCUMENT: "https://zhuanlan.zhihu.com/p/688413206",
    WECHAT_GROUP_QR_CODE: "https://bu6030.github.io/images/wechat-group-qr-code.png",
    WECHAT_PAY_QR_CODE: "/img/wechat-pay-qr-code.png",
    ALI_PAY_QR_CODE: "/img/ali-pay-qr-code.png",
    TIME_CACHED_SEVEN_DAY: 7 * 24 * 60 * 60 * 1000,
    TIME_CACHED_ONE_DAY: 24 * 60 * 60 * 1000,
    TIME_CACHED_ONE_HOUR: 1 * 60 * 60 * 1000,
    GET_STOCK_AND_FUND_FROM_LOCAL_SERVICE: "http://110.40.187.161:8080/chrome/stockAndFund",
}

let develop = true;