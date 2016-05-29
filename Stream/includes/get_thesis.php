<?php

	$filename = $_POST['filename'];
	$html = file_get_contents("../theses/".$filename.".html");
	echo $html;
?>