/*
    html simple coding
    @auth changyuan.lcy
*/
KISSY.add("gallery/hcs/1.0/index",function (S) {
    var $ = S.all;
    var D = S.DOM;
    var DOMNUM = 0;
    function HCS(config){
        this.config = config||{};
        this.current = null;
        this.init();
    };
    HCS.prototype.init = function(first_argument) {
        this.view();
        this.event();
        this.tool();
    };
    HCS.prototype.view = function(first_argument) {
        var self = this;
        this.tpl = {
            wrap:"<hcsplate class='hcs_wrap'></hcsplate>",
            place:"<hcsplate class='hcs_place'></hcsplate>",
            input:"<input type='text' class='hcs_input' placeholder='BODY' />"
        };

        this.$wrap = $(this.tpl.wrap);
        this.$input = $(this.tpl.input);
        this.$wrap.append(this.$input);
        if(localStorage.hcs){
            document.getElementsByTagName("html")[0].innerHTML = localStorage.hcs;

        }
        if($("hcsplate").length==0){
            $("body").after(this.$wrap).after($(this.tpl.place));
        }
        var time = +new Date();
        $("head").append('<link href="../index.css?t='+time+'" rel="stylesheet" charset="utf-8" style="display:none !important " class="hcs_link">')
        this.current = $("body");

        this.view.current = function(){
            $("html").all(".hcs_current")
                .removeClass("hcs_current")
                .removeAttr("contenteditable");
            self.current.addClass("hcs_current");
            self.current.attr('contenteditable',true);
        };
        this.view.uncurrent = function(){
            $("html").all(".hcs_current")
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
                if($(dom)[0].tagName=="HTML"||$(dom)[0].tagName=="SCRIPT"||$(dom)[0].tagName=="HCS"||$(dom)[0].tagName=="HCSPLATE"||$(dom).attr("class")=="hcs_input"){
                    return;
                }
                $(dom).attr("hcs",DOMNUM);DOMNUM++;
                var attr_hcs = $(dom).attr("hcs");
                temp+="[hcs='"+attr_hcs+"']"+self.view.addMark(dom);
                $(dom).addClass("hcs_dev");
                if($(dom)[0].tagName=="LINK"&&!$(dom).hasClass("hcs_link")){
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

        };
        this.view.undev = function(){
            self.view.uncurrent();
            $("html").all(".hcs_dev").removeClass("hcs_dev");
            $("html").all(".hcs_dev_span").remove();
            $("hcs").remove();
            $(".hcs_style").remove();
            $(".hcs_script").remove();
            
            S.each($(document).all("*"),function(dom){
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
        this.view.undevplate = function(){
            $("hcsplate").remove();
            S.each($("html").all("script"),function(dom){
                if($(dom).attr('src')&&$(dom).attr('src').indexOf("hcs")!=-1){
                    $(dom).remove();
                }
            });
            S.each($("html").all("link"),function(dom){
                if($(dom).attr('href')&&$(dom).attr('href').indexOf("hcs")!=-1){
                    $(dom).remove();
                }
            });
            return;
        };
        this.view.dev();
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


        $(document).on("click",function(e){
            if($(e.target).hasClass("hcs_dev")){
                self.tool._setcur($(e.target));
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
            self.view.current();
        };
        self.tool._setAttr = function(value){
            // 解析字符串
            
            var ids = value.match(/^#[a-zA-Z_]*/g);
            var clas = value.match(/\.[a-zA-Z_+-\s]*/g);
            var atrs = value.match(/&[a-zA-Z_\d]*=["'.a-zA-Z_\d#\_\-\:\/]*|[a-zA-Z_\d]*/);
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
                temp+=" class = "+str.match(/\.[a-z]*/g).join("").replace(/\./g,"");
            }
            if(str.indexOf("#")!=-1){

                temp+=str.split("#")[0]+" id = "+str.split("#")[1];
            }
            if(str.indexOf("&")!=-1){
                var atrs = str.match(/&[a-zA-Z_\d]*=["'.a-zA-Z_\d#_-]*|&[a-zA-Z_\d]*/g);
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
        self.tool._formartCss = function(str){
            var attr = str.match(/[.#a-zA-Z\d._,:-]+/g);
            // .abc{color:range,font-size:20px} 
            // {name:".abc",attrs:{color:"orange",font-size:"20px"}};

        }
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
            self.tool._setcur(arr[1]);
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
            self.current[arr[0]]("\n");
            if(typeof cur == "object"){
                self.tool._setcur(cur);
            }
        }
        if(arr[0]=="change"){
            var html = self.current.html();
                self.current.html("");
            var temp = self.current[0].outerHTML.toString();
                temp = temp.replace(eval("/"+self.current[0].tagName.toUpperCase()+"/ig"),arr[1]);
            var cur = self.tool._getEl(temp);
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
        }
        if(arr[0]=="undev"){
            this.view.undev();
            return;
        }
        if(arr[0]=="css"){
            var link = $("<link href='"+arr[1]+"' rel='stylesheet' />");
            $("head").append(link);
            S.IO.get(arr[1],function(str){
                console.log(str);
            });
            self.tool._setcur(link);
        }
        if(arr[0]=="js"){
            var script = document.createElement("script");
            script.setAttribute("type","text/javascript");
            script.setAttribute("scr",arr[1]);
            document.head.appendChild(script);
            self.tool._setcur($(script));
        }
        if(arr[0]=="reset"){
            delete localStorage.hcs;
            window.onbeforeunload = null;
            window.location.href = window.location.href;
        }
        if(arr[0]=="save"){
            this.view.undev();
            this.view.undevplate();
            $(".hcs_link").remove();
            localStorage.hcs = $("html").html();
            var content = encodeURIComponent("<!doctype html>\n<html>\n"+localStorage.hcs+"\n</html>");
            if(arr[1]){
                var path = "";
                if(self.config.path){
                    path = "&path="+self.config.path;
                }
                S.IO.post("save.php?title="+arr[1]+"&content="+content+path);

            }
            this.init();
        }
        if(arr[0]=="load"){
            if(arr[1]){
                var path = "";
                if(self.config.path){
                    path = self.config.path;
                }
                var time = +new Date();
                S.IO.post(path+arr[1]+".html?"+time,
                    function(html){
                        html = html.replace("<!doctype html>\n<html>\n","").replace("\n</html>","");
                        localStorage.hcs = html;
                        $("html").html(localStorage.hcs);
                        self.init();
                    }
                );
            }
        }
        if(arr[0].match(/^\d*$/)){
            self.tool._setcur(self.current[arr[0]]);
        }
        self.view.dev();
    };
    return HCS;

});