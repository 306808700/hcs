/*
	html simple coding
	@auth changyuan.lcy
*/

KISSY.add('hcs',function (S) {
	var $ = S.all;
	var D = S.DOM;
	function HCS(config){
		this.config = config||{};
		this.current = null;
	};
	HCS.prototype.init = function(first_argument) {
		this.view();
		this.event();
		this.tool();
	};
	HCS.prototype.view = function(first_argument) {
		var self = this;
		this.tpl = {
			wrap:"<hcs class='hcs_wrap'></hcs>",
			place:"<hcs class='hcs_place'></hcs>",
			input:"<input type='text' class='hcs_input' placeholder='BODY' />"
		};

		this.$wrap = $(this.tpl.wrap);
		this.$input = $(this.tpl.input);
		this.$wrap.append(this.$input);
		if(localStorage.hcs){
			//document.getElementsByTagName("html")[0].innerHTML = localStorage.hcs;
		}

		$("body").after(this.$wrap).after($(this.tpl.place));

		this.current = $("body");

		this.view.current = function(){
			$("html").all(".hcs_current")
				.removeClass("hcs_current")
				//.removeAttr("contenteditable");
			self.current.addClass("hcs_current");
			//self.current.attr('contenteditable',true);
		};
		this.view.uncurrent = function(){
			$("html").all(".hcs_current")
				.removeClass("hcs_current")
				//.removeAttr("contenteditable");
		};
		this.view.addMark = function(dom){
			var mark;
			if($(dom).one('.hcs_dev_span')){
				mark = $(dom).one('.hcs_dev_span');
			}else{
				mark = $("<hcs class='hcs_dev_span'></hcs>");
			}
			var id = $(dom).attr("id");
			var clas = $(dom).attr("class");
			var tagName = $(dom)[0].tagName;
			if(clas){
				clas = clas.replace(/hcs_dev/,"").replace(/hcs_current/,"");
			}
			if(id) mark.html(id);
			else if(clas) mark.html(tagName+"."+clas);
			else mark.html(tagName);
			$(dom).append(mark);
		}
		this.view.dev = function(){
			S.each($(document).all("*"),function(dom){
				if($(dom).hasClass(".hcs_dev")||$(dom).hasClass(".hcs_dev_span")){
					return;
				}
				if($(dom)[0].tagName=="SCRIPT"||$(dom)[0].tagName=="HCS"||$(dom).attr("class")=="hcs_input"){
					return;
				}
				self.view.addMark(dom);
				$(dom).addClass("hcs_dev");
			});
			self.view.current();

		};
		this.view.undev = function(){
			self.view.uncurrent();
			$("html").all(".hcs_dev").removeClass("hcs_dev");
			$("html").all(".hcs_dev_span").remove();
			$("hcs").remove();
			return;
		};
		this.view.dev();
	};
	HCS.prototype.event = function(first_argument) {
		var self = this;
		
		this.$input.on("keyup",function(e){
			if(e.keyCode == 13){
				self._catch = $("body").html();
				self.render($(this).val());
				self._catchCommand($(this).val());
				$(this).val("").fire("focus");
			}
			
		}).fire("focus");
		$(document).on("click",function(e){
			if($(e.target).hasClass("hcs_dev_span")){
				self.tool._setcur($(e.target).parent());
				self.$input.fire("focus");
			}
		});
		$(document).on("keydown",function(e){
			self.$input.fire("focus");
		});
		window.onbeforeunload=function(){
			return "如果还未保存，请执行命令 save";
		}
		self._command_history = [];
		this.$input.on("keydown",function(e){
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
				// down;
				if($(this).val()==""){
					return;
				}
				var value = self._command_history[self._i+1]||"";
				$(this).val(value);
				$(this).fire("focus");
				self._i++;
			}
		});

		
		self._catchCommand = function(value){
			if(self._command_history[self._command_history.length-1] != value){
				self._command_history.push(value);
			}
			self._i = self._command_history.length;
		};
		/*
		self._keyboard = function(downcallback,upCallback){
			var ele = this;
			var keyboardObject = {};
			var keyArray = [];
			var keyDownFn = function(e){   
				var code = e.keyCode;
				if(keyboardObject[code]){
					return;
				}
				keyboardObject[code]=setInterval(function(){
					downcallback.apply(ele[0],[keyboardObject]);
				},10);
			};
			var keyUpFn = function(e){
				var code = e.keyCode;
				clearInterval(keyboardObject[code]);
				delete keyboardObject[code];
				upCallback.apply(ele[0],[keyboardObject]);
			};
			
			$(document).on("keydown",keyDownFn);
			$(document).on("keyup",keyUpFn);
		};
		
		self._keyboard.apply(this.$input,[function(code){
			if(code[17]&&code[90]){
				// ctrl + z;
				clearInterval(code[90])
				console.log("cz");
				return false;
			}
		},function(){
		}]);
		*/
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
				self.current = $(D[value](self.current));
			}else{
				self.current = $(value);
			}
			if(typeof self.current=="object" && self.current.length>0){
				var id = self.current.attr("id");
				var clas = self.current.attr("class");
				var index = self.current.index();
				var tagName = self.current[0].tagName;

				if(id) self.$input.attr("placeholder",id);
				else if(clas) self.$input.attr("placeholder",tagName+"."+clas);
				else self.$input.attr("placeholder",tagName);
			}
			self.view.current();
		};
		self.tool._setAttr = function(value){
			// 解析字符串
			var ids = value.match(/^#[a-zA-Z_]*/g);
			var clas = value.match(/\.[a-zA-Z_]*/g);
			var atrs = value.match(/&[a-zA-Z_\d]*=[a-zA-Z_\d#_-]*|&[a-zA-Z_\d]*/g);

			if(ids&&ids.length>0){
				self.current.attr("id",ids[0].replace("#",""));
			}
			if(clas&&clas.length>0){
				for(var i=0;i<clas.length;i++){
					self.current.removeAttr("class");
					self.current.addClass(clas[i].replace(".",""));
				}
			}
			if(atrs&&atrs.length>0){
				for(var i=0,len=atrs.length;i<len;i++){
					var a = atrs[i].split("=")[0].replace("&","");
					var b = atrs[i].split("=")[1]||"";
					self.current.attr(a,b);
				}
			}
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
			var temp = "<";
			var index = (str.indexOf(".")+1)||(str.indexOf("&")+1)||(str.indexOf("#")+1);

			// 先把tagName取到
			temp+=str.substring(0,index-1);

			if(str.indexOf(".")!=-1){
				temp+=" class = "+str.match(/\.[a-z]*/g).join("").replace(/\./g,"");
			}
			if(str.indexOf("#")!=-1){

				temp+=str.split("#")[0]+" id = "+str.split("#")[1];
			}
			if(str.indexOf("&")!=-1){
				var a = str.match(/[a-z\d]*=[a-z\d]*/g);
				for(var i=0,l = a.length;i<l;i++){
					var b = a[i].split("=");
					temp+=" "+b[0]+"="+b[1]+" ";
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
			self.tool._setAttr(arr[0]);
		}
		if(S.inArray(arr[0],self.command.action)){
			// 插入或更改节点
			var str = value.replace(arr[0]+" ","");
			if(!str){
				return;
			}
			var cur = self.tool._getEl(str);
			self.current[arr[0]](cur);
			if(typeof cur == "object"){
				self.tool._setcur(cur);
			}
		}
		if(arr[0]=="change"){
			var html = self.current.html()
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
		if(arr[0]=="save"){
			this.view.undev();
			localStorage.hcs = $("html").html();
			if(arr[1]){
				var path = "";
				if(self.config.path){
					path = "&path="+self.config.path;
				}
				S.IO.post("down.php?title="+arr[1]+"&content="+localStorage.hcs+path);
			}
			this.view.dev();
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
						localStorage.hcs = html;
						$("html").html(localStorage.hcs);
						self.view.dev();
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
},{requires:["hcs.css"]});