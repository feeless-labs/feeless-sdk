/**
 * Example showing how to use Pools module to join pools.
 *
 * Run with:
 * yarn example ./examples/pools/join/join-with-tokens-in.ts
 */
import { BalancerSDK, Network ,PoolType} from '@feeless/sdk';
require('dotenv').config(); // Per caricare le variabili d'ambiente dal file .env
const { ethers } = require('ethers');

import {
  approveToken
} from 'examples/helpers';

async function initJoin() {
  const subgraphUrl = 'https://subgraph.feeless.finance/subgraphs/name/feeless-labs/feeless-v2';
  const balancer = new BalancerSDK({
    network: Network.MAINNET,
    rpcUrl: 'https://json-rpc.evm.testnet.iotaledger.net', // Using local fork for simulation
    customSubgraphUrl : subgraphUrl
  });

  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Chiave privata non trovata nella variabile d\'ambiente PRIVATE_KEY');
  }

  const { provider } = balancer;

  // Crea un wallet utilizzando la chiave privata e il provider
  const wallet = new ethers.Wallet(privateKey, provider);

  // Usa il wallet come signer
  const signer = wallet;

  // Recupera l'indirizzo associato al signer
  const address = await signer.getAddress();
  console.log(`Indirizzo del signer: ${address}`);

  const poolID = "0xff8e14b5a4be62434c7759d339a6e7c4a586ab31000200000000000000000004";

  // 20/80 WETH/WBTC Pool
  const pool = await balancer.pools.find(
    poolID
  );
  if (!pool) throw Error('Pool not found');


  // Tokens that will be provided to pool by joiner
  const tokensIn = [
    '0xd8058dA2dF3FBaBC03Ad8Ca51cAB4AAa3614B209', // WETH
    '0x553D8A5927FBA1c3eC05DdA667D6Cda3F5543d3a', // WBTC
  ];


  // Definisci i valori di input come numeri interi
const amountsInIntegers = [1, 1]; // Questi sono gli importi interi di base

// Definisci il numero di decimali che vuoi aggiungere (in questo caso 12 decimali)
const decimals = 12;

// Converti i numeri interi in valori adattati ai decimali
const amountsIn = amountsInIntegers.map(amount =>
  ethers.utils.parseUnits(amount.toString(), decimals)
);

  //await setTokenBalance(provider, address, tokensIn[0], amountsIn[0], slots[0]);
  //await setTokenBalance(provider, address, tokensIn[1], amountsIn[1], slots[1]);
  await approveToken(
    tokensIn[0],
    balancer.contracts.vault.address,
    amountsIn[0],
    signer
  );
  await approveToken(
    tokensIn[1],
    balancer.contracts.vault.address,
    amountsIn[1],
    signer
  );

  
  const weightedPoolFactory = balancer.pools.poolFactory.of(PoolType.Weighted);
 
  // Build initial join of pool
  const initJoinParams = weightedPoolFactory.buildInitJoin({
    joiner: address,
    poolId : poolID,
    poolAddress: pool.address,
    tokensIn: tokensIn,
    amountsIn: amountsIn
  });

 
  console.log('send transaction to": ' +  initJoinParams.to);
  console.log('vault adress": ' + balancer.contracts.vault.address);
  
  
   // Sending initial join transaction
   
   await signer.sendTransaction({
    to: initJoinParams.to,
    data: initJoinParams.data,
  });

  // Check that pool balances are as expected after join
  const tokens = await balancer.contracts.vault.getPoolTokens(poolID);
  console.log('Pool Tokens Addresses: ' + tokens.tokens);
  console.log('Pool Tokens balances: ' + tokens.balances);
  
  
}

initJoin();
