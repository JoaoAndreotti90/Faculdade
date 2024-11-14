<?php  
	$domain="localhost";	// localização
	$user="root";			// usuário
	$password="";			// senha
	$database="lojafib";	// banco de dados	

	$mysqli = new mysqli($domain,$user,$password,$database);

	if($mysqli->connect_errno){

		echo "Não foi possível conectar com o banco de dados ";
		echo $mysqli->connect_error; // mostra causa do erro
	}
?>