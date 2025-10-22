// 初始化首页大盘股数据
function initLargeMarketData() {
    var codes = largeMarketCode.join(',');
    let largetMarketTotalStr = '';
    if (largetMarketTotalDisplay) {
        largetMarketTotalStr = '<div class=\"stock-large-market-box\" id=\"larget-market-total\">' +
            '<p>持仓盈亏</p>' +
            '<p style=\"color:' + redColor + ';\">--</p>' +
            '<p style=\"color:' + redColor + ';\">--%</p>' +
        '</div>'
    }
    // 如果没设置大盘指数，则设置大盘指数DIV为空
    if (codes == "") {
        $("#stock-large-market").html('<div class=\"stock-large-market-container\">' + largetMarketTotalStr + '</div>');
        return;
    }
    ajaxGetLargeMarketData(codes);
}
// 初始化首页大盘股数据回调方法
async function initLargeMarketDataCallBack(bigStocks) {
    let largetMarketTotalStr = '';
    if (largetMarketTotalDisplay) {
        largetMarketTotalStr = getlargetMarketTotalHtml();
    }
    largeMarketStockMaxs = '';
    largeMarketStockMins = '';
    
    // 加载自定义指数名称映射
    const customIndices = await readCacheData('custom-indices');
    const customIndexMap = {};
    if (customIndices) {
        const indices = JSON.parse(customIndices);
        indices.forEach(item => {
            customIndexMap[item.code] = item.name;
        });
    }
    
    var str = "<div class=\"stock-large-market-container\">";
    str += largetMarketTotalStr;
    for(let k in bigStocks) {
        var name = bigStocks[k].f14;
        var code = bigStocks[k].f12;
        
        // 特殊名称处理
        if (code == 'CN00Y') {
            name = 'A50期指';
        } else if (code == 'UDI') {
            name = '美元指数';
        } else if (code.startsWith('BK') && customIndexMap[code]) {
            // 使用自定义指数名称
            name = customIndexMap[code];
        }
        
        var change = bigStocks[k].f4;
        var now = parseFloat(bigStocks[k].f2).toFixed(2);
        if (code == 'USDCNH') {
            now = parseFloat(bigStocks[k].f2).toFixed(4);
        }
        var changePercent = parseFloat(bigStocks[k].f3).toFixed(2);
        var aId = "id = 'large-market-" + code + "'";
        largeMarketStockMaxs += code + '~' + bigStocks[k].f15 + '-';
        largeMarketStockMins += code + '~' + bigStocks[k].f16 + '-';
        var style = "style=\""
            + (change == 0 ? "\"" : (change >= 0 ? "color:" + redColor + ";\"" : "color:" + blueColor + ";\""));
        if (largetMarketCountDisplay) {
            str = str + 
            '<div class=\"stock-large-market-box\"' + aId + '>' +
                '<p>' + name +'</p>' +
                '<p ' + style + '>' + now + '</p>' +
                '<p ' + style + '>' + parseFloat(change+'').toFixed(2) + '(' + changePercent + '%)</p>' +
            '</div>';
        } else {
            str = str + 
            '<div class=\"stock-large-market-box\"' + aId + '>' +
                '<p>' + name +'</p>' +
                '<p ' + style + '>' + now + '</p>' +
                '<p ' + style + '>' + changePercent + '%</p>' +
            '</div>';
        }
    }
    str = str + '</div>';
    $("#stock-large-market").html(str);
    setTimeout(function() {
        // html 渲染完毕后 300ms 执行
        attachLargeMarketClickEvents();
        // 添加拖拽功能
        addLargeMarketDragListeners();
    }, 300);
}

// 绑定大盘指数点击事件（统一管理）
async function attachLargeMarketClickEvents() {
    // 加载自定义指数
    const customIndices = await readCacheData('custom-indices');
    let customCodes = [];
    if (customIndices) {
        const indices = JSON.parse(customIndices);
        customCodes = indices.map(item => item.code);
    }
    
    // 为所有大盘指数box添加点击事件
    const boxes = document.querySelectorAll('.stock-large-market-box');
    boxes.forEach(box => {
        if (box.id && box.id.startsWith('large-market-')) {
            const code = box.id.replace('large-market-', '');
            box.addEventListener('click', function() {
                timeImageCode = convertToTimeImageCode(code);
                initLargeMarketClick();
            });
        }
    });
}

// 将显示代码转换为timeImageCode
function convertToTimeImageCode(code) {
    // 特殊处理需要前缀的代码
    const prefixMap = {
        '000001': 'sh000001',
        '399001': 'sz399001',
        '399006': 'sz399006',
        '000300': 'sh000300',
        '399905': 'sz399905',
        '000852': 'sh000852',
        '000688': 'sh000688',
        '000928': 'sh000928',
        '399997': 'sz399997',
        '000933': 'sh000933',
        '000926': 'sh000926',
        '399989': 'sz399989',
        '399986': 'sz399986',
        '000941': 'sh000941',
        'HSI': 'hkHSI',
        'HSTECH': 'hkHSTECH',
        'NDX': 'usNDX',
        'DJIA': 'usDJIA',
        'SPX': 'usSPX'
    };
    
    return prefixMap[code] || code;
}

// 初始化大盘指数 onclick 具体方法
function initLargeMarketClick() {
    timeImageType = "STOCK";
    $("#stock-code").val(timeImageCode);
    $("#stock-modal").modal("hide");
    $("#time-image-minute-button")[0].style.display = 'block';
    $("#time-image-minute-5day-button")[0].style.display = 'block';
    $("#time-image-day-button")[0].style.display = 'block';
    $("#time-image-week-button")[0].style.display = 'block';
    $("#time-image-month-button")[0].style.display = 'block';
    $("#update-stock-fund-button")[0].style.display = 'none';
    $("#stock-fund-delete-button")[0].style.display = 'none';
    $("#stock-fund-monitor-button")[0].style.display = 'none';
    $("#fund-invers-position-button-3")[0].style.display = 'none';
    $("#fund-net-diagram-button-3")[0].style.display = 'none';
    $("#stock-fund-monitor-button")[0].style.display = 'block';
    // 隐藏所有 show-set-top-or-end-button（头部和底部都有）
    $("#show-set-top-or-end-button")[0].style.display = 'none';
    $("#show-jump-to-eastmoney")[0].style.display = 'none';
    $("#show-buy-or-sell-button-2")[0].style.display = 'none';
    $("#time-image-pre-button")[0].style.display = 'none';
    $("#time-image-next-button")[0].style.display = 'none';
    $("#go-to-tiantianjijin-detail-button")[0].style.display = 'none';
    if (trendImageType == 'MINUTE') {
        showMinuteImage('1DAY');
    } else if (trendImageType == '5DAY') {
        showMinuteImage('5DAY');
    } else if (trendImageType == 'DAY') {
        showDayImage();
    } else if (trendImageType == 'WEEK') {
        showWeekImage();
    } else if (trendImageType == 'MONTH') {
        showMonthImage();
    } else if (trendImageType == '1MIN') {
        show1or5or15or30or60MinutesImage('1MIN');
    } else if (trendImageType == '5MIN') {
        show1or5or15or30or60MinutesImage('5MIN');
    } else if (trendImageType == '15MIN') {
        show1or5or15or30or60MinutesImage('15MIN');
    } else if (trendImageType == '30MIN') {
        show1or5or15or30or60MinutesImage('30MIN');
    } else if (trendImageType == '60MIN') {
        show1or5or15or30or60MinutesImage('60MIN');
    } else if (trendImageType == '120MIN') {
        show1or5or15or30or60MinutesImage('120MIN');
    }
}

function largeMarketCodeSave() {
    // 使用 jQuery 选择所有选中的复选框
    let checkboxes = $('input#large-market-code-checkbox:checked');
    // 提取选中的值
    let selectedData = checkboxes.map(function() {
        return this.value;
    }).get();
    largeMarketCode = selectedData;
    saveCacheData('large-market-code', JSON.stringify(selectedData));
    // $("#setting-modal").modal("hide");
    initWindowsSize();
    initLargeMarketData();
}

function getlargetMarketTotalHtml (){
    let str = '<div class=\"stock-large-market-box\" id=\"larget-market-total\">' +
        '<p>持仓盈亏</p>' +
        '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncome + '</p>' +
        '<p ' + allTotalIncomePercentStyle + '>' + allTotalIncomePercent + '%</p>' +
        '</div>';
    return str;
}

// 添加大盘指数拖拽监听器
function addLargeMarketDragListeners() {
    var boxes = document.querySelectorAll('.stock-large-market-box');
    var draggedElement = null;
    var draggedCode = null;
    
    boxes.forEach(function(box) {
        // 排除持仓盈亏box
        if (box.id === 'larget-market-total') {
            return;
        }
        
        // 设置为可拖拽
        box.setAttribute('draggable', 'true');
        box.style.cursor = 'move';
        
        // 拖拽开始
        box.addEventListener('dragstart', function(e) {
            draggedElement = this;
            draggedCode = this.id.replace('large-market-', '');
            this.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        });
        
        // 拖拽结束
        box.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
            boxes.forEach(function(item) {
                item.style.border = '';
            });
        });
        
        // 拖拽经过
        box.addEventListener('dragover', function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            return false;
        });
        
        // 拖拽进入
        box.addEventListener('dragenter', function(e) {
            if (this.id !== 'larget-market-total') {
                this.style.border = '2px dashed #007bff';
            }
        });
        
        // 拖拽离开
        box.addEventListener('dragleave', function(e) {
            this.style.border = '';
        });
        
        // 放置
        box.addEventListener('drop', function(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            // 排除持仓盈亏box
            if (this.id === 'larget-market-total' || draggedElement.id === 'larget-market-total') {
                return false;
            }
            
            if (draggedElement !== this) {
                var targetCode = this.id.replace('large-market-', '');
                
                // 在largeMarketCode数组中找到完整的代码
                var draggedFullCode = null;
                var targetFullCode = null;
                
                for (var i = 0; i < largeMarketCode.length; i++) {
                    var parts = largeMarketCode[i].split('.');
                    var code = parts[1];
                    if (code === draggedCode) {
                        draggedFullCode = largeMarketCode[i];
                    }
                    if (code === targetCode) {
                        targetFullCode = largeMarketCode[i];
                    }
                }
                
                if (draggedFullCode && targetFullCode) {
                    // 获取索引位置
                    var draggedIndex = largeMarketCode.indexOf(draggedFullCode);
                    var targetIndex = largeMarketCode.indexOf(targetFullCode);
                    
                    // 重新排序数组
                    largeMarketCode.splice(draggedIndex, 1);
                    targetIndex = largeMarketCode.indexOf(targetFullCode);
                    largeMarketCode.splice(targetIndex, 0, draggedFullCode);
                    
                    // 保存到缓存
                    saveCacheData('large-market-code', JSON.stringify(largeMarketCode));
                    
                    // 刷新显示
                    initLargeMarketData();
                }
            }
            
            return false;
        });
    });
}

async function addLargeMarketCheckEvent() {
    $('input#large-market-code-checkbox[value="1.000001"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399001"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399006"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.HSI"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="124.HSTECH"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="104.CN00Y"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.SPX"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.DJIA"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.NDX"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.N225"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.KS11"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.FTSE"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.GDAXI"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.FCHI"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.SENSEX"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.TWII"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.VNINDEX"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000928"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000933"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000300"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399905"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000852"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.899050"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000688"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399997"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000926"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="2.930641"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="2.930708"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399989"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="0.399986"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="1.000941"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="2.931071"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="2.931582"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="90.BK1158"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="101.GC00Y"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="133.USDCNH"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="100.UDI"]').on('change', largeMarketCodeSave);
    $('input#large-market-code-checkbox[value="102.CL00Y"]').on('change', largeMarketCodeSave);
    
    // 添加自定义指数输入功能
    initCustomIndexFeature();
}

// 初始化自定义指数功能
function initCustomIndexFeature() {
    // 从缓存加载自定义指数
    loadCustomIndices();
    
    // 添加按钮点击事件
    document.getElementById('add-custom-index-button').addEventListener('click', function() {
        const codeInput = document.getElementById('custom-index-code-input');
        const nameInput = document.getElementById('custom-index-name-input');
        const code = codeInput.value.trim().toUpperCase();
        const name = nameInput.value.trim();
        
        // 验证输入
        if (!code) {
            alert('请输入指数代码');
            return;
        }
        
        if (!code.startsWith('BK')) {
            alert('指数代码必须以BK开头');
            return;
        }
        
        if (!name) {
            alert('请输入指数名称');
            return;
        }
        
        // 添加到列表
        addCustomIndex(code, name);
        
        // 清空输入框
        codeInput.value = '';
        nameInput.value = '';
    });
    
    // 支持回车键添加
    document.getElementById('custom-index-name-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('add-custom-index-button').click();
        }
    });
}

// 加载自定义指数
async function loadCustomIndices() {
    const customIndices = await readCacheData('custom-indices');
    if (customIndices) {
        const indices = JSON.parse(customIndices);
        // 将数据缓存到全局变量以便同步访问
        window.customIndicesCache = customIndices;
        displayCustomIndices(indices);
    }
}

// 添加自定义指数
async function addCustomIndex(code, name) {
    let customIndices = await readCacheData('custom-indices');
    let indices = customIndices ? JSON.parse(customIndices) : [];
    
    // 检查是否已存在
    const exists = indices.some(item => item.code === code);
    if (exists) {
        alert('该指数代码已存在');
        return;
    }
    
    // 添加新指数
    indices.push({ code: code, name: name });
    
    // 保存到缓存
    const indicesStr = JSON.stringify(indices);
    await saveCacheData('custom-indices', indicesStr);
    // 同步到全局缓存
    window.customIndicesCache = indicesStr;
    
    // 自动添加到大盘指数列表
    const secid = '90.' + code;
    if (!largeMarketCode.includes(secid)) {
        largeMarketCode.push(secid);
        await saveCacheData('large-market-code', JSON.stringify(largeMarketCode));
    }
    
    // 刷新显示
    displayCustomIndices(indices);
    initLargeMarketData();
}

// 删除自定义指数
async function removeCustomIndex(code) {
    if (!confirm('确定要删除该自定义指数吗？')) {
        return;
    }
    
    let customIndices = await readCacheData('custom-indices');
    let indices = customIndices ? JSON.parse(customIndices) : [];
    
    // 从列表中移除
    indices = indices.filter(item => item.code !== code);
    
    // 保存到缓存
    const indicesStr = JSON.stringify(indices);
    await saveCacheData('custom-indices', indicesStr);
    // 同步到全局缓存
    window.customIndicesCache = indicesStr;
    
    // 从大盘指数列表中移除
    const secid = '90.' + code;
    largeMarketCode = largeMarketCode.filter(item => item !== secid);
    await saveCacheData('large-market-code', JSON.stringify(largeMarketCode));
    
    // 刷新显示
    displayCustomIndices(indices);
    initLargeMarketData();
}

// 显示自定义指数列表
function displayCustomIndices(indices) {
    const container = document.getElementById('custom-index-list');
    if (!indices || indices.length === 0) {
        container.innerHTML = '<p style="color: #999; font-size: 12px; margin: 5px 0;">暂无自定义指数</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
    indices.forEach(item => {
        html += `
            <div class="custom-index-item" style="display: inline-flex; align-items: center; padding: 5px 10px; 
                        background: #f0f0f0; border-radius: 4px; font-size: 12px;">
                <span style="margin-right: 8px;">${item.code} - ${item.name}</span>
                <button class="remove-custom-index-btn" data-code="${item.code}"
                        style="background: #dc3545; color: white; border: none; 
                               border-radius: 3px; padding: 2px 6px; cursor: pointer; font-size: 11px;">
                    删除
                </button>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
    
    // 使用事件委托绑定删除按钮点击事件
    container.querySelectorAll('.remove-custom-index-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            removeCustomIndex(code);
        });
    });
}