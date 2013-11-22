 <?php
 	header("Content-type: text/html; charset=gb2312"); 
 	$filedemo = "C:\Users\changyuan.lcy\Desktop\host.txt";   
    $fpdemo = fopen($filedemo,"r"); 
 	if ($fpdemo){   
 		while(!feof($fpdemo))
  		{
		  $line = fgetss($fpdemo);
		  echo $line;
		  echo "<br>";
		}
	}
  		fclose($fpdemo);

  	//system("C:\Users\changyuan.lcy\Desktop\host.txt")

 	//echo "system";
 	//echo fopen("C:\Windows\System32\drivers\etc\hosts","r");

 	//echo $file = file_get_contents("C:\Windows\System32\drivers\etc\hosts");
 ?>