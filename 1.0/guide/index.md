## 综述

hcs是一款概念式的以命令行方式，快速构建html页面的在线编辑工具 2013-10-21 至今

* 版本：1.0
* 作者：changyuan.lcy
* demo：[http://gallery.kissyui.com/hcs/1.0/demo/index.html](http://gallery.kissyui.com/hcs/1.0/demo/index.html)

## 初始化组件

    S.use('gallery/hcs/1.0/index', function (S, Hcs) {
    	var config = {
            path:"html/"
        };
        var hcs = new Hcs();
    })

## API说明
* path 设置html目录名
*

## 命令行

* cd  指定一个节点
* load 加载一个页面 比如 load a 加载 {path}/a.html
* save 保存一个页面 比如 save a 保存到 {path}/a.html
* append after before prepend 节点操作
* parent children next prev 节点选择
* html 填充内容
* clear 清空当前节点内容
* delete 删除当前节点
* reset 重置工程到最初状态
* copy paste 复制粘帖当前节点
* dev undev 默认开发者模式，取消开发者模式
* css 导入css文件, 例如 css css/index.css
* js 导入js文件，例如 js  js/index.js
* tab "命令框"和"节点"间焦点切换


## 符号命令行 (对象是当前节点)

* &name="username" 设置name属性和值，也可以&checked只设置属性
* .nav  设置class
* #wrap   设置 id
* .+ 添加一个class
* .- 删除一个class
* &+ 添加一个属性
* &- 删除一个属性
* >  子节点通常写法 div>ul>li*3
* *  乘于几
* 连写 div.a&a=a>ul.a>li.a*5

## 后续更新

* 样式编辑
* 函数钩子
* use组件支持
* 兼容提示