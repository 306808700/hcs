/*
    html simple coding
    @auth changyuan.lcy

    @log 
        方针：能让机器去完成的就让机器去完成。
        
        前端工作流程：

            设计稿，切图，html结构，css，js

            PSD ==> HTML ==> CSS ==> JS
        HCS 能在哪个环节上面做文章，先从简单的地方入手。
        
        图像识别==\\==

        简化HTML结构



        1，解决了什么问题？
        2，方便了什么？
        3，简化了什么步骤（高手总是让复杂的事情变简单）
        4，
*/


KISSY.ready(function(S){



    var $ = S.all;
    var D = S.DOM;
    var animate = KISSY.Anim;

    var DOMNUM = 0;
    var __HISTORY = {length:0};
    var __HISTORY_key;
    var __CSS_COLOR_array = "";

    localStorage.hcs_dev = false;

    function HCS(config){
        this.config = config||{};
        this.current = null;
        this.init();
    };
    HCS.prototype.init = function(first_argument) {

        this.tool();
        this.view();
        this.event();
        this.tool._addHistory();
        this.plugin.kissykey(this);
        
        //this.plugin.kcopy(this);
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
                <textarea class='hcs_cssContent' contenteditable='true'>\
                </textarea>\
                <hcsp class='hcs_cssClose'>×</hcsp>\
                <hcsp class='hcs_cssDrag'>css</hcsp>\
            </hcsp>",
            colorControl:"<hcsp class='hcs_color'>CO</hcsp>",
            chat:"<hcsp class='hcs_chat></hcsp>",
            welcome:"<hcsp class='hcs_welcome'>\
                <h2>HCS，基于Chrome的命令行HTML编辑工具</h2>\
                <hcsp class='hcs_untitled button'><hcsp class='hcs_untitled_text'><span>新建空白页</span><span>untitled.html</span></hcsp></hcsp>\
                <hcsp class='hcs_todir button'><hcsp class='hcs_todir_text'><span>浏览目录</span><span>browse directory</span></hcsp></hcsp>\
            </hcsp>",
            dir:"<hcsp class='hcs_dir'>\
                <hcsp class='hcs_goback button'>返回</hcsp>\
                <hcsp class='hcs_dir_input'>\
                    <input type='text' placeholder='例如  html/index.html' /><hcsp class='hcs_dir_add button'>添加</hcsp>\
                </hcsp>\
                <hcsp class='hcs_dir_list'></hcsp>\
            </hcsp>",
            modal:"<hcsp class='hcs_modal'></hcsp>"
        };

        this.$wrap = $(this.tpl.wrap);
        this.$input = $(this.tpl.input);
        this.$tip = $(this.tpl.tip);
        this.$history = $(this.tpl.history);
        this.$background = $(this.tpl.background);
        this.$bg = $(this.tpl.bgControl);
        this.$color = $(this.tpl.colorControl);
        this.$welcome = $(this.tpl.welcome);
        this.$dir = $(this.tpl.dir);
        this.$wrap.append(this.$input).append(this.$history);
        this.$wrap.append(this.tpl.chat);

        this.$modal = $(this.tpl.modal);
        
        //$("head").prepend('<link rel="stylesheet" href="/hcs/codemirror-3.15/lib/codemirror.css" class="hcs_link">');
        this.current = $("body");
        this.view.current = function(){
            $("html").all(".hcs_current")
                .removeClass("hcs_current")
                .removeAttr("contenteditable");
            self.current.addClass("hcs_current");
            self.current.attr('contenteditable',true);
            /*
            if($(window).scrollTop()>self.current.offset().top){
                $(window).scrollTop(self.current.offset().top+$(window).height()/2);
            }
            if(($(window).scrollTop()+$(window).height())<self.current.offset().top){
                $(window).scrollTop(self.current.offset().top-$(window).height()/2);
            }
            if(self.current.offset().top<$(window).scrollTop()){
                $(window).scrollTop(self.current.offset().top);   
            }
            */
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
                if($(dom)[0].tagName=="HTML"||$(dom)[0].tagName=="SCRIPT"||$(dom)[0].tagName=="HCS"||$(dom)[0].tagName=="HCSP"||$(dom).attr("class")=="hcs_input"||$(dom).attr("class")=="hcs_history_select"||$(dom).hasClass("hcs_link")||$(dom).hasClass("hcs_cssContent")){
                    return;
                }
                $(dom).attr("hcs",DOMNUM);DOMNUM++;
                var attr_hcs = $(dom).attr("hcs");
                temp+="[hcs='"+attr_hcs+"']"+self.view.addMark(dom);
                $(dom).addClass("hcs_dev");
                
            });
            if($("style.hcs_style").length==0){
                $("head").append($("<style class='hcs_style'></style>"));
            }
            $style = $("style.hcs_style")
            $style.html(temp);
            self.view.current();
            $("html").addClass('hcs_dev');

            $("html").all("a").on("click",function(e){
                e.preventDefault();
            });
        };
        this.view.undev = function(dom){
            self.view.uncurrent(dom);
            dom.all(".hcs_dev").removeClass("hcs_dev");
            dom.all(".hcs_fold").removeClass("hcs_fold");
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
            self.$cssDetail = $(self.tpl.cssDetail);

            var list = self.$cssDetail.one(".hcs_cssList");
            var title = self.$cssDetail.one(".hcs_cssDrag");
            var close = self.$cssDetail.one(".hcs_cssClose");
            var content = self.$cssDetail.one(".hcs_cssContent");

            var list_li = "",temp = {};

            S.each($("link"),function(dom,index){
                if($(dom).hasClass("hcs_link")){
                    return;
                }
                var href = $(dom).attr("href");
                $(dom).attr("linkid",index);
                href = href.split("?")[0];
                list_li+="<hcsp class='hcs_cssList_li' linkid='"+index+"'>"+href+"</hcsp>";
            });
            list.html(list_li);
            var first =  list.one(".hcs_cssList_li");
            var allli = list.all(".hcs_cssList_li");
            

            //    <script src="../addon/search/searchcursor.js"></script>
            //<script src="../addon/search/match-highlighter.js"></script>
            function getCSS(linkid,href){

                content.attr("linkid",linkid);
                content.val("");
                $(".CodeMirror").remove();

                new S.IO({
                    url:href+"?t="+self.tool._nowTime(),
                    success:function(result){
                        if(!result){
                            result = "/* the new css */";
                        }

                        result = result.replace("/* the new css */","");
                        result = cssbeautify(result,{
                            indent:"  "
                        });
                        content.val(result);
                    },
                    error:function(){

                    },
                    async:false
                });
                bindEdiorSave();
                
            }
            function bindEdiorSave(){

                setTimeout(function(){
                   //CodeMirror.fromTextArea(content[0], {
                     //   lineNumbers: true
                    //});
                    //$(".CodeMirror").on("keyup",function(){
                     content.on("keyup",function(){   
                        //var el = $(this).one(".CodeMirror-code").all("pre");
                        var el = $(this);
                        var str = "";
                        //S.each(el,function(dom){
                        //    str+=$(dom).text();
                        //});
                        str = el.val();
                        str = self.plugin.CSSdecode(str);
                        function fn(){
                            content.timekey = setTimeout(function(){
                                var linkid = content.attr("linkid");
                                self.tool._saveCss($("[linkid="+linkid+"]"),str);
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
                },1);
            }
            if(first){
                first.addClass("on");
                getCSS(first.attr("linkid"),first.html());
            }else{
                list.append("<hcsp class='hcs_cssList_li' linkid='0'><input type='text' class='hcs_cssList_input' placeholder='请取个名字' /></hcsp>")
                var arr = ansyCss($("body"));
                if(arr.length>0){
                    var result = arr.join("{}")+"{}";
                    result = cssbeautify(result,{
                        indent:"  "
                    });
                    content.val(result);
                }
                list.one("input").fire("focus").on("blur",function(){
                    var val = $(this).val();
                    if(val!=""){
                        $(this).parent().html(val).addClass("on");
                        var link = self.tool._addLink(val,0);
                        self.tool._saveCss(link,result);
                        content.attr('linkid',0);
                        bindEdiorSave();
                    }
                });
                //alert("please import a css ");
                //return;
            }
            
            allli.on("click",function(){
                allli.removeClass("on");
                $(this).addClass("on");
                getCSS($(this).attr("linkid"),$(this).html());
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
            self.$cssDetail.appendTo($("html"));
        };
        this.view.cssContent = function(callback){
            __CSS_COLOR_array = "";
            S.each($("html").all("link"),function(dom){
                if(!$(dom).hasClass("hcs_link")){
                   new S.IO({
                        url:$(dom).attr("href"),
                        success:function(str){
                            __CSS_COLOR_array +=str;
                        },
                        async:false
                    });
                }
            });
        }
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
        this.view.welcome = function(){
            self.$welcome.one(".hcs_untitled").on("click",function(){
                localStorage.hcs_path = "html/untitled.html";
                self.$tip.html(localStorage.hcs_path);
                self.$welcome.remove();
                self.$modal.remove();
                //self.render("save");
            });
            self.$welcome.one(".hcs_todir").on("click",function(){
                self.view.dir();
            });
            $("body").after(self.$modal);
        };
        this.view.dir = function(){
            var data;
            var editing = false;

            function get(val,callback){
                new S.IO({
                    url:val,
                    success:function(res){
                        callback(res);
                    }
                });
            }
            function del(val){
                new S.IO({
                    url:"",
                    data:{path:val}

                });
            }
            function edit(val){
                new S.IO({
                    url:"",
                    data:{path:val}
                });
            }
            function dir_date(str){
                var arr = [];
                
                if(str){
                    for(var i=0,len = data.length;i<len;i++){
                        if(data[i].match(str)){
                            arr.push(data[i]);
                        }
                    }
                }else{
                    for(var i=0,len = data.length;i<len;i++){
                        var temp;
                        if(data[i].indexOf("/")!=-1){
                            temp = data[i].split("/")[0];
                        }else{
                            temp = data[i];
                        }
                        if(!S.inArray(temp,arr)){
                            arr.push(temp);
                        }
                    }
                }
                return arr;
            }
            function setList(val){
                var arr = dir_date(val);
                var str = "";
                
                for(var i=0,len=arr.length;i<len;i++){
                    var fold = "";
                    if(arr[i].indexOf(".")==-1){
                        fold = "fold";
                    }
                    str+="<hcsp class='hcs_dir_list_li "+fold+"'><span>"+arr[i]+"</span><op><i class='hcs_dir_save'>save</i><i class='hcs_dir_edit'>edit</i><i class='hcs_dir_del'>del</i></op></hcsp>";
                }
                list.html(str);
                bind();
            }
            function bind(){
                list.all("span").on("click",function(){
                    var val = $(this).html();
                    if($(this).parent().hasClass("fold")){
                        input.val(val+"/").fire("keyup").fire("focus");
                    }else{
                        if(confirm("确定加载这个文件吗？")){
                            get(val,function(res){
                                localStorage.hcs_path = val;
                                self.$dir.hide();
                                self.$modal.remove();
                                localStorage.hcs = res;
                                self.init();
                            });
                        }
                    }
                });
                list.children().on("mouseenter",function(){
                    if(editing){
                        return;
                    }
                    $(this).children("op").show();
                    $(this).addClass("hover");
                });
                list.children().on("mouseleave",function(){
                    if(editing){
                        return;
                    }
                    $(this).children("op").hide();
                    $(this).removeClass("hover");
                });
                list.all(".hcs_dir_del").on("click",function(e){
                    var val = $(this).parent().parent().one("span").text();
                    $(this).remove();
                    del(val);
                    e.stopPropagation();  
                });
                list.all(".hcs_dir_edit").on("click",function(e){
                    
                    var span = $(this).parent().parent().one("span");
                    var val = span.text();
                    var input = $("<input type='text' value='"+val+"' />");
                    span.after(input);
                    input.fire("focus");
                    input.on("blur",function(){
                        $(this).parent().one(".hcs_dir_save").fire("click");
                    });
                    span.hide();
                    $(this).prev().show();
                    editing = true;
                    e.stopPropagation();  
                    //del(val);
                });
                list.all(".hcs_dir_save").on("click",function(e){
                    var input = $(this).parent().parent().one("input");
                    var val = input.val();
                    input.prev().show();
                    input.remove();
                    $(this).next().show();
                    edit(val);
                    $(this).hide();
                    e.stopPropagation();  
                    editing = false;
                });

            }


            var btn = self.$dir.one(".hcs_dir_input").one(".hcs_dir_add");
            var list = self.$dir.one(".hcs_dir_list");
            var input = self.$dir.one(".hcs_dir_input").one("input");

            btn.on("click",function(){
                var val = $(this).prev().val();
                if(!S.inArray(val,data)){
                    data.push(val);
                }
                setList(val);
            });
            input.on("keyup",function(){
                var val = $(this).val();
                if(this.key){
                    clearTimeout(this.key);
                }
                this.key = setTimeout(function(){
                    setList(val);
                },300);
                
            });
            self.$dir.one(".hcs_goback").hide().on("click",function(){
                self.$dir.hide();
                self.$welcome.show();
                self.$welcome.animate({
                    height:"200px"
                },1/6);
            });
            self.$welcome.animate({
                height:0
            },1/5,"",function(){
                self.$welcome.hide();
                self.$dir.show().css("height",0).animate({
                    height:280
                },1/5,"",function(){
                    self.$dir.one(".hcs_dir_input").one("input").fire("focus");
                });
                self.$dir.one(".hcs_goback").fadeIn();
            });
            (function dirdata(){
                data = [
                "html/a.html",
                "html/b.html",
                "js/a.js",
                "js/b.js",
                "index.html",
                "index.js",
                "index.css",
                "html.html"
            ];
            setList("");
            return;
                new S.IO({
                    url:"",
                    success:function(res){
                        data = res.data;
                        setList("");
                    }
                });
            })();
            $("body").after(self.$modal);
        };
        //this.view.linkcss();


        if(localStorage.hcs){
            document.getElementsByTagName("html")[0].innerHTML = localStorage.hcs;
            this.$tip.html(localStorage.hcs_path);
        }else{
            $("body").after(this.$welcome).after(this.$dir);
            self.view.welcome();
        }
    
        $("body").after(this.$wrap).after($(this.tpl.place))
        .after(this.$tip).after(self.$background).after(self.$bg)
        .after(this.$color);
        
        
        var time = +new Date();
        $("head").prepend('<link href="index.css?t='+time+'" rel="stylesheet" charset="utf-8" style="display:none !important " class="hcs_link">');

        if(localStorage.hcs_dev == "true"){
            this.view.dev();
        }
        if(localStorage.hcs_img){
            self.tool._setbg(localStorage.hcs_img);
            if(localStorage.hcs_bgXY){
                self.$background.css({
                    left:localStorage.hcs_bgXY.split(",")[0],
                    top:localStorage.hcs_bgXY.split(",")[1]
                });
            }
        }
        if(localStorage.hcs_scrollTop){
            $(window).scrollTop(localStorage.hcs_scrollTop);
        }

        /* 收集link  href */
        this.tool._selectLink();
    };
    HCS.prototype.event = function(first_argument) {
        var self = this;
        self.plugin.forbidBackSpace();
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
        this.$input[0].onpaste = function(e){
            self.plugin.shotImg(e,function(img){
                S.IO.post("img.php",{code:img.src},function(res){
                    if(self.current[0].tagName=="IMG"){
                        self.current.attr("src",res);
                    }else{
                        self.current.append("<img src='"+res+"' />");
                    }
                    self.view.dev();
                });
            });
        }
        S.Event.delegate(document,'dblclick','.hcs_current',function(e){
            if($(e.target).hasClass("hcs_fold")){
                $(e.target).removeClass("hcs_fold");
            }else{
                $(e.target).addClass("hcs_fold");
            }
        });
        self.$history.on("change",function(){
            var val = $(this).val();
            localStorage.hcs = __HISTORY[val];
            __HISTORY_key = val;
            self.init();
        });
        self.$bg.on("click",function(dom){
            if(self.$background.css("zIndex")==70){
               self.$background.css({
                    "zIndex":-1,
                    opacity:0.3
                }); 
            }else{
                self.$background.css({
                    "zIndex":70,
                    opacity:1
                });
            }
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
                localStorage.hcs_bgXY = self.$background.offset().left+","+self.$background.offset().top;
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

        self.$color.on("click",function(){
            //show color
            if($(".hcs_cssColor_list").length){
                $(".hcs_cssColor_list").remove();
                return;
            }
            self.view.cssContent();
            if(!__CSS_COLOR_array){
                return;
            }
            var colorArray = __CSS_COLOR_array.match(/(#[\da-zA-Z]*)|(red|blue)|(rgb\([\d,\s]*\))/g);

                colorArray = self.plugin.distinctArray(colorArray);

            var hcsp = "<hcsp class='hcs_cssColor_list'>";
            for(var i=0;i<colorArray.length;i++){
                hcsp += "<hcsp class='hcs_cssColor_li' title='"+colorArray[i]+"' style='background-color:"+colorArray[i]+"'></hcsp>";
            }
            hcsp+="</hcsp>";

            var $hcsp = $(hcsp).appendTo(self.$color);


            $hcsp.css({
                width:colorArray.length*self.$color.width(),
                right:-colorArray.length*self.$color.width()
            });
            $hcsp.animate({
                right:self.$color.width()
            },1/3);
        });

        self.plugin.drag.apply(self.$color,[
            function(e){
                var self = this;
                self.downKey = null;
                if(self.key){
                    clearTimeout(self.key);
                }
                self.key = setTimeout(function(){
                    self.downKey = "isdrag";
                },500);
            },  
            function(e){
                if(!this.downKey){
                    return false;
                }
                var x = e.clientX-self.$background.offset().left;
                var y = e.clientY+$(window).scrollTop()-self.$background.offset().top;
                if(this.key){
                    clearTimeout(this.key);
                }
                this.key = setTimeout(function(){
                    self.plugin.getColor(x,y,function(color){
                        self.$color.css({
                            background:color
                        });
                    });
                },200);
            },
            function(e){
                if(!this.downKey){
                    return false;
                }
                var x = e.clientX-self.$background.offset().left;
                var y = e.clientY+$(window).scrollTop()-self.$background.offset().top;
                self.plugin.getColor(x,y,function(color){
                    self.$color.css({
                        background:color
                    });
                    self.$color.attr("title",
                        self.plugin.colorHex(
                            self.$color.css("background-color")
                        )
                    );
                });
            }
        ]);
        


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

        $(window).on("scroll",function(top){
            if(localStorage.hcs_dev =="true"){
                localStorage.hcs_dev_scrollTop = $(window).scrollTop();
            }else{
                localStorage.hcs_undev_scrollTop = $(window).scrollTop();
            }
        });
    };
    HCS.prototype.tool = function(){
        var self = this;
        self._linkArr = [];
        self.tool._addLink = function(val,id){
            $("head").append("<link linkid='"+id+"' href='"+val+"' type='stylesheet'></link>")
        };
        self.tool._selectLink = function(){
            S.each($("head").all("link"),function(dom){
                if(!$(dom).hasClass("hcs_link")){
                    self._linkArr.push($(dom).attr("href"));
                }
            });
        };
        self.tool._importScript = function(src){
            var script = document.createElement("script");
            script.src = src;
            script.className = "hcs_script";
            $("head")[0].appendChild(script);
        };
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
            var index = (str.indexOf(".")+1)||(str.indexOf("&")+1)||(str.indexOf("#")+1)||str.match(/[a-z\d]*/)[0].length+1;

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
                S.IO.post("save.php",{title:href,content:content},function(){
                    href +="?t="+self.tool._nowTime();
                    link.attr('href',href);
                });
            }
            /*
            else{
            
                S.each($("html").all("link"),function(dom){
                    var href = encodeURIComponent($(dom).attr("href"));
                    var css = encodeURIComponent($(dom).text());
                    //$(dom).attr("href",href+"?t="+self.tool._nowTime());
                    S.IO.post("save.php?title="+href+"&content="+css);
                });
            }
            */
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
    HCS.prototype.render = function(value,customerValue){
        var self = this;
        self.command = {
            rship:["parent","children","next","prev"],
            action:["append","before","after","prepend"]
        };
        

        var arr = value.split(" ");
        if(arr[0]=="unchat"){
            localStorage.hcs_chat = false;
            self.chat = null;
            self.$input.attr("placeholder",localStorage.hcs_placeholder);
        }
        if(localStorage.hcs_chat=="true"){
            new S.io.post("long.php",{msg:value});
        }
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
            if(str.indexOf("'")==0){
                // 含有引号作为字符串看待
                cur = str.replace(/'/g,"");
            }else if(str.indexOf(">")!=-1){
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
                console.log(str);
                cur = self.tool._getEl(str);
            }
            self.current[arr[0]](cur);
            
            if(typeof cur == "object"){
                self.tool._setcur(cur);
            }
            
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
        if(arr[0]=="not"){
            var cur = self.current;
            self.plugin.not(self.current,arr[1]);
            S.each(self.current,function(b,i){
                if(d==b){
                    delete dom[i];
                }
            });
            self.current.not(arr[1])
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
            var newDom = self._copy.clone(true);
            self.current.append(newDom);
        }
        if(arr[0]=="down"){
            new S.IO({
                url:"down.php",
                data:{content:"content=data:text/paint; utf-8," + encodeURIComponent(localStorage.hcs)}
            });
        }
        if(arr[0]=="dev"){
            if(localStorage.hcs_dev == "true"){
                this.render("undev");
                return;
            }
            this.view.dev();
            this.tool._hideCss();
            localStorage.hcs_dev = true;
            $(window).scrollTop(localStorage.hcs_dev_scrollTop);
            return;
        }
        if(arr[0]=="undev"){
            this.view.undev($("html"));
            
            $("html").removeClass("hcs_dev");
            localStorage.hcs_dev = false;
            $(window).scrollTop(localStorage.hcs_undev_scrollTop);
            return;
        }
        if(arr[0]=="css"){
            if(localStorage.hcs_dev=="true"){
                return false;
            }
            if(arr[1]){

                var link = $("<link href='"+arr[1]+"' rel='stylesheet' />");
                $("head").append(link);
                S.IO.get(arr[1],function(str){
                });
                self.tool._setcur(link);
            }else{
                if(self.$cssDetail&&self.$cssDetail.css("display")!="none"){
                    self.$cssDetail.remove();
                    self.$cssDetail = null;
                }else{
                //if(localStorage.hcs_dev=="false"){
                    self.tool._showCss();
                //}
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
        if(arr[0]=="chat"){
            var timestamp = 0;
            (function longConect(msg){
                self.chat = new S.IO({
                    url:"long.php",
                    type:"POST",
                    data:{timestamp:timestamp,msg:msg},
                    success:function(res){
                        eval('var res = '+res);
                        timestamp = res.timestamp;
                    },
                    complete:function(){
                        setTimeout(function(){
                            longConect();
                        },200);
                    }
                });
            })();
            localStorage.hcs_placeholder = self.$input.attr("placeholder");
            self.$input.attr("placeholder","聊:");
            localStorage.hcs_chat = true;

        }
        
        if(arr[0]=="reset"){
            delete localStorage.hcs;
            delete localStorage.hcs_img;
            delete localStorage.hcs_path;
            window.onbeforeunload = null;
            window.location.href = window.location.href;
        }
        if(arr[0]=="save"){
            this.tool._saveCss();
            localStorage.hcs = this.tool._cloneHtml();
            if(arr[1]){
                localStorage.hcs_path = arr[1];
            }
            var content = style_html("<!doctype html>\n<html>\n"+localStorage.hcs+"\n</html>",1,'\t',80);
            //var content = "<!doctype html>\n<html>\n"+localStorage.hcs+"\n</html>";
            S.IO.post("save.php",{
                title:localStorage.hcs_path,
                content:content
            });
            this.$tip.html(localStorage.hcs_path);
            self.plugin.showMsg("保存成功");
            return;
        }
        if(arr[0]=="load"){
            var path = arr[1]||localStorage.hcs_path;
            var time = self.tool._nowTime();
            S.IO.post(path+"?"+time,
                function(html){
                    html = html.replace("<!doctype html>\n<html>\n","").replace("\n</html>","");
                    localStorage.hcs = html;
                    $("html").html(localStorage.hcs);
                    self.$tip.html(localStorage.hcs_path);
                    self.init();
                }
            );
            localStorage.hcs_path = path
            self.init();
        }

        if(arr[0]=="open"){
            if(arr[1]){
                var str = arr[1].replace("%value%",customerValue);

                window.open("open.php?url="+encodeURIComponent(str));
            }else{
                window.open("open.php?url="+localStorage.hcs_path);
            }
        }
        if(arr[0]=="host"){
            window.open("host.php");
        }

        if(config.customerCommand){
            for(var i=0,l=config.customerCommand.length;i<l;i++){
                var obj = config.customerCommand[i];
                if(arr[0]==obj.name){
                    self.render(obj.out,arr[1]);
                }
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
        kissykey:function(self){
            S.use('KissKey', function(S, KissKey){
                var ks = new KissKey();
                var cks = self.config.customerKey;
                var count = 0;
                for(var i = 0;i<cks.length;i++){
                    ks.add({
                        type: 'hold', 
                        enableInInput:true,
                        shortcutKeys: cks[i].name, 
                        callback:(function(value){
                            return function(){
                                self.render(value);
                            }
                        })(cks[i].out)
                    });
                }
                ks.start();
            });
        },
        /* 数组去重复 */
        distinctArray:function(arr){
            var obj={},temp=[];
            for(var i=0;i<arr.length;i++){
                if(!obj[arr[i]]){
                    temp.push(arr[i]);
                    obj[arr[i]] =true;
                }
            }
            return temp;
        },
        CSSdecode:function(code) { 
            code = code.replace(/(\s){2,}/ig,'$1'); 
            code = code.replace(/(\S)\s*\{/ig,'$1{\n'); 
            code = code.replace(/\*\/(.[^\}\{]*)}/ig,'\*\/\n$1}'); 
            code = code.replace(/\/\*/ig,'\/\*'); 
            code = code.replace(/;\s*(\S)/ig,';\n\t$1'); 
            code = code.replace(/\}\s*(\S)/ig,'\}\n$1'); 
            code = code.replace(/\n\s*\}/ig,'\n\}'); 
            code = code.replace(/\{\s*(\S)/ig,'\{\n\t$1'); 
            code = code.replace(/(\S)\s*\*\//ig,'$1\*\/'); 
            code = code.replace(/\*\/\s*([^\}\{]\S)/ig,'\*\/\n\t$1'); 
            code = code.replace(/(\S)\}/ig,'$1\n\}'); 
            code = code.replace(/(\n){2,}/ig,'\n'); 
            return code; 
        },
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
                    //$(window).on("resize",function(){
                    //    self.view();
                    //});
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
        colorHex:function(src){
            /*RGB颜色转换为16进制*/
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var that = src;
            if(/^(rgb|RGB)/.test(that)){
                var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
                var strHex = "#";
                for(var i=0; i<aColor.length; i++){
                    var hex = Number(aColor[i]).toString(16);
                    if(hex === "0"){
                        hex += hex; 
                    }
                    strHex += hex;
                }
                if(strHex.length !== 7){
                    strHex = that;  
                }
                return strHex;
            }else if(reg.test(that)){
                var aNum = that.replace(/#/,"").split("");
                if(aNum.length === 6){
                    return that;    
                }else if(aNum.length === 3){
                    var numHex = "#";
                    for(var i=0; i<aNum.length; i+=1){
                        numHex += (aNum[i]+aNum[i]);
                    }
                    return numHex;
                }
            }else{
                return that;    
            }
        },
        getColor:function(x,y,callback){
            
            function draw(img) {
                var _self = this;
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var context = canvas.getContext("2d");
                context.shadowBlur = 20;
                context.shadowColor = "#DDDDDD";
                context.drawImage(img, 0, 0);
                var imageData = context.getImageData(0, 0, 10, 10);
                var pixel = imageData.data;
                //for (var i = 0, length = pixel.length; i < length; i += 4) {
               ////     console.log(i+":rgb("+pixel[i]+","+pixel[i+1]+","+pixel[i+2]+")");
                //}
                var canvasOffset = $(canvas).offset();
                var canvasX = Math.floor(x);
                var canvasY = Math.floor(y);
                // 获取该点像素的数据
                var imageData = context.getImageData(canvasX, canvasY, 1, 1);
               // 获取该点像素数据
                var pixel = imageData.data;
                var pixelColor = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
                callback(pixelColor);
            }
            var img = new Image();
            if(localStorage.hcs_img){
                img.src = localStorage.hcs_img;
                img.onload = function () {
                    draw(img);
                };
            }
        },
        kcopy:function(that){
            var self = that;
            S.Config.debug = true;
            if (S.Config.debug) {
                var srcPath = "/hcs";
                S.config({
                    packages:[
                        {
                            name:"gallery",
                            path:srcPath,
                            charset:"utf-8",
                            ignorePackageNameInUri:true
                        }
                    ]
                });
            }

            S.use('gallery/kcopy', function (S, Kcopy) {
                self.kcopy = new Kcopy("#abcde", {
                    moviePath: "ZeroClipboard.swf",
                    forceHandCursor: false,
                    allowScriptAccess: "always"
                });
                $("#abcde").on("mouseover",function(){
                    self.kcopy.setCurrent($(this));
                    self.kcopy.setText("1231313123");
                    self.kcopy.setTitle("asdfdasfadsfad");
                });
            });
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
        },
        shotImg:function(e,callback){
            var clipboardData = e.clipboardData;
            if(clipboardData&&clipboardData.items){
                items = clipboardData.items;
                var item = items[0];
                if (item.kind == 'file' && item.type == 'image/png') {  
                    var fileReader = new FileReader();  
                      
                    fileReader.onloadend = function (d) {  
                        var d = this.result.substr( this.result.indexOf(',')+1);
                        var img =  document.createElement("img");
                        img.src = 'data:image/jpeg;base64,'+d;
                        //area.append(img);
                        callback(img);
                        return;
                    };
                    fileReader.readAsDataURL(item.getAsFile());
                } 
            }
        },
        forbidBackSpace:function(){
            function fn(e) {  
                var ev = e || window.event; //获取event对象   
                var obj = ev.target || ev.srcElement; //获取事件源   
                var t = obj.type || obj.getAttribute('type'); //获取事件源类型   
                var vEditor = obj.contentEditable;
                    vEditor = vEditor==="true"?true:false; 
                var flag1 = ev.keyCode == 8 && 
                            vEditor == false && 
                            t != "textarea" &&
                            t !="text" &&
                            t !="password";
                if (flag1) return false;  
            }

            //禁止后退键 作用于Firefox、Opera  
            document.onkeypress = fn;  
            //禁止后退键  作用于IE、Chrome  
            document.onkeydown = fn; 
        },
        showMsg:function(value){
            var $msg = $("<hcsp class='hcs_msg'>"+value+"</hcsp>");
            $("html").append($msg);
            new animate($msg,
                {
                    opacity:0
                },1,"",function(){
                        $msg.remove();
                    }
            ).run();
        }

    };
    new HCS(config);
});