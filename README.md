<div align="center">

  <p>SquareCloud Backup é uma aplicação para realizar o backup de todos os seus apps da Square todos os dias!</p>

</div>

<br>

## Requisitos

- É necessário que você solicite o token da Square Cloud no site https://squarecloud.app/dashboard/account e coloque no arquivo de configuração config.json.

## config.json

Vamos editar o arquivo config.json

> Altere o valor do 'square_token' para a sua chave de api disponível em: https://squarecloud.app/dashboard/account

Clique em 'Solicitar chave de API', copie a chave e cole no seu arquivo config.json

```
{
    "square_token": "SEU_TOKEN_DA_SQUARE_CLOUD"
}
```

## squarecloud.app

Vamos criar seu arquivo, você pode seguir a documentação no site https://docs.squarecloud.app/suporte/como-hospedar

> Crie um novo arquivo na pasta raiz nome _squarecloud.app_, agora é necessário preencher informações do seu arquivo conforme o exemplo abaixo:

Copie, cole no seu arquivo squarecloud.app e modifique as informações

```
DISPLAY_NAME=SquareCloud Backup
#Aqui será o nome da sua aplicação, este dado você pode modificar

DESCRIPTION=Aplicação que cria Backups da SquareCloud para todos seus apps
# Aqui será a aplicação da sua aplicação, este dado você pode modificar

MAIN=app.js
# Aqui será o arquivo principal da aplicação, Esse dado não precisa modificar, pode mantê-lo assim

MEMORY=100
# Aqui será a quantidade de RAM da sua aplicação, Esse dado não precisa modificar, pode mantê-lo assim

VERSION=recommended
# Aqui será a versão para sua aplicação, Esse dado não precisa modificar, pode mantê-lo assim

START=npm run start
# Aqui será o comando para executar sua aplicação, Esse dado não precisa modificar, pode mantê-lo assim

```

Agora é só você hospedar o seu app na Square Cloud ou em qualquer outro site, que ele vai fazer um backup para você de todas suas aplicações.

> Todos os dados serão armazenados no arquivo database.sqlite3, você pode visualiza-lo de forma mais simples em: https://inloop.github.io/sqlite-viewer/
> Utilizamos o Sequelize para poder gravar os dados, então caso queira utilizar um banco de dados externo para poder armazena-los, é necessário apenas alterar o arquivo de conexão db/database.js
> Fica também a dica de uma DB SQL gratuita (com limites, é claro) caso queira realizar o backup na nuvem com ela: https://neon.tech/

## Configurando arquivo database.js para usar na neon.tech

> Modifique o arquivo db/database.js para poder se conectar a neon.tech :

Copie, cole no seu arquivo database.js e modifique as informações

``` javascript
const Sequelize = require('sequelize')

const sequelize = new Sequelize('NOME_DO_BANCO_DE_DADOS', 'NOME_DO_USUARIO', 'SENHA_DO_USUARIO', {
    host: 'ENDERECO_DA_HOST',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: { require: true }
    }
});

module.exports = sequelize
```
