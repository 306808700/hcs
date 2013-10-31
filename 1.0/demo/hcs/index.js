/*
    html simple coding
    @auth changyuan.lcy
*/

KISSY.NodeList.not = function(selector){
    console.log(this);
    //KISSY.all(selector);
}
KISSY.ready(function(S){
    S.IO.getJSON("config.json",function(config){
        (function(S){
            var $ = S.all;
            var D = S.DOM;
            var DOMNUM = 0;
            var __HISTORY = {length:0};
            var __HISTORY_key;
            function HCS(config){
                this.config = config||{};
                this.current = null;
                this.init();
                localStorage.hcs_dev = false;
            };
            HCS.prototype.init = function(first_argument) {
                this.tool();
                this.view();
                this.event();
                this.tool._addHistory();
            };
            HCS.prototype.view = function(first_argument) {
                var self = this;
                this.tpl = {
                    wrap:"<hcsp class='hcs_wrap'></hcsp>",
                    place:"<hcsp class='hcs_place'></hcsp>",
                    input:"<input type='text' class='hcs_input' placeholder='BODY' />",
                    tip:"<hcsp class='hcs_tip'></hcsp>",

                    history:"<select class='hcs_history_select' title='历史记录'></select>",
                    bgControl:"<hcsp class='hcs_bg'>BG</hcsp>",
                    background:"<hcsp class='hcs_background'></hcsp>",
                    cssDetail:"<hcsp class='hcs_cssDetail'>\
                        <hcsp class='hcs_cssList'></hcsp>\
                        <hcsp class='hcs_cssContent' contenteditable='true'>\
                        </hcsp>\
                        <hcsp class='hcs_cssClose'>×</hcsp>\
                        <hcsp class='hcs_cssDrag'>css</hcsp>\
                    </hcsp>",
                };

                this.$wrap = $(this.tpl.wrap);
                this.$input = $(this.tpl.input);
                this.$tip = $(this.tpl.tip);
                this.$history = $(this.tpl.history);
                this.$background = $(this.tpl.background);
                this.$bg = $(this.tpl.bgControl);
                this.$wrap.append(this.$input).append(this.$history);
                if(localStorage.hcs){
                    document.getElementsByTagName("html")[0].innerHTML = localStorage.hcs;
                    this.$tip.html(localStorage.hcs_path);
                }

                if($("hcsp").length==0){
                    $("body").after(this.$wrap).after($(this.tpl.place)).after(this.$tip).after(self.$background).after(self.$bg);
                }
                var time = +new Date();
                $("head").append('<link href="index.css?t='+time+'" rel="stylesheet" charset="utf-8" style="display:none !important " class="hcs_link">')
                
                this.current = $("body");
                this.view.current = function(){
                    $("html").all(".hcs_current")
                        .removeClass("hcs_current")
                        .removeAttr("contenteditable");
                    self.current.addClass("hcs_current");
                    self.current.attr('contenteditable',true);
                };
                this.view.uncurrent = function(dom){
                    dom.all(".hcs_current")
                        .removeClass("hcs_current")
                        .removeAttr("contenteditable");
                };
                this.view.addMark = function(dom){
                    var mark;
                    var content = "";
                    if($(dom).one('.hcs_dev_span')){
                        mark = $(dom).one('.hcs_dev_span');
                    }else{
                        mark = $("<hcs class='hcs_dev_span' contenteditable='false'></hcs>");
                    }
                    var id = $(dom).attr("id");
                    var clas = $(dom).attr("class");
                    var tagName = $(dom)[0].tagName;

                    if(clas){
                        clas = clas.replace(/hcs_dev/,"").replace(/hcs_current/,"");
                    }
                    if(id) content = id;
                    else if(clas) content = (tagName+"."+clas);
                    else content = tagName;
                    //$(dom).append(mark);

                    function getOtherAtrs(value){
                        content+=("__"+value+"="+$(dom).attr(value));
                    }

                    if($(dom).attr("src")){
                        getOtherAtrs("src")
                    }
                    if($(dom).attr("href")){
                        getOtherAtrs("href")
                    }
                    if($(dom).attr("charset")){
                        getOtherAtrs("charset")
                    }
                    return "::before{content:'"+content+"';}";
                }
                this.view.dev = function(){

                    var temp ="";
                    S.each($(document).all("*"),function(dom,index){
                        if($(dom)[0].tagName=="HTML"||$(dom)[0].tagName=="SCRIPT"||$(dom)[0].tagName=="HCS"||$(dom)[0].tagName=="HCSP"||$(dom).attr("class")=="hcs_input"||$(dom).attr("class")=="hcs_history_select"){
                            return;
                        }
                        $(dom).attr("hcs",DOMNUM);DOMNUM++;
                        var attr_hcs = $(dom).attr("hcs");
                        temp+="[hcs='"+attr_hcs+"']"+self.view.addMark(dom);
                        $(dom).addClass("hcs_dev");
                        if($(dom)[0].tagName=="LINK"&&!$(dom).hasClass("hcs_style")){
                            S.IO.get($(dom).attr("href"),function(str){
                                $(dom).html(str);
                            });
                        }
                    });
                    if($("style.hcs_style").length==0){
                        $("head").append($("<style class='hcs_style'></style>"));
                    }
                    $style = $("style.hcs_style")
                    $style.html(temp);
                    self.view.current();
                    $("html").addClass('hcs_dev');
                };
                this.view.undev = function(dom){
                    self.view.uncurrent(dom);
                    dom.all(".hcs_dev").removeClass("hcs_dev");
                    dom.all(".hcs_dev_span").remove();
                    dom.all("hcs").remove();
                    dom.all(".hcs_style").remove();
                    dom.all(".hcs_script").remove();
                    
                    S.each(dom.all("*"),function(dom){
                        if($(dom).attr("class")==""){
                            $(dom).removeAttr("class");
                        }
                        $(dom).removeAttr("hcs");
                        if($(dom)[0].tagName=="STYLE"){
                            if(!$(dom).hasClass("hcs_style")){
                               
                                var html = $(dom).html().replace(/<div>/g,"\n").replace(/<\/div>/g,"")
                                $(dom).html($(dom).html().replace(/<div>/g,"\n").replace(/<\/div>/g,""));
                            }
                        }
                    });
                    
                    //$("style").html($("style").text());
                    return;
                };
                this.view.undevplate = function(dom){
                    dom.all("hcsp").remove();
                    S.each(dom.all("script"),function(dom){
                        if($(dom).attr('src')&&$(dom).attr('src').indexOf("hcs")!=-1){
                            $(dom).remove();
                        }
                    });
                    S.each(dom.all("link"),function(dom){
                        if($(dom).attr('href')&&$(dom).attr('href').indexOf("hcs")!=-1){
                            $(dom).remove();
                        }
                    });
                    return;
                };
                this.view.cssDetail = function(){
                    self.$cssDetail = $(self.tpl.cssDetail).appendTo($("html"));

                    var list = self.$cssDetail.one(".hcs_cssList");
                    var title = self.$cssDetail.one(".hcs_cssDrag");
                    var close = self.$cssDetail.one(".hcs_cssClose");
                    var content = self.$cssDetail.one(".hcs_cssContent");

                    var list_li = "",temp = {};

                    S.each($("link"),function(dom,index){
                        if($(dom).hasClass("hcs_link")){
                            return;
                        }
                        temp[index] = $(dom);
                        list_li+="<hcsp class='hcs_cssList_li' linkid='"+index+"'>"+$(dom).attr("href")+"</hcsp>";
                    });
                    list.html(list_li);
                    var first =  list.one(".hcs_cssList_li");
                    
                    function getCSS(linkid,href){
                        content.attr("linkid",linkid);
                        S.IO.get(href+"?t="+self.tool._nowTime(),function(result){
                            result = result.replace(/;/g,";<br>    ").replace(/}/g,"}<br>    ").replace(/{/g,"{<br>    ");
                            console.log(result);
                            content[0].innerHTML=result;
                        });
                    }
                    if(first){
                        first.addClass("on");
                        getCSS(first.attr("linkid"),first.html());
                    }else{
                        content.html("没有样式文件");
                        content.removeAttr("contenteditable");
                    }
                    

                    list.all(".hcs_cssList_li").on("click",function(){
                        list.all(".hcs_cssList_li").removeClass("on");
                        $(this).addClass("on");
                        getCSS($(this).attr("linkid"),$(this).html());
                    });

                    content.on("keyup",function(){
                        var el = $(this);
                        function fn(){
                            content.timekey = setTimeout(function(){
                                var linkid = el.attr("linkid");
                                self.tool._saveCss(temp[linkid],el.text());
                                delete content.timekey;
                            },300);
                        }
                        if(content.timekey){
                            clearTimeout(content.timekey);
                            fn();
                        }else{
                            fn();
                        }
                    });
                    content.on("scroll",function(){
                        return false;
                    });
                    close.on("click",function(){
                        self.$cssDetail.remove();
                    });

                    self.plugin.overlay({
                        ele:self.$cssDetail
                    });
                    self.plugin.drag.apply(title,[
                        function(e){
                            // down
                            this.x = e.clientX - parseInt(self.$cssDetail.css("left"));
                            this.y = e.clientY - parseInt(self.$cssDetail.css("top"));
                            
                        },
                        function(e){
                            // move
                            var left = e.clientX-this.x;
                            var top =  e.clientY-this.y;
                            self.$cssDetail.css({
                                left:left,
                                top:top
                            });

                        },
                        function(){
                        }
                    ]);
                };
                this.view.linkcss = function(){
                    S.each($("html").all("link"),function(dom){
                        if(!$(dom).hasClass("hcs_link")){
                            S.IO.post($(dom).attr("href"),function(str){
                                $(dom).html(str);
                            });
                        }
                    });
                };
                this.view.formartCss = function(){

                };
                this.view.grid = function(grid){
                    $(".hcs_gird").remove();
                    var op = grid||config.grid;
                    var arr = op.split("*");
                    var num = arr[1];
                    var width = arr[0];
                    var height;
                    if($(document).height()>$(window).height()){
                        height = ($(document).height()-40);
                    }else{
                        height = ($(window).height()-40); 
                    }
                    var left = ($(window).width()-width)/2;
                    var str = '<hcsp class="hcs_gird" style="left:'+left+'px;width:'+width+'px;height:'+height+'px;">'
                    for(var i=0;i<num;i++){
                        str+='<hcsp class="hcs_gird_li" style="width:'+(width/num-1)+'px;height:'+height+'px"><hcsp class="hcs_gird_li_span">'+width/num+'</hcsp></hcsp>'
                    }
                    str+='</hcsp>';
                    $("html").append(str);
                };
                //this.view.linkcss();
                if(localStorage.hcs_dev==true){
                    this.view.dev();
                }
                if(localStorage.hcs_img){
                    self.tool._setbg(localStorage.hcs_img);
                }
            };
            HCS.prototype.event = function(first_argument) {
                var self = this;
                
                this.$input.on("keyup",function(e){
                    if(e.keyCode == 13){
                        self.render($(this).val());
                        self._catchCommand($(this).val());
                        $(this).val("").fire("focus");
                    }
                    
                })
                .on("keydown",function(e){
                    if(e.keyCode == 38){
                        // up;
                        if(self._command_history[self._i-1]){
                            $(this).val(self._command_history[self._i-1]);
                            $(this).fire("focus");
                            self._i--;
                            setTimeout(function(){
                                self.$input[0].selectionStart = self.$input[0].value.length;
                            },1);
                        }
                    }
                    if(e.keyCode == 40){
                        // save;
                        if($(this).val()==""){
                            return;
                        }
                        var value = self._command_history[self._i+1]||"";
                        $(this).val(value);
                        $(this).fire("focus");
                        self._i++;
                    }
                    if(e.keyCode == 9){
                        if($(this).val()==""){
                            self.current.fire('focus');
                        }
                        if($(this).val()=="ap"){
                            $(this).val("append ");
                        }
                        if($(this).val()=="af"){
                            $(this).val("after  ");
                        }
                        if($(this).val()=="pr"){
                            $(this).val("prev ");
                        }
                        if($(this).val()=="ne"){
                            $(this).val("next ");
                        }
                        if($(this).val()=="be"){
                            $(this).val("before ");
                        }
                        if($(this).val()=="chil"){
                            $(this).val("children ");
                        }
                        if($(this).val()=="par"){
                            $(this).val("parent ");
                        }
                        return false;
                    }
                }).fire("focus");
                
                self.$history.on("change",function(){
                    var val = $(this).val();
                    localStorage.hcs = __HISTORY[val];
                    __HISTORY_key = val;
                    self.init();
                });

                self.plugin.drag.apply(self.$bg,[
                    function(e){
                        // down
                        this.x = e.clientX - parseInt(self.$background.css("left"));
                        this.y = e.clientY - parseInt(self.$background.css("top"));
                        
                    },
                    function(e){
                        // move
                        var left = e.clientX-this.x;
                        var top =  e.clientY-this.y;
                        self.$background.css({
                            left:left,
                            top:top
                        });

                    },
                    function(){
                    }
                ]);

                self.$bg.on("mousewheel",function(e){
                    var opacity = Number( self.$background.css("opacity") );
                    opacity = opacity*(10+e.deltaY)/10;
                    self.$background.css({
                        opacity:opacity
                    });
                    return false;
                    //localStorage.hcs_img_opacity = opacity;
                });
                $(document).on("click",function(e){
                    if($(e.target).hasClass("hcs_dev")){
                        self.tool._setcur($(e.target));
                        self.view.current();
                        self.current.fire("focus");
                        //self.$input.fire("focus");
                    }
                    if($(e.target).hasClass("hcs_current")){
                    }
                }).on("keydown",function(e){
                //  self.$input.fire("focus");
                });
                window.onbeforeunload=function(){
                    return "如果还未保存，请执行命令 save";
                };
                self._command_history = [];
                self._catchCommand = function(value){
                    if(self._command_history[self._command_history.length-1] != value){
                        self._command_history.push(value);
                    }
                    self._i = self._command_history.length;
                };
            };
            HCS.prototype.tool = function(){
                var self = this;
                self.tool._setbg = function(url){
                    var img = new Image();
                    img.src = url;
                    img.onload  = function(){
                        self.$background.css({
                            background:"url("+url+") no-repeat",
                            height:img.height,
                            width:img.width,
                            opacity:0.3
                        });
                    };
                };
                self.tool._setcur = function(value,type){
                    // 属于节点关系
                    if(!value){
                        return;
                    }   
                    if(typeof value=="object"){
                        self.current = $(value);
                    }else if(type == "relative"){
                        if($(D[value](self.current))[0].tagName=="HCS"){
                            return;
                        }
                        self.current = $(D[value](self.current));
                    }else{
                        self.current = $(value);
                    }
                    if(typeof self.current=="object" && self.current.length>0){
                        var id = self.current.attr("id");
                        var clas = self.current.attr("class");
                        var index = self.current.index();
                        var tagName = self.current[0].tagName;
                        if(clas){
                            clas = clas.replace(/hcs_dev/,"").replace(/hcs_current/,"");
                        }
                        if(id) self.$input.attr("placeholder",id);
                        else if(clas) self.$input.attr("placeholder",tagName+"."+clas);
                        else self.$input.attr("placeholder",tagName);
                    }
                    if(localStorage.hcs_dev==true){
                        self.view.current();
                    }
                };
                self.tool._setAttr = function(value){
                    // 解析字符串
                    
                    var ids = value.match(/^#[a-zA-Z_]*/g);
                    var clas = value.match(/\.[a-zA-Z_+-\s]*/g);
                    var atrs = value.match(/&[a-zA-Z_\d]*=["'.a-zA-Z_\d#\_\-\:\/u4e00-u9fa5]*|&[a-zA-Z_\d]*/);
                    function setAtrs(){
                        if(atrs&&atrs.length>0){
                            if(atrs[0].indexOf("-")!=-1){
                                var _nc = atrs[0].replace('.-',"");
                                self.current.removeAttr(_nc);
                            }
                            else {
                                for(var i=0,len=atrs.length;i<len;i++){
                                    var a = atrs[i].split("=")[0].replace(/[&'"]/g,"");
                                    var b = atrs[i].split("=")[1].replace(/[&'"]/g,"")||"";
                                    self.current.attr(a,b);
                                }
                            }
                        }
                    }
                    if(value.indexOf("&")==0){
                        setAtrs();
                        return;
                    }

                    if(ids&&ids.length>0){
                        self.current.attr("id",ids[0].replace("#",""));
                    }
                    if(clas&&clas.length>0){
                        if(clas[0].indexOf("+")!=-1){
                            var _nc = clas[0].replace('.+',"");
                            var _ncAttr = _nc.split(" ");
                            for(var i=0;i<_ncAttr.length;i++){
                                self.current.addClass(_ncAttr[i]);
                            }
                        }
                        else if(clas[0].indexOf("-")!=-1){
                            var _nc = clas[0].replace('.-',"");
                            var _ncAttr = _nc.split(" ");
                            for(var i=0;i<_ncAttr.length;i++){
                                self.current.removeClass(_ncAttr[i]);
                            }
                        }
                        else {
                            for(var i=0;i<clas.length;i++){
                                self.current.removeAttr("class");
                                self.current.addClass(clas[i].replace(".",""));
                                if(localStorage.hcs_dev==true){
                                    self.current.addClass("hcs_dev").addClass("hcs_current");
                                }
                            }
                        }
                    }          
                    if(atrs&&atrs.length>0){
                        if(atrs[0].indexOf("-")!=-1){
                            var _nc = atrs[0].replace('.-',"");
                            self.current.removeAttr(_nc);
                        }
                        else {
                            for(var i=0,len=atrs.length;i<len;i++){
                                var a = atrs[i].split("=")[0].replace(/[&'"]/g,"");
                                var b = atrs[i].split("=")[1].replace(/[&'"]/g,"")||"";
                                self.current.attr(a,b);
                            }
                        }
                    }
                    setAtrs();
                };
                self.tool._getEl = function(str){
                    if(str.indexOf("--")!=-1){
                        str = str.replace("--","");
                        if(str.indexOf(":")!=-1){
                            var arr = str.split(":");

                            return $($(arr[0])[arr[1]]);
                        }
                        if($(str).length&& $(str)[0]!=self.current[0] ){

                            return $(str);
                        }
                    }
                    if(str.indexOf('"')!=-1){
                        str = str.replace(/"/g,"");
                        return str;
                    }

                    var temp = "<";
                    var index = (str.indexOf(".")+1)||(str.indexOf("&")+1)||(str.indexOf("#")+1)||str.match(/[a-z]*/)[0].length+1;

                    // 先把tagName取到
                    temp+=str.substring(0,index-1);

                    if(str.indexOf(".")!=-1){
                        temp+=" class = "+str.match(/\.[a-zA-Z_+-\s]*/g).join("").replace(/\./g,"");
                    }
                    if(str.indexOf("#")!=-1){

                        temp+=str.split("#")[0]+" id = "+str.split("#")[1];
                    }
                    if(str.indexOf("&")!=-1){
                        var atrs = str.match(/&[a-zA-Z_\d]*=["'.a-zA-Z_\d#\_\-\:\/u4e00-u9fa5]*|&[a-zA-Z_\d]*/);
                        for(var i=0,len=atrs.length;i<len;i++){
                            var a = atrs[i].split("=")[0].replace(/[&'"]/,"");
                            var b = atrs[i].split("=")[1]||"";
                            self.current.attr(a,b);
                            temp+=" "+a;
                            if(b){
                                temp+"="+b+" ";
                            }
                        }
                    }
                    temp+="/>";
                    if(str.indexOf("*")!=-1){
                        var repet = Number(str.match(/\*[\d]*/)[0].replace("*",""));
                        var newTemp = temp;
                        for(var i=1;i<repet;i++){
                            temp+=newTemp;
                        }
                    }
                    try{
                        var a = $(temp);
                        return a;
                    }catch(e){
                        return str;
                    }
                };
                self.tool._saveCss = function(link,content){

                    if(link){
                        var href = link.attr("href");
                        if(href.indexOf("?")!=-1){
                            href = href.split("?")[0];
                        }
                        S.IO.post("save.php?title="+href+"&content="+encodeURIComponent(content),function(){
                            href +="?t="+self.tool._nowTime();
                            link.attr('href',href);
                        });
                    }else{
                    
                        S.each($("html").all("link"),function(dom){
                            var href = encodeURIComponent($(dom).attr("href"));
                            var css = encodeURIComponent($(dom).text());
                            //$(dom).attr("href",href+"?t="+self.tool._nowTime());
                            S.IO.post("save.php?title="+href+"&content="+css);
                        });
                    }
                };
                self.tool._formartCss = function(str){
                    var attr = str.match(/[.#a-zA-Z\d._,:-]+/g);
                    // .abc{color:range,font-size:20px} 
                    // {name:".abc",attrs:{color:"orange",font-size:"20px"}};

                };

                self.tool._addHistory = function(){

                    function add(){
                        var time = self.tool._nowTime();
                        __HISTORY[time] = self.tool._cloneHtml();
                        __HISTORY["length"] = __HISTORY["length"]+1;
                        self.$history.append("<option>"+time+"</option>");
                    }
                    if(__HISTORY.length==0){
                        add();
                    }

                    setInterval(function(){
                        var has = false;
                        for(var n in __HISTORY){
                            if(n!="length"){
                                if(__HISTORY[n]==self.tool._cloneHtml()){
                                    has = true;
                                }
                            }
                        }
                        if(!has){
                            add();
                        }
                    },10000);

                    self.$history.html("");
                    for(var name in __HISTORY){
                        if(name!="length"){
                            self.$history.append("<option>"+name+"</option>");
                        }
                    }

                    if(__HISTORY_key){
                        self.$history.val(__HISTORY_key);
                    }
                    /*
                    if(value){
                        var time = date(new Date(),"hh:mm:ss");
                        __HISTORY[time] = self.tool._cloneHtml();
                        
                    }
                    var hNum = 0;
                    self.$history.html("");
                    for(var name in __HISTORY){
                        self.$history.append("<option>"+name+"</option>");
                        hNum++;
                    }
                    
                    if(__HISTORY_key){
                        self.$history.val(__HISTORY_key);
                    }

                    console.log(hNum);
                    if(hNum>0){
                        self.$history.show();
                    }
                    */
                };

                self.tool._cloneHtml = function(){
                    var $html = $("html").clone(true);
                    self.view.undev($html);
                    self.view.undevplate($html);
                    $html.all(".hcs_link").remove();
                    return $html.html();
                };

                self.tool._nowTime = function(){
                    function date(date, f){
                        if(typeof date != "object"){
                            f = date;
                            date = new Date();
                        }
                        f = f || "yyyy-MM-dd hh:mm:ss";
                        var o = {
                            "M+": date.getMonth() + 1,
                            "d+": date.getDate(),
                            "h+": date.getHours(),
                            "m+": date.getMinutes(),
                            "s+": date.getSeconds(),
                            "q+": Math.floor((date.getMonth() + 3) / 3),
                            "S": date.getMilliseconds()
                        };
                        if (/(y+)/.test(f))
                            f = f.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                        for (var k in o)
                            if (new RegExp("(" + k + ")").test(f))
                                f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                        return f;
                    }
                    var time = date(new Date(),"hh:mm:ss");
                    return time;
                };

                self.tool._setDrag = function(dom){
                    self.plugin.drag.apply(dom,[
                        function(e){
                            // down
                            this.x = e.clientX - parseInt($(this).css("left"));
                            this.y = e.clientY - parseInt($(this).css("top"));
                            
                        },
                        function(e){
                            // move
                            var left = e.clientX-this.x;
                            var top =  e.clientY-this.y;
                            $(this).css({
                                left:left,
                                top:top
                            });

                        },
                        function(){
                        }
                    ]);
                };
                self.tool._showCss = function(){
                    self.view.cssDetail();
                };
                self.tool._hideCss = function(){
                    if(self.$cssDetail){
                        self.$cssDetail.remove();
                    }
                };

                
            };
            HCS.prototype.render = function(value){
                var self = this;
                self.command = {
                    rship:["parent","children","next","prev"],
                    action:["append","before","after","prepend"]
                };
                

                var arr = value.split(" ");

                if(S.inArray(arr[0],self.command.rship)){
                    // 通过亲属关系得到指定对象
                    self.tool._setcur(arr[0],"relative");
                }

                if(arr[0]=="cd"){
                    // 通过已知对象特征得到指定对象
                    var cur;
                    if(arr[1].indexOf(":")!=-1){
                        cur = $(arr[1].split(":")[0])[arr[1].split(":")[1]];
                    }else{
                        cur = arr[1];
                    }
                    self.tool._setcur(cur);
                }
                
                if("#.&".indexOf(value.charAt(0))!=-1){
                    // 对当前对象设置属性
                    self.tool._setAttr(value);
                }
                if(S.inArray(arr[0],self.command.action)){
                    // 插入或更改节点
                    var str = value.replace(arr[0]+" ","");
                    if(!str){
                        return;
                    }
                    var cur;
                    if(str.indexOf(">")!=-1){
                        var step = str.split(">");
                        cur = self.tool._getEl(step[0]);
                        var i = step.length-1;  // 2 
                        function getDomList(d){
                            d = d||self.tool._getEl(step[i]);
                            i--;
                            if(i>0){
                                var dd = self.tool._getEl(step[i]);
                                dd.append(d);
                                getDomList(dd);
                            }else{
                                cur.append(d);
                            }
                        }
                        getDomList();
                    }else{
                        cur = self.tool._getEl(str);
                    }
                    self.current[arr[0]](cur);
                    /*
                    if(typeof cur == "object"){
                        self.tool._setcur(cur);
                    }
                    */
                }
                if(arr[0]=="change"){
                    var html = self.current.html();
                        self.current.html("");
                    var temp = self.current[0].outerHTML.toString();
                        temp = temp.replace(eval("/"+self.current[0].tagName.toUpperCase()+"/ig"),arr[1]);
                    var cur = $(self.tool._getEl(temp));
                        cur.html(html);
                    self.current.after(cur);
                    self.current.remove();
                    self.tool._setcur(cur);
                }
                if(arr[0]=="html"){
                    self.current.html(value.replace("html ",""));
                    self.view.addMark(self.current);
                }
                if(arr[0]=="wrap"){
                    var cur = self.tool._getEl(arr[1]);
                    D.wrap(self.current,cur);
                }
                if(arr[0]=="delete"){
                    var cur = self.current.parent();
                    self.current.remove();
                    self.tool._setcur(cur);
                }
                if(arr[0]=="clear"){
                    self.current.html("");
                    self.view.addMark(self.current);
                }
                if(arr[0]=="&&"){
                    self.current.removeAttr(arr[1]);
                }
                if(arr[0]==".."){
                    self.current.removeClass(arr[1]);
                }
                if(arr[0]=="find"){
                    self.current.removeClass(arr[1]);
                }
                if(arr[0]=="copy"){
                    self._copy = self.current.clone(true);
                }
                if(arr[0]=="paste"){
                    self.current.append(self._copy);
                }
                if(arr[0]=="dev"){
                    this.view.dev();
                    this.tool._hideCss();
                    localStorage.hcs_dev = true;
                }
                if(arr[0]=="undev"){
                    this.view.undev($("html"));
                    
                    $("html").removeClass("hcs_dev");
                    localStorage.hcs_dev = false;
                    return;
                }
                if(arr[0]=="css"){
                    if(arr[1]){
                        var link = $("<link href='"+arr[1]+"' rel='stylesheet' />");
                        $("head").append(link);
                        S.IO.get(arr[1],function(str){
                        });
                        self.tool._setcur(link);
                    }else{
                        if(localStorage.hcs_dev=="false"){
                            self.tool._showCss();
                        }
                    }
                }
                if(arr[0]=="js"){
                    var script = document.createElement("script");
                    script.setAttribute("type","text/javascript");
                    script.setAttribute("src",arr[1]);
                    S.each($("script"),function(dom){
                        if($(dom).attr("src")==arr[1]){
                            $(dom).remove();
                        }
                    });
                    document.head.appendChild(script);
                    self.tool._setcur($(script));
                }
                if(arr[0]=="list"){

                }
                if(arr[0]=="grid"){
                    this.view.grid(arr[1]);
                    return;
                }
                if(arr[0]=="column"){

                }
                if(arr[0]=="ungrid"){
                    $(".hcs_gird").remove();
                    return;
                }
                if(arr[0]=="bg"){

                    self.tool._setbg(arr[1]);
                    localStorage.hcs_img = arr[1];
                }
                if(arr[0]=="unbg"){
                    self.$background.css({
                        background:"none"
                    });
                    delete localStorage.hcs_img;
                }
                if(arr[0]=="reset"){
                    delete localStorage.hcs;
                    window.onbeforeunload = null;
                    window.location.href = window.location.href;
                }
                if(arr[0]=="save"){
                    this.tool._saveCss();
                    localStorage.hcs = this.tool._cloneHtml();
                    if(arr[1]){
                        localStorage.hcs_path = arr[1];
                    }
                    var content = encodeURIComponent("<!doctype html>\n<html>\n"+localStorage.hcs+"\n</html>");
                    S.IO.post("save.php?title="+encodeURIComponent(localStorage.hcs_path)+"&content="+content);
                    this.$tip.html(localStorage.hcs_path);
                    return;
                }
                if(arr[0]=="load"){
                    if(arr[1]){
                        var time = self.tool._nowTime();
                        S.IO.post(arr[1]+"?"+time,
                            function(html){
                                html = html.replace("<!doctype html>\n<html>\n","").replace("\n</html>","");
                                localStorage.hcs = html;
                                $("html").html(localStorage.hcs);
                                self.$tip.html(localStorage.hcs_path);
                                self.init();
                            }
                        );
                        localStorage.hcs_path = arr[1];
                    }
                }
                if(arr[0].match(/^\d*$/)){
                    self.tool._setcur(self.current[arr[0]]);
                }
                if(localStorage.hcs_dev=="true"){
                    self.view.dev();
                }
            };
            HCS.prototype.plugin = {
                overlay:function(options){
                    var opts = S.merge({
                        opacity:0.6,
                        background:"#666",
                        modalClick:false
                    },options);
                    return ({
                        view:function(){
                            if(opts.modal){
                                self.$overlay = $("<hcsp class='overlay'></hcsp>");
                                self.$overlay.appendTo($("html"));
                                this.$overlay.css({
                                    top:0,
                                    left:0,
                                    height:$(document).height(),
                                    width:$(window).width(),
                                    position:"absolute",
                                    opacity:opts.opacity,
                                    background:opts.background,
                                    zIndex:parseInt(opts.ele.css("z-index"))-1||opts.zIndex
                                });
                            }
                            opts.ele.css({
                                height:$(window).height()-100,
                                width:$(window).width()*0.7
                            });
                            opts.ele.css({
                                left:($(window).width()-opts.ele.width())/2,
                                top:($(window).height()-opts.ele.height())/2

                            });
                        },
                        event:function(){
                            var self = this;
                            $(window).on("resize",function(){
                                self.view();
                            });
                            if(opts.modalClick){
                                self.$overlay.on("click",function(){
                                    self.$overlay.remove();
                                    opts.ele.remove();
                                });
                            }
                        },
                        init:function(){
                            var self = this;
                            self.view();
                            self.event();
                        }
                    }).init();
                },
                drag:function(downCallback,moveCallback,upCallback){
                    var ele = this;
                    S.each(ele,function(dom){
                        dom.downCallback = downCallback;
                        dom.moveCallback = moveCallback;
                        dom.upCallback = upCallback;
                        $(dom).css({cursor:"move"});
                        $(dom).on("mousedown",function(e){
                            e.preventDefault();
                            dom.downCallback(e);
                            document.onmousemove = function(e){
                                e = e||event;
                                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                                dom.moveCallback(e);
                                //IE 去除容器内拖拽图片问题 
                                if (document.all){
                                    e.returnValue = false;
                                }

                            }
                            $(document).on("mouseup",function(e){
                                document.onmousemove = null;
                                $(document).detach("mouseup");
                                dom.upCallback(e);
                            });
                        });
                    });
                    return ele;
                },
                not:function(dom,selector){
                    var notDom = $(selector);
                    S.each(notDom,function(d){
                        S.each(dom,function(b,i){
                            if(d==b){
                                delete dom[i];
                            }
                        });
                    });
                    return dom;
                }
            };

            new HCS();
        })(S);
    });
});