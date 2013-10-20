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
	$path = $_REQUEST["path"];
	$name = $title.".html";


	///创建文件夹 
	function createdir($dir){
		if(file_exists($dir) && is_dir($dir)){
		}else{
			mkdir ($dir,0777);
		}
	}
	///创建文件
	function creat_file($PATH,$name,$content){
		$sFile = $name;
		if (file_exists($PATH.$sFile)) {
			creat_file();
		}else {
			$fp= fopen($PATH.$sFile,"w");
			fwrite($fp,$content);
			fclose($fp);
		} 
		return $sFile;
	}
	createdir($path);
	creat_file($path,$name,$content);
	/*
	;
		$handle=fopen($name,"w");
	    fwrite($handle,$content);
	    fclose($handle);
		//header('Content-Disposition: attachment; filename="'.$name.'"');
		//readfile($name);

		
	*/

?>