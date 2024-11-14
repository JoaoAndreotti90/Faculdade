<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<?php 
	if(isset($_GET["excluir"])){
		$idvend = htmlentities($_GET["excluir"]);
		require("../conecta.php");
		$mysqli->query("DELETE FROM tb_vendedores WHERE idvend = '$idvend'");
		echo $mysqli->error;

		if ($mysqli->error == ""){
			echo "Excluído com sucesso<br />";
			echo "<a href='vendedores.php'>Voltar</a>";
		}
	}
	?>
</body>
</html>
