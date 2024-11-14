<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pesquisar Cliente</title>
</head>
<body>
    <h2>Pesquisar Cliente</h2>
    <form method="POST" action="pesqcli.php">
        Nome do Cliente: <input type="text" name="nomecli" maxlength="50" placeholder="digite o nome">
        <input type="submit" value="Pesquisar" name="botao">
    </form>

    <?php
    if (isset($_POST["botao"])) {
        require("../conecta.php");
        $nomecli = htmlentities($_POST["nomecli"]);

        $stmt = $mysqli->prepare("SELECT * FROM tb_clientes WHERE nomecli LIKE ?");
        $nomecli_param = "%$nomecli%"; // Para pesquisa parcial
        $stmt->bind_param("s", $nomecli_param);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            echo "<h3>Resultados:</h3>";
            echo "<table border='1'><tr><th>ID</th><th>CPF</th><th>Nome</th><th>Endereço</th><th>Cidade</th><th>Telefone</th><th>Ações</th></tr>";
            while ($cliente = $resultado->fetch_assoc()) {
                echo "<tr>
                        <td>{$cliente['idcli']}</td>
                        <td>{$cliente['cpfcli']}</td>
                        <td>{$cliente['nomecli']}</td>
                        <td>{$cliente['endereco']}</td>
                        <td>{$cliente['cidade']}</td>
                        <td>{$cliente['telefone']}</td>
                        <td>
                            <a href='altcli.php?idcli={$cliente['idcli']}'>Alterar</a> | 
                            <a href='exccli.php?idcli={$cliente['idcli']}'>Excluir</a>
                        </td>
                      </tr>";
            }
            echo "</table>";
        } else {
            echo "Nenhum cliente encontrado.";
        }

        $stmt->close();
        $mysqli->close();
    }
    ?>
</body>
</html>
