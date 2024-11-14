<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cadastrar Vendedor</title>
</head>
<body>
    <h2>Cadastrar Vendedor</h2>
    <form method="POST" action="advend.php">
        CPF: <input type="text" name="cpfvend" maxlength="20" placeholder="digite o CPF" required>
        <br/><br/>
        Nome do Vendedor: <input type="text" name="nomevend" maxlength="50" placeholder="digite o nome" required>
        <br/><br/>
        <input type="submit" value="Salvar" name="botao">
    </form>

    <?php 
    if (isset($_POST["botao"])) {
        require("../conecta.php");

        $cpfvend = htmlentities($_POST["cpfvend"]);    
        $nomevend = htmlentities($_POST["nomevend"]);

        if (!empty($cpfvend) && !empty($nomevend)) {
            $stmt = $mysqli->prepare("INSERT INTO tb_vendedores (cpfvend, nomevend) VALUES (?, ?)");
            $stmt->bind_param("ss", $cpfvend, $nomevend);
            $stmt->execute();

            if ($stmt->error) {
                echo "Erro ao inserir: " . $stmt->error;
            } else {
                echo "<br />Vendedor inserido com sucesso!<br /><br />";
                echo "<a href='vendedores.php'>Voltar</a>";
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
