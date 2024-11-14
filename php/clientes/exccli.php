<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Excluir Cliente</title>
</head>
<body>
    <?php
    require("../conecta.php");

    // Verifica se um ID de cliente foi passado
    if (isset($_GET["idcli"])) {
        $idcli = intval($_GET["idcli"]);

        // Exclui o cliente do banco de dados
        $stmt = $mysqli->prepare("DELETE FROM tb_clientes WHERE idcli = ?");
        $stmt->bind_param("i", $idcli);
        $stmt->execute();

        if ($stmt->error) {
            echo "Erro ao excluir: " . $stmt->error;
        } else {
            echo "Cliente excluído com sucesso!";
            echo "<br /><a href='clientes.php'>Voltar</a>";
        }

        $stmt->close();
        $mysqli->close();
    } else {
        echo "ID do cliente não fornecido.";
    }
    ?>
</body>
</html>
