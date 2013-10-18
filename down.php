<?php
/*
	$url = "http://www.baidu.com";
$html_content = file_get_contents($url);
$fp = fopen("baidu.html","a");
flock($fp, LOCK_EX) ;
fwrite($fp,$html_content);
flock($fp, LOCK_UN);
fclose($fp);
*/
    $title = $_REQUEST["title"];
	$content = $_REQUEST["content"];
	$name = $title.".html";
	$handle=fopen($name,"w");
    fwrite($handle,$content);
    fclose($handle);
	header('Content-Disposition: attachment; filename="'.$name.'"');
	readfile($name);
?>