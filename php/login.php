<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<h2>Login</h2>
	<form method="POST" action="login.php">
		Usuário: <input type="text" name="usuario" size="30 "maxlength="25" placeholder="digite o usuário">
		<br/>
		Senha: <input type="password" name="senha" size="20" maxlength="15" placeholder="digite a senha">		
		<input type="submit" value="pesquisar" name="botao">
	</form>

	<?php
	if(isset($_POST["botao"])){
    	require("conecta.php");
    	$usuario = $_POST["usuario"];
    	$senha = $_POST["senha"];


    	$stmt = $mysqli->prepare("SELECT * FROM usuarios WHERE usuario = ? AND senha = ?");
    	$stmt->bind_param("ss", $usuario, $senha);
    	$stmt->execute();

    	if ($stmt->error) {
        	die("Erro na consulta: " . $stmt->error);
    	}

    	$stmt->store_result();

    	if ($stmt->num_rows > 0){
        	header("Location: cadastro.php");
        	exit;
    	}
	}
	?>
</body>
</html>