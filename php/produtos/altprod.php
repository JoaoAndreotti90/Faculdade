<?php 
require("../conecta.php");

$nomeprod = "";
$categoriaprod = "";
$precoprod = "";

if(isset($_GET["alterar"])){
	$idprod = htmlentities($_GET["alterar"]);
	$query = $mysqli->query("SELECT * FROM tb_produtos WHERE idprod = '$idprod'");
	$tabela = $query->fetch_assoc();
	$nomeprod = $tabela["nomeprod"];
	$categoriaprod = $tabela["categoriaprod"];
	$precoprod = $tabela["precoprod"];
}
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<form method="POST" action="altprod.php">
		<input type="hidden" name="idprod" value="<?php echo $idprod ?>">
		Nome: <input type="text" name="nomeprod" value="<?php echo $nomeprod ?>">
		<br/><br/>
		Categoria: <input type="text" name="categoriaprod" value="<?php echo $categoriaprod ?>">
		<br/><br/>
		Preço: <input type="number" step="0.01" name="precoprod" value="<?php echo $precoprod ?>">
		<input type="submit" value="Salvar" name="botao">
	</form>
	<a href="produtos.php">Voltar</a>
</body>
</html>

<?php 
if(isset($_POST["botao"])){
	$idprod = htmlentities($_POST["idprod"]);
	$nomeprod = htmlentities($_POST["nomeprod"]);
	$categoriaprod = htmlentities($_POST["categoriaprod"]);
	$precoprod = htmlentities($_POST["precoprod"]);

	$mysqli->query("UPDATE tb_produtos SET nomeprod = '$nomeprod', categoriaprod = '$categoriaprod', precoprod = '$precoprod' WHERE idprod = '$idprod'");
	echo $mysqli->error;

	if ($mysqli->error == ""){
		echo "Alterado com sucesso";
	}
}
?>
