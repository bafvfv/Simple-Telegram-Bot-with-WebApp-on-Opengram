<?php

include "db.php";
$res = mysqli_query($con, "SELECT `price`, `title`, `pic` FROM `goods`");
$p1 = mysqli_fetch_assoc($res);
$p2 = mysqli_fetch_assoc($res);
$p3 = mysqli_fetch_assoc($res);
$p4 = mysqli_fetch_assoc($res);
$p5 = mysqli_fetch_assoc($res);

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="style.css">
	<title>Document</title>
</head>
<body>
<div class="container">
	<h1 class="header">Pizzas</h1>
	<div class="multiple-items">
		<div class="product-item">
			<img src="<? echo $p1['pic'] ?>">
			<div class="product-list">
			  <h3><? echo $p1['title'] ?></h3>
				<span class="price"><? echo $p1['price'] ?></span>
				<button class="btn" id="btn1">Buy</button>
			</div>
		</div>
		<div class="product-item">
			<img src="<? echo $p2['pic'] ?>">
			<div class="product-list">
			  <h3><? echo $p2['title'] ?></h3>
				<span class="price"><? echo $p2['price'] ?></span>
				<button class="btn" id="btn2">Buy</button>
			</div>
		</div>
		<div class="product-item">
		    <img src="<? echo $p3['pic'] ?>">
			<div class="product-list">
			  <h3><? echo $p3['title'] ?></h3>
				<span class="price"><? echo $p3['price'] ?></span>
				<button class="btn" id="btn3">Buy</button>
			</div>
		</div>
		<div class="product-item">
			<img src="<? echo $p4['pic'] ?>">
			<div class="product-list">
			  <h3><? echo $p4['title'] ?></h3>
				<span class="price"><? echo $p4['price'] ?></span>
				<button class="btn" id="btn4">Buy</button>
			</div>
		</div>
		<div class="product-item">
			<img src="<? echo $p5['pic'] ?>">
			<div class="product-list">
			  <h3><? echo $p5['title'] ?></h3>
				<span class="price"><? echo $p5['price'] ?></span>
				<button class="btn" id="btn5">Buy</button>
			</div>
		</div>
		<div class="product-item">
			<img src="<? echo $p6['pic'] ?>">
			<div class="product-list">
			  <h3><? echo $p6['title'] ?></h3>
				<span class="price"><? echo $p6['price'] ?></span>
				<button class="btn" id="btn6">Buy</button>
			</div>
		</div>
	  </div>
</div>
<div class="usercard" id="usercard"></div>
	
	
	<script src="https://telegram.org/js/telegram-web-app.js"></script>
	<script src="app.js"></script>
</body>
</html>

<!-- <script src="https://telegram.org/js/telegram-web-app.js"></script> -->
