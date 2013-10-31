## 综述

hcs是一款概念式的以命令行方式，快速构建html页面的在线编辑工具 2013-10-21 至今


* 版本：1.0
* 作者：changyuan.lcy (核心)
* demo：[http://gallery.kissyui.com/hcs/1.0/demo/hcs/index.html](http://gallery.kissyui.com/hcs/1.0/demo/hcs/index.html)



## 远景
* 有一个浏览器就可以开始你的前端之旅了。用它完成开发预览调试。

## 初始化组件
* 请在chrome浏览器下使用。
	
	下载hcs文件夹放到本地环境根目录，推荐使用 [http://www.easyphp.org/](EasyPhp) 或者其他php环境
	访问: localhost/hcs/index.html

## API说明
* hcs所引入页面自动成为默认工程文件,初始是空的html页面。你可以自定义添加一些常用标签比如link script
* gallery 由于权限问题，save命令，新建目录和文件不能正常运行，下载到本地即可正常使用。

## 命令行
* cd  指定一个节点  比如 cd div.nav 指定焦点到标签为div class为nav的节点
* load 加载一个页面 比如 load a 加载 {path}/a.html
* save 保存一个页面 比如 save a 保存到 {path}/a.html
* append after before prepend 节点操作，比如append div.abc 插入一个class为abc的tagName为div的节点
* parent children next prev 节点选择
* html 填充内容
* clear 清空当前节点内容
* delete 删除当前节点
* reset 重置工程到最初状态
* copy 复制当前节点
* paste 在当前节点下粘帖所复制的节点
* dev 开发者模式，默认
* undev 取消开发者模式
* css 导入css文件, 例如 css css/index.css
* js 导入js文件，例如 js  js/index.js
* tab "命令框"和"节点"间焦点切换


## 符号命令行 (对象是当前节点)

	&name="username" 设置name属性和值，也可以&checked只设置属性
	.nav  设置class
	#wrap   设置 id
	.+ 添加一个class
	.- 删除一个class
	&- 删除一个属性
	>  子节点通常写法 div>ul>li*3
	*  乘于几
	连写 比如 append div.a&a=a>ul.a*2>li.a*5

## 后续更新

* 样式编辑
* 函数钩子
* use组件支持
* 兼容提示
* 多开发者模式