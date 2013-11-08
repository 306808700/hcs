<?php
    
    $jpg =  $_REQUEST["code"];
    $img = base64_decode(str_replace('data:image/jpeg;base64,', '', $jpg));
    $filename="".date("h_i_s",time()).".jpg";//要生成的图片名字
    file_put_contents("../img/".$filename, $img);
    echo "../img/".$filename;
?>