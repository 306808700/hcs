<?php
	header('Content-Disposition: attachment; filename="untitled.html"');
	$content = $_REQUEST["content"];
	readfile($content);
?>