<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
	<h2>Cadastro de Produtos</h2>
	<a href="adprod.php"><button>Adicionar</button></a>
	<a href="pesqprod.php"><button>Pesquisar</button></a>
	<br />
	<table border="1" width="400">
		<tr>
			<th>Id</th>
			<th>Nome</th>
			<th>Categoria</th>
			<th>Preço</th>
			<th>Ação</th>
		</tr>
		
		<?php 
			require("../conecta.php");
			$query = $mysqli->query("SELECT * FROM tb_produtos");
			echo $mysqli->error;

			while ($tabela = $query->fetch_assoc()){
				echo "
				<tr><td align='center'>$tabela[idprod]</td>
				<td align='center'>$tabela[nomeprod]</td>
				<td align='center'>$tabela[categoriaprod]</td>
				<td align='center'>$tabela[precoprod]</td>
				<td width='120'><a href='excprod.php?excluir=$tabela[idprod]'>[excluir]</a>
				<a href='altprod.php?alterar=$tabela[idprod]'>[alterar]</a></td>
				</tr>
			"; }
		?>
	</table>
</body>
</html>