<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Alterar Cliente</title>
</head>
<body>
    <?php
    require("../conecta.php");

    // Verifica se um ID de cliente foi passado
    if (isset($_GET["idcli"])) {
        $idcli = intval($_GET["idcli"]);
        $stmt = $mysqli->prepare("SELECT * FROM tb_clientes WHERE idcli = ?");
        $stmt->bind_param("i", $idcli);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            $cliente = $resultado->fetch_assoc();
        } else {
            echo "Cliente não encontrado.";
            exit;
        }
    }
    ?>

    <h2>Alterar Cliente</h2>
    <form method="POST" action="altcli.php?idcli=<?php echo $cliente['idcli']; ?>">
        CPF: <input type="text" name="cpfcli" maxlength="20" value="<?php echo $cliente['cpfcli']; ?>" required>
        <br/><br/>
        Nome do Cliente: <input type="text" name="nomecli" maxlength="50" value="<?php echo $cliente['nomecli']; ?>" required>
        <br/><br/>
        Endereço: <input type="text" name="endereco" maxlength="100" value="<?php echo $cliente['endereco']; ?>" required>
        <br/><br/>
        Cidade: <input type="text" name="cidade" maxlength="50" value="<?php echo $cliente['cidade']; ?>" required>
        <br/><br/>
        Telefone: <input type="text" name="telefone" maxlength="15" value="<?php echo $cliente['telefone']; ?>" required>
        <br/><br/>
        <input type="submit" value="Salvar" name="botao">
    </form>

    <?php
    if (isset($_POST["botao"])) {
        $cpfcli = htmlentities($_POST["cpfcli"]);	
        $nomecli = htmlentities($_POST["nomecli"]);
        $endereco = htmlentities($_POST["endereco"]);
        $cidade = htmlentities($_POST["cidade"]);
        $telefone = htmlentities($_POST["telefone"]);

        // Atualiza o cliente no banco de dados
        $stmt = $mysqli->prepare("UPDATE tb_clientes SET cpfcli=?, nomecli=?, endereco=?, cidade=?, telefone=? WHERE idcli=?");
        $stmt->bind_param("sssssi", $cpfcli, $nomecli, $endereco, $cidade, $telefone, $idcli);
        $stmt->execute();

        if ($stmt->error) {
            echo "Erro ao alterar: " . $stmt->error;
        } else {
            echo "Cliente alterado com sucesso!";
            echo "<br /><a href='clientes.php'>Voltar</a>";
        }

        $stmt->close();
        $mysqli->close();
    }
    ?>
</body>
</html>
