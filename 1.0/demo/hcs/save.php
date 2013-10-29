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
	$path = dirname($title);
	$path = "../".$path;

	function create_folders($dir){
		return is_dir($dir) or (create_folders(dirname($dir)) and mkdir($dir,0777));
	}
	
	///创建文件
	function creat_file($title,$content){
		if (file_exists($title)) {
			creat_file();
		}else {
			$fp= fopen($title,"w");
			fwrite($fp,$content);
			fclose($fp);
		} 
		return $sFile;
	}
	create_folders($path);

	creat_file($title,$content);
	/*
	;
		$handle=fopen($name,"w");
	    fwrite($handle,$content);
	    fclose($handle);
		//header('Content-Disposition: attachment; filename="'.$name.'"');
		//readfile($name);

		
	*/

	echo "成功";
?>