<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<?php 
	if(isset($_GET["excluir"])){
		$idprod = htmlentities($_GET["excluir"]);
		require("../conecta.php");
		$mysqli->query("DELETE FROM tb_produtos WHERE idprod = '$idprod'");
		echo $mysqli->error;

		if ($mysqli->error == ""){
			echo "Excluído com sucesso<br />";
			echo "<a href='produtos.php'>Voltar</a>";
		}
	}
	?>
</body>
</html>
