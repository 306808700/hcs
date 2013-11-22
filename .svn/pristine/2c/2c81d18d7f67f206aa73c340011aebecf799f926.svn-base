/*
    dom 树结构，
    存储主干，每到一个分支记录主干位置，当没有子节点，跳到下一个循环分支，并且替换当前数组为堆栈的最后一个数组

*/

function ansyCss($dom){
    var cssArr = [];
    var S = KISSY;
    var $ = S.one;
    function build(arr){
        var i = 0;
        while(arr[i]){
            var newArr = arr.slice(0,i+1);
            var str = newArr.join(" ");
            if(!S.inArray(str,cssArr)){
                cssArr.push(str);
            }
            i++;
        }
    }
    var duandian = [];
    function getAttr(dom,arr){
        var clas = dom.attr('class');
        var id = dom.attr("id");
        var name = dom[0].tagName.toLowerCase();
        if(id){
            arr = ["#"+id];
        }else if(clas){
            clas = clas.split(" ").join(".");
            arr.push("."+clas);
        }else{
            if(name=="body"){
                arr = [];
            }else{
                arr.push(name);
            }
        }
        return arr;
    }
    function treeList(dom,arr,index,type){

        arr = getAttr(dom,arr);

        if(dom.children().length>0){
            S.each(dom.children(),function(c,index){
                if(index!=0){
                    if(duandian.length>0){
                        arr = duandian.splice(duandian.length-1,duandian.length)[0];
                    }
                }
                if($(c).next()){
                    duandian.push(arr.slice(0));
                }
                if($(c).children().length==0){
                    arr = getAttr($(c),arr);
                    build(arr);
                }
                treeList($(c),arr,1,"child");
            });
        }
    }
    treeList($dom,[],0);
    return cssArr;
}