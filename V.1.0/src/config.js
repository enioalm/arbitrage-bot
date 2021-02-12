//import fs from 'fs';
//import _ from 'lodash';

const _   = require('lodash');
var fs = require('fs');
//const path = require('path')
//const content = require ( path.resolve(__dirname, 'config.json'))

const config = {
  apiKey: '104c35de12c46f97124449fd5cd89fc023bcab55d119fda78c76877da05e7f8d',
  apiSecret: 'ec8f89d44b21856f879f877916905c808fadc081b7221995f0611e7388dd6788',
  amount: 50000,
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

// try {
//   _.merge(config, JSON.parse(fs.readFileSync(content,)));
//   } catch (err) {
//   console.log('[INFO] Não foi possível ler o arquivo config.json.', err);
//   }

 try {
   _.merge(config, JSON.parse(fs.readFileSync(
     `./config.json`,
   )));
 } catch (err) {
   console.log('[INFO] Não foi possível ler o arquivo config.json.', err);
 }


  

//export default config;
exports.default ={config};

