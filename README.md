# 股票基金神器chrome扩展程序版本

[加入股票基金神器群](#attend-wechat-group)  
[版本更新历史记录](#develop-history)  
[Chrome应用市场安装](#chrome-plugin-stock-and-fund)  
[chrome安装步骤](#chrome-stock-and-fund)  
[Edge安装步骤](#edge-stock-and-fund)  
[狐猴浏览器安装步骤](#huhou-stock-and-fund)  
[添加/编辑股票步骤](#add-stock-step)  
[添加/编辑基金步骤](#add-fund-step)  
[导入导出数据步骤](#import-export-stock-and-fund-step)

## <span id="attend-wechat-group">加入股票基金神器群</span>
![image](https://bu6030.github.io/images/wechat-group-qr-code.png)  
您有任何问题，任何需求  
都可以提处理  
我会立刻修改  
您就是我的产品经理  

## <span id="develop-history">版本更新历史记录</span>
1. 增加导入导出数据 2023/2/23
2. 表格名称股票基金写反了 2023/2/24
3. 增加修改股票基金 2023/2/25
4. 添加修改基金展示不够长 2023/2/28
5. 增加版权信息 2023/3/1
6. 去掉APP 2023/3/2
7. 修改窗口大小 2023/3/2
8. 导入数据中存在隐藏的数据不展示 2023/3/3
9. 清理无用代码 2023/3/3
10. 格式化代码 2023/3/6
11. 修改总市值计算错误 2023/3/6
12. 修改去掉app后无法添加股票基金问题 2023/4/26
13. 增加大盘指数 2023/5/18
14. 添加股票支持通过名称搜索 2023/5/23
15. 添加分时图/日线图/轴线图/月线图 2023/5/30
16. 添加基金/股票页面不显示走势图按钮 2023/5/31
17. 持仓，持有份额非必填，不填写情况下默认值为0 2023/6/2
18. 格式化当日盈利/市值金额为2位小数 2023/6/5
19. 点击大盘指数显示走势图 2023/6/8
20. 增加自选日期以及自选价格 2023/6/10
21. 增加导出txt文件按钮 2023/6/13
22. 添加错误股票导致数据问题 2023/6/21
23. 增加清理数据按钮 2023/6/21
24. 增加成本，重新准确计算涨跌幅/收益率 2023/6/25
25. 修复成本为0计算收益率报错 2023/6/25
26. 优化搜索操作，输入名称可以直接点击保存 2023/6/26
27. 增加搜索显示沪 A，深 A，港股， 其他以及基金/股票编码 2023/6/27
28. 增加使用说明按钮 2023/6/27
29. 未搜索到股票/基金不展示列表 2023/6/27
30. 增加20s自动刷新 2023/6/28
31. 点击默认打开趋势图，再次点击编辑才能进入编辑页面 2023/7/3
32. 增加监控突破最高价格，当价格突破时显示角标 2023/7/11
33. 导出页面去掉，点击导出直接导出文件，导入页面修改为选择文件导入 2023/7/12
34. 优化缓存时间，基金名称搜索接口缓存 1 天 2023/7/20
35. 选择股票基金后自动关闭选择页面 2023/7/24
36. 增加加入微信群功能 2023/7/26
37. 后台定时监控价格突破/跌破价格修改为开盘交易时间查询 2023/8/1
38. 增加QDII基金 2023/8/1
39. 支持股票基金编码以及名称搜索 2023/8/2
40. QDII 基金收益计算错误 2023/8/4
41. 后台监控股票价格突破执行时间优化 2023/8/4
42. 优化后端定时执行 2023/8/8
43. 走势图页面增加删除按钮 2023/8/11
44. 股票基金名称搜索输入框中点击回车触发搜索事件 2023/8/11
45. 增加全屏展示按钮 2023/8/11
46. 增加样式切换，普通模式和粗体字体变大模式 2023/8/12
47. 增加密码保护，设定密码后，每次打开都验证密码 2023/8/12
48. 文本过长时候，文字不换行 2023/8/15
49. 基金增加日线/周线/月线图 2023/8/16
50. 全屏显示时居中显示 2023/8/16
51. 增加卸载后跳转使用说明页面 2023/8/16
52. 修改按钮颜色 2023/8/18
53. 增加告警提示框 2023/8/22
54. 没有股票基金时展示使用说明链接 2023/8/22
55. 查看过基金走势图后，大盘走势图无法查看日/周/月线图 2023/8/25 -- version 1.6.18 -- end
56. 大盘指数初始化 300ms 后设定点击事件 2023/8/28
57. 基金/股票编码不可修改 2023/8/28
58. 成本为负数时，收益率设定为0% 2023/8/28
59. 首页增加迷你分时图 2023/8/31 (微信群友 Laughing_Lz 提供建议)
60. 未持仓时当日上涨，当日盈利涨跌幅变色 2023/9/1 (微信群友 Laughing_Lz 提供建议)
61. 增加手动刷新按钮 2023/9/1 (微信群友 Laughing_Lz 提供建议) -- version 1.6.19 -- end
62. 首页迷你分时图数据较少时拼接空数据 2023/9/5
63. 增加涨跌红绿颜色切换按钮 2023/9/21
64. 增加忽悠自己功能，把亏损显示成盈利 2023/9/21
65. 将按钮修改到设置页面 2023/9/23
66. 首页头部菜单，底部说明固定，中间可以滑动修改 2023/9/25
67. 底部增加基金/股票/全部展示切换按钮 2023/9/25
68. 刷新修改到底部 2023/9/25
69. 价格监控优化 2023/9/26
70. 增加股票实时价格监控角标 2023/9/27 -- version 1.6.20 -- end
71. 价格监控失效修改 2023/9/27
72. 增加清理角标 2023/9/27
73. 修改同时监控两个股票只显示一个的问题 2023/9/28
74. 增加持仓明细 2023/9/28
75. 增加单位净值，历史净值 2023/9/28
76. 基金指数基金/ETF基金展示历史净值/持仓明细 2023/9/28
77. 设定单位净值，累计净值颜色 2023/9/29 -- version 1.6.21 -- end
78. 持仓明细增加涨跌颜色 2023/10/6
79. 增加展示美股，港股 2023/10/7
80. 市值/金额，持仓占比，成本，收益率，自选价格设置隐藏展示 2023/10/7 -- version 1.6.22 -- end
81. 美股/港股不展示分时图 2023/10/8
82. 增加页面切换，正常/缩小/迷你 2023/10/9
83. 股票价格监控优化 2023/10/9
84. 增加一键全选设定隐藏/展示页面选项 2023/10/9
85. 大盘指数增加恒生指数 2023/10/9

## <span id="chrome-plugin-stock-and-fund">Chrome应用市场安装</span>
点击这个[链接到Chrome应用市场安装，需要科学上网工具](https://chrome.google.com/webstore/detail/%E8%82%A1%E7%A5%A8%E5%9F%BA%E9%87%91%E7%A5%9E%E5%99%A8/ldhkaenmfbheigndphpffdgpdcllnmeh)  
如果没有科学上网工具，可以通过下面的几种下载程序包方式安装

## <span id="chrome-stock-and-fund">chrome安装步骤</span>
 1. 代码下载完成后，在chrome浏览器中选择扩展程序进入扩展程序页面    
![image](https://user-images.githubusercontent.com/11482988/220873576-c1234b8c-d66b-4059-94a1-4681ba728c2a.png)  
 2. 点击开发者模式    
![image](https://user-images.githubusercontent.com/11482988/220873953-88382f77-5125-43e2-b222-1d7d80853ec2.png)  
 3. 点击选择加载已解压的扩展程序，选择咱们下载完成的本项目代码的stock-and-fund目录    
 ![image](https://user-images.githubusercontent.com/11482988/220874183-93babeb5-cf04-49e4-80eb-110b70e70069.png)  
 4. 添加成功后，可以看到该内容    
 ![image](https://user-images.githubusercontent.com/11482988/220874482-ce4adc87-27b3-4976-9261-1501bbd56abd.png)  
 5. 扩展程序快捷键可以看到股基神器，也可以固定到扩展程序快捷栏中。  
 ![image](https://user-images.githubusercontent.com/11482988/220875081-3e9ca2d5-21a5-43f1-8d82-695954c3c35f.png)  
 6. 添加后点击股基神器按钮，可以进入主页。
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/ff894aed-f786-4362-b871-2aa8e643afea)  

## <span id="edge-stock-and-fund">Edge安装步骤</span>
 1. 代码下载完成后，在Edge浏览器中选择扩展程序进入扩展程序页面    
![image](https://user-images.githubusercontent.com/11482988/221105602-07fd2e26-390f-4828-b2d8-4eae3d9205e9.png)  
 2. 点击管理扩展  
 ![image](https://user-images.githubusercontent.com/11482988/221105811-2e30ca9e-3ace-4edd-a054-e4e3718fa68f.png)  
 2. 点击开发人员模式，点击选择加载已解压的扩展程序   
![image](https://user-images.githubusercontent.com/11482988/221105996-e61da86f-d791-4a25-be9c-37e3275a4772.png)  
 3. 选择咱们下载完成的本项目代码的stock-and-fund目录    
![image](https://user-images.githubusercontent.com/11482988/221106116-6d5c70a7-1749-4835-9e10-cc8d995b72fd.png)  
 4. 添加成功后，可以看到该内容，扩展程序快捷键可以看到股基神器，也可以固定到扩展程序快捷栏中。     
![image](https://user-images.githubusercontent.com/11482988/221106273-d099ad89-6393-4cfc-a164-8390586fb516.png)  
 5. 击股基神器按钮，可以进入主页。  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/ff894aed-f786-4362-b871-2aa8e643afea)  

## <span id="huhou-stock-and-fund">狐猴浏览器安装步骤</span>
手机使用请在右侧的[Release链接](https://github.com/bu6030/stock-and-fund-chrome/releases)中下载stock-and-fund-for-mobile.crx文件下载安装
狐猴浏览器-》扩展程序-》开发者模式-》加载已解压的扩展程序-》选择crx文件即可完成安装


## <span id="add-stock-step">添加/编辑股票步骤</span>
 1. 在股票名称输入框输入股票名称后，直接点击回车即可搜索，或者点击搜索股票/基金按钮。  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/df2d8c9b-073a-4054-a92d-94439576d614)  
 2. 在弹出的搜索框中选择你需要添加的股票。  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/8c553d73-e3d5-47d6-a16b-313ba2e3ecea)  
 3. 此时就可以看到添加的股票了。  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/de49d883-b6d4-4958-9973-e8c01646a317)  
 4. 点击具体股票，可以进入编辑成本价，持仓可以进一步计算盈利收益率等信息。  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/19de7579-3458-4043-984e-b78b8e18e8f8)  
 5. 点击后进入走势图页面，点击编辑按钮可以进入股票编辑页面，点击删除按钮可以直接删除股票，分别点击分时线，日线，周线，月线可以看到各种走势图。  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/28a842d9-aff6-4a2a-9aee-901f6ff18f7c)  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/7909217b-4081-42d0-8794-c953c8d67881)  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/031e0792-adad-427a-be7c-56383e1d03cc)  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/7c1a8e3a-0e02-4c0b-b9fb-eb8e95e9d775)  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/83cb387d-a83d-4026-a55d-a8d6d58d29bc)  
 6. 修改股票持仓成本，持有份额等信息，点击保存可以修改信息
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/f2c70d35-baa7-4d34-99c4-5d503084b8e1)
 7. 保存后可以查看盈利了。
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/6ec36311-f7d2-47df-8486-51efaaa928f1)


## <span id="add-fund-step">添加/编辑基金步骤</span>
 1. 在基金名称输入框输入基金名称后，直接点击回车搜索或者点击搜索股票/基金按钮  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/8d6db4b5-897b-4e61-ba2f-32d041584ba1)  
 2. 在弹出的搜索结果中，选择你想添加的基金  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/c85014a7-7488-40ef-9f64-04d027b1ad07)  
 3. 可以看到已经添加成功，点击这只基金，可以进入趋势图以及编辑页面  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/b571631a-3dd5-4189-9c0c-d7e9d78dcd1f)  
 4. 进入基金走势图页面，分别可以查看分时线，日线，周线，月线图，点击编辑可以进入基金编辑页面，点击删除可以删除该基金  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/a6c9cb16-5c8a-4b4c-8dfc-a4926a2a01b1)  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/7c05e271-ae57-4452-b312-0102349cd083)  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/71f16b75-febd-49a8-b2d3-c02f23437017)  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/79f0a568-fc7b-4540-b460-725be7dd393c)  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/6eeca619-a948-4142-be0f-8fd118315a40)  
 5. 修改持仓成本和持有份额，点击保存修改信息  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/ab4cfde7-f3fc-4456-b978-796b4c172590)  
 6. 保存后可以看到盈利情况  
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/00a2331e-c6cb-4b60-97de-812272a6bc90)  


## <span id="import-export-stock-and-fund-step">导入导出数据步骤</span>
 1. 由于数据是存储在浏览器本地的，因此增加导出导入数据功能，方便在不同的电脑复制数据。
 2. 点击导出数据，自动下载 txt 文件到本地。
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/874af57c-0eb3-4c98-924c-5faec3cda3b4)  
 3. 点击导入数据，进入导入数据页面。
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/b75b8b95-c237-4a53-b546-c729463a2da8)  
 4. 点击选择文件
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/bb57b780-98c5-48b4-b960-eef98c94a66a)  
 5. 选择之前下载的文件，自动导入
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/c4992844-7ebd-4f9c-bd8a-d1a5c12514ee)  
 7. 导入数据成功后，页面如下：
![image](https://github.com/bu6030/stock-and-fund-chrome/assets/11482988/45735a75-d9df-4ea7-80e9-2e5480a13548)  




