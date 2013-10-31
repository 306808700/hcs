<?php
    $pic=$matche_pic[1][0];//远程文件路径

    $data = file_get_contents($pic); // 读文件内容 

    $filetime = time(); //得到时间戳

    $filepath = $_SERVER['DOCUMENT_ROOT']."public/".date("Ym",$filetime)."/";//图片保存的路径目录 

    if(!is_dir($filepath)){
        mkdir($filepath,0777, true);
    }

    $filename = date("YmdHis",$filetime).rand(100,999).'.'.substr($pic,-3,3); //生成文件名，

    $fp = @fopen($filepath.$filename,"w"); //以写方式打开文件

    @fwrite($fp,$data); //
    
    fclose($fp);//完工，哈
?>