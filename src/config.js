import fs from 'fs';
import _ from 'lodash';


const config = {
  apiKey: '',
  apiSecret: '',
  amount: 500,
  amountCurrency: 'BRL',
  amountBtc: 0.00100000,
  amountCripto: 'BTC',
  initialBuy: true,
  minProfitPercent: 0.02,
  // especifique null para permitir que o bot calcule o intervalo mínimo permitido
  intervalSeconds: null,
  playSound: false,
  simulation: false,
  executeMissedSecondLeg: true,
};

try {
  _.merge(config, JSON.parse(fs.readFileSync(
    `./config.json`,
  )));
} catch (err) {
  console.log('[INFO] Não foi possível ler o arquivo config.json.', err);
}

export default config;
