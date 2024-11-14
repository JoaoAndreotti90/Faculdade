<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cadastro de Vendedores</title>
</head>
<body>
    <h2>Cadastro de Vendedores</h2>
    <a href="advend.php"><button>Adicionar</button></a>
    <a href="pesqvend.php"><button>Pesquisar</button></a>
    <br />
    <table border="1" width="400">
        <tr>
            <th>Id</th>
            <th>CPF</th>
            <th>Nome</th>
            <th>Ação</th>
        </tr>
        
        <?php 
            require("../conecta.php");
            $query = $mysqli->query("SELECT * FROM tb_vendedores");
            echo $mysqli->error;

            while ($tabela = $query->fetch_assoc()) {
                echo "
                <tr>
                    <td align='center'>{$tabela['idvend']}</td>
                    <td align='center'>{$tabela['cpfvend']}</td>
                    <td align='center'>{$tabela['nomevend']}</td>
                    <td width='120'>
                        <a href='excvend.php?excluir={$tabela['idvend']}'>[excluir]</a>
                        <a href='altvend.php?alterar={$tabela['idvend']}'>[alterar]</a>
                    </td>
                </tr>
                ";
            }
        ?>
    </table>
</body>
</html>
