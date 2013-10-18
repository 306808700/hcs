/*
	html simple coding
	@auth changyuan.lcy
*/

KISSY.add('hcs',function (S) {
	var $ = S.all;
	var D = S.DOM;
	function HCS(){
		this.current = null;
	};
	HCS.prototype.init = function(first_argument) {
		this.view();
		this.event();
	};
	HCS.prototype.view = function(first_argument) {
		var self = this;
		this.tpl = {
			wrap:"<hcs class='hcs_wrap'></hcs>",
			input:"<input type='text' class='hcs_input' placeholder='BODY' />"
		};

		this.$wrap = $(this.tpl.wrap);
		this.$input = $(this.tpl.input);
		this.$wrap.append(this.$input);
		$("body").after(this.$wrap);

		if(localStorage.hcs){
			$("body").html(localStorage.hcs);
		}

		this.current = $("body");

		this.view.current = function(){
			$(document).all(".hcs_current")
				.removeClass("hcs_current")
				.removeAttr("contenteditable");
			self.current.addClass("hcs_current");
			self.current.attr('contenteditable',true);
		};
		this.view.uncurrent = function(){
			$(document).all(".hcs_current")
				.removeClass("hcs_current")
				.removeAttr("contenteditable");
		};
		this.view.addMark = function(dom){
			var mark = $("<span class='hcs_dev_span'></span>");
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
				if($(dom)[0].tagName=="HCS"||$(dom).attr("class")=="hcs_input"){
					return;
				}
				self.view.addMark(dom);
				$(dom).addClass("hcs_dev");
			});
			self.view.current();

		};
		this.view.undev = function(){
			self.view.uncurrent();
			$(document).all(".hcs_dev").removeClass("hcs_dev");
			$(document).all(".hcs_dev_span").remove();
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
			if(self._command_history[self._command_history.length-1] == value){
				return;
			}
			self._command_history.push(value);
			self._i = self._command_history.length;
		};
		self._keyboard = function(downcallback,upCallback){
			var ele = this;
			var keyboardObject = {};
			var keyArray = [];
			var keyDownFn = function(e){   
				var code = e.keyCode;
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
				console.log("cz");
			}
		},function(){
		}]);
	};
	HCS.prototype.render = function(value){
		var self = this;
		self.command = {
			rship:["parent","children","next","prev"],
			action:["append","before","after","prepend"]
		};
		self._setcur = function(value,type){
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
			this.view.current();
		};
		self._setAttr = function(value){
			// 解析字符串
			var ids = value.match(/^#[a-z]*/g);
			var clas = value.match(/\.[a-z]*/g);
			var atrs = value.match(/&[a-z\d]*=[a-z\d#_-]*|&[a-z\d]*/g);

			if(ids&&ids.length>0){
				self.current.attr("id",ids[0]);
			}
			if(clas&&clas.length>0){
				self.current.attr('class',clas.join("").replace(/\./g," "));
			}
			if(atrs&&atrs.length>0){
				for(var i=0,len=atrs.length;i<len;i++){
					var a = atrs[i].split("=")[0].replace("&","");
					var b = atrs[i].split("=")[1]||"";
					self.current.attr(a,b);
				}
			}
		};
		self._getEl = function(str){
			if($(str).length&& $(str)[0]!=self.current[0] ){
				return $(str);
			}
			var temp = "<";
			if(str.indexOf(".")!=-1){
				temp+=str.split(".")[0]+" class = "+str.match(/\.[a-z]*/g).join("").replace(/\./g,"");
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

		var arr = value.split(" ");

		if(S.inArray(arr[0],self.command.rship)){
			// 通过亲属关系得到指定对象
			self._setcur(arr[0],"relative");
		}

		if(arr[0]=="cd"){
			// 通过已知对象特征得到指定对象
			self._setcur(arr[1]);
		}
		
		if("#.&".indexOf(value.charAt(0))!=-1){
			// 对当前对象设置属性
			self._setAttr(arr[0]);
		}
		if(S.inArray(arr[0],self.command.action)){
			// 插入或更改节点
			var str = value.replace(eval("/"+arr[0]+"[ ]*/g"),"");
			if(!str){
				return;
			}
			var cur = self._getEl(str);
			self.current[arr[0]](cur);
			if(typeof cur == "object"){
				self._setcur(cur);
			}
		}
		if(arr[0]=="change"){
			var html = self.current.html()
			self.current.html("");
			var temp = self.current[0].outerHTML.toString();
			console.log(temp);
			temp = temp.replace(eval("/"+self.current[0].tagName.toUpperCase()+"/ig"),arr[1]);

			console.log(temp);
			var cur = self._getEl(temp);
			cur.html(html);
			self.current.after(cur);
			self.current.remove();
			self._setcur(cur);
		}
		if(arr[0]=="html"){
			self.current.html(value.replace("html ",""));
			self.view.addMark(self.current);
		}
		if(arr[0]=="wrap"){
			var cur = self._getEl(arr[1]);
			D.wrap(self.current,cur);
		}
		if(arr[0]=="delete"){
			var cur = self.current.parent();
			self.current.remove();
			self._setcur(cur);
		}
		if(arr[0]=="clear"){
			self.current.html("");
			self.view.addMark(self.current);
		}
		if(arr[0]=="copy"){
			self._copy = self.current.clone();
		}
		if(arr[0]=="paste"){
			self.current.append(self._copy);
		}
		if(arr[0]=="dev"){
			this.view.dev();
		}
		if(arr[0]=="undev"){
			this.view.undev();
		}
		if(arr[0]=="save"){
			this.view.undev();
			localStorage.hcs = $("body").html();
			this.view.dev();
		}
		if(arr[0].match(/^\d*$/)){
			self._setcur(self.current[arr[0]]);
		}
		self.view.dev();
	};
	HCS.prototype.tool = function(){
		return {

		}
	}
	return HCS;
});