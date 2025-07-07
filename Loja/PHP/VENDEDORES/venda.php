<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Venda de Produtos</title>
</head>
<body>
    <h1>Venda de Produtos</h1>
    <form method="POST" action="venda.php">
        <h2>Dados do Cliente</h2>
        Nome: <input type="text" name="nome" required><br/>
        Celular: <input type="text" name="celular" required><br/>
        Email: <input type="email" name="email" required><br/><br/>

        <h2>Produtos</h2>
        Nome do Produto 1: <input type="text" name="produto1" required><br/>
        Preço do Produto 1: <input type="number" name="preco1" required><br/>
        Quantidade do Produto 1: <input type="number" name="quantidade1" required><br/><br/>

        Nome do Produto 2: <input type="text" name="produto2" required><br/>
        Preço do Produto 2: <input type="number" name="preco2" required><br/>
        Quantidade do Produto 2: <input type="number" name="quantidade2" required><br/><br/>

        Nome do Produto 3: <input type="text" name="produto3" required><br/>
        Preço do Produto 3: <input type="number" name="preco3" required><br/>
        Quantidade do Produto 3: <input type="number" name="quantidade3" required><br/><br/>

        <h2>Frete</h2>
        <select name="frete" required>
            <option value="10">Frete Normal - R$10</option>
            <option value="20">Frete Expresso - R$20</option>
            <option value="30">Frete Internacional - R$30</option>
        </select><br/><br/>

        <input type="submit" value="Finalizar Venda">
    </form>

    <?php 
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        require("conecta.php");

        // Captura os dados do formulário
        $nome = htmlentities($_POST["nome"]);
        $celular = htmlentities($_POST["celular"]);
        $email = htmlentities($_POST["email"]);

        // Captura dados dos produtos
        $produtos = [];
        for ($i = 1; $i <= 3; $i++) {
            $produto = htmlentities($_POST["produto$i"]);
            $preco = htmlentities($_POST["preco$i"]);
            $quantidade = htmlentities($_POST["quantidade$i"]);
            $produtos[] = [
                'nome' => $produto,
                'preco' => $preco,
                'quantidade' => $quantidade,
                'total' => $preco * $quantidade
            ];
        }

        // Captura o valor do frete
        $frete = htmlentities($_POST["frete"]);
        
        // Calcula o total da compra
        $totalCompra = array_sum(array_column($produtos, 'total')) + $frete;

        // Exibe todos os dados da compra
        echo "<h2>Resumo da Compra</h2>";
        echo "Nome: $nome<br/>";
        echo "Celular: $celular<br/>";
        echo "Email: $email<br/><br/>";
        
        echo "<h3>Produtos:</h3>";
        foreach ($produtos as $index => $produto) {
            echo "Produto " . ($index + 1) . ": " . $produto['nome'] . "<br/>";
            echo "Preço: R$" . number_format($produto['preco'], 2, ',', '.') . "<br/>";
            echo "Quantidade: " . $produto['quantidade'] . "<br/>";
            echo "Total: R$" . number_format($produto['total'], 2, ',', '.') . "<br/><br/>";
        }

        echo "Frete: R$" . number_format($frete, 2, ',', '.') . "<br/>";
        echo "Total da Compra: R$" . number_format($totalCompra, 2, ',', '.') . "<br/><br/>";

        // Grava os dados na tabela vendas
        $stmt = $mysqli->prepare("INSERT INTO tb_vendas (nome, celular, email, total_compra) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssd", $nome, $celular, $email, $totalCompra);
        $stmt->execute();
        
        if ($stmt->error) {
            echo "Erro ao registrar a venda: " . $stmt->error;
        } else {
            echo "Venda registrada com sucesso!";
        }
        
        $stmt->close();
        $mysqli->close();
    }
    ?>
    <br/>
    <a href="../index.php">Voltar</a>
</body>
</html>