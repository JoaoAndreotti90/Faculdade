<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cadastrar Cliente</title>
</head>
<body>
    <h2>Cadastrar Cliente</h2>
    <form method="POST" action="adcli.php">
        CPF: <input type="text" name="cpfcli" maxlength="20" placeholder="digite o cpf" required>
        <br/><br/>
        Nome do Cliente: <input type="text" name="nomecli" maxlength="50" placeholder="digite o nome" required>
        <br/><br/>
        Endereço: <input type="text" name="endereco" maxlength="100" placeholder="digite o endereço" required>
        <br/><br/>
        Cidade: <input type="text" name="cidade" maxlength="50" placeholder="digite a cidade" required>
        <br/><br/>
        Telefone: <input type="text" name="telefone" maxlength="15" placeholder="digite o telefone" required>
        <br/><br/>
        <input type="submit" value="Salvar" name="botao">
    </form>

    <?php 
    if (isset($_POST["botao"])) {
        require("../conecta.php");


        $cpfcli = htmlentities($_POST["cpfcli"]);    
        $nomecli = htmlentities($_POST["nomecli"]);
        $endereco = htmlentities($_POST["endereco"]);
        $cidade = htmlentities($_POST["cidade"]);
        $telefone = htmlentities($_POST["telefone"]);

        // Verifica se todos os campos foram preenchidos
        if (!empty($cpfcli) && !empty($nomecli) && !empty($endereco) && !empty($cidade) && !empty($telefone)) {
            // Grava os dados no banco de dados
            $stmt = $mysqli->prepare("INSERT INTO tb_clientes (cpfcli, nomecli, endereco, cidade, telefone) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $cpfcli, $nomecli, $endereco, $cidade, $telefone);
            $stmt->execute();

            if ($stmt->error) {
                echo "Erro ao inserir: " . $stmt->error;
            } else {
                echo "<br />Cliente inserido com sucesso!<br /><br />";
                echo "<a href='clientes.php'>Voltar</a>";
            }

            $stmt->close();
        } else {
            echo "Por favor, preencha todos os campos.";
        }
        
        $mysqli->close();
    }
    ?>
</body>
</html>
