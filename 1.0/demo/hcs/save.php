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

	echo "开始";
	function create_folders($dir){
		return is_dir($dir) or (create_folders(dirname($dir)) and mkdir($dir,0777));
	}
	
	///创建文件
	function creat_file($title,$content){
		//echo "文件存在与否:".file_exists($title);
		//if (file_exists($title)) {
		//	creat_file();
		//}else {
		echo "文件地址:".$title;

			$fp = fopen($title,"w+");
			if($fp){
				echo "ok";
			}
			echo "写入内容:".$content;
			fwrite($fp,$content);
			fclose($fp);
	}
	echo "路径:".$path;
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