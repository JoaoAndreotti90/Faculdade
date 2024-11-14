<?php 
require("../conecta.php");

$cpfvend = "";
$nomevend = "";

if(isset($_GET["alterar"])){
	$idvend = htmlentities($_GET["alterar"]);
	$query = $mysqli->query("SELECT * FROM tb_vendedores WHERE idvend = '$idvend'");
	$tabela = $query->fetch_assoc();
	$cpfvend = $tabela["cpfvend"];		
	$nomevend = $tabela["nomevend"];
}
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<form method="POST" action="altvend.php">
		<input type="hidden" name="idvend" value="<?php echo $idvend ?>">
		CPF: <input type="text" name="cpfvend" value="<?php echo $cpfvend ?>">
		<br/><br/>			
		Nome: <input type="text" name="nomevend" value="<?php echo $nomevend ?>">
		<input type="submit" value="Salvar" name="botao">
	</form>
	<a href="vendedores.php">Voltar</a>
</body>
</html>

<?php 
if(isset($_POST["botao"])){
	$idvend = htmlentities($_POST["idvend"]);
	$cpfvend = htmlentities($_POST["cpfvend"]);
	$nomevend = htmlentities($_POST["nomevend"]);

	$mysqli->query("UPDATE tb_vendedores SET cpfvend = '$cpfvend', nomevend = '$nomevend' WHERE idvend = '$idvend'");
	echo $mysqli->error;

	if ($mysqli->error == ""){
		echo "Alterado com sucesso";
	}
}
?>
