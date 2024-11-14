<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<h2>Pesquisar Vendedor</h2>
	<form method="POST" action="pesqvend.php">
		Nome do Vendedor: <input type="text" name="nomevend" maxlength="40" placeholder="Digite o nome">
		<input type="submit" value="Pesquisar" name="botao">
	</form>

	<?php 
	if(isset($_POST["botao"])){
		require("../conecta.php");
		$nomevend = htmlentities($_POST["nomevend"]);

		$query = $mysqli->query("SELECT * FROM tb_vendedores WHERE nomevend LIKE '%$nomevend%'");
		echo $mysqli->error;

		echo "<table border='1' width='400'>
			<tr><th>ID</th><th>CPF</th><th>Nome do Vendedor</th></tr>";
		while ($tabela = $query->fetch_assoc()) {
			echo "<tr><td align='center'>$tabela[idvend]</td>
			<td align='center'>$tabela[cpfvend]</td>
			<td align='center'>$tabela[nomevend]</td></tr>";
		}
		echo "</table>";
	}
	?>
	<a href='vendedores.php'>Voltar</a>
</body>
</html>
