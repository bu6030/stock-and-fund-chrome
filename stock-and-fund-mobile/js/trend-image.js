//分时图/日线/周线/月线使用
let timeImageCode;
let timeImageType;
// 展示分时图
function showMinuteImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
        $("#fund-modal").modal("hide");
        $("#time-image-day-button")[0].style.display  = 'none';
        $("#time-image-week-button")[0].style.display  = 'none';
        $("#time-image-month-button")[0].style.display  = 'none';
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_MINUTE_FROM_SINA + timeImageCode +".gif";
        $("#stock-modal").modal("hide");
        $("#time-image-day-button")[0].style.display  = 'block';
        $("#time-image-week-button")[0].style.display  = 'block';
        $("#time-image-month-button")[0].style.display  = 'block';
    }
    if (timeImageCode != "sh000001" && timeImageCode != "sz399001" && timeImageCode != "sz399006") {
        $("#update-stock-fund-button")[0].style.display  = 'block';
    }
    $("#time-image-modal").modal();
    $("#time-image").html('<img src="'+path+'" width="100%" length="100%" />');
}
// 展示日线图
function showDayImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_DAY_FROM_SINA + timeImageCode + ".gif";
    }
    $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 展示周线图
function showWeekImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_WEEK_FROM_SINA + timeImageCode + ".gif";
    }
    // $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 展示月线图
function showMonthImage() {
    let path = "";
    if (timeImageType == "FUND") {
        path = Env.GET_FUND_TIME_IMAGE_MINUTE_FROM_DFCFW + timeImageCode + ".png";
    } else {
        path = Env.GET_STOCK_TIME_IMAGE_MONTH_FROM_SINA + timeImageCode + ".gif";
    }
    // $("#time-image-modal").modal();
    $("#time-image").html('<img src="' + path + '" width="100%" length="100%" />');
}
// 获取当前日期，年-月-日格式
function getCurrentDate() {
    var date = new Date();
    var year= date.getFullYear() ; // 得到当前年份
    var month = date.getMonth()  + 1; // 得到当前月份（0-11月份，+1是当前月份）
    month = month >= 10 ? month :'0' + month; // 补零
    var day = date.getDate(); // 得到当前天数
    day = day >= 10 ? day :'0' + day; // 补零
    return year + '-' + month + '-' + day; // 这里传入的是字符串
}