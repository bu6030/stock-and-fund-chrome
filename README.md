# 股基神器chrome扩展程序版本

[版本更新历史记录](#develop-history)  
[Chrome应用市场安装](#chrome-plugin-stock-and-fund)  
[股基神器chrome安装步骤](#chrome-stock-and-fund)  
[股基神器Edge安装步骤](#edge-stock-and-fund)  
[股基神器狐猴浏览器安装步骤](#huhou-stock-and-fund)  
[股基神器添加股票基金步骤](#add-stock-and-fund-step)  
[股基神器导入导出数据步骤](#import-export-stock-and-fund-step)

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

## <span id="chrome-plugin-stock-and-fund">Chrome应用市场安装</span>
点击这个[链接到Chrome应用市场安装，需要科学上网工具](https://chrome.google.com/webstore/detail/%E8%82%A1%E7%A5%A8%E5%9F%BA%E9%87%91%E7%A5%9E%E5%99%A8/ldhkaenmfbheigndphpffdgpdcllnmeh)  
如果没有科学上网工具，可以通过下面的几种下载程序包方式安装

## <span id="chrome-stock-and-fund">股基神器chrome安装步骤</span>
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
![image](https://user-images.githubusercontent.com/11482988/221104210-3a98e680-fc61-4f48-8fa3-b07d41bc318a.png)

## <span id="edge-stock-and-fund">股基神器Edge安装步骤</span>
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
![image](https://user-images.githubusercontent.com/11482988/221106457-9013f243-99be-481f-b603-3ab31deb2c73.png)

## <span id="huhou-stock-and-fund">股基神器狐猴浏览器安装步骤</span>
手机使用请在右侧的[Release链接](https://github.com/bu6030/stock-and-fund-chrome/releases)中下载stock-and-fund-for-mobile.crx文件下载安装
狐猴浏览器-》扩展程序-》开发者模式-》加载已解压的扩展程序-》选择crx文件即可完成安装


## <span id="add-stock-and-fund-step">股基神器添加股票基金步骤</span>
 1. 点击添加基金，输入基金编码（6位基金编码），持仓成本，持有份额，点击保存，即可添加新的基金。  
![image](https://user-images.githubusercontent.com/11482988/222343071-8b4dcc67-15d1-4c93-901c-8184e40b215b.png)
 2. 点击添加股票，输入股票编码（编码sh(上证)/sz(深证)开头+6位股票编码），持仓成本，持有份额，点击保存，即可添加新的股票。  
![image](https://user-images.githubusercontent.com/11482988/222343097-197dd492-fe05-4683-90f6-04888b05794c.png)


## <span id="import-export-stock-and-fund-step">股基神器导入导出数据步骤</span>
 1. 由于数据是存储在浏览器本地的，因此增加导出导入数据功能，方便在不同的电脑复制数据。
 2. 点击导出数据，从表单中手动copy后，手动粘贴到文本编辑器保存成文件即可。
 ![image](https://user-images.githubusercontent.com/11482988/221103317-9f654c7a-c4bb-45bd-ad2b-04066d3e830c.png)
 3. 点击导入数据，可以选择刚才保存的文本，粘贴到输入框中，点击导入，即可导入数据。
 ![image](https://user-images.githubusercontent.com/11482988/221103612-504eae56-0763-4776-a19e-5a684b10171d.png)
 4. 导入数据成功后，页面如下：
![image](https://user-images.githubusercontent.com/11482988/222343280-b2bdc709-5f8f-40bd-a60e-4eb1ff7a24d5.png)



