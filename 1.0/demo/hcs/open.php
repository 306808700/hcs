<?php
	$url = $_REQUEST["url"];
?>
<style type="text/css">
	html,body{
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
	}
	iframe{
		border: 0px;
	}
</style>
<html>
<body>
<iframe id="web" src="" height="100%" width="100%"></iframe>
</body>
</html>
<script type="text/javascript">
	window.onload = function(){
		document.getElementById("web").src = "<?php echo $url ?>";
	}
/*	setInterval(function(){
		document.getElementById("web").src = document.getElementById("web").src;
	},5000);*/
</script>