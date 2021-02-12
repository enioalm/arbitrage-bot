
const Biscoint = require('biscoint-api-node');
const _ = require('lodash');
const player = require('play-sound');
var fs = require('fs');

const path = require('path');
let config = require('../config.js')

// lendo as configurações do arquivo config.jason
let { apiKey, apiSecret, amount, amountCurrency, amountBtc, amountCripto, initialBuy, minProfitPercent, intervalSeconds, playSound, simulation, executeMissedSecondLeg } = config

// variaveis Globais 
let bc, lastTrade = 0, isQuote, balances, recompra = false;



// Inicializa o objeto para conectar a API..
const init = () => {

    if (!apiKey) {
        handleMessage('Você deve especificar "apiKey" em config.json', 'error', true);
    }
    if (!apiSecret) {
        handleMessage('Você deve especificar "apiSecret" em config.json', 'error', true);
    }
    amountCripto = _.toUpper(amountCripto);
    amountCurrency = _.toUpper(amountCurrency);

    
    if (!['BRL', 'BTC'].includes(amountCurrency)) {
        handleMessage('"amountCurrency" Deve ser "BRL" or "BTC". Verifique seu arquivo config.json.', 'error', true);
    }

    if (isNaN(amount)) {
        handleMessage(`Montante inválido "${amount}. Especifique um valor válido em config.json`, 'error', true);
    }

    isQuote = amountCurrency === 'BRL';

    bc = new Biscoint({
        apiKey: config.apiKey,
        apiSecret: config.apiSecret
    });
};

// Verifica se o saldo necessário para a primeira operação é suficiente para o 'amount' configurado.
const checkBalances = async () => {
    isQuote = amountCurrency === 'BRL';
    balances = await bc.balance();
    const { BRL, BTC } = balances;

    handleMessage(`Saldos:  BRL: ${BRL} - BTC: ${BTC} `);

    const nAmount = Number(amount);
    let amountBalance = isQuote ? BRL : BTC;
    if (nAmount > Number(amountBalance)) {
        handleMessage(
            `Montante ${amount} é maior que o do usuário ${isQuote ? 'BRL' : 'BTC'} Saldo de ${amountBalance}`,
            'error',
            true,
        );
    }
    
};

//Atualiza seu saldo com os Biticoins comprados na ultima arbitragem
const atualizaBalances = async () => {
    isQuote = amountCripto === 'BTC';
    balances = await bc.balance();
    const { BRL, BTC } = balances;

    handleMessage(`Saldos:  BRL: ${BRL} - BTC: ${BTC} `);
    const mAmount = Number(amountBtc);
    let amountBalanceNew = isQuote ? BTC : BRL;

    if (mAmount > Number(amountBalanceNew)) {
        handleMessage(
            `Montante ${amountBtc} é maior que o do usuário ${isQuote ? 'BRL' : 'BTC'} Saldo de ${amountBalanceNew}`);
    }
    
};

// Verifica se o intervalo configurado está dentro do limite de taxa permitido..
const checkInterval = async () => {
    const { endpoints } = await bc.meta();
    const { windowMs, maxRequests } = endpoints.offer.post.rateLimit;
    handleMessage(`Limites de taxa de oferta: ${maxRequests} pedido por ${windowMs}ms.`);
    let minInterval = 2.0 * parseFloat(windowMs) / parseFloat(maxRequests) / 1000.0;

    if (!intervalSeconds) {
        intervalSeconds = minInterval;
        handleMessage(`Definindo o intervalo para ${intervalSeconds}s`);
    } else if (intervalSeconds < minInterval) {
        handleMessage(`Intervalo muito pequeno (${intervalSeconds}s). Deve ser maior que ${minInterval.toFixed(1)}s`, 'error', true);
    }
};

let tradeCycleCount = 0;

// Executa um ciclo de arbitragem.
async function tradeCycle() {
    let startedAt = 0;
    let finishedAt = 0;

    tradeCycleCount += 1;
    const tradeCycleStartedAt = Date.now();

    handleMessage(`[${tradeCycleCount}] Ciclo Trade  iniciado...`);

    try {

        startedAt = Date.now();

        const buyOffer = await bc.offer({
            amount,
            isQuote,
            op: 'buy',
        });

        finishedAt = Date.now();

        handleMessage(`[${tradeCycleCount}] Oferta de compra: ${buyOffer.efPrice} (${finishedAt - startedAt} ms)`);

        startedAt = Date.now();

        const sellOffer = await bc.offer({
            amount,
            isQuote,
            op: 'sell',
        });

        finishedAt = Date.now();

        handleMessage(`[${tradeCycleCount}] Oferta de venda obtida: ${sellOffer.efPrice} (${finishedAt - startedAt} ms)`);

        const profit = percent(buyOffer.efPrice, sellOffer.efPrice);
        handleMessage(`[${tradeCycleCount}] Lucro calculado: ${profit.toFixed(3)}%`);
        if (
            profit >= minProfitPercent
        ) {
            let firstOffer, secondOffer, firstLeg, secondLeg;
            try {
                if (initialBuy) {
                    firstOffer = buyOffer;
                    secondOffer = sellOffer;
                } else {
                    firstOffer = sellOffer;
                    secondOffer = buyOffer;
                }

                startedAt = Date.now();

                if (simulation) {
                    handleMessage(`[${tradeCycleCount}] Executa arbitragem se o modo de simulação não estivesse habilitado`);
                } else {
                    firstLeg = await bc.confirmOffer({
                        offerId: firstOffer.offerId,
                    });

                    secondLeg = await bc.confirmOffer({
                        offerId: secondOffer.offerId,
                    });
                }

                finishedAt = Date.now();

                lastTrade = Date.now();

                handleMessage(`************************************************************************************`);
                handleMessage(`[${tradeCycleCount}] ***SUCESSO, LUCRO: + ${profit.toFixed(3)}% (${finishedAt - startedAt} ms)`);
                play();
                handleMessage(`************************************************************************************`);

                //Verifica se toda a arbitragem foi realizada e tenta vender os Bitcoins adquiridos
                //Melhorar esta funcao verificando como vende por bitcoin
                //         if(firstLeg && secondLeg){
                //           await atualizaBalances();
                //             if(recompra){
                //               const sellOfferBit  = await bc.offer({
                //                 amount,
                //                 isQuote,
                //                 op: 'sell',
                //               });
                //               secondLeg = sellOfferBit;
                //               await bc.confirmOffer({
                //                 offerId: secondLeg.offerId,
                //               });
                //               handleMessage(`[${tradeCycleCount}] Foi Vendido os Bitcoins adquiridos na Arbritagem: ${amount}`);
                //               await checkBalances();
                //             }
                //         }
            } catch (error) {
                handleMessage(`[${tradeCycleCount}] Erro ao confirmar oferta: ${error.error}`, 'error');
                console.error(error);

                if (firstLeg && !secondLeg) {
                    // provavelmente apenas uma etapa da arbitragem foi executada, temos que aceitar a perda e reequilibrar os fundos.
                    try {
                        // primeiro, garantimos que a perna não foi realmente executada
                        let secondOp = initialBuy ? 'sell' : 'buy';
                        const trades = await bc.trades({ op: secondOp });
                        if (_.find(trades, t => t.offerId === secondOffer.offerId)) {
                            handleMessage(`[${tradeCycleCount}] A segunda etapa foi executada apesar do erro. Bom!`);
                        } else if (!executeMissedSecondLeg) {
                            handleMessage(
                                `[${tradeCycleCount}] Apenas a primeira etapa da arbitragem foi executada, e a ` +
                                'executeMissedSecondLeg é falso, então não vamos executar a segunda etapa',
                            );
                        } else {
                            handleMessage(
                                `[${tradeCycleCount}] Apenas a primeira etapa da arbitragem foi executada. ` +
                                'Tentando executá-lo com uma possível perda.',
                            );
                            const sellOffer2 = await bc.offer({
                                amount,
                                isQuote,
                                op: secondOp,
                            });
                            handleMessage(`[${tradeCycleCount}]Nova Oferta de venda obtida: ${sellOffer2.efPrice} (${finishedAt - startedAt} ms)`);
                            secondLeg = sellOffer2;

                            await bc.confirmOffer({
                                offerId: secondLeg.offerId,
                            });
                            handleMessage(`[${tradeCycleCount}] A segunda Oferta de venda foi executada e o Boot foi normalizado`);
                            await start();
                        }
                    } catch (error) {
                        handleMessage(
                            `[${tradeCycleCount}] Erro Fatal. Incapaz de recuperar de uma arbitragem incompleta..`, 'fatal',
                        );
                        await sleep(500);
                        process.exit(1);
                    }
                }
            }
        }
    } catch (error) {
        handleMessage(`[${tradeCycleCount}] Erro ao obter oferta: ${error.error || error.message}`, 'error');
        console.error(error);
    }

    const tradeCycleFinishedAt = Date.now();
    const tradeCycleElapsedMs = parseFloat(tradeCycleFinishedAt - tradeCycleStartedAt);
    const shouldWaitMs = Math.max(Math.ceil((intervalSeconds * 1000.0) - tradeCycleElapsedMs), 0);

    //handleMessage(`[${cycleCount}] Ciclo levou ${tradeCycleElapsedMs} ms`);

    //handleMessage(`[${cycleCount}] Novo ciclo em ${shouldWaitMs} ms...`);

    setTimeout(tradeCycle, shouldWaitMs);
}

// Inicia a negociação, programando negociações para acontecer a cada 'intervalSeconds' segundos..
const startTrading = async () => {
    handleMessage('Negociações iniciais');
    tradeCycle();
};

// -- FUNÇÕES DE UTILIDADE --



async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve(), ms));
}

function percent(value1, value2) {
    return (Number(value2) / Number(value1) - 1) * 100;
}

function percentSoma(porcentagem, amount) {
    let total = (Number(porcentagem) * Number(amount)) / 100;
    return Number((total) + Number(amount));
}

function handleMessage(message, level = 'info', throwError = false) {
    console.log(`${new Date().toISOString()} [ARBITRAGEM BOT] [${level}] - ${message}`);

    var txtPrices = JSON.stringify(`${new Date().toISOString()} - ${message}`);
    fs.appendFile('lastFetchedData.txt', txtPrices + "\n", 'utf-8', function (err) {
        if (err) throw err;
        // console.log('The file has been saved!');
    })


    if (throwError) {
        throw new Error(message);
    }
}




const sound = playSound && player();

const play = () => {
    if (playSound) {
        sound.play('./tone.mp3', (err) => {
            if (err) console.log(`Não foi possível reproduzir o som: ${err}`);
        });
    }
};

// executa a inicialização, verifica e inicia os ciclos de negociação.
async function start() {
    init();
    await checkBalances();
    await checkInterval();
    await startTrading();
}

start().catch(e => handleMessage(JSON.stringify(e), 'error'));
