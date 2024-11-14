<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<h2>Pesquisar Produto</h2>
	<form method="POST" action="pesqprod.php">
		Nome do Produto: <input type="text" name="nomeprod" maxlength="40" placeholder="Digite o nome">
		<input type="submit" value="Pesquisar" name="botao">
	</form>

	<?php 
	if(isset($_POST["botao"])){
		require("../conecta.php");
		$nomeprod = htmlentities($_POST["nomeprod"]);

		$query = $mysqli->query("SELECT * FROM tb_produtos WHERE nomeprod LIKE '%$nomeprod%'");
		echo $mysqli->error;

		echo "<table border='1' width='400'>
			<tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th></tr>";
		while ($tabela = $query->fetch_assoc()) {
			echo "<tr><td align='center'>$tabela[idprod]</td>
			<td align='center'>$tabela[nomeprod]</td>
			<td align='center'>$tabela[categoriaprod]</td>
			<td align='center'>$tabela[precoprod]</td></tr>";
		}
		echo "</table>";
	}
	?>
	<a href='produtos.php'>Voltar</a>
</body>
</html>
