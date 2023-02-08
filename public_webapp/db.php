<?php

$ip = "127.0.0.1";
$user = "your_db_user";
$password = "your_password";
$db = "your_db";

$con = mysqli_connect($ip, $user, $password, $db);

if ($con == false)
{
	echo "Connection error!";
}

?>