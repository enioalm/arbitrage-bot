# biscoint-arbitrage-bot

Implementação de referência que exemplifica o uso da biblioteca do Biscoint para NodeJS, [biscoint-api-node](https://github.com/Biscoint/biscoint-api-node), para verificar a existência de oportunidades de arbitragem e executá-las.

_**Não utilize esse código em produção para valores significativos!!**_

## Como funciona?

O Biscoint conecta você a várias corretoras. É normal que durante movimentos naturais do mercado o preço de compra em uma corretora seja mais barato que o preço de venda em outra, gerando assim uma oportunidade de fazer o que chamamos de arbitragem.

Arbitragem é a ação de comprar mais barato em uma corretora e vender mais caro outra. Descontando as taxas essa movimentação deve resultar em lucro para o operador.

Tendo em vista a facilidade em se conectar a várias corretoras e utilizando a API de negociações do Biscoint, escrevemos esse pequeno código para exemplificar o uso de nosso wrapper para NodeJS junto com um algorítmo simples e **somente para testes** de arbitragem.

É importante ressaltar que este código não deve ser usado com valores altos, já que se trata meramente de um exemplo de como usar a biblioteca para NodeJS do Biscoint.

## Rodando

##  Como configurar o robô

Para configurar você deve alterar o arquivo `config.js` como mostraremos a seguir:

`` `JavaScript
export default {
  apiKey :  " qw8e4q6 " ,
  apiSecret :  " d8fg9d " ,
  montante :  0,015 ,
  profitCurrency :  " BRL " ,
  initialBuy :  true ,
  minProfitPercent :  0,01
};


###  Requisitos

* Você precisará instalar o [ docker ] (https://docs.docker.com/). Para instalar, você pode seguir a [ documentação ] oficial (https://docs.docker.com/engine/install/ubuntu/).
* Você deve ter uma conta verificada no [ Biscoint ] (https://biscoint.io/quick-register) para criar as credenciais para poder interagir com a API.
* Instale o [ git ] (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) se não o tiver.

### Go Clone 

Clone o projeto executando o seguinte comando:

`git clone https: // github.com / Biscoint / biscoint-arbitrage-bot.git`

###  Crie as chaves de acesso

Acesse a [ interface para obter as chaves do Biscoint ] (https://biscoint.io/dashboard/API). Caso o menu "API" não apareça, peça ao [ suporte ] (https://biscoint.io/support) para ativar a criação das chaves de sua conta.

Para configurar, você precisará fornecer os valores abaixo usando variáveis ​​de ambiente:


Explicando cada item de configuração:

-  ** apiKey ** - aqui você deve preencher sua chave de API gerada em Biscoint
-  ** apiSecret ** - aqui você deve preencher sua chave secreta gerada em Biscoint
-  ** valor ** - aqui você deve inserir o valor que deseja arbitrar, por padrão você arbitrará 0,015 BTC para ganhar reais
-  ** profitCurrency ** - por padrão aqui será BRL, ou seja, você irá arbitrar para aumentar seu saldo em reais
-  ** initialBuy ** - no exemplo, o robô sempre começa a comprar porque está definido aqui como "verdadeiro"
-  ** minProfitPercent ** - aqui está o mínimo que a arbitragem deve fornecer lucro para o robô executá-la
-  ** valor ** - opcional - aqui você deve inserir o valor que deseja arbitrar, por padrão você arbitrará 0,015 BTC para ganhar reais
-  ** amountCurrency ** - opcional - fornecer a moeda, ` 'BRL'` ou `' BTC'` , que é definido o parâmetro `montante- .
-  ** initialBuy ** - opcional - no exemplo, o robô sempre começa a comprar porque está definido aqui como "verdadeiro"
-  ** minProfitPercent ** - opcional - aqui é o mínimo que a arbitragem deve fornecer lucro para o robô executá-la
Exemplo, usando   `0,01` para que a arbitragem de execução do robô seja maior que 0,01%.
Valor padrão: `0,02` .
-  ** intervalSeconds ** - opcional -O intervalo em segundos entre a verificação de oportunidades.
Use `null` para o robô usar o menos tempo disponível permitido pela API.
Valor padrão: `null` .
-  ** playSound ** - opcional - Use `true` para tocar um som cada vez que ocorrer uma arbitragem.
Valor padrão: `false` .
-  ** simulação ** - opcional - Use `true` para executar como modo de verificação.
Valor padrão: `false` .
-  ** executeMissedSecondLeg ** - opcional - Use `true` para que o robô tente novamente a arbitragem mesmo com perda quando a primeira etapa é executada e falha na segunda.
Valor padrão: `true` .

Você pode deixar tudo como está e apenas fornecer sua chave e seu segredo e o robô tentará fazer qualquer arbitragem que fique acima de 0,01% de lucro, tentando aumentar seu saldo em reais e sempre começar com uma oferta de compra de 0,015 BTC.

### Running 

Dentro da pasta do projeto, construa a imagem com o comando abaixo:

`docker build -t bistcoin: mais recente .`

Substitua os valores abaixo pelas suas chaves e execute-o:

Deixando tudo como está, apenas trocando sua chave e seu segredo, o robô tentará fazer qualquer arbitragem que fique acima de 0,01% de lucro, tentando aumentar seu saldo em reais e sempre partindo de uma oferta de compra de 0,015 BTC.
`docker run -itd -e apiKey = XXXXXX -e apiSecret = XXXXXX bistcoin: mais recente`

## Rodando

### Pré-requisitos
* Você precisa ter o NodeJS e o NPM instalados. Para instalá-los, recomendamos usar o [nvm](https://github.com/nvm-sh/nvm) no Linux/MacOS ou o [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) no Windows. Recomendamos NodeJS 12 ou superior.
* Você precisa ter o [docker](https://docs.docker.com/) instalado. Para instalar, recomendamos usar a documentação [oficial](https://docs.docker.com/engine/install/ubuntu/).
* Será necessária uma conta verificada no [Biscoint](https://biscoint.io/quick-register) para gerar as chaves de API.
* Instale o [ git ] (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

###Baixe o projeto 
### Go Clone 

##### Método 1: Baixe e extraia

Baixe o [arquivo compactado](https://github.com/Biscoint/biscoint-arbitrage-bot/archive/master.zip) deste projeto, e extraia-o em uma pasta à sua escolha, usando o descompactador de arquivos de sua preferência.

##### Método 2: Git clone

Se você tem o git instalado, vá até a linha de comando e execute:
Clone o projeto com comabaixo abaixo:

`git clone https: // github.com / Biscoint / biscoint-arbitrage-bot.git`

@@ -40,20 +35,7 @@ Não feche o popup com a chave e o segredo, eles não serão exibidos novamente.

### Configure 

Informe suas configurações num arquivo `config.json` localizado na raiz do projeto. Use como modelo o arquivo `config.template.json` (você pode criar 
uma cópia dele e renomear para `config.json`):

`` `JSON
{
  " apiKey " : " paste-your-api-key " ,
  " apiSecret " : " paste-your-api-key " ,
  " quantidade " : 100 ,
  " amountCurrency " : " BRL " ,
  " initialBuy " : verdadeiro ,
  " minProfitPercent " : 0,02 ,
  " intervalSeconds " : null
}

Informe suas configurações passando como variaveis de ambiente.

Explicando cada item da configuração:

@@ -76,7 +58,6 @@ Valor padrão: `0.02`.
Informe `null` para que o robô calcule o menor intervalo permitido pela API.
Valor padrão: `null`. 
- **playSound** - opcional - informe `true` para que o robô toque um som sempre que uma arbitragem for executada.
No Ubuntu, é necessário que o mplayer seja instalado com `sudo apt install mplayer`. Valor padrão: `false`.
- **simulation** - opcional - informe `true` para rodar em modo simulação, em que as operações de compra e venda não são de fato executadas.
Valor padrão: `false`.
- **executeMissedSecondLeg** - opcional - informe `true` para que o robô tente executar a segunda perna da arbitragem
@@ -87,12 +68,10 @@ em lucro maior que 0,02%, tentando aumentar seu saldo em bitcoins e sempre come

###  Vermelho

No terminal (ou prompt de comando, se estiver no Windows), vá até pasta raiz do projeto.

Antes de executar pela primeira vez, e sempre que atualizar o projeto, execute:
Dentro da pasta raiz do projeto `builde` a imagem com o comando abaixo:

` Altitude instalar `
` docker build -t bistcoin: o mais recente. `

Para executar o robô, execute o comando abaixo:
No terminal (ou prompt de comando, se estiver no Windows), substitua os valores abaixo com suas respectivas credenciais e execute:

` Início Asl '
` Janela de encaixe prazo -itd -e apiKey = XXXXXX -e apiSecret = XXXXXX bistcoin: mais recente `

Explicando cada item da configuração:

- **apiKey** - obrigatório - informe sua chave de api gerada no Biscoint.
- **apiSecret** - obrigatório - informe sua chave secreta gerada no Biscoint.
- **amount** - opcional - informe o valor das operações individuais de compra e venda, na moeda especificada no parâmetro `amountCurrency`.
 Por exemplo, se quer que as operações sejam de 100 reais, especifique `amount: 100` e `amountCurrency: 'BRL'`.
 Valor padrão: 100.
- **amountCurrency** - opcional - informe a moeda, `'BRL'` ou `'BTC'`, em que está especificada a quantidade (parâmetro `amount`).
Observe que o seu eventual lucro de arbitragem será acumulado na moeda oposta, ou seja, se especificar `'BRL'`, seu lucro
será acumulado em BTC, e se especificar `'BTC'`, seu lucro será acumulado em BRL.
Valor padrão: `'BRL'`. 
- **initialBuy** - opcional - informe `true` para que o robô execute primeiro compra e depois venda, `false` para que execute
primeiro venda depois compra. Se o seu saldo inicial está em reais, use `true`, se está em BTC, use `false`.
Valor padrão: `true`.
- **minProfitPercent** - informe o lucro mínimo potencial, em percentual, para que o robô tente executar a arbitragem.
Por exemplo, informe `0.01` para que o robô execute arbitragem sempre que o lucro potencial seja igual ou maior a 0,01%.
Valor padrão: `0.02`.
- **intervalSeconds** - opcional - o intervalo, em segundos, entre verificações de oportunidade de arbitragem.
Informe `null` para que o robô calcule o menor intervalo permitido pela API.
Valor padrão: `null`. 
- **playSound** - opcional - informe `true` para que o robô toque um som sempre que uma arbitragem for executada.
No Ubuntu, é necessário que o mplayer seja instalado com `sudo apt install mplayer`. Valor padrão: `false`.
- **simulation** - opcional - informe `true` para rodar em modo simulação, em que as operações de compra e venda não são de fato executadas.
Valor padrão: `false`.
- **executeMissedSecondLeg** - opcional - informe `true` para que o robô tente executar a segunda perna da arbitragem
mesmo com prejuízo, quando ocorrer da primeira perna ser executada e a segunda falhar. Valor padrão: `true`.

Deixando tudo como está, apenas substituindo sua chave e seu secret, o robô tentará executar toda arbitragem que resultar
em lucro maior que 0,02%, tentando aumentar seu saldo em bitcoins e sempre começando com uma oferta de compra de R$100,00.

### Rode

No terminal (ou prompt de comando, se estiver no Windows), vá até pasta raiz do projeto.

Antes de executar pela primeira vez, e sempre que atualizar o projeto, execute:

`npm install`

Para executar o robô, execute o comando abaixo:

`npm start`
