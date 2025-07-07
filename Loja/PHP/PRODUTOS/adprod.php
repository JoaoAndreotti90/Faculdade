<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<h2>Adicionar Produto</h2>
	<form method="POST" action="adprod.php">
		Nome do Produto: <input type="text" name="nomeprod" maxlength="50" placeholder="Digite o nome">
		<br/><br/>
		Categoria: <input type="text" name="categoriaprod" maxlength="30" placeholder="Digite a categoria">
		<br/><br/>
		Preço: <input type="number" step="0.01" name="precoprod" placeholder="Digite o preço">
		<input type="submit" value="Salvar" name="botao">
	</form>
</body>
</html>

<?php 
if(isset($_POST["botao"])){
	require("../conecta.php");

	$nomeprod = htmlentities($_POST["nomeprod"]);
	$categoriaprod = htmlentities($_POST["categoriaprod"]);
	$precoprod = htmlentities($_POST["precoprod"]);

	$mysqli->query("INSERT INTO tb_produtos VALUES('', '$nomeprod', '$categoriaprod', '$precoprod')");
	echo $mysqli->error;

	if($mysqli->error == ""){
		echo "<br />Inserido com sucesso<br /><br />";
		echo "<a href='produtos.php'>Voltar</a>";
	}
}
?>